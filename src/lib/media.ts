import { loadMedia } from './offlineStore'

/** Unified key for a media filename: trim + lowercase.
 *  MUST match the backend's normName_ so uploads/lookups line up across
 *  the sheet, the Apps Script store, and the local IndexedDB cache. */
export function normalizeMediaKey(media: string): string {
  return media.trim().toLowerCase()
}

/** A `media` cell that is a bare filename (not an http/https/data URL). */
export function isBareFilename(media: string): boolean {
  const m = media.trim()
  return !!m && !/^https?:\/\//i.test(m) && !m.startsWith('data:')
}

/** Resolve a `media` cell value to a usable URL (synchronous, no cache lookup).
 *  - full URL (http...) / data: → used as-is (only visible online unless cached)
 *  - bare filename             → served from public/media/ (precached, offline-ready)
 */
export function resolveMedia(media: string): string {
  const m = media.trim()
  if (!m) return ''
  if (/^https?:\/\//i.test(m) || m.startsWith('data:')) return m
  return import.meta.env.BASE_URL + 'media/' + m.replace(/^\/+/, '')
}

/** Resolve to a displayable src, preferring the offline IndexedDB blob.
 *  - http/https/data → as-is
 *  - bare filename   → cached blob (object URL) if present, else public/media/ fallback
 *  Callers must revoke the returned URL when it starts with "blob:".
 */
export async function resolveMediaSrc(media: string): Promise<string> {
  const m = media.trim()
  if (!m) return ''
  if (!isBareFilename(m)) return m
  const cached = await loadMedia(normalizeMediaKey(m))
  if (cached) return URL.createObjectURL(cached.blob)
  return resolveMedia(m)
}

/** Decode a base64 string (no data: prefix) into a Blob of the given type. */
export function base64ToBlob(base64: string, mimeType: string): Blob {
  const bin = atob(base64)
  const bytes = new Uint8Array(bin.length)
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i)
  return new Blob([bytes], { type: mimeType })
}

/** Read a Blob as raw base64 (strips the `data:...;base64,` prefix). */
export function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const result = String(reader.result)
      const comma = result.indexOf(',')
      resolve(comma >= 0 ? result.slice(comma + 1) : result)
    }
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(blob)
  })
}

/** Downscale + re-encode an image File to a JPEG Blob (long edge ≤ maxEdge).
 *  Keeps base64 small so Apps Script uploads don't time out. Falls back to the
 *  original file if the browser can't decode it (e.g. some HEIC). */
export async function compressImage(file: File, maxEdge = 1280, quality = 0.8): Promise<Blob> {
  const url = URL.createObjectURL(file)
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const el = new Image()
      el.onload = () => resolve(el)
      el.onerror = () => reject(new Error('decode failed'))
      el.src = url
    })
    const scale = Math.min(1, maxEdge / Math.max(img.width, img.height))
    const w = Math.max(1, Math.round(img.width * scale))
    const h = Math.max(1, Math.round(img.height * scale))
    const canvas = document.createElement('canvas')
    canvas.width = w
    canvas.height = h
    const ctx = canvas.getContext('2d')
    if (!ctx) return file
    ctx.drawImage(img, 0, 0, w, h)
    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob((b) => resolve(b), 'image/jpeg', quality)
    )
    return blob ?? file
  } catch {
    return file
  } finally {
    URL.revokeObjectURL(url)
  }
}

/** Extract a YouTube video id, or '' if the url isn't a YouTube link. */
export function youTubeId(url: string): string {
  const m = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([\w-]{11})/)
  return m ? m[1] : ''
}
