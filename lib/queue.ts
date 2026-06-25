import { Queue, Worker, QueueEvents } from 'bullmq';
import IORedis from 'ioredis';

const connection = process.env.REDIS_URL
  ? new IORedis(process.env.REDIS_URL, { maxRetriesPerRequest: null })
  : (null as any);

export const COMPRESSION_QUEUE_NAME = 'pdf-compression';

export const compressionQueue = connection 
  ? new Queue(COMPRESSION_QUEUE_NAME, {
      connection,
      defaultJobOptions: {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 1000,
        },
        removeOnComplete: true,
      },
    })
  : (null as any);

export const queueEvents = connection
  ? new QueueEvents(COMPRESSION_QUEUE_NAME, { connection })
  : (null as any);
