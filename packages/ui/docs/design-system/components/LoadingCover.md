---
revision: 4
date: 2026-08-21
---

# LoadingCover

## Overview

LoadingCover presents a branded loading surface over application content and
coordinates when that surface may leave. It exposes the public
`LoadingCover.Cascade`, `LoadingCover.Root`, and `LoadingCover.Logo` parts.

Root is local by default and can cover the viewport with `fullscreen`. It owns
the loading lifecycle, keeps application children visible beneath the moving
cover until complete coverage, conditionally unmounts them only while fully
covered, and composes the public CSS `RevealAnimation` for entrance and
continuing exit. LoadingCover introduces no artificial minimum loading
duration.

Cascade opts nested Roots into recursive completion coordination. A coordinated
Root waits until its own `loading` value is false, its entrance is complete,
and every current descendant member is hidden before it begins unreveal. Roots
outside Cascade remain independent.

LoadingCover uses the CSS animation engine. Direction, clip-path geometry,
300ms duration, cubic-bezier(0.4, 0, 0.2, 1) easing, interruption geometry,
callbacks, continue reset, and reduced-motion target completion follow the
public `RevealAnimation` contract.

## Anatomy

Import the compound family and assemble its public parts:

```tsx
import { LoadingCover } from '@powercoach/ui'
;<LoadingCover.Cascade>
  <LoadingCover.Root loading={pageLoading}>
    <main>
      <LoadingCover.Root loading={panelLoading}>
        <section>training plan</section>
      </LoadingCover.Root>
    </main>
  </LoadingCover.Root>
</LoadingCover.Cascade>
```

- `LoadingCover.Cascade`: opts its Root and nested Cascade descendants into
  nearest-coordinator completion aggregation without adding a visual layer.
- `LoadingCover.Root`: owns one application-content wrapper, one conditional
  loading layer, local or fullscreen placement, accessibility blocking, status
  announcement, RevealAnimation control, and descendant coordination.
- `LoadingCover.Logo`: composes the legacy `LogoIcon` as the default decorative
  loading mark.

The default owned structure is:

```text
Cascade
└── Root
    ├── application content
    └── local layer or portaled fullscreen layer
        ├── live status
        └── RevealAnimation
            ├── real loading surface
            └── inverted decorative overlay surface
```

The public inspection contract is:

- `data-loading-cover-cascade` identifies Cascade.
- `data-loading-cover-cascade-state` identifies its aggregate `resolved` or
  `pending` state.
- `data-loading-cover-root` identifies Root.
- `data-loading-cover-state` identifies Root's `hidden`, `revealing`,
  `revealed`, or `unrevealing` visual state.
- `data-loading-cover-content` identifies the application-content wrapper.
- `data-loading-cover-layer` identifies the active local or fullscreen visual
  layer.
- `data-loading-cover-status` identifies the active live status node.
- `data-loading-cover-logo` identifies each default Logo presentation.
- RevealAnimation retains ownership of `data-motion="reveal"`,
  `data-content-mode`, `data-unreveal-behavior`,
  `data-active-unreveal-behavior`, and every `data-reveal-*` attribute.

## Examples

### EX-001 - Default local loading cycle

Context: A consumer needs a local loading cover whose content becomes available
as soon as the canonical entrance and exit permit it.

Expected behavior: The Root has stable local geometry, starts hidden with its
content mounted, and uses the default Logo and Loading announcement. Starting
loading immediately blocks the content but keeps it mounted and visible through
the uncovered region while the Foreground cover completes a left-to-right
300ms CSS entrance. Stopping loading during that entrance does not reverse it,
unmount the content, or request a premature false target. After complete
coverage, loading that remains true may unmount the content; loading that is
already false preserves it continuously and permits a continuing exit with no
1000ms delay. Interaction and accessibility are restored when unreveal begins.
The visible output reports the actual RevealAnimation lifecycle.

Covers: UC-001, UC-002, UC-003, UC-004, UC-005, UC-010, UC-016, UC-017, UC-018

```tsx
import * as React from 'react'
import { Button, LoadingCover } from '@powercoach/ui'

export function LocalLoadingCycle() {
  const [loading, setLoading] = React.useState(false)
  const [phase, setPhase] = React.useState('hidden')

  return (
    <div className="grid gap-4">
      <Button type="button" onClick={() => setLoading((value) => !value)}>
        {loading ? 'finish loading' : 'start loading'}
      </Button>

      <LoadingCover.Root
        loading={loading}
        className="min-h-64 border border-foreground"
        revealAnimationProps={{
          onRevealStart: (revealed) => setPhase(revealed ? 'revealing' : 'unrevealing'),
          onRevealComplete: (revealed) => setPhase(revealed ? 'revealed' : 'hidden')
        }}
      >
        <section className="p-6">athlete training plan</section>
      </LoadingCover.Root>

      <output aria-live="polite">cover phase: {phase}</output>
    </div>
  )
}
```

### EX-002 - Default, replacement, and removed Logo

Context: A consumer needs the default branded mark, one deterministic custom
indicator, and one logo-free loading surface.

Expected behavior: The first Root automatically uses LoadingCover.Logo and the
legacy LogoIcon. The second duplicates only its decorative, noninteractive,
duplicate-safe PC element. The third renders no mark. Each fully revealed
surface uses Foreground with its default or replacement mark in Background,
and none of the marks creates accessible content or an interaction target.

Covers: UC-009, UC-010, UC-020

```tsx
import { LoadingCover } from '@powercoach/ui'

export function LoadingLogoOptions() {
  return (
    <div className="grid grid-cols-3 gap-4">
      <LoadingCover.Root loading className="h-40" />
      <LoadingCover.Root
        loading
        className="h-40"
        logo={
          <span aria-hidden className="font-bold" data-custom-loading-logo="initials">
            PC
          </span>
        }
      />
      <LoadingCover.Root loading className="h-40" logo={null} />
    </div>
  )
}
```

### EX-003 - Configured RevealAnimation

Context: A consumer needs a different approved reveal direction and visible
lifecycle feedback without taking ownership of LoadingCover's target or
continue behavior.

