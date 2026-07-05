import { type ReactElement } from 'react'

import { autocompleteGroupLabelIconVariants } from '../constants/autocompleteGroupLabelIconVariants'
import {
  type AutocompleteAddOnPosition,
  type AutocompleteItemIcon,
  type AutocompleteSize
} from '../types/AutocompleteTypes'

export interface AutocompleteGroupLabelIconProps {
  icon: AutocompleteItemIcon
  position: AutocompleteAddOnPosition
  size: AutocompleteSize
}

export function AutocompleteGroupLabelIcon({
  icon,
  position,
  size
}: AutocompleteGroupLabelIconProps): ReactElement {
  return (
    <span
      aria-hidden="true"
      className={autocompleteGroupLabelIconVariants({ position, size })}
      inert
      style={{ pointerEvents: 'none' }}
    >
      {icon}
    </span>
  )
}
