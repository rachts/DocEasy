import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact & Support — DocEasy',
  description: 'Get in touch with the DocEasy maintainer for inquiries, vulnerability disclosure, or feedback.',
  openGraph: {
    title: 'Contact & Support — DocEasy',
    description: 'Get in touch with the DocEasy maintainer for inquiries, vulnerability disclosure, or feedback.',
    url: '/contact',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Contact DocEasy' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact & Support — DocEasy',
    description: 'Get in touch with the DocEasy maintainer for inquiries, vulnerability disclosure, or feedback.',
    images: ['/og-image.png'],
  },
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children
}
