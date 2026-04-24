// ─── Tool route hover-prefetch helper ──────────────────────────────────────
// On hover/focus of a ToolCard we warm up everything the /tools/:slug route
// will need — code chunks (ToolPage, toolFields, seoData) plus the tool's
// definition from the API. By the time the user actually clicks, the chunk
// is parsed and the tool data is in the in-memory cache, so the navigation
// transition feels instant (no spinner, no jank).
//
// Idempotent: each chunk and slug is only prefetched once per page session.

import { fetchTool } from '../api/toolsApi'

// Track what we've already kicked off so we don't spam the network on
// repeated hover/focus events.
const prefetchedSlugs = new Set<string>()
let chunksWarmed = false

// Warm the route-level code chunks. We import them lazily so they get
// downloaded + parsed in the background. Promises are intentionally
// fire-and-forget; failures are swallowed (worst case: a normal click
// navigation, same as today).
function warmRouteChunks(): void {
  if (chunksWarmed) return
  chunksWarmed = true
  void import('../features/tool/ToolPage')
  void import('../features/tool/toolFields')
  void import('../lib/seoData')
}

// Schedule using requestIdleCallback when the browser is idle so we never
// fight with what the user is currently doing. Falls back to a tiny
// setTimeout for browsers (Safari) that lack rIC.
function whenIdle(fn: () => void) {
  type RIC = (cb: () => void, opts?: { timeout?: number }) => number
  const w = window as unknown as { requestIdleCallback?: RIC }
  const ric = w.requestIdleCallback
  if (typeof ric === 'function') ric(fn, { timeout: 800 })
  else setTimeout(fn, 60)
}

/**
 * Trigger a one-shot prefetch for a specific tool slug.
 * Safe to call from onMouseEnter / onFocus / touchstart handlers.
 */
export function prefetchToolRoute(slug: string): void {
  if (!slug || prefetchedSlugs.has(slug)) return
  prefetchedSlugs.add(slug)

  whenIdle(() => {
    warmRouteChunks()
    // Network call is also wrapped in idle so it doesn't compete with
    // any in-flight critical requests (catalog, popularity).
    void fetchTool(slug).catch(() => {
      // Silently ignore — ToolPage will retry with its own error UI.
    })
  })
}
