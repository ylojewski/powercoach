import { mergeProps } from '@base-ui/react/merge-props'
import { useRender } from '@base-ui/react/use-render'
import {
  Children,
  isValidElement,
  useCallback,
  useContext,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ReactElement
} from 'react'

import { TilesScrollableTile } from './TilesScrollableTile'
import { TilesTile, type TilesTileProps } from './TilesTile'
import {
  TILES_CONTAINER_BREAKPOINTS,
  TILES_GEOMETRY_PROPERTIES,
  TILES_ROOT_BORDER_CLASS_NAMES,
  TILES_SEPARATOR_BLOCK_END_CLASS_NAMES,
  TILES_SEPARATOR_INLINE_END_CLASS_NAMES,
  type TilesGeometryProperty
} from '../constants/tilesConstants'
import {
  tilesRootContext,
  type TilesGeometry,
  type TilesLayoutState,
  type TilesRootContextValue
} from '../constants/tilesRootContext'
import { useTilesTheme } from '../hooks/useTilesTheme'
import {
  type TilesArea,
  type TilesLayout,
  type TilesLayoutKey,
  type TilesMatrix,
  type TilesTheme
} from '../types/TilesTypes'

export type TilesRootProps<Area extends TilesArea = TilesArea> = useRender.ComponentProps<
  'div',
  Record<string, never>
> & {
  border?: 0 | 1 | 2 | 4 | 8
  frozen?: boolean
  layout: TilesLayout<Area>
  theme?: TilesTheme
}

