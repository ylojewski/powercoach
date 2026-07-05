---
revision: 2
date: 2026-07-25
---

# CardPicker

## Overview

CardPicker presents an exclusive set of selectable Cards together with one
contextual Hint region. Each Card declares its radio value and exactly one help
content value. Selecting that Card displays its associated help through the
composed public Hint. When no current Card matches the selection, Hint displays
consumer-provided waiting content.

CardPicker composes the public Card and Hint families rather than recreating
their markup, appearance, selection, reveal, contextual-content, or motion
contracts. CardPicker.Group composes the sole Card.Group and Base UI
RadioGroup. Each CardPicker.Card composes one Card.Root, generates one empty
Card.Selector from its own value and selector props, and places one unchanged
consumer-supplied Card.Surface after that Selector. CardPicker.Hint composes
the sole Hint.

The family uses a bounded direct-part anatomy so the complete value-to-help
mapping exists synchronously during server rendering and the first client
render. Root reads only documented props from its own direct Group and Hint
parts and the direct Card parts inside Group. It never inspects rendered
descendants, custom-component output, the supplied Card.Surface subtree, DOM
shape, classes, attributes, or refs.

CardPicker.Root owns controlled and uncontrolled selection. A controlled
`null` value represents no selection. An uncontrolled Root without
`defaultValue` also begins without selection. Radio activation selects one
Card and does not deselect the active Card.

The logical `placement` prop positions the complete Card region relative to
Hint. Block placements arrange Root, Group, and Cards on the block axis.
Inline placements arrange Root, Group, and Cards on the inline axis. Root
changes actual region order for end placements so DOM, visual, reading, and
sequential focus order remain aligned. Inline placement follows the document
direction automatically in RTL.

CardPicker adds only its default layout gaps and sibling Card stacking. It adds
no independent color treatment, motion engine, focus relocation, keyboard
matrix, live region, or replacement lifecycle. It preserves the composed Card,
RevealAnimation, Base UI RadioGroup, Hint, and SwitchAnimation contracts. It
does not import Coss components or promise Coss compatibility.

## Anatomy

CardPicker exposes four public parts.

- `CardPicker.Root`: owns selection, mapping, placement, and the outer layout.
- `CardPicker.Group`: composes the sole Card.Group and contains direct Cards.
- `CardPicker.Card`: associates one generated selectable Card with one help
  content value.
- `CardPicker.Hint`: composes the sole Hint and supplies waiting content and
  supported Hint options.

The package exposes the `CardPicker` namespace and the prefixed leaf components
`CardPickerRoot`, `CardPickerGroup`, `CardPickerCard`, and `CardPickerHint`,
and assembles the same family at `Components.CardPicker` and
`Ui.Components.CardPicker`.

The package exports `CardPickerRootProps`, `CardPickerRootState`,
`CardPickerGroupProps`, `CardPickerGroupState`, `CardPickerCardProps`,
`CardPickerCardHint`, `CardPickerSelectorProps`, `CardPickerHintProps`,
`CardPickerPlacement`, `CardPickerValue`,
`CardPickerRootChangeEventReason`, `CardPickerRootChangeEventDetails`, and
`CardPickerNamespace`. It adds no unprefixed public type aliases.

The supported authored Root anatomy contains exactly one direct Group followed
by exactly one direct Hint. Group contains zero or more direct Card parts.
Each Card contains exactly one direct Card.Surface element. Root produces the
actual Group and Hint DOM order from placement.

```tsx
<CardPicker.Root>
  <CardPicker.Group aria-label="Exercise creation method">
    <CardPicker.Card
      value="from-scratch"
      hint={{ content: 'Create every exercise setting yourself.' }}
      selectorProps={{ 'aria-label': 'From Scratch' }}
    >
      <Card.Surface>
        <Card.Header>
          <Card.Title>From Scratch</Card.Title>
          <Card.Description>Start from an empty exercise.</Card.Description>
        </Card.Header>
      </Card.Surface>
    </CardPicker.Card>

    <CardPicker.Card
      value="template"
      hint={{ content: 'Begin with a structure that is already configured.' }}
      selectorProps={{ 'aria-label': 'Template' }}
    >
      <Card.Surface>
        <Card.Header>
          <Card.Title>Template</Card.Title>
          <Card.Description>Start from a reusable structure.</Card.Description>
        </Card.Header>
      </Card.Surface>
    </CardPicker.Card>
  </CardPicker.Group>

  <CardPicker.Hint waitingContent="Choose a method to see more information." />
</CardPicker.Root>
```

## Examples

### EX-001 - Select a Card from the waiting state

Context: An exercise builder needs an uncontrolled Card choice with no initial
selection and one contextual explanation per Card.

Expected behavior: Root begins without a selected Card because both `value` and
`defaultValue` are omitted. Hint displays the waiting content. Activating a
Selector selects exactly one Card through Card.Group, updates the visible
output, and replaces waiting content with that Card's colocated help content.
Each Card has one generated Selector with a direct accessible name and one
unchanged Surface. Root uses its default `gap-4`, Group uses its default
`gap-3`, and the selected Card stacks above its unselected sibling so its
shadow remains visible. Hint describes the named radiogroup and does not
become a live region.

Covers: UC-001, UC-002, UC-003, UC-006, UC-010, UC-011, UC-013, UC-014

```tsx
import * as React from 'react'
import { Card, CardPicker, Text } from '@powercoach/ui'

export function CreationMethodPicker() {
  const [observedValue, setObservedValue] = React.useState('none')

  return (
    <div className="grid gap-4">
      <Text render={<output />}>selected: {observedValue}</Text>

      <CardPicker.Root onValueChange={(value) => setObservedValue(value)}>
        <CardPicker.Group aria-label="Exercise creation method">
          <CardPicker.Card
            value="from-scratch"
            hint={{ content: 'Create every exercise setting yourself.' }}
            selectorProps={{ 'aria-label': 'From Scratch' }}
          >
            <Card.Surface>
              <Card.Header>
                <Card.Title render={<h2 />}>From Scratch</Card.Title>
                <Card.Description render={<p />}>Start from an empty exercise.</Card.Description>
              </Card.Header>
            </Card.Surface>
          </CardPicker.Card>

          <CardPicker.Card
            value="template"
            hint={{ content: 'Begin with a structure that is already configured.' }}
            selectorProps={{ 'aria-label': 'Template' }}
          >
            <Card.Surface>
              <Card.Header>
                <Card.Title render={<h2 />}>Template</Card.Title>
                <Card.Description render={<p />}>Start from a reusable structure.</Card.Description>
              </Card.Header>
            </Card.Surface>
          </CardPicker.Card>
        </CardPicker.Group>

        <CardPicker.Hint waitingContent="Choose a method to see more information." />
      </CardPicker.Root>
    </div>
  )
}
```

### EX-002 - Control empty selection and override composed surfaces

