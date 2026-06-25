import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Bell, Cloud, Home, Grid as GridIcon, Folder, User, Zap, Merge, ArrowRight, Minimize2, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { RecentFilesWidget } from '@/components/dashboard/recent-files-widget'
import { FavoritesWidget } from '@/components/dashboard/favorites-widget'
import { ActivityTimeline } from '@/components/dashboard/activity-timeline'
import { StorageUsageCard } from '@/components/dashboard/storage-usage-card'
import { ProfileDropdown } from '@/components/dashboard/profile-dropdown'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const userInitial = user.email ? user.email[0].toUpperCase() : "D"
  const userName = user.email?.split('@')[0] || "User"

  return (
    <div className="min-h-screen bg-background text-foreground pb-24 font-sans selection:bg-primary/30">
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border/40 px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-[0_0_15px_rgba(var(--primary),0.5)]">
            <span className="font-bold text-primary-foreground text-sm">D</span>
          </div>
          <span className="font-bold text-lg tracking-tight">DocEasy</span>
        </div>
        <div className="flex items-center gap-4">
          <button className="relative p-2 text-muted-foreground hover:text-foreground transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary border-2 border-background"></span>
          </button>
          <ProfileDropdown userInitial={userInitial} userEmail={user.email || ""} />
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight mb-2">
              Welcome back, <span className="text-primary">{userName}</span>
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base leading-relaxed max-w-md">
              Your workspace is ready. Everything is running smoothly.
            </p>
          </div>
          <div className="flex gap-3 w-full sm:w-auto">
            <Link href="/tools" className="flex-1 sm:flex-none">
              <Button className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl shadow-[0_0_20px_rgba(var(--primary),0.3)] transition-all active:scale-[0.98]">
                <Zap className="w-4 h-4 mr-2" />
                New Action
              </Button>
            </Link>
            <Link href="/tools" className="flex-1 sm:flex-none">
              <Button variant="outline" className="w-full h-12 rounded-xl border-border bg-card/50 hover:bg-muted transition-all active:scale-[0.98]">
                Explore Tools
              </Button>
            </Link>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Storage & Quick Actions */}
          <div className="space-y-6 lg:col-span-1">
            <StorageUsageCard />

            <section>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-foreground">Quick Actions</h2>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { name: "Compress", icon: Minimize2, href: "/tools/compressor" },
                  { name: "Merge", icon: Merge, href: "/tools/pdf-merger" },
                  { name: "Convert", icon: Zap, href: "/tools/pdf-converter" },
                  { name: "Settings", icon: Settings, href: "/account" },
                ].map((action, i) => (
                  <Link key={i} href={action.href}>
                    <Card className="p-4 flex flex-col items-center justify-center text-center gap-3 bg-card/40 border-border/50 rounded-2xl hover:bg-secondary/50 hover:border-primary/30 transition-all cursor-pointer group active:scale-[0.98]">
                      <div className="p-3 rounded-full bg-secondary group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                        <action.icon className="w-5 h-5" />
                      </div>
                      <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground">{action.name}</span>
                    </Card>
                  </Link>
                ))}
              </div>
            </section>
          </div>

          {/* Right Column: Widgets */}
          <div className="space-y-6 lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <RecentFilesWidget />
              <FavoritesWidget />
            </div>
            <ActivityTimeline />
          </div>
        </div>
      </main>

      <nav className="fixed sm:hidden bottom-0 left-0 w-full z-50 pb-safe">
        <div className="bg-background/80 backdrop-blur-xl border-t border-border/50 px-6 py-3 flex justify-between items-center text-[10px] font-medium">
          <Link href="/" className="flex flex-col items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors">
            <Home className="w-5 h-5" />
            <span>Home</span>
          </Link>
          <Link href="/tools" className="flex flex-col items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors">
            <GridIcon className="w-5 h-5" />
            <span>Tools</span>
          </Link>
          <div className="flex flex-col items-center gap-1.5 text-primary">
            <Folder className="w-5 h-5" />
            <span>Files</span>
          </div>
          <Link href="/account" className="flex flex-col items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors">
            <User className="w-5 h-5" />
            <span>Account</span>
          </Link>
        </div>
      </nav>
    </div>
  )
}
