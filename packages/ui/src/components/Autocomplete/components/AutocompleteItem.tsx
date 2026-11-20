import { Autocomplete as BaseUiAutocomplete } from '@base-ui/react/autocomplete'
import {
  createElement,
  use,
  type ComponentPropsWithRef,
  type ReactElement,
  type RefAttributes
} from 'react'

import { PopupSurfaceItem, type PopupSurfaceItemRevealAnimationProps } from '../../PopupSurface'
import { autocompleteContentContext } from '../constants/autocompleteContentContext'
import { autocompleteSizeContext } from '../constants/autocompleteSizeContext'
import { type AutocompleteItemIcon } from '../types/AutocompleteTypes'
import { resolveAutocompleteClassName } from '../utils/resolveAutocompleteClassName'

export type AutocompleteItemRevealAnimationProps = PopupSurfaceItemRevealAnimationProps

export type AutocompleteItemProps = BaseUiAutocomplete.Item.Props & {
  icon?: AutocompleteItemIcon
  revealAnimationProps?: boolean | AutocompleteItemRevealAnimationProps
}

export type AutocompleteItemState = BaseUiAutocomplete.Item.State

export function AutocompleteItem(
  props: Omit<AutocompleteItemProps, 'ref'> & RefAttributes<HTMLElement>
): ReactElement

export function AutocompleteItem({
  children,
  className,
  icon,
  render,
  revealAnimationProps = true,
  style,
  ...props
}: Omit<AutocompleteItemProps, 'ref'> & RefAttributes<HTMLElement>): ReactElement {
  const contentContext = use(autocompleteContentContext)
  const size = use(autocompleteSizeContext)
  const iconPosition = contentContext?.addOnPosition ?? 'start'
  const contentInset =
    contentContext?.addOnPosition === 'start' ? 'start' : icon === undefined ? 'base' : iconPosition

  return createElement(
    BaseUiAutocomplete.Item as (
      itemProps: Omit<AutocompleteItemProps, 'ref'> & RefAttributes<HTMLElement>
    ) => ReactElement,
    {
      ...props,
      children,
      className: (state: AutocompleteItemState) =>
        resolveAutocompleteClassName(
          className,
          state,
          `
            relative z-10 cursor-default outline-none
            ${revealAnimationProps === false ? 'data-highlighted:bg-foreground data-highlighted:text-background' : ''}
            data-disabled:opacity-50
            [&>[data-motion=reveal]]:w-full
          `
        ),
      render: (elementProps: ComponentPropsWithRef<'div'>, state: AutocompleteItemState) => (
        <PopupSurfaceItem
          {...elementProps}
          contentInset={contentInset}
          icon={icon}
          iconPosition={iconPosition}
          render={
            typeof render === 'function' ? (surfaceProps) => render(surfaceProps, state) : render
          }
          reveal={state.highlighted}
          revealAnimationProps={revealAnimationProps}
          size={size}
        >
          {children}
        </PopupSurfaceItem>
      ),
      style
    }
  )
}
