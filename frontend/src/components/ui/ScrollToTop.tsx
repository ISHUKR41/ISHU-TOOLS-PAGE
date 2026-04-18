import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * ScrollToTop — Scrolls to the top of the page on every route change.
 * Must be placed inside <BrowserRouter>.
 * Fixes the critical UX issue where tool pages stay scrolled down.
 */
export default function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    // Use instant scroll (not smooth) to avoid disorientation on navigation
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [pathname])

  return null
}
