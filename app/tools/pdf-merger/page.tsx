"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Download, X, FilePlus } from "lucide-react"
import { FooterCredit } from "@/components/footer-credit"

export default function PDFMergerPage() {
  const [files, setFiles] = useState<File[]>([])
  const [merging, setMerging] = useState(false)
  const [mergedPDF, setMergedPDF] = useState<Blob | null>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || [])
    const pdfFiles = selectedFiles.filter((f) => f.type === "application/pdf")
    setFiles((prev) => [...prev, ...pdfFiles])
    setMergedPDF(null)
  }

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const moveUp = (index: number) => {
    if (index === 0) return
    setFiles((prev) => {
      const newFiles = [...prev]
      ;[newFiles[index - 1], newFiles[index]] = [newFiles[index], newFiles[index - 1]]
      return newFiles
    })
  }

  const moveDown = (index: number) => {
    if (index === files.length - 1) return
    setFiles((prev) => {
      const newFiles = [...prev]
      ;[newFiles[index], newFiles[index + 1]] = [newFiles[index + 1], newFiles[index]]
      return newFiles
    })
  }

  const handleMerge = async () => {
    if (files.length < 2) {
      alert("Please select at least 2 PDF files to merge")
      return
    }

    setMerging(true)
    try {
      const { PDFDocument } = await import("pdf-lib")
      const mergedPdf = await PDFDocument.create()

      for (const file of files) {
        const arrayBuffer = await file.arrayBuffer()
        const pdf = await PDFDocument.load(arrayBuffer)
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices())
        copiedPages.forEach((page) => mergedPdf.addPage(page))
      }

      const mergedPdfBytes = await mergedPdf.save()
      const blob = new Blob([mergedPdfBytes], { type: "application/pdf" })
      setMergedPDF(blob)
    } catch (error) {
      console.error("Merge error:", error)
      alert("Failed to merge PDFs. Please try again.")
    } finally {
      setMerging(false)
    }
  }

  const handleDownload = () => {
    if (!mergedPDF) return
    const url = URL.createObjectURL(mergedPDF)
    const link = document.createElement("a")
    link.href = url
    link.download = "merged-document.pdf"
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold mb-2">PDF Merger</h1>
      <p className="text-muted-foreground mb-8">Combine multiple PDF files into one document</p>

      <div className="space-y-6">
        <Card className="p-6">
          <label
            htmlFor="file-upload"
            className="flex flex-col items-center justify-center border-2 border-dashed border-border rounded-lg p-12 cursor-pointer hover:border-primary transition-colors"
          >
            <FilePlus className="w-12 h-12 text-muted-foreground mb-4" />
            <p className="text-sm font-medium mb-1">Click to add PDF files</p>
            <p className="text-xs text-muted-foreground">or drag and drop</p>
            <input
              id="file-upload"
              type="file"
              accept="application/pdf"
              multiple
              onChange={handleFileSelect}
              className="hidden"
            />
          </label>
        </Card>

        {files.length > 0 && (
          <Card className="p-6">
            <h2 className="text-lg font-bold mb-4">Selected Files ({files.length})</h2>
            <div className="space-y-2">
              {files.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted rounded">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <span className="text-sm font-medium text-muted-foreground">#{index + 1}</span>
                    <span className="text-sm truncate">{file.name}</span>
                    <span className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(1)} KB</span>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm" onClick={() => moveUp(index)} disabled={index === 0}>
                      ↑
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => moveDown(index)}
                      disabled={index === files.length - 1}
                    >
                      ↓
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => removeFile(index)}>
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <Button onClick={handleMerge} disabled={merging || files.length < 2} className="w-full mt-4" size="lg">
              {merging ? "Merging..." : `Merge ${files.length} PDF Files`}
            </Button>
          </Card>
        )}

        {mergedPDF && (
          <Card className="p-6 bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800">
            <h2 className="text-lg font-bold mb-4 text-green-900 dark:text-green-100">Merge Complete!</h2>
            <p className="text-sm mb-4">
              Successfully merged {files.length} PDF files. Total size: {(mergedPDF.size / 1024).toFixed(1)} KB
            </p>
            <Button onClick={handleDownload} className="w-full" size="lg">
              <Download className="w-5 h-5 mr-2" />
              Download Merged PDF
            </Button>
          </Card>
        )}
      </div>

      <FooterCredit />
    </main>
  )
}
