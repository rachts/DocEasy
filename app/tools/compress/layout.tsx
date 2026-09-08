import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'PDF Compressor — Shrink PDFs in Your Browser',
  description: 'Reduce PDF file sizes directly in your browser using local WebAssembly compression. 100% private, zero uploads.',
  openGraph: {
    title: 'PDF Compressor — Shrink PDFs in Your Browser | DocEasy',
    description: 'Reduce PDF file sizes directly in your browser using local WebAssembly compression. 100% private, zero uploads.',
    url: '/tools/compress',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'PDF Compressor | DocEasy' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PDF Compressor — Shrink PDFs in Your Browser | DocEasy',
    description: 'Reduce PDF file sizes directly in your browser using local WebAssembly compression. 100% private, zero uploads.',
    images: ['/og-image.png'],
  },
}

export default function CompressLayout({ children }: { children: React.ReactNode }) {
  return children
}
