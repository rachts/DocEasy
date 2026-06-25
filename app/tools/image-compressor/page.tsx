"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "motion/react"
import { ToolLayout } from "@/components/ui/tool-layout"
import { UploadCard } from "@/components/ui/upload-card"
import { ProcessingStatus, StatusType } from "@/components/ui/processing-status"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Image as ImageIcon, Settings2, Download } from "lucide-react"
import { compressImageWithQuality, calculateCompressionRatio } from "@/lib/image-compressor-utils"
import { uploadFileToSupabase, saveFileMetadata, trackEvent, addToRecentFiles } from "@/lib/supabase/helpers"

export default function ImageCompressorPage() {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [status, setStatus] = useState<StatusType | "configure">("idle")
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string>("")
  const [quality, setQuality] = useState(80)
  const [result, setResult] = useState<Blob | null>(null)
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null)

  const handleUpload = (selectedFile: File) => {
    if (!selectedFile.type.startsWith("image/")) {
      alert("Please select an image file")
      return
    }
    setFile(selectedFile)
    
    const reader = new FileReader()
    reader.onload = (e) => {
      setPreview(e.target?.result as string)
      setStatus("configure")
    }
    reader.readAsDataURL(selectedFile)
  }

  const handleCompress = async () => {
    if (!file) return

    setStatus("processing")
    setProgress(10)
    try {
      const compressed = await compressImageWithQuality(file, quality)
      setProgress(50)
      
      const fileName = `${file.name.split(".")[0]}-compressed.${file.name.split(".").pop()}`
      const { filePath, publicUrl } = await uploadFileToSupabase(compressed, fileName, "image-compressor")
      setProgress(80)

      await saveFileMetadata({
        file_name: fileName,
        file_type: file.type,
        file_size: compressed.size,
        tool_used: "image-compressor",
        storage_path: filePath,
        download_url: publicUrl,
        is_saved: false
      })
      setProgress(90)

      await trackEvent("upload", "image-compressor")
      addToRecentFiles({ name: fileName, url: publicUrl, tool: "image-compressor", timestamp: Date.now() })

      setResult(compressed)
      setDownloadUrl(publicUrl)
      setProgress(100)
      setStatus("success")
    } catch (e: any) {
      console.error("Compression failed:", e)
      setError(e.message || "Failed to compress image. Please try again.")
      setStatus("error")
    }
  }

  const handleDownload = () => {
    if (downloadUrl) {
      const link = document.createElement("a")
      link.href = downloadUrl
      link.download = `compressed-${file?.name}`
      link.click()
    }
  }

  const handleReset = () => {
    setFile(null)
    setPreview(null)
    setStatus("idle")
    setProgress(0)
    setError("")
    setResult(null)
    setDownloadUrl(null)
  }

  const compressionRatio = file && result ? calculateCompressionRatio(file.size, result.size) : 0

  return (
    <ToolLayout
      title="Image Compressor"
      description="Reduce image file sizes without sacrificing quality. Perfect for optimizing web assets or saving storage space."
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
                accept="image/*"
                title="Drop your Image here"
                icon={<ImageIcon className="w-10 h-10" />}
              />
            </motion.div>
          )}

          {status === "configure" && (
            <motion.div
              key="configure"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-2xl"
            >
              <Card className="p-8 shadow-glass bg-card/40 backdrop-blur-md border-border/50">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-primary/10 rounded-xl">
                    <Settings2 className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">Configure Compression</h2>
                    <p className="text-sm text-muted-foreground">{file?.name}</p>
                  </div>
                </div>

                {preview && (
                  <div className="mb-8 rounded-2xl overflow-hidden bg-black/5 flex items-center justify-center max-h-[300px]">
                    <img src={preview} alt="Preview" className="max-h-[300px] object-contain w-auto h-auto" />
                  </div>
                )}

                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <label className="block font-semibold">Target Quality</label>
                      <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-bold">
                        {quality}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="100"
                      step="5"
                      value={quality}
                      onChange={(e) => setQuality(Number(e.target.value))}
                      className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground mt-2 font-medium">
                      <span>Smaller File Size</span>
                      <span>Better Quality</span>
                    </div>
                  </div>

                  <div className="flex gap-4 pt-4">
                    <Button variant="outline" onClick={handleReset} className="w-full h-12 rounded-xl">Cancel</Button>
                    <Button onClick={handleCompress} className="w-full h-12 rounded-xl shadow-glow">Compress Image</Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}

          {(status === "processing" || status === "success" || status === "error") && (
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
                title={status === "processing" ? "Compressing image..." : undefined}
                description={status === "success" ? `Reduced by ${compressionRatio}%` : undefined}
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
