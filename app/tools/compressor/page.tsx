"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { FileUploader } from "@/components/file-uploader"
import { compressImage } from "@/lib/compression-utils"
import { compressPDFWithRendering, type CompressionLevel } from "@/lib/pdf-compression-advanced"
import { getFileSize } from "@/lib/storage-utils"
import { Download, Info, Loader2, Save, CheckCircle } from "lucide-react"
import { Footer } from "@/components/footer"
import { uploadFileToSupabase, saveFileMetadata, trackEvent, addToRecentFiles } from "@/lib/supabase/helpers"
import { useAuth } from "@/lib/auth-context"

export default function CompressorPage() {
  const { user } = useAuth()
  const [file, setFile] = useState<File | null>(null)
  const [imageQuality, setImageQuality] = useState(75)
  const [pdfLevel, setPdfLevel] = useState<CompressionLevel>("recommended")
  const [compressing, setCompressing] = useState(false)
  const [result, setResult] = useState<Blob | null>(null)
  const [supabaseUrl, setSupabaseUrl] = useState<string | null>(null)
  const [progress, setProgress] = useState(0)
  const [isSaved, setIsSaved] = useState(false)

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile)
    setResult(null)
    setSupabaseUrl(null)
    setProgress(0)
    setIsSaved(false)
  }

  const handleCompress = async () => {
    if (!file) return

    setCompressing(true)
    setProgress(10)
    try {
      let compressed: Blob

      if (file.type.startsWith("image/")) {
        setProgress(30)
        compressed = await compressImage(file, imageQuality / 100)
        setProgress(60)
      } else if (file.type === "application/pdf") {
        setProgress(20)
        compressed = await compressPDFWithRendering(file, pdfLevel)
        setProgress(60)
      } else {
        alert("Unsupported file type. Please upload an image or PDF.")
        setCompressing(false)
        return
      }

      // Automatically upload to Supabase for the session
      setProgress(70)
      const { filePath, publicUrl } = await uploadFileToSupabase(compressed, file.name, "compressor")
      
      setProgress(85)
      await saveFileMetadata({
        file_name: file.name,
        file_type: file.type,
        file_size: compressed.size,
        tool_used: "compressor",
        storage_path: filePath,
        download_url: publicUrl,
        is_saved: false // Not saved to user dashboard by default
      })

      setProgress(95)
      await trackEvent("upload", "compressor")

      // Add to session history
      addToRecentFiles({
        name: file.name,
        url: publicUrl,
        tool: "compressor",
        timestamp: Date.now()
      })

      setProgress(100)
      setResult(compressed)
      setSupabaseUrl(publicUrl)
    } catch (error) {
      console.error("Compression failed:", error)
      alert("Something went wrong during compression. Please try again.")
    } finally {
      setCompressing(false)
    }
  }

  const handleSaveToDashboard = async () => {
    if (!supabaseUrl || !user) return
    
    try {
      setIsSaved(true)
      // The file is already uploaded, we just mark it as saved or keep it in metadata
      // In a real app, this might update the file record with is_saved = true
      await saveFileMetadata({
        file_name: file!.name,
        file_type: file!.type,
        file_size: result!.size,
        tool_used: "compressor",
        storage_path: supabaseUrl,
        download_url: supabaseUrl,
        is_saved: true
      })
    } catch (error) {
      console.error("Failed to save:", error)
      setIsSaved(false)
    }
  }

  const handleDownload = async () => {
    if (!supabaseUrl || !file) return
    await trackEvent("download", "compressor")
    const link = document.createElement("a")
    link.href = supabaseUrl
    link.download = `compressed-${file.name}`
    link.click()
  }

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-extrabold mb-2 tracking-tight">Industrial Compressor</h1>
      <p className="text-lg text-muted-foreground mb-10">Professional-grade compression for images and documents.</p>

      <div className="space-y-8">
        <Card className="p-8 border-dashed border-2 bg-muted/30">
          <h2 className="text-xl font-bold mb-6">1. Upload File</h2>
          <FileUploader onFileSelect={handleFileSelect} loading={compressing} />

          {file && (
            <div className="mt-6 p-4 bg-background border border-border rounded-xl shadow-sm flex items-center justify-between">
              <div>
                <p className="font-semibold text-sm truncate max-w-[200px]">{file.name}</p>
                <p className="text-xs text-muted-foreground">{getFileSize(file.size)} • {file.type}</p>
              </div>
              <CheckCircle className="w-5 h-5 text-green-500" />
            </div>
          )}
        </Card>

        {file && (
          <Card className="p-8 shadow-xl">
            <h2 className="text-xl font-bold mb-6">2. Configure Compression</h2>
            
            {file.type.startsWith("image/") ? (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-semibold">Image Quality: {imageQuality}%</label>
                  <span className="text-xs font-medium px-2 py-1 bg-primary/10 text-primary rounded-full">
                    {imageQuality < 50 ? "High Compression" : imageQuality < 80 ? "Balanced" : "Best Quality"}
                  </span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="100"
                  step="5"
                  value={imageQuality}
                  onChange={(e) => setImageQuality(Number(e.target.value))}
                  className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                />
              </div>
            ) : file.type === "application/pdf" ? (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {(["extreme", "recommended", "less"] as CompressionLevel[]).map((level) => (
                    <button
                      key={level}
                      onClick={() => setPdfLevel(level)}
                      className={`py-4 px-3 text-center rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${
                        pdfLevel === level 
                          ? "border-primary bg-primary/5 shadow-inner" 
                          : "border-border hover:border-primary/30"
                      }`}
                    >
                      <span className="font-bold capitalize">{level}</span>
                      <span className="text-[10px] sm:text-xs text-muted-foreground leading-tight">
                        {level === 'extreme' ? 'High compression, lower quality' : level === 'recommended' ? 'Good quality, good compression' : 'High quality, low compression'}
                      </span>
                    </button>
                  ))}
                </div>
                <div className="p-4 bg-primary/5 rounded-xl flex gap-3 text-sm italic">
                  <Info className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                  <p>
                    {pdfLevel === 'less' 
                      ? "A purely structural optimization. Extracts hidden metadata and compresses objects without modifying image quality or text vectors." 
                      : "Our hybrid engine re-renders massive hidden images and drops pixel density to aggressively squash the file size."}
                  </p>
                </div>
              </div>
            ) : null}

            <Button 
              onClick={handleCompress} 
              disabled={compressing} 
              className="w-full h-14 mt-8 rounded-xl text-lg font-bold shadow-lg shadow-primary/20"
            >
              {compressing ? <Loader2 className="w-6 h-6 animate-spin" /> : "Start Compression"}
            </Button>
          </Card>
        )}

        {compressing && (
          <div className="animate-in fade-in slide-in-from-bottom-4">
             <div className="flex justify-between text-sm mb-2 font-medium">
                <span>Optimizing objects...</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
                <div
                  className="bg-primary h-full transition-all duration-500 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
          </div>
        )}

        {result && (
          <Card className="p-8 border-2 border-green-500/20 bg-green-500/5 shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="flex items-start justify-between mb-8">
              <div>
                <h2 className="text-2xl font-black text-green-700 dark:text-green-400">SUCCESS!</h2>
                <p className="text-green-600/80 font-medium">Your file is ready.</p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-black text-green-700">
                  -{Math.round((1 - result.size / file!.size) * 100)}%
                </p>
                <p className="text-xs font-bold uppercase tracking-widest text-green-600/60">Smaller</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="p-4 bg-background rounded-xl border border-border shadow-sm">
                <p className="text-xs text-muted-foreground uppercase font-bold tracking-tighter mb-1">Before</p>
                <p className="text-xl font-bold">{getFileSize(file!.size)}</p>
              </div>
              <div className="p-4 bg-background rounded-xl border border-border shadow-sm">
                <p className="text-xs text-primary uppercase font-bold tracking-tighter mb-1">After</p>
                <p className="text-xl font-bold text-primary">{getFileSize(result.size)}</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button onClick={handleDownload} className="flex-1 h-14 rounded-xl text-lg font-bold gap-2">
                <Download className="w-5 h-5" />
                Download Now
              </Button>
              {user && (
                <Button 
                  onClick={handleSaveToDashboard} 
                  disabled={isSaved} 
                  variant="outline" 
                   className={`flex-1 h-14 rounded-xl text-lg font-bold gap-2 ${isSaved ? "bg-green-100 text-green-700 border-green-200" : ""}`}
                >
                  {isSaved ? <CheckCircle className="w-5 h-5" /> : <Save className="w-5 h-5" />}
                  {isSaved ? "Saved to Dashboard" : "Save to Dashboard"}
                </Button>
              )}
            </div>
          </Card>
        )}
      </div>

      <Footer />
    </main>
  )
}
