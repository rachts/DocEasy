"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { FileUploader } from "@/components/file-uploader"
import { convertImageFormat, getFormatExtension, type ImageFormat } from "@/lib/image-converter-utils"
import { getFileSize } from "@/lib/storage-utils"
import { Download, ArrowRight } from "lucide-react"
import { FooterCredit } from "@/components/footer-credit"

export default function ImageConverterPage() {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [converting, setConverting] = useState(false)
  const [result, setResult] = useState<Blob | null>(null)
  const [targetFormat, setTargetFormat] = useState<ImageFormat>("png")

  const formats: Array<{ value: ImageFormat; label: string; description: string }> = [
    { value: "png", label: "PNG", description: "Lossless, supports transparency" },
    { value: "jpeg", label: "JPEG", description: "Smaller size, no transparency" },
    { value: "webp", label: "WebP", description: "Modern format, great compression" },
    { value: "bmp", label: "BMP", description: "Uncompressed, large file size" },
  ]

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

  const handleConvert = async () => {
    if (!file) return

    setConverting(true)

    try {
      const converted = await convertImageFormat(file, targetFormat)
      setResult(converted)

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
            action: "convert",
          }),
        })
      }
    } catch (error) {
      console.error("Conversion failed:", error)
      alert("Failed to convert image. Please try again.")
    } finally {
      setConverting(false)
    }
  }

  const handleDownload = () => {
    if (!result || !file) return

    const url = URL.createObjectURL(result)
    const link = document.createElement("a")
    link.href = url
    const baseName = file.name.split(".")[0]
    const extension = getFormatExtension(targetFormat)
    link.download = `${baseName}.${extension}`
    link.click()
    URL.revokeObjectURL(url)
  }

  const getSourceFormat = () => {
    if (!file) return ""
    const type = file.type.split("/")[1]
    return type.toUpperCase()
  }

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold mb-2">Image Converter</h1>
      <p className="text-muted-foreground mb-8">Convert images between different formats</p>

      <div className="space-y-6">
        <Card className="p-6">
          <h2 className="text-lg font-bold mb-4">Select Image</h2>
          <p className="text-sm text-muted-foreground mb-4">Supported formats: JPG, PNG, WebP, BMP, GIF</p>
          <FileUploader onFileSelect={handleFileSelect} loading={converting} accept="image/*" />

          {file && (
            <div className="mt-4 p-3 bg-muted rounded">
              <p className="text-sm">
                <strong>File:</strong> {file.name}
              </p>
              <p className="text-sm">
                <strong>Size:</strong> {getFileSize(file.size)}
              </p>
              <p className="text-sm">
                <strong>Format:</strong> {getSourceFormat()}
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
            <h2 className="text-lg font-bold mb-4">Convert To</h2>
            <div className="space-y-3 mb-6">
              {formats.map((format) => (
                <label
                  key={format.value}
                  className={`flex items-center gap-3 p-4 rounded border cursor-pointer transition-colors ${
                    targetFormat === format.value
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <input
                    type="radio"
                    value={format.value}
                    checked={targetFormat === format.value}
                    onChange={(e) => setTargetFormat(e.target.value as ImageFormat)}
                    className="w-4 h-4"
                  />
                  <div className="flex-1">
                    <p className="font-medium">{format.label}</p>
                    <p className="text-sm text-muted-foreground">{format.description}</p>
                  </div>
                </label>
              ))}
            </div>

            <div className="flex items-center justify-center gap-3 mb-6 text-sm text-muted-foreground">
              <span className="font-medium">{getSourceFormat()}</span>
              <ArrowRight className="w-4 h-4" />
              <span className="font-medium">{targetFormat.toUpperCase()}</span>
            </div>

            <Button onClick={handleConvert} disabled={converting} className="w-full" size="lg">
              {converting ? "Converting..." : `Convert to ${targetFormat.toUpperCase()}`}
            </Button>
          </Card>
        )}

        {result && (
          <Card className="p-6 bg-accent/5 border-accent">
            <h2 className="text-lg font-bold mb-4 text-accent">Conversion Complete</h2>
            <div className="space-y-3 mb-4">
              <p className="text-sm">
                <strong>Original Format:</strong> {getSourceFormat()}
              </p>
              <p className="text-sm">
                <strong>New Format:</strong> {targetFormat.toUpperCase()}
              </p>
              <p className="text-sm">
                <strong>Original Size:</strong> {getFileSize(file!.size)}
              </p>
              <p className="text-sm">
                <strong>Converted Size:</strong> {getFileSize(result.size)}
              </p>
              {result.size < file!.size && (
                <p className="text-sm text-green-600">
                  <strong>Size Reduced:</strong> {getFileSize(file!.size - result.size)} (
                  {Math.round(((file!.size - result.size) / file!.size) * 100)}%)
                </p>
              )}
            </div>

            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-xs font-medium mb-2">Original ({getSourceFormat()})</p>
                <img
                  src={preview || "/placeholder.svg"}
                  alt="Original"
                  className="w-full h-48 object-contain rounded bg-muted border border-border"
                />
              </div>
              <div>
                <p className="text-xs font-medium mb-2">Converted ({targetFormat.toUpperCase()})</p>
                <img
                  src={URL.createObjectURL(result) || "/placeholder.svg"}
                  alt="Converted"
                  className="w-full h-48 object-contain rounded bg-muted border border-border"
                />
              </div>
            </div>

            <Button onClick={handleDownload} className="w-full" size="lg">
              <Download className="w-5 h-5 mr-2" />
              Download {targetFormat.toUpperCase()} Image
            </Button>
          </Card>
        )}
      </div>

      <FooterCredit />
    </main>
  )
}
