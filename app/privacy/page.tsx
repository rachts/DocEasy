import Link from 'next/link'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'

export const metadata = {
  title: 'Privacy Protocol',
  description: 'DocEasy privacy protocol and data minimization guarantees.',
}

export default function PrivacyPolicyPage() {
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
            <span className="text-[#FAFAF9]">Privacy Policy</span>
          </div>
        </div>

        <section className="py-16 md:py-24 px-6 md:px-16 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-medium tracking-tight text-[#FAFAF9] leading-tight mb-4">
            Privacy Policy & Guarantees
          </h1>
          <p className="text-[16px] text-[#A8A29E] mb-6 max-w-3xl leading-relaxed">
            Everything runs locally in your browser. The optional vault uses client-side session memory, auto-purged after 2 hours. Nothing ever touches our servers.
          </p>
          <p className="text-[13px] text-[#78716C] mb-12 border-b border-[#292524] pb-4">
            Last updated: October 2024
          </p>

          <div className="space-y-8">
            <div className="p-6 bg-[#1C1917] border border-[#292524] rounded-[8px] space-y-2">
              <h2 className="text-xl font-medium text-[#FAFAF9]">Client-side execution</h2>
              <p className="text-[15px] text-[#A8A29E] leading-relaxed">
                All document parsing, formatting, rasterization, and compression operations run locally within your browser context via sandboxed WebAssembly execution threads. Byte buffers are never streamed to third parties.
              </p>
            </div>

            <div className="p-6 bg-[#1C1917] border border-[#292524] rounded-[8px] space-y-2">
              <h2 className="text-xl font-medium text-[#FAFAF9]">Client-side session storage & auto-purge</h2>
              <p className="text-[15px] text-[#A8A29E] leading-relaxed">
                The optional Encrypted File Vault stores your files exclusively within your local browser session using Web Crypto AES-GCM (256-bit) encryption. Stored items are automatically purged after 2 hours or when you clear your session. No user accounts, authentication, or remote server buckets exist on our platform.
              </p>
            </div>

            <div className="p-6 bg-[#1C1917] border border-[#292524] rounded-[8px] space-y-2">
              <h2 className="text-xl font-medium text-[#FAFAF9]">No telemetry harvesting</h2>
              <p className="text-[15px] text-[#A8A29E] leading-relaxed">
                We do not inject third-party ad pixels, session replay recording scripts, or behavioral trackers. Anonymized performance signals are restricted to error diagnostics.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
