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
  CheckCircle2, 
  AlertCircle, 
  RotateCcw 
} from 'lucide-react'
import { compressPDFWithRendering } from '@/lib/pdf-compression-advanced'
import { compressImageWithQuality } from '@/lib/image-compressor-utils'
import { uploadFileToSupabase, saveFileMetadata, trackEvent, addToRecentFiles } from '@/lib/supabase/helpers'

export default function CompressPDFPage() {
  const [file, setFile] = useState<File | null>(null)
  const [level, setLevel] = useState<'extreme' | 'recommended' | 'less'>('recommended')
  const [processing, setProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null)
  const [resultFileName, setResultFileName] = useState('')
  const [error, setError] = useState<string>('')
  const [metrics, setMetrics] = useState<{
    originalSize: number
    compressedSize: number
    reductionPercent: number
  } | null>(null)

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile)
    setDownloadUrl(null)
    setMetrics(null)
    setError('')
  }

  const handleCompress = async () => {
    if (!file) return

    setProcessing(true)
    setProgress(15)
    setError('')

    try {
      let compressedBlob: Blob

      if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
        setProgress(35)
        compressedBlob = await compressPDFWithRendering(file, level)
      } else if (file.type.startsWith('image/')) {
        setProgress(35)
        const quality = level === 'extreme' ? 40 : level === 'recommended' ? 70 : 90
        compressedBlob = await compressImageWithQuality(file, quality)
      } else {
        throw new Error('Unsupported format for compression')
      }

      setProgress(70)

      // Upload to Supabase / Local storage
      const { filePath, publicUrl } = await uploadFileToSupabase(
        compressedBlob, 
        file.name, 
        'compressor'
      )

      setProgress(90)

      await saveFileMetadata({
        file_name: file.name,
        file_type: file.type || 'application/pdf',
        file_size: compressedBlob.size,
        tool_used: 'compressor',
        storage_path: filePath,
        download_url: publicUrl,
        is_saved: false
      })

      addToRecentFiles({
        name: file.name,
        url: publicUrl,
        tool: 'compressor',
        timestamp: Date.now()
      })

      trackEvent('compress', 'compress_pdf')

      const originalSize = file.size
      const compressedSize = compressedBlob.size
      const reductionPercent = Math.max(0, Math.round(((originalSize - compressedSize) / originalSize) * 100))

      setMetrics({
        originalSize,
        compressedSize,
        reductionPercent
      })

      setDownloadUrl(publicUrl)
      setResultFileName(`compressed_${file.name}`)
      setProgress(100)
    } catch (err: any) {
      console.error('Compression error:', err)
      setError(err.message || 'Compression failed')
    } finally {
      setProcessing(false)
    }
  }

  const handleReset = () => {
    setFile(null)
    setDownloadUrl(null)
    setMetrics(null)
    setProgress(0)
    setError('')
  }

  return (
    <div className="min-h-screen bg-[#0C0A09] text-[#FAFAF9] font-sans flex antialiased">
      <ProgressBar active={processing} progress={progress} />

      {/* 240px Fixed Industrial Sidebar */}
      <Sidebar currentPath="/tools/compress" />

      {/* Main Content */}
      <main className="w-full md:pl-[240px] flex flex-col min-h-screen">
        {/* Breadcrumb Top Bar */}
        <header className="bg-[#141110] border-b border-[#292524] h-[56px] flex justify-between items-center px-8 md:px-16 sticky top-0 z-30">
          <div className="flex items-center gap-2 text-[12px]">
            <Link href="/tools" className="text-[#78716C] hover:text-[#FAFAF9] transition-colors">
              Tools
            </Link>
            <span className="text-[#44403C]">/</span>
            <span className="text-[#FAFAF9]">PDF Compressor</span>
          </div>
          <div className="hidden md:flex text-[12px] text-[#78716C]">
            Zero server uploads
          </div>
        </header>

        {/* Workspace Body */}
        <div className="p-8 md:p-16 max-w-6xl w-full mx-auto flex-1 flex flex-col gap-10">
          {/* Header Title */}
          <div>
            <h1 className="text-4xl md:text-5xl font-medium tracking-tight text-[#FAFAF9]">
              Compress PDF
            </h1>
            <p className="text-[15px] text-[#A8A29E] mt-2 max-w-2xl leading-relaxed">
              Reduce file size while optimizing for maximal quality and structural integrity. All processing executes securely in your browser.
            </p>
          </div>

          {error && (
            <div className="p-4 bg-[#1C1917] border border-[#7F1D1D] rounded-[6px] text-[13px] font-mono text-[#FAFAF9]">
              [ERROR]: {error}
            </div>
          )}

          {!file ? (
            /* Upload Zone State */
            <UploadZone
              onFileSelect={handleFileSelect}
              accept=".pdf,.png,.jpg,.jpeg"
              supportedFormats="PDF, PNG, JPG"
              title="Drag & Drop PDF Here"
              subtitle="or click to browse local storage"
            />
          ) : (
            /* Configuration Area (Selected State) */
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
              {/* Left Column: Selected Payload Details */}
              <div className="xl:col-span-8 bg-[#1C1917] border border-[#292524] p-6 rounded-[8px]">
                <div className="flex justify-between items-center border-b border-[#292524] pb-3 mb-4">
                  <h2 className="font-mono text-[12px] uppercase tracking-[0.05em] text-[#57534E]">
                    Selected Payload
                  </h2>
                  <button
                    onClick={handleReset}
                    className="text-[#57534E] hover:text-[#FAFAF9] transition-colors p-1"
                    title="Remove file"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center justify-between py-4 border-b border-[#292524]">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-14 bg-[#141110] border border-[#292524] flex items-center justify-center rounded-[4px]">
                      <FileText className="w-5 h-5 text-[#A8A29E] stroke-[1.5]" />
                    </div>
                    <div>
                      <p className="text-[15px] font-medium text-[#FAFAF9] truncate max-w-md">
                        {file.name}
                      </p>
                      <p className="font-mono text-[12px] text-[#57534E] mt-0.5">
                        {formatBytes(file.size)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Metrics if Completed */}
                {metrics && (
                  <div className="mt-6 pt-6 border-t border-[#292524] bg-[#141110] p-4 rounded-[6px]">
                    <div className="font-mono text-[12px] uppercase tracking-[0.05em] text-[#57534E] mb-3">
                      Compression Results
                    </div>
                    <div className="grid grid-cols-3 gap-4 font-mono">
                      <div>
                        <span className="text-[11px] text-[#57534E] block uppercase">Original</span>
                        <span className="text-[15px] text-[#FAFAF9] font-medium">{formatBytes(metrics.originalSize)}</span>
                      </div>
                      <div>
                        <span className="text-[11px] text-[#57534E] block uppercase">Compressed</span>
                        <span className="text-[15px] text-[#FAFAF9] font-medium">{formatBytes(metrics.compressedSize)}</span>
                      </div>
                      <div>
                        <span className="text-[11px] text-[#57534E] block uppercase">Reduction</span>
                        <span className="text-[15px] text-[#D6D3D1] font-medium">-{metrics.reductionPercent}%</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column: Compression Matrix */}
              <div className="xl:col-span-4 bg-[#1C1917] border border-[#292524] p-6 rounded-[8px] flex flex-col">
                <h2 className="font-mono text-[12px] uppercase tracking-[0.05em] text-[#57534E] border-b border-[#292524] pb-3 mb-6">
                  Compression Matrix
                </h2>

                <div className="space-y-4 flex-1">
                  {/* Extreme */}
                  <label 
                    onClick={() => setLevel('extreme')}
                    className={`flex items-start gap-3 p-3 border rounded-[6px] cursor-pointer transition-colors duration-150 ${
                      level === 'extreme' ? 'border-[#A8A29E] bg-[#141110]' : 'border-[#292524] hover:bg-[#141110]'
                    }`}
                  >
                    <input
                      type="radio"
                      name="compression"
                      checked={level === 'extreme'}
                      onChange={() => setLevel('extreme')}
                      className="mt-1 bg-transparent border-[#292524] text-[#FAFAF9] focus:ring-0"
                    />
                    <div>
                      <span className="text-[14px] text-[#FAFAF9] block font-medium">Extreme Compression</span>
                      <span className="font-mono text-[11px] text-[#57534E] block mt-0.5">Lowest file size, downscaled assets</span>
                    </div>
                  </label>

                  {/* Recommended */}
                  <label 
                    onClick={() => setLevel('recommended')}
                    className={`flex items-start gap-3 p-3 border rounded-[6px] cursor-pointer transition-colors duration-150 ${
                      level === 'recommended' ? 'border-[#A8A29E] bg-[#141110]' : 'border-[#292524] hover:bg-[#141110]'
                    }`}
                  >
                    <input
                      type="radio"
                      name="compression"
                      checked={level === 'recommended'}
                      onChange={() => setLevel('recommended')}
                      className="mt-1 bg-transparent border-[#292524] text-[#FAFAF9] focus:ring-0"
                    />
                    <div>
                      <span className="text-[14px] text-[#FAFAF9] block font-medium">Recommended Quality</span>
                      <span className="font-mono text-[11px] text-[#57534E] block mt-0.5">Balanced fidelity, high efficiency</span>
                    </div>
                  </label>

                  {/* Less */}
                  <label 
                    onClick={() => setLevel('less')}
                    className={`flex items-start gap-3 p-3 border rounded-[6px] cursor-pointer transition-colors duration-150 ${
                      level === 'less' ? 'border-[#A8A29E] bg-[#141110]' : 'border-[#292524] hover:bg-[#141110]'
                    }`}
                  >
                    <input
                      type="radio"
                      name="compression"
                      checked={level === 'less'}
                      onChange={() => setLevel('less')}
                      className="mt-1 bg-transparent border-[#292524] text-[#FAFAF9] focus:ring-0"
                    />
                    <div>
                      <span className="text-[14px] text-[#FAFAF9] block font-medium">Less Compression</span>
                      <span className="font-mono text-[11px] text-[#57534E] block mt-0.5">Maximum quality, lossless structure</span>
                    </div>
                  </label>
                </div>

                {downloadUrl ? (
                  <div className="mt-8 space-y-3">
                    <a
                      href={downloadUrl}
                      download={resultFileName}
                      className="w-full h-10 bg-[#FAFAF9] text-[#0C0A09] font-mono text-[12px] uppercase font-medium tracking-[0.05em] rounded-[6px] hover:bg-[#D6D3D1] transition-colors duration-150 flex items-center justify-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      DOWNLOAD COMPRESSED PDF
                    </a>
                    <button
                      onClick={handleReset}
                      className="w-full h-10 bg-transparent text-[#A8A29E] hover:text-[#FAFAF9] border border-[#292524] hover:border-[#A8A29E] font-mono text-[12px] uppercase tracking-[0.05em] rounded-[6px] transition-colors duration-150 flex items-center justify-center gap-2"
                    >
                      <RotateCcw className="w-4 h-4" />
                      COMPRESS ANOTHER FILE
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={handleCompress}
                    disabled={processing}
                    className="w-full h-10 bg-[#FAFAF9] text-[#0C0A09] font-mono text-[12px] uppercase font-medium tracking-[0.05em] rounded-[6px] hover:bg-[#D6D3D1] transition-colors duration-150 flex items-center justify-center gap-2 mt-8 cursor-pointer disabled:opacity-50"
                  >
                    {processing ? (
                      <>
                        <div className="w-2 h-2 rounded-full bg-[#0C0A09] pulse-dot" />
                        PROCESSING ({progress}%)
                      </>
                    ) : (
                      <>
                        COMPRESS FILE
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                )}
              </div>
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
