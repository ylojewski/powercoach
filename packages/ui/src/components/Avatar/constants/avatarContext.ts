import { createContext } from 'react'

import { type AvatarSize } from './avatarRootVariants'

export interface AvatarContextValue {
  decorativeFallbackSurface: HTMLElement | null
  size: AvatarSize
}

export const avatarContext = createContext<AvatarContextValue | null>(null)
