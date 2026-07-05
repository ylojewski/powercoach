---
revision: 8
date: 2026-07-26
---

# Card

## Overview

Card renders a square-cornered Powercoach content surface with optional visual,
introductory, content, footer, and exclusive-selection regions.

Every Card uses `Card.Root` as its one public outer element and `Card.Surface`
as its required visual envelope. Visual, Header, Content, and Footer are
supported only inside Surface. A non-selectable Card omits `Card.Group` and
`Card.Selector`.

A selectable set composes Base UI Radio Group through `Card.Group`. Each
selectable `Card.Root` contains one empty direct `Card.Selector`, followed by
one `Card.Surface`. Selector composes Base UI Radio as a native button and is
mounted once outside the duplicated visual subtree. Root mirrors the radio
state without becoming interactive or taking radio semantics.

Surface composes RevealAnimation and renders its complete visual subtree twice:
one real surface and one decorative overlay surface with unchanged consumer
content. The decorative copy is hidden from assistive technology, inert, and
pointer-inert through the RevealAnimation contract. Surface content must remain
deterministic and safe to render and mount twice.

`Card.Footer` remains outside the selection target. Its complete surface and
its real actions are independent from selection, while its decorative copy is
part of the visual reveal. `Card.Button` composes the public Powercoach Button
and inherits the nearest Card size; consumers may instead render a directly
sized `Button` or other compatible content in Footer.

`Card.Visual` uses the public Stripes component across its full surface by
default. It supports normal flow placement and a non-interactive overlay
placement behind the other Card parts. Its optional `icon` accepts arbitrary
React content inside a Card-sized tile and normalizes only SVG descendants.

Card uses semantic theme colors that adapt to light and dark themes. Hovering
the Selector of an unselected, enabled, writable Card moves Root to the
documented midpoint translation and hard shadow without revealing Surface.
Its shadow and Surface border retain the idle `color-border`. A selected Card
controls Surface's diagonal RevealAnimation, moves Root to the full
field-emphasis reference translation and hard shadow, and changes the Surface
border to foreground. The decorative overlay Surface overrides that border to
transparent through RevealAnimation's `data-reveal-overlay-surface` marker, so
the revealed opposite-token surface adds no second border around the real
selected border. Reveal, translation, shadow, and real Surface border color
begin together. RevealAnimation follows its own `300ms` clip-path easing
contract, while Card translation, shadow, and real Surface border color use
bidirectional CSS transitions with `300ms ease-out`. The old scale, inset
selection contour, and selected icon-color transition do not remain. Reduced
motion makes hover and selected presentation immediate. The external
keyboard-focus outline remains independent.

Card does not import Coss components or promise Coss compatibility. It does not
impose a width, height, aspect ratio, or minimum height. Root owns external
geometry, while Surface uses a vertical flex layout and fills Root so Footer
stays at the bottom of any extra height supplied by the consumer.

## Anatomy

Card exposes eleven public parts.

- `Card.Group`: groups selectable Cards and owns exclusive radio state.
- `Card.Root`: renders the one outer Card element and mirrors selection state.
- `Card.Selector`: renders the empty radio interaction layer for one Card.
- `Card.Surface`: renders the required visual Card envelope twice through
  RevealAnimation.
- `Card.Visual`: renders the flow or overlay visual surface.
- `Card.Header`: groups Title and Description.
- `Card.Title`: composes Heading for the Card title.
- `Card.Description`: composes Text for introductory supporting copy.
- `Card.Content`: contains optional primary Card content.
- `Card.Footer`: contains metadata and independent actions.
- `Card.Button`: composes Button and inherits the nearest Card size.

The package exposes the `Card` namespace and the prefixed leaf components
`CardGroup`, `CardRoot`, `CardSelector`, `CardSurface`, `CardVisual`,
`CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter`, and
`CardButton`, with their corresponding public prop and state types.

For a selectable Card, `Card.Selector` is an empty overlay sibling rather than
an ancestor of the content. The supported Root order places Selector first and
Surface second. Inside Surface, the supported order places Visual first and
Footer last. A non-selectable Card omits Selector and does not require Group,
but still requires Surface. Visual, Header, Content, and Footer are unsupported
as direct Root children.

```tsx
<Card.Group aria-label="Exercise creation method" defaultValue="from-scratch">
  <Card.Root size="xl">
    <Card.Selector value="from-scratch" aria-label="From Scratch" />

    <Card.Surface>
      <Card.Visual icon={<Sparkles aria-hidden="true" />}>visual identity</Card.Visual>

      <Card.Header>
        <Card.Title render={<h2 />}>From Scratch</Card.Title>
        <Card.Description render={<p />}>Create an exercise from scratch.</Card.Description>
      </Card.Header>

      <Card.Content>Optional content</Card.Content>

      <Card.Footer>
        <span>Blank build</span>
        <Card.Button type="button">Next</Card.Button>
      </Card.Footer>
    </Card.Surface>
  </Card.Root>
</Card.Group>
```

## Examples

### EX-002 - Complete Card size scale

Context: A consumer needs to compare all Card sizes and inherited Card.Button
sizes.

Expected behavior: Each Root exposes its resolved `data-size`, applies the
documented Card-owned metrics through its required Surface, and derives the
documented Title, Description, icon, and Card.Button sizes. The `xs` Header
uses no Title-to-Description gap and `p-2`, and its Title uses Heading `sm`;
the `md` Header uses `gap-1 p-3`, while its flow Visual uses a nonshrinking
`h-16.5`, a `size-10` icon tile, and `size-5` SVG; and the retained `xl`
reference uses `gap-2 p-5`, a nonshrinking `h-24.5` flow Visual, a `size-14`
icon tile, and `size-7` SVG. Each icon-tile edge, Title, Description, Content
box, and first Footer label shares the resolved inline-start axis. The
consumer-provided minimum height stays on Root and makes Surface Footer
anchoring visible; Card itself imposes no external dimensions. These
non-selectable Roots retain their idle translation, shadow, and Surface border
when hovered.

Covers: UC-001, UC-002, UC-003, UC-004, UC-005, UC-012, UC-016, UC-017, UC-018, UC-019

```tsx
import { Dumbbell } from 'lucide-react'
import { Card, Text } from '@powercoach/ui'

export function CardSizeScale() {
  return (
    <div className="grid gap-8 lg:grid-cols-3">
      <Card.Root size="xs" className="min-h-80">
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

      <Card.Root size="xl" className="min-h-80">
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
}
```

### EX-003 - Controlled selection and independent Footer action

Context: A consumer needs exclusive controlled selection while retaining an
independent action in each Footer.

Expected behavior: Group follows controlled Base UI Radio Group behavior. Each
single-mounted Selector uses a direct accessible name outside the duplicated
Surface subtree. Activating a Selector updates the visible selected value, the
matching Root exposes `data-selected`, and the complete Surface reveals
diagonally while Root moves to the full field-emphasis reference translation
and foreground hard shadow and the real Surface changes to its foreground
border. The decorative overlay Surface keeps a transparent border, so it does
not expose a second opposite-token border. Hovering the unselected Selector
moves Root to the documented midpoint translation and hard shadow without
partially revealing Surface; that shadow and the real Surface border both
retain `color-border`. Hovering its Footer or Card.Button does not activate that
midpoint. Keyboard focus on a Selector outlines the whole Card. Clicking or
keyboard-activating the real Card.Button increments only the action counter and
does not select its Card. The complete real Footer surface remains outside the
radio target, and its overlay copy remains decorative and inert.

Covers: UC-006, UC-008, UC-009, UC-010, UC-011, UC-012, UC-017, UC-019, UC-020

```tsx
import * as React from 'react'
import { Card, Text } from '@powercoach/ui'

export function ControlledMethodCards() {
  const [method, setMethod] = React.useState('template')
  const [actions, setActions] = React.useState(0)

  return (
    <div className="grid gap-4">
      <Text render={<output />}>selected: {method}</Text>
      <Text render={<output />}>footer actions: {actions}</Text>

      <Card.Group
        aria-label="Exercise creation method"
        value={method}
        onValueChange={setMethod}
        className="grid gap-6 md:grid-cols-2"
      >
        <Card.Root>
          <Card.Selector value="template" aria-label="Template" />
          <Card.Surface>
            <Card.Header>
              <Card.Title render={<h2 />}>Template</Card.Title>
              <Card.Description render={<p />}>Start with an existing structure.</Card.Description>
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
          <Card.Selector value="from-scratch" aria-label="From Scratch" />
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
```

