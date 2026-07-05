import { useEffect, useState } from 'react'

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)' as const

export function useTabsIndicatorReducedMotion(): boolean {
  const [reducedMotion, setReducedMotion] = useState(
    () => globalThis.matchMedia?.(REDUCED_MOTION_QUERY).matches ?? false
  )

  useEffect(() => {
    const mediaQuery = globalThis.matchMedia?.(REDUCED_MOTION_QUERY)

    if (mediaQuery === undefined) {
      return
    }

    const syncPreference = () => setReducedMotion(mediaQuery.matches)

    mediaQuery.addEventListener?.('change', syncPreference)

    return () => mediaQuery.removeEventListener?.('change', syncPreference)
  }, [])

  return reducedMotion
}
