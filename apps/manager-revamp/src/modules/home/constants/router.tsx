import { type ModuleRouteObject } from '@/core'

import { Home, HomeDrawer } from '../components'
import { HomeNavigationPath } from './navigation'

export const homeRoutes = [
  {
    children: [
      {
        children: [{ path: '*' }],
        drawer: <HomeDrawer />,
        path: HomeNavigationPath.Drawer
      }
    ],
    Component: Home,
    path: HomeNavigationPath.Index
  }
] satisfies ModuleRouteObject[]
