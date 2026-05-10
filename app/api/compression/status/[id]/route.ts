import { NextRequest, NextResponse } from 'next/server';
import { compressionQueue } from '@/lib/queue';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const jobId = params.id;
    if (!jobId) {
      return NextResponse.json({ error: 'Job ID is required' }, { status: 400 });
    }

    const job = await compressionQueue.getJob(jobId);

    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    const state = await job.getState();
    const progress = job.progress;

    if (state === 'completed') {
      return NextResponse.json({
        state,
        progress: 100,
        result: job.returnvalue,
      });
    }

    if (state === 'failed') {
      return NextResponse.json({
        state,
        progress: 0,
        error: job.failedReason,
      }, { status: 500 });
    }

    return NextResponse.json({
      state,
      progress,
    });
  } catch (error) {
    console.error('Failed to fetch job status:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
