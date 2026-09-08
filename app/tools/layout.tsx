import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    default: 'All Browser Tools — Private Document & Image Utilities',
    template: '%s | DocEasy',
  },
  description: 'Explore our complete suite of privacy-first document and image utilities. Client-first tools with local browser execution and optional server acceleration.',
  openGraph: {
    title: 'All Browser Tools — Private Document & Image Utilities | DocEasy',
    description: 'Explore our complete suite of privacy-first document and image utilities. Client-first tools with local browser execution and optional server acceleration.',
    url: '/tools',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'DocEasy Tools' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'All Browser Tools — Private Document & Image Utilities | DocEasy',
    description: 'Explore our complete suite of privacy-first document and image utilities. Client-first tools with local browser execution and optional server acceleration.',
    images: ['/og-image.png'],
  },
}

export default function ToolsLayout({ children }: { children: React.ReactNode }) {
  return children
}
