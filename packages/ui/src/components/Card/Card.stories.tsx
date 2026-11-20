import { type Meta, type StoryObj } from '@storybook/react-vite'
import { Activity, AlignLeft, Dumbbell, Sparkles, Waves } from 'lucide-react'
import { useCallback, useState } from 'react'

import { Button, Card, Text } from '../..'

const meta = {
  args: {
    size: 'md'
  },
  argTypes: {
    children: {
      control: false
    },
    className: {
      control: 'text'
    },
    render: {
      control: false
    },
    size: {
      control: 'inline-radio',
      options: ['xs', 'md', 'xl']
    },
    style: {
      control: false
    }
  },
  component: Card.Root,
  title: 'Components/Card'
} satisfies Meta<typeof Card.Root>

export default meta

type Story = StoryObj<typeof meta>

export const Ex002CompleteCardSizeScale = {
  name: 'EX-002 - Complete Card Size Scale',
  render: () => (
    <div className="grid gap-8 lg:grid-cols-3">
      <Card.Root className="min-h-80" size="xs">
        <Card.Surface>
          <Card.Visual icon={<Dumbbell aria-hidden="true" />} />
          <Card.Header>
            <Card.Title>Extra small Card</Card.Title>
            <Card.Description>Heading sm · Text xs · no gap</Card.Description>
          </Card.Header>
          <Card.Content>
            <Text size="xs">Aligned xs content</Text>
          </Card.Content>
          <Card.Footer>
            <Text size="xs">Card xs</Text>
            <Card.Button type="button">Button xs</Card.Button>
          </Card.Footer>
        </Card.Surface>
      </Card.Root>

      <Card.Root className="min-h-80">
        <Card.Surface>
          <Card.Visual icon={<Dumbbell aria-hidden="true" />} />
          <Card.Header>
            <Card.Title>Default Card</Card.Title>
            <Card.Description>Heading lg · Text sm · gap-1</Card.Description>
          </Card.Header>
          <Card.Content>
            <Text size="sm">Aligned md content</Text>
          </Card.Content>
          <Card.Footer>
            <Text size="sm">Card md</Text>
            <Card.Button type="button">Button md</Card.Button>
          </Card.Footer>
        </Card.Surface>
      </Card.Root>

      <Card.Root className="min-h-80" size="xl">
        <Card.Surface>
          <Card.Visual icon={<Dumbbell aria-hidden="true" />} />
          <Card.Header>
            <Card.Title render={<h2 />}>From Scratch</Card.Title>
            <Card.Description render={<p />}>Heading xl · Text md · gap-2</Card.Description>
          </Card.Header>
          <Card.Content>
            <Text>Aligned xl content</Text>
          </Card.Content>
          <Card.Footer>
            <Text>Blank build</Text>
            <Card.Button type="button">Button lg</Card.Button>
          </Card.Footer>
        </Card.Surface>
      </Card.Root>
    </div>
  )
} satisfies Story

export const Uc003TitleAndDescriptionTypographyAndSpacing = {
  name: 'UC-003 - Title And Description Typography And Spacing',
  render: () => (
    <div className="grid gap-4">
      <Text render={<output />}>
        Header gaps: xs none, md gap-1, xl gap-2. The fourth Card shows that an explicit Title size
        changes typography without changing the xs gap.
      </Text>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <Card.Root className="min-h-56" size="xs">
          <Card.Surface>
            <Card.Header>
              <Card.Title render={<h2 />}>Derived Heading sm</Card.Title>
              <Card.Description>Text xs · no gap</Card.Description>
            </Card.Header>
          </Card.Surface>
        </Card.Root>

        <Card.Root className="min-h-56">
          <Card.Surface>
            <Card.Header>
              <Card.Title render={<h2 />}>Derived Heading lg</Card.Title>
              <Card.Description>Text sm · gap-1</Card.Description>
            </Card.Header>
          </Card.Surface>
        </Card.Root>

        <Card.Root className="min-h-56" size="xl">
          <Card.Surface>
            <Card.Header>
              <Card.Title render={<h2 />}>Derived Heading xl</Card.Title>
              <Card.Description>Text md · gap-2</Card.Description>
            </Card.Header>
          </Card.Surface>
        </Card.Root>

        <Card.Root className="min-h-56" size="xs">
          <Card.Surface>
            <Card.Header>
              <Card.Title render={<h2 />} size="lg">
                Explicit Heading lg
              </Card.Title>
              <Card.Description>Text xs · no gap retained</Card.Description>
            </Card.Header>
          </Card.Surface>
        </Card.Root>
      </div>
    </div>
  )
} satisfies Story

