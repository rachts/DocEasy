'use client'

import React from 'react'
import Link from 'next/link'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { ArrowRight, Mail } from 'lucide-react'

export default function ContactPage() {
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    const formData = new FormData(e.currentTarget)
    const name = formData.get('name') as string
    const email = formData.get('email') as string
    const subject = formData.get('subject') as string
    const message = formData.get('message') as string

    const mailtoSubject = encodeURIComponent(`DocEasy Support: ${subject}`)
    const mailtoBody = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
    )

    window.location.href = `mailto:tiwari.rachit@gmail.com?subject=${mailtoSubject}&body=${mailtoBody}`
  }

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
            <span className="text-[#FAFAF9]">SUPPORT & DISCLOSURE</span>
          </div>
        </div>

        <section className="py-16 md:py-24 px-6 md:px-16 max-w-xl mx-auto">
          <div className="mb-10">
            <h1 className="text-4xl font-medium tracking-tight text-[#FAFAF9]">
              Support & Security Disclosure
            </h1>
            <p className="text-[15px] text-[#A8A29E] mt-2 leading-relaxed">
              Submit vulnerability reports, architecture feedback, or direct support inquiries to the core maintainers.
            </p>
          </div>

          <div className="bg-[#1C1917] border border-[#292524] p-8 rounded-[8px]">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label htmlFor="name" className="font-mono text-[11px] uppercase tracking-[0.05em] text-[#57534E] block">
                  Identifier / Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  placeholder="Security Officer / Name"
                  className="w-full h-11 bg-[#141110] border border-[#292524] rounded-[6px] px-3.5 text-[15px] text-[#FAFAF9] placeholder:text-[#57534E] focus:border-[#A8A29E] focus:outline-none transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="email" className="font-mono text-[11px] uppercase tracking-[0.05em] text-[#57534E] block">
                  Reply Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="name@company.com"
                  className="w-full h-11 bg-[#141110] border border-[#292524] rounded-[6px] px-3.5 text-[15px] text-[#FAFAF9] placeholder:text-[#57534E] focus:border-[#A8A29E] focus:outline-none transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="subject" className="font-mono text-[11px] uppercase tracking-[0.05em] text-[#57534E] block">
                  Topic / Vector
                </label>
                <input
                  id="subject"
                  name="subject"
                  type="text"
                  required
                  placeholder="Vulnerability Report / General Inquiry"
                  className="w-full h-11 bg-[#141110] border border-[#292524] rounded-[6px] px-3.5 text-[15px] text-[#FAFAF9] placeholder:text-[#57534E] focus:border-[#A8A29E] focus:outline-none transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="message" className="font-mono text-[11px] uppercase tracking-[0.05em] text-[#57534E] block">
                  Message Payload
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  required
                  placeholder="Describe your inquiry or reproduction steps..."
                  className="w-full bg-[#141110] border border-[#292524] rounded-[6px] p-3.5 text-[15px] text-[#FAFAF9] placeholder:text-[#57534E] focus:border-[#A8A29E] focus:outline-none transition-colors resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full h-10 bg-[#FAFAF9] text-[#0C0A09] font-mono text-[12px] uppercase font-medium tracking-[0.05em] rounded-[6px] hover:bg-[#D6D3D1] transition-colors duration-150 flex items-center justify-center gap-2 mt-6 cursor-pointer"
              >
                TRANSMIT INQUIRY
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
