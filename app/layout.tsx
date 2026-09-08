import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter, JetBrains_Mono } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/lib/theme-provider"
import { Analytics } from "@vercel/analytics/next"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
})

export const viewport: Viewport = {
  themeColor: "#0C0A09",
  colorScheme: "dark",
}

export const metadata: Metadata = {
  metadataBase: new URL('https://doceasy.app'),
  title: {
    default: "DocEasy | Privacy-First Document & Image Tools",
    template: "%s | DocEasy"
  },
  description: "Fast, privacy-focused document processing with zero server retention. Compress PDFs, convert formats, and edit documents locally in your browser.",
  keywords: ["PDF compressor", "image converter", "merge PDF", "private document tools", "browser PDF processing", "privacy manifesto"],
  authors: [{ name: "DocEasy" }],
  creator: "DocEasy",
  publisher: "DocEasy",
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://doceasy.app",
    siteName: "DocEasy",
    title: "DocEasy | Privacy-First Document & Image Tools",
    description: "Fast, privacy-focused document processing with zero server retention. Compress PDFs, convert formats, and edit documents locally in your browser.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "DocEasy — 100% Client-Side WebAssembly Document Toolkit",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "DocEasy | Privacy-First Document & Image Tools",
    description: "Fast, privacy-focused document processing with zero server retention. Compress PDFs, convert formats, and edit documents locally in your browser.",
    images: ["/og-image.png"],
    creator: "@doceasy",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans bg-[#0C0A09] text-[#FAFAF9] min-h-screen antialiased selection:bg-[#292524] selection:text-[#FAFAF9]`}>
        <ThemeProvider attribute="class" defaultTheme="dark" forcedTheme="dark" disableTransitionOnChange>
          {children}
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  )
}
