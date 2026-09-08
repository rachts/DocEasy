import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Resume Analyzer — Private ATS Keyword Checker',
  description: 'Analyze resumes against job descriptions for ATS keywords and formatting tips completely on your device.',
}

export default function AnalysisLayout({ children }: { children: React.ReactNode }) {
  return children
}
