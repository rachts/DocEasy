'use client'

import React from 'react'

export function HeroWebGLStatic() {
  return (
    <div
      className="absolute inset-0 pointer-events-none overflow-hidden opacity-60"
      aria-hidden="true"
    >
      {/* Lightweight CSS ambient gradient for mobile & reduced motion */}
      <div
        className="w-full h-full"
        style={{
          background:
            'radial-gradient(ellipse at 70% 30%, rgba(217, 119, 6, 0.08) 0%, rgba(250, 250, 249, 0.03) 40%, transparent 75%)'
        }}
      />
    </div>
  )
}
