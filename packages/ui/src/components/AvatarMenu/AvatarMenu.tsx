import { AvatarMenuContent } from './components/AvatarMenuContent'
import { AvatarMenuGroup } from './components/AvatarMenuGroup'
import { AvatarMenuGroupLabel } from './components/AvatarMenuGroupLabel'
import { AvatarMenuItem } from './components/AvatarMenuItem'
import { AvatarMenuLink } from './components/AvatarMenuLink'
import { AvatarMenuList } from './components/AvatarMenuList'
import { AvatarMenuPopup } from './components/AvatarMenuPopup'
import { AvatarMenuPortal } from './components/AvatarMenuPortal'
import { AvatarMenuPositioner } from './components/AvatarMenuPositioner'
import { AvatarMenuRoot } from './components/AvatarMenuRoot'
import { AvatarMenuTrigger } from './components/AvatarMenuTrigger'
import { AvatarMenuViewport } from './components/AvatarMenuViewport'

export * from './components/AvatarMenuContent'
export * from './components/AvatarMenuGroup'
export * from './components/AvatarMenuGroupLabel'
export * from './components/AvatarMenuItem'
export * from './components/AvatarMenuLink'
export * from './components/AvatarMenuList'
export * from './components/AvatarMenuPopup'
export * from './components/AvatarMenuPortal'
export * from './components/AvatarMenuPositioner'
export * from './components/AvatarMenuRoot'
export * from './components/AvatarMenuTrigger'
export * from './components/AvatarMenuViewport'

export interface AvatarMenuNamespace {
  Content: typeof AvatarMenuContent
  Group: typeof AvatarMenuGroup
  GroupLabel: typeof AvatarMenuGroupLabel
  Item: typeof AvatarMenuItem
  Link: typeof AvatarMenuLink
  List: typeof AvatarMenuList
  Popup: typeof AvatarMenuPopup
  Portal: typeof AvatarMenuPortal
  Positioner: typeof AvatarMenuPositioner
  Root: typeof AvatarMenuRoot
  Trigger: typeof AvatarMenuTrigger
  Viewport: typeof AvatarMenuViewport
}

export const AvatarMenu: AvatarMenuNamespace = {
  Content: AvatarMenuContent,
  Group: AvatarMenuGroup,
  GroupLabel: AvatarMenuGroupLabel,
  Item: AvatarMenuItem,
  Link: AvatarMenuLink,
  List: AvatarMenuList,
  Popup: AvatarMenuPopup,
  Portal: AvatarMenuPortal,
  Positioner: AvatarMenuPositioner,
  Root: AvatarMenuRoot,
  Trigger: AvatarMenuTrigger,
  Viewport: AvatarMenuViewport
}
