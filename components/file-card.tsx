"use client"

import { type StoredFile, getFileSize } from "@/lib/storage-utils"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Download, Trash2 } from "lucide-react"

interface FileCardProps {
  file: StoredFile
  onDelete: (id: string) => void
  onRename: (id: string, name: string) => void
  onDownload: (file: StoredFile) => void
}

export function FileCard({ file, onDelete, onRename, onDownload }: FileCardProps) {
  return (
    <Card className="p-4 bg-muted hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-sm truncate">{file.name}</h3>
          <p className="text-xs text-muted-foreground">{getFileSize(file.size)}</p>
        </div>
        <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">{file.category}</span>
      </div>

      {file.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {file.tags.map((tag) => (
            <span key={tag} className="text-xs bg-secondary/10 text-secondary px-2 py-0.5 rounded">
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="flex gap-2">
        <Button onClick={() => onDownload(file)} size="sm" variant="outline" className="flex-1">
          <Download className="w-4 h-4 mr-1" />
          Download
        </Button>
        <Button onClick={() => onDelete(file.id)} size="sm" variant="outline" className="flex-1">
          <Trash2 className="w-4 h-4 mr-1" />
          Delete
        </Button>
      </div>
    </Card>
  )
}
