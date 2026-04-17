import { useEffect, useRef, useState } from 'react'

export function useDebounce<T>(value: T, delayMs: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      setDebouncedValue(value)
    }, delayMs)
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [value, delayMs])

  return debouncedValue
}

export function useThrottle<T>(value: T, limitMs: number): T {
  const [throttledValue, setThrottledValue] = useState<T>(value)
  const lastUpdated = useRef<number>(0)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const now = Date.now()
    const remaining = limitMs - (now - lastUpdated.current)

    if (remaining <= 0) {
      lastUpdated.current = now
      setThrottledValue(value)
    } else {
      if (timerRef.current) clearTimeout(timerRef.current)
      timerRef.current = setTimeout(() => {
        lastUpdated.current = Date.now()
        setThrottledValue(value)
      }, remaining)
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [value, limitMs])

  return throttledValue
}
