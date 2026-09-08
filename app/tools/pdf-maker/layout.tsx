import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'PDF Maker — Create Documents from Text & Images',
  description: 'Generate professional PDFs from scratch with rich text and embedded images directly in browser memory.',
}

export default function PdfMakerLayout({ children }: { children: React.ReactNode }) {
  return children
}
