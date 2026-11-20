import { useRender } from '@base-ui/react/use-render'
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import {
  Component,
  createRef,
  useState,
  type ComponentPropsWithRef,
  type ComponentType,
  type CSSProperties,
  type ReactElement,
  type ReactNode
} from 'react'
import { afterEach, beforeEach, describe, expect, expectTypeOf, it, vi } from 'vitest'

import {
  type StripesProps,
  type TilesArea,
  type TilesContainerBreakpoint,
  type TilesLayout,
  type TilesLayoutKey,
  type TilesMatrix,
  type TilesRootProps,
  type TilesScrollableTileProps,
  type TilesTheme,
  type TilesTileProps,
  type TilesTileStripesProps
} from '../..'
import * as PackageExports from '../..'
import {
  Ex006FrozenResponsiveReflow,
  Ex008ScrollableTileSurfaceAndRemountBoundary
} from './Tiles.stories'

type ExpectedTilesRootProps<Area extends string = string> = useRender.ComponentProps<
  'div',
  Record<string, never>
> & {
  border?: 0 | 1 | 2 | 4 | 8
  frozen?: boolean
  layout: TilesLayout<Area>
  theme?: TilesTheme
}

type ExpectedTilesTileProps<Area extends string = string> = useRender.ComponentProps<
  'div',
  Record<string, never>
> & {
  area: Area
  stripesProps?: boolean | TilesTileStripesProps
  theme?: TilesTheme
}

type ExpectedTilesScrollableTileProps<Area extends string = string> = ExpectedTilesTileProps<Area>

type RuntimeTilesMatrix = readonly (readonly string[])[]

type RuntimeTilesLayout = Readonly<
  Partial<Record<'base' | TilesContainerBreakpoint, RuntimeTilesMatrix>>
>

type TilesRenderProps = ComponentPropsWithRef<'div'>

interface TilesRootRuntimeProps extends ComponentPropsWithRef<'div'> {
  border?: 0 | 1 | 2 | 4 | 8
  frozen?: boolean
  layout: RuntimeTilesLayout
  render?: ReactElement | ((props: TilesRenderProps, state: Record<string, never>) => ReactElement)
  theme?: 'inherit' | 'inverse'
}

interface TilesTileRuntimeProps extends ComponentPropsWithRef<'div'> {
  area: string
  render?: ReactElement | ((props: TilesRenderProps, state: Record<string, never>) => ReactElement)
  stripesProps?: boolean | Pick<StripesProps, 'angle' | 'color' | 'gap' | 'width'>
  theme?: 'inherit' | 'inverse'
}

interface TilesNamespace {
  Root: ComponentType<TilesRootRuntimeProps>
  ScrollableTile: ComponentType<TilesTileRuntimeProps>
  Tile: ComponentType<TilesTileRuntimeProps>
}

interface TilesPackageContract {
  Components: typeof PackageExports.Components & {
    Tiles: TilesNamespace
  }
  Tiles: TilesNamespace
  TilesRoot: TilesNamespace['Root']
  TilesScrollableTile: TilesNamespace['ScrollableTile']
  TilesTile: TilesNamespace['Tile']
  Ui: typeof PackageExports.Ui & {
    Components: typeof PackageExports.Components & {
      Tiles: TilesNamespace
    }
  }
}

interface ResizeObserverRecord {
  callback: ResizeObserverCallback
  observedElements: Element[]
  observer: ResizeObserver
}

interface ScrollAreaViewportMetrics {
  clientHeight: number
  clientWidth: number
  scrollHeight: number
  scrollWidth: number
}

interface ElementBox {
  height: number
  left?: number
  top?: number
  width: number
}

type TilesCssProperties = CSSProperties &
  Partial<Record<'--tiles-layout-duration' | '--tiles-layout-easing', string>>

const PACKAGE_EXPORTS = PackageExports as typeof PackageExports & TilesPackageContract
const Tiles = PACKAGE_EXPORTS.Tiles

const DASHBOARD_LAYOUT = {
  base: [['main'], ['aside'], ['secondary'], ['footer']],
  lg: [
    ['main', 'main', 'main', 'aside'],
    ['main', 'main', 'main', 'aside'],
    ['main', 'main', 'main', 'aside'],
    ['secondary', 'secondary', 'secondary', 'footer']
  ],
  sm: [
    ['main', 'aside'],
    ['secondary', 'footer']
  ]
} as const satisfies TilesLayout<'main' | 'aside' | 'secondary' | 'footer'>

const BREAKPOINT_LAYOUT = {
  base: [['main'], ['aside']],
  lg: [
    ['main', 'main'],
    ['aside', 'aside']
  ],
  md: [['aside', 'main']],
  xs: [['main', 'aside']]
} as const satisfies TilesLayout<'main' | 'aside'>

const PARTIAL_RETARGET_LAYOUT = {
  base: [['main', 'aside']],
  lg: [['main'], ['main'], ['aside']],
  sm: [['main'], ['aside']]
} as const satisfies TilesLayout<'main' | 'aside'>

const OUTER_LAYOUT = {
  base: [['main'], ['aside']],
  lg: [['main', 'aside', 'aside', 'aside']]
} as const satisfies TilesLayout<'main' | 'aside'>

const INNER_LAYOUT = {
  base: [['summary'], ['details']],
  sm: [['summary', 'details']]
} as const satisfies TilesLayout<'summary' | 'details'>

const STABLE_TILE_LAYOUT = {
  base: [
    ['fixed', 'upper'],
    ['lower', 'lower']
  ],
  sm: [
    ['fixed', 'lower'],
    ['upper', 'lower']
  ]
} as const satisfies TilesLayout<'fixed' | 'upper' | 'lower'>

const SEMANTIC_LAYOUT = {
  base: [['counter'], ['action']],
  sm: [['action', 'counter']]
} as const satisfies TilesLayout<'counter' | 'action'>

const THEME_LAYOUT = {
  base: [
    ['plain', 'inverse'],
    ['double', 'configured']
  ]
} as const satisfies TilesLayout<'plain' | 'inverse' | 'double' | 'configured'>

const SEPARATOR_LAYOUT = {
  base: [
    ['top-left', 'top-right'],
    ['nested', 'bottom-right']
  ]
} as const satisfies TilesLayout<'top-left' | 'top-right' | 'nested' | 'bottom-right'>

const INNER_SEPARATOR_LAYOUT = {
  base: [['inner-left', 'inner-right']]
} as const satisfies TilesLayout<'inner-left' | 'inner-right'>

const FROZEN_LAYOUT = {
  base: [['main'], ['aside']],
  sm: [['main', 'aside']]
} as const satisfies TilesLayout<'main' | 'aside'>

const FROZEN_ALTERNATE_LAYOUT = {
  base: [['aside'], ['main']],
  sm: [['aside', 'main']]
} as const satisfies TilesLayout<'main' | 'aside'>

const FROZEN_REPLACEMENT_LAYOUT = {
  base: [['main', 'aside']],
  sm: [['aside'], ['main']]
} as const satisfies TilesLayout<'main' | 'aside'>

const FROZEN_LATEST_REPLACEMENT_LAYOUT = {
  base: [['main'], ['aside']],
  sm: [['aside', 'main']]
} as const satisfies TilesLayout<'main' | 'aside'>

const FROZEN_IDENTICAL_REPLACEMENT_LAYOUT = {
  '3xs': [['main'], ['aside']],
  base: [['aside', 'main']]
} as const satisfies TilesLayout<'main' | 'aside'>

const FROZEN_STABLE_REPLACEMENT_LAYOUT = {
  base: [
    ['upper', 'fixed'],
    ['lower', 'lower']
  ],
  sm: [
    ['fixed', 'lower'],
    ['upper', 'lower']
  ]
} as const satisfies TilesLayout<'fixed' | 'upper' | 'lower'>

const INVALID_FROZEN_REPLACEMENT_LAYOUT = {
  base: [['main'], ['aside']],
  sm: [
    ['main', 'main'],
    ['main', 'aside']
  ]
} as const satisfies TilesLayout<'main' | 'aside'>

const BORDER_LAYOUT = {
  base: [['left', 'right']]
} as const satisfies TilesLayout<'left' | 'right'>

const NESTED_BORDER_LAYOUT = {
  base: [['nested', 'aside']]
} as const satisfies TilesLayout<'nested' | 'aside'>

const INNER_BORDER_LAYOUT = {
  base: [['top'], ['bottom']]
} as const satisfies TilesLayout<'top' | 'bottom'>

const SINGLE_TILE_LAYOUT = {
  base: [['content']]
} as const satisfies TilesLayout<'content'>

const SCROLLABLE_LAYOUT = {
  base: [['history'], ['summary']],
  sm: [['history', 'summary']]
} as const satisfies TilesLayout<'history' | 'summary'>

const BORDER_WIDTHS = [0, 1, 2, 4, 8] as const

const ORIGINAL_GET_ANIMATIONS = HTMLElement.prototype.getAnimations

const ZERO_DURATION_STYLE = {
  '--tiles-layout-duration': '0ms',
  height: '20rem'
} as TilesCssProperties

const INVALID_CONFIGURATION_CASES = [
  {
    label: 'a missing base matrix',
    layout: { sm: [['main']] },
    messagePattern: /base/i,
    tileAreas: ['main']
  },
  {
    label: 'an empty matrix',
    layout: { base: [] },
    messagePattern: /base/i,
    tileAreas: []
  },
  {
    label: 'an empty row',
    layout: { base: [[]] },
    messagePattern: /base/i,
    tileAreas: []
  },
  {
    label: 'a ragged matrix',
    layout: { base: [['main', 'aside'], ['main']] },
    messagePattern: /base/i,
    tileAreas: ['main', 'aside']
  },
  {
    label: 'an empty area identity',
    layout: { base: [['']] },
    messagePattern: /base/i,
    tileAreas: ['']
  },
  {
    label: 'a disconnected area',
    layout: { base: [['main', 'aside', 'main']] },
    messagePattern: /(?=.*base)(?=.*main)/i,
    tileAreas: ['main', 'aside']
  },
  {
    label: 'an L-shaped area',
    layout: {
      base: [
        ['main', 'main'],
        ['main', 'aside']
      ]
    },
    messagePattern: /(?=.*base)(?=.*main)/i,
    tileAreas: ['main', 'aside']
  },
  {
    label: 'an area without a direct Tile',
    layout: { base: [['main', 'aside']] },
    messagePattern: /(?=.*base)(?=.*aside)/i,
    tileAreas: ['main']
  },
  {
    label: 'a direct Tile missing from a matrix',
    layout: { base: [['main']] },
    messagePattern: /(?=.*base)(?=.*aside)/i,
    tileAreas: ['main', 'aside']
  },
  {
    label: 'duplicate direct Tile areas',
    layout: { base: [['main']] },
    messagePattern: /main/i,
    tileAreas: ['main', 'main']
  },
  {
    label: 'an invalid inactive breakpoint matrix',
    layout: {
      base: [['main', 'aside']],
      sm: [
        ['main', 'main'],
        ['main', 'aside']
      ]
    },
    messagePattern: /(?=.*sm)(?=.*main)/i,
    tileAreas: ['main', 'aside']
  }
] as const

class ExampleErrorBoundary extends Component<{ children: ReactNode }, { message: string | null }> {
  state = { message: null as string | null }

  static getDerivedStateFromError(error: unknown) {
    return {
      message: error instanceof Error ? error.message : 'Unknown Tiles error'
    }
  }

  render() {
    if (this.state.message !== null) {
      return <output>{this.state.message}</output>
    }

    return this.props.children
  }
}

function LocalCounter() {
  const [count, setCount] = useState(0)

  return (
    <button type="button" onClick={() => setCount((value) => value + 1)}>
      Count {count}
    </button>
  )
}

function SemanticStatefulTiles() {
  const [count, setCount] = useState(0)

  return (
    <div
      className="h-64 w-[42rem] max-w-full min-w-64 resize-x overflow-auto border-8 border-border p-8"
      data-testid="semantic-wrapper"
    >
      <Tiles.Root
        className="h-full w-full"
        data-testid="semantic-root"
        layout={SEMANTIC_LAYOUT}
        render={<section aria-labelledby="tile-section-title" />}
      >
        <Tiles.Tile
          area="counter"
          data-testid="counter-tile"
          render={<article aria-labelledby="tile-section-title" />}
        >
          <h2 id="tile-section-title">Persistent counter</h2>
          <button type="button" onClick={() => setCount((value) => value + 1)}>
            Count {count}
          </button>
        </Tiles.Tile>
        <Tiles.Tile area="action" data-testid="action-tile" render={<article />}>
          <h2>Focused action</h2>
          <button type="button">Keep focus while resizing</button>
        </Tiles.Tile>
      </Tiles.Root>
    </div>
  )
}

function FrozenResponsiveTiles() {
  const [frozen, setFrozen] = useState(true)
  const [alternate, setAlternate] = useState(false)

  return (
    <div className="grid gap-3">
      <div className="flex gap-3">
        <button type="button" onClick={() => setFrozen((value) => !value)}>
          {frozen ? 'Resume responsive reflow' : 'Freeze responsive reflow'}
        </button>
        <button type="button" onClick={() => setAlternate((value) => !value)}>
          {alternate ? 'Use original layout' : 'Use alternate layout'}
        </button>
      </div>
      <output>
        {frozen ? 'Frozen' : 'Responsive'} ·{' '}
        {alternate ? 'alternate layout prop' : 'original layout prop'}
      </output>
      <div
        className="h-64 w-[42rem] max-w-full min-w-64 resize-x overflow-auto border-8 border-border p-8"
        data-testid="frozen-wrapper"
      >
        <Tiles.Root
          className="group/freeze h-full w-full"
          data-testid="frozen-root"
          frozen={frozen}
          layout={alternate ? FROZEN_ALTERNATE_LAYOUT : FROZEN_LAYOUT}
        >
          <Tiles.Tile area="main">Main</Tiles.Tile>
          <Tiles.Tile area="aside">Aside</Tiles.Tile>
        </Tiles.Root>
      </div>
    </div>
  )
}

function ThemeProbe({
  outsideTheme,
  tileTheme = 'inverse'
}: {
  outsideTheme: 'light' | 'dark'
  tileTheme?: 'inherit' | 'inverse'
}) {
  return (
    <div className={outsideTheme}>
      <style>
        {`
          .light {
            --background: light-background;
            --border: light-border;
            --foreground: light-foreground;
          }

          .dark {
            --background: dark-background;
            --border: dark-border;
            --foreground: dark-foreground;
          }
        `}
      </style>
      <Tiles.Root layout={THEME_LAYOUT} data-testid="theme-root" style={{ height: '16rem' }}>
        <Tiles.Tile area="plain" data-testid="plain-tile">
          Plain
        </Tiles.Tile>
        <Tiles.Tile area="inverse" data-testid="inverse-tile" stripesProps theme={tileTheme}>
          Inverse
          <LocalCounter />
        </Tiles.Tile>
        <Tiles.Tile area="double" data-testid="double-tile" theme="inverse">
          <Tiles.Root
            layout={SINGLE_TILE_LAYOUT}
            data-testid="double-root"
            style={{ height: '100%' }}
            theme="inverse"
          >
            <Tiles.Tile area="content" data-testid="double-content">
              Double inversion
            </Tiles.Tile>
          </Tiles.Root>
        </Tiles.Tile>
        <Tiles.Tile area="configured">Configured</Tiles.Tile>
      </Tiles.Root>
    </div>
  )
}

