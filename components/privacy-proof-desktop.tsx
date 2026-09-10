'use client'

import React, { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ShieldCheck, HardDrive, Cpu, Lock, Server } from 'lucide-react'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

interface DataPacket {
  x: number
  y: number
  targetX: number
  targetY: number
  progress: number
  speed: number
  isBlocked: number // 0: internal, 1: blocked at shield
  deflected: boolean
}

export default function PrivacyProofDesktop() {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const shieldRef = useRef<HTMLDivElement | null>(null)
  const triggerRef = useRef<ScrollTrigger | null>(null)
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    const container = containerRef.current
    const canvas = canvasRef.current
    if (!container || !canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas dimensions
    const updateSize = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }
    updateSize()
    window.addEventListener('resize', updateSize)

    // Packets pool
    const packets: DataPacket[] = []
    const numPackets = 16

    const initPackets = () => {
      packets.length = 0
      const w = canvas.width
      const h = canvas.height
      const startX = w * 0.15
      const startY = h * 0.5
      const wasmX = w * 0.45
      const wasmY = h * 0.5
      const shieldX = w * 0.72
      const shieldY = h * 0.5

      for (let i = 0; i < numPackets; i++) {
        // Half packets flow inside client, half test the external boundary
        const isBoundaryTest = i % 2 === 0
        packets.push({
          x: startX,
          y: startY,
          targetX: isBoundaryTest ? shieldX : wasmX,
          targetY: isBoundaryTest ? shieldY : wasmY,
          progress: Math.random(),
          speed: 0.006 + Math.random() * 0.008,
          isBlocked: isBoundaryTest ? 1 : 0,
          deflected: false
        })
      }
    }
    initPackets()

    // GSAP ScrollTrigger for scrubbed progression
    triggerRef.current = ScrollTrigger.create({
      trigger: container,
      start: 'top 85%',
      end: 'bottom 25%',
      scrub: 0.8,
      onUpdate: (self) => {
        if (shieldRef.current) {
          gsap.set(shieldRef.current, {
            boxShadow: `0 0 ${15 + self.progress * 30}px rgba(16, 185, 129, ${0.2 + self.progress * 0.4})`
          })
        }
      }
    })

    // Animation Loop
    const render = () => {
      const w = canvas.width
      const h = canvas.height
      ctx.clearRect(0, 0, w, h)

      const startX = w * 0.15
      const startY = h * 0.5
      const wasmX = w * 0.45
      const wasmY = h * 0.5
      const outX = w * 0.45
      const outY = h * 0.82
      const shieldX = w * 0.72
      const shieldY = h * 0.5

      // Draw dashed connection pathways
      ctx.setLineDash([4, 4])
      ctx.lineWidth = 1.5

      // 1. Path: Local Input -> WASM Core
      ctx.strokeStyle = '#292524'
      ctx.beginPath()
      ctx.moveTo(startX, startY)
      ctx.lineTo(wasmX, wasmY)
      ctx.stroke()

      // 2. Path: WASM Core -> Local Output
      ctx.beginPath()
      ctx.moveTo(wasmX, wasmY)
      ctx.lineTo(outX, outY)
      ctx.stroke()

      // 3. Path: WASM Core -> External Shield Boundary
      ctx.strokeStyle = 'rgba(239, 68, 68, 0.25)' // faint red attempt line
      ctx.beginPath()
      ctx.moveTo(wasmX, wasmY)
      ctx.lineTo(shieldX, shieldY)
      ctx.stroke()

      ctx.setLineDash([])

      // Update & draw data packets
      for (const p of packets) {
        p.progress += p.speed

        if (p.isBlocked === 1) {
          // Attempting to egress toward server
          const currentT = p.progress % 1
          if (currentT < 0.75) {
            // Moving from WASM to Shield
            p.x = wasmX + (shieldX - wasmX) * (currentT / 0.75)
            p.y = wasmY + (shieldY - wasmY) * (currentT / 0.75)
            p.deflected = false
          } else {
            // Hits the shield -> deflected back into local memory
            p.deflected = true
            const defT = (currentT - 0.75) / 0.25
            p.x = shieldX - (shieldX - wasmX) * defT * 0.5
            p.y = shieldY + 30 * Math.sin(defT * Math.PI)
          }

          // Packet visual (amber when probing, deflected emerald)
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.deflected ? 3.5 : 3, 0, Math.PI * 2)
          ctx.fillStyle = p.deflected ? '#10B981' : '#F59E0B'
          ctx.shadowBlur = p.deflected ? 10 : 4
          ctx.shadowColor = p.deflected ? '#10B981' : '#F59E0B'
          ctx.fill()
        } else {
          // Internal Client Flow (Input -> WASM -> Output)
          const currentT = p.progress % 1
          if (currentT < 0.5) {
            // Input to WASM
            const t = currentT / 0.5
            p.x = startX + (wasmX - startX) * t
            p.y = startY + (wasmY - startY) * t
          } else {
            // WASM to Output
            const t = (currentT - 0.5) / 0.5
            p.x = wasmX + (outX - wasmX) * t
            p.y = wasmY + (outY - wasmY) * t
          }

          ctx.beginPath()
          ctx.arc(p.x, p.y, 3, 0, Math.PI * 2)
          ctx.fillStyle = '#FAFAF9'
          ctx.shadowBlur = 6
          ctx.shadowColor = '#FAFAF9'
          ctx.fill()
        }
      }

      ctx.shadowBlur = 0
      rafRef.current = requestAnimationFrame(render)
    }

    rafRef.current = requestAnimationFrame(render)

    return () => {
      window.removeEventListener('resize', updateSize)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      if (triggerRef.current) triggerRef.current.kill()
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="w-full bg-[#141110] border border-[#292524] rounded-[8px] p-6 md:p-8 relative overflow-hidden"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#292524] mb-6 relative z-20">
        <div>
          <span className="text-[12px] font-medium text-[#A8A29E] block mb-1">
            Data Architecture Proof
          </span>
          <h2 className="text-2xl md:text-3xl font-medium tracking-tight text-[#FAFAF9]">
            Watch your network tab. This is real.
          </h2>
          <p className="text-[14px] text-[#A8A29E] mt-1.5 max-w-xl">
            For standard document tools, zero bytes are transmitted to remote servers. All parsing, conversion, and rendering execute directly in client memory.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-[4px] bg-[#1C1917] border border-emerald-500/30 text-[12px] text-[#FAFAF9] self-start md:self-auto">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Egress Shield Active</span>
        </div>
      </div>

      {/* Interactive Canvas Visualization Container */}
      <div className="relative h-[280px] w-full bg-[#0C0A09] border border-[#292524] rounded-[6px] overflow-hidden">
        {/* Real-time Canvas Rendering Layer */}
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-10" />

        {/* DOM Overlays for Nodes */}
        {/* 1. Input Node */}
        <div className="absolute left-[15%] top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center gap-2 pointer-events-none">
          <div className="w-12 h-12 rounded-lg bg-[#1C1917] border border-[#292524] flex items-center justify-center text-[#FAFAF9]">
            <HardDrive className="w-5 h-5 text-[#A8A29E]" />
          </div>
          <span className="text-[11px] font-mono text-[#FAFAF9] bg-[#141110] px-2 py-0.5 rounded border border-[#292524]">
            Local RAM
          </span>
        </div>

        {/* 2. WASM Core Node */}
        <div className="absolute left-[45%] top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center gap-2 pointer-events-none">
          <div className="w-14 h-14 rounded-lg bg-[#1C1917] border border-[#292524] flex items-center justify-center text-[#FAFAF9]">
            <Cpu className="w-6 h-6 text-[#FAFAF9]" />
          </div>
          <span className="text-[11px] font-mono text-[#FAFAF9] bg-[#141110] px-2 py-0.5 rounded border border-[#292524]">
            WASM Thread
          </span>
        </div>

        {/* 3. Output Node */}
        <div className="absolute left-[45%] top-[82%] -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center gap-1.5 pointer-events-none">
          <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-2 py-0.5 rounded flex items-center gap-1">
            <Lock className="w-3 h-3" />
            Direct Download
          </span>
        </div>

        {/* 4. Security Shield (Deflection Point) */}
        <div
          ref={shieldRef}
          className="absolute left-[72%] top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center gap-2 pointer-events-none"
        >
          <div className="w-14 h-14 rounded-full bg-[#1C1917] border-2 border-emerald-500/50 flex items-center justify-center text-emerald-400 transition-all duration-300">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <span className="text-[10px] font-mono text-emerald-300 bg-emerald-950/80 border border-emerald-500/40 px-2 py-0.5 rounded">
            Network Blocked
          </span>
        </div>

        {/* 5. External Server Node (Isolated beyond shield) */}
        <div className="absolute right-[6%] top-1/2 -translate-y-1/2 z-20 flex flex-col items-center gap-2 pointer-events-none opacity-40">
          <div className="w-12 h-12 rounded-lg bg-[#1C1917] border border-dashed border-[#57534E] flex items-center justify-center text-[#57534E]">
            <Server className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-mono text-[#57534E]">Remote Cloud</span>
        </div>

        {/* Sandbox Boundary Tag */}
        <div className="absolute top-3 left-3 z-20 text-[10px] font-mono text-[#78716C] bg-[#141110]/80 px-2 py-1 rounded border border-[#292524]">
          BROWSER CLIENT SANDBOX
        </div>

        <div className="absolute top-3 right-3 z-20 text-[10px] font-mono text-emerald-400/80 bg-emerald-950/30 px-2 py-1 rounded border border-emerald-500/20">
          ZERO EGRESS DETECTED
        </div>
      </div>

      {/* Footer Sub-bullet */}
      <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between text-[12px] text-[#78716C] gap-2">
        <span>Scrub scroll to inspect packet flow within browser memory</span>
        <span className="font-mono text-[#A8A29E]">
          Payloads leaving machine: <strong className="text-emerald-400 font-bold">0 bytes</strong>
        </span>
      </div>
    </div>
  )
}