### EX-004 - Uncontrolled selection

Context: A consumer needs Card.Group to own exclusive selection internally.

Expected behavior: Group initializes the selected value from `defaultValue`
and remains uncontrolled. Activating either enabled Card updates Base UI's
internal value. The optional `onValueChange` callback observes each change in a
visible output without feeding a `value` prop back into Group. Each Selector
uses a direct accessible name and controls the automatic selected reveal on its
following Surface.

Covers: UC-006, UC-007, UC-008, UC-009

```tsx
import * as React from 'react'
import { Card, Text } from '@powercoach/ui'

export function UncontrolledMethodCards() {
  const [observedValue, setObservedValue] = React.useState('no change yet')

  return (
    <div className="grid gap-4">
      <Text render={<output />}>observed change: {observedValue}</Text>

      <Card.Group
        aria-label="Program source"
        defaultValue="coach"
        onValueChange={setObservedValue}
        className="grid gap-6 md:grid-cols-2"
      >
        <Card.Root>
          <Card.Selector value="coach" aria-label="Coach plan" />
          <Card.Surface>
            <Card.Header>
              <Card.Title>Coach plan</Card.Title>
              <Card.Description>Start from a coach plan.</Card.Description>
            </Card.Header>
          </Card.Surface>
        </Card.Root>

        <Card.Root>
          <Card.Selector value="blank" aria-label="Blank plan" />
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
```

### EX-005 - Flow and overlay Visual placement

Context: A consumer needs to compare a normal visual band with a full-card
visual treatment behind content.

Expected behavior: Both consumers provide equal minimum height. The flow Visual
uses the resolved Card height and contributes to layout. The overlay Visual
covers the Surface inner bounds with default Stripes only, contributes no
height, ignores pointer input, and stays behind Header, Content, and Footer. It
has no icon, children, or wordmark. Footer anchors to the bottom in both Cards,
and overlay placement does not move the shared Header, Content, and Footer
inline-start axis.

Covers: UC-004, UC-005, UC-014, UC-016, UC-018

```tsx
import { Waves } from 'lucide-react'
import { Card, Text } from '@powercoach/ui'

export function CardVisualPlacements() {
  return (
    <div className="grid gap-8 md:grid-cols-2">
      <Card.Root className="min-h-96">
        <Card.Surface>
          <Card.Visual icon={<Waves aria-hidden="true" />}>Flow visual</Card.Visual>
          <Card.Header>
            <Card.Title render={<h2 />}>Flow</Card.Title>
            <Card.Description render={<p />}>
              The visual contributes to this Card's layout.
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
          <Card.Visual placement="overlay" aria-hidden="true" />
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
}
```

### EX-006 - Stripes and icon content matrix

Context: A consumer needs default, customized, and disabled Stripes together
with SVG and non-SVG icon content.

Expected behavior: Omitted `stripesProps` uses the public Stripes defaults. The
object form passes the named stripe values and semantic color through Stripes,
whose normal override precedence applies. `false` removes Stripes. The Lucide
SVG is normalized to the Card size, while the arbitrary non-SVG node is
preserved unchanged inside the stable icon tile.

Covers: UC-004, UC-005

```tsx
import { Activity } from 'lucide-react'
import { Card } from '@powercoach/ui'

export function CardVisualMatrix() {
  return (
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
              gap: '6px',
              width: '2px',
              color: 'currentColor',
              className: 'text-muted-foreground'
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
}
```

### EX-007 - Inherited Card.Button and direct Button

Context: A consumer needs to choose between Card-owned size inheritance and an
explicitly sized Button.

Expected behavior: Card.Button inherits Button `md` from the default `md` Root.
The direct Button uses its explicit `size="md"`. Both preserve the Button
contract, while only Card.Button obtains its size from Card context.

Covers: UC-012, UC-013

```tsx
import { Button, Card, Text } from '@powercoach/ui'

export function InheritedAndDirectCardButtons() {
  return (
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
}
```

### EX-008 - Dark selected and keyboard-focus inspection

Context: A consumer needs to inspect semantic dark-theme colors together with
the complete selected reveal, synchronized CSS transitions, and keyboard focus.

Expected behavior: The dark class changes Card through semantic theme tokens
without Card-specific dark overrides. The initially selected `xl` Root displays
its complete Surface through the opposite token mode, moves by the full
field-emphasis reference translation, uses the foreground hard shadow, and
changes the real Surface to its foreground border. The decorative overlay
Surface border is transparent, so the revealed opposite-token surface does not
draw a second border around the selected Card. Hovering the unselected Selector
applies the midpoint translation and hard-shadow geometry without Reveal while
its shadow and real Surface border retain `color-border`. Arrow-key selection
moves between the two Cards and starts the diagonal Reveal, Root translation and
shadow, and real Surface border-color change together for the same `300ms`
duration. The RevealAnimation clip path uses its own easing contract, while Card
translation, shadow, and real Surface border color retain `ease-out` easing in
both directions. The previous scale, selection contour, selected icon colors,
and visible overlay border are absent.
Reduced motion makes Reveal, translation, shadow, and real Surface border color
immediate. Keyboard focus adds the separate foreground outline without moving
the shared inline-start axis or hiding selection. Card.Button retains its own
focus treatment.

Covers: UC-006, UC-008, UC-009, UC-011, UC-015, UC-017, UC-018

```tsx
import { Dumbbell, Sparkles } from 'lucide-react'
import { Card, Text } from '@powercoach/ui'

export function DarkSelectableCard() {
  return (
    <div className="dark bg-background p-8 text-foreground">
      <Card.Group
        aria-label="Dark creation method"
        defaultValue="blank"
        className="grid gap-6 md:grid-cols-2"
      >
        <Card.Root size="xl" className="min-h-80">
          <Card.Selector value="blank" aria-label="From Scratch" autoFocus />
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

        <Card.Root size="xl" className="min-h-80">
          <Card.Selector value="template" aria-label="Template" />
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
}
```

### EX-009 - Disabled and read-only groups

Context: A consumer needs separate, clearly labelled probes for unavailable
selection states.

Expected behavior: The first named Group is disabled and its selected Root
mirrors `data-disabled`. The second named Group is read-only and its selected
Root mirrors `data-readonly`. Each Group also contains one unselected Root so
hover can be inspected without selected presentation. Hovering either
unselected Selector leaves its Root and Surface at the idle translation,
shadow, and border targets. Each Group has its own `defaultValue` and visible
caption, so neither state is mixed with enabled uncontrolled selection.

Covers: UC-006, UC-008, UC-009, UC-017

```tsx
import { Card, Text } from '@powercoach/ui'

export function UnavailableCardGroups() {
  return (
    <div className="grid gap-8 md:grid-cols-2">
      <section className="grid gap-2">
        <Text id="disabled-group-label">Disabled selection group</Text>
        <Card.Group aria-labelledby="disabled-group-label" defaultValue="locked" disabled>
          <Card.Root>
            <Card.Selector value="locked" aria-label="Locked method" />
            <Card.Surface>
              <Card.Header>
                <Card.Title>Locked method</Card.Title>
                <Card.Description>Group interaction is disabled.</Card.Description>
              </Card.Header>
            </Card.Surface>
          </Card.Root>
          <Card.Root>
            <Card.Selector value="blocked" aria-label="Blocked method" />
            <Card.Surface>
              <Card.Header>
                <Card.Title>Blocked method</Card.Title>
                <Card.Description>Hover remains at the normal target.</Card.Description>
              </Card.Header>
            </Card.Surface>
          </Card.Root>
        </Card.Group>
      </section>

      <section className="grid gap-2">
        <Text id="readonly-group-label">Read-only selection group</Text>
        <Card.Group aria-labelledby="readonly-group-label" defaultValue="fixed" readOnly>
          <Card.Root>
            <Card.Selector value="fixed" aria-label="Fixed method" />
            <Card.Surface>
              <Card.Header>
                <Card.Title>Fixed method</Card.Title>
                <Card.Description>Selection is visible but cannot change.</Card.Description>
              </Card.Header>
            </Card.Surface>
          </Card.Root>
          <Card.Root>
            <Card.Selector value="alternate" aria-label="Alternate method" />
            <Card.Surface>
              <Card.Header>
                <Card.Title>Alternate method</Card.Title>
                <Card.Description>Hover remains at the normal target.</Card.Description>
              </Card.Header>
            </Card.Surface>
          </Card.Root>
        </Card.Group>
      </section>
    </div>
  )
}
```

