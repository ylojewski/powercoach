import { mergeProps } from '@base-ui/react/merge-props'

export function resolveBottomSheetClassName<TState>(
  className: string | ((state: TState) => string | undefined) | undefined,
  state: TState,
  requiredClassName: string
): string | undefined {
  return mergeProps<'div'>(
    { className: typeof className === 'function' ? className(state) : className },
    { className: requiredClassName }
  ).className
}
