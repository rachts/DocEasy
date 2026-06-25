import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { fileId } = await request.json()

    if (!fileId) {
      return NextResponse.json({ error: 'File ID is required' }, { status: 400 })
    }

    // Insert job into ai_jobs
    const { data: job, error } = await supabase
      .from('ai_jobs')
      .insert({
        user_id: user.id,
        file_id: fileId,
        job_type: 'document_summarization',
        result: { status: 'processing' }
      })
      .select()
      .single()

    if (error) throw error

    // Here you would trigger an asynchronous job (e.g., BullMQ or serverless function)
    // For now, we simulate processing:

    return NextResponse.json({ success: true, jobId: job.id })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
