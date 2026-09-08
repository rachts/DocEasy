'use client'

import React, { useEffect, useState } from 'react'

interface HeroHeadlineRevealProps {
  text?: string
  className?: string
}

export function HeroHeadlineReveal({
  text = "Document tools that respect your privacy.",
  className = "text-4xl sm:text-5xl md:text-6xl font-medium tracking-tight text-[#FAFAF9] leading-[1.1] max-w-4xl"
}: HeroHeadlineRevealProps) {
  const [mounted, setMounted] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    setReducedMotion(isReduced)
    setMounted(true)
  }, [])

  const words = text.split(' ')

  return (
    <h1 className={className}>
      {words.map((word, i) => (
        <span
          key={i}
          className="inline-block overflow-hidden align-top mr-[0.28em] last:mr-0 pb-1"
        >
          <span
            className={`inline-block transform-gpu transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              !mounted || reducedMotion
                ? 'translate-y-0 opacity-100'
                : 'translate-y-0 opacity-100'
            }`}
            style={
              mounted && !reducedMotion
                ? {
                    animation: `heroWordReveal 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${i * 65}ms both`
                  }
                : undefined
            }
          >
            {word}
          </span>
        </span>
      ))}
      <style jsx global>{`
        @keyframes heroWordReveal {
          0% {
            transform: translateY(115%);
            opacity: 0;
          }
          100% {
            transform: translateY(0%);
            opacity: 1;
          }
        }
      `}</style>
    </h1>
  )
}
