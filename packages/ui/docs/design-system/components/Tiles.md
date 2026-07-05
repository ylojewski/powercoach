---
revision: 4
date: 2026-08-09
---

# Tiles

## Overview

Tiles arranges content surfaces in responsive named-area matrices. Each matrix
divides the available Root rectangle into equal fractional cells, while each
Tile occupies one continuous rectangular area.

Every Tiles layout responds to the content-box width of its own Root. A Root at
page level therefore follows its page allocation, while a Root nested inside a
Tile follows that Tile rather than the viewport. Nested layouts may reflow at
the same time as their parent layout.

Tiles uses CSS transitions to move and resize the real Tile boxes when the
active matrix changes. It transitions `left`, `top`, `width`, and `height`; it
does not scale pixels or duplicate Tile content. Consumer DOM order, focus, and
component-local state remain stable across reflows.

Tiles owns a square, configurable `border-border` perimeter and one copy of
every internal separator at rest. Root accepts the Tailwind border widths `0`,
`1`, `2`, `4`, and `8`, with `1` as the default. Root and Tile may inherit or
invert the effective light or dark theme. Tile may also compose the public
Stripes component as an optional decorative full-surface layer.

ScrollableTile is an always-scrollable Tile counterpart backed by the public
ScrollArea component. It preserves the Tile surface, registration, geometry,
theme, Stripes, and motion contracts while placing consumer children inside
ScrollArea's native scrollable viewport. Tiles provides no scrollable Root
part or Root scrolling prop.

Root can freeze breakpoint changes and explicit `layout` replacements at the
currently engaged matrix. Its percentage geometry continues to follow Root,
without selecting another matrix or creating motion state. A freeze requested
during an active transition becomes settled after that transition finishes at
its existing proportional target. Releasing the freeze catches up to the
current size and latest valid `layout` when necessary.

Tiles is a visual layout component, not an interactive grid. It adds no ARIA
grid semantics or keyboard model.

## Anatomy

Tiles exposes three public parts.

- `Tiles.Root`: owns the responsive matrices, resize freeze, available
  rectangle, configurable separator network, effective theme, and motion state
  for its direct Tiles.
- `Tiles.Tile`: owns one stable named area, its content surface, its effective
  theme, and its optional Stripes layer.
- `Tiles.ScrollableTile`: owns the same stable named-area Tile surface with an
  always-present ScrollArea composition for overflowing consumer content.

All three parts render a `div` outer surface by default. In behavioral prose,
Tile collectively means `Tiles.Tile` and `Tiles.ScrollableTile` unless a
section distinguishes them.

```tsx
<Tiles.Root layout={layout}>
  <Tiles.Tile area="main">Main content</Tiles.Tile>
  <Tiles.ScrollableTile area="aside">Scrollable aside content</Tiles.ScrollableTile>
</Tiles.Root>
```

The family exports the `Tiles` namespace together with the named runtime
exports `TilesRoot`, `TilesTile`, and `TilesScrollableTile`.

## Examples

### EX-001 - Responsive three-quarter matrix

Context: A consumer needs a viewport-responsive dashboard whose large layout
dedicates three quarters of both axes to its main area and exposes the active
layout and Tile movement for inspection.

Expected behavior: Below `24rem`, the four areas stack in one column. At
`24rem`, the supplied `sm` matrix becomes active. At `32rem`, the supplied
`lg` matrix becomes active and `main` occupies three quarters of the width and
height. Resizing the Storybook viewport changes the real Tile positions and
dimensions over `200ms`. Reversing the viewport resize before Tiles settle
retargets the motion from its current geometry. The visible labels reflect
`data-layout`, `data-animating`, and `data-moving`. Under reduced motion, the
same layout changes settle immediately without motion labels. Root fills the
available width without a resize handle, fixed width, or scrolling style; its
height remains consumer-owned.

Covers: UC-001, UC-002, UC-003, UC-005, UC-006, UC-007, UC-009, UC-014

```tsx
import type { TilesLayout } from '@powercoach/ui'
import { Tiles } from '@powercoach/ui'

const dashboardLayout = {
  base: [['main'], ['aside'], ['secondary'], ['footer']],
  sm: [
    ['main', 'aside'],
    ['secondary', 'footer']
  ],
  lg: [
    ['main', 'main', 'main', 'aside'],
    ['main', 'main', 'main', 'aside'],
    ['main', 'main', 'main', 'aside'],
    ['secondary', 'secondary', 'secondary', 'footer']
  ]
} satisfies TilesLayout<'main' | 'aside' | 'secondary' | 'footer'>

function TileMotionProbe() {
  return <span className="hidden text-xs group-data-[moving]/tile:inline">moving</span>
}

export function ResponsiveDashboardTiles() {
  return (
    <Tiles.Root layout={dashboardLayout} className="group/tiles h-[36rem] w-full">
      <Tiles.Tile area="main" className="group/tile p-4">
        <strong>Main</strong>
        <div className="text-xs">
          <span className="hidden group-data-[layout=base]/tiles:inline">base</span>
          <span className="hidden group-data-[layout=sm]/tiles:inline">sm</span>
          <span className="hidden group-data-[layout=lg]/tiles:inline">lg</span>
          {' · '}
          <span className="hidden group-data-[animating]/tiles:inline">root animating · </span>
          <TileMotionProbe />
        </div>
      </Tiles.Tile>
      <Tiles.Tile area="aside" className="group/tile p-4">
        Aside <TileMotionProbe />
      </Tiles.Tile>
      <Tiles.Tile area="secondary" className="group/tile p-4">
        Secondary <TileMotionProbe />
      </Tiles.Tile>
      <Tiles.Tile area="footer" className="group/tile p-4">
        Footer <TileMotionProbe />
      </Tiles.Tile>
    </Tiles.Root>
  )
}
```

### EX-002 - Nested local reflow

Context: A consumer places a second Tiles layout inside the main Tile and
needs the inner matrix to respond to the width of that parent Tile.

Expected behavior: A bordered and padded demonstration wrapper owns the
horizontal resize handle and scrolling needed by that handle. The outer Root
fills the wrapper and responds to its available width. The inner Root fills
`main`, suppresses its outer perimeter, and responds to its own content-box
width. When the outer `main` width crosses the inner `sm` threshold during
motion, the inner summary and details Tiles start their local transition
immediately. The two levels may remain in motion together, while each Root
reports only motion owned by its direct Tiles.

Covers: UC-003, UC-004, UC-005, UC-006, UC-007, UC-009, UC-014

