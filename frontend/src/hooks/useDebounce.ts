import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * useDebounce — Delays value updates until after a quiet period.
 * Perfect for search inputs, text field validation.
 */
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

/**
 * useThrottle — Limits value updates to at most once per interval.
 * Perfect for scroll position, mouse move tracking.
 */
export function useThrottle<T>(value: T, limitMs: number): T {
  const [throttledValue, setThrottledValue] = useState<T>(value)
  const lastUpdated = useRef<number>(0)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const now = Date.now()
    const remaining = limitMs - (now - lastUpdated.current)
    const delay = remaining <= 0 ? 0 : remaining

    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      lastUpdated.current = Date.now()
      setThrottledValue(value)
    }, delay)

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [value, limitMs])

  return throttledValue
}

/**
 * useThrottledCallback — Throttles a callback function.
 * Useful for scroll handlers, resize handlers, etc.
 */
export function useThrottledCallback<T extends (...args: unknown[]) => void>(
  callback: T,
  limitMs: number,
): T {
  const lastCalled = useRef<number>(0)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const callbackRef = useRef(callback)

  useEffect(() => {
    callbackRef.current = callback
  }, [callback])

  const throttled = useCallback(
    (...args: unknown[]) => {
      const now = Date.now()
      const remaining = limitMs - (now - lastCalled.current)

      if (remaining <= 0) {
        lastCalled.current = now
        callbackRef.current(...args)
      } else {
        if (timerRef.current) clearTimeout(timerRef.current)
        timerRef.current = setTimeout(() => {
          lastCalled.current = Date.now()
          callbackRef.current(...args)
        }, remaining)
      }
    },
    [limitMs],
  )

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  return throttled as T
}

/**
 * useDebouncedCallback — Debounces a callback function.
 * Useful for search handlers, form auto-save, etc.
 */
export function useDebouncedCallback<T extends (...args: unknown[]) => void>(
  callback: T,
  delayMs: number,
): T {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const callbackRef = useRef(callback)

  useEffect(() => {
    callbackRef.current = callback
  }, [callback])

  const debounced = useCallback(
    (...args: unknown[]) => {
      if (timerRef.current) clearTimeout(timerRef.current)
      timerRef.current = setTimeout(() => {
        callbackRef.current(...args)
      }, delayMs)
    },
    [delayMs],
  )

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  return debounced as T
}
