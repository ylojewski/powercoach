import { useMemo } from 'react'
import { useParams } from 'react-router'

import { selectNavigationState } from '../store'
import { type Navigation } from '../types'
import { mountNavigation } from '../utils'
import { useAppSelector } from './useAppSelector'

export function useNavigation(): Navigation {
  const navigationState = useAppSelector(selectNavigationState)
  const routeParams = useParams()

  return useMemo(
    () => mountNavigation(navigationState, routeParams),
    [navigationState, routeParams]
  )
}
