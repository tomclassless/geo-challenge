import { getApiUrl } from './config'
import type { AnswerResult, BanksPayload } from './types'

/** Download all banks / players / config from the Google Sheet. */
export async function fetchBanks(): Promise<BanksPayload> {
  const url = getApiUrl()
  if (!url) throw new Error('尚未設定後端網址')
  const res = await fetch(url, { method: 'GET', redirect: 'follow' })
  if (!res.ok) throw new Error('下載題庫失敗 (' + res.status + ')')
  return (await res.json()) as BanksPayload
}

/**
 * Upload result rows. We send Content-Type text/plain on purpose: it keeps the
 * request "simple" so the browser skips the CORS preflight that Apps Script
 * web apps cannot answer. The body is still JSON.
 */
export async function pushResults(rows: AnswerResult[]): Promise<void> {
  const url = getApiUrl()
  if (!url) throw new Error('尚未設定後端網址')
  const res = await fetch(url, {
    method: 'POST',
    redirect: 'follow',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify({ results: rows })
  })
  if (!res.ok) throw new Error('上傳成績失敗 (' + res.status + ')')
}

/** Overwrite the cloud Players (roster) list so every device shares it. */
export async function pushRoster(players: string[]): Promise<void> {
  const url = getApiUrl()
  if (!url) throw new Error('尚未設定後端網址')
  const res = await fetch(url, {
    method: 'POST',
    redirect: 'follow',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify({ players })
  })
  if (!res.ok) throw new Error('更新雲端名單失敗 (' + res.status + ')')
}

/**
 * Upload a question image to the backend (Apps Script → Google Drive). The
 * backend auto-generates the filename from region+id, stores the file, and
 * writes the filename + type=image back into that question's sheet row.
 * `dataBase64` is the raw base64 (no data: prefix). text/plain avoids preflight.
 */
export async function uploadQuestionMedia(
  region: string,
  id: string,
  mimeType: string,
  dataBase64: string
): Promise<{ ok: boolean; name?: string; type?: string; updatedAt?: string; error?: string }> {
  const url = getApiUrl()
  if (!url) throw new Error('尚未設定後端網址')
  const res = await fetch(url, {
    method: 'POST',
    redirect: 'follow',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify({ upload: { region, id, mimeType, dataBase64 } })
  })
  if (!res.ok) throw new Error('上傳圖片失敗 (' + res.status + ')')
  return (await res.json()) as { ok: boolean; name?: string; type?: string; updatedAt?: string; error?: string }
}

/**
 * Write a question's media + type back to the sheet without uploading a file
 * (e.g. a YouTube link, or clearing the media). text/plain avoids preflight.
 */
export async function setQuestionMedia(
  region: string,
  id: string,
  media: string,
  type: string
): Promise<{ ok: boolean; error?: string }> {
  const url = getApiUrl()
  if (!url) throw new Error('尚未設定後端網址')
  const res = await fetch(url, {
    method: 'POST',
    redirect: 'follow',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify({ setMedia: { region, id, media, type } })
  })
  if (!res.ok) throw new Error('更新題目失敗 (' + res.status + ')')
  return (await res.json()) as { ok: boolean; error?: string }
}

/**
 * Download one media file's bytes (base64) from the backend. Drive direct links
 * are blocked by CORS, so we always relay through Apps Script. Returns null if
 * the file isn't found.
 */
export async function fetchMedia(
  name: string
): Promise<{ dataBase64: string; mimeType: string } | null> {
  const url = getApiUrl()
  if (!url) throw new Error('尚未設定後端網址')
  const res = await fetch(url + '?media=' + encodeURIComponent(name), {
    method: 'GET',
    redirect: 'follow'
  })
  if (!res.ok) throw new Error('下載圖片失敗 (' + res.status + ')')
  const data = (await res.json()) as { ok?: boolean; dataBase64?: string; mimeType?: string }
  if (!data.ok || !data.dataBase64) return null
  return { dataBase64: data.dataBase64, mimeType: data.mimeType || 'application/octet-stream' }
}
