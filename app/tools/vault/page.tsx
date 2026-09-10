'use client'

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { VaultPadlock } from '@/components/vault-padlock'
import { 
  Lock, 
  Upload, 
  Download, 
  Trash2, 
  ShieldCheck, 
  Clock, 
  RefreshCw, 
  FileText, 
  HardDrive,
  Info,
  CheckCircle2,
  AlertCircle
} from 'lucide-react'
import {
  VaultFileSummary,
  storeFileInVault,
  listVaultFiles,
  decryptVaultFile,
  deleteVaultFile,
  purgeAllVaultFiles,
  formatTimeRemaining,
  VAULT_TTL_MS
} from '@/lib/vault-crypto'

export default function VaultPage() {
  const [files, setFiles] = useState<VaultFileSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [decryptingId, setDecryptingId] = useState<string | null>(null)
  const [dragActive, setDragActive] = useState(false)
  const [currentTime, setCurrentTime] = useState(Date.now())
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Show a momentary toast
  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3000)
  }

  // Load vault files from IndexedDB
  const refreshFiles = async () => {
    try {
      const activeFiles = await listVaultFiles()
      setFiles(activeFiles)
    } catch (err) {
      console.error('Failed to load vault files:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refreshFiles()
    // Timer interval to tick countdowns and purge expired items
    const interval = setInterval(() => {
      setCurrentTime(Date.now())
      // Check if any expired
      setFiles((prev) => prev.filter((f) => f.expiresAt > Date.now()))
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  // File upload handler
  const handleFiles = async (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return
    setUploading(true)
    setError(null)

    try {
      for (let i = 0; i < fileList.length; i++) {
        const file = fileList[i]
        if (file.size > 50 * 1024 * 1024) {
          throw new Error(`File "${file.name}" exceeds the 50MB limit (${(file.size / (1024 * 1024)).toFixed(1)} MB). Please select files under 50MB.`)
        }
        await storeFileInVault(file)
      }
      await refreshFiles()
      showToast(`${fileList.length} file(s) encrypted & vaulted`)
    } catch (err: any) {
      console.error('Vault encryption failed:', err)
      setError(err.message || 'Encryption failed')
    } finally {
      setUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  // Download & decrypt handler
  const handleDownload = async (file: VaultFileSummary) => {
    setDecryptingId(file.id)
    try {
      const { blob, name } = await decryptVaultFile(file.id)
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = name
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      showToast(`Decrypted & downloaded ${name}`)
    } catch (err: any) {
      console.error('Decryption failed:', err)
      alert(err.message || 'Decryption failed')
    } finally {
      setDecryptingId(null)
    }
  }

  // Delete single file
  const handleDelete = async (id: string, name: string) => {
    try {
      await deleteVaultFile(id)
      setFiles((prev) => prev.filter((f) => f.id !== id))
      showToast(`Purged ${name}`)
    } catch (err) {
      console.error('Failed to delete file:', err)
    }
  }

  // Purge all files & clear key
  const handlePurgeAll = async () => {
    if (files.length === 0) return
    if (!window.confirm('Purge all encrypted files and clear the session encryption key? This cannot be undone.')) {
      return
    }
    try {
      await purgeAllVaultFiles()
      setFiles([])
      showToast('Vault wiped completely')
    } catch (err) {
      console.error('Failed to purge vault:', err)
    }
  }

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const totalVaultSize = files.reduce((acc, f) => acc + f.size, 0)
  const oldestFile = files.length > 0 ? files[files.length - 1] : null
  const sessionRemainingMs = oldestFile ? Math.max(0, oldestFile.expiresAt - currentTime) : VAULT_TTL_MS

  return (
    <div className="min-h-screen bg-[#0C0A09] text-[#FAFAF9] font-sans flex flex-col selection:bg-[#292524] selection:text-[#FAFAF9]">
      <Navbar />

      <main className="flex-1 pt-[56px]">
        {/* Breadcrumb Header */}
        <div className="bg-[#141110] border-b border-[#292524] py-3 px-6 md:px-12">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs">
              <Link href="/tools" className="text-[#A8A29E] hover:text-[#FAFAF9] transition-colors">
                Tools
              </Link>
              <span className="text-[#57534E]">/</span>
              <span className="text-[#FAFAF9]">Encrypted Vault</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-[#A8A29E]">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>AES-GCM 256-bit client memory</span>
            </div>
          </div>
        </div>

        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 bg-[#1C1917] border border-[#44403C] text-[#FAFAF9] px-4 py-3 rounded-[8px] shadow-2xl flex items-center gap-3 text-sm animate-in fade-in slide-in-from-bottom-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{toastMessage}</span>
          </div>
        )}

        <div className="max-w-6xl mx-auto px-6 md:px-12 py-10">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-[#292524]">
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-[4px] bg-[#1C1917] border border-[#292524] text-xs text-[#A8A29E] mb-3">
                <VaultPadlock initialUnlocked={true} />
              </div>
              <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-[#FAFAF9]">
                Encrypted Vault
              </h1>
              <p className="text-[#A8A29E] text-sm md:text-base mt-2 max-w-2xl leading-relaxed">
                Client-side encrypted session storage. Files are encrypted with AES-GCM using a key in your session memory, stored locally in your browser, and auto-purged after 2 hours. Zero network calls.
              </p>
            </div>

            {files.length > 0 && (
              <button
                onClick={handlePurgeAll}
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium text-rose-400 bg-rose-950/20 hover:bg-rose-950/40 border border-rose-900/50 rounded-[6px] transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Purge Vault Now
              </button>
            )}
          </div>

          {/* Metrics / Status Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-8">
            <div className="bg-[#141110] border border-[#292524] rounded-[8px] p-4">
              <div className="text-xs text-[#78716C] mb-1 flex items-center gap-1.5">
                <HardDrive className="w-3.5 h-3.5" />
                Encrypted Files
              </div>
              <div className="text-2xl font-mono font-semibold text-[#FAFAF9]">
                {files.length}
              </div>
              <div className="text-xs text-[#A8A29E] mt-1">
                {formatBytes(totalVaultSize)} total vaulted
              </div>
            </div>

            <div className="bg-[#141110] border border-[#292524] rounded-[8px] p-4">
              <div className="text-xs text-[#78716C] mb-1 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                Auto-Purge TTL
              </div>
              <div className="text-2xl font-mono font-semibold text-emerald-400">
                {files.length > 0 ? formatTimeRemaining(sessionRemainingMs) : '2:00:00'}
              </div>
              <div className="text-xs text-[#A8A29E] mt-1">
                2-hour countdown per file
              </div>
            </div>

            <div className="bg-[#141110] border border-[#292524] rounded-[8px] p-4">
              <div className="text-xs text-[#78716C] mb-1 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Security Mode
              </div>
              <div className="text-lg font-semibold text-[#FAFAF9] flex items-center gap-2">
                AES-GCM-256
              </div>
              <div className="text-xs text-[#A8A29E] mt-1">
                Key isolated in sessionStorage
              </div>
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-[#1C1917] border border-[#7F1D1D] rounded-[6px] text-[13px] text-[#FAFAF9] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{error}</span>
              </div>
              <button
                onClick={() => setError(null)}
                className="px-3 py-1.5 bg-[#292524] hover:bg-[#44403C] text-[#FAFAF9] text-[12px] font-medium rounded-[4px] transition-colors shrink-0 cursor-pointer self-start sm:self-auto"
              >
                Dismiss & retry
              </button>
            </div>
          )}

          {/* Dropzone Upload */}
          <div
            onDragOver={(e) => {
              e.preventDefault()
              setDragActive(true)
            }}
            onDragLeave={() => setDragActive(false)}
            onDrop={(e) => {
              e.preventDefault()
              setDragActive(false)
              handleFiles(e.dataTransfer.files)
            }}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-[8px] p-8 text-center cursor-pointer transition-all ${
              dragActive 
                ? 'border-[#FAFAF9] bg-[#1C1917]' 
                : 'border-[#292524] bg-[#141110]/50 hover:bg-[#141110] hover:border-[#44403C]'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              className="hidden"
              onChange={(e) => handleFiles(e.target.files)}
            />
            <div className="flex flex-col items-center justify-center gap-3">
              <div className="w-12 h-12 rounded-full bg-[#1C1917] border border-[#292524] flex items-center justify-center text-[#FAFAF9]">
                {uploading ? (
                  <RefreshCw className="w-5 h-5 animate-spin text-emerald-400" />
                ) : (
                  <Upload className="w-5 h-5" />
                )}
              </div>
              <div>
                <p className="text-base font-medium text-[#FAFAF9]">
                  {uploading ? 'Encrypting and saving locally...' : 'Drop files here or browse to vault'}
                </p>
                <p className="text-xs text-[#78716C] mt-1">
                  Any file format • Instant Web Crypto 256-bit encryption • Zero network upload
                </p>
              </div>
            </div>
          </div>

          {/* Privacy Verification Callout */}
          <div className="my-6 p-4 rounded-[8px] bg-[#141110] border border-[#292524] flex items-start gap-3 text-xs text-[#A8A29E]">
            <Info className="w-4 h-4 text-[#FAFAF9] shrink-0 mt-0.5" />
            <div>
              <span className="text-[#FAFAF9] font-medium">Verify in your browser:</span> Open DevTools Network tab. You will notice zero network traffic when dropping, viewing, or downloading files from the vault. Everything executes strictly in client memory.
            </div>
          </div>

          {/* Vault Files Table */}
          <div className="mt-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-[#FAFAF9]">Vault Contents</h2>
              <span className="text-xs text-[#78716C]">
                {files.length} item{files.length === 1 ? '' : 's'} stored
              </span>
            </div>

            {loading ? (
              <div className="py-12 text-center text-[#78716C] text-sm">
                Initializing local vault...
              </div>
            ) : files.length === 0 ? (
              <div className="bg-[#141110] border border-[#292524] rounded-[8px] p-12 text-center">
                <Lock className="w-10 h-10 text-[#57534E] mx-auto mb-3" />
                <h3 className="text-base font-medium text-[#FAFAF9]">Your vault is currently empty</h3>
                <p className="text-xs text-[#78716C] mt-1 max-w-md mx-auto">
                  Drag and drop documents or images above. They will be encrypted with AES-GCM and stored in this browser session until the 2-hour TTL expires or you close the tab.
                </p>
              </div>
            ) : (
              <div className="bg-[#141110] border border-[#292524] rounded-[8px] overflow-hidden">
                <div className="divide-y divide-[#292524]">
                  {files.map((f) => {
                    const remainingMs = Math.max(0, f.expiresAt - currentTime)
                    const isExpiringSoon = remainingMs < 10 * 60 * 1000 // less than 10 mins

                    return (
                      <div
                        key={f.id}
                        className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[#1C1917]/50 transition-colors"
                      >
                        <div className="flex items-center gap-3.5 min-w-0">
                          <div className="w-9 h-9 rounded-[6px] bg-[#1C1917] border border-[#292524] flex items-center justify-center shrink-0">
                            <FileText className="w-4 h-4 text-[#A8A29E]" />
                          </div>
                          <div className="min-w-0">
                            <div className="text-sm font-medium text-[#FAFAF9] truncate">
                              {f.name}
                            </div>
                            <div className="flex items-center gap-2 text-xs text-[#78716C] mt-0.5">
                              <span className="font-mono">{formatBytes(f.size)}</span>
                              <span>•</span>
                              <span>Added {new Date(f.addedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                          {/* Auto-purge Countdown Badge */}
                          <div className={`px-2.5 py-1 rounded-[4px] text-xs font-mono flex items-center gap-1.5 border ${
                            isExpiringSoon
                              ? 'bg-rose-950/30 border-rose-900/50 text-rose-400'
                              : 'bg-[#1C1917] border-[#292524] text-[#A8A29E]'
                          }`}>
                            <Clock className="w-3 h-3" />
                            <span>{formatTimeRemaining(remainingMs)} remaining</span>
                          </div>

                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => handleDownload(f)}
                              disabled={decryptingId === f.id}
                              className="px-3 py-1.5 bg-[#FAFAF9] hover:bg-[#E7E5E4] text-[#0C0A09] text-xs font-medium rounded-[6px] transition-colors flex items-center gap-1.5 disabled:opacity-50"
                              title="Decrypt and download file"
                            >
                              {decryptingId === f.id ? (
                                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                              ) : (
                                <Download className="w-3.5 h-3.5" />
                              )}
                              <span>Download</span>
                            </button>

                            <button
                              onClick={() => handleDelete(f.id, f.name)}
                              className="p-1.5 text-[#78716C] hover:text-rose-400 hover:bg-rose-950/20 rounded-[6px] transition-colors"
                              title="Purge file from vault"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