Context: A consumer needs controlled empty state, an inline Card region, and
independent override props for Root, Group, Card.Root, Card.Selector,
Card.Surface, and Hint.

Expected behavior: The reset control supplies controlled `null`, clears the
checked radio, removes Root's `data-selected`, and displays waiting content.
Selecting a Card supplies its string value through the unchanged change
details contract. Root renders as the supplied section. Group retains its
label, class, and data attribute. Each Card applies its own Card.Root size and
class, each generated Selector receives its supplied ARIA and data attributes,
each Surface retains normal Card composition, and Hint applies the supplied
Text and Stripes options without exposing `hints` or `waitingKey`.

Covers: UC-001, UC-002, UC-003, UC-004, UC-005, UC-009, UC-010, UC-013

```tsx
import * as React from 'react'
import { Card, CardPicker, Text } from '@powercoach/ui'

export function ControlledCardPicker() {
  const [method, setMethod] = React.useState<string | null>(null)

  return (
    <div className="grid gap-4">
      <button type="button" onClick={() => setMethod(null)}>
        reset selection
      </button>
      <Text render={<output />}>controlled value: {method ?? 'none'}</Text>

      <CardPicker.Root<string>
        placement="inline-start"
        value={method}
        onValueChange={(value) => setMethod(value)}
        render={<section aria-label="Controlled creation picker" />}
        className="gap-6"
        data-picker="controlled"
      >
        <CardPicker.Group
          aria-label="Controlled creation method"
          className="gap-3"
          data-group="methods"
        >
          <CardPicker.Card
            value="guided"
            size="xl"
            className="min-w-72"
            data-card="guided"
            hint={{ content: 'Follow a guided configuration sequence.' }}
            selectorProps={{
              'aria-label': 'Guided setup',
              'data-selector': 'guided'
            }}
          >
            <Card.Surface className="min-h-64">
              <Card.Header>
                <Card.Title render={<h2 />}>Guided setup</Card.Title>
                <Card.Description render={<p />}>
                  Answer a short sequence of questions.
                </Card.Description>
              </Card.Header>
            </Card.Surface>
          </CardPicker.Card>

          <CardPicker.Card
            value="manual"
            size="xl"
            className="min-w-72"
            data-card="manual"
            hint={{ content: 'Configure every value directly.' }}
            selectorProps={{
              'aria-label': 'Manual setup',
              'data-selector': 'manual'
            }}
          >
            <Card.Surface className="min-h-64">
              <Card.Header>
                <Card.Title render={<h2 />}>Manual setup</Card.Title>
                <Card.Description render={<p />}>
                  Enter each training parameter yourself.
                </Card.Description>
              </Card.Header>
            </Card.Surface>
          </CardPicker.Card>
        </CardPicker.Group>

        <CardPicker.Hint
          waitingContent="Select guided or manual setup."
          className="min-w-64"
          data-hint="method-help"
          textProps={{ size: 'sm', tone: 'accent' }}
          stripesOptions={{ gap: '6px', width: '2px' }}
        />
      </CardPicker.Root>
    </div>
  )
}
```

### EX-003 - Compare every logical placement in RTL

Context: A consumer needs to inspect all placement values, matching Card
direction, actual region order, and logical inline behavior under RTL.

Expected behavior: Block placements stack Root regions and Cards vertically.
Inline placements arrange Root regions and Cards inline. Start placements
render Group before Hint, while end placements render Hint before Group in
both the DOM and visual order. The RTL container makes inline-start place the
Card region at the right and inline-end place it at the left. Root's default
`gap-4` separates Group and Hint along each resolved axis, Group's default
`gap-3` separates Cards, and consumer Card widths compose without becoming
CardPicker defaults.

Covers: UC-001, UC-006, UC-009, UC-010, UC-014

```tsx
import { Card, CardPicker, Text } from '@powercoach/ui'

const placements = ['block-start', 'block-end', 'inline-start', 'inline-end'] as const

const choices = [
  {
    value: 'strength',
    title: 'Strength',
    hint: 'Prioritize controlled force production.'
  },
  {
    value: 'conditioning',
    title: 'Conditioning',
    hint: 'Prioritize repeatable work and recovery.'
  }
] as const

export function CardPickerPlacements() {
  return (
    <div dir="rtl" className="grid gap-8">
      {placements.map((placement) => (
        <section key={placement} className="grid gap-2 border border-border p-4">
          <Text render={<h2 />}>{placement}</Text>

          <CardPicker.Root placement={placement} defaultValue="strength">
            <CardPicker.Group aria-label={`${placement} training focus`}>
              {choices.map((choice) => (
                <CardPicker.Card
                  key={choice.value}
                  value={choice.value}
                  className="w-48"
                  hint={{ content: choice.hint }}
                  selectorProps={{ 'aria-label': choice.title }}
                >
                  <Card.Surface>
                    <Card.Header>
                      <Card.Title>{choice.title}</Card.Title>
                    </Card.Header>
                  </Card.Surface>
                </CardPicker.Card>
              ))}
            </CardPicker.Group>

            <CardPicker.Hint waitingContent="Choose a training focus." className="min-w-56" />
          </CardPicker.Root>
        </section>
      ))}
    </div>
  )
}
```

### EX-004 - Update direct Cards and retained selection

Context: A controlled picker receives dynamic direct Cards and help content
from application state.

Expected behavior: Removing the currently selected Template Card leaves the
controlled value retained by the consumer, but no radio is checked, Root's
effective render-state value becomes `null`, `data-selected` is absent, and
Hint shows waiting content. Reinserting the direct Card makes Template selected
again without a change event. Toggling its detail replaces help content for the
same Card value through a new private Hint replacement generation. The direct
conditional Card and mapped Card array update synchronously without an
effect-time registration pass.

Covers: UC-002, UC-003, UC-007, UC-008, UC-009, UC-011