```tsx
import type { TilesLayout } from '@powercoach/ui'
import { Tiles } from '@powercoach/ui'

const outerLayout = {
  base: [['main'], ['aside']],
  lg: [
    ['main', 'main', 'main', 'aside'],
    ['main', 'main', 'main', 'aside']
  ]
} satisfies TilesLayout<'main' | 'aside'>

const innerLayout = {
  base: [['summary'], ['details']],
  sm: [['summary', 'details']]
} satisfies TilesLayout<'summary' | 'details'>

export function NestedResponsiveTiles() {
  return (
    <div className="h-[32rem] w-[42rem] max-w-full min-w-64 resize-x overflow-auto border-8 border-border p-8">
      <Tiles.Root layout={outerLayout} className="h-full w-full">
        <Tiles.Tile area="main">
          <Tiles.Root layout={innerLayout} className="group/inner h-full w-full">
            <Tiles.Tile area="summary" className="p-4">
              Summary
              <span className="ml-2 hidden text-xs group-data-[layout=base]/inner:inline">
                stacked
              </span>
              <span className="ml-2 hidden text-xs group-data-[layout=sm]/inner:inline">
                side by side
              </span>
            </Tiles.Tile>
            <Tiles.Tile area="details" className="p-4">
              Details
            </Tiles.Tile>
          </Tiles.Root>
        </Tiles.Tile>
        <Tiles.Tile area="aside" className="p-4">
          Aside
        </Tiles.Tile>
      </Tiles.Root>
    </div>
  )
}
```

### EX-003 - Theme, separators, and Stripes matrix

Context: A consumer needs to inspect plain, inverted, double-inverted, and
striped Tiles in both light and dark surroundings.

Expected behavior: Each Root and its complete settled separator network use
the Root effective theme. The inverse Tile uses the opposite semantic
background and foreground tokens without changing its shared separator color.
The nested inverse Root inside that inverse Tile returns to the outside theme.
The plain Tile has no Stripes, the inverse Tile uses default Stripes, and the
configured Tile passes the four named values through the public Stripes API.

Covers: UC-009, UC-010, UC-011

```tsx
import type { TilesLayout } from '@powercoach/ui'
import { Tiles } from '@powercoach/ui'

const themeLayout = {
  base: [
    ['plain', 'inverse'],
    ['double', 'configured']
  ]
} satisfies TilesLayout<'plain' | 'inverse' | 'double' | 'configured'>

const singleTileLayout = {
  base: [['content']]
} satisfies TilesLayout<'content'>

function ThemeSample({ label }: { label: string }) {
  return (
    <section>
      <h2 className="mb-2">{label}</h2>
      <Tiles.Root layout={themeLayout} className="h-64">
        <Tiles.Tile area="plain" stripesProps={false} className="p-4">
          Plain
        </Tiles.Tile>
        <Tiles.Tile area="inverse" theme="inverse" stripesProps className="p-4">
          Inverse with default Stripes
        </Tiles.Tile>
        <Tiles.Tile area="double" theme="inverse">
          <Tiles.Root layout={singleTileLayout} theme="inverse" className="h-full w-full">
            <Tiles.Tile area="content" className="p-4">
              Double inversion
            </Tiles.Tile>
          </Tiles.Root>
        </Tiles.Tile>
        <Tiles.Tile
          area="configured"
          stripesProps={{ angle: '45deg', gap: '6px', width: '2px', color: 'currentColor' }}
          className="p-4"
        >
          Configured Stripes
        </Tiles.Tile>
      </Tiles.Root>
    </section>
  )
}

export function TilesThemeMatrix() {
  return (
    <div className="grid gap-8">
      <div className="light bg-background p-4 text-foreground">
        <ThemeSample label="Light surroundings" />
      </div>
      <div className="dark bg-background p-4 text-foreground">
        <ThemeSample label="Dark surroundings" />
      </div>
    </div>
  )
}
```

### EX-004 - Semantic render and preserved interaction state

Context: A consumer needs section and article semantics while preserving focus
and component-local state when the visual order changes.

Expected behavior: A bordered and padded demonstration wrapper owns the
horizontal resize handle and scrolling needed by that handle. Root fills the
wrapper, renders the supplied `section`, and each Tile renders the supplied
`article`. At `sm`, the action appears visually before the counter, but the
counter remains first in DOM order. Resizing the wrapper while either button
is focused preserves focus, and the counter value is not reset. Tiles adds no
grid role or keyboard behavior.

Covers: UC-003, UC-005, UC-008, UC-012, UC-013, UC-014

```tsx
import { useState } from 'react'
import type { TilesLayout } from '@powercoach/ui'
import { Tiles } from '@powercoach/ui'

const semanticLayout = {
  base: [['counter'], ['action']],
  sm: [['action', 'counter']]
} satisfies TilesLayout<'counter' | 'action'>

export function SemanticStatefulTiles() {
  const [count, setCount] = useState(0)

  return (
    <div className="h-64 w-[42rem] max-w-full min-w-64 resize-x overflow-auto border-8 border-border p-8">
      <Tiles.Root
        layout={semanticLayout}
        render={<section aria-labelledby="tile-section-title" />}
        className="h-full w-full"
      >
        <Tiles.Tile
          area="counter"
          render={<article aria-labelledby="tile-section-title" />}
          className="p-4"
        >
          <h2 id="tile-section-title">Persistent counter</h2>
          <button type="button" onClick={() => setCount((value) => value + 1)}>
            Count {count}
          </button>
        </Tiles.Tile>
        <Tiles.Tile area="action" render={<article />} className="p-4">
          <h2>Focused action</h2>
          <button type="button">Keep focus while resizing</button>
        </Tiles.Tile>
      </Tiles.Root>
    </div>
  )
}
```

### EX-005 - Invalid matrix error

Context: A consumer needs a visible diagnostic when an area is not one
continuous rectangle.

Expected behavior: The `main` area is L-shaped in `base`, so Tiles throws a
descriptive Error before selecting or animating the configuration. The example
error boundary displays a message that identifies `base` and `main`; Tiles
does not repair the matrix.

Covers: UC-002, UC-015

```tsx
import { Component, type ReactNode } from 'react'
import type { TilesLayout } from '@powercoach/ui'
import { Tiles } from '@powercoach/ui'

const invalidLayout = {
  base: [
    ['main', 'main'],
    ['main', 'aside']
  ]
} satisfies TilesLayout<'main' | 'aside'>

class ExampleErrorBoundary extends Component<{ children: ReactNode }, { message: string | null }> {
  state = { message: null }

  static getDerivedStateFromError(error: unknown) {
    return { message: error instanceof Error ? error.message : 'Unknown Tiles error' }
  }

  render() {
    if (this.state.message) {
      return <output>{this.state.message}</output>
    }

    return this.props.children
  }
}

export function InvalidTilesMatrix() {
  return (
    <ExampleErrorBoundary>
      <Tiles.Root layout={invalidLayout} className="h-48">
        <Tiles.Tile area="main">Main</Tiles.Tile>
        <Tiles.Tile area="aside">Aside</Tiles.Tile>
      </Tiles.Root>
    </ExampleErrorBoundary>
  )
}
```

### EX-006 - Frozen responsive reflow

Context: A consumer needs to hold a dashboard at its current responsive matrix
while its container is resized or its `layout` prop is replaced, then let it
catch up to the latest valid configuration and available rectangle.

