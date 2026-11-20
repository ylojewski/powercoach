import { generatePath, type Params } from 'react-router'

import { type Navigation, type NavigationState } from '../types'

export function mountNavigation(state: NavigationState, routeParams: Params): Navigation {
  const navigationStateEntries = Object.entries(state)
  const navigationEntries = navigationStateEntries.map(([scope, path]) => {
    const navigate = (params?: Readonly<Record<string, unknown>>): string => {
      return generatePath(path, params ?? routeParams)
    }
    return [scope, navigate]
  })
  return Object.fromEntries(navigationEntries) as Navigation
}
