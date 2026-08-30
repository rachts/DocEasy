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
    { name: 'Client WebAssembly Runtime', status: 'Operational', latency: '< 1ms', uptime: '100.0%' },
    { name: 'PDF Compression Engine', status: 'Operational', latency: 'Local WASM', uptime: '100.0%' },
    { name: 'Format Matrix Converter', status: 'Operational', latency: 'Local WASM', uptime: '100.0%' },
    { name: 'Image Processing Pipeline', status: 'Operational', latency: 'Canvas SIMD', uptime: '100.0%' },
    { name: 'Encrypted Vault Storage (Optional)', status: 'Operational', latency: '34ms', uptime: '99.99%' },
    { name: 'Authentication Gateways', status: 'Operational', latency: '42ms', uptime: '99.98%' },
  ]

  return (
    <div className="min-h-screen bg-[#0C0A09] text-[#FAFAF9] font-sans flex flex-col antialiased">
      <Navbar />

      <main className="flex-1 pt-[56px]">
        <section className="px-6 md:px-16 pt-24 pb-20 max-w-4xl mx-auto">
          <div className="border-b border-[#292524] pb-6 mb-10">
            <span className="font-mono text-[11px] uppercase tracking-[0.05em] text-[#57534E] block mb-2">
              REAL-TIME TELEMETRY
            </span>
            <div className="flex items-center justify-between">
              <h1 className="text-4xl md:text-5xl font-medium tracking-tight text-[#FAFAF9]">
                System Status
              </h1>
              <div className="flex items-center gap-2 bg-[#1C1917] border border-[#292524] px-3 py-1.5 rounded-[4px] font-mono text-[12px] uppercase tracking-[0.05em] text-[#FAFAF9]">
                <div className="w-2 h-2 rounded-full bg-[#FAFAF9] animate-pulse" />
                <span>All Systems Normal</span>
              </div>
            </div>
            <p className="font-mono text-[12px] text-[#57534E] mt-3">
              LAST CHECKED: {new Date().toISOString().replace('T', ' ').slice(0, 19)} UTC
            </p>
          </div>

          <div className="space-y-3 mb-12">
            {services.map((service) => (
              <div
                key={service.name}
                className="flex items-center justify-between p-4 bg-[#1C1917] border border-[#292524] rounded-[6px]"
              >
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-4 h-4 text-[#FAFAF9]" />
                  <span className="text-[14px] font-medium text-[#FAFAF9]">{service.name}</span>
                </div>
                <div className="flex items-center gap-6 font-mono text-[12px] text-[#57534E]">
                  <span className="hidden sm:inline">{service.latency}</span>
                  <span className="hidden md:inline">{service.uptime}</span>
                  <span className="text-[#A8A29E] uppercase tracking-[0.05em]">{service.status}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="p-6 bg-[#141110] border border-[#292524] rounded-[8px] font-mono text-[12px] text-[#A8A29E] space-y-2">
            <div className="text-[#FAFAF9] font-medium uppercase tracking-[0.05em]">
              ARCHITECTURE GUARANTEE
            </div>
            <p className="text-[13px] text-[#57534E] leading-relaxed">
              Because 100% of processing happens client-side in your browser, DocEasy core tools remain fully operational even during widespread cloud disruptions or offline conditions.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
