---
revision: 5
date: 2026-07-20
---

# Hint

## Overview

Hint displays contextual information inside a striped support surface. It shows
the first fulfilled hint from an ordered list and returns to consumer-provided
waiting content when no hint is fulfilled.

Hint composes the public Stripes, SwitchAnimation, and Text contracts. Stripes
provides its default striped background and owns the surface spacing and
clipping. SwitchAnimation replaces the selected keyed content with its CSS
switch motion, measured layout, focus transfer, lifecycle callbacks, and
reduced-motion behavior. Text provides the selected size, semantic appearance,
and consumer styling treatment on the owned content box.

Hint exposes one public wrapper. It renders a `div` by default and supports Base
UI render replacement. The composed Stripes surface, SwitchAnimation root, and
keyed Text content box are owned internals, not public parts or styling targets.

## Anatomy

Hint exposes one public component.

- `Hint`: renders the contextual-information wrapper.

By default, Hint renders a `div`. Its owned subtree contains Stripes,
SwitchAnimation in flow content mode, and one keyed Text rendered as a `div`
for the selected content.

```tsx
<Hint
  waitingKey="waiting"
  waitingContent="Complete a field to see a hint."
  hints={[
    {
      key: 'duration',
      content: 'Add a recovery interval after long efforts.',
      condition: duration > 30
    }
  ]}
/>
```

## Examples

### EX-001 - Show waiting content until a hint is fulfilled

Context: A workout form needs a contextual explanation before and after the
consumer's condition becomes fulfilled.

Expected behavior: Hint initially shows the waiting string. Selecting the
checkbox makes the fulfilled hint active. Clearing it returns to the waiting
string. Every change uses the exact selected key as the SwitchAnimation
replacement key.

Covers: UC-001, UC-002, UC-003, UC-004, UC-005, UC-010

```tsx
import * as React from 'react'
import { Hint } from '@powercoach/ui'

export function RecoveryHint() {
  const [longEffort, setLongEffort] = React.useState(false)

  return (
    <div>
      <label>
        <input
          type="checkbox"
          checked={longEffort}
          onChange={(event) => setLongEffort(event.currentTarget.checked)}
        />
        effort longer than 30 seconds
      </label>

      <Hint
        waitingKey="waiting"
        waitingContent="Choose an effort duration to see recovery guidance."
        hints={[
          {
            key: 'long-effort',
            content: 'Add enough recovery to preserve rep quality.',
            condition: longEffort
          }
        ]}
      />

      <output>Active content: {longEffort ? 'long effort hint' : 'waiting'}</output>
    </div>
  )
}
```

### EX-002 - Resolve an accidentally overlapping condition set

Context: A consumer owns mutually exclusive conditions but needs deterministic
fallback behavior if two conditions are fulfilled during an intermediate
state.

Expected behavior: The first fulfilled item in the `hints` array is active. If
both checkboxes are selected, the strength hint wins because it appears first.
If neither is selected, Hint shows the waiting content.

Covers: UC-002, UC-003, UC-004

```tsx
import * as React from 'react'
import { Hint } from '@powercoach/ui'

export function OrderedTrainingHint() {
  const [strength, setStrength] = React.useState(false)
  const [conditioning, setConditioning] = React.useState(false)

  const active = strength ? 'strength' : conditioning ? 'conditioning' : 'waiting'

  return (
    <div>
      <label>
        <input
          type="checkbox"
          checked={strength}
          onChange={(event) => setStrength(event.currentTarget.checked)}
        />
        strength condition fulfilled
      </label>
      <label>
        <input
          type="checkbox"
          checked={conditioning}
          onChange={(event) => setConditioning(event.currentTarget.checked)}
        />
        conditioning condition fulfilled
      </label>

      <Hint
        waitingKey="waiting"
        waitingContent="Select a training condition."
        hints={[
          {
            key: 'strength',
            content: 'Keep the main lift first in the session.',
            condition: strength
          },
          {
            key: 'conditioning',
            content: 'Keep the work-to-rest ratio repeatable.',
            condition: conditioning
          }
        ]}
      />

      <output>Active selection: {active}</output>
    </div>
  )
}
```

### EX-003 - Switch interactive React content and preserve focus continuity

Context: A contextual area contains structured React elements, including an
action that causes the next hint to become active.

