import { NavigationMenu as BaseUiNavigationMenu } from '@base-ui/react/navigation-menu'
import { useContext, type ReactElement } from 'react'

import { avatarMenuContext, type AvatarMenuContextValue } from '../constants/avatarMenuContext'
import { resolveAvatarMenuClassName } from '../utils/resolveAvatarMenuClassName'

export type AvatarMenuContentProps = BaseUiNavigationMenu.Content.Props
export type AvatarMenuContentState = BaseUiNavigationMenu.Content.State

export function AvatarMenuContent({
  className,
  render,
  style,
  ...props
}: AvatarMenuContentProps): ReactElement {
  const { activationDirection, controlled, orientation } = useContext(
    avatarMenuContext
  ) as AvatarMenuContextValue

  return (
    <BaseUiNavigationMenu.Content
      {...props}
      {...(controlled
        ? { 'data-activation-direction': activationDirection ?? undefined }
        : undefined)}
      className={(state) =>
        resolveAvatarMenuClassName(
          className,
          controlled ? { ...state, activationDirection } : state,
          orientation === 'horizontal'
            ? // prettier-ignore
              `
                flex w-max min-w-full max-w-(--available-width) translate-x-0 flex-col opacity-100
                transition-[opacity,translate]
                [transition:opacity_175ms_ease,translate_var(--popup-surface-layout-duration)_var(--popup-surface-layout-easing)]
                group-data-[instant]:translate-x-0
                data-starting-style:opacity-0 data-ending-style:opacity-0
                motion-safe:data-starting-style:data-[activation-direction=right]:translate-x-1/2
                motion-safe:data-ending-style:data-[activation-direction=right]:-translate-x-1/2
                motion-safe:data-starting-style:data-[activation-direction=left]:-translate-x-1/2
                motion-safe:data-ending-style:data-[activation-direction=left]:translate-x-1/2
                group-data-[instant]:data-starting-style:data-[activation-direction=right]:translate-x-0
                group-data-[instant]:data-ending-style:data-[activation-direction=right]:translate-x-0
                group-data-[instant]:data-starting-style:data-[activation-direction=left]:translate-x-0
                group-data-[instant]:data-ending-style:data-[activation-direction=left]:translate-x-0
                motion-reduce:translate-x-0
              `
            : // prettier-ignore
              `
                flex w-max min-w-full max-w-(--available-width) translate-y-0 flex-col opacity-100
                transition-[opacity,translate]
                [transition:opacity_175ms_ease,translate_var(--popup-surface-layout-duration)_var(--popup-surface-layout-easing)]
                group-data-[instant]:translate-y-0
                data-starting-style:opacity-0 data-ending-style:opacity-0
                motion-safe:data-starting-style:data-[activation-direction=down]:translate-y-1/2
                motion-safe:data-ending-style:data-[activation-direction=down]:-translate-y-1/2
                motion-safe:data-starting-style:data-[activation-direction=up]:-translate-y-1/2
                motion-safe:data-ending-style:data-[activation-direction=up]:translate-y-1/2
                group-data-[instant]:data-starting-style:data-[activation-direction=down]:translate-y-0
                group-data-[instant]:data-ending-style:data-[activation-direction=down]:translate-y-0
                group-data-[instant]:data-starting-style:data-[activation-direction=up]:translate-y-0
                group-data-[instant]:data-ending-style:data-[activation-direction=up]:translate-y-0
                motion-reduce:translate-y-0
              `
        )
      }
      render={
        typeof render === 'function'
          ? (elementProps, state) =>
              render(elementProps, controlled ? { ...state, activationDirection } : state)
          : render
      }
      style={(state) =>
        typeof style === 'function'
          ? style(controlled ? { ...state, activationDirection } : state)
          : style
      }
    />
  )
}
