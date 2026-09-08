'use client'

import React, { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { HeroWebGLStatic } from './hero-webgl-static'

// Dynamically import desktop-only WebGL shader plane so mobile never downloads WebGL chunks
const HeroWebGLCanvas = dynamic(() => import('./hero-webgl-canvas'), {
  ssr: false,
  loading: () => <HeroWebGLStatic />
})

export function HeroWebGLScene() {
  const [isDesktop, setIsDesktop] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(motionQuery.matches)
    const handleMotionChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches)
    motionQuery.addEventListener('change', handleMotionChange)

    const desktopQuery = window.matchMedia('(min-width: 1024px) and (pointer: fine)')
    setIsDesktop(desktopQuery.matches)
    const handleDesktopChange = (e: MediaQueryListEvent) => setIsDesktop(e.matches)
    desktopQuery.addEventListener('change', handleDesktopChange)

    return () => {
      motionQuery.removeEventListener('change', handleMotionChange)
      desktopQuery.removeEventListener('change', handleDesktopChange)
    }
  }, [])

  if (reducedMotion || !isDesktop) {
    return <HeroWebGLStatic />
  }

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
      <HeroWebGLCanvas />
    </div>
  )
}
