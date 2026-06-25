'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { updateProfile, updatePassword } from './actions'
import { logout } from '../login/actions'
import { User, Lock, LogOut, Upload } from 'lucide-react'

export function AccountForm({ user, profile }: { user: any, profile: any }) {
  const [profileLoading, setProfileLoading] = useState(false)
  const [passwordLoading, setPasswordLoading] = useState(false)
  const [profileMessage, setProfileMessage] = useState({ type: '', text: '' })
  const [passwordMessage, setPasswordMessage] = useState({ type: '', text: '' })
  const [avatarPreview, setAvatarPreview] = useState(profile?.avatar_url || '')

  const handleProfileSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setProfileLoading(true)
    setProfileMessage({ type: '', text: '' })

    const formData = new FormData(e.currentTarget)
    const result = await updateProfile(formData)

    if (result?.error) {
      setProfileMessage({ type: 'error', text: result.error })
    } else {
      setProfileMessage({ type: 'success', text: 'Profile updated successfully' })
    }
    setProfileLoading(false)
  }

  const handlePasswordSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setPasswordLoading(true)
    setPasswordMessage({ type: '', text: '' })

    const formData = new FormData(e.currentTarget)
    const result = await updatePassword(formData)

    if (result?.error) {
      setPasswordMessage({ type: 'error', text: result.error })
    } else {
      setPasswordMessage({ type: 'success', text: 'Password updated successfully' })
      ;(e.target as HTMLFormElement).reset()
    }
    setPasswordLoading(false)
  }

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      setAvatarPreview(url)
    }
  }

  return (
    <div className="space-y-6">
      {/* Profile Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5 text-primary" />
            Profile Information
          </CardTitle>
          <CardDescription>Update your account details and profile picture.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleProfileSubmit} className="space-y-6">
            {profileMessage.text && (
              <div className={`p-3 rounded-lg text-sm ${profileMessage.type === 'error' ? 'bg-destructive/10 text-destructive' : 'bg-green-500/10 text-green-600'}`}>
                {profileMessage.text}
              </div>
            )}
            
            <div className="flex items-center gap-6">
              <div className="relative group w-20 h-20 rounded-full overflow-hidden bg-secondary flex items-center justify-center shrink-0 border border-border">
                {avatarPreview ? (
                  <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-2xl font-bold text-muted-foreground">
                    {profile?.full_name ? profile.full_name[0].toUpperCase() : user.email[0].toUpperCase()}
                  </span>
                )}
                <label className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center cursor-pointer text-white">
                  <Upload className="w-5 h-5" />
                  <input type="file" name="avatar" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                </label>
              </div>
              <div className="space-y-1">
                <h3 className="font-medium text-sm">Profile Picture</h3>
                <p className="text-xs text-muted-foreground">JPG, GIF or PNG. Max size of 2MB.</p>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold ml-1">Email Address</label>
              <input
                type="email"
                value={user.email}
                disabled
                className="w-full px-4 py-3 rounded-xl border border-border bg-muted text-muted-foreground outline-none"
              />
              <p className="text-xs text-muted-foreground ml-1">Your email address cannot be changed.</p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold ml-1">Full Name</label>
              <input
                type="text"
                name="fullName"
                defaultValue={profile?.full_name || ''}
                className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                placeholder="John Doe"
              />
            </div>

            <Button type="submit" disabled={profileLoading} className="h-10 rounded-xl px-6 font-bold">
              {profileLoading ? 'Saving...' : 'Save Changes'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Password Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-primary" />
            Security
          </CardTitle>
          <CardDescription>Update your password.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordSubmit} className="space-y-6">
            {passwordMessage.text && (
              <div className={`p-3 rounded-lg text-sm ${passwordMessage.type === 'error' ? 'bg-destructive/10 text-destructive' : 'bg-green-500/10 text-green-600'}`}>
                {passwordMessage.text}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-semibold ml-1">New Password</label>
              <input
                type="password"
                name="password"
                className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                placeholder="••••••••"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold ml-1">Confirm New Password</label>
              <input
                type="password"
                name="confirmPassword"
                className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                placeholder="••••••••"
                required
              />
            </div>

            <Button type="submit" disabled={passwordLoading} className="h-10 rounded-xl px-6 font-bold">
              {passwordLoading ? 'Updating...' : 'Update Password'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-destructive/20">
        <CardHeader>
          <CardTitle className="text-destructive flex items-center gap-2">
            <LogOut className="w-5 h-5" />
            Sign Out
          </CardTitle>
          <CardDescription>End your current session.</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={logout}>
            <Button variant="destructive" type="submit" className="h-10 rounded-xl px-6 font-bold bg-destructive/10 text-destructive hover:bg-destructive hover:text-destructive-foreground">
              Sign Out
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
