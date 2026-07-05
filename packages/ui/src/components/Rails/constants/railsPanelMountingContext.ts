import { createContext } from 'react'

export interface RailsPanelMountingContextValue {
  hiddenUntilFound: boolean
  keepMounted: boolean
}

export const railsPanelMountingContext = createContext<RailsPanelMountingContextValue>({
  hiddenUntilFound: false,
  keepMounted: false
})
