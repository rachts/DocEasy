'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { Command } from 'cmdk'
import { 
  Minimize2, 
  Merge, 
  ArrowLeftRight, 
  User, 
  FileSearch, 
  LayoutDashboard, 
  Settings, 
  Search, 
  X,
  Award,
  Crop,
  FileText,
  Lock,
  Sparkles,
  ShieldCheck,
  Activity,
  FileCheck
} from 'lucide-react'

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
    <div className="fixed inset-0 z-50 bg-[#0C0A09]/80 flex items-start justify-center p-4 pt-[12vh] animate-in fade-in-0 duration-150">
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
            placeholder="TYPE COMMAND OR JUMP TO PROTOCOL..." 
            className="flex h-12 w-full bg-transparent text-[14px] outline-none placeholder:text-[#57534E] placeholder:font-mono placeholder:text-[11px] placeholder:uppercase border-0 text-[#FAFAF9]" 
          />
          <button 
            onClick={() => setOpen(false)} 
            className="p-1 rounded text-[#57534E] hover:text-[#FAFAF9] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <Command.List className="max-h-[380px] overflow-y-auto p-2">
          <Command.Empty className="py-8 text-center font-mono text-[12px] uppercase text-[#57534E]">
            No matching tooling protocols found.
          </Command.Empty>
          
          <Command.Group heading="PDF UTILITIES" className="text-[11px] font-mono uppercase tracking-[0.05em] text-[#57534E] px-2 py-1.5">
            <Command.Item 
              onSelect={() => runCommand(() => router.push('/tools/compress'))}
              className="flex items-center justify-between rounded-[4px] px-3 py-2 text-[13.5px] text-[#FAFAF9] cursor-pointer hover:bg-[#141110] transition-colors"
            >
              <div className="flex items-center gap-3">
                <Minimize2 className="w-4 h-4 text-[#A8A29E]" />
                <span>Compress PDF Document</span>
              </div>
              <span className="font-mono text-[10px] uppercase text-[#57534E]">WASM</span>
            </Command.Item>
            <Command.Item 
              onSelect={() => runCommand(() => router.push('/tools/convert'))}
              className="flex items-center justify-between rounded-[4px] px-3 py-2 text-[13.5px] text-[#FAFAF9] cursor-pointer hover:bg-[#141110] transition-colors"
            >
              <div className="flex items-center gap-3">
                <ArrowLeftRight className="w-4 h-4 text-[#A8A29E]" />
                <span>Format Matrix Converter</span>
              </div>
              <span className="font-mono text-[10px] uppercase text-[#57534E]">DOCX / PDF</span>
            </Command.Item>
            <Command.Item 
              onSelect={() => runCommand(() => router.push('/tools/merge'))}
              className="flex items-center justify-between rounded-[4px] px-3 py-2 text-[13.5px] text-[#FAFAF9] cursor-pointer hover:bg-[#141110] transition-colors"
            >
              <div className="flex items-center gap-3">
                <Merge className="w-4 h-4 text-[#A8A29E]" />
                <span>PDF Document Merger</span>
              </div>
              <span className="font-mono text-[10px] uppercase text-[#57534E]">LOSSLESS</span>
            </Command.Item>
            <Command.Item 
              onSelect={() => runCommand(() => router.push('/tools/pdf-maker'))}
              className="flex items-center justify-between rounded-[4px] px-3 py-2 text-[13.5px] text-[#FAFAF9] cursor-pointer hover:bg-[#141110] transition-colors"
            >
              <div className="flex items-center gap-3">
                <Award className="w-4 h-4 text-[#A8A29E]" />
                <span>PDF Template Maker</span>
              </div>
              <span className="font-mono text-[10px] uppercase text-[#57534E]">TEMPLATES</span>
            </Command.Item>
            <Command.Item 
              onSelect={() => runCommand(() => router.push('/tools/pdf-extractor'))}
              className="flex items-center justify-between rounded-[4px] px-3 py-2 text-[13.5px] text-[#FAFAF9] cursor-pointer hover:bg-[#141110] transition-colors"
            >
              <div className="flex items-center gap-3">
                <FileSearch className="w-4 h-4 text-[#A8A29E]" />
                <span>PDF Stream & Table Extractor</span>
              </div>
              <span className="font-mono text-[10px] uppercase text-[#57534E]">PARSER</span>
            </Command.Item>
          </Command.Group>

          <Command.Separator className="h-px bg-[#292524] my-2" />

          <Command.Group heading="IMAGE & RASTER UTILITIES" className="text-[11px] font-mono uppercase tracking-[0.05em] text-[#57534E] px-2 py-1.5">
            <Command.Item 
              onSelect={() => runCommand(() => router.push('/tools/image-compressor'))}
              className="flex items-center justify-between rounded-[4px] px-3 py-2 text-[13.5px] text-[#FAFAF9] cursor-pointer hover:bg-[#141110] transition-colors"
            >
              <div className="flex items-center gap-3">
                <Minimize2 className="w-4 h-4 text-[#A8A29E]" />
                <span>Image Compressor</span>
              </div>
              <span className="font-mono text-[10px] uppercase text-[#57534E]">SIMD QUANT</span>
            </Command.Item>
            <Command.Item 
              onSelect={() => runCommand(() => router.push('/tools/image-converter'))}
              className="flex items-center justify-between rounded-[4px] px-3 py-2 text-[13.5px] text-[#FAFAF9] cursor-pointer hover:bg-[#141110] transition-colors"
            >
              <div className="flex items-center gap-3">
                <ArrowLeftRight className="w-4 h-4 text-[#A8A29E]" />
                <span>Image Format Converter</span>
              </div>
              <span className="font-mono text-[10px] uppercase text-[#57534E]">WEBP / PNG</span>
            </Command.Item>
            <Command.Item 
              onSelect={() => runCommand(() => router.push('/tools/passport-photo'))}
              className="flex items-center justify-between rounded-[4px] px-3 py-2 text-[13.5px] text-[#FAFAF9] cursor-pointer hover:bg-[#141110] transition-colors"
            >
              <div className="flex items-center gap-3">
                <User className="w-4 h-4 text-[#A8A29E]" />
                <span>Passport Photo Editor</span>
              </div>
              <span className="font-mono text-[10px] uppercase text-[#57534E]">BIOMETRIC</span>
            </Command.Item>
            <Command.Item 
              onSelect={() => runCommand(() => router.push('/tools/cropper'))}
              className="flex items-center justify-between rounded-[4px] px-3 py-2 text-[13.5px] text-[#FAFAF9] cursor-pointer hover:bg-[#141110] transition-colors"
            >
              <div className="flex items-center gap-3">
                <Crop className="w-4 h-4 text-[#A8A29E]" />
                <span>Smart Image Cropper</span>
              </div>
              <span className="font-mono text-[10px] uppercase text-[#57534E]">CANVAS</span>
            </Command.Item>
          </Command.Group>

          <Command.Separator className="h-px bg-[#292524] my-2" />

          <Command.Group heading="INTELLIGENCE & STORAGE" className="text-[11px] font-mono uppercase tracking-[0.05em] text-[#57534E] px-2 py-1.5">
            <Command.Item 
              onSelect={() => runCommand(() => router.push('/tools/analysis'))}
              className="flex items-center justify-between rounded-[4px] px-3 py-2 text-[13.5px] text-[#FAFAF9] cursor-pointer hover:bg-[#141110] transition-colors"
            >
              <div className="flex items-center gap-3">
                <FileText className="w-4 h-4 text-[#A8A29E]" />
                <span>Resume & ATS Structure Analyzer</span>
              </div>
              <span className="font-mono text-[10px] uppercase text-[#57534E]">ATS SCORE</span>
            </Command.Item>
            <Command.Item 
              onSelect={() => runCommand(() => router.push('/dashboard'))}
              className="flex items-center justify-between rounded-[4px] px-3 py-2 text-[13.5px] text-[#FAFAF9] cursor-pointer hover:bg-[#141110] transition-colors"
            >
              <div className="flex items-center gap-3">
                <Lock className="w-4 h-4 text-[#A8A29E]" />
                <span>Local Session Vault</span>
              </div>
              <span className="font-mono text-[10px] uppercase text-[#57534E]">2H TTL</span>
            </Command.Item>
          </Command.Group>

          <Command.Separator className="h-px bg-[#292524] my-2" />

          <Command.Group heading="SYSTEM ARCHITECTURE & LEGAL" className="text-[11px] font-mono uppercase tracking-[0.05em] text-[#57534E] px-2 py-1.5">
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