Expected behavior: Hint places each supplied element inside its own keyed,
programmatically focusable content box without cloning the supplied element.
When the action changes the selected key while focus is inside the outgoing
content, SwitchAnimation transfers focus without scrolling to the incoming
content box. The visible probe reports which content box received focus.

Covers: UC-003, UC-005, UC-009, UC-010, UC-011

```tsx
import * as React from 'react'
import { Hint } from '@powercoach/ui'

export function ProgressiveHint() {
  const [advanced, setAdvanced] = React.useState(false)
  const [focusProbe, setFocusProbe] = React.useState('No transferred focus yet')

  return (
    <div>
      <Hint
        waitingKey="basic"
        waitingContent={
          <section>
            <strong>Start with one working set.</strong>
            <button type="button" onClick={() => setAdvanced(true)}>
              show progression hint
            </button>
          </section>
        }
        hints={[
          {
            key: 'advanced',
            condition: advanced,
            content: (
              <section onFocus={() => setFocusProbe('Progression hint focused')}>
                Add load only after every target rep is controlled.
              </section>
            )
          }
        ]}
      />

      <output>{focusProbe}</output>
    </div>
  )
}
```

### EX-004 - Override Text, stripe, and switch options

Context: A consumer needs larger accent hint text with local Text styling,
denser stripes, a horizontal switch direction, custom motion values, and
visible lifecycle evidence.

Expected behavior: Text uses its `lg` size treatment and accent tone, adds the
consumer font-weight class and uppercase inline style, and retains Hint's
Background surface and inherited font family. Stripes uses the supplied angle,
gap, width, and color while retaining Hint's required clipping and padding.
SwitchAnimation uses the right direction and supplied public CSS variables. Its
lifecycle callbacks append visible records when the active hint changes.

Covers: UC-006, UC-007, UC-008, UC-010, UC-011, UC-013

```tsx
import * as React from 'react'
import { Hint } from '@powercoach/ui'

export function CustomizedHint() {
  const [fulfilled, setFulfilled] = React.useState(false)
  const [records, setRecords] = React.useState<string[]>([])

  const append = (record: string) => {
    setRecords((current) => [...current, record])
  }

  return (
    <div>
      <button type="button" onClick={() => setFulfilled((value) => !value)}>
        switch hint
      </button>

      <Hint
        waitingKey="waiting"
        waitingContent="Waiting for the constraint."
        textProps={{
          size: 'lg',
          tone: 'accent',
          className: 'font-semibold',
          style: { textTransform: 'uppercase' }
        }}
        hints={[
          {
            key: 'fulfilled',
            content: 'The constraint is fulfilled.',
            condition: fulfilled
          }
        ]}
        stripesOptions={{
          angle: '45deg',
          gap: '6px',
          width: '2px',
          color: 'currentColor',
          className: 'text-muted-foreground'
        }}
        switchAnimationOptions={{
          direction: 'right',
          style: {
            '--switch-animation-duration': '260ms',
            '--switch-animation-stagger': '70ms',
            '--switch-animation-distance': '24px'
          } as React.CSSProperties,
          onSwitchChange: (details) => append(`change ${details.replacementId}`),
          onSwitchStart: (details) => append(`start ${details.replacementId}`),
          onSwitchComplete: (details) =>
            append(`complete ${details.replacementId} ${details.status}`)
        }}
      />

      <output>{records.join(', ') || 'No replacement records yet'}</output>
    </div>
  )
}
```

### EX-005 - Replace and label the public wrapper

Context: A consumer needs the Hint wrapper to participate as a labeled section
without changing its owned contextual-content composition.

Expected behavior: Hint renders the supplied `section`, composes the consumer
class with its wrapper props, forwards the label and data attribute, and keeps
Stripes, SwitchAnimation, and Text as owned internals. Hint adds no role or
live-region semantics of its own.

Covers: UC-001, UC-008, UC-009, UC-012

```tsx
import { Hint } from '@powercoach/ui'

export function LabeledHintSection() {
  return (
    <Hint
      render={<section />}
      aria-label="Workout guidance"
      data-context="workout-builder"
      className="w-full"
      waitingKey="waiting"
      waitingContent="Add an exercise to see guidance."
      hints={[]}
    />
  )
}
```

### EX-006 - Observe rapid zero-motion replacements by generation

Context: A consumer needs to verify a rapid waiting-to-fulfilled-to-waiting
sequence without treating decorative outgoing text as active content.

