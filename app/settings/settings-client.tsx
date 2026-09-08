'use client'

import React, { useState } from 'react'
import { updateProfile, updatePassword } from './actions'
import { logout } from '../login/actions'

interface SettingsClientProps {
  user: any
  profile: any
}

export function SettingsClient({ user, profile }: SettingsClientProps) {
  const [activeCategory, setActiveCategory] = useState<'account' | 'security' | 'privacy' | 'api'>('account')
  const [profileLoading, setProfileLoading] = useState(false)
  const [passwordLoading, setPasswordLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(null)

  const handleProfileSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setProfileLoading(true)
    setMessage(null)

    const formData = new FormData(e.currentTarget)
    const res = await updateProfile(formData)

    if (res?.error) {
      setMessage({ type: 'error', text: res.error })
    } else {
      setMessage({ type: 'success', text: 'Account configuration saved' })
    }
    setProfileLoading(false)
  }

  const handlePasswordSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setPasswordLoading(true)
    setMessage(null)

    const formData = new FormData(e.currentTarget)
    const res = await updatePassword(formData)

    if (res?.error) {
      setMessage({ type: 'error', text: res.error })
    } else {
      setMessage({ type: 'success', text: 'Password successfully updated' })
      ;(e.target as HTMLFormElement).reset()
    }
    setPasswordLoading(false)
  }

  const categories = [
    { id: 'account', label: 'Account profile' },
    { id: 'security', label: 'Security & keys' },
    { id: 'privacy', label: 'Privacy & retention' },
    { id: 'api', label: 'Local engine' },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
      {/* Left Column: Categories */}
      <div className="md:col-span-4 bg-[#1C1917] border border-[#292524] p-4 rounded-[8px] flex flex-col space-y-1">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => {
              setActiveCategory(cat.id as any)
              setMessage(null)
            }}
            className={`text-left text-[13px] font-medium py-2.5 px-3.5 rounded-[6px] transition-colors duration-150 ${
              activeCategory === cat.id
                ? 'bg-[#141110] text-[#FAFAF9] border-l-2 border-[#D6D3D1]'
                : 'text-[#78716C] hover:text-[#FAFAF9] hover:bg-[#141110]'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Right Column: Form Area */}
      <div className="md:col-span-8 bg-[#1C1917] border border-[#292524] p-8 rounded-[8px]">
        {message && (
          <div
            className={`p-3 mb-6 border rounded-[6px] text-[13px] ${
              message.type === 'error'
                ? 'bg-[#141110] border-[#7F1D1D] text-[#FAFAF9]'
                : 'bg-[#141110] border-[#A8A29E] text-[#FAFAF9]'
            }`}
          >
            {message.type === 'error' ? 'Error: ' : 'Notice: '}{message.text}
          </div>
        )}

        {activeCategory === 'account' && (
          <form onSubmit={handleProfileSubmit} className="space-y-6">
            <div className="border-b border-[#292524] pb-3">
              <h2 className="text-[14px] font-medium text-[#FAFAF9]">
                Personal profile & workspace
              </h2>
            </div>

            <div className="space-y-1.5">
              <label className="text-[13px] font-medium text-[#FAFAF9] block">
                Primary email
              </label>
              <input
                type="email"
                value={user?.email || profile?.email || 'guest@doceasy.local'}
                disabled
                className="w-full h-11 bg-[#141110] border border-[#292524] rounded-[6px] px-3.5 text-[14px] text-[#78716C] cursor-not-allowed font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[13px] font-medium text-[#FAFAF9] block">
                Display name
              </label>
              <input
                type="text"
                name="fullName"
                defaultValue={profile?.full_name || ''}
                placeholder="Your name"
                className="w-full h-11 bg-[#141110] border border-[#292524] rounded-[6px] px-3.5 text-[15px] text-[#FAFAF9] placeholder:text-[#57534E] focus:border-[#A8A29E] focus:outline-none transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={profileLoading}
              className="h-10 px-6 bg-[#FAFAF9] text-[#0C0A09] text-[13px] font-medium rounded-[6px] hover:bg-[#D6D3D1] transition-colors duration-150 disabled:opacity-50 cursor-pointer"
            >
              {profileLoading ? 'Saving...' : 'Save changes'}
            </button>
          </form>
        )}

        {activeCategory === 'security' && (
          <form onSubmit={handlePasswordSubmit} className="space-y-6">
            <div className="border-b border-[#292524] pb-3">
              <h2 className="text-[14px] font-medium text-[#FAFAF9]">
                Security & password
              </h2>
            </div>

            <div className="space-y-1.5">
              <label className="text-[13px] font-medium text-[#FAFAF9] block">
                New password
              </label>
              <input
                type="password"
                name="password"
                required
                placeholder="••••••••"
                className="w-full h-11 bg-[#141110] border border-[#292524] rounded-[6px] px-3.5 text-[15px] text-[#FAFAF9] placeholder:text-[#57534E] focus:border-[#A8A29E] focus:outline-none transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[13px] font-medium text-[#FAFAF9] block">
                Confirm new password
              </label>
              <input
                type="password"
                name="confirmPassword"
                required
                placeholder="••••••••"
                className="w-full h-11 bg-[#141110] border border-[#292524] rounded-[6px] px-3.5 text-[15px] text-[#FAFAF9] placeholder:text-[#57534E] focus:border-[#A8A29E] focus:outline-none transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={passwordLoading}
              className="h-10 px-6 bg-[#FAFAF9] text-[#0C0A09] text-[13px] font-medium rounded-[6px] hover:bg-[#D6D3D1] transition-colors duration-150 disabled:opacity-50 cursor-pointer"
            >
              {passwordLoading ? 'Updating...' : 'Update password'}
            </button>
          </form>
        )}

        {activeCategory === 'privacy' && (
          <div className="space-y-6">
            <div className="border-b border-[#292524] pb-3">
              <h2 className="text-[14px] font-medium text-[#FAFAF9]">
                Retention policy & session memory
              </h2>
            </div>

            <div className="p-4 bg-[#141110] border border-[#292524] rounded-[6px] space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-[14px] text-[#FAFAF9] font-medium">Automatic memory purge</span>
                <span className="font-mono text-[11px] text-[#FAFAF9] bg-[#1C1917] px-2 py-1 border border-[#292524] rounded">2 hours TTL</span>
              </div>
              <p className="text-[13px] text-[#A8A29E] leading-relaxed">
                All temporary files stored in the memory buffer are scrubbed automatically upon closing the tab or after 2 hours.
              </p>
            </div>

            <div className="p-4 bg-[#141110] border border-[#292524] rounded-[6px] space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-[14px] text-[#FAFAF9] font-medium">Telemetry logging</span>
                <span className="font-mono text-[11px] text-[#78716C] bg-[#1C1917] px-2 py-1 border border-[#292524] rounded">Disabled</span>
              </div>
              <p className="text-[13px] text-[#A8A29E] leading-relaxed">
                Client analytics do not record document payloads, filenames, or file contents.
              </p>
            </div>
          </div>
        )}

        {activeCategory === 'api' && (
          <div className="space-y-6">
            <div className="border-b border-[#292524] pb-3">
              <h2 className="text-[14px] font-medium text-[#FAFAF9]">
                WebAssembly engine diagnostics
              </h2>
            </div>

            <div className="text-[13px] space-y-3 bg-[#141110] p-4 border border-[#292524] rounded-[6px]">
              <div className="flex justify-between">
                <span className="text-[#78716C]">Engine version</span>
                <span className="text-[#FAFAF9] font-mono text-[12px]">v3.1.2</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#78716C]">SIMD acceleration</span>
                <span className="text-[#FAFAF9] font-mono text-[12px]">Supported</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#78716C]">Worker concurrency</span>
                <span className="text-[#FAFAF9] font-mono text-[12px]">4 workers</span>
              </div>
            </div>
          </div>
        )}

        {/* Danger Zone: Sign Out */}
        <div className="mt-12 pt-6 border-t border-[#292524] flex justify-between items-center">
          <div>
            <span className="text-[14px] text-[#FAFAF9] font-medium block">End session</span>
            <span className="text-[12px] text-[#78716C] block">Clear credentials and sign out</span>
          </div>
          <form action={logout}>
            <button
              type="submit"
              className="h-9 px-4 bg-transparent text-[#7F1D1D] hover:text-[#FAFAF9] border border-[#7F1D1D] hover:bg-[#7F1D1D] text-[12px] font-medium rounded-[6px] transition-colors cursor-pointer"
            >
              Sign out
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
