import { useEffect, useState } from 'react'

function resolveInitialValue<T>(initialValue: T | (() => T)): T {
  return initialValue instanceof Function ? initialValue() : initialValue
}

export function useSessionState<T>(key: string, initialValue: T | (() => T)) {
  const [state, setState] = useState<T>(() => {
    const fallback = resolveInitialValue(initialValue)

    if (typeof window === 'undefined') {
      return fallback
    }

    try {
      const storedValue = window.sessionStorage.getItem(key)
      return storedValue ? (JSON.parse(storedValue) as T) : fallback
    } catch {
      return fallback
    }
  })

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    try {
      window.sessionStorage.setItem(key, JSON.stringify(state))
    } catch {
      // Ignore storage write failures and keep the in-memory state.
    }
  }, [key, state])

  return [state, setState] as const
}