Expected behavior: A bordered and padded demonstration wrapper owns the
horizontal resize handle and scrolling needed by that handle, while Root fills
the wrapper. Root selects its initial matrix normally. While frozen, resizing
the wrapper preserves the engaged matrix and `data-layout`; Tile percentages
remain unchanged, so their rendered pixels follow Root without a transition,
motion attributes, geometric overflow, or a scrollbar caused by Tiles.
Replacing `layout` validates it immediately and keeps only the latest valid
configuration pending without changing the engaged matrix. Activating the
freeze while a Tile is moving lets that transition finish at its existing
percentage target, after which the reached matrix remains frozen without a
second transition. Releasing the freeze selects from the latest valid layout
at the current Root width. It uses the normal `200ms` CSS transition only when
one or more rectangles differ; a changed `data-layout` provenance with
identical rectangles produces no motion state. Releasing the freeze before an
active transition finishes cancels the pending freeze and allows normal
responsive retargeting.

Covers: UC-003, UC-005, UC-006, UC-007, UC-014, UC-016, UC-018

```tsx
import { useState } from 'react'
import type { TilesLayout } from '@powercoach/ui'
import { Tiles } from '@powercoach/ui'

const frozenLayout = {
  base: [['main'], ['aside']],
  sm: [['main', 'aside']]
} satisfies TilesLayout<'main' | 'aside'>

const alternateFrozenLayout = {
  base: [['aside'], ['main']],
  sm: [['aside', 'main']]
} satisfies TilesLayout<'main' | 'aside'>

function FrozenTileMotionProbe() {
  return <span className="hidden text-xs group-data-[moving]/tile:inline">moving</span>
}

export function FrozenResponsiveTiles() {
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
      <div className="h-64 w-[42rem] max-w-full min-w-64 resize-x overflow-auto border-8 border-border p-8">
        <Tiles.Root
          layout={alternate ? alternateFrozenLayout : frozenLayout}
          frozen={frozen}
          className="group/freeze h-full w-full"
        >
          <Tiles.Tile area="main" className="group/tile p-4">
            Main
            {' · '}
            <span className="hidden group-data-[layout=base]/freeze:inline">base</span>
            <span className="hidden group-data-[layout=sm]/freeze:inline">sm</span>
            {' · '}
            <FrozenTileMotionProbe />
          </Tiles.Tile>
          <Tiles.Tile area="aside" className="group/tile p-4">
            Aside <FrozenTileMotionProbe />
          </Tiles.Tile>
        </Tiles.Root>
      </div>
    </div>
  )
}
```

### EX-007 - Configurable border networks

Context: A consumer needs to compare every supported border width, remove one
network completely, and give a nested Root thicker internal separators than
its parent Root.

Expected behavior: The five samples render `border-border` perimeter and
separator widths of `0px`, `1px`, `2px`, `4px`, and `8px`; the zero-width
sample has neither perimeter nor separator. The nested sample has a `2px`
parent perimeter and parent separator, a single `2px` boundary around the
nested area, and a `4px` separator inside the nested Root without a nested
`4px` perimeter.

Covers: UC-009, UC-017

```tsx
import type { TilesLayout } from '@powercoach/ui'
import { Tiles } from '@powercoach/ui'

const borderLayout = {
  base: [['left', 'right']]
} satisfies TilesLayout<'left' | 'right'>

const nestedBorderLayout = {
  base: [['nested', 'aside']]
} satisfies TilesLayout<'nested' | 'aside'>

const innerBorderLayout = {
  base: [['top'], ['bottom']]
} satisfies TilesLayout<'top' | 'bottom'>

const borderWidths = [0, 1, 2, 4, 8] as const

export function ConfigurableTilesBorders() {
  return (
    <div className="grid gap-6">
      {borderWidths.map((border) => (
        <section key={border}>
          <h2>Border {border}px</h2>
          <Tiles.Root layout={borderLayout} border={border} className="h-20">
            <Tiles.Tile area="left" className="p-4">
              Left
            </Tiles.Tile>
            <Tiles.Tile area="right" className="p-4">
              Right
            </Tiles.Tile>
          </Tiles.Root>
        </section>
      ))}

      <section>
        <h2>Nested border networks</h2>
        <Tiles.Root layout={nestedBorderLayout} border={2} className="h-40">
          <Tiles.Tile area="nested">
            <Tiles.Root layout={innerBorderLayout} border={4} className="h-full w-full">
              <Tiles.Tile area="top" className="p-4">
                Top
              </Tiles.Tile>
              <Tiles.Tile area="bottom" className="p-4">
                Bottom
              </Tiles.Tile>
            </Tiles.Root>
          </Tiles.Tile>
          <Tiles.Tile area="aside" className="p-4">
            Aside
          </Tiles.Tile>
        </Tiles.Root>
      </section>
    </div>
  )
}
```

### EX-008 - Scrollable Tile surface and remount boundary

Context: A consumer needs one bounded dashboard area to scroll overflowing
history in both directions while another Tile remains a normal surface. The
consumer also needs to understand the lifecycle boundary when choosing between
the normal and scrollable Tile types.

Expected behavior: The `history` area participates in the same matrix,
separator, theme, and motion contracts as `summary`. While ScrollableTile is
selected, its shared outer surface exposes `data-area` together with the
ScrollArea overflow attributes and corner variables. Its internal viewport
provides native pointer, keyboard, and touch scrolling with the public
ScrollArea overlay scrollbars, and its Stripes layer remains fixed while the
history content scrolls. The visible overflow probes follow the ScrollArea
root attributes without changing Tiles layout or motion state. Selecting the
normal Tile replaces the runtime component type, removes the ScrollArea
anatomy, and remounts the history subtree, so its local counter resets and any
focus, ref identity, or scroll position is not preserved. Selecting
ScrollableTile again creates a new viewport at its initial scroll position.

Covers: UC-001, UC-007, UC-008, UC-009, UC-010, UC-011, UC-012, UC-013, UC-014, UC-019

```tsx
import { useState } from 'react'
import type { TilesLayout } from '@powercoach/ui'
import { Tiles } from '@powercoach/ui'

const scrollableLayout = {
  base: [['history'], ['summary']],
  sm: [['history', 'summary']]
} satisfies TilesLayout<'history' | 'summary'>

function HistoryContent() {
  const [count, setCount] = useState(0)

  return (
    <div className="grid h-[30rem] w-[36rem] content-start gap-4 p-4">
      <button type="button" onClick={() => setCount((value) => value + 1)}>
        Local count {count}
      </button>
      {Array.from({ length: 16 }, (_, index) => (
        <p className="m-0" key={index}>
          Training history entry {index + 1}
        </p>
      ))}
    </div>
  )
}

export function ScrollableTilesSurface() {
  const [scrollable, setScrollable] = useState(true)

  return (
    <div className="grid gap-3">
      <button type="button" onClick={() => setScrollable((value) => !value)}>
        {scrollable ? 'Use normal Tile' : 'Use ScrollableTile'}
      </button>
      <output>{scrollable ? 'ScrollableTile mounted' : 'Normal Tile mounted'}</output>
      <Tiles.Root layout={scrollableLayout} className="h-64 w-full">
        {scrollable ? (
          <Tiles.ScrollableTile area="history" stripesProps className="group/history">
            <div className="relative">
              <p className="m-0 p-4 text-xs">
                <span className="hidden group-data-[has-overflow-x]/history:inline">
                  horizontal overflow
                </span>
                {' · '}
                <span className="hidden group-data-[has-overflow-y]/history:inline">
                  vertical overflow
                </span>
              </p>
              <HistoryContent />
            </div>
          </Tiles.ScrollableTile>
        ) : (
          <Tiles.Tile area="history" stripesProps>
            <HistoryContent />
          </Tiles.Tile>
        )}
        <Tiles.Tile area="summary" className="p-4">
          Summary
        </Tiles.Tile>
      </Tiles.Root>
    </div>
  )
}
```

