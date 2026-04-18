import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Download, X, Smartphone, Monitor } from 'lucide-react'

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export default function InstallPWA() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showBanner, setShowBanner] = useState(false)
  const [showFloating, setShowFloating] = useState(false)
  const [installed, setInstalled] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    // Check if already dismissed or installed
    const wasDismissed = localStorage.getItem('pwa-banner-dismissed')
    const wasInstalled = localStorage.getItem('pwa-installed')
    if (wasDismissed || wasInstalled) {
      setDismissed(true)
      return
    }

    // Check if already in standalone mode (already installed)
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setInstalled(true)
      return
    }

    const handler = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      // Show banner after 3 seconds
      setTimeout(() => setShowBanner(true), 3000)
      // Show floating button after 8 seconds
      setTimeout(() => setShowFloating(true), 8000)
    }

    window.addEventListener('beforeinstallprompt', handler)

    // iOS detection (Safari doesn't support beforeinstallprompt)
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
    const isInStandaloneMode = ('standalone' in window.navigator) && (window.navigator as Navigator & { standalone?: boolean }).standalone
    if (isIOS && !isInStandaloneMode && !wasDismissed) {
      setTimeout(() => setShowBanner(true), 5000)
    }

    window.addEventListener('appinstalled', () => {
      setInstalled(true)
      setShowBanner(false)
      setShowFloating(false)
      localStorage.setItem('pwa-installed', 'true')
    })

    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt) return
    await deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    if (outcome === 'accepted') {
      setInstalled(true)
      localStorage.setItem('pwa-installed', 'true')
    }
    setShowBanner(false)
    setShowFloating(false)
    setDeferredPrompt(null)
  }

  const handleDismiss = () => {
    setShowBanner(false)
    setDismissed(true)
    localStorage.setItem('pwa-banner-dismissed', Date.now().toString())
  }

  if (installed || dismissed) return null

  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent)

  return (
    <>
      {/* Bottom Banner */}
      <AnimatePresence>
        {showBanner && (
          <motion.div
            initial={{ y: 120, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 120, opacity: 0 }}
            transition={{ type: 'spring', damping: 20, stiffness: 200 }}
            style={{
              position: 'fixed',
              bottom: 0,
              left: 0,
              right: 0,
              zIndex: 9999,
              padding: '16px',
              background: 'linear-gradient(135deg, rgba(10,15,30,0.98) 0%, rgba(20,25,50,0.98) 100%)',
              backdropFilter: 'blur(20px)',
              borderTop: '1px solid rgba(59,208,255,0.2)',
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              boxShadow: '0 -8px 40px rgba(0,0,0,0.5)',
            }}
          >
            <div style={{
              width: 48,
              height: 48,
              borderRadius: 12,
              background: 'linear-gradient(135deg, #3bd0ff, #a78bfa)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}>
              <span style={{ fontSize: 22, fontWeight: 800, color: '#0a0f1e' }}>IT</span>
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#fff', marginBottom: 2 }}>
                Install ISHU TOOLS App
              </div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', lineHeight: 1.4 }}>
                {isIOS
                  ? 'Tap Share → "Add to Home Screen" to install'
                  : 'Add to home screen for instant access — works offline!'
                }
              </div>
            </div>

            <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
              {!isIOS && deferredPrompt && (
                <button
                  onClick={handleInstall}
                  style={{
                    padding: '8px 16px',
                    borderRadius: 8,
                    border: 'none',
                    background: 'linear-gradient(135deg, #3bd0ff, #a78bfa)',
                    color: '#0a0f1e',
                    fontWeight: 700,
                    fontSize: 13,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    whiteSpace: 'nowrap',
                  }}
                >
                  <Download size={14} />
                  Install
                </button>
              )}
              <button
                onClick={handleDismiss}
                style={{
                  padding: '8px',
                  borderRadius: 8,
                  border: '1px solid rgba(255,255,255,0.15)',
                  background: 'transparent',
                  color: 'rgba(255,255,255,0.5)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <X size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Install Button */}
      <AnimatePresence>
        {showFloating && !showBanner && deferredPrompt && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleInstall}
            title="Install ISHU TOOLS as App"
            style={{
              position: 'fixed',
              bottom: 24,
              right: 24,
              zIndex: 9998,
              width: 56,
              height: 56,
              borderRadius: '50%',
              border: 'none',
              background: 'linear-gradient(135deg, #3bd0ff, #a78bfa)',
              color: '#0a0f1e',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 20px rgba(59,208,255,0.4)',
            }}
          >
            <Smartphone size={22} />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  )
}
