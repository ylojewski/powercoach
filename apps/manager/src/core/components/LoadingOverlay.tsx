import { cn, LogoIcon } from '@powercoach/ui'
import { type AnimationEvent, type ReactElement, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'

interface Props {
  exiting?: boolean
  onClipInComplete?: () => void
  onClipOutComplete?: () => void
}

export function LoadingOverlay({
  exiting = false,
  onClipInComplete,
  onClipOutComplete
}: Props): ReactElement {
  const clipInCompleteRef = useRef(false)
  const clipOutCompleteRef = useRef(false)

  useEffect(() => {
    if (exiting) {
      clipOutCompleteRef.current = false
      return
    }

    clipInCompleteRef.current = false
  }, [exiting])

  function handleAnimationEnd(event: AnimationEvent<HTMLDivElement>): void {
    if (event.currentTarget !== event.target) {
      return
    }

    if (event.animationName === 'clip-in-ltr' && !clipInCompleteRef.current) {
      clipInCompleteRef.current = true
      onClipInComplete?.()
      return
    }

    if (event.animationName === 'clip-out-ltr' && !clipOutCompleteRef.current) {
      clipOutCompleteRef.current = true
      onClipOutComplete?.()
    }
  }

  const overlay = (
    <div
      aria-label="loading powercoach"
      className={cn('fixed inset-0 z-2147483647', exiting && 'pointer-events-none')}
    >
      <div
        className={cn(
          'flex h-full w-full items-center justify-center border-8 bg-black text-white dark:bg-white dark:text-black',
          exiting ? 'animate-clip-out-ltr' : 'animate-clip-in-ltr'
        )}
        onAnimationEnd={handleAnimationEnd}
      >
        <LogoIcon variant="white" />
      </div>
    </div>
  )

  return typeof document !== 'undefined' ? createPortal(overlay, document.body) : overlay
}
