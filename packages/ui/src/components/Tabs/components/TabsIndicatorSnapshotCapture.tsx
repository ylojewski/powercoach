import { useLayoutEffect, type ReactElement } from 'react'

import { type TabsIndicatorState } from './TabsIndicator'

export interface TabsIndicatorSnapshotCaptureProps {
  activeTabBottom: number | null
  activeTabHeight: number | null
  activeTabLeft: number | null
  activeTabRight: number | null
  activeTabTop: number | null
  activeTabWidth: number | null
  onSnapshotChange: () => void
  orientation: TabsIndicatorState['orientation']
  tabActivationDirection: TabsIndicatorState['tabActivationDirection']
}

export function TabsIndicatorSnapshotCapture({
  activeTabBottom,
  activeTabHeight,
  activeTabLeft,
  activeTabRight,
  activeTabTop,
  activeTabWidth,
  onSnapshotChange,
  orientation,
  tabActivationDirection
}: TabsIndicatorSnapshotCaptureProps): ReactElement | null {
  useLayoutEffect(() => {
    onSnapshotChange()
  }, [
    activeTabBottom,
    activeTabHeight,
    activeTabLeft,
    activeTabRight,
    activeTabTop,
    activeTabWidth,
    onSnapshotChange,
    orientation,
    tabActivationDirection
  ])

  return null
}
