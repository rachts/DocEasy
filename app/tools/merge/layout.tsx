import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'PDF Merger — Combine PDFs & Images in Your Browser',
  description: 'Merge multiple PDF documents and images into a single unified PDF file without uploading to any server.',
  openGraph: {
    title: 'PDF Merger — Combine PDFs & Images in Your Browser | DocEasy',
    description: 'Merge multiple PDF documents and images into a single unified PDF file without uploading to any server.',
    url: '/tools/merge',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'PDF Merger | DocEasy' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PDF Merger — Combine PDFs & Images in Your Browser | DocEasy',
    description: 'Merge multiple PDF documents and images into a single unified PDF file without uploading to any server.',
    images: ['/og-image.png'],
  },
}

export default function MergeLayout({ children }: { children: React.ReactNode }) {
  return children
}