```tsx
import * as React from 'react'
import { Card, CardPicker, Text } from '@powercoach/ui'

const permanentChoices = [
  {
    value: 'from-scratch',
    title: 'From Scratch',
    hint: 'Build every section yourself.'
  }
] as const

export function DynamicCardPicker() {
  const [method, setMethod] = React.useState<string | null>('template')
  const [showTemplate, setShowTemplate] = React.useState(true)
  const [detailed, setDetailed] = React.useState(false)

  const visibleHelp =
    method === 'template' && showTemplate
      ? detailed
        ? 'Template detail'
        : 'Template summary'
      : method === 'from-scratch'
        ? 'From Scratch'
        : 'Waiting'

  return (
    <div className="grid gap-4">
      <div className="flex gap-2">
        <button type="button" onClick={() => setMethod('template')}>
          retain template value
        </button>
        <button type="button" onClick={() => setShowTemplate((value) => !value)}>
          {showTemplate ? 'remove' : 'reinsert'} template Card
        </button>
        <button type="button" onClick={() => setDetailed((value) => !value)}>
          change template help
        </button>
      </div>

      <Text render={<output />}>
        retained value: {method ?? 'none'} · visible help: {visibleHelp}
      </Text>

      <CardPicker.Root value={method} onValueChange={setMethod}>
        <CardPicker.Group aria-label="Dynamic creation method" className="gap-3">
          {permanentChoices.map((choice) => (
            <CardPicker.Card
              key={choice.value}
              value={choice.value}
              hint={{ content: choice.hint }}
              selectorProps={{ 'aria-label': choice.title }}
            >
              <Card.Surface>
                <Card.Header>
                  <Card.Title>{choice.title}</Card.Title>
                </Card.Header>
              </Card.Surface>
            </CardPicker.Card>
          ))}

          {showTemplate && (
            <CardPicker.Card
              key="template-card"
              value="template"
              hint={{
                content: detailed
                  ? 'Use the detailed template configuration and review every preset.'
                  : 'Begin with a preconfigured template.'
              }}
              selectorProps={{ 'aria-label': 'Template' }}
            >
              <Card.Surface>
                <Card.Header>
                  <Card.Title>Template</Card.Title>
                </Card.Header>
              </Card.Surface>
            </CardPicker.Card>
          )}
        </CardPicker.Group>

        <CardPicker.Hint waitingContent="The retained value has no current Card." />
      </CardPicker.Root>
    </div>
  )
}
```

### EX-005 - Cancel an uncontrolled form selection

Context: A form permits one creation method but temporarily rejects another
before CardPicker commits its uncontrolled radio change.

Expected behavior: Selecting From Scratch calls `onValueChange` with the
unchanged Base UI details object. The consumer cancels that event, so the
uncontrolled value stays empty and Hint keeps waiting content. Selecting
Template is not canceled, commits the hidden radio value, displays its help,
and allows the required named field to submit. The visible probes distinguish
the attempted value, accepted value, and submitted FormData.

Covers: UC-002, UC-003, UC-004, UC-010

```tsx
import * as React from 'react'
import { Card, CardPicker, Text } from '@powercoach/ui'

export function CancellableFormCardPicker() {
  const [attempted, setAttempted] = React.useState('none')
  const [accepted, setAccepted] = React.useState('none')
  const [submitted, setSubmitted] = React.useState('not submitted')

  return (
    <form
      className="grid gap-4"
      onSubmit={(event) => {
        event.preventDefault()
        const data = new FormData(event.currentTarget)
        setSubmitted(String(data.get('creationMethod') ?? 'missing'))
      }}
    >
      <CardPicker.Root
        name="creationMethod"
        required
        onValueChange={(value, eventDetails) => {
          setAttempted(value)
          if (value === 'from-scratch') {
            eventDetails.cancel()
            return
          }
          setAccepted(value)
        }}
      >
        <CardPicker.Group aria-label="Permitted creation method" className="gap-3">
          <CardPicker.Card
            value="from-scratch"
            hint={{ content: 'This method is temporarily unavailable.' }}
            selectorProps={{ 'aria-label': 'From Scratch' }}
          >
            <Card.Surface>
              <Card.Header>
                <Card.Title>From Scratch</Card.Title>
              </Card.Header>
            </Card.Surface>
          </CardPicker.Card>

          <CardPicker.Card
            value="template"
            hint={{ content: 'Template is ready to submit.' }}
            selectorProps={{ 'aria-label': 'Template' }}
          >
            <Card.Surface>
              <Card.Header>
                <Card.Title>Template</Card.Title>
              </Card.Header>
            </Card.Surface>
          </CardPicker.Card>
        </CardPicker.Group>

        <CardPicker.Hint waitingContent="Choose an available method." />
      </CardPicker.Root>

      <button type="submit">submit method</button>
      <Text render={<output />}>
        attempted: {attempted} · accepted: {accepted} · submitted: {submitted}
      </Text>
    </form>
  )
}
```

### EX-006 - Keep disabled and read-only selection unavailable

Context: A consumer needs separately named disabled and read-only pickers with
their selected help still visible.

Expected behavior: The disabled Root passes disabled state to its sole Group
and every generated Selector, exposes disabled in Root render state, and
ignores selection interaction. The read-only Root preserves its selected Card
and help while preventing a different radio selection. Card actions remain
governed by the existing Card contract rather than CardPicker group state.

Covers: UC-003, UC-009, UC-010, UC-012, UC-013

```tsx
import { Card, CardPicker, Text } from '@powercoach/ui'

export function UnavailableCardPickers() {
  return (
    <div className="grid gap-8 md:grid-cols-2">
      <section className="grid gap-2">
        <Text id="disabled-picker-label">Disabled picker</Text>
        <CardPicker.Root defaultValue="locked" disabled>
          <CardPicker.Group aria-labelledby="disabled-picker-label" className="gap-3">
            <CardPicker.Card
              value="locked"
              hint={{ content: 'The locked method remains selected.' }}
              selectorProps={{ 'aria-label': 'Locked method' }}
            >
              <Card.Surface>
                <Card.Header>
                  <Card.Title>Locked method</Card.Title>
                </Card.Header>
              </Card.Surface>
            </CardPicker.Card>
            <CardPicker.Card
              value="alternate"
              hint={{ content: 'The alternate method cannot be selected.' }}
              selectorProps={{ 'aria-label': 'Alternate disabled method' }}
            >
              <Card.Surface>
                <Card.Header>
                  <Card.Title>Alternate method</Card.Title>
                </Card.Header>
              </Card.Surface>
            </CardPicker.Card>
          </CardPicker.Group>
          <CardPicker.Hint waitingContent="No disabled method is selected." />
        </CardPicker.Root>
      </section>

      <section className="grid gap-2">
        <Text id="readonly-picker-label">Read-only picker</Text>
        <CardPicker.Root defaultValue="fixed" readOnly>
          <CardPicker.Group aria-labelledby="readonly-picker-label" className="gap-3">
            <CardPicker.Card
              value="fixed"
              hint={{ content: 'The fixed method remains selected.' }}
              selectorProps={{ 'aria-label': 'Fixed method' }}
            >
              <Card.Surface>
                <Card.Header>
                  <Card.Title>Fixed method</Card.Title>
                </Card.Header>
              </Card.Surface>
            </CardPicker.Card>
            <CardPicker.Card
              value="alternate"
              hint={{ content: 'Read-only state prevents this selection.' }}
              selectorProps={{ 'aria-label': 'Alternate read-only method' }}
            >
              <Card.Surface>
                <Card.Header>
                  <Card.Title>Alternate method</Card.Title>
                </Card.Header>
              </Card.Surface>
            </CardPicker.Card>
          </CardPicker.Group>
          <CardPicker.Hint waitingContent="No read-only method is selected." />
        </CardPicker.Root>
      </section>
    </div>
  )
}
```

