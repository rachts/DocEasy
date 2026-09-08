import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { Sidebar } from '@/components/Sidebar'
import { AnalyticsClient } from './analytics-client'

export const metadata = {
  title: 'Telemetry & Analytics | DocEasy',
  description: 'View execution analytics and byte reduction metrics.',
}

export default async function AnalyticsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch all user files to aggregate analytics
  const { data: files } = await supabase
    .from('files')
    .select('created_at, tool_used, original_size, processed_size')
    .eq('user_id', user.id)

  return (
    <div className="min-h-screen bg-[#0C0A09] text-[#FAFAF9] font-sans flex antialiased">
      <Sidebar currentPath="/dashboard" />

      <main className="w-full md:pl-[240px] flex flex-col min-h-screen">
        <header className="bg-[#141110] border-b border-[#292524] h-[56px] flex justify-between items-center px-8 md:px-16 sticky top-0 z-30">
          <div className="flex items-center gap-2 font-mono text-[12px] uppercase tracking-[0.05em]">
            <span className="text-[#57534E]">VAULT</span>
            <span className="text-[#292524]">/</span>
            <span className="text-[#FAFAF9]">TELEMETRY & INSIGHTS</span>
          </div>
        </header>

        <div className="p-8 md:p-16 max-w-6xl w-full mx-auto flex-1 flex flex-col gap-10">
          <div>
            <h1 className="text-4xl md:text-5xl font-medium tracking-tight text-[#FAFAF9]">
              Telemetry & Usage
            </h1>
            <p className="text-[15px] text-[#A8A29E] mt-2 max-w-2xl leading-relaxed">
              Execution frequency, payload volume, and cumulative bandwidth saved through client WebAssembly compression.
            </p>
          </div>

          <AnalyticsClient files={files || []} />
        </div>

        <footer className="bg-[#141110] border-t border-[#292524] w-full py-4 px-8 md:px-16 flex justify-between items-center mt-auto font-mono text-[11px] uppercase tracking-[0.05em] text-[#57534E]">
          <span className="text-[#FAFAF9] font-semibold tracking-normal font-sans">DocEasy</span>
          <span>© {new Date().getFullYear()} DocEasy. All rights reserved.</span>
        </footer>
      </main>
    </div>
  )
}
