import { mergeProps } from '@base-ui/react/merge-props'
import { useRender } from '@base-ui/react/use-render'
import {
  useCallback,
  useContext,
  useLayoutEffect,
  useMemo,
  useState,
  type ComponentPropsWithRef,
  type CSSProperties,
  type ReactElement,
  type Ref
} from 'react'
import { createPortal } from 'react-dom'

import { LoadingCoverLogo } from './LoadingCoverLogo'
import { RevealAnimation, type RevealAnimationProps } from '../../../animations'
import {
  loadingCoverAnnouncementContext,
  type LoadingCoverAnnouncementContextValue
} from '../constants/loadingCoverAnnouncementContext'
import { loadingCoverCoordinatorContext } from '../constants/loadingCoverCoordinatorContext'
import { useLoadingCoverDirectionChange } from '../hooks/useLoadingCoverDirectionChange'
import { useLoadingCoverLoadingChange } from '../hooks/useLoadingCoverLoadingChange'
import { useLoadingCoverMembership } from '../hooks/useLoadingCoverMembership'
import { useLoadingCoverRegistry } from '../hooks/useLoadingCoverRegistry'
import { resolveLoadingCoverStateProp } from '../utils/resolveLoadingCoverStateProp'

export type LoadingCoverVisualState = 'hidden' | 'revealing' | 'revealed' | 'unrevealing'

export interface LoadingCoverRootState {
  busy: boolean
  fullscreen: boolean
  loading: boolean
  visualState: LoadingCoverVisualState
}

export type LoadingCoverRevealAnimationProps = Omit<
  RevealAnimationProps,
  'children' | 'contentMode' | 'render' | 'reveal' | 'scale' | 'unrevealBehavior'
>

export type LoadingCoverRootProps = Omit<
  useRender.ComponentProps<'div', LoadingCoverRootState>,
  'className' | 'ref' | 'style'
> & {
  'aria-label'?: string
  className?: string | ((state: LoadingCoverRootState) => string | undefined)
  fullscreen?: boolean
  loading: boolean
  logo?: ReactElement | null
  ref?: Ref<HTMLElement>
  revealAnimationProps?: LoadingCoverRevealAnimationProps
  style?: CSSProperties | ((state: LoadingCoverRootState) => CSSProperties | undefined)
}

