import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'PDF Summarizer — Summarize Documents Privately',
  description: 'Extract key takeaways, executive summaries, and action points from PDF documents using client-side text analysis.',
}

export default function PdfSummarizerLayout({ children }: { children: React.ReactNode }) {
  return children
}
