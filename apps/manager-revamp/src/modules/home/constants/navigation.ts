import { type HomeNavigation } from '../types'

export enum HomeNavigationPath {
  Index = '',
  Drawer = 'drawer'
}

export const homeNavigation = {
  homeDrawer: () => HomeNavigationPath.Drawer,
  homeIndex: () => HomeNavigationPath.Index
} as const satisfies HomeNavigation