## Root

`Tiles.Root` owns one responsive layout and only the direct Tiles registered
before the next nested Root boundary. It renders a `div` by default.

### Props

```ts
type TilesArea = string

type TilesContainerBreakpoint =
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

type TilesLayoutKey = 'base' | TilesContainerBreakpoint

type TilesMatrix<Area extends TilesArea = TilesArea> = readonly (readonly Area[])[]

type TilesLayout<Area extends TilesArea = TilesArea> = Readonly<
  { base: TilesMatrix<Area> } & Partial<Record<TilesContainerBreakpoint, TilesMatrix<Area>>>
>

type TilesTheme = 'inherit' | 'inverse'

interface TilesRootProps<Area extends TilesArea = TilesArea>
  extends useRender.ComponentProps<'div', Record<string, never>> {
  layout: TilesLayout<Area>
  frozen?: boolean
  border?: 0 | 1 | 2 | 4 | 8
  theme?: TilesTheme
}
```

These types are public exports from `@powercoach/ui`.

| Prop               | Type                                                                  | Default     | Description                                                                                                                                                                                                                              |
| ------------------ | --------------------------------------------------------------------- | ----------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `layout`           | `TilesLayout<Area>`                                                   | None        | Required mobile-first named matrices for the direct Tiles. `base` is required; supplied breakpoint matrices replace it at their inclusive container thresholds. A valid replacement received while frozen remains pending until release. |
| `frozen`           | `boolean`                                                             | `undefined` | `true` holds the engaged matrix, `data-layout`, and proportional Tile geometry across resizes and valid `layout` replacements. `false` and `undefined` keep responsive selection active or catch up when released.                       |
| `border`           | `0 \| 1 \| 2 \| 4 \| 8`                                               | `1`         | Sets the Tailwind pixel width of the Root-owned perimeter and separator network. `0` removes the complete network.                                                                                                                       |
| `theme`            | `"inherit" \| "inverse"`                                              | `"inherit"` | Keeps the surrounding effective theme or inverts it for Root and descendants.                                                                                                                                                            |
| `children`         | `React.ReactNode`                                                     | None        | Direct `Tiles.Tile` or `Tiles.ScrollableTile` children. A nested Root is supported inside either Tile type and begins a separate registration boundary.                                                                                  |
| `render`           | `ReactElement \| ((props: HTMLProps, state: object) => ReactElement)` | None        | Replaces the default `div` using Base UI `useRender` semantics. Root defines no public render state fields.                                                                                                                              |
| `className`        | `string`                                                              | None        | Composes consumer classes on Root. Consumers may provide dimensions and overflow, but component-owned positioning, containment, separator, and transition rules remain reserved.                                                         |
| `style`            | `React.CSSProperties`                                                 | None        | Applies consumer styles to Root and may set the public Tiles CSS variables. Conflicting component-owned geometry and transition declarations are unsupported.                                                                            |
| native `div` props | `React.ComponentPropsWithRef<"div">`                                  | None        | Native attributes, events, ARIA attributes, consumer data attributes, and ref pass through to Root, except component-owned data attributes take precedence.                                                                              |

The keys of `TilesLayout` omit Tailwind's `@` container-query sigil. For
example, `md` represents the `@md` container threshold.

The `border` union is the complete supported width set. Tiles does not perform
runtime validation for values outside that TypeScript contract.

### Events

Root defines no custom events. Native events pass through to the rendered
element. Native transition events remain per-property browser events and do
not form an aggregate Tiles motion lifecycle callback.

### Data Attributes

| Attribute                          | Description                                                                                                                                                                                                    |
| ---------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `data-layout="base" \| breakpoint` | Contains the source key of the engaged supplied matrix. When an omitted wider key inherits `md`, the value remains `md`. While frozen, it remains the source key from the engaged configuration until release. |
| `data-animating`                   | Present while any direct Tile has a component-owned `left`, `top`, `width`, or `height` transition in flight. Nested Root motion does not affect it.                                                           |

Root owns these values. Consumer values for the same attributes do not replace
the component values.

### CSS Variables

| Variable                  | Default                          | Description                                                                                 |
| ------------------------- | -------------------------------- | ------------------------------------------------------------------------------------------- |
| `--tiles-layout-duration` | `200ms`                          | Duration inherited by direct Tiles and nested Roots. Accepts a valid non-negative CSS time. |
| `--tiles-layout-easing`   | `cubic-bezier(0.22, 1, 0.36, 1)` | Easing inherited by direct Tiles and nested Roots. Accepts a valid CSS easing function.     |

The variables may be set through Root `className` or `style`. Reduced motion
sets the effective component-owned duration to zero regardless of the
configured normal value.

## Tile

`Tiles.Tile` owns one stable area inside its nearest Root, renders its content
once, and renders a `div` by default. Its allocated rectangle is a semantic
`background` and `foreground` surface under its effective theme.

### Props

```ts
type TilesTileStripesProps = Pick<StripesProps, 'angle' | 'color' | 'gap' | 'width'>

interface TilesTileProps<Area extends TilesArea = TilesArea>
  extends useRender.ComponentProps<'div', Record<string, never>> {
  area: Area
  theme?: TilesTheme
  stripesProps?: boolean | TilesTileStripesProps
}
```

`TilesTileProps` and `TilesTileStripesProps` are public exports from
`@powercoach/ui`.

| Prop               | Type                                                                  | Default     | Description                                                                                                                                                       |
| ------------------ | --------------------------------------------------------------------- | ----------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `area`             | `Area`                                                                | None        | Required non-empty, case-sensitive identity matched exactly against every supplied matrix. It must remain stable for the Tile's mounted lifetime.                 |
| `theme`            | `"inherit" \| "inverse"`                                              | `"inherit"` | Keeps the nearest effective theme or inverts it for the Tile surface, descendants, and optional Stripes layer.                                                    |
| `stripesProps`     | `boolean \| TilesTileStripesProps`                                    | `undefined` | `undefined` or `false` renders no Stripes, `true` uses public Stripes defaults, and an object passes the supported named visual props to Stripes.                 |
| `children`         | `React.ReactNode`                                                     | None        | Content rendered once above the optional decorative Stripes layer.                                                                                                |
| `render`           | `ReactElement \| ((props: HTMLProps, state: object) => ReactElement)` | None        | Replaces the default `div` using Base UI `useRender` semantics. Tile defines no public render state fields.                                                       |
| `className`        | `string`                                                              | None        | Composes consumer classes on Tile. Component-owned positioning, containment, separator coordination, layer positioning, and geometry transitions remain reserved. |
| `style`            | `React.CSSProperties`                                                 | None        | Applies consumer styles to Tile. Conflicting component-owned `left`, `top`, `width`, `height`, positioning, or transition declarations are unsupported.           |
| native `div` props | `React.ComponentPropsWithRef<"div">`                                  | None        | Native attributes, events, ARIA attributes, consumer data attributes, and ref pass through to Tile, except component-owned data attributes take precedence.       |

