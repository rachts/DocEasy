"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { FileCard } from "@/components/file-card"
import { type StoredFile, getGuestFiles, deleteGuestFile } from "@/lib/storage-utils"
import { Footer } from "@/components/footer"
import { supabase } from "@/lib/supabase/client"
import { LayoutDashboard, Clock, Star, HardDrive, Trash2 } from "lucide-react"

export default function Dashboard() {
  const { user, loading: authLoading, logout } = useAuth()
  const router = useRouter()
  const [files, setFiles] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<"all" | "saved" | "recent">("all")
  const [stats, setStats] = useState({
    total: 0,
    saved: 0,
    recent: 0
  })

  useEffect(() => {
    if (!authLoading && user) {
      loadUserData()
    } else if (!authLoading && !user) {
      router.push("/login")
    }
  }, [authLoading, user])

  const loadUserData = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from("files")
        .select("*")
        .eq("user_id", user?.id)
        .order("created_at", { ascending: false })

      if (error) throw error
      
      const allFiles = data || []
      setFiles(allFiles)
      
      const saved = allFiles.filter(f => f.is_saved).length
      const recent = allFiles.slice(0, 5).length
      
      setStats({
        total: allFiles.length,
        saved,
        recent
      })
    } catch (error) {
      console.error("Failed to load dashboard data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from("files")
        .delete()
        .eq("id", id)

      if (error) throw error
      setFiles(files.filter((f) => f.id !== id))
    } catch (error) {
      console.error("Delete failed:", error)
    }
  }

  const handleToggleSave = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from("files")
        .update({ is_saved: !currentStatus })
        .eq("id", id)

      if (error) throw error
      setFiles(files.map(f => f.id === id ? { ...f, is_saved: !currentStatus } : f))
    } catch (error) {
      console.error("Update failed:", error)
    }
  }

  const filteredFiles = () => {
    if (filter === "saved") return files.filter(f => f.is_saved)
    if (filter === "recent") return files.slice(0, 5)
    return files
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-muted-foreground font-medium">Syncing your documents...</p>
        </div>
      </div>
    )
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, <span className="text-primary font-bold">{user?.email?.split('@')[0]}</span></p>
        </div>
        <div className="flex items-center gap-3">
          <Button onClick={() => router.push("/tools")} className="rounded-xl font-bold shadow-lg shadow-primary/20">
            Open New Tool
          </Button>
          <Button onClick={() => logout()} variant="outline" className="rounded-xl border-border/50 font-bold hover:bg-destructive/5 hover:text-destructive hover:border-destructive/20 transition-all">
            Sign Out
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <Card className="p-6 bg-gradient-to-br from-primary/10 to-transparent border-primary/20 relative overflow-hidden group">
          <LayoutDashboard className="absolute -right-4 -bottom-4 w-24 h-24 text-primary/5 group-hover:scale-110 transition-transform" />
          <p className="text-sm font-bold uppercase tracking-widest text-primary/60 mb-1">Total Assets</p>
          <p className="text-4xl font-black">{stats.total}</p>
          <p className="text-xs text-muted-foreground mt-2 font-medium">Files processed across all tools</p>
        </Card>
        <Card className="p-6 bg-gradient-to-br from-green-500/10 to-transparent border-green-500/20 relative overflow-hidden group">
          <Star className="absolute -right-4 -bottom-4 w-24 h-24 text-green-500/5 group-hover:scale-110 transition-transform" />
          <p className="text-sm font-bold uppercase tracking-widest text-green-500/60 mb-1">Permanent Saves</p>
          <p className="text-4xl font-black">{stats.saved}</p>
          <p className="text-xs text-muted-foreground mt-2 font-medium">Documents pinned for future use</p>
        </Card>
        <Card className="p-6 bg-gradient-to-br from-blue-500/10 to-transparent border-blue-500/20 relative overflow-hidden group">
          <Clock className="absolute -right-4 -bottom-4 w-24 h-24 text-blue-500/5 group-hover:scale-110 transition-transform" />
          <p className="text-sm font-bold uppercase tracking-widest text-blue-500/60 mb-1">Recent Activity</p>
          <p className="text-4xl font-black">{stats.recent}</p>
          <p className="text-xs text-muted-foreground mt-2 font-medium">Documents from your last session</p>
        </Card>
      </div>

      <div className="flex flex-col lg:flex-row gap-10">
        {/* Navigation Sidebar */}
        <aside className="w-full lg:w-64 space-y-2">
          <button 
            onClick={() => setFilter("all")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${filter === 'all' ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20' : 'hover:bg-muted text-muted-foreground'}`}
          >
            <HardDrive className="w-5 h-5" />
            Library
          </button>
          <button 
            onClick={() => setFilter("saved")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${filter === 'saved' ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20' : 'hover:bg-muted text-muted-foreground'}`}
          >
            <Star className="w-5 h-5" />
            Starred
          </button>
          <button 
            onClick={() => setFilter("recent")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${filter === 'recent' ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20' : 'hover:bg-muted text-muted-foreground'}`}
          >
            <Clock className="w-5 h-5" />
            Recents
          </button>
          <div className="pt-6 border-t border-border mt-6">
             <div className="p-4 bg-muted/50 rounded-xl border border-border/50">
                <p className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-2">Cloud Storage</p>
                <div className="w-full bg-border rounded-full h-1.5 mb-2">
                  <div className="bg-primary h-1.5 rounded-full w-1/4 shadow-[0_0_8px_rgba(var(--primary),0.5)]"></div>
                </div>
                <p className="text-[10px] font-bold text-muted-foreground">Using 12.4 MB of 500 MB</p>
             </div>
          </div>
        </aside>

        {/* Content Area */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-black capitalize italic">{filter === 'all' ? 'Your Assets' : `${filter} Assets`}</h2>
            <p className="text-sm font-bold text-muted-foreground">{filteredFiles().length} items found</p>
          </div>

          {filteredFiles().length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredFiles().map((file) => (
                <FileCard
                  key={file.id}
                  file={{
                    id: file.id,
                    name: file.file_name,
                    size: file.file_size,
                    type: file.file_type,
                    data: file.download_url,
                    uploadedAt: new Date(file.created_at).getTime()
                  }}
                  isSaved={file.is_saved}
                  onDelete={() => handleDelete(file.id)}
                  onToggleSave={() => handleToggleSave(file.id, file.is_saved)}
                />
              ))}
            </div>
          ) : (
            <div className="h-64 border-2 border-dashed border-border rounded-3xl flex flex-col items-center justify-center text-center p-8 bg-muted/20">
              <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-4">
                <HardDrive className="w-10 h-10 text-muted-foreground/40" />
              </div>
              <h3 className="text-xl font-bold mb-1 italic">Nothing here yet</h3>
              <p className="text-muted-foreground max-w-xs text-sm">You haven't processed any documents in this category. Start using our tools to see them here.</p>
              <Button onClick={() => router.push("/tools")} variant="link" className="mt-4 font-black uppercase tracking-widest text-xs">Explore Tools</Button>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </main>
  )
}
