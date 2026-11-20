import { type InputAddOnPosition } from '../../Input'
import { type PopupSurfaceItemIcon, type PopupSurfaceSize } from '../../PopupSurface'

export type AutocompleteSize = PopupSurfaceSize

export type AutocompleteAddOnPosition = InputAddOnPosition

export type AutocompleteItemIcon = PopupSurfaceItemIcon

export interface AutocompleteItemOption {
  icon?: AutocompleteItemIcon
  text: string
}

export interface AutocompleteGroupOption<ItemValue = AutocompleteItemOption> {
  icon?: AutocompleteItemIcon
  items: readonly ItemValue[]
  text: string
}