### EX-007 - Transfer focus between interactive help contents

Context: Contextual help contains an action that selects the Card associated
with the next help step.

Expected behavior: The Basic help button is a normal tab stop. Activating it
updates controlled selection to Advanced while focus is inside the outgoing
content. Hint and SwitchAnimation transfer focus without scrolling to the
incoming content box before the outgoing Basic box becomes inert and hidden
from assistive technology. The Hint wrapper receives the bubbled focus event,
and the lifecycle callbacks expose the normal SwitchAnimation replacement
records. CardPicker adds no second focus or lifecycle protocol.

Covers: UC-002, UC-003, UC-005, UC-010, UC-011

```tsx
import * as React from 'react'
import { Card, CardPicker, Text } from '@powercoach/ui'

export function InteractiveCardPickerHelp() {
  const [method, setMethod] = React.useState<'basic' | 'advanced'>('basic')
  const [focusProbe, setFocusProbe] = React.useState('No transferred focus yet')
  const [records, setRecords] = React.useState<string[]>([])

  const append = (record: string) => {
    setRecords((current) => [...current, record])
  }

  return (
    <div className="grid gap-4">
      <CardPicker.Root value={method} onValueChange={setMethod}>
        <CardPicker.Group aria-label="Configuration depth" className="gap-3">
          <CardPicker.Card
            value="basic"
            hint={{
              content: (
                <section>
                  <strong>Basic configuration</strong>
                  <button type="button" onClick={() => setMethod('advanced')}>
                    continue to advanced help
                  </button>
                </section>
              )
            }}
            selectorProps={{ 'aria-label': 'Basic configuration' }}
          >
            <Card.Surface>
              <Card.Header>
                <Card.Title>Basic</Card.Title>
              </Card.Header>
            </Card.Surface>
          </CardPicker.Card>

          <CardPicker.Card
            value="advanced"
            hint={{
              content: (
                <section>
                  <strong>Advanced configuration</strong>
                  Review load, tempo, and recovery together.
                </section>
              )
            }}
            selectorProps={{ 'aria-label': 'Advanced configuration' }}
          >
            <Card.Surface>
              <Card.Header>
                <Card.Title>Advanced</Card.Title>
              </Card.Header>
            </Card.Surface>
          </CardPicker.Card>
        </CardPicker.Group>

        <CardPicker.Hint
          waitingContent="Choose a configuration depth."
          onFocus={() => setFocusProbe(`Hint focus after ${method} selection`)}
          switchAnimationOptions={{
            onSwitchStart: (details) => append(`start ${details.replacementId}`),
            onSwitchComplete: (details) =>
              append(`complete ${details.replacementId} ${details.status}`)
          }}
        />
      </CardPicker.Root>

      <Text render={<output />}>selection: {method}</Text>
      <Text render={<output />}>{focusProbe}</Text>
      <Text render={<output />}>{records.join(', ') || 'No replacement records yet'}</Text>
    </div>
  )
}
```

### EX-008 - Override Card stacking and layout gaps

Context: A consumer needs wider separation between the Card region and Hint,
tighter separation between Cards, and one Card whose explicit stack level
overrides CardPicker's automatic selected ordering.

Expected behavior: Root's `gap-8` replaces the default `gap-4`, and Group's
`gap-1` replaces the default `gap-3`. The ordinary Card uses stack level zero
while unselected and one while selected. The Priority Card defines
`--card-picker-card-z-index: 2`, so it remains at stack level two in both
states and explicitly opts out of automatic selected ordering. Selecting
either Card still preserves the normal Card reveal, scale, shadow, focus, and
radio behavior.

Covers: UC-003, UC-005, UC-009, UC-014

```tsx
import * as React from 'react'
import { Card, CardPicker, Text } from '@powercoach/ui'

const priorityStackStyle = {
  '--card-picker-card-z-index': 2
} as React.CSSProperties

export function CardPickerLayoutOverrides() {
  const [method, setMethod] = React.useState<'ordinary' | 'priority'>('ordinary')

  return (
    <div className="grid gap-4">
      <Text render={<output />}>selected: {method}</Text>
      <Text>Root gap: gap-8 · Card gap: gap-1 · Priority stack: 2</Text>

      <CardPicker.Root
        placement="inline-start"
        value={method}
        onValueChange={setMethod}
        className="gap-8"
      >
        <CardPicker.Group aria-label="Stacking priority" className="gap-1">
          <CardPicker.Card
            value="ordinary"
            className="w-56"
            hint={{ content: 'Uses automatic stack levels zero and one.' }}
            selectorProps={{ 'aria-label': 'Ordinary stacking' }}
          >
            <Card.Surface>
              <Card.Header>
                <Card.Title>Ordinary</Card.Title>
                <Card.Description>Automatic selected ordering</Card.Description>
              </Card.Header>
            </Card.Surface>
          </CardPicker.Card>

          <CardPicker.Card
            value="priority"
            className="w-56"
            style={priorityStackStyle}
            hint={{ content: 'Keeps explicit stack level two in every state.' }}
            selectorProps={{ 'aria-label': 'Priority stacking' }}
          >
            <Card.Surface>
              <Card.Header>
                <Card.Title>Priority</Card.Title>
                <Card.Description>Explicit stack-level override</Card.Description>
              </Card.Header>
            </Card.Surface>
          </CardPicker.Card>
        </CardPicker.Group>

        <CardPicker.Hint waitingContent="Choose a stacking treatment." />
      </CardPicker.Root>
    </div>
  )
}
```

## Root

`CardPicker.Root` renders the one outer `div` by default. It owns the public
selection and form contract, derives the synchronous direct-Card mapping,
selects the active help content, orders Group and Hint, and applies the
placement-owned Root axis and default Group-to-Hint gap.

### Props

```ts
type CardPickerValue = React.Key

type CardPickerPlacement = 'block-start' | 'block-end' | 'inline-start' | 'inline-end'

type CardPickerRootState<TValue extends CardPickerValue = string> = {
  placement: CardPickerPlacement
  value: TValue | null
  disabled: boolean
  readOnly: boolean
  required: boolean
}

type CardPickerRootProps<TValue extends CardPickerValue = string> = Omit<
  useRender.ComponentProps<'div', CardPickerRootState<TValue>>,
  'children'
> & {
  children: React.ReactNode
  placement?: CardPickerPlacement
  value?: TValue | null
  defaultValue?: TValue
  onValueChange?: (value: TValue, eventDetails: CardPicker.Root.ChangeEventDetails) => void
  name?: string
  form?: string
  disabled?: boolean
  readOnly?: boolean
  required?: boolean
  inputRef?: React.Ref<HTMLInputElement>
}
```

