import { Autocomplete as BaseUiAutocomplete } from '@base-ui/react/autocomplete'
import { ChevronsUpDownIcon } from 'lucide-react'
import { type ReactElement } from 'react'

import { resolveAutocompleteClassName } from '../utils/resolveAutocompleteClassName'

export type AutocompleteIconProps = Omit<BaseUiAutocomplete.Icon.Props, 'children'>

export type AutocompleteIconState = BaseUiAutocomplete.Icon.State

export function AutocompleteIcon(props: AutocompleteIconProps): ReactElement {
  const { children: _children, className, ...iconProps } = props as BaseUiAutocomplete.Icon.Props

  void _children

  return (
    <BaseUiAutocomplete.Icon
      {...iconProps}
      className={(state) => resolveAutocompleteClassName(className, state)}
    >
      <ChevronsUpDownIcon aria-hidden="true" />
    </BaseUiAutocomplete.Icon>
  )
}
