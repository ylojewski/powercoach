import { DrawerIndent, DrawerProvider } from '@powercoach/ui'
import { useMemo, type ReactElement } from 'react'
import { createBrowserRouter, Route, Routes, RouterProvider, useLocation } from 'react-router'

import { useBackgroundLocationState, useRouterConfig } from '@/core'
import { exercisesDrawers, exercisesRoutes } from '@/modules/exercises'

import { ModuleLoader } from './ModuleLoader'
import { Layout } from './Layout'
import { NotFound } from './NotFound'

function RouterShell(): ReactElement {
  const RouterConfig = useRouterConfig()
  const location = useBackgroundLocationState()?.backgroundLocation ?? useLocation()

  return (
    <DrawerProvider>
      <DrawerIndent>
        <Routes location={location}>
          <Route element={<ModuleLoader />}>
            <Route element={<Layout />} path={RouterConfig.Home.Index} />
            <Route element={<Layout />} path={RouterConfig.Home.AthleteRoot} />

            <Route element={<Layout />} path={RouterConfig.Metrics.Index} />
            <Route element={<Layout />} path={RouterConfig.Metrics.AthleteRoot} />

            <Route element={<Layout />} path={RouterConfig.Notes.Index} />
            <Route element={<Layout />} path={RouterConfig.Notes.AthleteRoot} />

            <Route element={<Layout />} path={RouterConfig.Reviews.Index} />
            <Route element={<Layout />} path={RouterConfig.Reviews.AthleteRoot} />

            <Route element={<Layout />} path={RouterConfig.Programs.Index} />
            <Route element={<Layout />} path={RouterConfig.Programs.AthleteRoot} />

            <Route element={<Layout />} path={RouterConfig.Exercises.Index}>
              {exercisesRoutes}
            </Route>
          </Route>
          <Route element={<NotFound />} path="*" />
        </Routes>
      </DrawerIndent>
      {exercisesDrawers}
    </DrawerProvider>
  )
}

export function Router(): ReactElement {
  const router = useMemo(() => {
    return createBrowserRouter([{ element: <RouterShell />, path: '*' }])
  }, [])

  return <RouterProvider router={router} />
}
