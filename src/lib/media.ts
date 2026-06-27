/** Resolve a `media` cell value to a usable URL.
 *  - full URL (http...) → used as-is (only visible online unless cached)
 *  - bare filename       → served from public/media/ (precached, offline-ready)
 */
export function resolveMedia(media: string): string {
  const m = media.trim()
  if (!m) return ''
  if (/^https?:\/\//i.test(m) || m.startsWith('data:')) return m
  return import.meta.env.BASE_URL + 'media/' + m.replace(/^\/+/, '')
}

/** Extract a YouTube video id, or '' if the url isn't a YouTube link. */
export function youTubeId(url: string): string {
  const m = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([\w-]{11})/)
  return m ? m[1] : ''
}
