import { mergeProps } from '@base-ui/react/merge-props'
import { Tabs as BaseUiTabs } from '@base-ui/react/tabs'
import { type ReactElement } from 'react'

export type TabsPanelMetadata = BaseUiTabs.Panel.Metadata

export type TabsPanelState = BaseUiTabs.Panel.State

export type TabsPanelProps = BaseUiTabs.Panel.Props

export function TabsPanel({ className, ...props }: TabsPanelProps): ReactElement {
  return (
    <BaseUiTabs.Panel
      {...props}
      className={(state) =>
        mergeProps<'div'>(
          {
            // prettier-ignore
            className: `
              col-start-1 row-start-1 w-full
              opacity-100 outline-none
              [transition:opacity_175ms_ease,translate_300ms_cubic-bezier(0.22,1,0.36,1)]
              focus-visible:z-1 focus-visible:outline-2 focus-visible:-outline-offset-1 focus-visible:outline-foreground
              data-ending-style:opacity-0 data-starting-style:opacity-0
              motion-safe:data-ending-style:data-[activation-direction=left]:translate-x-1/2
              motion-safe:data-starting-style:data-[activation-direction=left]:-translate-x-1/2
              motion-safe:data-ending-style:data-[activation-direction=right]:-translate-x-1/2
              motion-safe:data-starting-style:data-[activation-direction=right]:translate-x-1/2
              motion-safe:data-ending-style:data-[activation-direction=up]:translate-y-1/2
              motion-safe:data-starting-style:data-[activation-direction=up]:-translate-y-1/2
              motion-safe:data-ending-style:data-[activation-direction=down]:-translate-y-1/2
              motion-safe:data-starting-style:data-[activation-direction=down]:translate-y-1/2
              [[hidden]]:hidden
            `
          },
          {
            className: typeof className === 'function' ? className(state) : className
          }
        ).className
      }
    />
  )
}

// Declaration merging exposes the documented Tabs.Panel.* consumer types.
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace TabsPanel {
  export type Metadata = TabsPanelMetadata
  export type State = TabsPanelState
  export type Props = TabsPanelProps
}