Changing the logical identity of a mounted Tile requires rendering it with the
new `area` and a new React `key` so that React remounts the Tile.

The object form of `stripesProps` does not accept Stripes `children`, `render`,
`className`, `style`, native events, `role`, `tabIndex`, ARIA attributes, ref,
or data attributes. Tiles owns the decorative layer's structure, geometry,
interaction, and accessibility.

### Events

Tile defines no custom events. Native events pass through to the rendered
element. Native transition events remain per-property browser events.

### Data Attributes

| Attribute     | Description                                                                                                                    |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| `data-area`   | Always contains the exact public `area` identity.                                                                              |
| `data-moving` | Present while any component-owned `left`, `top`, `width`, or `height` transition is moving toward the newest target rectangle. |

Tile owns these values. Consumer values for the same attributes do not replace
the component values.

### CSS Variables

Tile defines no additional public Tiles CSS variables. It inherits
`--tiles-layout-duration` and `--tiles-layout-easing` from Root.

## ScrollableTile

`Tiles.ScrollableTile` is a distinct runtime component type that owns one
stable area inside its nearest Root and always composes the public ScrollArea
component. Its outer element is simultaneously the positioned Tile surface and
the ScrollArea outer root. The internal ScrollArea Viewport is the actual
native scroll container, and its Content contains the consumer children.

### Props

```ts
type TilesScrollableTileProps<Area extends TilesArea = TilesArea> = TilesTileProps<Area>
```

`TilesScrollableTileProps` is a public export from `@powercoach/ui`.

| Prop               | Type                                                                  | Default     | Description                                                                                                                                                                                                |
| ------------------ | --------------------------------------------------------------------- | ----------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `area`             | `Area`                                                                | None        | Required non-empty, case-sensitive identity matched exactly against every supplied matrix. It must remain stable for the ScrollableTile's mounted lifetime.                                                |
| `theme`            | `"inherit" \| "inverse"`                                              | `"inherit"` | Keeps the nearest effective theme or inverts it for the shared surface, ScrollArea descendants, consumer children, and optional Stripes layer.                                                             |
| `stripesProps`     | `boolean \| TilesTileStripesProps`                                    | `undefined` | Uses the same optional Stripes contract as Tile. The decorative layer remains fixed outside the scrolling Viewport.                                                                                        |
| `children`         | `React.ReactNode`                                                     | None        | Content rendered once inside the internal ScrollArea Content container.                                                                                                                                    |
| `render`           | `ReactElement \| ((props: HTMLProps, state: object) => ReactElement)` | None        | Replaces the shared Tile and ScrollArea outer element using Base UI `useRender` semantics. The render state remains the empty Tiles state object.                                                          |
| `className`        | `string`                                                              | None        | Composes consumer classes on the shared outer surface. Component-owned positioning, containment, separator coordination, layer positioning, geometry transitions, and scrolling structure remain reserved. |
| `style`            | `React.CSSProperties`                                                 | None        | Applies consumer styles to the shared outer surface. Conflicting component-owned geometry, transition, or scrolling-structure declarations are unsupported.                                                |
| native `div` props | `React.ComponentPropsWithRef<"div">`                                  | None        | Native attributes, events, ARIA attributes, consumer data attributes, and ref pass through to the shared outer surface, except component-owned data attributes take precedence.                            |

ScrollableTile does not accept ScrollArea-specific configuration such as
`overflowEdgeThreshold`, state-function `className` or `style`, internal-part
props, Viewport props, or a Viewport ref. Changing the logical identity of a
mounted ScrollableTile requires a new `area` and React `key` under the same
contract as Tile.

Replacing `Tiles.Tile` with `Tiles.ScrollableTile`, or the reverse, changes the
React element type. React remounts the surface and its descendants; Tiles does
not preserve descendant focus, component-local state, ref identity, or scroll
position across that replacement. A newly mounted ScrollableTile begins at its
initial native scroll position.

### Events

ScrollableTile defines no custom events. Native events pass through to the
shared outer surface. The internal Viewport is not a public event or ref target,
and ScrollableTile exposes no imperative scrolling API.

### Data Attributes

ScrollableTile exposes the Tile attributes and the composed ScrollArea root
state attributes on its shared outer surface.

| Attribute               | Description                                                                                                                    |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| `data-area`             | Always contains the exact public `area` identity.                                                                              |
| `data-moving`           | Present while any component-owned `left`, `top`, `width`, or `height` transition is moving toward the newest target rectangle. |
| `data-has-overflow-x`   | Present when consumer content is wider than the internal Viewport.                                                             |
| `data-has-overflow-y`   | Present when consumer content is taller than the internal Viewport.                                                            |
| `data-overflow-x-start` | Present when horizontal overflow remains at the inline start.                                                                  |
| `data-overflow-x-end`   | Present when horizontal overflow remains at the inline end.                                                                    |
| `data-overflow-y-start` | Present when vertical overflow remains at the block start.                                                                     |
| `data-overflow-y-end`   | Present when vertical overflow remains at the block end.                                                                       |
| `data-scrolling`        | Present while the user scrolls inside ScrollableTile.                                                                          |

ScrollableTile owns these values. Consumer values for the same attributes do
not replace the component values. ScrollArea state is not added to the second
argument of the Tiles `render` function.

### CSS Variables

ScrollableTile inherits the Tiles motion variables and exposes the composed
ScrollArea root corner-size variables on its shared outer surface.

| Variable                      | Description                               |
| ----------------------------- | ----------------------------------------- |
| `--tiles-layout-duration`     | Inherited Tiles geometry-motion duration. |
| `--tiles-layout-easing`       | Inherited Tiles geometry-motion easing.   |
| `--scroll-area-corner-height` | The height of the scrollbar intersection. |
| `--scroll-area-corner-width`  | The width of the scrollbar intersection.  |

ScrollableTile does not expose ScrollArea's Viewport-only overflow-distance
variables or define another scrolling CSS variable.

## Accessibility

Root and Tile render `div` elements with no role by default. Tiles adds no
`grid`, `row`, `gridcell`, `list`, or other ARIA composite semantics and adds no
keyboard behavior.

