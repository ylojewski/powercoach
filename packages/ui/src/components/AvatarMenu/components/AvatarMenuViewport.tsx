import { NavigationMenu as BaseUiNavigationMenu } from '@base-ui/react/navigation-menu'
import { type ReactElement } from 'react'

import { resolveAvatarMenuClassName } from '../utils/resolveAvatarMenuClassName'

export type AvatarMenuViewportProps = BaseUiNavigationMenu.Viewport.Props
export type AvatarMenuViewportState = BaseUiNavigationMenu.Viewport.State

export function AvatarMenuViewport({ className, ...props }: AvatarMenuViewportProps): ReactElement {
  return (
    <BaseUiNavigationMenu.Viewport
      {...props}
      className={(state) =>
        resolveAvatarMenuClassName(className, state, 'relative h-full w-full overflow-hidden')
      }
    />
  )
}
