'use client'

import React from 'react'

interface ProgressBarProps {
  progress?: number
  active?: boolean
  className?: string
}

export function ProgressBar({ progress = 100, active = false, className = '' }: ProgressBarProps) {
  if (!active && progress === 0) return null

  return (
    <div className={`fixed top-0 left-0 w-full h-[2px] bg-[#292524] z-50 overflow-hidden ${className}`}>
      <div
        className="h-full bg-[#D6D3D1] transition-all duration-150 ease-out"
        style={{
          width: `${Math.min(100, Math.max(0, progress))}%`,
        }}
      />
    </div>
  )
}
