import { mergeProps } from '@base-ui/react/merge-props'
import { useRender } from '@base-ui/react/use-render'
import {
  useCallback,
  useContext,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type MutableRefObject,
  type ReactElement,
  type Ref,
  type TransitionEvent
} from 'react'

import { type TabsIndicatorProps, type TabsIndicatorState } from './TabsIndicator'
import { tabsContext } from '../constants/tabsContext'
import { tabsIndicatorVariants } from '../constants/tabsIndicatorVariants'
import { tabsListContext } from '../constants/tabsListContext'
import { useTabsIndicatorReducedMotion } from '../hooks/useTabsIndicatorReducedMotion'
import {
  type TabsIndicatorElementProps,
  type TabsIndicatorSnapshot,
  type TabsIndicatorTransitionStatus
} from '../types/TabsIndicatorTypes'

export interface TabsIndicatorPresentationProps {
  className: TabsIndicatorProps['className']
  elementProps: Omit<
    TabsIndicatorProps,
    'className' | 'ref' | 'render' | 'renderBeforeHydration' | 'style'
  >
  forwardedRef: Ref<HTMLElement> | undefined
  render: TabsIndicatorProps['render']
  snapshotRef: MutableRefObject<TabsIndicatorSnapshot | null>
  style: TabsIndicatorProps['style']
}

