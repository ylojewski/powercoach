import {
  HorizontalPanel,
  HorizontalPanelContent,
  HorizontalPanelItem,
  HorizontalPanelTrigger
} from '@powercoach/ui'
import { type ReactElement, type ReactNode } from 'react'
import { generatePath, Link, useLocation } from 'react-router'

import { RouterPath } from '@/core'
import { Metrics } from '@/modules/metrics'
import { Notes } from '@/modules/notes'
import { Programs } from '@/modules/programs'
import { Reviews } from '@/modules/reviews'
import { getAthleteSlug, useRoster } from '@/modules/roster'

interface ManagementPanelsLinkProps {
  children: ReactNode
  replace?: boolean
  to: string
}

function ManagementPanelsLink({
  children,
  replace = false,
  to
}: ManagementPanelsLinkProps): ReactElement {
  return (
    <HorizontalPanelTrigger nativeButton={false} render={<Link replace={replace} to={to} />}>
      {children}
    </HorizontalPanelTrigger>
  )
}

export function ManagementPanels(): ReactElement {
  const { pathname } = useLocation()
  const { activatedAthlete } = useRoster()
  const athleteSlug = activatedAthlete ? getAthleteSlug(activatedAthlete) : undefined

  const programsPath = athleteSlug
    ? generatePath(RouterPath.AthletePrograms, { athleteSlug })
    : RouterPath.Programs
  const reviewsPath = athleteSlug
    ? generatePath(RouterPath.AthleteReviews, { athleteSlug })
    : RouterPath.Reviews
  const metricsPath = athleteSlug
    ? generatePath(RouterPath.AthleteMetrics, { athleteSlug })
    : RouterPath.Metrics
  const notesPath = athleteSlug
    ? generatePath(RouterPath.AthleteNotes, { athleteSlug })
    : RouterPath.Notes

  return (
    <HorizontalPanel<string> collapsible={false} value={[pathname]}>
      <HorizontalPanelItem value={programsPath}>
        <ManagementPanelsLink replace={pathname === programsPath} to={programsPath}>
          programs
        </ManagementPanelsLink>
        <HorizontalPanelContent>
          <Programs />
        </HorizontalPanelContent>
      </HorizontalPanelItem>
      <HorizontalPanelItem value={reviewsPath}>
        <ManagementPanelsLink replace={pathname === reviewsPath} to={reviewsPath}>
          reviews
        </ManagementPanelsLink>
        <HorizontalPanelContent>
          <Reviews />
        </HorizontalPanelContent>
      </HorizontalPanelItem>
      <HorizontalPanelItem value={metricsPath}>
        <ManagementPanelsLink replace={pathname === metricsPath} to={metricsPath}>
          metrics
        </ManagementPanelsLink>
        <HorizontalPanelContent>
          <Metrics />
        </HorizontalPanelContent>
      </HorizontalPanelItem>
      <HorizontalPanelItem value={notesPath}>
        <ManagementPanelsLink replace={pathname === notesPath} to={notesPath}>
          notes
        </ManagementPanelsLink>
        <HorizontalPanelContent>
          <Notes />
        </HorizontalPanelContent>
      </HorizontalPanelItem>
    </HorizontalPanel>
  )
}