Native attributes, consumer `data-*` attributes, and ARIA attributes pass
through to the rendered element, except the documented component-owned Tiles
attributes. When `render` replaces the default element, the rendered element
or custom component must forward the received ref and props. Consumers own
valid element relationships, native semantics, labeling, and HTML content.

Responsive matrix changes never change DOM or tab order. Consumers must keep
the direct Tile DOM order meaningful for reading and keyboard navigation in
every visual matrix. Tiles does not use `tabIndex`, `aria-flowto`, or another
mechanism to compensate for a contradictory visual order.

Tiles changes geometry on the same mounted elements. Focus, selection, and
component-local state remain intact during responsive reflow.

The internal separator network and Stripes layer are decorative,
`aria-hidden`, absent from tab order, and pointer-inert. Tile children remain
outside the hidden Stripes subtree so their semantics stay available.

ScrollableTile preserves the public ScrollArea native scrolling and
accessibility contract. Its internal Viewport becomes keyboard-focusable when
content overflows and remains outside the keyboard order when scrolling is not
needed. The Viewport retains its visible native focus indicator and native
keyboard, pointer, and touch scrolling. This conditional native scroll target
does not add grid semantics or a Tiles keyboard model.

## Behavior

### Responsive matrix selection

Each Root responds to its own content-box inline size, excluding its configured
Root border. ScrollableTile scroll position and scroll extent do not affect
that measurement. Root uses these Tailwind 4 container thresholds:

| Key   | Inclusive minimum width |
| ----- | ----------------------- |
| `3xs` | `16rem`                 |
| `2xs` | `18rem`                 |
| `xs`  | `20rem`                 |
| `sm`  | `24rem`                 |
| `md`  | `28rem`                 |
| `lg`  | `32rem`                 |
| `xl`  | `36rem`                 |
| `2xl` | `42rem`                 |
| `3xl` | `48rem`                 |
| `4xl` | `56rem`                 |
| `5xl` | `64rem`                 |
| `6xl` | `72rem`                 |
| `7xl` | `80rem`                 |

`base` is required and applies below the smallest supplied threshold. At any
other width, Root selects the supplied matrix with the greatest threshold less
than or equal to its current inline size. An omitted key inherits the nearest
supplied smaller matrix; it does not create a distinct `data-layout` value.
There is no hysteresis at a threshold.

The active matrix is authoritative. Its row count divides the Root inner
height into equal fractions, and its column count divides the Root inner width
into equal fractions. Tile content cannot expand a row or column. At rest,
every Tile exactly occupies its matrix rectangle and ratio.

### Frozen responsive selection

`frozen={true}` prevents viewport or container resizes from engaging another
breakpoint matrix. Root holds its engaged matrix, source `data-layout` value,
and normalized percentage values for each direct Tile's `left`, `top`, `width`,
and `height`. These percentages remain relative to the Root content box, so the
rendered pixel rectangles follow both dimensions of Root while preserving the
engaged matrix. A resize during the freeze changes no percentage target and
creates no component-owned transition, `data-moving`, or `data-animating`.

Every valid matrix rectangle remains between zero and one hundred percent of
the Root content box and uses border-box sizing. Frozen Tiles therefore do not
create geometric overflow or a scrollbar beyond Root. Oversized Tile content
may still clip, scroll, or overflow according to consumer styling, but Root
does not impose an overflow or scrolling style.

When `frozen` becomes `true` during an active layout transition, the freeze is
pending until that transition reaches its existing target. The engaged
percentage target and its `data-layout` do not change. Resizes observed while
the freeze is pending may change the rendered pixel rectangles passively, but
they neither select another matrix nor retarget the transition. On settlement,
the reached matrix and its percentages become the frozen state without a
second transition or motion state.

The initial measurable layout is always selected normally, including when
Root mounts with `frozen={true}`; its initial matrix and percentages then become
frozen without a transition.

Changing `layout` while frozen does not immediately engage the replacement.
Tiles still validates each received configuration completely against the
direct Tiles. An invalid configuration throws the normal descriptive Error
immediately and is never queued silently. A valid configuration becomes the
latest pending configuration, replacing any earlier pending value, while the
previously engaged matrix, `data-layout`, and proportional geometry remain
public. Other prop, theme, and content updates remain active while responsive
selection is frozen.

Changing `frozen` to `false` or `undefined` selects from the latest valid
configuration at the current Root content-box width. Root immediately engages
that matrix's source `data-layout` and percentage targets. Any Tile whose
rectangle differs uses the normal CSS transition and motion lifecycle. When
every Tile rectangle is already current, release creates no `data-animating`
or `data-moving`, even if `data-layout` changes because the identical matrix
comes from another source key or configuration.

If `frozen` returns to `false` or `undefined` before an active transition
settles, the pending freeze is canceled. Responsive selection resumes normally
and may retarget the transition from its current computed geometry.

Each Root freezes and resumes independently. Freezing an outer Root does not
freeze a nested Root, and freezing a nested Root does not affect its parent.

Replacing `layout` together with the complete set of direct Tile `area`
identities during a freeze has no additional atomic-preservation contract.

### Matrix and child validation

Tiles validates every supplied matrix, not only the active matrix, together
with the direct Tiles inside the nearest Root boundary.

A valid configuration satisfies all of these requirements:

- `base` is present.
- Every matrix contains at least one non-empty row.
- Every row in one matrix has the same positive column count.
- Every area is a non-empty, case-sensitive string.
- Every occurrence of one area fills its complete row-and-column bounding
  rectangle. Disconnected and L-shaped areas are invalid.
- Every direct Tile or ScrollableTile has a unique `area` across both types.
- Every supplied matrix contains exactly the set of direct Tile areas.
- Every direct Tile appears in every supplied matrix.
- Registration stops at the next nested Root, so nested Tiles never count as
  direct Tiles of an outer Root.

TypeScript requires `base`, restricts breakpoint keys, preserves readonly
matrix literals, and can share an inferred area union. Rectangularity, equal
row lengths, non-empty matrices, direct child correspondence, unique direct
areas, and mounted identity stability remain runtime constraints.

An invalid configuration is a programmer error. Tiles throws a descriptive
`Error` in every build before selecting or animating that configuration. The
message identifies the layout key and area when they apply. Tiles provides no
recoverable error callback and never repairs, drops, duplicates, or
automatically places an invalid area.

### Geometry, nesting, and consumer sizing

Root requires a definite, nonzero block size to divide rows and position real
Tile rectangles. Absolutely positioned Tiles do not give Root an intrinsic
auto height. Consumers provide height, aspect ratio, or equivalent external
geometry with `className`, `style`, or surrounding layout.

A Root establishes a local responsive boundary for its direct Tiles. A nested
Root responds to the available width of its containing Tile and registers only
its own direct Tiles. When an outer Tile width changes continuously, a nested
Root crosses its inclusive thresholds at the corresponding real widths and
may retarget more than once. Parent and nested transitions start according to
their own threshold crossings and may overlap.

