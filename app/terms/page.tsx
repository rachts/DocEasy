import Link from 'next/link'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'

export const metadata = {
  title: 'Terms of Service | DocEasy',
  description: 'Terms of Service and operational parameters for DocEasy.',
}

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-[#0C0A09] text-[#FAFAF9] font-sans flex flex-col selection:bg-[#292524] selection:text-[#FAFAF9]">
      <Navbar />

      <main className="flex-1 pt-[56px]">
        {/* Header Breadcrumb */}
        <div className="bg-[#141110] border-b border-[#292524] py-3 px-6 md:px-16">
          <div className="max-w-4xl mx-auto flex items-center gap-2 font-mono text-[12px] uppercase tracking-[0.05em]">
            <Link href="/" className="text-[#57534E] hover:text-[#FAFAF9] transition-colors">
              SYSTEM
            </Link>
            <span className="text-[#292524]">/</span>
            <span className="text-[#FAFAF9]">TERMS OF SERVICE</span>
          </div>
        </div>

        <section className="py-16 md:py-24 px-6 md:px-16 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-medium tracking-tight text-[#FAFAF9] leading-tight mb-4">
            Terms of Service
          </h1>
          <p className="font-mono text-[12px] uppercase tracking-[0.05em] text-[#57534E] mb-12 border-b border-[#292524] pb-4">
            REVISION: 2024.10 • STANDARD OPERATIONAL TERMS
          </p>

          <div className="space-y-8">
            <div className="p-6 bg-[#1C1917] border border-[#292524] rounded-[8px] space-y-2">
              <span className="font-mono text-[11px] uppercase tracking-[0.05em] text-[#57534E] block">
                CLAUSE 01
              </span>
              <h2 className="text-xl font-medium text-[#FAFAF9]">Acceptance & Scope</h2>
              <p className="text-[15px] text-[#A8A29E] leading-relaxed">
                By utilizing DocEasy web utilities, you agree to comply with standard operational parameters. DocEasy is provided on an &ldquo;as is&rdquo; basis with client-side computation guarantees.
              </p>
            </div>

            <div className="p-6 bg-[#1C1917] border border-[#292524] rounded-[8px] space-y-2">
              <span className="font-mono text-[11px] uppercase tracking-[0.05em] text-[#57534E] block">
                CLAUSE 02
              </span>
              <h2 className="text-xl font-medium text-[#FAFAF9]">Intellectual Property & Content</h2>
              <p className="text-[15px] text-[#A8A29E] leading-relaxed">
                You retain 100% intellectual property ownership of all source documents and transformed assets processed through this interface. DocEasy does not claim any license or ownership.
              </p>
            </div>

            <div className="p-6 bg-[#1C1917] border border-[#292524] rounded-[8px] space-y-2">
              <span className="font-mono text-[11px] uppercase tracking-[0.05em] text-[#57534E] block">
                CLAUSE 03
              </span>
              <h2 className="text-xl font-medium text-[#FAFAF9]">Prohibited Exploitation</h2>
              <p className="text-[15px] text-[#A8A29E] leading-relaxed">
                You agree not to reverse engineer the underlying WebAssembly modules for denial-of-service attempts or malicious payload distribution.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
