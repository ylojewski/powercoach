import { mergeProps } from '@base-ui/react/merge-props'
import {
  use,
  useLayoutEffect,
  type ComponentPropsWithRef,
  type CSSProperties,
  type ReactElement
} from 'react'
import { twMerge } from 'tailwind-merge'

import { autocompleteAddOnVariants } from '../constants/autocompleteAddOnVariants'
import { autocompleteContentContext } from '../constants/autocompleteContentContext'
import { autocompleteSizeContext } from '../constants/autocompleteSizeContext'
import { type AutocompleteAddOnPosition } from '../types/AutocompleteTypes'

type AutocompleteAddOnAriaProp = Extract<keyof ComponentPropsWithRef<'span'>, `aria-${string}`>
type AutocompleteAddOnEventProp = Extract<keyof ComponentPropsWithRef<'span'>, `on${string}`>
type AutocompleteAddOnInteractiveProp =
  | 'accessKey'
  | 'autoFocus'
  | 'contentEditable'
  | 'contextMenu'
  | 'dangerouslySetInnerHTML'
  | 'draggable'
  | 'inert'
  | 'popover'
  | 'popoverTarget'
  | 'popoverTargetAction'
  | 'role'
  | 'suppressContentEditableWarning'
  | 'tabIndex'
  | 'title'

export type AutocompleteAddOnProps = Omit<
  ComponentPropsWithRef<'span'>,
  | 'children'
  | 'style'
  | AutocompleteAddOnAriaProp
  | AutocompleteAddOnEventProp
  | AutocompleteAddOnInteractiveProp
> & {
  children: ReactElement
  position?: AutocompleteAddOnPosition
  style?: Omit<CSSProperties, 'pointerEvents'>
}

export function AutocompleteAddOn({
  children,
  className,
  position = 'start',
  ref,
  style,
  ...props
}: AutocompleteAddOnProps): ReactElement {
  const contentContext = use(autocompleteContentContext)
  const size = use(autocompleteSizeContext)
  const passiveProps = Object.fromEntries(
    Object.entries(props).filter(([key]) => {
      if (key.startsWith('aria-') || key.startsWith('on')) {
        return false
      }

      switch (key) {
        case 'accessKey':
        case 'autoFocus':
        case 'contentEditable':
        case 'contextMenu':
        case 'dangerouslySetInnerHTML':
        case 'draggable':
        case 'inert':
        case 'popover':
        case 'popoverTarget':
        case 'popoverTargetAction':
        case 'role':
        case 'suppressContentEditableWarning':
        case 'tabIndex':
        case 'title':
          return false
        default:
          return true
      }
    })
  ) as ComponentPropsWithRef<'span'>

  useLayoutEffect(() => {
    contentContext?.setAddOnPosition(position)

    return () => contentContext?.setAddOnPosition(null)
  }, [contentContext, position])

  return (
    <span
      {...mergeProps<'span'>(
        passiveProps,
        {
          className: twMerge(autocompleteAddOnVariants({ position, size }), className),
          style
        },
        {
          'aria-hidden': true,
          inert: true,
          style: { pointerEvents: 'none' }
        }
      )}
      data-field-addon=""
      data-position={position}
      ref={ref}
    >
      {children}
    </span>
  )
}
