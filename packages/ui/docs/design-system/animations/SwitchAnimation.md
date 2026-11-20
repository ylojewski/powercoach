---
revision: 1
date: 2026-07-11
---

# SwitchAnimation

## Overview

SwitchAnimation animates replacement between keyed React elements. Consumers
render exactly one active element with a stable key. When that key changes, the
next element takes the natural layout position immediately while the previous
element remains mounted temporarily to fade and translate away.

SwitchAnimation owns the positioning and measured slot required to preserve
layout through a replacement. The outgoing element is positioned from its last
axis-aligned border box relative to the SwitchAnimation root. The slot
transitions between the stable measured size of the outgoing and incoming
content so surrounding layout moves continuously instead of jumping.

SwitchAnimation supports flow and phrasing content modes. The `render` prop
replaces only the root and follows Base UI composition semantics. The internal
slot, active-item, and leaving-item boxes remain owned by SwitchAnimation and
are not public parts or styling targets.

SwitchAnimation uses CSS transitions. It does not clip overflow. Translated
content and other paint outside the root remain visible unless the consumer
chooses clipping on the root or on an outer container.

## Anatomy

SwitchAnimation exposes one public component.

- `SwitchAnimation`: renders the active keyed element in flow and retains any
  unfinished outgoing elements as decorative overlays.

The public root contract is:

- `data-motion="switch"` identifies the animation family.
- `data-content-mode="flow"` or `data-content-mode="phrasing"` identifies the
  selected HTML content model.
- `data-direction="down"`, `data-direction="up"`, `data-direction="left"`, or
  `data-direction="right"` identifies the physical leaving direction.

SwitchAnimation does not expose public slot, item, entering, present, leaving,
measurement, key, or presence selectors.

```tsx
<SwitchAnimation>
  {status === 'ready' ? <section key="ready">ready</section> : <section key="empty">empty</section>}
</SwitchAnimation>
```

## Examples

### EX-001 - Replace flow content with different stable sizes

Context: A consumer needs to switch between compact and expanded flow content
without a visible jump in surrounding layout.

Expected behavior: The initial summary renders without motion. Changing the key
makes the details element the only in-flow child immediately, retains the
summary as a decorative leaving overlay, and transitions the root from the
summary size to the stable details size.

Covers: UC-001, UC-002, UC-003

```tsx
import * as React from 'react'
import { SwitchAnimation } from '@powercoach/ui'

export function WorkoutDetailsSwitch() {
  const [view, setView] = React.useState<'summary' | 'details'>('summary')

  return (
    <div>
      <button
        type="button"
        onClick={() => setView((value) => (value === 'summary' ? 'details' : 'summary'))}
      >
        switch content
      </button>

      <p>Before the animated slot.</p>

      <SwitchAnimation>
        {view === 'summary' ? (
          <div key="summary">
            <strong>Strength block</strong>
          </div>
        ) : (
          <section key="details" aria-label="Workout details">
            <h3>Strength block</h3>
            <p>Four movements, three working sets, and two accessory rounds.</p>
          </section>
        )}
      </SwitchAnimation>

      <p>After the animated slot.</p>
      <output>Active key: {view}</output>
    </div>
  )
}
```

### EX-002 - Inspect four directions and custom motion variables

Context: A consumer needs the four physical switch directions and a customized
motion treatment.

Expected behavior: Each instance moves its leaving label in the named physical
direction and brings the incoming label from the opposite offset. The public
variables change all transition durations to 260ms, easing to the supplied
cubic bezier, entering stagger to 70ms, and travel distance to 24px.

Covers: UC-002, UC-006

```tsx
import * as React from 'react'
import { SwitchAnimation } from '@powercoach/ui'
import type { SwitchAnimationDirection } from '@powercoach/ui'

const directions: SwitchAnimationDirection[] = ['down', 'up', 'left', 'right']

const motionStyle = {
  '--switch-animation-duration': '260ms',
  '--switch-animation-easing': 'cubic-bezier(0.4, 0, 0.2, 1)',
  '--switch-animation-stagger': '70ms',
  '--switch-animation-distance': '24px'
} as React.CSSProperties

export function DirectionSwitches() {
  const [alternate, setAlternate] = React.useState(false)

  return (
    <div>
      <button type="button" onClick={() => setAlternate((value) => !value)}>
        switch every direction
      </button>

      {directions.map((direction) => (
        <SwitchAnimation
          key={direction}
          contentMode="phrasing"
          direction={direction}
          style={motionStyle}
        >
          <span key={alternate ? `${direction}-second` : `${direction}-first`}>
            {direction}: {alternate ? 'second' : 'first'}
          </span>
        </SwitchAnimation>
      ))}
    </div>
  )
}
```

