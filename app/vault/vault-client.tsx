"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { ArrowLeft, Search, Filter, HardDrive, Star, Sparkles, Share2, FileIcon, FileTextIcon, ImageIcon, Download, Trash2, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

type FileItem = {
  id: string
  file_name: string
  file_type: string
  original_size: number
  processed_size: number
  storage_path: string
  tool_used: string
  created_at: string
}

type AIJob = {
  id: string
  file_id: string
  job_type: string
  result: any
  created_at: string
  files?: FileItem
}

interface VaultClientProps {
  initialFiles: FileItem[]
  favoriteIds: string[]
  aiJobs: AIJob[]
}

export function VaultClient({ initialFiles, favoriteIds: initialFavs, aiJobs }: VaultClientProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("recent")
  const [sortBy, setSortBy] = useState<"recent" | "oldest" | "largest">("recent")
  const [favorites, setFavorites] = useState<Set<string>>(new Set(initialFavs))

  const handleToggleFavorite = (id: string) => {
    setFavorites(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
    // In a real app, this would also trigger a server action to update the DB
  }

  const filteredAndSortedFiles = useMemo(() => {
    let result = [...initialFiles]

    // 1. Filter by Tab
    if (activeTab === "favorites") {
      result = result.filter(f => favorites.has(f.id))
    } else if (activeTab === "shared") {
      result = [] // Mock for shared
    }

    // 2. Search
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      result = result.filter(f => 
        f.file_name.toLowerCase().includes(q) || 
        f.file_type.toLowerCase().includes(q) ||
        f.tool_used.toLowerCase().includes(q)
      )
    }

    // 3. Sort
    result.sort((a, b) => {
      if (sortBy === "recent") {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      } else if (sortBy === "oldest") {
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      } else if (sortBy === "largest") {
        return (b.processed_size || b.original_size || 0) - (a.processed_size || a.original_size || 0)
      }
      return 0
    })

    return result
  }, [initialFiles, activeTab, searchQuery, sortBy, favorites])

  const formatSize = (bytes: number) => {
    if (!bytes) return "0 B"
    const k = 1024
    const sizes = ["B", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  return (
    <div className="py-8 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <Link href="/dashboard">
            <Button variant="ghost" className="mb-4 hover:bg-muted -ml-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <h1 className="text-3xl font-bold tracking-tight">File Vault</h1>
          <p className="text-muted-foreground mt-1">Manage and search all your processed documents.</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <TabsList className="bg-muted/50 p-1">
            <TabsTrigger value="recent" className="gap-2"><HardDrive className="w-4 h-4" /> All Files</TabsTrigger>
            <TabsTrigger value="favorites" className="gap-2"><Star className="w-4 h-4" /> Favorites</TabsTrigger>
            <TabsTrigger value="ai" className="gap-2"><Sparkles className="w-4 h-4" /> AI Results</TabsTrigger>
            <TabsTrigger value="shared" className="gap-2"><Share2 className="w-4 h-4" /> Shared</TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input 
                type="text" 
                placeholder="Search files..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-10 pl-9 pr-4 rounded-xl bg-card border border-border/50 focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm transition-all"
              />
            </div>
            <div className="relative">
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="h-10 pl-10 pr-8 rounded-xl bg-card border border-border/50 outline-none text-sm appearance-none cursor-pointer"
              >
                <option value="recent">Recent</option>
                <option value="oldest">Oldest</option>
                <option value="largest">Largest</option>
              </select>
              <Filter className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            </div>
          </div>
        </div>

        <TabsContent value="recent" className="m-0">
          <FileList files={filteredAndSortedFiles} favorites={favorites} onToggleFav={handleToggleFavorite} formatSize={formatSize} />
        </TabsContent>

        <TabsContent value="favorites" className="m-0">
          <FileList files={filteredAndSortedFiles} favorites={favorites} onToggleFav={handleToggleFavorite} formatSize={formatSize} />
        </TabsContent>

        <TabsContent value="ai" className="m-0">
          {aiJobs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {aiJobs.map(job => (
                <Card key={job.id} className="p-5 flex flex-col justify-between bg-card hover:border-primary/50 transition-colors">
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Sparkles className="w-5 h-5 text-primary" />
                      <span className="font-semibold capitalize text-sm">{job.job_type.replace('_', ' ')}</span>
                    </div>
                    <p className="text-sm text-foreground/80 font-medium mb-1 truncate">{job.files?.file_name || "Unknown File"}</p>
                    <p className="text-xs text-muted-foreground mb-4">
                      {new Date(job.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <Button variant="secondary" className="w-full text-xs">View Analysis</Button>
                </Card>
              ))}
            </div>
          ) : (
            <EmptyState title="No AI results yet" description="Use the Resume Analyzer or PDF Summarizer to generate insights." />
          )}
        </TabsContent>

        <TabsContent value="shared" className="m-0">
          <EmptyState title="No shared files" description="Files you share securely via links will appear here." />
        </TabsContent>
      </Tabs>
    </div>
  )
}

function FileList({ files, favorites, onToggleFav, formatSize }: { files: FileItem[], favorites: Set<string>, onToggleFav: (id: string) => void, formatSize: (s: number) => string }) {
  if (files.length === 0) {
    return <EmptyState title="No files found" description="Adjust your search or start uploading new documents." />
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {files.map(file => (
        <Card key={file.id} className="group p-4 bg-card hover:border-primary/50 transition-all shadow-sm hover:shadow-md">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              {file.file_type.includes('pdf') ? <FileTextIcon className="w-5 h-5" /> : 
               file.file_type.includes('image') ? <ImageIcon className="w-5 h-5" /> : 
               <FileIcon className="w-5 h-5" />}
            </div>
            <button 
              onClick={() => onToggleFav(file.id)}
              className="p-1.5 rounded-md hover:bg-muted text-muted-foreground transition-colors"
            >
              <Heart className={`w-4 h-4 ${favorites.has(file.id) ? "fill-red-500 text-red-500" : ""}`} />
            </button>
          </div>
          <div className="mb-4">
            <h3 className="font-semibold text-sm truncate" title={file.file_name}>{file.file_name}</h3>
            <p className="text-xs text-muted-foreground mt-1 capitalize">{file.tool_used}</p>
          </div>
          <div className="flex items-center justify-between mt-auto pt-4 border-t border-border/50">
            <span className="text-xs text-muted-foreground">{formatSize(file.processed_size || file.original_size)}</span>
            <div className="flex gap-1">
              <Button size="icon" variant="ghost" className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity">
                <Download className="w-3.5 h-3.5" />
              </Button>
              <Button size="icon" variant="ghost" className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-600 hover:bg-red-500/10">
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}

function EmptyState({ title, description }: { title: string, description: string }) {
  return (
    <div className="py-20 flex flex-col items-center justify-center text-center border-2 border-dashed border-border/50 rounded-3xl bg-muted/20">
      <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
        <HardDrive className="w-8 h-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-bold mb-1">{title}</h3>
      <p className="text-muted-foreground max-w-sm text-sm">{description}</p>
    </div>
  )
}
