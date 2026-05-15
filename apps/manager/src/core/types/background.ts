import { type Location, type Params } from 'react-router'

export interface BackgroundState {
  location: Location
  params: Readonly<Params<string>>
}

export function isBackgroundState(state: unknown): state is BackgroundState {
  if (state === null || typeof state !== 'object') {
    return false
  }

  const { location, params } = state as Partial<BackgroundState>

  return (
    location !== undefined &&
    typeof location.pathname === 'string' &&
    params !== undefined &&
    typeof params === 'object' &&
    !Array.isArray(params)
  )
}