### EX-003 - Compose as a Base UI Button render target

Context: A consumer needs a Base UI Button to keep one native action root while
its phrasing label switches.

Expected behavior: Base UI Button passes its behavior, props, and ref through
SwitchAnimation to the native button root. SwitchAnimation remains the sole
owner of the conditional keyed label. Because focus stays on the composed root
button rather than inside outgoing label content, switching the label does not
move focus.

Covers: UC-001, UC-004, UC-005, UC-007

```tsx
import * as React from 'react'
import { Button as BaseButton } from '@base-ui/react/button'
import { SwitchAnimation } from '@powercoach/ui'

export function SavingButtonLabel() {
  const [saving, setSaving] = React.useState(false)

  return (
    <BaseButton
      aria-label="Save workout"
      onClick={() => setSaving((value) => !value)}
      render={
        <SwitchAnimation contentMode="phrasing" render={<button type="button" />}>
          <span key={saving ? 'saving' : 'save'}>{saving ? 'saving…' : 'save workout'}</span>
        </SwitchAnimation>
      }
    />
  )
}
```

### EX-004 - Transfer focus to incoming content

Context: A consumer switches interactive flow content from an action inside the
outgoing element.

Expected behavior: Clicking the action replaces the keyed section while focus
is inside the outgoing subtree. Before that subtree becomes decorative and
inert, focus moves without scrolling to the incoming section root. The visible
output reports the incoming root focus.

Covers: UC-002, UC-007

```tsx
import * as React from 'react'
import { SwitchAnimation } from '@powercoach/ui'

export function FocusTransferSwitch() {
  const [view, setView] = React.useState<'editor' | 'summary'>('editor')
  const [focusProbe, setFocusProbe] = React.useState('No transferred focus yet')

  return (
    <div>
      <SwitchAnimation>
        {view === 'editor' ? (
          <section
            key="editor"
            tabIndex={-1}
            aria-label="Workout editor"
            onFocus={(event) => {
              if (event.currentTarget === event.target) setFocusProbe('Editor root focused')
            }}
          >
            <h3>Edit workout</h3>
            <button type="button" onClick={() => setView('summary')}>
              show summary
            </button>
          </section>
        ) : (
          <section
            key="summary"
            tabIndex={-1}
            aria-label="Workout summary"
            onFocus={(event) => {
              if (event.currentTarget === event.target) setFocusProbe('Summary root focused')
            }}
          >
            <h3>Workout summary</h3>
            <button type="button" onClick={() => setView('editor')}>
              edit workout
            </button>
          </section>
        )}
      </SwitchAnimation>

      <output>{focusProbe}</output>
    </div>
  )
}
```

### EX-005 - Observe overlapping replacement lifecycles

Context: A consumer needs visible lifecycle records for ordinary, rapid, and
zero-motion replacements.

Expected behavior: Each committed key replacement appends one change record,
one start record, and one complete record with the same replacement ID. The
rapid control produces overlapping generations, repeated keys receive distinct
IDs, interrupted generations report interrupted completion, and the visible
probes expose ordering, totals, pending IDs, timing controls, current key, and
the browser reduced-motion preference.

Covers: UC-008, UC-009, UC-010

