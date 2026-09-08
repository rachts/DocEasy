'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Sidebar } from '@/components/Sidebar'
import { ProgressBar } from '@/components/ProgressBar'
import { UploadZone } from '@/components/UploadZone'
import { 
  FileText, 
  Image as ImageIcon,
  X, 
  ArrowRight, 
  Download, 
  ArrowUp, 
  ArrowDown, 
  RotateCcw,
  Plus,
  AlertCircle
} from 'lucide-react'
import { uploadFileToSupabase, saveFileMetadata, trackEvent, addToRecentFiles } from '@/lib/supabase/helpers'

// Rasterize an image to a PDF page using an off-screen HTML canvas
async function rasterizeImageToPdf(file: File, mergedPdf: any): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    const img = new Image()
    const url = URL.createObjectURL(file)
    img.onload = async () => {
      URL.revokeObjectURL(url)
      try {
        const canvas = document.createElement('canvas')
        const width = img.naturalWidth || img.width
        const height = img.naturalHeight || img.height
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        if (!ctx) throw new Error('Canvas 2D context unavailable')

        ctx.drawImage(img, 0, 0)

        // Convert canvas raster to PNG bytes
        const dataUrl = canvas.toDataURL('image/png')
        const base64Data = dataUrl.split(',')[1]
        const binaryStr = atob(base64Data)
        const bytes = new Uint8Array(binaryStr.length)
        for (let i = 0; i < binaryStr.length; i++) {
          bytes[i] = binaryStr.charCodeAt(i)
        }

        const embeddedPng = await mergedPdf.embedPng(bytes)

        // Standard A4 dimensions in PDF points (72 pt/inch)
        const isLandscape = width > height
        const pageWidth = isLandscape ? 841.89 : 595.28
        const pageHeight = isLandscape ? 595.28 : 841.89

        const margin = 20
        const availWidth = pageWidth - (margin * 2)
        const availHeight = pageHeight - (margin * 2)

        const scale = Math.min(availWidth / width, availHeight / height)
        const drawWidth = width * scale
        const drawHeight = height * scale

        const x = (pageWidth - drawWidth) / 2
        const y = (pageHeight - drawHeight) / 2

        const page = mergedPdf.addPage([pageWidth, pageHeight])
        page.drawImage(embeddedPng, {
          x,
          y,
          width: drawWidth,
          height: drawHeight,
        })
        resolve()
      } catch (err) {
        reject(err)
      }
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error(`Failed to load image: ${file.name}`))
    }
    img.src = url
  })
}

