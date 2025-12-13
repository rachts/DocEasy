import { NextResponse } from "next/server"

export async function POST() {
  return NextResponse.json(
    { message: "Logged out successfully" },
    {
      status: 200,
      headers: {
        "Set-Cookie": "auth_token=; HttpOnly; Path=/; Max-Age=0",
      },
    },
  )
}
