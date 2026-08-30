import Link from 'next/link'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { ArrowLeft, ArrowRight, Github, Linkedin, Mail, ShieldCheck, Terminal, Cpu } from 'lucide-react'

export const metadata = {
  title: 'Architecture & Security Manifesto | DocEasy',
  description: 'Learn about the technical architecture and team behind DocEasy.',
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#0C0A09] text-[#FAFAF9] font-sans flex flex-col selection:bg-[#292524] selection:text-[#FAFAF9]">
      <Navbar />

      <main className="flex-1 pt-[56px]">
        {/* Header Breadcrumb */}
        <div className="bg-[#141110] border-b border-[#292524] py-3 px-6 md:px-16">
          <div className="max-w-6xl mx-auto flex items-center gap-2 font-mono text-[12px] uppercase tracking-[0.05em]">
            <Link href="/" className="text-[#57534E] hover:text-[#FAFAF9] transition-colors">
              SYSTEM
            </Link>
            <span className="text-[#292524]">/</span>
            <span className="text-[#FAFAF9]">ARCHITECTURE & MANIFESTO</span>
          </div>
        </div>

        {/* Hero Section */}
        <section className="py-16 md:py-24 px-6 md:px-16 max-w-6xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-medium tracking-tight text-[#FAFAF9] leading-tight">
            Security Architecture & Manifesto
          </h1>
          <p className="text-[16px] text-[#A8A29E] mt-4 max-w-3xl leading-relaxed">
            DocEasy is engineered around a zero-trust, client-ephemeral computation model. All document parsing, compression, rasterization, and conversion pipelines execute inside memory-sandboxed WebAssembly binaries.
          </p>

          <div className="mt-8 font-mono text-[12px] uppercase tracking-[0.05em] text-[#57534E] flex flex-wrap gap-4 border-y border-[#292524] py-4">
            <span>ZERO CLOUD STORAGE LOGGING</span>
            <span className="text-[#292524]">•</span>
            <span>END-TO-END MEMORY ISOLATION</span>
            <span className="text-[#292524]">•</span>
            <span>AUDITED CLIENT WASM</span>
          </div>
        </section>

        {/* Architecture Spec Grid */}
        <section className="py-12 px-6 md:px-16 max-w-6xl mx-auto border-t border-[#292524]">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-[#1C1917] border border-[#292524] rounded-[8px] space-y-3">
              <span className="font-mono text-[11px] uppercase tracking-[0.05em] text-[#57534E] block">
                PIPELINE 01
              </span>
              <h2 className="text-xl font-medium text-[#FAFAF9]">WebAssembly Core</h2>
              <p className="text-[14px] text-[#A8A29E] leading-relaxed">
                Native C/C++ compiled binaries execute PDF linearization and SIMD image compression with bare-metal speed without server handoffs.
              </p>
            </div>

            <div className="p-6 bg-[#1C1917] border border-[#292524] p-6 rounded-[8px] space-y-3">
              <span className="font-mono text-[11px] uppercase tracking-[0.05em] text-[#57534E] block">
                PIPELINE 02
              </span>
              <h2 className="text-xl font-medium text-[#FAFAF9]">Ephemeral Retention</h2>
              <p className="text-[14px] text-[#A8A29E] leading-relaxed">
                All uploaded byte buffers are stored in isolated volatile memory and wiped upon download or session termination.
              </p>
            </div>

            <div className="p-6 bg-[#1C1917] border border-[#292524] rounded-[8px] space-y-3">
              <span className="font-mono text-[11px] uppercase tracking-[0.05em] text-[#57534E] block">
                PIPELINE 03
              </span>
              <h2 className="text-xl font-medium text-[#FAFAF9]">Zero Telemetry</h2>
              <p className="text-[14px] text-[#A8A29E] leading-relaxed">
                No analytics trackers, document profiling, or metadata scraping. Your intellectual property never leaves your device.
              </p>
            </div>
          </div>
        </section>

        {/* Author / Maintainer Section */}
        <section className="py-16 px-6 md:px-16 max-w-6xl mx-auto border-t border-[#292524]">
          <div className="bg-[#1C1917] border border-[#292524] p-8 md:p-12 rounded-[8px] flex flex-col md:flex-row justify-between gap-8 items-start">
            <div className="max-w-xl">
              <span className="font-mono text-[11px] uppercase tracking-[0.05em] text-[#57534E] block mb-2">
                SYSTEM CREATOR & MAINTAINER
              </span>
              <h2 className="text-3xl font-medium tracking-tight text-[#FAFAF9]">
                Rachit Kumar Tiwari
              </h2>
              <p className="text-[15px] text-[#A8A29E] mt-3 leading-relaxed">
                Full-Stack Engineer and systems builder focused on high-performance web tooling, distributed architecture, and user privacy guarantees.
              </p>
              <div className="flex gap-4 mt-6">
                <Link
                  href="https://github.com/rachts"
                  target="_blank"
                  className="h-10 px-4 bg-[#141110] border border-[#292524] hover:border-[#A8A29E] font-mono text-[12px] uppercase tracking-[0.05em] text-[#FAFAF9] rounded-[6px] transition-colors flex items-center gap-2"
                >
                  <Github className="w-4 h-4" />
                  GITHUB
                </Link>
                <Link
                  href="https://www.linkedin.com/in/rachitkrtiwari/"
                  target="_blank"
                  className="h-10 px-4 bg-[#141110] border border-[#292524] hover:border-[#A8A29E] font-mono text-[12px] uppercase tracking-[0.05em] text-[#FAFAF9] rounded-[6px] transition-colors flex items-center gap-2"
                >
                  <Linkedin className="w-4 h-4" />
                  LINKEDIN
                </Link>
              </div>
            </div>

            <div className="p-6 bg-[#141110] border border-[#292524] rounded-[6px] w-full md:w-80 font-mono text-[12px] space-y-3">
              <div className="text-[#57534E] border-b border-[#292524] pb-2 uppercase">
                ENGINEERING METRICS
              </div>
              <div className="flex justify-between">
                <span className="text-[#57534E]">RUNTIME</span>
                <span className="text-[#FAFAF9]">NEXT.JS 16 + WASM</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#57534E]">DESIGN SYSTEM</span>
                <span className="text-[#FAFAF9]">WARM INDUSTRIAL</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#57534E]">DEPLOYMENT</span>
                <span className="text-[#FAFAF9]">VERCEL EDGE</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
