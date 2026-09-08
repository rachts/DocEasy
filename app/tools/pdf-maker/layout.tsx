import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'PDF Maker — Create Documents from Text & Images',
  description: 'Generate professional PDFs from scratch with rich text and embedded images directly in browser memory.',
  openGraph: {
    title: 'PDF Maker — Create Documents from Text & Images | DocEasy',
    description: 'Generate professional PDFs from scratch with rich text and embedded images directly in browser memory.',
    url: '/tools/pdf-maker',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'PDF Maker | DocEasy' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PDF Maker — Create Documents from Text & Images | DocEasy',
    description: 'Generate professional PDFs from scratch with rich text and embedded images directly in browser memory.',
    images: ['/og-image.png'],
  },
}

export default function PdfMakerLayout({ children }: { children: React.ReactNode }) {
  return children
}
