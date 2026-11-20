import { mergeProps } from '@base-ui/react/merge-props'
import { type ComponentPropsWithRef, type ReactElement } from 'react'

import { LogoIcon, type LogoIconProps } from '../../LogoIcon'

export interface LoadingCoverLogoProps extends LogoIconProps {}

export type LoadingCoverLogoState = Record<string, never>

export function LoadingCoverLogo({
  variant = 'foreground',
  ...props
}: LoadingCoverLogoProps): ReactElement {
  return (
    <LogoIcon
      {...mergeProps<'svg'>(
        {
          className: 'pointer-events-none block size-16 select-none'
        },
        props,
        {
          'aria-hidden': 'true',
          'data-loading-cover-logo': '',
          focusable: 'false',
          tabIndex: -1
        } as ComponentPropsWithRef<'svg'>
      )}
      variant={variant}
    />
  )
}

// Declaration merging exposes the documented LoadingCover.Logo.* consumer types.
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace LoadingCoverLogo {
  export type Props = LoadingCoverLogoProps
  export type State = LoadingCoverLogoState
}
