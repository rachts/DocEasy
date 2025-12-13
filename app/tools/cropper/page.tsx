"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { FileUploader } from "@/components/file-uploader"
import { getFileSize } from "@/lib/storage-utils"
import { Download } from "lucide-react"
import { FooterCredit } from "@/components/footer-credit"

export default function CropperPage() {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [scale, setScale] = useState(1)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [result, setResult] = useState<Blob | null>(null)

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile)
    setResult(null)
    const reader = new FileReader()
    reader.onload = (e) => {
      setPreview(e.target?.result as string)
    }
    reader.readAsDataURL(selectedFile)
  }

  const handleCrop = () => {
    if (!preview || !canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const img = new Image()
    img.onload = () => {
      canvas.width = img.width * scale
      canvas.height = img.height * scale
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
      canvas.toBlob((blob) => {
        if (blob) setResult(blob)
      })
    }
    img.src = preview
  }

  const handleDownload = () => {
    if (!result || !file) return

    const url = URL.createObjectURL(result)
    const link = document.createElement("a")
    link.href = url
    link.download = `cropped-${file.name}`
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold mb-2">Crop Images</h1>
      <p className="text-muted-foreground mb-8">Crop and resize your images</p>

      <div className="space-y-6">
        <Card className="p-6">
          <h2 className="text-lg font-bold mb-4">Select Image</h2>
          <FileUploader onFileSelect={handleFileSelect} />

          {file && (
            <div className="mt-4 p-3 bg-muted rounded">
              <p className="text-sm">
                <strong>File:</strong> {file.name}
              </p>
              <p className="text-sm">
                <strong>Size:</strong> {getFileSize(file.size)}
              </p>
            </div>
          )}
        </Card>

        {preview && (
          <Card className="p-6">
            <h2 className="text-lg font-bold mb-4">Preview & Scale</h2>
            <div className="space-y-4">
              <img
                src={preview || "/placeholder.svg"}
                alt="Preview"
                className="w-full max-h-64 object-contain rounded"
              />

              <div>
                <label className="block text-sm font-medium mb-2">Scale: {Math.round(scale * 100)}%</label>
                <input
                  type="range"
                  min="0.5"
                  max="2"
                  step="0.1"
                  value={scale}
                  onChange={(e) => setScale(Number(e.target.value))}
                  className="w-full"
                />
              </div>

              <Button onClick={handleCrop} className="w-full" size="lg">
                Apply Crop
              </Button>
            </div>
          </Card>
        )}

        <canvas ref={canvasRef} className="hidden" />

        {result && (
          <Card className="p-6 bg-accent/5 border-accent">
            <h2 className="text-lg font-bold mb-4 text-accent">Ready to Download</h2>
            <p className="text-sm mb-4">
              <strong>New Size:</strong> {getFileSize(result.size)}
            </p>
            <Button onClick={handleDownload} className="w-full" size="lg">
              <Download className="w-5 h-5 mr-2" />
              Download Cropped Image
            </Button>
          </Card>
        )}
      </div>

      <FooterCredit />
    </main>
  )
}
