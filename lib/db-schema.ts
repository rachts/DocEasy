export interface User {
  _id?: string
  email: string
  password?: string
  googleId?: string
  createdAt: number
  updatedAt: number
}

export interface StoredFile {
  _id?: string
  userId: string
  name: string
  size: number
  type: string
  category: string
  tags: string[]
  data: string
  uploadedAt: number
}

export interface AuthToken {
  userId: string
  email: string
  iat: number
}

export interface ToolAction {
  _id?: string
  userId?: string
  fileName: string
  fileType: string
  action: "compress" | "convert" | "extract" | "make" | "photo"
  createdAt: number
}
