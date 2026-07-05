import { useLayoutEffect, useRef, type Dispatch, type SetStateAction } from 'react'

import { type LoadingCoverVisualState } from '../components/LoadingCoverRoot'

export interface UseLoadingCoverDirectionChangeProps {
  direction: string
  loading: boolean
  revealTarget: boolean
  setContentMounted: Dispatch<SetStateAction<boolean>>
  setMembersSettled: Dispatch<SetStateAction<boolean>>
  setVisualState: Dispatch<SetStateAction<LoadingCoverVisualState>>
  visualState: LoadingCoverVisualState
}

export function useLoadingCoverDirectionChange({
  direction,
  loading,
  revealTarget,
  setContentMounted,
  setMembersSettled,
  setVisualState,
  visualState
}: UseLoadingCoverDirectionChangeProps): void {
  const previousDirection = useRef(direction)

  useLayoutEffect(() => {
    if (previousDirection.current === direction) {
      return
    }

    previousDirection.current = direction

    if (visualState === 'revealing' && revealTarget) {
      setContentMounted(!loading)
      setMembersSettled(false)
      setVisualState('revealed')
      return
    }

    if (visualState === 'unrevealing' && !revealTarget) {
      setContentMounted(true)
      setMembersSettled(true)
      setVisualState('hidden')
    }
  }, [
    direction,
    loading,
    revealTarget,
    setContentMounted,
    setMembersSettled,
    setVisualState,
    visualState
  ])
}
