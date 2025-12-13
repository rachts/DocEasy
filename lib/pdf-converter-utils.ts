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
  return new Blob([pdfBytes], { type: "application/pdf" })
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
  return new Blob([pdfBytes], { type: "application/pdf" })
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
  return new Blob([pdfBytes], { type: "application/pdf" })
}
