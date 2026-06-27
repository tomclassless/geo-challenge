// The Apps Script web-app URL is configured by the teacher in the app (stored
// in localStorage) so they never have to edit code to point at their sheet.
const API_KEY = 'geo.apiUrl'

// OPTIONAL: hard-code your Apps Script /exec URL here so EVERY device works with
// zero setup (no per-device entry, no QR parameter needed). Leave '' to keep it
// per-device / use ?api= links instead.
const DEFAULT_API_URL = ''

export function getApiUrl(): string {
  return localStorage.getItem(API_KEY) || DEFAULT_API_URL
}

export function setApiUrl(url: string): void {
  localStorage.setItem(API_KEY, url.trim())
}

/**
 * If the page was opened with ?api=<url> (e.g. a QR link that carries the
 * backend URL), persist it so the device is configured automatically.
 * Returns true if a new URL was adopted.
 */
export function adoptApiFromUrl(): boolean {
  try {
    const api = new URLSearchParams(window.location.search).get('api')
    if (api && api.trim()) {
      setApiUrl(api)
      return true
    }
  } catch {
    /* ignore */
  }
  return false
}