### EX-010 - Nearest Root Card.Button inheritance

Context: A consumer needs nested Cards to resolve Card.Button size from the
nearest Root.

Expected behavior: The outer `xl` Card.Button renders as Button `lg`. The
nested `xs` Card.Button renders as Button `xs` because the nearer Root wins.

Covers: UC-012

```tsx
import { Card, Text } from '@powercoach/ui'

export function NearestCardButtonSize() {
  return (
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
}
```

### EX-011 - Preserved Button render and loading behavior

Context: A consumer needs Card.Button size inheritance without losing Button
composition or state behavior.

Expected behavior: Both Card.Button instances inherit Button `md` from the
default Root. The first preserves Button element-form render semantics and the
second preserves Button loading, effective disabled, focus, and stable-layout
behavior.

Covers: UC-012, UC-013

```tsx
import { Card, Text } from '@powercoach/ui'

export function ComposedCardButtons() {
  return (
    <Card.Root>
      <Card.Surface>
        <Card.Header>
          <Card.Title>Preserved Button behavior</Card.Title>
        </Card.Header>
        <Card.Footer>
          <Text tone="muted">Default Root md</Text>
          <div className="flex gap-2">
            <Card.Button type="button" render={<button data-rendered="card-button" />}>
              Rendered Button md
            </Card.Button>
            <Card.Button type="button" loading>
              Loading Button md
            </Card.Button>
          </div>
        </Card.Footer>
      </Card.Surface>
    </Card.Root>
  )
}
```

### EX-012 - Card.Button outside Root fallback

Context: A consumer renders Card.Button outside the supported Card anatomy and
needs deterministic sizing.

Expected behavior: Card.Button falls back through the default Card `md` mapping
and renders Button `md` while preserving the rest of the Button contract.

Covers: UC-013

```tsx
import { Card, Text } from '@powercoach/ui'

export function CardButtonFallback() {
  return (
    <div className="grid gap-2">
      <Text tone="muted">Outside Root fallback: Button md</Text>
      <Card.Button type="button">Fallback Button md</Card.Button>
    </div>
  )
}
```

### EX-013 - Shared inline-start axis

Context: A consumer needs to inspect the Card-owned content axis across every
size.

Expected behavior: Each non-interactive vertical guide marks the resolved
inline-start offset from Surface's inner border edge: spacing-2 in `xs`,
spacing-3 in `md`, and spacing-5 in `xl`. The Visual icon-tile edge, Title,
Description, Content box, and first Footer label meet that guide. The centered
SVG glyph is not itself the alignment edge.

Covers: UC-002, UC-005, UC-016, UC-018

```tsx
import { AlignLeft } from 'lucide-react'
import { Card, Text } from '@powercoach/ui'

export function CardInlineStartAxis() {
  return (
    <div className="grid gap-8 lg:grid-cols-3">
      <Card.Root size="xs" className="min-h-72">
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

      <Card.Root size="xl" className="min-h-72">
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
}
```

## Group

`Card.Group` composes Base UI RadioGroup and exposes the same controlled,
uncontrolled, form, disabled, read-only, required, render, and state contracts.
It renders a `div` by default.

### Props

`CardGroupProps<TValue>` is the prefixed public alias for the corresponding
generic Base UI `RadioGroup.Props<TValue>` contract.

| Prop               | Type                                                                                     | Default | Description                                                                                                                |
| ------------------ | ---------------------------------------------------------------------------------------- | ------- | -------------------------------------------------------------------------------------------------------------------------- |
| `name`             | `string`                                                                                 | None    | Identifies the radio field when a form is submitted.                                                                       |
| `defaultValue`     | `TValue`                                                                                 | None    | Initial uncontrolled selected value. Use `value` for controlled usage.                                                     |
| `value`            | `TValue`                                                                                 | None    | Current controlled selected value. Use `defaultValue` for uncontrolled usage.                                              |
| `onValueChange`    | `(value: TValue, eventDetails: Card.Group.ChangeEventDetails) => void`                   | None    | Called when Base UI RadioGroup changes the selected value.                                                                 |
| `form`             | `string`                                                                                 | None    | Identifies the form that owns the hidden radio inputs.                                                                     |
| `disabled`         | `boolean`                                                                                | `false` | Whether every Selector in the Group ignores user interaction.                                                              |
| `readOnly`         | `boolean`                                                                                | `false` | Whether the user is prevented from selecting a different value.                                                            |
| `required`         | `boolean`                                                                                | `false` | Whether the user must select a value before form submission.                                                               |
| `inputRef`         | `React.Ref<HTMLInputElement>`                                                            | None    | Ref to the Base UI hidden input element.                                                                                   |
| `className`        | `string \| ((state: Card.Group.State) => string \| undefined)`                           | None    | Class applied to Group or returned from Base UI RadioGroup state.                                                          |
| `style`            | `React.CSSProperties \| ((state: Card.Group.State) => React.CSSProperties \| undefined)` | None    | Style applied to Group or returned from Base UI RadioGroup state.                                                          |
| `render`           | `ReactElement \| ((props: HTMLProps, state: Card.Group.State) => ReactElement)`          | None    | Replaces the default `div` through Base UI RadioGroup render semantics.                                                    |
| native `div` props | Base UI `RadioGroup.Props<TValue>` inherited props                                       | None    | Native attributes, events, ARIA attributes, consumer data attributes, children, and ref pass through according to Base UI. |

The package exposes the matching prefixed `CardGroupState`,
`CardGroupChangeEventReason`, and `CardGroupChangeEventDetails` aliases. Group
does not replace, narrow, or extend their Base UI fields.

### Events

`onValueChange` preserves the Base UI signature. Its `eventDetails` object
includes `reason`, `event`, `cancel`, `allowPropagation`, `isCanceled`,
`isPropagationAllowed`, and `trigger` according to Base UI RadioGroup.

### Data Attributes

| Attribute       | Description                     |
| --------------- | ------------------------------- |
| `data-disabled` | Present when Group is disabled. |

Consumer `data-*` attributes pass through according to Base UI RadioGroup.

### CSS Variables

Group defines no public CSS variables.

## Root

`Card.Root` renders the one public outer Card `div` by default. It owns external
consumer geometry, resolved size and state, Card context, the containing block
for Selector, global isolation, hover and selected translation and shadow, and
the external keyboard-focus outline. It contains one required Surface and,
when selectable, one direct Selector before Surface.

### Props

```ts
type CardSize = 'xs' | 'md' | 'xl'

type CardRootState = {
  size: CardSize
  selectable: boolean
  selected: boolean
  disabled: boolean
  readOnly: boolean
}
```

`CardRootProps` extends Base UI `useRender.ComponentProps<"div",
CardRootState>` with the Card prop below.

| Prop               | Type                                                                                  | Default | Description                                                                                                                     |
| ------------------ | ------------------------------------------------------------------------------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `size`             | `"xs" \| "md" \| "xl"`                                                                | `"md"`  | Selects Card-owned spacing, surface, icon, Title, Description, and Card.Button mappings.                                        |
| `className`        | `string \| ((state: CardRootState) => string \| undefined)`                           | None    | Composes consumer classes once on the outer Root or returns classes from Root state.                                            |
| `style`            | `React.CSSProperties \| ((state: CardRootState) => React.CSSProperties \| undefined)` | None    | Applies consumer styles once to the outer Root or returns styles from Root state.                                               |
| `render`           | `ReactElement \| ((props: HTMLProps, state: CardRootState) => ReactElement)`          | None    | Replaces the default `div` through Base UI useRender semantics.                                                                 |
| native `div` props | `useRender.ComponentProps<"div", CardRootState>` inherited props                      | None    | Native attributes, events, ARIA attributes, consumer data attributes, children, and ref pass through to the final Root element. |

Root does not expose `selected`, `checked`, `value`, `defaultValue`, `onSelect`,
or `onCheckedChange`. Group owns the selected value, Selector owns radio
interaction, and Root only mirrors a direct Selector's effective state.