Expected behavior: The cover uses top-to-bottom as the consumer-selected
direction while Root continues to own `reveal`, flow content, scale 1, and
continue unreveal. Alignment, offsets, direction, and all lifecycle callbacks
pass through. Consumer callbacks run once for the actual RevealAnimation target
without replacing Root bookkeeping.

Covers: UC-006, UC-021

```tsx
import * as React from 'react'
import { Button, LoadingCover } from '@powercoach/ui'

export function ConfiguredLoadingReveal() {
  const [loading, setLoading] = React.useState(false)
  const [message, setMessage] = React.useState('hidden')

  return (
    <div className="grid gap-4">
      <Button type="button" onClick={() => setLoading((value) => !value)}>
        toggle loading
      </Button>
      <LoadingCover.Root
        loading={loading}
        className="min-h-48"
        revealAnimationProps={{
          direction: 'top-to-bottom',
          alignX: 'start',
          offsetX: 8,
          onRevealChange: (revealed) => setMessage(revealed ? 'target revealed' : 'target hidden'),
          onRevealStart: (revealed) => setMessage(revealed ? 'entry started' : 'exit started'),
          onRevealComplete: (revealed) => setMessage(revealed ? 'entry complete' : 'exit complete')
        }}
      >
        <section className="p-6">configured loading content</section>
      </LoadingCover.Root>
      <output aria-live="polite">{message}</output>
    </div>
  )
}
```

### EX-004 - Parent waits for a nested Root

Context: A page cover must remain opaque until a nested panel cover has
completely left, including when the panel starts loading again during the page
exit.

Expected behavior: During page entrance, the mounted page and panel remain
visible through the uncovered region and their memberships stay live. After
complete coverage, page children either remain continuous when page loading is
already false or remount behind the opaque cover after a sustained loading
period. Membership settles before page exit eligibility is evaluated, and the
page remains revealed until the panel is hidden. If the panel starts loading
while the page is unrevealing, the page returns toward completely revealed from
its current geometry, makes its mounted content inert again, waits for the
panel to hide, then evaluates a new continuing exit.

Covers: UC-011, UC-014

```tsx
import * as React from 'react'
import { Button, LoadingCover } from '@powercoach/ui'

export function CoordinatedPageAndPanel() {
  const [pageLoading, setPageLoading] = React.useState(true)
  const [panelLoading, setPanelLoading] = React.useState(true)

  return (
    <div className="grid gap-4">
      <div className="flex gap-2">
        <Button type="button" onClick={() => setPageLoading((value) => !value)}>
          toggle page
        </Button>
        <Button type="button" onClick={() => setPanelLoading((value) => !value)}>
          toggle panel
        </Button>
      </div>

      <LoadingCover.Cascade>
        <LoadingCover.Root loading={pageLoading} className="min-h-72">
          <main className="p-6">
            <LoadingCover.Root loading={panelLoading} className="min-h-40">
              <section>panel data</section>
            </LoadingCover.Root>
          </main>
        </LoadingCover.Root>
      </LoadingCover.Cascade>
    </div>
  )
}
```

### EX-005 - Recursive and removable Cascades

Context: A consumer needs a nested coordination boundary that behaves as one
aggregate member and can add, remove, or contain no members.

Expected behavior: The inner Cascade reports pending while either current
nested Root is not hidden and reports resolved when it is empty or every member
is hidden. It registers as one aggregate member with the outer coordinator.
Removing a member releases it immediately. A Root outside the outer Cascade is
independent, and activity below a hidden Root does not reactivate higher
ancestors.

Covers: UC-012, UC-013, UC-018

```tsx
import * as React from 'react'
import { Button, LoadingCover } from '@powercoach/ui'

export function RecursiveLoadingCascades() {
  const [pageLoading, setPageLoading] = React.useState(true)
  const [summaryLoading, setSummaryLoading] = React.useState(true)
  const [showDetails, setShowDetails] = React.useState(true)
  const [detailsLoading, setDetailsLoading] = React.useState(true)

  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap gap-2">
        <Button type="button" onClick={() => setPageLoading((value) => !value)}>
          toggle page
        </Button>
        <Button type="button" onClick={() => setSummaryLoading((value) => !value)}>
          toggle summary
        </Button>
        <Button type="button" onClick={() => setShowDetails((value) => !value)}>
          {showDetails ? 'remove details' : 'add details'}
        </Button>
        <Button type="button" onClick={() => setDetailsLoading((value) => !value)}>
          toggle details
        </Button>
      </div>

      <LoadingCover.Cascade
        render={(props, state) => (
          <div {...props}>
            <output>outer cascade: {state.resolved ? 'resolved' : 'pending'}</output>
            {props.children}
          </div>
        )}
      >
        <LoadingCover.Root loading={pageLoading} className="min-h-72">
          <LoadingCover.Cascade
            render={(props, state) => (
              <section {...props}>
                <output>inner cascade: {state.resolved ? 'resolved' : 'pending'}</output>
                {props.children}
              </section>
            )}
          >
            <LoadingCover.Root loading={summaryLoading} className="min-h-32">
              summary
            </LoadingCover.Root>
            {showDetails ? (
              <LoadingCover.Root loading={detailsLoading} className="min-h-32">
                details
              </LoadingCover.Root>
            ) : null}
          </LoadingCover.Cascade>
        </LoadingCover.Root>
      </LoadingCover.Cascade>

      <LoadingCover.Root loading={detailsLoading} className="min-h-20">
        independent content
      </LoadingCover.Root>
    </div>
  )
}
```

### EX-006 - Mixed local and fullscreen placement

Context: A consumer needs a fullscreen descendant inside a coordinated local
page loading cycle.

Expected behavior: The automated probe starts only the local parent, waits for
its entrance to complete, finishes its local loading, then presents the busy
fullscreen descendant exactly once above the still-blocking local surface. The
fullscreen Root intercepts viewport pointer input and blocks only its enclosed
subtree, which remains visually visible through the transparent uncovered
portion of the viewport layer. Its status announcement takes precedence over
the busy local ancestor. Once the fullscreen Root starts unrevealing, a
still-busy local ancestor may announce again. After the fullscreen Root reaches
hidden, the waiting local Root performs its coordinated exit. Overlapping
fullscreen peers would share the same tier without a promised winner.

