import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Format Converter — Convert PDF, Word, MD & Images',
  description: 'Convert seamlessly between PDF, DOCX, Markdown, Text, and Images locally in your browser with zero server uploads.',
}

export default function ConvertLayout({ children }: { children: React.ReactNode }) {
  return children
}
