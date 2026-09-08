import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Passport Photo Editor — Standardized ID Photos',
  description: 'Format, crop, and generate official passport and visa size photos with standard dimensions and DPI client-side.',
}

export default function PassportPhotoLayout({ children }: { children: React.ReactNode }) {
  return children
}