Consumer width, height, and minimum-height belong on Root. Root passes its
resolved state through Card context so Surface and the other Card parts receive
the same effective size and selection state.

### Events

Root defines no custom events. Native handlers pass through and do not create
Card selection behavior.

### Data Attributes

| Attribute                        | Description                                                    |
| -------------------------------- | -------------------------------------------------------------- |
| `data-size="xs" \| "md" \| "xl"` | Indicates the resolved Card size and is always present.        |
| `data-selectable`                | Present when Root contains its one supported direct Selector.  |
| `data-selected`                  | Present when the direct Selector is checked.                   |
| `data-disabled`                  | Present when the effective direct Selector state is disabled.  |
| `data-readonly`                  | Present when the effective direct Selector state is read-only. |

Consumer `data-*` attributes pass through to Root.

### CSS Variables

Root defines no public CSS variables.

## Selector

`Card.Selector` composes Base UI `Radio.Root` and renders a native `button` by
default with `nativeButton={true}`. It renders the Base UI hidden radio input as
documented by Radio. Selector is an empty interaction layer and does not accept
children. It is a direct Root child before Surface and is mounted exactly once,
outside Surface's duplicated subtree.

### Props

`CardSelectorProps<TValue>` is the prefixed public alias for
`Omit<Radio.Root.Props<TValue>, "children">`.

| Prop                  | Type                                                                                        | Default  | Description                                                                                                       |
| --------------------- | ------------------------------------------------------------------------------------------- | -------- | ----------------------------------------------------------------------------------------------------------------- |
| `value`               | `TValue`                                                                                    | Required | Unique value that identifies the Selector in its Card.Group.                                                      |
| `nativeButton`        | `boolean`                                                                                   | `true`   | Whether the rendered Selector is a native button. Set consistently with a render replacement.                     |
| `disabled`            | `boolean`                                                                                   | Base UI  | Whether this Selector ignores user interaction. Does not disable Footer actions.                                  |
| `readOnly`            | `boolean`                                                                                   | Base UI  | Whether the user is prevented from selecting this radio. Does not make Root interactive.                          |
| `required`            | `boolean`                                                                                   | Base UI  | Whether the user must choose a value in the Group.                                                                |
| `inputRef`            | `React.Ref<HTMLInputElement>`                                                               | None     | Ref to the Base UI hidden radio input.                                                                            |
| `className`           | `string \| ((state: Card.Selector.State) => string \| undefined)`                           | None     | Class applied to the Selector button or returned from Base UI Radio state.                                        |
| `style`               | `React.CSSProperties \| ((state: Card.Selector.State) => React.CSSProperties \| undefined)` | None     | Style applied to the Selector button or returned from Base UI Radio state.                                        |
| `render`              | `ReactElement \| ((props: HTMLProps, state: Card.Selector.State) => ReactElement)`          | None     | Replaces the button through Base UI Radio render semantics. The replacement must preserve received props and ref. |
| native and ARIA props | Base UI `Radio.Root.Props<TValue>` inherited props except `children`                        | None     | Native events, ARIA attributes, consumer data attributes, and ref pass through according to Base UI Radio.        |

When `render` replaces the native button, the consumer must set `nativeButton`
consistently with the replacement, spread every received prop, and preserve the
received ref. Selector must remain a radio interaction rather than a generic
click surface.

Selector must receive a direct accessible name through `aria-label` or reference
a unique labeling node outside Surface. `aria-labelledby` and
`aria-describedby` must not reference Title, Description, or another node
inside Surface because Surface renders that subtree twice.

### Events

Selector defines no custom events. Native events and Base UI Radio behavior
pass through. Card does not add click handlers, key handlers, propagation
cancellation, or selection events.

### Data Attributes

Selector preserves the complete documented Base UI Radio Root attributes.

| Attribute        | Description                                   |
| ---------------- | --------------------------------------------- |
| `data-checked`   | Present when the Selector radio is checked.   |
| `data-unchecked` | Present when the Selector radio is unchecked. |
| `data-disabled`  | Present when the Selector is disabled.        |
| `data-readonly`  | Present when the Selector is read-only.       |
| `data-required`  | Present when the Selector is required.        |
| `data-valid`     | Present when valid within Base UI Field.      |
| `data-invalid`   | Present when invalid within Base UI Field.    |
| `data-dirty`     | Present when changed within Base UI Field.    |
| `data-touched`   | Present when touched within Base UI Field.    |
| `data-filled`    | Present when checked within Base UI Field.    |
| `data-focused`   | Present when focused within Base UI Field.    |

Consumer `data-*` attributes pass through according to Base UI Radio.

### CSS Variables

Selector defines no public CSS variables.

## Surface

`Card.Surface` is the required visual envelope for every Card. It composes
RevealAnimation in flow content mode and renders a `div` surface by default.
RevealAnimation renders that same surface element and its complete children
twice: one real visual surface and one decorative overlay surface with
unchanged consumer content.

Surface owns the Card background, foreground, border, clipping, vertical flex
layout, size metrics, shared inline-start axis, Visual/Header/Content/Footer
layers, and Footer anchoring. It fills Root without imposing external
dimensions.

### Props

```ts
type CardSurfaceState = {
  size: CardSize
  selectable: boolean
  selected: boolean
  disabled: boolean
  readOnly: boolean
}

type CardSurfaceProps = Omit<
  useRender.ComponentProps<'div', CardSurfaceState>,
  'className' | 'style' | 'id' | 'ref'
> & {
  children?: React.ReactNode
  className?: string | ((state: CardSurfaceState) => string | undefined)
  style?: React.CSSProperties | ((state: CardSurfaceState) => React.CSSProperties | undefined)
  render?: ReactElement | ((props: HTMLProps, state: CardSurfaceState) => ReactElement)
}
```

| Prop               | Type                                                                                     | Default | Description                                                                                                                                                      |
| ------------------ | ---------------------------------------------------------------------------------------- | ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `children`         | `React.ReactNode`                                                                        | None    | Complete visual Card subtree passed unchanged to the real and decorative surfaces.                                                                               |
| `className`        | `string \| ((state: CardSurfaceState) => string \| undefined)`                           | None    | Classes applied identically to both surface instances or returned from the shared effective Card state.                                                          |
| `style`            | `React.CSSProperties \| ((state: CardSurfaceState) => React.CSSProperties \| undefined)` | None    | Styles applied identically to both surface instances or returned from the shared effective Card state.                                                           |
| `render`           | `ReactElement \| ((props: HTMLProps, state: CardSurfaceState) => ReactElement)`          | None    | Replaces both default surface `div` elements. The replacement accepts children, forwards every received prop, and remains deterministic and safe to mount twice. |
| native `div` props | See excluded props below                                                                 | None    | Native attributes, events, ARIA attributes, and consumer data attributes pass identically to both surface instances.                                             |

Surface does not accept `size`, `selectable`, `selected`, `disabled`,
`readOnly`, `reveal`, `direction`, `scale`, `contentMode`, reveal alignments or
offsets, or RevealAnimation lifecycle callbacks. Card derives state from Root
and fixes RevealAnimation composition.

`id` is excluded because Surface renders twice. Surface exposes no consumer ref
representing a unique DOM node. A ref introduced by `render` or another
duplicated descendant must support two concurrent attachments and independent
detach order.

### Events

Surface defines no custom events. Native handlers pass identically to the real
and decorative surfaces. The decorative overlay is inert and pointer-inert, but
both handlers and their component trees remain mounted.

### Data Attributes

Both surface instances expose the same effective Card state attributes.
`CardSurfaceState` is identical for both instances and does not expose a real or
decorative layer flag.

| Attribute                        | Description                                                    |
| -------------------------------- | -------------------------------------------------------------- |
| `data-size="xs" \| "md" \| "xl"` | Indicates the resolved Card size and is always present.        |
| `data-selectable`                | Present when Root contains its one supported direct Selector.  |
| `data-selected`                  | Present when the direct Selector is checked.                   |
| `data-disabled`                  | Present when the effective direct Selector state is disabled.  |
| `data-readonly`                  | Present when the effective direct Selector state is read-only. |

