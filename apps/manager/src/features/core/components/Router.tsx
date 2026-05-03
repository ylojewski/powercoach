import { type ReactElement, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  BrowserRouter,
  matchPath,
  Route,
  Routes,
  useLocation,
  useNavigationType
} from 'react-router'

import { ExerciseCatalogDrawer } from '@/exercises'

import { FeatureLoader } from './FeatureLoader'
import { Layout } from './Layout'
import { ManagerShell } from './ManagerShell'
import { NotFound } from './NotFound'
import { RouterPath } from '../constants'

const MANAGER_LAYOUT_PATHS = [
  RouterPath.Home,
  RouterPath.Metrics,
  RouterPath.Notes,
  RouterPath.Reviews,
  RouterPath.Programs,
  RouterPath.AthleteHome,
  RouterPath.AthleteMetrics,
  RouterPath.AthleteNotes,
  RouterPath.AthleteReviews,
  RouterPath.AthletePrograms
]

type RouterLocation = ReturnType<typeof useLocation>

interface ExerciseCatalogRouteState {
  backgroundLocation?: RouterLocation
}

function matchesRoutePath(pathname: string, path: RouterPath): boolean {
  return Boolean(matchPath({ end: true, path }, pathname))
}

function isExerciseCatalogPathname(pathname: string): boolean {
  return matchesRoutePath(pathname, RouterPath.Exercises)
}

function isManagerLayoutPathname(pathname: string): boolean {
  if (isExerciseCatalogPathname(pathname)) return false

  return MANAGER_LAYOUT_PATHS.some((path) => matchesRoutePath(pathname, path))
}

function getStateBackgroundLocation(location: RouterLocation): RouterLocation | null {
  return (location.state as ExerciseCatalogRouteState | null)?.backgroundLocation ?? null
}

function RouterRoutes(): ReactElement {
  const location = useLocation()
  const navigationType = useNavigationType()
  const lastManagerLocationRef = useRef<RouterLocation | null>(null)
  const previousLocationRef = useRef<RouterLocation | null>(null)
  const skipBrowserBackCloseAnimationRef = useRef(false)
  const [browserBackClosingExerciseCatalog, setBrowserBackClosingExerciseCatalog] = useState(false)
  const isExerciseCatalogRoute = isExerciseCatalogPathname(location.pathname)
  const previousPathname = previousLocationRef.current?.pathname ?? null
  const shouldAnimateExerciseCatalogBrowserBackClose =
    navigationType === 'POP' &&
    previousPathname !== null &&
    isExerciseCatalogPathname(previousPathname) &&
    !isExerciseCatalogRoute &&
    !skipBrowserBackCloseAnimationRef.current

  if (isManagerLayoutPathname(location.pathname)) {
    lastManagerLocationRef.current = location
  }

  const fallbackManagerLocation = useMemo(
    (): RouterLocation => ({
      ...location,
      hash: '',
      pathname: RouterPath.Home,
      search: ''
    }),
    [location]
  )
  const stateBackgroundLocation = getStateBackgroundLocation(location)
  const validStateBackgroundLocation =
    stateBackgroundLocation && isManagerLayoutPathname(stateBackgroundLocation.pathname)
      ? stateBackgroundLocation
      : null
  const layoutLocation = isExerciseCatalogRoute
    ? (validStateBackgroundLocation ?? lastManagerLocationRef.current ?? fallbackManagerLocation)
    : location
  const shouldRenderExerciseCatalogDrawer =
    isExerciseCatalogRoute ||
    browserBackClosingExerciseCatalog ||
    shouldAnimateExerciseCatalogBrowserBackClose
  const exerciseCatalogDrawerClosing = shouldRenderExerciseCatalogDrawer && !isExerciseCatalogRoute

  useEffect(() => {
    if (shouldAnimateExerciseCatalogBrowserBackClose) {
      setBrowserBackClosingExerciseCatalog(true)
    }

    if (!isExerciseCatalogRoute) {
      skipBrowserBackCloseAnimationRef.current = false
    }

    previousLocationRef.current = location
  }, [isExerciseCatalogRoute, location, shouldAnimateExerciseCatalogBrowserBackClose])

  const handleExerciseCatalogCloseNavigation = useCallback((): void => {
    skipBrowserBackCloseAnimationRef.current = true
  }, [])

  const handleExerciseCatalogClosed = useCallback((): void => {
    setBrowserBackClosingExerciseCatalog(false)
  }, [])
  const exerciseCatalogDrawer = shouldRenderExerciseCatalogDrawer ? (
    <ExerciseCatalogDrawer
      closing={exerciseCatalogDrawerClosing}
      onClosed={handleExerciseCatalogClosed}
      onCloseNavigation={handleExerciseCatalogCloseNavigation}
    />
  ) : undefined

  return (
    <ManagerShell drawer={exerciseCatalogDrawer}>
      <Routes location={layoutLocation}>
        <Route element={<FeatureLoader />}>
          <Route element={<Layout />}>
            <Route element={null} path={RouterPath.Home} />
            <Route element={null} path={RouterPath.Metrics} />
            <Route element={null} path={RouterPath.Notes} />
            <Route element={null} path={RouterPath.Reviews} />
            <Route element={null} path={RouterPath.Programs} />
          </Route>
          <Route element={<Layout />} path={RouterPath.AthleteHome}>
            <Route element={null} index />
            <Route element={null} path="metrics" />
            <Route element={null} path="notes" />
            <Route element={null} path="reviews" />
            <Route element={null} path="programs" />
          </Route>
        </Route>
        <Route element={<NotFound />} path="*" />
      </Routes>
    </ManagerShell>
  )
}

export function Router(): ReactElement {
  return (
    <BrowserRouter>
      <RouterRoutes />
    </BrowserRouter>
  )
}
