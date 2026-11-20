import { useMediaQuery } from '@powercoach/ui'
import { useEffect } from 'react'

export function SystemTheme(): null {
  const prefersDark = useMediaQuery('(prefers-color-scheme: dark)')

  useEffect(() => {
    document.documentElement.classList.toggle('dark', prefersDark)
  }, [prefersDark])

  return null
}
