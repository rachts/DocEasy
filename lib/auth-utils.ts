import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { connectDB } from "./mongodb"
import type { User } from "./db-schema"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"
const JWT_EXPIRY = "7d"

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10)
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

export function generateToken(userId: string, email: string): string {
  return jwt.sign({ userId, email }, JWT_SECRET, { expiresIn: JWT_EXPIRY })
}

export function verifyToken(token: string): { userId: string; email: string } | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any
    return { userId: decoded.userId, email: decoded.email }
  } catch {
    return null
  }
}

export async function createUser(email: string, password: string): Promise<User> {
  const db = await connectDB()
  const hashedPassword = await hashPassword(password)

  const result = await db.collection("users").insertOne({
    email,
    password: hashedPassword,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  })

  return {
    _id: result.insertedId.toString(),
    email,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  }
}

export async function findUserByEmail(email: string): Promise<User | null> {
  const db = await connectDB()
  const user = await db.collection("users").findOne({ email })
  return user
    ? {
        _id: user._id.toString(),
        email: user.email,
        password: user.password,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      }
    : null
}

export async function findUserById(userId: string): Promise<User | null> {
  const db = await connectDB()
  const { ObjectId } = await import("mongodb")
  const user = await db.collection("users").findOne({ _id: new ObjectId(userId) })
  return user
    ? {
        _id: user._id.toString(),
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      }
    : null
}
