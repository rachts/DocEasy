'use client'

import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useEffect, useState, useMemo } from "react"
import { createClient } from "@/utils/supabase/client"
import { logout } from "@/app/login/actions"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronDown, Search } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { CommandMenu } from "@/components/command-menu"

export function Navbar() {
  const [user, setUser] = useState<any>(null)
  const [authLoading, setAuthLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    let mounted = true

    const fetchUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (mounted) {
          setUser(user)
          setAuthLoading(false)
        }
      } catch (error) {
        if (mounted) {
          setAuthLoading(false)
        }
      }
    }

    fetchUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (mounted) {
          setUser(session?.user || null)
          setAuthLoading(false)
        }
      }
    )

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [supabase.auth])

  return (
    <nav className="border-b border-border bg-background/95 backdrop-blur sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-6">
            <Link href="/" className="font-extrabold text-2xl text-slate-800 dark:text-white hover:opacity-90 transition-opacity flex items-center gap-2.5 tracking-tight">
              <Image src="/logo.svg" alt="DocEasy Logo" width={36} height={36} className="drop-shadow-sm" />
              DocEasy
            </Link>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="hidden md:flex items-center gap-1">
                  Tools
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                <DropdownMenuLabel>PDF Tools</DropdownMenuLabel>
                <DropdownMenuItem asChild>
                  <Link href="/tools/pdf-converter" className="cursor-pointer">
                    PDF Converter
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/tools/pdf-maker" className="cursor-pointer">
                    PDF Maker
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/tools/pdf-merger" className="cursor-pointer">
                    PDF Merger
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/tools/pdf-extractor" className="cursor-pointer">
                    PDF Extractor
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/tools/compressor" className="cursor-pointer">
                    PDF Compressor
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuSeparator />
                <DropdownMenuLabel>Image Tools</DropdownMenuLabel>
                <DropdownMenuItem asChild>
                  <Link href="/tools/image-compressor" className="cursor-pointer">
                    Image Compressor
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/tools/image-converter" className="cursor-pointer">
                    Image Converter
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/tools/passport-photo" className="cursor-pointer">
                    Passport Photo Editor
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/tools/cropper" className="cursor-pointer">
                    Image Cropper
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/tools" className="cursor-pointer font-medium">
                    View All Tools
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="flex gap-3 items-center">
            <Button variant="ghost" size="icon" className="hidden sm:flex text-muted-foreground" onClick={() => document.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true }))}>
              <Search className="w-5 h-5" />
            </Button>
            <ThemeToggle />

            {!authLoading && (
              <>
                {user ? (
                  <>
                    <span className="text-sm text-muted-foreground hidden sm:inline">{user.email}</span>
                    <Link href="/dashboard">
                      <Button variant="outline" size="sm">
                        Dashboard
                      </Button>
                    </Link>
                    <form action={logout}>
                      <Button type="submit" size="sm" variant="outline">
                        Logout
                      </Button>
                    </form>
                  </>
                ) : (
                  <>
                    <Link href="/login">
                      <Button variant="outline" size="sm">
                        Login
                      </Button>
                    </Link>
                    <Link href="/signup">
                      <Button size="sm">Sign Up</Button>
                    </Link>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>
      <CommandMenu />
    </nav>
  )
}
