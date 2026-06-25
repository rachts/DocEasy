"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "motion/react"
import { ToolLayout } from "@/components/ui/tool-layout"
import { UploadCard } from "@/components/ui/upload-card"
import { ProcessingStatus, StatusType } from "@/components/ui/processing-status"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Scissors, Settings2 } from "lucide-react"
import { processPassportPhoto, PASSPORT_SIZES } from "@/lib/passport-photo-utils"
import { uploadFileToSupabase, saveFileMetadata, trackEvent, addToRecentFiles } from "@/lib/supabase/helpers"

export default function PassportPhotoPage() {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [status, setStatus] = useState<StatusType | "configure">("idle")
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string>("")
  
  const [selectedSize, setSelectedSize] = useState<keyof typeof PASSPORT_SIZES>("US Passport")
  const [backgroundColor, setBackgroundColor] = useState("#ffffff")
  const [brightness, setBrightness] = useState(100)
  const [contrast, setContrast] = useState(100)
  
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

  const handleProcess = async () => {
    if (!file) return

    setStatus("processing")
    setProgress(10)
    try {
      const size = PASSPORT_SIZES[selectedSize]
      const processed = await processPassportPhoto(file, {
        width: size.width,
        height: size.height,
        backgroundColor,
        brightness,
        contrast,
      })
      setProgress(50)

      const fileName = `passport-${file.name}`
      const { filePath, publicUrl } = await uploadFileToSupabase(processed, fileName, "passport-photo")
      setProgress(80)

      await saveFileMetadata({
        file_name: fileName,
        file_type: file.type,
        file_size: processed.size,
        tool_used: "passport-photo",
        storage_path: filePath,
        download_url: publicUrl,
        is_saved: false
      })
      setProgress(90)

      await trackEvent("upload", "passport-photo")
      addToRecentFiles({ name: fileName, url: publicUrl, tool: "passport-photo", timestamp: Date.now() })

      setResult(processed)
      setDownloadUrl(publicUrl)
      setProgress(100)
      setStatus("success")
    } catch (e: any) {
      console.error("Processing failed:", e)
      setError(e.message || "Failed to process photo.")
      setStatus("error")
    }
  }

  const handleDownload = () => {
    if (downloadUrl) {
      const link = document.createElement("a")
      link.href = downloadUrl
      link.download = `passport-photo-${file?.name}`
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

  return (
    <ToolLayout
      title="Passport Photo Editor"
      description="Automatically crop, resize, and adjust your photos to meet official passport standards."
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
                title="Upload Portrait Photo"
                icon={<Scissors className="w-10 h-10" />}
              />
            </motion.div>
          )}

          {status === "configure" && (
            <motion.div
              key="configure"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-4xl"
            >
              <div className="grid md:grid-cols-2 gap-8">
                <Card className="p-6 bg-card/40 backdrop-blur-md border-border/50 shadow-soft">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-primary/10 rounded-xl">
                      <Settings2 className="w-5 h-5 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold">Photo Settings</h3>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <Label className="mb-2 block">Passport Size Standard</Label>
                      <Select
                        value={selectedSize}
                        onValueChange={(value) => setSelectedSize(value as keyof typeof PASSPORT_SIZES)}
                      >
                        <SelectTrigger className="w-full h-12 rounded-xl">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(PASSPORT_SIZES).map(([name, size]) => (
                            <SelectItem key={name} value={name}>
                              {name} ({size.width}x{size.height}px)
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label className="mb-2 block">Background Color</Label>
                      <div className="flex gap-2 items-center">
                        <input
                          type="color"
                          value={backgroundColor}
                          onChange={(e) => setBackgroundColor(e.target.value)}
                          className="h-10 w-16 rounded border cursor-pointer p-0"
                        />
                        <div className="flex gap-2 flex-wrap">
                          <Button variant="outline" size="sm" onClick={() => setBackgroundColor("#ffffff")}>White</Button>
                          <Button variant="outline" size="sm" onClick={() => setBackgroundColor("#e8f4f8")}>Light Blue</Button>
                          <Button variant="outline" size="sm" onClick={() => setBackgroundColor("#f0f0f0")}>Gray</Button>
                        </div>
                      </div>
                    </div>

                    <div>
                      <Label className="mb-2 flex justify-between">
                        <span>Brightness</span>
                        <span>{brightness}%</span>
                      </Label>
                      <Slider
                        value={[brightness]}
                        onValueChange={(value) => setBrightness(value[0])}
                        min={50} max={150} step={1}
                      />
                    </div>

                    <div>
                      <Label className="mb-2 flex justify-between">
                        <span>Contrast</span>
                        <span>{contrast}%</span>
                      </Label>
                      <Slider
                        value={[contrast]}
                        onValueChange={(value) => setContrast(value[0])}
                        min={50} max={150} step={1}
                      />
                    </div>
                  </div>
                </Card>

                <div className="flex flex-col gap-4">
                  <Card className="p-2 overflow-hidden bg-card/40 backdrop-blur-md border-border/50 shadow-soft flex-1 flex flex-col">
                    <div className="flex-1 flex items-center justify-center bg-muted/30 rounded-xl border border-dashed border-border p-4 relative min-h-[300px]">
                      {preview && (
                        <img 
                          src={preview} 
                          alt="Preview" 
                          className="max-h-full object-contain rounded-lg"
                          style={{
                            filter: `brightness(${brightness}%) contrast(${contrast}%)`,
                            backgroundColor: backgroundColor
                          }}
                        />
                      )}
                    </div>
                  </Card>
                  
                  <div className="flex gap-3">
                    <Button variant="outline" onClick={handleReset} className="w-1/3 h-12 rounded-xl">Cancel</Button>
                    <Button onClick={handleProcess} className="w-2/3 h-12 rounded-xl shadow-glow">Generate Passport Photo</Button>
                  </div>
                </div>
              </div>
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
                title={status === "processing" ? "Formatting photo..." : undefined}
                description={status === "processing" ? "Applying size constraints and filters..." : undefined}
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
