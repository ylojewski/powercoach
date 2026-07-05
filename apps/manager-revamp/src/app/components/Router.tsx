import { type ReactElement } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router'

import { mountRouteDrawers, mountRoutes, RouteDrawerShell } from '@/core'
import { homeRoutes } from '@/modules/home'

import { navigationState } from '../constants'

const router = createBrowserRouter([
  {
    children: mountRoutes(navigationState.index, homeRoutes),
    element: (
      <RouteDrawerShell routeDrawers={mountRouteDrawers(navigationState.index, homeRoutes)} />
    )
  }
])

export function Router(): ReactElement {
  return <RouterProvider router={router} />
}
