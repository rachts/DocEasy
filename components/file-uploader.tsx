"use client"

import { useState, useRef } from "react"
import { motion, AnimatePresence } from "motion/react"
import { CheckCircle2, Loader2, Upload } from "lucide-react"
import { Card } from "@/components/ui/card"

interface FileUploaderProps {
  onFileSelect: (file: File) => void
  loading?: boolean
  success?: boolean
}

export function FileUploader({ onFileSelect, loading = false, success = false }: FileUploaderProps) {
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
    <motion.div
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
    >
      <Card
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`p-10 text-center cursor-pointer relative overflow-hidden transition-all duration-300 border-2 border-dashed ${
          isDragging 
            ? "border-primary bg-primary/5 ring-4 ring-primary/10" 
            : "border-border bg-muted/30 hover:bg-muted/50 hover:border-primary/50"
        } ${success ? "border-green-500 bg-green-50/50" : ""}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileChange}
          className="hidden"
          accept="image/*,.pdf"
          disabled={loading || success}
        />
        <button 
          onClick={() => fileInputRef.current?.click()} 
          disabled={loading || success} 
          className="w-full h-full min-h-[160px] flex flex-col items-center justify-center space-y-4"
        >
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
              >
                <Loader2 className="w-12 h-12 text-primary animate-spin" />
              </motion.div>
            ) : success ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.5, rotate: -45 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
              >
                <CheckCircle2 className="w-12 h-12 text-green-500" />
              </motion.div>
            ) : (
              <motion.div
                key="idle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center"
              >
                <div className="bg-primary/10 p-4 rounded-2xl mb-2 text-primary group-hover:scale-110 transition-transform">
                  <Upload className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-foreground">
                  {isDragging ? "Drop it here!" : "Upload your file"}
                </h3>
                <p className="text-muted-foreground mt-2 max-w-xs">
                  Drag and drop your file or click to browse. Supports PDF, JPG, PNG.
                </p>
                <p className="text-xs text-muted-foreground/60 mt-4">
                  Maximum file size: 10MB
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </button>
      </Card>
    </motion.div>
  )
}
