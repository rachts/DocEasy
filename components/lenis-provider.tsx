'use client'

import React, { createContext, useContext, useEffect, useRef, useState } from 'react'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const LenisContext = createContext<Lenis | null>(null)

export function useLenis() {
  return useContext(LenisContext)
}

export function LenisProvider({ children }: { children: React.ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null)
  const lenisRef = useRef<Lenis | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return

    // Honor prefers-reduced-motion: do not smooth-scroll if reduced motion requested
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) {
      return
    }

    const instance = new Lenis({
      duration: 1.0,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // smooth exponential ease-out
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      syncTouch: false, // Do not trap or intercept touch events on mobile
      touchMultiplier: 1.0
    })

    lenisRef.current = instance
    setLenis(instance)

    // Synchronize Lenis scroll position with GSAP ScrollTrigger
    instance.on('scroll', ScrollTrigger.update)

    // Feed Lenis into GSAP ticker for synchronized 60fps frame rate
    const updateTicker = (time: number) => {
      instance.raf(time * 1000)
    }
    gsap.ticker.add(updateTicker)
    gsap.ticker.lagSmoothing(0)

    const handleReducedMotionChange = (e: MediaQueryListEvent) => {
      if (e.matches) {
        instance.destroy()
        lenisRef.current = null
        setLenis(null)
      }
    }
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    motionQuery.addEventListener('change', handleReducedMotionChange)

    return () => {
      motionQuery.removeEventListener('change', handleReducedMotionChange)
      gsap.ticker.remove(updateTicker)
      instance.destroy()
      lenisRef.current = null
      setLenis(null)
    }
  }, [])

  return (
    <LenisContext.Provider value={lenis}>
      {children}
    </LenisContext.Provider>
  )
}
