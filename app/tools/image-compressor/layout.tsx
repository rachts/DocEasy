import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Image Compressor — Shrink PNG, JPG & WebP Files',
  description: 'Shrink image file sizes without compromising visual clarity. Fast, client-side canvas-powered image optimization.',
  openGraph: {
    title: 'Image Compressor — Shrink PNG, JPG & WebP Files | DocEasy',
    description: 'Shrink image file sizes without compromising visual clarity. Fast, client-side canvas-powered image optimization.',
    url: '/tools/image-compressor',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Image Compressor | DocEasy' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Image Compressor — Shrink PNG, JPG & WebP Files | DocEasy',
    description: 'Shrink image file sizes without compromising visual clarity. Fast, client-side canvas-powered image optimization.',
    images: ['/og-image.png'],
  },
}

export default function ImageCompressorLayout({ children }: { children: React.ReactNode }) {
  return children
}
