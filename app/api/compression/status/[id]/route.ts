import { NextRequest, NextResponse } from 'next/server';
import { compressionQueue } from '@/lib/queue';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: jobId } = await params;
    if (!jobId) {
      return NextResponse.json({ error: 'Job ID is required' }, { status: 400 });
    }

    if (!compressionQueue) {
      return NextResponse.json({ error: 'Server engine queue unavailable' }, { status: 503 });
    }

    const job = await compressionQueue.getJob(jobId);

    if (!job) {
      return NextResponse.json({ error: 'Job not found or already cleaned up' }, { status: 404 });
    }

    const state = await job.getState();
    const progress = job.progress || 0;

    if (state === 'completed') {
      return NextResponse.json({
        state,
        progress: 100,
        result: job.returnvalue,
      });
    }

    if (state === 'failed') {
      // Return a 200 with failed state, so the client can handle it gracefully 
      // instead of a 500 error which breaks the polling loop unpredictably.
      return NextResponse.json({
        state,
        progress: 0,
        error: job.failedReason || 'Unknown error occurred during server compression.',
      });
    }

    return NextResponse.json({
      state,
      progress,
    });
  } catch (error: any) {
    console.error('Failed to fetch job status:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