export const Ex003ControlledSelectionAndIndependentFooterAction = {
  name: 'EX-003 - Controlled Selection And Independent Footer Action',
  render: () => {
    const [actions, setActions] = useState(0)
    const [method, setMethod] = useState('template')

    return (
      <div className="grid gap-4">
        <Text render={<output />}>selected: {method}</Text>
        <Text render={<output />}>footer actions: {actions}</Text>

        <Card.Group
          aria-label="Exercise creation method"
          className="grid gap-6 md:grid-cols-2"
          onValueChange={setMethod}
          value={method}
        >
          <Card.Root>
            <Card.Selector aria-label="Template" value="template" />
            <Card.Surface>
              <Card.Header>
                <Card.Title render={<h2 />}>Template</Card.Title>
                <Card.Description render={<p />}>
                  Start with an existing structure.
                </Card.Description>
              </Card.Header>
              <Card.Footer>
                <Text tone="muted">Guided build</Text>
                <Card.Button type="button" onClick={() => setActions((count) => count + 1)}>
                  Preview
                </Card.Button>
              </Card.Footer>
            </Card.Surface>
          </Card.Root>

          <Card.Root>
            <Card.Selector aria-label="From Scratch" value="from-scratch" />
            <Card.Surface>
              <Card.Header>
                <Card.Title render={<h2 />}>From Scratch</Card.Title>
                <Card.Description render={<p />}>Start from an empty exercise.</Card.Description>
              </Card.Header>
              <Card.Footer>
                <Text tone="muted">Blank build</Text>
                <Card.Button type="button" onClick={() => setActions((count) => count + 1)}>
                  Preview
                </Card.Button>
              </Card.Footer>
            </Card.Surface>
          </Card.Root>
        </Card.Group>
      </div>
    )
  }
} satisfies Story

export const Ex004UncontrolledSelection = {
  name: 'EX-004 - Uncontrolled Selection',
  render: () => {
    const [observedValue, setObservedValue] = useState('no change yet')

    return (
      <div className="grid gap-4">
        <Text render={<output />}>observed change: {observedValue}</Text>
        <Card.Group
          aria-label="Program source"
          className="grid gap-6 md:grid-cols-2"
          defaultValue="coach"
          onValueChange={setObservedValue}
        >
          <Card.Root>
            <Card.Selector aria-label="Coach plan" value="coach" />
            <Card.Surface>
              <Card.Header>
                <Card.Title>Coach plan</Card.Title>
                <Card.Description>Start from a coach plan.</Card.Description>
              </Card.Header>
            </Card.Surface>
          </Card.Root>

          <Card.Root>
            <Card.Selector aria-label="Blank plan" value="blank" />
            <Card.Surface>
              <Card.Header>
                <Card.Title>Blank plan</Card.Title>
                <Card.Description>Start without a template.</Card.Description>
              </Card.Header>
            </Card.Surface>
          </Card.Root>
        </Card.Group>
      </div>
    )
  }
} satisfies Story

