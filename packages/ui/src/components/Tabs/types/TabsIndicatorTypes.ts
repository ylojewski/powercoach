import { type CSSProperties, type Ref, type TransitionEvent } from 'react'

import { type TabsIndicatorState } from '../components/TabsIndicator'

export type TabsIndicatorElementProps = Record<string, unknown> & {
  className?: string
  hidden?: boolean
  onTransitionEnd?: (event: TransitionEvent<HTMLElement>) => void
  ref?: Ref<HTMLElement>
  style?: CSSProperties
}

export interface TabsIndicatorSnapshot {
  elementProps: TabsIndicatorElementProps
  state: TabsIndicatorState
}

export type TabsIndicatorTransitionStatus = 'ending' | 'starting' | undefined
