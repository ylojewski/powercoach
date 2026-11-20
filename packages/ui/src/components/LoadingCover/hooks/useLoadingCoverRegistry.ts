import { useCallback, useMemo, useState } from 'react'

import { type LoadingCoverRegistryContextValue } from '../constants/loadingCoverCoordinatorContext'

export interface UseLoadingCoverRegistryResult {
  everyMemberResolved: boolean
  registry: LoadingCoverRegistryContextValue
  someMemberActive: boolean
}

export function useLoadingCoverRegistry(): UseLoadingCoverRegistryResult {
  const [members, setMembers] = useState<ReadonlyMap<symbol, boolean>>(() => new Map())
  const setMember = useCallback((member: symbol, value: boolean) => {
    setMembers((currentMembers) => {
      if (currentMembers.get(member) === value) {
        return currentMembers
      }

      const nextMembers = new Map(currentMembers)

      nextMembers.set(member, value)

      return nextMembers
    })
  }, [])
  const removeMember = useCallback((member: symbol) => {
    setMembers((currentMembers) => {
      if (!currentMembers.has(member)) {
        return currentMembers
      }

      const nextMembers = new Map(currentMembers)

      nextMembers.delete(member)

      return nextMembers
    })
  }, [])
  const registry = useMemo<LoadingCoverRegistryContextValue>(
    () => ({ removeMember, setMember }),
    [removeMember, setMember]
  )
  const values = [...members.values()]

  return {
    everyMemberResolved: values.every(Boolean),
    registry,
    someMemberActive: values.some(Boolean)
  }
}
