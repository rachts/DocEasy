"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, FileText, CheckCircle2, Sparkles, Loader2, List, Calendar, CheckSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { FileUploader } from "@/components/file-uploader"
import { createClient } from "@/utils/supabase/client"

type SummaryResult = {
  executiveSummary: string
  keyPoints: string[]
  importantDates: { date: string; event: string }[]
  actionItems: string[]
}

export default function PDFSummarizerPage() {
  const [file, setFile] = useState<File | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [statusText, setStatusText] = useState("")
  const [result, setResult] = useState<SummaryResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const supabase = createClient()

  const handleFileSelect = async (selectedFile: File) => {
    if (selectedFile.type !== "application/pdf") {
      setError("Please upload a PDF file.")
      return
    }

    setFile(selectedFile)
    setIsProcessing(true)
    setError(null)

    try {
      // Step 1: Upload mock extraction
      setStatusText("Extracting Text...")
      await new Promise(r => setTimeout(r, 1500))

      // Step 2: Analyze
      setStatusText("Summarizing with Gemini AI...")
      await new Promise(r => setTimeout(r, 2000))

      // Mock Result
      const mockResult: SummaryResult = {
        executiveSummary: "This document outlines the Q3 Financial Report, highlighting a 15% increase in revenue driven by new enterprise software subscriptions. While operational costs grew by 5%, the net profit margin improved significantly. The strategic focus remains on expanding the cloud infrastructure and enhancing AI capabilities.",
        keyPoints: [
          "Q3 Revenue reached $45M, a 15% Year-Over-Year increase.",
          "Enterprise subscription models accounted for 60% of total revenue.",
          "Operational costs increased primarily due to R&D investments.",
          "Customer retention rate remains high at 94%."
        ],
        importantDates: [
          { date: "Oct 15, 2026", event: "Board Meeting to discuss Q4 projections" },
          { date: "Nov 01, 2026", event: "Launch of new AI tools beta" }
        ],
        actionItems: [
          "Finalize the Q4 marketing budget allocation",
          "Schedule technical review for the upcoming cloud infrastructure migration",
          "Publish the Q3 earnings press release"
        ]
      }

      setStatusText("Saving results...")
      
      // Store in Supabase
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        // Upload file to bucket for persistence
        const fileName = `${Date.now()}_${selectedFile.name}`
        const { data: uploadData, error: uploadError } = await supabase.storage.from("uploads").upload(fileName, selectedFile)
        
        if (!uploadError && uploadData) {
          // Create file record
          const { data: fileData, error: fileError } = await supabase.from("files").insert([{
            user_id: user.id,
            file_name: selectedFile.name,
            file_type: selectedFile.type,
            original_size: selectedFile.size,
            storage_path: uploadData.path,
            tool_used: "PDF Summarizer"
          }]).select().single()

          if (!fileError && fileData) {
            // Create AI Job record
            await supabase.from("ai_jobs").insert([{
              user_id: user.id,
              file_id: fileData.id,
              job_type: "pdf_summary",
              result: mockResult
            }])
          }
        }
      }

      setResult(mockResult)
    } catch (err) {
      console.error(err)
      setError("An error occurred during summarization.")
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="min-h-screen bg-background py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/tools">
          <Button variant="ghost" className="mb-8 hover:bg-muted -ml-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Tools
          </Button>
        </Link>

        <div className="text-center mb-12">
          <div className="bg-primary/10 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <FileText className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-foreground mb-4">AI PDF Summarizer</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Upload any long PDF document, and our AI will instantly generate an executive summary, key points, and action items.
          </p>
        </div>

        {!result && !isProcessing && (
          <div className="max-w-2xl mx-auto">
            {error && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl text-center">
                {error}
              </div>
            )}
            <FileUploader onFileSelect={handleFileSelect} accept="application/pdf" />
          </div>
        )}

        {isProcessing && (
          <div className="py-20 flex flex-col items-center justify-center text-center">
            <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
            <h3 className="text-2xl font-bold mb-2">Reading Document</h3>
            <p className="text-muted-foreground">{statusText}</p>
          </div>
        )}

        {result && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-500">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 bg-card border border-border/50 rounded-2xl shadow-sm">
              <div className="flex items-center gap-4">
                <FileText className="w-10 h-10 text-primary" />
                <div>
                  <h3 className="font-bold">{file?.name}</h3>
                  <p className="text-sm text-muted-foreground">Summary Complete</p>
                </div>
              </div>
              <Button onClick={() => { setResult(null); setFile(null) }} variant="outline">
                Summarize Another
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Executive Summary */}
              <div className="md:col-span-2 p-6 bg-card border border-border/50 rounded-2xl shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="w-5 h-5 text-primary" />
                  <h3 className="text-xl font-bold">Executive Summary</h3>
                </div>
                <p className="text-foreground/80 leading-relaxed text-lg">
                  {result.executiveSummary}
                </p>
              </div>

              {/* Key Points */}
              <div className="p-6 bg-card border border-border/50 rounded-2xl shadow-sm">
                <div className="flex items-center gap-2 mb-6">
                  <List className="w-5 h-5 text-primary" />
                  <h3 className="text-lg font-bold">Key Points</h3>
                </div>
                <ul className="space-y-3">
                  {result.keyPoints.map((point, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-primary/20 text-primary flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">
                        {idx + 1}
                      </div>
                      <span className="text-foreground/80 leading-relaxed">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-6">
                {/* Important Dates */}
                <div className="p-6 bg-card border border-border/50 rounded-2xl shadow-sm">
                  <div className="flex items-center gap-2 mb-6">
                    <Calendar className="w-5 h-5 text-primary" />
                    <h3 className="text-lg font-bold">Important Dates</h3>
                  </div>
                  <ul className="space-y-4">
                    {result.importantDates.map((item, idx) => (
                      <li key={idx} className="flex flex-col">
                        <span className="font-bold text-foreground mb-1">{item.date}</span>
                        <span className="text-sm text-muted-foreground leading-relaxed">{item.event}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Action Items */}
                <div className="p-6 bg-card border border-border/50 rounded-2xl shadow-sm">
                  <div className="flex items-center gap-2 mb-6">
                    <CheckSquare className="w-5 h-5 text-primary" />
                    <h3 className="text-lg font-bold">Action Items</h3>
                  </div>
                  <ul className="space-y-3">
                    {result.actionItems.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                        <span className="text-foreground/80 leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
