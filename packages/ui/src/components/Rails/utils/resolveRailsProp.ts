export type RailsStateProp<TState, TValue> =
  | TValue
  | ((state: TState) => TValue | undefined)
  | undefined

export function resolveRailsProp<TState, TValue>(
  prop: RailsStateProp<TState, TValue>,
  state: TState
): TValue | undefined {
  if (typeof prop === 'function') {
    return (prop as (state: TState) => TValue | undefined)(state)
  }

  return prop
}