Consumers choose whether content clips, scrolls, or remains visible through
overflow styling. Content may wrap, clip, scroll, or overflow while Tile width
and height interpolate. Tiles does not promise overflow-free arbitrary
content. Root sets no overflow or scrolling behavior. Its own valid Tile
geometry remains inside the content box both responsively and while frozen;
only consumer content or consumer styling may produce overflow.

Root and Tile own the positioning, containment, separator, layer, and
transition properties needed by this contract. Render replacements must accept
the positioned box geometry. Consumer declarations that replace the required
position or geometry transitions are unsupported.

### ScrollableTile composition and native overflow

ScrollableTile consumes ScrollArea through its public API rather than copying
its styles, markup, or behavior. The positioned Tile and ScrollArea outer root
are one shared element that owns Tile geometry, containment, theme, separator,
motion, render replacement, native props, ref, and public state attributes.
Consumer props are not duplicated onto the internal Viewport.

The internal Viewport fills the allocated Tile surface and remains the actual
native scroll container. Its Content contains the consumer children. Content
that exceeds the allocated width or height produces ScrollArea overflow on the
corresponding axis. ScrollArea always preassembles both axes and displays only
the axes that overflow, using its documented overlay scrollbar, native input,
focus, accessibility, visibility-motion, and reduced-motion contracts.

ScrollableTile geometry itself remains within its normalized Root rectangle.
Its scroll extent does not change the Root matrix, Tile percentages, separator
ownership, `data-layout`, `data-moving`, or `data-animating`. Scrolling alone
creates no Tiles motion state. The scrollbars reserve no gutter and do not
change Root breakpoint selection.

An optional Stripes layer remains a full-surface decorative sibling of the
Viewport, behind it and the consumer content. It does not move with the scroll
position or become part of the scroll extent. Nested native scroll regions use
browser-native scroll chaining; Tiles adds no containment or coordination
protocol.

### Themes, Stripes, and separators

`theme="inherit"` uses the effective theme immediately outside the part.
`theme="inverse"` changes light to dark or dark to light for that part and all
descendants that do not establish another theme boundary. A Tile resolves
relative to Root, and a nested Root resolves relative to its containing Tile.
Two successive inverse boundaries produce the original outside theme.

Changing a `theme` prop or a surrounding light or dark theme later recomputes
the effective semantic token mode without remounting Tile content. Tiles
promises the resulting `background`, `foreground`, and related semantic token
values, not an implementation class. Tiles defines no server-rendered or
pre-hydration theme guarantee.

Each Tile paints its semantic background and foreground under its effective
theme. Its optional empty Stripes layer fills the Tile behind children and
inherits that same theme. `stripesProps={true}` uses the complete public
Stripes defaults. The object form passes `angle`, `color`, `gap`, and `width`
through the public Stripes API. `undefined` and `false` render no Stripes layer.

ScrollableTile applies the same semantic surface and Stripes rules to its
shared outer element. Its internal ScrollArea adds no background, border,
radius, padding, or content-layout treatment.

At rest, Root owns one square outer perimeter and one square copy of every
internal area boundary. The public `border` value sets the uniform pixel width
of this complete network. The default `1` uses Tailwind `border-1` on the
perimeter and the matching one-pixel side utilities on separator owners. The
other supported values use the literal Tailwind `border-0`, `border-2`,
`border-4`, or `border-8` perimeter utility and matching side-width utilities.
Tiles do not each draw four complete borders.

`border={0}` removes the Root perimeter and every internal separator. For a
positive width, each direct Tile owns only the block-end and inline-end border
segments needed for its area, so every shared boundary still has exactly one
copy. Every network uses `border-border` from its effective Root theme,
including a separator shared by normal and inverse Tiles.

A nested Root that fills its containing Tile suppresses its own outer
perimeter. The parent Root network remains the single boundary around that
Tile, while the nested Root keeps its own internal separators at its own
configured `border` width. Each Root configures its network independently, and
a nested Root suppresses its perimeter even when its `border` differs from its
parent. A nested Root must fill the allocated Tile rectangle for this seamless
perimeter guarantee.

The network uses border-box sizing. Changing `border` does not alter matrix
ratios, separator ownership, or the `left`, `top`, `width`, and `height`
geometry contract. A thicker perimeter reduces the content box of a Root with
a fixed outside size and can therefore change which inclusive container
threshold applies; Tiles adds no compensating geometry.

During a topology-changing transition, moving rectangles may temporarily
overlap or expose gaps and the separator network is not guaranteed to remain a
perfect configured-width network at every frame. At each resting matrix, the
network returns to the documented single-copy geometry. DOM order determines
painting order during temporary overlap.

## Motion

Tiles uses CSS transitions. It does not use Motion and does not use transform
scale.

When the authoritative matrix target changes, every changed Tile transitions
its real geometry simultaneously:

| Property | Transition                                                |
| -------- | --------------------------------------------------------- |
| `left`   | `var(--tiles-layout-duration) var(--tiles-layout-easing)` |
| `top`    | `var(--tiles-layout-duration) var(--tiles-layout-easing)` |
| `width`  | `var(--tiles-layout-duration) var(--tiles-layout-easing)` |
| `height` | `var(--tiles-layout-duration) var(--tiles-layout-easing)` |

The default duration is `200ms` and the default easing is
`cubic-bezier(0.22, 1, 0.36, 1)`. Text, images, nested layout, and other Tile
content reflow against the real intermediate width and height instead of being
visually stretched.

Initial geometry, including the first measurable client layout, is committed
without transition. A Tile whose target rectangle does not change does not
enter motion state.

When a matrix change interrupts an active transition, CSS continues from the
current computed presentation geometry toward the newest target. A moving
Tile keeps `data-moving` across an immediate retarget and removes it only when
the newest component-owned target settles. Root keeps `data-animating` while
any direct Tile is moving.

Freezing does not pause, cancel, or shorten a transition already in flight.
That transition reaches its existing percentage target with the normal
lifecycle. Existing `data-moving` attributes remain until the normal completion
or cancellation of their component-owned properties, and `data-animating`
remains while at least one direct Tile is moving. While the freeze is pending,
the percentage endpoints remain relative to Root, so their rendered pixel
rectangles may follow a resizing Root. An ignored resize or valid pending
`layout` replacement does not select a new matrix, start a transition, or
retarget the active one. When the transition settles, its target percentages
become frozen without another transition or motion state.

A resize after the freeze settles passively changes rendered pixel rectangles
from the unchanged percentages. It does not start a geometry transition or
motion state. On release, any required catch-up to the current-width target in
the latest valid configuration uses this same CSS transition and lifecycle
contract. Identical rectangle targets create no motion even when their source
`data-layout` value changes. Releasing before an active transition settles
cancels the pending freeze and permits the normal responsive cycle to retarget
from the current computed geometry.

The lifecycle attributes do not appear for initial layout, unchanged geometry,
a zero effective duration, or reduced motion. Under
`prefers-reduced-motion: reduce`, every requested target applies immediately
and the configured normal duration is ignored.

Geometry changes caused only by an animating containing block do not
necessarily create a Tile-owned transition. `data-moving` describes a
component-owned matrix retarget, not every passive resize inherited from an
ancestor.

