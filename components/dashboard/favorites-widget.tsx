import { createClient } from '@/utils/supabase/server'
import { Star, FileText } from 'lucide-react'

export async function FavoritesWidget() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  const { data: favorites } = await supabase
    .from('favorites')
    .select(`
      id,
      files (
        id,
        file_name,
        file_type,
        created_at
      )
    `)
    .eq('user_id', user.id)
    .limit(5)

  return (
    <div className="bg-[#1C1917] border border-[#292524] p-6 rounded-[8px]">
      <div className="border-b border-[#292524] pb-3 mb-4 flex items-center gap-2">
        <Star className="w-4 h-4 text-[#A8A29E]" />
        <h2 className="font-mono text-[12px] uppercase tracking-[0.05em] text-[#57534E]">
          Starred Vault Objects
        </h2>
      </div>

      {favorites && favorites.length > 0 ? (
        <ul className="space-y-2">
          {favorites.map((fav: any) => (
            <li key={fav.id} className="flex items-center gap-3 p-3 bg-[#141110] border border-[#292524] rounded-[6px]">
              <div className="w-8 h-8 bg-[#1C1917] border border-[#292524] flex items-center justify-center rounded-[4px] shrink-0">
                <FileText className="w-4 h-4 text-[#A8A29E]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[14px] text-[#FAFAF9] truncate">
                  {fav.files?.file_name}
                </p>
                <p className="font-mono text-[11px] text-[#57534E]">
                  {new Date(fav.files?.created_at).toLocaleDateString()}
                </p>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="py-6 text-center font-mono text-[12px] text-[#57534E] uppercase">
          No starred files.
        </div>
      )}
    </div>
  )
}
