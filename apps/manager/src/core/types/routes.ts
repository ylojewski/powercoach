import { type ComponentProps, type ReactElement } from 'react'
import { type RouteObject } from 'react-router'

import { type RouteDrawer } from '../components'

export type RouteDrawerElement = ReactElement<ComponentProps<typeof RouteDrawer>>

export type ModuleRouteObject = Omit<RouteObject, 'children'> & {
  children?: readonly ModuleRouteObject[]
  drawer?: RouteDrawerElement
  fallback?: string
}
