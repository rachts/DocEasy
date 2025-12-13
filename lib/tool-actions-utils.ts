import { connectDB } from "./mongodb"
import type { ToolAction } from "./db-schema"

export async function saveToolAction(action: Omit<ToolAction, "_id">): Promise<ToolAction> {
  const db = await connectDB()
  const result = await db.collection("tool_actions").insertOne(action)

  return {
    ...action,
    _id: result.insertedId.toString(),
  }
}

export async function getUserToolActions(userId: string): Promise<ToolAction[]> {
  const db = await connectDB()
  const actions = await db.collection("tool_actions").find({ userId }).sort({ createdAt: -1 }).limit(50).toArray()

  return actions.map((a: any) => ({
    ...a,
    _id: a._id.toString(),
  }))
}

export async function getRecentToolActions(userId?: string): Promise<ToolAction[]> {
  const db = await connectDB()
  const query = userId ? { userId } : {}
  const actions = await db.collection("tool_actions").find(query).sort({ createdAt: -1 }).limit(10).toArray()

  return actions.map((a: any) => ({
    ...a,
    _id: a._id.toString(),
  }))
}