The decorative surface additionally receives RevealAnimation's public
`data-reveal-overlay-surface` marker. Card uses that public marker to make the
decorative Surface border transparent while preserving the real Surface border
target. Consumer `data-*` attributes pass identically to both Surface instances.

### CSS Variables

Surface defines no Card CSS variables. RevealAnimation's
`--reveal-offset-x`, `--reveal-offset-y`, `--reveal-origin`, and
`--reveal-height` variables remain owned by RevealAnimation rather than
becoming Card variables.

## Visual

`Card.Visual` renders a `div` and owns the optional icon tile, Stripes layer,
resolved Visual size, and placement inside Surface. In default layout, the icon
tile is the start-aligned Visual item and its outer edge sits on Surface's
shared inline-start axis. The SVG remains centered inside that square tile
without directional padding.

### Props

```ts
type CardVisualPlacement = 'flow' | 'overlay'

type CardVisualStripesProps = Omit<StripesProps, 'children' | 'render' | 'aria-hidden'>
```

| Prop               | Type                                 | Default  | Description                                                                                                                                                                                          |
| ------------------ | ------------------------------------ | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `placement`        | `"flow" \| "overlay"`                | `"flow"` | Places Visual in normal layout or across the Surface inner bounds behind flow content.                                                                                                               |
| `stripesProps`     | `boolean \| CardVisualStripesProps`  | `true`   | Uses default Stripes, removes Stripes with `false`, or passes supported public Stripes props through an object.                                                                                      |
| `icon`             | `React.ReactNode`                    | None     | Content rendered inside the Card-owned icon tile. SVG descendants receive size treatment; currentColor follows the active token mode, while explicit paint and non-SVG values remain consumer-owned. |
| `children`         | `React.ReactNode`                    | None     | Consumer visual content rendered above the internal Stripes layer.                                                                                                                                   |
| `className`        | `string`                             | None     | Composes consumer classes on the Visual element. It does not override reserved internal Stripes positioning through `stripesProps`.                                                                  |
| `style`            | `React.CSSProperties`                | None     | Applies consumer styles to the Visual element.                                                                                                                                                       |
| native `div` props | `React.ComponentPropsWithRef<"div">` | None     | Native attributes, events, ARIA attributes, consumer data attributes, and ref pass through to Visual.                                                                                                |

The object form of `stripesProps` passes Stripes named props, `className`,
`style`, native attributes, consumer data attributes, and ref. Card owns the
internal Stripes `children`, `render`, `aria-hidden`, pointer behavior, and
full-surface positioning. Conflicting positioning utilities in
`stripesProps.className` are unsupported.

### Events

Visual defines no custom events. Native events pass through in flow placement.
Overlay placement always ignores pointer input, so interactive overlay content
is unsupported.

### Data Attributes

Visual defines no custom data attributes. Consumer `data-*` attributes pass
through to the Visual element.

### CSS Variables

Visual defines no Card CSS variables. CSS variables supplied inside the object
form of `stripesProps` apply to the internally composed Stripes according to
the Stripes public contract.

## Header

`Card.Header` renders a `div` that groups Title and Description, applies the
resolved outer padding and Title-to-Description gap, and places both text parts
on Surface's shared inline-start axis without another inline offset. The
Title-to-Description gap is none for `xs`, `gap-1` for `md`, and `gap-2` for
`xl`. Header padding remains `p-2`, `p-3`, and `p-5` respectively.

### Props

| Prop               | Type                                 | Default | Description                                                                                                                       |
| ------------------ | ------------------------------------ | ------- | --------------------------------------------------------------------------------------------------------------------------------- |
| native `div` props | `React.ComponentPropsWithRef<"div">` | None    | Children, className, style, native attributes, events, ARIA attributes, consumer data attributes, and ref pass through to Header. |

### Events

Header defines no custom events. Native events pass through.

### Data Attributes

Header defines no custom data attributes. Consumer `data-*` attributes pass
through.

### CSS Variables

Header defines no public CSS variables.

## Title

`Card.Title` composes the public Heading component. It renders a `span` by
default and preserves Heading `render`, appearance, native prop, event, class
merging, ref, accessibility, and visual lowercase contracts.

### Props

`CardTitleProps` is the prefixed public alias for `HeadingProps`.

| Prop          | Type           | Default                                | Description                                                                                                                                                           |
| ------------- | -------------- | -------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `size`        | `HeadingSize`  | Resolved from Card size                | Overrides the Heading size derived from the nearest Root when provided.                                                                                               |
| Heading props | `HeadingProps` | Heading defaults except derived `size` | `tone`, `intent`, `render`, className, style, children, native span attributes, events, ARIA attributes, consumer data attributes, and ref preserve Heading behavior. |

Inside Surface, omitted `size` maps Card `xs` to Heading `sm`, Card `md` to
Heading `lg`, and Card `xl` to Heading `xl`. An explicit Title `size` replaces
the derived Heading size and applies completely. Consumer className remains
last and may override Card's derived typography.

### Events

Title defines no custom events. Heading and native events pass through.

### Data Attributes

Title defines no custom state attributes. Consumer `data-*` attributes pass
through according to Heading.

### CSS Variables

Title defines no public CSS variables.

## Description

`Card.Description` composes the public Text component. It renders a `span` by
default, uses muted tone by default, and preserves Text `render`, appearance,
native prop, event, class merging, ref, and accessibility contracts.

### Props

`CardDescriptionProps` is the prefixed public alias for `TextProps`.

| Prop       | Type        | Default                                                  | Description                                                                                                                                                |
| ---------- | ----------- | -------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `size`     | `TextSize`  | Resolved from Card size                                  | Overrides the Text size derived from the nearest Root when provided.                                                                                       |
| `tone`     | `Tone`      | `"muted"`                                                | Uses Text muted tone unless the consumer selects another valid Text appearance. Mutually exclusive with `intent` according to Text.                        |
| Text props | `TextProps` | Text defaults except derived `size` and muted appearance | `intent`, `render`, className, style, children, native span attributes, events, ARIA attributes, consumer data attributes, and ref preserve Text behavior. |

Inside Surface, omitted `size` maps Card `xs` to Text `xs`, Card `md` to Text `sm`,
and Card `xl` to Text `md`.

### Events

Description defines no custom events. Text and native events pass through.

### Data Attributes

Description defines no custom state attributes. Consumer `data-*` attributes
pass through according to Text.

### CSS Variables

Description defines no public CSS variables.

## Content

`Card.Content` renders a `div` for optional primary content, applies the
resolved horizontal and bottom spacing, and places its content box on Surface's
shared inline-start axis without another Card-owned inline offset.

### Props

| Prop               | Type                                 | Default | Description                                                                                                                        |
| ------------------ | ------------------------------------ | ------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| native `div` props | `React.ComponentPropsWithRef<"div">` | None    | Children, className, style, native attributes, events, ARIA attributes, consumer data attributes, and ref pass through to Content. |

### Events

Content defines no custom events. Native events pass through.

### Data Attributes

Content defines no custom data attributes. Consumer `data-*` attributes pass
through.

### CSS Variables

Content defines no public CSS variables.

## Footer

`Card.Footer` renders the final flex item above Selector. It owns the separated
muted surface, resolved spacing, bottom anchoring, and independent action layer.
It uses `mt-auto shrink-0`; its first in-flow child stays on Surface's shared
inline-start axis while later content may be distributed toward the opposite
edge. The real Footer sits above Selector and remains interactive; the
RevealAnimation overlay copy remains inert and pointer-inert.

### Props

| Prop               | Type                                 | Default | Description                                                                                                                       |
| ------------------ | ------------------------------------ | ------- | --------------------------------------------------------------------------------------------------------------------------------- |
| native `div` props | `React.ComponentPropsWithRef<"div">` | None    | Children, className, style, native attributes, events, ARIA attributes, consumer data attributes, and ref pass through to Footer. |

### Events

Footer defines no custom events. Native events pass through. Footer activation
does not select the Card.

### Data Attributes

Footer defines no custom data attributes. Consumer `data-*` attributes pass
through.

### CSS Variables

Footer defines no public CSS variables.

## Button

`Card.Button` composes the public Powercoach Button component. It renders the
same native `button` as Button by default and preserves Button action semantics,
variants, content composition, accessibility, state attributes, render
behavior, focus behavior, loading behavior, and optional RevealAnimation
composition.

