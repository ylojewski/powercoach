import { type ReactElement, type ReactNode, useEffect, useState } from 'react'

import { LoadingOverlay } from './LoadingOverlay'

const MIN_DISPLAY_MS = 1000

interface Props {
  children: ReactNode
  loading: boolean
}

export function LoadingTransition({ children, loading }: Props): ReactElement {
  const [overlayVisible, setOverlayVisible] = useState(loading)
  const [clipInComplete, setClipInComplete] = useState(!loading)
  const [minDisplayComplete, setMinDisplayComplete] = useState(!loading)
  const [exiting, setExiting] = useState(false)

  useEffect(() => {
    if (!loading) {
      return
    }

    setOverlayVisible(true)
    setClipInComplete(false)
    setMinDisplayComplete(false)
    setExiting(false)
  }, [loading])

  useEffect(() => {
    if (!overlayVisible) {
      return
    }

    setMinDisplayComplete(false)

    const timer = window.setTimeout(() => {
      setMinDisplayComplete(true)
    }, MIN_DISPLAY_MS)

    return () => {
      window.clearTimeout(timer)
    }
  }, [overlayVisible])

  useEffect(() => {
    if (!overlayVisible || loading || !clipInComplete || !minDisplayComplete || exiting) {
      return
    }

    setExiting(true)
  }, [clipInComplete, exiting, loading, minDisplayComplete, overlayVisible])

  const shouldRenderChildren = !loading && (!overlayVisible || clipInComplete)

  return (
    <>
      {shouldRenderChildren && children}
      {overlayVisible && !clipInComplete && (
        <div
          aria-hidden
          className="fixed inset-0 z-2147483646 bg-white"
          data-testid="loading-transition-background"
        />
      )}
      {overlayVisible && (
        <LoadingOverlay
          exiting={exiting}
          onClipInComplete={() => setClipInComplete(true)}
          onClipOutComplete={() => {
            setOverlayVisible(false)
            setExiting(false)
          }}
        />
      )}
    </>
  )
}
