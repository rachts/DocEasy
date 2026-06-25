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

    // Save uploaded file temporarily
    await writeFile(tempFilePath, buffer);

    if (compressionQueue) {
      // Enqueue the job in BullMQ
      const job = await compressionQueue.add('compress-pdf', {
        filePath: tempFilePath,
        originalFileName: file.name,
        level,
      });

      return NextResponse.json({
        success: true,
        jobId: job.id,
        message: 'File added to compression queue',
      });
    } else {
      // Fallback to synchronous processing if no Redis/BullMQ
      const outputPath = `${tempFilePath}-compressed.pdf`;
      
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
      
      await rm(tempFilePath).catch(() => {});
      await rm(outputPath).catch(() => {});

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
  } catch (error: any) {
    console.error('Failed to compress file:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
