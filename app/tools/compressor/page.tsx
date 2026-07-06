"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "motion/react"
import { ToolLayout } from "@/components/ui/tool-layout"
import { UploadCard } from "@/components/ui/upload-card"
import { ProcessingStatus, StatusType } from "@/components/ui/processing-status"
import { compressImage } from "@/lib/compression-utils"
import { uploadFileToSupabase, saveFileMetadata, trackEvent, addToRecentFiles } from "@/lib/supabase/helpers"
import { compressPDFWithRendering } from "@/lib/pdf-compression-advanced"

export default function CompressorPage() {
  const [file, setFile] = useState<File | null>(null)
  const [status, setStatus] = useState<StatusType>("idle")
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string>("")
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null)
  const [resultFileName, setResultFileName] = useState("")
  const [level, setLevel] = useState<"less" | "recommended" | "extreme">("recommended")
  const [engine, setEngine] = useState<"auto" | "browser" | "server">("auto")

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

        // --- BROWSER ENGINE ---
        if (engine === "browser") {
          console.log("Using browser engine directly...");
          setProgress(30)
          const compressed = await compressPDFWithRendering(selectedFile, level)
          setProgress(60)
          const { filePath, publicUrl } = await uploadFileToSupabase(compressed, selectedFile.name, "compressor")
          
          setProgress(85)
          await saveFileMetadata({
            file_name: selectedFile.name,
            file_type: selectedFile.type,
            file_size: compressed.size,
            tool_used: "compressor",
            storage_path: filePath,
            download_url: publicUrl,
            is_saved: false
          })
          
          setProgress(95)
          await trackEvent("upload", "compressor")
          addToRecentFiles({ name: selectedFile.name, url: publicUrl, tool: "compressor", timestamp: Date.now() })
          
          setProgress(100)
          setDownloadUrl(publicUrl)
          setResultFileName(`compressed-${selectedFile.name}`)
          setStatus("success")
          return;
        }

        // --- SERVER / AUTO ENGINE ---
        const formData = new FormData()
        formData.append('file', selectedFile)
        formData.append('level', level)

        const response = await fetch('/api/compression', { method: 'POST', body: formData })
        
        if (response.status === 503) {
          const errorData = await response.json().catch(() => ({}));
          if (errorData.fallbackToClient) {
            if (engine === "server") {
              throw new Error("Server engine is unavailable and fallback is disabled.")
            }
            
            console.log("Server engine unavailable, falling back to client-side compression...");
            setProgress(30)
            const compressed = await compressPDFWithRendering(selectedFile, level)
            setProgress(60)
            const { filePath, publicUrl } = await uploadFileToSupabase(compressed, selectedFile.name, "compressor")
            
            setProgress(85)
            await saveFileMetadata({
              file_name: selectedFile.name,
              file_type: selectedFile.type,
              file_size: compressed.size,
              tool_used: "compressor",
              storage_path: filePath,
              download_url: publicUrl,
              is_saved: false
            })
            
            setProgress(95)
            await trackEvent("upload", "compressor")
            addToRecentFiles({ name: selectedFile.name, url: publicUrl, tool: "compressor", timestamp: Date.now() })
            
            setProgress(100)
            setDownloadUrl(publicUrl)
            setResultFileName(`compressed-${selectedFile.name}`)
            setStatus("success")
            return;
          }
        }

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
              <div className="w-full flex flex-col gap-4">
                <UploadCard 
                  onUpload={handleUpload} 
                  accept="image/*,application/pdf"
                  title="Drop your PDF or Image here"
                />
                <div className="flex flex-col gap-3 bg-card/40 backdrop-blur-sm p-4 rounded-xl border border-border">
                  <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                    <span className="text-sm font-medium whitespace-nowrap">PDF Compression Level:</span>
                    <select 
                      value={level}
                      onChange={(e) => setLevel(e.target.value as any)}
                      className="bg-background border border-input rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary w-full sm:w-auto flex-1"
                    >
                      <option value="less">Less (Lossless, Metadata only)</option>
                      <option value="recommended">Recommended (Good Quality & Size)</option>
                      <option value="extreme">Extreme (Smallest Size, Lower Quality)</option>
                    </select>
                  </div>
                  <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                    <span className="text-sm font-medium whitespace-nowrap">Compression Engine:</span>
                    <select 
                      value={engine}
                      onChange={(e) => setEngine(e.target.value as any)}
                      className="bg-background border border-input rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary w-full sm:w-auto flex-1"
                    >
                      <option value="auto">Auto (Recommended)</option>
                      <option value="browser">Browser (Fast)</option>
                      <option value="server">Server (Highest Compression)</option>
                    </select>
                  </div>
                </div>
              </div>
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
