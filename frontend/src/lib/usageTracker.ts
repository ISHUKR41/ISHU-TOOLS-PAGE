/**
 * Tiny localStorage helpers for personalised tool ordering.
 *
 * Lives in its own file (separate from AllToolsPage) so that React Fast Refresh
 * can keep working — Fast Refresh requires that any file exporting React
 * components NOT also export non-component values.
 */

export const FAVORITES_KEY = 'ishu_fav_tools'
export const RECENT_KEY = 'ishu_recent_tools'
export const USAGE_KEY = 'ishu_tool_usage_v1'
export const MAX_RECENT = 12

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
}