Expected behavior: The rapid control creates separate SwitchAnimation
replacement generations with zero duration and stagger. The active-selection
probe reports the consumer state. The lifecycle probe records each event by
replacement ID, keys, and completion status instead of counting every mounted
node that contains the waiting text.

Covers: UC-002, UC-003, UC-010, UC-011

```tsx
import * as React from 'react'
import { Hint } from '@powercoach/ui'

export function RapidZeroMotionHint() {
  const [fulfilled, setFulfilled] = React.useState(false)
  const [records, setRecords] = React.useState<string[]>([])

  function append(record: string) {
    setRecords((current) => [...current, record])
  }

  function runRapidSequence() {
    setFulfilled(true)
    window.setTimeout(() => setFulfilled(false), 0)
  }

  return (
    <div>
      <button type="button" onClick={runRapidSequence}>
        run waiting → fulfilled → waiting
      </button>

      <Hint
        waitingKey="waiting"
        waitingContent="Waiting for the constraint."
        hints={[
          {
            key: 'fulfilled',
            content: 'The constraint is fulfilled.',
            condition: fulfilled
          }
        ]}
        switchAnimationOptions={{
          style: {
            '--switch-animation-duration': '0ms',
            '--switch-animation-stagger': '0ms'
          } as React.CSSProperties,
          onSwitchChange: (details) =>
            append(
              `change ${details.replacementId} ${String(details.previousKey)} → ${String(details.nextKey)}`
            ),
          onSwitchStart: (details) =>
            append(
              `start ${details.replacementId} ${String(details.previousKey)} → ${String(details.nextKey)}`
            ),
          onSwitchComplete: (details) =>
            append(
              `complete ${details.replacementId} ${String(details.previousKey)} → ${String(details.nextKey)} ${details.status}`
            )
        }}
      />

      <output>Active selection: {fulfilled ? 'fulfilled' : 'waiting'}</output>
      <ol aria-label="Replacement lifecycle records">
        {records.map((record, index) => (
          <li key={`${record}-${index}`}>{record}</li>
        ))}
      </ol>
    </div>
  )
}
```

## Hint

### Props

```ts
type HintContent = string | React.ReactElement

interface HintItem {
  readonly key: React.Key
  readonly content: HintContent
  readonly condition: boolean
}

type HintStripesOptions = Pick<
  StripesProps,
  'angle' | 'color' | 'gap' | 'width' | 'className' | 'style'
>

type HintSwitchAnimationOptions = Pick<
  SwitchAnimationProps,
  'direction' | 'onSwitchChange' | 'onSwitchStart' | 'onSwitchComplete' | 'className' | 'style'
>

export type HintTextProps = Pick<TextProps, 'className' | 'size' | 'style'> & ToneOrIntentProps
```

| Prop                     | Type                                                                  | Default   | Description                                                                                                                                                                                    |
| ------------------------ | --------------------------------------------------------------------- | --------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `waitingContent`         | `HintContent`                                                         | Required  | Content selected when no hint condition is fulfilled.                                                                                                                                          |
| `waitingKey`             | `React.Key`                                                           | Required  | Stable SwitchAnimation key for the waiting content. It must be unique among every item key.                                                                                                    |
| `hints`                  | `readonly HintItem[]`                                                 | Required  | Ordered contextual hints. The first item whose condition is `true` is selected. Every item key must be mutually unique and different from `waitingKey`.                                        |
| `textProps`              | `HintTextProps`                                                       | See below | Selects the owned Text content box's size, semantic appearance, class, and style treatment.                                                                                                    |
| `stripesOptions`         | `HintStripesOptions`                                                  | None      | Overrides the exposed Stripes visual options. Hint still owns Stripes children, clipping, and surface padding.                                                                                 |
| `switchAnimationOptions` | `HintSwitchAnimationOptions`                                          | None      | Overrides the exposed SwitchAnimation direction, lifecycle callbacks, class, style, and public motion variables. Hint still owns flow mode, children, root composition, and measured geometry. |
| `render`                 | `ReactElement \| ((props: HTMLProps, state: object) => ReactElement)` | None      | Replaces the default wrapper `div` using Base UI `useRender` semantics. Hint defines no public state fields for the render callback.                                                           |
| `className`              | `string`                                                              | None      | Applies consumer classes to the public Hint wrapper. It does not target the owned Stripes, SwitchAnimation, or content boxes.                                                                  |
| `style`                  | `React.CSSProperties`                                                 | None      | Applies consumer styles to the public Hint wrapper. It does not replace required styles on the owned Stripes, SwitchAnimation, or content boxes.                                               |
| native div attributes    | `React.ComponentPropsWithRef<"div">`                                  | None      | Passed to the rendered `div` by default, including refs, native events, data attributes, and ARIA attributes. Consumers own valid attributes and semantics when `render` replaces the wrapper. |

