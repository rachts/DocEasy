"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileUploader } from "@/components/file-uploader"
import { convertImageToPDF, convertWordToPDF, convertExcelToPDF } from "@/lib/pdf-converter-utils"
import { getFileSize } from "@/lib/storage-utils"
import { Download, FileText, Table, ImageIcon } from "lucide-react"
import { FooterCredit } from "@/components/footer-credit"

export default function PDFConverterPage() {
  const [file, setFile] = useState<File | null>(null)
  const [converting, setConverting] = useState(false)
  const [result, setResult] = useState<Blob | null>(null)
  const [activeTab, setActiveTab] = useState("image")
  const [progress, setProgress] = useState(0)

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile)
    setResult(null)
    setProgress(0)
  }

  const handleConvert = async () => {
    if (!file) return

    setConverting(true)
    setProgress(10)

    try {
      let pdfBlob: Blob

      setProgress(30)

      if (activeTab === "image") {
        pdfBlob = await convertImageToPDF(file)
      } else if (activeTab === "word") {
        pdfBlob = await convertWordToPDF(file)
      } else if (activeTab === "excel") {
        pdfBlob = await convertExcelToPDF(file)
      } else {
        throw new Error("Invalid conversion type")
      }

      setProgress(90)
      setResult(pdfBlob)
      setProgress(100)

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
      alert("Conversion failed. Please try again.")
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
    link.download = `${baseName}.pdf`
    link.click()
    URL.revokeObjectURL(url)
  }

  const getAcceptedTypes = () => {
    switch (activeTab) {
      case "image":
        return "image/png,image/jpeg,image/jpg"
      case "word":
        return ".docx,.doc"
      case "excel":
        return ".xlsx,.xls"
      default:
        return "*"
    }
  }

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold mb-2">PDF Converter</h1>
      <p className="text-muted-foreground mb-8">Convert Word, Excel, or Images to PDF format</p>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="image" className="flex items-center gap-2">
            <ImageIcon className="w-4 h-4" />
            Image → PDF
          </TabsTrigger>
          <TabsTrigger value="word" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Word → PDF
          </TabsTrigger>
          <TabsTrigger value="excel" className="flex items-center gap-2">
            <Table className="w-4 h-4" />
            Excel → PDF
          </TabsTrigger>
        </TabsList>

        <TabsContent value="image" className="space-y-6 mt-6">
          <Card className="p-6">
            <h2 className="text-lg font-bold mb-4">Select Image</h2>
            <p className="text-sm text-muted-foreground mb-4">Supported formats: PNG, JPG, JPEG</p>
            <FileUploader onFileSelect={handleFileSelect} loading={converting} accept={getAcceptedTypes()} />

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
        </TabsContent>

        <TabsContent value="word" className="space-y-6 mt-6">
          <Card className="p-6">
            <h2 className="text-lg font-bold mb-4">Select Word Document</h2>
            <p className="text-sm text-muted-foreground mb-4">Supported formats: DOCX, DOC</p>
            <FileUploader onFileSelect={handleFileSelect} loading={converting} accept={getAcceptedTypes()} />

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
        </TabsContent>

        <TabsContent value="excel" className="space-y-6 mt-6">
          <Card className="p-6">
            <h2 className="text-lg font-bold mb-4">Select Excel Spreadsheet</h2>
            <p className="text-sm text-muted-foreground mb-4">Supported formats: XLSX, XLS</p>
            <FileUploader onFileSelect={handleFileSelect} loading={converting} accept={getAcceptedTypes()} />

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
        </TabsContent>
      </Tabs>

      {file && !result && (
        <Card className="p-6">
          <Button onClick={handleConvert} disabled={converting} className="w-full" size="lg">
            {converting ? `Converting... ${progress}%` : "Convert to PDF"}
          </Button>
        </Card>
      )}

      {result && (
        <Card className="p-6 bg-accent/5 border-accent">
          <h2 className="text-lg font-bold mb-4 text-accent">Conversion Complete</h2>
          <div className="space-y-3 mb-4">
            <p className="text-sm">
              <strong>Original:</strong> {file?.name} ({getFileSize(file?.size || 0)})
            </p>
            <p className="text-sm">
              <strong>PDF Size:</strong> {getFileSize(result.size)}
            </p>
          </div>
          <Button onClick={handleDownload} className="w-full" size="lg">
            <Download className="w-5 h-5 mr-2" />
            Download PDF
          </Button>
        </Card>
      )}

      <FooterCredit />
    </main>
  )
}
