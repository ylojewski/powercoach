import { type ReactElement } from 'react'
import { useParams } from 'react-router'

import { useRosterFeature } from '@/roster'

import { Home } from './Home'
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
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="relative flex-1">
        <Home />
        <ManagementPanels />
      </div>
    </div>
  )
}
