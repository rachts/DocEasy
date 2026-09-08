import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'PDF Compressor — Shrink PDFs in Your Browser',
  description: 'Reduce PDF file sizes directly in your browser with client-side compression and optional server-accelerated processing.',
  openGraph: {
    title: 'PDF Compressor — Shrink PDFs in Your Browser | DocEasy',
    description: 'Reduce PDF file sizes directly in your browser with client-side compression and optional server-accelerated processing.',
    url: '/tools/compress',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'PDF Compressor | DocEasy' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PDF Compressor — Shrink PDFs in Your Browser | DocEasy',
    description: 'Reduce PDF file sizes directly in your browser with client-side compression and optional server-accelerated processing.',
    images: ['/og-image.png'],
  },
}

export default function CompressLayout({ children }: { children: React.ReactNode }) {
  return children
}