| Prop               | Type                                                                                                  | Default         | Description                                                                                                                                    |
| ------------------ | ----------------------------------------------------------------------------------------------------- | --------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| `children`         | `React.ReactNode`                                                                                     | Required        | Exactly one direct Group followed by one direct Hint in the supported authored anatomy.                                                        |
| `placement`        | `"block-start" \| "block-end" \| "inline-start" \| "inline-end"`                                      | `"block-start"` | Places the complete Card region relative to Hint and selects the Root and Group logical axes.                                                  |
| `value`            | `TValue \| null`                                                                                      | `undefined`     | Current controlled value. A defined value, including `null`, makes Root controlled. `null` displays no selected Card and waiting Hint content. |
| `defaultValue`     | `TValue`                                                                                              | None            | Initial uncontrolled value. Omission begins with no selection. `null` and `undefined` are not Card values.                                     |
| `onValueChange`    | `(value: TValue, eventDetails: CardPicker.Root.ChangeEventDetails) => void`                           | None            | Called before an eligible radio value commits. Preserves the original Card.Group change-details object and cancellation contract.              |
| `name`             | `string`                                                                                              | None            | Identifies the composed radio field when a form is submitted.                                                                                  |
| `form`             | `string`                                                                                              | None            | Identifies the form that owns the composed hidden radio inputs.                                                                                |
| `disabled`         | `boolean`                                                                                             | `false`         | Whether the composed Group and its Selectors ignore user interaction.                                                                          |
| `readOnly`         | `boolean`                                                                                             | `false`         | Whether the user is prevented from selecting a different Card.                                                                                 |
| `required`         | `boolean`                                                                                             | `false`         | Whether a Card value is required for form submission.                                                                                          |
| `inputRef`         | `React.Ref<HTMLInputElement>`                                                                         | None            | Ref to the Base UI hidden group input according to Card.Group.                                                                                 |
| `className`        | `string \| ((state: CardPicker.Root.State<TValue>) => string \| undefined)`                           | None            | Class applied to Root or returned from effective CardPicker state. A supported conflicting Tailwind gap utility replaces the default `gap-4`.  |
| `style`            | `React.CSSProperties \| ((state: CardPicker.Root.State<TValue>) => React.CSSProperties \| undefined)` | None            | Style applied to Root or returned from effective CardPicker state. Inline `gap` has normal priority over non-important class declarations.     |
| `render`           | `ReactElement \| ((props: HTMLProps, state: CardPicker.Root.State<TValue>) => ReactElement)`          | None            | Replaces the default `div` through Base UI useRender semantics.                                                                                |
| native `div` props | `useRender.ComponentProps<"div", CardPicker.Root.State<TValue>>` inherited props                      | None            | Native attributes, events, ARIA attributes, consumer data attributes, and the outer Root ref pass through to the final element.                |

`value !== undefined` determines controlled usage, so controlled `null` is
distinct from omitted `value`. Root does not expose `null` through
`onValueChange`: selecting a radio emits its non-null Card value, and activating
the already selected radio does not emit deselection.

Root state reports the effective displayed selection. When the retained
controlled or uncontrolled value has no matching direct Card, `state.value` is
`null` even though CardPicker retains the unmatched value privately so a later
matching Card can become selected again.

Root owns `children` because the family requires exactly one direct Group and
one direct Hint. A consumer cannot supply additional Root children, alternate
regions, or another Card.Group or Hint through a public slot.

### Events

`onValueChange` is CardPicker's only custom event. The package exposes
`CardPickerRootChangeEventReason` and `CardPickerRootChangeEventDetails` as
exact aliases of `CardGroupChangeEventReason` and
`CardGroupChangeEventDetails`.

The callback receives the original details object, including `reason`, `event`,
`cancel`, `allowPropagation`, `isCanceled`, `isPropagationAllowed`, and
`trigger`. Calling `cancel()` prevents CardPicker from committing an
uncontrolled change. Controlled consumers retain responsibility for whether
they commit the received value to their own state.

Removing, inserting, or reordering a Card does not emit `onValueChange`.
Changing the associated help content also does not emit a selection event.

### Data Attributes

| Attribute                                                                       | Description                                                            |
| ------------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| `data-placement="block-start" \| "block-end" \| "inline-start" \| "inline-end"` | Indicates the resolved placement and is always present.                |
| `data-selected`                                                                 | Present only while the retained value matches one current direct Card. |

Root does not expose the selected value in a data attribute. Consumer `data-*`
attributes pass through to the outer Root.

### CSS Variables

Root defines no public CSS variables.

## Group

`CardPicker.Group` composes the sole Card.Group and Base UI RadioGroup. It
renders a `div` by default, receives selection and form state from Root, and
contains zero or more direct CardPicker.Card parts. It applies the
placement-owned Group axis and default direct-Card gap without introducing
another wrapper.

### Props

```ts
type CardPickerGroupProps = Omit<
  CardGroupProps<CardPickerValue>,
  | 'value'
  | 'defaultValue'
  | 'onValueChange'
  | 'name'
  | 'form'
  | 'disabled'
  | 'readOnly'
  | 'required'
  | 'inputRef'
>

type CardPickerGroupState = CardGroupState
```

| Prop                       | Type                   | Default | Description                                                                                                                                                                              |
| -------------------------- | ---------------------- | ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `children`                 | `React.ReactNode`      | None    | Zero or more direct CardPicker.Card elements after ignorable boolean, null, and undefined children are removed.                                                                          |
| accessible naming props    | Card.Group ARIA props  | None    | `aria-label`, `aria-labelledby`, or valid Fieldset Legend composition gives the radiogroup its required name.                                                                            |
| description props          | Card.Group ARIA props  | None    | Consumer `aria-describedby` tokens are merged with the stable CardPicker.Hint wrapper identifier.                                                                                        |
| `className`                | Card.Group `className` | None    | Class applied to Group or returned from the exact Card.Group state while preserving the placement-owned axis. A supported conflicting Tailwind gap utility replaces the default `gap-3`. |
| `style`                    | Card.Group `style`     | None    | Style applied to Group or returned from the exact Card.Group state while preserving the placement-owned axis. Inline `gap` has normal priority over non-important class declarations.    |
| `render`                   | Card.Group `render`    | None    | Replaces the default Group `div` through Card.Group and Base UI RadioGroup render semantics.                                                                                             |
| remaining Card.Group props | `CardPickerGroupProps` | None    | Native div and ARIA attributes, events, consumer data attributes, children, and the radiogroup ref pass through according to Card.Group.                                                 |

Group does not publicly accept selection or form ownership props. Root is the
only public owner of `value`, `defaultValue`, `onValueChange`, `name`, `form`,
`disabled`, `readOnly`, `required`, and `inputRef`.

### Events

Group defines no custom events. Native events pass through according to
Card.Group. Selection changes are exposed only through Root.

### Data Attributes

Group preserves Card.Group's documented `data-disabled` attribute and native
consumer `data-*` attributes. It adds no CardPicker selection or placement
attribute.

### CSS Variables

Group defines no public CSS variables.

