import { mergeProps } from '@base-ui/react/merge-props'
import { useContext, type ComponentPropsWithRef, type ReactElement } from 'react'

import { railsOrientationContext } from '../constants/railsOrientationContext'

export interface RailsListProps extends ComponentPropsWithRef<'div'> {}

export function RailsList({ className, ...props }: RailsListProps): ReactElement {
  const orientation = useContext(railsOrientationContext)

  return (
    <div
      {...mergeProps<'div'>(
        {
          className: `
            flex size-full min-h-0 min-w-0 items-stretch justify-end overflow-hidden
            [--rails-border-width:1px]
          `,
          'data-rails-list': ''
        } as ComponentPropsWithRef<'div'>,
        {
          className:
            orientation === 'horizontal'
              ? `
                  flex-col
                  [&>[data-index]+[data-index]]:[margin-block-start:calc(-1*var(--rails-border-width))]
                `
              : `
                  [&>[data-index]+[data-index]]:[margin-inline-start:calc(-1*var(--rails-border-width))]
                `
        },
        {
          className
        },
        props
      )}
    />
  )
}

// Declaration merging exposes the documented Rails.List.* consumer types.
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace RailsList {
  export type Props = RailsListProps
}
