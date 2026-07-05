import { Autocomplete as BaseUiAutocomplete } from '@base-ui/react/autocomplete'

export function useAutocompleteFilteredItems<ItemValue>(): ItemValue[] {
  return BaseUiAutocomplete.useFilteredItems<ItemValue>()
}
