import { mergeProps } from '@base-ui/react/merge-props'
import { Radio as BaseUiRadio } from '@base-ui/react/radio'
import { type ReactElement } from 'react'

import { CardSelectorRendered } from './CardSelectorRendered'

export type CardSelectorProps<TValue> = Omit<BaseUiRadio.Root.Props<TValue>, 'children'>

export type CardSelectorState = BaseUiRadio.Root.State

export function CardSelector<TValue>(props: CardSelectorProps<TValue>): ReactElement {
  const untypedSelectorProps = { ...props } as CardSelectorProps<TValue> & {
    children?: unknown
  }
  delete untypedSelectorProps.children
  const {
    className,
    nativeButton = true,
    render,
    ...radioProps
  } = untypedSelectorProps as CardSelectorProps<TValue>

  return (
    <BaseUiRadio.Root
      {...radioProps}
      className={className}
      nativeButton={nativeButton}
      render={(elementProps, state) => (
        <CardSelectorRendered
          elementProps={mergeProps<'button'>(
            {
              className: `
                absolute inset-0 z-20 appearance-none bg-transparent
                p-0 outline-hidden
              `
            },
            elementProps
          )}
          render={render}
          state={state}
        />
      )}
    />
  )
}
