import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'

/** Scale the fixed 1100×780 tablet frame to fit the viewport (letterboxed). */
function scaleFrame() {
  const f = document.getElementById('frame')
  if (!f) return
  const s = Math.min(window.innerWidth / 1100, window.innerHeight / 780, 1)
  f.style.transform = 'scale(' + s + ')'
}
window.addEventListener('resize', scaleFrame)
scaleFrame()

// When a new version's service worker takes control, reload once so the device
// always runs the latest build (avoids being stuck on a cached old version).
if ('serviceWorker' in navigator) {
  let hadController = !!navigator.serviceWorker.controller
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (!hadController) {
      hadController = true // first install on this device — no reload needed
      return
    }
    window.location.reload()
  })
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
)
