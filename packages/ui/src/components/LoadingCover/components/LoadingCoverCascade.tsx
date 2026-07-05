import { mergeProps } from '@base-ui/react/merge-props'
import { useRender } from '@base-ui/react/use-render'
import {
  useContext,
  useMemo,
  type ComponentPropsWithRef,
  type CSSProperties,
  type ReactElement,
  type Ref
} from 'react'

import { loadingCoverCoordinatorContext } from '../constants/loadingCoverCoordinatorContext'
import { useLoadingCoverMembership } from '../hooks/useLoadingCoverMembership'
import { useLoadingCoverRegistry } from '../hooks/useLoadingCoverRegistry'
import { resolveLoadingCoverStateProp } from '../utils/resolveLoadingCoverStateProp'

export interface LoadingCoverCascadeState {
  resolved: boolean
}

export type LoadingCoverCascadeProps = Omit<
  useRender.ComponentProps<'div', LoadingCoverCascadeState>,
  'className' | 'ref' | 'style'
> & {
  className?: string | ((state: LoadingCoverCascadeState) => string | undefined)
  ref?: Ref<HTMLElement>
  style?: CSSProperties | ((state: LoadingCoverCascadeState) => CSSProperties | undefined)
}

export function LoadingCoverCascade({
  children,
  className,
  ref,
  render,
  style,
  ...props
}: LoadingCoverCascadeProps): ReactElement {
  const parentCoordinator = useContext(loadingCoverCoordinatorContext)
  const { everyMemberResolved, registry } = useLoadingCoverRegistry()
  const state = useMemo<LoadingCoverCascadeState>(
    () => ({ resolved: everyMemberResolved }),
    [everyMemberResolved]
  )
  const resolvedClassName = resolveLoadingCoverStateProp(className, state)
  const resolvedStyle = resolveLoadingCoverStateProp(style, state)

  useLoadingCoverMembership({ registry: parentCoordinator, value: everyMemberResolved })

  const element = useRender<LoadingCoverCascadeState & Record<string, unknown>, HTMLElement>({
    defaultTagName: 'div',
    props: mergeProps<'div'>(
      {
        className: 'contents'
      },
      props,
      {
        children,
        className: resolvedClassName,
        'data-loading-cover-cascade': '',
        'data-loading-cover-cascade-state': everyMemberResolved ? 'resolved' : 'pending',
        style: resolvedStyle
      } as ComponentPropsWithRef<'div'>
    ) as Record<string, unknown>,
    ref,
    render,
    state: state as LoadingCoverCascadeState & Record<string, unknown>,
    stateAttributesMapping: {
      resolved: () => null
    }
  })

  return (
    <loadingCoverCoordinatorContext.Provider value={registry}>
      {element}
    </loadingCoverCoordinatorContext.Provider>
  )
}

// Declaration merging exposes the documented LoadingCover.Cascade.* consumer types.
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace LoadingCoverCascade {
  export type Props = LoadingCoverCascadeProps
  export type State = LoadingCoverCascadeState
}
