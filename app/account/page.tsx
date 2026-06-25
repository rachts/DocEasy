import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { AccountForm } from './account-form'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default async function AccountPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return (
    <div className="min-h-screen bg-background text-foreground pb-24 font-sans selection:bg-primary/30">
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border/40 px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="p-2 hover:bg-muted rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <span className="font-bold text-lg tracking-tight">Account Settings</span>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <AccountForm user={user} profile={profile} />
      </main>
    </div>
  )
}
