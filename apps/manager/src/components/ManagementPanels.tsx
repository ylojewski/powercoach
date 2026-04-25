import {
  HorizontalPanel,
  HorizontalPanelContent,
  HorizontalPanelItem,
  HorizontalPanelTrigger
} from '@powercoach/ui'
import { type ReactElement, type ReactNode } from 'react'
import { generatePath, Link, useLocation, useNavigate } from 'react-router'

import { RouterPath } from '@/src/constants'
import { getAthleteSlug, useRosterFeature } from '@/src/features'

import { Metrics } from './Metrics'
import { Notes } from './Notes'
import { Programs } from './Programs'
import { Reviews } from './Reviews'

interface ManagementPanelsLinkProps {
  children: ReactNode
  to: string
}

function ManagementPanelsLink({ children, to }: ManagementPanelsLinkProps): ReactElement {
  return (
    <HorizontalPanelTrigger nativeButton={false} render={<Link to={to} />}>
      {children}
    </HorizontalPanelTrigger>
  )
}

export function ManagementPanels(): ReactElement {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const activatedAthlete = useRosterFeature().activatedAthlete
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

  const handleValueChange = ([panelPath = pathname]: string[]): void => {
    navigate(panelPath)
  }

  return (
    <HorizontalPanel<string>
      collapsible={false}
      onValueChange={handleValueChange}
      value={[pathname]}
    >
      <HorizontalPanelItem value={programsPath}>
        <ManagementPanelsLink to={programsPath}>programs</ManagementPanelsLink>
        <HorizontalPanelContent>
          <Programs />
        </HorizontalPanelContent>
      </HorizontalPanelItem>
      <HorizontalPanelItem value={reviewsPath}>
        <ManagementPanelsLink to={reviewsPath}>reviews</ManagementPanelsLink>
        <HorizontalPanelContent>
          <Reviews />
        </HorizontalPanelContent>
      </HorizontalPanelItem>
      <HorizontalPanelItem value={metricsPath}>
        <ManagementPanelsLink to={metricsPath}>metrics</ManagementPanelsLink>
        <HorizontalPanelContent>
          <Metrics />
        </HorizontalPanelContent>
      </HorizontalPanelItem>
      <HorizontalPanelItem value={notesPath}>
        <ManagementPanelsLink to={notesPath}>notes</ManagementPanelsLink>
        <HorizontalPanelContent>
          <Notes />
        </HorizontalPanelContent>
      </HorizontalPanelItem>
    </HorizontalPanel>
  )
}
