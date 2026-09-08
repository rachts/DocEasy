'use client'

import React, { useState, useMemo } from 'react'
import Link from 'next/link'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { 
  ArrowLeftRight, 
  Award, 
  Merge, 
  FileSearch, 
  Minimize2, 
  User, 
  Crop, 
  ArrowRight,
  FileText,
  Lock,
  Sparkles,
  Search
} from 'lucide-react'

export default function ToolsPage() {
  const [selectedCategory, setSelectedCategory] = useState<'ALL' | 'PDF' | 'IMAGE' | 'INTELLIGENCE'>('ALL')
  const [searchQuery, setSearchQuery] = useState('')

  const tools = [
    {
      title: 'PDF Compressor',
      description: 'Reduce PDF file size while maintaining quality via WebAssembly quantization.',
      icon: Minimize2,
      href: '/tools/compress',
      category: 'PDF'
    },
    {
      title: 'Format Converter',
      description: 'Convert Word, Excel, Images, and Text files into standard PDF format.',
      icon: ArrowLeftRight,
      href: '/tools/convert',
      category: 'PDF'
    },
    {
      title: 'PDF Merger',
      description: 'Combine multiple PDF files or raster images into one clean sequence.',
      icon: Merge,
      href: '/tools/merge',
      category: 'PDF'
    },
    {
      title: 'PDF Maker',
      description: 'Generate formatted documents from structured templates (Invoice, Certificate, CV).',
      icon: Award,
      href: '/tools/pdf-maker',
      category: 'PDF'
    },
    {
      title: 'PDF Extractor',
      description: 'Extract raw text streams, table matrices, and embedded image assets.',
      icon: FileSearch,
      href: '/tools/pdf-extractor',
      category: 'PDF'
    },
    {
      title: 'PDF Summarizer',
      description: 'Extract key summaries and semantic insights from long document files.',
      icon: Sparkles,
      href: '/tools/pdf-summarizer',
      category: 'INTELLIGENCE'
    },
    {
      title: 'Image Compressor',
      description: 'Lossless & lossy raster compression for PNG, JPG, and WebP assets.',
      icon: Minimize2,
      href: '/tools/image-compressor',
      category: 'IMAGE'
    },
    {
      title: 'Image Converter',
      description: 'Cross-convert between universal image format standards with ICC preservation.',
      icon: ArrowLeftRight,
      href: '/tools/image-converter',
      category: 'IMAGE'
    },
    {
      title: 'Passport Photo Editor',
      description: 'Standard biometric aspect presets, automatic cropping, and background clean.',
      icon: User,
      href: '/tools/passport-photo',
      category: 'IMAGE'
    },
    {
      title: 'Image Cropper',
      description: 'Interactive canvas bounding, locked aspect scaling, and lossless downloads.',
      icon: Crop,
      href: '/tools/cropper',
      category: 'IMAGE'
    },
    {
      title: 'Resume Analyzer',
      description: 'Audit ATS parsing compatibility, score keyword density, and inspect structure.',
      icon: FileText,
      href: '/tools/analysis',
      category: 'INTELLIGENCE'
    },
    {
      title: 'Encrypted Vault',
      description: 'Private client-encrypted session history with automatic 2-hour TTL auto-purge.',
      icon: Lock,
      href: '/tools/vault',
      category: 'INTELLIGENCE'
    },
  ]

  const filteredTools = useMemo(() => {
    return tools.filter((tool) => {
      const matchesCategory = selectedCategory === 'ALL' || tool.category === selectedCategory
      const matchesSearch = searchQuery === '' ||
        tool.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesCategory && matchesSearch
    })
  }, [tools, selectedCategory, searchQuery])

  return (
    <div className="min-h-screen bg-[#0C0A09] text-[#FAFAF9] font-sans flex flex-col selection:bg-[#292524] selection:text-[#FAFAF9]">
      <Navbar />

      <main className="flex-1 pt-[56px]">
        {/* Breadcrumb Header */}
        <div className="bg-[#141110] border-b border-[#292524] py-3 px-6 md:px-12">
          <div className="max-w-6xl mx-auto flex items-center gap-2 text-[12px]">
            <Link href="/" className="text-[#A8A29E] hover:text-[#FAFAF9] transition-colors">
              Home
            </Link>
            <span className="text-[#57534E]">/</span>
            <span className="text-[#FAFAF9]">Tools</span>
          </div>
        </div>

        {/* Page Hero */}
        <section className="px-6 md:px-12 pt-12 pb-8 max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <span className="text-[12px] text-[#78716C] block mb-2">
                12 tools available
              </span>
              <h1 className="text-4xl md:text-5xl font-medium tracking-tight text-[#FAFAF9]">
                Document & Image Tools
              </h1>
              <p className="text-[16px] text-[#A8A29E] mt-2 max-w-2xl leading-relaxed">
                Everything runs locally in your browser. The optional vault uses client-side session memory, auto-purged after 2 hours. Nothing ever touches our servers.
              </p>
            </div>

            {/* Filter Pills & Search */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center bg-[#141110] border border-[#292524] rounded-[6px] p-1 gap-1">
                {([
                  { key: 'ALL', label: 'All' },
                  { key: 'PDF', label: 'PDF' },
                  { key: 'IMAGE', label: 'Image' },
                  { key: 'INTELLIGENCE', label: 'Intelligence' }
                ] as const).map(({ key, label }) => (
                  <button
                    key={key}
                    onClick={() => setSelectedCategory(key)}
                    className={`font-mono text-[11px] px-3 py-1.5 rounded-[4px] transition-colors cursor-pointer ${
                      selectedCategory === key
                        ? 'bg-[#1C1917] text-[#FAFAF9] border border-[#292524]'
                        : 'text-[#57534E] hover:text-[#A8A29E] border border-transparent'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>

              <div className="relative">
                <Search className="w-3.5 h-3.5 text-[#57534E] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Filter tools..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-[#141110] border border-[#292524] focus:border-[#A8A29E] text-[#FAFAF9] placeholder:text-[#57534E] text-[13px] pl-8 pr-3 py-1.5 rounded-[6px] outline-none w-40 sm:w-48 transition-colors"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Tools Grid */}
        <div className="px-6 md:px-12 pb-24 max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredTools.map((tool) => (
              <Link
                key={tool.title}
                href={tool.href}
                className="group bg-[#1C1917] border border-[#292524] hover:border-[#A8A29E] rounded-[8px] p-6 flex flex-col justify-between transition-colors duration-150"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-10 h-10 rounded-[5px] bg-[#141110] border border-[#292524] group-hover:border-[#A8A29E] flex items-center justify-center transition-colors duration-150">
                      <tool.icon className="w-5 h-5 text-[#A8A29E] group-hover:text-[#FAFAF9] stroke-[1.5] transition-colors duration-150" />
                    </div>
                  </div>

                  <h3 className="text-[17px] font-medium text-[#FAFAF9] mb-2">
                    {tool.title}
                  </h3>
                  <p className="text-[13.5px] text-[#A8A29E] leading-relaxed mb-6">
                    {tool.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#292524] flex items-center justify-between font-mono text-[11px] text-[#57534E] group-hover:text-[#FAFAF9] transition-colors">
                  <span>Open tool</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </Link>
            ))}
          </div>

          {filteredTools.length === 0 && (
            <div className="text-center py-16 text-[13px] text-[#78716C]">
              No tools found matching &ldquo;{searchQuery}&rdquo;. Press ⌘K to search.
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
