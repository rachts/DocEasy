'use client'

import React, { useState, useMemo } from 'react'
import { FileRow } from '@/components/FileRow'
import { Search } from 'lucide-react'

interface VaultClientProps {
  initialFiles: any[]
  favoriteIds: string[]
  aiJobs: any[]
}

export function VaultClient({ initialFiles = [], favoriteIds = [] }: VaultClientProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState<'all' | 'pdf' | 'img'>('all')

  const filteredFiles = useMemo(() => {
    return initialFiles.filter((f) => {
      const nameMatch = (f.file_name || f.name || '').toLowerCase().includes(searchQuery.toLowerCase())
      if (!nameMatch) return false

      if (activeTab === 'pdf') return (f.file_type || '').includes('pdf') || (f.name || '').endsWith('.pdf')
      if (activeTab === 'img') return (f.file_type || '').includes('image') || /\.(png|jpg|jpeg|webp)$/i.test(f.name || '')
      return true
    })
  }, [initialFiles, searchQuery, activeTab])

  return (
    <div className="flex flex-col gap-6">
      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#57534E]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search vault..."
            className="w-full h-10 bg-[#141110] border border-[#292524] rounded-[6px] pl-10 pr-3.5 text-[14px] text-[#FAFAF9] placeholder:text-[#57534E] focus:border-[#A8A29E] focus:outline-none transition-colors"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex gap-2 w-full sm:w-auto font-mono text-[11px] uppercase tracking-[0.05em]">
          {[
            { id: 'all', label: 'ALL PAYLOADS' },
            { id: 'pdf', label: 'PDFS' },
            { id: 'img', label: 'IMAGES' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-2 rounded-[4px] border transition-colors ${
                activeTab === tab.id
                  ? 'bg-[#FAFAF9] text-[#0C0A09] border-[#FAFAF9] font-medium'
                  : 'bg-[#141110] text-[#57534E] border-[#292524] hover:text-[#FAFAF9]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Files List */}
      <div className="border border-[#292524] bg-[#1C1917] p-6 rounded-[8px]">
        <div className="border-b border-[#292524] pb-3 mb-4 flex justify-between items-center">
          <h2 className="font-mono text-[12px] uppercase tracking-[0.05em] text-[#57534E]">
            Indexed Files ({filteredFiles.length})
          </h2>
          <span className="font-mono text-[11px] text-[#57534E] uppercase">
            TTL: 2 HOURS
          </span>
        </div>

        {filteredFiles.length > 0 ? (
          <ul className="flex flex-col gap-2">
            {filteredFiles.map((file, i) => (
              <FileRow
                key={file.id || i}
                name={file.file_name || file.name}
                size={file.file_size || file.size}
                type={file.file_type || file.type || 'PDF'}
                uploadedAt={file.created_at ? new Date(file.created_at).toLocaleTimeString() : undefined}
                onDownload={file.download_url ? () => window.open(file.download_url, '_blank') : undefined}
              />
            ))}
          </ul>
        ) : (
          <div className="p-12 text-center bg-[#141110] border border-[#292524] rounded-[6px]">
            <p className="text-[15px] font-medium text-[#FAFAF9] mb-1">No matching files in vault</p>
            <p className="font-mono text-[12px] uppercase tracking-[0.05em] text-[#57534E]">
              Upload a document from the Dashboard or Tools suite to view it here
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
