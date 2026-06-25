"use server"

import { createClient } from "@/utils/supabase/server"

export async function submitContactForm(formData: FormData) {
  try {
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const subject = formData.get("subject") as string
    const message = formData.get("message") as string

    if (!name || !email || !subject || !message) {
      return { error: "All fields are required." }
    }

    const supabase = await createClient()

    const { error } = await supabase
      .from("contact_messages")
      .insert([
        {
          name,
          email,
          subject,
          message,
        }
      ])

    if (error) {
      console.error("Supabase insert error:", error)
      return { error: "Failed to send message. Please try again later." }
    }

    return { success: true }
  } catch (err: any) {
    console.error("Server action error:", err)
    return { error: "An unexpected error occurred." }
  }
}