Covers: UC-008, UC-015, UC-017

```tsx
import * as React from 'react'
import { Button, LoadingCover } from '@powercoach/ui'

export function MixedLoadingPlacement() {
  const [pageLoading, setPageLoading] = React.useState(false)
  const [dialogLoading, setDialogLoading] = React.useState(false)
  const [message, setMessage] = React.useState('idle')

  function runSequence() {
    setMessage('local page entering')
    setPageLoading(true)

    window.setTimeout(() => {
      setMessage('fullscreen descendant entering')
      setPageLoading(false)
      setDialogLoading(true)
    }, 400)

    window.setTimeout(() => {
      setMessage('fullscreen descendant leaving')
      setDialogLoading(false)
    }, 1200)
  }

  return (
    <div className="grid gap-4">
      <Button type="button" onClick={runSequence}>
        run mixed placement
      </Button>
      <output aria-live="polite">{message}</output>

      <LoadingCover.Cascade>
        <LoadingCover.Root loading={pageLoading} className="min-h-64">
          <main>
            <LoadingCover.Root
              loading={dialogLoading}
              fullscreen
              aria-label="Loading workout editor"
            >
              <section>workout editor</section>
            </LoadingCover.Root>
          </main>
        </LoadingCover.Root>
      </LoadingCover.Cascade>
    </div>
  )
}
```

### EX-007 - State-aware render composition

Context: A consumer needs custom semantic-free outer elements and visible Root
and Cascade state probes while preserving the owned internal structure.

Expected behavior: Cascade and Root render as the supplied local child-bearing
elements, forward their refs and native attributes, and pass their public state
to className, style, and render callbacks. The consumer preserves
`props.children`, so the application wrapper, local layer, status, and
RevealAnimation remain owned by LoadingCover.

Covers: UC-001, UC-018, UC-019

```tsx
import * as React from 'react'
import { LoadingCover } from '@powercoach/ui'

export function ComposedLoadingCover() {
  const rootRef = React.useRef<HTMLElement | null>(null)

  return (
    <LoadingCover.Cascade
      render={(props, state) => (
        <section {...props} data-visible-cascade-state={state.resolved ? 'resolved' : 'pending'}>
          <output>cascade: {state.resolved ? 'resolved' : 'pending'}</output>
          {props.children}
        </section>
      )}
    >
      <LoadingCover.Root
        ref={rootRef}
        loading={false}
        className={(state) => (state.busy ? 'outline-2 outline-foreground' : 'outline-0')}
        render={(props, state) => (
          <article {...props} data-visible-root-state={state.visualState}>
            {props.children}
            <output>root: {state.visualState}</output>
          </article>
        )}
      >
        composed content
      </LoadingCover.Root>
    </LoadingCover.Cascade>
  )
}
```

### EX-008 - Reduced-motion ordering

Context: A consumer needs to inspect the same complete loading cycle with the
Storybook reduced-motion setting enabled.

Expected behavior: Every RevealAnimation target completes immediately without
a CSS transition, but LoadingCover still reaches revealing then revealed,
conditionally preserves or unmounts children, ensures the exit subtree and
memberships are settled, and only then reaches unrevealing and hidden. The
completion probe reports both targets in order; the cycle is not skipped or
collapsed.

Covers: UC-007

```tsx
import * as React from 'react'
import { Button, LoadingCover } from '@powercoach/ui'

export function ReducedMotionLoadingCover() {
  const [loading, setLoading] = React.useState(false)
  const [completions, setCompletions] = React.useState<string[]>([])

  return (
    <div className="grid gap-4">
      <Button type="button" onClick={() => setLoading((value) => !value)}>
        toggle loading
      </Button>
      <LoadingCover.Root
        loading={loading}
        className="min-h-48"
        revealAnimationProps={{
          onRevealComplete: (revealed) =>
            setCompletions((values) => [...values, revealed ? 'revealed' : 'hidden'])
        }}
      >
        reduced-motion content
      </LoadingCover.Root>
      <output>completed targets: {completions.join(', ') || 'none'}</output>
    </div>
  )
}
```

## Cascade

### Props

`LoadingCoverCascadeProps` preserves Base UI's native `div` and render
contract, deliberately redeclaring `className`, `style`, and `ref` for the
approved state-aware and polymorphic LoadingCover API. The public namespace
aliases are `LoadingCover.Cascade.Props` and `LoadingCover.Cascade.State`.

```ts
type LoadingCoverCascadeState = {
  resolved: boolean
}

type LoadingCoverCascadeProps = Omit<
  useRender.ComponentProps<'div', LoadingCoverCascadeState>,
  'className' | 'style' | 'ref'
> & {
  className?: string | ((state: LoadingCoverCascadeState) => string | undefined)
  style?:
    | React.CSSProperties
    | ((state: LoadingCoverCascadeState) => React.CSSProperties | undefined)
  ref?: React.Ref<HTMLElement>
}
```

| Prop               | Type                                                                                                               | Default | Description                                                                                                                                  |
| ------------------ | ------------------------------------------------------------------------------------------------------------------ | ------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| `children`         | `React.ReactNode`                                                                                                  | None    | Root and nested Cascade descendants coordinated through the nearest-member tree.                                                             |
| `className`        | `string \| ((state: LoadingCoverCascadeState) => string \| undefined)`                                             | None    | Class applied to the final Cascade element or returned from aggregate state.                                                                 |
| `style`            | `React.CSSProperties \| ((state: LoadingCoverCascadeState) => React.CSSProperties \| undefined)`                   | None    | Style applied to the final Cascade element or returned from aggregate state.                                                                 |
| `ref`              | `React.Ref<HTMLElement>`                                                                                           | None    | Ref attached to the final default or consumer-rendered HTMLElement.                                                                          |
| `render`           | `ReactElement \| ((props: HTMLProps, state: LoadingCoverCascadeState) => ReactElement)`                            | None    | Replaces the default `div` through Base UI render semantics. The replacement must preserve received props, children, and ref.                |
| native `div` props | `Omit<useRender.ComponentProps<"div", LoadingCoverCascadeState>, "className" \| "style" \| "ref">` inherited props | None    | Every other native attribute, event, ARIA attribute, consumer data attribute, children, and Base UI render prop passes to the final element. |

