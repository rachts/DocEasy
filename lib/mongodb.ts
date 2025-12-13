import { MongoClient, type Db } from "mongodb"

let client: MongoClient | null = null
let db: Db | null = null

export async function connectDB(): Promise<Db> {
  if (db) return db

  const uri = process.env.MONGODB_URI

  if (!uri) {
    throw new Error("MONGODB_URI environment variable is not set")
  }

  client = new MongoClient(uri)
  await client.connect()
  db = client.db(process.env.MONGODB_DB_NAME || "doceasy")

  return db
}

export async function getDB(): Promise<Db> {
  if (db) return db
  return connectDB()
}

export async function closeDB() {
  if (client) {
    await client.close()
    client = null
    db = null
  }
}
