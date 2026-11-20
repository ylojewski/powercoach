import { type Meta, type StoryObj } from '@storybook/react-vite'
import { Component, useState, type ReactNode } from 'react'

import { Tiles, type TilesLayout } from '../..'

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

const OUTER_LAYOUT = {
  base: [['main'], ['aside']],
  lg: [
    ['main', 'main', 'main', 'aside'],
    ['main', 'main', 'main', 'aside']
  ]
} as const satisfies TilesLayout<'main' | 'aside'>

const INNER_LAYOUT = {
  base: [['summary'], ['details']],
  sm: [['summary', 'details']]
} as const satisfies TilesLayout<'summary' | 'details'>

const THEME_LAYOUT = {
  base: [
    ['plain', 'inverse'],
    ['double', 'configured']
  ]
} as const satisfies TilesLayout<'plain' | 'inverse' | 'double' | 'configured'>

const SINGLE_TILE_LAYOUT = {
  base: [['content']]
} as const satisfies TilesLayout<'content'>

const SEMANTIC_LAYOUT = {
  base: [['counter'], ['action']],
  sm: [['action', 'counter']]
} as const satisfies TilesLayout<'counter' | 'action'>

const INVALID_LAYOUT = {
  base: [
    ['main', 'main'],
    ['main', 'aside']
  ]
} as const satisfies TilesLayout<'main' | 'aside'>

const FROZEN_LAYOUT = {
  base: [['main'], ['aside']],
  sm: [['main', 'aside']]
} as const satisfies TilesLayout<'main' | 'aside'>

const FROZEN_ALTERNATE_LAYOUT = {
  base: [['aside'], ['main']],
  sm: [['aside', 'main']]
} as const satisfies TilesLayout<'main' | 'aside'>

const FROZEN_IDENTICAL_REPLACEMENT_LAYOUT = {
  '3xs': [['main'], ['aside']],
  base: [['aside', 'main']]
} as const satisfies TilesLayout<'main' | 'aside'>

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

const SCROLLABLE_LAYOUT = {
  base: [['history'], ['summary']],
  sm: [['history', 'summary']]
} as const satisfies TilesLayout<'history' | 'summary'>

const BORDER_WIDTHS = [0, 1, 2, 4, 8] as const

const meta = {
  args: {
    border: 1,
    frozen: false,
    layout: DASHBOARD_LAYOUT,
    theme: 'inherit'
  },
  argTypes: {
    border: {
      control: 'inline-radio',
      options: BORDER_WIDTHS
    },
    children: {
      control: false
    },
    className: {
      control: 'text'
    },
    frozen: {
      control: 'boolean'
    },
    layout: {
      control: false
    },
    render: {
      control: false
    },
    style: {
      control: false
    },
    theme: {
      control: 'inline-radio',
      options: ['inherit', 'inverse']
    }
  },
  component: Tiles.Root,
  title: 'Components/Tiles'
} satisfies Meta<typeof Tiles.Root>

export default meta

type Story = StoryObj<typeof meta>

function MotionProbe() {
  return <span className="hidden text-xs group-data-[moving]/tile:inline">moving</span>
}

function FrozenMotionProbe({ label }: { label: 'aside' | 'main' }) {
  return (
    <>
      <span className="group-data-[moving]/tile:hidden">{label}: settled</span>
      <span className="hidden group-data-[moving]/tile:inline">{label}: moving</span>
    </>
  )
}

function ScrollableMotionProbe({ label }: { label: 'history' | 'summary' }) {
  return (
    <>
      <span className="group-data-[moving]/tile:hidden">{label}: settled</span>
      <span className="hidden group-data-[moving]/tile:inline">{label}: moving</span>
    </>
  )
}

function ThemeSample({ label }: { label: string }) {
  return (
    <section>
      <h2 className="mb-2 font-heading text-lg lowercase">{label}</h2>
      <Tiles.Root layout={THEME_LAYOUT} className="h-64">
        <Tiles.Tile area="plain" stripesProps={false} className="p-4">
          Plain
        </Tiles.Tile>
        <Tiles.Tile area="inverse" theme="inverse" stripesProps className="p-4">
          Inverse with default Stripes
        </Tiles.Tile>
        <Tiles.Tile area="double" theme="inverse">
          <Tiles.Root layout={SINGLE_TILE_LAYOUT} theme="inverse" className="h-full w-full">
            <Tiles.Tile area="content" className="p-4">
              Double inversion
            </Tiles.Tile>
          </Tiles.Root>
        </Tiles.Tile>
        <Tiles.Tile
          area="configured"
          stripesProps={{ angle: '45deg', color: 'currentColor', gap: '6px', width: '2px' }}
          className="p-4"
        >
          Configured Stripes
        </Tiles.Tile>
      </Tiles.Root>
    </section>
  )
}