```tsx
import * as React from 'react'
import { SwitchAnimation } from '@powercoach/ui'
import type {
  SwitchAnimationCompleteDetails,
  SwitchAnimationDirection,
  SwitchAnimationReplacementDetails
} from '@powercoach/ui'

type EventName = 'change' | 'start' | 'complete'

type EventRow = {
  name: EventName
  replacementId: number
  previousKey: React.Key
  nextKey: React.Key
  direction: SwitchAnimationDirection
  status?: 'finished' | 'interrupted'
  elapsed: number
}

function useReducedMotionProbe() {
  const [reduced, setReduced] = React.useState(false)

  React.useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReduced(query.matches)
    update()
    query.addEventListener('change', update)
    return () => query.removeEventListener('change', update)
  }, [])

  return reduced
}

export function SwitchLifecycleProbe() {
  const [activeKey, setActiveKey] = React.useState<'a' | 'b' | 'c'>('a')
  const [direction, setDirection] = React.useState<SwitchAnimationDirection>('down')
  const [duration, setDuration] = React.useState(200)
  const [stagger, setStagger] = React.useState(50)
  const [rows, setRows] = React.useState<EventRow[]>([])
  const [pending, setPending] = React.useState<number[]>([])
  const origin = React.useRef(performance.now())
  const reduced = useReducedMotionProbe()

  function record(
    name: EventName,
    details: SwitchAnimationReplacementDetails | SwitchAnimationCompleteDetails
  ) {
    setRows((current) => [
      ...current,
      {
        name,
        replacementId: details.replacementId,
        previousKey: details.previousKey,
        nextKey: details.nextKey,
        direction: details.direction,
        status: 'status' in details ? details.status : undefined,
        elapsed: Math.round(performance.now() - origin.current)
      }
    ])

    if (name === 'change') {
      setPending((current) => [...current, details.replacementId])
    }
    if (name === 'complete') {
      setPending((current) => current.filter((id) => id !== details.replacementId))
    }
  }

  function runRapidSequence() {
    setActiveKey('a')
    window.setTimeout(() => setActiveKey('b'), 20)
    window.setTimeout(() => setActiveKey('c'), 60)
    window.setTimeout(() => setActiveKey('a'), 100)
  }

  const totals = {
    change: rows.filter((row) => row.name === 'change').length,
    start: rows.filter((row) => row.name === 'start').length,
    complete: rows.filter((row) => row.name === 'complete').length,
    finished: rows.filter((row) => row.status === 'finished').length,
    interrupted: rows.filter((row) => row.status === 'interrupted').length
  }

  const motionStyle = {
    '--switch-animation-duration': `${duration}ms`,
    '--switch-animation-stagger': `${stagger}ms`
  } as React.CSSProperties

  return (
    <div>
      <div>
        {(['a', 'b', 'c'] as const).map((key) => (
          <button key={key} type="button" onClick={() => setActiveKey(key)}>
            show {key.toUpperCase()}
          </button>
        ))}
        <button type="button" onClick={runRapidSequence}>
          run A → B → C → A
        </button>
      </div>

      <label>
        direction
        <select
          value={direction}
          onChange={(event) => setDirection(event.currentTarget.value as SwitchAnimationDirection)}
        >
          <option value="down">down</option>
          <option value="up">up</option>
          <option value="left">left</option>
          <option value="right">right</option>
        </select>
      </label>

      <label>
        duration in ms
        <input
          type="number"
          min="0"
          value={duration}
          onChange={(event) => setDuration(event.currentTarget.valueAsNumber)}
        />
      </label>

      <label>
        stagger in ms
        <input
          type="number"
          min="0"
          value={stagger}
          onChange={(event) => setStagger(event.currentTarget.valueAsNumber)}
        />
      </label>

      <SwitchAnimation
        direction={direction}
        style={motionStyle}
        onSwitchChange={(details) => record('change', details)}
        onSwitchStart={(details) => record('start', details)}
        onSwitchComplete={(details) => record('complete', details)}
      >
        <div key={activeKey}>Content {activeKey.toUpperCase()}</div>
      </SwitchAnimation>

      <p>Current key: {activeKey}</p>
      <p>Reduced motion: {reduced ? 'reduce' : 'no preference'}</p>
      <p>Pending replacement IDs: {pending.join(', ') || 'none'}</p>
      <p>
        Totals: change {totals.change}, start {totals.start}, complete {totals.complete}, finished{' '}
        {totals.finished}, interrupted {totals.interrupted}
      </p>

      <button
        type="button"
        onClick={() => {
          setRows([])
          setPending([])
          origin.current = performance.now()
        }}
      >
        clear records
      </button>

      <button
        type="button"
        onClick={() => {
          setActiveKey('a')
          setDirection('down')
          setDuration(200)
          setStagger(50)
          setRows([])
          setPending([])
          origin.current = performance.now()
        }}
      >
        reset probe
      </button>

      <table>
        <thead>
          <tr>
            <th>event</th>
            <th>ID</th>
            <th>previous</th>
            <th>next</th>
            <th>direction</th>
            <th>status</th>
            <th>elapsed</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={`${row.replacementId}-${row.name}-${index}`}>
              <td>{row.name}</td>
              <td>{row.replacementId}</td>
              <td>{String(row.previousKey)}</td>
              <td>{String(row.nextKey)}</td>
              <td>{row.direction}</td>
              <td>{row.status ?? '—'}</td>
              <td>{row.elapsed}ms</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
```

