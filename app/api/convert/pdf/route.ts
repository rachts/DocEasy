import { type NextRequest, NextResponse } from "next/server"
import { PDFDocument } from "pdf-lib"

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get("file") as File
    const fileType = formData.get("fileType") as string

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    const buffer = await file.arrayBuffer()
    let pdfBytes: Uint8Array

    if (fileType === "image") {
      // Convert image to PDF
      const pdfDoc = await PDFDocument.create()

      let image
      if (file.type === "image/png") {
        image = await pdfDoc.embedPng(buffer)
      } else if (file.type === "image/jpeg" || file.type === "image/jpg") {
        image = await pdfDoc.embedJpg(buffer)
      } else {
        return NextResponse.json({ error: "Unsupported image format" }, { status: 400 })
      }

      const page = pdfDoc.addPage([image.width, image.height])
      page.drawImage(image, {
        x: 0,
        y: 0,
        width: image.width,
        height: image.height,
      })

      pdfBytes = await pdfDoc.save()
    } else if (fileType === "word") {
      // For Word documents, we'll use mammoth in the client side
      // This is a placeholder - actual conversion happens client-side
      return NextResponse.json({ error: "Word conversion should be done client-side" }, { status: 400 })
    } else if (fileType === "excel") {
      // For Excel, we'll handle it client-side with xlsx library
      return NextResponse.json({ error: "Excel conversion should be done client-side" }, { status: 400 })
    } else {
      return NextResponse.json({ error: "Unsupported file type" }, { status: 400 })
    }

    return new NextResponse(pdfBytes, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="converted.pdf"`,
      },
    })
  } catch (error) {
    console.error("PDF conversion failed:", error)
    return NextResponse.json({ error: "Conversion failed" }, { status: 500 })
  }
}
