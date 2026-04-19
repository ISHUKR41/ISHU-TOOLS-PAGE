import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// ── FAANG-Grade Instant Responsiveness ────────────────────────────────────────
// Strategy: disable ALL transitions the MOMENT resize begins (not after debounce).
// Then re-enable only after layout has fully settled (requestAnimationFrame chain).
// This is exactly what Google, Apple, Netflix, Stripe do internally.
// Result: layout snaps INSTANTLY at every pixel during drag-resize.
let resizeRaf: number | null = null
let resizeTimer: ReturnType<typeof setTimeout> | null = null

function onResizeStart() {
  document.documentElement.classList.add('resizing')
  if (resizeRaf) { cancelAnimationFrame(resizeRaf); resizeRaf = null }
  if (resizeTimer) { clearTimeout(resizeTimer); resizeTimer = null }
}

function scheduleResizeEnd() {
  if (resizeTimer) clearTimeout(resizeTimer)
  resizeTimer = setTimeout(() => {
    // Wait for two RAF cycles to ensure layout paint is done
    resizeRaf = requestAnimationFrame(() => {
      resizeRaf = requestAnimationFrame(() => {
        document.documentElement.classList.remove('resizing')
        resizeRaf = null
        resizeTimer = null
      })
    })
  }, 50)
}

window.addEventListener('resize', () => {
  onResizeStart()
  scheduleResizeEnd()
}, { passive: true })

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
