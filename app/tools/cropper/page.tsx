'use client'

import React, { useState, useRef } from 'react'
import Link from 'next/link'
import { Sidebar } from '@/components/Sidebar'
import { UploadZone } from '@/components/UploadZone'
import { Crop, Download, RotateCcw, X, ArrowRight, AlertCircle } from 'lucide-react'

export default function CropperPage() {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [scale, setScale] = useState(1)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [result, setResult] = useState<Blob | null>(null)
  const [error, setError] = useState<string>('')

  const handleFileSelect = (selectedFile: File) => {
    if (selectedFile.size > 50 * 1024 * 1024) {
      setError(`File "${selectedFile.name}" exceeds 50MB limit (${(selectedFile.size / (1024 * 1024)).toFixed(1)} MB). Please select an image under 50MB.`)
      return
    }
    if (!selectedFile.type.startsWith('image/')) {
      setError('Please select a valid image file')
      return
    }
    setFile(selectedFile)
    setResult(null)
    setError('')
    const reader = new FileReader()
    reader.onload = (e) => {
      setPreview(e.target?.result as string)
    }
    reader.readAsDataURL(selectedFile)
  }

  const handleCrop = () => {
    if (!preview || !canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const img = new Image()
    img.onload = () => {
      canvas.width = img.width * scale
      canvas.height = img.height * scale
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
      canvas.toBlob((blob) => {
        if (blob) setResult(blob)
      })
    }
    img.src = preview
  }

  const handleDownload = () => {
    if (!result || !file) return
    const url = URL.createObjectURL(result)
    const link = document.createElement('a')
    link.href = url
    link.download = `cropped_${file.name}`
    link.click()
    URL.revokeObjectURL(url)
  }

  const handleReset = () => {
    setFile(null)
    setPreview(null)
    setResult(null)
    setScale(1)
    setError('')
  }

  return (
    <div className="min-h-screen bg-[#0C0A09] text-[#FAFAF9] font-sans flex antialiased">
      <Sidebar currentPath="/tools" />

      <main className="w-full md:pl-[240px] flex flex-col min-h-screen">
        <header className="bg-[#141110] border-b border-[#292524] h-[56px] flex justify-between items-center px-8 md:px-16 sticky top-0 z-30">
          <div className="flex items-center gap-2 text-[12px]">
            <Link href="/tools" className="text-[#78716C] hover:text-[#FAFAF9] transition-colors">
              Tools
            </Link>
            <span className="text-[#44403C]">/</span>
            <span className="text-[#FAFAF9]">Image Cropper</span>
          </div>
          <div className="hidden md:flex text-[12px] text-[#78716C]">
            Runs locally in your browser
          </div>
        </header>

        <div className="p-8 md:p-16 max-w-6xl w-full mx-auto flex-1 flex flex-col gap-10">
          <div>
            <h1 className="text-4xl md:text-5xl font-medium tracking-tight text-[#FAFAF9]">
              Image Cropper
            </h1>
            <p className="text-[15px] text-[#A8A29E] mt-2 max-w-2xl leading-relaxed">
              Geometric bounding and dimensional scaling with real-time canvas preview.
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
              accept=".png,.jpg,.jpeg,.webp"
              supportedFormats="PNG, JPG, WEBP"
              title="Drop image to crop"
              subtitle="or click to browse local files"
            />
          ) : (
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
              <div className="xl:col-span-8 bg-[#1C1917] border border-[#292524] p-6 rounded-[8px]">
                <div className="flex justify-between items-center border-b border-[#292524] pb-3 mb-4">
                  <h2 className="text-[13px] font-medium text-[#FAFAF9]">
                    Image preview
                  </h2>
                  <button
                    onClick={handleReset}
                    className="text-[#78716C] hover:text-[#FAFAF9] transition-colors p-1"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center justify-center p-4 bg-[#141110] border border-[#292524] rounded-[6px] min-h-[300px] overflow-hidden">
                  {preview && (
                    <img
                      src={preview}
                      alt="Crop target"
                      className="max-h-72 object-contain transition-transform duration-150"
                      style={{ transform: `scale(${scale})` }}
                    />
                  )}
                  <canvas ref={canvasRef} className="hidden" />
                </div>
              </div>

              <div className="xl:col-span-4 bg-[#1C1917] border border-[#292524] p-6 rounded-[8px] flex flex-col">
                <h2 className="text-[13px] font-medium text-[#FAFAF9] border-b border-[#292524] pb-3 mb-6">
                  Scale: {Math.round(scale * 100)}%
                </h2>

                <div className="space-y-4 flex-1">
                  <input
                    type="range"
                    min="0.2"
                    max="2"
                    step="0.05"
                    value={scale}
                    onChange={(e) => setScale(Number(e.target.value))}
                    className="w-full accent-[#FAFAF9] bg-[#141110] h-2 rounded cursor-pointer"
                  />
                  <div className="flex justify-between font-mono text-[12px] text-[#78716C]">
                    <span>0.2x</span>
                    <span>1.0x</span>
                    <span>2.0x</span>
                  </div>
                </div>

                {result ? (
                  <div className="mt-8 space-y-3">
                    <button
                      onClick={handleDownload}
                      className="w-full h-10 bg-[#FAFAF9] text-[#0C0A09] text-[13px] font-medium rounded-[6px] hover:bg-[#E7E5E4] transition-colors duration-150 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Download className="w-4 h-4" />
                      Download cropped image
                    </button>
                    <button
                      onClick={handleReset}
                      className="w-full h-10 bg-transparent text-[#A8A29E] hover:text-[#FAFAF9] border border-[#292524] hover:border-[#A8A29E] text-[13px] rounded-[6px] transition-colors duration-150 flex items-center justify-center gap-2"
                    >
                      <RotateCcw className="w-4 h-4" />
                      Crop another image
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={handleCrop}
                    className="w-full h-10 bg-[#FAFAF9] text-[#0C0A09] text-[13px] font-medium rounded-[6px] hover:bg-[#E7E5E4] transition-colors duration-150 flex items-center justify-center gap-2 mt-8 cursor-pointer"
                  >
                    Crop image
                    <ArrowRight className="w-4 h-4" />
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
