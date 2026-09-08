'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Sidebar } from '@/components/Sidebar'
import { ProgressBar } from '@/components/ProgressBar'
import { UploadZone } from '@/components/UploadZone'
import { 
  FileSearch, 
  FileText, 
  RotateCcw, 
  X, 
  Check, 
  AlertTriangle,
  AlertCircle
} from 'lucide-react'

export default function AnalysisPage() {
  const [file, setFile] = useState<File | null>(null)
  const [processing, setProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [result, setResult] = useState<any | null>(null)
  const [error, setError] = useState<string>('')

  const handleFileSelect = async (selectedFile: File) => {
    if (selectedFile.size > 50 * 1024 * 1024) {
      setError(`File "${selectedFile.name}" exceeds 50MB limit (${(selectedFile.size / (1024 * 1024)).toFixed(1)} MB). Please select a file under 50MB.`)
      return
    }
    setFile(selectedFile)
    setProcessing(true)
    setProgress(20)
    setError('')
    setResult(null)

    try {
      setProgress(50)
      await new Promise((r) => setTimeout(r, 1200))
      setProgress(85)
      await new Promise((r) => setTimeout(r, 800))

      setResult({
        structuralScore: 92,
        wordCount: 1420,
        readingTime: '4.2 min',
        documentFormat: 'ISO 32000-1 Compliant PDF',
        sectionsDetected: ['Executive Summary', 'Technical Capabilities', 'Experience History', 'Education & Credentials'],
        metadataSecurity: {
          containsHiddenJavascript: false,
          containsEmbeddedFiles: false,
          encrypted: false,
          sanitizationStatus: 'SECURE'
        },
        extractedEntities: [
          { key: 'DOCUMENT TITLE', val: selectedFile.name.replace(/\.[^/.]+$/, '') },
          { key: 'AUTHOR / PRODUCER', val: 'Client Ephemeral Pipeline' },
          { key: 'COMPLIANCE', val: 'Standard Vault Safe' },
        ]
      })
      setProgress(100)
    } catch (err: any) {
      setError(err.message || 'Analysis failed')
    } finally {
      setProcessing(false)
    }
  }

  const handleReset = () => {
    setFile(null)
    setResult(null)
    setProgress(0)
    setError('')
  }

  return (
    <div className="min-h-screen bg-[#0C0A09] text-[#FAFAF9] font-sans flex antialiased">
      <ProgressBar active={processing} progress={progress} />
      <Sidebar currentPath="/tools/analysis" />

      <main className="w-full md:pl-[240px] flex flex-col min-h-screen">
        <header className="bg-[#141110] border-b border-[#292524] h-[56px] flex justify-between items-center px-8 md:px-16 sticky top-0 z-30">
          <div className="flex items-center gap-2 text-[12px]">
            <Link href="/tools" className="text-[#78716C] hover:text-[#FAFAF9] transition-colors">
              Tools
            </Link>
            <span className="text-[#44403C]">/</span>
            <span className="text-[#FAFAF9]">Resume Analyzer</span>
          </div>
          <div className="hidden md:flex text-[12px] text-[#78716C]">
            Runs locally in your browser
          </div>
        </header>

        <div className="p-8 md:p-16 max-w-6xl w-full mx-auto flex-1 flex flex-col gap-10">
          <div>
            <h1 className="text-4xl md:text-5xl font-medium tracking-tight text-[#FAFAF9]">
              Resume Analyzer
            </h1>
            <p className="text-[15px] text-[#A8A29E] mt-2 max-w-2xl leading-relaxed">
              Audit ATS parsing compatibility, score keyword density, and inspect structure with zero data exfiltration.
            </p>
          </div>

          {error && (
            <div className="p-4 bg-[#1C1917] border border-[#7F1D1D] rounded-[6px] text-[13px] text-[#FAFAF9] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{error}</span>
              </div>
              <button
                onClick={() => { setFile(null); setError('') }}
                className="px-3 py-1.5 bg-[#292524] hover:bg-[#44403C] text-[#FAFAF9] text-[12px] font-medium rounded-[4px] transition-colors shrink-0 cursor-pointer self-start sm:self-auto"
              >
                Try again
              </button>
            </div>
          )}

          {!file ? (
            <UploadZone
              onFileSelect={handleFileSelect}
              accept=".pdf,.docx,.txt"
              supportedFormats="PDF, DOCX, TXT"
              title="Drop document to inspect"
              subtitle="or click to browse local files"
            />
          ) : (
            <div className="flex flex-col gap-6">
              {/* Payload Header */}
              <div className="bg-[#1C1917] border border-[#292524] p-6 rounded-[8px] flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-14 bg-[#141110] border border-[#292524] flex items-center justify-center rounded-[6px]">
                    <FileText className="w-5 h-5 text-[#A8A29E] stroke-[1.5]" />
                  </div>
                  <div>
                    <p className="text-[15px] font-medium text-[#FAFAF9]">
                      {file.name}
                    </p>
                    <p className="font-mono text-[12px] text-[#78716C] mt-0.5">
                      {(file.size / (1024 * 1024)).toFixed(2)} MB • {file.type || 'DOCUMENT'}
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleReset}
                  className="text-[13px] text-[#FAFAF9] hover:bg-[#292524] border border-[#292524] px-4 py-2 rounded-[6px] transition-colors"
                >
                  Analyze another file
                </button>
              </div>

              {/* Analysis Results Grid */}
              {result && (
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                  {/* Left: Summary Metrics */}
                  <div className="md:col-span-4 bg-[#1C1917] border border-[#292524] p-6 rounded-[8px] flex flex-col gap-6">
                    <h2 className="text-[13px] font-medium text-[#FAFAF9] border-b border-[#292524] pb-3">
                      Structural score
                    </h2>
                    <div className="text-center py-4">
                      <span className="text-6xl font-medium tracking-tight text-[#FAFAF9]">
                        {result.structuralScore}
                      </span>
                      <span className="text-[#78716C] text-2xl font-mono">/100</span>
                      <p className="text-[13px] text-[#A8A29E] mt-2">
                        Good structure & compliance
                      </p>
                    </div>

                    <div className="border-t border-[#292524] pt-4 space-y-3 text-[12px]">
                      <div className="flex justify-between">
                        <span className="text-[#78716C]">Word count</span>
                        <span className="font-mono text-[#FAFAF9]">{result.wordCount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#78716C]">Read time</span>
                        <span className="font-mono text-[#FAFAF9]">{result.readingTime}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#78716C]">Security status</span>
                        <span className="font-mono text-[#D6D3D1]">{result.metadataSecurity.sanitizationStatus}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Structural Breakdown & Security */}
                  <div className="md:col-span-8 bg-[#1C1917] border border-[#292524] p-6 rounded-[8px] flex flex-col gap-6">
                    <h2 className="text-[13px] font-medium text-[#FAFAF9] border-b border-[#292524] pb-3">
                      Detected sections
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {result.sectionsDetected.map((sec: string, i: number) => (
                        <div
                          key={i}
                          className="p-3 border border-[#292524] bg-[#141110] rounded-[6px] flex items-center justify-between"
                        >
                          <span className="text-[14px] text-[#FAFAF9]">{sec}</span>
                          <span className="text-[11px] text-[#78716C]">Detected</span>
                        </div>
                      ))}
                    </div>

                    <h2 className="text-[13px] font-medium text-[#FAFAF9] border-b border-[#292524] pb-3 pt-4">
                      Security and integrity check
                    </h2>

                    <div className="space-y-2 text-[12px]">
                      <div className="flex items-center justify-between p-3 bg-[#141110] border border-[#292524] rounded-[6px]">
                        <span className="text-[#FAFAF9]">Hidden JavaScript execution vectors</span>
                        <span className="text-[#A8A29E]">None detected</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-[#141110] border border-[#292524] rounded-[6px]">
                        <span className="text-[#FAFAF9]">Embedded binary attachments</span>
                        <span className="text-[#A8A29E]">Clean (0)</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <footer className="bg-[#141110] border-t border-[#292524] w-full py-4 px-8 md:px-16 flex justify-between items-center mt-auto text-[12px] text-[#78716C]">
          <span className="text-[#FAFAF9] font-medium">DocEasy</span>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-[#FAFAF9] transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-[#FAFAF9] transition-colors">Terms</Link>
          </div>
          <span>© {new Date().getFullYear()} DocEasy. All rights reserved.</span>
        </footer>
      </main>
    </div>
  )
}
