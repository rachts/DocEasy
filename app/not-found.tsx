import Link from 'next/link'
import { 
  FileText, 
  Minimize2, 
  Merge, 
  ArrowLeftRight, 
  FileSearch, 
  FilePlus, 
  FileSpreadsheet, 
  Sparkles, 
  ShieldCheck, 
  Image as ImageIcon, 
  UserCheck, 
  Crop,
  ArrowRight,
  Home
} from 'lucide-react'

export const metadata = {
  title: '404 — Page Not Found',
  description: 'The requested page could not be found. Browse our suite of 12 private, client-side document and image tools.',
}

const allTools = [
  {
    name: 'PDF Compressor',
    href: '/tools/compress',
    desc: 'Compress documents locally with up to ~80% size reduction',
    icon: Minimize2,
    badge: 'PDF',
  },
  {
    name: 'Format Converter',
    href: '/tools/convert',
    desc: 'Convert between PDF, DOCX, Markdown, Text, and images',
    icon: ArrowLeftRight,
    badge: 'PDF',
  },
  {
    name: 'PDF Merger',
    href: '/tools/merge',
    desc: 'Combine multiple PDF and image files into a single document',
    icon: Merge,
    badge: 'PDF',
  },
  {
    name: 'PDF Maker',
    href: '/tools/pdf-maker',
    desc: 'Create structured invoices, certificates, and resumes',
    icon: FilePlus,
    badge: 'PDF',
  },
  {
    name: 'PDF Extractor',
    href: '/tools/pdf-extractor',
    desc: 'Extract specific page ranges into a separate document',
    icon: FileSpreadsheet,
    badge: 'PDF',
  },
  {
    name: 'Image Compressor',
    href: '/tools/image-compressor',
    desc: 'Shrink PNG, JPG, and WebP assets with instant canvas preview',
    icon: ImageIcon,
    badge: 'Image',
  },
  {
    name: 'Image Converter',
    href: '/tools/image-converter',
    desc: 'Transcode images between PNG, JPG, WebP, AVIF, and BMP',
    icon: ImageIcon,
    badge: 'Image',
  },
  {
    name: 'Passport Photo Editor',
    href: '/tools/passport-photo',
    desc: 'Standardize ID and passport dimensions with compliance guides',
    icon: UserCheck,
    badge: 'Image',
  },
  {
    name: 'Image Cropper',
    href: '/tools/cropper',
    desc: 'Crop, rotate, and aspect-ratio align images locally',
    icon: Crop,
    badge: 'Image',
  },
  {
    name: 'Resume Analyzer',
    href: '/tools/analysis',
    desc: 'Screen resumes for ATS formatting, keywords, and density',
    icon: FileSearch,
    badge: 'Intelligence',
  },
  {
    name: 'PDF Summarizer',
    href: '/tools/pdf-summarizer',
    desc: 'Extract key paragraphs, metrics, and takeaways with TF scoring',
    icon: Sparkles,
    badge: 'Intelligence',
  },
  {
    name: 'Encrypted Vault',
    href: '/tools/vault',
    desc: 'Client-side AES-GCM encrypted temporary storage with auto-purge',
    icon: ShieldCheck,
    badge: 'Security',
  },
]

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0C0A09] text-[#FAFAF9] font-sans flex flex-col antialiased">
      {/* Navigation Header */}
      <header className="border-b border-[#292524] bg-[#141110] px-6 md:px-16 h-16 flex items-center justify-between">
        <Link href="/" className="inline-flex items-center gap-2">
          <span className="text-xl font-semibold tracking-tight text-[#FAFAF9]">
            DocEasy
          </span>
          <span className="text-xs text-[#A8A29E] hidden sm:inline">
            · Privacy-First Document Tools
          </span>
        </Link>
        <div className="flex items-center gap-4 text-xs text-[#A8A29E]">
          <Link href="/" className="hover:text-[#FAFAF9] transition-colors flex items-center gap-1.5">
            <Home className="w-3.5 h-3.5" />
            <span>Home</span>
          </Link>
          <span>·</span>
          <Link href="/tools" className="text-[#FAFAF9] hover:underline flex items-center gap-1">
            <span>All tools</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-6 md:px-16 py-16 md:py-24 flex flex-col">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-[4px] bg-[#1C1917] border border-[#292524] text-[12px] text-[#A8A29E] mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            <span>Error 404 · Page Not Found</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-medium tracking-tight text-[#FAFAF9] leading-tight">
            This document or tool doesn&apos;t exist.
          </h1>
          <p className="text-[15px] text-[#A8A29E] mt-3 leading-relaxed">
            The page you requested may have been moved or does not exist. All 12 DocEasy document processing tools remain fully operational below.
          </p>
          <div className="flex items-center gap-3 mt-6">
            <Link
              href="/"
              className="h-10 px-5 bg-[#FAFAF9] text-[#0C0A09] text-[13px] font-medium rounded-[6px] hover:bg-[#E7E5E4] transition-colors duration-150 inline-flex items-center justify-center gap-2"
            >
              <Home className="w-4 h-4" />
              <span>Back to home</span>
            </Link>
            <Link
              href="/tools"
              className="h-10 px-5 bg-transparent border border-[#292524] hover:border-[#A8A29E] text-[#FAFAF9] text-[13px] font-medium rounded-[6px] transition-colors duration-150 inline-flex items-center justify-center gap-2"
            >
              <span>Explore all tools</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Available Tools Grid */}
        <div className="mt-16 pt-10 border-t border-[#292524]">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-medium text-[#FAFAF9] tracking-tight">
              All 12 document tools
            </h2>
            <span className="text-xs text-[#A8A29E]">
              Client-first tools · Private browser execution
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {allTools.map((tool) => {
              const Icon = tool.icon
              return (
                <Link
                  key={tool.href}
                  href={tool.href}
                  className="group p-4 bg-[#141110] border border-[#292524] hover:border-[#A8A29E] rounded-[8px] transition-colors flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2.5">
                      <div className="w-8 h-8 rounded-[6px] bg-[#1C1917] border border-[#292524] flex items-center justify-center text-[#FAFAF9] group-hover:border-[#A8A29E] transition-colors">
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-[#A8A29E] px-2 py-0.5 rounded bg-[#1C1917] border border-[#292524]">
                        {tool.badge}
                      </span>
                    </div>
                    <h3 className="text-[14px] font-medium text-[#FAFAF9] group-hover:text-emerald-400 transition-colors">
                      {tool.name}
                    </h3>
                    <p className="text-[12px] text-[#A8A29E] mt-1 leading-relaxed">
                      {tool.desc}
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-[#292524] flex items-center justify-between text-xs text-[#A8A29E] group-hover:text-[#FAFAF9]">
                    <span>Open tool</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#292524] bg-[#141110] py-6 px-6 md:px-16 text-xs text-[#A8A29E] flex flex-col sm:flex-row items-center justify-between gap-4">
        <span>© 2024 DocEasy. Client-side WebAssembly toolkit.</span>
        <div className="flex items-center gap-4">
          <Link href="/privacy" className="hover:text-[#FAFAF9] transition-colors">
            Privacy Policy
          </Link>
          <span>·</span>
          <Link href="/terms" className="hover:text-[#FAFAF9] transition-colors">
            Terms of Service
          </Link>
          <span>·</span>
          <Link href="/status" className="hover:text-[#FAFAF9] transition-colors">
            System Status
          </Link>
        </div>
      </footer>
    </div>
  )
}
