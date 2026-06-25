import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import { VaultClient } from "./vault-client"

export const metadata = {
  title: "File Vault | DocEasy",
  description: "Manage your processed documents, favorites, and AI analysis results.",
}

export default async function VaultPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  // Fetch all user's files
  const { data: files } = await supabase
    .from("files")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  // Fetch user's favorites
  const { data: favoritesData } = await supabase
    .from("favorites")
    .select("file_id")
    .eq("user_id", user.id)

  const favoriteIds = new Set(favoritesData?.map(f => f.file_id) || [])

  // Fetch user's AI jobs
  const { data: aiJobs } = await supabase
    .from("ai_jobs")
    .select("*, files(*)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  return (
    <div className="min-h-screen bg-background">
      <VaultClient 
        initialFiles={files || []} 
        favoriteIds={Array.from(favoriteIds)}
        aiJobs={aiJobs || []}
      />
    </div>
  )
}
