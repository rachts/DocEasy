import { connectDB } from "./mongodb"
import type { StoredFile } from "./db-schema"
import { ObjectId } from "mongodb"

export async function saveFile(file: Omit<StoredFile, "_id">): Promise<StoredFile> {
  const db = await connectDB()
  const result = await db.collection("files").insertOne(file)

  return {
    ...file,
    _id: result.insertedId.toString(),
  }
}

export async function getUserFiles(userId: string): Promise<StoredFile[]> {
  const db = await connectDB()
  const files = await db.collection("files").find({ userId }).sort({ uploadedAt: -1 }).toArray()

  return files.map((f: any) => ({
    ...f,
    _id: f._id.toString(),
  }))
}

export async function deleteFile(fileId: string, userId: string): Promise<boolean> {
  const db = await connectDB()
  const result = await db.collection("files").deleteOne({
    _id: new ObjectId(fileId),
    userId,
  })

  return result.deletedCount > 0
}

export async function getFile(fileId: string, userId: string): Promise<StoredFile | null> {
  const db = await connectDB()
  const file = await db.collection("files").findOne({
    _id: new ObjectId(fileId),
    userId,
  })

  return file ? { ...file, _id: file._id.toString() } : null
}
