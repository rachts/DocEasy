"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { FileUploader } from "@/components/file-uploader"
import { FileCard } from "@/components/file-card"
import { type StoredFile, getGuestFiles, saveGuestFile, deleteGuestFile, fileToBase64 } from "@/lib/storage-utils"
import { v4 as uuidv4 } from "crypto"
import { FooterCredit } from "@/components/footer-credit"

export default function Dashboard() {
  const { user, loading: authLoading, logout } = useAuth()
  const router = useRouter()
  const [files, setFiles] = useState<StoredFile[]>([])
  const [category, setCategory] = useState("Others")
  const [tags, setTags] = useState("")
  const [uploading, setUploading] = useState(false)
  const [filter, setFilter] = useState("All")
  const [syncLoading, setSyncLoading] = useState(false)

  useEffect(() => {
    if (!authLoading) {
      loadFiles()
    }
  }, [authLoading, user])

  const loadFiles = async () => {
    if (user) {
      // Load from MongoDB via API
      setSyncLoading(true)
      try {
        const token = localStorage.getItem("auth_token")
        const response = await fetch("/api/files/upload", {
          headers: { Authorization: `Bearer ${token}` },
        })

        if (response.ok) {
          const data = await response.json()
          setFiles(data)
        }
      } catch (error) {
        console.error("Failed to load files:", error)
      } finally {
        setSyncLoading(false)
      }
    } else {
      // Load from localStorage for guests
      const stored = getGuestFiles()
      setFiles(stored)
    }
  }

  const handleFileSelect = async (file: File) => {
    setUploading(true)
    try {
      const base64 = await fileToBase64(file)

      if (user) {
        // Upload to MongoDB via API
        const token = localStorage.getItem("auth_token")
        const response = await fetch("/api/files/upload", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: file.name,
            size: file.size,
            type: file.type,
            category,
            tags: tags
              .split(",")
              .map((t) => t.trim())
              .filter(Boolean),
            data: base64,
          }),
        })

        if (response.ok) {
          const newFile = await response.json()
          setFiles([newFile, ...files])
        } else {
          throw new Error("Failed to upload file")
        }
      } else {
        // Save to localStorage for guests
        const newFile: StoredFile = {
          id: uuidv4(),
          name: file.name,
          size: file.size,
          type: file.type,
          category,
          tags: tags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean),
          data: base64,
          uploadedAt: Date.now(),
        }
        saveGuestFile(newFile)
        setFiles([newFile, ...files])
      }

      setCategory("Others")
      setTags("")
    } catch (error) {
      console.error("Upload failed:", error)
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (user) {
      // Delete from MongoDB via API
      try {
        const token = localStorage.getItem("auth_token")
        const response = await fetch("/api/files/delete", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ fileId: id }),
        })

        if (response.ok) {
          setFiles(files.filter((f) => f.id !== id))
        }
      } catch (error) {
        console.error("Delete failed:", error)
      }
    } else {
      // Delete from localStorage
      deleteGuestFile(id)
      setFiles(files.filter((f) => f.id !== id))
    }
  }

  const handleDownload = (file: StoredFile) => {
    const link = document.createElement("a")
    link.href = file.data
    link.download = file.name
    link.click()
  }

  const categories = ["All", "ID Proofs", "Marksheets", "Certificates", "Others"]
  const filteredFiles = filter === "All" ? files : files.filter((f) => f.category === filter)

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold mb-2">My Documents</h1>
          {user && <p className="text-muted-foreground">Logged in as {user.email}</p>}
          {!user && <p className="text-muted-foreground">Using browser storage (login to save permanently)</p>}
        </div>
        {user && (
          <Button
            onClick={() => {
              logout()
              router.push("/")
            }}
            variant="outline"
          >
            Logout
          </Button>
        )}
      </div>

      {/* Upload Section */}
      <div className="bg-background border border-border rounded-lg p-6 mb-8">
        <h2 className="text-xl font-bold mb-4">Add New Document</h2>

        <FileUploader onFileSelect={handleFileSelect} loading={uploading} />

        <div className="grid md:grid-cols-2 gap-4 mt-6">
          <div>
            <label className="block text-sm font-medium mb-2">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 rounded border border-border"
            >
              <option>ID Proofs</option>
              <option>Marksheets</option>
              <option>Certificates</option>
              <option>Others</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Tags (comma-separated)</label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="e.g., important, verified"
              className="w-full px-3 py-2 rounded border border-border"
            />
          </div>
        </div>
      </div>

      {/* Tools Section */}
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">Quick Tools</h2>
        <div className="flex flex-wrap gap-3">
          <Button onClick={() => router.push("/tools/compressor")} variant="outline">
            Compress Files
          </Button>
          <Button onClick={() => router.push("/tools/converter")} variant="outline">
            Convert Format
          </Button>
          <Button onClick={() => router.push("/tools/cropper")} variant="outline">
            Crop Images
          </Button>
        </div>
      </div>

      {/* Filter Section */}
      <div className="mb-6 flex flex-wrap gap-2">
        {categories.map((cat) => (
          <Button key={cat} onClick={() => setFilter(cat)} variant={filter === cat ? "default" : "outline"} size="sm">
            {cat}
          </Button>
        ))}
      </div>

      {/* Files Grid */}
      {syncLoading ? (
        <div className="text-center py-12 text-muted-foreground">Loading files...</div>
      ) : filteredFiles.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFiles.map((file) => (
            <FileCard
              key={file.id}
              file={file}
              onDelete={handleDelete}
              onDownload={handleDownload}
              onRename={() => {}}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-muted rounded-lg">
          <p className="text-muted-foreground mb-4">No documents yet</p>
          <p className="text-sm text-muted-foreground">Upload your first document to get started</p>
        </div>
      )}

      <FooterCredit />
    </main>
  )
}
