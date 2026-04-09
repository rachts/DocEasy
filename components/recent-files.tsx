"use client"

import { useState, useEffect } from "react"
import { FileText, Download, Clock } from "lucide-react"
import { motion, AnimatePresence } from "motion/react"
import { Button } from "@/components/ui/button"
import { trackEvent } from "@/lib/supabase/helpers"

export function RecentFiles() {
  const [files, setFiles] = useState<any[]>([])

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("recent_files") || "[]")
    setFiles(stored)
  }, [])

  if (files.length === 0) return null

  const handleDownload = async (file: any) => {
    await trackEvent("download", file.tool)
    const link = document.createElement("a")
    link.href = file.url
    link.download = file.name
    link.click()
  }

  return (
    <section className="py-12 border-t border-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 mb-8">
          <Clock className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-bold text-foreground">Recently Processed</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <AnimatePresence>
            {files.map((file, index) => (
              <motion.div
                key={file.timestamp}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group p-4 rounded-2xl bg-muted/30 border border-border/50 hover:border-primary/30 transition-all flex items-center justify-between"
              >
                <div className="flex items-center gap-4 overflow-hidden">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary flex-shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="overflow-hidden">
                    <p className="font-semibold text-sm truncate text-foreground">{file.name}</p>
                    <p className="text-xs text-muted-foreground capitalize">{file.tool}</p>
                  </div>
                </div>
                <Button 
                  onClick={() => handleDownload(file)}
                  variant="ghost" 
                  size="icon" 
                  className="rounded-full hover:bg-primary/10 hover:text-primary"
                >
                  <Download className="w-4 h-4" />
                </Button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
