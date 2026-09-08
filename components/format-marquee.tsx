'use client'

import React from 'react'

const FORMATS = [
  { ext: 'PDF', label: 'Portable Document', badge: 'Client WASM' },
  { ext: 'PNG', label: 'Portable Network Graphics', badge: 'Lossless' },
  { ext: 'JPG', label: 'JPEG Image', badge: 'Quantized' },
  { ext: 'WEBP', label: 'Modern Web Image', badge: 'High Compression' },
  { ext: 'AVIF', label: 'Next-Gen Codec', badge: 'Canvas Render' },
  { ext: 'DOCX', label: 'Word Document', badge: 'Local Parser' },
  { ext: 'MD', label: 'Markdown Format', badge: 'Text Stream' },
  { ext: 'TXT', label: 'Plain Text Stream', badge: 'Zero Egress' },
]

export function FormatMarquee() {
  // Duplicate array for seamless infinite CSS looping
  const items = [...FORMATS, ...FORMATS]

  return (
    <div className="w-full overflow-hidden py-3 border-y border-[#292524] bg-[#100E0D] relative group select-none">
      {/* Edge gradient masks */}
      <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-[#0C0A09] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-[#0C0A09] to-transparent z-10 pointer-events-none" />

      <div className="format-marquee-track flex gap-4 w-max items-center">
        {items.map((item, idx) => (
          <div
            key={`${item.ext}-${idx}`}
            className="flex items-center gap-2.5 px-3 py-1.5 rounded-[5px] bg-[#141110] border border-[#292524] text-xs shrink-0 hover:border-[#A8A29E] transition-colors"
          >
            <span className="font-mono font-semibold text-[#FAFAF9]">{item.ext}</span>
            <span className="text-[#57534E]">•</span>
            <span className="text-[#A8A29E] text-[11px] hidden sm:inline">{item.label}</span>
            <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-[#1C1917] text-[#A8A29E] border border-[#292524]">
              {item.badge}
            </span>
          </div>
        ))}
      </div>

      <style jsx>{`
        .format-marquee-track {
          animation: marqueeScroll 24s linear infinite;
        }

        .group:hover .format-marquee-track {
          animation-play-state: paused;
        }

        @keyframes marqueeScroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .format-marquee-track {
            animation: none !important;
            transform: none !important;
            flex-wrap: wrap;
            justify-content: center;
          }
        }
      `}</style>
    </div>
  )
}
