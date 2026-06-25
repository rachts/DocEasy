import { createClient } from '@/utils/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Star, FileIcon } from 'lucide-react'

export async function FavoritesWidget() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  // Fetch favorites joined with files
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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
          Starred Files
        </CardTitle>
      </CardHeader>
      <CardContent>
        {favorites && favorites.length > 0 ? (
          <ul className="space-y-4">
            {favorites.map((fav: any) => (
              <li key={fav.id} className="flex items-center space-x-4">
                <div className="bg-muted p-2 rounded-lg">
                  <FileIcon className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none truncate w-[200px]">
                    {fav.files.file_name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(fav.files.created_at).toLocaleDateString()}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center py-6 text-muted-foreground">
            No starred files yet.
          </div>
        )}
      </CardContent>
    </Card>
  )
}
