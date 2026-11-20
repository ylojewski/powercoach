import { Tabs as BaseUiTabs } from '@base-ui/react/tabs'
import { useCallback, useReducer, useRef, type ReactElement, type Ref } from 'react'

import { TabsIndicatorPresentation } from './TabsIndicatorPresentation'
import { TabsIndicatorSnapshotCapture } from './TabsIndicatorSnapshotCapture'
import { tabsIndicatorVariants } from '../constants/tabsIndicatorVariants'
import {
  type TabsIndicatorElementProps,
  type TabsIndicatorSnapshot
} from '../types/TabsIndicatorTypes'

export type TabsIndicatorState = BaseUiTabs.Indicator.State

export type TabsIndicatorProps = BaseUiTabs.Indicator.Props

export function TabsIndicator({
  className,
  ref,
  render,
  renderBeforeHydration,
  style,
  ...props
}: TabsIndicatorProps): ReactElement {
  const snapshotRef = useRef<TabsIndicatorSnapshot | null>(null)
  const [, refreshSnapshot] = useReducer((version: number) => version + 1, 0)
  const onSnapshotChange = useCallback(() => refreshSnapshot(), [])

  return (
    <>
      <TabsIndicatorPresentation
        className={className}
        elementProps={props}
        forwardedRef={ref as Ref<HTMLElement> | undefined}
        render={render}
        snapshotRef={snapshotRef}
        style={style}
      />
      <BaseUiTabs.Indicator
        {...props}
        className={(state) => tabsIndicatorVariants({ orientation: state.orientation })}
        render={(elementProps, state) => {
          snapshotRef.current = {
            elementProps: elementProps as TabsIndicatorElementProps,
            state
          }

          return (
            <TabsIndicatorSnapshotCapture
              activeTabBottom={state.activeTabPosition?.bottom ?? null}
              activeTabHeight={state.activeTabSize?.height ?? null}
              activeTabLeft={state.activeTabPosition?.left ?? null}
              activeTabRight={state.activeTabPosition?.right ?? null}
              activeTabTop={state.activeTabPosition?.top ?? null}
              activeTabWidth={state.activeTabSize?.width ?? null}
              onSnapshotChange={onSnapshotChange}
              orientation={state.orientation}
              tabActivationDirection={state.tabActivationDirection}
            />
          )
        }}
        renderBeforeHydration={renderBeforeHydration}
      />
    </>
  )
}

// Declaration merging exposes the documented Tabs.Indicator.* consumer types.
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace TabsIndicator {
  export type State = TabsIndicatorState
  export type Props = TabsIndicatorProps
}