function ScrollableHistoryContent() {
  const [count, setCount] = useState(0)

  return (
    <div style={{ height: '30rem', width: '36rem' }}>
      <button type="button" onClick={() => setCount((value) => value + 1)}>
        Local count {count}
      </button>
      {Array.from({ length: 16 }, (_, index) => (
        <p key={index}>Training history entry {index + 1}</p>
      ))}
    </div>
  )
}

function ScrollableTilesSurface() {
  const [scrollable, setScrollable] = useState(true)

  return (
    <div>
      <button type="button" onClick={() => setScrollable((value) => !value)}>
        {scrollable ? 'Use normal Tile' : 'Use ScrollableTile'}
      </button>
      <output>{scrollable ? 'ScrollableTile mounted' : 'Normal Tile mounted'}</output>
      <Tiles.Root
        data-testid="scrollable-example-root"
        layout={SCROLLABLE_LAYOUT}
        style={{ height: '16rem' }}
      >
        {scrollable ? (
          <Tiles.ScrollableTile area="history" data-testid="history-surface" stripesProps>
            <ScrollableHistoryContent />
          </Tiles.ScrollableTile>
        ) : (
          <Tiles.Tile area="history" data-testid="history-surface" stripesProps>
            <ScrollableHistoryContent />
          </Tiles.Tile>
        )}
        <Tiles.Tile area="summary">Summary</Tiles.Tile>
      </Tiles.Root>
    </div>
  )
}

