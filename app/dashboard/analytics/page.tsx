import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import { AnalyticsClient } from "./analytics-client"

export const metadata = {
  title: "Analytics | DocEasy",
  description: "View your usage analytics and insights.",
}

export default async function AnalyticsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  // Fetch all user files to aggregate analytics
  const { data: files } = await supabase
    .from("files")
    .select("created_at, tool_used, original_size, processed_size")
    .eq("user_id", user.id)

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="flex items-center justify-between space-y-2 mb-8">
        <h2 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h2>
      </div>
      <AnalyticsClient files={files || []} />
    </div>
  )
}
