import { createClient } from '@/utils/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FileIcon, FileTextIcon, ImageIcon } from 'lucide-react'

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
    <Card>
      <CardHeader>
        <CardTitle>Recent Files</CardTitle>
      </CardHeader>
      <CardContent>
        {files && files.length > 0 ? (
          <ul className="space-y-4">
            {files.map((file) => (
              <li key={file.id} className="flex items-center space-x-4">
                <div className="bg-muted p-2 rounded-lg">
                  {file.file_type.includes('pdf') ? (
                    <FileTextIcon className="w-5 h-5 text-primary" />
                  ) : file.file_type.includes('image') ? (
                    <ImageIcon className="w-5 h-5 text-primary" />
                  ) : (
                    <FileIcon className="w-5 h-5 text-primary" />
                  )}
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none truncate w-[200px]">{file.file_name}</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(file.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-sm font-medium">
                  {file.tool_used}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center py-6 text-muted-foreground">
            No recent files found.
          </div>
        )}
      </CardContent>
    </Card>
  )
}
