'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { LogOut, Settings, User } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'

interface ProfileDropdownProps {
  userInitial: string
  userEmail: string
}

export function ProfileDropdown({ userInitial, userEmail }: ProfileDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isSigningOut, setIsSigningOut] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSignOut = async () => {
    setIsSigningOut(true)
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        className="w-8 h-8 flex items-center justify-center font-mono text-[12px] font-medium bg-[#141110] border border-[#292524] text-[#FAFAF9] rounded-[4px] cursor-pointer hover:border-[#A8A29E] transition-colors outline-none"
      >
        {userInitial}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-[#1C1917] border border-[#292524] text-[#FAFAF9] rounded-[6px] shadow-none z-50 overflow-hidden font-sans">
          <div className="p-3 border-b border-[#292524]">
            <p className="font-mono text-[10px] uppercase tracking-[0.05em] text-[#57534E]">Account</p>
            <p className="font-mono text-[12px] text-[#FAFAF9] truncate mt-0.5">
              {userEmail}
            </p>
          </div>

          <div className="py-1">
            <Link
              href="/settings"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 text-[12px] font-mono uppercase tracking-[0.05em] text-[#A8A29E] hover:text-[#FAFAF9] hover:bg-[#141110] transition-colors"
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Settings</span>
            </Link>
            <Link
              href="/dashboard"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 text-[12px] font-mono uppercase tracking-[0.05em] text-[#A8A29E] hover:text-[#FAFAF9] hover:bg-[#141110] transition-colors"
            >
              <User className="w-3.5 h-3.5" />
              <span>Dashboard</span>
            </Link>
          </div>

          <div className="border-t border-[#292524] p-1">
            <button
              onClick={handleSignOut}
              disabled={isSigningOut}
              className="w-full flex items-center gap-2.5 px-2.5 py-1.5 text-[12px] font-mono uppercase tracking-[0.05em] text-[#FAFAF9] hover:bg-[#141110] hover:text-[#A8A29E] transition-colors text-left rounded-[4px] cursor-pointer disabled:opacity-50"
            >
              <LogOut className="w-3.5 h-3.5 text-[#57534E]" />
              <span>{isSigningOut ? 'Signing out...' : 'Log out'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