describe('Tiles', () => {
  let elementBoxes: WeakMap<Element, DOMRect>
  let matchMediaDescriptor: PropertyDescriptor | undefined
  let originalResizeObserver: typeof ResizeObserver | undefined
  let prefersReducedMotion: boolean
  let resizeObservers: ResizeObserverRecord[]
  let scrollAreaViewportMetrics: ScrollAreaViewportMetrics

  beforeEach(() => {
    elementBoxes = new WeakMap()
    originalResizeObserver = globalThis.ResizeObserver
    prefersReducedMotion = false
    resizeObservers = []
    scrollAreaViewportMetrics = {
      clientHeight: 160,
      clientWidth: 320,
      scrollHeight: 160,
      scrollWidth: 320
    }

    vi.spyOn(HTMLElement.prototype, 'clientHeight', 'get').mockImplementation(function (
      this: HTMLElement
    ) {
      return this.style.overflow === 'scroll' ? scrollAreaViewportMetrics.clientHeight : 0
    })
    vi.spyOn(HTMLElement.prototype, 'clientWidth', 'get').mockImplementation(function (
      this: HTMLElement
    ) {
      return this.style.overflow === 'scroll' ? scrollAreaViewportMetrics.clientWidth : 0
    })
    vi.spyOn(HTMLElement.prototype, 'scrollHeight', 'get').mockImplementation(function (
      this: HTMLElement
    ) {
      return this.style.overflow === 'scroll' ? scrollAreaViewportMetrics.scrollHeight : 0
    })
    vi.spyOn(HTMLElement.prototype, 'scrollWidth', 'get').mockImplementation(function (
      this: HTMLElement
    ) {
      return this.style.overflow === 'scroll' ? scrollAreaViewportMetrics.scrollWidth : 0
    })
    vi.spyOn(HTMLElement.prototype, 'offsetHeight', 'get').mockImplementation(function (
      this: HTMLElement
    ) {
      const orientation = this.getAttribute('data-orientation')
      const isThumb = this.parentElement?.getAttribute('data-orientation') === orientation

      if (orientation === 'horizontal') return isThumb ? 22 : 24
      if (orientation === 'vertical') {
        return isThumb ? 48 : scrollAreaViewportMetrics.clientHeight
      }

      return 0
    })
    vi.spyOn(HTMLElement.prototype, 'offsetWidth', 'get').mockImplementation(function (
      this: HTMLElement
    ) {
      const orientation = this.getAttribute('data-orientation')
      const isThumb = this.parentElement?.getAttribute('data-orientation') === orientation

      if (orientation === 'vertical') return isThumb ? 22 : 24
      if (orientation === 'horizontal') {
        return isThumb ? 64 : scrollAreaViewportMetrics.clientWidth
      }

      return 0
    })

    Object.defineProperty(HTMLElement.prototype, 'getAnimations', {
      configurable: true,
      value: vi.fn(() => [])
    })

    class TestResizeObserver implements ResizeObserver {
      readonly disconnect = vi.fn()
      readonly observe = vi.fn((element: Element) => {
        const record = resizeObservers.find(({ observer }) => observer === this)

        record?.observedElements.push(element)
      })
      readonly unobserve = vi.fn((element: Element) => {
        const record = resizeObservers.find(({ observer }) => observer === this)

        if (record !== undefined) {
          record.observedElements = record.observedElements.filter(
            (observedElement) => observedElement !== element
          )
        }
      })

      constructor(callback: ResizeObserverCallback) {
        resizeObservers.push({ callback, observedElements: [], observer: this })
      }
    }

    globalThis.ResizeObserver = TestResizeObserver

    vi.spyOn(Element.prototype, 'getBoundingClientRect').mockImplementation(function (
      this: Element
    ) {
      const explicitBox = elementBoxes.get(this)

      if (explicitBox !== undefined) {
        return explicitBox
      }

      if (this instanceof HTMLElement && this.hasAttribute('data-area')) {
        const containingBox =
          this.parentElement === null ? undefined : elementBoxes.get(this.parentElement)

        if (containingBox !== undefined) {
          return new DOMRect(
            containingBox.left + resolveRenderedLength(this.style.left, containingBox.width),
            containingBox.top + resolveRenderedLength(this.style.top, containingBox.height),
            resolveRenderedLength(this.style.width, containingBox.width),
            resolveRenderedLength(this.style.height, containingBox.height)
          )
        }
      }

      return new DOMRect()
    })

    matchMediaDescriptor = Object.getOwnPropertyDescriptor(window, 'matchMedia')
    Object.defineProperty(window, 'matchMedia', {
      configurable: true,
      value: vi.fn((query: string): MediaQueryList => {
        const matches = query.includes('prefers-reduced-motion') && prefersReducedMotion

        return {
          addEventListener: vi.fn(),
          addListener: vi.fn(),
          dispatchEvent: vi.fn(() => true),
          matches,
          media: query,
          onchange: null,
          removeEventListener: vi.fn(),
          removeListener: vi.fn()
        }
      })
    })
  })

  afterEach(() => {
    if (originalResizeObserver === undefined) {
      Reflect.deleteProperty(globalThis, 'ResizeObserver')
    } else {
      globalThis.ResizeObserver = originalResizeObserver
    }

    if (matchMediaDescriptor === undefined) {
      Reflect.deleteProperty(window, 'matchMedia')
    } else {
      Object.defineProperty(window, 'matchMedia', matchMediaDescriptor)
    }

    if (ORIGINAL_GET_ANIMATIONS === undefined) {
      Reflect.deleteProperty(HTMLElement.prototype, 'getAnimations')
    } else {
      Object.defineProperty(HTMLElement.prototype, 'getAnimations', {
        configurable: true,
        value: ORIGINAL_GET_ANIMATIONS
      })
    }

    vi.restoreAllMocks()
  })

  function resolveRenderedLength(value: string, containingLength: number) {
    const numericValue = Number.parseFloat(value)

    if (!Number.isFinite(numericValue)) {
      return 0
    }

    return value.endsWith('%') ? (numericValue / 100) * containingLength : numericValue
  }

  function readRenderedBox(element: HTMLElement) {
    const { height, left, top, width } = element.getBoundingClientRect()

    return { height, left, top, width }
  }

  function setElementBox(element: Element, { height, left = 0, top = 0, width }: ElementBox) {
    const rectangle = new DOMRect(left, top, width, height)

    elementBoxes.set(element, rectangle)
    Object.defineProperties(element, {
      clientHeight: { configurable: true, value: height },
      clientWidth: { configurable: true, value: width },
      offsetHeight: { configurable: true, value: height + 2 },
      offsetWidth: { configurable: true, value: width + 2 }
    })

    return rectangle
  }

  function notifyResize(element: Element, box: ElementBox) {
    const contentRect = setElementBox(element, box)
    const contentBoxSize = [
      {
        blockSize: box.height,
        inlineSize: box.width
      }
    ] as ResizeObserverSize[]
    const borderBoxSize = [
      {
        blockSize: box.height + 2,
        inlineSize: box.width + 2
      }
    ] as ResizeObserverSize[]
    const entry = {
      borderBoxSize,
      contentBoxSize,
      contentRect,
      devicePixelContentBoxSize: contentBoxSize,
      target: element
    } as ResizeObserverEntry

    act(() => {
      for (const { callback, observedElements, observer } of resizeObservers) {
        if (observedElements.includes(element)) {
          callback([entry], observer)
        }
      }
    })
  }

  function getStylingSource(element: HTMLElement) {
    return `${element.getAttribute('class') ?? ''} ${element.getAttribute('style') ?? ''} ${
      getComputedStyle(element).cssText
    }`
  }

  function getInheritedTilesVariable(
    element: HTMLElement,
    propertyName: '--tiles-layout-duration' | '--tiles-layout-easing'
  ) {
    let currentElement: HTMLElement | null = element

    while (currentElement !== null) {
      const value = getComputedStyle(currentElement).getPropertyValue(propertyName).trim()

      if (value !== '') {
        return value
      }

      currentElement = currentElement.parentElement
    }

    return ''
  }

  function hasSuppressedGeometryTransition(element: HTMLElement) {
    const computedStyle = getComputedStyle(element)
    const transitionProperties = (
      computedStyle.transitionProperty || element.style.transitionProperty
    )
      .split(',')
      .map((property) => property.trim())
    const transitionsGeometry =
      transitionProperties.includes('all') ||
      ['left', 'top', 'width', 'height'].some((property) => transitionProperties.includes(property))

    if (!transitionsGeometry) {
      return true
    }

    const transitionDurations = (
      computedStyle.transitionDuration || element.style.transitionDuration
    )
      .split(',')
      .map((duration) => duration.trim())
    const usesOnlyZeroDurations =
      transitionDurations.length > 0 &&
      transitionDurations.every((duration) => /^0(?:\.0+)?(?:ms|s)$/.test(duration))

    return (
      usesOnlyZeroDurations ||
      /^0(?:\.0+)?(?:ms|s)$/.test(getInheritedTilesVariable(element, '--tiles-layout-duration'))
    )
  }

  function getDecorativeStripes(tile: HTMLElement) {
    return Array.from(tile.querySelectorAll<HTMLElement>('[aria-hidden="true"]')).filter(
      (element) => {
        const source = getStylingSource(element)

        return source.includes('repeating-linear-gradient') || source.includes('--stripes-angle')
      }
    )
  }

  function queryScrollableTileViewport(tile: HTMLElement) {
    return tile.querySelector<HTMLElement>('[tabindex]')
  }

  function getScrollableTileViewport(tile: HTMLElement) {
    const viewport = queryScrollableTileViewport(tile)

    expect(viewport).toBeInTheDocument()

    return viewport as HTMLElement
  }

  function queryScrollableTileScrollbar(tile: HTMLElement, orientation: 'horizontal' | 'vertical') {
    const scrollbar = Array.from(tile.children).find(
      (element) => element.getAttribute('data-orientation') === orientation
    )

    return scrollbar instanceof HTMLElement ? scrollbar : null
  }

  function finishGeometryMotion(tile: HTMLElement) {
    for (const propertyName of ['left', 'top', 'width', 'height']) {
      fireEvent.transitionEnd(tile, { propertyName })
    }
  }

  function cancelGeometryMotion(tile: HTMLElement) {
    for (const propertyName of ['left', 'top', 'width', 'height']) {
      fireEvent.transitionCancel(tile, { propertyName })
    }
  }

  function startGeometryMotion(tile: HTMLElement) {
    for (const propertyName of ['left', 'top', 'width', 'height']) {
      fireEvent.transitionRun(tile, { propertyName })
    }
  }

  function expectImmediateLayout(root: HTMLElement, tiles: HTMLElement[]) {
    expect(root).not.toHaveAttribute('data-animating')

    for (const tile of tiles) {
      expect(tile).not.toHaveAttribute('data-moving')
    }
  }

  function getThemeToken(
    element: HTMLElement,
    token: '--background' | '--border' | '--foreground'
  ) {
    return getComputedStyle(element).getPropertyValue(token).trim()
  }

  function hasFullOnePixelPerimeter(element: HTMLElement) {
    const source = getStylingSource(element)
    const hasTailwindPerimeter =
      element.classList.contains('border') &&
      (element.classList.contains('border-border') || source.includes('var(--border)'))
    const hasStylePerimeter =
      [
        element.style.borderBottomWidth,
        element.style.borderLeftWidth,
        element.style.borderRightWidth,
        element.style.borderTopWidth
      ].every((width) => width === '1px') &&
      (element.style.borderColor.includes('var(--border)') || source.includes('border-border'))

    return hasTailwindPerimeter || hasStylePerimeter
  }

  function hasOnePixelSeparator(
    element: HTMLElement,
    side: 'block-end' | 'block-start' | 'inline-end' | 'inline-start'
  ) {
    const source = getStylingSource(element)
    const patterns = {
      'block-end': [/(?:^|\s)border-b(?:\s|$)/, /border-bottom-width:\s*1px/i],
      'block-start': [/(?:^|\s)border-t(?:\s|$)/, /border-top-width:\s*1px/i],
      'inline-end': [/(?:^|\s)border-(?:e|r)(?:\s|$)/, /border-(?:inline-end|right)-width:\s*1px/i],
      'inline-start': [
        /(?:^|\s)border-(?:l|s)(?:\s|$)/,
        /border-(?:inline-start|left)-width:\s*1px/i
      ]
    } as const
    const pseudoElementPatterns = {
      'block-end': {
        position: /(?:before|after):bottom-0/,
        size: /(?:before|after):h-px/
      },
      'block-start': {
        position: /(?:before|after):top-0/,
        size: /(?:before|after):h-px/
      },
      'inline-end': {
        position: /(?:before|after):right-0/,
        size: /(?:before|after):w-px/
      },
      'inline-start': {
        position: /(?:before|after):left-0/,
        size: /(?:before|after):w-px/
      }
    } as const
    const pseudoElementPattern = pseudoElementPatterns[side]

    return (
      patterns[side].some((pattern) => pattern.test(source)) ||
      (pseudoElementPattern.position.test(source) && pseudoElementPattern.size.test(source))
    )
  }

  function expectSingleSharedSeparator(
    first: HTMLElement,
    firstSide: 'block-end' | 'inline-end',
    second: HTMLElement,
    secondSide: 'block-start' | 'inline-start'
  ) {
    const firstOwnsSeparator = hasOnePixelSeparator(first, firstSide)
    const secondOwnsSeparator = hasOnePixelSeparator(second, secondSide)

    expect(Number(firstOwnsSeparator) + Number(secondOwnsSeparator)).toBe(1)

    const owner = firstOwnsSeparator ? first : second

    expect(getStylingSource(owner)).toMatch(/border-border|bg-border|var\(--border\)/)
  }

  it('EX-001 / EX-002 / EX-003 / EX-004 / EX-005 / EX-006 / EX-007 / EX-008 - exposes the multipart runtime family and public type contract', () => {
    expect(PACKAGE_EXPORTS.Tiles).toEqual({
      Root: PACKAGE_EXPORTS.TilesRoot,
      ScrollableTile: PACKAGE_EXPORTS.TilesScrollableTile,
      Tile: PACKAGE_EXPORTS.TilesTile
    })
    expect(PACKAGE_EXPORTS.Components.Tiles).toBe(PACKAGE_EXPORTS.Tiles)
    expect(PACKAGE_EXPORTS.Ui.Components).toBe(PACKAGE_EXPORTS.Components)
    expect(PACKAGE_EXPORTS.Ui.Components.Tiles).toBe(PACKAGE_EXPORTS.Tiles)
    expect(PACKAGE_EXPORTS.TilesRoot).toBeTypeOf('function')
    expect(PACKAGE_EXPORTS.TilesScrollableTile).toBeTypeOf('function')
    expect(PACKAGE_EXPORTS.TilesTile).toBeTypeOf('function')

    expectTypeOf<TilesArea>().toEqualTypeOf<string>()
    expectTypeOf<TilesContainerBreakpoint>().toEqualTypeOf<
      | '3xs'
      | '2xs'
      | 'xs'
      | 'sm'
      | 'md'
      | 'lg'
      | 'xl'
      | '2xl'
      | '3xl'
      | '4xl'
      | '5xl'
      | '6xl'
      | '7xl'
    >()
    expectTypeOf<TilesLayoutKey>().toEqualTypeOf<'base' | TilesContainerBreakpoint>()
    expectTypeOf<TilesMatrix<'main' | 'aside'>>().toEqualTypeOf<
      readonly (readonly ('main' | 'aside')[])[]
    >()
    expectTypeOf<TilesLayout<'main' | 'aside'>>().toEqualTypeOf<
      Readonly<
        { base: TilesMatrix<'main' | 'aside'> } & Partial<
          Record<TilesContainerBreakpoint, TilesMatrix<'main' | 'aside'>>
        >
      >
    >()
    expectTypeOf<TilesTheme>().toEqualTypeOf<'inherit' | 'inverse'>()
    expectTypeOf<TilesRootProps<'main'>>().toEqualTypeOf<ExpectedTilesRootProps<'main'>>()
    expectTypeOf<TilesScrollableTileProps<'main'>>().toEqualTypeOf<
      ExpectedTilesScrollableTileProps<'main'>
    >()
    expectTypeOf<TilesTileProps<'main'>>().toEqualTypeOf<ExpectedTilesTileProps<'main'>>()
    expectTypeOf<TilesTileStripesProps>().toEqualTypeOf<
      Pick<StripesProps, 'angle' | 'color' | 'gap' | 'width'>
    >()
  })

  it('UC-001 / UC-007 / EX-001 - renders named Tiles with real geometry and public layout variables', async () => {
    render(
      <Tiles.Root
        layout={DASHBOARD_LAYOUT}
        data-testid="dashboard-root"
        style={{ height: '36rem' }}
      >
        <Tiles.Tile area="main">Main</Tiles.Tile>
        <Tiles.Tile area="aside">Aside</Tiles.Tile>
        <Tiles.Tile area="secondary">Secondary</Tiles.Tile>
        <Tiles.Tile area="footer">Footer</Tiles.Tile>
      </Tiles.Root>
    )

    const root = screen.getByTestId('dashboard-root')
    const tiles = ['main', 'aside', 'secondary', 'footer'].map((area) =>
      root.querySelector<HTMLElement>(`[data-area="${area}"]`)
    )

    expect(tiles).not.toContain(null)
    notifyResize(root, { height: 576, width: 320 })

    await waitFor(() => {
      expect(root).toHaveAttribute('data-layout', 'base')
    })

    expect(root.tagName).toBe('DIV')
    expect(root).not.toHaveAttribute('role')
    expect(getStylingSource(root)).toContain('--tiles-layout-duration')
    expect(getStylingSource(root)).toContain('200ms')
    expect(getStylingSource(root)).toContain('--tiles-layout-easing')
    expect(getStylingSource(root)).toContain('cubic-bezier(0.22, 1, 0.36, 1)')

    for (const [index, tile] of tiles.entries()) {
      const requiredTile = tile as HTMLElement
      const area = ['main', 'aside', 'secondary', 'footer'][index]
      const stylingSource = getStylingSource(requiredTile)

      expect(requiredTile.tagName).toBe('DIV')
      expect(requiredTile).toHaveAttribute('data-area', area)
      expect(requiredTile).not.toHaveAttribute('role')

      for (const propertyName of ['left', 'top', 'width', 'height']) {
        expect(stylingSource).toContain(propertyName)
      }

      expect(stylingSource).not.toMatch(/scale\(/i)
    }

    expectImmediateLayout(root, tiles as HTMLElement[])
  })

  it('UC-001 / UC-007 / UC-009 / UC-010 / UC-011 / UC-014 / UC-019 / EX-008 - gives ScrollableTile the complete settled Tile surface', async () => {
    render(
      <div className="light">
        <style>
          {`
            .light {
              --background: light-background;
              --border: light-border;
              --foreground: light-foreground;
            }

            .dark {
              --background: dark-background;
              --border: dark-border;
              --foreground: dark-foreground;
            }
          `}
        </style>
        <Tiles.Root
          border={2}
          data-testid="scrollable-surface-root"
          layout={SCROLLABLE_LAYOUT}
          style={{ height: '16rem' }}
        >
          <Tiles.ScrollableTile
            area="history"
            data-testid="scrollable-surface"
            stripesProps
            theme="inverse"
          >
            <button type="button">History action</button>
          </Tiles.ScrollableTile>
          <Tiles.Tile area="summary">Summary</Tiles.Tile>
        </Tiles.Root>
      </div>
    )

    const root = screen.getByTestId('scrollable-surface-root')
    const scrollableTile = screen.getByTestId('scrollable-surface')

    notifyResize(root, { height: 256, width: 400 })

    await waitFor(() => expect(root).toHaveAttribute('data-layout', 'sm'))

    const viewport = getScrollableTileViewport(scrollableTile)
    const stripes = getDecorativeStripes(scrollableTile)

    expect(scrollableTile.tagName).toBe('DIV')
    expect(scrollableTile).toHaveAttribute('data-area', 'history')
    expect(scrollableTile).toHaveStyle({ height: '100%', left: '0%', top: '0%', width: '50%' })
    expect(scrollableTile).toHaveClass('border-e-2', 'border-border')
    expect(getThemeToken(scrollableTile, '--background')).toBe('dark-background')
    expect(getThemeToken(scrollableTile, '--foreground')).toBe('dark-foreground')
    expect(stripes).toHaveLength(1)
    expect(viewport).toContainElement(screen.getByRole('button', { name: 'History action' }))
    expect(viewport).not.toContainElement(stripes[0] as HTMLElement)
    expect(scrollableTile).not.toHaveAttribute('role')
    expect(scrollableTile).not.toHaveAttribute('data-moving')
    expect(root).not.toHaveAttribute('data-animating')
  })

  it('UC-013 / UC-014 / UC-019 / EX-008 / CR-002 - exposes user-driven native dual-axis scrolling on the shared outer surface without Tiles motion', async () => {
    scrollAreaViewportMetrics = {
      clientHeight: 160,
      clientWidth: 320,
      scrollHeight: 640,
      scrollWidth: 768
    }

    render(
      <Tiles.Root
        data-testid="scrollable-overflow-root"
        layout={SCROLLABLE_LAYOUT}
        style={{ height: '16rem' }}
      >
        <Tiles.ScrollableTile
          area="history"
          data-has-overflow-x="consumer"
          data-has-overflow-y="consumer"
          data-scrolling="consumer"
          data-testid="scrollable-overflow-surface"
        >
          <div style={{ height: '40rem', width: '48rem' }}>Overflowing history</div>
        </Tiles.ScrollableTile>
        <Tiles.Tile area="summary">Summary</Tiles.Tile>
      </Tiles.Root>
    )

    const root = screen.getByTestId('scrollable-overflow-root')
    const scrollableTile = screen.getByTestId('scrollable-overflow-surface')

    notifyResize(root, { height: 256, width: 400 })

    await waitFor(() => {
      expect(scrollableTile).toHaveAttribute('data-has-overflow-x')
      expect(scrollableTile).toHaveAttribute('data-has-overflow-y')
      expect(scrollableTile).toHaveAttribute('data-overflow-x-end')
      expect(scrollableTile).toHaveAttribute('data-overflow-y-end')
    })

    const viewport = getScrollableTileViewport(scrollableTile)

    expect(viewport).toHaveAttribute('tabindex', '0')
    expect(queryScrollableTileScrollbar(scrollableTile, 'horizontal')).toBeInTheDocument()
    expect(queryScrollableTileScrollbar(scrollableTile, 'vertical')).toBeInTheDocument()
    expect(scrollableTile.style.getPropertyValue('--scroll-area-corner-height')).toMatch(/px$/)
    expect(scrollableTile.style.getPropertyValue('--scroll-area-corner-width')).toMatch(/px$/)
    expect(scrollableTile).not.toHaveAttribute('data-scrolling')

    fireEvent.touchMove(viewport)
    viewport.scrollLeft = 96
    viewport.scrollTop = 72
    fireEvent.scroll(viewport)

    await waitFor(() => expect(scrollableTile).toHaveAttribute('data-scrolling'))

    expect(viewport.scrollLeft).toBe(96)
    expect(viewport.scrollTop).toBe(72)
    expect(root).not.toHaveAttribute('data-animating')
    expect(scrollableTile).not.toHaveAttribute('data-moving')
  })

  it('UC-014 / UC-019 / CR-003 - leaves ScrollableTile scrolling state unchanged when a nested native region scrolls', async () => {
    scrollAreaViewportMetrics = {
      clientHeight: 160,
      clientWidth: 320,
      scrollHeight: 640,
      scrollWidth: 320
    }

    render(
      <Tiles.Root layout={SINGLE_TILE_LAYOUT} style={{ height: '16rem' }}>
        <Tiles.ScrollableTile area="content" data-testid="nested-scroll-surface">
          <div data-testid="nested-native-scroller" style={{ height: '5rem', overflow: 'auto' }}>
            <div style={{ height: '20rem' }}>Nested scrolling content</div>
          </div>
        </Tiles.ScrollableTile>
      </Tiles.Root>
    )

    const scrollableTile = screen.getByTestId('nested-scroll-surface')

    await waitFor(() => expect(scrollableTile).toHaveAttribute('data-has-overflow-y'))

    const nestedScroller = screen.getByTestId('nested-native-scroller')

    fireEvent.touchMove(nestedScroller)
    nestedScroller.scrollTop = 48
    fireEvent.scroll(nestedScroller)

    expect(nestedScroller.scrollTop).toBe(48)
    expect(scrollableTile).not.toHaveAttribute('data-scrolling')
    expect(scrollableTile).not.toHaveAttribute('data-moving')
  })

  it('UC-006 / UC-007 / EX-001 / QA-001 - commits the first measured responsive target with geometry transitions suppressed', () => {
    render(
      <Tiles.Root
        data-testid="initial-responsive-root"
        layout={DASHBOARD_LAYOUT}
        style={{ height: '36rem' }}
      >
        <Tiles.Tile area="main">Main</Tiles.Tile>
        <Tiles.Tile area="aside">Aside</Tiles.Tile>
        <Tiles.Tile area="secondary">Secondary</Tiles.Tile>
        <Tiles.Tile area="footer">Footer</Tiles.Tile>
      </Tiles.Root>
    )

    const root = screen.getByTestId('initial-responsive-root')
    const main = root.querySelector<HTMLElement>('[data-area="main"]') as HTMLElement
    const aside = root.querySelector<HTMLElement>('[data-area="aside"]') as HTMLElement
    const secondary = root.querySelector<HTMLElement>('[data-area="secondary"]') as HTMLElement
    const footer = root.querySelector<HTMLElement>('[data-area="footer"]') as HTMLElement
    const tiles = [main, aside, secondary, footer]

    notifyResize(root, { height: 576, width: 400 })

    expect(root).toHaveAttribute('data-layout', 'sm')
    expect(main).toHaveStyle({ height: '50%', left: '0%', top: '0%', width: '50%' })
    expect(aside).toHaveStyle({ height: '50%', left: '50%', top: '0%', width: '50%' })
    expect(secondary).toHaveStyle({ height: '50%', left: '0%', top: '50%', width: '50%' })
    expect(footer).toHaveStyle({ height: '50%', left: '50%', top: '50%', width: '50%' })
    expectImmediateLayout(root, tiles)

    for (const tile of tiles) {
      expect(hasSuppressedGeometryTransition(tile)).toBe(true)
    }
  })

  it('UC-004 / UC-006 / CR-002 - lets className override both motion variables and nested Roots inherit them', () => {
    render(
      <>
        <style>
          {`
            .consumer-motion {
              --tiles-layout-duration: 480ms;
              --tiles-layout-easing: steps(3, end);
            }
          `}
        </style>
        <Tiles.Root
          className="consumer-motion"
          data-testid="motion-variable-root"
          layout={SINGLE_TILE_LAYOUT}
          style={{ height: '20rem' }}
        >
          <Tiles.Tile area="content">
            <Tiles.Root
              data-testid="inherited-motion-variable-root"
              layout={SINGLE_TILE_LAYOUT}
              style={{ height: '100%' }}
            >
              <Tiles.Tile area="content">Nested content</Tiles.Tile>
            </Tiles.Root>
          </Tiles.Tile>
        </Tiles.Root>
      </>
    )

    const root = screen.getByTestId('motion-variable-root')
    const nestedRoot = screen.getByTestId('inherited-motion-variable-root')

    expect(root).toHaveClass('consumer-motion')
    expect(getInheritedTilesVariable(root, '--tiles-layout-duration')).toBe('480ms')
    expect(getInheritedTilesVariable(root, '--tiles-layout-easing')).toBe('steps(3, end)')
    expect(getInheritedTilesVariable(nestedRoot, '--tiles-layout-duration')).toBe('480ms')
    expect(getInheritedTilesVariable(nestedRoot, '--tiles-layout-easing')).toBe('steps(3, end)')
  })

  it.each(INVALID_CONFIGURATION_CASES)(
    'UC-002 - rejects $label before selecting or animating a layout',
    ({ layout, messagePattern, tileAreas }) => {
      vi.spyOn(console, 'error').mockImplementation(() => undefined)

      expect(() =>
        render(
          <Tiles.Root layout={layout as unknown as TilesLayout<string>} data-testid="invalid-root">
            {tileAreas.map((area, index) => (
              <Tiles.Tile area={area} key={`${area}-${index}`}>
                {area || 'empty area'}
              </Tiles.Tile>
            ))}
          </Tiles.Root>
        )
      ).toThrow(messagePattern)
      expect(screen.queryByTestId('invalid-root')).not.toBeInTheDocument()
    }
  )

  it('UC-002 / UC-019 - validates duplicate direct areas across Tile and ScrollableTile', () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined)

    expect(() =>
      render(
        <Tiles.Root layout={SINGLE_TILE_LAYOUT} style={{ height: '10rem' }}>
          <Tiles.Tile area="content">Normal content</Tiles.Tile>
          <Tiles.ScrollableTile area="content">Scrollable content</Tiles.ScrollableTile>
        </Tiles.Root>
      )
    ).toThrow(/content|duplicate|unique/i)
  })

  it('UC-002 / CR-004 - rejects a non-Tile child that carries an area prop', () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined)

    function AreaImpostor({ area }: { area: string }) {
      return <div data-area={area}>Not a Tile</div>
    }

    expect(() =>
      render(
        <Tiles.Root layout={SINGLE_TILE_LAYOUT} style={{ height: '10rem' }}>
          <AreaImpostor area="content" />
        </Tiles.Root>
      )
    ).toThrow(/content|direct|Tile/i)
  })

  it('UC-002 / EX-005 - exposes a descriptive invalid-matrix diagnostic to a consumer error boundary', () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined)

    const invalidLayout = {
      base: [
        ['main', 'main'],
        ['main', 'aside']
      ]
    } as const satisfies TilesLayout<'main' | 'aside'>

    render(
      <ExampleErrorBoundary>
        <Tiles.Root layout={invalidLayout} style={{ height: '12rem' }}>
          <Tiles.Tile area="main">Main</Tiles.Tile>
          <Tiles.Tile area="aside">Aside</Tiles.Tile>
        </Tiles.Root>
      </ExampleErrorBoundary>
    )

    const diagnostic = screen.getByRole('status')

    expect(diagnostic).toHaveTextContent(/base/i)
    expect(diagnostic).toHaveTextContent(/main/i)
  })

  it('UC-003 / UC-006 / UC-007 / EX-001 - selects inclusive local breakpoints and inherits omitted keys without motion at zero duration', async () => {
    render(
      <Tiles.Root
        layout={BREAKPOINT_LAYOUT}
        data-testid="breakpoint-root"
        style={ZERO_DURATION_STYLE}
      >
        <Tiles.Tile area="main">Main</Tiles.Tile>
        <Tiles.Tile area="aside">Aside</Tiles.Tile>
      </Tiles.Root>
    )

    const root = screen.getByTestId('breakpoint-root')
    const tiles = Array.from(root.querySelectorAll<HTMLElement>('[data-area]'))

    notifyResize(root, { height: 320, width: 319.5 })
    await waitFor(() => expect(root).toHaveAttribute('data-layout', 'base'))
    expectImmediateLayout(root, tiles)

    notifyResize(root, { height: 320, width: 320 })
    await waitFor(() => expect(root).toHaveAttribute('data-layout', 'xs'))
    expectImmediateLayout(root, tiles)

    notifyResize(root, { height: 320, width: 384 })
    await waitFor(() => expect(root).toHaveAttribute('data-layout', 'xs'))
    expectImmediateLayout(root, tiles)

    notifyResize(root, { height: 320, width: 448 })
    await waitFor(() => expect(root).toHaveAttribute('data-layout', 'md'))
    expectImmediateLayout(root, tiles)

    notifyResize(root, { height: 320, width: 512 })
    await waitFor(() => expect(root).toHaveAttribute('data-layout', 'lg'))
    expectImmediateLayout(root, tiles)
  })

  it('UC-014 / UC-016 / EX-006 - freezes percentage geometry while rendered rectangles passively follow Root', async () => {
    render(<FrozenResponsiveTiles />)

    const wrapper = screen.getByTestId('frozen-wrapper')
    const root = screen.getByTestId('frozen-root')
    const main = root.querySelector<HTMLElement>('[data-area="main"]') as HTMLElement
    const aside = root.querySelector<HTMLElement>('[data-area="aside"]') as HTMLElement

    notifyResize(root, { height: 192, width: 400 })

    await waitFor(() => expect(root).toHaveAttribute('data-layout', 'sm'))
    expect(main).toHaveStyle({ height: '100%', left: '0%', top: '0%', width: '50%' })
    expect(aside).toHaveStyle({ height: '100%', left: '50%', top: '0%', width: '50%' })
    expectImmediateLayout(root, [main, aside])

    expect(readRenderedBox(main)).toEqual({ height: 192, left: 0, top: 0, width: 200 })
    expect(readRenderedBox(aside)).toEqual({ height: 192, left: 200, top: 0, width: 200 })

    notifyResize(root, { height: 240, width: 300 })

    expect(root).toHaveAttribute('data-layout', 'sm')
    expect(main).toHaveStyle({ height: '100%', left: '0%', top: '0%', width: '50%' })
    expect(aside).toHaveStyle({ height: '100%', left: '50%', top: '0%', width: '50%' })
    expect(readRenderedBox(main)).toEqual({ height: 240, left: 0, top: 0, width: 150 })
    expect(readRenderedBox(aside)).toEqual({ height: 240, left: 150, top: 0, width: 150 })
    expectImmediateLayout(root, [main, aside])
    expect(wrapper).toHaveClass('resize-x', 'overflow-auto', 'border-8', 'border-border', 'p-8')
    expect(root).toHaveClass('h-full', 'w-full')
    expect(root).not.toHaveClass('resize-x', 'overflow-auto')
    expect(root.style.overflow).toBe('')

    fireEvent.click(screen.getByRole('button', { name: 'Resume responsive reflow' }))

    await waitFor(() => {
      expect(screen.getByRole('status')).toHaveTextContent('Responsive')
      expect(root).toHaveAttribute('data-layout', 'base')
      expect(root).toHaveAttribute('data-animating')
      expect(main).toHaveAttribute('data-moving')
      expect(aside).toHaveAttribute('data-moving')
    })

    startGeometryMotion(main)
    startGeometryMotion(aside)
    finishGeometryMotion(main)
    finishGeometryMotion(aside)

    await waitFor(() => expectImmediateLayout(root, [main, aside]))
  })

  it('UC-006 / UC-007 / UC-016 / EX-006 - lets an active transition settle at its proportional target without a second transition', async () => {
    const rendered = render(
      <Tiles.Root
        data-testid="engaged-freeze-root"
        frozen={false}
        layout={FROZEN_LAYOUT}
        style={{ height: '12rem' }}
      >
        <Tiles.Tile area="main">Main</Tiles.Tile>
        <Tiles.Tile area="aside">Aside</Tiles.Tile>
      </Tiles.Root>
    )
    const root = screen.getByTestId('engaged-freeze-root')
    const main = root.querySelector<HTMLElement>('[data-area="main"]') as HTMLElement
    const aside = root.querySelector<HTMLElement>('[data-area="aside"]') as HTMLElement

    notifyResize(root, { height: 192, width: 300 })
    await waitFor(() => expect(root).toHaveAttribute('data-layout', 'base'))

    notifyResize(root, { height: 192, width: 400 })
    startGeometryMotion(main)
    startGeometryMotion(aside)

    await waitFor(() => {
      expect(root).toHaveAttribute('data-layout', 'sm')
      expect(root).toHaveAttribute('data-animating')
      expect(main).toHaveAttribute('data-moving')
      expect(aside).toHaveAttribute('data-moving')
    })

    rendered.rerender(
      <Tiles.Root
        data-testid="engaged-freeze-root"
        frozen
        layout={FROZEN_LAYOUT}
        style={{ height: '12rem' }}
      >
        <Tiles.Tile area="main">Main</Tiles.Tile>
        <Tiles.Tile area="aside">Aside</Tiles.Tile>
      </Tiles.Root>
    )
    notifyResize(root, { height: 240, width: 300 })

    expect(root).toHaveAttribute('data-layout', 'sm')
    expect(root).toHaveAttribute('data-animating')
    expect(main).toHaveAttribute('data-moving')
    expect(aside).toHaveAttribute('data-moving')
    expect(main).toHaveStyle({ height: '100%', left: '0%', top: '0%', width: '50%' })
    expect(aside).toHaveStyle({ height: '100%', left: '50%', top: '0%', width: '50%' })
    expect(readRenderedBox(main)).toEqual({ height: 240, left: 0, top: 0, width: 150 })
    expect(readRenderedBox(aside)).toEqual({ height: 240, left: 150, top: 0, width: 150 })

    finishGeometryMotion(main)
    finishGeometryMotion(aside)

    await waitFor(() => expectImmediateLayout(root, [main, aside]))
    expect(root).toHaveAttribute('data-layout', 'sm')
    expect(readRenderedBox(main)).toEqual({ height: 240, left: 0, top: 0, width: 150 })
    expect(readRenderedBox(aside)).toEqual({ height: 240, left: 150, top: 0, width: 150 })

    notifyResize(root, { height: 320, width: 500 })

    expect(root).toHaveAttribute('data-layout', 'sm')
    expect(readRenderedBox(main)).toEqual({ height: 320, left: 0, top: 0, width: 250 })
    expect(readRenderedBox(aside)).toEqual({ height: 320, left: 250, top: 0, width: 250 })
    expectImmediateLayout(root, [main, aside])

    rendered.rerender(
      <Tiles.Root
        data-testid="engaged-freeze-root"
        frozen={undefined}
        layout={FROZEN_LAYOUT}
        style={{ height: '12rem' }}
      >
        <Tiles.Tile area="main">Main</Tiles.Tile>
        <Tiles.Tile area="aside">Aside</Tiles.Tile>
      </Tiles.Root>
    )

    expect(root).toHaveAttribute('data-layout', 'sm')
    expect(readRenderedBox(main)).toEqual({ height: 320, left: 0, top: 0, width: 250 })
    expect(readRenderedBox(aside)).toEqual({ height: 320, left: 250, top: 0, width: 250 })
    expectImmediateLayout(root, [main, aside])
  })

  it('UC-006 / UC-007 / UC-016 / EX-006 / CR-002 - clears a pending freeze when resumed before settlement', async () => {
    const tiles = [
      <Tiles.Tile key="main" area="main">
        Main
      </Tiles.Tile>,
      <Tiles.Tile key="aside" area="aside">
        Aside
      </Tiles.Tile>
    ]
    const rendered = render(
      <Tiles.Root
        data-testid="pending-freeze-root"
        frozen={false}
        layout={FROZEN_LAYOUT}
        style={{ height: '12rem' }}
      >
        {tiles}
      </Tiles.Root>
    )
    const root = screen.getByTestId('pending-freeze-root')
    const main = root.querySelector<HTMLElement>('[data-area="main"]') as HTMLElement
    const aside = root.querySelector<HTMLElement>('[data-area="aside"]') as HTMLElement

    root.style.width = '300px'
    notifyResize(root, { height: 192, width: 300 })
    await waitFor(() => expect(root).toHaveAttribute('data-layout', 'base'))

    root.style.width = '400px'
    notifyResize(root, { height: 192, width: 400 })
    startGeometryMotion(main)
    startGeometryMotion(aside)

    await waitFor(() => {
      expect(root).toHaveAttribute('data-layout', 'sm')
      expect(root).toHaveAttribute('data-animating')
      expect(main).toHaveAttribute('data-moving')
      expect(aside).toHaveAttribute('data-moving')
    })

    rendered.rerender(
      <Tiles.Root
        data-testid="pending-freeze-root"
        frozen
        layout={FROZEN_LAYOUT}
        style={{ height: '12rem' }}
      >
        {tiles}
      </Tiles.Root>
    )

    notifyResize(root, { height: 192, width: 300 })

    expect(root).toHaveAttribute('data-layout', 'sm')
    expect(root).toHaveAttribute('data-animating')
    expect(main).toHaveStyle({ height: '100%', left: '0%', top: '0%', width: '50%' })
    expect(aside).toHaveStyle({ height: '100%', left: '50%', top: '0%', width: '50%' })

    rendered.rerender(
      <Tiles.Root
        data-testid="pending-freeze-root"
        frozen={false}
        layout={FROZEN_LAYOUT}
        style={{ height: '12rem' }}
      >
        {tiles}
      </Tiles.Root>
    )

    expect(root).toHaveAttribute('data-layout', 'base')
    expect(root).toHaveAttribute('data-animating')
    expect(main).toHaveAttribute('data-moving')
    expect(aside).toHaveAttribute('data-moving')
    expect(main).toHaveStyle({ height: '50%', left: '0%', top: '0%', width: '100%' })
    expect(aside).toHaveStyle({ height: '50%', left: '0%', top: '50%', width: '100%' })

    startGeometryMotion(main)
    startGeometryMotion(aside)
    finishGeometryMotion(main)
    finishGeometryMotion(aside)

    await waitFor(() => expectImmediateLayout(root, [main, aside]))
    expect(readRenderedBox(main)).toEqual({ height: 96, left: 0, top: 0, width: 300 })
    expect(readRenderedBox(aside)).toEqual({ height: 96, left: 0, top: 96, width: 300 })
  })

  it('UC-016 / UC-018 - releases to identical pending geometry without motion while updating its source layout key', async () => {
    const rendered = render(
      <Tiles.Root
        data-testid="current-freeze-root"
        frozen
        layout={FROZEN_LAYOUT}
        style={{ height: '12rem' }}
      >
        <Tiles.Tile area="main">Main</Tiles.Tile>
        <Tiles.Tile area="aside">Aside</Tiles.Tile>
      </Tiles.Root>
    )
    const root = screen.getByTestId('current-freeze-root')
    const tiles = Array.from(root.querySelectorAll<HTMLElement>('[data-area]'))

    notifyResize(root, { height: 192, width: 300 })
    await waitFor(() => expect(root).toHaveAttribute('data-layout', 'base'))

    rendered.rerender(
      <Tiles.Root
        data-testid="current-freeze-root"
        frozen
        layout={FROZEN_IDENTICAL_REPLACEMENT_LAYOUT}
        style={{ height: '12rem' }}
      >
        <Tiles.Tile area="main">Main</Tiles.Tile>
        <Tiles.Tile area="aside">Aside</Tiles.Tile>
      </Tiles.Root>
    )

    expect(root).toHaveAttribute('data-layout', 'base')
    expectImmediateLayout(root, tiles)

    rendered.rerender(
      <Tiles.Root
        data-testid="current-freeze-root"
        frozen={false}
        layout={FROZEN_IDENTICAL_REPLACEMENT_LAYOUT}
        style={{ height: '12rem' }}
      >
        <Tiles.Tile area="main">Main</Tiles.Tile>
        <Tiles.Tile area="aside">Aside</Tiles.Tile>
      </Tiles.Root>
    )

    expect(root).toHaveAttribute('data-layout', '3xs')
    expect(tiles[0]).toHaveStyle({ height: '50%', left: '0%', top: '0%', width: '100%' })
    expect(tiles[1]).toHaveStyle({ height: '50%', left: '0%', top: '50%', width: '100%' })
    expectImmediateLayout(root, tiles)
  })

  it('UC-018 / EX-006 - keeps only the latest valid layout pending and engages it from the current width on release', async () => {
    const rendered = render(
      <Tiles.Root
        data-testid="frozen-layout-change-root"
        frozen
        layout={FROZEN_LAYOUT}
        style={{ height: '12rem' }}
      >
        <Tiles.Tile area="main">Main</Tiles.Tile>
        <Tiles.Tile area="aside">Aside</Tiles.Tile>
      </Tiles.Root>
    )
    const root = screen.getByTestId('frozen-layout-change-root')
    const main = root.querySelector<HTMLElement>('[data-area="main"]') as HTMLElement
    const aside = root.querySelector<HTMLElement>('[data-area="aside"]') as HTMLElement

    notifyResize(root, { height: 192, width: 400 })
    await waitFor(() => expect(root).toHaveAttribute('data-layout', 'sm'))

    rendered.rerender(
      <Tiles.Root
        data-testid="frozen-layout-change-root"
        frozen
        layout={FROZEN_REPLACEMENT_LAYOUT}
        style={{ height: '12rem' }}
      >
        <Tiles.Tile area="main">Main</Tiles.Tile>
        <Tiles.Tile area="aside">Aside</Tiles.Tile>
      </Tiles.Root>
    )

    expect(root).toHaveAttribute('data-layout', 'sm')
    expect(main).toHaveStyle({ height: '100%', left: '0%', top: '0%', width: '50%' })
    expect(aside).toHaveStyle({ height: '100%', left: '50%', top: '0%', width: '50%' })
    expectImmediateLayout(root, [main, aside])

    rendered.rerender(
      <Tiles.Root
        data-testid="frozen-layout-change-root"
        frozen
        layout={FROZEN_LATEST_REPLACEMENT_LAYOUT}
        style={{ height: '12rem' }}
      >
        <Tiles.Tile area="main">Main</Tiles.Tile>
        <Tiles.Tile area="aside">Aside</Tiles.Tile>
      </Tiles.Root>
    )

    expect(root).toHaveAttribute('data-layout', 'sm')
    expect(main).toHaveStyle({ height: '100%', left: '0%', top: '0%', width: '50%' })
    expect(aside).toHaveStyle({ height: '100%', left: '50%', top: '0%', width: '50%' })
    expectImmediateLayout(root, [main, aside])

    rendered.rerender(
      <Tiles.Root
        data-testid="frozen-layout-change-root"
        frozen={false}
        layout={FROZEN_LATEST_REPLACEMENT_LAYOUT}
        style={{ height: '12rem' }}
      >
        <Tiles.Tile area="main">Main</Tiles.Tile>
        <Tiles.Tile area="aside">Aside</Tiles.Tile>
      </Tiles.Root>
    )

    await waitFor(() => {
      expect(root).toHaveAttribute('data-layout', 'sm')
      expect(root).toHaveAttribute('data-animating')
      expect(main).toHaveAttribute('data-moving')
      expect(aside).toHaveAttribute('data-moving')
      expect(main).toHaveStyle({ height: '100%', left: '50%', top: '0%', width: '50%' })
      expect(aside).toHaveStyle({ height: '100%', left: '0%', top: '0%', width: '50%' })
    })

    startGeometryMotion(main)
    startGeometryMotion(aside)
    finishGeometryMotion(main)
    finishGeometryMotion(aside)

    await waitFor(() => expectImmediateLayout(root, [main, aside]))
  })

  it('UC-018 - creates release motion only for rectangles that differ in the latest pending layout', async () => {
    const rendered = render(
      <Tiles.Root
        data-testid="selective-release-root"
        frozen
        layout={STABLE_TILE_LAYOUT}
        style={{ height: '12rem' }}
      >
        <Tiles.Tile area="fixed">Fixed</Tiles.Tile>
        <Tiles.Tile area="upper">Upper</Tiles.Tile>
        <Tiles.Tile area="lower">Lower</Tiles.Tile>
      </Tiles.Root>
    )
    const root = screen.getByTestId('selective-release-root')
    const fixed = root.querySelector<HTMLElement>('[data-area="fixed"]') as HTMLElement
    const upper = root.querySelector<HTMLElement>('[data-area="upper"]') as HTMLElement
    const lower = root.querySelector<HTMLElement>('[data-area="lower"]') as HTMLElement

    notifyResize(root, { height: 192, width: 300 })
    await waitFor(() => expect(root).toHaveAttribute('data-layout', 'base'))
    notifyResize(root, { height: 192, width: 400 })

    rendered.rerender(
      <Tiles.Root
        data-testid="selective-release-root"
        frozen
        layout={FROZEN_STABLE_REPLACEMENT_LAYOUT}
        style={{ height: '12rem' }}
      >
        <Tiles.Tile area="fixed">Fixed</Tiles.Tile>
        <Tiles.Tile area="upper">Upper</Tiles.Tile>
        <Tiles.Tile area="lower">Lower</Tiles.Tile>
      </Tiles.Root>
    )

    expect(root).toHaveAttribute('data-layout', 'base')
    expectImmediateLayout(root, [fixed, upper, lower])

    rendered.rerender(
      <Tiles.Root
        data-testid="selective-release-root"
        frozen={false}
        layout={FROZEN_STABLE_REPLACEMENT_LAYOUT}
        style={{ height: '12rem' }}
      >
        <Tiles.Tile area="fixed">Fixed</Tiles.Tile>
        <Tiles.Tile area="upper">Upper</Tiles.Tile>
        <Tiles.Tile area="lower">Lower</Tiles.Tile>
      </Tiles.Root>
    )

    await waitFor(() => {
      expect(root).toHaveAttribute('data-layout', 'sm')
      expect(root).toHaveAttribute('data-animating')
      expect(fixed).not.toHaveAttribute('data-moving')
      expect(upper).toHaveAttribute('data-moving')
      expect(lower).toHaveAttribute('data-moving')
    })

    startGeometryMotion(upper)
    startGeometryMotion(lower)
    finishGeometryMotion(upper)
    finishGeometryMotion(lower)

    await waitFor(() => expectImmediateLayout(root, [fixed, upper, lower]))
  })

  it('UC-002 / UC-018 / EX-006 - validates every frozen layout replacement immediately', async () => {
    const rendered = render(
      <Tiles.Root
        data-testid="invalid-frozen-layout-root"
        frozen
        layout={FROZEN_LAYOUT}
        style={{ height: '12rem' }}
      >
        <Tiles.Tile area="main">Main</Tiles.Tile>
        <Tiles.Tile area="aside">Aside</Tiles.Tile>
      </Tiles.Root>
    )
    const root = screen.getByTestId('invalid-frozen-layout-root')

    notifyResize(root, { height: 192, width: 300 })
    await waitFor(() => expect(root).toHaveAttribute('data-layout', 'base'))
    vi.spyOn(console, 'error').mockImplementation(() => undefined)

    expect(() =>
      rendered.rerender(
        <Tiles.Root
          data-testid="invalid-frozen-layout-root"
          frozen
          layout={INVALID_FROZEN_REPLACEMENT_LAYOUT}
          style={{ height: '12rem' }}
        >
          <Tiles.Tile area="main">Main</Tiles.Tile>
          <Tiles.Tile area="aside">Aside</Tiles.Tile>
        </Tiles.Root>
      )
    ).toThrow(/(?=.*sm)(?=.*main)/i)
  })

  it('UC-002 / UC-018 / EX-006 / QA-001 - exposes an invalid frozen replacement action and visible diagnostic in Storybook', async () => {
    const Story = Ex006FrozenResponsiveReflow.render

    expect(Story).toBeTypeOf('function')

    if (!Story) {
      throw new Error('Expected EX-006 to provide an inspectable render function')
    }

    vi.spyOn(console, 'error').mockImplementation(() => undefined)

    const rendered = render(<Story />)
    const main = rendered.container.querySelector<HTMLElement>('[data-area="main"]')

    expect(main).toBeInTheDocument()

    if (main?.parentElement === null || main === null) {
      throw new Error('Expected EX-006 to render main inside its Tiles Root')
    }

    const root = main.parentElement

    notifyResize(root, { height: 256, width: 300 })
    await waitFor(() => expect(root).toHaveAttribute('data-layout', 'base'))
    expect(screen.getByText(/Frozen ·/i)).toBeVisible()

    fireEvent.click(screen.getByRole('button', { name: /invalid layout replacement/i }))

    await waitFor(() => {
      expect(screen.getByText(/(?=.*Tiles)(?=.*sm)(?=.*main)/i)).toBeVisible()
    })
  })

  it('UC-007 / UC-018 / EX-006 / QA-001 - exposes identical-rectangle provenance release and idle motion probes in Storybook', async () => {
    const Story = Ex006FrozenResponsiveReflow.render

    expect(Story).toBeTypeOf('function')

    if (!Story) {
      throw new Error('Expected EX-006 to provide an inspectable render function')
    }

    const rendered = render(<Story />)
    const main = rendered.container.querySelector<HTMLElement>('[data-area="main"]')
    const aside = rendered.container.querySelector<HTMLElement>('[data-area="aside"]')

    expect(main).toBeInTheDocument()
    expect(aside).toBeInTheDocument()

    if (main?.parentElement === null || main === null || aside === null) {
      throw new Error('Expected EX-006 to render main and aside inside its Tiles Root')
    }

    const root = main.parentElement

    notifyResize(root, { height: 256, width: 300 })
    await waitFor(() => expect(root).toHaveAttribute('data-layout', 'base'))
    expect(main).toHaveStyle({ height: '50%', left: '0%', top: '0%', width: '100%' })
    expect(aside).toHaveStyle({ height: '50%', left: '0%', top: '50%', width: '100%' })
    expect(screen.getByText(/layout:\s*base/i)).toBeVisible()

    fireEvent.click(screen.getByRole('button', { name: /identical rectangles/i }))

    expect(root).toHaveAttribute('data-layout', 'base')
    expectImmediateLayout(root, [main, aside])

    fireEvent.click(screen.getByRole('button', { name: 'Resume responsive reflow' }))

    await waitFor(() => {
      expect(root).toHaveAttribute('data-layout', '3xs')
      expectImmediateLayout(root, [main, aside])
      expect(main).toHaveStyle({ height: '50%', left: '0%', top: '0%', width: '100%' })
      expect(aside).toHaveStyle({ height: '50%', left: '0%', top: '50%', width: '100%' })
      expect(screen.getByText(/layout:\s*3xs/i)).toBeVisible()
      expect(screen.getByText(/root:\s*idle/i)).toBeVisible()
      expect(screen.getByText(/main(?: tile)?:\s*settled/i)).toBeVisible()
      expect(screen.getByText(/aside(?: tile)?:\s*settled/i)).toBeVisible()
    })
  })

  it('UC-007 / UC-019 / EX-008 / QA-001 - exposes resizable responsive motion and existing overflow and remount probes in Storybook', async () => {
    const Story = Ex008ScrollableTileSurfaceAndRemountBoundary.render

    expect(Story).toBeTypeOf('function')

    if (!Story) {
      throw new Error('Expected EX-008 to provide an inspectable render function')
    }

    scrollAreaViewportMetrics = {
      clientHeight: 160,
      clientWidth: 320,
      scrollHeight: 640,
      scrollWidth: 768
    }

    const rendered = render(<Story />)
    const history = rendered.container.querySelector<HTMLElement>('[data-area="history"]')
    const summary = rendered.container.querySelector<HTMLElement>('[data-area="summary"]')

    expect(history).toBeInTheDocument()
    expect(summary).toBeInTheDocument()

    if (history?.parentElement === null || history === null || summary === null) {
      throw new Error('Expected EX-008 to render history and summary inside its Tiles Root')
    }

    const root = history.parentElement
    const allocation = root.parentElement

    await waitFor(() => {
      expect(history).toHaveAttribute('data-has-overflow-x')
      expect(history).toHaveAttribute('data-has-overflow-y')
      expect(screen.getByText(/horizontal overflow/i)).toBeVisible()
      expect(screen.getByText(/vertical overflow/i)).toBeVisible()
    })

    expect(allocation).toHaveClass(
      'w-[42rem]',
      'max-w-full',
      'min-w-64',
      'resize-x',
      'overflow-auto'
    )
    expect(root).toHaveClass('h-full', 'w-full')
    expect(screen.getByRole('button', { name: 'Use normal Tile' })).toBeVisible()
    expect(screen.getByRole('status')).toHaveTextContent('ScrollableTile mounted')

    notifyResize(root, { height: 256, width: 320 })

    await waitFor(() => {
      expect(root).toHaveAttribute('data-layout', 'base')
      expect(screen.getByText(/layout:\s*base/i)).toBeVisible()
      expect(screen.getByText(/root:\s*idle/i)).toBeVisible()
      expect(screen.getByText(/history(?: tile)?:\s*settled/i)).toBeVisible()
      expect(screen.getByText(/summary(?: tile)?:\s*settled/i)).toBeVisible()
    })

    notifyResize(root, { height: 256, width: 500 })
    startGeometryMotion(history)
    startGeometryMotion(summary)

    await waitFor(() => {
      expect(root).toHaveAttribute('data-layout', 'sm')
      expect(root).toHaveAttribute('data-animating')
      expect(history).toHaveAttribute('data-moving')
      expect(summary).toHaveAttribute('data-moving')
      expect(screen.getByText(/layout:\s*sm/i)).toBeVisible()
      expect(screen.getByText(/root:\s*animating/i)).toBeVisible()
      expect(screen.getByText(/history(?: tile)?:\s*moving/i)).toBeVisible()
      expect(screen.getByText(/summary(?: tile)?:\s*moving/i)).toBeVisible()
    })

    finishGeometryMotion(history)
    finishGeometryMotion(summary)
  })

  it('UC-016 - freezes and resumes parent and nested Roots independently', async () => {
    const rendered = render(
      <Tiles.Root
        data-testid="independent-outer-root"
        frozen
        layout={OUTER_LAYOUT}
        style={{ height: '24rem' }}
      >
        <Tiles.Tile area="main">
          <Tiles.Root
            data-testid="independent-inner-root"
            frozen={false}
            layout={INNER_LAYOUT}
            style={{ height: '100%' }}
          >
            <Tiles.Tile area="summary">Summary</Tiles.Tile>
            <Tiles.Tile area="details">Details</Tiles.Tile>
          </Tiles.Root>
        </Tiles.Tile>
        <Tiles.Tile area="aside">Aside</Tiles.Tile>
      </Tiles.Root>
    )
    const outerRoot = screen.getByTestId('independent-outer-root')
    const innerRoot = screen.getByTestId('independent-inner-root')
    const outerTiles = Array.from(outerRoot.querySelectorAll<HTMLElement>(':scope > [data-area]'))
    const innerTiles = Array.from(innerRoot.querySelectorAll<HTMLElement>('[data-area]'))

    notifyResize(outerRoot, { height: 384, width: 300 })
    notifyResize(innerRoot, { height: 192, width: 300 })
    await waitFor(() => {
      expect(outerRoot).toHaveAttribute('data-layout', 'base')
      expect(innerRoot).toHaveAttribute('data-layout', 'base')
    })

    notifyResize(outerRoot, { height: 384, width: 520 })
    notifyResize(innerRoot, { height: 192, width: 400 })

    await waitFor(() => {
      expect(outerRoot).toHaveAttribute('data-layout', 'base')
      expect(innerRoot).toHaveAttribute('data-layout', 'sm')
      expect(innerRoot).toHaveAttribute('data-animating')
    })
    startGeometryMotion(innerTiles[0] as HTMLElement)
    startGeometryMotion(innerTiles[1] as HTMLElement)
    finishGeometryMotion(innerTiles[0] as HTMLElement)
    finishGeometryMotion(innerTiles[1] as HTMLElement)
    await waitFor(() => expectImmediateLayout(innerRoot, innerTiles))

    rendered.rerender(
      <Tiles.Root
        data-testid="independent-outer-root"
        frozen={false}
        layout={OUTER_LAYOUT}
        style={{ height: '24rem' }}
      >
        <Tiles.Tile area="main">
          <Tiles.Root
            data-testid="independent-inner-root"
            frozen
            layout={INNER_LAYOUT}
            style={{ height: '100%' }}
          >
            <Tiles.Tile area="summary">Summary</Tiles.Tile>
            <Tiles.Tile area="details">Details</Tiles.Tile>
          </Tiles.Root>
        </Tiles.Tile>
        <Tiles.Tile area="aside">Aside</Tiles.Tile>
      </Tiles.Root>
    )

    await waitFor(() => {
      expect(outerRoot).toHaveAttribute('data-layout', 'lg')
      expect(outerRoot).toHaveAttribute('data-animating')
    })
    startGeometryMotion(outerTiles[0] as HTMLElement)
    startGeometryMotion(outerTiles[1] as HTMLElement)
    finishGeometryMotion(outerTiles[0] as HTMLElement)
    finishGeometryMotion(outerTiles[1] as HTMLElement)
    await waitFor(() => expectImmediateLayout(outerRoot, outerTiles))

    notifyResize(innerRoot, { height: 192, width: 300 })

    expect(innerRoot).toHaveAttribute('data-layout', 'sm')
    expectImmediateLayout(innerRoot, innerTiles)
  })

  it('UC-004 / UC-007 / EX-002 - lets nested Roots reflow from local width and own only direct Tile motion', async () => {
    render(
      <Tiles.Root layout={OUTER_LAYOUT} data-testid="outer-root" style={{ height: '32rem' }}>
        <Tiles.Tile area="main">
          <Tiles.Root layout={INNER_LAYOUT} data-testid="inner-root" style={{ height: '100%' }}>
            <Tiles.Tile area="summary">Summary</Tiles.Tile>
            <Tiles.Tile area="details">Details</Tiles.Tile>
          </Tiles.Root>
        </Tiles.Tile>
        <Tiles.Tile area="aside">Aside</Tiles.Tile>
      </Tiles.Root>
    )

    const outerRoot = screen.getByTestId('outer-root')
    const innerRoot = screen.getByTestId('inner-root')
    const outerTiles = Array.from(outerRoot.querySelectorAll<HTMLElement>(':scope > [data-area]'))
    const innerTiles = Array.from(innerRoot.querySelectorAll<HTMLElement>('[data-area]'))

    notifyResize(outerRoot, { height: 512, width: 300 })
    notifyResize(innerRoot, { height: 256, width: 300 })

    await waitFor(() => {
      expect(outerRoot).toHaveAttribute('data-layout', 'base')
      expect(innerRoot).toHaveAttribute('data-layout', 'base')
    })
    expectImmediateLayout(outerRoot, outerTiles)
    expectImmediateLayout(innerRoot, innerTiles)

    notifyResize(innerRoot, { height: 256, width: 400 })

    for (const tile of innerTiles) {
      startGeometryMotion(tile)
    }

    await waitFor(() => {
      expect(innerRoot).toHaveAttribute('data-layout', 'sm')
      expect(innerRoot).toHaveAttribute('data-animating')
    })
    expect(outerRoot).not.toHaveAttribute('data-animating')

    for (const tile of innerTiles) {
      finishGeometryMotion(tile)
    }

    await waitFor(() => expect(innerRoot).not.toHaveAttribute('data-animating'))

    notifyResize(outerRoot, { height: 512, width: 500 })
    notifyResize(innerRoot, { height: 256, width: 500 })
    notifyResize(outerRoot, { height: 512, width: 520 })

    for (const tile of outerTiles) {
      startGeometryMotion(tile)
    }

    await waitFor(() => {
      expect(outerRoot).toHaveAttribute('data-layout', 'lg')
      expect(outerRoot).toHaveAttribute('data-animating')
    })

    notifyResize(innerRoot, { height: 256, width: 383 })

    for (const tile of innerTiles) {
      startGeometryMotion(tile)
    }

    await waitFor(() => {
      expect(innerRoot).toHaveAttribute('data-layout', 'base')
      expect(innerRoot).toHaveAttribute('data-animating')
      expect(outerRoot).toHaveAttribute('data-animating')
    })

    for (const tile of outerTiles) {
      finishGeometryMotion(tile)
    }

    await waitFor(() => {
      expect(outerRoot).not.toHaveAttribute('data-animating')
      expect(innerRoot).toHaveAttribute('data-animating')
    })

    for (const tile of innerTiles) {
      finishGeometryMotion(tile)
    }

    await waitFor(() => expect(innerRoot).not.toHaveAttribute('data-animating'))
  })

  it('UC-005 / UC-006 / UC-007 / UC-019 - gives ScrollableTile the same mounted geometry-motion lifecycle as Tile', async () => {
    render(
      <Tiles.Root
        data-testid="scrollable-motion-root"
        layout={SCROLLABLE_LAYOUT}
        style={{ height: '16rem' }}
      >
        <Tiles.ScrollableTile area="history">History</Tiles.ScrollableTile>
        <Tiles.Tile area="summary">Summary</Tiles.Tile>
      </Tiles.Root>
    )

    const root = screen.getByTestId('scrollable-motion-root')
    const scrollableTile = root.querySelector<HTMLElement>('[data-area="history"]') as HTMLElement
    const tile = root.querySelector<HTMLElement>('[data-area="summary"]') as HTMLElement

    notifyResize(root, { height: 256, width: 320 })
    await waitFor(() => expect(root).toHaveAttribute('data-layout', 'base'))
    expectImmediateLayout(root, [scrollableTile, tile])

    notifyResize(root, { height: 256, width: 400 })
    startGeometryMotion(scrollableTile)
    startGeometryMotion(tile)

    await waitFor(() => {
      expect(root).toHaveAttribute('data-layout', 'sm')
      expect(root).toHaveAttribute('data-animating')
      expect(scrollableTile).toHaveAttribute('data-moving')
      expect(tile).toHaveAttribute('data-moving')
    })

    expect(root.querySelector('[data-area="history"]')).toBe(scrollableTile)
    finishGeometryMotion(scrollableTile)
    finishGeometryMotion(tile)

    await waitFor(() => expectImmediateLayout(root, [scrollableTile, tile]))
  })

  it('UC-005 / UC-006 / UC-007 / EX-001 - retargets mounted real boxes while keeping motion state on the newest matrix', async () => {
    render(
      <Tiles.Root layout={DASHBOARD_LAYOUT} data-testid="motion-root" style={{ height: '36rem' }}>
        <Tiles.Tile area="main">Main</Tiles.Tile>
        <Tiles.Tile area="aside">Aside</Tiles.Tile>
        <Tiles.Tile area="secondary">Secondary</Tiles.Tile>
        <Tiles.Tile area="footer">Footer</Tiles.Tile>
      </Tiles.Root>
    )

    const root = screen.getByTestId('motion-root')
    const tiles = Array.from(root.querySelectorAll<HTMLElement>('[data-area]'))
    const mountedTiles = new Map(tiles.map((tile) => [tile.dataset.area, tile]))

    notifyResize(root, { height: 576, width: 320 })
    await waitFor(() => expect(root).toHaveAttribute('data-layout', 'base'))
    expectImmediateLayout(root, tiles)

    notifyResize(root, { height: 576, width: 400 })

    for (const tile of tiles) {
      startGeometryMotion(tile)
    }

    await waitFor(() => {
      expect(root).toHaveAttribute('data-layout', 'sm')
      expect(root).toHaveAttribute('data-animating')
      expect(tiles.every((tile) => tile.hasAttribute('data-moving'))).toBe(true)
    })

    for (const [index, tile] of tiles.entries()) {
      setElementBox(tile, {
        height: 100 + index * 10,
        left: index * 30,
        top: index * 20,
        width: 180 - index * 10
      })
    }

    notifyResize(root, { height: 576, width: 600 })

    for (const tile of tiles) {
      startGeometryMotion(tile)
    }

    await waitFor(() => {
      expect(root).toHaveAttribute('data-layout', 'lg')
      expect(root).toHaveAttribute('data-animating')
      expect(tiles.every((tile) => tile.hasAttribute('data-moving'))).toBe(true)
    })

    for (const tile of tiles) {
      expect(root.querySelector(`[data-area="${tile.dataset.area}"]`)).toBe(
        mountedTiles.get(tile.dataset.area)
      )
      finishGeometryMotion(tile)
    }

    await waitFor(() => expectImmediateLayout(root, tiles))
  })

  it('UC-006 / UC-007 / CR-006 - accepts an original transition end when a retarget keeps that property target', async () => {
    render(
      <Tiles.Root
        data-testid="partial-retarget-root"
        layout={PARTIAL_RETARGET_LAYOUT}
        style={{ height: '20rem' }}
      >
        <Tiles.Tile area="main">Main</Tiles.Tile>
        <Tiles.Tile area="aside">Aside</Tiles.Tile>
      </Tiles.Root>
    )

    const root = screen.getByTestId('partial-retarget-root')
    const main = root.querySelector<HTMLElement>('[data-area="main"]') as HTMLElement
    const aside = root.querySelector<HTMLElement>('[data-area="aside"]') as HTMLElement

    notifyResize(root, { height: 320, width: 300 })
    await waitFor(() => expect(root).toHaveAttribute('data-layout', 'base'))

    notifyResize(root, { height: 320, width: 400 })
    fireEvent.transitionRun(main, { propertyName: 'height' })
    fireEvent.transitionRun(main, { propertyName: 'width' })

    for (const propertyName of ['left', 'top', 'width', 'height']) {
      fireEvent.transitionRun(aside, { propertyName })
    }

    await waitFor(() => {
      expect(root).toHaveAttribute('data-layout', 'sm')
      expect(root).toHaveAttribute('data-animating')
      expect(main).toHaveAttribute('data-moving')
      expect(aside).toHaveAttribute('data-moving')
    })

    fireEvent.transitionEnd(main, { propertyName: 'height' })
    finishGeometryMotion(aside)

    await waitFor(() => {
      expect(root).toHaveAttribute('data-animating')
      expect(main).toHaveAttribute('data-moving')
      expect(aside).not.toHaveAttribute('data-moving')
    })

    notifyResize(root, { height: 320, width: 520 })
    fireEvent.transitionRun(main, { propertyName: 'height' })
    fireEvent.transitionRun(aside, { propertyName: 'height' })
    fireEvent.transitionRun(aside, { propertyName: 'top' })

    await waitFor(() => {
      expect(root).toHaveAttribute('data-layout', 'lg')
      expect(root).toHaveAttribute('data-animating')
      expect(main).toHaveAttribute('data-moving')
      expect(aside).toHaveAttribute('data-moving')
    })

    fireEvent.transitionEnd(main, { propertyName: 'height' })
    fireEvent.transitionEnd(aside, { propertyName: 'height' })
    fireEvent.transitionEnd(aside, { propertyName: 'top' })

    await waitFor(() => {
      expect(root).toHaveAttribute('data-animating')
      expect(main).toHaveAttribute('data-moving')
      expect(aside).not.toHaveAttribute('data-moving')
    })

    fireEvent.transitionEnd(main, { propertyName: 'width' })

    await waitFor(() => expectImmediateLayout(root, [main, aside]))
  })

  it('UC-005 / UC-006 / UC-007 - does not mark a Tile whose target rectangle is unchanged', async () => {
    render(
      <Tiles.Root layout={STABLE_TILE_LAYOUT} data-testid="stable-root" style={{ height: '20rem' }}>
        <Tiles.Tile area="fixed">Fixed</Tiles.Tile>
        <Tiles.Tile area="upper">Upper</Tiles.Tile>
        <Tiles.Tile area="lower">Lower</Tiles.Tile>
      </Tiles.Root>
    )

    const root = screen.getByTestId('stable-root')
    const fixed = root.querySelector<HTMLElement>('[data-area="fixed"]') as HTMLElement
    const upper = root.querySelector<HTMLElement>('[data-area="upper"]') as HTMLElement
    const lower = root.querySelector<HTMLElement>('[data-area="lower"]') as HTMLElement

    notifyResize(root, { height: 320, width: 300 })
    await waitFor(() => expect(root).toHaveAttribute('data-layout', 'base'))

    notifyResize(root, { height: 320, width: 400 })
    startGeometryMotion(upper)
    startGeometryMotion(lower)

    await waitFor(() => {
      expect(root).toHaveAttribute('data-layout', 'sm')
      expect(root).toHaveAttribute('data-animating')
      expect(fixed).not.toHaveAttribute('data-moving')
      expect(upper).toHaveAttribute('data-moving')
      expect(lower).toHaveAttribute('data-moving')
    })
  })

  it('UC-006 / UC-007 / CR-006 - settles Tile and Root lifecycle attributes when active geometry transitions are canceled', async () => {
    render(
      <Tiles.Root
        layout={BREAKPOINT_LAYOUT}
        data-testid="canceled-motion-root"
        style={{ height: '20rem' }}
      >
        <Tiles.Tile area="main">Main</Tiles.Tile>
        <Tiles.Tile area="aside">Aside</Tiles.Tile>
      </Tiles.Root>
    )

    const root = screen.getByTestId('canceled-motion-root')
    const tiles = Array.from(root.querySelectorAll<HTMLElement>('[data-area]'))

    notifyResize(root, { height: 320, width: 300 })
    await waitFor(() => expect(root).toHaveAttribute('data-layout', 'base'))

    notifyResize(root, { height: 320, width: 400 })

    for (const tile of tiles) {
      startGeometryMotion(tile)
    }

    await waitFor(() => {
      expect(root).toHaveAttribute('data-layout', 'xs')
      expect(root).toHaveAttribute('data-animating')
      expect(tiles.every((tile) => tile.hasAttribute('data-moving'))).toBe(true)
    })

    for (const tile of tiles) {
      cancelGeometryMotion(tile)
    }

    await waitFor(() => expectImmediateLayout(root, tiles))
  })

  it('UC-006 / UC-007 / EX-001 - applies reduced-motion matrix changes immediately despite a configured duration', async () => {
    prefersReducedMotion = true

    const style = {
      '--tiles-layout-duration': '800ms',
      height: '20rem'
    } as TilesCssProperties

    render(
      <Tiles.Root layout={BREAKPOINT_LAYOUT} data-testid="reduced-root" style={style}>
        <Tiles.Tile area="main">Main</Tiles.Tile>
        <Tiles.Tile area="aside">Aside</Tiles.Tile>
      </Tiles.Root>
    )

    const root = screen.getByTestId('reduced-root')
    const tiles = Array.from(root.querySelectorAll<HTMLElement>('[data-area]'))

    notifyResize(root, { height: 320, width: 300 })
    await waitFor(() => expect(root).toHaveAttribute('data-layout', 'base'))
    notifyResize(root, { height: 320, width: 400 })

    await waitFor(() => expect(root).toHaveAttribute('data-layout', 'xs'))
    expect(root.style.getPropertyValue('--tiles-layout-duration')).toBe('800ms')
    expectImmediateLayout(root, tiles)
  })

  it('UC-008 / UC-013 / EX-004 - preserves DOM order, focus, and local state across visual reflow', async () => {
    render(<SemanticStatefulTiles />)

    const root = screen.getByTestId('semantic-root')
    const counterTile = screen.getByTestId('counter-tile')
    const actionTile = screen.getByTestId('action-tile')
    const counter = screen.getByRole('button', { name: 'Count 0' })

    notifyResize(root, { height: 192, width: 300 })
    await waitFor(() => expect(root).toHaveAttribute('data-layout', 'base'))

    fireEvent.click(counter)
    const incrementedCounter = screen.getByRole('button', { name: 'Count 1' })

    incrementedCounter.focus()
    expect(incrementedCounter).toHaveFocus()

    notifyResize(root, { height: 192, width: 400 })

    await waitFor(() => expect(root).toHaveAttribute('data-layout', 'sm'))
    expect(screen.getByTestId('counter-tile')).toBe(counterTile)
    expect(screen.getByTestId('action-tile')).toBe(actionTile)
    expect(Array.from(root.querySelectorAll<HTMLElement>(':scope > [data-area]'))).toEqual([
      counterTile,
      actionTile
    ])
    expect(screen.getByRole('button', { name: 'Count 1' })).toBe(incrementedCounter)
    expect(incrementedCounter).toHaveFocus()
    expect(root).not.toHaveAttribute('role', 'grid')
    expect(counterTile).not.toHaveAttribute('role', 'gridcell')
    expect(actionTile).not.toHaveAttribute('role', 'gridcell')
  })

  it('UC-009 / UC-017 - defaults the complete Root border network to Tailwind width 1', async () => {
    render(
      <Tiles.Root
        data-testid="default-border-root"
        layout={BORDER_LAYOUT}
        style={{ height: '8rem' }}
      >
        <Tiles.Tile area="left" data-testid="default-border-left">
          Left
        </Tiles.Tile>
        <Tiles.Tile area="right" data-testid="default-border-right">
          Right
        </Tiles.Tile>
      </Tiles.Root>
    )
    const root = screen.getByTestId('default-border-root')
    const left = screen.getByTestId('default-border-left')
    const right = screen.getByTestId('default-border-right')

    notifyResize(root, { height: 128, width: 320 })
    await waitFor(() => expect(root).toHaveAttribute('data-layout', 'base'))

    expect(root).toHaveClass('border-1', 'border-border')
    expect(left).toHaveClass('border-e-1', 'border-border')
    expect(right).not.toHaveClass('border-e-1')
  })

  it.each(BORDER_WIDTHS)(
    'UC-017 / EX-007 - applies the Tailwind $border px width to the complete settled network',
    async (border) => {
      render(
        <Tiles.Root
          border={border}
          data-testid="configured-border-root"
          layout={BORDER_LAYOUT}
          style={{ height: '8rem' }}
        >
          <Tiles.Tile area="left" data-testid="configured-border-left">
            Left
          </Tiles.Tile>
          <Tiles.Tile area="right" data-testid="configured-border-right">
            Right
          </Tiles.Tile>
        </Tiles.Root>
      )
      const root = screen.getByTestId('configured-border-root')
      const left = screen.getByTestId('configured-border-left')
      const right = screen.getByTestId('configured-border-right')

      notifyResize(root, { height: 128, width: 320 })
      await waitFor(() => expect(root).toHaveAttribute('data-layout', 'base'))

      expect(root).toHaveClass(`border-${border}`, 'border-border')
      expect(left).toHaveClass(`border-e-${border}`, 'border-border')
      expect(right).not.toHaveClass(`border-e-${border}`)
    }
  )

  it('UC-009 / UC-017 / EX-007 - keeps a nested Root border network independent while suppressing its perimeter', async () => {
    render(
      <Tiles.Root
        border={2}
        data-testid="parent-border-root"
        layout={NESTED_BORDER_LAYOUT}
        style={{ height: '10rem' }}
      >
        <Tiles.Tile area="nested" data-testid="parent-nested-tile">
          <Tiles.Root
            border={4}
            data-testid="nested-border-root"
            layout={INNER_BORDER_LAYOUT}
            style={{ height: '100%' }}
          >
            <Tiles.Tile area="top" data-testid="nested-border-top">
              Top
            </Tiles.Tile>
            <Tiles.Tile area="bottom" data-testid="nested-border-bottom">
              Bottom
            </Tiles.Tile>
          </Tiles.Root>
        </Tiles.Tile>
        <Tiles.Tile area="aside">Aside</Tiles.Tile>
      </Tiles.Root>
    )
    const parentRoot = screen.getByTestId('parent-border-root')
    const parentNestedTile = screen.getByTestId('parent-nested-tile')
    const nestedRoot = screen.getByTestId('nested-border-root')
    const nestedTop = screen.getByTestId('nested-border-top')
    const nestedBottom = screen.getByTestId('nested-border-bottom')

    notifyResize(parentRoot, { height: 160, width: 640 })
    notifyResize(nestedRoot, { height: 160, width: 320 })
    await waitFor(() => {
      expect(parentRoot).toHaveAttribute('data-layout', 'base')
      expect(nestedRoot).toHaveAttribute('data-layout', 'base')
    })

    expect(parentRoot).toHaveClass('border-2', 'border-border')
    expect(parentNestedTile).toHaveClass('border-e-2', 'border-border')
    expect(nestedRoot).toHaveClass('border-0', 'border-border')
    expect(nestedRoot).not.toHaveClass('border-4')
    expect(nestedTop).toHaveClass('border-b-4', 'border-border')
    expect(nestedBottom).not.toHaveClass('border-b-4')
  })

  it('UC-017 - does not add runtime validation outside the public border type union', () => {
    expect(() =>
      render(
        <Tiles.Root
          border={3 as 0}
          data-testid="unsupported-border-root"
          layout={SINGLE_TILE_LAYOUT}
          style={{ height: '8rem' }}
        >
          <Tiles.Tile area="content">Content</Tiles.Tile>
        </Tiles.Root>
      )
    ).not.toThrow()
  })

  it('UC-009 / EX-002 / EX-003 - owns one settled perimeter and one shared separator while suppressing a nested Root perimeter', async () => {
    render(
      <Tiles.Root
        layout={SEPARATOR_LAYOUT}
        data-testid="separator-root"
        style={{ height: '20rem' }}
      >
        <Tiles.Tile area="top-left" data-testid="top-left-tile">
          Top left
        </Tiles.Tile>
        <Tiles.Tile area="top-right" data-testid="top-right-tile" theme="inverse">
          Top right
        </Tiles.Tile>
        <Tiles.Tile area="nested" data-testid="nested-tile">
          <Tiles.Root
            layout={INNER_SEPARATOR_LAYOUT}
            data-testid="nested-separator-root"
            style={{ height: '100%' }}
          >
            <Tiles.Tile area="inner-left" data-testid="inner-left-tile">
              Inner left
            </Tiles.Tile>
            <Tiles.Tile area="inner-right" data-testid="inner-right-tile">
              Inner right
            </Tiles.Tile>
          </Tiles.Root>
        </Tiles.Tile>
        <Tiles.Tile area="bottom-right" data-testid="bottom-right-tile">
          Bottom right
        </Tiles.Tile>
      </Tiles.Root>
    )

    const root = screen.getByTestId('separator-root')
    const nestedRoot = screen.getByTestId('nested-separator-root')
    const topLeft = screen.getByTestId('top-left-tile')
    const topRight = screen.getByTestId('top-right-tile')
    const nested = screen.getByTestId('nested-tile')
    const bottomRight = screen.getByTestId('bottom-right-tile')
    const innerLeft = screen.getByTestId('inner-left-tile')
    const innerRight = screen.getByTestId('inner-right-tile')

    notifyResize(root, { height: 320, width: 640 })
    notifyResize(nestedRoot, { height: 160, width: 320 })

    await waitFor(() => {
      expect(root).toHaveAttribute('data-layout', 'base')
      expect(nestedRoot).toHaveAttribute('data-layout', 'base')
    })

    expect(hasFullOnePixelPerimeter(root)).toBe(true)
    expect(
      !hasFullOnePixelPerimeter(nestedRoot) ||
        /(?:^|\s)(?:border-0|border-none)(?:\s|$)|:border-0/.test(getStylingSource(nestedRoot))
    ).toBe(true)

    for (const tile of [topLeft, topRight, nested, bottomRight, innerLeft, innerRight]) {
      expect(hasFullOnePixelPerimeter(tile)).toBe(false)
      expect(getStylingSource(tile)).not.toMatch(/rounded-/)
    }

    expectSingleSharedSeparator(topLeft, 'inline-end', topRight, 'inline-start')
    expectSingleSharedSeparator(topLeft, 'block-end', nested, 'block-start')
    expectSingleSharedSeparator(topRight, 'block-end', bottomRight, 'block-start')
    expectSingleSharedSeparator(nested, 'inline-end', bottomRight, 'inline-start')
    expectSingleSharedSeparator(innerLeft, 'inline-end', innerRight, 'inline-start')
  })

  it('UC-010 / EX-003 - reactively inherits, inverts, and double-inverts semantic theme tokens without remounting content', async () => {
    const rendered = render(<ThemeProbe outsideTheme="light" />)

    const root = screen.getByTestId('theme-root')
    const plain = screen.getByTestId('plain-tile')
    const inverse = screen.getByTestId('inverse-tile')
    const doubleRoot = screen.getByTestId('double-root')
    const doubleContent = screen.getByTestId('double-content')
    const inverseStripes = getDecorativeStripes(inverse)[0] as HTMLElement

    await waitFor(() => {
      expect(getThemeToken(root, '--background')).toBe('light-background')
      expect(getThemeToken(plain, '--background')).toBe('light-background')
      expect(getThemeToken(inverse, '--background')).toBe('dark-background')
      expect(getThemeToken(inverse, '--foreground')).toBe('dark-foreground')
      expect(getThemeToken(doubleRoot, '--background')).toBe('light-background')
      expect(getThemeToken(doubleContent, '--background')).toBe('light-background')
      expect(getThemeToken(inverseStripes, '--background')).toBe('dark-background')
    })

    fireEvent.click(screen.getByRole('button', { name: 'Count 0' }))
    const counter = screen.getByRole('button', { name: 'Count 1' })

    rendered.rerender(<ThemeProbe outsideTheme="dark" />)

    await waitFor(() => {
      expect(getThemeToken(root, '--background')).toBe('dark-background')
      expect(getThemeToken(plain, '--background')).toBe('dark-background')
      expect(getThemeToken(inverse, '--background')).toBe('light-background')
      expect(getThemeToken(doubleRoot, '--background')).toBe('dark-background')
      expect(getThemeToken(doubleContent, '--background')).toBe('dark-background')
      expect(getThemeToken(inverseStripes, '--background')).toBe('light-background')
    })
    expect(screen.getByRole('button', { name: 'Count 1' })).toBe(counter)

    rendered.rerender(<ThemeProbe outsideTheme="light" tileTheme="inherit" />)

    await waitFor(() => {
      expect(getThemeToken(inverse, '--background')).toBe('light-background')
      expect(getThemeToken(inverse, '--foreground')).toBe('light-foreground')
    })
    expect(screen.getByRole('button', { name: 'Count 1' })).toBe(counter)
  })

  it('UC-011 / EX-003 - omits or configures a full-surface decorative Stripes layer while keeping children accessible', () => {
    render(
      <Tiles.Root layout={THEME_LAYOUT} data-testid="stripes-root" style={{ height: '16rem' }}>
        <Tiles.Tile area="plain" data-testid="undefined-stripes">
          <button type="button">Plain action</button>
        </Tiles.Tile>
        <Tiles.Tile area="inverse" data-testid="false-stripes" stripesProps={false}>
          False
        </Tiles.Tile>
        <Tiles.Tile area="double" data-testid="default-stripes" stripesProps>
          <button type="button">Default action</button>
        </Tiles.Tile>
        <Tiles.Tile
          area="configured"
          data-testid="configured-stripes"
          stripesProps={{
            angle: '45deg',
            color: 'currentColor',
            gap: '6px',
            width: '2px'
          }}
        >
          Configured
        </Tiles.Tile>
      </Tiles.Root>
    )

    const undefinedTile = screen.getByTestId('undefined-stripes')
    const falseTile = screen.getByTestId('false-stripes')
    const defaultTile = screen.getByTestId('default-stripes')
    const configuredTile = screen.getByTestId('configured-stripes')
    const defaultLayers = getDecorativeStripes(defaultTile)
    const configuredLayers = getDecorativeStripes(configuredTile)

    expect(getDecorativeStripes(undefinedTile)).toHaveLength(0)
    expect(getDecorativeStripes(falseTile)).toHaveLength(0)
    expect(defaultLayers).toHaveLength(1)
    expect(configuredLayers).toHaveLength(1)

    const defaultLayer = defaultLayers[0] as HTMLElement
    const configuredLayer = configuredLayers[0] as HTMLElement

    expect(defaultLayer).toHaveAttribute('aria-hidden', 'true')
    expect(defaultLayer).not.toHaveAttribute('tabindex')
    expect(getStylingSource(defaultLayer)).toMatch(/pointer-events-none|pointer-events:\s*none/i)
    expect(getStylingSource(defaultLayer)).toContain('135deg')
    expect(getStylingSource(defaultLayer)).toContain('3px')
    expect(getStylingSource(defaultLayer)).toContain('4px')
    expect(configuredLayer.style.getPropertyValue('--stripes-angle')).toBe('45deg')
    expect(configuredLayer.style.getPropertyValue('--stripes-color')).toBe('currentColor')
    expect(configuredLayer.style.getPropertyValue('--stripes-gap')).toBe('6px')
    expect(configuredLayer.style.getPropertyValue('--stripes-width')).toBe('2px')
    expect(defaultLayer).not.toContainElement(
      screen.getByRole('button', { name: 'Default action' })
    )
    expect(screen.getByRole('button', { name: 'Default action' })).not.toHaveAttribute(
      'aria-hidden'
    )
  })

  it('UC-012 / UC-013 / EX-004 - composes semantic render elements, native props, events, refs, and owned attributes', async () => {
    const onRootClick = vi.fn()
    const onRenderedRootClick = vi.fn()
    const rootRef = createRef<HTMLDivElement>()
    const renderedRootRef = createRef<HTMLElement>()
    const tileRef = createRef<HTMLDivElement>()

    render(
      <Tiles.Root
        aria-label="Training dashboard"
        className="consumer-root"
        data-animating="consumer"
        data-layout="consumer"
        data-source="consumer"
        layout={SINGLE_TILE_LAYOUT}
        onClick={onRootClick}
        ref={rootRef}
        render={
          <section className="rendered-root" onClick={onRenderedRootClick} ref={renderedRootRef} />
        }
        style={{ height: '12rem', overflow: 'auto' }}
      >
        <Tiles.Tile
          area="content"
          aria-labelledby="content-title"
          className="consumer-tile"
          data-area="consumer"
          data-moving="consumer"
          ref={tileRef}
          render={<article className="rendered-tile" />}
        >
          <h2 id="content-title">Training content</h2>
          <button type="button">First action</button>
        </Tiles.Tile>
      </Tiles.Root>
    )

    const root = screen.getByRole('region', { name: 'Training dashboard' })
    const tile = screen.getByRole('article', { name: 'Training content' })

    notifyResize(root, { height: 192, width: 400 })
    await waitFor(() => expect(root).toHaveAttribute('data-layout', 'base'))
    fireEvent.click(root)

    expect(root.tagName).toBe('SECTION')
    expect(tile.tagName).toBe('ARTICLE')
    expect(root).toHaveClass('consumer-root', 'rendered-root')
    expect(tile).toHaveClass('consumer-tile', 'rendered-tile')
    expect(root).toHaveAttribute('data-source', 'consumer')
    expect(root).toHaveAttribute('data-layout', 'base')
    expect(root).not.toHaveAttribute('data-animating')
    expect(tile).toHaveAttribute('data-area', 'content')
    expect(tile).not.toHaveAttribute('data-moving')
    expect(rootRef.current).toBe(root)
    expect(renderedRootRef.current).toBe(root)
    expect(tileRef.current).toBe(tile)
    expect(onRootClick).toHaveBeenCalledOnce()
    expect(onRenderedRootClick).toHaveBeenCalledOnce()
    expect(root).not.toHaveAttribute('tabindex')
    expect(root).not.toHaveAttribute('aria-flowto')
    expect(tile).not.toHaveAttribute('tabindex')
    expect(tile).not.toHaveAttribute('aria-flowto')
    expect(screen.queryByRole('grid')).not.toBeInTheDocument()
    expect(screen.queryByRole('gridcell')).not.toBeInTheDocument()
  })

  it('UC-012 - forwards merged callback render props and empty public state for both parts', () => {
    const rootRef = createRef<HTMLDivElement>()
    const tileRef = createRef<HTMLDivElement>()
    let rootStateKeys: string[] | undefined
    let tileStateKeys: string[] | undefined

    render(
      <Tiles.Root
        aria-label="Callback root"
        data-source="root-callback"
        layout={SINGLE_TILE_LAYOUT}
        ref={rootRef}
        render={(props, state) => {
          rootStateKeys = Object.keys(state)

          return <section {...props} />
        }}
        style={{ height: '10rem' }}
      >
        <Tiles.Tile
          area="content"
          aria-label="Callback tile"
          data-source="tile-callback"
          ref={tileRef}
          render={(props, state) => {
            tileStateKeys = Object.keys(state)

            return <article {...props} />
          }}
        >
          Callback content
        </Tiles.Tile>
      </Tiles.Root>
    )

    const root = screen.getByRole('region', { name: 'Callback root' })
    const tile = screen.getByRole('article', { name: 'Callback tile' })

    expect(root).toHaveAttribute('data-source', 'root-callback')
    expect(tile).toHaveAttribute('data-source', 'tile-callback')
    expect(tile).toHaveAttribute('data-area', 'content')
    expect(root).toHaveTextContent('Callback content')
    expect(rootRef.current).toBe(root)
    expect(tileRef.current).toBe(tile)
    expect(rootStateKeys).toEqual([])
    expect(tileStateKeys).toEqual([])
  })

  it('UC-012 / UC-013 / UC-019 - replaces the shared ScrollableTile outer element without exposing its Viewport', async () => {
    const scrollableTileRef = createRef<HTMLDivElement>()
    const onClick = vi.fn()
    let scrollableTileStateKeys: string[] | undefined

    render(
      <Tiles.Root layout={SINGLE_TILE_LAYOUT} style={{ height: '10rem' }}>
        <Tiles.ScrollableTile
          area="content"
          aria-label="Callback scrollable Tile"
          className="consumer-scrollable-tile"
          data-area="consumer"
          data-has-overflow-x="consumer"
          data-moving="consumer"
          data-scrolling="consumer"
          data-source="scrollable-callback"
          onClick={onClick}
          ref={scrollableTileRef}
          render={(props, state) => {
            scrollableTileStateKeys = Object.keys(state)

            return <article {...props} />
          }}
        >
          Callback scrollable content
        </Tiles.ScrollableTile>
      </Tiles.Root>
    )

    const scrollableTile = screen.getByRole('article', { name: 'Callback scrollable Tile' })
    const viewport = getScrollableTileViewport(scrollableTile)

    await waitFor(() => expect(viewport).toHaveAttribute('tabindex', '-1'))
    fireEvent.click(scrollableTile)

    expect(scrollableTile).toHaveClass('consumer-scrollable-tile')
    expect(scrollableTile).toHaveAttribute('data-area', 'content')
    expect(scrollableTile).toHaveAttribute('data-source', 'scrollable-callback')
    expect(scrollableTile).not.toHaveAttribute('data-has-overflow-x')
    expect(scrollableTile).not.toHaveAttribute('data-moving')
    expect(scrollableTile).not.toHaveAttribute('data-scrolling')
    expect(scrollableTileRef.current).toBe(scrollableTile)
    expect(scrollableTileStateKeys).toEqual([])
    expect(onClick).toHaveBeenCalledOnce()
    expect(viewport).not.toHaveAttribute('aria-label')
    expect(viewport).not.toHaveAttribute('data-source')
    expect(screen.getAllByText('Callback scrollable content')).toHaveLength(1)
    expect(viewport).toHaveTextContent('Callback scrollable content')
  })

  it('UC-014 / EX-001 / EX-002 / EX-004 / EX-006 - keeps demonstration resizing and scrolling outside each Root', () => {
    render(
      <>
        <Tiles.Root
          className="group/tiles h-[36rem] w-full"
          data-testid="viewport-example-root"
          layout={DASHBOARD_LAYOUT}
        >
          <Tiles.Tile area="main">Main</Tiles.Tile>
          <Tiles.Tile area="aside">Aside</Tiles.Tile>
          <Tiles.Tile area="secondary">Secondary</Tiles.Tile>
          <Tiles.Tile area="footer">Footer</Tiles.Tile>
        </Tiles.Root>

        <div
          className="h-[32rem] w-[42rem] max-w-full min-w-64 resize-x overflow-auto border-8 border-border p-8"
          data-testid="nested-example-wrapper"
        >
          <Tiles.Root
            className="h-full w-full"
            data-testid="nested-example-root"
            layout={OUTER_LAYOUT}
          >
            <Tiles.Tile area="main">
              <Tiles.Root className="h-full w-full" layout={INNER_LAYOUT}>
                <Tiles.Tile area="summary">Summary</Tiles.Tile>
                <Tiles.Tile area="details">Details</Tiles.Tile>
              </Tiles.Root>
            </Tiles.Tile>
            <Tiles.Tile area="aside">Aside</Tiles.Tile>
          </Tiles.Root>
        </div>

        <SemanticStatefulTiles />
        <FrozenResponsiveTiles />
      </>
    )

    const viewportRoot = screen.getByTestId('viewport-example-root')
    const nestedWrapper = screen.getByTestId('nested-example-wrapper')
    const nestedRoot = screen.getByTestId('nested-example-root')
    const semanticWrapper = screen.getByTestId('semantic-wrapper')
    const semanticRoot = screen.getByTestId('semantic-root')
    const frozenWrapper = screen.getByTestId('frozen-wrapper')
    const frozenRoot = screen.getByTestId('frozen-root')

    expect(viewportRoot).toHaveClass('h-[36rem]', 'w-full')
    expect(viewportRoot).not.toHaveClass('max-w-full', 'min-w-64', 'resize-x', 'overflow-auto')

    for (const wrapper of [nestedWrapper, semanticWrapper, frozenWrapper]) {
      expect(wrapper).toHaveClass(
        'max-w-full',
        'min-w-64',
        'resize-x',
        'overflow-auto',
        'border-8',
        'border-border',
        'p-8'
      )
    }

    for (const root of [nestedRoot, semanticRoot, frozenRoot]) {
      expect(root).toHaveClass('h-full', 'w-full')
      expect(root).not.toHaveClass(
        'max-w-full',
        'min-w-64',
        'resize-x',
        'overflow-auto',
        'border-8',
        'p-8'
      )
    }
  })

  it('UC-014 - preserves consumer-owned Root geometry and overflow while Tiles own inner layout', async () => {
    const rootStyle = {
      '--tiles-layout-duration': '350ms',
      '--tiles-layout-easing': 'linear',
      height: '360px',
      overflow: 'auto',
      width: '640px'
    } as TilesCssProperties

    render(
      <Tiles.Root
        className="consumer-sized-root"
        data-testid="sized-root"
        layout={BREAKPOINT_LAYOUT}
        style={rootStyle}
      >
        <Tiles.Tile area="main" style={{ padding: '16px' }}>
          <div style={{ minWidth: '900px' }}>Consumer-controlled overflowing content</div>
        </Tiles.Tile>
        <Tiles.Tile area="aside">Aside</Tiles.Tile>
      </Tiles.Root>
    )

    const root = screen.getByTestId('sized-root')

    notifyResize(root, { height: 360, width: 640 })
    await waitFor(() => expect(root).toHaveAttribute('data-layout', 'lg'))

    expect(root).toHaveClass('consumer-sized-root')
    expect(root).toHaveStyle({ height: '360px', overflow: 'auto', width: '640px' })
    expect(root.style.getPropertyValue('--tiles-layout-duration')).toBe('350ms')
    expect(root.style.getPropertyValue('--tiles-layout-easing')).toBe('linear')
    expect(screen.getByText('Consumer-controlled overflowing content')).toHaveStyle({
      minWidth: '900px'
    })
  })

  it('UC-008 / UC-019 / EX-008 / CR-004 - remounts descendants and resets native scroll when switching Tile runtime types', async () => {
    scrollAreaViewportMetrics = {
      clientHeight: 160,
      clientWidth: 320,
      scrollHeight: 640,
      scrollWidth: 768
    }

    render(<ScrollableTilesSurface />)

    const root = screen.getByTestId('scrollable-example-root')

    notifyResize(root, { height: 256, width: 400 })
    await waitFor(() => expect(root).toHaveAttribute('data-layout', 'sm'))

    const firstScrollableSurface = screen.getByTestId('history-surface')

    await waitFor(() => {
      expect(firstScrollableSurface).toHaveAttribute('data-has-overflow-x')
      expect(firstScrollableSurface).toHaveAttribute('data-has-overflow-y')
    })

    const firstViewport = getScrollableTileViewport(firstScrollableSurface)
    const firstCounter = screen.getByRole('button', { name: 'Local count 0' })

    fireEvent.click(firstCounter)
    const incrementedScrollableCounter = screen.getByRole('button', { name: 'Local count 1' })

    incrementedScrollableCounter.focus()
    firstViewport.scrollLeft = 96
    firstViewport.scrollTop = 72

    expect(incrementedScrollableCounter).toHaveFocus()

    fireEvent.click(screen.getByRole('button', { name: 'Use normal Tile' }))

    const normalSurface = screen.getByTestId('history-surface')
    const normalCounter = screen.getByRole('button', { name: 'Local count 0' })

    expect(screen.getByRole('status')).toHaveTextContent('Normal Tile mounted')
    expect(normalSurface).not.toBe(firstScrollableSurface)
    expect(firstScrollableSurface).not.toBeInTheDocument()
    expect(queryScrollableTileViewport(normalSurface)).toBeNull()
    expect(normalCounter).not.toHaveFocus()

    fireEvent.click(normalCounter)
    const incrementedNormalCounter = screen.getByRole('button', { name: 'Local count 1' })

    incrementedNormalCounter.focus()
    expect(incrementedNormalCounter).toHaveFocus()

    fireEvent.click(screen.getByRole('button', { name: 'Use ScrollableTile' }))

    const secondScrollableSurface = screen.getByTestId('history-surface')
    const resetScrollableCounter = screen.getByRole('button', { name: 'Local count 0' })

    await waitFor(() => {
      expect(secondScrollableSurface).toHaveAttribute('data-has-overflow-x')
      expect(secondScrollableSurface).toHaveAttribute('data-has-overflow-y')
    })

    const secondViewport = getScrollableTileViewport(secondScrollableSurface)

    expect(screen.getByRole('status')).toHaveTextContent('ScrollableTile mounted')
    expect(secondScrollableSurface).not.toBe(firstScrollableSurface)
    expect(secondScrollableSurface).not.toBe(normalSurface)
    expect(normalSurface).not.toBeInTheDocument()
    expect(resetScrollableCounter).not.toHaveFocus()
    expect(secondViewport.scrollLeft).toBe(0)
    expect(secondViewport.scrollTop).toBe(0)
  })

  it('UC-015 - remounts a Tile when a consumer changes its logical area with a new React key', () => {
    const firstLayout = { base: [['first']] } as const satisfies TilesLayout<'first'>
    const secondLayout = { base: [['second']] } as const satisfies TilesLayout<'second'>
    const rendered = render(
      <Tiles.Root layout={firstLayout} style={{ height: '10rem' }}>
        <Tiles.Tile area="first" data-testid="identity-tile" key="first">
          <LocalCounter />
        </Tiles.Tile>
      </Tiles.Root>
    )

    const firstTile = screen.getByTestId('identity-tile')

    fireEvent.click(screen.getByRole('button', { name: 'Count 0' }))
    expect(screen.getByRole('button', { name: 'Count 1' })).toBeInTheDocument()

    rendered.rerender(
      <Tiles.Root layout={secondLayout} style={{ height: '10rem' }}>
        <Tiles.Tile area="second" data-testid="identity-tile" key="second">
          <LocalCounter />
        </Tiles.Tile>
      </Tiles.Root>
    )

    const secondTile = screen.getByTestId('identity-tile')

    expect(secondTile).not.toBe(firstTile)
    expect(secondTile).toHaveAttribute('data-area', 'second')
    expect(screen.getByRole('button', { name: 'Count 0' })).toBeInTheDocument()
  })

  it('UC-015 - rejects mutating a mounted Tile area without a matching React remount', () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined)

    const firstLayout = { base: [['first']] } as const satisfies TilesLayout<'first'>
    const secondLayout = { base: [['second']] } as const satisfies TilesLayout<'second'>
    const rendered = render(
      <Tiles.Root layout={firstLayout} style={{ height: '10rem' }}>
        <Tiles.Tile area="first" data-testid="stable-identity-tile">
          Content
        </Tiles.Tile>
      </Tiles.Root>
    )

    expect(() =>
      rendered.rerender(
        <Tiles.Root layout={secondLayout} style={{ height: '10rem' }}>
          <Tiles.Tile area="second" data-testid="stable-identity-tile">
            Content
          </Tiles.Tile>
        </Tiles.Root>
      )
    ).toThrow(/area|identity|key|remount/i)
  })
})
