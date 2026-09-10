import { PDFDocument, rgb } from "pdf-lib"

export async function convertImageToPDF(file: File): Promise<Blob> {
  const arrayBuffer = await file.arrayBuffer()
  const pdfDoc = await PDFDocument.create()

  let image
  if (file.type === "image/png") {
    image = await pdfDoc.embedPng(arrayBuffer)
  } else if (file.type === "image/jpeg" || file.type === "image/jpg") {
    image = await pdfDoc.embedJpg(arrayBuffer)
  } else {
    throw new Error("Unsupported image format. Please use PNG or JPG.")
  }

  // Create page with image dimensions
  const page = pdfDoc.addPage([image.width, image.height])

  page.drawImage(image, {
    x: 0,
    y: 0,
    width: image.width,
    height: image.height,
  })

  const pdfBytes = await pdfDoc.save()
  return new Blob([pdfBytes as any], { type: "application/pdf" })
}

export async function convertWordToPDF(file: File): Promise<Blob> {
  // Import mammoth dynamically
  const mammoth = await import("mammoth")

  const arrayBuffer = await file.arrayBuffer()
  const result = await mammoth.convertToHtml({ arrayBuffer })
  const html = result.value

  // Create PDF from HTML content
  const pdfDoc = await PDFDocument.create()
  const page = pdfDoc.addPage([595, 842]) // A4 size

  // Simple text extraction (for basic conversion)
  const textContent = html
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim()

  const fontSize = 12
  const margin = 50
  const maxWidth = 595 - 2 * margin
  const lineHeight = fontSize * 1.2

  let yPosition = 842 - margin
  const words = textContent.split(" ")
  let currentLine = ""

  for (const word of words) {
    const testLine = currentLine + word + " "
    const textWidth = testLine.length * (fontSize * 0.5) // Approximate width

    if (textWidth > maxWidth && currentLine !== "") {
      page.drawText(currentLine.trim(), {
        x: margin,
        y: yPosition,
        size: fontSize,
        color: rgb(0, 0, 0),
      })
      currentLine = word + " "
      yPosition -= lineHeight

      if (yPosition < margin) {
        // Add new page if needed
        const newPage = pdfDoc.addPage([595, 842])
        yPosition = 842 - margin
      }
    } else {
      currentLine = testLine
    }
  }

  // Draw remaining text
  if (currentLine.trim() !== "") {
    page.drawText(currentLine.trim(), {
      x: margin,
      y: yPosition,
      size: fontSize,
      color: rgb(0, 0, 0),
    })
  }

  const pdfBytes = await pdfDoc.save()
  return new Blob([pdfBytes as any], { type: "application/pdf" })
}

export async function convertExcelToPDF(file: File): Promise<Blob> {
  const ExcelJS = await import("exceljs")

  const arrayBuffer = await file.arrayBuffer()
  const workbook = new ExcelJS.Workbook()
  await workbook.xlsx.load(arrayBuffer)

  const pdfDoc = await PDFDocument.create()

  // Convert first sheet to PDF
  const worksheet = workbook.worksheets[0]
  if (!worksheet) {
    throw new Error("No worksheet found in Excel file")
  }

  const page = pdfDoc.addPage([842, 595]) // A4 landscape
  const fontSize = 10
  const margin = 30
  const cellPadding = 5

  let yPosition = 595 - margin

  // Iterate through rows
  worksheet.eachRow((row, rowNumber) => {
    let xPosition = margin

    // Iterate through cells in the row
    row.eachCell((cell, colNumber) => {
      const cellText = String(cell.value || "")
      page.drawText(cellText.substring(0, 20), {
        x: xPosition,
        y: yPosition,
        size: fontSize,
        color: rgb(0, 0, 0),
      })
      xPosition += 100 // Fixed column width
    })

    yPosition -= fontSize + cellPadding

    if (yPosition < margin) {
      return false // Stop if page is full
    }
  })

  const pdfBytes = await pdfDoc.save()
  return new Blob([pdfBytes as any], { type: "application/pdf" })
}

