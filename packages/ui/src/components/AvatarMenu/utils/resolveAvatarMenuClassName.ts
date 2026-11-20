import { twMerge } from 'tailwind-merge'

export function resolveAvatarMenuClassName<TState>(
  className: string | ((state: TState) => string | undefined) | undefined,
  state: TState,
  defaultClassName?: string,
  protectedClassName?: string
): string | undefined {
  return twMerge(
    defaultClassName,
    typeof className === 'function' ? className(state) : className,
    protectedClassName
  )
}
