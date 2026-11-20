import { createContext } from 'react'

import { type TabsTabValue } from '../components/TabsTab'

export interface TabsListContextValue {
  borderWidth: string
  firstTabValue: TabsTabValue | undefined
}

export const tabsListContext = createContext<TabsListContextValue>({
  borderWidth: 'var(--tabs-border-width, 1px)',
  firstTabValue: undefined
})
