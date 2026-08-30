import { NextRequest, NextResponse } from 'next/server';
import { readFile, rm, stat } from 'fs/promises';
import { compressionService } from '@/lib/services/compression.service';
import { uploadFileToSupabase } from '@/lib/supabase/helpers';
import path from 'path';
import crypto from 'crypto';
import os from 'os';
import { APIError, formatErrorResponse } from '@/lib/errors';
import { pipeline } from 'stream/promises';
import { createWriteStream } from 'fs';
import { Readable } from 'stream';

export async function POST(req: NextRequest) {
  let tempFilePath = '';
  let outputPath = '';
  let tempFilePathCreated = false;

  try {
    const contentLength = Number(req.headers.get('content-length') || '0');
    if (contentLength > 250 * 1024 * 1024) {
      throw new APIError('File is too large for the server engine (250MB limit).', 'FILE_TOO_LARGE', 413, true);
    }

    const formData = await req.formData().catch(() => {
      throw new APIError('Failed to parse form data. The file might be too large.', 'FILE_TOO_LARGE', 413, true);
    });

    const file = formData.get('file') as File;
    const level = (formData.get('level') as any) || 'recommended';

    if (!file) {
      throw new APIError('No file provided in the request.', 'INVALID_FILE', 400, false);
    }

    if (file.type !== 'application/pdf' && !file.name.endsWith('.pdf')) {
      throw new APIError('Only PDF files are supported.', 'INVALID_FILE', 400, false);
    }
    
    // Read magic bytes %PDF-
    const magicBytes = Buffer.from(await file.slice(0, 5).arrayBuffer()).toString('utf8');
    if (magicBytes !== '%PDF-') {
      throw new APIError('Invalid PDF file signature.', 'INVALID_PDF', 400, false);
    }

    const tempFileName = `${crypto.randomUUID()}.pdf`;
    tempFilePath = path.join(os.tmpdir(), tempFileName);
    outputPath = `${tempFilePath}-compressed.pdf`;

    // Stream uploaded file directly to disk to prevent OOM
    await pipeline(
      Readable.fromWeb(file.stream() as any),
      createWriteStream(tempFilePath)
    );
    tempFilePathCreated = true;

    // Execute compression & optimization
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
      message: 'File compressed successfully',
    });
  } catch (error: unknown) {
    const errorResponse = formatErrorResponse(error);
    return NextResponse.json(errorResponse, { status: errorResponse.status });
  } finally {
    if (tempFilePathCreated) {
      if (tempFilePath) await rm(tempFilePath, { force: true }).catch(() => {});
      if (outputPath) await rm(outputPath, { force: true }).catch(() => {});
    }
  }
}
