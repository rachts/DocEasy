import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'PDF Extractor — Extract Text & Pages Privately',
  description: 'Extract text, split pages, and grab content from PDF files locally using browser-based WebAssembly.',
}

export default function PdfExtractorLayout({ children }: { children: React.ReactNode }) {
  return children
}
