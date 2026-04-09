import { type NextRequest, NextResponse } from "next/server"
import pdf from "pdf-parse"

export const runtime = "nodejs"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    if (file.type !== "application/pdf") {
      return NextResponse.json({ error: "File must be a PDF" }, { status: 400 })
    }

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const data = await pdf(buffer)

    return NextResponse.json({
      text: data.text,
      pageCount: data.numpages,
      info: data.info,
    })
  } catch (error) {
    console.error("PDF extraction error:", error)
    return NextResponse.json({ error: "Failed to extract PDF data" }, { status: 500 })
  }
}
