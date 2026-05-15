import { DrawerIndent, DrawerProvider } from '@powercoach/ui'
import { type ReactElement } from 'react'
import { Outlet } from 'react-router'

import { type RouteDrawerElement } from '../types'

export interface RouteDrawerShellProps {
  routeDrawers: RouteDrawerElement[]
}

export function RouteDrawerShell({ routeDrawers }: RouteDrawerShellProps): ReactElement {
  return (
    <DrawerProvider>
      <DrawerIndent>
        <Outlet />
      </DrawerIndent>
      {routeDrawers}
    </DrawerProvider>
  )
}
