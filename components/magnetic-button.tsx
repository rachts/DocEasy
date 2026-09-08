'use client'

import React, { useRef, useEffect, useState } from 'react'
import { gsap } from 'gsap'

interface MagneticButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  className?: string
  strength?: number
}

export function MagneticButton({
  children,
  className = '',
  strength = 0.25,
  onClick,
  ...props
}: MagneticButtonProps) {
  const btnRef = useRef<HTMLButtonElement | null>(null)
  const [isDesktopPointer, setIsDesktopPointer] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(motionQuery.matches)
    const handleMotion = (e: MediaQueryListEvent) => setReducedMotion(e.matches)
    motionQuery.addEventListener('change', handleMotion)

    const pointerQuery = window.matchMedia('(min-width: 1024px) and (pointer: fine)')
    setIsDesktopPointer(pointerQuery.matches)
    const handlePointer = (e: MediaQueryListEvent) => setIsDesktopPointer(e.matches)
    pointerQuery.addEventListener('change', handlePointer)

    return () => {
      motionQuery.removeEventListener('change', handleMotion)
      pointerQuery.removeEventListener('change', handlePointer)
    }
  }, [])

  useEffect(() => {
    const btn = btnRef.current
    if (!btn || !isDesktopPointer || reducedMotion) return

    // QuickTo setters for 60fps GPU transform
    const xTo = gsap.quickTo(btn, 'x', { duration: 0.35, ease: 'power2.out' })
    const yTo = gsap.quickTo(btn, 'y', { duration: 0.35, ease: 'power2.out' })

    const handleMouseMove = (e: MouseEvent) => {
      const rect = btn.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2

      const distRelX = e.clientX - centerX
      const distRelY = e.clientY - centerY

      // Clamp max displacement to 10px so clicks never misfire
      const moveX = Math.max(-10, Math.min(10, distRelX * strength))
      const moveY = Math.max(-10, Math.min(10, distRelY * strength))

      xTo(moveX)
      yTo(moveY)
    }

    const handleMouseLeave = () => {
      xTo(0)
      yTo(0)
    }

    btn.addEventListener('mousemove', handleMouseMove)
    btn.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      btn.removeEventListener('mousemove', handleMouseMove)
      btn.removeEventListener('mouseleave', handleMouseLeave)
      gsap.killTweensOf(btn)
      gsap.set(btn, { x: 0, y: 0 })
    }
  }, [isDesktopPointer, reducedMotion, strength])

  return (
    <button
      ref={btnRef}
      onClick={onClick}
      className={`will-change-transform ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
