import {
  HorizontalPanel,
  HorizontalPanelContent,
  HorizontalPanelItem,
  HorizontalPanelTrigger
} from '@powercoach/ui'
import { type ReactElement } from 'react'
import { useLocation, useNavigate } from 'react-router'

import { panelPaths, routerPaths, type PanelPath } from '@/src/constants/router-paths'

import { Metrics } from './Metrics'
import { Notes } from './Notes'
import { Programs } from './Programs'
import { Reviews } from './Reviews'

export function ManagementPanels(): ReactElement {
  const location = useLocation()
  const navigate = useNavigate()

  const activePanel = panelPaths.find((panelPath) => panelPath === location.pathname)
  const value = activePanel ? [activePanel] : []

  const handleValueChange = ([panelPath]: PanelPath[]): void => {
    navigate(panelPath as PanelPath)
  }

  return (
    <HorizontalPanel<PanelPath> collapsible={false} onValueChange={handleValueChange} value={value}>
      <HorizontalPanelItem value={routerPaths.programs}>
        <HorizontalPanelTrigger>programs</HorizontalPanelTrigger>
        <HorizontalPanelContent>
          <Programs />
        </HorizontalPanelContent>
      </HorizontalPanelItem>
      <HorizontalPanelItem value={routerPaths.reviews}>
        <HorizontalPanelTrigger>reviews</HorizontalPanelTrigger>
        <HorizontalPanelContent>
          <Reviews />
        </HorizontalPanelContent>
      </HorizontalPanelItem>
      <HorizontalPanelItem value={routerPaths.metrics}>
        <HorizontalPanelTrigger>metrics</HorizontalPanelTrigger>
        <HorizontalPanelContent>
          <Metrics />
        </HorizontalPanelContent>
      </HorizontalPanelItem>
      <HorizontalPanelItem value={routerPaths.notes}>
        <HorizontalPanelTrigger>notes</HorizontalPanelTrigger>
        <HorizontalPanelContent>
          <Notes />
        </HorizontalPanelContent>
      </HorizontalPanelItem>
    </HorizontalPanel>
  )
}
