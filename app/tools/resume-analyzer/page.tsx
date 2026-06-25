"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, FileText, CheckCircle2, AlertTriangle, Sparkles, Loader2, Target, Search, FileEdit } from "lucide-react"
import { Button } from "@/components/ui/button"
import { FileUploader } from "@/components/file-uploader"
import { createClient } from "@/utils/supabase/client"

type AnalysisResult = {
  atsScore: number
  missingKeywords: string[]
  skillsAnalysis: { skill: string; present: boolean }[]
  formattingIssues: string[]
  improvementSuggestions: string[]
}

export default function ResumeAnalyzerPage() {
  const [file, setFile] = useState<File | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [statusText, setStatusText] = useState("")
  const [result, setResult] = useState<AnalysisResult | null>(null)
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
      setStatusText("Analyzing with Gemini AI...")
      await new Promise(r => setTimeout(r, 2000))

      // Mock Result
      const mockResult: AnalysisResult = {
        atsScore: 78,
        missingKeywords: ["Agile", "TypeScript", "CI/CD", "Docker"],
        skillsAnalysis: [
          { skill: "React", present: true },
          { skill: "Next.js", present: true },
          { skill: "GraphQL", present: false },
          { skill: "PostgreSQL", present: true },
        ],
        formattingIssues: [
          "Inconsistent bullet point styles",
          "Contact information is missing a LinkedIn profile link",
        ],
        improvementSuggestions: [
          "Quantify your achievements with metrics (e.g., 'improved performance by 20%')",
          "Add a short professional summary at the top",
          "Tailor your skills section to match the job description more closely"
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
            tool_used: "Resume Analyzer"
          }]).select().single()

          if (!fileError && fileData) {
            // Create AI Job record
            await supabase.from("ai_jobs").insert([{
              user_id: user.id,
              file_id: fileData.id,
              job_type: "resume_analysis",
              result: mockResult
            }])
          }
        }
      }

      setResult(mockResult)
    } catch (err) {
      console.error(err)
      setError("An error occurred during analysis.")
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
            <Sparkles className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-foreground mb-4">AI Resume Analyzer</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Upload your resume and our AI will analyze it against industry standards, giving you an ATS score, missing keywords, and formatting suggestions.
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
            <h3 className="text-2xl font-bold mb-2">Analyzing Resume</h3>
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
                  <p className="text-sm text-muted-foreground">Analysis Complete</p>
                </div>
              </div>
              <Button onClick={() => { setResult(null); setFile(null) }} variant="outline">
                Analyze Another
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* ATS Score */}
              <div className="md:col-span-1 p-6 bg-card border border-border/50 rounded-2xl shadow-sm flex flex-col items-center justify-center text-center">
                <Target className="w-8 h-8 text-primary mb-4" />
                <h3 className="text-lg font-bold mb-2">ATS Score</h3>
                <div className="relative w-32 h-32 flex items-center justify-center">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-muted/30"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                    />
                    <path
                      className={result.atsScore > 75 ? "text-green-500" : result.atsScore > 50 ? "text-yellow-500" : "text-red-500"}
                      strokeDasharray={`${result.atsScore}, 100`}
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute text-3xl font-extrabold">{result.atsScore}</div>
                </div>
                <p className="text-sm text-muted-foreground mt-4">Out of 100</p>
              </div>

              {/* Skills Analysis */}
              <div className="md:col-span-2 p-6 bg-card border border-border/50 rounded-2xl shadow-sm">
                <div className="flex items-center gap-2 mb-6">
                  <Search className="w-5 h-5 text-primary" />
                  <h3 className="text-lg font-bold">Skills Analysis</h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {result.skillsAnalysis.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 p-3 bg-muted/30 rounded-lg">
                      {item.present ? (
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                      ) : (
                        <AlertTriangle className="w-5 h-5 text-yellow-500" />
                      )}
                      <span className="font-medium">{item.skill}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-8">
                  <h4 className="font-semibold mb-3 text-sm text-muted-foreground uppercase tracking-wider">Missing Keywords</h4>
                  <div className="flex flex-wrap gap-2">
                    {result.missingKeywords.map((kw, idx) => (
                      <span key={idx} className="px-3 py-1 bg-red-500/10 text-red-500 rounded-full text-sm font-medium">
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Formatting Issues */}
              <div className="p-6 bg-card border border-border/50 rounded-2xl shadow-sm">
                <div className="flex items-center gap-2 mb-6">
                  <FileEdit className="w-5 h-5 text-primary" />
                  <h3 className="text-lg font-bold">Formatting Issues</h3>
                </div>
                <ul className="space-y-3">
                  {result.formattingIssues.map((issue, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
                      <span className="text-foreground/80 leading-relaxed">{issue}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Improvement Suggestions */}
              <div className="p-6 bg-card border border-border/50 rounded-2xl shadow-sm">
                <div className="flex items-center gap-2 mb-6">
                  <Sparkles className="w-5 h-5 text-primary" />
                  <h3 className="text-lg font-bold">Improvement Suggestions</h3>
                </div>
                <ul className="space-y-3">
                  {result.improvementSuggestions.map((suggestion, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-primary/20 text-primary flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">
                        {idx + 1}
                      </div>
                      <span className="text-foreground/80 leading-relaxed">{suggestion}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