export function LoadingCoverRoot({
  'aria-label': statusLabel = 'Loading',
  children,
  className,
  fullscreen = false,
  loading,
  logo,
  ref,
  render,
  revealAnimationProps,
  style,
  ...props
}: LoadingCoverRootProps): ReactElement {
  const parentAnnouncement = useContext(loadingCoverAnnouncementContext)
  const parentCoordinator = useContext(loadingCoverCoordinatorContext)
  const descendantCoordinator = useLoadingCoverRegistry()
  const descendantAnnouncements = useLoadingCoverRegistry()
  const [contentMounted, setContentMounted] = useState(true)
  const [membersSettled, setMembersSettled] = useState(true)
  const [revealTarget, setRevealTarget] = useState(false)
  const [visualState, setVisualState] = useState<LoadingCoverVisualState>('hidden')
  const direction = revealAnimationProps?.direction ?? 'left-to-right'
  const coordinated = parentCoordinator !== null
  const busy = visualState === 'revealing' || visualState === 'revealed'
  const blocked =
    loading ||
    busy ||
    (visualState === 'unrevealing' && coordinated && !descendantCoordinator.everyMemberResolved)
  const activeLayer = loading || visualState !== 'hidden'
  const branchHasBusyFullscreen = (busy && fullscreen) || descendantAnnouncements.someMemberActive
  const ownsStatus = fullscreen
    ? busy && !(parentAnnouncement?.busyFullscreenAncestor ?? false)
    : busy &&
      !(parentAnnouncement?.busyFullscreenAncestor ?? false) &&
      !(parentAnnouncement?.busyLocalAncestor ?? false) &&
      !descendantAnnouncements.someMemberActive
  const state = useMemo<LoadingCoverRootState>(
    () => ({ busy, fullscreen, loading, visualState }),
    [busy, fullscreen, loading, visualState]
  )
  const resolvedClassName = resolveLoadingCoverStateProp(className, state)
  const resolvedStyle = resolveLoadingCoverStateProp(style, state)
  const announcementContextValue = useMemo<LoadingCoverAnnouncementContextValue>(
    () => ({
      ...descendantAnnouncements.registry,
      busyFullscreenAncestor:
        (parentAnnouncement?.busyFullscreenAncestor ?? false) || (busy && fullscreen),
      busyLocalAncestor: (parentAnnouncement?.busyLocalAncestor ?? false) || (busy && !fullscreen)
    }),
    [
      busy,
      descendantAnnouncements.registry,
      fullscreen,
      parentAnnouncement?.busyFullscreenAncestor,
      parentAnnouncement?.busyLocalAncestor
    ]
  )
  const childCoordinator = coordinated ? descendantCoordinator.registry : null
  const { alignX, alignY, offsetX, offsetY, onRevealChange, onRevealComplete, onRevealStart } =
    revealAnimationProps ?? {}

  useLoadingCoverMembership({
    registry: parentCoordinator,
    value: !loading && visualState === 'hidden'
  })
  useLoadingCoverMembership({
    registry: parentAnnouncement,
    value: branchHasBusyFullscreen
  })
  useLoadingCoverDirectionChange({
    direction,
    loading,
    revealTarget,
    setContentMounted,
    setMembersSettled,
    setVisualState,
    visualState
  })
  useLoadingCoverLoadingChange({
    contentMounted,
    loading,
    setContentMounted,
    setMembersSettled,
    setRevealTarget,
    setVisualState,
    visualState
  })

  useLayoutEffect(() => {
    if (loading || visualState !== 'revealed') {
      return
    }

    if (!contentMounted) {
      setContentMounted(true)
      setMembersSettled(false)
      return
    }

    if (!membersSettled) {
      setMembersSettled(true)
    }
  }, [contentMounted, loading, membersSettled, visualState])

  useLayoutEffect(() => {
    if (
      loading ||
      visualState !== 'revealed' ||
      !contentMounted ||
      !membersSettled ||
      (coordinated && !descendantCoordinator.everyMemberResolved)
    ) {
      return
    }

    setRevealTarget(false)
    setVisualState('unrevealing')
  }, [
    contentMounted,
    coordinated,
    descendantCoordinator.everyMemberResolved,
    loading,
    membersSettled,
    visualState
  ])

  useLayoutEffect(() => {
    if (
      loading ||
      visualState !== 'unrevealing' ||
      !coordinated ||
      descendantCoordinator.everyMemberResolved
    ) {
      return
    }

    setRevealTarget(true)
    setMembersSettled(false)
    setVisualState('revealing')
  }, [coordinated, descendantCoordinator.everyMemberResolved, loading, visualState])

  const handleRevealComplete = useCallback(
    (revealed: boolean) => {
      if (revealed) {
        setContentMounted(!loading)
        setMembersSettled(false)
        setVisualState('revealed')
      } else {
        setContentMounted(true)
        setMembersSettled(true)
        setVisualState('hidden')
      }

      onRevealComplete?.(revealed)
    },
    [loading, onRevealComplete]
  )
  const resolvedLogo = logo === undefined ? <LoadingCoverLogo /> : logo
  const layer = activeLayer ? (
    <div
      className={
        fullscreen
          ? `pointer-events-auto fixed inset-0 z-[2147483647] grid [&_[data-reveal-surface]]:size-full [&>[data-motion=reveal]]:size-full`
          : `pointer-events-auto absolute inset-0 z-10 grid [&_[data-reveal-surface]]:size-full [&>[data-motion=reveal]]:size-full`
      }
      data-loading-cover-layer=""
    >
      {ownsStatus ? (
        <span
          aria-atomic="true"
          aria-live="polite"
          className="sr-only"
          data-loading-cover-status=""
          role="status"
        >
          {statusLabel}
        </span>
      ) : null}
      <RevealAnimation
        alignX={alignX}
        alignY={alignY}
        contentMode="flow"
        direction={direction}
        offsetX={offsetX}
        offsetY={offsetY}
        onRevealChange={onRevealChange}
        onRevealComplete={handleRevealComplete}
        onRevealStart={onRevealStart}
        render={
          <div
            aria-hidden="true"
            className={
              // prettier-ignore
              `
                pointer-events-none flex size-full items-center justify-center
                bg-background text-foreground select-none
                data-[reveal-source]:bg-transparent data-[reveal-source]:[&>*]:invisible
              `
            }
            inert
          />
        }
        reveal={revealTarget}
        scale={1}
        unrevealBehavior="continue"
      >
        {resolvedLogo}
      </RevealAnimation>
    </div>
  ) : null
  const element = useRender<LoadingCoverRootState & Record<string, unknown>, HTMLElement>({
    defaultTagName: 'div',
    props: mergeProps<'div'>(
      {
        className: 'relative isolate'
      },
      props,
      {
        children: (
          <>
            <div
              aria-busy={blocked ? 'true' : undefined}
              aria-hidden={blocked ? 'true' : undefined}
              className={blocked ? 'pointer-events-none' : undefined}
              data-loading-cover-content=""
              inert={blocked || undefined}
            >
              {contentMounted ? children : null}
            </div>
            {!fullscreen ? layer : null}
          </>
        ),
        className: resolvedClassName,
        'data-fullscreen': fullscreen ? '' : undefined,
        'data-loading': loading ? '' : undefined,
        'data-loading-cover-root': '',
        'data-loading-cover-state': visualState,
        style: resolvedStyle
      } as ComponentPropsWithRef<'div'>
    ) as Record<string, unknown>,
    ref,
    render,
    state: state as LoadingCoverRootState & Record<string, unknown>,
    stateAttributesMapping: {
      busy: () => null,
      fullscreen: () => null,
      loading: () => null,
      visualState: () => null
    }
  })

  return (
    <loadingCoverAnnouncementContext.Provider value={announcementContextValue}>
      <loadingCoverCoordinatorContext.Provider value={childCoordinator}>
        {element}
        {fullscreen && layer !== null ? createPortal(layer, document.body) : null}
      </loadingCoverCoordinatorContext.Provider>
    </loadingCoverAnnouncementContext.Provider>
  )
}

// Declaration merging exposes the documented LoadingCover.Root.* consumer types.
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace LoadingCoverRoot {
  export type Props = LoadingCoverRootProps
  export type State = LoadingCoverRootState
}
