import { type RailsOrientation } from '../types/RailsOrientation'

export type RailsState<TState extends { orientation: unknown }> = Omit<TState, 'orientation'> & {
  orientation: RailsOrientation
}

export function normalizeRailsState<TState extends { orientation: unknown }>(
  state: TState,
  orientation: RailsOrientation
): RailsState<TState> {
  return {
    ...state,
    orientation
  }
}
