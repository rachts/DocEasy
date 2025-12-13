import { type NextRequest, NextResponse } from "next/server"
import { deleteFile } from "@/lib/file-utils"
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

    const { fileId } = await request.json()
    const success = await deleteFile(fileId, payload.userId)

    if (!success) {
      return NextResponse.json({ message: "File not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "File deleted successfully" })
  } catch (error: any) {
    console.error("File deletion error:", error)
    return NextResponse.json({ message: error.message || "Deletion failed" }, { status: 500 })
  }
}
