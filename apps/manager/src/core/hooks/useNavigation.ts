import { useMemo } from 'react'

import { selectNavigationState } from '../store'
import { type Navigation } from '../types'
import { mountNavigation } from '../utils'
import { useAppSelector } from './useAppSelector'
import { useBackgroundParams } from './useBackgroundParams'

export function useNavigation(): Navigation {
  const navigationState = useAppSelector(selectNavigationState)
  const backgroundParams = useBackgroundParams()

  return useMemo<Navigation>(
    () => mountNavigation(navigationState, backgroundParams),
    [backgroundParams, navigationState]
  )
}
