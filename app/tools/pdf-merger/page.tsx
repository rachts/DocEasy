"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "motion/react"
import { ToolLayout } from "@/components/ui/tool-layout"
import { UploadCard } from "@/components/ui/upload-card"
import { ProcessingStatus, StatusType } from "@/components/ui/processing-status"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { X, FilePlus2, FileType } from "lucide-react"
import { uploadFileToSupabase, saveFileMetadata, trackEvent, addToRecentFiles } from "@/lib/supabase/helpers"

export default function PDFMergerPage() {
  const [files, setFiles] = useState<File[]>([])
  const [status, setStatus] = useState<StatusType>("idle")
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string>("")
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null)

  const handleUploadMultiple = (selectedFiles: File[]) => {
    const pdfs = selectedFiles.filter(f => f.type === "application/pdf")
    if (pdfs.length < selectedFiles.length) {
      alert("Only PDF files are allowed for merging.")
    }
    setFiles(prev => [...prev, ...pdfs])
  }

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index))
  }

  const moveUp = (index: number) => {
    if (index === 0) return
    setFiles(prev => {
      const newFiles = [...prev]
      ;[newFiles[index - 1], newFiles[index]] = [newFiles[index], newFiles[index - 1]]
      return newFiles
    })
  }

  const moveDown = (index: number) => {
    if (index === files.length - 1) return
    setFiles(prev => {
      const newFiles = [...prev]
      ;[newFiles[index], newFiles[index + 1]] = [newFiles[index + 1], newFiles[index]]
      return newFiles
    })
  }

  const handleMerge = async () => {
    if (files.length < 2) {
      alert("Please select at least 2 PDF files to merge.")
      return
    }

    setStatus("processing")
    setProgress(10)
    
    try {
      const { PDFDocument } = await import("pdf-lib")
      const mergedPdf = await PDFDocument.create()

      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const arrayBuffer = await file.arrayBuffer()
        const pdf = await PDFDocument.load(arrayBuffer)
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices())
        copiedPages.forEach(page => mergedPdf.addPage(page))
        setProgress(10 + ((i + 1) / files.length) * 50)
      }

      const mergedPdfBytes = await mergedPdf.save()
      const blob = new Blob([mergedPdfBytes], { type: "application/pdf" })
      const fileName = "merged-document.pdf"
      
      const { filePath, publicUrl } = await uploadFileToSupabase(blob, fileName, "pdf-merger")
      setProgress(80)

      await saveFileMetadata({
        file_name: fileName,
        file_type: "application/pdf",
        file_size: blob.size,
        tool_used: "pdf-merger",
        storage_path: filePath,
        download_url: publicUrl,
        is_saved: false
      })
      
      setProgress(90)
      await trackEvent("upload", "pdf-merger")
      addToRecentFiles({ name: fileName, url: publicUrl, tool: "pdf-merger", timestamp: Date.now() })

      setProgress(100)
      setDownloadUrl(publicUrl)
      setStatus("success")
    } catch (e: any) {
      console.error("Merge error:", e)
      setError(e.message || "Failed to merge PDFs. Please try again.")
      setStatus("error")
    }
  }

  const handleDownload = () => {
    if (downloadUrl) {
      const link = document.createElement("a")
      link.href = downloadUrl
      link.download = "merged-document.pdf"
      link.click()
    }
  }

  const handleReset = () => {
    setFiles([])
    setStatus("idle")
    setProgress(0)
    setError("")
    setDownloadUrl(null)
  }

  return (
    <ToolLayout
      title="PDF Merger"
      description="Combine multiple PDF files into a single, unified document. Drag and drop to reorder before merging."
    >
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <AnimatePresence mode="wait">
          {status === "idle" && (
            <motion.div 
              key="idle"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-3xl space-y-6"
            >
              <UploadCard 
                onUploadMultiple={handleUploadMultiple} 
                multiple
                accept="application/pdf"
                title="Select PDFs to Merge"
                icon={<FilePlus2 className="w-10 h-10" />}
              />
              
              {files.length > 0 && (
                <Card className="p-6 bg-card/40 backdrop-blur-sm border-border/50 shadow-soft">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-lg">Selected Files ({files.length})</h3>
                    {files.length < 2 && (
                      <span className="text-sm text-amber-500 font-medium bg-amber-500/10 px-3 py-1 rounded-full">
                        Add at least 1 more file
                      </span>
                    )}
                  </div>
                  
                  <div className="space-y-3 mb-6 max-h-[300px] overflow-y-auto pr-2">
                    {files.map((file, index) => (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        key={`${file.name}-${index}`} 
                        className="flex items-center justify-between p-3 bg-background rounded-xl border border-border shadow-sm group"
                      >
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                            <span className="text-xs font-bold">{index + 1}</span>
                          </div>
                          <div className="flex flex-col truncate">
                            <span className="text-sm font-medium truncate">{file.name}</span>
                            <span className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(1)} KB</span>
                          </div>
                        </div>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button variant="ghost" size="icon" onClick={() => moveUp(index)} disabled={index === 0} className="h-8 w-8">
                            ↑
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => moveDown(index)} disabled={index === files.length - 1} className="h-8 w-8">
                            ↓
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => removeFile(index)} className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10">
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  <Button 
                    onClick={handleMerge} 
                    disabled={files.length < 2} 
                    className="w-full h-12 rounded-xl text-md font-bold shadow-glow"
                  >
                    <FileType className="w-5 h-5 mr-2" />
                    Merge {files.length} PDFs
                  </Button>
                </Card>
              )}
            </motion.div>
          )}

          {status !== "idle" && (
            <motion.div
              key="processing"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full"
            >
              <ProcessingStatus
                status={status}
                progress={progress}
                title={status === "processing" ? `Merging ${files.length} files...` : undefined}
                description={status === "processing" ? "Combining your documents into a single PDF..." : undefined}
                error={error}
                onDownload={handleDownload}
                onReset={handleReset}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </ToolLayout>
  )
}
