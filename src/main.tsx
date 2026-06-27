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

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
)
