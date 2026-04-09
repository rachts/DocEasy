import { supabase } from "./client"

export interface FileMetadata {
  file_name: string
  file_type: string
  file_size: number
  tool_used: string
  storage_path: string
  user_id?: string
  download_url?: string
  is_saved?: boolean
}

/**
 * Uploads a file (Blob/File) to Supabase Storage
 */
export async function uploadFileToSupabase(file: Blob | File, fileName: string, toolUsed: string) {
  if (!supabase) {
    console.warn("Supabase not initialized. Skipping upload.")
    return { filePath: "", publicUrl: "" }
  }
  try {
    const { data: { user } } = await supabase.auth.getUser()
    const timestamp = Date.now()
    const safeFileName = fileName.replace(/[^a-z0-9.]/gi, "_").toLowerCase()
    
    // Organize by user if logged in
    const userFolder = user ? `users/${user.id}` : 'processed'
    const filePath = `${userFolder}/${timestamp}-${safeFileName}`

    const { data, error } = await supabase.storage
      .from("processed")
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (error) throw error

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from("processed")
      .getPublicUrl(filePath)

    return { filePath, publicUrl }
  } catch (error) {
    console.error("Supabase Storage Error:", error)
    await trackEvent("error", toolUsed)
    throw error
  }
}

/**
 * Saves file metadata to the PostgreSQL database
 */
export async function saveFileMetadata(metadata: FileMetadata) {
  if (!supabase) return null
  try {
    const { data: { user } } = await supabase.auth.getUser()
    
    const record = {
      ...metadata,
      user_id: user?.id || metadata.user_id,
      created_at: new Date().toISOString()
    }

    const { data, error } = await supabase
      .from("files")
      .insert([record])
      .select()

    if (error) throw error
    return data[0]
  } catch (error) {
    console.error("Supabase Database Error (Files):", error)
    throw error
  }
}

/**
 * Tracks events for analytics
 */
export async function trackEvent(eventType: "upload" | "download" | "error", toolUsed: string) {
  if (!supabase) return
  try {
    const { error } = await supabase
      .from("events")
      .insert([{ event_type: eventType, tool_used: toolUsed }])

    if (error) throw error
  } catch (error) {
    console.error("Supabase Analytics Error:", error)
    // Don't throw here to avoid blocking the main flow
  }
}

/**
 * Bonus: Add to local storage recent files
 */
export function addToRecentFiles(file: any) {
  if (typeof window === "undefined") return

  const recentFiles = JSON.parse(localStorage.getItem("recent_files") || "[]")
  const updatedFiles = [file, ...recentFiles].slice(0, 3) // Keep last 3
  localStorage.setItem("recent_files", JSON.stringify(updatedFiles))
}
