'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { Command } from 'cmdk'
import { 
  Settings, 
  Search, 
  X,
  ShieldCheck,
  Activity,
  FileCheck
} from 'lucide-react'
import { PDF_TOOLS, IMAGE_TOOLS, INTELLIGENCE_TOOLS } from '@/lib/tools-registry'

export function CommandMenu() {
  const [open, setOpen] = React.useState(false)
  const router = useRouter()

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])

  const runCommand = React.useCallback((command: () => unknown) => {
    setOpen(false)
    command()
  }, [])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in-0 duration-150 font-sans">
      <div className="fixed inset-0" onClick={() => setOpen(false)} />
      <Command 
        className="w-full max-w-xl bg-[#1C1917] text-[#FAFAF9] rounded-[8px] border border-[#292524] overflow-hidden relative z-50 flex flex-col font-sans animate-in zoom-in-95 duration-150 shadow-none"
        onKeyDown={(e) => {
          if (e.key === 'Escape') {
            setOpen(false)
          }
        }}
      >
        <div className="flex items-center border-b border-[#292524] px-4 bg-[#141110]">
          <Search className="w-4 h-4 text-[#57534E] mr-3 shrink-0" />
          <Command.Input 
            autoFocus 
            placeholder="Type a command or search tools..." 
            className="flex h-12 w-full bg-transparent text-[14px] outline-none placeholder:text-[#57534E] placeholder:text-[13px] border-0 text-[#FAFAF9]" 
          />
          <button 
            onClick={() => setOpen(false)} 
            className="p-1 rounded text-[#57534E] hover:text-[#FAFAF9] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <Command.List className="max-h-[380px] overflow-y-auto p-2">
          <Command.Empty className="py-8 text-center text-[13px] text-[#57534E]">
            No matching tools found.
          </Command.Empty>
          
          <Command.Group heading="PDF tools" className="text-[12px] font-medium text-[#78716C] px-2 py-1.5">
            {PDF_TOOLS.map((tool) => {
              const Icon = tool.icon
              return (
                <Command.Item 
                  key={tool.id}
                  onSelect={() => runCommand(() => router.push(tool.href))}
                  className="flex items-center gap-3 rounded-[4px] px-3 py-2 text-[13.5px] text-[#FAFAF9] cursor-pointer hover:bg-[#141110] transition-colors"
                >
                  <Icon className="w-4 h-4 text-[#A8A29E]" />
                  <span>{tool.name}</span>
                </Command.Item>
              )
            })}
          </Command.Group>

          <Command.Separator className="h-px bg-[#292524] my-2" />

          <Command.Group heading="Image tools" className="text-[12px] font-medium text-[#78716C] px-2 py-1.5">
            {IMAGE_TOOLS.map((tool) => {
              const Icon = tool.icon
              return (
                <Command.Item 
                  key={tool.id}
                  onSelect={() => runCommand(() => router.push(tool.href))}
                  className="flex items-center gap-3 rounded-[4px] px-3 py-2 text-[13.5px] text-[#FAFAF9] cursor-pointer hover:bg-[#141110] transition-colors"
                >
                  <Icon className="w-4 h-4 text-[#A8A29E]" />
                  <span>{tool.name}</span>
                </Command.Item>
              )
            })}
          </Command.Group>

          <Command.Separator className="h-px bg-[#292524] my-2" />

          <Command.Group heading="Analysis & vault" className="text-[12px] font-medium text-[#78716C] px-2 py-1.5">
            {INTELLIGENCE_TOOLS.map((tool) => {
              const Icon = tool.icon
              return (
                <Command.Item 
                  key={tool.id}
                  onSelect={() => runCommand(() => router.push(tool.href))}
                  className="flex items-center gap-3 rounded-[4px] px-3 py-2 text-[13.5px] text-[#FAFAF9] cursor-pointer hover:bg-[#141110] transition-colors"
                >
                  <Icon className="w-4 h-4 text-[#A8A29E]" />
                  <span>{tool.name}</span>
                </Command.Item>
              )
            })}
          </Command.Group>

          <Command.Separator className="h-px bg-[#292524] my-2" />

          <Command.Group heading="Navigation" className="text-[12px] font-medium text-[#78716C] px-2 py-1.5">
            <Command.Item 
              onSelect={() => runCommand(() => router.push('/security'))}
              className="flex items-center gap-3 rounded-[4px] px-3 py-2 text-[13.5px] text-[#FAFAF9] cursor-pointer hover:bg-[#141110] transition-colors"
            >
              <ShieldCheck className="w-4 h-4 text-[#A8A29E]" />
              <span>Security Architecture Overview</span>
            </Command.Item>
            <Command.Item 
              onSelect={() => runCommand(() => router.push('/status'))}
              className="flex items-center gap-3 rounded-[4px] px-3 py-2 text-[13.5px] text-[#FAFAF9] cursor-pointer hover:bg-[#141110] transition-colors"
            >
              <Activity className="w-4 h-4 text-[#A8A29E]" />
              <span>System Operational Status</span>
            </Command.Item>
            <Command.Item 
              onSelect={() => runCommand(() => router.push('/privacy'))}
              className="flex items-center gap-3 rounded-[4px] px-3 py-2 text-[13.5px] text-[#FAFAF9] cursor-pointer hover:bg-[#141110] transition-colors"
            >
              <FileCheck className="w-4 h-4 text-[#A8A29E]" />
              <span>Privacy Policy</span>
            </Command.Item>
            <Command.Item 
              onSelect={() => runCommand(() => router.push('/settings'))}
              className="flex items-center gap-3 rounded-[4px] px-3 py-2 text-[13.5px] text-[#FAFAF9] cursor-pointer hover:bg-[#141110] transition-colors"
            >
              <Settings className="w-4 h-4 text-[#A8A29E]" />
              <span>System Settings</span>
            </Command.Item>
          </Command.Group>
        </Command.List>
      </Command>
    </div>
  )
}
