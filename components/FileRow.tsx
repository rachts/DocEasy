'use client'

import { Download, Trash2 } from 'lucide-react'

export interface FileRowProps {
  id?: string
  name: string
  size?: string | number
  type?: string
  uploadedAt?: string
  status?: 'processing' | 'completed' | 'idle' | 'failed'
  onDownload?: () => void
  onDelete?: () => void
  onAction?: () => void
  actionLabel?: string
}

export function FileRow({
  name,
  size,
  type = 'PDF',
  uploadedAt,
  status = 'completed',
  onDownload,
  onDelete,
  onAction,
  actionLabel = 'View'
}: FileRowProps) {
  const displayType = type.replace('application/', '').toUpperCase()
  const displaySize = typeof size === 'number' 
    ? (size > 1024 * 1024 ? `${(size / (1024 * 1024)).toFixed(1)}MB` : `${(size / 1024).toFixed(0)}KB`)
    : (size || '1.2MB')

  return (
    <li className="flex items-center justify-between p-4 border border-[#292524] bg-[#1C1917] hover:bg-[#221F1E] transition-colors duration-150 rounded-[8px]">
      <div className="flex items-center gap-4 min-w-0">
        {/* Type Badge Box */}
        <div className="w-12 h-14 bg-[#141110] flex items-center justify-center border border-[#292524] shrink-0 rounded-[4px]">
          <span className="font-mono text-[11px] font-medium text-[#57534E] uppercase tracking-[0.05em]">
            {displayType.slice(0, 4)}
          </span>
        </div>

        {/* File Info */}
        <div className="flex flex-col min-w-0">
          <span className="text-[15px] font-normal text-[#FAFAF9] truncate">
            {name}
          </span>
          <div className="flex items-center gap-2 mt-1">
            {status === 'processing' ? (
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#D6D3D1] pulse-dot" />
                <span className="text-[12px] text-[#78716C]">
                  Processing • <span className="font-mono text-[#A8A29E]">{displaySize}</span>
                </span>
              </div>
            ) : (
              <span className="text-[12px] text-[#78716C]">
                <span className="uppercase font-medium">{displayType}</span> • <span className="font-mono text-[#A8A29E]">{displaySize}</span> {uploadedAt ? `• ${uploadedAt}` : ''}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 shrink-0 ml-4">
        {status === 'processing' ? (
          <button
            onClick={onDelete}
            className="text-[12px] font-medium text-[#A8A29E] hover:text-[#FAFAF9] transition-colors duration-150 px-3 py-1.5 border border-transparent hover:border-[#292524] rounded-[6px]"
          >
            Cancel
          </button>
        ) : (
          <>
            {onAction && (
              <button
                onClick={onAction}
                className="text-[12px] font-medium text-[#A8A29E] hover:text-[#FAFAF9] transition-colors duration-150 px-3 py-1.5 border border-transparent hover:border-[#292524] rounded-[6px]"
              >
                {actionLabel}
              </button>
            )}
            {onDownload && (
              <button
                onClick={onDownload}
                className="text-[12px] font-medium text-[#A8A29E] hover:text-[#FAFAF9] transition-colors duration-150 px-3 py-1.5 border border-transparent hover:border-[#292524] rounded-[6px] flex items-center gap-1.5"
                title="Download"
              >
                <Download className="w-3.5 h-3.5 stroke-[1.5]" />
                <span className="hidden sm:inline">Download</span>
              </button>
            )}
            {onDelete && (
              <button
                onClick={onDelete}
                className="text-[12px] font-medium text-[#A8A29E] hover:text-[#7F1D1D] transition-colors duration-150 px-3 py-1.5 border border-transparent hover:border-[#292524] rounded-[6px]"
                title="Delete"
              >
                <Trash2 className="w-3.5 h-3.5 stroke-[1.5]" />
              </button>
            )}
          </>
        )}
      </div>
    </li>
  )
}
