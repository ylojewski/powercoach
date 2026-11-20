import { Accordion } from '@base-ui/react/accordion'
import { mergeProps } from '@base-ui/react/merge-props'
import { useContext, type CSSProperties, type ReactElement } from 'react'
import { twMerge } from 'tailwind-merge'

import { railsOrientationContext } from '../constants/railsOrientationContext'
import { normalizeRailsState, type RailsState } from '../utils/normalizeRailsState'
import { renderRailsElement, type RailsRenderProp } from '../utils/renderRailsElement'
import { resolveRailsProp } from '../utils/resolveRailsProp'

export type RailsHeaderState = RailsState<Accordion.Header.State>

export interface RailsHeaderProps
  extends Omit<Accordion.Header.Props, 'className' | 'render' | 'style'> {
  className?: string | ((state: RailsHeaderState) => string | undefined)
  render?: RailsRenderProp<RailsHeaderState>
  style?: CSSProperties | ((state: RailsHeaderState) => CSSProperties | undefined)
}

export function RailsHeader({
  className,
  render,
  style,
  ...props
}: RailsHeaderProps): ReactElement {
  const orientation = useContext(railsOrientationContext)

  return (
    <Accordion.Header
      {...props}
      className={(state) =>
        twMerge(
          mergeProps<'h3'>(
            {
              className: resolveRailsProp(className, normalizeRailsState(state, orientation))
            },
            {
              className:
                orientation === 'vertical'
                  ? `m-0 flex h-full shrink-0 items-stretch [&>[data-reveal-root]]:h-full`
                  : `m-0 flex w-full shrink-0 items-stretch [&>[data-reveal-root]]:w-full`
            }
          ).className
        )
      }
      render={(headerProps, state) => {
        const renderedHeaderProps = { ...headerProps } as typeof headerProps & {
          'data-orientation'?: string
        }

        delete renderedHeaderProps['data-orientation']

        return renderRailsElement(
          'h3',
          render,
          renderedHeaderProps,
          normalizeRailsState(state, orientation)
        )
      }}
      style={(state) => resolveRailsProp(style, normalizeRailsState(state, orientation))}
    />
  )
}

// Declaration merging exposes the documented Rails.Header.* consumer types.
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace RailsHeader {
  export type State = RailsHeaderState
  export type Props = RailsHeaderProps
}