export const Ex005FlowAndOverlayVisualPlacement = {
  name: 'EX-005 - Flow And Overlay Visual Placement',
  render: () => (
    <div className="grid gap-8 md:grid-cols-2">
      <Card.Root className="min-h-96">
        <Card.Surface>
          <Card.Visual icon={<Waves aria-hidden="true" />}>Flow visual</Card.Visual>
          <Card.Header>
            <Card.Title render={<h2 />}>Flow</Card.Title>
            <Card.Description render={<p />}>
              The visual contributes to this Card&apos;s layout.
            </Card.Description>
          </Card.Header>
          <Card.Content>
            <Text>Flow content axis</Text>
          </Card.Content>
          <Card.Footer>
            <Text tone="muted">Flow placement</Text>
            <Card.Button type="button">Inspect</Card.Button>
          </Card.Footer>
        </Card.Surface>
      </Card.Root>

      <Card.Root className="min-h-96">
        <Card.Surface>
          <Card.Visual aria-hidden="true" placement="overlay" />
          <Card.Header>
            <Card.Title render={<h2 />}>Overlay</Card.Title>
            <Card.Description render={<p />}>
              The visual covers the Card without determining its height.
            </Card.Description>
          </Card.Header>
          <Card.Content>
            <Text>Normal-flow content remains above the overlay.</Text>
          </Card.Content>
          <Card.Footer>
            <Text tone="muted">Overlay placement</Text>
            <Card.Button type="button">Inspect</Card.Button>
          </Card.Footer>
        </Card.Surface>
      </Card.Root>
    </div>
  )
} satisfies Story

export const Ex006StripesAndIconContentMatrix = {
  name: 'EX-006 - Stripes And Icon Content Matrix',
  render: () => (
    <div className="grid gap-8 md:grid-cols-3">
      <Card.Root>
        <Card.Surface>
          <Card.Visual icon={<Activity aria-hidden="true" />}>Default Stripes</Card.Visual>
          <Card.Header>
            <Card.Title>Default</Card.Title>
          </Card.Header>
        </Card.Surface>
      </Card.Root>

      <Card.Root>
        <Card.Surface>
          <Card.Visual
            icon={<Activity aria-label="Training activity" />}
            stripesProps={{
              angle: '45deg',
              className: 'text-muted-foreground',
              color: 'currentColor',
              gap: '6px',
              width: '2px'
            }}
          >
            Customized Stripes
          </Card.Visual>
          <Card.Header>
            <Card.Title>Customized</Card.Title>
          </Card.Header>
        </Card.Surface>
      </Card.Root>

      <Card.Root>
        <Card.Surface>
          <Card.Visual icon={<span>PC</span>} stripesProps={false}>
            No Stripes
          </Card.Visual>
          <Card.Header>
            <Card.Title>Arbitrary node</Card.Title>
          </Card.Header>
        </Card.Surface>
      </Card.Root>
    </div>
  )
} satisfies Story

export const Ex007InheritedCardButtonAndDirectButton = {
  name: 'EX-007 - Inherited Card.Button And Direct Button',
  render: () => (
    <Card.Root>
      <Card.Surface>
        <Card.Header>
          <Card.Title>Button sizing</Card.Title>
          <Card.Description>Compare inherited and explicit sizing.</Card.Description>
        </Card.Header>
        <Card.Footer>
          <Text tone="muted">Default Card md</Text>
          <div className="flex gap-2">
            <Card.Button type="button">Inherited md</Card.Button>
            <Button type="button" size="md">
              Direct explicit md
            </Button>
          </div>
        </Card.Footer>
      </Card.Surface>
    </Card.Root>
  )
} satisfies Story

