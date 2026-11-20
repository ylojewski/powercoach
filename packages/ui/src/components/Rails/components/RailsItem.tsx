import { Accordion } from '@base-ui/react/accordion'
import { mergeProps } from '@base-ui/react/merge-props'
import { useContext, type CSSProperties, type ReactElement } from 'react'
import { twMerge } from 'tailwind-merge'

import { railsOrientationContext } from '../constants/railsOrientationContext'
import { normalizeRailsState, type RailsState } from '../utils/normalizeRailsState'
import { renderRailsElement, type RailsRenderProp } from '../utils/renderRailsElement'
import { resolveRailsProp } from '../utils/resolveRailsProp'

export type RailsItemState = RailsState<Accordion.Item.State>

export interface RailsItemProps
  extends Omit<Accordion.Item.Props, 'className' | 'render' | 'style'> {
  className?: string | ((state: RailsItemState) => string | undefined)
  render?: RailsRenderProp<RailsItemState>
  style?: CSSProperties | ((state: RailsItemState) => CSSProperties | undefined)
}

export type RailsItemChangeEventReason = Accordion.Item.ChangeEventReason

export type RailsItemChangeEventDetails = Accordion.Item.ChangeEventDetails

export function RailsItem({ className, render, style, ...props }: RailsItemProps): ReactElement {
  const orientation = useContext(railsOrientationContext)

  return (
    <Accordion.Item
      {...props}
      className={(state) =>
        twMerge(
          mergeProps<'div'>(
            {
              className: resolveRailsProp(className, normalizeRailsState(state, orientation))
            },
            {
              className:
                orientation === 'vertical'
                  ? `flex h-full min-w-0 shrink-0 items-stretch`
                  : `flex min-h-0 w-full shrink-0 flex-col items-stretch`
            }
          ).className
        )
      }
      render={(itemProps, state) => {
        const renderedItemProps = { ...itemProps } as typeof itemProps & {
          'data-orientation'?: string
        }

        delete renderedItemProps['data-orientation']

        return renderRailsElement(
          'div',
          render,
          renderedItemProps,
          normalizeRailsState(state, orientation)
        )
      }}
      style={(state) => resolveRailsProp(style, normalizeRailsState(state, orientation))}
    />
  )
}

// Declaration merging exposes the documented Rails.Item.* consumer types.
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace RailsItem {
  export type State = RailsItemState
  export type Props = RailsItemProps
  export type ChangeEventReason = RailsItemChangeEventReason
  export type ChangeEventDetails = RailsItemChangeEventDetails
}
