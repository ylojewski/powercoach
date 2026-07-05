import { createContext, type RefObject } from 'react'

export const bottomSheetPortalContainerContext = createContext<RefObject<HTMLDivElement | null>>({
  current: null
})
