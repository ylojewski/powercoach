import { Accordion } from '@base-ui/react/accordion'
import { mergeProps } from '@base-ui/react/merge-props'
import {
  useLayoutEffect,
  useMemo,
  useRef,
  type ComponentPropsWithRef,
  type CSSProperties,
  type ReactElement
} from 'react'
import { twMerge } from 'tailwind-merge'

import { railsOrientationContext } from '../constants/railsOrientationContext'
import { railsPanelMountingContext } from '../constants/railsPanelMountingContext'
import { type RailsOrientation } from '../types/RailsOrientation'
import { composeRailsRefs } from '../utils/composeRailsRefs'
import { normalizeRailsState, type RailsState } from '../utils/normalizeRailsState'
import { renderRailsElement, type RailsRenderProp } from '../utils/renderRailsElement'
import { resolveRailsProp } from '../utils/resolveRailsProp'

export type RailsRootValue<TValue = unknown> = Accordion.Root.Value<TValue>

export type RailsRootState<TValue = unknown> = RailsState<Accordion.Root.State<TValue>>

export interface RailsRootProps<TValue = unknown>
  extends Omit<
    Accordion.Root.Props<TValue>,
    'className' | 'loopFocus' | 'multiple' | 'orientation' | 'render' | 'style'
  > {
  className?: string | ((state: RailsRootState<TValue>) => string | undefined)
  orientation?: RailsOrientation
  render?: RailsRenderProp<RailsRootState<TValue>>
  style?: CSSProperties | ((state: RailsRootState<TValue>) => CSSProperties | undefined)
}

export type RailsRootChangeEventReason = Accordion.Root.ChangeEventReason

export type RailsRootChangeEventDetails = Accordion.Root.ChangeEventDetails

export function RailsRoot<TValue = unknown>({
  children,
  className,
  hiddenUntilFound,
  keepMounted,
  onValueChange,
  orientation = 'vertical',
  ref,
  render,
  style,
  ...props
}: RailsRootProps<TValue>): ReactElement {
  const rootRef = useRef<HTMLDivElement>(null)
  const composedRootRef = useMemo(() => composeRailsRefs(rootRef, ref), [ref])
  const panelMountingContextValue = useMemo(
    () => ({
      hiddenUntilFound: hiddenUntilFound ?? false,
      keepMounted: keepMounted ?? false
    }),
    [hiddenUntilFound, keepMounted]
  )

  useLayoutEffect(() => {
    const root = rootRef.current as HTMLDivElement
    const getList = () => root.querySelector<HTMLElement>('[data-rails-list]') as HTMLElement
    const syncPanelSizes = () => {
      const list = getList()
      const items = Array.from(list.children) as HTMLElement[]
      const panels: HTMLElement[] = []
      const listRect = list.getBoundingClientRect()
      let headerHeight = 0
      let headerWidth = 0
      let itemStartMargins = 0

      for (const item of items) {
        const header = item.firstElementChild as HTMLElement
        const panel = header.nextElementSibling as HTMLElement | null
        const headerRect = header.getBoundingClientRect()
        const itemStyle = getComputedStyle(item)
        const itemStartMargin = Number.parseFloat(
          orientation === 'vertical' ? itemStyle.marginInlineStart : itemStyle.marginBlockStart
        )

        headerHeight += headerRect.height
        headerWidth += headerRect.width
        itemStartMargins += Number.isNaN(itemStartMargin) ? 0 : itemStartMargin

        if (panel !== null) {
          panels.push(panel)
        }
      }

      const panelSizeValue =
        orientation === 'vertical'
          ? Math.max(0, listRect.width - headerWidth - itemStartMargins)
          : Math.max(0, listRect.height - headerHeight - itemStartMargins)
      const panelSize = `${panelSizeValue}px`

      for (const panel of panels) {
        if (orientation === 'vertical') {
          panel.style.removeProperty('--accordion-panel-height')
          panel.style.removeProperty('--rails-panel-height')
          panel.style.setProperty('--accordion-panel-width', panelSize)
          panel.style.setProperty('--rails-panel-width', panelSize)
        } else {
          panel.style.removeProperty('--accordion-panel-width')
          panel.style.removeProperty('--rails-panel-width')
          panel.style.setProperty('--accordion-panel-height', panelSize)
          panel.style.setProperty('--rails-panel-height', panelSize)
        }

        resizeObserver?.observe(panel)
      }
    }
    const mutationObserver = new MutationObserver(syncPanelSizes)
    const resizeObserver =
      typeof ResizeObserver === 'undefined' ? undefined : new ResizeObserver(syncPanelSizes)

    syncPanelSizes()
    mutationObserver.observe(root, {
      attributeFilter: [
        'class',
        'data-closed',
        'data-ending-style',
        'data-open',
        'data-starting-style',
        'hidden',
        'style'
      ],
      attributes: true,
      childList: true,
      subtree: true
    })
    resizeObserver?.observe(root)
    resizeObserver?.observe(getList())

    window.addEventListener('resize', syncPanelSizes)
    root.addEventListener('transitioncancel', syncPanelSizes)
    root.addEventListener('transitionend', syncPanelSizes)
    root.addEventListener('transitionrun', syncPanelSizes)

    return () => {
      mutationObserver.disconnect()
      resizeObserver?.disconnect()
      window.removeEventListener('resize', syncPanelSizes)
      root.removeEventListener('transitioncancel', syncPanelSizes)
      root.removeEventListener('transitionend', syncPanelSizes)
      root.removeEventListener('transitionrun', syncPanelSizes)
    }
  }, [orientation])

  return (
    <railsOrientationContext.Provider value={orientation}>
      <railsPanelMountingContext.Provider value={panelMountingContextValue}>
        <Accordion.Root
          {...props}
          className={(state) =>
            twMerge(
              mergeProps<'div'>(
                {
                  className: resolveRailsProp(className, normalizeRailsState(state, orientation))
                },
                {
                  className: `flex size-full min-h-0 min-w-0 text-foreground`
                }
              ).className
            )
          }
          hiddenUntilFound={hiddenUntilFound}
          keepMounted={keepMounted}
          multiple={false}
          onValueChange={(nextValue, eventDetails) => {
            const eventTarget = eventDetails.event.target as Element

            eventDetails.trigger = eventTarget.closest('[aria-expanded]') ?? undefined
            onValueChange?.(nextValue, eventDetails)
          }}
          orientation={orientation === 'vertical' ? 'horizontal' : 'vertical'}
          ref={composedRootRef}
          render={(rootProps, state) =>
            renderRailsElement('div', render, rootProps, normalizeRailsState(state, orientation), {
              'data-orientation': orientation
            } as ComponentPropsWithRef<'div'>)
          }
          style={(state) => resolveRailsProp(style, normalizeRailsState(state, orientation))}
        >
          {children}
        </Accordion.Root>
      </railsPanelMountingContext.Provider>
    </railsOrientationContext.Provider>
  )
}

// Declaration merging exposes the documented Rails.Root.* consumer types.
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace RailsRoot {
  export type Value<TValue = unknown> = RailsRootValue<TValue>
  export type State<TValue = unknown> = RailsRootState<TValue>
  export type Props<TValue = unknown> = RailsRootProps<TValue>
  export type ChangeEventReason = RailsRootChangeEventReason
  export type ChangeEventDetails = RailsRootChangeEventDetails
}

export type { RailsOrientation }
