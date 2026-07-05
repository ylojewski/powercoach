import { NavigationMenu as BaseUiNavigationMenu } from '@base-ui/react/navigation-menu'
import { type ReactElement } from 'react'

import { avatarMenuItemValueContext } from '../constants/avatarMenuItemValueContext'

export type AvatarMenuItemProps = BaseUiNavigationMenu.Item.Props
export type AvatarMenuItemState = BaseUiNavigationMenu.Item.State

export function AvatarMenuItem({ value, ...props }: AvatarMenuItemProps): ReactElement {
  return (
    <avatarMenuItemValueContext.Provider value={value}>
      <BaseUiNavigationMenu.Item {...props} value={value} />
    </avatarMenuItemValueContext.Provider>
  )
}
