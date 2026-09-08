'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { 
  LayoutDashboard, 
  Minimize2, 
  Merge, 
  ArrowLeftRight, 
  FileSearch, 
  Settings, 
  HelpCircle, 
  LogOut 
} from 'lucide-react'
import { createClient } from '@/utils/supabase/client'

interface SidebarProps {
  currentPath?: string
}

export function Sidebar({ currentPath }: SidebarProps) {
  const pathname = usePathname() || currentPath || ''
  const router = useRouter()
  const supabase = createClient()

  const navItems = [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { label: 'PDF Compressor', href: '/tools/compress', icon: Minimize2 },
    { label: 'PDF Merger', href: '/tools/merge', icon: Merge },
    { label: 'Format Converter', href: '/tools/convert', icon: ArrowLeftRight },
    { label: 'Structure Analyzer', href: '/tools/analysis', icon: FileSearch },
    { label: 'Settings', href: '/settings', icon: Settings },
  ]

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()
      router.push('/login')
      router.refresh()
    } catch (e) {
      console.error('Logout error:', e)
      router.push('/login')
    }
  }

  const isActive = (href: string) => {
    if (href === '/dashboard' && (pathname === '/dashboard' || pathname === '/vault')) return true
    if (href === '/tools/compress' && (pathname.startsWith('/tools/compress') || pathname === '/tools/compressor')) return true
    if (href === '/tools/merge' && (pathname.startsWith('/tools/merge') || pathname === '/tools/pdf-merger')) return true
    if (href === '/tools/convert' && (pathname.startsWith('/tools/convert') || pathname === '/tools/pdf-converter' || pathname === '/tools/image-converter' || pathname === '/tools/converter')) return true
    if (href === '/tools/analysis' && (pathname.startsWith('/tools/analysis') || pathname === '/tools/resume-analyzer' || pathname === '/tools/pdf-summarizer')) return true
    if (href === '/settings' && (pathname === '/settings' || pathname === '/account')) return true
    return pathname === href
  }

  return (
    <aside className="fixed left-0 top-0 h-screen w-[240px] bg-[#0C0A09] border-r border-[#292524] flex flex-col py-6 px-3 z-40 select-none">
      {/* Header Wordmark */}
      <div className="px-4 mb-6">
        <Link href="/" className="inline-block">
          <span className="text-2xl font-semibold tracking-[-0.02em] text-[#FAFAF9] block">
            DocEasy
          </span>
        </Link>
        <span className="text-[12px] text-[#78716C] block mt-1">
          Editorial toolkit
        </span>
      </div>

      {/* Action Button */}
      <div className="px-3 mb-6">
        <Link 
          href="/tools" 
          className="w-full h-10 bg-[#FAFAF9] text-[#0C0A09] text-[13px] font-medium rounded-[6px] hover:bg-[#D6D3D1] transition-colors duration-150 flex items-center justify-center text-center"
        >
          All tools
        </Link>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 flex flex-col space-y-1">
        {navItems.map((item) => {
          const active = isActive(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 text-[13px] transition-colors duration-150 py-2.5 rounded-[4px] ${
                active
                  ? 'border-l-2 border-[#D6D3D1] pl-3.5 bg-[#1C1917] text-[#FAFAF9]'
                  : 'pl-[18px] text-[#A8A29E] hover:text-[#FAFAF9] hover:bg-[#141110]'
              }`}
            >
              <item.icon className={`w-4 h-4 shrink-0 stroke-[1.5] ${active ? 'text-[#FAFAF9]' : 'text-[#78716C]'}`} />
              <span className="truncate">{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Footer Navigation */}
      <div className="mt-auto border-t border-[#292524] pt-4 space-y-1">
        <Link
          href="/contact"
          className="flex items-center gap-3 text-[13px] text-[#A8A29E] hover:text-[#FAFAF9] hover:bg-[#141110] pl-[18px] py-2 rounded-[4px] transition-colors duration-150"
        >
          <HelpCircle className="w-4 h-4 shrink-0 stroke-[1.5] text-[#78716C]" />
          <span>Help</span>
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 text-[13px] text-[#A8A29E] hover:text-[#FAFAF9] hover:bg-[#141110] pl-[18px] py-2 rounded-[4px] transition-colors duration-150 text-left cursor-pointer"
        >
          <LogOut className="w-4 h-4 shrink-0 stroke-[1.5] text-[#78716C]" />
          <span>Log out</span>
        </button>
      </div>
    </aside>
  )
}
