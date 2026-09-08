'use client'

import React, { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { ArrowRight, LucideIcon } from 'lucide-react'

export interface ToolItem {
  title: string
  description: string
  icon: LucideIcon
  href: string
  category: string
}

interface ToolsBentoGridProps {
  tools: ToolItem[]
  searchQuery: string
}

export function ToolsBentoGrid({ tools, searchQuery }: ToolsBentoGridProps) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null)
  const [isDesktopPointer, setIsDesktopPointer] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(motionQuery.matches)
    const handleMotionChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches)
    motionQuery.addEventListener('change', handleMotionChange)

    const pointerQuery = window.matchMedia('(min-width: 1024px) and (pointer: fine)')
    setIsDesktopPointer(pointerQuery.matches)
    const handlePointerChange = (e: MediaQueryListEvent) => setIsDesktopPointer(e.matches)
    pointerQuery.addEventListener('change', handlePointerChange)

    return () => {
      motionQuery.removeEventListener('change', handleMotionChange)
      pointerQuery.removeEventListener('change', handlePointerChange)
    }
  }, [])

  const allowPointerEffects = isDesktopPointer && !reducedMotion

  return (
    <div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
      onMouseLeave={() => setHoveredIdx(null)}
      style={{ perspective: allowPointerEffects ? '1200px' : undefined }}
    >
      {tools.map((tool, idx) => (
        <BentoCard
          key={tool.title}
          tool={tool}
          idx={idx}
          hoveredIdx={hoveredIdx}
          setHoveredIdx={setHoveredIdx}
          allowPointerEffects={allowPointerEffects}
        />
      ))}

      {tools.length === 0 && (
        <div className="col-span-full text-center py-16 text-[13px] text-[#78716C]">
          No tools found matching &ldquo;{searchQuery}&rdquo;. Press ⌘K to search.
        </div>
      )}
    </div>
  )
}

function BentoCard({
  tool,
  idx,
  hoveredIdx,
  setHoveredIdx,
  allowPointerEffects
}: {
  tool: ToolItem
  idx: number
  hoveredIdx: number | null
  setHoveredIdx: (i: number | null) => void
  allowPointerEffects: boolean
}) {
  const cardRef = useRef<HTMLAnchorElement | null>(null)
  const [tilt, setTilt] = useState<{ x: number; y: number }>({ x: 0, y: 0 })

  const isHovered = hoveredIdx === idx
  const hasNeighborHovered = hoveredIdx !== null && hoveredIdx !== idx

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!allowPointerEffects || !cardRef.current) return

    const rect = cardRef.current.getBoundingClientRect()
    const px = (e.clientX - rect.left) / rect.width
    const py = (e.clientY - rect.top) / rect.height

    const normX = (px - 0.5) * 2
    const normY = (py - 0.5) * 2

    // Strictly capped at maximum 6 degrees
    const rotY = Math.max(-6, Math.min(6, normX * 6))
    const rotX = Math.max(-6, Math.min(6, -normY * 6))

    setTilt({ x: rotX, y: rotY })
  }

  const handleMouseEnter = () => {
    setHoveredIdx(idx)
  }

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 })
    if (hoveredIdx === idx) {
      setHoveredIdx(null)
    }
  }

  // Calculate transform styles
  let transformStyle = 'none'
  if (allowPointerEffects) {
    if (isHovered) {
      // Spring pop on hovered card + 3D tilt
      transformStyle = `rotateX(${tilt.x.toFixed(2)}deg) rotateY(${tilt.y.toFixed(2)}deg) scale3d(1.025, 1.025, 1.025) translateZ(8px)`
    } else if (hasNeighborHovered) {
      // Sibling scale down subtly
      transformStyle = 'scale3d(0.985, 0.985, 0.985) translateZ(0px)'
    }
  }

  return (
    <Link
      ref={cardRef}
      href={tool.href}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: transformStyle,
        transformStyle: allowPointerEffects ? 'preserve-3d' : undefined,
        opacity: hasNeighborHovered ? 0.78 : 1,
        transition: allowPointerEffects
          ? 'transform 200ms cubic-bezier(0.16, 1, 0.3, 1), opacity 200ms ease, border-color 150ms ease'
          : 'border-color 150ms ease'
      }}
      className={`group relative bg-[#1C1917] border rounded-[8px] p-6 flex flex-col justify-between cursor-pointer will-change-transform ${
        isHovered
          ? 'border-[#A8A29E] shadow-xl shadow-black/50 z-10'
          : 'border-[#292524] hover:border-[#57534E]'
      }`}
    >
      <div>
        <div className="flex items-center justify-between mb-5">
          <div className="w-10 h-10 rounded-[5px] bg-[#141110] border border-[#292524] group-hover:border-[#A8A29E] flex items-center justify-center transition-colors duration-150">
            <tool.icon className="w-5 h-5 text-[#A8A29E] group-hover:text-[#FAFAF9] stroke-[1.5] transition-colors duration-150" />
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#141110] border border-[#292524] text-[#A8A29E] uppercase tracking-wider">
            {tool.category}
          </span>
        </div>

        <h3 className="text-[17px] font-medium text-[#FAFAF9] mb-2">
          {tool.title}
        </h3>
        <p className="text-[13.5px] text-[#A8A29E] leading-relaxed mb-6">
          {tool.description}
        </p>
      </div>

      <div className="pt-4 border-t border-[#292524] flex items-center justify-between text-[12px] font-medium text-[#57534E] group-hover:text-[#FAFAF9] transition-colors">
        <span>Open tool</span>
        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
      </div>
    </Link>
  )
}
