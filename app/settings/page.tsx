import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { Sidebar } from '@/components/Sidebar'
import { SettingsClient } from './settings-client'

export default async function SettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const profile = user ? {
    email: user.email,
    id: user.id,
    full_name: user.user_metadata?.full_name || ''
  } : {
    email: 'guest@doceasy.local',
    id: 'guest',
    full_name: 'Guest User'
  }

  return (
    <div className="min-h-screen bg-[#0C0A09] text-[#FAFAF9] font-sans flex antialiased">
      <Sidebar currentPath="/settings" />

      <main className="w-full md:pl-[240px] flex flex-col min-h-screen">
        <header className="bg-[#141110] border-b border-[#292524] h-[56px] flex justify-between items-center px-8 md:px-16 sticky top-0 z-30">
          <div className="flex items-center gap-2 font-mono text-[12px] uppercase tracking-[0.05em]">
            <span className="text-[#57534E]">SYSTEM</span>
            <span className="text-[#292524]">/</span>
            <span className="text-[#FAFAF9]">SETTINGS & PREFERENCES</span>
          </div>
        </header>

        <div className="p-8 md:p-16 max-w-6xl w-full mx-auto flex-1 flex flex-col gap-10">
          <div>
            <h1 className="text-4xl md:text-5xl font-medium tracking-tight text-[#FAFAF9]">
              Settings
            </h1>
            <p className="text-[15px] text-[#A8A29E] mt-2 max-w-2xl leading-relaxed">
              Configure your workspace parameters, cryptographic isolation preferences, and session retention policies.
            </p>
          </div>

          <SettingsClient user={user} profile={profile} />
        </div>

        <footer className="bg-[#141110] border-t border-[#292524] w-full py-4 px-8 md:px-16 flex justify-between items-center mt-auto font-mono text-[11px] uppercase tracking-[0.05em] text-[#57534E]">
          <span className="text-[#FAFAF9] font-semibold tracking-normal font-sans">DocEasy</span>
          <span>© {new Date().getFullYear()} DocEasy. All rights reserved.</span>
        </footer>
      </main>
    </div>
  )
}
