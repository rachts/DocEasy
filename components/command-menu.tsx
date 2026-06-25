"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Command } from "cmdk"
import { FileText, Image as ImageIcon, Settings, LayoutDashboard, Search, X, FileMinus, FilePlus2, Scissors } from "lucide-react"

export function CommandMenu() {
  const [open, setOpen] = React.useState(false)
  const router = useRouter()

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  const runCommand = React.useCallback((command: () => unknown) => {
    setOpen(false)
    command()
  }, [])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-start justify-center p-4 pt-[15vh] sm:p-0 sm:items-center sm:pt-0">
      <div className="fixed inset-0" onClick={() => setOpen(false)} />
      <Command 
        className="w-full max-w-lg bg-card text-card-foreground rounded-2xl shadow-2xl border border-border/60 overflow-hidden relative z-50 flex flex-col"
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            setOpen(false)
          }
        }}
      >
        <div className="flex items-center border-b border-border/50 px-3">
          <Search className="w-5 h-5 text-muted-foreground mr-2 shrink-0" />
          <Command.Input 
            autoFocus 
            placeholder="Search tools or jump to..." 
            className="flex h-14 w-full bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 border-0 focus:ring-0" 
          />
          <button onClick={() => setOpen(false)} className="p-1.5 rounded-md text-muted-foreground hover:bg-secondary">
            <X className="w-4 h-4" />
          </button>
        </div>
        <Command.List className="max-h-[350px] overflow-y-auto overflow-x-hidden p-2">
          <Command.Empty className="py-6 text-center text-sm text-muted-foreground">No results found.</Command.Empty>
          
          <Command.Group heading="Tools" className="text-xs font-medium text-muted-foreground px-2 py-1.5 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:mb-1">
            <Command.Item 
              onSelect={() => runCommand(() => router.push("/tools/compressor"))}
              className="relative flex cursor-default select-none items-center rounded-xl px-2 py-2.5 text-sm outline-none aria-selected:bg-secondary aria-selected:text-secondary-foreground"
            >
              <FileMinus className="mr-3 h-4 w-4" />
              <span>Compress PDF</span>
            </Command.Item>
            <Command.Item 
              onSelect={() => runCommand(() => router.push("/tools/pdf-merger"))}
              className="relative flex cursor-default select-none items-center rounded-xl px-2 py-2.5 text-sm outline-none aria-selected:bg-secondary aria-selected:text-secondary-foreground"
            >
              <FilePlus2 className="mr-3 h-4 w-4" />
              <span>Merge PDF</span>
            </Command.Item>
            <Command.Item 
              onSelect={() => runCommand(() => router.push("/tools/pdf-converter"))}
              className="relative flex cursor-default select-none items-center rounded-xl px-2 py-2.5 text-sm outline-none aria-selected:bg-secondary aria-selected:text-secondary-foreground"
            >
              <FileText className="mr-3 h-4 w-4" />
              <span>PDF Converter</span>
            </Command.Item>
            <Command.Item 
              onSelect={() => runCommand(() => router.push("/tools/image-compressor"))}
              className="relative flex cursor-default select-none items-center rounded-xl px-2 py-2.5 text-sm outline-none aria-selected:bg-secondary aria-selected:text-secondary-foreground"
            >
              <ImageIcon className="mr-3 h-4 w-4" />
              <span>Image Compressor</span>
            </Command.Item>
            <Command.Item 
              onSelect={() => runCommand(() => router.push("/tools/passport-photo"))}
              className="relative flex cursor-default select-none items-center rounded-xl px-2 py-2.5 text-sm outline-none aria-selected:bg-secondary aria-selected:text-secondary-foreground"
            >
              <Scissors className="mr-3 h-4 w-4" />
              <span>Passport Photo Maker</span>
            </Command.Item>
          </Command.Group>

          <Command.Separator className="-mx-2 h-px bg-border/50 my-1" />
          
          <Command.Group heading="Navigation" className="text-xs font-medium text-muted-foreground px-2 py-1.5 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:mb-1">
            <Command.Item 
              onSelect={() => runCommand(() => router.push("/dashboard"))}
              className="relative flex cursor-default select-none items-center rounded-xl px-2 py-2.5 text-sm outline-none aria-selected:bg-secondary aria-selected:text-secondary-foreground"
            >
              <LayoutDashboard className="mr-3 h-4 w-4" />
              <span>Dashboard</span>
            </Command.Item>
            <Command.Item 
              onSelect={() => runCommand(() => router.push("/dashboard/settings"))}
              className="relative flex cursor-default select-none items-center rounded-xl px-2 py-2.5 text-sm outline-none aria-selected:bg-secondary aria-selected:text-secondary-foreground"
            >
              <Settings className="mr-3 h-4 w-4" />
              <span>Settings</span>
            </Command.Item>
          </Command.Group>
        </Command.List>
      </Command>
    </div>
  )
}
