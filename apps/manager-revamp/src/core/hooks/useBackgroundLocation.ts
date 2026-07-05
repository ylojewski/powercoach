import { type Location, useLocation } from 'react-router'

import { isBackgroundState } from '../types'

export function useBackgroundLocation(): Location {
  const location = useLocation()

  return isBackgroundState(location.state) ? location.state.location : location
}
