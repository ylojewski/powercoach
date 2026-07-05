import {
  type CSSProperties,
  type Key,
  type ReactElement,
  type Ref,
  type HTMLAttributes
} from 'react'

export type SwitchAnimationContentMode = 'flow' | 'phrasing'

export type SwitchAnimationDirection = 'down' | 'up' | 'left' | 'right'

export type SwitchAnimationCompletionStatus = 'finished' | 'interrupted'

export interface SwitchAnimationReplacementDetails {
  readonly direction: SwitchAnimationDirection
  readonly nextKey: Key
  readonly previousKey: Key
  readonly replacementId: number
}

export interface SwitchAnimationCompleteDetails extends SwitchAnimationReplacementDetails {
  readonly status: SwitchAnimationCompletionStatus
}

export interface SwitchAnimationRenderProps extends HTMLAttributes<HTMLElement> {
  ref?: Ref<HTMLElement>
}

export interface SwitchAnimationStyle extends CSSProperties {
  '--switch-animation-distance'?: string
  '--switch-animation-duration'?: string
  '--switch-animation-easing'?: string
  '--switch-animation-stagger'?: string
}

export interface SwitchAnimationPresence {
  child: ReactElement
  presenceId: number
}

export interface SwitchAnimationPresenceLayout {
  element: HTMLElement
  height: number
  left: number
  rootHeight: number
  rootWidth: number
  top: number
  width: number
}

export interface SwitchAnimationGeneration extends SwitchAnimationReplacementDetails {
  incomingPresenceId: number
  leavingPresenceId: number
}

export type SwitchAnimationCompletion = SwitchAnimationCompleteDetails

export interface SwitchAnimationRenderState {
  activeChild: ReactElement
  activeKey: Key
  activePresenceId: number
  completions: SwitchAnimationCompletion[]
  generations: SwitchAnimationGeneration[]
  leavingPresences: SwitchAnimationPresence[]
  nextPresenceId: number
  nextReplacementId: number
}

export interface SwitchAnimationTransitionOwner {
  activationTimeStamp: number | null
  replacementId: number
  token: string
}

export interface SwitchAnimationOwnedTransition {
  element: HTMLElement
  propertyName: string
  token: string
}

export interface SwitchAnimationGenerationRuntime {
  cleanup: Set<() => void>
  details: SwitchAnimationReplacementDetails
  incomingElement: HTMLElement
  incomingPresenceId: number
  leavingElement: HTMLElement
  leavingPresenceId: number
  ownedTransitions: SwitchAnimationOwnedTransition[]
  pending: Set<string>
  status: SwitchAnimationCompletionStatus
  suppressedCancels: Set<string>
}
