import { createClient } from "@/utils/supabase/client"

const supabase = typeof window !== "undefined" ? createClient() : null;

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
export async function uploadFileToSupabase(file: Blob | File, fileName: string, _toolUsed?: string) {
  const generateFallbackUrl = () => {
    if (typeof window !== 'undefined') {
      return { filePath: 'local-fallback', publicUrl: URL.createObjectURL(file) }
    }
    return { filePath: '', publicUrl: '' }
  }

  if (!supabase) {
    console.warn("Supabase not initialized. Skipping upload.")
    return generateFallbackUrl()
  }
  try {
    const { data: { user } } = await supabase.auth.getUser()
    const timestamp = Date.now()
    const safeFileName = fileName.replace(/[^a-z0-9.]/gi, "_").toLowerCase()
    
    // Organize by user if logged in
    const userFolder = user ? `users/${user.id}` : 'processed'
    const filePath = `${userFolder}/${timestamp}-${safeFileName}`

    const { error } = await supabase.storage
      .from("processed")
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (error) {
      console.warn("Supabase upload failed, using local URL fallback. Error:", error.message)
      return generateFallbackUrl()
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from("processed")
      .getPublicUrl(filePath)

    return { filePath, publicUrl }
  } catch (error: any) {
    console.error("Supabase Storage Error:", error)
    
    // Graceful degradation: return a local browser URL so the user can still download their file
    return generateFallbackUrl()
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
    // Silently fail so the UI can still display the local compressed file
    return null
  }
}


/**
 * Add to local storage recent files
 */
export function addToRecentFiles(file: any) {
  if (typeof window === "undefined") return

  try {
    const recentFiles = JSON.parse(localStorage.getItem("recent_files") || "[]")
    const updatedFiles = [file, ...recentFiles.filter((f: any) => f.name !== file.name)].slice(0, 10)
    localStorage.setItem("recent_files", JSON.stringify(updatedFiles))
  } catch (e) {
    console.error("Failed to add to recent files:", e)
  }
}

/**
 * Get recent files from local storage
 */
export function getRecentFiles(): any[] {
  if (typeof window === "undefined") return []
  try {
    return JSON.parse(localStorage.getItem("recent_files") || "[]")
  } catch (e) {
    console.error("Failed to read recent files:", e)
    return []
  }
}

/**
 * Clear recent files from local storage
 */
export function clearRecentFiles() {
  if (typeof window === "undefined") return
  try {
    localStorage.removeItem("recent_files")
  } catch (e) {
    console.error("Failed to clear recent files:", e)
  }
}
