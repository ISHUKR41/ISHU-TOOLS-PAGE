import { useEffect, useState, useCallback } from 'react'
import { Pin, X as XIcon } from 'lucide-react'

import { loadUsage } from '../../../lib/usageTracker'
import { usePinnedTools } from '../../../hooks/usePinnedTools'

type Props = {
  slug: string
  title: string
}

const VISIT_THRESHOLD = 5
const DISMISS_KEY_PREFIX = 'ishu:pin_dismissed:'

/**
 * PinSuggestionBanner — gentle one-line nudge that appears at the top of
 * a tool page when the user has clearly become a power-user of that tool.
 *
 * Trigger conditions (ALL must be true, otherwise renders nothing):
 *   1. The user has opened this exact tool ≥ 5 times (loadUsage()).
 *   2. The tool isn't already in their pinned/favorites list.
 *   3. They haven't previously dismissed the banner for this tool.
 *
 * Why a banner not a popup:
 *   - Zero layout shift on first paint (banner mounts after usage check).
 *   - One row of height, dismissable, never blocks the actual tool UI.
 *   - Reuses the existing pin infrastructure — no new state to think about.
 */
export default function PinSuggestionBanner({ slug, title }: Props) {
  const { isPinned, toggle } = usePinnedTools()
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (!slug) return
    if (isPinned(slug)) return
    let dismissed = false
    try {
      dismissed = localStorage.getItem(DISMISS_KEY_PREFIX + slug) === '1'
    } catch {
      // Private mode / blocked storage — banner stays hidden, no harm.
    }
    if (dismissed) return
    const visits = loadUsage()[slug] ?? 0
    if (visits < VISIT_THRESHOLD) return
    const frame = requestAnimationFrame(() => setShow(true))
    return () => cancelAnimationFrame(frame)
  }, [slug, isPinned])

  const handlePin = useCallback(() => {
    toggle(slug)
    setShow(false)
  }, [slug, toggle])

  const handleDismiss = useCallback(() => {
    try {
      localStorage.setItem(DISMISS_KEY_PREFIX + slug, '1')
    } catch {
      // ignore storage failures — UI dismissal still works
    }
    setShow(false)
  }, [slug])

  if (!show) return null

  return (
    <div
      className='pin-suggestion-banner'
      role='status'
      aria-label={`Suggestion: pin ${title} to your favorites`}
    >
      <Pin size={14} className='pin-suggestion-icon' />
      <span className='pin-suggestion-text'>
        You use <strong>{title}</strong> often — pin it for instant access from the homepage?
      </span>
      <div className='pin-suggestion-actions'>
        <button type='button' className='pin-suggestion-pin-btn' onClick={handlePin}>
          Pin to favorites
        </button>
        <button
          type='button'
          className='pin-suggestion-dismiss'
          onClick={handleDismiss}
          aria-label='Dismiss suggestion'
          title='Dismiss'
        >
          <XIcon size={14} />
        </button>
      </div>
    </div>
  )
}