## Card

`CardPicker.Card` associates one unique value, one generated Selector, one
help content value, and one supplied Card.Surface. It composes Card.Root as its
final element and adds no wrapper.

### Props

```ts
type CardPickerCardHint = Omit<HintItem, 'key' | 'condition'>

type CardPickerSelectorProps<TValue extends CardPickerValue = string> = Omit<
  CardSelectorProps<TValue>,
  'value'
>

type CardPickerCardProps<TValue extends CardPickerValue = string> = Omit<
  CardRootProps,
  'children'
> & {
  value: TValue
  hint: CardPickerCardHint
  selectorProps: CardPickerSelectorProps<TValue>
  children: React.ReactElement<CardSurfaceProps>
}
```

| Prop                      | Type                                   | Default            | Description                                                                                                                                     |
| ------------------------- | -------------------------------------- | ------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| `value`                   | `TValue`                               | Required           | Non-null unique radio and help identity. Uses Card.Group and Base UI RadioGroup value equality.                                                 |
| `hint`                    | `CardPickerCardHint`                   | Required           | Contains the one `HintContent` value associated with this Card. CardPicker owns its condition and internal SwitchAnimation key.                 |
| `selectorProps`           | `CardPickerSelectorProps<TValue>`      | Required           | Props for the generated empty Card.Selector except its Card-owned value. Must provide a direct accessible name.                                 |
| `children`                | `React.ReactElement<CardSurfaceProps>` | Required           | Exactly one direct Card.Surface element placed unchanged after the generated Selector.                                                          |
| remaining Card.Root props | `Omit<CardRootProps, "children">`      | Card.Root defaults | Size, render, className, style, native and ARIA attributes, events, consumer data attributes, and ref apply directly to the composed Card.Root. |

`CardPickerCardHint` contains exactly the public Hint item `content` field:

```ts
interface CardPickerCardHint {
  readonly content: HintContent
}
```

CardPicker derives Hint condition and opaque internal key from Card identity
and committed help generation. It does not expose or promise the literal key.
When committed help content changes while `value` remains stable, CardPicker
can give the active content a new replacement generation so Hint and
SwitchAnimation perform their normal keyed replacement.

`selectorProps` preserves Card.Selector's `nativeButton`, `disabled`,
`readOnly`, `required`, `inputRef`, `render`, `className`, `style`, native and
ARIA attributes, native events, consumer data attributes, and Selector ref.
It does not accept a second `value`, and Card.Selector already does not accept
children.

Card's one Surface child preserves the complete Card.Surface contract.
CardPicker does not clone, inspect, filter, rewrite, or derive information from
the Surface subtree.

### Events

Card defines no CardPicker-specific events. Native Card.Root handlers pass
through without creating selection behavior. Generated Selector behavior
passes through Card.Group and Root's `onValueChange`.

### Data Attributes

Because CardPicker.Card composes Card.Root directly, it preserves Card.Root's
`data-size`, `data-selectable`, `data-selected`, `data-disabled`, and
`data-readonly` attributes. Consumer `data-*` attributes pass through to
Card.Root.

CardPicker.Card defines no extra help or value data attribute.

### CSS Variables

