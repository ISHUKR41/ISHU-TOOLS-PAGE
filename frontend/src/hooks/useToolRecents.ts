import { useEffect, useState } from 'react'

/**
 * useToolRecents — tiny localStorage-backed "recently opened tools" tracker.
 *
 * Why: with 1247 tools in the catalogue, returning users want to land back
 * on whatever they were working on without re-searching. We store the last
 * 24 unique slugs they opened, surface the freshest 6 in a dedicated row
 * above the main grid on the homepage, and let users page through the
 * older entries via the "Show older" toggle. 100% client-side (no backend
 * trip, no privacy concern, works offline).
 *
 * Why 24 (not 8)? The homepage Recently Used row pages through history in
 * slates of 6, mirroring the Suggested row's shuffle UX. 24 gives 4 slates
 * of depth — enough for a returning power user to dig back into something
 * they touched a week ago — while still being trivially small in storage
 * (~1KB max even with the longest slugs).
 *
 * Cross-tab sync via the native `storage` event + an in-page custom event
 * so the homepage updates instantly the moment a tool page is opened.
 *
 * Failure modes (private mode, blocked storage, JSON corruption) are
 * silently swallowed — the worst case is "no recents row", never a crash.
 */

const KEY = 'ishu:recent_tools_v1'
const MAX_ITEMS = 24
const CHANGE_EVENT = 'ishu:recent-tools-changed'

function readRecents(): string[] {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.filter((s) => typeof s === 'string' && s.length > 0)
  } catch {
    return []
  }
}

/**
 * Record that the user just opened a tool. Idempotent for repeated calls
 * with the same slug (we just bump it to the front).
 *
 * Safe to call from a `useEffect` mount in ToolPage — it never throws,
 * never blocks, and never re-renders the caller.
 */
export function recordToolOpen(slug: string): void {
  if (!slug) return
  try {
    const current = readRecents().filter((s) => s !== slug)
    current.unshift(slug)
    if (current.length > MAX_ITEMS) current.length = MAX_ITEMS
    localStorage.setItem(KEY, JSON.stringify(current))
    // Notify any in-page listeners (homepage row) immediately.
    window.dispatchEvent(new CustomEvent(CHANGE_EVENT))
  } catch {
    /* localStorage unavailable — graceful no-op */
  }
}

/**
 * Subscribe to the recent-tools list. Re-renders on:
 *   - same-tab updates (custom event from `recordToolOpen`)
 *   - cross-tab updates (native `storage` event)
 */
export function useToolRecents(): string[] {
  const [slugs, setSlugs] = useState<string[]>(readRecents)

  useEffect(() => {
    const sync = () => setSlugs(readRecents())
    window.addEventListener(CHANGE_EVENT, sync)
    window.addEventListener('storage', sync)
    return () => {
      window.removeEventListener(CHANGE_EVENT, sync)
      window.removeEventListener('storage', sync)
    }
  }, [])

  return slugs
}
