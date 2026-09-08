import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    default: 'All Browser Tools — Private Document & Image Utilities',
    template: '%s | DocEasy',
  },
  description: 'Explore our complete suite of client-side document and image utilities. Every tool runs 100% in your browser with zero server uploads.',
  openGraph: {
    title: 'All Browser Tools — Private Document & Image Utilities | DocEasy',
    description: 'Explore our complete suite of client-side document and image utilities. Every tool runs 100% in your browser with zero server uploads.',
    url: '/tools',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'DocEasy Tools' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'All Browser Tools — Private Document & Image Utilities | DocEasy',
    description: 'Explore our complete suite of client-side document and image utilities. Every tool runs 100% in your browser with zero server uploads.',
    images: ['/og-image.png'],
  },
}

export default function ToolsLayout({ children }: { children: React.ReactNode }) {
  return children
}
