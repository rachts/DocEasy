export interface StoredFile {
  id: string
  name: string
  size: number
  type: string
  category: string
  tags: string[]
  data: string
  uploadedAt: number
}

const STORAGE_KEY = "doceasy_files"

export function getGuestFiles(): StoredFile[] {
  if (typeof window === "undefined") return []
  const stored = localStorage.getItem(STORAGE_KEY)
  return stored ? JSON.parse(stored) : []
}

export function saveGuestFile(file: StoredFile) {
  if (typeof window === "undefined") return
  const files = getGuestFiles()
  const existing = files.findIndex((f) => f.id === file.id)
  if (existing >= 0) {
    files[existing] = file
  } else {
    files.push(file)
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(files))
}

export function deleteGuestFile(id: string) {
  if (typeof window === "undefined") return
  const files = getGuestFiles()
  const filtered = files.filter((f) => f.id !== id)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered))
}

export function getFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes"
  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i]
}

export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}
