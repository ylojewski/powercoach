import { Autocomplete as BaseUiAutocomplete } from '@base-ui/react/autocomplete'
import { type ReactElement } from 'react'

export type AutocompleteBackdropProps = BaseUiAutocomplete.Backdrop.Props

export type AutocompleteBackdropState = BaseUiAutocomplete.Backdrop.State

export function AutocompleteBackdrop(props: AutocompleteBackdropProps): ReactElement {
  return <BaseUiAutocomplete.Backdrop {...props} />
}
