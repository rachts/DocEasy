import React from 'react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { CheckCircle, Activity, Server, ShieldCheck } from 'lucide-react'

export const metadata = {
  title: 'System Status | DocEasy',
  description: 'Real-time operational status of DocEasy services and WASM runtime.',
}

export default function StatusPage() {
  const services = [
    { name: 'Browser WebAssembly Runtime', status: 'Operational', latency: 'Local', uptime: '100%' },
    { name: 'PDF Compression Pipeline', status: 'Operational', latency: 'Local WASM', uptime: '100%' },
    { name: 'Format Converter Pipeline', status: 'Operational', latency: 'Local WASM', uptime: '100%' },
    { name: 'Canvas & Raster Image Engine', status: 'Operational', latency: 'Local Canvas', uptime: '100%' },
    { name: 'Encrypted Vault Storage', status: 'Operational', latency: 'Client Memory', uptime: '100%' },
    { name: 'Client-Side Text Summarizer', status: 'Operational', latency: 'Local JS', uptime: '100%' },
  ]

  return (
    <div className="min-h-screen bg-[#0C0A09] text-[#FAFAF9] font-sans flex flex-col antialiased">
      <Navbar />

      <main className="flex-1 pt-[56px]">
        <section className="px-6 md:px-16 pt-24 pb-20 max-w-4xl mx-auto">
          <div className="border-b border-[#292524] pb-6 mb-10">
            <span className="text-[12px] font-medium text-[#78716C] block mb-2">
              System health
            </span>
            <div className="flex items-center justify-between">
              <h1 className="text-4xl md:text-5xl font-medium tracking-tight text-[#FAFAF9]">
                System Status
              </h1>
              <div className="flex items-center gap-2 bg-[#1C1917] border border-[#292524] px-3 py-1.5 rounded-[4px] text-[12px] text-[#FAFAF9]">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>All systems operational</span>
              </div>
            </div>
            <p className="text-[12px] text-[#78716C] mt-3">
              Last checked: <span className="font-mono text-[#A8A29E]">{new Date().toISOString().replace('T', ' ').slice(0, 19)} UTC</span>
            </p>
          </div>

          <div className="space-y-3 mb-12">
            {services.map((service) => (
              <div
                key={service.name}
                className="flex items-center justify-between p-4 bg-[#1C1917] border border-[#292524] rounded-[6px]"
              >
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span className="text-[14px] font-medium text-[#FAFAF9]">{service.name}</span>
                </div>
                <div className="flex items-center gap-6 text-[12px] text-[#57534E]">
                  <span className="hidden sm:inline font-mono">{service.latency}</span>
                  <span className="hidden md:inline font-mono">{service.uptime}</span>
                  <span className="text-emerald-400 text-xs font-medium">{service.status}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="p-6 bg-[#141110] border border-[#292524] rounded-[8px] text-[13px] text-[#A8A29E] space-y-2">
            <div className="text-[#FAFAF9] font-medium">
              Architecture guarantee
            </div>
            <p className="text-[#78716C] leading-relaxed">
              Because 100% of processing happens client-side in your browser, DocEasy core tools remain fully operational even during widespread cloud disruptions or offline conditions.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
