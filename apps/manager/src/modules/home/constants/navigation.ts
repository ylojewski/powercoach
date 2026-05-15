import { type HomeNavigation } from '../types'

export enum HomeNavigationPath {
  Index = ''
}

export const homeNavigation = {
  homeIndex: () => HomeNavigationPath.Index
} as const satisfies HomeNavigation
