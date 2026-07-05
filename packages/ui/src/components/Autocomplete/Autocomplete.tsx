import { AutocompleteAddOn } from './components/AutocompleteAddOn'
import { AutocompleteArrow } from './components/AutocompleteArrow'
import { AutocompleteBackdrop } from './components/AutocompleteBackdrop'
import { AutocompleteClear } from './components/AutocompleteClear'
import { AutocompleteCollection } from './components/AutocompleteCollection'
import { AutocompleteEmpty } from './components/AutocompleteEmpty'
import { AutocompleteGroup } from './components/AutocompleteGroup'
import { AutocompleteGroupLabel } from './components/AutocompleteGroupLabel'
import { AutocompleteIcon } from './components/AutocompleteIcon'
import { AutocompleteInput } from './components/AutocompleteInput'
import { AutocompleteInputGroup } from './components/AutocompleteInputGroup'
import { AutocompleteItem } from './components/AutocompleteItem'
import { AutocompleteList } from './components/AutocompleteList'
import { AutocompletePopup } from './components/AutocompletePopup'
import { AutocompletePortal } from './components/AutocompletePortal'
import { AutocompletePositioner } from './components/AutocompletePositioner'
import { AutocompleteRoot } from './components/AutocompleteRoot'
import { AutocompleteRow } from './components/AutocompleteRow'
import { AutocompleteSeparator } from './components/AutocompleteSeparator'
import { AutocompleteStatus } from './components/AutocompleteStatus'
import { AutocompleteTrigger } from './components/AutocompleteTrigger'
import { AutocompleteValue } from './components/AutocompleteValue'
import { useAutocompleteFilter } from './hooks/useAutocompleteFilter'
import { useAutocompleteFilteredItems } from './hooks/useAutocompleteFilteredItems'

export * from './components/AutocompleteAddOn'
export * from './components/AutocompleteArrow'
export * from './components/AutocompleteBackdrop'
export * from './components/AutocompleteClear'
export * from './components/AutocompleteCollection'
export * from './components/AutocompleteEmpty'
export * from './components/AutocompleteGroup'
export * from './components/AutocompleteGroupLabel'
export * from './components/AutocompleteIcon'
export * from './components/AutocompleteInput'
export * from './components/AutocompleteInputGroup'
export * from './components/AutocompleteItem'
export * from './components/AutocompleteList'
export * from './components/AutocompletePopup'
export * from './components/AutocompletePortal'
export * from './components/AutocompletePositioner'
export * from './components/AutocompleteRoot'
export * from './components/AutocompleteRow'
export * from './components/AutocompleteSeparator'
export * from './components/AutocompleteStatus'
export * from './components/AutocompleteTrigger'
export * from './components/AutocompleteValue'
export * from './hooks/useAutocompleteFilter'
export * from './hooks/useAutocompleteFilteredItems'
export * from './types/AutocompleteTypes'

export interface AutocompleteNamespace {
  AddOn: typeof AutocompleteAddOn
  Arrow: typeof AutocompleteArrow
  Backdrop: typeof AutocompleteBackdrop
  Clear: typeof AutocompleteClear
  Collection: typeof AutocompleteCollection
  Empty: typeof AutocompleteEmpty
  Group: typeof AutocompleteGroup
  GroupLabel: typeof AutocompleteGroupLabel
  Icon: typeof AutocompleteIcon
  Input: typeof AutocompleteInput
  InputGroup: typeof AutocompleteInputGroup
  Item: typeof AutocompleteItem
  List: typeof AutocompleteList
  Popup: typeof AutocompletePopup
  Portal: typeof AutocompletePortal
  Positioner: typeof AutocompletePositioner
  Root: typeof AutocompleteRoot
  Row: typeof AutocompleteRow
  Separator: typeof AutocompleteSeparator
  Status: typeof AutocompleteStatus
  Trigger: typeof AutocompleteTrigger
  useFilter: typeof useAutocompleteFilter
  useFilteredItems: typeof useAutocompleteFilteredItems
  Value: typeof AutocompleteValue
}

export const Autocomplete: AutocompleteNamespace = {
  AddOn: AutocompleteAddOn,
  Arrow: AutocompleteArrow,
  Backdrop: AutocompleteBackdrop,
  Clear: AutocompleteClear,
  Collection: AutocompleteCollection,
  Empty: AutocompleteEmpty,
  Group: AutocompleteGroup,
  GroupLabel: AutocompleteGroupLabel,
  Icon: AutocompleteIcon,
  Input: AutocompleteInput,
  InputGroup: AutocompleteInputGroup,
  Item: AutocompleteItem,
  List: AutocompleteList,
  Popup: AutocompletePopup,
  Portal: AutocompletePortal,
  Positioner: AutocompletePositioner,
  Root: AutocompleteRoot,
  Row: AutocompleteRow,
  Separator: AutocompleteSeparator,
  Status: AutocompleteStatus,
  Trigger: AutocompleteTrigger,
  useFilter: useAutocompleteFilter,
  useFilteredItems: useAutocompleteFilteredItems,
  Value: AutocompleteValue
}