### EX-006 - Choose consumer-owned clipping

Context: A consumer needs one switch whose translated paint can overlap nearby
content and another switch clipped by an application boundary.

Expected behavior: SwitchAnimation adds no overflow rule to either instance.
The first instance uses normal visible overflow. The second is clipped only by
the consumer-owned outer container.

Covers: UC-011

```tsx
import * as React from 'react'
import { SwitchAnimation } from '@powercoach/ui'

export function ConsumerClippingSwitches() {
  const [alternate, setAlternate] = React.useState(false)

  const content = alternate ? 'longer incoming label' : 'short label'
  const key = alternate ? 'long' : 'short'

  return (
    <div>
      <button type="button" onClick={() => setAlternate((value) => !value)}>
        switch labels
      </button>

      <p>Visible overflow:</p>
      <SwitchAnimation contentMode="phrasing" direction="right">
        <span key={key}>{content}</span>
      </SwitchAnimation>

      <p>Consumer-owned clipping:</p>
      <span style={{ display: 'inline-block', overflow: 'clip' }}>
        <SwitchAnimation contentMode="phrasing" direction="right">
          <span key={key}>{content}</span>
        </SwitchAnimation>
      </span>
    </div>
  )
}
```

## SwitchAnimation

### Props

```ts
type SwitchAnimationContentMode = 'flow' | 'phrasing'

type SwitchAnimationDirection = 'down' | 'up' | 'left' | 'right'

type SwitchAnimationCompletionStatus = 'finished' | 'interrupted'

interface SwitchAnimationReplacementDetails {
  readonly replacementId: number
  readonly previousKey: React.Key
  readonly nextKey: React.Key
  readonly direction: SwitchAnimationDirection
}

interface SwitchAnimationCompleteDetails extends SwitchAnimationReplacementDetails {
  readonly status: SwitchAnimationCompletionStatus
}
```

| Prop               | Type                                                                                  | Default   | Description                                                                                                                                                                                                                   |
| ------------------ | ------------------------------------------------------------------------------------- | --------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `children`         | `React.ReactElement`                                                                  | Required  | Exactly one active React element with an explicitly supplied, stable, non-null key. Changing that key is the sole replacement signal.                                                                                         |
| `contentMode`      | `"flow" \| "phrasing"`                                                                | `"flow"`  | Selects the root, owned-box tags, and supported HTML content model.                                                                                                                                                           |
| `direction`        | `"down" \| "up" \| "left" \| "right"`                                                 | `"down"`  | Physical direction in which leaving content travels. Left and right do not reverse in RTL.                                                                                                                                    |
| `render`           | `React.ReactElement \| ((props, state: Record<string, never>) => React.ReactElement)` | Mode root | Replaces the root using Base UI render semantics. Element forms must be childless. Callback forms must spread the received props and preserve `props.children` exactly once.                                                  |
| `onSwitchChange`   | `(details: SwitchAnimationReplacementDetails) => void`                                | None      | Called once after a committed replacement is measured, focus-safe, and accessibility-safe, before target transition endpoints are activated.                                                                                  |
| `onSwitchStart`    | `(details: SwitchAnimationReplacementDetails) => void`                                | None      | Called once immediately after target item and slot-size endpoints are activated. It does not wait for the entering stagger.                                                                                                   |
| `onSwitchComplete` | `(details: SwitchAnimationCompleteDetails) => void`                                   | None      | Called once when the generation is terminal, its leaving presence is removed, and its size cleanup is committed. Reports whether the generation finished or was interrupted.                                                  |
| `className`        | Root `className`                                                                      | None      | Applies consumer classes to the actual root. It may provide public variables, overflow, or unrelated visual styling without replacing required positioning, box generation, measurement, or animated width and height.        |
| `style`            | `React.CSSProperties`                                                                 | None      | Applies consumer styles to the actual root. It may provide public variables or consumer-owned overflow under the same structural constraints as `className`.                                                                  |
| root DOM props     | Root HTML props                                                                       | None      | Native events, ARIA attributes, consumer `data-*` attributes, and the external ref pass to the actual root. The external ref resolves to that root HTMLElement and is merged with SwitchAnimation's internal measurement ref. |

`SwitchAnimationContentMode`, `SwitchAnimationDirection`,
`SwitchAnimationReplacementDetails`, `SwitchAnimationCompletionStatus`, and
`SwitchAnimationCompleteDetails` are public exported types.

#### Children Contract