### Props

```ts
type CardButtonProps = Omit<ButtonProps, 'size'>
```

| Prop                       | Type                        | Default         | Description                                                                                                                                                                                                                                       |
| -------------------------- | --------------------------- | --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Button props except `size` | `Omit<ButtonProps, "size">` | Button defaults | Preserves `variant`, `prepend`, `append`, `loading`, `revealAnimation`, `disabled`, `focusableWhenDisabled`, `nativeButton`, `render`, className, style, children, form props, native events, ARIA attributes, consumer data attributes, and ref. |

`size` is not part of `CardButtonProps`. Inside nested Roots, the nearest Root
size wins. Outside Root, Card.Button deterministically uses the default Card
`md` mapping and therefore renders Button `md`. Placement inside Root but
outside Surface, or inside Surface but outside Footer, is unsupported anatomy
even though size inheritance remains defined.

Conflicting consumer `className` geometry is unsupported as an alternate size
API. The Button `link` variant preserves its existing contract: it inherits
parent text metrics and does not visually respond to the inherited Button size.

### Events

Button defines no Card-specific events. Native events and Button behavior pass
through. Button actions never select the Card.

### Data Attributes

Card.Button preserves Button's public attributes.

| Attribute       | Description                                                            |
| --------------- | ---------------------------------------------------------------------- |
| `data-disabled` | Present according to Button's disabled and effective loading behavior. |
| `data-loading`  | Present when Button loading is true.                                   |

Consumer `data-*` attributes pass through according to Button.

### CSS Variables

Button defines no Card CSS variables and preserves Button's lack of public CSS
variables.

## Accessibility

`Card.Root` is a neutral `div` by default. It does not receive a radio role,
button role, accessible name, focusability, tab stop, click handler, or keyboard
handler from Card selection. Its selection treatment reflects the direct
Selector state visually only.

`Card.Surface` is also a neutral `div` by default. RevealAnimation leaves the
real Surface accessible and interactive and marks the duplicated overlay Surface
`aria-hidden`, inert, non-focusable, and pointer-inert. The overlay must not
create a second accessible role, name, focus target, or action.

Every `Card.Selector` must be placed within `Card.Group`, have a unique `value`,
and receive an accessible name. The standard Card pattern uses a direct
`aria-label`. Selector may instead use `aria-labelledby` or
`aria-describedby` only when each reference resolves to one unique node outside
Surface. Selector must not reference Card.Title, Card.Description, or another
node inside Surface because that node is rendered twice. `Card.Group` needs its
own distinct group name through `aria-label`, `aria-labelledby`, or a valid
Fieldset Legend composition.

Base UI Radio Group owns exclusive state, hidden form inputs, radio semantics,
focus management, keyboard interaction, controlled and uncontrolled behavior,
disabled behavior, read-only behavior, and required behavior. Card does not
invent a key matrix or recreate that behavior with click or key handlers.
Keeping Selector outside Surface ensures each option has exactly one Base UI
radio surface, hidden input, form value, ref target, and accessible identity.

Selector is a separate keyboard target from every Footer action. The complete
real Footer surface sits above Selector and does not activate selection. The
decorative Footer copy remains inside the inert overlay. Card does not use
`stopPropagation`, Base UI event cancellation, or a Root click handler to
separate the interactions. Disabled and read-only radio state does not
implicitly disable Card.Button or another Footer action.

Selector hover changes Root's visual translation and shadow while Surface
retains its idle border color. It does not check the radio, set `data-selected`,
expose another selection semantic, or activate RevealAnimation. Footer and its
independent actions remain outside that hover region. Disabled and read-only
Selectors do not produce hover presentation.

Keyboard focus on the direct Selector displays one foreground outline around
the entire Root, separated by a `1px` empty gap. Selector suppresses its own
visible outline. Focus on Card.Button or another Footer control does not display
the Root outline; that control displays its own focus treatment. Selection and
focus remain simultaneously visible.

Surface, its `render` element, and its descendants must not use a literal
document-unique `id`. Each duplicated instance may generate distinct IDs only
when every label, description, `htmlFor`, controls, owns, headers, and fragment
reference stays within that same instance. A nonduplicated Selector cannot
reference either duplicated instance.

Functional form controls are incompatible inside Surface by default. Duplicated
inputs, selects, textareas, radios, checkboxes, hidden inputs, and comparable
Base UI controls can change submitted FormData, constraint validation, reset,
default-submit, ownership, or state behavior even though the overlay is inert.

Portals are incompatible by default because their content can escape the
overlay's inert, hidden, pointer-inert, clipped, stacked, and inverted-theme
ancestry. A portal is compatible only when its destination independently
preserves decorative inertness and every render-twice requirement.

Object refs that assume one node are incompatible inside Surface. Callback refs
and refs introduced by `render` must accept two concurrent attachments and
independent detach order. Effects, layout effects, subscriptions, analytics,
timers, requests, registrations, and imperative mutations execute twice; they
must be reentrant, independently cleaned up, and safe with two separate local
states.

Both instances must produce deterministic matching visual output. Random
values, time-dependent output, singletons, and unsynchronized external mutable
reads are incompatible when they can make the overlay diverge from the real
Surface.

`Card.Title` remains a generic `span` unless the consumer selects a semantic
heading through Heading `render`. Consumers own the correct document heading
level. `Card.Description` remains a generic `span` unless the consumer selects
another valid element through Text `render`.

The internally composed empty Stripes layer is decorative and hidden from
assistive technology. Card does not automatically hide `Card.Visual`, its
`icon`, or its children because they may be meaningful. Consumers mark
redundant content with `aria-hidden` and provide accessible text or attributes
for meaningful content. Card does not change an icon's role, title, or ARIA
attributes. Overlay Visual is pointer-inert, so interactive overlay content is
unsupported.

Card.Button follows the complete Button accessibility contract. Icon-only
Card.Button content needs an accessible name. Loading, disabled,
`focusableWhenDisabled`, non-native render, and RevealAnimation accessibility
remain Button responsibilities. Inside Surface, Card.Button and arbitrary slot
content must additionally satisfy the same duplicate form, portal, ref, effect,
and deterministic-render requirements.

Reveal, hover translation and shadow, and selected translation, shadow, and
border supplement rather than replace radio semantics. Card does not rely on
visual presentation to expose selection to assistive technology.

## Behavior

Card.Root defaults to `size="md"` and renders the one square-cornered outer
element. It establishes Selector's containing block, global isolation, hover
and selected translation and shadow, and external focus outline. Root does not
impose external dimensions; consumer width, height, aspect ratio, and minimum
height apply once to Root.

Every Root contains one Surface. A selectable Root uses the order direct
Selector then Surface; a non-selectable Root contains Surface only. Visual,
Header, Content, and Footer are supported only inside Surface and must not be
mixed as direct Root children.

Surface fills Root and renders a square-cornered bordered vertical flex surface
with `bg-card text-card-foreground`. Its idle and hover target is
`border-border`; its selected target is `border-foreground`. These targets
remain visible on the real Surface. The decorative Surface identified by
`data-reveal-overlay-surface` applies
`data-[reveal-overlay-surface]:border-transparent`, so its own border remains
transparent and never adds an opposite-token border during Reveal. Surface owns
overflow clipping, visual stacking, shared content layout, and Footer
anchoring. It does not impose external dimensions.

Selector is an empty transparent interaction layer. It covers the selectable
part of Root but sits below the complete real Footer layer. Visual, Header,
Title, Description, and Content therefore keep their own elements and semantics
without becoming children of a button. Only pointer hover over this Selector
region can request the Card hover presentation; hover over Footer or another
area outside Selector cannot.

Group may be controlled with `value` and `onValueChange` or uncontrolled with
`defaultValue` and optional `onValueChange`. Selector's Base UI checked,
disabled, and read-only state mirrors onto Root through the documented Root
attributes and render callback state. Root has no independent selection state.

Surface composes RevealAnimation with `contentMode="flow"`,
`direction="diagonal-45-to-135"`, `scale={1}`, and controlled
`reveal={selected}`. Card does not reproduce RevealAnimation's clip path, theme
inversion, overlay, or lifecycle. Hover and focus on Surface do not change the
controlled reveal state. Selector hover does not partially reveal Surface.

