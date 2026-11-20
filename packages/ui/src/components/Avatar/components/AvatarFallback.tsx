import { Avatar as BaseUiAvatar } from '@base-ui/react/avatar'
import { mergeProps } from '@base-ui/react/merge-props'
import { type ReactElement, use } from 'react'
import { createPortal } from 'react-dom'
import { twMerge } from 'tailwind-merge'

import { Heading, type HeadingProps } from '../../Heading'
import { avatarContext, type AvatarContextValue } from '../constants/avatarContext'

export interface AvatarFallbackProps extends BaseUiAvatar.Fallback.Props {
  headingProps?: Omit<HeadingProps, 'children' | 'size'>
}

export function AvatarFallback({
  children,
  className,
  headingProps,
  ...props
}: AvatarFallbackProps): ReactElement {
  const { decorativeFallbackSurface, size } = use(avatarContext) as AvatarContextValue
  const heading = (
    <Heading {...(headingProps as HeadingProps)} size={size}>
      {children}
    </Heading>
  )

  return (
    <BaseUiAvatar.Fallback
      {...props}
      className={(state) =>
        twMerge(
          mergeProps<'span'>(
            {
              className: typeof className === 'function' ? className(state) : className
            },
            {
              className:
                'relative z-0 flex size-full items-center justify-center overflow-hidden leading-none'
            }
          ).className
        )
      }
    >
      {heading}
      {decorativeFallbackSurface === null
        ? null
        : createPortal(
            <Heading {...(headingProps as HeadingProps)} size={size}>
              {children}
            </Heading>,
            decorativeFallbackSurface
          )}
    </BaseUiAvatar.Fallback>
  )
}

// Declaration merging exposes the documented Avatar.Fallback.* consumer types.
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace AvatarFallback {
  export type State = BaseUiAvatar.Fallback.State
  export type Props = AvatarFallbackProps
}
