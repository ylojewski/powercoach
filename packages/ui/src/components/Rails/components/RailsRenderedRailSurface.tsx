import { mergeProps } from '@base-ui/react/merge-props'
import { type ComponentPropsWithoutRef, type ReactElement, type ReactNode } from 'react'

import { type RailsRailProps, type RailsRailState } from './RailsRail'
import { renderRailsElement } from '../utils/renderRailsElement'

export interface RailsRenderedRailSurfaceProps extends ComponentPropsWithoutRef<'button'> {
  children?: ReactNode
  nativeButton?: boolean
  render: NonNullable<RailsRailProps['render']>
  state: RailsRailState
}

export function RailsRenderedRailSurface({
  children,
  nativeButton: _nativeButton,
  render,
  state,
  ...props
}: RailsRenderedRailSurfaceProps): ReactElement {
  return renderRailsElement(
    'button',
    render,
    mergeProps<'button'>(props, {
      children
    }),
    state
  )
}
