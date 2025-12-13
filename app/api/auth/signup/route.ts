import { type NextRequest, NextResponse } from "next/server"
import { createUser, findUserByEmail, generateToken } from "@/lib/auth-utils"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ message: "Email and password required" }, { status: 400 })
    }

    const existingUser = await findUserByEmail(email)
    if (existingUser) {
      return NextResponse.json({ message: "User already exists" }, { status: 400 })
    }

    const user = await createUser(email, password)
    const token = generateToken(user._id!, email)

    return NextResponse.json(
      { token, userId: user._id, email },
      {
        status: 201,
        headers: {
          "Set-Cookie": `auth_token=${token}; HttpOnly; Path=/; Max-Age=604800`,
        },
      },
    )
  } catch (error: any) {
    console.error("Signup error:", error)
    return NextResponse.json({ message: error.message || "Signup failed" }, { status: 500 })
  }
}
