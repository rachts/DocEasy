import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Image Converter — Convert PNG, JPG, WebP & AVIF',
  description: 'Convert images between PNG, JPG, WebP, and AVIF formats with custom quality settings directly in your browser.',
}

export default function ImageConverterLayout({ children }: { children: React.ReactNode }) {
  return children
}
