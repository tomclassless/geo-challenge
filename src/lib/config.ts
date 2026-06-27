// The Apps Script web-app URL is configured by the teacher in the app (stored
// in localStorage) so they never have to edit code to point at their sheet.
const API_KEY = 'geo.apiUrl'

export function getApiUrl(): string {
  return localStorage.getItem(API_KEY) || ''
}

export function setApiUrl(url: string): void {
  localStorage.setItem(API_KEY, url.trim())
}
