import { NextRequest, NextResponse } from 'next/server';
import { compressionQueue } from '@/lib/queue';
import { writeFile } from 'fs/promises';
import path from 'path';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const level = formData.get('level') as string || 'recommended';

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (file.type !== 'application/pdf') {
      return NextResponse.json({ error: 'Only PDF files are supported' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const tempFileName = `${crypto.randomUUID()}.pdf`;
    const tempFilePath = path.join('/tmp', tempFileName);

    // Save uploaded file temporarily for the worker to process
    await writeFile(tempFilePath, buffer);

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
  } catch (error) {
    console.error('Failed to enqueue compression job:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
