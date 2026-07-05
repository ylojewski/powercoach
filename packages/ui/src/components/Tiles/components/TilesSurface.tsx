import { mergeProps } from '@base-ui/react/merge-props'
import { useRender } from '@base-ui/react/use-render'
import {
  useContext,
  useLayoutEffect,
  useRef,
  type CSSProperties,
  type ReactElement,
  type TransitionEvent
} from 'react'

import { type TilesTileProps } from './TilesTile'
import { Stripes } from '../../Stripes'
import { TILES_GEOMETRY_PROPERTIES, type TilesGeometryProperty } from '../constants/tilesConstants'
import {
  tilesRootContext,
  type TilesGeometry,
  type TilesRootContextValue
} from '../constants/tilesRootContext'
import { useTilesTheme } from '../hooks/useTilesTheme'
import { type TilesArea } from '../types/TilesTypes'

export type TilesSurfaceProps<Area extends TilesArea = TilesArea> = TilesTileProps<Area> & {
  scrollable?: boolean
}

export function TilesSurface<Area extends TilesArea = TilesArea>({
  area,
  children,
  render,
  scrollable = false,
  stripesProps,
  theme = 'inherit',
  ...props
}: TilesSurfaceProps<Area>): ReactElement {
  const context = useContext(tilesRootContext) as TilesRootContextValue
  const tileRef = useRef<HTMLDivElement>(null)
  const initialArea = useRef(area)
  const transitionTargets = useRef(new Map<TilesGeometryProperty, number>())
  const effectiveTheme = useTilesTheme(tileRef, theme)

  if (initialArea.current !== area) {
    throw new Error(
      `Tiles.Tile area identity changed from "${initialArea.current}" to "${area}" without a new key and remount.`
    )
  }

  const geometry = (context.layoutState.geometries.get(area) ??
    context.baseGeometries.get(area)) as TilesGeometry
  const moving = context.layoutState.movingProperties.has(area)
  const targetVersions = context.layoutState.targetVersions.get(area)

  useLayoutEffect(() => {
    for (const [property, target] of transitionTargets.current) {
      if (target !== (targetVersions?.get(property) ?? 0)) {
        transitionTargets.current.delete(property)
      }
    }
  }, [targetVersions])

  const stripes =
    stripesProps === undefined || stripesProps === false ? null : (
      <Stripes
        {...(typeof stripesProps === 'object' ? stripesProps : undefined)}
        aria-hidden="true"
        className={
          mergeProps<'div'>(
            { className: 'pointer-events-none absolute inset-0' },
            { className: scrollable ? '-z-10' : 'z-0' },
            { className: effectiveTheme }
          ).className
        }
        inert
      />
    )
  const element = useRender({
    defaultTagName: 'div',
    props: mergeProps<'div'>(
      {
        className: `isolate min-h-0 min-w-0 border-border bg-background text-foreground motion-reduce:!duration-0`
      },
      props,
      {
        className: effectiveTheme
      },
      {
        children:
          stripes === null ? (
            children
          ) : scrollable ? (
            <>
              {stripes}
              {children}
            </>
          ) : (
            <>
              {stripes}
              <div className="relative z-10">{children}</div>
            </>
          ),
        className: mergeProps<'div'>(
          {
            className: geometry.separatorBlockEnd ? context.separatorBlockEndClassName : undefined
          },
          {
            className: geometry.separatorInlineEnd ? context.separatorInlineEndClassName : undefined
          }
        ).className,
        'data-area': area,
        'data-moving': moving ? '' : undefined,
        onTransitionCancel: (event: TransitionEvent<HTMLElement>) => {
          const propertyName = event.nativeEvent.propertyName
          const property = propertyName as TilesGeometryProperty

          if (event.target !== event.currentTarget) {
            return
          }

          if (
            !TILES_GEOMETRY_PROPERTIES.includes(property) ||
            transitionTargets.current.get(property) !== (targetVersions?.get(property) ?? 0)
          ) {
            return
          }

          transitionTargets.current.delete(property)
          context.completeGeometryTransition(area, property)
        },
        onTransitionEnd: (event: TransitionEvent<HTMLElement>) => {
          const propertyName = event.nativeEvent.propertyName
          const property = propertyName as TilesGeometryProperty

          if (
            event.target !== event.currentTarget ||
            !TILES_GEOMETRY_PROPERTIES.includes(property) ||
            transitionTargets.current.get(property) !== (targetVersions?.get(property) ?? 0)
          ) {
            return
          }

          transitionTargets.current.delete(property)
          context.completeGeometryTransition(area, property)
        },
        onTransitionRun: (event: TransitionEvent<HTMLElement>) => {
          const propertyName = event.nativeEvent.propertyName
          const property = propertyName as TilesGeometryProperty

          if (event.target !== event.currentTarget) {
            return
          }

          if (!TILES_GEOMETRY_PROPERTIES.includes(property)) {
            return
          }

          transitionTargets.current.set(property, targetVersions?.get(property) ?? 0)
        },
        style: {
          borderColor: context.separatorColor,
          boxSizing: 'border-box',
          height: `${geometry.height}%`,
          left: `${geometry.left}%`,
          position: 'absolute',
          top: `${geometry.top}%`,
          transitionDuration: context.layoutState.transitionsSuppressed
            ? '0ms'
            : 'var(--tiles-layout-duration, 200ms)',
          transitionProperty: 'left, top, width, height',
          transitionTimingFunction: 'var(--tiles-layout-easing, cubic-bezier(0.22, 1, 0.36, 1))',
          width: `${geometry.width}%`
        } satisfies CSSProperties
      } as useRender.ElementProps<'div'>
    ),
    ref: tileRef,
    render,
    state: {}
  })

  return element as ReactElement
}
