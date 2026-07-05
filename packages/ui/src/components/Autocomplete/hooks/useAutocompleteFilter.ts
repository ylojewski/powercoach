import { Autocomplete as BaseUiAutocomplete } from '@base-ui/react/autocomplete'

export type AutocompleteFilter = ReturnType<typeof BaseUiAutocomplete.useFilter>

export type AutocompleteFilterOptions = NonNullable<
  Parameters<typeof BaseUiAutocomplete.useFilter>[0]
>

export function useAutocompleteFilter(options?: AutocompleteFilterOptions): AutocompleteFilter {
  return BaseUiAutocomplete.useFilter(options)
}
