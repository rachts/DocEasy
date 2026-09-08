import React from 'react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { ShieldCheck, Cpu, Lock, Terminal } from 'lucide-react'

export const metadata = {
  title: 'Security Architecture | DocEasy',
  description: 'DocEasy Security model and WebAssembly isolation overview.',
  openGraph: {
    title: 'Security Architecture | DocEasy',
    description: 'DocEasy Security model and WebAssembly isolation overview. 100% client-side zero server uploads.',
    url: '/security',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'DocEasy Security' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Security Architecture | DocEasy',
    description: 'DocEasy Security model and WebAssembly isolation overview. 100% client-side zero server uploads.',
    images: ['/og-image.png'],
  },
}

export default function SecurityPage() {
  const points = [
    {
      icon: Cpu,
      title: 'WebAssembly Memory Isolation',
      description: 'Document bytes are processed directly inside isolated browser WASM threads. Execution operations run with sandboxed memory constraints without touching external networks.'
    },
    {
      icon: Lock,
      title: 'Zero Data Retention (TTL 0s)',
      description: 'We do not retain, index, train on, or store user documents on our infrastructure. Once the browser process completes, the allocated memory buffer is freed immediately.'
    },
    {
      icon: ShieldCheck,
      title: 'Client-Side Session Encryption',
      description: 'The optional encrypted vault uses Web Crypto AES-GCM with 256-bit keys stored in sessionStorage. Encrypted files remain in browser memory, auto-purge after 2 hours, and never touch remote servers.'
    },
    {
      icon: Terminal,
      title: 'Open Source & Auditable',
      description: 'All core algorithms and client-side processing pipelines are open source for full transparency, independent review, and reproducible integrity verification.'
    }
  ]

  return (
    <div className="min-h-screen bg-[#0C0A09] text-[#FAFAF9] font-sans flex flex-col antialiased">
      <Navbar />

      <main className="flex-1 pt-[56px]">
        <section className="px-6 md:px-16 pt-24 pb-20 max-w-4xl mx-auto">
          <div className="border-b border-[#292524] pb-6 mb-10">
            <span className="text-[12px] font-medium text-[#78716C] block mb-2">
              Security protocol
            </span>
            <h1 className="text-4xl md:text-5xl font-medium tracking-tight text-[#FAFAF9]">
              Security Architecture
            </h1>
            <p className="text-[16px] text-[#A8A29E] mt-3 leading-relaxed">
              DocEasy is engineered from first principles with client-side isolation to guarantee total privacy and verifiable security.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
            {points.map((point) => (
              <div key={point.title} className="p-6 bg-[#1C1917] border border-[#292524] rounded-[8px] space-y-3">
                <div className="w-8 h-8 rounded-[4px] bg-[#141110] border border-[#292524] flex items-center justify-center">
                  <point.icon className="w-4 h-4 text-[#A8A29E]" />
                </div>
                <h2 className="text-base font-medium text-[#FAFAF9]">
                  {point.title}
                </h2>
                <p className="text-[13.5px] text-[#A8A29E] leading-relaxed">
                  {point.description}
                </p>
              </div>
            ))}
          </div>

          <div className="bg-[#1C1917] border border-[#292524] p-6 rounded-[8px] space-y-3">
            <h2 className="text-base font-medium text-[#FAFAF9]">
              Vulnerability Reporting
            </h2>
            <p className="text-[14px] text-[#A8A29E] leading-relaxed">
              If you discover a security vulnerability or discrepancy in our client-side pipelines, please disclose it responsibly by contacting <a href="mailto:security@doceasy.app" className="text-[#FAFAF9] underline underline-offset-4">security@doceasy.app</a>. We acknowledge and reward verified responsible security disclosures.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
