'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { UploadZone } from '@/components/UploadZone'
import { FileRow } from '@/components/FileRow'
import { getRecentFiles, clearRecentFiles } from '@/lib/supabase/helpers'

interface DashboardClientProps {
  initialFiles?: any[]
}

export function DashboardClient({ initialFiles = [] }: DashboardClientProps) {
  const router = useRouter()
  const [recentUploads, setRecentUploads] = useState<any[]>([])

  useEffect(() => {
    // Combine server files or client stored files
    const local = getRecentFiles()
    if (initialFiles && initialFiles.length > 0) {
      setRecentUploads(initialFiles)
    } else if (local && local.length > 0) {
      setRecentUploads(local)
    } else {
      // Default sample items matching design specification
      setRecentUploads([
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
          tool_used: 'compressor'
        },
        {
          id: '3',
          name: 'Server_Logs_Prod.txt',
          file_type: 'text/plain',
          file_size: 8808038,
          status: 'completed',
          uploadedAt: 'Uploaded 1h ago',
          tool_used: 'converter'
        },
        {
          id: '4',
          name: 'System_Telemetry_Dump.pdf',
          file_type: 'application/pdf',
          file_size: 2516582,
          status: 'completed',
          uploadedAt: 'Uploaded 2h ago',
          tool_used: 'compressor'
        }
      ])
    }
  }, [initialFiles])

  const handleFileDrop = (file: File) => {
    // If dropped file is PDF, route to compress or converter
    if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
      router.push('/tools/compress')
    } else {
      router.push('/tools/convert')
    }
  }

  const handleDeleteItem = (index: number) => {
    setRecentUploads((prev) => prev.filter((_, i) => i !== index))
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
        <div className="border-b border-[#292524] pb-3 mb-4 flex justify-between items-end">
          <h2 className="font-mono text-[12px] uppercase tracking-[0.05em] text-[#57534E]">
            Recent Uploads
          </h2>
          <div className="flex items-center gap-3">
            <span className="font-mono text-[12px] uppercase tracking-[0.05em] text-[#57534E]">
              {recentUploads.length} {recentUploads.length === 1 ? 'FILE' : 'FILES'}
            </span>
          </div>
        </div>

        {recentUploads.length > 0 ? (
          <ul className="flex flex-col gap-2">
            {recentUploads.map((item, idx) => (
              <FileRow
                key={item.id || idx}
                name={item.name || item.file_name}
                size={item.size || item.file_size}
                type={item.type || item.file_type || 'PDF'}
                uploadedAt={item.uploadedAt}
                status={item.status || 'completed'}
                actionLabel={item.status === 'processing' ? 'Cancel' : 'Compress'}
                onAction={() => router.push('/tools/compress')}
                onDelete={() => handleDeleteItem(idx)}
              />
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
    </div>
  )
}
