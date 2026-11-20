import { useDirection } from '@base-ui/react/direction-provider'
import { NavigationMenu as BaseUiNavigationMenu } from '@base-ui/react/navigation-menu'
import { type ReactElement } from 'react'

export type AvatarMenuPortalProps = BaseUiNavigationMenu.Portal.Props
export type AvatarMenuPortalState = BaseUiNavigationMenu.Portal.State

export function AvatarMenuPortal(props: AvatarMenuPortalProps): ReactElement {
  const direction = useDirection()

  return <BaseUiNavigationMenu.Portal {...props} dir={direction} />
}
