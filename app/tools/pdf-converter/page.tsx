"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "motion/react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ToolLayout } from "@/components/ui/tool-layout"
import { UploadCard } from "@/components/ui/upload-card"
import { ProcessingStatus, StatusType } from "@/components/ui/processing-status"
import { convertImageToPDF, convertWordToPDF, convertExcelToPDF } from "@/lib/pdf-converter-utils"
import { FileText, Table, ImageIcon } from "lucide-react"

export default function PDFConverterPage() {
  const [file, setFile] = useState<File | null>(null)
  const [activeTab, setActiveTab] = useState("image")
  const [status, setStatus] = useState<StatusType>("idle")
  const [progress, setProgress] = useState(0)
  const [result, setResult] = useState<Blob | null>(null)
  const [error, setError] = useState<string>("")

  const handleUpload = async (selectedFile: File) => {
    setFile(selectedFile)
    setStatus("processing")
    setProgress(10)

    try {
      let pdfBlob: Blob
      setProgress(30)

      if (activeTab === "image") {
        pdfBlob = await convertImageToPDF(selectedFile)
      } else if (activeTab === "word") {
        pdfBlob = await convertWordToPDF(selectedFile)
      } else if (activeTab === "excel") {
        pdfBlob = await convertExcelToPDF(selectedFile)
      } else {
        throw new Error("Invalid conversion type")
      }

      setProgress(80)
      setResult(pdfBlob)

      // Track action
      const token = localStorage.getItem("auth_token")
      if (token) {
        fetch("/api/tool-actions", {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({ fileName: selectedFile.name, fileType: selectedFile.type, action: "convert" }),
        }).catch(console.error)
      }

      setProgress(100)
      setStatus("success")
    } catch (e: any) {
      setError(e.message || "Conversion failed. Please try again.")
      setStatus("error")
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

  const handleReset = () => {
    setFile(null)
    setResult(null)
    setStatus("idle")
    setProgress(0)
    setError("")
  }

  const getAcceptedTypes = () => {
    switch (activeTab) {
      case "image": return "image/png,image/jpeg,image/jpg"
      case "word": return ".docx,.doc"
      case "excel": return ".xlsx,.xls"
      default: return "*"
    }
  }

  return (
    <ToolLayout
      title="PDF Converter"
      description="Convert Word documents, Excel spreadsheets, or Images into high-quality PDF format instantly."
    >
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <AnimatePresence mode="wait">
          {status === "idle" && (
            <motion.div 
              key="idle"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-2xl mx-auto"
            >
              <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
                <TabsList className="grid w-full grid-cols-3 h-14 rounded-2xl bg-card/50 p-1 border border-border/50">
                  <TabsTrigger value="image" className="rounded-xl text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md transition-all">
                    <ImageIcon className="w-4 h-4 mr-2" />
                    Image
                  </TabsTrigger>
                  <TabsTrigger value="word" className="rounded-xl text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md transition-all">
                    <FileText className="w-4 h-4 mr-2" />
                    Word
                  </TabsTrigger>
                  <TabsTrigger value="excel" className="rounded-xl text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md transition-all">
                    <Table className="w-4 h-4 mr-2" />
                    Excel
                  </TabsTrigger>
                </TabsList>
              </Tabs>
              
              <UploadCard 
                onUpload={handleUpload} 
                accept={getAcceptedTypes()}
                title={`Upload ${activeTab === 'image' ? 'an Image' : activeTab === 'word' ? 'a Word Doc' : 'an Excel Sheet'}`}
                icon={activeTab === 'image' ? <ImageIcon className="w-10 h-10" /> : activeTab === 'word' ? <FileText className="w-10 h-10" /> : <Table className="w-10 h-10" />}
              />
            </motion.div>
          )}

          {status !== "idle" && (
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
                title={status === "processing" ? `Converting ${file?.name}...` : undefined}
                description={status === "processing" ? "Translating document layout to PDF..." : undefined}
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
