"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { FileUploader } from "@/components/file-uploader"
import { compressImageWithQuality, calculateCompressionRatio } from "@/lib/image-compressor-utils"
import { getFileSize } from "@/lib/storage-utils"
import { Download } from "lucide-react"
import { FooterCredit } from "@/components/footer-credit"

export default function ImageCompressorPage() {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [compressing, setCompressing] = useState(false)
  const [result, setResult] = useState<Blob | null>(null)
  const [quality, setQuality] = useState(80)

  const handleFileSelect = (selectedFile: File) => {
    if (!selectedFile.type.startsWith("image/")) {
      alert("Please select an image file")
      return
    }

    setFile(selectedFile)
    setResult(null)

    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => {
      setPreview(e.target?.result as string)
    }
    reader.readAsDataURL(selectedFile)
  }

  const handleCompress = async () => {
    if (!file) return

    setCompressing(true)

    try {
      const compressed = await compressImageWithQuality(file, quality)
      setResult(compressed)

      // Track action
      const token = localStorage.getItem("auth_token")
      if (token) {
        await fetch("/api/tool-actions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            fileName: file.name,
            fileType: file.type,
            action: "compress",
          }),
        })
      }
    } catch (error) {
      console.error("Compression failed:", error)
      alert("Failed to compress image. Please try again.")
    } finally {
      setCompressing(false)
    }
  }

  const handleDownload = () => {
    if (!result || !file) return

    const url = URL.createObjectURL(result)
    const link = document.createElement("a")
    link.href = url
    const baseName = file.name.split(".")[0]
    const extension = file.name.split(".").pop()
    link.download = `${baseName}-compressed.${extension}`
    link.click()
    URL.revokeObjectURL(url)
  }

  const compressionRatio = file && result ? calculateCompressionRatio(file.size, result.size) : 0

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold mb-2">Image Compressor</h1>
      <p className="text-muted-foreground mb-8">Reduce image file size with adjustable quality</p>

      <div className="space-y-6">
        <Card className="p-6">
          <h2 className="text-lg font-bold mb-4">Select Image</h2>
          <p className="text-sm text-muted-foreground mb-4">Supported formats: JPG, PNG, WebP</p>
          <FileUploader onFileSelect={handleFileSelect} loading={compressing} accept="image/*" />

          {file && (
            <div className="mt-4 p-3 bg-muted rounded">
              <p className="text-sm">
                <strong>File:</strong> {file.name}
              </p>
              <p className="text-sm">
                <strong>Original Size:</strong> {getFileSize(file.size)}
              </p>
              <p className="text-sm">
                <strong>Type:</strong> {file.type}
              </p>
            </div>
          )}
        </Card>

        {preview && (
          <Card className="p-6">
            <h2 className="text-lg font-bold mb-4">Preview</h2>
            <img
              src={preview || "/placeholder.svg"}
              alt="Preview"
              className="w-full max-h-96 object-contain rounded bg-muted"
            />
          </Card>
        )}

        {file && !result && (
          <Card className="p-6">
            <h2 className="text-lg font-bold mb-4">Compression Settings</h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium">Quality: {quality}%</label>
                  <span className="text-xs text-muted-foreground">
                    {quality >= 90 ? "High" : quality >= 70 ? "Medium" : quality >= 50 ? "Low" : "Very Low"}
                  </span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  step="5"
                  value={quality}
                  onChange={(e) => setQuality(Number(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>Smaller file</span>
                  <span>Better quality</span>
                </div>
              </div>

              <Button onClick={handleCompress} disabled={compressing} className="w-full" size="lg">
                {compressing ? "Compressing..." : "Compress Image"}
              </Button>
            </div>
          </Card>
        )}

        {result && (
          <Card className="p-6 bg-accent/5 border-accent">
            <h2 className="text-lg font-bold mb-4 text-accent">Compression Complete</h2>
            <div className="space-y-3 mb-4">
              <p className="text-sm">
                <strong>Original Size:</strong> {getFileSize(file!.size)}
              </p>
              <p className="text-sm">
                <strong>Compressed Size:</strong> {getFileSize(result.size)}
              </p>
              <p className="text-sm">
                <strong>Size Reduced:</strong> {getFileSize(file!.size - result.size)} ({compressionRatio}%)
              </p>
              <p className="text-sm">
                <strong>Quality Level:</strong> {quality}%
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-xs font-medium mb-2">Original</p>
                <img
                  src={preview || "/placeholder.svg"}
                  alt="Original"
                  className="w-full h-48 object-contain rounded bg-muted border border-border"
                />
              </div>
              <div>
                <p className="text-xs font-medium mb-2">Compressed</p>
                <img
                  src={URL.createObjectURL(result) || "/placeholder.svg"}
                  alt="Compressed"
                  className="w-full h-48 object-contain rounded bg-muted border border-border"
                />
              </div>
            </div>

            <Button onClick={handleDownload} className="w-full" size="lg">
              <Download className="w-5 h-5 mr-2" />
              Download Compressed Image
            </Button>
          </Card>
        )}
      </div>

      <FooterCredit />
    </main>
  )
}
