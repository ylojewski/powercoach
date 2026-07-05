import { createContext, type Dispatch, type MutableRefObject, type SetStateAction } from 'react'

import { type AutocompleteAddOnPosition } from '../types/AutocompleteTypes'
import { type AutocompleteAutomaticPresentation } from '../utils/resolveAutocompleteAutomaticPresentation'

export interface AutocompleteContentContextValue {
  addOnPosition: AutocompleteAddOnPosition | null
  automaticPresentation: AutocompleteAutomaticPresentation | null
  closingSnapshotActive: boolean
  getObjectKey: (value: object) => number
  grid: boolean
  inputElementRef: MutableRefObject<HTMLInputElement | null>
  inputGroupElementRef: MutableRefObject<HTMLDivElement | null>
  recordAutomaticItemPress: (value: unknown, event: MouseEvent) => void
  setAddOnPosition: Dispatch<SetStateAction<AutocompleteAddOnPosition | null>>
  triggerElementRef: MutableRefObject<HTMLButtonElement | null>
  virtualized: boolean
}

export const autocompleteContentContext = createContext<AutocompleteContentContextValue | null>(
  null
)
