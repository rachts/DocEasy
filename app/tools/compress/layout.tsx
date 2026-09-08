import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'PDF Compressor — Shrink PDFs in Your Browser',
  description: 'Reduce PDF file sizes directly in your browser using local WebAssembly compression. 100% private, zero uploads.',
}

export default function CompressLayout({ children }: { children: React.ReactNode }) {
  return children
}
