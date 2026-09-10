import Link from 'next/link'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'

export const metadata = {
  title: 'Privacy Protocol',
  description: 'DocEasy privacy protocol and data minimization guarantees for our hybrid architecture.',
  openGraph: {
    title: 'Privacy Protocol | DocEasy',
    description: 'DocEasy privacy protocol and data minimization guarantees for our hybrid architecture.',
    url: '/privacy',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'DocEasy Privacy Protocol' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Privacy Protocol | DocEasy',
    description: 'DocEasy privacy protocol and data minimization guarantees for our hybrid architecture.',
    images: ['/og-image.png'],
  },
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
            DocEasy is built around data minimization. Core utilities run directly in your browser without transmitting your files. When heavy server-side processing is requested (such as Ghostscript/qpdf compression), files are processed in ephemeral containers and wiped immediately upon completion. If you choose to create an account, your cloud vault files are encrypted and protected by Supabase Postgres Row Level Security.
          </p>
          <p className="text-[13px] text-[#78716C] mb-12 border-b border-[#292524] pb-4">
            Last updated: 2026
          </p>

          <div className="space-y-8">
            <div className="p-6 bg-[#1C1917] border border-[#292524] rounded-[8px] space-y-2">
              <h2 className="text-xl font-medium text-[#FAFAF9]">1. Client-Side Execution for Core Tools</h2>
              <p className="text-[15px] text-[#A8A29E] leading-relaxed">
                Standard document conversions, PDF merging, text extraction, sentence summarization, image compression, cropping, and passport photo generation execute locally within your browser context via sandboxed WebAssembly and HTML5 Canvas. Byte buffers never leave your machine for these operations.
              </p>
            </div>

            <div className="p-6 bg-[#1C1917] border border-[#292524] rounded-[8px] space-y-2">
              <h2 className="text-xl font-medium text-[#FAFAF9]">2. Ephemeral Server-Side Processing</h2>
              <p className="text-[15px] text-[#A8A29E] leading-relaxed">
                For intensive PDF tasks requiring deep compression (e.g. Ghostscript and qpdf linearization up to 250MB), files are routed through isolated server API endpoints. These temporary files exist only for the duration of execution and are purged from disk and memory immediately once the compressed file is streamed back to you. We never train AI models or profile documents.
              </p>
            </div>

            <div className="p-6 bg-[#1C1917] border border-[#292524] rounded-[8px] space-y-2">
              <h2 className="text-xl font-medium text-[#FAFAF9]">3. Storage Options: Local Session Vault vs. Cloud Vault</h2>
              <p className="text-[15px] text-[#A8A29E] leading-relaxed">
                Unauthenticated users can use the client-side Encrypted Vault, which stores files strictly in browser session memory with Web Crypto AES-GCM (256-bit) and auto-purges after 2 hours. Users who desire multi-device access can optionally sign up with an email and password to use our Cloud Vault, where files are stored in Supabase with strict Postgres Row Level Security (RLS) and retained until the user deletes them.
              </p>
            </div>

            <div className="p-6 bg-[#1C1917] border border-[#292524] rounded-[8px] space-y-2">
              <h2 className="text-xl font-medium text-[#FAFAF9]">4. No Telemetry Harvesting</h2>
              <p className="text-[15px] text-[#A8A29E] leading-relaxed">
                We do not inject third-party ad pixels, session replay recording scripts, or behavioral trackers. Anonymized performance signals are restricted to essential operational diagnostics.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
