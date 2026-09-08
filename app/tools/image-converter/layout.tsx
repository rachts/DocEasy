import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Image Converter — Convert PNG, JPG, WebP & AVIF',
  description: 'Convert images between PNG, JPG, WebP, and AVIF formats with custom quality settings directly in your browser.',
  openGraph: {
    title: 'Image Converter — Convert PNG, JPG, WebP & AVIF | DocEasy',
    description: 'Convert images between PNG, JPG, WebP, and AVIF formats with custom quality settings directly in your browser.',
    url: '/tools/image-converter',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Image Converter | DocEasy' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Image Converter — Convert PNG, JPG, WebP & AVIF | DocEasy',
    description: 'Convert images between PNG, JPG, WebP, and AVIF formats with custom quality settings directly in your browser.',
    images: ['/og-image.png'],
  },
}

export default function ImageConverterLayout({ children }: { children: React.ReactNode }) {
  return children
}
