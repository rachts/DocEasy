import { NextRequest, NextResponse } from 'next/server';
import { compressionQueue } from '@/lib/queue';
import { writeFile, readFile, rm, stat } from 'fs/promises';
import { compressionService } from '@/lib/services/compression.service';
import { uploadFileToSupabase } from '@/lib/supabase/helpers';
import path from 'path';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const level = formData.get('level') as any || 'recommended';

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (file.type !== 'application/pdf') {
      return NextResponse.json({ error: 'Only PDF files are supported' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const tempFileName = `${crypto.randomUUID()}.pdf`;
    const tempFilePath = path.join('/tmp', tempFileName);
    const outputPath = `${tempFilePath}-compressed.pdf`;

    let isQueued = false;
    let tempFilePathCreated = false;

    try {
      // Save uploaded file temporarily
      await writeFile(tempFilePath, buffer);
      tempFilePathCreated = true;

    if (compressionQueue) {
      // Enqueue the job in BullMQ
      const job = await compressionQueue.add('compress-pdf', {
        filePath: tempFilePath,
        originalFileName: file.name,
        level,
      });
      isQueued = true;

      return NextResponse.json({
        success: true,
        jobId: job.id,
        message: 'File added to compression queue',
      });
    } else {
      // Fallback to synchronous processing if no Redis/BullMQ
      await compressionService.fullOptimize(tempFilePath, outputPath, level);
      
      const fileBuffer = await readFile(outputPath);
      const blob = new Blob([fileBuffer], { type: 'application/pdf' });
      
      const { publicUrl, filePath: storagePath } = await uploadFileToSupabase(
        blob,
        file.name,
        'pdf-compressor'
      );
      
      const originalStat = await stat(tempFilePath);
      const compressedStat = await stat(outputPath);

      return NextResponse.json({
        success: true,
        jobId: 'sync-job',
        result: {
          url: publicUrl,
          storagePath,
          originalSize: originalStat.size,
          compressedSize: compressedStat.size,
        },
        message: 'File compressed successfully (sync mode)',
      });
    }
  } finally {
      // Cleanup temp files if we're not passing them to the async queue
      if (tempFilePathCreated && !isQueued) {
        await rm(tempFilePath).catch(() => {});
        await rm(outputPath).catch(() => {});
      }
    }
  } catch (error: any) {
    console.error('Failed to compress file:', error);
    if (error.message === 'ENGINE_UNAVAILABLE') {
      return NextResponse.json({ error: 'ENGINE_UNAVAILABLE', fallbackToClient: true }, { status: 503 });
    }
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
