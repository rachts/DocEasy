import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'PDF Extractor — Extract Text & Pages Privately',
  description: 'Extract text, split pages, and grab content from PDF files locally using browser-based WebAssembly.',
  openGraph: {
    title: 'PDF Extractor — Extract Text & Pages Privately | DocEasy',
    description: 'Extract text, split pages, and grab content from PDF files locally using browser-based WebAssembly.',
    url: '/tools/pdf-extractor',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'PDF Extractor | DocEasy' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PDF Extractor — Extract Text & Pages Privately | DocEasy',
    description: 'Extract text, split pages, and grab content from PDF files locally using browser-based WebAssembly.',
    images: ['/og-image.png'],
  },
}

export default function PdfExtractorLayout({ children }: { children: React.ReactNode }) {
  return children
}
