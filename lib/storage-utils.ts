import { createClient } from '@/utils/supabase/client'


export interface StoredFile {
  id: string
  user_id: string
  file_name: string
  file_type: string
  original_size: number
  processed_size?: number
  storage_path: string
  tool_used?: string
  created_at: string
}

export async function uploadFileToSupabase(file: File, bucket: 'uploads' | 'avatars' = 'uploads'): Promise<string> {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error('User must be logged in to upload files')

  const fileExt = file.name.split('.').pop()
  const fileName = `${crypto.randomUUID()}.${fileExt}`
  const filePath = `${user.id}/${fileName}`

  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(filePath, file)

  if (uploadError) {
    throw uploadError
  }

  return filePath
}

export async function getFileUrl(path: string, bucket: 'uploads' | 'exports' | 'avatars' = 'uploads'): Promise<string> {
  const supabase = createClient()
  const { data } = await supabase.storage.from(bucket).createSignedUrl(path, 60 * 60) // 1 hour expiry
  
  if (!data?.signedUrl) throw new Error('Failed to generate secure URL')
  
  return data.signedUrl
}

export async function deleteSupabaseFile(path: string, bucket: 'uploads' | 'exports' | 'avatars' = 'uploads') {
  const supabase = createClient()
  const { error } = await supabase.storage.from(bucket).remove([path])
  
  if (error) throw error
}

export function getFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes"
  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i]
}
