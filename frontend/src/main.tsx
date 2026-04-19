import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// ── CSS is loaded as a render-blocking <link> in index.html ───────────────────
// This is the correct approach — CSS loads BEFORE any JS runs, ensuring the page
// is ALWAYS fully styled from the very first paint. Never import CSS via JS
// modules (which inject styles AFTER JS executes, causing FOUC).
// See: index.html <link rel="stylesheet" href="/src/index.css" />
import App from './App.tsx'

// ── FAANG-Grade CLS & FOUC Prevention ─────────────────────────────────────────
// Phase 1: Suppress ALL transitions/animations on first paint.
//   This prevents any framer-motion entrance animation from causing
//   perceived "jumpiness" during the first React hydration cycle.
//   We re-enable after React has committed its first real paint.
document.documentElement.classList.add('js-loading')

// Phase 2: Re-enable after first real paint completes.
//   Two rAF frames guarantees the browser has painted at least once.
requestAnimationFrame(() => {
  requestAnimationFrame(() => {
    document.documentElement.classList.remove('js-loading')
    document.documentElement.classList.add('js-ready')
  })
})

// ── Instant Window Resize Handler ─────────────────────────────────────────────
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
