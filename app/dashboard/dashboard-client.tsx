'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { UploadZone } from '@/components/UploadZone'
import { FileRow } from '@/components/FileRow'
import { VaultPadlock } from '@/components/vault-padlock'
import { getRecentFiles } from '@/lib/supabase/helpers'
import { GripVertical } from 'lucide-react'

interface DashboardClientProps {
  initialFiles?: any[]
}

export function DashboardClient({ initialFiles = [] }: DashboardClientProps) {
  const router = useRouter()
  const [recentUploads, setRecentUploads] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null)
  const [dragOverIdx, setDragOverIdx] = useState<number | null>(null)
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    setReducedMotion(isReduced)

    // Combine server files or client stored files
    const local = getRecentFiles()
    let baseList: any[] = []

    if (initialFiles && initialFiles.length > 0) {
      baseList = initialFiles
    } else if (local && local.length > 0) {
      baseList = local
    } else {
      // Default sample items matching design specification
      baseList = [
        {
          id: '1',
          name: 'Q3_Financial_Report.pdf',
          file_type: 'application/pdf',
          file_size: 4404019,
          status: 'processing',
          uploadedAt: 'Processing',
        },
        {
          id: '2',
          name: 'Project_Architecture_V2.docx',
          file_type: 'application/docx',
          file_size: 1153433,
          status: 'completed',
          uploadedAt: 'Uploaded 12m ago',
          tool_used: 'compressor',
        },
        {
          id: '3',
          name: 'Server_Logs_Prod.txt',
          file_type: 'text/plain',
          file_size: 8808038,
          status: 'completed',
          uploadedAt: 'Uploaded 1h ago',
          tool_used: 'converter',
        },
        {
          id: '4',
          name: 'System_Telemetry_Dump.pdf',
          file_type: 'application/pdf',
          file_size: 2516582,
          status: 'completed',
          uploadedAt: 'Uploaded 2h ago',
          tool_used: 'compressor',
        },
      ]
    }

    // Check if visual session order was persisted in localStorage
    try {
      const savedOrder = localStorage.getItem('doceasy_dashboard_order')
      if (savedOrder) {
        const orderIds: string[] = JSON.parse(savedOrder)
        const idMap = new Map(baseList.map((item) => [String(item.id), item]))
        const ordered = orderIds.filter((id) => idMap.has(id)).map((id) => idMap.get(id))
        const unassigned = baseList.filter((item) => !orderIds.includes(String(item.id)))
        baseList = [...ordered, ...unassigned]
      }
    } catch {
      // Ignore localStorage errors
    }

    setRecentUploads(baseList)
    setLoading(false)
  }, [initialFiles])

  const handleFileDrop = (file: File) => {
    if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
      router.push('/tools/compress')
    } else {
      router.push('/tools/convert')
    }
  }

  const handleDeleteItem = (index: number) => {
    setRecentUploads((prev) => {
      const updated = prev.filter((_, i) => i !== index)
      try {
        localStorage.setItem(
          'doceasy_dashboard_order',
          JSON.stringify(updated.map((item) => String(item.id)))
        )
      } catch {}
      return updated
    })
  }

  // HTML5 Drag-to-Reorder Handlers
  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIdx(index)
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', `${index}`)
  }

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    if (dragOverIdx !== index) {
      setDragOverIdx(index)
    }
  }

  const handleDragLeave = () => {
    setDragOverIdx(null)
  }

  const handleDrop = (e: React.DragEvent, targetIdx: number) => {
    e.preventDefault()
    setDragOverIdx(null)
    if (draggedIdx === null || draggedIdx === targetIdx) {
      setDraggedIdx(null)
      return
    }

    setRecentUploads((prev) => {
      const updated = [...prev]
      const [moved] = updated.splice(draggedIdx, 1)
      updated.splice(targetIdx, 0, moved)

      // Persist visual order in localStorage (Note: DB persistence is out of scope; database remains ordered by created_at)
      try {
        localStorage.setItem(
          'doceasy_dashboard_order',
          JSON.stringify(updated.map((item) => String(item.id)))
        )
      } catch {}

      return updated
    })

    setDraggedIdx(null)
  }

  const handleDragEnd = () => {
    setDraggedIdx(null)
    setDragOverIdx(null)
  }

  return (
    <div className="flex flex-col gap-10">
      {/* Upload Drop Zone */}
      <UploadZone
        onFileSelect={handleFileDrop}
        title="Drop files here"
        subtitle="Automatic tool routing for PDF, DOCX, TXT and images"
      />

      {/* File List Section */}
      <div className="w-full flex flex-col">
        <div className="border-b border-[#292524] pb-3 mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3">
          <div className="flex items-center gap-4">
            <h2 className="font-mono text-[12px] uppercase tracking-[0.05em] text-[#57534E]">
              Recent Uploads
            </h2>
            <VaultPadlock initialUnlocked={true} />
          </div>

          <div className="flex items-center gap-3">
            <span className="font-mono text-[11px] text-[#78716C] hidden sm:inline">
              Drag rows to reorder (visual session order)
            </span>
            <span className="text-[#57534E] hidden sm:inline">•</span>
            <span className="font-mono text-[12px] uppercase tracking-[0.05em] text-[#57534E]">
              {recentUploads.length} {recentUploads.length === 1 ? 'FILE' : 'FILES'}
            </span>
          </div>
        </div>

        {/* Shimmer Skeleton (Rendered only while hydrating/loading, never blocks real data) */}
        {loading ? (
          <div className="flex flex-col gap-2">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="h-16 w-full rounded-[6px] bg-[#141110] border border-[#292524] p-4 flex items-center justify-between animate-pulse"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-[#292524]" />
                  <div className="flex flex-col gap-1.5">
                    <div className="w-48 h-3.5 rounded bg-[#292524]" />
                    <div className="w-24 h-2.5 rounded bg-[#1C1917]" />
                  </div>
                </div>
                <div className="w-20 h-8 rounded bg-[#292524]" />
              </div>
            ))}
          </div>
        ) : recentUploads.length > 0 ? (
          <ul className="flex flex-col gap-2">
            {recentUploads.map((item, idx) => (
              <li
                key={item.id || idx}
                draggable
                onDragStart={(e) => handleDragStart(e, idx)}
                onDragOver={(e) => handleDragOver(e, idx)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, idx)}
                onDragEnd={handleDragEnd}
                style={
                  !reducedMotion
                    ? {
                        animation: `dashboardCascade 240ms cubic-bezier(0.16, 1, 0.3, 1) ${idx * 40}ms both`,
                      }
                    : undefined
                }
                className={`relative transition-all duration-150 rounded-[6px] group flex items-center ${
                  draggedIdx === idx
                    ? 'opacity-40 scale-[0.98]'
                    : dragOverIdx === idx
                    ? 'border-t-2 border-emerald-400'
                    : ''
                }`}
              >
                {/* Drag Handle */}
                <div
                  className="cursor-grab active:cursor-grabbing p-2 text-[#57534E] hover:text-[#FAFAF9] transition-colors shrink-0"
                  title="Drag to reorder card"
                  aria-label="Drag to reorder"
                >
                  <GripVertical className="w-4 h-4 stroke-[1.5]" />
                </div>

                <div className="flex-1 min-w-0">
                  <FileRow
                    name={item.name || item.file_name}
                    size={item.size || item.file_size}
                    type={item.type || item.file_type || 'PDF'}
                    uploadedAt={item.uploadedAt}
                    status={item.status || 'completed'}
                    actionLabel={item.status === 'processing' ? 'Cancel' : 'Compress'}
                    onAction={() => router.push('/tools/compress')}
                    onDelete={() => handleDeleteItem(idx)}
                  />
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="p-12 text-center border border-[#292524] bg-[#141110] rounded-[8px]">
            <p className="text-[15px] text-[#FAFAF9] font-medium mb-1">No files yet</p>
            <p className="font-mono text-[12px] uppercase tracking-[0.05em] text-[#57534E]">
              Drop a file above to begin processing
            </p>
          </div>
        )}
      </div>

      <style jsx global>{`
        @keyframes dashboardCascade {
          0% {
            opacity: 0;
            transform: translateY(8px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}
