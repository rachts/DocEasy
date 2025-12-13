import { PDFDocument, rgb, StandardFonts } from "pdf-lib"

export interface InvoiceData {
  invoiceNumber: string
  date: string
  from: string
  to: string
  items: Array<{ description: string; quantity: number; price: number }>
  total: number
}

export interface CertificateData {
  recipientName: string
  courseName: string
  date: string
  instructorName: string
}

export interface ResumeData {
  name: string
  email: string
  phone: string
  summary: string
  experience: string
  education: string
  skills: string
}

export async function generateInvoicePDF(data: InvoiceData): Promise<Blob> {
  const pdfDoc = await PDFDocument.create()
  const page = pdfDoc.addPage([595, 842]) // A4 size
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold)

  let yPosition = 800

  // Title
  page.drawText("INVOICE", {
    x: 50,
    y: yPosition,
    size: 24,
    font: boldFont,
    color: rgb(0, 0, 0),
  })

  yPosition -= 40

  // Invoice details
  page.drawText(`Invoice #: ${data.invoiceNumber}`, { x: 50, y: yPosition, size: 12, font })
  page.drawText(`Date: ${data.date}`, { x: 400, y: yPosition, size: 12, font })

  yPosition -= 40

  // From/To
  page.drawText("From:", { x: 50, y: yPosition, size: 12, font: boldFont })
  yPosition -= 20
  page.drawText(data.from, { x: 50, y: yPosition, size: 10, font })

  yPosition -= 40

  page.drawText("To:", { x: 50, y: yPosition, size: 12, font: boldFont })
  yPosition -= 20
  page.drawText(data.to, { x: 50, y: yPosition, size: 10, font })

  yPosition -= 40

  // Items header
  page.drawText("Description", { x: 50, y: yPosition, size: 12, font: boldFont })
  page.drawText("Qty", { x: 300, y: yPosition, size: 12, font: boldFont })
  page.drawText("Price", { x: 400, y: yPosition, size: 12, font: boldFont })
  page.drawText("Total", { x: 480, y: yPosition, size: 12, font: boldFont })

  yPosition -= 20

  // Items
  for (const item of data.items) {
    page.drawText(item.description, { x: 50, y: yPosition, size: 10, font })
    page.drawText(String(item.quantity), { x: 300, y: yPosition, size: 10, font })
    page.drawText(`$${item.price.toFixed(2)}`, { x: 400, y: yPosition, size: 10, font })
    page.drawText(`$${(item.quantity * item.price).toFixed(2)}`, { x: 480, y: yPosition, size: 10, font })
    yPosition -= 20
  }

  yPosition -= 20

  // Total
  page.drawText("TOTAL:", { x: 400, y: yPosition, size: 14, font: boldFont })
  page.drawText(`$${data.total.toFixed(2)}`, { x: 480, y: yPosition, size: 14, font: boldFont })

  const pdfBytes = await pdfDoc.save()
  return new Blob([pdfBytes], { type: "application/pdf" })
}

export async function generateCertificatePDF(data: CertificateData): Promise<Blob> {
  const pdfDoc = await PDFDocument.create()
  const page = pdfDoc.addPage([842, 595]) // A4 landscape
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold)

  // Border
  page.drawRectangle({
    x: 30,
    y: 30,
    width: 782,
    height: 535,
    borderColor: rgb(0.2, 0.2, 0.8),
    borderWidth: 3,
  })

  // Title
  page.drawText("CERTIFICATE OF COMPLETION", {
    x: 200,
    y: 480,
    size: 28,
    font: boldFont,
    color: rgb(0.2, 0.2, 0.8),
  })

  // Presented to
  page.drawText("This certificate is presented to", {
    x: 280,
    y: 400,
    size: 14,
    font,
  })

  // Recipient name
  page.drawText(data.recipientName, {
    x: 421 - data.recipientName.length * 6,
    y: 350,
    size: 24,
    font: boldFont,
    color: rgb(0, 0, 0),
  })

  // Course details
  page.drawText(`For successfully completing the course:`, {
    x: 260,
    y: 300,
    size: 12,
    font,
  })

  page.drawText(data.courseName, {
    x: 421 - data.courseName.length * 5,
    y: 270,
    size: 16,
    font: boldFont,
  })

  // Date
  page.drawText(`Date: ${data.date}`, {
    x: 100,
    y: 150,
    size: 12,
    font,
  })

  // Instructor
  page.drawText(`Instructor: ${data.instructorName}`, {
    x: 550,
    y: 150,
    size: 12,
    font,
  })

  const pdfBytes = await pdfDoc.save()
  return new Blob([pdfBytes], { type: "application/pdf" })
}

export async function generateResumePDF(data: ResumeData): Promise<Blob> {
  const pdfDoc = await PDFDocument.create()
  const page = pdfDoc.addPage([595, 842]) // A4 size
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold)

  let yPosition = 800

  // Name
  page.drawText(data.name, {
    x: 50,
    y: yPosition,
    size: 24,
    font: boldFont,
    color: rgb(0, 0, 0),
  })

  yPosition -= 30

  // Contact info
  page.drawText(`${data.email} | ${data.phone}`, {
    x: 50,
    y: yPosition,
    size: 10,
    font,
  })

  yPosition -= 40

  // Summary
  page.drawText("PROFESSIONAL SUMMARY", {
    x: 50,
    y: yPosition,
    size: 14,
    font: boldFont,
  })

  yPosition -= 20

  const summaryLines = wrapText(data.summary, 80)
  for (const line of summaryLines) {
    page.drawText(line, { x: 50, y: yPosition, size: 10, font })
    yPosition -= 15
  }

  yPosition -= 20

  // Experience
  page.drawText("EXPERIENCE", {
    x: 50,
    y: yPosition,
    size: 14,
    font: boldFont,
  })

  yPosition -= 20

  const experienceLines = wrapText(data.experience, 80)
  for (const line of experienceLines) {
    page.drawText(line, { x: 50, y: yPosition, size: 10, font })
    yPosition -= 15
  }

  yPosition -= 20

  // Education
  page.drawText("EDUCATION", {
    x: 50,
    y: yPosition,
    size: 14,
    font: boldFont,
  })

  yPosition -= 20

  const educationLines = wrapText(data.education, 80)
  for (const line of educationLines) {
    page.drawText(line, { x: 50, y: yPosition, size: 10, font })
    yPosition -= 15
  }

  yPosition -= 20

  // Skills
  page.drawText("SKILLS", {
    x: 50,
    y: yPosition,
    size: 14,
    font: boldFont,
  })

  yPosition -= 20

  const skillsLines = wrapText(data.skills, 80)
  for (const line of skillsLines) {
    page.drawText(line, { x: 50, y: yPosition, size: 10, font })
    yPosition -= 15
  }

  const pdfBytes = await pdfDoc.save()
  return new Blob([pdfBytes], { type: "application/pdf" })
}

function wrapText(text: string, maxLength: number): string[] {
  const words = text.split(" ")
  const lines: string[] = []
  let currentLine = ""

  for (const word of words) {
    if ((currentLine + word).length > maxLength) {
      if (currentLine) lines.push(currentLine.trim())
      currentLine = word + " "
    } else {
      currentLine += word + " "
    }
  }

  if (currentLine.trim()) lines.push(currentLine.trim())
  return lines
}
