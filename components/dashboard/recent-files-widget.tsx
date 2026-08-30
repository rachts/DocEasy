import { createClient } from '@/utils/supabase/server'
import { FileText, Clock } from 'lucide-react'

export async function RecentFilesWidget() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  const { data: files } = await supabase
    .from('files')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(5)

  return (
    <div className="bg-[#1C1917] border border-[#292524] p-6 rounded-[8px]">
      <div className="border-b border-[#292524] pb-3 mb-4 flex items-center gap-2">
        <Clock className="w-4 h-4 text-[#A8A29E]" />
        <h2 className="font-mono text-[12px] uppercase tracking-[0.05em] text-[#57534E]">
          Recent Transformed Files
        </h2>
      </div>

      {files && files.length > 0 ? (
        <ul className="space-y-2">
          {files.map((file) => (
            <li key={file.id} className="flex items-center justify-between p-3 bg-[#141110] border border-[#292524] rounded-[6px]">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 bg-[#1C1917] border border-[#292524] flex items-center justify-center rounded-[4px] shrink-0">
                  <FileText className="w-4 h-4 text-[#A8A29E]" />
                </div>
                <div className="min-w-0">
                  <p className="text-[14px] text-[#FAFAF9] truncate max-w-[200px]">{file.file_name}</p>
                  <p className="font-mono text-[11px] text-[#57534E]">
                    {new Date(file.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <span className="font-mono text-[11px] uppercase tracking-[0.05em] text-[#57534E] bg-[#1C1917] border border-[#292524] px-2 py-0.5 rounded">
                {file.tool_used}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <div className="py-6 text-center font-mono text-[12px] text-[#57534E] uppercase">
          No recent files recorded.
        </div>
      )}
    </div>
  )
}
