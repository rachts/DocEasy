import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'PDF Merger — Combine PDFs & Images in Your Browser',
  description: 'Merge multiple PDF documents and images into a single unified PDF file without uploading to any server.',
}

export default function MergeLayout({ children }: { children: React.ReactNode }) {
  return children
}
