'use client'

import React, { useState, useMemo } from 'react'
import Link from 'next/link'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { FormatMarquee } from '@/components/format-marquee'
import { ToolsBentoGrid } from '@/components/tools-bento-grid'
import { Search } from 'lucide-react'
import { TOOLS } from '@/lib/tools-registry'

export default function ToolsPage() {
  const [selectedCategory, setSelectedCategory] = useState<'ALL' | 'PDF' | 'IMAGE' | 'INTELLIGENCE'>('ALL')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredTools = useMemo(() => {
    return TOOLS.filter((tool) => {
      const matchesCategory = selectedCategory === 'ALL' || tool.category === selectedCategory
      const matchesSearch = searchQuery === '' ||
        tool.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesCategory && matchesSearch
    })
  }, [selectedCategory, searchQuery])

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
                Core tools process directly in your browser with client-side isolation. Heavy PDF tasks use ephemeral server workers with immediate cleanup, and optional cloud storage is secured with authenticated RLS.
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
                    className={`text-[12px] font-medium px-3 py-1.5 rounded-[4px] transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-[#FAFAF9] focus-visible:outline-offset-2 ${
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

        {/* Supported Formats Marquee */}
        <div className="mb-10">
          <FormatMarquee />
        </div>

        {/* Tools Bento Grid with 3D Tilt & Spring Pop */}
        <div className="px-6 md:px-12 pb-24 max-w-6xl mx-auto">
          <ToolsBentoGrid tools={filteredTools} searchQuery={searchQuery} />
        </div>
      </main>

      <Footer />
    </div>
  )
}