Hint does not accept `children`. Its contextual content is supplied only by
`waitingContent` and `hints`.

`condition` is a consumer-evaluated boolean. Hint does not invoke a condition
callback or evaluate consumer state outside normal rendering.

`waitingKey` and every `HintItem.key` must be mutually unique. Behavior is
unspecified when keys collide. Hint passes the selected key through unchanged;
it does not namespace, rewrite, or derive replacement keys.

Hint wraps a string or React element in the same owned keyed Text rendered as a
`div`. It does not clone a supplied React element and does not use that
element's own key as the SwitchAnimation key.

`textProps` exposes only Text's `className`, `size`, `style`, `tone`, and
`intent` contracts. The canonical `ToneOrIntentProps` union keeps `tone` and
`intent` mutually exclusive. Hint does not expose Text children, render, ref,
`tabIndex`, native or global attributes, handlers, ARIA attributes, or data
attributes through `textProps`.

An omitted `textProps`, omitted `size`, or explicitly undefined `size` resolves
to `xs`. Hint forwards a supplied supported Text size unchanged. Text owns the
complete font-size and tracking treatment for the resolved size.

When both `tone` and `intent` are omitted, Hint resolves the Text appearance to
`tone="muted"`. A supplied `tone` or `intent` replaces that default and is
forwarded unchanged. Hint never resolves both appearance props simultaneously.

#### Text prop precedence

The resolved size and appearance establish Text's initial public treatments.
A recognized conflicting text-color, font-size, or letter-spacing utility in
`textProps.className` overrides the matching Text treatment according to Text's
class composition contract. An inline `color`, `fontSize`, or `letterSpacing`
in `textProps.style` follows normal inline-style precedence. Non-conflicting
classes and style properties compose normally.

Hint retains final ownership of the Background surface and inherited font
family. A background-color, font-family, or font shorthand declaration in
`textProps.className` or `textProps.style` cannot replace those Hint-owned
treatments. Consumers can use `fontSize` and `letterSpacing` when they intend
only size or tracking changes. Deterministic class conflicts are limited to
supported Tailwind utilities; custom classes, important declarations, selector
variants, and external stylesheet specificity are outside the guaranteed
conflict boundary.

#### Stripes option precedence

Stripes begins with its documented defaults. Values supplied through
`stripesOptions` override the matching Stripes defaults. Hint then preserves
the required clipping and surface padding: `overflow: clip`, top `0.5rem`,
right `0.5rem`, bottom `2.5rem`, and left `0`.

Consumer `className` and `style` inside `stripesOptions` may add unrelated
visual styling. They cannot remove or replace those Hint-owned structural
values. Hint does not expose Stripes `children`, `render`, ref, native
attributes, ARIA attributes, data attributes, or native events.

#### SwitchAnimation option precedence

SwitchAnimation begins with its documented defaults. Values supplied through
`switchAnimationOptions` override its exposed direction, lifecycle callbacks,
class, style, and public CSS variables. SwitchAnimation continues to preserve
its own required positioning, measurement, and animated width and height.

Hint fixes `contentMode` to `flow`, supplies the selected keyed child, and keeps
the SwitchAnimation root. Hint does not expose SwitchAnimation `children`,
`contentMode`, `render`, ref, native attributes, ARIA attributes, data
attributes, or native events through `switchAnimationOptions`.

### Events

Hint defines no custom events. Native events may be passed through to the public
wrapper.

SwitchAnimation lifecycle callbacks may be supplied through
`switchAnimationOptions`. They retain the exact details, ordering, interruption,
and completion contracts documented by SwitchAnimation; Hint does not wrap or
replace them. Completion and outgoing-presence removal remain per replacement
generation. Hint adds no all-generations completion event and no synchronous
removal guarantee for zero-motion replacements. Pending completion delivery is
suppressed if the SwitchAnimation instance unmounts first, as documented by
SwitchAnimation.

