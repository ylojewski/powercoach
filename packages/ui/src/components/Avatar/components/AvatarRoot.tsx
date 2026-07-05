import { Avatar as BaseUiAvatar } from '@base-ui/react/avatar'
import { mergeProps } from '@base-ui/react/merge-props'
import { type CSSProperties, type ReactElement, useMemo, useRef, useState } from 'react'
import { twMerge } from 'tailwind-merge'

import { AvatarRevealSurface } from './AvatarRevealSurface'
import { RevealAnimation, type RevealAnimationProps } from '../../../animations'
import { buttonChromeVariants } from '../../Button'
import { avatarContext } from '../constants/avatarContext'
import {
  AVATAR_DEFAULT_SIZE,
  AVATAR_HARD_SHADOWS,
  avatarRootVariants,
  type AvatarSize
} from '../constants/avatarRootVariants'

export type AvatarRevealAnimationProps = Omit<
  RevealAnimationProps,
  'children' | 'contentMode' | 'render' | 'scale'
>

export interface AvatarRootProps extends BaseUiAvatar.Root.Props {
  revealAnimationProps?: boolean | AvatarRevealAnimationProps
  size?: AvatarSize
}

export function AvatarRoot({
  children,
  className,
  revealAnimationProps = true,
  size = AVATAR_DEFAULT_SIZE,
  style,
  ...props
}: AvatarRootProps): ReactElement {
  const [decorativeFallbackSurface, setDecorativeFallbackSurface] = useState<HTMLElement | null>(
    null
  )
  const [focused, setFocused] = useState(false)
  const [hovered, setHovered] = useState(false)
  const pointerFocusPending = useRef(false)
  const context = useMemo(
    () => ({ decorativeFallbackSurface, size }),
    [decorativeFallbackSurface, size]
  )
  const controlledReveal =
    typeof revealAnimationProps === 'object' ? revealAnimationProps.reveal : undefined
  const effectiveReveal = controlledReveal ?? (focused || hovered)
  const realSurface = <AvatarRevealSurface realChildren={children} />
  const resolvedChildren =
    revealAnimationProps === false ? (
      realSurface
    ) : (
      <RevealAnimation
        {...(typeof revealAnimationProps === 'object' ? revealAnimationProps : undefined)}
        contentMode="phrasing"
        render={realSurface}
        reveal={effectiveReveal}
        scale={1}
      >
        <span ref={setDecorativeFallbackSurface} />
      </RevealAnimation>
    )

  return (
    <avatarContext.Provider value={context}>
      <BaseUiAvatar.Root
        {...mergeProps<'span'>(
          {
            onBlur: (event) => {
              pointerFocusPending.current = false
              setFocused(event.currentTarget.contains(event.relatedTarget as Node | null))
            },
            onFocus: () => {
              const isPointerFocus = pointerFocusPending.current

              pointerFocusPending.current = false
              setFocused(!isPointerFocus)
            },
            onPointerDown: () => {
              pointerFocusPending.current = true
              setFocused(false)
            },
            onPointerEnter: () => {
              setHovered(true)
            },
            onPointerLeave: () => {
              pointerFocusPending.current = false
              setHovered(false)
            }
          },
          props
        )}
        className={(state) =>
          twMerge(
            mergeProps<'span'>(
              {
                className: typeof className === 'function' ? className(state) : className
              },
              {
                className: avatarRootVariants({ size })
              },
              {
                className: buttonChromeVariants({ size: `icon-${size}`, variant: 'default' })
              }
            ).className
          )
        }
        style={(state) =>
          mergeProps<'span'>(
            {
              style: {
                '--hard-shadow': AVATAR_HARD_SHADOWS[size]
              } as CSSProperties
            },
            {
              style: typeof style === 'function' ? style(state) : style
            }
          ).style
        }
      >
        {resolvedChildren}
      </BaseUiAvatar.Root>
    </avatarContext.Provider>
  )
}

// Declaration merging exposes the documented Avatar.Root.* consumer types.
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace AvatarRoot {
  export type State = BaseUiAvatar.Root.State
  export type Props = AvatarRootProps
}
