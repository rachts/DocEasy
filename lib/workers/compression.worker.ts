import { Worker, Job } from 'bullmq';
import { COMPRESSION_QUEUE_NAME } from '../queue';
import { compressionService, CompressionLevel } from '../services/compression.service';
import { uploadFileToSupabase } from '../supabase/helpers';
import fs from 'fs/promises';
import path from 'path';
import IORedis from 'ioredis';

interface CompressionJobData {
  filePath: string;
  originalFileName: string;
  level: CompressionLevel;
  userId?: string;
}

const connection = new IORedis(process.env.REDIS_URL || 'redis://localhost:6379', {
  maxRetriesPerRequest: null,
});

export const compressionWorker = new Worker<CompressionJobData>(
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

      // Clean up temp files
      await fs.rm(filePath).catch(() => {});
      await fs.rm(outputPath).catch(() => {});

      await job.updateProgress(100);

      return {
        url: publicUrl,
        storagePath,
        originalSize: originalStat.size,
        compressedSize: compressedStat.size,
      };
    } catch (error) {
      console.error(`Job ${job.id} failed:`, error);
      throw error;
    }
  },
  { connection }
);

compressionWorker.on('completed', (job) => {
  console.log(`Job ${job.id} has completed!`);
});

compressionWorker.on('failed', (job, err) => {
  console.error(`Job ${job?.id} has failed with ${err.message}`);
});
