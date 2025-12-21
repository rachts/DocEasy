"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { FileUploader } from "@/components/file-uploader"
import { getFileSize } from "@/lib/storage-utils"
import { Download, FileText, ImageIcon, Copy, Check } from "lucide-react"
import { FooterCredit } from "@/components/footer-credit"

interface ExtractedData {
  text?: string
  images?: string[]
  pageCount: number
}

export default function PDFExtractorPage() {
  const [file, setFile] = useState<File | null>(null)
  const [extracting, setExtracting] = useState(false)
  const [result, setResult] = useState<ExtractedData | null>(null)
  const [extractText, setExtractText] = useState(true)
  const [extractImages, setExtractImages] = useState(true)
  const [copied, setCopied] = useState(false)

  const handleFileSelect = (selectedFile: File) => {
    if (selectedFile.type !== "application/pdf") {
      alert("Please select a PDF file")
      return
    }
    setFile(selectedFile)
    setResult(null)
  }

  const handleExtract = async () => {
    if (!file) return

    setExtracting(true)

    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/pdf-extract", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Extraction failed")
      }

      const data = await response.json()

      setResult({
        text: extractText ? data.text : undefined,
        images: extractImages ? [] : undefined,
        pageCount: data.pageCount,
      })

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
            action: "extract",
          }),
        })
      }
    } catch (error) {
      console.error("Extraction failed:", error)
      alert("Failed to extract data from PDF. Please try again.")
    } finally {
      setExtracting(false)
    }
  }

  const handleCopyText = () => {
    if (result?.text) {
      navigator.clipboard.writeText(result.text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleDownloadText = () => {
    if (!result?.text) return

    const blob = new Blob([result.text], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `${file?.name.replace(".pdf", "")}-extracted.txt`
    link.click()
    URL.revokeObjectURL(url)
  }

  const handleDownloadImage = (imageData: string, index: number) => {
    const link = document.createElement("a")
    link.href = imageData
    link.download = `${file?.name.replace(".pdf", "")}-image-${index + 1}.png`
    link.click()
  }

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold mb-2">PDF Extractor</h1>
      <p className="text-muted-foreground mb-8">Extract text and images from PDF files</p>

      <div className="space-y-6">
        <Card className="p-6">
          <h2 className="text-lg font-bold mb-4">Select PDF File</h2>
          <FileUploader onFileSelect={handleFileSelect} loading={extracting} accept="application/pdf" />

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

        {file && !result && (
          <Card className="p-6">
            <h2 className="text-lg font-bold mb-4">Extraction Options</h2>
            <div className="space-y-3 mb-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={extractText}
                  onChange={(e) => setExtractText(e.target.checked)}
                  className="w-4 h-4"
                />
                <FileText className="w-4 h-4" />
                <span>Extract Text</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={extractImages}
                  onChange={(e) => setExtractImages(e.target.checked)}
                  className="w-4 h-4"
                />
                <ImageIcon className="w-4 h-4" />
                <span>Extract Images</span>
              </label>
            </div>

            <Button
              onClick={handleExtract}
              disabled={extracting || (!extractText && !extractImages)}
              className="w-full"
              size="lg"
            >
              {extracting ? "Extracting..." : "Extract Data"}
            </Button>
          </Card>
        )}

        {result && (
          <div className="space-y-6">
            <Card className="p-6 bg-accent/5 border-accent">
              <h2 className="text-lg font-bold mb-4 text-accent">Extraction Complete</h2>
              <p className="text-sm mb-2">
                <strong>Pages:</strong> {result.pageCount}
              </p>
              {result.text && (
                <p className="text-sm mb-2">
                  <strong>Text Characters:</strong> {result.text.length}
                </p>
              )}
              {result.images && (
                <p className="text-sm">
                  <strong>Images Found:</strong> {result.images.length}
                </p>
              )}
            </Card>

            {result.text && (
              <Card className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-bold">Extracted Text</h2>
                  <div className="flex gap-2">
                    <Button onClick={handleCopyText} variant="outline" size="sm">
                      {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                      {copied ? "Copied!" : "Copy"}
                    </Button>
                    <Button onClick={handleDownloadText} variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </div>
                <div className="bg-muted p-4 rounded max-h-96 overflow-y-auto">
                  <pre className="text-sm whitespace-pre-wrap font-mono">{result.text}</pre>
                </div>
              </Card>
            )}

            {result.images && result.images.length > 0 && (
              <Card className="p-6">
                <h2 className="text-lg font-bold mb-4">Extracted Images</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {result.images.map((imageData, index) => (
                    <div key={index} className="border border-border rounded p-4">
                      <img
                        src={imageData || "/placeholder.svg"}
                        alt={`Extracted ${index + 1}`}
                        className="w-full h-48 object-contain mb-3 bg-muted rounded"
                      />
                      <Button
                        onClick={() => handleDownloadImage(imageData, index)}
                        variant="outline"
                        size="sm"
                        className="w-full"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download Image {index + 1}
                      </Button>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>
        )}
      </div>

      <FooterCredit />
    </main>
  )
}
