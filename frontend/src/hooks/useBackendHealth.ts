import { useEffect, useRef, useState } from 'react'
import { checkHealth } from '../api/toolsApi'

/**
 * useBackendHealth — lightweight liveness watcher for the Render-hosted API.
 *
 * Why: ISHU TOOLS' backend lives on Render's free tier, which spins down
 * after ~15 minutes of inactivity. The next request then takes 20-50s while
 * the container cold-starts, and any tool the user clicks during that window
 * fails with a cryptic timeout. Telling the user "server is waking up — give
 * it 20 seconds" upfront is dramatically better UX than letting them see
 * mystery errors.
 *
 * Strategy:
 *   1. On mount, do ONE health probe with a short timeout.
 *   2. If healthy → status='ok', no further work. Re-probes only if a tool
 *      execution fails (the consumer can call `revalidate()` after a fail).
 *   3. If the first probe fails → status='waking', start polling every 4s
 *      with a longer timeout until it comes back, then flip to 'ok'.
 *   4. If still failing after ~60s of polling → status='down'.
 *
 * No external lib. No re-renders during the steady-state ('ok') case.
 */

export type BackendStatus = 'unknown' | 'ok' | 'waking' | 'down'

const COLD_START_BUDGET_MS = 60_000
const POLL_INTERVAL_MS = 4_000

export function useBackendHealth(): {
  status: BackendStatus
  revalidate: () => void
} {
  const [status, setStatus] = useState<BackendStatus>('unknown')
  const wakingSinceRef = useRef<number | null>(null)
  const timerRef = useRef<number | null>(null)
  const cancelledRef = useRef(false)

  useEffect(() => {
    cancelledRef.current = false

    const clearTimer = () => {
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current)
        timerRef.current = null
      }
    }

    async function probe(): Promise<void> {
      try {
        await checkHealth()
        if (cancelledRef.current) return
        wakingSinceRef.current = null
        setStatus('ok')
      } catch {
        if (cancelledRef.current) return
        const now = Date.now()
        if (wakingSinceRef.current === null) {
          wakingSinceRef.current = now
          setStatus('waking')
        } else if (now - wakingSinceRef.current >= COLD_START_BUDGET_MS) {
          setStatus('down')
        }
        // Schedule another poll regardless (even when 'down' — server may
        // recover; we just keep the badge red until it does).
        timerRef.current = window.setTimeout(probe, POLL_INTERVAL_MS)
      }
    }

    // First probe runs after a short delay so we don't compete with the
    // initial catalog fetches the homepage already issues.
    timerRef.current = window.setTimeout(probe, 1500)

    return () => {
      cancelledRef.current = true
      clearTimer()
    }
  }, [])

  const revalidate = () => {
    // Force-re-probe — used when a tool execution fails so we can flip the
    // banner on if the failure was due to a cold start.
    if (status === 'ok') setStatus('unknown')
    wakingSinceRef.current = Date.now()
    void checkHealth()
      .then(() => setStatus('ok'))
      .catch(() => setStatus('waking'))
  }

  return { status, revalidate }
}
