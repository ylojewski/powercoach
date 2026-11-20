import { twMerge } from 'tailwind-merge'

export function resolveAutocompleteClassName<TState>(
  className: string | ((state: TState) => string | undefined) | undefined,
  state: TState,
  defaultClassName?: string
): string | undefined {
  return twMerge(defaultClassName, typeof className === 'function' ? className(state) : className)
}