export function TilesRoot<Area extends TilesArea = TilesArea>({
  border = 1,
  children,
  frozen,
  layout,
  render,
  theme = 'inherit',
  ...props
}: TilesRootProps<Area>): ReactElement {
  const parentRootContext = useContext(tilesRootContext)
  const rootRef = useRef<HTMLDivElement>(null)
  const effectiveTheme = useTilesTheme(rootRef, theme)
  const directAreas = useMemo(
    () =>
      Children.toArray(children).map((child) => {
        if (
          !isValidElement<TilesTileProps<Area>>(child) ||
          (child.type !== TilesTile && child.type !== TilesScrollableTile)
        ) {
          throw new Error(
            'Tiles.Root direct children must be Tiles.Tile or Tiles.ScrollableTile elements.'
          )
        }

        return child.props.area
      }),
    [children]
  )
  const compiledLayouts = useMemo(() => {
    if (!Object.prototype.hasOwnProperty.call(layout, 'base')) {
      throw new Error('Tiles layout must include a base matrix.')
    }

    const uniqueDirectAreas = new Set<string>()

    for (const area of directAreas) {
      if (uniqueDirectAreas.has(area)) {
        throw new Error(`Tiles direct Tile area "${area}" must be unique.`)
      }

      uniqueDirectAreas.add(area)
    }

    const layouts = new Map<TilesLayoutKey, ReadonlyMap<string, TilesGeometry>>()

    for (const [layoutKey, matrix] of Object.entries(layout) as [
      TilesLayoutKey,
      TilesMatrix<Area>
    ][]) {
      if (matrix.length === 0) {
        throw new Error(`Tiles layout "${layoutKey}" must contain at least one row.`)
      }

      const columnCount = (matrix[0] as readonly Area[]).length

      if (columnCount === 0) {
        throw new Error(`Tiles layout "${layoutKey}" rows must contain at least one area.`)
      }

      const boundsByArea = new Map<
        string,
        { maximumColumn: number; maximumRow: number; minimumColumn: number; minimumRow: number }
      >()

      for (const [rowIndex, row] of matrix.entries()) {
        if (row.length !== columnCount) {
          throw new Error(`Tiles layout "${layoutKey}" must use equal row lengths.`)
        }

        for (const [columnIndex, area] of row.entries()) {
          if (typeof area !== 'string' || area.length === 0) {
            throw new Error(`Tiles layout "${layoutKey}" contains an empty area identity.`)
          }

          const bounds = boundsByArea.get(area)

          if (bounds === undefined) {
            boundsByArea.set(area, {
              maximumColumn: columnIndex,
              maximumRow: rowIndex,
              minimumColumn: columnIndex,
              minimumRow: rowIndex
            })
          } else {
            bounds.maximumColumn = Math.max(bounds.maximumColumn, columnIndex)
            bounds.maximumRow = Math.max(bounds.maximumRow, rowIndex)
            bounds.minimumColumn = Math.min(bounds.minimumColumn, columnIndex)
            bounds.minimumRow = Math.min(bounds.minimumRow, rowIndex)
          }
        }
      }

      for (const [area, bounds] of boundsByArea) {
        for (let rowIndex = bounds.minimumRow; rowIndex <= bounds.maximumRow; rowIndex += 1) {
          for (
            let columnIndex = bounds.minimumColumn;
            columnIndex <= bounds.maximumColumn;
            columnIndex += 1
          ) {
            if (matrix[rowIndex]?.[columnIndex] !== area) {
              throw new Error(`Tiles layout "${layoutKey}" area "${area}" must form one rectangle.`)
            }
          }
        }
      }

      for (const area of uniqueDirectAreas) {
        if (!boundsByArea.has(area)) {
          throw new Error(`Tiles layout "${layoutKey}" is missing direct Tile area "${area}".`)
        }
      }

      for (const area of boundsByArea.keys()) {
        if (!uniqueDirectAreas.has(area)) {
          throw new Error(`Tiles layout "${layoutKey}" area "${area}" has no direct Tile.`)
        }
      }

      const geometries = new Map<string, TilesGeometry>()

      for (const [area, bounds] of boundsByArea) {
        geometries.set(area, {
          height: ((bounds.maximumRow - bounds.minimumRow + 1) / matrix.length) * 100,
          left: (bounds.minimumColumn / columnCount) * 100,
          separatorBlockEnd: bounds.maximumRow < matrix.length - 1,
          separatorInlineEnd: bounds.maximumColumn < columnCount - 1,
          top: (bounds.minimumRow / matrix.length) * 100,
          width: ((bounds.maximumColumn - bounds.minimumColumn + 1) / columnCount) * 100
        })
      }

      layouts.set(layoutKey, geometries)
    }

    return layouts
  }, [directAreas, layout])
  const [layoutState, setLayoutState] = useState<TilesLayoutState>(() => ({
    geometries: compiledLayouts.get('base') as ReadonlyMap<string, TilesGeometry>,
    layoutKey: 'base',
    movingProperties: new Map(),
    targetVersions: new Map(),
    transitionsSuppressed: true
  }))
  const [separatorColor, setSeparatorColor] = useState('var(--border)')
  const compiledLayoutsRef = useRef(compiledLayouts)
  const frozenRef = useRef(frozen)
  const hasMeasured = useRef(false)
  const latestMeasuredBox = useRef<{ height: number; width: number } | null>(null)
  const previousFrozen = useRef(frozen)
  const previousLayout = useRef(layout)

  compiledLayoutsRef.current = compiledLayouts
  frozenRef.current = frozen

  useLayoutEffect(() => {
    const root = rootRef.current as HTMLElement

    setSeparatorColor(getComputedStyle(root).getPropertyValue('--border').trim())
  }, [effectiveTheme])

  const commitLayoutForBox = useCallback((box: { height: number; width: number }) => {
    const root = rootRef.current as HTMLElement
    const currentCompiledLayouts = compiledLayoutsRef.current
    const rootFontSize = Number.parseFloat(getComputedStyle(document.documentElement).fontSize)
    const remSize = Number.isFinite(rootFontSize) ? rootFontSize : 16
    let nextLayoutKey: TilesLayoutKey = 'base'

    for (const [breakpoint, minimumWidthInRem] of TILES_CONTAINER_BREAKPOINTS) {
      if (currentCompiledLayouts.has(breakpoint) && box.width >= minimumWidthInRem * remSize) {
        nextLayoutKey = breakpoint
      }
    }

    const nextGeometries = currentCompiledLayouts.get(nextLayoutKey) as ReadonlyMap<
      string,
      TilesGeometry
    >
    const configuredDuration = getComputedStyle(root)
      .getPropertyValue('--tiles-layout-duration')
      .trim()
    const immediate =
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      /^0(?:\.0+)?(?:ms|s)$/.test(configuredDuration)
    const shouldAnimate = hasMeasured.current && !immediate

    setLayoutState((currentState) => {
      if (currentState.layoutKey === nextLayoutKey && currentState.geometries === nextGeometries) {
        return currentState
      }

      const movingProperties = new Map(currentState.movingProperties)
      const targetVersions = new Map(currentState.targetVersions)

      for (const [area, nextGeometry] of nextGeometries) {
        const currentGeometry = currentState.geometries.get(area)

        if (currentGeometry === undefined) {
          continue
        }

        const changedProperties = TILES_GEOMETRY_PROPERTIES.filter(
          (property) => currentGeometry[property] !== nextGeometry[property]
        )

        if (changedProperties.length > 0) {
          const areaTargetVersions = new Map(targetVersions.get(area))

          for (const property of changedProperties) {
            areaTargetVersions.set(property, (areaTargetVersions.get(property) ?? 0) + 1)
          }

          targetVersions.set(area, areaTargetVersions)

          if (shouldAnimate) {
            movingProperties.set(
              area,
              new Set([...(movingProperties.get(area) ?? []), ...changedProperties])
            )
          }
        }
      }

      if (!shouldAnimate) {
        movingProperties.clear()
      }

      return {
        geometries: nextGeometries,
        layoutKey: nextLayoutKey,
        movingProperties,
        targetVersions,
        transitionsSuppressed: !shouldAnimate
      }
    })

    hasMeasured.current = true
  }, [])

  useLayoutEffect(() => {
    const configurationChanged = previousLayout.current !== layout
    const resumed = previousFrozen.current === true && frozen !== true

    previousFrozen.current = frozen
    previousLayout.current = layout

    if (latestMeasuredBox.current === null) {
      return
    }

    if (resumed || (configurationChanged && frozen !== true)) {
      commitLayoutForBox(latestMeasuredBox.current)
    }
  })

  useLayoutEffect(() => {
    const root = rootRef.current as HTMLElement
    const observer = new ResizeObserver((entries) => {
      const entry = entries[0] as ResizeObserverEntry
      const contentBoxSize = entry.contentBoxSize[0] as ResizeObserverSize
      const nextMeasuredBox = {
        height: contentBoxSize.blockSize,
        width: contentBoxSize.inlineSize
      }
      latestMeasuredBox.current = nextMeasuredBox

      if (frozenRef.current === true && hasMeasured.current) {
        return
      }

      commitLayoutForBox(nextMeasuredBox)
    })

    observer.observe(root)

    return () => observer.disconnect()
  }, [commitLayoutForBox])

  useLayoutEffect(() => {
    if (!layoutState.transitionsSuppressed) {
      return
    }

    const root = rootRef.current as HTMLElement
    const animationFrame = requestAnimationFrame(() => {
      root.getBoundingClientRect()
      setLayoutState((currentState) => ({ ...currentState, transitionsSuppressed: false }))
    })

    return () => cancelAnimationFrame(animationFrame)
  }, [layoutState.geometries, layoutState.transitionsSuppressed])

  const completeGeometryTransition = useCallback(
    (area: string, property: TilesGeometryProperty) => {
      setLayoutState((currentState) => {
        const currentProperties = currentState.movingProperties.get(area)

        if (currentProperties === undefined || !currentProperties.has(property)) {
          return currentState
        }

        const nextProperties = new Set(currentProperties)
        const movingProperties = new Map(currentState.movingProperties)

        nextProperties.delete(property)

        if (nextProperties.size === 0) {
          movingProperties.delete(area)
        } else {
          movingProperties.set(area, nextProperties)
        }

        return {
          ...currentState,
          movingProperties
        }
      })
    },
    []
  )
  const context = useMemo<TilesRootContextValue>(
    () => ({
      baseGeometries: compiledLayouts.get('base') as ReadonlyMap<string, TilesGeometry>,
      completeGeometryTransition,
      layoutState,
      separatorBlockEndClassName: TILES_SEPARATOR_BLOCK_END_CLASS_NAMES[border],
      separatorColor,
      separatorInlineEndClassName: TILES_SEPARATOR_INLINE_END_CLASS_NAMES[border]
    }),
    [border, compiledLayouts, completeGeometryTransition, layoutState, separatorColor]
  )
  const element = useRender({
    defaultTagName: 'div',
    props: mergeProps<'div'>(
      {
        className: `isolate min-h-0 min-w-0 bg-background text-foreground`
      },
      props,
      {
        className: effectiveTheme
      },
      {
        children,
        className: mergeProps<'div'>(
          { className: 'tiles-layout-defaults border-border' },
          {
            className:
              parentRootContext === null ? TILES_ROOT_BORDER_CLASS_NAMES[border] : 'border-0'
          }
        ).className,
        'data-animating': layoutState.movingProperties.size > 0 ? '' : undefined,
        'data-layout': layoutState.layoutKey,
        style: {
          boxSizing: 'border-box',
          contain: 'layout',
          position: 'relative',
          transitionDuration: 'var(--tiles-layout-duration, 200ms)',
          transitionProperty: 'none',
          transitionTimingFunction: 'var(--tiles-layout-easing, cubic-bezier(0.22, 1, 0.36, 1))'
        }
      } as useRender.ElementProps<'div'>
    ),
    ref: rootRef,
    render,
    state: {}
  })

  return <tilesRootContext.Provider value={context}>{element}</tilesRootContext.Provider>
}
