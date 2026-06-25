"use client"

import { useState, useRef } from "react"
import { UploadCloud } from "lucide-react"
import { motion } from "motion/react"

interface UploadCardProps {
  onUpload?: (file: File) => void
  onUploadMultiple?: (files: File[]) => void
  multiple?: boolean
  accept?: string
  maxSizeMB?: number
  icon?: React.ReactNode
  title?: string
  description?: string
}

export function UploadCard({ 
  onUpload, 
  onUploadMultiple,
  multiple = false,
  accept, 
  maxSizeMB = 50,
  icon = <UploadCloud className="w-10 h-10" />,
  title = "Select a file to upload",
  description = "or drag and drop it here"
}: UploadCardProps) {
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      if (multiple) {
        handleFilesSelection(Array.from(e.dataTransfer.files))
      } else {
        handleFileSelection(e.dataTransfer.files[0])
      }
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      if (multiple) {
        handleFilesSelection(Array.from(e.target.files))
      } else {
        handleFileSelection(e.target.files[0])
      }
    }
  }

  const handleFilesSelection = (files: File[]) => {
    const validFiles = files.filter(f => f.size <= maxSizeMB * 1024 * 1024)
    if (validFiles.length < files.length) {
      alert(`Some files are too large. Max size is ${maxSizeMB}MB.`)
    }
    if (validFiles.length > 0 && onUploadMultiple) {
      onUploadMultiple(validFiles)
    }
  }

  const handleFileSelection = (file: File) => {
    if (file.size > maxSizeMB * 1024 * 1024) {
      alert(`File is too large. Max size is ${maxSizeMB}MB.`)
      return
    }
    if (onUpload) onUpload(file)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      onClick={() => fileInputRef.current?.click()}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`
        w-full p-12 sm:p-20 flex flex-col items-center justify-center text-center cursor-pointer
        rounded-3xl border-2 border-dashed transition-all duration-300 bg-card/40 backdrop-blur-sm
        ${isDragging ? 'border-primary bg-primary/5 scale-[1.02] shadow-glow' : 'border-border hover:border-primary/50 hover:bg-secondary/20 shadow-soft'}
      `}
    >
      <input 
        type="file" 
        className="hidden" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        accept={accept}
        multiple={multiple}
      />
      <div className={`p-5 rounded-full mb-6 transition-colors ${isDragging ? 'bg-primary/20 text-primary' : 'bg-secondary text-muted-foreground'}`}>
        {icon}
      </div>
      <h3 className="text-xl sm:text-2xl font-semibold mb-2">{title}</h3>
      <p className="text-sm sm:text-base text-muted-foreground">{description}</p>
      <p className="text-xs text-muted-foreground/60 mt-6 font-medium uppercase tracking-wider">Up to {maxSizeMB}MB • {accept?.replace(/\./g, '').toUpperCase() || 'ANY FILE'}</p>
    </motion.div>
  )
}
