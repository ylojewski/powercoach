import { createContext } from 'react'

import { type TabsRootOrientation } from '../components/TabsRoot'
import { type TabsTabValue } from '../components/TabsTab'

export interface TabsContextValue {
  orientation: TabsRootOrientation
  value: TabsTabValue
}

export const tabsContext = createContext<TabsContextValue>({
  orientation: 'horizontal',
  value: 0
})
