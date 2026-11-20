import { mergeProps } from '@base-ui/react/merge-props'
import { Tabs as BaseUiTabs } from '@base-ui/react/tabs'
import { type ReactElement } from 'react'

import { tabsListContext, type TabsListContextValue } from '../constants/tabsListContext'

export type TabsListState = BaseUiTabs.List.State

export type TabsListProps = BaseUiTabs.List.Props

export function TabsList({ children, className, style, ...props }: TabsListProps): ReactElement {
  const borderWidth = String(
    (Object(style) as Record<string, unknown>)['--tabs-border-width'] ??
      'var(--tabs-border-width, 1px)'
  )
  const listState: TabsListContextValue = {
    borderWidth,
    firstTabValue: undefined
  }

  return (
    <tabsListContext.Provider value={listState}>
      <BaseUiTabs.List
        {...props}
        className={(state) =>
          mergeProps<'div'>(
            {
              // prettier-ignore
              className: `
                relative isolate [--tabs-border-width:1px]
                [&>[data-reveal-root]]:z-0
                [&>[data-reveal-root]:has([data-reveal-surface]_[data-active])]:z-10
                [&>[data-reveal-root]:has([data-reveal-surface]_:focus-visible)]:z-20!
              `
            },
            {
              className: typeof className === 'function' ? className(state) : className
            }
          ).className
        }
        style={style}
      >
        {children}
      </BaseUiTabs.List>
    </tabsListContext.Provider>
  )
}

// Declaration merging exposes the documented Tabs.List.* consumer types.
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace TabsList {
  export type State = TabsListState
  export type Props = TabsListProps
}
