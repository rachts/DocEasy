import React from 'react'
import Link from 'next/link'
import { Github, Linkedin, Mail, ArrowRight } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-[#0C0A09] border-t border-[#292524] w-full pt-24 pb-16 px-6 md:px-12 text-[#FAFAF9] font-sans">
      <div className="max-w-6xl mx-auto">
        {/* Main 5-Column Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-12 gap-8 lg:gap-10 pb-16 border-b border-[#292524]">
          {/* Column 1: Brand & Socials (lg:col-span-4 / 4 cols) */}
          <div className="lg:col-span-4 space-y-5 pr-4">
            <Link href="/" className="flex items-center gap-2.5 group w-fit">
              <div className="w-7 h-7 bg-[#1C1917] border border-[#292524] group-hover:border-[#A8A29E] rounded-[5px] flex items-center justify-center transition-colors duration-150 shrink-0">
                <svg className="w-4 h-4 text-[#FAFAF9]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </div>
              <span className="text-[18px] font-semibold tracking-[-0.02em] text-[#FAFAF9]">
                DocEasy
              </span>
            </Link>

            <p className="text-[14px] font-normal text-[#A8A29E] leading-relaxed max-w-sm">
              Privacy-first document and image toolkit. Client-first processing with optional server acceleration and secure authenticated cloud vault.
            </p>

            {/* Social Icons (36x36px container, border #292524, radius 6px, hover border #57534E, icon 16px #57534E hover #FAFAF9) */}
            <div className="flex items-center gap-3 pt-2">
              <Link 
                href="https://github.com/rachts/DocEasy" 
                target="_blank" 
                rel="noopener noreferrer"
                aria-label="GitHub repository"
                className="w-9 h-9 rounded-[6px] bg-[#141110] border border-[#292524] hover:border-[#57534E] flex items-center justify-center text-[#57534E] hover:text-[#FAFAF9] transition-colors duration-150"
                title="GitHub"
              >
                <Github className="w-4 h-4 stroke-[1.5]" aria-hidden="true" />
              </Link>
              <Link 
                href="https://www.linkedin.com/in/rachitkrtiwari/" 
                target="_blank" 
                rel="noopener noreferrer"
                aria-label="LinkedIn profile"
                className="w-9 h-9 rounded-[6px] bg-[#141110] border border-[#292524] hover:border-[#57534E] flex items-center justify-center text-[#57534E] hover:text-[#FAFAF9] transition-colors duration-150"
                title="LinkedIn"
              >
                <Linkedin className="w-4 h-4 stroke-[1.5]" aria-hidden="true" />
              </Link>
              <Link 
                href="https://x.com/rachts" 
                target="_blank" 
                rel="noopener noreferrer"
                aria-label="X (Twitter) profile"
                className="w-9 h-9 rounded-[6px] bg-[#141110] border border-[#292524] hover:border-[#57534E] flex items-center justify-center text-[#57534E] hover:text-[#FAFAF9] transition-colors duration-150"
                title="X / Twitter"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </Link>
              <Link 
                href="mailto:rachit@doceasy.app" 
                aria-label="Email support"
                className="w-9 h-9 rounded-[6px] bg-[#141110] border border-[#292524] hover:border-[#57534E] flex items-center justify-center text-[#57534E] hover:text-[#FAFAF9] transition-colors duration-150"
                title="Email"
              >
                <Mail className="w-4 h-4 stroke-[1.5]" aria-hidden="true" />
              </Link>
            </div>
          </div>

          {/* Column 2: PDF tools (lg:col-span-2) */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-[12px] font-medium tracking-wide text-[#A8A29E] whitespace-nowrap">
              PDF tools
            </h3>
            <ul className="space-y-3 text-[14px] font-normal">
              <li>
                <Link href="/tools/compress" className="text-[#A8A29E] hover:text-[#FAFAF9] transition-colors duration-150">
                  PDF Compressor
                </Link>
              </li>
              <li>
                <Link href="/tools/convert" className="text-[#A8A29E] hover:text-[#FAFAF9] transition-colors duration-150">
                  Format Converter
                </Link>
              </li>
              <li>
                <Link href="/tools/merge" className="text-[#A8A29E] hover:text-[#FAFAF9] transition-colors duration-150">
                  PDF Merger
                </Link>
              </li>
              <li>
                <Link href="/tools/pdf-maker" className="text-[#A8A29E] hover:text-[#FAFAF9] transition-colors duration-150">
                  PDF Maker
                </Link>
              </li>
              <li>
                <Link href="/tools/pdf-extractor" className="text-[#A8A29E] hover:text-[#FAFAF9] transition-colors duration-150">
                  PDF Extractor
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: IMAGE & AI (lg:col-span-2) */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-[12px] font-medium tracking-wide text-[#A8A29E] whitespace-nowrap">
              Image & AI
            </h3>
            <ul className="space-y-3 text-[14px] font-normal">
              <li>
                <Link href="/tools/image-compressor" className="text-[#A8A29E] hover:text-[#FAFAF9] transition-colors duration-150">
                  Image Compressor
                </Link>
              </li>
              <li>
                <Link href="/tools/image-converter" className="text-[#A8A29E] hover:text-[#FAFAF9] transition-colors duration-150">
                  Image Converter
                </Link>
              </li>
              <li>
                <Link href="/tools/passport-photo" className="text-[#A8A29E] hover:text-[#FAFAF9] transition-colors duration-150">
                  Passport Photo Editor
                </Link>
              </li>
              <li>
                <Link href="/tools/cropper" className="text-[#A8A29E] hover:text-[#FAFAF9] transition-colors duration-150">
                  Image Cropper
                </Link>
              </li>
              <li>
                <Link href="/tools/analysis" className="text-[#A8A29E] hover:text-[#FAFAF9] transition-colors duration-150">
                  Resume Analyzer
                </Link>
              </li>
              <li>
                <Link href="/tools/pdf-summarizer" className="text-[#A8A29E] hover:text-[#FAFAF9] transition-colors duration-150">
                  PDF Summarizer
                </Link>
              </li>
              <li className="pt-1">
                <Link href="/tools" className="group/link flex items-center gap-1.5 text-[12px] font-medium text-[#A8A29E] hover:text-[#FAFAF9] transition-colors duration-150 whitespace-nowrap">
                  <span>All 12 tools</span>
                  <ArrowRight className="w-3 h-3 transition-transform duration-150 group-hover/link:translate-x-1" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: SUPPORT (lg:col-span-2) */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-[12px] font-medium tracking-wide text-[#A8A29E] whitespace-nowrap">
              Support
            </h3>
            <ul className="space-y-3 text-[14px] font-normal">
              <li>
                <Link href="/privacy" className="text-[#A8A29E] hover:text-[#FAFAF9] transition-colors duration-150">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-[#A8A29E] hover:text-[#FAFAF9] transition-colors duration-150">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-[#A8A29E] hover:text-[#FAFAF9] transition-colors duration-150">
                  About
                </Link>
              </li>
              <li>
                <Link href="/tools/vault" className="text-[#A8A29E] hover:text-[#FAFAF9] transition-colors duration-150">
                  Encrypted Vault
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 5: LEGAL (lg:col-span-2) */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-[12px] font-medium tracking-wide text-[#A8A29E] whitespace-nowrap">
              Legal
            </h3>
            <ul className="space-y-3 text-[14px] font-normal">
              <li>
                <Link href="/terms" className="text-[#A8A29E] hover:text-[#FAFAF9] transition-colors duration-150 whitespace-nowrap">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="text-[#A8A29E] hover:text-[#FAFAF9] transition-colors duration-150 whitespace-nowrap">
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link href="/security" className="text-[#A8A29E] hover:text-[#FAFAF9] transition-colors duration-150 whitespace-nowrap">
                  Security
                </Link>
              </li>
              <li>
                <Link href="/status" className="text-[#A8A29E] hover:text-[#FAFAF9] transition-colors duration-150 whitespace-nowrap">
                  Status
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar (py-6) */}
        <div className="pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-[13px] text-[#A8A29E]">
            © 2024 DocEasy. All rights reserved.
          </div>
          <div className="flex items-center gap-4 text-[13px] text-[#A8A29E]">
            <Link href="/privacy" className="hover:text-[#FAFAF9] transition-colors duration-150">
              Privacy
            </Link>
            <span>·</span>
            <Link href="/terms" className="hover:text-[#FAFAF9] transition-colors duration-150">
              Terms
            </Link>
            <span>·</span>
            <Link href="/status" className="hover:text-[#FAFAF9] transition-colors duration-150">
              Status
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