| Variable                     | Default                      | Description                                                                                                                                                                                          |
| ---------------------------- | ---------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--card-picker-card-z-index` | `0` unselected; `1` selected | Effective stack level applied to the composed Card.Root. An explicit valid CSS `z-index` value overrides both state defaults for that Card and opts it out of CardPicker's automatic selected order. |

The variable inherits normally. Defining it on an ancestor gives descendant
Cards the inherited explicit level unless a nearer declaration overrides it.
CardPicker preserves Card.Root's lack of Card-owned public CSS variables.

## Hint

`CardPicker.Hint` composes the sole public Hint and renders its public `div`
wrapper by default. It receives waiting content and the supported Hint override
surfaces. CardPicker derives and supplies Hint's items, conditions, waiting
key, and selected key.

### Props

```ts
type CardPickerHintProps = Omit<HintProps, 'hints' | 'waitingKey'>
```

| Prop                     | Type                         | Default  | Description                                                                                                                                   |
| ------------------------ | ---------------------------- | -------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| `waitingContent`         | `HintContent`                | Required | Content displayed while no retained value matches a current direct Card.                                                                      |
| `textProps`              | `HintTextProps`              | Hint     | Preserves Hint's bounded Text size, appearance, class, style, and precedence contract.                                                        |
| `stripesOptions`         | `HintStripesOptions`         | Hint     | Preserves Hint's bounded Stripes options and required surface ownership.                                                                      |
| `switchAnimationOptions` | `HintSwitchAnimationOptions` | Hint     | Preserves Hint's direction, lifecycle callbacks, class, style, public motion variables, flow mode, focus transfer, and replacement lifecycle. |
| `render`                 | Hint `render`                | None     | Replaces the Hint wrapper through its public Base UI useRender semantics.                                                                     |
| `className`              | Hint `className`             | None     | Applies consumer classes to the public Hint wrapper.                                                                                          |
| `style`                  | Hint `style`                 | None     | Applies consumer styles to the public Hint wrapper.                                                                                           |
| remaining Hint props     | `CardPickerHintProps`        | None     | Native and ARIA attributes, events, consumer data attributes, and wrapper ref pass through according to Hint.                                 |

Hint does not accept public `hints`, `waitingKey`, conditions, selected key, or
alternate children through CardPicker. CardPicker owns those fields so every
direct Card remains associated with exactly its colocated help.

Root ensures the final Hint wrapper has a stable identifier. A
consumer-supplied `id` is preserved; otherwise Root supplies a stable generated
identifier. Root merges that identifier into the composed Group's
`aria-describedby` tokens without removing consumer descriptions.

### Events

Hint defines no CardPicker-specific events. Native wrapper events pass through.
SwitchAnimation lifecycle callbacks supplied through
`switchAnimationOptions` preserve Hint and SwitchAnimation event details,
ordering, interruption, completion, and unmount behavior.

### Data Attributes

CardPicker.Hint defines no custom data attributes. Consumer `data-*`
attributes pass through to the Hint wrapper. The composed SwitchAnimation
retains its public `data-motion`, `data-content-mode`, and `data-direction`
attributes without making them CardPicker selectors.

### CSS Variables

Hint defines no CardPicker CSS variables. Public Stripes and SwitchAnimation
variables supplied through Hint options remain owned by their existing
components.

## Accessibility

CardPicker.Root is a neutral `div` by default. CardPicker.Group composes the
sole Card.Group and Base UI RadioGroup and owns the one radiogroup semantic,
hidden form-input set, keyboard behavior, focus management, exclusive state,
disabled behavior, read-only behavior, and required behavior. CardPicker does
not recreate radio behavior through Root click handlers or keyboard handlers.

Group requires its own accessible name through `aria-label`,
`aria-labelledby`, or valid Fieldset Legend composition. Waiting or selected
Hint content is the group description, not the group name.

Each CardPicker.Card generates exactly one Card.Selector and supplies its Card
value. Every `selectorProps` object must provide a unique accessible name
through the Card-supported direct `aria-label` or a reference to a unique node
outside the duplicated Surface. Selector labeling and description must not
reference Card.Title, Card.Description, or another Surface descendant because
Card.Surface renders its subtree twice.

Root ensures CardPicker.Hint has one stable wrapper identifier and merges that
identifier into Group's `aria-describedby` tokens. The current waiting or
selected help therefore describes the radiogroup as a whole. It is not attached
to every radio, so unselected options do not receive the currently selected
Card's help as their individual description.

Hint remains neutral. CardPicker adds no `role`, `alert`, `aria-live`,
announcement behavior, or guarantee that a help replacement is announced
without focus movement. Consumers may add supported semantics to Hint's public
wrapper when their context requires them.

Focusable content inside Card help retains its own semantics and normal tab
stops. If focus is inside outgoing Hint content when selection or committed
help content changes, Hint and SwitchAnimation transfer focus without scrolling
to the incoming keyed content box before the outgoing content becomes inert,
`aria-hidden`, and pointer-inert. CardPicker adds no second focus relocation.

Root changes the actual region DOM order for end placements. Block-start and
inline-start render Group then Hint. Block-end and inline-end render Hint then
Group. DOM, visual, reading, and sequential focus order therefore remain
aligned even when Hint contains interactive content.

Every supplied Card.Surface retains the complete Card duplication and
accessibility contract. The generated Selector is mounted once outside that
duplicated subtree. The Surface subtree must remain deterministic and safe to
render and mount twice. Document-unique IDs, incompatible form controls,
escaping portals, single-owner refs, non-reentrant effects, and other
Card-documented incompatible content remain unsupported.

Card Footer actions remain separate from Selector and preserve Card behavior.
Root-level disabled and read-only radio state does not independently redefine
Card.Button or another Footer action.

Selection and contextual help supplement rather than replace radio semantics.
CardPicker does not rely on visual Card selection or Hint appearance as the
only accessible representation of the current radio value.

## Behavior

Root uses the authored direct child order Group then Hint to discover its two
regions. It supports exactly one direct element of each public part. A Fragment
containing Group or Hint, a wrapper element, or a custom component that later
returns either part is unsupported because Root does not inspect eventual
rendered output.

Root synchronously reads the direct CardPicker.Card elements supplied to Group.
It derives one mapping entry from each Card's `value` and `hint.content` before
rendering the composed Card.Group and Hint. It does not use effects,
registration callbacks, DOM queries, component output inspection, or a private
protocol with Card, Hint, or Card.Surface.

Group accepts direct Card arrays. It removes `null`, `undefined`, `false`, and
`true` children before interpreting its remaining direct children. A conditional
expression is supported when its present result is a direct Card and its absent
result is `null` or `false`. Fragments are not traversed. A Fragment containing
Cards, a wrapper element, or a custom component that later returns Card is
unsupported.

Each Card requires one direct Card.Surface child. A Fragment, wrapper, custom
component, or alternate Card child is unsupported. CardPicker generates the
empty Card.Selector from Card's `value` and `selectorProps`, then places the
supplied Surface unchanged after Selector inside the composed Card.Root.

Card values use the Card.Group and Base UI RadioGroup equality contract.
Values are constrained to `React.Key`, exclude `null` and `undefined`, and must
be mutually unique among current direct Cards. Duplicate values are invalid
usage. CardPicker does not select the first duplicate, merge duplicate help
content, or define array-order fallback for duplicates.

Normal React keys and Card values are separate. A dynamic array needs stable
React keys for React reconciliation and mutually unique Card values for radio
and help identity. Array order defines visual and radio order. Direct Card
insertion, removal, and reordering update the mapping in the same render.

In controlled usage, any defined `value`, including `null`, is authoritative.
In uncontrolled usage, Root initializes from `defaultValue` or from no
selection and retains its own value. Group receives the resolved value as its
one state owner and remains the sole rendered RadioGroup.

When the retained value matches one current Card, that generated Selector is
checked, Root state exposes that value, Root exposes `data-selected`, and Hint
selects the Card's help content. When the retained value is `null` or has no
current matching Card, no generated Selector is checked, Root state exposes
`null`, `data-selected` is absent, and Hint displays `waitingContent`.

Removing the matching Card does not discard the retained controlled or
uncontrolled value and does not emit `onValueChange`. Reinserting a direct Card
with that value makes it selected again according to normal RadioGroup
equality. If a controlled consumer changes to a value without a matching Card,
the same waiting behavior applies until a matching Card appears or the
controlled value changes.

Activating an eligible generated Selector calls Root `onValueChange` with its
non-null Card value and the unchanged Card.Group event details. If the event is
not canceled, uncontrolled Root commits the value and controlled Root waits for
the consumer value. Activating the already selected radio does not clear the
value or return to waiting content.

Card help accepts Hint's supported `HintContent`: a string or React element.
Root supplies exactly one true condition to the composed Hint when a Card
matches, and no true condition while waiting. Array order and value uniqueness
make the active help deterministic without Hint's first-fulfilled fallback
serving as duplicate resolution.

CardPicker owns stable, collision-free, opaque keys for waiting and Card help.
Keys distinguish Card value type and identity and can distinguish a new
committed help generation for the same Card. Literal key strings are not public
and cannot be used as consumer coordination surfaces.

Root and Group are flex containers with no default wrapping. Root uses
`gap-4`, equal to `1rem`, between Group and Hint. Group uses `gap-3`, equal to
`0.75rem`, between direct Cards. Placement sets their axes and Root's actual
region order:

| Placement      | Root axis | Group axis | Actual region order | Card region  |
| -------------- | --------- | ---------- | ------------------- | ------------ |
| `block-start`  | Block     | Block      | Group, Hint         | Block start  |
| `block-end`    | Block     | Block      | Hint, Group         | Block end    |
| `inline-start` | Inline    | Inline     | Group, Hint         | Inline start |
| `inline-end`   | Inline    | Inline     | Hint, Group         | Inline end   |

Block layout follows the document block axis. Inline layout follows the logical
inline axis, so inline-start and inline-end adapt to LTR and RTL without
physical left or right values and without `row-reverse` or `column-reverse`.

CardPicker owns Root axis, Group axis, direct Card order, Group/Hint region
order, the Root region gap, the Group Card gap, and the default sibling Card
stack levels. Each CardPicker.Card applies
`var(--card-picker-card-z-index, 0)` while unselected and
`var(--card-picker-card-z-index, 1)` while selected to its composed Card.Root.
Within the default common sibling stacking context, the selected Card therefore
paints above every unselected sibling so its scale and shadow are not covered.
An explicit variable declaration overrides both state fallbacks and opts that
Card out of automatic selected ordering.

Root and Group resolve consumer `className` after their default classes through
Tailwind conflict merging. A supported conflicting `gap-*` utility therefore
replaces `gap-4` on Root or `gap-3` on Group. Inline style retains normal CSS
priority over non-important class declarations.

CardPicker defines no wrapping, alignment, region width, Root width or height,
Card width or height, Hint width or height, overflow policy, responsive
placement, or breakpoint. Consumers provide those treatments through Root,
Group, Card, Card.Surface, and Hint public class and style surfaces.

Consumer overrides that replace a placement-owned display axis, region order,
gap, positioning, common stacking context, or stack level opt out of only the
corresponding placement, spacing, or automatic ordering guarantee. CardPicker
does not restore the guarantee through important declarations, DOM
measurement, JavaScript positioning, duplicated regions, or hidden wrappers.

## Motion

CardPicker creates no independent animation engine, transition, keyframe,
timeline, or lifecycle.

Selected stack-level transfer is immediate. CardPicker does not animate
`z-index`, the public stack-level variable, or either layout gap.

Generated selectable Cards preserve Card's CSS hover and selected scale and
shadow transitions and Card.Surface's composed RevealAnimation. Selecting and
deselecting Cards continue to follow the complete Card and RevealAnimation
motion, interruption, focus, theme, and reduced-motion contracts.

Waiting-to-help, help-to-help, help-to-waiting, and committed-content
replacements preserve Hint's composed SwitchAnimation CSS engine. Hint owns
initial rendering, keyed generations, measured layout, incoming and outgoing
presence, opacity and translation, focus transfer, lifecycle callbacks,
interruption, zero-motion completion, and reduced-motion behavior.

Changing placement, inserting, removing, or reordering direct Cards does not
add CardPicker motion. A matching selection or help-content change may still
trigger the existing composed Card or Hint motion that its owning public
contract defines.

CardPicker does not expose its private waiting, Card identity, or help
generation keys as motion controls. Consumers use only Hint's bounded
`switchAnimationOptions` and the public motion variables and lifecycle
callbacks owned by Hint and SwitchAnimation.

## Use Cases

### UC-001 - Render the compound CardPicker anatomy

Given a consumer renders Root with one direct Group followed by one direct Hint
and Group contains zero or more direct Cards
When CardPicker is displayed
Then Root, Group, Card, and Hint render their documented default elements and
public compositions without extra Card or region wrappers

### UC-002 - Associate one help value with every Card

Given each direct Card has one unique non-null value, one hint content value,
one selectorProps object, and one direct Card.Surface
When Root derives the current mapping
Then every generated Selector value identifies exactly one Card and one help
content value without descendant inspection, registration effects, duplicate
fallback, or exposed internal Hint keys

### UC-003 - Use controlled, uncontrolled, and empty selection

Given a consumer supplies a defined value including null, omits value and
supplies defaultValue, or omits both value and defaultValue
When Root resolves selection
Then it follows controlled, initialized uncontrolled, or initially empty
uncontrolled behavior respectively and radio activation emits only a non-null
Card value without deselecting the active radio

### UC-004 - Preserve form and change-event behavior

Given Root receives name, form, disabled, readOnly, required, inputRef, or
onValueChange
When the composed Card.Group handles radio and form behavior
Then it preserves the Base UI RadioGroup contract and original event details,
and cancellation prevents CardPicker's uncontrolled commit

### UC-005 - Override the composed public surfaces

Given consumers supply Root, Group, Card.Root, selectorProps, Card.Surface, or
Hint props through their documented parts
When CardPicker renders
Then each override applies only to its corresponding public surface while
CardPicker retains selection ownership, direct anatomy, value association,
placement axes, and private Hint keys

### UC-006 - Show waiting or matching help

Given the retained value is null, has no matching current Card, or matches one
current Card
When Hint resolves its content
Then it displays waitingContent, waitingContent, or the matching Card's
hint.content respectively and keeps Hint's Text, Stripes, SwitchAnimation, and
focus contracts

### UC-007 - Support bounded direct dynamic Cards

Given Group receives direct Card arrays or conditional direct Cards with stable
React keys and mutually unique Card values
When Cards are inserted, removed, or reordered
Then Root derives the new mapping synchronously in the same render, array order
defines Card order, and Fragments, wrappers, and custom-component indirection
remain unsupported

### UC-008 - Retain an unmatched value and update help

Given a selected Card is removed, later reinserted, or receives new committed
help content under the same value
When Root updates
Then removal displays waiting without emitting a value change, reinsertion
restores the retained selection, and changed help receives the normal Hint
keyed replacement without changing the radio value

### UC-009 - Arrange every logical placement

Given placement is block-start, block-end, inline-start, or inline-end
When CardPicker renders
Then Root and Group use the matching block or inline axis, actual region order
places Cards at the named logical side, DOM and visual order match, and inline
placement follows LTR or RTL direction

### UC-010 - Name and describe the radio choice

Given Group has an accessible radiogroup name, every generated Selector has a
unique accessible name, and Hint has its stable wrapper identifier
When assistive technology reads CardPicker
Then Hint's current waiting or help content describes the radiogroup, does not
incorrectly describe every radio, and CardPicker adds no live-region or alert
semantic

### UC-011 - Preserve Hint replacement and focus continuity

Given selection or committed help content changes while focus may be inside
outgoing interactive help
When Hint replaces its keyed content
Then SwitchAnimation preserves its lifecycle and transfers focus without
scrolling before outgoing content becomes decorative, while CardPicker adds no
second focus or replacement protocol

### UC-012 - Keep unavailable radio state separate from Card actions

Given Root or a generated Selector is disabled, read-only, or required and a
Card.Surface may contain Footer actions
When the picker is displayed or activated
Then RadioGroup and Selector preserve their effective unavailable or form
state, selected help remains visible when applicable, and Card Footer actions
remain governed by Card rather than CardPicker selection state

### UC-013 - Preserve Card duplicated-Surface compatibility

Given each Card receives one direct Card.Surface with consumer content
When Card renders its real and decorative Surface trees
Then CardPicker leaves the Surface unchanged and all Card requirements for
deterministic duplicated content, identifiers, controls, portals, refs, effects,
accessibility, and actions remain in force

### UC-014 - Stack the selected Card and space the layout

Given CardPicker uses its default layout, a Card may define
`--card-picker-card-z-index`, and Root or Group may receive consumer className
or style
When selection or layout styling changes
Then Root places `gap-4` between Group and Hint, Group places `gap-3` between
direct Cards, a default selected Card uses stack level one above default
unselected siblings at level zero, an explicit stack-level variable overrides
both state defaults for that Card, supported conflicting Tailwind gap utilities
replace the component gaps, inline style retains normal CSS priority, and
stack-level transfer remains immediate without changing Card motion
