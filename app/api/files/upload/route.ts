import { type NextRequest, NextResponse } from "next/server"
import { saveFile, getUserFiles } from "@/lib/file-utils"
import { verifyToken } from "@/lib/auth-utils"

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get("authorization")?.replace("Bearer ", "")
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const payload = verifyToken(token)
    if (!payload) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 })
    }

    const { name, size, type, category, tags, data } = await request.json()

    const file = await saveFile({
      userId: payload.userId,
      name,
      size,
      type,
      category,
      tags,
      data,
      uploadedAt: Date.now(),
    })

    return NextResponse.json(file, { status: 201 })
  } catch (error: any) {
    console.error("File upload error:", error)
    return NextResponse.json({ message: error.message || "Upload failed" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get("authorization")?.replace("Bearer ", "")
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const payload = verifyToken(token)
    if (!payload) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 })
    }

    const files = await getUserFiles(payload.userId)
    return NextResponse.json(files)
  } catch (error: any) {
    console.error("Get files error:", error)
    return NextResponse.json({ message: error.message || "Failed to fetch files" }, { status: 500 })
  }
}
