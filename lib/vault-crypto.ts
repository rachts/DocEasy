/**
 * Client-Side Encrypted File Vault
 * Uses Web Crypto AES-GCM (256-bit) with session key stored exclusively in sessionStorage.
 * All files encrypted before persisting into browser IndexedDB.
 * Ephemeral 2-hour TTL auto-purge. Zero server/network calls.
 */

export interface VaultFileRecord {
  id: string
  name: string
  size: number
  type: string
  iv: number[]
  encryptedData: ArrayBuffer
  addedAt: number
  expiresAt: number
}

export interface VaultFileSummary {
  id: string
  name: string
  size: number
  type: string
  addedAt: number
  expiresAt: number
}

export const VAULT_TTL_MS = 2 * 60 * 60 * 1000 // 2 hours in ms
const DB_NAME = 'DocEasyVaultDB'
const DB_VERSION = 1
const STORE_NAME = 'encrypted_files'
const SESSION_KEY_NAME = 'doceasy_vault_aes_key'
const SESSION_START_NAME = 'doceasy_vault_session_start'

function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof window.crypto !== 'undefined'
}

/**
 * Retrieve or generate AES-GCM (256-bit) encryption key from sessionStorage.
 */
export async function getOrCreateVaultKey(): Promise<CryptoKey> {
  if (!isBrowser()) {
    throw new Error('Web Crypto is only available in browser contexts.')
  }

  const rawJwk = sessionStorage.getItem(SESSION_KEY_NAME)

  if (rawJwk) {
    try {
      const jwk = JSON.parse(rawJwk)
      return await window.crypto.subtle.importKey(
        'jwk',
        jwk,
        { name: 'AES-GCM' },
        true,
        ['encrypt', 'decrypt']
      )
    } catch {
      // If corrupted, fallback to generating new key
    }
  }

  const newKey = await window.crypto.subtle.generateKey(
    { name: 'AES-GCM', length: 256 },
    true,
    ['encrypt', 'decrypt']
  )

  const exportedJwk = await window.crypto.subtle.exportKey('jwk', newKey)
  sessionStorage.setItem(SESSION_KEY_NAME, JSON.stringify(exportedJwk))

  if (!sessionStorage.getItem(SESSION_START_NAME)) {
    sessionStorage.setItem(SESSION_START_NAME, Date.now().toString())
  }

  return newKey
}

/**
 * Open IndexedDB for encrypted vault storage.
 */
function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (!isBrowser()) {
      return reject(new Error('IndexedDB not supported in this environment.'))
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION)

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' })
      }
    }

    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

/**
 * Encrypt and store a file into the client-side vault.
 */
export async function storeFileInVault(file: File): Promise<VaultFileSummary> {
  const key = await getOrCreateVaultKey()
  const arrayBuffer = await file.arrayBuffer()
  const iv = window.crypto.getRandomValues(new Uint8Array(12))

  const encryptedData = await window.crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    arrayBuffer
  )

  const now = Date.now()
  const record: VaultFileRecord = {
    id: window.crypto.randomUUID ? window.crypto.randomUUID() : `${now}-${Math.random().toString(36).slice(2, 9)}`,
    name: file.name,
    size: file.size,
    type: file.type || 'application/octet-stream',
    iv: Array.from(iv),
    encryptedData,
    addedAt: now,
    expiresAt: now + VAULT_TTL_MS
  }

  const db = await openDB()
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite')
    const store = tx.objectStore(STORE_NAME)
    const req = store.put(record)
    req.onsuccess = () => resolve()
    req.onerror = () => reject(req.error)
  })

  return {
    id: record.id,
    name: record.name,
    size: record.size,
    type: record.type,
    addedAt: record.addedAt,
    expiresAt: record.expiresAt
  }
}

/**
 * List files and automatically purge any expired records (TTL reached).
 */
export async function listVaultFiles(): Promise<VaultFileSummary[]> {
  if (!isBrowser()) return []
  const db = await openDB()
  const now = Date.now()

  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite')
    const store = tx.objectStore(STORE_NAME)
    const request = store.openCursor()
    const activeFiles: VaultFileSummary[] = []

    request.onsuccess = (event) => {
      const cursor = (event.target as IDBRequest<IDBCursorWithValue>).result
      if (cursor) {
        const record = cursor.value as VaultFileRecord
        if (record.expiresAt <= now) {
          cursor.delete()
        } else {
          activeFiles.push({
            id: record.id,
            name: record.name,
            size: record.size,
            type: record.type,
            addedAt: record.addedAt,
            expiresAt: record.expiresAt
          })
        }
        cursor.continue()
      } else {
        // Sort newest first
        activeFiles.sort((a, b) => b.addedAt - a.addedAt)
        resolve(activeFiles)
      }
    }

    request.onerror = () => reject(request.error)
  })
}

/**
 * Decrypt a file and prepare a downloadable Blob.
 */
export async function decryptVaultFile(id: string): Promise<{ blob: Blob; name: string }> {
  const db = await openDB()
  const record = await new Promise<VaultFileRecord>((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly')
    const store = tx.objectStore(STORE_NAME)
    const req = store.get(id)
    req.onsuccess = () => {
      if (!req.result) {
        reject(new Error('File not found in vault or already purged.'))
      } else {
        resolve(req.result as VaultFileRecord)
      }
    }
    req.onerror = () => reject(req.error)
  })

  if (record.expiresAt <= Date.now()) {
    await deleteVaultFile(id)
    throw new Error('This file has expired and was purged.')
  }

  const key = await getOrCreateVaultKey()
  const iv = new Uint8Array(record.iv)

  const decryptedBuffer = await window.crypto.subtle.decrypt(
    { name: 'AES-GCM', iv },
    key,
    record.encryptedData
  )

  const blob = new Blob([decryptedBuffer], { type: record.type })
  return { blob, name: record.name }
}

/**
 * Delete a specific file from the vault.
 */
export async function deleteVaultFile(id: string): Promise<void> {
  if (!isBrowser()) return
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite')
    const store = tx.objectStore(STORE_NAME)
    const req = store.delete(id)
    req.onsuccess = () => resolve()
    req.onerror = () => reject(req.error)
  })
}

/**
 * Purge all files and clear the session encryption key.
 */
export async function purgeAllVaultFiles(): Promise<void> {
  if (!isBrowser()) return
  const db = await openDB()
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite')
    const store = tx.objectStore(STORE_NAME)
    const req = store.clear()
    req.onsuccess = () => resolve()
    req.onerror = () => reject(req.error)
  })

  sessionStorage.removeItem(SESSION_KEY_NAME)
  sessionStorage.removeItem(SESSION_START_NAME)
}

/**
 * Format milliseconds remaining to HH:MM:SS string.
 */
export function formatTimeRemaining(ms: number): string {
  if (ms <= 0) return 'Expired'
  const totalSecs = Math.floor(ms / 1000)
  const hours = Math.floor(totalSecs / 3600)
  const mins = Math.floor((totalSecs % 3600) / 60)
  const secs = totalSecs % 60

  const pad = (n: number) => n.toString().padStart(2, '0')
  return `${pad(hours)}:${pad(mins)}:${pad(secs)}`
}
