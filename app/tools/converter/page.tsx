"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { FileUploader } from "@/components/file-uploader"
import { convertImage } from "@/lib/converter-utils"
import { getFileSize } from "@/lib/storage-utils"
import { Download, ArrowLeft, Loader2 } from "lucide-react"
import { uploadFileToSupabase, saveFileMetadata, trackEvent, addToRecentFiles } from "@/lib/supabase/helpers"
import { Footer } from "@/components/footer"

export default function ConverterPage() {
  const [file, setFile] = useState<File | null>(null)
  const [targetFormat, setTargetFormat] = useState<"jpg" | "png">("png")
  const [converting, setConverting] = useState(false)
  const [result, setResult] = useState<Blob | null>(null)
  const [supabaseUrl, setSupabaseUrl] = useState<string | null>(null)
  const [progress, setProgress] = useState(0)

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile)
    setResult(null)
    setSupabaseUrl(null)
    setProgress(0)
  }

  const handleConvert = async () => {
    if (!file || !file.type.startsWith("image/")) {
      alert("Please select an image file")
      return
    }

    setConverting(true)
    setProgress(10)
    try {
      const converted = await convertImage(file, targetFormat)
      setProgress(50)
      
      const fileName = `${file.name.split(".")[0]}.${targetFormat}`
      
      // Upload to Supabase
      const { filePath, publicUrl } = await uploadFileToSupabase(converted, fileName, "converter")
      setProgress(80)

      await saveFileMetadata({
        file_name: fileName,
        file_type: `image/${targetFormat === "jpg" ? "jpeg" : "png"}`,
        file_size: converted.size,
        tool_used: "converter",
        storage_path: filePath
      })
      setProgress(90)

      await trackEvent("upload", "converter")

      // Bonus: Add to recent files
      addToRecentFiles({
        name: fileName,
        url: publicUrl,
        tool: "converter",
        timestamp: Date.now()
      })

      setResult(converted)
      setSupabaseUrl(publicUrl)
      setProgress(100)
    } catch (error) {
      console.error("Conversion or Supabase Upload failed:", error)
      alert("Something went wrong. Please try again.")
    } finally {
      setConverting(false)
    }
  }

  const handleDownload = async () => {
    if (!supabaseUrl || !file) return

    // Track download event
    await trackEvent("download", "converter")

    const link = document.createElement("a")
    link.href = supabaseUrl
    const name = file.name.split(".")[0]
    link.download = `${name}.${targetFormat}`
    link.click()
  }

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold mb-2">Convert Images</h1>
      <p className="text-muted-foreground mb-8">Convert between JPG and PNG formats</p>

      <div className="space-y-6">
        <Card className="p-6">
          <h2 className="text-lg font-bold mb-4">Select Image</h2>
          <FileUploader onFileSelect={handleFileSelect} loading={converting} />

          {file && (
            <div className="mt-4 p-3 bg-muted rounded">
              <p className="text-sm">
                <strong>File:</strong> {file.name}
              </p>
              <p className="text-sm">
                <strong>Size:</strong> {getFileSize(file.size)}
              </p>
              <p className="text-sm">
                <strong>Type:</strong> {file.type}
              </p>
            </div>
          )}
        </Card>

        {file && (
          <Card className="p-6">
            <h2 className="text-lg font-bold mb-4">Target Format</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-3">Convert to:</label>
                <div className="flex gap-3">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      value="jpg"
                      checked={targetFormat === "jpg"}
                      onChange={(e) => setTargetFormat(e.target.value as "jpg" | "png")}
                    />
                    JPG
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      value="png"
                      checked={targetFormat === "png"}
                      onChange={(e) => setTargetFormat(e.target.value as "jpg" | "png")}
                    />
                    PNG
                  </label>
                </div>
              </div>

              <Button onClick={handleConvert} disabled={converting} className="w-full" size="lg">
                {converting ? "Converting..." : "Convert Image"}
              </Button>
            </div>
          </Card>
        )}

        {result && (
          <Card className="p-6 bg-accent/5 border-accent">
            <h2 className="text-lg font-bold mb-4 text-accent">Conversion Complete</h2>
            <div className="space-y-3 mb-4">
              <p className="text-sm">
                <strong>Original Size:</strong> {getFileSize(file!.size)}
              </p>
              <p className="text-sm">
                <strong>Converted Size:</strong> {getFileSize(result.size)}
              </p>
              <p className="text-sm">
                <strong>Format:</strong> {targetFormat.toUpperCase()}
              </p>
            </div>
            <Button onClick={handleDownload} className="w-full" size="lg">
              <Download className="w-5 h-5 mr-2" />
              Download Converted File
            </Button>
          </Card>
        )}
      </div>

      <Footer />
    </main>
  )
}
