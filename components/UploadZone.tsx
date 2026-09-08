'use client'

import React, { useRef, useState } from 'react'
import { Upload } from 'lucide-react'

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
  const fileInputRef = useRef<HTMLInputElement>(null)

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
      onFileSelect(e.dataTransfer.files[0])
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileSelect(e.target.files[0])
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      fileInputRef.current?.click()
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
          <span>Check your network tab — zero uploads</span>
        </div>
      </div>
    </div>
  )
}
