import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Navbar } from "@/components/navbar"
import { AuthProvider } from "@/lib/auth-context"
import { ThemeProvider } from "@/lib/theme-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: {
    default: "DocEasy | Fast & Private Document Tools",
    template: "%s | DocEasy"
  },
  description: "The ultimate privacy-first document toolkit. Compress, convert, merge, and edit PDFs and images with lightning speed. No login, no watermarks.",
  keywords: ["PDF compressor", "image converter", "merge PDF", "free document tools", "private document processing", "passport photo generator"],
  authors: [{ name: "Rachit, Akhtar, Pranav" }],
  creator: "Rachit, Akhtar, Pranav",
  publisher: "DocEasy",
  robots: "index, follow",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-background text-foreground`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <AuthProvider>
            <Navbar />
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
