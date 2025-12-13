import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  ImageIcon,
  Crop,
  ArrowRight,
  Zap,
  FileUp,
  FileSearch,
  Award,
  Minimize2,
  RefreshCw,
  User,
  Merge,
} from "lucide-react"
import { FooterCredit } from "@/components/footer-credit"

export default function ToolsPage() {
  const tools = [
    {
      title: "PDF Converter",
      description: "Convert Word, Excel, or Images to PDF format",
      icon: FileUp,
      href: "/tools/pdf-converter",
      color: "text-blue-600",
      category: "PDF Tools",
    },
    {
      title: "PDF Maker",
      description: "Generate PDFs from templates (Invoice, Certificate, Resume)",
      icon: Award,
      href: "/tools/pdf-maker",
      color: "text-purple-600",
      category: "PDF Tools",
    },
    {
      title: "PDF Merger",
      description: "Combine multiple PDF files into one document",
      icon: Merge,
      href: "/tools/pdf-merger",
      color: "text-cyan-600",
      category: "PDF Tools",
    },
    {
      title: "PDF Extractor",
      description: "Extract text and images from PDF files",
      icon: FileSearch,
      href: "/tools/pdf-extractor",
      color: "text-green-600",
      category: "PDF Tools",
    },
    {
      title: "PDF Compressor",
      description: "Reduce PDF file size while maintaining quality",
      icon: Zap,
      href: "/tools/compressor",
      color: "text-red-600",
      category: "PDF Tools",
    },
    {
      title: "Image Compressor",
      description: "Reduce image file size with adjustable quality",
      icon: Minimize2,
      href: "/tools/image-compressor",
      color: "text-orange-600",
      category: "Image Tools",
    },
    {
      title: "Image Converter",
      description: "Convert between PNG, JPG, WebP, and BMP formats",
      icon: RefreshCw,
      href: "/tools/image-converter",
      color: "text-pink-600",
      category: "Image Tools",
    },
    {
      title: "Passport Photo Editor",
      description: "Resize photos, change background, adjust brightness/contrast",
      icon: User,
      href: "/tools/passport-photo",
      color: "text-indigo-600",
      category: "Image Tools",
    },
    {
      title: "Convert Images",
      description: "Convert between JPG and PNG formats",
      icon: ImageIcon,
      href: "/tools/converter",
      color: "text-secondary",
      category: "Legacy Tools",
    },
    {
      title: "Crop Images",
      description: "Crop and resize your images easily",
      icon: Crop,
      href: "/tools/cropper",
      color: "text-accent",
      category: "Legacy Tools",
    },
  ]

  const categories = ["PDF Tools", "Image Tools", "Legacy Tools"]

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-2 text-foreground">Document & Image Tools</h1>
        <p className="text-lg text-muted-foreground">Comprehensive toolkit for PDF and image processing</p>
      </div>

      {categories.map((category) => (
        <div key={category} className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-foreground">{category}</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {tools
              .filter((tool) => tool.category === category)
              .map((tool) => {
                const Icon = tool.icon
                return (
                  <Link key={tool.href} href={tool.href}>
                    <Card className="p-6 h-full hover:shadow-lg transition-shadow cursor-pointer group">
                      <Icon className={`w-10 h-10 mb-4 ${tool.color}`} />
                      <h3 className="text-xl font-bold mb-2 text-foreground">{tool.title}</h3>
                      <p className="text-muted-foreground text-sm mb-6">{tool.description}</p>
                      <Button variant="outline" className="w-full bg-transparent group-hover:bg-primary/5">
                        Open Tool
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Card>
                  </Link>
                )
              })}
          </div>
        </div>
      ))}

      <FooterCredit />
    </main>
  )
}
