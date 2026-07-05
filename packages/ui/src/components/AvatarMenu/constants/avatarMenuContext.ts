import { createContext } from 'react'

export type AvatarMenuActivationDirection = 'down' | 'left' | 'right' | 'up' | null

export interface AvatarMenuPositioningAnchor {
  contextElement: HTMLButtonElement
  getBoundingClientRect: () => DOMRect
}

export interface AvatarMenuContextValue {
  activationDirection: AvatarMenuActivationDirection
  controlled: boolean
  orientation: 'horizontal' | 'vertical'
  positioningAnchor: AvatarMenuPositioningAnchor | null
  positioningTriggerActive: boolean
  registerTrigger: (value: unknown, element: HTMLButtonElement | null) => void
  setPositioningTrigger: (element: HTMLButtonElement, active: boolean, open: boolean) => void
}

export const avatarMenuContext = createContext<AvatarMenuContextValue | undefined>(undefined)
