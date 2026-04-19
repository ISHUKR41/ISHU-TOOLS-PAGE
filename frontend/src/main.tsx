import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// ── Instant Responsiveness: Disable transitions during window resize ──────────
// This prevents the "slow/delayed" responsiveness effect. Used by Google,
// Apple, and other FAANG companies to ensure layout snaps instantly on resize.
let resizeTimer: ReturnType<typeof setTimeout> | null = null
function disableTransitionsDuringResize() {
  document.documentElement.classList.add('resizing')
  if (resizeTimer) clearTimeout(resizeTimer)
  resizeTimer = setTimeout(() => {
    document.documentElement.classList.remove('resizing')
    resizeTimer = null
  }, 150)
}
window.addEventListener('resize', disableTransitionsDuringResize, { passive: true })

// ── Register Service Worker for PWA support ───────────────────────────────────
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js', { scope: '/' })
      .then((registration) => {
        setInterval(() => registration.update(), 60 * 60 * 1000)
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                newWorker.postMessage({ type: 'SKIP_WAITING' })
              }
            })
          }
        })
      })
      .catch(() => {})
  })
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