export async function convertMarkdownToPDF(markdownText: string): Promise<Blob> {
  const { PDFDocument, StandardFonts, rgb } = await import("pdf-lib")
  const pdfDoc = await PDFDocument.create()
  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica)
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold)
  const fontCode = await pdfDoc.embedFont(StandardFonts.Courier)

  const PAGE_WIDTH = 595.28
  const PAGE_HEIGHT = 841.89
  const MARGIN = 45
  const CONTENT_WIDTH = PAGE_WIDTH - 2 * MARGIN

  let page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT])
  let y = PAGE_HEIGHT - MARGIN

  const checkPageBreak = (neededHeight: number) => {
    if (y - neededHeight < MARGIN) {
      page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT])
      y = PAGE_HEIGHT - MARGIN
    }
  }

  const wrapText = (str: string, font: any, size: number, maxWidth: number): string[] => {
    const words = str.split(' ')
    const lines: string[] = []
    let currentLine = ''

    for (const word of words) {
      const test = currentLine ? `${currentLine} ${word}` : word
      const width = font.widthOfTextAtSize(test, size)
      if (width > maxWidth && currentLine) {
        lines.push(currentLine)
        currentLine = word
      } else {
        currentLine = test
      }
    }
    if (currentLine) lines.push(currentLine)
    return lines
  }

  const lines = markdownText.split(/\r?\n/)
  let inCodeBlock = false

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i]
    const trimmed = rawLine.trim()

    if (trimmed.startsWith('```')) {
      inCodeBlock = !inCodeBlock
      y -= 6
      continue
    }

    if (inCodeBlock) {
      checkPageBreak(16)
      page.drawRectangle({
        x: MARGIN - 4,
        y: y - 3,
        width: CONTENT_WIDTH + 8,
        height: 14,
        color: rgb(0.95, 0.95, 0.95)
      })
      page.drawText(rawLine.slice(0, 80), {
        x: MARGIN,
        y,
        size: 9,
        font: fontCode,
        color: rgb(0.2, 0.2, 0.2)
      })
      y -= 14
      continue
    }

    if (!trimmed) {
      y -= 8
      continue
    }

    if (trimmed.startsWith('# ')) {
      const text = trimmed.replace(/^#\s+/, '')
      const wrapped = wrapText(text, fontBold, 18, CONTENT_WIDTH)
      for (const line of wrapped) {
        checkPageBreak(24)
        page.drawText(line, {
          x: MARGIN,
          y,
          size: 18,
          font: fontBold,
          color: rgb(0.1, 0.1, 0.1)
        })
        y -= 24
      }
      y -= 6
    } else if (trimmed.startsWith('## ')) {
      const text = trimmed.replace(/^##\s+/, '')
      const wrapped = wrapText(text, fontBold, 14, CONTENT_WIDTH)
      for (const line of wrapped) {
        checkPageBreak(18)
        page.drawText(line, {
          x: MARGIN,
          y,
          size: 14,
          font: fontBold,
          color: rgb(0.15, 0.15, 0.15)
        })
        y -= 18
      }
      y -= 4
    } else if (trimmed.startsWith('### ')) {
      const text = trimmed.replace(/^###\s+/, '')
      const wrapped = wrapText(text, fontBold, 11, CONTENT_WIDTH)
      for (const line of wrapped) {
        checkPageBreak(15)
        page.drawText(line, {
          x: MARGIN,
          y,
          size: 11,
          font: fontBold,
          color: rgb(0.2, 0.2, 0.2)
        })
        y -= 15
      }
      y -= 3
    } else if (/^[-*]\s+/.test(trimmed) || /^\d+\.\s+/.test(trimmed)) {
      const bullet = trimmed.startsWith('-') || trimmed.startsWith('*') ? '• ' : trimmed.match(/^\d+\.\s+/)?.[0] || '• '
      const text = trimmed.replace(/^([-*]|\d+\.)\s+/, '')
      const indent = 16
      const wrapped = wrapText(text, fontRegular, 10, CONTENT_WIDTH - indent)
      for (let j = 0; j < wrapped.length; j++) {
        checkPageBreak(14)
        if (j === 0) {
          page.drawText(bullet, {
            x: MARGIN,
            y,
            size: 10,
            font: fontBold,
            color: rgb(0.3, 0.3, 0.3)
          })
        }
        page.drawText(wrapped[j], {
          x: MARGIN + indent,
          y,
          size: 10,
          font: fontRegular,
          color: rgb(0.15, 0.15, 0.15)
        })
        y -= 14
      }
      y -= 2
    } else if (trimmed.startsWith('>')) {
      const text = trimmed.replace(/^>\s*/, '')
      const indent = 12
      checkPageBreak(16)
      page.drawRectangle({
        x: MARGIN,
        y: y - 2,
        width: 2,
        height: 14,
        color: rgb(0.6, 0.6, 0.6)
      })
      const wrapped = wrapText(text, fontRegular, 9.5, CONTENT_WIDTH - indent)
      for (const line of wrapped) {
        checkPageBreak(14)
        page.drawText(line, {
          x: MARGIN + indent,
          y,
          size: 9.5,
          font: fontRegular,
          color: rgb(0.35, 0.35, 0.35)
        })
        y -= 14
      }
      y -= 4
    } else {
      const cleaned = trimmed.replace(/[*_`]/g, '')
      const wrapped = wrapText(cleaned, fontRegular, 10, CONTENT_WIDTH)
      for (const line of wrapped) {
        checkPageBreak(14)
        page.drawText(line, {
          x: MARGIN,
          y,
          size: 10,
          font: fontRegular,
          color: rgb(0.15, 0.15, 0.15)
        })
        y -= 14
      }
      y -= 4
    }
  }

  const pdfBytes = await pdfDoc.save()
  return new Blob([pdfBytes as any], { type: "application/pdf" })
}

export async function convertMarkdownToDOCX(markdownText: string): Promise<Blob> {
  const JSZipModule = await import("jszip")
  const JSZip = JSZipModule.default || JSZipModule
  const zip = new JSZip()

  zip.file(
    "[Content_Types].xml",
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
</Types>`
  )

  zip.file(
    "_rels/.rels",
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
</Relationships>`
  )

  const escapeXml = (unsafe: string) =>
    unsafe
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;')

  const lines = markdownText.split(/\r?\n/)
  const paragraphs: string[] = []

  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed) {
      paragraphs.push('<w:p/>')
      continue
    }

    if (trimmed.startsWith('# ')) {
      const text = escapeXml(trimmed.replace(/^#\s+/, ''))
      paragraphs.push(
        `<w:p><w:pPr><w:rPr><w:b/><w:sz w:val="40"/></w:rPr></w:pPr><w:r><w:rPr><w:b/><w:sz w:val="40"/></w:rPr><w:t>${text}</w:t></w:r></w:p>`
      )
    } else if (trimmed.startsWith('## ')) {
      const text = escapeXml(trimmed.replace(/^##\s+/, ''))
      paragraphs.push(
        `<w:p><w:pPr><w:rPr><w:b/><w:sz w:val="30"/></w:rPr></w:pPr><w:r><w:rPr><w:b/><w:sz w:val="30"/></w:rPr><w:t>${text}</w:t></w:r></w:p>`
      )
    } else if (trimmed.startsWith('### ')) {
      const text = escapeXml(trimmed.replace(/^###\s+/, ''))
      paragraphs.push(
        `<w:p><w:pPr><w:rPr><w:b/><w:sz w:val="24"/></w:rPr></w:pPr><w:r><w:rPr><w:b/><w:sz w:val="24"/></w:rPr><w:t>${text}</w:t></w:r></w:p>`
      )
    } else if (/^[-*]\s+/.test(trimmed) || /^\d+\.\s+/.test(trimmed)) {
      const clean = escapeXml(trimmed.replace(/^([-*]|\d+\.)\s+/, ''))
      paragraphs.push(`<w:p><w:r><w:t>• ${clean}</w:t></w:r></w:p>`)
    } else {
      const clean = escapeXml(trimmed.replace(/[*_`]/g, ''))
      paragraphs.push(`<w:p><w:r><w:t>${clean}</w:t></w:r></w:p>`)
    }
  }

  const documentXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:body>
    ${paragraphs.join('\n    ')}
    <w:sectPr/>
  </w:body>
</w:document>`

  zip.file("word/document.xml", documentXml)

  const docxBytes = await zip.generateAsync({ type: "uint8array" })
  return new Blob([docxBytes as unknown as BlobPart], {
    type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  })
}

export function convertMarkdownToTXT(markdownText: string): Blob {
  const plainText = markdownText
    .replace(/^#+\s+/gm, '')
    .replace(/^>\s*/gm, '')
    .replace(/[*_`~]/g, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
  return new Blob([plainText], { type: "text/plain;charset=utf-8" })
}