Consumers provide exactly one active React element with an explicitly supplied,
stable, non-null key. TypeScript cannot require a non-null JSX key, so key
presence remains a documented consumer contract.

SwitchAnimation does not call `React.Children.only`, synthesize keys, filter
children, throw, warn, or define fallback rendering for zero children, multiple
direct children, an unkeyed child, or other unsupported child output. Runtime
behavior and callbacks are unspecified outside the nominal children contract.

Text content must be wrapped in a keyed React element. A keyed Fragment can
group content. If that content can contain focus, its DOM output must have
exactly one direct HTMLElement root containing all focusable descendants.
Portals, SVG-only roots, and multi-root output cannot satisfy focus transfer.

#### Content Modes

| Mode       | Default root | Owned box tags | Supported content                                                                                                                                  |
| ---------- | ------------ | -------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| `flow`     | `div`        | `div`          | Flow content valid inside a `div`. Context-bound structures such as a table row, option, or list item without its required parent are unsupported. |
| `phrasing` | `span`       | `span`         | Phrasing content valid inside a `span`. Sectioning elements, paragraphs, headings, lists, tables, and other non-phrasing content are unsupported.  |

Both roots and their owned boxes generate measurable layout boxes. A rendered
root override must accept the selected mode's owned box tags and must itself be
valid in its external parent.

Flow mode is compatible with non-void flow containers that permit `div`
descendants and do not require a special direct-child grammar. Phrasing mode is
compatible with those containers and with native button-like hosts that accept
phrasing content. Animated content inside a native button or link root must be
non-interactive label content.

Neither mode is compatible with void or raw-text elements, input-like surfaces,
Portal surfaces, required table, select, or list child structures, or a
geometry-owning surface whose positioning, sizing, or overflow contract
conflicts with SwitchAnimation.

#### Render Composition

The `render` prop replaces only the SwitchAnimation root. SwitchAnimation keeps
ownership of every internal box and every active or leaving presence.

A `render` element must be childless. A render callback must spread every
received prop onto one root element and render `props.children` exactly once
without replacing, reordering, duplicating, or decorating the owned subtree. A
custom component used as the root must forward the received ref and props to one
DOM element.

When SwitchAnimation is itself the `render` target of a Base UI part,
SwitchAnimation remains the sole owner of the conditional keyed child. The Base
UI part must not supply competing children. The final host must satisfy the Base
UI part's native-element configuration, semantics, selected content mode, and
structural geometry.

The root must keep its box-generating display, positioning context, measurement
box, and animated width and height. Consumer or composed-surface styles must not
use `display: contents`, impose conflicting fixed or min/max dimensions, or
replace the owned size-transition geometry.

### Events

SwitchAnimation defines no DOM custom events.

`onSwitchChange`, `onSwitchStart`, and `onSwitchComplete` are plain,
non-cancelable React lifecycle callbacks. SwitchAnimation does not own the
consumer's active key, so a callback cannot cancel or alter the replacement that
React has already committed. A callback may request a later React update, which
creates a separate replacement generation.

Each committed key change receives a `replacementId`. IDs are monotonically
increasing positive integers beginning at 1 for each mounted SwitchAnimation
instance. An ID is never reused while that instance remains mounted. It
identifies a replacement generation rather than a key, so A to B and B to A
receive different IDs.

Each generation captures `previousKey`, `nextKey`, and `direction`. Its callback
order is:

1. React commits the incoming subtree as the only in-flow item while retaining
   the outgoing presence.
2. SwitchAnimation measures the outgoing and incoming boxes, freezes the
   starting slot size, performs any required focus transfer, makes the outgoing
   subtree inert and hidden, and establishes the initial item and size states.
3. `onSwitchChange` fires once after that preparation and before target
   transition endpoints are activated.
4. SwitchAnimation activates the target item and slot-size endpoints, then
   `onSwitchStart` fires once before visible progress is expected. It does not
   wait for the entering stagger.
5. `onSwitchComplete` fires once after all generation-owned work is terminal,
   that generation's leaving presence is removed, and generation-owned size
   cleanup is committed.

An abandoned or suspended render does not create a generation or invoke a
callback. Initial mount, same-key content changes, direction-only changes, and
CSS-variable-only changes invoke none of the callbacks.

Every committed generation emits exactly one change and one start. Unless the
SwitchAnimation instance unmounts first, it also emits exactly one complete.
Overlapping generations complete independently and may complete out of order;
consumers correlate them by `replacementId`. Only change, start, then complete
ordering within one generation is guaranteed.

