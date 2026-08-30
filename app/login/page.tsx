'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { login } from './actions'
import { createClient } from '@/utils/supabase/client'

export default function LoginPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const formData = new FormData(e.currentTarget)
    const result = await login(formData)

    if (result?.error) {
      setError(result.error)
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    try {
      setLoading(true)
      const supabase = createClient()
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`
        }
      })
      if (error) throw error
    } catch (err: any) {
      setError(err.message || 'Google login failed')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0C0A09] text-[#FAFAF9] flex flex-col items-center justify-center p-6 font-sans selection:bg-[#292524] selection:text-[#FAFAF9]">
      <div className="w-full max-w-[420px] flex flex-col items-center">
        {/* Brand Logo & Wordmark */}
        <Link href="/" className="flex items-center gap-2.5 mb-8 group">
          <div className="w-8 h-8 bg-[#1C1917] border border-[#292524] group-hover:border-[#A8A29E] rounded-[6px] flex items-center justify-center transition-colors duration-150">
            <svg className="w-4 h-4 text-[#FAFAF9]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </div>
          <span className="text-2xl font-semibold tracking-[-0.02em] text-[#FAFAF9]">
            DocEasy
          </span>
        </Link>

        {/* Auth Card Container */}
        <div className="w-full bg-[#1C1917] border border-[#292524] rounded-[8px] p-8 md:p-10">
          <div className="mb-6 text-left">
            <h1 className="text-2xl font-medium tracking-tight text-[#FAFAF9]">
              Sign In
            </h1>
            <p className="text-[14px] text-[#A8A29E] mt-1.5 leading-relaxed">
              Enter your credentials to access your workspace vault.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-3 bg-[#141110] border border-[#7F1D1D] text-[#FAFAF9] text-[13px] rounded-[6px] font-mono">
              [ERROR]: {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5 text-left">
              <label className="font-mono text-[11px] uppercase tracking-[0.05em] text-[#57534E] block" htmlFor="email">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                placeholder="name@company.com"
                className="w-full h-11 bg-[#141110] border border-[#292524] rounded-[6px] px-3.5 text-[14.5px] text-[#FAFAF9] placeholder:text-[#57534E] focus:border-[#A8A29E] focus:outline-none transition-colors duration-150"
              />
            </div>

            <div className="space-y-1.5 text-left">
              <div className="flex justify-between items-center">
                <label className="font-mono text-[11px] uppercase tracking-[0.05em] text-[#57534E] block" htmlFor="password">
                  Password
                </label>
                <Link
                  href="/contact"
                  className="font-mono text-[11px] uppercase tracking-[0.05em] text-[#57534E] hover:text-[#FAFAF9] transition-colors"
                >
                  Reset
                </Link>
              </div>
              <input
                id="password"
                name="password"
                type="password"
                required
                placeholder="••••••••"
                className="w-full h-11 bg-[#141110] border border-[#292524] rounded-[6px] px-3.5 text-[14.5px] text-[#FAFAF9] placeholder:text-[#57534E] focus:border-[#A8A29E] focus:outline-none transition-colors duration-150"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-10 bg-[#FAFAF9] text-[#0C0A09] font-mono text-[12px] uppercase font-medium tracking-[0.05em] rounded-[6px] hover:bg-[#D6D3D1] transition-colors duration-150 flex items-center justify-center gap-2 mt-6 cursor-pointer disabled:opacity-50"
            >
              {loading ? 'AUTHENTICATING...' : 'SIGN IN'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="my-6 flex items-center">
            <div className="flex-1 border-t border-[#292524]"></div>
            <span className="px-3 font-mono text-[11px] uppercase tracking-[0.05em] text-[#57534E]">OR</span>
            <div className="flex-1 border-t border-[#292524]"></div>
          </div>

          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full h-10 bg-[#141110] text-[#FAFAF9] border border-[#292524] font-mono text-[12px] uppercase tracking-[0.05em] rounded-[6px] hover:bg-[#1C1917] hover:border-[#A8A29E] transition-colors duration-150 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            CONTINUE WITH GOOGLE
          </button>
        </div>

        {/* Bottom Switcher */}
        <div className="mt-8 text-center">
          <span className="font-mono text-[12px] uppercase tracking-[0.05em] text-[#57534E]">
            New to DocEasy?
          </span>
          <Link
            href="/signup"
            className="font-mono text-[12px] uppercase tracking-[0.05em] text-[#FAFAF9] hover:text-[#D6D3D1] ml-2 border-b border-[#FAFAF9] pb-0.5 transition-colors"
          >
            CREATE ACCOUNT
          </Link>
        </div>

        {/* Sub-Footer Meta */}
        <div className="mt-8 font-mono text-[11px] uppercase tracking-[0.05em] text-[#57534E] flex items-center gap-3">
          <Link href="/privacy" className="hover:text-[#A8A29E] transition-colors">Privacy</Link>
          <span>•</span>
          <Link href="/terms" className="hover:text-[#A8A29E] transition-colors">Terms</Link>
          <span>•</span>
          <span>Zero Server Retention</span>
        </div>
      </div>
    </div>
  )
}
