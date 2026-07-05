import { useDirection } from '@base-ui/react/direction-provider'
import { NavigationMenu as BaseUiNavigationMenu } from '@base-ui/react/navigation-menu'
import { useContext, type ReactElement } from 'react'

import { avatarMenuContext, type AvatarMenuContextValue } from '../constants/avatarMenuContext'
import { resolveAvatarMenuClassName } from '../utils/resolveAvatarMenuClassName'

export type AvatarMenuPositionerProps = Omit<
  BaseUiNavigationMenu.Positioner.Props,
  'align' | 'side' | 'sideOffset'
>
export type AvatarMenuPositionerState = BaseUiNavigationMenu.Positioner.State

export function AvatarMenuPositioner({
  anchor,
  className,
  collisionPadding,
  ...props
}: AvatarMenuPositionerProps): ReactElement {
  const direction = useDirection()
  const { orientation, positioningAnchor } = useContext(avatarMenuContext) as AvatarMenuContextValue
  const top = typeof collisionPadding === 'number' ? collisionPadding : (collisionPadding?.top ?? 5)
  const right =
    typeof collisionPadding === 'number' ? collisionPadding : (collisionPadding?.right ?? 5)
  const bottom =
    typeof collisionPadding === 'number' ? collisionPadding : (collisionPadding?.bottom ?? 5)
  const left =
    typeof collisionPadding === 'number' ? collisionPadding : (collisionPadding?.left ?? 5)

  return (
    <BaseUiNavigationMenu.Positioner
      {...props}
      align="start"
      anchor={anchor ?? positioningAnchor}
      className={(state) =>
        resolveAvatarMenuClassName(
          className,
          state,
          `group h-(--positioner-height) w-(--positioner-width) max-w-(--available-width) transition-[top,right,bottom,left] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] data-instant:transition-none motion-reduce:transition-none`
        )
      }
      collisionPadding={{
        bottom: bottom + (orientation === 'horizontal' ? 10 : 0),
        left: left + (orientation === 'vertical' && direction === 'rtl' ? 10 : 0),
        right: right + (orientation === 'vertical' && direction === 'ltr' ? 10 : 0),
        top
      }}
      side={orientation === 'horizontal' ? 'bottom' : direction === 'rtl' ? 'left' : 'right'}
      sideOffset={0}
    />
  )
}