Transitions of `left`, `top`, `width`, and `height` use the browser layout and
paint path rather than a compositor-only transform path. Consumers should keep
matrix size and descendant rendering cost appropriate for a fast `200ms`
layout transition.

ScrollableTile uses the same Tiles CSS geometry transition and lifecycle as
Tile while its composed ScrollArea independently uses the CSS scrollbar
visibility motion defined by the ScrollArea specification. Scrolling or
scrollbar visibility does not start, stop, or retarget Tiles geometry motion.

## Use Cases

### UC-001 - Render named Tiles in an equal-cell matrix

Given a consumer renders Root with one valid base matrix and one direct Tile
for every area
When Tiles is displayed at rest
Then Root divides its inner rectangle into equal fractional rows and columns
and each Tile occupies its complete named rectangular area

### UC-002 - Validate the complete configuration

Given a supplied matrix is empty, ragged, disconnected, L-shaped, missing a
direct Tile, contains an area without a direct Tile, or Root has duplicate
direct areas
When Tiles validates the configuration
Then it throws a descriptive Error in every build before selecting or
animating that configuration and does not repair or automatically place areas

### UC-003 - Select and inherit container layouts

Given Root has base and any subset of the documented container breakpoint
matrices
When its content-box inline size changes
Then it selects the supplied matrix at the greatest inclusive threshold, uses
base below the first supplied threshold, and inherits across omitted keys

### UC-004 - Reflow a nested Root from local width

Given a Root fills a Tile inside another Root
When the containing Tile's real width crosses one or more inner thresholds
Then the nested Root retargets from its own local content-box width, tracks only
its direct Tiles, and may move simultaneously with the outer layout

### UC-005 - Move and resize real Tile boxes

Given the active matrix changes and a Tile's target rectangle changes
When layout motion runs
Then the same mounted Tile simultaneously transitions left, top, width, and
height with CSS while its content reflows and no transform scale is applied

### UC-006 - Handle initial, interrupted, and reduced motion

Given Tiles reaches its first measurable layout, receives a new target during
motion, has zero effective duration, or is displayed under reduced motion
When geometry is committed
Then initial and immediate cases do not animate, while an interrupted normal
transition continues from its current computed geometry to the newest target

### UC-007 - Expose layout and motion state

Given Root has selected a supplied matrix and one or more direct Tiles may be
moving
When consumers inspect the family attributes
Then Root exposes the source matrix key through data-layout, Root exposes
data-animating only for direct Tile motion, every Tile exposes its exact
data-area, and moving Tiles expose data-moving until their newest targets settle

### UC-008 - Preserve DOM order, focus, and local state

Given Tiles contain focused or stateful descendants
When a responsive matrix visually rearranges their Tiles
Then Tiles keep the same Tile elements mounted in consumer DOM order without
cloning, replacing, portaling, or moving their content in the DOM, so focus and
component-local state remain intact

### UC-009 - Draw one settled separator network

Given Root uses its default border and contains adjacent areas or a nested Root
fills a Tile
When each layout is at rest
Then Root owns one one-pixel border-border perimeter and one copy of each
internal separator, while the nested Root suppresses its perimeter and retains
its internal separators

### UC-010 - Inherit and invert effective theme

Given Root or Tile uses inherit or inverse in light or dark surroundings
When the local prop or surrounding theme changes
Then inherit keeps the outside effective theme, inverse toggles it reactively,
two successive inversions return to the outside theme, and shared separators
continue to use their owning Root theme

### UC-011 - Omit or configure decorative Stripes

Given Tile receives undefined, false, true, or an object through stripesProps
When Tile renders
Then it renders no Stripes, no Stripes, default Stripes, or configured Stripes
respectively as a full-surface decorative pointer-inert layer behind children

### UC-012 - Replace rendered elements

Given a consumer provides render to Root or Tile
When Tiles renders
Then the replacement element or component receives the merged native props and
ref while component-owned geometry, data attributes, and behavior remain active

### UC-013 - Preserve consumer semantics without grid behavior

Given a consumer provides meaningful DOM order, rendered elements, native
attributes, or ARIA attributes
When assistive technology and keyboard users encounter Tiles
Then those consumer semantics and tab order remain available while Tiles adds
no grid role, composite semantics, keyboard model, tabindex correction, or
aria-flowto correction

### UC-014 - Leave external geometry and overflow to the consumer

Given Root receives a definite nonzero block size and consumer overflow styles
When Tiles divide the Root, content reflows during motion, or Root resizes while
frozen
Then Root uses the supplied geometry, sets no overflow behavior, keeps its own
valid Tile rectangles inside its content box, leaves rows independent of
content, and lets content clip, scroll, or remain visible according to consumer
styling

### UC-015 - Keep area identity stable

Given a consumer needs to change the logical identity of a mounted Tile
When the consumer supplies a new area
Then the consumer also supplies a new React key so React remounts that Tile,
rather than mutating the stable identity of the existing mounted Tile

### UC-016 - Freeze and resume breakpoint reflow

Given Root has selected a valid layout and frozen may change before, during, or
after a resize-driven transition
When frozen becomes true, its viewport or container continues resizing, and
frozen later becomes false or undefined before or after settlement
Then the engaged percentage target accepts no later resize target, an existing
transition continues normally, release before settlement cancels only the
pending freeze and permits responsive retargeting, the settled matrix and
data-layout otherwise freeze while unchanged percentages continue to follow
Root without new motion state, and release transitions to the current
content-box target only when rectangles differ

### UC-017 - Configure the Root border network

Given a Root receives border 0, 1, 2, 4, or 8 and may fill a Tile inside a Root
with a different border value
When the layouts are at rest
Then each Root uses that Tailwind pixel width for its perimeter and single-copy
internal separators, border 0 removes its complete network, and a nested Root
keeps its configured internal separators while always suppressing its perimeter

### UC-018 - Hold and release layout replacements

Given Root is frozen and receives one or more valid replacement layout values
When those configurations arrive and frozen later becomes false or undefined
Then Tiles validates every replacement immediately, keeps only the latest one
pending while preserving the engaged matrix and data-layout, selects the
current-width matrix from that latest configuration on release, and creates
motion state only for Tile rectangles that actually differ

### UC-019 - Scroll overflowing content in a stable Tile type

Given a Root contains a ScrollableTile whose consumer content exceeds its
allocated rectangle and may also contain a normal Tile
When users interact through pointer, keyboard, or touch, inspect public state,
or the consumer replaces one Tile runtime type with the other
Then ScrollableTile participates in the complete Tile registration, geometry,
separator, theme, Stripes, and motion contracts, its internal Viewport provides
the public ScrollArea native scrolling and overlay scrollbar behavior, its
shared outer surface exposes the Tile and ScrollArea root states, its fixed
Stripes layer remains outside the scrolling subtree, and replacing Tile with
ScrollableTile or the reverse remounts the surface and descendants without
preserving focus, local state, ref identity, or scroll position
