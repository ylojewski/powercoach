import { appendPath, type NavigationState } from '@/core'
import { homeNavigation } from '@/modules/home'

export const navigationState = {
  homeDrawer: appendPath('/', homeNavigation.homeDrawer()),
  homeIndex: appendPath('/', homeNavigation.homeIndex()),
  index: '/'
} as const satisfies NavigationState
