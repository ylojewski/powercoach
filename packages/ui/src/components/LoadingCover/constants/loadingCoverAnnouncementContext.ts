import { createContext } from 'react'

import { type LoadingCoverRegistryContextValue } from './loadingCoverCoordinatorContext'

export interface LoadingCoverAnnouncementContextValue extends LoadingCoverRegistryContextValue {
  busyFullscreenAncestor: boolean
  busyLocalAncestor: boolean
}

export const loadingCoverAnnouncementContext =
  createContext<LoadingCoverAnnouncementContextValue | null>(null)
