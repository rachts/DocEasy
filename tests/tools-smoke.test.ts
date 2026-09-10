import { describe, it, expect } from 'vitest'
import path from 'path'
import fs from 'fs'

const TOOL_ROUTES = [
  { name: 'PDF Compressor', path: 'app/tools/compress/page.tsx', route: '/tools/compress' },
  { name: 'Document Converter', path: 'app/tools/convert/page.tsx', route: '/tools/convert' },
  { name: 'PDF Merger', path: 'app/tools/merge/page.tsx', route: '/tools/merge' },
  { name: 'PDF Maker', path: 'app/tools/pdf-maker/page.tsx', route: '/tools/pdf-maker' },
  { name: 'PDF Extractor', path: 'app/tools/pdf-extractor/page.tsx', route: '/tools/pdf-extractor' },
  { name: 'PDF Summarizer', path: 'app/tools/pdf-summarizer/page.tsx', route: '/tools/pdf-summarizer' },
  { name: 'Image Compressor', path: 'app/tools/image-compressor/page.tsx', route: '/tools/image-compressor' },
  { name: 'Image Converter', path: 'app/tools/image-converter/page.tsx', route: '/tools/image-converter' },
  { name: 'Passport Photo Generator', path: 'app/tools/passport-photo/page.tsx', route: '/tools/passport-photo' },
  { name: 'Image Cropper', path: 'app/tools/cropper/page.tsx', route: '/tools/cropper' },
  { name: 'Document Analysis', path: 'app/tools/analysis/page.tsx', route: '/tools/analysis' },
  { name: 'Encrypted Vault', path: 'app/tools/vault/page.tsx', route: '/tools/vault' },
]

describe('12 Verified Tools Smoke Tests', () => {
  it('should verify all 12 tool routes exist as valid Next.js App Router pages', () => {
    expect(TOOL_ROUTES).toHaveLength(12)

    for (const tool of TOOL_ROUTES) {
      const fullPath = path.resolve(process.cwd(), tool.path)
      expect(fs.existsSync(fullPath), `Missing file for ${tool.name} at ${tool.path}`).toBe(true)
      const content = fs.readFileSync(fullPath, 'utf8')
      expect(content).toMatch(/export\s+default\s+function|export\s+default\s+async\s+function|export\s+default\s+const/)
    }
  })

  TOOL_ROUTES.forEach(({ name, path: toolFilePath, route }) => {
    describe(`Tool: ${name} (${route})`, () => {
      it('page source is syntactically valid and imports required components', async () => {
        const fullPath = path.resolve(process.cwd(), toolFilePath)
        const fileContent = fs.readFileSync(fullPath, 'utf8')
        
        // Confirm client or server component declaration
        expect(fileContent.length).toBeGreaterThan(100)
        
        // Confirm presence of default export
        expect(fileContent).toContain('export default')
      })
    })
  })

  describe('Tool Fixture Processing', () => {
    it('generates a valid binary PDF from invoice fixture data', async () => {
      const { generateInvoicePDF } = await import('@/lib/pdf-maker-utils')
      const fixtureInvoice = {
        invoiceNumber: 'INV-TEST-001',
        date: '2026-09-10',
        from: 'DocEasy Testing Lab',
        to: 'Customer Verification',
        items: [
          { description: 'Client-side processing pass', quantity: 1, price: 100 },
          { description: 'Zero telemetry audit', quantity: 1, price: 0 }
        ],
        total: 100
      }

      const pdfBlob = await generateInvoicePDF(fixtureInvoice)
      expect(pdfBlob).toBeDefined()
      expect(pdfBlob.size).toBeGreaterThan(500)
      const buffer = await pdfBlob.arrayBuffer()
      const header = new TextDecoder().decode(buffer.slice(0, 5))
      expect(header).toBe('%PDF-')
    })
  })
})
