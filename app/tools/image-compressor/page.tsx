'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Sidebar } from '@/components/Sidebar'
import { ProgressBar } from '@/components/ProgressBar'
import { UploadZone } from '@/components/UploadZone'
import { 
  ImageIcon, 
  X, 
  ArrowRight, 
  Download, 
  RotateCcw 
} from 'lucide-react'
import { compressImageWithQuality } from '@/lib/image-compressor-utils'
import { uploadFileToSupabase, saveFileMetadata, trackEvent, addToRecentFiles } from '@/lib/supabase/helpers'

export default function ImageCompressorPage() {
  const [file, setFile] = useState<File | null>(null)
  const [quality, setQuality] = useState(75)
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
    if (!selectedFile.type.startsWith('image/')) {
      setError('Please select an image file (PNG, JPG, WebP)')
      return
    }
    setFile(selectedFile)
    setDownloadUrl(null)
    setMetrics(null)
    setError('')
  }

  const handleCompress = async () => {
    if (!file) return

    setProcessing(true)
    setProgress(20)
    setError('')

    try {
      const compressed = await compressImageWithQuality(file, quality)
      setProgress(60)

      const fileName = `compressed_${file.name}`
      const { filePath, publicUrl } = await uploadFileToSupabase(compressed, fileName, 'image-compressor')
      setProgress(85)

      await saveFileMetadata({
        file_name: fileName,
        file_type: file.type,
        file_size: compressed.size,
        tool_used: 'image-compressor',
        storage_path: filePath,
        download_url: publicUrl,
        is_saved: false,
      })

      addToRecentFiles({
        name: fileName,
        url: publicUrl,
        tool: 'image-compressor',
        timestamp: Date.now(),
      })

      trackEvent('compress', 'image_compressor')

      const originalSize = file.size
      const compressedSize = compressed.size
      const reductionPercent = Math.max(0, Math.round(((originalSize - compressedSize) / originalSize) * 100))

      setMetrics({
        originalSize,
        compressedSize,
        reductionPercent,
      })

      setDownloadUrl(publicUrl)
      setResultFileName(fileName)
      setProgress(100)
    } catch (err: any) {
      console.error('Compression error:', err)
      setError(err.message || 'Image compression failed')
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
      <Sidebar currentPath="/tools" />

      <main className="w-full md:pl-[240px] flex flex-col min-h-screen">
        <header className="bg-[#141110] border-b border-[#292524] h-[56px] flex justify-between items-center px-8 md:px-16 sticky top-0 z-30">
          <div className="flex items-center gap-2 text-[12px]">
            <Link href="/tools" className="text-[#78716C] hover:text-[#FAFAF9] transition-colors">
              Tools
            </Link>
            <span className="text-[#44403C]">/</span>
            <span className="text-[#FAFAF9]">Image Compressor</span>
          </div>
          <div className="hidden md:flex text-[12px] text-[#78716C]">
            Runs locally in your browser
          </div>
        </header>

        <div className="p-8 md:p-16 max-w-6xl w-full mx-auto flex-1 flex flex-col gap-10">
          <div>
            <h1 className="text-4xl md:text-5xl font-medium tracking-tight text-[#FAFAF9]">
              Image Compressor
            </h1>
            <p className="text-[15px] text-[#A8A29E] mt-2 max-w-2xl leading-relaxed">
              Lossless and lossy raster compression for PNG, JPG, and WebP graphics with precise quantization controls.
            </p>
          </div>

          {error && (
            <div className="p-4 bg-[#1C1917] border border-[#7F1D1D] rounded-[6px] text-[13px] font-mono text-[#FAFAF9]">
              [ERROR]: {error}
            </div>
          )}

          {!file ? (
            <UploadZone
              onFileSelect={handleFileSelect}
              accept=".png,.jpg,.jpeg,.webp"
              supportedFormats="PNG, JPG, WEBP"
              title="Drag & Drop Image Here"
              subtitle="or click to browse local storage"
            />
          ) : (
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
              {/* Left Column: Image Payload */}
              <div className="xl:col-span-8 bg-[#1C1917] border border-[#292524] p-6 rounded-[8px]">
                <div className="flex justify-between items-center border-b border-[#292524] pb-3 mb-4">
                  <h2 className="text-[13px] font-medium text-[#FAFAF9]">
                    Source image
                  </h2>
                  <button
                    onClick={handleReset}
                    className="text-[#57534E] hover:text-[#FAFAF9] transition-colors p-1"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center gap-4 py-4">
                  <div className="w-12 h-14 bg-[#141110] border border-[#292524] flex items-center justify-center rounded-[4px]">
                    <ImageIcon className="w-5 h-5 text-[#A8A29E] stroke-[1.5]" />
                  </div>
                  <div>
                    <p className="text-[15px] font-medium text-[#FAFAF9] truncate max-w-md">
                      {file.name}
                    </p>
                    <p className="font-mono text-[12px] text-[#57534E] mt-0.5">
                      {formatBytes(file.size)} • {file.type}
                    </p>
                  </div>
                </div>

                {metrics && (
                  <div className="mt-6 pt-6 border-t border-[#292524] bg-[#141110] p-4 rounded-[6px]">
                    <div className="text-[12px] font-medium text-[#78716C] mb-3">
                      Compression metrics
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

              {/* Right Column: Settings */}
              <div className="xl:col-span-4 bg-[#1C1917] border border-[#292524] p-6 rounded-[8px] flex flex-col">
                <h2 className="text-[13px] font-medium text-[#FAFAF9] border-b border-[#292524] pb-3 mb-6">
                  Quality ratio: <span className="font-mono">{quality}%</span>
                </h2>

                <div className="space-y-4 flex-1">
                  <input
                    type="range"
                    min="10"
                    max="95"
                    value={quality}
                    onChange={(e) => setQuality(Number(e.target.value))}
                    className="w-full accent-[#FAFAF9] bg-[#141110] h-2 rounded cursor-pointer"
                  />
                  <div className="flex justify-between text-[11px] text-[#78716C]">
                    <span>Smaller file</span>
                    <span>Balanced</span>
                    <span>Higher quality</span>
                  </div>
                </div>

                {downloadUrl ? (
                  <div className="mt-8 space-y-3">
                    <a
                      href={downloadUrl}
                      download={resultFileName}
                      className="w-full h-10 bg-[#FAFAF9] text-[#0C0A09] text-[13px] font-medium rounded-[6px] hover:bg-[#D6D3D1] transition-colors duration-150 flex items-center justify-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      Download compressed image
                    </a>
                    <button
                      onClick={handleReset}
                      className="w-full h-10 bg-transparent text-[#A8A29E] hover:text-[#FAFAF9] border border-[#292524] hover:border-[#A8A29E] text-[13px] font-medium rounded-[6px] transition-colors duration-150 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <RotateCcw className="w-4 h-4" />
                      Compress another image
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={handleCompress}
                    disabled={processing}
                    className="w-full h-10 bg-[#FAFAF9] text-[#0C0A09] text-[13px] font-medium rounded-[6px] hover:bg-[#D6D3D1] transition-colors duration-150 flex items-center justify-center gap-2 mt-8 cursor-pointer disabled:opacity-50"
                  >
                    {processing ? (
                      <>
                        <div className="w-2 h-2 rounded-full bg-[#0C0A09] pulse-dot" />
                        Processing ({progress}%)
                      </>
                    ) : (
                      <>
                        Compress image
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        <footer className="bg-[#141110] border-t border-[#292524] w-full py-4 px-8 md:px-16 flex justify-between items-center mt-auto text-[12px] text-[#78716C]">
          <span className="text-[#FAFAF9] font-medium">DocEasy</span>
          <span>© 2024 DocEasy</span>
        </footer>
      </main>
    </div>
  )
}
