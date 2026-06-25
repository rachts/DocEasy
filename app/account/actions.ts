'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function updateProfile(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Not logged in')
  }

  const fullName = formData.get('fullName') as string
  const avatarFile = formData.get('avatar') as File | null

  let avatarUrl = undefined

  if (avatarFile && avatarFile.size > 0) {
    const fileExt = avatarFile.name.split('.').pop()
    const filePath = `${user.id}/${Math.random()}.${fileExt}`

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, avatarFile)

    if (uploadError) {
      return { error: 'Failed to upload avatar' }
    }

    const { data } = supabase.storage.from('avatars').getPublicUrl(filePath)
    avatarUrl = data.publicUrl
  }

  const updateData: any = {}
  if (fullName) updateData.full_name = fullName
  if (avatarUrl) updateData.avatar_url = avatarUrl

  if (Object.keys(updateData).length > 0) {
    const { error } = await supabase
      .from('profiles')
      .upsert({ id: user.id, ...updateData })

    if (error) {
      return { error: 'Failed to update profile' }
    }
  }

  revalidatePath('/account')
  return { success: true }
}

export async function updatePassword(formData: FormData) {
  const supabase = await createClient()
  const password = formData.get('password') as string
  const confirmPassword = formData.get('confirmPassword') as string

  if (password !== confirmPassword) {
    return { error: 'Passwords do not match' }
  }

  if (password.length < 6) {
    return { error: 'Password must be at least 6 characters' }
  }

  const { error } = await supabase.auth.updateUser({ password })

  if (error) {
    return { error: error.message }
  }

  return { success: true }
}
