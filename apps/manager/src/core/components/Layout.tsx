import { type ReactElement } from 'react'
import { useParams } from 'react-router'

import { Home } from '@/modules/home'
import { useRosterFeature } from '@/modules/roster'

import { ManagementPanels } from './ManagementPanels'
import { NotFound } from './NotFound'
import { Sidebar } from './Sidebar'

export function Layout(): ReactElement {
  const { athleteSlug } = useParams()
  const { activatedAthlete } = useRosterFeature()

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
