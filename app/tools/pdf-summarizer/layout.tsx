import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'PDF Summarizer — Summarize Documents Privately',
  description: 'Extract key takeaways, executive summaries, and action points from PDF documents using client-side text analysis.',
  openGraph: {
    title: 'PDF Summarizer — Summarize Documents Privately | DocEasy',
    description: 'Extract key takeaways, executive summaries, and action points from PDF documents using client-side text analysis.',
    url: '/tools/pdf-summarizer',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'PDF Summarizer | DocEasy' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PDF Summarizer — Summarize Documents Privately | DocEasy',
    description: 'Extract key takeaways, executive summaries, and action points from PDF documents using client-side text analysis.',
    images: ['/og-image.png'],
  },
}

export default function PdfSummarizerLayout({ children }: { children: React.ReactNode }) {
  return children
}
