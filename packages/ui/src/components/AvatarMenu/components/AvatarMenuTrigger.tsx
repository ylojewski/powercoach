import { NavigationMenu as BaseUiNavigationMenu } from '@base-ui/react/navigation-menu'
import { type ComponentPropsWithRef, type ReactElement } from 'react'

import { AvatarMenuTriggerSurface } from './AvatarMenuTriggerSurface'

export type AvatarMenuTriggerState = BaseUiNavigationMenu.Trigger.State
export type AvatarMenuTriggerProps = Omit<
  BaseUiNavigationMenu.Trigger.Props,
  'aria-label' | 'nativeButton' | 'render'
> & {
  active?: boolean
  'aria-label': string
}

export function AvatarMenuTrigger({
  active = false,
  children,
  className,
  style,
  ...props
}: AvatarMenuTriggerProps): ReactElement {
  return (
    <BaseUiNavigationMenu.Trigger
      {...props}
      className={className}
      data-active={active ? '' : undefined}
      nativeButton
      render={(elementProps, state) => (
        <AvatarMenuTriggerSurface
          active={active}
          elementProps={elementProps as ComponentPropsWithRef<'button'>}
          state={state}
        >
          {children}
        </AvatarMenuTriggerSurface>
      )}
      style={style}
    >
      {children}
    </BaseUiNavigationMenu.Trigger>
  )
}
