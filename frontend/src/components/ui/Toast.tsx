import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle2, XCircle, Info, X } from 'lucide-react'

export type ToastType = 'success' | 'error' | 'info'

interface Toast {
  id: string
  message: string
  type: ToastType
  duration?: number
}

interface ToastContextValue {
  show: (message: string, type?: ToastType, duration?: number) => void
}

const ToastContext = createContext<ToastContextValue>({ show: () => {} })

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])
  const counterRef = useRef(0)

  const remove = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const show = useCallback((message: string, type: ToastType = 'info', duration = 3500) => {
    const id = `t-${Date.now()}-${counterRef.current++}`
    setToasts((prev) => {
      const next = [...prev, { id, message, type, duration }]
      return next.slice(-4)
    })
  }, [])

  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      <div className='toast-container' aria-live='polite' aria-atomic='true'>
        <AnimatePresence initial={false}>
          {toasts.map((toast) => (
            <ToastItem key={toast.id} toast={toast} onRemove={remove} />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  )
}

function ToastItem({ toast, onRemove }: { toast: Toast; onRemove: (id: string) => void }) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const duration = toast.duration ?? 3500
    timerRef.current = setTimeout(() => onRemove(toast.id), duration)
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [toast.id, toast.duration, onRemove])

  const icon =
    toast.type === 'success' ? (
      <CheckCircle2 size={17} />
    ) : toast.type === 'error' ? (
      <XCircle size={17} />
    ) : (
      <Info size={17} />
    )

  return (
    <motion.div
      className={`toast toast--${toast.type}`}
      initial={{ opacity: 0, y: 14, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.96 }}
      transition={{ duration: 0.22, ease: 'easeOut' }}
      role='alert'
    >
      <span className='toast-icon'>{icon}</span>
      <span className='toast-message'>{toast.message}</span>
      <button
        className='toast-close'
        onClick={() => onRemove(toast.id)}
        aria-label='Dismiss notification'
      >
        <X size={14} />
      </button>
    </motion.div>
  )
}

export function useToast(): ToastContextValue {
  return useContext(ToastContext)
}
