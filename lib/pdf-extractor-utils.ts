export interface ExtractedPDFResult {
  text: string
  pageCount: number
}

/**
 * Extracts raw text and page count directly in client memory using pdfjs-dist.
 * Zero network transmission required.
 */
export async function extractPDFDetails(file: File): Promise<ExtractedPDFResult> {
  const pdfjs = await import("pdfjs-dist")
  
  pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.mjs`

  const arrayBuffer = await file.arrayBuffer()
  const loadingTask = pdfjs.getDocument({ data: arrayBuffer })
  const pdf = await loadingTask.promise
  
  let fullText = ""
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i)
    const textContent = await page.getTextContent()
    const pageText = textContent.items
      .map((item: any) => (item && typeof item === 'object' && 'str' in item ? item.str : ''))
      .filter(Boolean)
      .join(" ")
    fullText += pageText + "\n"
  }
  
  return {
    text: fullText.trim(),
    pageCount: pdf.numPages
  }
}

/**
 * Extracts full text string directly in client memory from a PDF file.
 */
export async function extractTextFromPDF(file: File): Promise<string> {
  const { text } = await extractPDFDetails(file)
  return text
}
