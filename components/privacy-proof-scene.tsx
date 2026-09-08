'use client'

import React, { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { PrivacyProofStatic } from './privacy-proof-static'

// Dynamically import desktop-only GSAP scene so mobile never downloads GSAP
const PrivacyProofDesktop = dynamic(() => import('./privacy-proof-desktop'), {
  ssr: false,
  loading: () => <PrivacyProofStatic />
})

export function PrivacyProofScene() {
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
    return <PrivacyProofStatic />
  }

  return <PrivacyProofDesktop />
}
