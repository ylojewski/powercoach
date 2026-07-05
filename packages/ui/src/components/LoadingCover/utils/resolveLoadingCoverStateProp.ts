export function resolveLoadingCoverStateProp<TState, TValue>(
  value: TValue | ((state: TState) => TValue),
  state: TState
): TValue {
  return typeof value === 'function' ? (value as (state: TState) => TValue)(state) : value
}