export function TabsIndicatorPresentation({
  className,
  elementProps: externalElementProps,
  forwardedRef,
  render,
  snapshotRef,
  style
}: TabsIndicatorPresentationProps): ReactElement | null {
  const rootState = useContext(tabsContext)
  const listState = useContext(tabsListContext)
  const currentSnapshot = snapshotRef.current
  const selected = rootState.value !== null
  const currentGeometryIsActive =
    selected &&
    currentSnapshot !== null &&
    currentSnapshot.state.activeTabPosition !== null &&
    currentSnapshot.state.activeTabSize !== null
  const reducedMotion = useTabsIndicatorReducedMotion()
  const [indicator, setIndicator] = useState<HTMLElement | null>(null)
  const [mounted, setMounted] = useState(selected)
  const [transitionStatus, setTransitionStatus] = useState<TabsIndicatorTransitionStatus>(undefined)
  const lastActiveSnapshotRef = useRef<TabsIndicatorSnapshot | null>(
    currentGeometryIsActive ? currentSnapshot : null
  )
  const hasCommittedNoSelectionRef = useRef(!selected)

  if (selected && !mounted) {
    setMounted(true)
    setTransitionStatus(
      reducedMotion || !hasCommittedNoSelectionRef.current ? undefined : 'starting'
    )
  } else if (reducedMotion && transitionStatus !== undefined) {
    setTransitionStatus(undefined)
  } else if (selected && transitionStatus === 'ending') {
    setTransitionStatus('starting')
  } else if (!selected && mounted && transitionStatus !== 'ending') {
    if (reducedMotion) {
      setMounted(false)
      setTransitionStatus(undefined)
    } else {
      setTransitionStatus('ending')
    }
  }

  useLayoutEffect(() => {
    if (currentGeometryIsActive && currentSnapshot !== null) {
      lastActiveSnapshotRef.current = currentSnapshot
    }

    if (!selected) {
      hasCommittedNoSelectionRef.current = true
    }
  }, [currentGeometryIsActive, currentSnapshot, selected])

  useLayoutEffect(() => {
    if (transitionStatus !== 'starting' || !currentGeometryIsActive) {
      return
    }

    const frame = requestAnimationFrame(() => {
      setTransitionStatus(undefined)
    })

    return () => cancelAnimationFrame(frame)
  }, [currentGeometryIsActive, transitionStatus])

  const setPresentationElement = useCallback((element: HTMLElement | null) => {
    setIndicator(element)
  }, [])

  useLayoutEffect(() => {
    if (indicator === null || !currentGeometryIsActive) {
      return
    }

    const list = indicator.parentElement as HTMLElement

    const syncLeadingBorderOffset = () => {
      const firstTabUnit = Array.from(list.children).find((child) =>
        child.hasAttribute('data-reveal-root')
      )
      const isFirstTabActive =
        firstTabUnit?.querySelector('[data-reveal-surface] [data-active]') !== null
      const borderWidth =
        getComputedStyle(list).getPropertyValue('--tabs-border-width').trim() || '1px'
      const leadingBorderOffset = isFirstTabActive ? '0px' : borderWidth

      if (
        indicator.style.getPropertyValue('--tabs-active-leading-border-offset') !==
        leadingBorderOffset
      ) {
        indicator.style.setProperty('--tabs-active-leading-border-offset', leadingBorderOffset)
      }
    }

    syncLeadingBorderOffset()

    const observer = new MutationObserver(syncLeadingBorderOffset)

    observer.observe(list, {
      attributeFilter: ['class', 'data-active', 'style'],
      attributes: true,
      childList: true,
      subtree: true
    })

    return () => observer.disconnect()
  }, [currentGeometryIsActive, indicator])

  const fallbackState: TabsIndicatorState = {
    activeTabPosition: null,
    activeTabSize: null,
    orientation: rootState.orientation,
    tabActivationDirection: 'none'
  }
  const presentationState = selected
    ? (currentSnapshot?.state ?? fallbackState)
    : {
        ...(currentSnapshot?.state ?? fallbackState),
        activeTabPosition: null,
        activeTabSize: null,
        tabActivationDirection: 'none' as const
      }
  const fallbackElementProps = mergeProps<'span'>(
    {
      'data-activation-direction': presentationState.tabActivationDirection,
      'data-orientation': presentationState.orientation,
      hidden: true,
      role: 'presentation'
    } as TabsIndicatorElementProps,
    externalElementProps as TabsIndicatorElementProps,
    {
      className: tabsIndicatorVariants({ orientation: presentationState.orientation }),
      style: {
        '--tabs-active-leading-border-offset':
          rootState.value === listState.firstTabValue ? '0px' : listState.borderWidth
      } as CSSProperties,
      suppressHydrationWarning: true
    }
  ) as TabsIndicatorElementProps
  const activeSnapshot = currentGeometryIsActive ? currentSnapshot : lastActiveSnapshotRef.current
  const presentationElementProps = mergeProps<'span'>(
    currentSnapshot?.elementProps ?? fallbackElementProps,
    {
      onTransitionEnd: (event: TransitionEvent<HTMLElement>) => {
        if (
          event.target === event.currentTarget &&
          event.propertyName === 'translate' &&
          !selected &&
          transitionStatus === 'ending'
        ) {
          setMounted(false)
          setTransitionStatus(undefined)
        }
      }
    }
  ) as TabsIndicatorElementProps

  if (!currentGeometryIsActive && activeSnapshot !== null) {
    const frozenStyle = activeSnapshot.elementProps.style as CSSProperties & Record<string, unknown>
    const nextStyle = {
      ...presentationElementProps.style
    } as CSSProperties & Record<string, unknown>

    for (const property of [
      '--active-tab-left',
      '--active-tab-right',
      '--active-tab-top',
      '--active-tab-bottom',
      '--active-tab-width',
      '--active-tab-height'
    ] as const) {
      nextStyle[property] = frozenStyle[property]
    }

    presentationElementProps.hidden = activeSnapshot.elementProps.hidden
    presentationElementProps.style = nextStyle
  }

  presentationElementProps['data-starting-style'] = transitionStatus === 'starting' ? '' : undefined
  presentationElementProps['data-ending-style'] = transitionStatus === 'ending' ? '' : undefined
  const renderState = presentationState as unknown as Record<string, unknown>
  const renderParameters: useRender.Parameters<Record<string, unknown>, HTMLElement, boolean> & {
    className: TabsIndicatorProps['className']
    style: TabsIndicatorProps['style']
  } = {
    className,
    defaultTagName: 'span',
    enabled: mounted,
    props: presentationElementProps,
    ref: [forwardedRef ?? null, setPresentationElement],
    render: render as useRender.RenderProp<Record<string, unknown>>,
    state: renderState,
    stateAttributesMapping: {
      activeTabPosition: () => null,
      activeTabSize: () => null,
      orientation: (orientation) => ({ 'data-orientation': String(orientation) }),
      tabActivationDirection: (direction) => ({
        'data-activation-direction': String(direction)
      })
    },
    style
  }

  return useRender<Record<string, unknown>, HTMLElement, boolean>(renderParameters)
}