Cascade renders a `div` with `display: contents` by default. Its `resolved`
state is true when it has no current members or every current member is
resolved. It is false while any current member is unresolved.

### Events

Cascade defines no custom events or React state-change callbacks. Native events
on the final Cascade element pass through.

### Data Attributes

| Attribute                                     | Description                                                            |
| --------------------------------------------- | ---------------------------------------------------------------------- |
| `data-loading-cover-cascade`                  | Identifies the Cascade element.                                        |
| `data-loading-cover-cascade-state="resolved"` | Indicates that the Cascade is empty or every current member is hidden. |
| `data-loading-cover-cascade-state="pending"`  | Indicates that at least one current member is not hidden.              |

Cascade does not expose member IDs, member counts, depth, registration order,
placement summaries, or announcement ownership.

### CSS Variables

Cascade defines no public CSS variables.

## Root

### Props

`LoadingCoverRootProps` preserves Base UI's native `div` and render contract,
deliberately redeclaring `className`, `style`, and `ref` before adding the
Powercoach props below. The public namespace aliases are
`LoadingCover.Root.Props` and `LoadingCover.Root.State`.

```ts
type LoadingCoverVisualState = 'hidden' | 'revealing' | 'revealed' | 'unrevealing'

type LoadingCoverRootState = {
  busy: boolean
  fullscreen: boolean
  loading: boolean
  visualState: LoadingCoverVisualState
}

type LoadingCoverRevealAnimationProps = Omit<
  RevealAnimationProps,
  'children' | 'contentMode' | 'render' | 'reveal' | 'scale' | 'unrevealBehavior'
>

type LoadingCoverRootProps = Omit<
  useRender.ComponentProps<'div', LoadingCoverRootState>,
  'className' | 'style' | 'ref'
> & {
  loading: boolean
  fullscreen?: boolean
  revealAnimationProps?: LoadingCoverRevealAnimationProps
  logo?: React.ReactElement | null
  'aria-label'?: string
  className?: string | ((state: LoadingCoverRootState) => string | undefined)
  style?: React.CSSProperties | ((state: LoadingCoverRootState) => React.CSSProperties | undefined)
  ref?: React.Ref<HTMLElement>
}
```

`busy` is true while `visualState` is `revealing` or `revealed`. It is false
while `visualState` is `unrevealing` or `hidden`.

| Prop                   | Type                                                                                                            | Default                 | Description                                                                                                                                                                                                |
| ---------------------- | --------------------------------------------------------------------------------------------------------------- | ----------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `loading`              | `boolean`                                                                                                       | Required                | Controls Root's local loading request. A true value starts or preserves a covered cycle; false permits exit only after entrance and coordinated descendants complete.                                      |
| `fullscreen`           | `boolean`                                                                                                       | `false`                 | Ports only the active visual layer to `document.body` and covers the viewport. Root and application content remain at the composition site.                                                                |
| `revealAnimationProps` | `LoadingCoverRevealAnimationProps`                                                                              | None                    | Passes the allowed direction, alignment, offsets, and RevealAnimation lifecycle callbacks. This prop accepts an object only.                                                                               |
| `logo`                 | `React.ReactElement \| null`                                                                                    | `<LoadingCover.Logo />` | Omission or `undefined` uses the default Logo, a React element replaces it, and `null` removes it. The resolved element is duplicated by RevealAnimation and must meet the documented safety requirements. |
| `aria-label`           | `string`                                                                                                        | `"Loading"`             | Supplies the text of the owned loading status. It is consumed by the status node and is not forwarded as Root's accessible name.                                                                           |
| `children`             | `React.ReactNode`                                                                                               | None                    | Application content owned only by the stable content wrapper. Children are never passed to or duplicated by RevealAnimation.                                                                               |
| `className`            | `string \| ((state: LoadingCoverRootState) => string \| undefined)`                                             | None                    | Class applied to Root or returned from its public state. Consumer overrides that break required geometry or stacking leave the corresponding guarantee consumer-owned.                                     |
| `style`                | `React.CSSProperties \| ((state: LoadingCoverRootState) => React.CSSProperties \| undefined)`                   | None                    | Style applied to Root or returned from its public state. Consumer overrides that break required geometry or stacking leave the corresponding guarantee consumer-owned.                                     |
| `ref`                  | `React.Ref<HTMLElement>`                                                                                        | None                    | Ref attached to the final default or consumer-rendered HTMLElement.                                                                                                                                        |
| `render`               | `ReactElement \| ((props: HTMLProps, state: LoadingCoverRootState) => ReactElement)`                            | None                    | Replaces the default `div` through Base UI render semantics. The replacement must remain a local child-bearing element and preserve received props, children, and ref.                                     |
| native `div` props     | `Omit<useRender.ComponentProps<"div", LoadingCoverRootState>, "className" \| "style" \| "ref">` inherited props | None                    | Every other native attribute, event, ARIA attribute other than the consumed `aria-label`, consumer data attribute, children, and Base UI render prop passes to Root.                                       |

Root fixes `render`, `children`, `contentMode="flow"`, `reveal`, `scale={1}`,
and `unrevealBehavior="continue"` on its internal RevealAnimation. Those owned
values win even when untyped JavaScript input supplies conflicting keys.

Root supplies `direction="left-to-right"` only when
`revealAnimationProps.direction` is absent. A consumer direction overrides that
fallback. `alignX`, `alignY`, `offsetX`, `offsetY`, `direction`,
`onRevealChange`, `onRevealStart`, and `onRevealComplete` retain their public
RevealAnimation types and meanings.

### Events

LoadingCover defines no DOM custom events and no Root-specific lifecycle
callbacks. Native Root events pass through.

