import { useEffect, useState, useCallback } from 'react'

/**
 * usePinnedTools — localStorage-backed "favorites/pinned tools" list.
 *
 * Sister hook to useToolRecents but with explicit user intent: the user
 * actively chose to pin these tools, so they get a dedicated row at the
 * very top of the homepage that survives forever (recents naturally
 * decay as the user opens new tools).
 *
 * Newest pin appears first. Cap at 12 to keep the row readable on mobile.
 *
 * Cross-tab sync via the native `storage` event + an in-page custom event
 * so every visible ToolCard re-renders the moment a pin is toggled.
 *
 * All failure modes (private mode, blocked storage, JSON corruption) are
 * silently swallowed — the worst case is "no pinned row", never a crash.
 */

const KEY = 'ishu:pinned_tools_v1'
const MAX_ITEMS = 12
const CHANGE_EVENT = 'ishu:pinned-tools-changed'

function readPinned(): string[] {
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

function writePinned(slugs: string[]): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(slugs))
    window.dispatchEvent(new CustomEvent(CHANGE_EVENT))
  } catch {
    /* localStorage unavailable — graceful no-op */
  }
}

/**
 * Toggle the pinned state of a tool. Returns the new pinned state
 * so the caller can show toast/feedback without re-reading storage.
 */
export function toggleToolPin(slug: string): boolean {
  if (!slug) return false
  const current = readPinned()
  const idx = current.indexOf(slug)
  if (idx >= 0) {
    current.splice(idx, 1)
    writePinned(current)
    return false
  }
  current.unshift(slug)
  if (current.length > MAX_ITEMS) current.length = MAX_ITEMS
  writePinned(current)
  return true
}

/**
 * Subscribe to the pinned-tools list. Re-renders on:
 *   - same-tab updates (custom event from `toggleToolPin`)
 *   - cross-tab updates (native `storage` event)
 *
 * Also exposes a stable `isPinned(slug)` callback so individual ToolCards
 * can check their state without subscribing to the whole list (the list
 * itself is shared via context-free state below).
 */
export function usePinnedTools() {
  const [slugs, setSlugs] = useState<string[]>(readPinned)

  useEffect(() => {
    const sync = () => setSlugs(readPinned())
    window.addEventListener(CHANGE_EVENT, sync)
    window.addEventListener('storage', sync)
    return () => {
      window.removeEventListener(CHANGE_EVENT, sync)
      window.removeEventListener('storage', sync)
    }
  }, [])

  const isPinned = useCallback((slug: string) => slugs.includes(slug), [slugs])

  return { slugs, isPinned, toggle: toggleToolPin, max: MAX_ITEMS }
}
