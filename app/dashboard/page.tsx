import React from 'react'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { Sidebar } from '@/components/Sidebar'
import { FileRow } from '@/components/FileRow'
import { UploadZone } from '@/components/UploadZone'
import { ProgressBar } from '@/components/ProgressBar'
import { DashboardClient } from './dashboard-client'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // If user is not authenticated, we allow exploring the dashboard or we can let them use it locally
  const userEmail = user?.email || 'Guest'

  let files: any[] = []
  if (user) {
    const { data } = await supabase
      .from('files')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(10)
    files = data || []
  }

  return (
    <div className="min-h-screen bg-[#0C0A09] text-[#FAFAF9] font-sans flex antialiased">
      {/* Pinned Top Progress Bar */}
      <ProgressBar active={false} />

      {/* 240px Fixed Industrial Sidebar */}
      <Sidebar currentPath="/dashboard" />

      {/* Main Content Area */}
      <main className="w-full md:pl-[240px] flex flex-col min-h-screen">
        {/* Header */}
        <header className="w-full pt-12 px-8 md:px-16 pb-8 border-b border-[#292524]">
          <div className="font-mono text-[12px] uppercase tracking-[0.05em] text-[#57534E] mb-2 flex items-center gap-2">
            <span>SYSTEM</span>
            <span className="text-[#292524]">/</span>
            <span className="text-[#FAFAF9]">DASHBOARD</span>
          </div>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-medium tracking-tight text-[#FAFAF9]">
                Dashboard
              </h1>
              <p className="text-[14px] text-[#A8A29E] mt-1 font-mono">
                VAULT: {userEmail} • EPHEMERAL ISOLATION ACTIVE
              </p>
            </div>
          </div>
        </header>

        {/* Content Container */}
        <div className="px-8 md:px-16 py-10 flex-1 flex flex-col gap-10">
          <DashboardClient initialFiles={files} />
        </div>
      </main>
    </div>
  )
}