The three callbacks supplied through `revealAnimationProps` are composed with
Root bookkeeping. Consumer callbacks run once with the actual effective
RevealAnimation target and do not replace LoadingCover's lifecycle ownership.
An interrupted target does not emit completion. The silent reset after a
completed continue unreveal does not emit a second completion.

Once Root commits a true target for initial reveal or unreveal recovery, a
later `loading={false}` records readiness without requesting a false target.
It therefore emits no false `onRevealChange` or `onRevealStart` until Root has
completely revealed and later becomes exit-eligible.

Changing direction follows RevealAnimation: it cancels active motion and
places the current target immediately without a RevealAnimation lifecycle
callback. Root treats that placement as immediate internal attainment so its
loading cycle cannot become stranded, applies the same latest-loading child
mount decision as normal true completion, but it does not synthesize a
consumer `onRevealComplete` call.

### Data Attributes

| Attribute                                | Element                     | Description                                                                                                                                                                      |
| ---------------------------------------- | --------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `data-loading-cover-root`                | Root                        | Identifies Root.                                                                                                                                                                 |
| `data-loading`                           | Root                        | Present while the local `loading` prop is true.                                                                                                                                  |
| `data-fullscreen`                        | Root                        | Present while `fullscreen` is true, including when the visual layer is absent.                                                                                                   |
| `data-loading-cover-state="hidden"`      | Root                        | The visual layer is absent, application children are mounted and interactive, and Root is resolved.                                                                              |
| `data-loading-cover-state="revealing"`   | Root                        | The visual layer is entering or returning toward completely revealed; children remain mounted, visible through the transparent uncovered region, and blocked while Root is busy. |
| `data-loading-cover-state="revealed"`    | Root                        | The visual layer is completely opaque; blocked children may be mounted for readiness or coordination, or unmounted while local loading remains true.                             |
| `data-loading-cover-state="unrevealing"` | Root                        | The cover is continuing away, application content is interactive, and Root remains unresolved until hidden.                                                                      |
| `data-loading-cover-content`             | Application-content wrapper | Identifies the stable wrapper that exclusively owns application children.                                                                                                        |
| `data-loading-cover-layer`               | Active visual layer         | Identifies the local absolute layer or portaled fixed fullscreen layer. Absent while Root is hidden.                                                                             |
| `data-loading-cover-status`              | Active status node          | Identifies the owned live-status element when this Root owns its branch announcement.                                                                                            |

RevealAnimation alone owns the attributes on its internal animation tree.
LoadingCover does not redefine or mirror `data-motion`, `data-content-mode`,
`data-unreveal-behavior`, `data-active-unreveal-behavior`, or any
`data-reveal-*` marker.

Root exposes no public busy, entered, exiting, member, registration, stack,
depth, or status-owner attribute beyond the attributes listed above.

### CSS Variables

Root defines no LoadingCover-specific public CSS variables. RevealAnimation's
documented CSS variables remain available on its own marked elements.

The fullscreen stacking level is fixed behavior, not a customizable variable.

## Logo

### Props

`LoadingCoverLogoProps` preserves the public legacy `LogoIcon` props, its
variant, SVG native attributes, and SVG ref. `LoadingCoverLogoState` is the
empty public state object. The namespace aliases are `LoadingCover.Logo.Props`
and `LoadingCover.Logo.State`.

| Prop             | Type                        | Default        | Description                                                                                                     |
| ---------------- | --------------------------- | -------------- | --------------------------------------------------------------------------------------------------------------- |
| `variant`        | Legacy `LogoIcon` variant   | `"foreground"` | Selects the legacy mark treatment. The default becomes Background-colored on the inverted fully revealed cover. |
| `className`      | `string`                    | None           | Class applied to the composed LogoIcon SVG.                                                                     |
| `style`          | `React.CSSProperties`       | None           | Style applied to the composed LogoIcon SVG.                                                                     |
| native SVG props | Legacy `LogoIcon` SVG props | None           | Native SVG attributes, events, consumer data attributes, and an `SVGSVGElement` ref pass to LogoIcon.           |

Logo is centered within both duplicated loading surfaces. It is decorative by
contract and must not become an interaction target or accessible image.

### Events

Logo defines no custom events. Native SVG events pass through, but consumers
must not use the loading mark as an interactive control.

### Data Attributes

| Attribute                 | Description                                                                           |
| ------------------------- | ------------------------------------------------------------------------------------- |
| `data-loading-cover-logo` | Identifies each default LoadingCover.Logo presentation duplicated by RevealAnimation. |

### CSS Variables

Logo defines no public CSS variables.

## Accessibility

Root itself is a semantic-free `div` by default. It does not receive status,
dialog, progress, or modal semantics. Consumer ARIA attributes other than the
consumed `aria-label` apply to the final Root element.

The application-content wrapper is separate from the visual layer. While Root
is `revealing` or `revealed`, the wrapper is inert, hidden from the
accessibility tree, and has `aria-busy="true"`. Pointer interaction is also
blocked. During `revealing`, its children remain mounted and visually visible
through the transparent uncovered region even though they are inaccessible and
noninteractive. At the actual start of `unrevealing`, Root removes inert,
accessibility hiding, and `aria-busy` in the same lifecycle step that releases
pointer interaction. The content remains accessible and interactive through
`hidden`.

The active loading announcement is a separate node outside RevealAnimation and
outside the busy content subtree. It has `role="status"`,
`aria-live="polite"`, and `aria-atomic="true"`. Its visually hidden text is
`Loading` by default or the exact Root `aria-label` value. Root does not apply
the status role to application content.

Only busy Roots, whose visual state is `revealing` or `revealed`, are eligible
to announce. Announcement ownership is resolved independently in each
ancestor-descendant branch:

- if one or more busy fullscreen Roots are present, fullscreen suppresses busy
  local ancestor and descendant statuses;
- among busy Roots in the same placement tier, the outer blocking Root owns the
  status and suppresses nested statuses;
- when a fullscreen descendant begins `unrevealing`, it stops being a status
  candidate and a still-busy local ancestor may announce again;
- sibling Roots represent independent status regions and may announce
  independently;
