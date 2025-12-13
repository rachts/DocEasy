"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Card } from "@/components/ui/card"
import { Upload } from "lucide-react"

interface FileUploaderProps {
  onFileSelect: (file: File) => void
  loading?: boolean
}

export function FileUploader({ onFileSelect, loading = false }: FileUploaderProps) {
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
    const files = e.dataTransfer.files
    if (files.length > 0) {
      onFileSelect(files[0])
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      onFileSelect(e.target.files[0])
    }
  }

  return (
    <Card
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`p-8 text-center cursor-pointer transition-colors ${
        isDragging ? "bg-primary/5 border-primary" : "bg-muted"
      }`}
    >
      <input
        ref={fileInputRef}
        type="file"
        onChange={handleFileChange}
        className="hidden"
        accept="image/*,.pdf"
        disabled={loading}
      />
      <button onClick={() => fileInputRef.current?.click()} disabled={loading} className="w-full">
        <Upload className="w-8 h-8 mx-auto mb-2 text-primary" />
        <p className="font-semibold text-foreground">Drag and drop or click to upload</p>
        <p className="text-sm text-muted-foreground">Supports JPG, PNG, PDF</p>
      </button>
    </Card>
  )
}
