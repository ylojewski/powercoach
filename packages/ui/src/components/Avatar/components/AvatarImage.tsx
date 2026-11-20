import { Avatar as BaseUiAvatar } from '@base-ui/react/avatar'
import { mergeProps } from '@base-ui/react/merge-props'
import { type ComponentPropsWithRef, type ReactElement, useCallback, useState } from 'react'
import { twMerge } from 'tailwind-merge'

import { AvatarImageRender } from './AvatarImageRender'

export type AvatarImageProps = BaseUiAvatar.Image.Props

export function AvatarImage({
  className,
  crossOrigin,
  onLoadingStatusChange,
  referrerPolicy,
  render,
  sizes,
  src,
  srcSet,
  ...props
}: AvatarImageProps): ReactElement {
  const [retainedSourceProps, setRetainedSourceProps] = useState<Pick<
    AvatarImageProps,
    'crossOrigin' | 'referrerPolicy' | 'sizes' | 'src' | 'srcSet'
  > | null>(null)
  const handleLoadingStatusChange = useCallback(
    (status: BaseUiAvatar.Image.State['imageLoadingStatus']) => {
      if (status === 'loaded') {
        setRetainedSourceProps({ crossOrigin, referrerPolicy, sizes, src, srcSet })
      }

      onLoadingStatusChange?.(status)
    },
    [crossOrigin, onLoadingStatusChange, referrerPolicy, sizes, src, srcSet]
  )

  return (
    <BaseUiAvatar.Image
      {...props}
      crossOrigin={crossOrigin}
      onLoadingStatusChange={handleLoadingStatusChange}
      referrerPolicy={referrerPolicy}
      render={(elementProps, state) => (
        <AvatarImageRender
          {...(state.transitionStatus === 'ending' && retainedSourceProps !== null
            ? mergeProps<'img'>(elementProps as ComponentPropsWithRef<'img'>, retainedSourceProps)
            : (elementProps as ComponentPropsWithRef<'img'>))}
          render={render}
          state={state}
        />
      )}
      sizes={sizes}
      src={src}
      srcSet={srcSet}
      className={(state) =>
        twMerge(
          mergeProps<'img'>(
            {
              className: typeof className === 'function' ? className(state) : className
            },
            {
              className:
                'data-ending-style:opacity-0 data-starting-style:opacity-0 motion-reduce:duration-0'
            },
            {
              className: 'opacity-100 transition-opacity duration-150 ease-linear'
            },
            {
              className: 'absolute inset-0 z-20 size-full object-cover'
            }
          ).className
        )
      }
    />
  )
}

// Declaration merging exposes the documented Avatar.Image.* consumer types.
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace AvatarImage {
  export type State = BaseUiAvatar.Image.State
  export type Props = AvatarImageProps
}