### Data Attributes

Hint defines no custom data attributes. Consumer `data-*` attributes are passed
through to the public wrapper.

The composed SwitchAnimation retains its own public `data-motion`,
`data-content-mode`, and `data-direction` contracts. Those attributes do not
become Hint selectors, and Hint exposes no selectors for SwitchAnimation's
internal slot or presence boxes.

### CSS Variables

Hint defines no CSS variables.

Consumers may provide the public Stripes variables through
`stripesOptions.style` or the public SwitchAnimation variables through
`switchAnimationOptions.style`. The variables keep the defaults, validation,
precedence, and reduced-motion behavior documented by their owning components.

## Accessibility

Hint adds no semantic role, live region, accessible name, announcement
behavior, keyboard behavior, or pointer behavior by default. A contextual
change is not necessarily a notification. Consumers may pass `role`,
`aria-live`, labeling attributes, or other semantics to the public wrapper when
their context requires them.

The selected content keeps its own semantics inside the owned Text content box.
Text renders that box as a `div` with `tabIndex={-1}` so it is programmatically
focusable without entering the sequential keyboard focus order. If focus is
inside outgoing content when the selected key changes, SwitchAnimation
transfers focus without scrolling to the incoming keyed `div` before making the
outgoing subtree decorative. SwitchAnimation owns the inert, `aria-hidden`, and
non-interactive state of leaving content. Exactly one incoming content box is
active, visible, in flow, and exposed to assistive technology. Zero or more
outgoing content boxes from earlier generations may remain temporarily mounted,
but each is decorative under a SwitchAnimation-owned ancestor that is inert,
`aria-hidden`, and without pointer interaction until its generation completes.

When `render` replaces the default wrapper, the rendered element or custom
component must forward the ref and spread the received props. Consumers own
valid HTML content, attributes, and semantics for the replacement element.

Consumer-provided clipping can hide focus indication that paints outside the
Stripes surface. A consumer that adds interactive contextual content owns
keeping required focus indication visible within the clipped boundary.

## Behavior

Hint evaluates `hints` in array order during rendering. It selects the first
item whose `condition` is `true`. If no condition is `true`, it selects
`waitingContent` and `waitingKey`.

Consumers must normally ensure that only one condition is fulfilled at a time.
If multiple conditions are `true`, selecting the first fulfilled item provides
deterministic fallback behavior. An empty `hints` array always selects the
waiting content.

The selected content is placed inside exactly one owned Text carrying the
selected waiting or item key. Text renders as a `div` with `tabIndex={-1}` and
receives the resolved size and appearance through its public props. The content
box uses Text's complete selected size and tracking treatment, the Background
theme surface, the resolved semantic text-color treatment, and Hint's inherited
font family. The semantic appearance resolves to muted when the consumer omits
both `tone` and `intent`. Consumer `textProps.className` and `textProps.style`
compose according to the documented Text prop precedence while Background and
font family remain Hint-owned. The content box generates flow content at the
top-left of the striped surface.

Stripes uses its documented default angle, gap, width, and stripe color unless
the consumer provides a matching `stripesOptions` value. The surface clips
translated paint and applies top and right padding of `0.5rem`, bottom padding
of `2.5rem`, and no left padding. The Background surface belongs to the active
content box, so the remaining padded area reveals the striped surface.

SwitchAnimation uses flow content mode and receives the selected keyed Text as
its sole child. The key is applied directly to Text, whose final element is the
owned content `div`. Hint does not apply clipping to SwitchAnimation, replace
its root, or assign it fixed or minimum dimensions. Stripes acts as the outer
clipping boundary while SwitchAnimation retains its measured width, height,
slot, positioning, and presence behavior.

Content uniqueness applies to the one active content box, not to every
temporarily mounted DOM node containing the same text. Rapid replacements may
temporarily retain zero or more decorative outgoing boxes. SwitchAnimation
removes each generation's outgoing presence after that generation reaches its
documented terminal completion.

The public Hint wrapper has no visual defaults. Its `className` and `style`
apply only to that wrapper.

## Motion

Hint creates no independent animation engine or lifecycle. It composes
SwitchAnimation, whose public contract uses CSS transitions.

