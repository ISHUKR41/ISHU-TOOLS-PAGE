/**
 * Tiny localStorage helpers for personalised tool ordering.
 *
 * Lives in its own file (separate from AllToolsPage) so that React Fast Refresh
 * can keep working — Fast Refresh requires that any file exporting React
 * components NOT also export non-component values.
 */

import { API_BASE_URL } from '../api/config'

export const FAVORITES_KEY = 'ishu_fav_tools'
export const RECENT_KEY = 'ishu_recent_tools'
export const USAGE_KEY = 'ishu_tool_usage_v1'
export const RECENT_SEARCH_KEY = 'ishu_recent_searches_v1'
export const MAX_RECENT = 12
export const MAX_RECENT_SEARCHES = 6
const REMOTE_VISIT_ENDPOINT = `${API_BASE_URL}/api/popularity/visit`

function sendVisitTelemetry(slug: string) {
  if (!slug || typeof window === 'undefined') return

  const body = JSON.stringify({ slug })
  try {
    if (typeof navigator !== 'undefined' && typeof navigator.sendBeacon === 'function') {
      const blob = new Blob([body], { type: 'application/json' })
      if (navigator.sendBeacon(REMOTE_VISIT_ENDPOINT, blob)) return
    }

    void fetch(REMOTE_VISIT_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
      keepalive: true,
    }).catch(() => {
      // Ignore telemetry network failures.
    })
  } catch {
    // Ignore telemetry failures in restricted browser modes.
  }
}

export function loadFavorites(): Set<string> {
  try { return new Set(JSON.parse(localStorage.getItem(FAVORITES_KEY) ?? '[]')) }
  catch { return new Set() }
}

export function saveFavorites(f: Set<string>) {
  try { localStorage.setItem(FAVORITES_KEY, JSON.stringify([...f])) }
  catch { /* localStorage quota / disabled — silently ignore */ }
}

export function loadRecent(): string[] {
  try { return JSON.parse(localStorage.getItem(RECENT_KEY) ?? '[]') }
  catch { return [] }
}

export function loadUsage(): Record<string, number> {
  try { return JSON.parse(localStorage.getItem(USAGE_KEY) ?? '{}') }
  catch { return {} }
}

/** Recent search queries (for the command palette empty-state). */
export function loadRecentSearches(): string[] {
  try { return JSON.parse(localStorage.getItem(RECENT_SEARCH_KEY) ?? '[]') }
  catch { return [] }
}

export function pushRecentSearch(query: string) {
  const q = query.trim()
  if (!q || q.length < 2) return
  try {
    const next = [q, ...loadRecentSearches().filter((entry) => entry.toLowerCase() !== q.toLowerCase())]
    localStorage.setItem(RECENT_SEARCH_KEY, JSON.stringify(next.slice(0, MAX_RECENT_SEARCHES)))
  } catch { /* ignore */ }
}

export function clearRecentSearches() {
  try { localStorage.removeItem(RECENT_SEARCH_KEY) } catch { /* ignore */ }
}

/** Bump the visit counter and push the slug onto the recent list. */
export function trackToolVisit(slug: string) {
  try {
    const r = loadRecent().filter(s => s !== slug)
    r.unshift(slug)
    localStorage.setItem(RECENT_KEY, JSON.stringify(r.slice(0, MAX_RECENT)))
    const u = loadUsage()
    u[slug] = (u[slug] ?? 0) + 1
    localStorage.setItem(USAGE_KEY, JSON.stringify(u))
  } catch { /* ignore */ }

  sendVisitTelemetry(slug)
}
