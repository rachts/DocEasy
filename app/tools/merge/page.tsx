'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Sidebar } from '@/components/Sidebar'
import { ProgressBar } from '@/components/ProgressBar'
import { UploadZone } from '@/components/UploadZone'
import { 
  FileText, 
  X, 
  ArrowRight, 
  Download, 
  ArrowUp, 
  ArrowDown, 
  RotateCcw,
  Plus
} from 'lucide-react'
import { uploadFileToSupabase, saveFileMetadata, trackEvent, addToRecentFiles } from '@/lib/supabase/helpers'

export default function MergePDFPage() {
  const [files, setFiles] = useState<File[]>([])
  const [processing, setProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null)
  const [error, setError] = useState<string>('')

  const handleFileSelect = (selectedFile: File) => {
    if (selectedFile.type !== 'application/pdf' && !selectedFile.name.endsWith('.pdf')) {
      setError('Only PDF files are supported for merging')
      return
    }
    setFiles((prev) => [...prev, selectedFile])
    setDownloadUrl(null)
    setError('')
  }

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const moveUp = (index: number) => {
    if (index === 0) return
    setFiles((prev) => {
      const copy = [...prev]
      const temp = copy[index - 1]
      copy[index - 1] = copy[index]
      copy[index] = temp
      return copy
    })
  }

  const moveDown = (index: number) => {
    if (index === files.length - 1) return
    setFiles((prev) => {
      const copy = [...prev]
      const temp = copy[index + 1]
      copy[index + 1] = copy[index]
      copy[index] = temp
      return copy
    })
  }

  const handleMerge = async () => {
    if (files.length < 2) {
      setError('Please add at least 2 PDF files to merge')
      return
    }

    setProcessing(true)
    setProgress(15)
    setError('')

    try {
      const { PDFDocument } = await import('pdf-lib')
      const mergedPdf = await PDFDocument.create()

      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const arrayBuffer = await file.arrayBuffer()
        const pdf = await PDFDocument.load(arrayBuffer)
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices())
        copiedPages.forEach((page) => mergedPdf.addPage(page))
        setProgress(15 + Math.round(((i + 1) / files.length) * 60))
      }

      const mergedPdfBytes = await mergedPdf.save()
      const mergedBlob = new Blob([mergedPdfBytes], { type: 'application/pdf' })
      const fileName = `merged_document_${Date.now()}.pdf`

      setProgress(85)
      const { filePath, publicUrl } = await uploadFileToSupabase(mergedBlob, fileName, 'pdf-merger')

      await saveFileMetadata({
        file_name: fileName,
        file_type: 'application/pdf',
        file_size: mergedBlob.size,
        tool_used: 'pdf-merger',
        storage_path: filePath,
        download_url: publicUrl,
        is_saved: false,
      })

      addToRecentFiles({
        name: fileName,
        url: publicUrl,
        tool: 'pdf-merger',
        timestamp: Date.now(),
      })

      trackEvent('merge', 'pdf_merger')

      setDownloadUrl(publicUrl)
      setProgress(100)
    } catch (err: any) {
      console.error('Merge error:', err)
      setError(err.message || 'Failed to merge PDF documents')
    } finally {
      setProcessing(false)
    }
  }

  const handleReset = () => {
    setFiles([])
    setDownloadUrl(null)
    setProgress(0)
    setError('')
  }

  return (
    <div className="min-h-screen bg-[#0C0A09] text-[#FAFAF9] font-sans flex antialiased">
      <ProgressBar active={processing} progress={progress} />
      <Sidebar currentPath="/tools/merge" />

      <main className="w-full md:pl-[240px] flex flex-col min-h-screen">
        {/* Top Breadcrumb Bar */}
        <header className="bg-[#141110] border-b border-[#292524] h-[56px] flex justify-between items-center px-8 md:px-16 sticky top-0 z-30">
          <div className="flex items-center gap-2 font-mono text-[12px] uppercase tracking-[0.05em]">
            <span className="text-[#57534E]">TOOLING</span>
            <span className="text-[#292524]">/</span>
            <span className="text-[#FAFAF9]">MERGE PDF</span>
          </div>
          <div className="hidden md:flex gap-6 font-mono text-[11px] uppercase tracking-[0.05em] text-[#57534E]">
            <span>PAGE STITCHING ENGINE</span>
            <span>•</span>
            <span>ZERO CLOUD RETENTION</span>
          </div>
        </header>

        {/* Workspace Body */}
        <div className="p-8 md:p-16 max-w-6xl w-full mx-auto flex-1 flex flex-col gap-10">
          <div>
            <h1 className="text-4xl md:text-5xl font-medium tracking-tight text-[#FAFAF9]">
              Merge PDF Documents
            </h1>
            <p className="text-[15px] text-[#A8A29E] mt-2 max-w-2xl leading-relaxed">
              Combine multiple PDF files into a single structured document. Reorder pages directly with local in-browser compilation.
            </p>
          </div>

          {error && (
            <div className="p-4 bg-[#1C1917] border border-[#7F1D1D] rounded-[6px] text-[13px] font-mono text-[#FAFAF9]">
              [ERROR]: {error}
            </div>
          )}

          {/* Drop Zone */}
          <UploadZone
            onFileSelect={handleFileSelect}
            accept=".pdf"
            supportedFormats="PDF ONLY"
            title={files.length > 0 ? "Add Another PDF File" : "Drop PDF Files Here"}
            subtitle="Click or drag additional documents to append"
          />

          {/* Sequence Payload Area */}
          {files.length > 0 && (
            <div className="bg-[#1C1917] border border-[#292524] p-6 rounded-[8px] flex flex-col gap-6">
              <div className="flex justify-between items-center border-b border-[#292524] pb-3">
                <h2 className="font-mono text-[12px] uppercase tracking-[0.05em] text-[#57534E]">
                  Merge Sequence ({files.length} {files.length === 1 ? 'FILE' : 'FILES'})
                </h2>
                <button
                  onClick={handleReset}
                  className="font-mono text-[11px] uppercase tracking-[0.05em] text-[#57534E] hover:text-[#FAFAF9] transition-colors"
                >
                  Clear All
                </button>
              </div>

              <ul className="flex flex-col gap-2">
                {files.map((f, index) => (
                  <li
                    key={index}
                    className="flex items-center justify-between p-4 border border-[#292524] bg-[#141110] rounded-[6px]"
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <span className="font-mono text-[12px] font-medium text-[#57534E] w-6">
                        #{index + 1}
                      </span>
                      <div className="w-10 h-10 bg-[#1C1917] border border-[#292524] flex items-center justify-center rounded-[4px] shrink-0">
                        <FileText className="w-4 h-4 text-[#A8A29E] stroke-[1.5]" />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-[14px] text-[#FAFAF9] truncate max-w-sm md:max-w-md">
                          {f.name}
                        </span>
                        <span className="font-mono text-[11px] text-[#57534E]">
                          {(f.size / (1024 * 1024)).toFixed(2)} MB
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => moveUp(index)}
                        disabled={index === 0}
                        className="p-1.5 text-[#57534E] hover:text-[#FAFAF9] disabled:opacity-20 transition-colors"
                        title="Move Up"
                      >
                        <ArrowUp className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => moveDown(index)}
                        disabled={index === files.length - 1}
                        className="p-1.5 text-[#57534E] hover:text-[#FAFAF9] disabled:opacity-20 transition-colors"
                        title="Move Down"
                      >
                        <ArrowDown className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => removeFile(index)}
                        className="p-1.5 text-[#57534E] hover:text-[#7F1D1D] transition-colors ml-2"
                        title="Remove"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>

              {downloadUrl ? (
                <div className="mt-4 pt-4 border-t border-[#292524] flex flex-col sm:flex-row gap-4">
                  <a
                    href={downloadUrl}
                    download={`merged_document_${Date.now()}.pdf`}
                    className="flex-1 h-10 bg-[#FAFAF9] text-[#0C0A09] font-mono text-[12px] uppercase font-medium tracking-[0.05em] rounded-[6px] hover:bg-[#D6D3D1] transition-colors duration-150 flex items-center justify-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    DOWNLOAD MERGED PDF
                  </a>
                  <button
                    onClick={handleReset}
                    className="h-10 px-6 bg-transparent text-[#A8A29E] hover:text-[#FAFAF9] border border-[#292524] hover:border-[#A8A29E] font-mono text-[12px] uppercase tracking-[0.05em] rounded-[6px] transition-colors duration-150 flex items-center justify-center gap-2"
                  >
                    <RotateCcw className="w-4 h-4" />
                    MERGE NEW SET
                  </button>
                </div>
              ) : (
                <div className="mt-4 pt-4 border-t border-[#292524] flex justify-end">
                  <button
                    onClick={handleMerge}
                    disabled={processing || files.length < 2}
                    className="w-full sm:w-auto px-8 h-10 bg-[#FAFAF9] text-[#0C0A09] font-mono text-[12px] uppercase font-medium tracking-[0.05em] rounded-[6px] hover:bg-[#D6D3D1] transition-colors duration-150 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {processing ? (
                      <>
                        <div className="w-2 h-2 rounded-full bg-[#0C0A09] pulse-dot" />
                        MERGING ({progress}%)
                      </>
                    ) : (
                      <>
                        MERGE {files.length} DOCUMENTS
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className="bg-[#141110] border-t border-[#292524] w-full py-4 px-8 md:px-16 flex justify-between items-center mt-auto font-mono text-[11px] uppercase tracking-[0.05em] text-[#57534E]">
          <span className="text-[#FAFAF9] font-semibold tracking-normal font-sans">DocEasy</span>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-[#FAFAF9] transition-colors">PRIVACY</Link>
            <Link href="/terms" className="hover:text-[#FAFAF9] transition-colors">TERMS</Link>
          </div>
          <span>© 2024 DOCEASY</span>
        </footer>
      </main>
    </div>
  )
}
