import { Autocomplete as BaseUiAutocomplete } from '@base-ui/react/autocomplete'
import { type ReactElement } from 'react'

export type AutocompleteSeparatorProps = BaseUiAutocomplete.Separator.Props

export type AutocompleteSeparatorState = BaseUiAutocomplete.Separator.State

export function AutocompleteSeparator(props: AutocompleteSeparatorProps): ReactElement {
  return <BaseUiAutocomplete.Separator {...props} />
}
