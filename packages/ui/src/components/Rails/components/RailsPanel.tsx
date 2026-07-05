import { Accordion } from '@base-ui/react/accordion'
import { mergeProps } from '@base-ui/react/merge-props'
import {
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ComponentPropsWithRef,
  type CSSProperties,
  type ReactElement
} from 'react'
import { twMerge } from 'tailwind-merge'

import { railsOrientationContext } from '../constants/railsOrientationContext'
import { railsPanelMountingContext } from '../constants/railsPanelMountingContext'
import { composeRailsRefs } from '../utils/composeRailsRefs'
import { normalizeRailsState, type RailsState } from '../utils/normalizeRailsState'
import { renderRailsElement, type RailsRenderProp } from '../utils/renderRailsElement'
import { resolveRailsProp } from '../utils/resolveRailsProp'

export type RailsPanelState = RailsState<Accordion.Panel.State>

export interface RailsPanelProps
  extends Omit<Accordion.Panel.Props, 'className' | 'render' | 'style'> {
  className?: string | ((state: RailsPanelState) => string | undefined)
  render?: RailsRenderProp<RailsPanelState>
  style?: CSSProperties | ((state: RailsPanelState) => CSSProperties | undefined)
}

export function RailsPanel({
  className,
  hiddenUntilFound,
  keepMounted,
  ref,
  render,
  style,
  ...props
}: RailsPanelProps): ReactElement {
  const orientation = useContext(railsOrientationContext)
  const rootMounting = useContext(railsPanelMountingContext)
  const [reducedMotion, setReducedMotion] = useState(
    () => globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false
  )
  const lastPanelElementRef = useRef<HTMLDivElement>(null)
  const rememberPanelElement = useCallback((panel: HTMLDivElement | null) => {
    if (panel !== null) {
      lastPanelElementRef.current = panel
    }
  }, [])
  const composedPanelRef = useMemo(
    () => composeRailsRefs(rememberPanelElement, ref),
    [ref, rememberPanelElement]
  )
  const effectiveHiddenUntilFound = hiddenUntilFound ?? rootMounting.hiddenUntilFound
  const effectiveKeepMounted = keepMounted ?? rootMounting.keepMounted
  const previousMountingRef = useRef({
    hiddenUntilFound: effectiveHiddenUntilFound,
    keepMounted: effectiveKeepMounted
  })
  const panelMountingVersionRef = useRef(0)
  const mountingChanged =
    previousMountingRef.current.hiddenUntilFound !== effectiveHiddenUntilFound ||
    previousMountingRef.current.keepMounted !== effectiveKeepMounted

  // Base UI registers beforematch against the mounted Panel element. Refresh
  // that listener only when a mounting change starts without any Panel DOM.
  if (mountingChanged) {
    if (lastPanelElementRef.current?.isConnected !== true) {
      panelMountingVersionRef.current += 1
    }

    previousMountingRef.current = {
      hiddenUntilFound: effectiveHiddenUntilFound,
      keepMounted: effectiveKeepMounted
    }
  }

  useLayoutEffect(() => {
    const panel = lastPanelElementRef.current

    if (
      panel?.isConnected === true &&
      !effectiveHiddenUntilFound &&
      panel.getAttribute('hidden') === 'until-found'
    ) {
      panel.setAttribute('hidden', '')
    }
  }, [effectiveHiddenUntilFound])

  useEffect(() => {
    const mediaQuery = globalThis.matchMedia?.('(prefers-reduced-motion: reduce)')

    if (mediaQuery === undefined) {
      return
    }

    const syncReducedMotion = () => setReducedMotion(mediaQuery.matches)

    syncReducedMotion()
    mediaQuery.addEventListener?.('change', syncReducedMotion)

    return () => mediaQuery.removeEventListener?.('change', syncReducedMotion)
  }, [])

  return (
    <Accordion.Panel
      {...props}
      className={(state) =>
        twMerge(
          mergeProps<'div'>(
            {
              className: resolveRailsProp(className, normalizeRailsState(state, orientation))
            },
            {
              // prettier-ignore
              className:
                orientation === 'vertical'
                  ? `
                      min-h-0 min-w-0 shrink-0 overflow-hidden
                      [width:var(--rails-panel-width)]
                      data-ending-style:!w-0 data-ending-style:w-0
                      data-starting-style:!w-0 data-starting-style:w-0
                      [&[hidden]]:!w-0
                      transition-[width] duration-300 motion-reduce:!transition-none
                      [transition-timing-function:cubic-bezier(0.22,1,0.36,1)]
                      [&>*]:min-w-[var(--rails-panel-width)]
                    `
                  : `
                      w-full min-h-0 min-w-0 shrink-0 overflow-hidden
                      [height:var(--rails-panel-height)]
                      data-ending-style:!h-0 data-ending-style:h-0
                      data-starting-style:!h-0 data-starting-style:h-0
                      [&[hidden]]:!h-0
                      transition-[height] duration-300 motion-reduce:!transition-none
                      [transition-timing-function:cubic-bezier(0.22,1,0.36,1)]
                      [&>*]:min-h-[var(--rails-panel-height)]
                    `
            }
          ).className
        )
      }
      hiddenUntilFound={hiddenUntilFound}
      keepMounted={keepMounted}
      key={panelMountingVersionRef.current}
      render={(panelProps, state) => {
        let renderedPanelProps = panelProps as typeof panelProps & {
          'data-starting-style'?: string
        }

        if (effectiveHiddenUntilFound && !state.open) {
          renderedPanelProps = { ...panelProps }
          delete renderedPanelProps['data-starting-style']
        }

        return renderRailsElement(
          'div',
          render,
          renderedPanelProps,
          normalizeRailsState(state, orientation),
          { 'data-orientation': orientation } as ComponentPropsWithRef<'div'>
        )
      }}
      style={(state) =>
        mergeProps<'div'>(
          {
            style:
              orientation === 'vertical'
                ? ({
                    '--accordion-panel-width': '0px',
                    '--rails-panel-width': '0px',
                    transitionDuration: reducedMotion ? '0ms' : '300ms',
                    transitionProperty: reducedMotion ? 'none' : 'width',
                    transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)',
                    width: reducedMotion && !state.open ? '0px' : 'var(--rails-panel-width)'
                  } as CSSProperties)
                : ({
                    '--accordion-panel-height': '0px',
                    '--rails-panel-height': '0px',
                    height: reducedMotion && !state.open ? '0px' : 'var(--rails-panel-height)',
                    transitionDuration: reducedMotion ? '0ms' : '300ms',
                    transitionProperty: reducedMotion ? 'none' : 'height',
                    transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)'
                  } as CSSProperties)
          },
          {
            style: resolveRailsProp(style, normalizeRailsState(state, orientation))
          }
        ).style
      }
      ref={composedPanelRef}
    />
  )
}

// Declaration merging exposes the documented Rails.Panel.* consumer types.
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace RailsPanel {
  export type State = RailsPanelState
  export type Props = RailsPanelProps
}