`status="finished"` means every required transition reached its intended
endpoint or had no effective motion. `status="interrupted"` means at least one
generation-owned transition was canceled or retargeted before reaching its
intended endpoint. A newer generation can therefore interrupt older incoming
or slot-size motion while the older outgoing presence continues to its own
terminal state.

Completion observes the transitions that actually exist for outgoing opacity
and transform, incoming opacity and transform including stagger, and slot width
and height when their measured endpoints differ. Equal values, absent
transitions, and properties with zero effective duration and delay are terminal
immediately. Consumer timing values in effect when a generation starts govern
that generation; completion does not use a fixed timer.

Changing transition CSS during motion can cancel a property and produce an
interrupted completion. Events from descendants, unrelated properties, stale
generations, removed nodes, or reused nodes do not complete a generation.
Unmounting suppresses pending completion delivery.

When every required duration and delay is zero, including under reduced motion,
change and start still fire in their normal order. Complete fires in a microtask
after the committed layout phase and terminal cleanup. If the instance unmounts
before that microtask, complete is suppressed.

### Data Attributes

| Attribute                                | Element | Description                                           |
| ---------------------------------------- | ------- | ----------------------------------------------------- |
| `data-motion="switch"`                   | Root    | Identifies the SwitchAnimation family.                |
| `data-content-mode="flow\|phrasing"`     | Root    | Identifies the selected public HTML content mode.     |
| `data-direction="down\|up\|left\|right"` | Root    | Identifies the current physical direction prop value. |

Direction is captured separately for each replacement generation. Changing the
root `data-direction` value after a generation begins does not change the motion
of an already-leaving presence.

### CSS Variables

The variables are set on the root and inherited by SwitchAnimation's owned
boxes.

| Variable                      | Default       | Description                                                                                           |
| ----------------------------- | ------------- | ----------------------------------------------------------------------------------------------------- |
| `--switch-animation-duration` | `200ms`       | Duration for entering, leaving, width, and height transitions. Accepts a valid non-negative CSS time. |
| `--switch-animation-easing`   | `ease-in-out` | Easing for entering, leaving, width, and height transitions. Accepts a valid CSS easing function.     |
| `--switch-animation-stagger`  | `50ms`        | Delay for entering opacity and transform only. Accepts a valid non-negative CSS time.                 |
| `--switch-animation-distance` | `15px`        | Item translation distance. Accepts a valid non-negative CSS length.                                   |

Leaving and slot-size transitions have no delay. Distance affects only item
translation.

Under `prefers-reduced-motion: reduce`, component-owned styles force duration
to `0ms`, stagger to `0ms`, and distance to `0px` with precedence over ordinary
consumer class and inline-style variable values. Easing remains defined but has
no visible effect. Consumers must not use important declarations to defeat the
reduced-motion rule.

If the media query begins matching during a replacement, current item and size
transitions settle immediately after any required focus transfer. This expected
zero-motion settlement does not by itself mark a generation interrupted.

### Overflow

SwitchAnimation does not set `overflow`, `overflow-x`, `overflow-y`,
`overflow-clip-margin`, or an implicit clipping utility in either content mode.
Normal visible overflow therefore applies when the consumer supplies no rule.

Consumers may apply `overflow: clip` or intentional `overflow: hidden` to the
SwitchAnimation root, clip an outer container, or provide their own `clip-path`.
Consumer clipping must not change the root positioning context, animated width
or height, measurement box, or focus-transfer target. Scroll-container overflow
such as `auto`, `scroll`, or mixed-axis values that create scrollbars or geometry
changes is outside the stable-layout guarantee.

Translated content, shadows, filters, and focus indication outside measured
border boxes do not expand the SwitchAnimation slot. Any clipping of that paint
is consumer-owned behavior.

## Accessibility

SwitchAnimation preserves the semantics, accessible name, tab order, focus
behavior, pointer behavior, and user events of the active in-flow content.

Every leaving subtree is decorative for its entire leaving lifetime. Its owned
wrapper is `aria-hidden="true"`, inert, and without pointer interaction. The
leaving subtree cannot create another accessible role, name, focus target, or
action. Making it inert does not stop its mounted React effects or other
programmatic activity.