function HistoryContent() {
  const [count, setCount] = useState(0)

  return (
    <div className="grid h-[30rem] w-[36rem] content-start gap-4 p-4">
      <button
        type="button"
        className="w-fit border border-foreground px-3 py-2"
        onClick={() => setCount((value) => value + 1)}
      >
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

class StoryErrorBoundary extends Component<{ children: ReactNode }, { message: string | null }> {
  state = { message: null as string | null }

  static getDerivedStateFromError(error: unknown) {
    return { message: error instanceof Error ? error.message : 'Unknown Tiles error' }
  }

  render() {
    if (this.state.message !== null) {
      return (
        <output className="block border border-border bg-background p-4 text-foreground">
          {this.state.message}
        </output>
      )
    }

    return this.props.children
  }
}

export const Ex001ResponsiveThreeQuarterMatrix = {
  name: 'EX-001 - Responsive Three-quarter Matrix',
  parameters: {
    layout: 'fullscreen'
  },
  render: (args) => (
    <Tiles.Root {...args} layout={DASHBOARD_LAYOUT} className="group/tiles h-[36rem] w-full">
      <Tiles.Tile area="main" className="group/tile p-4">
        <strong>Main</strong>
        <div className="text-xs">
          <span className="hidden group-data-[layout=base]/tiles:inline">base</span>
          <span className="hidden group-data-[layout=sm]/tiles:inline">sm</span>
          <span className="hidden group-data-[layout=lg]/tiles:inline">lg</span>
          {' · '}
          <span className="hidden group-data-[animating]/tiles:inline">root animating · </span>
          <MotionProbe />
        </div>
      </Tiles.Tile>
      <Tiles.Tile area="aside" className="group/tile p-4">
        Aside <MotionProbe />
      </Tiles.Tile>
      <Tiles.Tile area="secondary" className="group/tile p-4">
        Secondary <MotionProbe />
      </Tiles.Tile>
      <Tiles.Tile area="footer" className="group/tile p-4">
        Footer <MotionProbe />
      </Tiles.Tile>
    </Tiles.Root>
  )
} satisfies Story

export const Ex002NestedLocalReflow = {
  name: 'EX-002 - Nested Local Reflow',
  render: (args) => (
    <div className="h-[32rem] w-[42rem] max-w-full min-w-64 resize-x overflow-auto border-8 border-border p-8">
      <Tiles.Root {...args} layout={OUTER_LAYOUT} className="group/outer h-full w-full">
        <Tiles.Tile area="main" className="group/outer-main">
          <div className="pointer-events-none absolute inset-x-2 top-2 z-20 bg-background/90 p-2 text-xs">
            outer root: <span className="group-data-[animating]/outer:hidden">idle</span>
            <span className="hidden group-data-[animating]/outer:inline">animating</span>
            {' · '}main tile: <span className="group-data-[moving]/outer-main:hidden">settled</span>
            <span className="hidden group-data-[moving]/outer-main:inline">moving</span>
          </div>
          <Tiles.Root layout={INNER_LAYOUT} className="group/inner h-full w-full">
            <Tiles.Tile area="summary" className="group/inner-summary p-4 pt-14">
              Summary
              <span className="ml-2 hidden text-xs group-data-[layout=base]/inner:inline">
                stacked
              </span>
              <span className="ml-2 hidden text-xs group-data-[layout=sm]/inner:inline">
                side by side
              </span>
              <div className="text-xs">
                inner root: <span className="group-data-[animating]/inner:hidden">idle</span>
                <span className="hidden group-data-[animating]/inner:inline">animating</span>
                {' · '}summary tile:{' '}
                <span className="group-data-[moving]/inner-summary:hidden">settled</span>
                <span className="hidden group-data-[moving]/inner-summary:inline">moving</span>
              </div>
            </Tiles.Tile>
            <Tiles.Tile area="details" className="group/inner-details p-4 pt-14">
              Details
              <div className="text-xs">
                details tile:{' '}
                <span className="group-data-[moving]/inner-details:hidden">settled</span>
                <span className="hidden group-data-[moving]/inner-details:inline">moving</span>
              </div>
            </Tiles.Tile>
          </Tiles.Root>
        </Tiles.Tile>
        <Tiles.Tile area="aside" className="group/outer-aside p-4">
          Aside
          <div className="text-xs">
            aside tile: <span className="group-data-[moving]/outer-aside:hidden">settled</span>
            <span className="hidden group-data-[moving]/outer-aside:inline">moving</span>
          </div>
        </Tiles.Tile>
      </Tiles.Root>
    </div>
  )
} satisfies Story

export const Ex003ThemeSeparatorsAndStripesMatrix = {
  name: 'EX-003 - Theme, Separators, And Stripes Matrix',
  render: () => (
    <div className="grid gap-8">
      <div className="light bg-background p-4 text-foreground">
        <ThemeSample label="Light surroundings" />
      </div>
      <div className="dark bg-background p-4 text-foreground">
        <ThemeSample label="Dark surroundings" />
      </div>
    </div>
  )
} satisfies Story

export const Ex004SemanticRenderAndPreservedInteractionState = {
  name: 'EX-004 - Semantic Render And Preserved Interaction State',
  render: (args) => {
    const [count, setCount] = useState(0)

    return (
      <div className="h-64 w-[42rem] max-w-full min-w-64 resize-x overflow-auto border-8 border-border p-8">
        <Tiles.Root
          {...args}
          layout={SEMANTIC_LAYOUT}
          render={<section aria-labelledby="tile-section-title" />}
          className="h-full w-full"
        >
          <Tiles.Tile
            area="counter"
            render={<article aria-labelledby="tile-section-title" />}
            className="p-4"
          >
            <h2 id="tile-section-title" className="font-heading text-lg lowercase">
              Persistent counter
            </h2>
            <button
              type="button"
              className="mt-2 border border-foreground px-3 py-2"
              onClick={() => setCount((value) => value + 1)}
            >
              Count {count}
            </button>
          </Tiles.Tile>
          <Tiles.Tile area="action" render={<article />} className="p-4">
            <h2 className="font-heading text-lg lowercase">Focused action</h2>
            <button type="button" className="mt-2 border border-foreground px-3 py-2">
              Keep focus while resizing
            </button>
          </Tiles.Tile>
        </Tiles.Root>
      </div>
    )
  }
} satisfies Story

export const Ex005InvalidMatrixError = {
  name: 'EX-005 - Invalid Matrix Error',
  render: () => (
    <StoryErrorBoundary>
      <Tiles.Root layout={INVALID_LAYOUT} className="h-48">
        <Tiles.Tile area="main">Main</Tiles.Tile>
        <Tiles.Tile area="aside">Aside</Tiles.Tile>
      </Tiles.Root>
    </StoryErrorBoundary>
  )
} satisfies Story

export const Ex006FrozenResponsiveReflow = {
  name: 'EX-006 - Frozen Responsive Reflow',
  render: () => {
    const [frozen, setFrozen] = useState(true)
    const [boundaryVersion, setBoundaryVersion] = useState(0)
    const [layoutMode, setLayoutMode] = useState<
      'alternate' | 'identical' | 'invalid' | 'original'
    >('original')

    const layout =
      layoutMode === 'alternate'
        ? FROZEN_ALTERNATE_LAYOUT
        : layoutMode === 'identical'
          ? FROZEN_IDENTICAL_REPLACEMENT_LAYOUT
          : layoutMode === 'invalid'
            ? INVALID_FROZEN_REPLACEMENT_LAYOUT
            : FROZEN_LAYOUT

    return (
      <div className="grid gap-3">
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            className="w-fit border border-foreground px-3 py-2"
            onClick={() => setFrozen((value) => !value)}
          >
            {frozen ? 'Resume responsive reflow' : 'Freeze responsive reflow'}
          </button>
          <button
            type="button"
            className="w-fit border border-foreground px-3 py-2"
            onClick={() =>
              setLayoutMode((value) => (value === 'alternate' ? 'original' : 'alternate'))
            }
          >
            {layoutMode === 'alternate' ? 'Use original layout' : 'Use alternate layout'}
          </button>
          <button
            type="button"
            className="w-fit border border-foreground px-3 py-2"
            onClick={() => {
              setFrozen(true)
              setLayoutMode('identical')
            }}
          >
            Queue identical rectangles
          </button>
          <button
            type="button"
            className="w-fit border border-foreground px-3 py-2"
            onClick={() => {
              setFrozen(true)
              setLayoutMode('invalid')
            }}
          >
            Use invalid layout replacement
          </button>
          <button
            type="button"
            className="w-fit border border-foreground px-3 py-2"
            onClick={() => {
              setFrozen(true)
              setLayoutMode('original')
              setBoundaryVersion((value) => value + 1)
            }}
          >
            Reset frozen example
          </button>
        </div>
        <output>
          {frozen ? 'Frozen' : 'Responsive'} ·{' '}
          {layoutMode === 'alternate'
            ? 'alternate layout prop'
            : layoutMode === 'identical'
              ? 'identical rectangles queued'
              : layoutMode === 'invalid'
                ? 'invalid layout replacement'
                : 'original layout prop'}
        </output>
        <div className="h-64 w-[42rem] max-w-full min-w-64 resize-x overflow-auto border-8 border-border p-8">
          <StoryErrorBoundary key={boundaryVersion}>
            <Tiles.Root className="group/freeze h-full w-full" frozen={frozen} layout={layout}>
              <Tiles.Tile area="main" className="group/tile p-4 pt-14">
                <div className="pointer-events-none absolute inset-x-2 top-2 z-20 bg-background/90 p-2 text-xs">
                  <span className="hidden group-data-[layout=3xs]/freeze:inline">layout: 3xs</span>
                  <span className="hidden group-data-[layout=base]/freeze:inline">
                    layout: base
                  </span>
                  <span className="hidden group-data-[layout=sm]/freeze:inline">layout: sm</span>
                  {' · '}
                  <span className="group-data-[animating]/freeze:hidden">root: idle</span>
                  <span className="hidden group-data-[animating]/freeze:inline">
                    root: animating
                  </span>
                </div>
                Main · <FrozenMotionProbe label="main" />
              </Tiles.Tile>
              <Tiles.Tile area="aside" className="group/tile p-4 pt-14">
                Aside · <FrozenMotionProbe label="aside" />
              </Tiles.Tile>
            </Tiles.Root>
          </StoryErrorBoundary>
        </div>
      </div>
    )
  }
} satisfies Story

export const Ex007ConfigurableBorderNetworks = {
  name: 'EX-007 - Configurable Border Networks',
  render: () => (
    <div className="grid gap-6">
      {BORDER_WIDTHS.map((border) => (
        <section key={border}>
          <h2 className="mb-2 font-heading text-lg lowercase">Border {border}px</h2>
          <Tiles.Root border={border} layout={BORDER_LAYOUT} className="h-20">
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
        <h2 className="mb-2 font-heading text-lg lowercase">Nested border networks</h2>
        <Tiles.Root border={2} layout={NESTED_BORDER_LAYOUT} className="h-40">
          <Tiles.Tile area="nested">
            <Tiles.Root border={4} layout={INNER_BORDER_LAYOUT} className="h-full w-full">
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
} satisfies Story

export const Ex008ScrollableTileSurfaceAndRemountBoundary = {
  name: 'EX-008 - Scrollable Tile Surface And Remount Boundary',
  render: () => {
    const [scrollable, setScrollable] = useState(true)

    return (
      <div className="grid gap-3">
        <button
          type="button"
          className="w-fit border border-foreground px-3 py-2"
          onClick={() => setScrollable((value) => !value)}
        >
          {scrollable ? 'Use normal Tile' : 'Use ScrollableTile'}
        </button>
        <output>{scrollable ? 'ScrollableTile mounted' : 'Normal Tile mounted'}</output>
        <div className="h-64 w-[42rem] max-w-full min-w-64 resize-x overflow-auto border-8 border-border p-8">
          <Tiles.Root layout={SCROLLABLE_LAYOUT} className="group/scrollable h-full w-full">
            {scrollable ? (
              <Tiles.ScrollableTile
                area="history"
                stripesProps
                className="group/history group/tile"
              >
                <div className="relative">
                  <div className="pointer-events-none sticky top-2 z-20 m-2 w-fit bg-background/90 p-2 text-xs">
                    <ScrollableMotionProbe label="history" />
                    {' · '}
                    <span className="hidden group-data-[has-overflow-x]/history:inline">
                      horizontal overflow
                    </span>
                    {' · '}
                    <span className="hidden group-data-[has-overflow-y]/history:inline">
                      vertical overflow
                    </span>
                  </div>
                  <HistoryContent />
                </div>
              </Tiles.ScrollableTile>
            ) : (
              <Tiles.Tile area="history" stripesProps className="group/tile p-4">
                <ScrollableMotionProbe label="history" />
                <HistoryContent />
              </Tiles.Tile>
            )}
            <Tiles.Tile area="summary" className="group/tile p-4 pt-14">
              <div className="pointer-events-none absolute inset-x-2 top-2 z-20 bg-background/90 p-2 text-xs">
                <span className="hidden group-data-[layout=base]/scrollable:inline">
                  layout: base
                </span>
                <span className="hidden group-data-[layout=sm]/scrollable:inline">layout: sm</span>
                {' · '}
                <span className="group-data-[animating]/scrollable:hidden">root: idle</span>
                <span className="hidden group-data-[animating]/scrollable:inline">
                  root: animating
                </span>
              </div>
              Summary · <ScrollableMotionProbe label="summary" />
            </Tiles.Tile>
          </Tiles.Root>
        </div>
      </div>
    )
  }
} satisfies Story
