import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Resume Analyzer — Private ATS Keyword Checker',
  description: 'Analyze resumes against job descriptions for ATS keywords and formatting tips completely on your device.',
  openGraph: {
    title: 'Resume Analyzer — Private ATS Keyword Checker | DocEasy',
    description: 'Analyze resumes against job descriptions for ATS keywords and formatting tips completely on your device.',
    url: '/tools/analysis',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Resume Analyzer | DocEasy' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Resume Analyzer — Private ATS Keyword Checker | DocEasy',
    description: 'Analyze resumes against job descriptions for ATS keywords and formatting tips completely on your device.',
    images: ['/og-image.png'],
  },
}

export default function AnalysisLayout({ children }: { children: React.ReactNode }) {
  return children
}
