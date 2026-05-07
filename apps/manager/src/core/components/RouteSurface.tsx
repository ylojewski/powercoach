import { type ReactElement } from 'react'
import { type Location, matchRoutes, renderMatches, type RouteObject } from 'react-router'

interface RouteSurfaceProps {
  fallback?: ReactElement | null
  location: Location
  routes: RouteObject[]
}

export function RouteSurface({
  fallback = null,
  location,
  routes
}: RouteSurfaceProps): ReactElement | null {
  const matches = matchRoutes(routes, location)

  if (!matches) {
    return fallback
  }

  return renderMatches(matches)
}
