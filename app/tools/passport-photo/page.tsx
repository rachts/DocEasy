"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { FileUploader } from "@/components/file-uploader"
import { processPassportPhoto, PASSPORT_SIZES } from "@/lib/passport-photo-utils"
import { Download } from "lucide-react"
import { FooterCredit } from "@/components/footer-credit"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"

export default function PassportPhotoPage() {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [processing, setProcessing] = useState(false)
  const [result, setResult] = useState<Blob | null>(null)
  const [resultPreview, setResultPreview] = useState<string | null>(null)

  const [selectedSize, setSelectedSize] = useState<keyof typeof PASSPORT_SIZES>("US Passport")
  const [backgroundColor, setBackgroundColor] = useState("#ffffff")
  const [brightness, setBrightness] = useState(100)
  const [contrast, setContrast] = useState(100)

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile)
    setResult(null)
    setResultPreview(null)

    const reader = new FileReader()
    reader.onload = (e) => {
      setPreview(e.target?.result as string)
    }
    reader.readAsDataURL(selectedFile)
  }

  const handleProcess = async () => {
    if (!file) return

    setProcessing(true)
    try {
      const size = PASSPORT_SIZES[selectedSize]
      const processed = await processPassportPhoto(file, {
        width: size.width,
        height: size.height,
        backgroundColor,
        brightness,
        contrast,
      })

      setResult(processed)
      const url = URL.createObjectURL(processed)
      setResultPreview(url)
    } catch (error) {
      console.error("Processing failed:", error)
      alert("Processing failed")
    } finally {
      setProcessing(false)
    }
  }

  const handleDownload = () => {
    if (!result || !file) return

    const url = URL.createObjectURL(result)
    const link = document.createElement("a")
    link.href = url
    link.download = `passport-photo-${file.name}`
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold mb-2">Passport Photo Editor</h1>
      <p className="text-muted-foreground mb-8">
        Resize photos to passport standards, change background, and adjust brightness/contrast
      </p>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-lg font-bold mb-4">Upload Photo</h2>
            <FileUploader onFileSelect={handleFileSelect} loading={processing} accept="image/*" />

            {preview && (
              <div className="mt-4">
                <p className="text-sm font-medium mb-2">Original Photo:</p>
                <img src={preview || "/placeholder.svg"} alt="Original" className="w-full rounded border" />
              </div>
            )}
          </Card>

          {file && (
            <Card className="p-6">
              <h2 className="text-lg font-bold mb-4">Settings</h2>
              <div className="space-y-4">
                <div>
                  <Label>Passport Size</Label>
                  <Select
                    value={selectedSize}
                    onValueChange={(value) => setSelectedSize(value as keyof typeof PASSPORT_SIZES)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(PASSPORT_SIZES).map(([name, size]) => (
                        <SelectItem key={name} value={name}>
                          {name} ({size.unit})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Background Color</Label>
                  <div className="flex gap-2 mt-2">
                    <input
                      type="color"
                      value={backgroundColor}
                      onChange={(e) => setBackgroundColor(e.target.value)}
                      className="h-10 w-20 rounded border cursor-pointer"
                    />
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => setBackgroundColor("#ffffff")}>
                        White
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => setBackgroundColor("#e8f4f8")}>
                        Light Blue
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => setBackgroundColor("#f0f0f0")}>
                        Gray
                      </Button>
                    </div>
                  </div>
                </div>

                <div>
                  <Label>Brightness: {brightness}%</Label>
                  <Slider
                    value={[brightness]}
                    onValueChange={(value) => setBrightness(value[0])}
                    min={50}
                    max={150}
                    step={1}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label>Contrast: {contrast}%</Label>
                  <Slider
                    value={[contrast]}
                    onValueChange={(value) => setContrast(value[0])}
                    min={50}
                    max={150}
                    step={1}
                    className="mt-2"
                  />
                </div>

                <Button onClick={handleProcess} disabled={processing} className="w-full" size="lg">
                  {processing ? "Processing..." : "Process Photo"}
                </Button>
              </div>
            </Card>
          )}
        </div>

        <div>
          {resultPreview && (
            <Card className="p-6 bg-accent/5 border-accent">
              <h2 className="text-lg font-bold mb-4 text-accent">Processed Photo</h2>
              <div className="space-y-4">
                <div className="bg-white p-4 rounded border">
                  <img src={resultPreview || "/placeholder.svg"} alt="Processed" className="w-full rounded" />
                </div>
                <div className="text-sm text-muted-foreground">
                  <p>
                    Size: {PASSPORT_SIZES[selectedSize].width} x {PASSPORT_SIZES[selectedSize].height}px
                  </p>
                  <p>Format: {PASSPORT_SIZES[selectedSize].unit}</p>
                </div>
                <Button onClick={handleDownload} className="w-full" size="lg">
                  <Download className="w-5 h-5 mr-2" />
                  Download Photo
                </Button>
              </div>
            </Card>
          )}
        </div>
      </div>

      <FooterCredit />
    </main>
  )
}