export const Ex008DarkSelectedAndKeyboardFocusInspection = {
  name: 'EX-008 - Dark Selected And Keyboard Focus Inspection',
  render: () => (
    <div className="dark bg-background p-8 text-foreground">
      <Card.Group
        aria-label="Dark creation method"
        className="grid gap-6 md:grid-cols-2"
        defaultValue="blank"
      >
        <Card.Root className="min-h-80" size="xl">
          <Card.Selector aria-label="From Scratch" autoFocus value="blank" />
          <Card.Surface>
            <Card.Visual icon={<Sparkles aria-hidden="true" />} />
            <Card.Header>
              <Card.Title render={<h2 />}>From Scratch</Card.Title>
              <Card.Description render={<p />}>
                Use Tab and arrow-key navigation to inspect focus.
              </Card.Description>
            </Card.Header>
            <Card.Content>
              <Text>Selected content uses the revealed token mode.</Text>
            </Card.Content>
            <Card.Footer>
              <Text tone="muted">Selected in dark theme</Text>
              <Card.Button type="button">Next</Card.Button>
            </Card.Footer>
          </Card.Surface>
        </Card.Root>

        <Card.Root className="min-h-80" size="xl">
          <Card.Selector aria-label="Template" value="template" />
          <Card.Surface>
            <Card.Visual icon={<Dumbbell aria-hidden="true" />} />
            <Card.Header>
              <Card.Title render={<h2 />}>Template</Card.Title>
              <Card.Description render={<p />}>
                Use arrow keys to move selection and inspect both directions.
              </Card.Description>
            </Card.Header>
            <Card.Content>
              <Text>The tile edge remains on the shared axis during the reveal.</Text>
            </Card.Content>
            <Card.Footer>
              <Text tone="muted">Unselected in dark theme</Text>
              <Card.Button type="button">Next</Card.Button>
            </Card.Footer>
          </Card.Surface>
        </Card.Root>
      </Card.Group>
    </div>
  )
} satisfies Story

export const Ex009DisabledAndReadOnlyGroups = {
  name: 'EX-009 - Disabled And Read-Only Groups',
  render: () => (
    <div className="grid gap-8 md:grid-cols-2">
      <section className="grid gap-2">
        <Text id="disabled-group-label">Disabled selection group</Text>
        <Card.Group aria-labelledby="disabled-group-label" defaultValue="locked" disabled>
          <Card.Root>
            <Card.Selector aria-label="Locked method" value="locked" />
            <Card.Surface>
              <Card.Header>
                <Card.Title>Locked method</Card.Title>
                <Card.Description>Group interaction is disabled.</Card.Description>
              </Card.Header>
            </Card.Surface>
          </Card.Root>
          <Card.Root>
            <Card.Selector aria-label="Blocked method" value="blocked" />
            <Card.Surface>
              <Card.Header>
                <Card.Title>Blocked method</Card.Title>
                <Card.Description>Hover remains at the idle target.</Card.Description>
              </Card.Header>
            </Card.Surface>
          </Card.Root>
        </Card.Group>
      </section>

      <section className="grid gap-2">
        <Text id="readonly-group-label">Read-only selection group</Text>
        <Card.Group aria-labelledby="readonly-group-label" defaultValue="fixed" readOnly>
          <Card.Root>
            <Card.Selector aria-label="Fixed method" value="fixed" />
            <Card.Surface>
              <Card.Header>
                <Card.Title>Fixed method</Card.Title>
                <Card.Description>Selection is visible but cannot change.</Card.Description>
              </Card.Header>
            </Card.Surface>
          </Card.Root>
          <Card.Root>
            <Card.Selector aria-label="Alternate method" value="alternate" />
            <Card.Surface>
              <Card.Header>
                <Card.Title>Alternate method</Card.Title>
                <Card.Description>Hover remains at the idle target.</Card.Description>
              </Card.Header>
            </Card.Surface>
          </Card.Root>
        </Card.Group>
      </section>
    </div>
  )
} satisfies Story

export const Ex010NearestRootCardButtonInheritance = {
  name: 'EX-010 - Nearest Root Card.Button Inheritance',
  render: () => (
    <Card.Root size="xl">
      <Card.Surface>
        <Card.Header>
          <Card.Title>Outer extra large Card</Card.Title>
        </Card.Header>
        <Card.Content>
          <Card.Root size="xs">
            <Card.Surface>
              <Card.Header>
                <Card.Title>Nested extra small Card</Card.Title>
              </Card.Header>
              <Card.Footer>
                <Text size="xs">Nearest Root xs</Text>
                <Card.Button type="button">Button xs</Card.Button>
              </Card.Footer>
            </Card.Surface>
          </Card.Root>
        </Card.Content>
        <Card.Footer>
          <Text>Outer Root xl</Text>
          <Card.Button type="button">Button lg</Card.Button>
        </Card.Footer>
      </Card.Surface>
    </Card.Root>
  )
} satisfies Story