Focus transfer occurs only when the active element is the outgoing content root
or one of its descendants. The incoming content root is the sole direct
HTMLElement rendered beneath the owned incoming item box. That element must be
enabled, rendered, non-inert, and programmatically focusable at replacement
time. A naturally focusable element qualifies; otherwise the consumer provides
`tabIndex={-1}` so it can receive programmatic focus without joining sequential
keyboard order.

SwitchAnimation focuses the incoming content root with `preventScroll: true`
before the outgoing subtree becomes inert and `aria-hidden`. Focus transfer is
not deferred until animation progress or completion.

If focus is on the composed SwitchAnimation root itself, focus remains on that
root. This includes a compatible Base UI trigger whose label is animated inside
the root.

SwitchAnimation does not search for an arbitrary focusable descendant, focus
the animation root as a fallback, warn, throw, or emit a failure callback. A
missing, disabled, hidden, inert, or non-focusable incoming root is outside the
nominal contract and has no focus-preservation guarantee.

When phrasing mode is composed into a native button or link root, animated
children must remain non-interactive label content. Consumers own the validity
and accessibility of the final composed host.

Consumer clipping can clip focus indication that paints outside the root. A
consumer that adds clipping owns keeping required focus indication visible.

SwitchAnimation adds no roles, accessible names, keyboard interaction, pointer
interaction, or activation behavior.

## Behavior

SwitchAnimation renders one required active React element with a stable,
explicit, non-null key. The element is the only active item in normal layout.

The first element mounts directly in its present state. Initial mount does not
animate, create a replacement generation, or invoke switch callbacks.

Changing the element key is the sole replacement trigger. Re-rendering content
with the same key updates that content in place without starting item motion,
slot-size motion, or callbacks. Changing only direction or CSS variables also
does not trigger a replacement.

When the key changes, the incoming element becomes the only in-flow item in the
same committed replacement. It occupies its natural position inside the
SwitchAnimation slot. The outgoing mounted subtree is retained rather than
copied or remounted.

Before leaving motion becomes visible, SwitchAnimation preserves the outgoing
item box's last axis-aligned border-box position and size relative to the root.
The outgoing item becomes an absolute overlay in the root's owned positioning
context. Consumers do not need to position an external parent.

The outgoing item's guarantee is root-relative. SwitchAnimation does not
compensate its viewport position if changing layout moves the root itself.
Shadows, outlines, filters, transforms outside the measured axis-aligned box,
and fragmented inline paint are outside the exact-position guarantee.

The root slot begins at the outgoing numeric width and height and transitions to
the incoming content's stable natural width and height. Surrounding layout
moves continuously between those endpoints. Explicit animated sizing is
released only after the latest size transition is terminal at its measured
target.

Content must have stable dimensions at replacement time. Asynchronous fonts or
images, responsive resizing during motion, cyclic sizing against the animated
slot, and consumer min/max or fixed dimensions that conflict with measured
endpoints are outside the size-transition guarantee.

SwitchAnimation has no component-owned clipping. A translated leaving layer can
paint outside the root and overlap nearby visual content, but remains absolute,
inert, hidden from assistive technology, and without pointer interaction, so it
does not affect layout or interaction.

Each replacement captures the current direction. Later direction changes do not
change an already-leaving item's path. Physical left and right do not reverse in
RTL.

Rapid key changes create separate replacement generations. Every unfinished
outgoing subtree remains mounted until its own leaving work is terminal. If an
item that is still entering becomes outgoing, it leaves continuously from its
current computed opacity and transform instead of snapping to a canonical
present state. Slot size similarly retargets from its current computed size to
the newest stable measured target.

An older generation whose incoming or size transition is canceled or retargeted
becomes interrupted, but its retained outgoing presence continues to its
terminal state. A stale completion can never remove a newer active or leaving
presence.

## Motion

SwitchAnimation uses CSS transitions. React manages keyed presence,
pre-transition measurement, focus safety, replacement identity, and terminal
observation; CSS performs opacity, transform, width, and height interpolation.

Entering and leaving items map direction to physical transforms as follows:

| Direction | Entering start                      | Leaving end                         |
| --------- | ----------------------------------- | ----------------------------------- |
| `down`    | `opacity: 0; translateY(-distance)` | `opacity: 0; translateY(distance)`  |
| `up`      | `opacity: 0; translateY(distance)`  | `opacity: 0; translateY(-distance)` |
| `right`   | `opacity: 0; translateX(-distance)` | `opacity: 0; translateX(distance)`  |
| `left`    | `opacity: 0; translateX(distance)`  | `opacity: 0; translateX(-distance)` |

