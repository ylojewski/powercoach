import { NavigationMenu as BaseUiNavigationMenu } from '@base-ui/react/navigation-menu'
import {
  Children,
  isValidElement,
  useContext,
  type ComponentPropsWithRef,
  type CSSProperties,
  type ReactElement,
  type ReactNode
} from 'react'
import { twMerge } from 'tailwind-merge'

import { AvatarMenuViewport } from './AvatarMenuViewport'
import { PopupSurfaceRoot } from '../../PopupSurface'
import { avatarMenuContext, type AvatarMenuContextValue } from '../constants/avatarMenuContext'

export type AvatarMenuPopupProps = BaseUiNavigationMenu.Popup.Props
export type AvatarMenuPopupState = BaseUiNavigationMenu.Popup.State

export function AvatarMenuPopup({
  children,
  className,
  render,
  style,
  ...props
}: AvatarMenuPopupProps): ReactElement {
  const { orientation, positioningTriggerActive } = useContext(
    avatarMenuContext
  ) as AvatarMenuContextValue
  const pendingChildren = Children.toArray(children).filter(
    isValidElement<{
      children?: ReactNode
    }>
  )
  let viewportCount = 0

  while (pendingChildren.length > 0) {
    const child = pendingChildren.pop() as ReactElement<{ children?: ReactNode }>

    if (child.type === AvatarMenuViewport) {
      viewportCount += 1
    }

    pendingChildren.push(
      ...Children.toArray(child.props.children).filter(isValidElement<{ children?: ReactNode }>)
    )
  }

  if (viewportCount !== 1) {
    throw new Error('AvatarMenu.Popup requires exactly one AvatarMenu.Viewport.')
  }

  return (
    <BaseUiNavigationMenu.Popup
      {...props}
      className={(state) =>
        twMerge(
          // prettier-ignore
          `
            group/popup h-(--popup-height) max-h-(--available-height) w-(--popup-width) max-w-(--available-width) overflow-visible
            transition-[scale,opacity,width,height,translate]
            [transition-duration:var(--popup-surface-enter-duration),var(--popup-surface-enter-duration),var(--popup-surface-layout-duration),var(--popup-surface-layout-duration),150ms]
            [transition-timing-function:var(--popup-surface-enter-easing),var(--popup-surface-enter-easing),var(--popup-surface-layout-easing),var(--popup-surface-layout-easing),cubic-bezier(0.22,1,0.36,1)]
            data-ending-style:[transition-duration:var(--popup-surface-exit-duration),var(--popup-surface-exit-duration),var(--popup-surface-layout-duration),var(--popup-surface-layout-duration),150ms]
            data-ending-style:[transition-timing-function:var(--popup-surface-exit-easing),var(--popup-surface-exit-easing),var(--popup-surface-layout-easing),var(--popup-surface-layout-easing),cubic-bezier(0.22,1,0.36,1)]
            group-data-[instant]:[transition-duration:var(--popup-surface-enter-duration),var(--popup-surface-enter-duration),0ms,0ms,150ms]
            group-data-[instant]:data-ending-style:[transition-duration:var(--popup-surface-exit-duration),var(--popup-surface-exit-duration),0ms,0ms,150ms]
            motion-reduce:group-data-[instant]:duration-0
            motion-reduce:group-data-[instant]:data-ending-style:duration-0
          `,
          orientation === 'horizontal' ? 'translate-y-2.5' : 'translate-x-2.5 rtl:-translate-x-2.5',
          positioningTriggerActive
            ? undefined
            : orientation === 'horizontal'
              ? 'data-ending-style:translate-y-0 data-starting-style:translate-y-0'
              : 'data-ending-style:translate-x-0 data-starting-style:translate-x-0',
          typeof className === 'function' ? className(state) : className
        )
      }
      render={(elementProps, state) => (
        <PopupSurfaceRoot
          {...(elementProps as ComponentPropsWithRef<'div'>)}
          render={
            typeof render === 'function' ? (surfaceProps) => render(surfaceProps, state) : render
          }
          size="md"
        />
      )}
      style={(state) =>
        ({
          '--popup-surface-layout-duration': '300ms',
          '--popup-surface-layout-easing': 'cubic-bezier(0.22, 1, 0.36, 1)',
          ...(typeof style === 'function' ? style(state) : style)
        }) as CSSProperties
      }
    >
      {children}
    </BaseUiNavigationMenu.Popup>
  )
}
