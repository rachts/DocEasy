import React from 'react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'

export const metadata = {
  title: 'Cookie Policy | DocEasy',
  description: 'DocEasy Cookie and Storage Policy.',
}

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen bg-[#0C0A09] text-[#FAFAF9] font-sans flex flex-col antialiased">
      <Navbar />

      <main className="flex-1 pt-[56px]">
        <section className="px-6 md:px-16 pt-24 pb-20 max-w-4xl mx-auto">
          <div className="border-b border-[#292524] pb-6 mb-10">
            <span className="font-mono text-[11px] uppercase tracking-[0.05em] text-[#57534E] block mb-2">
              LEGAL & PRIVACY DISCLOSURE
            </span>
            <h1 className="text-4xl md:text-5xl font-medium tracking-tight text-[#FAFAF9]">
              Cookie Policy
            </h1>
            <p className="font-mono text-[12px] text-[#57534E] mt-3">
              LAST AUDITED: AUGUST 30, 2024
            </p>
          </div>

          <div className="space-y-10 text-[15px] text-[#A8A29E] leading-relaxed">
            <div className="bg-[#1C1917] border border-[#292524] p-6 rounded-[8px]">
              <h2 className="text-lg font-medium text-[#FAFAF9] mb-2">
                Strict Zero-Tracking Guarantee
              </h2>
              <p>
                DocEasy operates on a strictly client-side architecture. We do not use third-party tracking cookies, advertising beacons, or cross-site tracking technologies.
              </p>
            </div>

            <section className="space-y-3">
              <h2 className="text-xl font-medium text-[#FAFAF9]">
                1. What We Store Locally
              </h2>
              <p>
                DocEasy utilizes browser <code className="font-mono text-[13px] bg-[#141110] border border-[#292524] px-1.5 py-0.5 rounded text-[#FAFAF9]">localStorage</code> solely to preserve ephemeral user preferences (such as theme preferences and your recent local session files). This data never leaves your device and is not synchronized with any central servers.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-medium text-[#FAFAF9]">
                2. Essential Cookies Only
              </h2>
              <p>
                If you choose to authenticate using an account, an encrypted session token is stored in an <code className="font-mono text-[13px] bg-[#141110] border border-[#292524] px-1.5 py-0.5 rounded text-[#FAFAF9]">HttpOnly</code> cookie to maintain your session. No user tracking is performed.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-medium text-[#FAFAF9]">
                3. Clearing Your Data
              </h2>
              <p>
                You can clear all stored data at any time via your browser settings or by clicking the &ldquo;Clear All Data&rdquo; button in your DocEasy Vault Settings.
              </p>
            </section>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