export async function convertMarkdownToPNG(markdownText: string): Promise<Blob> {
  const canvas = document.createElement("canvas")
  canvas.width = 1200
  canvas.height = 1600
  const ctx = canvas.getContext("2d")
  if (!ctx) throw new Error("Canvas context unavailable")

  ctx.fillStyle = "#FFFFFF"
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  ctx.fillStyle = "#1C1917"

  const lines = markdownText.split(/\r?\n/)
  let y = 80

  for (const line of lines) {
    const trimmed = line.trim()
    if (y > canvas.height - 60) break

    if (trimmed.startsWith("# ")) {
      ctx.font = "bold 36px sans-serif"
      ctx.fillText(trimmed.replace(/^#\s+/, ""), 60, y)
      y += 50
    } else if (trimmed.startsWith("## ")) {
      ctx.font = "bold 28px sans-serif"
      ctx.fillText(trimmed.replace(/^##\s+/, ""), 60, y)
      y += 40
    } else if (trimmed.startsWith("### ")) {
      ctx.font = "bold 22px sans-serif"
      ctx.fillText(trimmed.replace(/^###\s+/, ""), 60, y)
      y += 32
    } else if (trimmed) {
      ctx.font = "20px sans-serif"
      ctx.fillText(trimmed.replace(/[*_`#]/g, ""), 60, y)
      y += 30
    } else {
      y += 16
    }
  }

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob)
      else reject(new Error("Failed to generate PNG blob"))
    }, "image/png")
  })
}
