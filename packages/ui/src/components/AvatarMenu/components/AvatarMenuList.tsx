import { NavigationMenu as BaseUiNavigationMenu } from '@base-ui/react/navigation-menu'
import { useContext, type ReactElement } from 'react'

import { avatarMenuContext, type AvatarMenuContextValue } from '../constants/avatarMenuContext'
import { resolveAvatarMenuClassName } from '../utils/resolveAvatarMenuClassName'

export type AvatarMenuListProps = BaseUiNavigationMenu.List.Props
export type AvatarMenuListState = BaseUiNavigationMenu.List.State

export function AvatarMenuList({ className, ...props }: AvatarMenuListProps): ReactElement {
  const { orientation } = useContext(avatarMenuContext) as AvatarMenuContextValue

  return (
    <BaseUiNavigationMenu.List
      {...props}
      className={(state) =>
        resolveAvatarMenuClassName(
          className,
          state,
          orientation === 'horizontal' ? 'flex flex-row flex-nowrap' : 'flex flex-col flex-nowrap'
        )
      }
    />
  )
}
