import { useLayoutEffect, type Dispatch, type SetStateAction } from 'react'

import { type LoadingCoverVisualState } from '../components/LoadingCoverRoot'

export interface UseLoadingCoverLoadingChangeProps {
  contentMounted: boolean
  loading: boolean
  setContentMounted: Dispatch<SetStateAction<boolean>>
  setMembersSettled: Dispatch<SetStateAction<boolean>>
  setRevealTarget: Dispatch<SetStateAction<boolean>>
  setVisualState: Dispatch<SetStateAction<LoadingCoverVisualState>>
  visualState: LoadingCoverVisualState
}

export function useLoadingCoverLoadingChange({
  contentMounted,
  loading,
  setContentMounted,
  setMembersSettled,
  setRevealTarget,
  setVisualState,
  visualState
}: UseLoadingCoverLoadingChangeProps): void {
  useLayoutEffect(() => {
    if (!loading) {
      return
    }

    if (visualState === 'hidden' || visualState === 'unrevealing') {
      setMembersSettled(false)
      setRevealTarget(true)
      setVisualState('revealing')
      return
    }

    if (visualState === 'revealed' && contentMounted) {
      setContentMounted(false)
      setMembersSettled(false)
    }
  }, [
    contentMounted,
    loading,
    setContentMounted,
    setMembersSettled,
    setRevealTarget,
    setVisualState,
    visualState
  ])
}
