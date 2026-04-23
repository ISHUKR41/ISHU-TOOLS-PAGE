import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// ── Self-hosted variable fonts (no FOIT, no Google Fonts handshake) ───────────
// Inter (body) + Space Grotesk (display) — same look on every device, every OS.
import '@fontsource-variable/inter/index.css'
import '@fontsource-variable/space-grotesk/index.css'
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

// ── Idle-time route prefetch — warm next-likely chunks BEFORE the user clicks ──
// Strategy: after first paint settles, use requestIdleCallback to fetch the
// ToolPage + AllToolsPage chunks. By the time the user clicks anywhere, the JS
// is already in cache → navigation feels instant (zero loading flash).
function idlePrefetchRoutes() {
  const idle =
    (window as Window & { requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number })
      .requestIdleCallback || ((cb: () => void) => setTimeout(cb, 1500))
  idle(() => {
    // Dynamic imports the bundler turns into <link rel="modulepreload"> automatically.
    import('./features/tool/ToolPage.tsx').catch(() => {})
    import('./features/tools/AllToolsPage.tsx').catch(() => {})
    import('./features/category/CategoryPage.tsx').catch(() => {})
  }, { timeout: 3000 })
}
if (document.readyState === 'complete') idlePrefetchRoutes()
else window.addEventListener('load', idlePrefetchRoutes, { once: true, passive: true })

// ── Reduced-motion preference — respect OS-level "reduce motion" toggle ───────
// When enabled, all framer-motion + CSS animations are flattened to instant
// transitions globally via the `.reduced-motion` class hook in index.css.
const motionMQ = window.matchMedia('(prefers-reduced-motion: reduce)')
function applyReducedMotion() {
  document.documentElement.classList.toggle('reduced-motion', motionMQ.matches)
}
applyReducedMotion()
motionMQ.addEventListener?.('change', applyReducedMotion)

// ── Hardware-class detection — flag low-end devices to disable heavy effects ──
// Uses navigator.deviceMemory + hardwareConcurrency. Low-end devices skip
// blur, complex gradients, and orb animations via .low-power class.
function detectLowPower() {
  const nav = navigator as Navigator & { deviceMemory?: number; hardwareConcurrency?: number }
  const lowMem = (nav.deviceMemory ?? 8) <= 2
  const lowCpu = (nav.hardwareConcurrency ?? 8) <= 2
  if (lowMem || lowCpu) document.documentElement.classList.add('low-power')
}
detectLowPower()

// ── Adaptive Quality: Slow Network / Data-Saver Detection ─────────────────────
// If the user is on 2G / slow-2g / metered (saveData) connection, add a CSS
// class that collapses all heavy animations — same pattern used by Pinterest.
function applyAdaptiveQuality() {
  const conn = (navigator as unknown as { connection?: {
    effectiveType?: string; saveData?: boolean
  } }).connection
  if (!conn) return
  const isSlowOrSaving =
    conn.saveData ||
    conn.effectiveType === '2g' ||
    conn.effectiveType === 'slow-2g'
  if (isSlowOrSaving) {
    document.documentElement.classList.add('low-data-mode')
  }
}
applyAdaptiveQuality()

// ── PerformanceObserver: track real user CLS so we know if layout shifts ───────
// (data only — nothing surfaced to the user; used for future optimization)
if ('PerformanceObserver' in window) {
  try {
    const clsObserver = new PerformanceObserver((list) => {
      let clsTotal = 0
      for (const entry of list.getEntries()) {
        const e = entry as PerformanceEntry & { hadRecentInput?: boolean; value?: number }
        if (!e.hadRecentInput && e.value) clsTotal += e.value
      }
      if (clsTotal > 0.1) {
        // CLS > 0.1 is "needs improvement" — log silently for dev awareness
        if (import.meta.env.DEV) console.warn('[Perf] CLS:', clsTotal.toFixed(3))
      }
    })
    clsObserver.observe({ type: 'layout-shift', buffered: true })
  } catch { /* unsupported browser */ }
}

// ── Service Worker cleanup ────────────────────────────────────────────────────
// Older versions of this app shipped an aggressive caching SW that served a
// stale HTML shell from cache. We register a kill-switch SW that wipes every
// cache and unregisters itself, then we also proactively unregister any
// existing registrations and clear caches on the page itself. After the next
// load, no SW will be active.
if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      // Register the kill-switch so returning users get cleaned up.
      await navigator.serviceWorker.register('/sw.js', { scope: '/' }).catch(() => {})
      // Belt and suspenders: also unregister everything from the page side.
      const regs = await navigator.serviceWorker.getRegistrations()
      await Promise.all(regs.map((r) => r.unregister().catch(() => {})))
      if ('caches' in window) {
        const names = await caches.keys()
        await Promise.all(names.map((n) => caches.delete(n).catch(() => false)))
      }
    } catch { /* ignore */ }
  })
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
