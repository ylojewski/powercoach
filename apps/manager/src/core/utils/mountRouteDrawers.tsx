import { RouteDrawer } from '../components'
import { type ModuleRouteObject, type RouteDrawerElement } from '../types'
import { appendPath } from './appendPath'

interface MountDrawersOptions {
  fallback?: string
}

function toDrawerElements(
  routes: readonly ModuleRouteObject[],
  parentPath: string,
  defaultFallback: string,
  parentDrawerPath?: string
): RouteDrawerElement[] {
  return routes.flatMap((route): RouteDrawerElement[] => {
    const path = appendPath(parentPath, route.path)
    const children = route.children
      ? toDrawerElements(
          route.children,
          path,
          defaultFallback,
          route.drawer ? path : parentDrawerPath
        )
      : []

    if (!route.drawer) {
      return children
    }

    return [
      <RouteDrawer
        drawer={route.drawer}
        fallbackPath={route.fallback ?? parentDrawerPath ?? defaultFallback}
        key={path}
        path={path}
      >
        {children}
      </RouteDrawer>
    ]
  })
}

export function mountRouteDrawers(
  basePath: string,
  routes: readonly ModuleRouteObject[],
  { fallback = '/' }: MountDrawersOptions = {}
): RouteDrawerElement[] {
  return toDrawerElements(routes, basePath, fallback)
}
