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
