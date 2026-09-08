'use client'

import React, { useState, useMemo } from 'react'
import Link from 'next/link'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { PrivacyProofScene } from '@/components/privacy-proof-scene'
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
      description: 'Compress PDFs locally in your browser with adjustable quality levels.',
      href: '/tools/compress',
      icon: Minimize2,
      category: 'PDF'
    },
    {
      name: 'Format Converter',
      description: 'Convert between PDF, DOCX, Markdown, and text formats directly in your browser.',
      href: '/tools/convert',
      icon: ArrowLeftRight,
      category: 'PDF'
    },
    {
      name: 'PDF Merger',
      description: 'Merge multiple PDF documents and images into a single PDF file.',
      href: '/tools/merge',
      icon: Merge,
      category: 'PDF'
    },
    {
      name: 'PDF Maker',
      description: 'Generate structured PDFs from templates (Invoice, Certificate, Resume, CV).',
      href: '/tools/pdf-maker',
      icon: Award,
      category: 'PDF'
    },
    {
      name: 'PDF Extractor',
      description: 'Extract raw text streams and document metadata from PDF files.',
      href: '/tools/pdf-extractor',
      icon: FileSearch,
      category: 'PDF'
    },
    {
      name: 'PDF Summarizer',
      description: 'Extract key points and generate document summaries using client-side sentence ranking.',
      href: '/tools/pdf-summarizer',
      icon: Sparkles,
      category: 'INTELLIGENCE'
    },
    {
      name: 'Image Compressor',
      description: 'Compress PNG, JPG, and WebP images with custom quality controls.',
      href: '/tools/image-compressor',
      icon: Minimize2,
      category: 'IMAGE'
    },
    {
      name: 'Image Converter',
      description: 'Convert images between PNG, JPG, WebP, and AVIF formats via HTML5 Canvas.',
      href: '/tools/image-converter',
      icon: ArrowLeftRight,
      category: 'IMAGE'
    },
    {
      name: 'Passport Photo Editor',
      description: 'Format photos to standard passport dimensions with background and contrast adjustments.',
      href: '/tools/passport-photo',
      icon: User,
      category: 'IMAGE'
    },
    {
      name: 'Image Cropper',
      description: 'Crop and rotate images with custom aspect ratio presets and instant preview.',
      href: '/tools/cropper',
      icon: Crop,
      category: 'IMAGE'
    },
    {
      name: 'Resume Analyzer',
      description: 'Analyze resumes for ATS formatting compliance, section completeness, and keyword density.',
      href: '/tools/analysis',
      icon: FileText,
      category: 'INTELLIGENCE'
    },
    {
      name: 'Encrypted Vault',
      description: 'Client-side AES-GCM encrypted session storage with automatic 2-hour auto-purge.',
      href: '/tools/vault',
      icon: Lock,
      category: 'INTELLIGENCE'
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
              <span className="text-[12px] font-medium text-[#A8A29E]">
                Privacy-First Hybrid Architecture
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-medium tracking-tight text-[#FAFAF9] leading-[1.1] max-w-4xl">
              Document tools that respect your privacy.
            </h1>
            
            <p className="text-[15px] md:text-[17px] text-[#A8A29E] mt-6 max-w-2xl leading-relaxed">
              Core tools run locally in your browser with zero unnecessary server uploads. Heavy PDF tasks use ephemeral server pipelines that purge immediately, and the optional cloud vault is protected by authenticated encryption.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row gap-4 items-start">
              <Link
                href="/tools/compress"
                className="h-10 px-6 bg-[#FAFAF9] text-[#0C0A09] text-[13px] font-medium rounded-[6px] hover:bg-[#D6D3D1] focus-visible:ring-2 focus-visible:ring-[#FAFAF9] transition-colors duration-150 flex items-center justify-center gap-2 cursor-pointer"
              >
                Start processing
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/about"
                className="h-10 px-6 bg-transparent text-[#FAFAF9] border border-[#292524] text-[13px] font-medium rounded-[6px] hover:bg-[#1C1917] hover:border-[#A8A29E] focus-visible:ring-2 focus-visible:ring-[#FAFAF9] transition-colors duration-150 flex items-center justify-center cursor-pointer"
              >
                View architecture
              </Link>
            </div>

            {/* Hero Stats Row (mt-16 above, mb-24 below) */}
            <div className="mt-16 mb-20 pt-6 border-t border-[#292524]">
              <div className="text-[13px] text-[#A8A29E] flex flex-wrap items-center gap-3">
                <span>Up to <span className="font-mono text-[#FAFAF9]">~80%</span> smaller</span>
                <span className="text-[#57534E]">•</span>
                <span>Client-first processing</span>
                <span className="text-[#57534E]">•</span>
                <span><span className="font-mono text-[#FAFAF9]">{allTools.length}</span> tools available</span>
              </div>
            </div>
          </div>
        </section>

        {/* Real UI Proof Section */}
        <section className="px-6 md:px-16 pb-20 max-w-6xl mx-auto">
          <div className="bg-[#141110] border border-[#292524] rounded-[8px] p-6 md:p-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#292524] mb-6">
              <div>
                <span className="text-[12px] font-medium text-[#A8A29E] block mb-1">
                  Verifiable proof
                </span>
                <h2 className="text-2xl md:text-3xl font-medium tracking-tight text-[#FAFAF9]">
                  Drop → Process → Download in action
                </h2>
                <p className="text-[14px] text-[#A8A29E] mt-1.5">
                  Watch client-side WebAssembly compression in real-time. Document bytes process directly in browser memory.
                </p>
              </div>

              {/* Network verification callout */}
              <div className="inline-flex items-center gap-2.5 px-3 py-2 rounded-[6px] bg-[#1C1917] border border-[#292524] text-[12px] text-[#FAFAF9] shrink-0">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-medium">Client-side processing in action</span>
              </div>
            </div>

            {/* Video Embed */}
            <div className="relative rounded-[6px] overflow-hidden border border-[#292524] bg-[#0C0A09]">
              <video
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-auto rounded-[6px] block"
              >
                <source src="/demo.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>

            <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#A8A29E]">
              <div className="flex items-center gap-2">
                <span>Demo workflow:</span>
                <span className="font-mono text-[#FAFAF9]">2.4 MB</span>
                <span>→</span>
                <span className="text-emerald-400 font-medium">Local WASM</span>
                <span>→</span>
                <span className="font-mono text-[#FAFAF9]">482 KB (~80% smaller)</span>
              </div>
              <Link
                href="/tools/compress"
                className="text-[#FAFAF9] hover:text-[#A8A29E] underline underline-offset-4 flex items-center gap-1"
              >
                <span>Try with your own file</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            {/* Interactive Scroll-Scrubbed Privacy Proof Scene */}
            <div className="mt-8">
              <PrivacyProofScene />
            </div>
          </div>
        </section>

        {/* 2. Core Tooling Suites (id="tools", Interactive Filter & Search, py-24) */}
        <section id="tools" className="px-6 md:px-16 py-24 max-w-6xl mx-auto scroll-mt-20">
          <div className="border-b border-[#292524] pb-6 mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <span className="text-[12px] font-medium text-[#A8A29E] block mb-1">
                All tools
              </span>
              <h2 className="text-3xl font-medium tracking-tight text-[#FAFAF9]">
                Tools
              </h2>
            </div>

            {/* Category Filter Pills & Search */}
            <div className="flex flex-wrap items-center gap-2">
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
                    className={`text-[12px] font-medium px-3 py-1.5 rounded-[4px] transition-colors cursor-pointer ${
                      selectedCategory === key
                        ? 'bg-[#1C1917] text-[#FAFAF9] border border-[#292524]'
                        : 'text-[#A8A29E] hover:text-[#FAFAF9] border border-transparent'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>

              <div className="relative">
                <Search className="w-3.5 h-3.5 text-[#A8A29E] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Filter tools..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-[#141110] border border-[#292524] focus:border-[#A8A29E] text-[#FAFAF9] placeholder:text-[#A8A29E] text-[13px] pl-8 pr-3 py-1.5 rounded-[6px] outline-none w-36 sm:w-44 transition-colors"
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
                  <ArrowRight className="w-4 h-4 text-[#57534E] group-hover:text-[#FAFAF9] transition-colors duration-150 group-hover:translate-x-0.5" />
                </div>
              </Link>
            ))}

            {filteredTools.length === 0 && (
              <div className="text-center py-12 text-[13px] text-[#A8A29E]">
                No tools matched &ldquo;{searchQuery}&rdquo; in {selectedCategory.toLowerCase()} category.
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
              <span className="text-[#FAFAF9] font-medium">Select</span> your file{' '}
              <span className="text-[#A8A29E] mx-2">→</span>{' '}
              <span className="text-[#FAFAF9] font-medium">Process</span> locally in your browser{' '}
              <span className="text-[#A8A29E] mx-2">→</span>{' '}
              <span className="text-[#FAFAF9] font-medium">Save</span> directly to your device.{' '}
              <span className="text-[#A8A29E]">Client-first privacy.</span>
            </p>
          </div>
        </section>

        {/* 4. Privacy Manifesto Section (id="manifesto", Full-width, bg #1C1917, py-24) */}
        <section id="manifesto" className="w-full bg-[#1C1917] border-y border-[#292524] py-24 px-6 md:px-16 scroll-mt-20">
          <div className="max-w-6xl mx-auto flex flex-col text-left">
            <div className="flex flex-col gap-2 max-w-3xl">
              <h2 className="text-3xl sm:text-4xl font-medium text-[#FAFAF9] tracking-tight leading-tight">
                We don&apos;t store without consent.
              </h2>
              <h2 className="text-3xl sm:text-4xl font-medium text-[#FAFAF9] tracking-tight leading-tight">
                We don&apos;t track your files.
              </h2>
              <h2 className="text-3xl sm:text-4xl font-medium text-[#FAFAF9] tracking-tight leading-tight">
                No email needed for core tools.
              </h2>
            </div>
            
            <p className="mt-4 text-[14px] text-[#A8A29E] max-w-2xl leading-relaxed">
              Core tools run 100% locally in your browser. Heavy compression uses ephemeral processing with immediate cleanup. Cloud vault sync requires an authenticated account.
            </p>

            <div className="mt-8 text-[12px] text-[#A8A29E] flex flex-wrap items-center gap-3">
              <span>Last audited: 2024-08-30</span>
              <span className="text-[#57534E]">·</span>
              <Link 
                href="https://github.com/rachts/DocEasy" 
                target="_blank"
                className="text-[#FAFAF9] hover:text-[#A8A29E] transition-colors underline underline-offset-4"
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
