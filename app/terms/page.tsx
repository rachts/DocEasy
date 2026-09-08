import Link from 'next/link'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'

export const metadata = {
  title: 'Terms of Service | DocEasy',
  description: 'Terms of Service and operational parameters for DocEasy.',
  openGraph: {
    title: 'Terms of Service | DocEasy',
    description: 'Terms of Service and operational parameters for DocEasy. 100% client-side document toolkit.',
    url: '/terms',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'DocEasy Terms of Service' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Terms of Service | DocEasy',
    description: 'Terms of Service and operational parameters for DocEasy. 100% client-side document toolkit.',
    images: ['/og-image.png'],
  },
}

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-[#0C0A09] text-[#FAFAF9] font-sans flex flex-col selection:bg-[#292524] selection:text-[#FAFAF9]">
      <Navbar />

      <main className="flex-1 pt-[56px]">
        {/* Header Breadcrumb */}
        <div className="bg-[#141110] border-b border-[#292524] py-3 px-6 md:px-16">
          <div className="max-w-4xl mx-auto flex items-center gap-2 text-[12px]">
            <Link href="/" className="text-[#A8A29E] hover:text-[#FAFAF9] transition-colors">
              Home
            </Link>
            <span className="text-[#57534E]">/</span>
            <span className="text-[#FAFAF9]">Terms of Service</span>
          </div>
        </div>

        <section className="py-16 md:py-24 px-6 md:px-16 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-medium tracking-tight text-[#FAFAF9] leading-tight mb-4">
            Terms of Service
          </h1>
          <p className="text-[13px] text-[#78716C] mb-12 border-b border-[#292524] pb-4">
            Last updated: October 2024
          </p>

          <div className="space-y-8">
            <div className="p-6 bg-[#1C1917] border border-[#292524] rounded-[8px] space-y-2">
              <h2 className="text-xl font-medium text-[#FAFAF9]">Acceptance & scope</h2>
              <p className="text-[15px] text-[#A8A29E] leading-relaxed">
                By utilizing DocEasy web utilities, you agree to comply with standard operational parameters. DocEasy is provided on an &ldquo;as is&rdquo; basis with client-side computation guarantees.
              </p>
            </div>

            <div className="p-6 bg-[#1C1917] border border-[#292524] rounded-[8px] space-y-2">
              <h2 className="text-xl font-medium text-[#FAFAF9]">Intellectual property & content</h2>
              <p className="text-[15px] text-[#A8A29E] leading-relaxed">
                You retain 100% intellectual property ownership of all source documents and transformed assets processed through this interface. DocEasy does not claim any license or ownership.
              </p>
            </div>

            <div className="p-6 bg-[#1C1917] border border-[#292524] rounded-[8px] space-y-2">
              <h2 className="text-xl font-medium text-[#FAFAF9]">Prohibited use</h2>
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
