import { PopupSurfaceGroup } from './components/PopupSurfaceGroup'
import { PopupSurfaceGroupLabel } from './components/PopupSurfaceGroupLabel'
import { PopupSurfaceItem } from './components/PopupSurfaceItem'
import { PopupSurfaceRoot } from './components/PopupSurfaceRoot'

export * from './components/PopupSurfaceGroup'
export * from './components/PopupSurfaceGroupLabel'
export * from './components/PopupSurfaceItem'
export * from './components/PopupSurfaceRoot'
export * from './types/PopupSurfaceTypes'

export interface PopupSurfaceNamespace {
  Group: typeof PopupSurfaceGroup
  GroupLabel: typeof PopupSurfaceGroupLabel
  Item: typeof PopupSurfaceItem
  Root: typeof PopupSurfaceRoot
}

export const PopupSurface: PopupSurfaceNamespace = {
  Group: PopupSurfaceGroup,
  GroupLabel: PopupSurfaceGroupLabel,
  Item: PopupSurfaceItem,
  Root: PopupSurfaceRoot
}
