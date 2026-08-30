import { createClient } from '@/utils/supabase/server'
import { HardDrive } from 'lucide-react'
import { getFileSize } from '@/lib/storage-utils'

export async function StorageUsageCard() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  const { data: files } = await supabase
    .from('files')
    .select('original_size, processed_size')
    .eq('user_id', user.id)

  let totalSize = 0
  if (files) {
    totalSize = files.reduce((acc, file) => acc + (file.original_size || 0) + (file.processed_size || 0), 0)
  }

  const limit = 100 * 1024 * 1024
  const percentage = Math.min((totalSize / limit) * 100, 100)

  return (
    <div className="bg-[#1C1917] border border-[#292524] p-6 rounded-[8px]">
      <div className="border-b border-[#292524] pb-3 mb-4 flex items-center gap-2">
        <HardDrive className="w-4 h-4 text-[#A8A29E]" />
        <h2 className="font-mono text-[12px] uppercase tracking-[0.05em] text-[#57534E]">
          Vault Quota
        </h2>
      </div>

      <div className="space-y-3 font-mono text-[12px]">
        <div className="flex justify-between">
          <span className="text-[#FAFAF9]">{getFileSize(totalSize)} ALLOCATED</span>
          <span className="text-[#57534E]">{getFileSize(limit)} CAP</span>
        </div>
        <div className="h-1.5 w-full bg-[#141110] border border-[#292524] overflow-hidden">
          <div 
            className="h-full bg-[#FAFAF9]"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    </div>
  )
}
