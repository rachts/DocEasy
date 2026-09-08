'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence, useMotionValue, useSpring } from 'motion/react'
import { FileText, ArrowDown, Sparkles, Check, X } from 'lucide-react'
import { useGlobalDrop } from './global-drop-context'
import { setPendingDroppedFile } from '@/lib/global-file-stash'

interface Particle {
  x: number
  y: number
  angle: number
  radius: number
  speed: number
  size: number
  opacity: number
  color: string
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function GlobalDropOverlay() {
  const router = useRouter()
  const globalDrop = useGlobalDrop()

  const [isDragging, setIsDragging] = useState(false)
  const [dropState, setDropState] = useState<'idle' | 'shattering' | 'reassembled'>('idle')
  const [droppedFile, setDroppedFile] = useState<{ name: string; size: number } | null>(null)
  const [reducedMotion, setReducedMotion] = useState(false)
  const [isTouchDevice, setIsTouchDevice] = useState(false)

  const dragCounterRef = useRef(0)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const rafRef = useRef<number | null>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  // Cursor tracking motion values
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const springX = useSpring(mouseX, { damping: 22, stiffness: 240 })
  const springY = useSpring(mouseY, { damping: 22, stiffness: 240 })

  // Check reduced motion & touch capabilities
  useEffect(() => {
    if (typeof window === 'undefined') return

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(motionQuery.matches)
    const handleMotionChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches)
    motionQuery.addEventListener('change', handleMotionChange)

    const touchQuery = window.matchMedia('(pointer: coarse)')
    setIsTouchDevice(touchQuery.matches || 'ontouchstart' in window)

    return () => {
      motionQuery.removeEventListener('change', handleMotionChange)
    }
  }, [])

