import { type NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/auth-utils"
import { saveToolAction, getUserToolActions } from "@/lib/tool-actions-utils"

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization")
    const token = authHeader?.replace("Bearer ", "")

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    const actions = await getUserToolActions(decoded.userId)
    return NextResponse.json(actions)
  } catch (error) {
    console.error("Failed to fetch tool actions:", error)
    return NextResponse.json({ error: "Failed to fetch actions" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization")
    const token = authHeader?.replace("Bearer ", "")

    let userId: string | undefined

    if (token) {
      const decoded = verifyToken(token)
      if (decoded) {
        userId = decoded.userId
      }
    }

    const body = await req.json()
    const { fileName, fileType, action } = body

    if (!fileName || !fileType || !action) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const toolAction = await saveToolAction({
      userId,
      fileName,
      fileType,
      action,
      createdAt: Date.now(),
    })

    return NextResponse.json(toolAction)
  } catch (error) {
    console.error("Failed to save tool action:", error)
    return NextResponse.json({ error: "Failed to save action" }, { status: 500 })
  }
}
