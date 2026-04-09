"use client"

import Link from "next/link"
import { 
  Merge, 
  FileText, 
  FileSearch, 
  RefreshCw, 
  Image as ImageIcon, 
  FileImage, 
  UserSquare, 
  Crop,
  ArrowRight
} from "lucide-react"
import { motion } from "motion/react"

const tools = [
  {
    name: "PDF Merger",
    description: "Combine multiple PDF files into one.",
    icon: Merge,
    href: "/tools/pdf-merger",
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  {
    name: "PDF Maker",
    description: "Create PDFs from images or text.",
    icon: FileText,
    href: "/tools/pdf-maker",
    color: "text-indigo-500",
    bg: "bg-indigo-500/10",
  },
  {
    name: "PDF Extractor",
    description: "Extract specific pages from a PDF.",
    icon: FileSearch,
    href: "/tools/pdf-extractor",
    color: "text-purple-500",
    bg: "bg-purple-500/10",
  },
  {
    name: "PDF Converter",
    description: "Convert PDFs to other formats.",
    icon: RefreshCw,
    href: "/tools/pdf-converter",
    color: "text-pink-500",
    bg: "bg-pink-500/10",
  },
  {
    name: "Image Compressor",
    description: "Reduce image size without quality loss.",
    icon: ImageIcon,
    href: "/tools/image-compressor",
    color: "text-orange-500",
    bg: "bg-orange-500/10",
  },
  {
    name: "Image Converter",
    description: "Change image formats (JPG, PNG, WEBP).",
    icon: FileImage,
    href: "/tools/image-converter",
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
  },
  {
    name: "Passport Photo",
    description: "Generate compliant passport size photos.",
    icon: UserSquare,
    href: "/tools/passport-photo",
    color: "text-cyan-500",
    bg: "bg-cyan-500/10",
  },
  {
    name: "Smart Cropper",
    description: "Crop images with intelligent aspect ratios.",
    icon: Crop,
    href: "/tools/cropper",
    color: "text-amber-500",
    bg: "bg-amber-500/10",
  },
]

export function ToolsGrid() {
  return (
    <section className="py-20">
      <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mb-4">
            Powerful tools for every document task
          </h2>
          <p className="text-lg text-muted-foreground">
            From merging PDFs to generating passport photos, we've got you covered with our lightning-fast, privacy-first toolset.
          </p>
        </div>
        <Link href="/tools" className="text-primary font-semibold flex items-center group">
          View all tools
          <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {tools.map((tool, index) => (
          <motion.div
            key={tool.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
          >
            <Link
              href={tool.href}
              className="group block p-6 h-full bg-card border border-border/50 rounded-2xl hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300"
            >
              <div className={`w-12 h-12 rounded-xl ${tool.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <tool.icon className={`w-6 h-6 ${tool.color}`} />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">{tool.name}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {tool.description}
              </p>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
