import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Passport Photo Editor — Standardized ID Photos',
  description: 'Format, crop, and generate official passport and visa size photos with standard dimensions and DPI client-side.',
  openGraph: {
    title: 'Passport Photo Editor — Standardized ID Photos | DocEasy',
    description: 'Format, crop, and generate official passport and visa size photos with standard dimensions and DPI client-side.',
    url: '/tools/passport-photo',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Passport Photo Editor | DocEasy' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Passport Photo Editor — Standardized ID Photos | DocEasy',
    description: 'Format, crop, and generate official passport and visa size photos with standard dimensions and DPI client-side.',
    images: ['/og-image.png'],
  },
}

export default function PassportPhotoLayout({ children }: { children: React.ReactNode }) {
  return children
}
