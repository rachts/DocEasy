'use client'

import React, { useState, useRef } from 'react'
import Link from 'next/link'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { 
  ArrowLeftRight, 
  Upload, 
  Download, 
  RotateCcw, 
  ImageIcon, 
  Sliders, 
  CheckCircle2, 
  AlertCircle,
  FileImage,
  RefreshCw,
  Sparkles
} from 'lucide-react'

type SupportedFormat = 'image/png' | 'image/jpeg' | 'image/webp' | 'image/avif'

interface ConvertedResult {
  blob: Blob
  url: string
  name: string
  size: number
  format: string
  width: number
  height: number
}

export default function ImageConverterPage() {
  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [targetFormat, setTargetFormat] = useState<SupportedFormat>('image/webp')
  const [quality, setQuality] = useState<number>(85)
  const [converting, setConverting] = useState(false)
  const [progress, setProgress] = useState(0)
  const [result, setResult] = useState<ConvertedResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const formatExtensions: Record<SupportedFormat, string> = {
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'image/webp': 'webp',
    'image/avif': 'avif'
  }

  const formatLabels: Record<SupportedFormat, string> = {
    'image/png': 'PNG (Lossless)',
    'image/jpeg': 'JPG / JPEG',
    'image/webp': 'WebP (Modern Web)',
    'image/avif': 'AVIF (High Efficiency)'
  }

  const handleFileSelect = (selectedFile: File) => {
    if (!selectedFile.type.startsWith('image/') && !selectedFile.name.match(/\.(png|jpe?g|webp|avif|bmp|svg)$/i)) {
      setError('Please provide a valid image file (PNG, JPG, WebP, AVIF, BMP, SVG).')
      return
    }

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
    }
    if (result?.url) {
      URL.revokeObjectURL(result.url)
    }

    const objectUrl = URL.createObjectURL(selectedFile)
    setFile(selectedFile)
    setPreviewUrl(objectUrl)
    setResult(null)
    setError(null)
    setProgress(0)
  }

  const handleConvert = async () => {
    if (!file || !previewUrl) return

    setConverting(true)
    setProgress(25)
    setError(null)

    try {
      const img = new Image()
      img.crossOrigin = 'anonymous'

      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve()
        img.onerror = () => reject(new Error('Failed to load image into canvas.'))
        img.src = previewUrl
      })

      setProgress(50)

      const canvas = document.createElement('canvas')
      canvas.width = img.naturalWidth || img.width
      canvas.height = img.naturalHeight || img.height

      const ctx = canvas.getContext('2d')
      if (!ctx) {
        throw new Error('Canvas 2D context unavailable in your browser.')
      }

      // If converting to JPEG, fill white background to prevent transparent areas turning black
      if (targetFormat === 'image/jpeg') {
        ctx.fillStyle = '#FFFFFF'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
      }

      ctx.drawImage(img, 0, 0)
      setProgress(75)

      // Test AVIF support if requested
      if (targetFormat === 'image/avif') {
        const testData = canvas.toDataURL('image/avif')
        if (!testData.startsWith('data:image/avif')) {
          console.warn('AVIF export not natively supported by browser canvas. Falling back to WebP.')
          setTargetFormat('image/webp')
        }
      }

      const qualityValue = targetFormat === 'image/png' ? 1.0 : quality / 100

      const blob = await new Promise<Blob | null>((resolve) => {
        canvas.toBlob(
          (b) => resolve(b),
          targetFormat,
          qualityValue
        )
      })

      if (!blob) {
        throw new Error('Canvas conversion failed. Please try a different target format.')
      }

      setProgress(100)

      const ext = formatExtensions[targetFormat]
      const baseName = file.name.replace(/\.[^/.]+$/, '')
      const resultName = `${baseName}.${ext}`
      const convertedUrl = URL.createObjectURL(blob)

      setResult({
        blob,
        url: convertedUrl,
        name: resultName,
        size: blob.size,
        format: ext.toUpperCase(),
        width: canvas.width,
        height: canvas.height
      })
    } catch (err: any) {
      console.error('Conversion failed:', err)
      setError(err.message || 'Image conversion failed.')
    } finally {
      setConverting(false)
    }
  }

  const handleDownload = () => {
    if (!result) return
    const a = document.createElement('a')
    a.href = result.url
    a.download = result.name
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  const handleReset = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    if (result?.url) URL.revokeObjectURL(result.url)
    setFile(null)
    setPreviewUrl(null)
    setResult(null)
    setError(null)
    setProgress(0)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const sizeDeltaPercent = (file && result) 
    ? Math.round(((result.size - file.size) / file.size) * 100)
    : 0

  return (
    <div className="min-h-screen bg-[#0C0A09] text-[#FAFAF9] font-sans flex flex-col selection:bg-[#292524] selection:text-[#FAFAF9]">
      <Navbar />

      <main className="flex-1 pt-[56px]">
        {/* Breadcrumbs Header */}
        <div className="bg-[#141110] border-b border-[#292524] py-3 px-6 md:px-12">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2 font-mono text-[12px] uppercase tracking-[0.05em]">
              <Link href="/tools" className="text-[#A8A29E] hover:text-[#FAFAF9] transition-colors">
                Tools
              </Link>
              <span className="text-[#57534E]">/</span>
              <span className="text-[#FAFAF9]">Image Converter</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-[#A8A29E]">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Canvas 2D • Client-Side Only</span>
            </div>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-6 md:px-12 py-10">
          {/* Header */}
          <div className="mb-8 border-b border-[#292524] pb-6">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-[#1C1917] border border-[#292524] text-xs font-mono text-[#A8A29E] mb-3">
              <ArrowLeftRight className="w-3.5 h-3.5 text-[#FAFAF9]" />
              Universal Image Format Conversion
            </div>
            <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-[#FAFAF9]">
              Image Converter
            </h1>
            <p className="text-[#A8A29E] text-sm md:text-base mt-2 max-w-2xl leading-relaxed">
              Convert PNG, JPG, WebP, and AVIF formats directly in your browser using hardware-accelerated Canvas. Fast, lossless or quality-adjusted, zero server uploads.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-lg bg-rose-950/30 border border-rose-900/50 flex items-center gap-3 text-sm text-rose-300">
              <AlertCircle className="w-5 h-5 shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          {!file ? (
            /* Upload Dropzone */
            <div
              onDragOver={(e) => {
                e.preventDefault()
                setDragActive(true)
              }}
              onDragLeave={() => setDragActive(false)}
              onDrop={(e) => {
                e.preventDefault()
                setDragActive(false)
                if (e.dataTransfer.files?.[0]) {
                  handleFileSelect(e.dataTransfer.files[0])
                }
              }}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all ${
                dragActive
                  ? 'border-[#FAFAF9] bg-[#1C1917]'
                  : 'border-[#292524] bg-[#141110]/50 hover:bg-[#141110] hover:border-[#44403C]'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,.png,.jpg,.jpeg,.webp,.avif,.bmp,.svg"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    handleFileSelect(e.target.files[0])
                  }
                }}
              />
              <div className="flex flex-col items-center justify-center gap-3">
                <div className="w-14 h-14 rounded-full bg-[#1C1917] border border-[#292524] flex items-center justify-center text-[#FAFAF9]">
                  <ImageIcon className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-base font-medium text-[#FAFAF9]">
                    Drop an image here or browse files
                  </p>
                  <p className="text-xs text-[#78716C] mt-1 font-mono">
                    Supports PNG, JPG, WebP, AVIF, BMP, SVG • 100% Client-side
                  </p>
                </div>
              </div>
            </div>
          ) : (
            /* Conversion Controls & Preview */
            <div className="space-y-6">
              <div className="bg-[#141110] border border-[#292524] rounded-xl p-6">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-[#292524]">
                  <div className="flex items-center gap-4 min-w-0">
                    {previewUrl && (
                      <div className="w-16 h-16 rounded-lg bg-[#1C1917] border border-[#292524] overflow-hidden shrink-0 flex items-center justify-center">
                        <img 
                          src={previewUrl} 
                          alt="Input Preview" 
                          className="w-full h-full object-cover" 
                        />
                      </div>
                    )}
                    <div className="min-w-0">
                      <div className="text-sm font-medium text-[#FAFAF9] truncate">
                        {file.name}
                      </div>
                      <div className="text-xs font-mono text-[#78716C] mt-0.5 flex items-center gap-2">
                        <span>{formatBytes(file.size)}</span>
                        <span>•</span>
                        <span>{file.type || 'image'}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleReset}
                    className="text-xs font-mono text-[#78716C] hover:text-[#FAFAF9] px-3 py-1.5 rounded border border-[#292524] hover:bg-[#1C1917] transition-colors flex items-center gap-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Choose different file
                  </button>
                </div>

                {/* Target Format Options */}
                <div className="py-6 border-b border-[#292524]">
                  <label className="text-xs font-mono text-[#A8A29E] uppercase tracking-wider block mb-3">
                    Target Output Format
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {(Object.keys(formatExtensions) as SupportedFormat[]).map((fmt) => (
                      <button
                        key={fmt}
                        type="button"
                        onClick={() => {
                          setTargetFormat(fmt)
                          setResult(null)
                        }}
                        className={`p-3 rounded-lg border text-left transition-all cursor-pointer ${
                          targetFormat === fmt
                            ? 'bg-[#1C1917] border-[#FAFAF9] text-[#FAFAF9] shadow-sm'
                            : 'bg-[#0C0A09] border-[#292524] text-[#A8A29E] hover:border-[#44403C]'
                        }`}
                      >
                        <div className="font-mono text-sm font-semibold uppercase">
                          {formatExtensions[fmt]}
                        </div>
                        <div className="text-[11px] text-[#78716C] mt-0.5">
                          {fmt === 'image/png' ? 'Lossless RGB' : fmt === 'image/jpeg' ? 'Universal JPG' : fmt === 'image/webp' ? 'Next-Gen Web' : 'Ultra Compact'}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quality Slider (for lossy formats) */}
                <div className="py-6 border-b border-[#292524]">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-mono text-[#A8A29E] uppercase tracking-wider flex items-center gap-1.5">
                      <Sliders className="w-3.5 h-3.5" />
                      Output Quality
                    </label>
                    <span className="font-mono text-xs font-medium text-[#FAFAF9]">
                      {targetFormat === 'image/png' ? '100% (Lossless)' : `${quality}%`}
                    </span>
                  </div>

                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={quality}
                    disabled={targetFormat === 'image/png'}
                    onChange={(e) => {
                      setQuality(Number(e.target.value))
                      setResult(null)
                    }}
                    className="w-full h-1.5 bg-[#292524] rounded-lg appearance-none cursor-pointer accent-[#FAFAF9] disabled:opacity-30"
                  />
                  <div className="flex justify-between text-[10px] font-mono text-[#78716C] mt-1">
                    <span>Smaller file</span>
                    <span>Balanced (85%)</span>
                    <span>Higher fidelity</span>
                  </div>
                </div>

                {/* Convert CTA */}
                <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-xs font-mono text-[#78716C]">
                    Zero network activity • Rendered via in-memory Canvas
                  </div>

                  <button
                    onClick={handleConvert}
                    disabled={converting}
                    className="w-full sm:w-auto px-6 py-2.5 bg-[#FAFAF9] hover:bg-[#E7E5E4] text-[#0C0A09] font-medium text-sm rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                  >
                    {converting ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Converting {progress}%...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        <span>Convert to {formatExtensions[targetFormat].toUpperCase()}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Conversion Result Card */}
              {result && (
                <div className="bg-[#141110] border border-emerald-900/40 rounded-xl p-6 animate-in fade-in-0 duration-200">
                  <div className="flex items-center gap-2 text-emerald-400 text-xs font-mono mb-4">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>CONVERSION COMPLETE</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                    <div className="bg-[#1C1917] border border-[#292524] rounded-lg p-3">
                      <div className="text-[11px] font-mono text-[#78716C] uppercase">
                        Output Size
                      </div>
                      <div className="text-lg font-mono font-semibold text-[#FAFAF9] mt-0.5">
                        {formatBytes(result.size)}
                      </div>
                      <div className={`text-[11px] font-mono mt-0.5 ${sizeDeltaPercent <= 0 ? 'text-emerald-400' : 'text-[#A8A29E]'}`}>
                        {sizeDeltaPercent <= 0 
                          ? `${Math.abs(sizeDeltaPercent)}% smaller` 
                          : `+${sizeDeltaPercent}% larger`}
                      </div>
                    </div>

                    <div className="bg-[#1C1917] border border-[#292524] rounded-lg p-3">
                      <div className="text-[11px] font-mono text-[#78716C] uppercase">
                        Dimensions
                      </div>
                      <div className="text-lg font-mono font-semibold text-[#FAFAF9] mt-0.5">
                        {result.width} × {result.height}
                      </div>
                      <div className="text-[11px] font-mono text-[#78716C] mt-0.5">
                        1:1 native resolution
                      </div>
                    </div>

                    <div className="bg-[#1C1917] border border-[#292524] rounded-lg p-3">
                      <div className="text-[11px] font-mono text-[#78716C] uppercase">
                        Format
                      </div>
                      <div className="text-lg font-mono font-semibold text-[#FAFAF9] mt-0.5">
                        {result.format}
                      </div>
                      <div className="text-[11px] font-mono text-[#78716C] mt-0.5">
                        {targetFormat === 'image/png' ? 'Lossless' : `Quality: ${quality}%`}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[#292524]">
                    <div className="text-xs font-mono text-[#A8A29E] truncate">
                      Ready: <span className="text-[#FAFAF9]">{result.name}</span>
                    </div>

                    <button
                      onClick={handleDownload}
                      className="w-full sm:w-auto px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-[#0C0A09] font-medium text-sm rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-emerald-950/50"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download {result.format}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