export const Ex011PreservedButtonRenderAndLoadingBehavior = {
  name: 'EX-011 - Preserved Button Render And Loading Behavior',
  render: () => {
    const [renderedMarker, setRenderedMarker] = useState('waiting')
    const renderedButtonRef = useCallback((node: HTMLButtonElement | null) => {
      if (node !== null) {
        setRenderedMarker(node.dataset.rendered ?? 'missing')
      }
    }, [])

    return (
      <Card.Root>
        <Card.Surface>
          <Card.Header>
            <Card.Title>Preserved Button behavior</Card.Title>
          </Card.Header>
          <Card.Content>
            <Text render={<output />}>rendered replacement: {renderedMarker}</Text>
          </Card.Content>
          <Card.Footer>
            <Text tone="muted">Default Root md</Text>
            <div className="flex gap-2">
              <Card.Button
                type="button"
                render={<button data-rendered="card-button" ref={renderedButtonRef} />}
              >
                Rendered Button md
              </Card.Button>
              <Card.Button loading type="button">
                Loading Button md
              </Card.Button>
            </div>
          </Card.Footer>
        </Card.Surface>
      </Card.Root>
    )
  }
} satisfies Story

export const Ex012CardButtonOutsideRootFallback = {
  name: 'EX-012 - Card.Button Outside Root Fallback',
  render: () => (
    <div className="grid gap-2">
      <Text tone="muted">Outside Root fallback: Button md</Text>
      <Card.Button type="button">Fallback Button md</Card.Button>
    </div>
  )
} satisfies Story

export const Ex013SharedInlineStartAxis = {
  name: 'EX-013 - Shared Inline-Start Axis',
  render: () => (
    <div className="grid gap-8 lg:grid-cols-3">
      <Card.Root className="min-h-72" size="xs">
        <Card.Surface>
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 start-2 z-50 border-s border-dashed border-primary"
          />
          <Card.Visual icon={<AlignLeft aria-hidden="true" />} />
          <Card.Header>
            <Card.Title>Extra small axis</Card.Title>
            <Card.Description>spacing-2</Card.Description>
          </Card.Header>
          <Card.Content>
            <Text size="xs">Content starts here</Text>
          </Card.Content>
          <Card.Footer>
            <Text size="xs">Footer starts here</Text>
            <Card.Button type="button">Button xs</Card.Button>
          </Card.Footer>
        </Card.Surface>
      </Card.Root>

      <Card.Root className="min-h-72">
        <Card.Surface>
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 start-3 z-50 border-s border-dashed border-primary"
          />
          <Card.Visual icon={<AlignLeft aria-hidden="true" />} />
          <Card.Header>
            <Card.Title>Default axis</Card.Title>
            <Card.Description>spacing-3</Card.Description>
          </Card.Header>
          <Card.Content>
            <Text size="sm">Content starts here</Text>
          </Card.Content>
          <Card.Footer>
            <Text size="sm">Footer starts here</Text>
            <Card.Button type="button">Button md</Card.Button>
          </Card.Footer>
        </Card.Surface>
      </Card.Root>

      <Card.Root className="min-h-72" size="xl">
        <Card.Surface>
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 start-5 z-50 border-s border-dashed border-primary"
          />
          <Card.Visual icon={<AlignLeft aria-hidden="true" />} />
          <Card.Header>
            <Card.Title>Extra large axis</Card.Title>
            <Card.Description>spacing-5</Card.Description>
          </Card.Header>
          <Card.Content>
            <Text>Content starts here</Text>
          </Card.Content>
          <Card.Footer>
            <Text>Footer starts here</Text>
            <Card.Button type="button">Button lg</Card.Button>
          </Card.Footer>
        </Card.Surface>
      </Card.Root>
    </div>
  )
} satisfies Story
