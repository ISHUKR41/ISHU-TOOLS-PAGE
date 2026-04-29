import { useEffect, useRef, useState } from 'react'

/**
 * useProgressiveList — render large arrays in chunks instead of all-at-once.
 *
 * Why: ISHU TOOLS has 1247+ tools. Mounting every <ToolCard /> on the first
 * paint of the homepage / all-tools page is what makes the initial render
 * janky on low-end phones (long task on the main thread, big LCP, jumpy CLS
 * if the grid grows in height after fonts/images settle).
 *
 * What: Returns a sliced view of `items` whose visible length grows from
 * `initial` → items.length in `step`-sized chunks during browser idle time.
 * The user perceives an instant first paint; the remaining cards stream in
 * before they can scroll past the first viewport.
 *
 * Reset behaviour: When `items.length` shrinks below the current visible
 * count (e.g. user typed a search query that filters down to 12 results)
 * we collapse to the new total immediately so we don't render stale slots.
 *
 * No 3rd-party dependency. No virtualization library. Plays nice with SSR
 * (returns the initial slice on first render so the static SEO HTML still
 * contains the most-important top tools).
 */
export interface UseProgressiveListOptions {
  /** How many items to render on the very first paint. Default: 240. */
  initial?: number
  /** How many items to add per idle tick. Default: 200. */
  step?: number
  /**
   * Pass `true` while the user is searching — search result sets are small
   * (almost always <100), so we skip chunking and render everything instantly
   * to avoid a perceptible "results growing" effect.
   */
  renderAll?: boolean
}

const ric: typeof window.requestIdleCallback =
  typeof window !== 'undefined' && typeof window.requestIdleCallback === 'function'
    ? window.requestIdleCallback.bind(window)
    : ((cb: IdleRequestCallback) => window.setTimeout(() => cb({
        didTimeout: false,
        timeRemaining: () => 16,
      } as IdleDeadline), 1) as unknown as number)

const cic: typeof window.cancelIdleCallback =
  typeof window !== 'undefined' && typeof window.cancelIdleCallback === 'function'
    ? window.cancelIdleCallback.bind(window)
    : ((id: number) => window.clearTimeout(id))

export function useProgressiveList<T>(
  items: readonly T[],
  options: UseProgressiveListOptions = {},
): { visible: T[]; isComplete: boolean; visibleCount: number; totalCount: number } {
  const { initial = 240, step = 200, renderAll = false } = options
  const total = items.length

  const [visibleCount, setVisibleCount] = useState<number>(() =>
    renderAll ? total : Math.min(initial, total),
  )

  const idleHandleRef = useRef<number | null>(null)

  useEffect(() => {
    // Cancel any pending tick from a previous items array.
    if (idleHandleRef.current !== null) {
      cic(idleHandleRef.current)
      idleHandleRef.current = null
    }

    if (renderAll) {
      // Render-all mode (search results, small lists): show everything now.
      if (visibleCount !== total) {
        idleHandleRef.current = ric(() => {
          idleHandleRef.current = null
          setVisibleCount(total)
        }, { timeout: 16 })
      }
      return
    }

    if (total <= initial) {
      if (visibleCount !== total) {
        idleHandleRef.current = ric(() => {
          idleHandleRef.current = null
          setVisibleCount(total)
        }, { timeout: 16 })
      }
      return
    }

    // If items shrank below current visible count (filtering), collapse.
    if (visibleCount > total) {
      idleHandleRef.current = ric(() => {
        idleHandleRef.current = null
        setVisibleCount(total)
      }, { timeout: 16 })
      return
    }

    // Reset to `initial` when the underlying list reference changes
    // significantly (e.g. category switch). We detect "significant" change
    // simply by checking if current visibleCount is way past total.
    if (visibleCount > total) {
      idleHandleRef.current = ric(() => {
        idleHandleRef.current = null
        setVisibleCount(Math.min(initial, total))
      }, { timeout: 16 })
      return
    }

    if (visibleCount >= total) return

    const tick = () => {
      idleHandleRef.current = null
      setVisibleCount((current) => {
        if (current >= total) return current
        return Math.min(current + step, total)
      })
    }

    idleHandleRef.current = ric(tick, { timeout: 120 })

    return () => {
      if (idleHandleRef.current !== null) {
        cic(idleHandleRef.current)
        idleHandleRef.current = null
      }
    }
  }, [items, total, initial, step, renderAll, visibleCount])

  // Re-clamp when items reference changes (filter/sort) so we don't expose
  // stale indices into a smaller array.
  const clampedCount = Math.min(visibleCount, total)
  const visible = clampedCount === total ? (items as T[]) : (items.slice(0, clampedCount) as T[])

  return {
    visible,
    isComplete: clampedCount >= total,
    visibleCount: clampedCount,
    totalCount: total,
  }
}