RevealAnimation renders the same Surface element and complete children twice
without Card filtering, rewriting, neutralizing, or removing any copied prop or
part. The overlay covers the complete Surface border box, including its border
and Footer, but does not cover Root's external focus outline or shadow.

Root's idle target has no translation and no shadow. An unselected, enabled,
writable selectable Root whose Selector is hovered uses the calculated
field-emphasis midpoint geometry for every Card size: `translate:
-0.0625rem -0.0625rem`, equivalent to negative Tailwind spacing 0.25 on both
axes, and `box-shadow: 0.125rem 0.125rem 0 0 var(--color-border)`, equivalent
to positive Tailwind spacing 0.5 on both axes with zero blur and spread.
Surface retains `border-border` in that hover state.

While selected, Root uses the full field-emphasis reference geometry for every
Card size: `translate: -0.125rem -0.125rem`, equivalent to negative Tailwind
spacing 0.5 on both axes, and `box-shadow: 0.25rem 0.25rem 0 0
var(--color-foreground)`, equivalent to positive Tailwind spacing 1 on both
axes with zero blur and spread. The real Surface uses `border-foreground`,
while the decorative overlay Surface keeps its border transparent. Selected
presentation has priority over hover presentation. Non-selectable Roots and
unselected disabled or read-only Roots stay at the idle translation, shadow,
and real Surface border targets when hovered.

Translation changes visual position and browser hit testing without changing
Root's layout footprint. Because translation belongs to Root, Surface, the
Selector hit area, real Footer actions, focus outline, and shadow translate
together.

The old scale and size-mapped inset primary selection ring are removed. The icon
tile and currentColor SVG content do not receive selected primary colors.
Reveal, the foreground real Surface border, and the foreground hard shadow are
the selected color presentation. The transparent decorative overlay border does
not add another revealed border.

Keyboard focus on the direct radio Selector displays an external two-unit
foreground outline with `outline-offset-1`, preserving the approved `1px` gap.
Card and Button share that focus geometry. Button preserves its documented
appearance, helpers, state behavior, and focus behavior.

### Size Treatments

Card-owned metrics use only Tailwind scale utilities.

| Card size | Flow Visual  | Icon tile | SVG descendant | Header      | Content     | Footer            | Title        | Description | Card.Button |
| --------- | ------------ | --------- | -------------- | ----------- | ----------- | ----------------- | ------------ | ----------- | ----------- |
| `xs`      | `h-12 p-2`   | `size-8`  | `size-4`       | `gap-0 p-2` | `px-2 pb-2` | `gap-2 px-2 py-2` | Heading `sm` | Text `xs`   | Button `xs` |
| `md`      | `h-16.5 p-3` | `size-10` | `size-5`       | `gap-1 p-3` | `px-3 pb-3` | `gap-3 px-3 py-3` | Heading `lg` | Text `sm`   | Button `md` |
| `xl`      | `h-24.5 p-5` | `size-14` | `size-7`       | `gap-2 p-5` | `px-5 pb-5` | `gap-5 px-5 py-5` | Heading `xl` | Text `md`   | Button `lg` |

Explicit Title or Description `size` overrides the derived value. Explicit
Title size replaces the complete derived Heading size. Card does not resize
arbitrary Visual children, Content children, Footer children, or a direct
Button. A direct Button consumer sets Button `size` explicitly.

The icon tile is square, centers its content without directional padding, and
uses `bg-background border border-border text-foreground` in every selection
state. Card applies the resolved SVG size, `shrink-0`, and
`pointer-events-none` only to SVG descendants within that tile. SVG stroke or
fill that uses currentColor follows the active real or revealed theme tokens.
Card does not clone children, inspect component identity, or overwrite fill,
stroke, role, title, or ARIA. Explicitly painted SVG and non-SVG content retain
their consumer values.

Header groups Title and Description with no Title-to-Description gap for `xs`,
`gap-1` for `md`, and `gap-2` for `xl`, while retaining the resolved `p-2`,
`p-3`, or `p-5` padding. Description defaults to Text muted tone, producing
`text-muted-foreground`. Content applies the resolved horizontal and bottom
spacing. Footer is the final flex item, uses `mt-auto shrink-0`, lays out its
content and actions in a stable start-preserving row with the resolved gap and
padding, uses `bg-muted`, and is separated by `border-border`. Without
consumer-provided extra height, Footer follows the preceding content. With
consumer height or minimum height, `mt-auto` consumes the free space and anchors
Footer at the bottom. This remains true when Content is omitted or Visual uses
overlay placement.

Card defines one inline-start content axis from Surface's inner border edge:
spacing-2 for `xs`, spacing-3 for `md`, and spacing-5 for `xl`. In LTR this is
the common left axis. Visual places the icon tile's outer edge on that axis;
Header places Title and Description there without another offset; Content places
its content box there; and Footer keeps its first in-flow child there while
later content may move toward the opposite edge. Overlay placement, Reveal,
Root translation, shadow, and focus chrome do not move the axis within Surface.

This alignment guarantee covers Card's default layout. Consumer utilities that
change inline padding, start margin, positioning, translation, justification,
alignment, child order, or the first Content or Footer child's offset opt that
part out of the guarantee. Card does not compensate with JavaScript, important
declarations, negative margins, or hidden wrappers.

Visual uses `bg-card` and owns its separator from following flow content. With
`placement="flow"`, it participates in layout, uses the resolved Flow Visual
height and padding, and does not shrink below that height. The resolved height
contains the icon tile, vertical padding, and separator. With
`placement="overlay"`, Visual has no fixed Card height, is positioned against
Surface's inner bounds, covers Visual, Header, Content, and Footer backgrounds,
contributes no intrinsic height, and always uses `pointer-events-none`.

Root continues to impose no width, height, aspect ratio, or minimum height.
Consumers provide external geometry sufficient for their complete composition.
Card does not promise minimum dimensions, content wrapping, or overflow-free
arbitrary consumer content when that geometry is shorter or narrower than the
resolved Card parts.

The observable stack keeps Surface's overlay Visual behind normal flow content,
the transparent Selector below the complete real Footer, and the pointer-inert
Reveal overlay above the real Surface. Root's external focus outline and shadow
remain outside Reveal coverage. The Reveal overlay's Surface border remains
transparent above the real Surface border. The Reveal overlay may cover Footer
actions visually but never intercepts their input.

Omitted `stripesProps` and `stripesProps={true}` render an empty decorative
Stripes layer with the Stripes public defaults. `stripesProps={false}` renders
no Stripes. The object form passes the supported props to Stripes. Stripes keeps
its public precedence: component defaults, then consumer CSS variables from
`className` or `style`, then matching `angle`, `color`, `gap`, or `width` props.

Surface, separators, Description, Visual, Stripes, icon tile, Footer, and focus
use the semantic theme utilities documented by this spec. RevealAnimation
applies the opposite token mode to its overlay. Card's idle, hover, and selected
real Surface border and shadow colors resolve from semantic theme variables.
The decorative overlay Surface border is transparent rather than an
opposite-token color, and Card adds no Card-specific dark override.

Card.Button maps Card `xs` to Button `xs`, Card `md` to Button `md`, and Card
`xl` to Button `lg`. It preserves Button's complete contract except that the
consumer cannot pass `size`. It neither clones Button children nor restyles a
descendant Button. Card.Button's `link` variant preserves Button's size-neutral
inline treatment.

## Motion

Card uses CSS as the engine for hover and selected-presentation motion.
Selector hover controls Root's `translate` and `box-shadow` while the real
Surface retains its idle `border-color`. `data-selected` controls
RevealAnimation's diagonal `clip-path`, Root's full translation and shadow, and
the real Surface's foreground border, with selected presentation taking
priority over hover. The decorative Surface identified through
`data-reveal-overlay-surface` retains a transparent border in every state.

The Card presentation targets are:

| State                                                     | Root translation        | Root shadow                                   | Real Surface border | Overlay Surface border | RevealAnimation |
| --------------------------------------------------------- | ----------------------- | --------------------------------------------- | ------------------- | ---------------------- | --------------- |
| Selected, regardless of hover                             | `-0.125rem -0.125rem`   | `0.25rem 0.25rem 0 0 var(--color-foreground)` | Foreground          | Transparent            | Revealed        |
| Unselected, enabled, writable selectable Selector hovered | `-0.0625rem -0.0625rem` | `0.125rem 0.125rem 0 0 var(--color-border)`   | Color border        | Transparent            | Hidden          |
| Every other state                                         | None                    | None                                          | Color border        | Transparent            | Hidden          |

