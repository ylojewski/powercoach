import { createContext } from 'react'

export interface AvatarMenuGroupContextValue {
  groupLabelId: string
}

export const avatarMenuGroupContext = createContext<AvatarMenuGroupContextValue | undefined>(
  undefined
)
