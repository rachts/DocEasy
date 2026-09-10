import type { LucideIcon } from 'lucide-react'
import { 
  Minimize2, 
  ArrowLeftRight, 
  Merge, 
  Award, 
  FileSearch, 
  Sparkles, 
  User, 
  Crop, 
  FileText, 
  Lock 
} from 'lucide-react'

export type ToolCategory = 'PDF' | 'IMAGE' | 'INTELLIGENCE'

export interface ToolDefinition {
  id: string
  name: string
  title: string
  href: string
  description: string
  desc: string
  category: ToolCategory
  badge: 'PDF' | 'Image' | 'Intelligence' | 'Security'
  icon: LucideIcon
  filePath: string
}

export const TOOLS: ToolDefinition[] = [
  {
    id: 'compress',
    name: 'PDF Compressor',
    title: 'PDF Compressor',
    href: '/tools/compress',
    description: 'Compress PDFs locally in your browser with adjustable quality levels.',
    desc: 'Compress documents locally with up to ~80% size reduction',
    category: 'PDF',
    badge: 'PDF',
    icon: Minimize2,
    filePath: 'app/tools/compress/page.tsx',
  },
  {
    id: 'convert',
    name: 'Format Converter',
    title: 'Format Converter',
    href: '/tools/convert',
    description: 'Convert between PDF, DOCX, Markdown, and text formats directly in your browser.',
    desc: 'Convert between PDF, DOCX, Markdown, Text, and images',
    category: 'PDF',
    badge: 'PDF',
    icon: ArrowLeftRight,
    filePath: 'app/tools/convert/page.tsx',
  },
  {
    id: 'merge',
    name: 'PDF Merger',
    title: 'PDF Merger',
    href: '/tools/merge',
    description: 'Merge multiple PDF documents and images into a single PDF file.',
    desc: 'Combine multiple PDF and image files into a single document',
    category: 'PDF',
    badge: 'PDF',
    icon: Merge,
    filePath: 'app/tools/merge/page.tsx',
  },
  {
    id: 'pdf-maker',
    name: 'PDF Maker',
    title: 'PDF Maker',
    href: '/tools/pdf-maker',
    description: 'Generate structured PDFs from templates (Invoice, Certificate, Resume, CV).',
    desc: 'Create structured invoices, certificates, and resumes',
    category: 'PDF',
    badge: 'PDF',
    icon: Award,
    filePath: 'app/tools/pdf-maker/page.tsx',
  },
  {
    id: 'pdf-extractor',
    name: 'PDF Extractor',
    title: 'PDF Extractor',
    href: '/tools/pdf-extractor',
    description: 'Extract raw text streams and document metadata from PDF files.',
    desc: 'Extract specific page ranges into a separate document',
    category: 'PDF',
    badge: 'PDF',
    icon: FileSearch,
    filePath: 'app/tools/pdf-extractor/page.tsx',
  },
  {
    id: 'pdf-summarizer',
    name: 'PDF Summarizer',
    title: 'PDF Summarizer',
    href: '/tools/pdf-summarizer',
    description: 'Extract key points and generate document summaries using client-side sentence ranking.',
    desc: 'Extract key paragraphs, metrics, and takeaways with TF scoring',
    category: 'INTELLIGENCE',
    badge: 'Intelligence',
    icon: Sparkles,
    filePath: 'app/tools/pdf-summarizer/page.tsx',
  },
  {
    id: 'image-compressor',
    name: 'Image Compressor',
    title: 'Image Compressor',
    href: '/tools/image-compressor',
    description: 'Compress PNG, JPG, and WebP images with custom quality controls.',
    desc: 'Shrink PNG, JPG, and WebP assets with instant canvas preview',
    category: 'IMAGE',
    badge: 'Image',
    icon: Minimize2,
    filePath: 'app/tools/image-compressor/page.tsx',
  },
  {
    id: 'image-converter',
    name: 'Image Converter',
    title: 'Image Converter',
    href: '/tools/image-converter',
    description: 'Convert images between PNG, JPG, WebP, and AVIF formats via HTML5 Canvas.',
    desc: 'Transcode images between PNG, JPG, WebP, AVIF, and BMP',
    category: 'IMAGE',
    badge: 'Image',
    icon: ArrowLeftRight,
    filePath: 'app/tools/image-converter/page.tsx',
  },
  {
    id: 'passport-photo',
    name: 'Passport Photo Editor',
    title: 'Passport Photo Editor',
    href: '/tools/passport-photo',
    description: 'Format photos to standard passport dimensions with background and contrast adjustments.',
    desc: 'Standardize ID and passport dimensions with compliance guides',
    category: 'IMAGE',
    badge: 'Image',
    icon: User,
    filePath: 'app/tools/passport-photo/page.tsx',
  },
  {
    id: 'cropper',
    name: 'Image Cropper',
    title: 'Image Cropper',
    href: '/tools/cropper',
    description: 'Crop and rotate images with custom aspect ratio presets and instant preview.',
    desc: 'Crop, rotate, and aspect-ratio align images locally',
    category: 'IMAGE',
    badge: 'Image',
    icon: Crop,
    filePath: 'app/tools/cropper/page.tsx',
  },
  {
    id: 'analysis',
    name: 'Resume Analyzer',
    title: 'Resume Analyzer',
    href: '/tools/analysis',
    description: 'Analyze resumes for ATS formatting compliance, section completeness, and keyword density.',
    desc: 'Screen resumes for ATS formatting, keywords, and density',
    category: 'INTELLIGENCE',
    badge: 'Intelligence',
    icon: FileText,
    filePath: 'app/tools/analysis/page.tsx',
  },
  {
    id: 'vault',
    name: 'Encrypted Vault',
    title: 'Encrypted Vault',
    href: '/tools/vault',
    description: 'Client-side AES-GCM encrypted session storage with automatic 2-hour auto-purge.',
    desc: 'Client-side AES-GCM encrypted temporary storage with auto-purge',
    category: 'INTELLIGENCE',
    badge: 'Security',
    icon: Lock,
    filePath: 'app/tools/vault/page.tsx',
  },
]

export const PDF_TOOLS = TOOLS.filter((tool) => tool.category === 'PDF')
export const IMAGE_TOOLS = TOOLS.filter((tool) => tool.category === 'IMAGE')
export const INTELLIGENCE_TOOLS = TOOLS.filter((tool) => tool.category === 'INTELLIGENCE')

export function getToolByHref(href: string): ToolDefinition | undefined {
  return TOOLS.find((t) => t.href === href)
}

export function getToolById(id: string): ToolDefinition | undefined {
  return TOOLS.find((t) => t.id === id)
}
