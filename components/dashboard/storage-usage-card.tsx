import { createClient } from '@/utils/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { HardDrive } from 'lucide-react'
import { getFileSize } from '@/lib/storage-utils'

export async function StorageUsageCard() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  // Calculate total storage used from files table
  const { data: files } = await supabase
    .from('files')
    .select('original_size, processed_size')
    .eq('user_id', user.id)

  let totalSize = 0
  if (files) {
    totalSize = files.reduce((acc, file) => acc + (file.original_size || 0) + (file.processed_size || 0), 0)
  }

  // Define a limit, e.g., 100 MB for free tier
  const limit = 100 * 1024 * 1024
  const percentage = Math.min((totalSize / limit) * 100, 100)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <HardDrive className="w-5 h-5 text-primary" />
          Storage Usage
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between text-sm">
            <span>{getFileSize(totalSize)} Used</span>
            <span className="text-muted-foreground">{getFileSize(limit)} Limit</span>
          </div>
          <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full ${percentage > 90 ? 'bg-destructive' : 'bg-primary'}`}
              style={{ width: `${percentage}%` }}
            />
          </div>
          {percentage > 90 && (
            <p className="text-xs text-destructive">
              You are running out of storage space. Please upgrade your plan.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
