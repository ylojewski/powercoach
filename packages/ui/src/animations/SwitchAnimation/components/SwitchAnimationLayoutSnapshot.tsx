import { Component, type ReactElement, type RefObject } from 'react'

import { type SwitchAnimationPresenceLayout } from '../types/SwitchAnimationTypes'

export interface SwitchAnimationLayoutSnapshotProps {
  activePresenceId: number
  children: ReactElement
  itemElementsRef: RefObject<Map<number, HTMLElement>>
  ownedSizeRef: RefObject<boolean>
  pendingPresenceLayoutsRef: RefObject<Map<number, SwitchAnimationPresenceLayout>>
  presenceLayoutsRef: RefObject<Map<number, SwitchAnimationPresenceLayout>>
  rootElementRef: RefObject<HTMLElement | null>
}

export class SwitchAnimationLayoutSnapshot extends Component<SwitchAnimationLayoutSnapshotProps> {
  getSnapshotBeforeUpdate(
    previousProps: Readonly<SwitchAnimationLayoutSnapshotProps>
  ): SwitchAnimationPresenceLayout | null {
    if (previousProps.activePresenceId === this.props.activePresenceId) return null

    let layout = this.props.presenceLayoutsRef.current.get(
      previousProps.activePresenceId
    ) as SwitchAnimationPresenceLayout

    if (!this.props.ownedSizeRef.current) {
      const rootElement = this.props.rootElementRef.current as HTMLElement
      const activeElement = this.props.itemElementsRef.current.get(
        previousProps.activePresenceId
      ) as HTMLElement
      const rootRect = rootElement.getBoundingClientRect()
      const activeRect = activeElement.getBoundingClientRect()

      layout = {
        element: activeElement,
        height: activeRect.height,
        left: activeRect.left - rootRect.left - rootElement.clientLeft,
        rootHeight: rootRect.height,
        rootWidth: rootRect.width,
        top: activeRect.top - rootRect.top - rootElement.clientTop,
        width: activeRect.width
      }
    }

    this.props.pendingPresenceLayoutsRef.current.set(previousProps.activePresenceId, layout)
    return layout
  }

  componentDidUpdate(
    previousProps: Readonly<SwitchAnimationLayoutSnapshotProps>,
    _previousState: Readonly<Record<string, never>>,
    snapshot: SwitchAnimationPresenceLayout | null
  ): void {
    if (snapshot === null) return

    this.props.pendingPresenceLayoutsRef.current.delete(previousProps.activePresenceId)
  }

  render(): ReactElement {
    return this.props.children
  }
}
