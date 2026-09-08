import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Format Converter — Convert PDF, Word, MD & Images',
  description: 'Convert between PDF, DOCX, Markdown, Text, and Images locally in your browser.',
  openGraph: {
    title: 'Format Converter — Convert PDF, Word, MD & Images | DocEasy',
    description: 'Convert between PDF, DOCX, Markdown, Text, and Images locally in your browser.',
    url: '/tools/convert',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Format Converter | DocEasy' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Format Converter — Convert PDF, Word, MD & Images | DocEasy',
    description: 'Convert between PDF, DOCX, Markdown, Text, and Images locally in your browser.',
    images: ['/og-image.png'],
  },
}

export default function ConvertLayout({ children }: { children: React.ReactNode }) {
  return children
}
