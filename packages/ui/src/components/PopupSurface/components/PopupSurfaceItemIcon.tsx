import { type ReactElement } from 'react'

import { popupSurfaceItemIconVariants } from '../constants/popupSurfaceVariants'
import {
  type PopupSurfaceItemIcon as PopupSurfaceItemIconType,
  type PopupSurfaceItemIconPosition,
  type PopupSurfaceSize
} from '../types/PopupSurfaceTypes'

export interface PopupSurfaceItemIconProps {
  icon: PopupSurfaceItemIconType
  position: PopupSurfaceItemIconPosition
  size: PopupSurfaceSize
}

export function PopupSurfaceItemIcon({
  icon,
  position,
  size
}: PopupSurfaceItemIconProps): ReactElement {
  return (
    <span
      aria-hidden="true"
      className={popupSurfaceItemIconVariants({ position, size })}
      inert
      style={{ pointerEvents: 'none' }}
    >
      {icon}
    </span>
  )
}