- no topmost fullscreen sibling is inferred because fullscreen peers have no
  promised paint order.

Both RevealAnimation loading surfaces and every default or replacement logo
presentation are decorative, `aria-hidden`, inert, nonfocusable, and
noninteractive. RevealAnimation's overlay remains pointer-inert. A replacement
logo must be deterministic and safe to render twice; document-unique IDs,
portals, functional controls, single-owner refs, non-reentrant effects, and
nondeterministic output are unsupported.

A fullscreen Root must enclose the application subtree it claims to block. Its
fixed visual layer intercepts pointer input across the viewport, while inert on
the enclosed subtree blocks keyboard and assistive interaction. During
`revealing`, the mounted subtree remains visually visible through the
transparent uncovered portion of the viewport layer. LoadingCover does not make
unrelated document subtrees inert.

## Behavior

LoadingCover exports the `LoadingCover` namespace and the direct runtime
components `LoadingCoverCascade`, `LoadingCoverRoot`, and `LoadingCoverLogo`.
It also exports `LoadingCoverNamespace`, `LoadingCoverCascadeProps`,
`LoadingCoverCascadeState`, `LoadingCoverRootProps`, `LoadingCoverRootState`,
`LoadingCoverLogoProps`, `LoadingCoverLogoState`, `LoadingCoverVisualState`, and
`LoadingCoverRevealAnimationProps` through the family and package entry points.
Coordinator, registration, member-ID, aggregate-registry, stack-rank, and
status-owner types are private.

### Root visual lifecycle

`hidden` is the resting state. The visual layer is absent, application children
are mounted and interactive, Root reports resolved to its parent coordinator,
and Root is not eligible to announce loading.

When a committed `loading={true}` is observed from `hidden`, Root immediately
reports unresolved, blocks the content wrapper, keeps its application children
mounted, and enters `revealing`. It mounts RevealAnimation at its starting
hidden clip path, then requests `reveal={true}` so entrance is observable rather
than mounting already revealed. The real source remains transparent, so the
blocked application children stay visually visible through the uncovered area
while the inverted Foreground overlay and Background-colored Logo enter along
the selected direction. A true value batched away before Root commits and
observes it creates no loading cycle.

Once the true target is committed, Root holds it until RevealAnimation is
completely revealed. A false `loading` value received during initial entrance
records local readiness but does not request a false target, reverse the
entrance, resume a continue endpoint, or unmount the application subtree.
Existing descendant Root and Cascade memberships remain live and may change
normally, but they cannot make Root exit-eligible before true completion.

When the true target completes, Root enters `revealed` and uses the latest
committed `loading` value. If loading remains true, Root may unmount application
children in the resulting update because the Foreground overlay is already
fully opaque. The Root itself remains unresolved and revealed, so removing its
descendant memberships cannot transiently resolve it toward its parent.

If loading is false at true completion, Root preserves the existing application
subtree and memberships without an unmount-remount cycle. It then passes a
post-completion membership-settlement boundary before evaluating exit
eligibility. If children were previously unmounted during a sustained revealed
loading period, a later false value remounts them behind the opaque surface and
waits for their committed memberships to settle. A transient empty registry
during that remount must not permit an early exit.

If Root is already completely `revealed` with mounted children and loading
becomes true, it may unmount them immediately because complete coverage was
attained before that request.

Outside Cascade, the settled Root is immediately eligible to exit. Inside
Cascade, it is eligible only when its nearest descendant coordinator is
resolved. When eligible, Root requests `reveal={false}`, enters `unrevealing`,
removes application-content blocking and status eligibility, and lets the
continuing overlay progressively expose the mounted application children
through the already transparent real source. Root becomes `hidden`, removes the
visual layer, and reports resolved only after RevealAnimation completes the
hidden target and performs its silent continue reset.

There is no minimum time between loading entrance and exit. The only waiting
conditions are entrance completion, local `loading`, descendant mounting and
membership settlement, and coordinated descendant resolution.

If local `loading` becomes true during `unrevealing`, Root immediately becomes
busy and unresolved, blocks its still-mounted application children, enters
`revealing`, and asks RevealAnimation to return toward revealed from its current
geometry. The subtree remains visually visible through the uncovered area. If
loading becomes false again before that recovery completes, Root records
readiness, holds the true target through completely revealed, preserves the
continuous subtree, and only then reconsiders exit. If loading remains true at
completion, Root may unmount the now fully covered subtree.

If only a coordinated descendant becomes unresolved during ancestor
`unrevealing`, the ancestor keeps the mounted descendant tree, makes its content
inert and accessibility-hidden again, and holds a true target toward revealed.
Keeping the tree mounted preserves the blocker and leaves it visually visible
through the uncovered region. If the descendant becomes hidden before ancestor
recovery completes, the ancestor still reaches completely revealed before
evaluating a new continue exit.

A descendant that becomes unresolved after an ancestor is already `hidden`
does not reactivate that ancestor. The hidden Root remains resolved toward its
parent and acts as a propagation boundary until its own `loading` becomes true.

### Cascade coordination

Cascade provides the opt-in coordination scope. A Root or nested Cascade
registers exactly once with its nearest coordinator. A coordinated Root also
provides the nearest coordinator for its own descendants. A nested Cascade
registers one aggregate member with its parent and provides a fresh coordinator
to its members.

A Root member is resolved only in `hidden`. A Cascade member is resolved when
it has no current members or every current member is resolved. Adding an
unresolved member makes the aggregate pending. Unmounting a member removes it
and may resolve the aggregate. This nearest-member model makes completion
recursive without exposing registration details.

While a coordinated Root is `revealing`, its mounted descendant memberships
remain live and continue to aggregate normally. They cannot make the Root exit
before its true target completes. If true completion finds local loading true,
the fully covered Root may unmount that subtree and remove its memberships while
remaining unresolved itself. If true completion finds loading false, Root
preserves the existing memberships through the post-completion settlement
boundary without clearing or recreating them.

When Roots are nested outside Cascade, none registers or waits for descendants.
Their local loading and visual lifecycles remain independent.

