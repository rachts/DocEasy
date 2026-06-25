"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "motion/react"
import { ToolLayout } from "@/components/ui/tool-layout"
import { UploadCard } from "@/components/ui/upload-card"
import { ProcessingStatus, StatusType } from "@/components/ui/processing-status"
import { compressImage } from "@/lib/compression-utils"
import { uploadFileToSupabase, saveFileMetadata, trackEvent, addToRecentFiles } from "@/lib/supabase/helpers"

export default function CompressorPage() {
  const [file, setFile] = useState<File | null>(null)
  const [status, setStatus] = useState<StatusType>("idle")
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string>("")
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null)
  const [resultFileName, setResultFileName] = useState("")

  const handleUpload = async (selectedFile: File) => {
    setFile(selectedFile)
    setStatus("processing")
    setProgress(10)
    
    try {
      if (selectedFile.type.startsWith("image/")) {
        setProgress(30)
        const compressed = await compressImage(selectedFile, 0.75) // default 75%
        setProgress(60)

        const { filePath, publicUrl } = await uploadFileToSupabase(compressed, selectedFile.name, "compressor")
        
        setProgress(80)
        await saveFileMetadata({
          file_name: selectedFile.name,
          file_type: selectedFile.type,
          file_size: compressed.size,
          tool_used: "compressor",
          storage_path: filePath,
          download_url: publicUrl,
          is_saved: false
        })

        setProgress(90)
        await trackEvent("upload", "compressor")
        addToRecentFiles({ name: selectedFile.name, url: publicUrl, tool: "compressor", timestamp: Date.now() })

        setProgress(100)
        setDownloadUrl(publicUrl)
        setResultFileName(`compressed-${selectedFile.name}`)
        setStatus("success")
      } else if (selectedFile.type === "application/pdf") {
        setProgress(20)
        const formData = new FormData()
        formData.append('file', selectedFile)
        formData.append('level', "recommended")

        const response = await fetch('/api/compression', { method: 'POST', body: formData })
        if (!response.ok) throw new Error("Failed to start compression")
        
        const data = await response.json()
        let jobStatus = 'waiting'
        let jobResult = null

        if (data.jobId === 'sync-job' && data.result) {
          jobStatus = 'completed'
          jobResult = data.result
        } else if (!data.jobId) {
          throw new Error("No job ID returned")
        }
        
        while (jobStatus === 'waiting' || jobStatus === 'active') {
          await new Promise(resolve => setTimeout(resolve, 1000))
          const statusRes = await fetch(`/api/compression/status/${data.jobId}`)
          if (!statusRes.ok) throw new Error('Failed to check status')
          
          const statusData = await statusRes.json()
          setProgress(statusData.progress || 20)
          
          if (statusData.state === 'completed') {
            jobStatus = 'completed'
            jobResult = statusData.result
          } else if (statusData.state === 'failed') {
            throw new Error(statusData.error || 'Compression failed')
          } else {
            jobStatus = statusData.state
          }
        }
        
        if (!jobResult) throw new Error('No result returned')

        setProgress(85)
        await saveFileMetadata({
          file_name: selectedFile.name,
          file_type: selectedFile.type,
          file_size: jobResult.compressedSize,
          tool_used: "compressor",
          storage_path: jobResult.storagePath,
          download_url: jobResult.url,
          is_saved: false
        })

        setProgress(95)
        await trackEvent("upload", "compressor")
        addToRecentFiles({ name: selectedFile.name, url: jobResult.url, tool: "compressor", timestamp: Date.now() })

        setProgress(100)
        setDownloadUrl(jobResult.url)
        setResultFileName(`compressed-${selectedFile.name}`)
        setStatus("success")
      } else {
        throw new Error("Unsupported file type. Please upload an image or PDF.")
      }
    } catch (e: any) {
      setError(e.message || "An error occurred during compression.")
      setStatus("error")
    }
  }

  const handleDownload = () => {
    if (downloadUrl) {
      const link = document.createElement("a")
      link.href = downloadUrl
      link.download = resultFileName
      link.click()
    }
  }

  const handleReset = () => {
    setFile(null)
    setStatus("idle")
    setProgress(0)
    setError("")
    setDownloadUrl(null)
  }

  return (
    <ToolLayout
      title="Universal Compressor"
      description="Smart compression for PDFs and Images. Drastically reduce file sizes without losing noticeable quality."
    >
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <AnimatePresence mode="wait">
          {status === "idle" && (
            <motion.div 
              key="idle"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full"
            >
              <UploadCard 
                onUpload={handleUpload} 
                accept="image/*,application/pdf"
                title="Drop your PDF or Image here"
              />
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
                title={status === "processing" ? `Compressing ${file?.name}...` : undefined}
                description={status === "processing" ? "Optimizing the file contents to reduce size..." : undefined}
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
