import { cn, LogoIcon } from '@powercoach/ui'
import { type ReactElement, useEffect, useState } from 'react'

const MIN_DISPLAY_MS = 1000

interface Props {
  exiting?: boolean
}

export function LoadingOverlay({ exiting = false }: Props): ReactElement {
  const [minTimePassed, setMinTimePassed] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setMinTimePassed(true), MIN_DISPLAY_MS)
    return () => {
      clearTimeout(timer)
    }
  }, [])

  const shouldExit = exiting && minTimePassed

  return (
    <div
      aria-label="loading"
      className={cn(
        'absolute inset-0 bg-white dark:bg-black',
        shouldExit && 'pointer-events-none animate-clip-out-ltr'
      )}
    >
      <div className="absolute flex h-full w-full animate-fade-in items-center justify-center border-8 bg-black dark:bg-white test-white dark:text-black">
        <LogoIcon variant="white" />
      </div>
    </div>
  )
}
