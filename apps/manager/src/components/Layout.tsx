import { type ReactElement } from 'react'

import { Home } from './Home'
import { ManagementPanels } from './ManagementPanels'
import { RosterSidebar } from './RosterSidebar'

export function Layout(): ReactElement {
  return (
    <div className="flex min-h-screen">
      <RosterSidebar />
      <div className="relative flex-1">
        <Home />
        <ManagementPanels />
      </div>
    </div>
  )
}
