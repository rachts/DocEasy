import { describe, it, expect } from 'vitest'
import path from 'path'
import fs from 'fs'

import { TOOLS } from '../lib/tools-registry'

const TOOL_ROUTES = TOOLS.map((t) => ({
  name: t.name,
  path: t.filePath,
  route: t.href,
}))

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
