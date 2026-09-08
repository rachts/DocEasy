'use client'

import React, { useEffect, useRef, useState } from 'react'
import { FileUp, Cpu, CheckCircle2, ShieldCheck, ArrowRight } from 'lucide-react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const STEPS = [
  {
    number: '01',
    title: 'Select & Ingest',
    headline: 'Drag or select any file directly into browser memory',
    description:
      'Files are loaded as ArrayBuffers directly into client RAM. No upload happens for standard PDF & image workflows.',
    tag: 'Client-side Ingestion',
    color: '#38BDF8', // Sky
  },
  {
    number: '02',
    title: 'WASM & Canvas Compute',
    headline: 'Local WebAssembly executes at near-native speed',
    description:
      'WASM workers, pdf-lib, and HTML5 Canvas compress, merge, or convert your documents using your device hardware.',
    tag: 'Zero Egress Pipeline',
    color: '#34D399', // Emerald
  },
  {
    number: '03',
    title: 'Direct Download & Purge',
    headline: 'Instant export with immediate memory release',
    description:
      'Save your processed document directly to your filesystem. Session storage and temporary buffers are immediately freed.',
    tag: 'Zero Persistent Retention',
    color: '#F59E0B', // Amber
  },
]

export function HowItWorksScene() {
  const [isDesktop, setIsDesktop] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [activeStep, setActiveStep] = useState(0)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(motionQuery.matches)
    const handleMotion = (e: MediaQueryListEvent) => setReducedMotion(e.matches)
    motionQuery.addEventListener('change', handleMotion)

    const desktopQuery = window.matchMedia('(min-width: 1024px) and (pointer: fine)')
    setIsDesktop(desktopQuery.matches)
    const handleDesktop = (e: MediaQueryListEvent) => setIsDesktop(e.matches)
    desktopQuery.addEventListener('change', handleDesktop)

    return () => {
      motionQuery.removeEventListener('change', handleMotion)
      desktopQuery.removeEventListener('change', handleDesktop)
    }
  }, [])

  // Desktop pinned GSAP scrub
  useEffect(() => {
    if (!isDesktop || reducedMotion || !containerRef.current) return

    const ctx = gsap.context(() => {
      const trigger = ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top top',
        end: '+=180%',
        pin: true,
        scrub: 0.6,
        anticipatePin: 1,
        onUpdate: (self) => {
          const p = self.progress
          if (p < 0.35) {
            setActiveStep(0)
          } else if (p < 0.7) {
            setActiveStep(1)
          } else {
            setActiveStep(2)
          }
        },
      })

      return () => {
        trigger.kill()
      }
    }, containerRef)

    return () => {
      ctx.revert()
    }
  }, [isDesktop, reducedMotion])

  // If mobile or reduced-motion: simplified non-pinned layout
  if (!isDesktop || reducedMotion) {
    return (
      <section id="process" className="px-6 md:px-16 py-20 max-w-6xl mx-auto scroll-mt-20">
        <div className="border-t border-[#292524] pt-8 mb-10">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-[4px] bg-[#141110] border border-[#292524] w-fit mb-4">
            <span className="text-[12px] font-medium text-[#A8A29E]">How It Works</span>
          </div>
          <h2 className="text-3xl font-medium tracking-tight text-[#FAFAF9]">
            Three steps. Zero unnecessary uploads.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {STEPS.map((step, idx) => (
            <div
              key={step.number}
              className="bg-[#141110] border border-[#292524] rounded-[8px] p-6 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono text-sm font-semibold text-[#A8A29E]">
                    {step.number}
                  </span>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#1C1917] border border-[#292524] text-[#A8A29E]">
                    {step.tag}
                  </span>
                </div>
                <h3 className="text-lg font-medium text-[#FAFAF9] mb-2">{step.title}</h3>
                <p className="text-sm text-[#A8A29E] leading-relaxed mb-4">{step.description}</p>
              </div>

              <div className="pt-4 border-t border-[#292524] flex items-center justify-between text-xs text-[#A8A29E]">
                <span>Step {idx + 1} of 3</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#57534E]" />
              </div>
            </div>
          ))}
        </div>
      </section>
    )
  }

  // Desktop pinned presentation
  return (
    <div ref={containerRef} id="process" className="w-full relative scroll-mt-20">
      <div className="min-h-screen flex flex-col justify-center px-6 md:px-16 max-w-6xl mx-auto py-24">
        <div className="border-t border-[#292524] pt-8 mb-12">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-[4px] bg-[#141110] border border-[#292524] w-fit mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span className="text-[12px] font-medium text-[#A8A29E]">Interactive Pipeline Walkthrough</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-medium tracking-tight text-[#FAFAF9]">
            How It Works
          </h2>
          <p className="text-sm text-[#A8A29E] mt-2 max-w-2xl">
            Scroll to follow document data through the private execution pipeline.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Step selector & details */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            {STEPS.map((step, idx) => {
              const isActive = activeStep === idx
              return (
                <div
                  key={step.number}
                  onClick={() => setActiveStep(idx)}
                  className={`p-6 rounded-[8px] border transition-all duration-300 cursor-pointer ${
                    isActive
                      ? 'bg-[#1C1917] border-[#A8A29E] shadow-lg shadow-black/40'
                      : 'bg-[#141110]/60 border-[#292524] opacity-50 hover:opacity-80'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className="font-mono text-sm font-semibold transition-colors duration-300"
                      style={{ color: isActive ? step.color : '#A8A29E' }}
                    >
                      {step.number} / 03
                    </span>
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#0C0A09] border border-[#292524] text-[#A8A29E]">
                      {step.tag}
                    </span>
                  </div>
                  <h3 className="text-lg font-medium text-[#FAFAF9] mb-1.5">{step.title}</h3>
                  <p className="text-sm text-[#A8A29E] leading-relaxed">{step.description}</p>
                </div>
              )
            })}
          </div>

          {/* Morphing visual stage */}
          <div className="lg:col-span-7 bg-[#141110] border border-[#292524] rounded-[12px] p-8 min-h-[420px] flex flex-col justify-between relative overflow-hidden">
            {/* Ambient backdrop glow */}
            <div
              className="absolute -right-20 -top-20 w-72 h-72 rounded-full blur-3xl opacity-15 pointer-events-none transition-colors duration-700"
              style={{
                backgroundColor: STEPS[activeStep].color,
              }}
            />

            {/* Header bar */}
            <div className="flex items-center justify-between border-b border-[#292524] pb-4 mb-6">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#292524]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#292524]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#292524]" />
                <span className="font-mono text-xs text-[#A8A29E] ml-2">
                  pipeline://step-{activeStep + 1}.wasm
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-[#A8A29E] font-mono">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Isolated Sandbox</span>
              </div>
            </div>

            {/* Morphing Content Stage */}
            <div className="relative flex-1 flex items-center justify-center">
              {/* Step 1 Visual: Ingest */}
              <div
                className={`absolute inset-0 flex flex-col items-center justify-center transition-all duration-500 ${
                  activeStep === 0
                    ? 'opacity-100 scale-100 pointer-events-auto'
                    : 'opacity-0 scale-95 pointer-events-none'
                }`}
              >
                <div className="w-16 h-16 rounded-full bg-[#1C1917] border border-sky-500/40 flex items-center justify-center mb-4 shadow-lg shadow-sky-500/10 animate-pulse">
                  <FileUp className="w-8 h-8 text-sky-400" />
                </div>
                <h4 className="text-base font-medium text-[#FAFAF9] mb-1">Local Buffer Allocation</h4>
                <p className="text-xs font-mono text-[#A8A29E] mb-4">Uint8Array[2489240] initialized in client RAM</p>
                <div className="flex items-center gap-2 text-xs text-[#FAFAF9] bg-[#0C0A09] border border-[#292524] px-3 py-1.5 rounded-full font-mono">
                  <span className="w-2 h-2 rounded-full bg-sky-400" />
                  <span>Network Egress: 0 KB (Completely Offline)</span>
                </div>
              </div>

              {/* Step 2 Visual: Process */}
              <div
                className={`absolute inset-0 flex flex-col items-center justify-center transition-all duration-500 ${
                  activeStep === 1
                    ? 'opacity-100 scale-100 pointer-events-auto'
                    : 'opacity-0 scale-95 pointer-events-none'
                }`}
              >
                <div className="w-16 h-16 rounded-full bg-[#1C1917] border border-emerald-500/40 flex items-center justify-center mb-4 shadow-lg shadow-emerald-500/10">
                  <Cpu className="w-8 h-8 text-emerald-400 animate-spin-slow" />
                </div>
                <h4 className="text-base font-medium text-[#FAFAF9] mb-1">WebAssembly Execution</h4>
                <p className="text-xs font-mono text-[#A8A29E] mb-4">pdf-lib + canvas streams executing on 4 worker threads</p>
                <div className="w-full max-w-xs bg-[#0C0A09] border border-[#292524] rounded-full h-2.5 overflow-hidden p-0.5">
                  <div className="bg-emerald-400 h-full rounded-full w-[78%] transition-all duration-300" />
                </div>
                <span className="text-[11px] font-mono text-emerald-400 mt-2">Compacting streams: 78% complete</span>
              </div>

              {/* Step 3 Visual: Save & Purge */}
              <div
                className={`absolute inset-0 flex flex-col items-center justify-center transition-all duration-500 ${
                  activeStep === 2
                    ? 'opacity-100 scale-100 pointer-events-auto'
                    : 'opacity-0 scale-95 pointer-events-none'
                }`}
              >
                <div className="w-16 h-16 rounded-full bg-[#1C1917] border border-amber-500/40 flex items-center justify-center mb-4 shadow-lg shadow-amber-500/10">
                  <CheckCircle2 className="w-8 h-8 text-amber-400" />
                </div>
                <h4 className="text-base font-medium text-[#FAFAF9] mb-1">Downloaded & Buffer Cleared</h4>
                <p className="text-xs font-mono text-[#A8A29E] mb-4">
                  Output size: 482 KB (79.9% saved) • Memory released
                </p>
                <div className="flex items-center gap-2 text-xs text-[#FAFAF9] bg-[#0C0A09] border border-[#292524] px-3 py-1.5 rounded-full font-mono">
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  <span>Data Retention: 0 ms</span>
                </div>
              </div>
            </div>

            {/* Bottom scrubber progress bar */}
            <div className="border-t border-[#292524] pt-4 mt-6 flex items-center justify-between text-xs text-[#A8A29E]">
              <span>Scroll-scrubbed state machine</span>
              <div className="flex items-center gap-1.5">
                {[0, 1, 2].map((i) => (
                  <button
                    key={i}
                    onClick={() => setActiveStep(i)}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      activeStep === i ? 'w-8 bg-[#FAFAF9]' : 'w-2 bg-[#292524] hover:bg-[#57534E]'
                    }`}
                    aria-label={`Go to step ${i + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
