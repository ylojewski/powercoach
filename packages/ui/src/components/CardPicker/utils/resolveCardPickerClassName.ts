export function resolveCardPickerClassName<TState>(
  className: string | ((state: TState) => string | undefined) | undefined,
  state: TState
): string | undefined {
  return typeof className === 'function' ? className(state) : className
}
