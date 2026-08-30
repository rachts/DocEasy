'use client'

import React, { useState, useMemo } from 'react'
import Link from 'next/link'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { 
  Minimize2, 
  ArrowLeftRight, 
  Merge, 
  FileSearch, 
  ArrowRight,
  Award,
  Crop,
  User,
  FileText,
  Lock,
  Search,
  Sparkles
} from 'lucide-react'

export function LandingPage() {
  const [selectedCategory, setSelectedCategory] = useState<'ALL' | 'PDF' | 'IMAGE' | 'INTELLIGENCE'>('ALL')
  const [searchQuery, setSearchQuery] = useState('')

  const allTools = [
    {
      name: 'PDF Compressor',
      description: 'Reduce file size without quality loss using high-efficiency WebAssembly algorithms.',
      href: '/tools/compress',
      icon: Minimize2,
      category: 'PDF',
      tag: 'WASM 2.4MB AVG'
    },
    {
      name: 'Format Converter',
      description: 'Instantly switch between DOCX, PDF, Markdown, and plain text with exact layout fidelity.',
      href: '/tools/convert',
      icon: ArrowLeftRight,
      category: 'PDF',
      tag: 'CROSS-FORMAT'
    },
    {
      name: 'Document Merger',
      description: 'Combine multiple PDF or image documents into a unified sequence with zero upload delay.',
      href: '/tools/merge',
      icon: Merge,
      category: 'PDF',
      tag: 'LOSSLESS'
    },
    {
      name: 'PDF Maker',
      description: 'Generate structured PDFs from templates (Invoice, Certificate, Resume, CV).',
      href: '/tools/pdf-maker',
      icon: Award,
      category: 'PDF',
      tag: 'TEMPLATES'
    },
    {
      name: 'PDF Extractor',
      description: 'Isolate raw text streams, table matrices, and embedded vector assets.',
      href: '/tools/pdf-extractor',
      icon: FileSearch,
      category: 'PDF',
      tag: 'PARSER'
    },
    {
      name: 'PDF Summarizer',
      description: 'Summarize long documents and extract key insights directly in your browser.',
      href: '/tools/analysis',
      icon: Sparkles,
      category: 'INTELLIGENCE',
      tag: 'LOCAL OCR'
    },
    {
      name: 'Image Compressor',
      description: 'Compress PNG, JPG, and WebP assets with real-time compression ratio preview.',
      href: '/tools/image-compressor',
      icon: Minimize2,
      category: 'IMAGE',
      tag: 'SIMD QUANT'
    },
    {
      name: 'Image Converter',
      description: 'Transform between modern web image formats with ICC color profile preservation.',
      href: '/tools/image-converter',
      icon: ArrowLeftRight,
      category: 'IMAGE',
      tag: 'RASTER ENGINE'
    },
    {
      name: 'Passport Photo Editor',
      description: 'Biometric standard crop presets, background normalization, and face alignment.',
      href: '/tools/passport-photo',
      icon: User,
      category: 'IMAGE',
      tag: 'BIOMETRIC'
    },
    {
      name: 'Smart Image Cropper',
      description: 'Interactive canvas bounding, custom aspect ratio locks, and lossless exports.',
      href: '/tools/cropper',
      icon: Crop,
      category: 'IMAGE',
      tag: 'CANVAS 2D'
    },
    {
      name: 'Resume & ATS Analyzer',
      description: 'Parse keyword density, formatting compliance, and structural ATS scores privately.',
      href: '/tools/analysis',
      icon: FileText,
      category: 'INTELLIGENCE',
      tag: 'ATS ENGINE'
    },
    {
      name: 'Encrypted File Vault',
      description: 'Ephemeral client-encrypted session storage with automatic 2-hour TTL auto-purge.',
      href: '/dashboard',
      icon: Lock,
      category: 'INTELLIGENCE',
      tag: 'ZERO-KNOWLEDGE'
    },
  ]

  const filteredTools = useMemo(() => {
    return allTools.filter((tool) => {
      const matchesCategory = selectedCategory === 'ALL' || tool.category === selectedCategory
      const matchesSearch = searchQuery === '' || 
        tool.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.tag.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesCategory && matchesSearch
    })
  }, [allTools, selectedCategory, searchQuery])

  return (
    <div className="min-h-screen bg-[#0C0A09] text-[#FAFAF9] font-sans flex flex-col selection:bg-[#292524] selection:text-[#FAFAF9]">
      <Navbar />

      <main className="flex-1 pt-[56px]">
        {/* 1. Hero Section (pt-32, pb-24 for generous negative space) */}
        <section className="px-6 md:px-16 pt-32 pb-24 max-w-6xl mx-auto">
          <div className="flex flex-col text-left">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-[4px] bg-[#141110] border border-[#292524] w-fit mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FAFAF9]" />
              <span className="font-mono text-[11px] uppercase tracking-[0.05em] text-[#A8A29E]">
                100% Client-Side WebAssembly Architecture
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-medium tracking-tight text-[#FAFAF9] leading-[1.1] max-w-4xl">
              Document tools that respect your privacy.
            </h1>
            
            <p className="text-[15px] md:text-[17px] text-[#A8A29E] mt-6 max-w-2xl leading-relaxed">
              Powerful processing, zero server retention. Compress, convert, and edit your documents locally within your browser using state-of-the-art WebAssembly architecture.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row gap-4 items-start">
              <Link
                href="/tools/compress"
                className="h-10 px-6 bg-[#FAFAF9] text-[#0C0A09] font-mono text-[12px] font-medium uppercase tracking-[0.05em] rounded-[6px] hover:bg-[#D6D3D1] transition-colors duration-150 flex items-center justify-center gap-2 cursor-pointer"
              >
                START PROCESSING
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/about"
                className="h-10 px-6 bg-transparent text-[#FAFAF9] border border-[#292524] font-mono text-[12px] font-medium uppercase tracking-[0.05em] rounded-[6px] hover:bg-[#1C1917] hover:border-[#A8A29E] transition-colors duration-150 flex items-center justify-center cursor-pointer"
              >
                VIEW ARCHITECTURE
              </Link>
            </div>

            {/* Monospace Stats Row (mt-16 above, mb-24 below) */}
            <div className="mt-16 mb-24 pt-6 border-t border-[#292524]">
              <div className="font-mono text-[12px] uppercase tracking-[0.05em] text-[#A8A29E] flex flex-wrap items-center gap-3">
                <span>2.4MB avg compression</span>
                <span className="text-[#57534E]">•</span>
                <span>0s server retention</span>
                <span className="text-[#57534E]">•</span>
                <span>12 browser tools</span>
                <span className="text-[#57534E]">•</span>
                <span className="text-[#57534E]">WASM ISOLATED</span>
              </div>
            </div>
          </div>
        </section>

        {/* 2. Core Tooling Suites (id="tools", Interactive Filter & Search, py-24) */}
        <section id="tools" className="px-6 md:px-16 py-24 max-w-6xl mx-auto scroll-mt-20">
          <div className="border-b border-[#292524] pb-6 mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <span className="font-mono text-[11px] uppercase tracking-[0.05em] text-[#57534E] block mb-1">
                ENGINE DIRECTORY
              </span>
              <h2 className="text-3xl font-medium tracking-tight text-[#FAFAF9]">
                Core Tooling Suites
              </h2>
            </div>

            {/* Category Filter Pills & Search */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center bg-[#141110] border border-[#292524] rounded-[6px] p-1 gap-1">
                {(['ALL', 'PDF', 'IMAGE', 'INTELLIGENCE'] as const).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`font-mono text-[11px] uppercase tracking-[0.05em] px-3 py-1.5 rounded-[4px] transition-colors cursor-pointer ${
                      selectedCategory === cat
                        ? 'bg-[#1C1917] text-[#FAFAF9] border border-[#292524]'
                        : 'text-[#57534E] hover:text-[#A8A29E] border border-transparent'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div className="relative">
                <Search className="w-3.5 h-3.5 text-[#57534E] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="FILTER TOOLS..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-[#141110] border border-[#292524] focus:border-[#A8A29E] text-[#FAFAF9] placeholder:text-[#57534E] font-mono text-[11px] uppercase tracking-[0.05em] pl-8 pr-3 py-1.5 rounded-[6px] outline-none w-36 sm:w-44 transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Tool Rows List */}
          <div className="flex flex-col gap-3 border-t border-[#292524] pt-3">
            {filteredTools.map((tool) => (
              <Link
                key={tool.name}
                href={tool.href}
                className="group flex items-center justify-between py-4 border-b border-[#292524] hover:bg-[#1C1917] transition-colors duration-150 px-4 -mx-4 rounded-[6px]"
              >
                <div className="flex items-center gap-4 md:gap-6 min-w-0">
                  <div className="w-10 h-10 rounded-[4px] bg-[#141110] border border-[#292524] flex items-center justify-center shrink-0 group-hover:border-[#A8A29E] transition-colors duration-150">
                    <tool.icon className="w-4 h-4 text-[#A8A29E] group-hover:text-[#FAFAF9] stroke-[1.5] transition-colors duration-150" />
                  </div>
                  <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-6 min-w-0">
                    <span className="text-[15px] font-medium text-[#FAFAF9] shrink-0">
                      {tool.name}
                    </span>
                    <span className="text-[14px] text-[#A8A29E] truncate">
                      {tool.description}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0 ml-4">
                  <span className="font-mono text-[10px] uppercase tracking-[0.05em] text-[#57534E] border border-[#292524] bg-[#141110] px-2 py-0.5 rounded hidden lg:inline">
                    {tool.tag}
                  </span>
                  <span className="font-mono text-[11px] uppercase tracking-[0.05em] text-[#57534E] hidden sm:inline">
                    LAUNCH
                  </span>
                  <ArrowRight className="w-4 h-4 text-[#57534E] group-hover:text-[#FAFAF9] transition-colors duration-150 group-hover:translate-x-0.5" />
                </div>
              </Link>
            ))}

            {filteredTools.length === 0 && (
              <div className="text-center py-12 font-mono text-[12px] uppercase tracking-[0.05em] text-[#57534E]">
                No tools matched &ldquo;{searchQuery}&rdquo; in {selectedCategory} category.
              </div>
            )}
          </div>
        </section>

        {/* 3. How It Works Section (id="process", Inline Sentence Flow, py-24) */}
        <section id="process" className="px-6 md:px-16 py-24 max-w-6xl mx-auto scroll-mt-20">
          <div className="border-t border-[#292524] pt-8">
            <h2 className="text-3xl font-medium tracking-tight text-[#FAFAF9] mb-6">
              How It Works
            </h2>
            <p className="text-xl md:text-2xl text-[#A8A29E] leading-relaxed max-w-4xl tracking-tight">
              <span className="text-[#FAFAF9] font-medium">Upload</span> your file{' '}
              <span className="text-[#57534E] mx-2">→</span>{' '}
              <span className="text-[#FAFAF9] font-medium">Process</span> instantly in your browser{' '}
              <span className="text-[#57534E] mx-2">→</span>{' '}
              <span className="text-[#FAFAF9] font-medium">Download</span> securely.{' '}
              <span className="text-[#A8A29E]">Files deleted in </span>
              <span className="text-[#FAFAF9] font-medium">2 hours</span>.
            </p>
          </div>
        </section>

        {/* 4. Privacy Manifesto Section (id="manifesto", Full-width, bg #1C1917, py-24) */}
        <section id="manifesto" className="w-full bg-[#1C1917] border-y border-[#292524] py-24 px-6 md:px-16 scroll-mt-20">
          <div className="max-w-6xl mx-auto flex flex-col text-left">
            <div className="flex flex-col gap-2 max-w-3xl">
              <h2 className="text-3xl sm:text-4xl font-medium text-[#FAFAF9] tracking-tight leading-tight">
                We don&apos;t store.
              </h2>
              <h2 className="text-3xl sm:text-4xl font-medium text-[#FAFAF9] tracking-tight leading-tight">
                We don&apos;t track.
              </h2>
              <h2 className="text-3xl sm:text-4xl font-medium text-[#FAFAF9] tracking-tight leading-tight">
                We don&apos;t ask for your email.
              </h2>
            </div>
            
            <div className="mt-8 font-mono text-[12px] uppercase tracking-[0.05em] text-[#57534E] flex flex-wrap items-center gap-3">
              <span>Last audited: 2024-08-30</span>
              <span className="text-[#292524]">·</span>
              <Link 
                href="https://github.com/rachts/DocEasy" 
                target="_blank"
                className="text-[#A8A29E] hover:text-[#FAFAF9] transition-colors underline underline-offset-4"
              >
                Open source on GitHub
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
