import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Image Cropper — Precise Crop & Aspect Ratios',
  description: 'Crop, frame, and rotate images with custom aspect ratios directly in browser memory. Zero uploads.',
}

export default function CropperLayout({ children }: { children: React.ReactNode }) {
  return children
}
