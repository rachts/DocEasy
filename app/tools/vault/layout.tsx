import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Encrypted Vault — Client-Side AES-GCM Storage',
  description: 'Store and protect documents in browser session memory with 256-bit Web Crypto AES-GCM encryption and 2-hour auto-purge.',
  openGraph: {
    title: 'Encrypted Vault — Client-Side AES-GCM Storage | DocEasy',
    description: 'Store and protect documents in browser session memory with 256-bit Web Crypto AES-GCM encryption and 2-hour auto-purge.',
    url: '/tools/vault',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Encrypted Vault | DocEasy' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Encrypted Vault — Client-Side AES-GCM Storage | DocEasy',
    description: 'Store and protect documents in browser session memory with 256-bit Web Crypto AES-GCM encryption and 2-hour auto-purge.',
    images: ['/og-image.png'],
  },
}

export default function VaultLayout({ children }: { children: React.ReactNode }) {
  return children
}