Coordination follows the React tree. Portaling a fullscreen visual layer does
not change its membership, nearest coordinator, descendant relationship, or
hidden propagation boundary.

### Loading surface and duplication

Application children exist only in `data-loading-cover-content`. LoadingCover
never passes them to RevealAnimation and never creates an application-content
copy.

RevealAnimation receives the LoadingCover loading surface through `render` and
the resolved logo element through `children`. Both the real and overlay loading
surfaces are decorative and inert. The default Logo and any replacement are
therefore rendered twice. The real-source Logo is visually hidden so the mark
appears only as the clipped inverted overlay enters.

The real Reveal source remains transparent throughout `revealing`, `revealed`,
and `unrevealing`, and its duplicated Logo remains visually hidden. The
uncovered portion therefore exposes real application children whenever they are
mounted. RevealAnimation's opposite-theme overlay alone supplies the clipped
Foreground cover and Background-colored mark throughout entrance, recovery,
and continuing exit.

LoadingCover expresses that distinction only through RevealAnimation's
documented `data-reveal-source` and `data-reveal-overlay-surface` attributes on
the consumer-supplied loading surface. It does not depend on undocumented
RevealAnimation class names, DOM shape, CSS variables, or private state.

### Placement and stacking

Local placement is the default. Root establishes `position: relative` and
`isolation: isolate`. Its content wrapper occupies normal flow, and the active
visual layer is absolute with zero inset above that content. Local stacking
guarantees only that a Root's layer covers its own enclosed application
content. No relative order is promised between overlapping local Roots.

Because a locally loading Root intentionally unmounts application children,
the Root must retain nonzero geometry from an explicit size, flex or grid
stretching, or another stable layout constraint independent of those children.
LoadingCover does not invent a minimum width or height.

With `fullscreen`, only `data-loading-cover-layer` is portaled to
`document.body`. The Root element, content wrapper, application children,
public state attributes, native props, and ref remain at the composition site.
The active fullscreen layer uses fixed positioning with zero inset and
`z-index: 2147483647`. It is above ordinary author stacking layers but cannot
outrank browser top-layer elements.

Every fullscreen layer paints in the fullscreen tier above every local layer
in the same active Cascade, regardless of React ancestry, Cascade depth, mount
order, or which Root began loading first. All fullscreen Roots use the same
tier. No relative paint order is promised between overlapping fullscreen
peers, and consumers and tests must not depend on a winner. Cascade controls
completion dependencies, not peer paint order.

The stacking guarantee applies to LoadingCover's default geometry. Consumer
styles that create a higher external stacking context or override required
positioning leave the result consumer-owned. LoadingCover exposes no z-index
prop or variable, placement-depth attribute, custom portal target, Portal part,
or `keepMounted` control.

### Render and style composition

Cascade and Root preserve Base UI `useRender` semantics and every native `div`
prop except the three deliberate public overrides. The element and function
render forms receive the owned props, children, and `HTMLElement` ref. Function
render receives the public part state as its second argument. `className` and
`style` may be values or state callbacks.

Cascade render must preserve its received children so descendant context and
membership remain present. Root render must produce one local child-bearing
DOM element, preserve the received children and ref, and keep the application
content and any local visual layer at the composition site. Fragments, void
elements, portals, and output that relocates Root children are unsupported.

Consumer `className` and `style` merge after Powercoach defaults. A conflicting
consumer value may replace a default, but geometry, stacking, clipping,
interaction, or visibility results broken by that override become
consumer-owned. Native and consumer event handlers compose through Base UI
merge semantics.

## Motion

LoadingCover uses CSS transitions through its composed RevealAnimation. It does
not define a second clip-path transition or loading keyframe.

The default entrance travels left to right from
`inset(0 100% 0 0)` to `inset(0 0 0 0)`. The default continue exit travels in
the same direction to `inset(0 0 0 100%)`, then RevealAnimation resets silently
to its starting hidden geometry. A consumer-selected direction uses the public
RevealAnimation mapping for both entrance and continuing exit.

Each normal target transition uses RevealAnimation's 300ms duration and
`cubic-bezier(0.4, 0, 0.2, 1)` easing. LoadingCover adds no 1000ms delay. The
four LoadingCover visual states map to motion as follows:

| State         | Reveal target and visual result                                                                                                                    |
| ------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| `hidden`      | Hidden target complete; the LoadingCover visual layer is absent.                                                                                   |
| `revealing`   | RevealAnimation is moving or recovering toward completely revealed while blocked children remain mounted and visible through the uncovered region. |
| `revealed`    | Reveal target complete; the opaque Foreground cover is stable and children may be mounted or unmounted according to latest loading and settlement. |
| `unrevealing` | Continue hidden target is active and the overlay progressively exposes application content.                                                        |

An unreveal target is never requested before the initial or recovery true target
completes. A true target that interrupts an active continue unreveal returns
from the current clip geometry toward revealed. LoadingCover holds that target
even if local or descendant readiness returns early. Completely revealed clears
RevealAnimation's preserved unreveal latch; a later eligible false request
starts a new continue unreveal from complete coverage rather than resuming from
partial recovery geometry.

When `direction` changes, RevealAnimation immediately places the overlay at the
current target, cancels the active transition and latch, and emits no lifecycle
callback. Root recognizes the target internally without synthesizing a
consumer completion callback, then continues the LoadingCover state machine.

Under reduced motion, RevealAnimation reaches every requested target
immediately and reports its documented change, start, and completion lifecycle.
LoadingCover still preserves the logical sequence of activation and blocking,
true-target completion, conditional child unmount or preservation, membership
settlement, exit start and interaction release, and hidden completion. Reduced
motion does not skip or collapse the loading cycle.

## Use Cases

### UC-001 - Render the public family

Given a consumer imports LoadingCover or its direct Cascade, Root, and Logo
exports
When the public parts render
Then each part exposes its documented props, state aliases, native props, refs,
render semantics, and package exports without exposing coordination internals

### UC-002 - Use local placement by default

Given Root omits fullscreen and has geometry independent of loading children
When its visual layer is active
Then Root establishes relative isolated local geometry and places an absolute
zero-inset layer above only its own normal-flow content

