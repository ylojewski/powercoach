import { Autocomplete as BaseUiAutocomplete } from '@base-ui/react/autocomplete'
import { use, type ComponentPropsWithRef, type ReactElement } from 'react'

import { AutocompleteGroupLabelIcon } from './AutocompleteGroupLabelIcon'
import { Heading } from '../../Heading'
import { PopupSurfaceGroupLabel } from '../../PopupSurface'
import { autocompleteContentContext } from '../constants/autocompleteContentContext'
import { autocompletePopupContentVariants } from '../constants/autocompletePopupContentVariants'
import { autocompleteSizeContext } from '../constants/autocompleteSizeContext'
import { type AutocompleteItemIcon } from '../types/AutocompleteTypes'
import { resolveAutocompleteClassName } from '../utils/resolveAutocompleteClassName'

export type AutocompleteGroupLabelProps = BaseUiAutocomplete.GroupLabel.Props & {
  icon?: AutocompleteItemIcon
}

export type AutocompleteGroupLabelState = BaseUiAutocomplete.GroupLabel.State

export function AutocompleteGroupLabel({
  children,
  className,
  icon,
  render,
  ...props
}: AutocompleteGroupLabelProps): ReactElement {
  const contentContext = use(autocompleteContentContext)
  const size = use(autocompleteSizeContext)
  const iconPosition = contentContext?.addOnPosition ?? 'start'
  const contentInset =
    contentContext?.addOnPosition === 'start' ? 'start' : icon === undefined ? 'base' : iconPosition

  return (
    <BaseUiAutocomplete.GroupLabel
      {...props}
      className={(state) =>
        resolveAutocompleteClassName(
          className,
          state,
          autocompletePopupContentVariants({
            expandedEnd: contentInset === 'end',
            expandedStart: contentInset === 'start',
            kind: 'groupLabel',
            size
          })
        )
      }
      render={(elementProps, state) => (
        <PopupSurfaceGroupLabel
          {...(elementProps as ComponentPropsWithRef<'div'>)}
          data-content-inset={contentInset}
          data-icon-position={icon === undefined ? undefined : iconPosition}
          data-size={size}
          render={(surfaceProps) => (
            <Heading
              {...(surfaceProps as ComponentPropsWithRef<'span'>)}
              render={
                typeof render === 'function'
                  ? (headingProps) => render(headingProps as ComponentPropsWithRef<'div'>, state)
                  : (render ?? <div />)
              }
              size={size === 'xl' ? 'md' : size === 'md' ? 'sm' : 'xs'}
              tone="muted"
            />
          )}
        >
          {icon === undefined ? null : (
            <AutocompleteGroupLabelIcon icon={icon} position={iconPosition} size={size} />
          )}
          {children}
        </PopupSurfaceGroupLabel>
      )}
    >
      {children}
    </BaseUiAutocomplete.GroupLabel>
  )
}
