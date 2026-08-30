import { createClient } from '@/utils/supabase/server'
import { Activity } from 'lucide-react'

export async function ActivityTimeline() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  const { data: activities } = await supabase
    .from('activity_logs')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(5)

  return (
    <div className="bg-[#1C1917] border border-[#292524] p-6 rounded-[8px]">
      <div className="border-b border-[#292524] pb-3 mb-4 flex items-center gap-2">
        <Activity className="w-4 h-4 text-[#A8A29E]" />
        <h2 className="font-mono text-[12px] uppercase tracking-[0.05em] text-[#57534E]">
          Activity Telemetry
        </h2>
      </div>

      {activities && activities.length > 0 ? (
        <div className="space-y-2">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className="p-3 bg-[#141110] border border-[#292524] rounded-[6px] flex items-center justify-between font-mono text-[12px]"
            >
              <span className="text-[#FAFAF9]">{activity.action}</span>
              <time className="text-[#57534E]">
                {new Date(activity.created_at).toLocaleTimeString()}
              </time>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-6 text-center font-mono text-[12px] text-[#57534E] uppercase">
          No activity logs recorded.
        </div>
      )}
    </div>
  )
}