### UC-003 - Enter loading from hidden

Given Root is hidden with mounted application children
When loading becomes true
Then Root reports unresolved, blocks but preserves application children,
mounts RevealAnimation at starting hidden, enters revealing, and keeps the
children visible through the transparent uncovered area while requesting the
Foreground cover and Logo

### UC-004 - Complete entrance before exit

Given Root is revealing and loading becomes false
When the initial reveal is incomplete
Then Root remembers readiness, preserves the continuous child subtree, holds the
true target through complete entrance without false-target callbacks, and only
then evaluates membership settlement and exit

### UC-005 - Mount content before continuing exit

Given Root is revealed, local loading is false, and its coordinator is resolved
When the application subtree and memberships have settled behind the opaque
cover
Then Root starts continue unreveal without an artificial minimum delay,
releases application interaction and accessibility, reaches hidden, removes
the visual layer, and reports resolved

### UC-006 - Configure the composed RevealAnimation

Given Root receives allowed direction, alignment, offset, or lifecycle values
through revealAnimationProps
When the effective target changes
Then consumer configuration overrides only the allowed fallback values,
LoadingCover-owned RevealAnimation props still win, and composed callbacks
report the actual RevealAnimation lifecycle once

### UC-007 - Preserve ordering under reduced motion

Given reduced motion is active and Root receives a complete loading cycle
When RevealAnimation reaches each target immediately
Then LoadingCover still activates blocking, completes the true target,
conditionally preserves or unmounts children, ensures exit memberships are
settled, begins exit, releases interaction, and completes hidden in that order

### UC-008 - Cover the viewport

Given Root has fullscreen true and encloses the application subtree it blocks
When the visual layer is active
Then only that layer is portaled to document.body at fixed zero inset and the
fullscreen tier, it intercepts viewport pointer input, and inert blocks keyboard
and assistive interaction only in the enclosed subtree

### UC-009 - Select the loading mark

Given Root omits logo, receives a duplicate-safe React element, or receives
null
When its loading surface renders
Then Root respectively duplicates the default decorative Logo, duplicates the
replacement, or renders no mark without changing the loading lifecycle

### UC-010 - Present the approved loading colors

Given a default LoadingCover begins and completes entrance in light or dark mode
When the Reveal source and inverted overlay are inspected
Then the source remains transparent and exposes mounted application children,
the clipped overlay alone supplies the Foreground cover, and the default legacy
LogoIcon resolves to Background on that cover

### UC-011 - Wait for a nested Root

Given a Root participates in Cascade and has a mounted nested unresolved Root
during its reveal
When the parent completes its true target with local loading false
Then the nested membership remains continuous through the post-completion
settlement boundary and the parent remains revealed until the nested Root
reaches hidden

### UC-012 - Aggregate recursive Cascades

Given a Cascade contains Root members or a nested Cascade member
When members become hidden, are added, or are removed
Then each Root reports only to its nearest coordinator, each nested Cascade
reports one aggregate result, an empty Cascade is resolved, and the recursive
aggregate is resolved only when every current member is resolved

### UC-013 - Keep independent and hidden boundaries

Given nested Roots are outside Cascade or an ancestor coordinated Root is
already hidden
When a descendant becomes unresolved
Then uncoordinated Roots remain independent and a hidden Root does not reactivate
or propagate descendant activity until its own loading becomes true

### UC-014 - Interrupt ancestor exit

Given a coordinated ancestor is unrevealing with its descendants mounted
When local loading restarts or a descendant becomes unresolved
Then both cases keep the tree mounted and visible through the uncovered region,
block interaction immediately, hold a true target from current geometry through
completely revealed, and only then conditionally unmount or evaluate a new exit

### UC-015 - Apply placement tiers

Given coordinated local and fullscreen Roots or overlapping same-tier Roots are
active
When their layers paint
Then every fullscreen layer is above every local layer, local peers have no
relative guarantee, fullscreen peers have no relative guarantee, and Cascade
ordering does not imply peer paint ordering

### UC-016 - Block and release application content

Given Root is revealing, revealed, unrevealing, or hidden
When its visual state changes
Then application content is inert, accessibility-hidden, aria-busy, and
pointer-blocked only while revealing or revealed, remains visually visible
through the uncovered region while revealing, and is released at the start of
unrevealing

### UC-017 - Announce loading without nested duplication

Given busy Roots have default or custom aria-label values in ancestor,
descendant, sibling, local, or fullscreen relationships
When status ownership is evaluated
Then eligible status nodes announce politely and atomically, fullscreen wins
over local within a branch, the outer busy Root wins within one tier, siblings
may announce independently, and unrevealing or hidden Roots do not announce

### UC-018 - Expose public state and attributes

Given Cascade and Root move through aggregate, loading, placement, and visual
states
When consumers inspect render state or documented data attributes
Then they observe resolved or pending Cascade state, Root busy, fullscreen,
loading, and visual state, and the documented content, layer, status, and Logo
markers without registration or stacking internals, including an absent
data-loading attribute while a committed revealing cycle finishes its held true
target

### UC-019 - Preserve supported render and style composition

Given Cascade or Root receives render, className, style, native props, events,
or refs
When the override preserves the documented local child-bearing structure and
required geometry
Then Base UI composition merges the consumer surface with public state while
the deliberate className, style, and HTMLElement ref overrides remain
available and LoadingCover retains its owned content, visual layer, lifecycle,
and coordination

### UC-020 - Keep duplicated loading content safe

Given Root uses the default Logo, a replacement logo, and application children
When RevealAnimation renders its real and overlay loading surfaces
Then only decorative duplicate-safe loading content is rendered twice and the
application subtree, unique IDs, functional controls, effects, and single-owner
refs are not duplicated

### UC-021 - Continue after a direction change

Given Root changes an allowed RevealAnimation direction during an active target
When RevealAnimation immediately places the current target without a lifecycle
callback
Then Root recognizes internal attainment, applies the latest-loading conditional
child unmount or preservation decision, emits no synthetic consumer completion,
and continues its entrance, waiting, or exit lifecycle without becoming
stranded