export default function MergePDFPage() {
  const [files, setFiles] = useState<File[]>([])
  const [processing, setProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null)
  const [error, setError] = useState<string>('')

  const handleFileSelect = (selectedFile: File) => {
    const isPdf = selectedFile.type === 'application/pdf' || selectedFile.name.toLowerCase().endsWith('.pdf')
    const isImage = selectedFile.type.startsWith('image/') || /\.(png|jpe?g|webp|avif|gif)$/i.test(selectedFile.name)

    if (!isPdf && !isImage) {
      setError('Only PDF files and image formats (PNG, JPG, WebP, AVIF) are supported')
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
      setError('Please add at least 2 documents or images to merge')
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
        const isImage = file.type.startsWith('image/') || /\.(png|jpe?g|webp|avif|gif)$/i.test(file.name)

        if (isImage) {
          await rasterizeImageToPdf(file, mergedPdf)
        } else {
          const arrayBuffer = await file.arrayBuffer()
          const pdf = await PDFDocument.load(arrayBuffer)
          const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices())
          copiedPages.forEach((page) => mergedPdf.addPage(page))
        }

        setProgress(15 + Math.round(((i + 1) / files.length) * 65))
      }

      const mergedPdfBytes = await mergedPdf.save()
      const mergedBlob = new Blob([mergedPdfBytes], { type: 'application/pdf' })
      const fileName = `merged_document_${Date.now()}.pdf`
      const localUrl = URL.createObjectURL(mergedBlob)

      setProgress(85)
      try {
        const { filePath, publicUrl } = await uploadFileToSupabase(mergedBlob, fileName, 'pdf-merger')
        await saveFileMetadata({
          file_name: fileName,
          file_type: 'application/pdf',
          file_size: mergedBlob.size,
          tool_used: 'pdf-merger',
          storage_path: filePath,
          download_url: publicUrl || localUrl,
          is_saved: false,
        })
        addToRecentFiles({
          name: fileName,
          url: publicUrl || localUrl,
          tool: 'pdf-merger',
          timestamp: Date.now(),
        })
        trackEvent('merge', 'pdf_merger')
      } catch (metaErr) {
        console.warn('Metadata save error:', metaErr)
      }

      setDownloadUrl(localUrl)
      setProgress(100)
    } catch (err: any) {
      console.error('Merge error:', err)
      setError(err.message || 'Failed to merge documents')
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
          <div className="flex items-center gap-2 text-[12px]">
            <Link href="/tools" className="text-[#78716C] hover:text-[#FAFAF9] transition-colors">
              Tools
            </Link>
            <span className="text-[#44403C]">/</span>
            <span className="text-[#FAFAF9]">PDF Merger</span>
          </div>
          <div className="hidden md:flex text-[12px] text-[#78716C]">
            Zero server uploads
          </div>
        </header>

        {/* Workspace Body */}
        <div className="p-8 md:p-16 max-w-6xl w-full mx-auto flex-1 flex flex-col gap-10">
          <div>
            <h1 className="text-4xl md:text-5xl font-medium tracking-tight text-[#FAFAF9]">
              PDF Merger
            </h1>
            <p className="text-[15px] text-[#A8A29E] mt-2 max-w-2xl leading-relaxed">
              Combine multiple PDF files and images (PNG, JPG, WebP) into a single structured document. Reorder pages directly with local in-browser compilation.
            </p>
          </div>

          {error && (
            <div className="p-4 bg-[#1C1917] border border-[#7F1D1D] rounded-[6px] text-[13px] text-[#FAFAF9] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{error}</span>
              </div>
              <button
                onClick={() => setError('')}
                className="px-3 py-1.5 bg-[#292524] hover:bg-[#44403C] text-[#FAFAF9] text-[12px] font-medium rounded-[4px] transition-colors shrink-0 cursor-pointer self-start sm:self-auto"
              >
                Dismiss & retry
              </button>
            </div>
          )}

          {/* Drop Zone */}
          <UploadZone
            onFileSelect={handleFileSelect}
            accept=".pdf,.png,.jpg,.jpeg,.webp,.avif"
            supportedFormats="PDF, PNG, JPG, WEBP, AVIF"
            title={files.length > 0 ? "Add another PDF or image" : "Drop PDF or image files here"}
            subtitle="Click or drag additional documents or images to append"
          />

          {/* Sequence Payload Area */}
          {files.length > 0 && (
            <div className="bg-[#1C1917] border border-[#292524] p-6 rounded-[8px] flex flex-col gap-6">
              <div className="flex justify-between items-center border-b border-[#292524] pb-3">
                <h2 className="text-[13px] font-medium text-[#FAFAF9]">
                  Merge sequence ({files.length} {files.length === 1 ? 'file' : 'files'})
                </h2>
                <button
                  onClick={handleReset}
                  className="text-[12px] text-[#78716C] hover:text-[#FAFAF9] transition-colors"
                >
                  Clear all
                </button>
              </div>

              <ul className="flex flex-col gap-2">
                {files.map((f, index) => {
                  const isImg = f.type.startsWith('image/') || /\.(png|jpe?g|webp|avif|gif)$/i.test(f.name)
                  return (
                    <li
                      key={index}
                      className="flex items-center justify-between p-4 border border-[#292524] bg-[#141110] rounded-[6px]"
                    >
                      <div className="flex items-center gap-4 min-w-0">
                        <span className="font-mono text-[12px] font-medium text-[#78716C] w-6">
                          #{index + 1}
                        </span>
                        <div className="w-10 h-10 bg-[#1C1917] border border-[#292524] flex items-center justify-center rounded-[6px] shrink-0">
                          {isImg ? (
                            <ImageIcon className="w-4 h-4 text-[#D97706] stroke-[1.5]" />
                          ) : (
                            <FileText className="w-4 h-4 text-[#A8A29E] stroke-[1.5]" />
                          )}
                        </div>
                        <div className="flex flex-col min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-[14px] text-[#FAFAF9] truncate max-w-sm md:max-w-md">
                              {f.name}
                            </span>
                            <span className="text-[11px] px-1.5 py-0.5 rounded bg-[#292524] text-[#A8A29E]">
                              {isImg ? 'IMAGE' : 'PDF'}
                            </span>
                          </div>
                          <span className="font-mono text-[12px] text-[#78716C]">
                            {(f.size / (1024 * 1024)).toFixed(2)} MB
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => moveUp(index)}
                          disabled={index === 0}
                          className="p-1.5 text-[#78716C] hover:text-[#FAFAF9] disabled:opacity-20 transition-colors"
                          title="Move up"
                        >
                          <ArrowUp className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => moveDown(index)}
                          disabled={index === files.length - 1}
                          className="p-1.5 text-[#78716C] hover:text-[#FAFAF9] disabled:opacity-20 transition-colors"
                          title="Move down"
                        >
                          <ArrowDown className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => removeFile(index)}
                          className="p-1.5 text-[#78716C] hover:text-[#EF4444] transition-colors ml-2"
                          title="Remove"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </li>
                  )
                })}
              </ul>

              {downloadUrl ? (
                <div className="mt-4 pt-4 border-t border-[#292524] flex flex-col sm:flex-row gap-4">
                  <a
                    href={downloadUrl}
                    download={`merged_document_${Date.now()}.pdf`}
                    className="flex-1 h-10 bg-[#FAFAF9] text-[#0C0A09] text-[13px] font-medium rounded-[6px] hover:bg-[#E7E5E4] transition-colors duration-150 flex items-center justify-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Download merged PDF
                  </a>
                  <button
                    onClick={handleReset}
                    className="h-10 px-6 bg-transparent text-[#A8A29E] hover:text-[#FAFAF9] border border-[#292524] hover:border-[#A8A29E] text-[13px] rounded-[6px] transition-colors duration-150 flex items-center justify-center gap-2"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Merge another set
                  </button>
                </div>
              ) : (
                <div className="mt-4 pt-4 border-t border-[#292524] flex justify-end">
                  <button
                    onClick={handleMerge}
                    disabled={processing || files.length < 2}
                    className="w-full sm:w-auto px-6 h-10 bg-[#FAFAF9] text-[#0C0A09] text-[13px] font-medium rounded-[6px] hover:bg-[#E7E5E4] transition-colors duration-150 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {processing ? (
                      <>
                        <div className="w-2 h-2 rounded-full bg-[#0C0A09] pulse-dot" />
                        Merging ({progress}%)
                      </>
                    ) : (
                      <>
                        Merge {files.length} documents
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
        <footer className="bg-[#141110] border-t border-[#292524] w-full py-4 px-8 md:px-16 flex justify-between items-center mt-auto text-[12px] text-[#78716C]">
          <span className="text-[#FAFAF9] font-medium">DocEasy</span>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-[#FAFAF9] transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-[#FAFAF9] transition-colors">Terms</Link>
          </div>
          <span>© 2024 DOCEASY</span>
        </footer>
      </main>
    </div>
  )
}
