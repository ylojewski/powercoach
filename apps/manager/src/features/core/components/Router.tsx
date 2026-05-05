import { DrawerIndent, DrawerProvider } from '@powercoach/ui'
import { useMemo, type ReactElement } from 'react'
import { createBrowserRouter, Route, Routes, RouterProvider, useLocation } from 'react-router'

import { ExerciseDrawer } from '@/exercise'

import { FeatureLoader } from './FeatureLoader'
import { useBackgroundLocationState } from '../hooks'
import { Layout } from './Layout'
import { NotFound } from './NotFound'
import { RouterPath } from '../constants'

function RouterShell(): ReactElement {
  const location = useBackgroundLocationState()?.backgroundLocation ?? useLocation()

  return (
    <DrawerProvider>
      <DrawerIndent>
        <Routes location={location}>
          <Route element={<FeatureLoader />}>
            <Route element={<Layout />} path={RouterPath.Home} />
            <Route element={<Layout />} path={RouterPath.Metrics} />
            <Route element={<Layout />} path={RouterPath.Notes} />
            <Route element={<Layout />} path={RouterPath.Reviews} />
            <Route element={<Layout />} path={RouterPath.Programs} />
            <Route element={<Layout />} path={RouterPath.AthleteHome} />
            <Route element={<Layout />} path={RouterPath.AthleteMetrics} />
            <Route element={<Layout />} path={RouterPath.AthleteNotes} />
            <Route element={<Layout />} path={RouterPath.AthleteReviews} />
            <Route element={<Layout />} path={RouterPath.AthletePrograms} />
            <Route element={<Layout />} path={RouterPath.Exercise} />
          </Route>
          <Route element={<NotFound />} path="*" />
        </Routes>
      </DrawerIndent>
      <ExerciseDrawer />
    </DrawerProvider>
  )
}

export function Router(): ReactElement {
  const router = useMemo(() => {
    return createBrowserRouter([{ element: <RouterShell />, path: '*' }])
  }, [])

  return <RouterProvider router={router} />
}
