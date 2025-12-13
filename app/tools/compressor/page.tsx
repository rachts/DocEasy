"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { FileUploader } from "@/components/file-uploader"
import { compressImage, compressPDFSimple } from "@/lib/compression-utils"
import { getFileSize } from "@/lib/storage-utils"
import { Download, Info, Loader2 } from "lucide-react"
import { FooterCredit } from "@/components/footer-credit"

export default function CompressorPage() {
  const [file, setFile] = useState<File | null>(null)
  const [quality, setQuality] = useState(70)
  const [compressing, setCompressing] = useState(false)
  const [result, setResult] = useState<Blob | null>(null)
  const [progress, setProgress] = useState(0)

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile)
    setResult(null)
    setProgress(0)
  }

  const handleCompress = async () => {
    if (!file) return

    setCompressing(true)
    setProgress(10)
    try {
      let compressed: Blob

      if (file.type.startsWith("image/")) {
        setProgress(30)
        compressed = await compressImage(file, quality / 100)
        setProgress(90)
      } else if (file.type === "application/pdf") {
        setProgress(30)
        compressed = await compressPDFSimple(file)
        setProgress(90)
      } else {
        alert("Unsupported file type. Please upload an image or PDF.")
        setCompressing(false)
        return
      }

      setProgress(100)
      setResult(compressed)
    } catch (error) {
      console.error("Compression failed:", error)
      alert("Compression failed. Please try again.")
    } finally {
      setCompressing(false)
    }
  }

  const handleDownload = () => {
    if (!result || !file) return

    const url = URL.createObjectURL(result)
    const link = document.createElement("a")
    link.href = url
    link.download = `compressed-${file.name}`
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold mb-2">File Compressor</h1>
      <p className="text-muted-foreground mb-8">Reduce file size while maintaining quality</p>

      <div className="space-y-6">
        <Card className="p-6">
          <h2 className="text-lg font-bold mb-4">Select File</h2>
          <FileUploader onFileSelect={handleFileSelect} loading={compressing} />

          {file && (
            <div className="mt-4 p-3 bg-muted rounded">
              <p className="text-sm">
                <strong>File:</strong> {file.name}
              </p>
              <p className="text-sm">
                <strong>Original Size:</strong> {getFileSize(file.size)}
              </p>
              <p className="text-sm">
                <strong>Type:</strong> {file.type || "Unknown"}
              </p>
            </div>
          )}
        </Card>

        {file && file.type.startsWith("image/") && (
          <Card className="p-6">
            <h2 className="text-lg font-bold mb-4">Compression Quality</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Quality: {quality}%{" "}
                  {quality < 50 ? "(High Compression)" : quality < 80 ? "(Balanced)" : "(High Quality)"}
                </label>
                <input
                  type="range"
                  min="10"
                  max="100"
                  step="5"
                  value={quality}
                  onChange={(e) => setQuality(Number(e.target.value))}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground mt-2">
                  Lower quality = smaller file size. Higher quality = better image.
                </p>
              </div>
            </div>
          </Card>
        )}

        {file && file.type === "application/pdf" && (
          <Card className="p-6 bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
            <div className="flex gap-2 items-start">
              <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-blue-900 dark:text-blue-100">
                <p className="font-medium mb-1">PDF Compression</p>
                <p className="text-blue-700 dark:text-blue-300">
                  PDF compression removes metadata and optimizes the file structure. Results vary depending on the PDF
                  content.
                </p>
              </div>
            </div>
          </Card>
        )}

        {file && (
          <div className="space-y-3">
            {compressing && progress > 0 && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Compressing...</span>
                  <span>{progress}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}
            <Button onClick={handleCompress} disabled={compressing} className="w-full" size="lg">
              {compressing && <Loader2 className="w-5 h-5 mr-2 animate-spin" />}
              {compressing ? "Compressing..." : "Compress File"}
            </Button>
          </div>
        )}

        {result && (
          <Card className="p-6 bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800">
            <h2 className="text-lg font-bold mb-4 text-green-900 dark:text-green-100">Compression Complete!</h2>
            <div className="space-y-3 mb-4">
              <p className="text-sm">
                <strong>Original Size:</strong> {getFileSize(file!.size)}
              </p>
              <p className="text-sm">
                <strong>Compressed Size:</strong> {getFileSize(result.size)}
              </p>
              <p className="text-sm">
                <strong>Size Reduction:</strong>{" "}
                {result.size < file!.size ? (
                  <>
                    {getFileSize(file!.size - result.size)} ({Math.round((1 - result.size / file!.size) * 100)}%
                    smaller)
                  </>
                ) : (
                  <>No reduction (file already optimized)</>
                )}
              </p>
            </div>
            <Button onClick={handleDownload} className="w-full" size="lg">
              <Download className="w-5 h-5 mr-2" />
              Download Compressed File
            </Button>
          </Card>
        )}
      </div>

      <FooterCredit />
    </main>
  )
}
