import { type RouteObject } from 'react-router'

import { type ModuleRouteObject } from '../types'
import { appendPath } from './appendPath'

function toRouteObject(route: ModuleRouteObject, basePath: string, isRoot: boolean): RouteObject {
  const { children, path, ...routeObject } = route
  const hasElement =
    routeObject.element !== undefined ||
    routeObject.Component !== undefined ||
    routeObject.lazy !== undefined

  delete routeObject.drawer
  delete routeObject.fallback

  return {
    ...routeObject,
    ...(!hasElement ? { element: null } : {}),
    ...(path !== undefined ? { path: isRoot ? appendPath(basePath, path) : path } : {}),
    ...(children
      ? { children: children.map((child) => toRouteObject(child, basePath, false)) }
      : {})
  } as RouteObject
}

export function mountRoutes(basePath: string, routes: readonly ModuleRouteObject[]): RouteObject[] {
  return routes.map((route) => toRouteObject(route, basePath, true))
}
