'use client'

import React, { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  ChevronDown, 
  Search, 
  ArrowRight,
  Globe,
  Menu,
  X
} from 'lucide-react'
import { CommandMenu } from '@/components/command-menu'

export function Navbar() {
  const [toolsOpen, setToolsOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState<string>('')
  const dropdownRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()

  const isHome = pathname === '/'

  // IntersectionObserver to detect active section on landing page
  useEffect(() => {
    if (!isHome) {
      setActiveSection('')
      return
    }

    const sectionIds = ['tools', 'process', 'manifesto']
    const observers: IntersectionObserver[] = []

    const observerCallback: IntersectionObserverCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id)
        }
      })
    }

    sectionIds.forEach((id) => {
      const el = document.getElementById(id)
      if (el) {
        const observer = new IntersectionObserver(observerCallback, {
          rootMargin: '-50% 0px -50% 0px',
          threshold: 0,
        })
        observer.observe(el)
        observers.push(observer)
      }
    })

    return () => {
      observers.forEach((obs) => obs.disconnect())
    }
  }, [isHome])

  // Handle outside click for dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setToolsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false)
    setToolsOpen(false)
  }, [pathname])

  const scrollToSection = (id: string, e: React.MouseEvent) => {
    if (isHome) {
      e.preventDefault()
      const element = document.getElementById(id)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
      setMobileMenuOpen(false)
    }
  }

  return (
    <>
      <nav className="fixed top-0 left-0 w-full h-[56px] bg-[#0C0A09] border-b border-[#292524] flex justify-between items-center px-6 md:px-12 z-50 select-none">
        {/* Left: Brand Logo & Navigation Links */}
        <div className="flex items-center gap-8">
          {/* Logo & Wordmark */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-7 h-7 bg-[#1C1917] border border-[#292524] group-hover:border-[#A8A29E] rounded-[5px] flex items-center justify-center transition-colors duration-150">
              <svg className="w-4 h-4 text-[#FAFAF9]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </div>
            <span className="text-[17px] font-semibold tracking-[-0.02em] text-[#FAFAF9]">
              DocEasy
            </span>
          </Link>

          {/* Navigation Links with Anchor Smooth Scroll (Desktop) */}
          <div className="hidden md:flex items-center gap-6">
            {/* Tools (Scroll to #tools + Dropdown toggle) */}
            <div className="relative flex items-center" ref={dropdownRef}>
              <Link
                href="/#tools"
                onClick={(e) => scrollToSection('tools', e)}
                className={`text-[13px] font-medium transition-colors duration-150 ${
                  activeSection === 'tools'
                    ? 'text-[#FAFAF9]'
                    : 'text-[#A8A29E] hover:text-[#FAFAF9]'
                }`}
              >
                Tools
              </Link>
              <button
                type="button"
                onClick={() => setToolsOpen(!toolsOpen)}
                className="p-1 text-[#57534E] hover:text-[#FAFAF9] transition-colors cursor-pointer ml-0.5"
                title="Toggle tools menu"
                aria-expanded={toolsOpen}
              >
                <ChevronDown className={`w-3 h-3 transition-transform duration-150 ${toolsOpen ? 'rotate-180 text-[#FAFAF9]' : ''}`} />
              </button>

              {/* Dropdown Menu Container */}
              {toolsOpen && (
                <div className="absolute top-[calc(100%+12px)] left-0 w-64 bg-[#1C1917] border border-[#292524] rounded-[8px] p-2 z-50 font-sans shadow-none animate-in fade-in-0 zoom-in-95 duration-100">
                  {/* PDF Tools */}
                  <div className="px-3 pt-2 pb-1.5 text-[11px] text-[#78716C] font-medium">
                    PDF Tools
                  </div>
                  <div className="flex flex-col space-y-0.5">
                    <Link
                      href="/tools/convert"
                      onClick={() => setToolsOpen(false)}
                      className="px-3 py-1.5 rounded-[4px] text-[13.5px] text-[#A8A29E] hover:text-[#FAFAF9] hover:bg-[#141110] transition-colors"
                    >
                      PDF Converter
                    </Link>
                    <Link
                      href="/tools/pdf-maker"
                      onClick={() => setToolsOpen(false)}
                      className="px-3 py-1.5 rounded-[4px] text-[13.5px] text-[#A8A29E] hover:text-[#FAFAF9] hover:bg-[#141110] transition-colors"
                    >
                      PDF Maker
                    </Link>
                    <Link
                      href="/tools/merge"
                      onClick={() => setToolsOpen(false)}
                      className="px-3 py-1.5 rounded-[4px] text-[13.5px] text-[#A8A29E] hover:text-[#FAFAF9] hover:bg-[#141110] transition-colors"
                    >
                      PDF Merger
                    </Link>
                    <Link
                      href="/tools/pdf-extractor"
                      onClick={() => setToolsOpen(false)}
                      className="px-3 py-1.5 rounded-[4px] text-[13.5px] text-[#A8A29E] hover:text-[#FAFAF9] hover:bg-[#141110] transition-colors"
                    >
                      PDF Extractor
                    </Link>
                    <Link
                      href="/tools/compress"
                      onClick={() => setToolsOpen(false)}
                      className="px-3 py-1.5 rounded-[4px] text-[13.5px] text-[#A8A29E] hover:text-[#FAFAF9] hover:bg-[#141110] transition-colors"
                    >
                      PDF Compressor
                    </Link>
                  </div>

                  {/* Image Tools */}
                  <div className="border-t border-[#292524] mt-2 pt-2 px-3 pb-1.5 text-[11px] text-[#78716C] font-medium">
                    Image Tools
                  </div>
                  <div className="flex flex-col space-y-0.5">
                    <Link
                      href="/tools/image-compressor"
                      onClick={() => setToolsOpen(false)}
                      className="px-3 py-1.5 rounded-[4px] text-[13.5px] text-[#A8A29E] hover:text-[#FAFAF9] hover:bg-[#141110] transition-colors"
                    >
                      Image Compressor
                    </Link>
                    <Link
                      href="/tools/image-converter"
                      onClick={() => setToolsOpen(false)}
                      className="px-3 py-1.5 rounded-[4px] text-[13.5px] text-[#A8A29E] hover:text-[#FAFAF9] hover:bg-[#141110] transition-colors"
                    >
                      Image Converter
                    </Link>
                    <Link
                      href="/tools/passport-photo"
                      onClick={() => setToolsOpen(false)}
                      className="px-3 py-1.5 rounded-[4px] text-[13.5px] text-[#A8A29E] hover:text-[#FAFAF9] hover:bg-[#141110] transition-colors"
                    >
                      Passport Photo Editor
                    </Link>
                    <Link
                      href="/tools/cropper"
                      onClick={() => setToolsOpen(false)}
                      className="px-3 py-1.5 rounded-[4px] text-[13.5px] text-[#A8A29E] hover:text-[#FAFAF9] hover:bg-[#141110] transition-colors"
                    >
                      Image Cropper
                    </Link>
                  </div>

                  {/* View All Tools */}
                  <div className="border-t border-[#292524] mt-2 pt-1.5">
                    <Link
                      href="/tools"
                      onClick={() => setToolsOpen(false)}
                      className="flex items-center justify-between px-3 py-2 rounded-[4px] text-[13.5px] font-medium text-[#FAFAF9] hover:bg-[#141110] transition-colors"
                    >
                      <span>View All Tools</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#57534E]" />
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Manifesto (#manifesto) */}
            <Link 
              href="/#manifesto"
              onClick={(e) => scrollToSection('manifesto', e)}
              className={`text-[13px] font-medium transition-colors duration-150 ${
                activeSection === 'manifesto'
                  ? 'text-[#FAFAF9]'
                  : 'text-[#A8A29E] hover:text-[#FAFAF9]'
              }`}
            >
              Manifesto
            </Link>

            {/* Process (#process) */}
            <Link 
              href="/#process"
              onClick={(e) => scrollToSection('process', e)}
              className={`text-[13px] font-medium transition-colors duration-150 ${
                activeSection === 'process'
                  ? 'text-[#FAFAF9]'
                  : 'text-[#A8A29E] hover:text-[#FAFAF9]'
              }`}
            >
              Process
            </Link>

            {/* Vault (/tools/vault) */}
            <Link 
              href="/tools/vault" 
              className="text-[13px] font-medium text-[#A8A29E] hover:text-[#FAFAF9] transition-colors duration-150"
            >
              Vault
            </Link>
          </div>
        </div>

        {/* Right: Search, Lang, Auth CTAs, Mobile Hamburger */}
        <div className="flex items-center gap-3 md:gap-4">
          {/* Search Trigger */}
          <button
            type="button"
            onClick={() => {
              window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true }))
            }}
            className="p-1.5 text-[#57534E] hover:text-[#FAFAF9] rounded-[4px] transition-colors flex items-center gap-2 font-mono text-[11px] cursor-pointer"
            title="Search tools (⌘K)"
          >
            <Search className="w-4 h-4" />
            <span className="hidden lg:inline border border-[#292524] bg-[#141110] px-1.5 py-0.5 rounded text-[10px] text-[#57534E]">
              ⌘K
            </span>
          </button>

          {/* Lang Selector */}
          <div className="hidden sm:flex items-center gap-1 font-mono text-[11px] uppercase tracking-[0.05em] text-[#57534E] hover:text-[#A8A29E] transition-colors cursor-pointer px-1.5 py-1">
            <Globe className="w-3.5 h-3.5" />
            <span>EN</span>
          </div>

          {/* Login Link */}
          <Link
            href="/login"
            className="text-[13px] font-medium text-[#A8A29E] hover:text-[#FAFAF9] px-2 py-1.5 transition-colors hidden sm:inline-block"
          >
            Log in
          </Link>

          {/* Sign Up / Primary Action Button */}
          <Link
            href="/signup"
            className="h-8 md:h-9 px-3.5 md:px-4 bg-[#FAFAF9] text-[#0C0A09] text-[12px] md:text-[13px] font-medium rounded-[6px] hover:bg-[#D6D3D1] transition-colors flex items-center justify-center shrink-0"
          >
            Sign up
          </Link>

          {/* Mobile Menu Toggle Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 text-[#57534E] hover:text-[#FAFAF9] rounded-[4px] md:hidden transition-colors cursor-pointer"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 top-[56px] bg-[#0C0A09] z-40 md:hidden flex flex-col p-6 overflow-y-auto border-b border-[#292524] animate-in fade-in-0 slide-in-from-top-2 duration-150">
          <div className="flex flex-col space-y-4 pt-2">
            <div className="text-[11px] font-mono text-[#78716C] pb-1 border-b border-[#292524]">
              Navigation
            </div>
            <Link
              href="/#tools"
              onClick={(e) => scrollToSection('tools', e)}
              className="text-[15px] font-medium text-[#FAFAF9] py-2 border-b border-[#292524]/60"
            >
              Tools
            </Link>
            <Link
              href="/#process"
              onClick={(e) => scrollToSection('process', e)}
              className="text-[15px] font-medium text-[#A8A29E] hover:text-[#FAFAF9] py-2 border-b border-[#292524]/60"
            >
              How it works
            </Link>
            <Link
              href="/#manifesto"
              onClick={(e) => scrollToSection('manifesto', e)}
              className="text-[15px] font-medium text-[#A8A29E] hover:text-[#FAFAF9] py-2 border-b border-[#292524]/60"
            >
              Privacy manifesto
            </Link>
            <Link
              href="/tools/vault"
              onClick={() => setMobileMenuOpen(false)}
              className="text-[15px] font-medium text-[#A8A29E] hover:text-[#FAFAF9] py-2 border-b border-[#292524]/60"
            >
              Encrypted vault
            </Link>
            <Link
              href="/tools"
              onClick={() => setMobileMenuOpen(false)}
              className="text-[15px] font-medium text-[#A8A29E] hover:text-[#FAFAF9] py-2 border-b border-[#292524]/60"
            >
              View all 12 tools →
            </Link>

            <div className="pt-6 flex gap-3">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex-1 h-10 bg-transparent text-[#FAFAF9] border border-[#292524] text-[13px] font-medium rounded-[6px] hover:bg-[#1C1917] flex items-center justify-center"
              >
                Log in
              </Link>
              <Link
                href="/signup"
                onClick={() => setMobileMenuOpen(false)}
                className="flex-1 h-10 bg-[#FAFAF9] text-[#0C0A09] text-[13px] font-medium rounded-[6px] hover:bg-[#D6D3D1] flex items-center justify-center"
              >
                Sign up
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Global Command Menu */}
      <CommandMenu />
    </>
  )
}