Initial waiting or hint content renders without replacement motion. When the
selected key changes, SwitchAnimation immediately places the incoming keyed
content in flow, temporarily retains outgoing content as a decorative overlay,
transitions the measured slot size, and applies the configured directional
opacity and translation treatment.

Direction, lifecycle callbacks, and public motion variables may be supplied
through `switchAnimationOptions`. Rapid replacements, repeated keys across
separate generations, completion status, focus transfer, and motion timing keep
the SwitchAnimation contract.

An effective duration and stagger of zero do not add a synchronous cleanup
guarantee. Each committed replacement remains a distinct generation. A consumer
that needs to observe final DOM cleanup must first observe terminal completion
for every replacement ID created by its sequence.

Under `prefers-reduced-motion: reduce`, SwitchAnimation removes its owned motion
according to its public reduced-motion contract. Hint does not add another
transition or override that behavior.

Stripes clips translated paint outside the surface. This consumer composition
does not change SwitchAnimation's own no-clipping contract.

## Use Cases

### UC-001 - Render the public Hint wrapper

Given a consumer renders Hint without a render replacement
When Hint is displayed
Then Hint renders a public div wrapper containing its owned contextual-content
composition

### UC-002 - Show waiting content

Given no item condition is true or the hints list is empty
When Hint selects its active content
Then Hint displays waitingContent using waitingKey

### UC-003 - Show the first fulfilled hint

Given one or more item conditions are true
When Hint evaluates the ordered hints list
Then Hint displays the content and exact key of the first fulfilled item

### UC-004 - Keep condition evaluation consumer-owned

Given a consumer derives boolean item conditions from application state
When Hint renders
Then Hint reads those boolean values without invoking callbacks or evaluating
consumer state through another protocol

### UC-005 - Normalize supported content into a keyed box

Given the selected waiting or hint content is a string or React element
When Hint passes it to SwitchAnimation
Then Hint places it without cloning inside one programmatically focusable Text
rendered as a div and carrying the exact selected key

### UC-006 - Use the default striped surface

Given a consumer omits stripesOptions
When Hint renders its support surface
Then Stripes uses its documented default stripe values while Hint preserves the
required clipping and surface padding

### UC-007 - Override exposed Stripes options

Given a consumer supplies stripesOptions
When Hint renders Stripes
Then the supplied angle, color, gap, width, class, and style values override
matching Stripes defaults while Hint's clipping and padding remain unchanged

### UC-008 - Replace the public wrapper and pass attributes

Given a consumer supplies render, className, style, ref, native attributes,
data attributes, ARIA attributes, or native events
When Hint renders
Then the public wrapper follows Base UI render semantics and receives those
props without exposing or replacing the owned composition elements

### UC-009 - Keep contextual semantics consumer-owned

Given a consumer renders contextual content or adds semantics to Hint
When assistive technology reads the result
Then Hint adds no role, live region, accessible name, or announcement behavior
of its own and preserves consumer-provided semantics

### UC-010 - Replace content through SwitchAnimation

Given the selected waiting or item key changes, including during rapid
replacements or when effective motion duration and delay are zero
When Hint renders the next keyed content box
Then SwitchAnimation keeps exactly one incoming content box active, in flow,
visible, and exposed to assistive technology while zero or more boxes from
earlier generations may remain temporarily mounted as decorative outgoing
presences under an inert, aria-hidden, non-interactive ancestor until each
generation reaches terminal completion and removes its outgoing presence

### UC-011 - Override exposed SwitchAnimation options

Given a consumer supplies switchAnimationOptions
When selected content changes
Then SwitchAnimation uses the supplied direction, lifecycle callbacks, class,
style, and public motion variables while Hint preserves flow mode, the owned
child, root composition, and measurement contract

### UC-012 - Avoid a private Hint protocol

Given a consumer inspects or styles Hint
When Hint renders
Then Hint exposes no custom event, data attribute, CSS variable, render-state
field, internal part, or selector beyond the documented public wrapper props and
the bounded Text, Stripes, and SwitchAnimation option objects

### UC-013 - Customize the Text treatment

Given a consumer omits textProps or supplies its supported size, tone, intent,
className, or style fields
When Hint renders the active content box
Then Text receives xs and muted by default, forwards a supplied size and
mutually exclusive tone or intent unchanged, composes consumer-owned color,
size, tracking, class, and style treatments, and preserves Hint's owned
Background, inherited font family, content, key, div render, and focusability
