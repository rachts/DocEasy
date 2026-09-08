import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Image Cropper — Precise Crop & Aspect Ratios',
  description: 'Crop, frame, and rotate images with custom aspect ratios directly in browser memory.',
  openGraph: {
    title: 'Image Cropper — Precise Crop & Aspect Ratios | DocEasy',
    description: 'Crop, frame, and rotate images with custom aspect ratios directly in browser memory.',
    url: '/tools/cropper',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Image Cropper | DocEasy' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Image Cropper — Precise Crop & Aspect Ratios | DocEasy',
    description: 'Crop, frame, and rotate images with custom aspect ratios directly in browser memory.',
    images: ['/og-image.png'],
  },
}

export default function CropperLayout({ children }: { children: React.ReactNode }) {
  return children
}
