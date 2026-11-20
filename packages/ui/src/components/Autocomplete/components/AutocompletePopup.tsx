import { Autocomplete as BaseUiAutocomplete } from '@base-ui/react/autocomplete'
import { use, type ComponentPropsWithRef, type ReactElement } from 'react'
import { twMerge } from 'tailwind-merge'

import { PopupSurfaceRoot } from '../../PopupSurface'
import { autocompleteSizeContext } from '../constants/autocompleteSizeContext'
import { resolveAutocompleteClassName } from '../utils/resolveAutocompleteClassName'

export type AutocompletePopupProps = BaseUiAutocomplete.Popup.Props

export type AutocompletePopupState = BaseUiAutocomplete.Popup.State

export function AutocompletePopup({
  className,
  render,
  style,
  ...props
}: AutocompletePopupProps): ReactElement {
  const size = use(autocompleteSizeContext)

  return (
    <BaseUiAutocomplete.Popup
      {...props}
      className={(state) =>
        resolveAutocompleteClassName(className, state, twMerge(`w-(--anchor-width)`))
      }
      render={(elementProps, state) => (
        <PopupSurfaceRoot
          {...(elementProps as ComponentPropsWithRef<'div'>)}
          render={
            typeof render === 'function' ? (surfaceProps) => render(surfaceProps, state) : render
          }
          size={size}
        />
      )}
      style={style}
    />
  )
}
