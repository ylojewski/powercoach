import { useLayoutEffect, useRef } from 'react'

import { type LoadingCoverRegistryContextValue } from '../constants/loadingCoverCoordinatorContext'

export interface UseLoadingCoverMembershipProps {
  registry: LoadingCoverRegistryContextValue | null
  value: boolean
}

export function useLoadingCoverMembership({
  registry,
  value
}: UseLoadingCoverMembershipProps): void {
  const member = useRef(Symbol('loading-cover-member')).current
  const removeMember = registry?.removeMember
  const setMember = registry?.setMember

  useLayoutEffect(() => {
    if (setMember === undefined || removeMember === undefined) {
      return
    }

    setMember(member, value)

    return () => removeMember(member)
  }, [member, removeMember, setMember])

  useLayoutEffect(() => {
    setMember?.(member, value)
  }, [member, setMember, value])
}
