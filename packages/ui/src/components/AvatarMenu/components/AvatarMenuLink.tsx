import { NavigationMenu as BaseUiNavigationMenu } from '@base-ui/react/navigation-menu'
import { type ComponentPropsWithRef, type ReactElement } from 'react'
import { twMerge } from 'tailwind-merge'

import { PopupSurfaceItem, type PopupSurfaceItemIcon } from '../../PopupSurface'

export type AvatarMenuLinkState = BaseUiNavigationMenu.Link.State
export type AvatarMenuLinkProps = BaseUiNavigationMenu.Link.Props & {
  icon: PopupSurfaceItemIcon
}

export function AvatarMenuLink({
  children,
  className,
  closeOnClick = true,
  icon,
  render,
  style,
  ...props
}: AvatarMenuLinkProps): ReactElement {
  return (
    <BaseUiNavigationMenu.Link
      {...props}
      className={(state) =>
        twMerge(
          `min-h-[calc(2.25rem-2px)] w-max min-w-full py-1.5 ps-8 pe-2.5 outline-none data-[popup-surface-item]:min-h-0 data-[popup-surface-item]:p-0`,
          typeof className === 'function' ? className(state) : className
        )
      }
      closeOnClick={closeOnClick}
      render={(elementProps, state) => (
        <PopupSurfaceItem
          {...(elementProps as ComponentPropsWithRef<'div'>)}
          contentInset="start"
          icon={icon}
          iconPosition="start"
          render={
            typeof render === 'function'
              ? (surfaceProps) => render(surfaceProps, state)
              : (render ?? <a />)
          }
          reveal={state.active ? true : undefined}
          size="md"
        >
          {children}
        </PopupSurfaceItem>
      )}
      style={style}
    >
      {children}
    </BaseUiNavigationMenu.Link>
  )
}
