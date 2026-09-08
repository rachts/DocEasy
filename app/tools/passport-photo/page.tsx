'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Sidebar } from '@/components/Sidebar'
import { ProgressBar } from '@/components/ProgressBar'
import { UploadZone } from '@/components/UploadZone'
import { 
  User, 
  X, 
  ArrowRight, 
  Download, 
  RotateCcw 
} from 'lucide-react'
import { processPassportPhoto, PASSPORT_SIZES } from '@/lib/passport-photo-utils'
import { uploadFileToSupabase, saveFileMetadata, trackEvent, addToRecentFiles } from '@/lib/supabase/helpers'

export default function PassportPhotoPage() {
  const [file, setFile] = useState<File | null>(null)
  const [selectedSize, setSelectedSize] = useState<keyof typeof PASSPORT_SIZES>('US Passport')
  const [backgroundColor, setBackgroundColor] = useState('#ffffff')
  const [brightness, setBrightness] = useState(100)
  const [contrast, setContrast] = useState(100)
  const [processing, setProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null)
  const [resultFileName, setResultFileName] = useState('')
  const [error, setError] = useState<string>('')

  const handleFileSelect = (selectedFile: File) => {
    if (!selectedFile.type.startsWith('image/')) {
      setError('Please select a valid image file (PNG, JPG)')
      return
    }
    setFile(selectedFile)
    setDownloadUrl(null)
    setError('')
  }

  const handleProcess = async () => {
    if (!file) return

    setProcessing(true)
    setProgress(20)
    setError('')

    try {
      const size = PASSPORT_SIZES[selectedSize]
      const processedBlob = await processPassportPhoto(file, {
        width: size.width,
        height: size.height,
        backgroundColor,
        brightness,
        contrast,
      })

      setProgress(60)
      const fileName = `passport_photo_${Date.now()}.png`
      const { filePath, publicUrl } = await uploadFileToSupabase(processedBlob, fileName, 'passport-photo')

      setProgress(85)
      await saveFileMetadata({
        file_name: fileName,
        file_type: 'image/png',
        file_size: processedBlob.size,
        tool_used: 'passport-photo',
        storage_path: filePath,
        download_url: publicUrl,
        is_saved: false,
      })

      addToRecentFiles({
        name: fileName,
        url: publicUrl,
        tool: 'passport-photo',
        timestamp: Date.now(),
      })

      trackEvent('process', 'passport_photo')

      setDownloadUrl(publicUrl)
      setResultFileName(fileName)
      setProgress(100)
    } catch (err: any) {
      console.error('Passport photo error:', err)
      setError(err.message || 'Processing failed')
    } finally {
      setProcessing(false)
    }
  }

  const handleReset = () => {
    setFile(null)
    setDownloadUrl(null)
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
            <span className="text-[#FAFAF9]">Passport Photo Editor</span>
          </div>
          <div className="hidden md:flex text-[12px] text-[#78716C]">
            Runs locally in your browser
          </div>
        </header>

        <div className="p-8 md:p-16 max-w-6xl w-full mx-auto flex-1 flex flex-col gap-10">
          <div>
            <h1 className="text-4xl md:text-5xl font-medium tracking-tight text-[#FAFAF9]">
              Passport Photo Editor
            </h1>
            <p className="text-[15px] text-[#A8A29E] mt-2 max-w-2xl leading-relaxed">
              Standardized biometric passport and visa dimensions with background normalization and contrast leveling.
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
              accept=".png,.jpg,.jpeg"
              supportedFormats="PNG, JPG"
              title="Drag & Drop Portrait Photo Here"
              subtitle="or click to browse local storage"
            />
          ) : (
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
              {/* Left Column: Image Payload */}
              <div className="xl:col-span-7 bg-[#1C1917] border border-[#292524] p-6 rounded-[8px]">
                <div className="flex justify-between items-center border-b border-[#292524] pb-3 mb-4">
                  <h2 className="text-[13px] font-medium text-[#FAFAF9]">
                    Source portrait
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
                    <User className="w-5 h-5 text-[#A8A29E] stroke-[1.5]" />
                  </div>
                  <div>
                    <p className="text-[15px] font-medium text-[#FAFAF9] truncate max-w-md">
                      {file.name}
                    </p>
                    <p className="font-mono text-[12px] text-[#57534E] mt-0.5">
                      {(file.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Column: Passport Spec Controls */}
              <div className="xl:col-span-5 bg-[#1C1917] border border-[#292524] p-6 rounded-[8px] flex flex-col">
                <h2 className="text-[13px] font-medium text-[#FAFAF9] border-b border-[#292524] pb-3 mb-6">
                  Photo dimensions & style
                </h2>

                <div className="space-y-4 flex-1">
                  <div className="space-y-1.5">
                    <label className="text-[12px] font-medium text-[#FAFAF9] block">
                      Target country standard
                    </label>
                    <select
                      value={selectedSize}
                      onChange={(e) => setSelectedSize(e.target.value as any)}
                      className="w-full h-11 bg-[#141110] border border-[#292524] rounded-[6px] px-3.5 text-[14px] text-[#FAFAF9] focus:border-[#A8A29E] focus:outline-none transition-colors"
                    >
                      {Object.keys(PASSPORT_SIZES).map((sizeKey) => (
                        <option key={sizeKey} value={sizeKey} className="bg-[#141110] text-[#FAFAF9]">
                          {sizeKey} ({PASSPORT_SIZES[sizeKey as keyof typeof PASSPORT_SIZES].width}x{PASSPORT_SIZES[sizeKey as keyof typeof PASSPORT_SIZES].height}mm)
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[12px] font-medium text-[#FAFAF9] block">
                      Background color
                    </label>
                    <div className="flex gap-2">
                      {[
                        { label: 'White', color: '#ffffff' },
                        { label: 'Off-white', color: '#f5f5f5' },
                        { label: 'Light blue', color: '#e0f2fe' },
                      ].map((bg) => (
                        <button
                          key={bg.color}
                          type="button"
                          onClick={() => setBackgroundColor(bg.color)}
                          className={`flex-1 py-2 text-[12px] font-medium border rounded-[4px] transition-colors cursor-pointer ${
                            backgroundColor === bg.color
                              ? 'bg-[#FAFAF9] text-[#0C0A09] border-[#FAFAF9]'
                              : 'bg-[#141110] text-[#A8A29E] border-[#292524] hover:text-[#FAFAF9]'
                          }`}
                        >
                          {bg.label}
                        </button>
                      ))}
                    </div>
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
                      Download passport photo
                    </a>
                    <button
                      onClick={handleReset}
                      className="w-full h-10 bg-transparent text-[#A8A29E] hover:text-[#FAFAF9] border border-[#292524] hover:border-[#A8A29E] text-[13px] font-medium rounded-[6px] transition-colors duration-150 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <RotateCcw className="w-4 h-4" />
                      Process another photo
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={handleProcess}
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
                        Generate passport photo
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
