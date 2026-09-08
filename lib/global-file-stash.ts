/**
 * Global In-Memory File Stash
 * Allows files dropped on arbitrary pages (e.g. / or /tools) to be seamlessly passed
 * to the target tool page (e.g. /tools/compress) without serialization limits.
 */

let pendingFile: File | null = null

export function setPendingDroppedFile(file: File | null) {
  pendingFile = file
}

export function getAndClearPendingDroppedFile(): File | null {
  const file = pendingFile
  pendingFile = null
  return file
}

export function peekPendingDroppedFile(): File | null {
  return pendingFile
}
