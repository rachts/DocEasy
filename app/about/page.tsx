import Link from 'next/link'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { ArrowLeft, ArrowRight, Github, Linkedin, Mail, ShieldCheck, Terminal, Cpu } from 'lucide-react'

export const metadata = {
  title: 'Architecture & Security Manifesto | DocEasy',
  description: 'Learn about the technical architecture and team behind DocEasy. Privacy-first hybrid processing.',
  openGraph: {
    title: 'Architecture & Security Manifesto | DocEasy',
    description: 'Learn about the technical architecture and team behind DocEasy. Privacy-first hybrid processing.',
    url: '/about',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'DocEasy Architecture' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Architecture & Security Manifesto | DocEasy',
    description: 'Learn about the technical architecture and team behind DocEasy. Privacy-first hybrid processing.',
    images: ['/og-image.png'],
  },
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#0C0A09] text-[#FAFAF9] font-sans flex flex-col selection:bg-[#292524] selection:text-[#FAFAF9]">
      <Navbar />

      <main className="flex-1 pt-[56px]">
        {/* Header Breadcrumb */}
        <div className="bg-[#141110] border-b border-[#292524] py-3 px-6 md:px-16">
          <div className="max-w-6xl mx-auto flex items-center gap-2 text-[12px]">
            <Link href="/" className="text-[#A8A29E] hover:text-[#FAFAF9] transition-colors">
              Home
            </Link>
            <span className="text-[#57534E]">/</span>
            <span className="text-[#FAFAF9]">Architecture & Manifesto</span>
          </div>
        </div>

        {/* Hero Section */}
        <section className="py-16 md:py-24 px-6 md:px-16 max-w-6xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-medium tracking-tight text-[#FAFAF9] leading-tight">
            Security Architecture & Manifesto
          </h1>
          <p className="text-[16px] text-[#A8A29E] mt-4 max-w-3xl leading-relaxed">
            Core tools run locally in your browser using WebAssembly and HTML5 Canvas. Heavy PDF compression tasks utilize isolated ephemeral server pipelines (Ghostscript/qpdf) with immediate cleanup. Authenticated users can optionally save files to a secure cloud vault backed by Supabase Postgres RLS.
          </p>

          <div className="mt-8 text-[13px] text-[#A8A29E] flex flex-wrap gap-4 border-y border-[#292524] py-4">
            <span>Client-first execution</span>
            <span className="text-[#57534E]">•</span>
            <span>Ephemeral Ghostscript/qpdf acceleration</span>
            <span className="text-[#57534E]">•</span>
            <span>Auth-gated cloud vault</span>
          </div>
        </section>

        {/* Architecture Spec Grid */}
        <section className="py-12 px-6 md:px-16 max-w-6xl mx-auto border-t border-[#292524]">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-[#1C1917] border border-[#292524] rounded-[8px] space-y-3">
              <h2 className="text-xl font-medium text-[#FAFAF9]">WebAssembly Core</h2>
              <p className="text-[14px] text-[#A8A29E] leading-relaxed">
                Client-side tools execute directly in browser memory via WASM and Canvas threads for zero-exposure standard document processing.
              </p>
            </div>

            <div className="p-6 bg-[#1C1917] border border-[#292524] rounded-[8px] space-y-3">
              <h2 className="text-xl font-medium text-[#FAFAF9]">Ephemeral Server Pipelines</h2>
              <p className="text-[14px] text-[#A8A29E] leading-relaxed">
                When heavy compression is selected, Ghostscript and qpdf process files on temporary server buffers that are wiped immediately upon stream completion.
              </p>
            </div>

            <div className="p-6 bg-[#1C1917] border border-[#292524] rounded-[8px] space-y-3">
              <h2 className="text-xl font-medium text-[#FAFAF9]">Secure Cloud Vault</h2>
              <p className="text-[14px] text-[#A8A29E] leading-relaxed">
                Optional cloud storage requires email authentication and is protected by Supabase Postgres Row Level Security (RLS) so only you access your saved files.
              </p>
            </div>
          </div>
        </section>

        {/* Author / Maintainer Section */}
        <section className="py-16 px-6 md:px-16 max-w-6xl mx-auto border-t border-[#292524]">
          <div className="bg-[#1C1917] border border-[#292524] p-8 md:p-12 rounded-[8px] flex flex-col md:flex-row justify-between gap-8 items-start">
            <div className="max-w-xl">
              <span className="text-[12px] text-[#78716C] block mb-2">
                Creator & maintainer
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
                  className="h-10 px-4 bg-[#141110] border border-[#292524] hover:border-[#A8A29E] text-[13px] text-[#FAFAF9] rounded-[6px] transition-colors flex items-center gap-2"
                >
                  <Github className="w-4 h-4" />
                  GitHub
                </Link>
                <Link
                  href="https://www.linkedin.com/in/rachitkrtiwari/"
                  target="_blank"
                  className="h-10 px-4 bg-[#141110] border border-[#292524] hover:border-[#A8A29E] text-[13px] text-[#FAFAF9] rounded-[6px] transition-colors flex items-center gap-2"
                >
                  <Linkedin className="w-4 h-4" />
                  LinkedIn
                </Link>
              </div>
            </div>

            <div className="p-6 bg-[#141110] border border-[#292524] rounded-[6px] w-full md:w-80 text-[12px] space-y-3 font-mono">
              <div className="text-[#57534E] border-b border-[#292524] pb-2">
                Specifications
              </div>
              <div className="flex justify-between">
                <span className="text-[#57534E]">Runtime</span>
                <span className="text-[#FAFAF9]">Next.js 16 + WASM</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#57534E]">Design</span>
                <span className="text-[#FAFAF9]">Warm Industrial</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#57534E]">Deployment</span>
                <span className="text-[#FAFAF9]">Vercel Edge</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
