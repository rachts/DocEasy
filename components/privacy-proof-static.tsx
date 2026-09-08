'use client'

import React from 'react'
import { ShieldCheck, Cpu, ArrowRight, HardDrive, Lock } from 'lucide-react'

export function PrivacyProofStatic() {
  return (
    <div className="w-full bg-[#141110] border border-[#292524] rounded-[8px] p-6 md:p-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#292524] mb-6">
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

        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-[4px] bg-[#1C1917] border border-[#292524] text-[12px] text-[#FAFAF9] self-start md:self-auto">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span>Inspectable client sandbox</span>
        </div>
      </div>

      {/* Static Diagram */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
        <div className="p-4 bg-[#1C1917] border border-[#292524] rounded-[6px] text-center space-y-2">
          <HardDrive className="w-5 h-5 text-[#A8A29E] mx-auto" />
          <div className="text-xs font-medium text-[#FAFAF9]">Local Document</div>
          <div className="text-[11px] text-[#78716C]">In-browser volatile memory</div>
        </div>

        <div className="p-4 bg-[#1C1917] border border-emerald-500/30 rounded-[6px] text-center space-y-2 relative">
          <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-emerald-950/80 border border-emerald-500/40 rounded text-[9px] font-mono text-emerald-300">
            Egress Blocked
          </div>
          <ShieldCheck className="w-5 h-5 text-emerald-400 mx-auto" />
          <div className="text-xs font-medium text-[#FAFAF9]">WASM & Canvas Sandbox</div>
          <div className="text-[11px] text-[#78716C]">Zero external server calls</div>
        </div>

        <div className="p-4 bg-[#1C1917] border border-[#292524] rounded-[6px] text-center space-y-2">
          <Lock className="w-5 h-5 text-[#A8A29E] mx-auto" />
          <div className="text-xs font-medium text-[#FAFAF9]">Direct Local Save</div>
          <div className="text-[11px] text-[#78716C]">Downloaded straight to device</div>
        </div>
      </div>
    </div>
  )
}
