import { BottomSheet } from '@powercoach/ui'
import { type ReactElement } from 'react'
import { Outlet } from 'react-router'

import { type RouteDrawerElement } from '../types'

export interface RouteDrawerShellProps {
  routeDrawers: RouteDrawerElement[]
}

export function RouteDrawerShell({ routeDrawers }: RouteDrawerShellProps): ReactElement {
  return (
    <BottomSheet.Surface className="h-dvh">
      <Outlet />
      {routeDrawers}
    </BottomSheet.Surface>
  )
}
