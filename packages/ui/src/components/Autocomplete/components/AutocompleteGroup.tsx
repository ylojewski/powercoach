import { Autocomplete as BaseUiAutocomplete } from '@base-ui/react/autocomplete'
import { type ComponentPropsWithRef, type ReactElement } from 'react'

import { PopupSurfaceGroup } from '../../PopupSurface'
import { autocompleteGroupItemsContext } from '../constants/autocompleteGroupItemsContext'
import { resolveAutocompleteClassName } from '../utils/resolveAutocompleteClassName'

export type AutocompleteGroupProps = BaseUiAutocomplete.Group.Props

export type AutocompleteGroupState = BaseUiAutocomplete.Group.State

export function AutocompleteGroup({
  children,
  className,
  items,
  render,
  ...props
}: AutocompleteGroupProps): ReactElement {
  return (
    <BaseUiAutocomplete.Group
      {...props}
      className={(state) => resolveAutocompleteClassName(className, state)}
      items={items}
      render={(elementProps, state) => (
        <PopupSurfaceGroup
          {...(elementProps as ComponentPropsWithRef<'div'>)}
          render={
            typeof render === 'function' ? (surfaceProps) => render(surfaceProps, state) : render
          }
        />
      )}
    >
      <autocompleteGroupItemsContext.Provider value={items}>
        {children}
      </autocompleteGroupItemsContext.Provider>
    </BaseUiAutocomplete.Group>
  )
}
