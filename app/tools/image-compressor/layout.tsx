import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Image Compressor — Shrink PNG, JPG & WebP Files',
  description: 'Shrink image file sizes without compromising visual clarity. Fast, client-side canvas-powered image optimization.',
}

export default function ImageCompressorLayout({ children }: { children: React.ReactNode }) {
  return children
}
