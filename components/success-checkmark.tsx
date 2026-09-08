'use client'

import React, { useState, useEffect } from 'react'

interface SuccessCheckmarkProps {
  size?: number
  className?: string
  onComplete?: () => void
}

export function SuccessCheckmark({
  size = 48,
  className = '',
  onComplete
}: SuccessCheckmarkProps) {
  const [reducedMotion, setReducedMotion] = useState(false)
  const [completed, setCompleted] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    setReducedMotion(isReduced)

    if (isReduced) {
      setCompleted(true)
      onComplete?.()
      return
    }

    // Animation runs in <300ms (260ms total)
    const timer = setTimeout(() => {
      setCompleted(true)
      onComplete?.()
    }, 260)

    return () => clearTimeout(timer)
  }, [onComplete])

  // Allow clicking anywhere on the checkmark to immediately complete / skip animation
  const handleSkip = () => {
    setCompleted(true)
    onComplete?.()
  }

  return (
    <div
      onClick={handleSkip}
      className={`inline-flex items-center justify-center cursor-pointer select-none ${className}`}
      title="Processing complete"
      aria-label="Success checkmark"
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 52 52"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="transform-gpu"
      >
        {/* Outer circular badge */}
        <circle
          cx="26"
          cy="26"
          r="24"
          stroke="#10B981"
          strokeWidth="2.5"
          className={
            reducedMotion || completed
              ? 'stroke-emerald-400'
              : 'checkmark-circle stroke-emerald-400'
          }
          style={{
            strokeDasharray: 151,
            strokeDashoffset: reducedMotion || completed ? 0 : 151
          }}
        />

        {/* Checkmark stroke */}
        <path
          d="M15 27L22.5 34.5L37 19"
          stroke="#10B981"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={
            reducedMotion || completed
              ? 'stroke-emerald-400'
              : 'checkmark-check stroke-emerald-400'
          }
          style={{
            strokeDasharray: 36,
            strokeDashoffset: reducedMotion || completed ? 0 : 36
          }}
        />
      </svg>

      <style jsx>{`
        .checkmark-circle {
          animation: circleDraw 200ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .checkmark-check {
          animation: checkDraw 160ms cubic-bezier(0.16, 1, 0.3, 1) 100ms forwards;
        }

        @keyframes circleDraw {
          from {
            stroke-dashoffset: 151;
          }
          to {
            stroke-dashoffset: 0;
          }
        }

        @keyframes checkDraw {
          from {
            stroke-dashoffset: 36;
          }
          to {
            stroke-dashoffset: 0;
          }
        }
      `}</style>
    </div>
  )
}
