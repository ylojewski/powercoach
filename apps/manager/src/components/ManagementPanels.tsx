import {
  HorizontalPanel,
  HorizontalPanelContent,
  HorizontalPanelItem,
  HorizontalPanelTrigger
} from '@powercoach/ui'
import { type ReactElement, type ReactNode } from 'react'
import { Link, useLocation, useNavigate } from 'react-router'

import { RouterPath } from '@/src/constants'

import { Metrics } from './Metrics'
import { Notes } from './Notes'
import { Programs } from './Programs'
import { Reviews } from './Reviews'

interface ManagementPanelsLinkProps {
  children: ReactNode
  to: RouterPath
}

function ManagementPanelsLink({ children, to }: ManagementPanelsLinkProps): ReactElement {
  return (
    <HorizontalPanelTrigger nativeButton={false} render={<Link to={to} />}>
      {children}
    </HorizontalPanelTrigger>
  )
}

export function ManagementPanels(): ReactElement {
  const location = useLocation()
  const navigate = useNavigate()

  const activePanel = (() => {
    switch (location.pathname) {
      case RouterPath.Programs:
      case RouterPath.Reviews:
      case RouterPath.Metrics:
      case RouterPath.Notes:
        return location.pathname
      default:
        return undefined
    }
  })()
  const value = activePanel ? [activePanel] : []

  const handleValueChange = ([routerPath]: RouterPath[]): void => {
    navigate(routerPath as RouterPath)
  }

  return (
    <HorizontalPanel<RouterPath>
      collapsible={false}
      onValueChange={handleValueChange}
      value={value}
    >
      <HorizontalPanelItem value={RouterPath.Programs}>
        <ManagementPanelsLink to={RouterPath.Programs}>programs</ManagementPanelsLink>
        <HorizontalPanelContent>
          <Programs />
        </HorizontalPanelContent>
      </HorizontalPanelItem>
      <HorizontalPanelItem value={RouterPath.Reviews}>
        <ManagementPanelsLink to={RouterPath.Reviews}>reviews</ManagementPanelsLink>
        <HorizontalPanelContent>
          <Reviews />
        </HorizontalPanelContent>
      </HorizontalPanelItem>
      <HorizontalPanelItem value={RouterPath.Metrics}>
        <ManagementPanelsLink to={RouterPath.Metrics}>metrics</ManagementPanelsLink>
        <HorizontalPanelContent>
          <Metrics />
        </HorizontalPanelContent>
      </HorizontalPanelItem>
      <HorizontalPanelItem value={RouterPath.Notes}>
        <ManagementPanelsLink to={RouterPath.Notes}>notes</ManagementPanelsLink>
        <HorizontalPanelContent>
          <Notes />
        </HorizontalPanelContent>
      </HorizontalPanelItem>
    </HorizontalPanel>
  )
}