  // Cleanup helper
  const cleanup = useCallback(() => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d')
      if (ctx) {
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
      }
    }
    setDropState('idle')
    setDroppedFile(null)
    setIsDragging(false)
    dragCounterRef.current = 0
  }, [])

  // Particle animation sequence
  const startParticleShatter = useCallback(
    (originX: number, originY: number, file: File) => {
      const originalSize = file.size
      setDroppedFile({ name: file.name, size: originalSize })

      if (reducedMotion || isTouchDevice) {
        // Fast simplified path for reduced-motion / mobile
        setDropState('reassembled')
        timerRef.current = setTimeout(() => {
          cleanup()
        }, 800)
        return
      }

      setDropState('shattering')

      const canvas = canvasRef.current
      if (!canvas) return
      const ctx = canvas.getContext('2d')
      if (!ctx) return

      canvas.width = window.innerWidth
      canvas.height = window.innerHeight

      // Create 50 particles around drop point
      const particles: Particle[] = []
      const particleCount = 48
      const colors = ['#FAFAF9', '#D6D3D1', '#A8A29E', '#78716C', '#F59E0B']

      for (let i = 0; i < particleCount; i++) {
        const initialRadius = 30 + Math.random() * 90
        const angle = Math.random() * Math.PI * 2
        particles.push({
          x: originX + Math.cos(angle) * initialRadius,
          y: originY + Math.sin(angle) * initialRadius,
          angle,
          radius: initialRadius,
          speed: 1.5 + Math.random() * 2.5,
          size: 2 + Math.random() * 2.5,
          opacity: 0.9,
          color: colors[Math.floor(Math.random() * colors.length)]
        })
      }

      let frameCount = 0
      const maxFrames = 45

      const animateParticles = () => {
        frameCount++
        ctx.clearRect(0, 0, canvas.width, canvas.height)

        let alive = false

        for (const p of particles) {
          // Spiral inward toward origin
          p.radius = Math.max(0, p.radius - p.speed * 2)
          p.angle += 0.08 // angular rotation
          p.x = originX + Math.cos(p.angle) * p.radius
          p.y = originY + Math.sin(p.angle) * p.radius
          p.opacity = Math.max(0, p.radius / 90)

          if (p.radius > 2) {
            alive = true
            ctx.beginPath()
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
            ctx.fillStyle = p.color
            ctx.globalAlpha = p.opacity
            ctx.shadowBlur = 8
            ctx.shadowColor = p.color
            ctx.fill()
          }
        }

        ctx.globalAlpha = 1
        ctx.shadowBlur = 0

        if (alive && frameCount < maxFrames) {
          rafRef.current = requestAnimationFrame(animateParticles)
        } else {
          // Particles finished spiraling inward -> reassemble
          ctx.clearRect(0, 0, canvas.width, canvas.height)
          setDropState('reassembled')
          timerRef.current = setTimeout(() => {
            cleanup()
          }, 1400)
        }
      }

      rafRef.current = requestAnimationFrame(animateParticles)
    },
    [cleanup, isTouchDevice, reducedMotion]
  )

  // Window drag events setup
  useEffect(() => {
    if (typeof window === 'undefined') return

    const handleDragEnter = (e: DragEvent) => {
      e.preventDefault()
      dragCounterRef.current++
      if (e.dataTransfer && e.dataTransfer.types.includes('Files')) {
        setIsDragging(true)
        mouseX.set(e.clientX)
        mouseY.set(e.clientY)
      }
    }

    const handleDragOver = (e: DragEvent) => {
      e.preventDefault()
      if (e.dataTransfer) {
        e.dataTransfer.dropEffect = 'copy'
      }
      mouseX.set(e.clientX)
      mouseY.set(e.clientY)
    }

    const handleDragLeave = (e: DragEvent) => {
      e.preventDefault()
      dragCounterRef.current--
      if (dragCounterRef.current <= 0) {
        setIsDragging(false)
        dragCounterRef.current = 0
      }
    }

    const handleDrop = (e: DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      dragCounterRef.current = 0

      const files = e.dataTransfer?.files
      if (!files || files.length === 0) return

      const file = files[0]
      const dropX = e.clientX || window.innerWidth / 2
      const dropY = e.clientY || window.innerHeight / 2

      // 1. Real execution first: invoke active tool drop handler if registered
      const activeHandler = globalDrop?.getActiveDropHandler()
      if (activeHandler) {
        activeHandler(file)
      } else {
        // Default routing when on a non-tool page
        setPendingDroppedFile(file)
        if (file.type.startsWith('image/')) {
          router.push('/tools/image-compressor')
        } else {
          router.push('/tools/compress')
        }
      }

      // 2. Play the drop visual animation
      startParticleShatter(dropX, dropY, file)
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        cleanup()
      }
    }

    window.addEventListener('dragenter', handleDragEnter)
    window.addEventListener('dragover', handleDragOver)
    window.addEventListener('dragleave', handleDragLeave)
    window.addEventListener('drop', handleDrop)
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('dragenter', handleDragEnter)
      window.removeEventListener('dragover', handleDragOver)
      window.removeEventListener('dragleave', handleDragLeave)
      window.removeEventListener('drop', handleDrop)
      window.removeEventListener('keydown', handleKeyDown)
      cleanup()
    }
  }, [cleanup, globalDrop, mouseX, mouseY, router, startParticleShatter])

  if (!isDragging && dropState === 'idle') {
    return null
  }

  const estimatedAfterSize = droppedFile ? Math.round(droppedFile.size * 0.22) : 0
  const estimatedSavings = 78

  return (
    <div
      className="fixed inset-0 z-[9999] pointer-events-none select-none"
      aria-hidden="true"
    >
      {/* 1. Page Dimming Backdrop */}
      <motion.div
        className="absolute inset-0 bg-[#0C0A09]/80 backdrop-blur-[2px]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: reducedMotion ? 0.05 : 0.15 }}
      />

      {/* 2. Particle Shatter & Spiral Canvas Layer */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none z-10"
      />

      {/* 3. Glowing Dashed Magnetic Portal (follows cursor while dragging) */}
      {isDragging && !isTouchDevice && (
        <motion.div
          style={{
            x: springX,
            y: springY,
            translateX: '-50%',
            translateY: '-50%'
          }}
          className="absolute pointer-events-none z-20 flex flex-col items-center justify-center"
        >
          {/* Radial Aura Glow */}
          <div
            className="w-56 h-56 rounded-full absolute"
            style={{
              background:
                'radial-gradient(circle, rgba(250,250,249,0.18) 0%, rgba(250,250,249,0.05) 50%, transparent 70%)'
            }}
          />

          {/* Magnetic Dashed Rotating Ring */}
          <motion.div
            animate={reducedMotion ? {} : { rotate: 360 }}
            transition={{ repeat: Infinity, duration: 12, ease: 'linear' }}
            className="w-44 h-44 rounded-full border-2 border-dashed border-[#FAFAF9]/80 flex items-center justify-center"
          />

          {/* Magnetic Center Badge */}
          <div className="absolute flex flex-col items-center justify-center gap-2 text-center pointer-events-none">
            <motion.div
              animate={reducedMotion ? {} : { y: [0, 4, 0] }}
              transition={{ repeat: Infinity, duration: 1.2, ease: 'easeInOut' }}
              className="w-11 h-11 rounded-full bg-[#1C1917] border border-[#FAFAF9]/30 flex items-center justify-center shadow-lg"
            >
              <ArrowDown className="w-5 h-5 text-[#FAFAF9]" />
            </motion.div>
            <span className="text-[12px] font-medium text-[#FAFAF9] tracking-tight bg-[#0C0A09]/90 px-2.5 py-1 rounded-[4px] border border-[#292524]">
              Release to drop
            </span>
          </div>
        </motion.div>
      )}

      {/* Mobile / Full-screen Drop Indicator when touch or dragging */}
      {isDragging && isTouchDevice && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20 p-6">
          <div className="bg-[#141110] border-2 border-dashed border-[#FAFAF9]/60 rounded-xl p-8 flex flex-col items-center gap-3 text-center max-w-xs">
            <ArrowDown className="w-8 h-8 text-[#FAFAF9]" />
            <p className="text-base font-medium text-[#FAFAF9]">Drop file here</p>
            <p className="text-xs text-[#A8A29E]">Release to start processing</p>
          </div>
        </div>
      )}

      {/* 4. Reassembled Output Representation & Odometer Transformation */}
      <AnimatePresence>
        {dropState === 'reassembled' && droppedFile && (
          <motion.div
            initial={{ opacity: 0, scale: reducedMotion ? 1 : 0.85, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: reducedMotion ? 0.05 : 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-auto"
          >
            <div className="bg-[#141110] border border-[#292524] rounded-xl p-6 shadow-2xl max-w-sm w-[340px] text-center space-y-4">
              {/* Header Icon */}
              <div className="flex items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <Check className="w-6 h-6 stroke-[2.5]" />
                </div>
              </div>

              {/* File Info */}
              <div>
                <p className="text-xs text-[#78716C] uppercase font-mono tracking-wider">
                  The Drop • Processing
                </p>
                <h3 className="text-sm font-medium text-[#FAFAF9] truncate mt-1">
                  {droppedFile.name}
                </h3>
              </div>

              {/* Odometer File Size Transformation: BEFORE -> AFTER (-X%) */}
              <div className="p-3 bg-[#0C0A09] border border-[#292524] rounded-lg flex items-center justify-between font-mono text-xs">
                <div className="text-left">
                  <span className="text-[10px] text-[#78716C] block">BEFORE</span>
                  <span className="text-[#A8A29E] font-medium">
                    {formatSize(droppedFile.size)}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-emerald-400 px-2">
                  <span>→</span>
                  <span className="text-[11px] font-bold bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded">
                    -{estimatedSavings}%
                  </span>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-[#78716C] block">EST. AFTER</span>
                  <span className="text-emerald-400 font-bold">
                    {formatSize(estimatedAfterSize)}
                  </span>
                </div>
              </div>

              {/* Progress hint */}
              <p className="text-[11px] text-[#78716C]">
                Handed off to engine • Processing started
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