Translation, box-shadow, and the real Surface border-color transition for
`300ms` with `ease-out` easing in both directions. They start with
RevealAnimation and match its `clip-path` duration, but RevealAnimation keeps
its independently owned easing contract. The overlay Surface border remains
transparent rather than transitioning to a state color.

Hover, unhover, selection, and deselection transition from the current visual
state toward the new target. Selecting a hovered Card moves translation and
shadow from midpoint to selected, changes the real Surface border from
color-border to foreground, and reveals RevealAnimation without an overlay
border. Deselecting while the Selector remains hovered moves translation and
shadow from selected to midpoint, returns the real Surface border to
color-border, and hides RevealAnimation. Abandoned visual targets do not force
any transition to restart from an endpoint.

Under reduced motion, RevealAnimation's clip path, Root translation and shadow,
and real Surface border color reach idle, hover, or selected targets immediately
with no transition. The overlay Surface border remains transparent. The
external keyboard-focus outline remains independent and immediate. Size,
placement, layout, and Card variant changes do not animate.

Card.Button preserves Button's existing color transition, loading-spinner
motion, and optional RevealAnimation composition. Those behaviors remain owned
by Button and RevealAnimation rather than Card and remain subject to Surface's
render-twice compatibility requirements.

## Use Cases

### UC-001 - Render the multipart Card anatomy

Given a consumer renders Card.Root with one required Surface and any supported
optional Card parts inside Surface
When the Card is displayed
Then each part renders its documented element or public component composition
and Root and Surface remain neutral elements

### UC-002 - Select a Card size without external dimensions

Given a consumer omits Root size or selects xs, md, or xl
When the Card is displayed
Then the default md or selected xs, md, or xl documented spacing, Visual,
icon-tile, and SVG
metrics are applied and Root does not impose width, height, aspect ratio, or
minimum height

### UC-003 - Compose Title and Description typography and spacing

Given a consumer renders Card.Title and Card.Description inside Card.Header
When Root resolves to xs, md, or xl and the text size props are omitted or
explicitly provided
Then xs derives Heading sm and Text xs with no Title-to-Description gap, md
derives Heading lg and Text sm with gap-1, xl derives Heading xl and Text md
with gap-2, and an explicit text size replaces only the derived typography
while preserving render semantics and accessible text

### UC-004 - Render the default or configured Stripes layer

Given a consumer omits stripesProps, passes true, passes false, or passes a
CardVisualStripesProps object
When Card.Visual renders
Then it uses default Stripes, default Stripes, no Stripes, or configured Stripes
respectively while preserving the Stripes public override precedence

### UC-005 - Render icon content in the Card tile

Given a consumer passes SVG or arbitrary non-SVG React content to Visual icon
When Card.Visual renders
Then the Card-sized tile renders the content and only SVG descendants receive
the documented Card size normalization, while currentColor follows the active
real or revealed token mode and explicit SVG paint and non-SVG values remain
consumer-owned

### UC-006 - Render a selectable Card group

Given several selectable Card.Root elements each contain one direct Selector
followed by one Surface inside a named Card.Group
When the group is displayed
Then Group and Selector follow Base UI Radio Group and Radio semantics and each
Root remains a non-interactive visual state mirror with one mounted radio option

### UC-007 - Use controlled or uncontrolled selection

Given a consumer supplies value and onValueChange or supplies defaultValue
When selection changes
Then Card.Group follows the corresponding controlled or uncontrolled Base UI
Radio Group contract and preserves Base UI event details

### UC-008 - Name and describe each radio option

Given Selector receives aria-label or references unique labeling and describing
nodes outside Surface
When assistive technology reads the selectable Card
Then the radio receives the consumer-provided accessible name and optional
description while Group retains its separate group name and no reference points
to duplicated Surface content

### UC-009 - Mirror Selector state on Root

Given a direct Selector is checked, disabled, read-only, or focused
When its effective Base UI state changes
Then Selector exposes Base UI Radio attributes and Root exposes the documented
selectable, selected, disabled, read-only, size, and focus presentation, while
both Surface instances expose the documented mirrored state without taking
radio semantics

### UC-010 - Keep Footer independent from selection

Given a selectable Surface contains Footer content or actions
When the real Footer surface or one of its controls is activated
Then the Card selection does not change unless the consumer separately changes
Group value, the real Footer control performs only its own action, and the
decorative Footer copy remains inert

### UC-011 - Display simultaneous selection and keyboard focus

Given a selectable Root is selected and its direct Selector receives keyboard
focus
When the state is displayed
Then the selected Reveal, translation, hard shadow, foreground real Surface
border, transparent decorative overlay border, and the separate external
foreground focus outline remain simultaneously visible without layout shift

### UC-012 - Inherit Card size in Card.Button

Given Card.Button renders inside Card.Footer within Surface and Root
When the nearest Root size is xs, md, or xl
Then Card.Button composes Button at size xs, md, or lg respectively while
preserving every other Button prop and behavior

### UC-013 - Preserve Button alternatives and fallback

Given a consumer renders a direct Button, renders Card.Button through Button
render semantics, or renders Card.Button outside Root
When the action is displayed
Then the direct Button uses its explicit size, Card.Button preserves Button
composition, and the outside-Root Card.Button uses the md fallback

### UC-014 - Place Visual in flow or overlay

Given a consumer selects flow or overlay Visual placement
When the Card is displayed
Then flow contributes its resolved nonshrinking height while overlay uses the
available Surface bounds without a fixed Card height, contributes no intrinsic
height, intercepts no input, and remains inside RevealAnimation, Root focus,
and Root shadow coverage

### UC-015 - Use semantic light and dark colors

Given Card is displayed in light or dark theme
When semantic theme values change
Then the documented Card surfaces, text, borders, Stripes, selection, focus,
and icon tile use the corresponding real or revealed semantic token values
without Card-specific dark overrides, while the decorative overlay Surface
border remains transparent

### UC-016 - Anchor Footer to the Card bottom

Given Surface contains Footer with or without Content and the consumer may
supply extra height on Root
When the Card is displayed in flow or overlay Visual placement
Then Footer remains the final shrink-free flex item, follows preceding content
without free space, and uses the available free space to stay at the bottom
without Card imposing dimensions

### UC-017 - Animate hover and selected presentation

Given a Card is non-selectable or has a direct Selector that may be hovered,
selected, disabled, or read-only
When hover or selected presentation updates
Then only an unselected, enabled, writable hovered Selector targets the
documented midpoint translation and color-border hard shadow while the real
Surface retains color-border and Reveal stays hidden; selected presentation has
priority and targets diagonal RevealAnimation, the full field-emphasis
translation and foreground hard shadow, a foreground real Surface border, and a
transparent overlay Surface border; every other state targets no translation
or shadow, color-border on the real Surface, a transparent overlay Surface
border, and no Reveal; Card translation, shadow, and real Surface border color
use the CSS engine for 300ms with ease-out from the current visual state while
RevealAnimation follows its own CSS easing contract; reduced motion makes each
target immediate and focus remains independent

### UC-018 - Share one inline-start content axis

Given Visual, Header, Content, and Footer use their default Surface layout for
xs, md, or xl
When the Card is displayed
Then the icon-tile outer edge, Title, Description, Content box, and first Footer
child share the resolved spacing-2, spacing-3, or spacing-5 inline-start axis
without the centered SVG glyph defining that edge

### UC-019 - Render the required Surface twice

Given a consumer renders any Card.Root
When the Card is displayed
Then one required Surface owns the complete visual Card and RevealAnimation
renders the same Surface element, props, state, and children once as the real
surface and once as the decorative overlay surface, whose public overlay marker
applies Card's transparent-border exception

### UC-020 - Keep duplicated Surface content compatible

Given a consumer places content inside Surface
When RevealAnimation mounts the real and decorative Surface trees
Then the content is deterministic and safe to mount twice, uses no incompatible
form controls, escaping portals, document-unique identifiers, single-owner refs,
or non-reentrant effects, and Selector naming references only unique nodes
outside Surface
