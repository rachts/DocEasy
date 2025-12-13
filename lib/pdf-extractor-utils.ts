import { PDFDocument } from "pdf-lib"

export interface ExtractedData {
  text?: string
  images?: string[]
  pageCount: number
}

export async function extractTextFromPDF(file: File): Promise<string> {
  // Use pdf-parse for text extraction
  const pdfParse = await import("pdf-parse/lib/pdf-parse")
  const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)

  const data = await pdfParse.default(buffer)
  return data.text
}

export async function extractImagesFromPDF(file: File): Promise<string[]> {
  const arrayBuffer = await file.arrayBuffer()
  const pdfDoc = await PDFDocument.load(arrayBuffer)

  const images: string[] = []
  const pages = pdfDoc.getPages()

  for (let i = 0; i < pages.length; i++) {
    const page = pages[i]

    try {
      // Get page content
      const { width, height } = page.getSize()

      // Note: pdf-lib doesn't directly support image extraction
      // This is a simplified version - in production, you'd use pdf.js or similar
      // For now, we'll create a placeholder
      images.push(
        `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==`,
      )
    } catch (error) {
      console.error(`Failed to extract image from page ${i + 1}:`, error)
    }
  }

  return images
}

export async function extractDataFromPDF(
  file: File,
  extractText: boolean,
  extractImages: boolean,
): Promise<ExtractedData> {
  const arrayBuffer = await file.arrayBuffer()
  const pdfDoc = await PDFDocument.load(arrayBuffer)
  const pageCount = pdfDoc.getPageCount()

  const result: ExtractedData = {
    pageCount,
  }

  if (extractText) {
    try {
      result.text = await extractTextFromPDF(file)
    } catch (error) {
      console.error("Text extraction failed:", error)
      result.text = "Failed to extract text from PDF"
    }
  }

  if (extractImages) {
    try {
      result.images = await extractImagesFromPDF(file)
    } catch (error) {
      console.error("Image extraction failed:", error)
      result.images = []
    }
  }

  return result
}
