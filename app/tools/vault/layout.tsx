import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Encrypted Vault — Client-Side AES-GCM Storage',
  description: 'Store and protect documents in browser session memory with 256-bit Web Crypto AES-GCM encryption and 2-hour auto-purge.',
}

export default function VaultLayout({ children }: { children: React.ReactNode }) {
  return children
}