Every entering item transitions to opacity 1 and zero translation. Every
leaving item starts from its current visual opacity and transform and transitions
toward opacity 0 and the captured leaving offset. In the ordinary uninterrupted
case, leaving starts at opacity 1 and zero translation.

Entering, leaving, root width, and root height transitions default to `200ms`
and `ease-in-out`. Entering opacity and transform begin after the default `50ms`
stagger. Leaving and slot-size transitions begin without delay. Item travel
defaults to `15px`.

Completion follows actual computed transitions rather than a fixed timer. A
generation's completion barrier includes outgoing opacity and transform,
incoming opacity and transform including stagger, and slot width and height when
their endpoints differ. A property with equal endpoints, no effective
transition, or zero duration and delay is immediately terminal.

When a newer replacement cancels or retargets an older generation-owned
transition, the affected older generation completes with `status="interrupted"`
after all its remaining owned work is terminal. Completion order between
overlapping generations is not guaranteed.

Under `prefers-reduced-motion: reduce`, item distance, duration, and stagger are
zero. Focus transfer and accessibility preparation still occur, the incoming
content and slot settle without visible animation, leaving content is removed,
and callbacks preserve change, start, then microtask completion order with
`status="finished"`.

If a consumer sets duration to zero while leaving a positive stagger, leaving
and slot size settle immediately while the incoming item performs its delayed
snap. Completion waits for that effective delay. Only an all-zero effective
duration and delay uses immediate post-layout microtask completion.

## Use Cases

### UC-001 - Render the initial active keyed element without motion

Given a consumer renders SwitchAnimation with one active React element carrying
an explicit stable non-null key
When the component mounts
Then the element renders in normal flow in its present state without item
motion, slot-size motion, or lifecycle callbacks

### UC-002 - Replace the active keyed element

Given SwitchAnimation has one active keyed element
When the consumer renders another element with a different stable key
Then the incoming element becomes the sole in-flow item immediately and the
outgoing mounted subtree remains temporarily as a decorative leaving overlay

### UC-003 - Transition between different stable sizes

Given outgoing and incoming flow content have different stable natural sizes
When their key changes
Then the root transitions between their measured numeric width and height while
the outgoing overlay retains its last root-relative axis-aligned border box and
surrounding layout does not jump

### UC-004 - Select the content model

Given a consumer selects flow or phrasing content mode and provides valid
matching content
When SwitchAnimation renders
Then it uses the corresponding div or span root and owned boxes while keeping
the internal boxes private

### UC-005 - Compose the root through Base UI render semantics

Given a consumer uses SwitchAnimation's render prop or makes SwitchAnimation
the sole child-owning render target of a compatible Base UI part
When the composition renders
Then props and the merged ref reach one valid root while SwitchAnimation
preserves its owned subtree exactly once

### UC-006 - Configure direction and motion values

Given a consumer selects a supported direction or sets public motion variables
When a keyed replacement occurs
Then the leaving item travels in the selected physical direction, the incoming
item arrives from the opposite offset, and actual item and size transitions use
the effective duration, easing, stagger, and distance

### UC-007 - Keep leaving content decorative and transfer focus

Given keyboard focus is on an outgoing content root or one of its descendants
and the incoming content has one eligible direct HTMLElement root
When a keyed replacement commits
Then focus moves without scrolling to the incoming root before the outgoing
subtree becomes aria-hidden, inert, and without pointer interaction

### UC-008 - Preserve continuity through rapid replacements

Given one or more replacement generations are still moving
When another keyed element becomes active
Then every unfinished leaving subtree remains until terminal while interrupted
item and slot-size motion retargets continuously from its current visual state

### UC-009 - Observe each replacement lifecycle

Given a consumer provides switch lifecycle callbacks
When one or more keyed replacements commit and settle
Then each generation reports one change, one start, and unless unmounted one
finished or interrupted completion correlated by its unique replacement ID

### UC-010 - Remove motion for reduced-motion preference

Given the browser matches prefers-reduced-motion reduce
When a keyed replacement commits
Then focus and accessibility preparation remain intact, item and slot motion
settles with zero duration, stagger, and distance, and lifecycle callbacks
complete in their documented order

### UC-011 - Leave clipping to the consumer

Given a consumer does not provide an overflow rule or deliberately clips the
SwitchAnimation root or an outer container
When translated content paints outside the measured slot
Then normal overflow stays visible by default and any clipping of translated
paint, shadows, filters, or focus indication is owned by the consumer
