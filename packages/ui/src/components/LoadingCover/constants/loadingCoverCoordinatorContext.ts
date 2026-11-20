import { createContext } from 'react'

export interface LoadingCoverRegistryContextValue {
  removeMember: (member: symbol) => void
  setMember: (member: symbol, value: boolean) => void
}

export const loadingCoverCoordinatorContext =
  createContext<LoadingCoverRegistryContextValue | null>(null)
