import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    default: 'All Browser Tools — Private Document & Image Utilities',
    template: '%s | DocEasy',
  },
  description: 'Explore our complete suite of client-side document and image utilities. Every tool runs 100% in your browser with zero server uploads.',
}

export default function ToolsLayout({ children }: { children: React.ReactNode }) {
  return children
}
