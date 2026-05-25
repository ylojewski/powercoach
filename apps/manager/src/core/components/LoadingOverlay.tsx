import { cn, LogoIcon } from '@powercoach/ui'
import { type AnimationEvent, type ReactElement, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'

interface Props {
  contained?: boolean
  exiting?: boolean
  onClipInComplete?: () => void
  onClipOutComplete?: () => void
}

export function LoadingOverlay({
  contained = false,
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
      className={cn(
        contained ? 'absolute inset-0 z-20' : 'fixed inset-0 z-2147483647',
        exiting && 'pointer-events-none'
      )}
    >
      <div
        className={cn(
          'flex h-full w-full items-center justify-center border-8 bg-foreground text-background',
          exiting ? 'animate-clip-out-ltr' : 'animate-clip-in-ltr'
        )}
        onAnimationEnd={handleAnimationEnd}
      >
        <LogoIcon variant="background" />
      </div>
    </div>
  )

  if (contained || typeof document === 'undefined') {
    return overlay
  }

  return createPortal(overlay, document.body)
}
