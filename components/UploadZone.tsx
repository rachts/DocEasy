'use client'

import React, { useRef, useState } from 'react'
import { Upload, AlertCircle, X } from 'lucide-react'

interface UploadZoneProps {
  onFileSelect: (file: File) => void
  accept?: string
  supportedFormats?: string
  maxSize?: string
  title?: string
  subtitle?: string
  className?: string
}

export function UploadZone({
  onFileSelect,
  accept = '.pdf,.docx,.txt,.png,.jpg,.jpeg,.webp',
  supportedFormats = 'PDF, DOCX, TXT, PNG, JPG',
  maxSize = '50MB',
  title = 'Drop files here',
  subtitle = 'or click to browse local storage',
  className = ''
}: UploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [rejectionError, setRejectionError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const validateAndSelect = (file: File) => {
    // 1. Check file size limit (50MB = 50 * 1024 * 1024 bytes)
    const maxBytes = 50 * 1024 * 1024
    if (file.size > maxBytes) {
      const sizeMB = (file.size / (1024 * 1024)).toFixed(1)
      setRejectionError(
        `File "${file.name}" exceeds the 50MB limit (${sizeMB} MB). Please select a file under 50MB.`
      )
      return
    }

    // 2. Check file format against accept prop
    if (accept && accept !== '*' && accept !== '*/*') {
      const allowedPatterns = accept.split(',').map((item) => item.trim().toLowerCase())
      const fileName = file.name.toLowerCase()
      const fileType = (file.type || '').toLowerCase()

      const isAllowed = allowedPatterns.some((pattern) => {
        if (pattern.startsWith('.')) {
          return fileName.endsWith(pattern)
        }
        if (pattern.endsWith('/*')) {
          const typePrefix = pattern.slice(0, -1)
          return fileType.startsWith(typePrefix)
        }
        return fileType === pattern
      })

      if (!isAllowed) {
        setRejectionError(
          `Invalid file format for "${file.name}". Supported formats: ${supportedFormats}.`
        )
        return
      }
    }

    setRejectionError(null)
    onFileSelect(file)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndSelect(e.dataTransfer.files[0])
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndSelect(e.target.files[0])
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
        fileInputRef.current.click()
      }
    }
  }

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={`${title} - ${subtitle}`}
      onClick={() => fileInputRef.current?.click()}
      onKeyDown={handleKeyDown}
      onDragOver={handleDragOver}
      onDragEnter={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`w-full border border-[#292524] p-12 md:p-16 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-150 rounded-[8px] group select-none outline-none focus-visible:border-[#A8A29E] ${
        isDragging ? 'bg-[#292524] border-[#FAFAF9]' : 'bg-[#141110] hover:bg-[#1C1917] hover:border-[#A8A29E]'
      } ${className}`}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        aria-label="Upload document file input"
        onChange={handleInputChange}
        className="hidden"
      />

      {rejectionError && (
        <div 
          onClick={(e) => e.stopPropagation()} 
          className="mb-6 w-full max-w-md p-3.5 rounded-[6px] bg-[#1C1917] border border-amber-500/40 text-[13px] text-[#FAFAF9] flex items-start justify-between gap-3 text-left"
        >
          <div className="flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-medium text-amber-400 block mb-0.5 text-xs">File rejected</span>
              <p className="text-[12px] text-[#FAFAF9] leading-relaxed">{rejectionError}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setRejectionError(null)}
            className="text-[#A8A29E] hover:text-[#FAFAF9] p-1 rounded transition-colors shrink-0 cursor-pointer"
            title="Dismiss error"
            aria-label="Dismiss error"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      <div className={`w-12 h-12 rounded-[6px] border border-[#292524] bg-[#1C1917] flex items-center justify-center mb-4 group-hover:border-[#A8A29E] transition-all duration-150 ${
        isDragging ? 'scale-110 border-[#FAFAF9]' : ''
      }`}>
        <Upload className="w-5 h-5 text-[#A8A29E] group-hover:text-[#FAFAF9] stroke-[1.5] transition-colors duration-150" aria-hidden="true" />
      </div>

      <h2 className="text-2xl md:text-3xl font-medium tracking-[-0.01em] text-[#FAFAF9] mb-1">
        {title}
      </h2>
      
      <p className="text-[15px] text-[#A8A29E] mb-4">
        {subtitle}
      </p>

      <div className="border-t border-[#292524] pt-4 mt-2 w-full max-w-md">
        <p className="text-[12px] text-[#A8A29E] flex items-center justify-center gap-2 flex-wrap">
          <span>Supported: <span className="font-mono text-[#A8A29E]">{supportedFormats}</span></span>
          <span className="text-[#57534E]">•</span>
          <span>Max size: <span className="font-mono text-[#A8A29E]">{maxSize}</span></span>
        </p>
        <div className="mt-3 flex items-center justify-center gap-2 text-[12px] text-[#A8A29E]">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span>Private document processing • Client-first</span>
        </div>
      </div>
    </div>
  )
}
