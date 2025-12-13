import { type NextRequest, NextResponse } from "next/server"
import { findUserByEmail, verifyPassword, generateToken } from "@/lib/auth-utils"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ message: "Email and password required" }, { status: 400 })
    }

    const user = await findUserByEmail(email)
    if (!user) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 })
    }

    const isValidPassword = await verifyPassword(password, user.password || "")
    if (!isValidPassword) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 })
    }

    const token = generateToken(user._id!, email)

    return NextResponse.json(
      { token, userId: user._id, email },
      {
        status: 200,
        headers: {
          "Set-Cookie": `auth_token=${token}; HttpOnly; Path=/; Max-Age=604800`,
        },
      },
    )
  } catch (error: any) {
    console.error("Login error:", error)
    return NextResponse.json({ message: error.message || "Login failed" }, { status: 500 })
  }
}
