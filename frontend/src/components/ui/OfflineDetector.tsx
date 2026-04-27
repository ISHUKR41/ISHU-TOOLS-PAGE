import { useEffect, useState } from 'react'
import { WifiOff, Wifi } from 'lucide-react'

/**
 * OfflineDetector — a global banner that detects when the user's internet
 * connection drops and shows a persistent, friendly message. Auto-dismisses
 * when the connection is restored.
 *
 * Mount once in App.tsx. Uses navigator.onLine + online/offline events.
 * Tools that work 100% client-side (calculators, text tools, hash generators)
 * continue working normally even when offline.
 */
export default function OfflineDetector() {
  const [isOffline, setIsOffline] = useState(() => !navigator.onLine)
  const [justReconnected, setJustReconnected] = useState(false)

  useEffect(() => {
    function handleOffline() {
      setIsOffline(true)
      setJustReconnected(false)
    }

    function handleOnline() {
      setIsOffline(false)
      setJustReconnected(true)
      // Auto-hide "Back online" after 3 seconds
      setTimeout(() => setJustReconnected(false), 3000)
    }

    window.addEventListener('offline', handleOffline)
    window.addEventListener('online', handleOnline)

    return () => {
      window.removeEventListener('offline', handleOffline)
      window.removeEventListener('online', handleOnline)
    }
  }, [])

  if (!isOffline && !justReconnected) return null

  return (
    <div
      role='alert'
      aria-live='assertive'
      className='offline-detector-banner'
      data-state={isOffline ? 'offline' : 'reconnected'}
    >
      {isOffline ? (
        <>
          <WifiOff size={16} aria-hidden='true' />
          <span>
            You are offline. Client-side tools (calculators, text tools, converters) still work.
            Server-based tools need an internet connection.
          </span>
        </>
      ) : (
        <>
          <Wifi size={16} aria-hidden='true' />
          <span>Back online — all tools are available again.</span>
        </>
      )}
    </div>
  )
}
