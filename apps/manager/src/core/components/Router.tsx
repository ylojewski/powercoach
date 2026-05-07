import { DrawerIndent, DrawerProvider } from '@powercoach/ui'
import { useMemo, type ReactElement } from 'react'
import { createBrowserRouter, RouterProvider, type RouteObject, useLocation } from 'react-router'

import { useBackgroundLocationState } from '@/shared/hooks'

import { ErrorScreen } from './ErrorScreen'
import { LoadingScreen } from './LoadingScreen'
import { NotFound } from './NotFound'
import { RouteSurface } from './RouteSurface'
import { createStartupLoader } from '../loaders'
import { drawerRoutes, mainRoutes } from '../router'
import { store } from '../store'

function RouterShell(): ReactElement {
  const location = useLocation()
  const mainLocation = useBackgroundLocationState()?.backgroundLocation ?? location

  return (
    <DrawerProvider>
      <DrawerIndent>
        <RouteSurface fallback={<NotFound />} location={mainLocation} routes={mainRoutes} />
      </DrawerIndent>
      <RouteSurface location={location} routes={drawerRoutes} />
    </DrawerProvider>
  )
}

export function Router(): ReactElement {
  const router = useMemo(() => {
    return createBrowserRouter(createRouterRoutes())
  }, [])

  return <RouterProvider router={router} />
}

export function createRouterRoutes(): RouteObject[] {
  return [
    {
      element: <RouterShell />,
      errorElement: <ErrorScreen />,
      hydrateFallbackElement: <LoadingScreen />,
      loader: createStartupLoader(store),
      path: '*',
      shouldRevalidate: () => false
    }
  ]
}
