import { type Location, useLocation } from 'react-router'

export interface BackgroundLocationState {
  backgroundLocation?: Location
}

function isBackgroundLocationState(state: unknown): state is BackgroundLocationState {
  return state !== null && typeof state === 'object' && 'backgroundLocation' in state
}

export function useBackgroundLocationState(): BackgroundLocationState | null {
  const { state } = useLocation()
  return isBackgroundLocationState(state) ? state : null
}
