import { Worker, Job } from 'bullmq';
import { COMPRESSION_QUEUE_NAME } from '../queue';
import { compressionService, CompressionLevel } from '../services/compression.service';
import { uploadFileToSupabase } from '../supabase/helpers';
import fs from 'fs/promises';
import path from 'path';
import IORedis from 'ioredis';
import { APIError } from '../errors';

interface CompressionJobData {
  filePath: string;
  originalFileName: string;
  level: CompressionLevel;
  userId?: string;
}

const connection = process.env.REDIS_URL
  ? new IORedis(process.env.REDIS_URL, { maxRetriesPerRequest: null })
  : (null as any);

export const compressionWorker = connection
  ? new Worker<CompressionJobData>(
      COMPRESSION_QUEUE_NAME,
      async (job: Job) => {
        const { filePath, originalFileName, level } = job.data;
        
        // Output path for Ghostscript
        const outputPath = `${filePath}-compressed.pdf`;

        try {
          await job.updateProgress(10);
          
          // Step 1: Compress and linearize
          await compressionService.fullOptimize(filePath, outputPath, level);
          
          await job.updateProgress(60);

          // Step 2: Read the compressed file into memory
          const fileBuffer = await fs.readFile(outputPath);
          const blob = new Blob([fileBuffer], { type: 'application/pdf' });
          
          await job.updateProgress(80);

          // Step 3: Upload to Supabase Storage
          const { publicUrl, filePath: storagePath } = await uploadFileToSupabase(
            blob,
            originalFileName,
            'pdf-compressor'
          );
          
          await job.updateProgress(95);

          // Calculate savings
          const originalStat = await fs.stat(filePath);
          const compressedStat = await fs.stat(outputPath);

          await job.updateProgress(100);

          return {
            url: publicUrl,
            storagePath,
            originalSize: originalStat.size,
            compressedSize: compressedStat.size,
          };
        } catch (error: any) {
          console.error(`Job ${job.id} failed:`, error);
          if (error instanceof APIError) {
             throw new Error(`[${error.code}] ${error.message}`);
          }
          throw new Error(error?.message || 'Unknown compression failure');
        } finally {
          // Clean up temp files safely in all cases (success or failure)
          await fs.rm(filePath, { force: true }).catch(() => {});
          await fs.rm(outputPath, { force: true }).catch(() => {});
        }
      },
      { connection }
    )
  : (null as any);

if (compressionWorker) {
  compressionWorker.on('completed', (job: Job) => {
    console.log(`Job ${job.id} has completed!`);
  });

  compressionWorker.on('failed', (job: Job | undefined, err: Error) => {
    console.error(`Job ${job?.id} has failed with ${err.message}`);
  });
}
