import { type ReactElement } from 'react'

import { useBackgroundParams } from '@/core'
import { Home } from '@/modules/home'
import { useRoster } from '@/modules/roster'

import { ManagementPanels } from './ManagementPanels'
import { NotFound } from './NotFound'
import { Sidebar } from './Sidebar'

export function Layout(): ReactElement {
  const { athleteSlug } = useBackgroundParams()
  const { activatedAthlete } = useRoster()

  if (athleteSlug && !activatedAthlete) {
    return <NotFound />
  }

  return (
    <div className="bg-background flex min-h-screen">
      <Sidebar />
      <div className="relative flex-1">
        <Home />
        <ManagementPanels />
      </div>
    </div>
  )
}
