"use client"

import { getFileSize } from "@/lib/storage-utils"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Download, Trash2, Star, FileText, Image as ImageIcon, FileArchive } from "lucide-react"

interface FileCardProps {
  file: {
    id: string
    name: string
    size: number
    type: string
    data?: string
    uploadedAt: number
  }
  isSaved?: boolean
  onDelete: (id: string) => void
  onToggleSave?: (id: string) => void
}

export function FileCard({ file, isSaved, onDelete, onToggleSave }: FileCardProps) {
  const getIcon = () => {
    if (file.type.includes("pdf")) return <FileText className="w-8 h-8 text-red-500" />
    if (file.type.includes("image")) return <ImageIcon className="w-8 h-8 text-blue-500" />
    return <FileArchive className="w-8 h-8 text-orange-500" />
  }

  const handleDownload = () => {
    const link = document.createElement("a")
    link.href = file.data || "#"
    link.download = file.name
    link.click()
  }

  return (
    <Card className="p-4 bg-background border border-border rounded-2xl hover:shadow-xl transition-all group relative overflow-hidden">
      <div className="flex items-start gap-4 mb-4">
        <div className="p-3 bg-muted rounded-xl group-hover:scale-110 transition-transform">
          {getIcon()}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-sm truncate pr-10" title={file.name}>{file.name}</h3>
          <p className="text-[10px] uppercase font-black tracking-widest text-muted-foreground mt-0.5">
            {getFileSize(file.size)} • {new Date(file.uploadedAt).toLocaleDateString()}
          </p>
        </div>
        
        {onToggleSave && (
          <button 
            onClick={() => onToggleSave(file.id)}
            className={`absolute top-4 right-4 p-2 rounded-lg transition-colors ${
              isSaved ? "text-yellow-500 bg-yellow-50" : "text-muted-foreground hover:bg-muted"
            }`}
          >
            <Star className={`w-5 h-5 ${isSaved ? "fill-current" : ""}`} />
          </button>
        )}
      </div>

      <div className="flex gap-2">
        <Button onClick={handleDownload} size="sm" variant="default" className="flex-1 rounded-xl font-bold h-10 shadow-lg shadow-primary/10">
          <Download className="w-4 h-4 mr-2" />
          Get File
        </Button>
        <Button onClick={() => onDelete(file.id)} size="sm" variant="outline" className="w-10 h-10 p-0 rounded-xl border-border/50 hover:bg-destructive/5 hover:text-destructive hover:border-destructive/20 transition-all">
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </Card>
  )
}
