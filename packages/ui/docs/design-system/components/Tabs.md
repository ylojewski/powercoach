---
revision: 6
date: 2026-08-20
---

# Tabs

## Overview

Tabs renders related Powercoach panels on top of Base UI Tabs semantics.
Use it when one tab from a related set selects one panel in the same view.

Tabs preserves the documented Base UI Tabs controlled and uncontrolled state,
orientation, activation, keyboard navigation, disabled behavior, render
composition, data attributes, CSS variables, Panel lifecycle, and
accessibility.
Powercoach adds the default Button chrome to each Tab, composes
RevealAnimation around every Tab surface, gives Indicator a foreground
rectangle treatment, fuses adjacent logical Tab borders, synchronizes DOM and
Base UI text direction, gives Panels the Base UI animated-panels CSS motion,
and manages Indicator presence across the no-active boundary so its entry and
exit can complete in CSS.

Tabs owns each effective reveal target, real Tab semantics, Button chrome,
logical border fusion, and overlay conflict treatment. RevealAnimation owns its
complete current motion and inspection contract. Tabs does not define or freeze
RevealAnimation clip-path geometry.

Indicator preserves Base UI active measurements and nullable state while
Powercoach extends only its visual mount lifetime when selection changes
between an active Tab and `null`.

Tabs uses CSS transitions. It does not use Motion.

Tabs exposes the same five public parts as Base UI. The layout element around
Panel siblings in the animated examples is ordinary consumer markup, not a
sixth Tabs part.

## Anatomy

Tabs exposes five public parts.

- `Tabs.Root`: groups the Tabs, owns selection state, and sets orientation.
- `Tabs.List`: groups the individual Tabs and owns keyboard navigation.
- `Tabs.Tab`: selects the Panel with the matching value.
- `Tabs.Indicator`: marks the active Tab visually.
- `Tabs.Panel`: displays the content associated with one Tab value.

Each Tab produces one `data-reveal-root` unit as a direct List child. These
units preserve Tab DOM order. Indicator remains inside List after the Tab units
because it uses Base UI List context and measurements. This public ordering
allows the first active Tab to be distinguished without a private index. Panel
siblings share an ordinary consumer-owned layout wrapper when the documented
animated layout is required.

The first Tab is the first direct List child matching `data-reveal-root`, even
when List has other children. Active-first detection reads `data-active` only
from the real surface inside `data-reveal-surface`; it does not treat the
decorative `data-reveal-overlay-surface` as another Tab. Real and overlay
surfaces remain identifiable through the complete public RevealAnimation DOM
contract.

```tsx
<Tabs.Root>
  <Tabs.List>
    <Tabs.Tab value="overview">Overview</Tabs.Tab>
    <Tabs.Indicator />
  </Tabs.List>
  <div className="relative grid overflow-hidden">
    <Tabs.Panel value="overview">Overview content</Tabs.Panel>
  </div>
</Tabs.Root>
```

## Examples

### EX-001 - Default animated Tabs

Context: A consumer needs horizontal Tabs with an initially selected Panel and
the default Powercoach visual treatments.

Expected behavior: Overview is selected initially. Its Tab uses the default
Button chrome and remains revealed. The other enabled Tabs reveal on hover and
keyboard focus. Indicator sits immediately above List, aligns to the active
Tab, and moves and resizes when the active value changes. Incoming and outgoing
Panels overlap in the consumer-owned viewport and use the documented opacity
and horizontal translate transitions. The differently sized Tabs have no gap:
the first owns its complete border, each following Tab receives its inline-start
jointure from the preceding Tab, and idle Indicator includes the shared jointure
without adding or losing a pixel.

Covers: UC-001, UC-002, UC-004, UC-005, UC-007, UC-008, UC-014

```tsx
import { Tabs } from '@powercoach/ui'

export function DefaultTabs() {
  return (
    <Tabs.Root className="w-full max-w-xs" defaultValue="overview">
      <Tabs.List>
        <Tabs.Tab value="overview">Overview</Tabs.Tab>
        <Tabs.Tab value="projects">Projects</Tabs.Tab>
        <Tabs.Tab value="account">Account</Tabs.Tab>
        <Tabs.Indicator />
      </Tabs.List>

      <div className="relative grid min-h-32 w-full grid-cols-1 overflow-hidden">
        <Tabs.Panel value="overview">Workspace stats and activity.</Tabs.Panel>
        <Tabs.Panel value="projects">Milestones and deadlines.</Tabs.Panel>
        <Tabs.Panel value="account">Profile and preferences.</Tabs.Panel>
      </div>
    </Tabs.Root>
  )
}
```

### EX-002 - Controlled selection and no-active state

Context: A consumer needs to control the active value and allow a state with no
active Tab.

Expected behavior: The buttons control Root through `value`. Selecting a value
activates the matching Tab and Panel. On initial render, Indicator is directly
at rest over Overview without boundary entry motion. Clearing the value hides
every Panel and keeps Indicator at the last complete border-corrected Tab
geometry while it moves downward beneath that Tab, then unmounts it without an
opacity exit. Selecting a value again mounts Indicator beneath the measured
active Tab and moves it upward to its resting position. The output exposes the
current controlled value.

Covers: UC-002, UC-007, UC-015

```tsx
import * as React from 'react'
import { Button, Tabs } from '@powercoach/ui'

export function ControlledTabs() {
  const [value, setValue] = React.useState<string | null>('overview')

  return (
    <div>
      <div className="flex gap-2">
        <Button type="button" onClick={() => setValue('overview')}>
          show overview
        </Button>
        <Button type="button" onClick={() => setValue('projects')}>
          show projects
        </Button>
        <Button type="button" onClick={() => setValue(null)}>
          clear selection
        </Button>
      </div>
      <output>{value ?? 'none'}</output>

      <Tabs.Root value={value} onValueChange={setValue}>
        <Tabs.List>
          <Tabs.Tab value="overview">Overview</Tabs.Tab>
          <Tabs.Tab value="projects">Projects</Tabs.Tab>
          <Tabs.Indicator />
        </Tabs.List>
        <div className="relative grid min-h-32 grid-cols-1 overflow-hidden">
          <Tabs.Panel value="overview">Overview content</Tabs.Panel>
          <Tabs.Panel value="projects">Projects content</Tabs.Panel>
        </div>
      </Tabs.Root>
    </div>
  )
}
```

### EX-003 - Vertical keyboard navigation

Context: A consumer needs vertically oriented Tabs with Base UI's default
manual activation.

Expected behavior: Root lays out List in the left column and the animated Panel
viewport directly in the right column. Every Tab stretches to the intrinsic
width of the widest Tab in this example while Nutrition uses a different
consumer height. The first Tab owns its complete border, and each following Tab
receives its block-start jointure from the preceding Tab without a gap.
Indicator is a vertical `0.75rem` bar on the outside left edge of List, matches
the complete visible active Tab height including that jointure, and moves and
resizes vertically. Up and Down move focus, Home and End move to the first and
last enabled Tab, focus does not loop, and moving focus does not change the
selected Tab or Panel. Enter or Space activates the focused Tab. Activating a
Tab above uses the documented upward Panel translation, and activating a Tab
below uses the documented downward Panel translation. Under reduced motion,
Panels keep the opacity transition without directional translation.

Covers: UC-003, UC-007, UC-008, UC-012, UC-013, UC-014

```tsx
import { Tabs } from '@powercoach/ui'

export function VerticalTabs() {
  return (
    <Tabs.Root
      orientation="vertical"
      defaultValue="training"
      className="grid w-full min-w-0 grid-cols-[max-content_minmax(0,1fr)]"
    >
      <Tabs.List loopFocus={false} className="relative grid grid-cols-1 items-stretch">
        <Tabs.Tab className="w-full" value="overview">
          Overview
        </Tabs.Tab>
        <Tabs.Tab className="w-full" value="training">
          Training
        </Tabs.Tab>
        <Tabs.Tab className="h-14 w-full" value="nutrition">
          Nutrition
        </Tabs.Tab>
        <Tabs.Indicator />
      </Tabs.List>

      <div className="relative grid min-h-32 min-w-0 grid-cols-1 overflow-hidden">
        <Tabs.Panel value="overview">Overview content</Tabs.Panel>
        <Tabs.Panel value="training">Training content</Tabs.Panel>
        <Tabs.Panel value="nutrition">Nutrition content</Tabs.Panel>
      </div>
    </Tabs.Root>
  )
}
```

### EX-004 - Reveal overrides and disabled policy

Context: A consumer needs custom RevealAnimation presentation while retaining
Tabs-owned active and disabled reveal state.

Expected behavior: The active Training Tab remains revealed with the requested
top-to-bottom direction, continue unreveal behavior, start alignment, scale, and
offsets. Overview uses the same overrides but reveals only on hover or keyboard
focus. After a complete reveal, its hide continues top to bottom; an interrupted
reveal returns according to RevealAnimation. When Training ceases to be active,
its completed controlled reveal can also continue top to bottom. Locked is
disabled and remains unrevealed. The output makes the configured continue value
and latest RevealAnimation start callback visible. Each Reveal root exposes the
current continue configuration through the complete RevealAnimation inspection
contract.
Consumers cannot replace Tabs-owned reveal state through the override object.
The active Tab owns its outgoing shared jointure, and the disabled final Tab
receives that jointure without adding a second border. Unreveal travel does not
change logical edge ownership, and the overlay uses the same missing
inline-start edge as its real Tab surface.

Covers: UC-004, UC-005, UC-010, UC-014

```tsx
import * as React from 'react'
import { Tabs } from '@powercoach/ui'

export function CustomizedTabReveals() {
  const [message, setMessage] = React.useState('idle')
  const unrevealBehavior = 'continue' as const
  const revealAnimation = {
    direction: 'top-to-bottom' as const,
    unrevealBehavior,
    alignX: 'start' as const,
    scale: 1.1,
    offsetX: 4,
    offsetY: -2,
    onRevealStart: (revealed: boolean) => setMessage(revealed ? 'revealing' : 'hiding')
  }

  return (
    <div>
      <output>
        {unrevealBehavior}: {message}
      </output>
      <Tabs.Root defaultValue="training">
        <Tabs.List>
          <Tabs.Tab value="overview" revealAnimation={revealAnimation}>
            Overview
          </Tabs.Tab>
          <Tabs.Tab value="training" revealAnimation={revealAnimation}>
            Training
          </Tabs.Tab>
          <Tabs.Tab value="locked" disabled revealAnimation={revealAnimation}>
            Locked
          </Tabs.Tab>
          <Tabs.Indicator />
        </Tabs.List>
        <div className="relative grid min-h-32 grid-cols-1 overflow-hidden">
          <Tabs.Panel value="overview">Overview content</Tabs.Panel>
          <Tabs.Panel value="training">Training content</Tabs.Panel>
          <Tabs.Panel value="locked">Locked content</Tabs.Panel>
        </div>
      </Tabs.Root>
    </div>
  )
}
```

### EX-005 - Link Tab render override

Context: A consumer needs link navigation while retaining Base UI Tab
semantics and the Powercoach visual composition.

Expected behavior: Each Tab renders through an anchor with
`nativeButton={false}`. The anchor forwards its ref and received props to its
DOM surface and is safe to render twice. Only the real anchor receives the Tab
identity, ARIA relationships, focus, pointer events, navigation, and
activation. The RevealAnimation overlay is decorative and cannot navigate or
activate the Tab. Link render polymorphism preserves the same logical border
ownership and idle Indicator correction as the default Tab surface.

Covers: UC-006, UC-011, UC-014

```tsx
import { Tabs } from '@powercoach/ui'

export function LinkedTabs() {
  return (
    <Tabs.Root defaultValue="overview">
      <Tabs.List>
        <Tabs.Tab nativeButton={false} render={<a href="#overview" />} value="overview">
          Overview
        </Tabs.Tab>
        <Tabs.Tab nativeButton={false} render={<a href="#projects" />} value="projects">
          Projects
        </Tabs.Tab>
        <Tabs.Indicator />
      </Tabs.List>
      <div className="relative grid min-h-32 grid-cols-1 overflow-hidden">
        <Tabs.Panel value="overview">Overview content</Tabs.Panel>
        <Tabs.Panel value="projects">Projects content</Tabs.Panel>
      </div>
    </Tabs.Root>
  )
}
```

### EX-006 - Kept Panels and interrupted selection

Context: A consumer needs Panel content to stay mounted and selection to remain
stable when values change before previous transitions complete.

Expected behavior: Both Panels remain in the DOM because `keepMounted` is true.
Rapid selection changes transition every mounted Panel from its current
computed opacity and translate toward its new target without a layout jump.
Inactive Panels remain inert with `tabIndex={-1}` after exit. The output shows
the current active value.

Covers: UC-008, UC-009

```tsx
import * as React from 'react'
import { Button, Tabs } from '@powercoach/ui'

export function PersistentTabs() {
  const [value, setValue] = React.useState('first')

  return (
    <div>
      <Button type="button" onClick={() => setValue('first')}>
        first
      </Button>
      <Button type="button" onClick={() => setValue('second')}>
        second
      </Button>
      <output>{value}</output>

      <Tabs.Root value={value} onValueChange={setValue}>
        <Tabs.List>
          <Tabs.Tab value="first">First</Tabs.Tab>
          <Tabs.Tab value="second">Second</Tabs.Tab>
          <Tabs.Indicator />
        </Tabs.List>
        <div className="relative grid min-h-32 grid-cols-1 overflow-hidden">
          <Tabs.Panel keepMounted value="first">
            First persistent content
          </Tabs.Panel>
          <Tabs.Panel keepMounted value="second">
            Second persistent content
          </Tabs.Panel>
        </div>
      </Tabs.Root>
    </div>
  )
}
```

### EX-007 - Logical border fusion and RTL Indicator

Context: A consumer needs to inspect logical border ownership and idle
Indicator geometry in both text directions with a border wider than the
default.

Expected behavior: The LTR and RTL Roots synchronize their explicit `dir` with
Base UI behavior and HTML/CSS direction. Each List uses a uniform `3px` border
with no gap. The first Tab keeps every border, each following Tab removes its
logical inline-start border on both real and overlay surfaces, and the jointure
is painted by the previous DOM Tab. Labels produce different widths, the middle
Tab is initially active, and the final Tab is disabled. Activating the first or
middle Tab updates the visible output. At idle, Indicator uses a leading-border
offset of `0px` for the first Tab and `3px` for the middle Tab, covers the
complete visible active extent in LTR and RTL, and leaves its outgoing edge at
the Base UI measured edge.

Covers: UC-002, UC-003, UC-007, UC-010, UC-014

```tsx
import * as React from 'react'
import { Tabs } from '@powercoach/ui'

const directions = ['ltr', 'rtl'] as const

export function LogicalBorderFusionTabs() {
  const [values, setValues] = React.useState({ ltr: 'projects', rtl: 'projects' })

  return (
    <div className="grid gap-8">
      {directions.map((direction) => (
        <section key={direction} className="grid gap-2">
          <output>
            {direction}: {values[direction]}
          </output>

          <Tabs.Root
            dir={direction}
            value={values[direction]}
            onValueChange={(nextValue) => {
              if (typeof nextValue === 'string') {
                setValues((current) => ({ ...current, [direction]: nextValue }))
              }
            }}
          >
            <Tabs.List activateOnFocus className="[--tabs-border-width:3px]">
              <Tabs.Tab value="overview">Overview</Tabs.Tab>
              <Tabs.Tab value="projects">Longer projects label</Tabs.Tab>
              <Tabs.Tab value="locked" disabled>
                Locked
              </Tabs.Tab>
              <Tabs.Indicator />
            </Tabs.List>

            <div className="relative grid min-h-32 grid-cols-1 overflow-hidden">
              <Tabs.Panel value="overview">Overview content</Tabs.Panel>
              <Tabs.Panel value="projects">Projects content</Tabs.Panel>
              <Tabs.Panel value="locked">Locked content</Tabs.Panel>
            </div>
          </Tabs.Root>
        </section>
      ))}
    </div>
  )
}
```

### EX-008 - Indicator boundary motion

Context: A consumer needs to inspect Indicator entry, exit, interruption, and
orientation when controlled Tabs allow no active value.

Expected behavior: Both Roots begin with no active Tab and no mounted
Indicator. Selecting a Tab gives Indicator that Tab's complete border-corrected
geometry before motion begins. In the horizontal Root it moves upward from
beneath the active Tab; in the vertical Root it moves leftward from beneath the
active Tab. Clearing selection moves it in the inverse direction beneath the
Tab becoming inactive and unmounts it after exit. Selecting either Tab before
exit completes immediately reverses the boundary translation from its current
position. When the new Tab differs, Indicator also moves and resizes toward the
new Tab at the same time. Under reduced motion, boundary translation is skipped
and Indicator appears or disappears without motion. Each output exposes the
current controlled value.

Covers: UC-002, UC-007, UC-012, UC-015

```tsx
import * as React from 'react'
import { Button, Tabs } from '@powercoach/ui'

function BoundaryTabs({ orientation }: { orientation: 'horizontal' | 'vertical' }) {
  const [value, setValue] = React.useState<string | null>(null)
  const vertical = orientation === 'vertical'

  return (
    <section className="grid gap-2">
      <div className="flex gap-2">
        <Button type="button" onClick={() => setValue('first')}>
          show first
        </Button>
        <Button type="button" onClick={() => setValue('second')}>
          show second
        </Button>
        <Button type="button" onClick={() => setValue(null)}>
          clear selection
        </Button>
      </div>
      <output>
        {orientation}: {value ?? 'none'}
      </output>

      <Tabs.Root
        orientation={orientation}
        value={value}
        onValueChange={setValue}
        className={vertical ? 'grid grid-cols-[max-content_minmax(0,1fr)]' : undefined}
      >
        <Tabs.List className={vertical ? 'relative grid grid-cols-1' : undefined}>
          <Tabs.Tab className={vertical ? 'w-full' : undefined} value="first">
            First
          </Tabs.Tab>
          <Tabs.Tab className={vertical ? 'h-14 w-full' : undefined} value="second">
            Longer second Tab
          </Tabs.Tab>
          <Tabs.Indicator />
        </Tabs.List>

        <div className="relative grid min-h-32 min-w-0 grid-cols-1 overflow-hidden">
          <Tabs.Panel value="first">First content</Tabs.Panel>
          <Tabs.Panel value="second">Second content</Tabs.Panel>
        </div>
      </Tabs.Root>
    </section>
  )
}

export function IndicatorBoundaryMotionTabs() {
  return (
    <div className="grid gap-8">
      <BoundaryTabs orientation="horizontal" />
      <BoundaryTabs orientation="vertical" />
    </div>
  )
}
```

## Root

### Props

`Tabs.Root.Props` and `TabsRootProps` expose the Base UI Root props and native
`div` props.

| Prop               | Type                                                                                    | Default                 | Description                                                                                                                                    |
| ------------------ | --------------------------------------------------------------------------------------- | ----------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| `defaultValue`     | `Tabs.Tab.Value`                                                                        | `0`                     | Initial uncontrolled value. `null` creates no active Tab. Omitted or `undefined` allows Base UI automatic initial selection and fallback.      |
| `value`            | `Tabs.Tab.Value`                                                                        | None                    | Controlled active value. `null` creates no active Tab.                                                                                         |
| `onValueChange`    | `(value: Tabs.Tab.Value, eventDetails: Tabs.Root.ChangeEventDetails) => void`           | None                    | Called when Base UI requests or performs a value change.                                                                                       |
| `orientation`      | `"horizontal" \| "vertical"`                                                            | `"horizontal"`          | Sets layout flow, keyboard arrow mapping, and activation direction.                                                                            |
| `dir`              | `"ltr" \| "rtl"`                                                                        | Inherited, then `"ltr"` | Synchronizes HTML/CSS direction on Root with the Base UI direction context owned by Tabs. Explicit Root direction overrides ambient direction. |
| `className`        | `string \| ((state: Tabs.Root.State) => string \| undefined)`                           | None                    | Composes consumer classes on Root.                                                                                                             |
| `style`            | `React.CSSProperties \| ((state: Tabs.Root.State) => React.CSSProperties \| undefined)` | None                    | Applies consumer styles to Root.                                                                                                               |
| `render`           | `ReactElement \| ((props: HTMLProps, state: Tabs.Root.State) => ReactElement)`          | None                    | Replaces or composes the Root element according to Base UI render behavior.                                                                    |
| native `div` props | `Base UI Root native props`                                                             | None                    | Native attributes except the narrowed `dir` contract above, events, `aria-*`, `data-*`, children, and ref pass through according to Base UI.   |

Tabs.Root does not expose an `indicator` prop. Consumers render or omit
`Tabs.Indicator` in the public anatomy.

`dir="auto"` is outside the synchronized Tabs direction contract. A Root
render override forwards the effective `dir` to its final DOM element. CSS
direction that contradicts the effective `dir` is outside the guaranteed
geometry and navigation contract.

The namespaced and package alias types are:

```ts
type TabsRootOrientation = Tabs.Root.Orientation
type TabsRootState = Tabs.Root.State
type TabsRootProps = Tabs.Root.Props
type TabsRootChangeEventReason = Tabs.Root.ChangeEventReason
type TabsRootChangeEventDetails = Tabs.Root.ChangeEventDetails
```

### Events

`onValueChange` preserves Base UI Root change details.

| Reason     | Description                                                                                                              |
| ---------- | ------------------------------------------------------------------------------------------------------------------------ |
| `none`     | A user click or keyboard interaction requests the value.                                                                 |
| `initial`  | An uncontrolled Root performs its first automatic selection or fallback.                                                 |
| `disabled` | An uncontrolled Root falls back because the selected Tab became disabled.                                                |
| `missing`  | An uncontrolled Root falls back because the selected Tab was removed or an explicit default never matched a mounted Tab. |

`eventDetails` includes `reason`, `event`, `cancel`, `allowPropagation`,
`isCanceled`, `isPropagationAllowed`, `trigger`, and `activationDirection`.
User changes with reason `none` may be canceled. Automatic `initial`,
`disabled`, and `missing` changes cannot be canceled. A controlled Root retains
the supplied value even when the matching Tab is disabled or missing.

### Data Attributes

| Attribute                                                                 | Description                                                  |
| ------------------------------------------------------------------------- | ------------------------------------------------------------ |
| `data-orientation="horizontal"`                                           | Root uses horizontal orientation.                            |
| `data-orientation="vertical"`                                             | Root uses vertical orientation.                              |
| `data-activation-direction="left" \| "right" \| "up" \| "down" \| "none"` | Direction of activation relative to the previous active Tab. |
| `dir="ltr" \| "rtl"`                                                      | Effective synchronized HTML/CSS and Base UI text direction.  |

### CSS Variables

Root defines no public CSS variables.

## List

### Props

`Tabs.List.Props` and `TabsListProps` expose the Base UI List props and native
`div` props.

| Prop               | Type                                                                                    | Default | Description                                                                                               |
| ------------------ | --------------------------------------------------------------------------------------- | ------- | --------------------------------------------------------------------------------------------------------- |
| `activateOnFocus`  | `boolean`                                                                               | `false` | Activates a Tab when arrow-key navigation focuses it. Otherwise Enter or Space activates the focused Tab. |
| `loopFocus`        | `boolean`                                                                               | `true`  | Loops arrow-key focus from the last enabled Tab to the first and back.                                    |
| `className`        | `string \| ((state: Tabs.List.State) => string \| undefined)`                           | None    | Composes consumer classes on List.                                                                        |
| `style`            | `React.CSSProperties \| ((state: Tabs.List.State) => React.CSSProperties \| undefined)` | None    | Applies consumer styles to List.                                                                          |
| `render`           | `ReactElement \| ((props: HTMLProps, state: Tabs.List.State) => ReactElement)`          | None    | Replaces or composes the List element according to Base UI render behavior.                               |
| native `div` props | `Base UI List native props`                                                             | None    | Native attributes, events, `aria-*`, `data-*`, children, and ref pass through according to Base UI.       |

`Tabs.List.State`, `TabsListState`, `Tabs.List.Props`, and `TabsListProps` are
public types.

### Events

List defines no custom events. Native events pass through according to Base UI.

### Data Attributes

| Attribute                                                                 | Description                                                  |
| ------------------------------------------------------------------------- | ------------------------------------------------------------ |
| `data-orientation="horizontal" \| "vertical"`                             | Effective Root orientation.                                  |
| `data-activation-direction="left" \| "right" \| "up" \| "down" \| "none"` | Direction of activation relative to the previous active Tab. |

### CSS Variables

List owns the positioning context for the default Indicator treatment and the
uniform border input for its Tab units.

| Variable              | Default | Description                                                                                                                                                                                   |
| --------------------- | ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--tabs-border-width` | `1px`   | Uniform border width inherited by every real and overlay Tab surface and used for logical border fusion. Accepts a non-negative absolute CSS length smaller than the rendered Tab dimensions. |

The variable is set once on List. A local border-width or
`--tabs-border-width` override on an individual Tab, a positive List gap, or CSS
reordering leaves the guaranteed fusion contract.

## Tab

### Props

`Tabs.Tab.Props` and `TabsTabProps` expose Base UI Tab props, native button
props, and the Powercoach `revealAnimation` prop.

| Prop                | Type                                                                                   | Default  | Description                                                                                                                 |
| ------------------- | -------------------------------------------------------------------------------------- | -------- | --------------------------------------------------------------------------------------------------------------------------- |
| `value`             | `Tabs.Tab.Value`                                                                       | Required | Identifies the Tab and associates it with the Panel that has the same value.                                                |
| `disabled`          | `boolean`                                                                              | `false`  | Disables Base UI Tab interaction. An inactive disabled Tab remains unrevealed.                                              |
| `nativeButton`      | `boolean`                                                                              | `true`   | Indicates whether a render override is a native button. Set false for a non-button surface.                                 |
| `revealAnimation`   | `TabsTabRevealAnimationProps`                                                          | `{}`     | Overrides RevealAnimation presentation and callbacks. Tabs owns children, render, and effective reveal state.               |
| `className`         | `string \| ((state: Tabs.Tab.State) => string \| undefined)`                           | None     | Composes consumer classes with Button chrome and Base UI classes on the real Tab surface and its visual overlay.            |
| `style`             | `React.CSSProperties \| ((state: Tabs.Tab.State) => React.CSSProperties \| undefined)` | None     | Applies consumer styles through the Base UI Tab state contract.                                                             |
| `render`            | `ReactElement \| ((props: HTMLProps, state: Tabs.Tab.State) => ReactElement)`          | None     | Replaces or composes the Tab surface. The render target must satisfy the additional RevealAnimation compatibility contract. |
| native button props | `Base UI Tab native props`                                                             | None     | Native button attributes, events, `aria-*`, `data-*`, children, and ref pass through to the real Tab surface.               |

```ts
type TabsTabRevealAnimationProps = Omit<RevealAnimationProps, 'children' | 'render' | 'reveal'>
```

`TabsTabRevealAnimationProps` is a package export. It accepts `contentMode`,
every other current RevealAnimation prop except `children`, `render`, and
`reveal`, including `unrevealBehavior`. Tabs owns the omitted children, render
surface, and controlled effective reveal state.

The namespaced and package alias types are:

```ts
type TabsTabValue = Tabs.Tab.Value
type TabsTabActivationDirection = Tabs.Tab.ActivationDirection
type TabsTabPosition = Tabs.Tab.Position
type TabsTabSize = Tabs.Tab.Size
type TabsTabMetadata = Tabs.Tab.Metadata
type TabsTabState = Tabs.Tab.State
type TabsTabProps = Tabs.Tab.Props
```

### Events

Tab defines no custom DOM events. Native events and Base UI Tab activation
behavior pass through the real surface. RevealAnimation lifecycle callbacks in
`revealAnimation` report the Tabs-owned effective reveal target.

### Data Attributes

| Attribute                                                                                                                                              | Element                   | Description                                                                                 |
| ------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------- | ------------------------------------------------------------------------------------------- |
| `data-orientation="horizontal" \| "vertical"`                                                                                                          | Real Tab surface          | Effective Root orientation.                                                                 |
| `data-disabled`                                                                                                                                        | Real Tab surface          | Present when Tab is disabled.                                                               |
| `data-active`                                                                                                                                          | Real Tab surface          | Present when Tab is active.                                                                 |
| `data-activation-direction="left" \| "right" \| "up" \| "down" \| "none"`                                                                              | Real Tab surface          | Direction of activation relative to the previous active Tab.                                |
| `data-motion="reveal"`, `data-content-mode`, `data-unreveal-behavior`, conditional `data-active-unreveal-behavior`, and the `data-reveal-*` attributes | RevealAnimation structure | Preserve the complete current RevealAnimation inspection contract.                          |
| `data-reveal-overlay-surface`                                                                                                                          | Decorative Tab surface    | Marks the inert visual duplicate and enables the default Button overlay conflict treatment. |

### CSS Variables

Tab defines no Tabs-specific CSS variables. Each real and overlay surface
inherits `--tabs-border-width` from List. Each composed RevealAnimation owns its
documented public RevealAnimation CSS variables.

## Indicator

### Props

`Tabs.Indicator.Props` and `TabsIndicatorProps` expose the Base UI Indicator
props and native `span` props.

| Prop                    | Type                                                                                         | Default | Description                                                                                         |
| ----------------------- | -------------------------------------------------------------------------------------------- | ------- | --------------------------------------------------------------------------------------------------- |
| `renderBeforeHydration` | `boolean`                                                                                    | `false` | Renders Indicator before hydration when true according to Base UI SSR and CSP behavior.             |
| `className`             | `string \| ((state: Tabs.Indicator.State) => string \| undefined)`                           | None    | Composes consumer classes with the Powercoach Indicator treatment.                                  |
| `style`                 | `React.CSSProperties \| ((state: Tabs.Indicator.State) => React.CSSProperties \| undefined)` | None    | Applies consumer styles to Indicator.                                                               |
| `render`                | `ReactElement \| ((props: HTMLProps, state: Tabs.Indicator.State) => ReactElement)`          | None    | Replaces or composes Indicator according to Base UI render behavior.                                |
| native `span` props     | `Base UI Indicator native props`                                                             | None    | Native attributes, events, `aria-*`, `data-*`, children, and ref pass through according to Base UI. |

`Tabs.Indicator.State`, `TabsIndicatorState`, `Tabs.Indicator.Props`, and
`TabsIndicatorProps` are public types.

### Events

Indicator defines no custom events. Native events may be passed through, but
the default visual Indicator is pointer-inactive and decorative.

### Data Attributes

| Attribute                                                                 | Description                                                  |
| ------------------------------------------------------------------------- | ------------------------------------------------------------ |
| `data-orientation="horizontal" \| "vertical"`                             | Effective Root orientation.                                  |
| `data-activation-direction="left" \| "right" \| "up" \| "down" \| "none"` | Direction of activation relative to the previous active Tab. |
| `data-starting-style`                                                     | Present during translated entry from the no-active state.    |
| `data-ending-style`                                                       | Present during translated exit toward the no-active state.   |

### CSS Variables

Indicator preserves every Base UI active Tab measurement variable.

| Variable              | Description                                              |
| --------------------- | -------------------------------------------------------- |
| `--active-tab-left`   | Distance from the left side of List to the active Tab.   |
| `--active-tab-right`  | Distance from the right side of List to the active Tab.  |
| `--active-tab-top`    | Distance from the top side of List to the active Tab.    |
| `--active-tab-bottom` | Distance from the bottom side of List to the active Tab. |
| `--active-tab-width`  | Width of the active Tab.                                 |
| `--active-tab-height` | Height of the active Tab.                                |

Indicator also exposes the Powercoach correction for logical border ownership.

| Variable                              | Access    | Description                                                                                                                                                               |
| ------------------------------------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--tabs-active-leading-border-offset` | Read-only | `0px` when the first Tab unit is active; otherwise the resolved `--tabs-border-width`. Indicator adds this owned incoming jointure to the Base UI active Tab measurement. |

While a Tab-to-`null` exit is running, Indicator retains the last resolved
values of the six active-Tab variables and
`--tabs-active-leading-border-offset` as a frozen visual snapshot. The snapshot
does not make that Tab active: `Tabs.Indicator.State.activeTabPosition` and
`activeTabSize` remain `null` throughout exit. The retained values are removed
when Indicator unmounts after its CSS transition completes.

## Panel

### Props

`Tabs.Panel.Props` and `TabsPanelProps` expose the Base UI Panel props and
native `div` props.

| Prop               | Type                                                                                     | Default  | Description                                                                                         |
| ------------------ | ---------------------------------------------------------------------------------------- | -------- | --------------------------------------------------------------------------------------------------- |
| `value`            | `Tabs.Tab.Value`                                                                         | Required | Associates the Panel with the Tab that has the same value.                                          |
| `keepMounted`      | `boolean`                                                                                | `false`  | Keeps the inactive Panel in the DOM after its exit transition.                                      |
| `className`        | `string \| ((state: Tabs.Panel.State) => string \| undefined)`                           | None     | Composes consumer classes with the default Panel layout and motion classes.                         |
| `style`            | `React.CSSProperties \| ((state: Tabs.Panel.State) => React.CSSProperties \| undefined)` | None     | Applies consumer styles to Panel.                                                                   |
| `render`           | `ReactElement \| ((props: HTMLProps, state: Tabs.Panel.State) => ReactElement)`          | None     | Replaces or composes Panel according to Base UI render behavior.                                    |
| native `div` props | `Base UI Panel native props`                                                             | None     | Native attributes, events, `aria-*`, `data-*`, children, and ref pass through according to Base UI. |

The namespaced and package alias types are:

```ts
type TabsPanelMetadata = Tabs.Panel.Metadata
type TabsPanelState = Tabs.Panel.State
type TabsPanelProps = Tabs.Panel.Props
```

### Events

Panel defines no custom events. Native events may be passed through the
rendered Panel element.

### Data Attributes

| Attribute                                                                 | Description                                                               |
| ------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| `data-orientation="horizontal" \| "vertical"`                             | Effective Root orientation.                                               |
| `data-activation-direction="left" \| "right" \| "up" \| "down" \| "none"` | Direction of activation relative to the previous active Tab.              |
| `data-hidden`                                                             | Present after an inactive kept-mounted Panel finishes its exit lifecycle. |
| `data-index`                                                              | Index of the Panel in the registered collection.                          |
| `data-starting-style`                                                     | Present while Panel is animating in from its entry style.                 |
| `data-ending-style`                                                       | Present while Panel is animating out toward its exit style.               |

### CSS Variables

Panel defines no public CSS variables.

## Accessibility

Tabs follows Base UI Tabs accessibility semantics.

List has the `tablist` role. A vertical List exposes vertical
`aria-orientation`. Each real Tab is the only `tab` role for its value and owns
`aria-selected`, `aria-controls`, focus, activation, disabled behavior, and its
generated association with the matching Panel. Each Panel has the `tabpanel`
role and `aria-labelledby` association with its Tab.

The active Panel has `tabIndex={0}`. An inactive Panel is inert and uses
`tabIndex={-1}`. With `keepMounted={false}`, Base UI keeps an exiting Panel
mounted until its detected CSS transition completes and then unmounts it. With
`keepMounted`, the inactive Panel remains in the DOM, hidden and inert after
exit.

Horizontal Lists use Left and Right Arrow navigation. Vertical Lists use Up and
Down Arrow navigation. Home and End move focus to the first and last enabled
Tab. `loopFocus` decides whether arrow navigation wraps. By default, arrow keys
move focus and Enter or Space activates the focused Tab. `activateOnFocus`
activates as focus moves. Root's effective `dir` is supplied to Base UI so its
documented LTR or RTL keyboard behavior and the logical CSS border geometry use
the same direction.

If disabled Tabs affect the initial uncontrolled selection during server-side
rendering, consumers provide a `value` or `defaultValue` that identifies an
enabled Tab because disabled registration is not known during pre-rendering.

Tabs.Tab does not render Button and does not take Button semantics. It consumes
only Button's semantic-free default chrome and Heading mapping. The real Base
UI Tab remains the only accessible, focusable, and interactive surface.
RevealAnimation's overlay is decorative, inert, hidden from assistive
technology, not focusable, and pointer-inactive. It does not create duplicate
Tab roles, IDs, accessible names, ARIA associations, refs, or actions.

Indicator is decorative and pointer-inactive. During a Tab-to-`null` exit, its
presentation node keeps `role="presentation"`, its render target, and its ref
until the CSS translate transition completes. The retained node does not keep
the previous Tab selected, active, focusable, or exposed as an additional
accessibility object.

A Tab render override must accept children, forward every received prop to its
underlying DOM surface, forward its ref, and remain safe to render twice. A
render function receives the exact Base UI Tab state. Render-time side effects
that assume the surface is evaluated only once are unsupported. Consumer refs
resolve only to the real Tab surface.

The focus-visible Tab unit paints above neighboring units so its Button outline
is not covered. The outline belongs only to the real Tab border-box; it does not
expand around an incoming jointure owned by the previous Tab. List does not clip
the outline.

## Behavior

Root renders a Base UI Tabs Root and preserves Base UI controlled and
uncontrolled selection. `defaultValue` defaults to `0`. A `null` value means no
Tab is active. In an uncontrolled Root, Base UI may select or fall back to an
enabled mounted Tab when initial, disabled, or missing state requires it. In a
controlled Root, the consumer-provided value remains authoritative.

Root owns one effective text direction. An explicit `dir="ltr"` or `dir="rtl"`
sets that value. When `dir` is omitted, Root inherits the ambient Base UI
direction and falls back to `ltr`. Root applies the effective value to its DOM
element and supplies the same value to the Base UI direction context used by
its Tabs parts. An explicit Root value overrides ambient direction.

List preserves Base UI focus navigation and activation behavior. List also
establishes the positioning context for Indicator. Indicator is normally the
last child of List after the ordered direct `data-reveal-root` units produced by
Tab children.

Every Tab uses the public semantic-free Button default chrome with default
`size="lg"`, default `variant="default"`, and the matching `Heading` size
`sm`. The default visual treatment therefore uses `h-10`, `px-6 py-1`, a
foreground border, background, foreground content, square geometry, muted
disabled treatment, and the documented Button focus-visible outline and color
transition. Border width comes from the inherited `--tabs-border-width`, which
defaults to `1px`. At `1px`, the result is the exact Button default chrome. A
larger supported value is a Tabs border-width extension without copying or
changing Button colors, states, padding, typography, focus, or transitions. Tab
remains responsible for Base UI Tab semantics and state.

List creates no gap between its Tab units by default. Let `B` be the uniform
resolved `--tabs-border-width`. In horizontal orientation, the first Tab unit
keeps all four borders. Every following Tab removes `border-inline-start` from
both its real and overlay surfaces, and its incoming jointure belongs to the
`border-inline-end` of the previous DOM Tab. In vertical orientation, the first
Tab keeps all four borders. Every following Tab removes `border-block-start`
from both surfaces, and its incoming jointure belongs to the
`border-block-end` of the previous DOM Tab. No negative overlap is used.

Logical ownership follows DOM order in LTR and RTL. Active and disabled state
do not change border width or geometry. A jointure uses the color treatment of
the previous DOM Tab that owns it, including muted treatment when that owner is
disabled. A complete horizontal jointure requires adjacent Tabs to share the
same height, and a complete vertical jointure requires them to share the same
width. Positive consumer gaps, CSS reordering, conflicting local border widths,
or incompatible transverse dimensions are outside the guaranteed fusion
contract.

Every Tab composes RevealAnimation. Tabs owns the RevealAnimation `render`,
`children`, and effective `reveal` state. `revealAnimation` overrides every
other current documented RevealAnimation option, including
`unrevealBehavior`. Tabs does not recreate or freeze RevealAnimation markup,
styles, clip-path geometry, direction endpoints, theme inversion,
copied-content scaling, lifecycle, hidden reset, data attributes, or CSS
variables.

Effective reveal state uses active-first precedence. An active Tab passes
`reveal={true}` and remains revealed, including when the controlled active Tab
is also disabled. An inactive disabled Tab passes `reveal={false}` and remains
unrevealed. An enabled inactive Tab leaves `reveal` uncontrolled so hover and
keyboard focus reveal it and leaving both interaction states hides it.
Pointer-created DOM focus does not keep an inactive Tab revealed after hover
leaves.

RevealAnimation applies the forwarded `unrevealBehavior` to those Tabs-owned
targets. A completely revealed active Tab may use `continue` when it becomes
inactive and receives a false target. An inactive disabled Tab receives a false
target; if that target interrupts an incomplete reveal, RevealAnimation returns
toward its starting side regardless of `continue`. An enabled inactive Tab
follows the same completed-versus-interrupted rule when hover and keyboard focus
end. Tabs adds no retargeting or callback logic.

Tabs resolves Base UI Tab semantics and consumer render composition on the real
surface before RevealAnimation creates its visual duplicate. Only the real
surface participates in Base UI registration, measurement, focus, identity,
ARIA, events, and activation. The overlay preserves the visual Tab state and
Button chrome but removes semantic and interactive ownership. The default
Button-chrome overlay border is transparent so the inverted overlay border does
not conflict with the real Tab border. Its width and missing logical-start edge
match the real surface. RevealAnimation may cover a jointure owned by the
revealed Tab while its overlay is visible; that temporary masking is the
intentional existing RevealAnimation and Button overlay behavior.

Painting priority applies to each complete `data-reveal-root` unit. A
focus-visible unit paints above an active unit, an active unit paints above
inactive and disabled units, and equal-priority units follow natural visual
order. Painting priority does not change layout, border ownership, Base UI
measurements, DOM order, or keyboard order.

Indicator remains inside List and is an absolute, pointer-inactive foreground
rectangle. In horizontal orientation, it has height `0.75rem`, sits immediately
above and touches List. In vertical orientation, it has width `0.75rem` and sits
immediately outside and touches the physical left edge of List in LTR and RTL.

Let `O` be the read-only `--tabs-active-leading-border-offset`. `O` is `0px`
when the first Tab unit is active and otherwise equals `B`. In horizontal LTR,
Indicator left is `--active-tab-left - O` and width is
`--active-tab-width + O`. In horizontal RTL, left remains
`--active-tab-left` and width is `--active-tab-width + O`, extending the added
length toward the physical right incoming jointure. In vertical orientation,
top is `--active-tab-top - O` and height is `--active-tab-height + O`; RTL does
not alter that vertical formula.

At idle, these formulas include the incoming jointure owned by the preceding
Tab while leaving the outgoing edge at the Base UI measured edge. Indicator
therefore matches the complete user-visible active Tab extent for the first,
intermediate, last, differently sized, LTR, RTL, horizontal, and vertical
cases. No correction of the outgoing edge is applied.

When the active value changes between two non-null values, Indicator moves from
the previous corrected target to the new corrected target and interpolates
position and size. Intermediate motion values do not have to equal one Tab's
idle extent.

When value changes from `null` to a Tab value, Indicator receives the new Tab's
complete border-corrected geometry before motion begins. In horizontal
orientation, its entry starts at `translate: 0 100%` beneath the active Tab and
moves upward by its own total height to `translate: 0 0`. In vertical
orientation, entry starts at `translate: 100% 0` beneath the active Tab and
moves leftward by its own total width to `translate: 0 0`. The Tab unit paints
above the translated Indicator so the moving rectangle reads as emerging from
beneath the active Tab. `data-starting-style` marks this entry. Position and
size remain fixed at the new corrected geometry during an uninterrupted entry.

When value changes from a Tab value to `null`, Base UI active position and size
state become `null`, but Powercoach keeps the visual Indicator presentation
mounted with the last complete border-corrected geometry. In horizontal
orientation it moves downward to `translate: 0 100%`; in vertical orientation
it moves rightward to `translate: 100% 0`. The Tab becoming inactive paints
above the translated rectangle so Indicator reads as returning beneath that
Tab. `data-ending-style` marks this exit. Position and size remain frozen, no
opacity transition occurs, and Indicator unmounts after the CSS translate
transition completes.

If a `null`-to-Tab entry interrupts an unfinished exit, Indicator reverses its
translate transition immediately from its current computed position. When the
next active value identifies a different Tab, the reversed boundary translate
and the existing position-and-size transition to the new complete corrected
geometry run at the same time. These independent CSS transitions accumulate
without snapping Indicator back to either boundary endpoint.

An initial render or hydration with an active value places Indicator directly
at rest without `data-starting-style` or boundary entry motion. An initial
render or hydration with `null` has no mounted Indicator. Base UI
`renderBeforeHydration` behavior remains available within this initial-state
contract.

The default animated Panel layout requires one ordinary consumer wrapper around
the Panel siblings. The wrapper is positioned relative, uses a one-cell grid,
and clips overflow. Every Panel occupies the same grid cell. Equivalent
consumer CSS is valid. If this layout is omitted, Base UI selection,
accessibility, mounting, and Panel lifecycle still work, but the documented
overlapping and clipped visual animation is not guaranteed.

Incoming and outgoing Panels may remain mounted together while their
transitions run. With `keepMounted={false}`, an outgoing Panel unmounts after
Base UI detects its completed exit transition. With `keepMounted`, it stays in
the DOM hidden and inert after exit. During a rapid value change, more than two
Panels may temporarily remain mounted while their independent exit transitions
complete; consumer layouts must not assume exactly one entering and one exiting
Panel.

## Motion

Tabs uses CSS transitions.

In horizontal orientation, Indicator transitions `left` and `width` together
with `300ms cubic-bezier(0.22, 1, 0.36, 1)` and uses the new active Tab's
border-corrected horizontal target. The same `left` and `width` properties are
used in LTR and RTL, so a direction change does not swap physical positioning
properties. In vertical orientation, Indicator transitions `top` and `height`
together with `300ms cubic-bezier(0.22, 1, 0.36, 1)` and uses the
border-corrected vertical target. Size continues to interpolate during motion
between differently sized Tabs.

Indicator boundary entry and exit transition only `translate` with
`200ms cubic-bezier(0.22, 1, 0.36, 1)`. Horizontal entry moves from
`translate: 0 100%` to `translate: 0 0`, and horizontal exit reverses those
values. Vertical entry moves from `translate: 100% 0` to `translate: 0 0`, and
vertical exit reverses those values. Position and size do not interpolate
during an uninterrupted boundary transition. Indicator never transitions
opacity.

When an entry interrupts exit, the translate transition reverses from its
current computed value. If the next active Tab differs, the 200ms translate
transition runs concurrently with the applicable 300ms position-and-size
transitions. Each property continues from its current computed value without a
boundary snap.

Every Panel transitions opacity and translate with these exact settings:

| Property    | Transition                             |
| ----------- | -------------------------------------- |
| `opacity`   | `175ms ease`                           |
| `translate` | `300ms cubic-bezier(0.22, 1, 0.36, 1)` |

`data-starting-style` and `data-ending-style` both set opacity to `0`. The
normal active Panel has opacity `1` and zero translation.

| Activation direction | Entering starting translate | Exiting ending translate |
| -------------------- | --------------------------- | ------------------------ |
| `left`               | `translateX(-50%)`          | `translateX(50%)`        |
| `right`              | `translateX(50%)`           | `translateX(-50%)`       |
| `up`                 | `translateY(-50%)`          | `translateY(50%)`        |
| `down`               | `translateY(50%)`           | `translateY(-50%)`       |
| `none`               | None                        | None                     |

Left and right transitions combine opacity with horizontal movement. Up and
down transitions combine opacity with vertical movement while preserving the
same directional signs on the Y axis. Non-spatial activation uses opacity only.
A change from or to `null` and an automatic fallback may report `none`, so no
directional translation is applied.

CSS transitions may reverse smoothly. If selection changes before a previous
Panel transition completes, each affected Panel transitions from its current
computed opacity and translate toward the new target. Abandoned transitions do
not snap back to their original edge.

Directional Panel translation is guarded by the reduced-motion-safe media
condition. Under reduced motion, Panels receive no directional translate for
entry or exit. The supplied Base UI animated-panels treatment retains the
`175ms ease` opacity transition under reduced motion.

Under reduced motion, Indicator boundary entry and exit apply no translate
transition. Indicator appears directly at rest for `null`-to-Tab changes and
disappears immediately for Tab-to-`null` changes. This does not change the
active-to-active position-and-size contract.

RevealAnimation owns Tab reveal motion, its CSS transition lifecycle, theme
inversion, copied-content transform, unreveal behavior sampling, interruptions,
direction changes, exactly-once active-target completion, callback-silent hidden
reset, complete public inspection surface, and its own reduced-motion behavior.
Tabs only supplies the policy-derived effective reveal state and consumer
override props. It defines no RevealAnimation clip-path endpoint.

## Use Cases

### UC-001 - Render the Base UI Tabs anatomy

Given a consumer renders Root, List, Tab, Indicator, and Panel in the documented
anatomy
When Tabs is displayed
Then every part preserves its documented Base UI Tabs semantics and public
surface with Powercoach visual additions

### UC-002 - Control or default the active value

Given a consumer uses `defaultValue`, `value`, `onValueChange`, or `null`
When selection initializes or changes
Then Root follows Base UI controlled, uncontrolled, automatic fallback, reason,
and no-active behavior

### UC-003 - Navigate according to orientation

Given a consumer selects horizontal or vertical orientation, sets or inherits
LTR or RTL direction, and configures `activateOnFocus` or `loopFocus`
When the user navigates with arrows, Home, End, Enter, or Space
Then focus and activation follow the documented Base UI orientation and List
configuration under the same direction used by the Root DOM

### UC-004 - Apply Button default chrome without Button semantics

Given Tabs renders a Tab
When the Tab is displayed in active, inactive, focused, or disabled state
Then it uses the semantic-free Button default chrome and Heading mapping with
the uniform Tabs border-width and owned logical edges while retaining only Base
UI Tab semantics

### UC-005 - Reveal each Tab with active-first state policy

Given Tabs renders active, enabled inactive, and disabled inactive Tabs with
optional `revealAnimation` overrides
When selection, hover, or keyboard focus changes
Then active remains revealed, disabled inactive remains unrevealed, enabled
inactive follows RevealAnimation interaction state, every current override prop
other than children, render, and reveal is forwarded, a completely revealed Tab
uses the forwarded unreveal behavior when it hides, an incomplete reveal follows
RevealAnimation's interrupted return, and callbacks retain the complete current
RevealAnimation lifecycle

### UC-006 - Keep one semantic Tab through visual duplication

Given Tabs.Tab composes RevealAnimation around a compatible default or custom
render surface
When the Tab is inspected or activated
Then only the real surface owns Base UI registration, identity, ARIA, ref,
focus, pointer events, and activation while the overlay remains decorative and
uses the same border width and logical-start edge as the real surface, and the
Reveal root preserves the complete current RevealAnimation inspection contract

### UC-007 - Align and move Indicator

Given horizontal or vertical Root has an active value or changes between active
values
When Indicator has usable active Tab measurements
Then its read-only leading-border offset is zero for the first active Tab or the
uniform border width for a following active Tab, its LTR, RTL, or vertical target
includes the incoming owned jointure without correcting the outgoing edge, and
position and size transition with the documented 300ms timing

### UC-008 - Animate Panels by activation direction

Given Panel siblings use the documented ordinary animated layout wrapper
When the active value changes
Then incoming and outgoing Panels overlap, clip within the wrapper, and apply
the documented opacity transition with the 300ms directional translateX for
left or right activation and directional translateY for up or down activation

### UC-009 - Preserve Panel lifecycle during interruption

Given Panel selection changes before a transition completes or a Panel uses
`keepMounted`
When Base UI advances each Panel lifecycle
Then transitions continue from current computed values, exiting Panels stay
mounted until completion, and kept inactive Panels remain hidden and inert

### UC-010 - Preserve disabled Tab behavior

Given a Tab is disabled
When the user points to, focuses, or attempts to activate it
Then Base UI disabled semantics prevent focus and activation, Button disabled
chrome is visible, an active disabled Tab remains revealed, an inactive
disabled Tab receives the Tabs-owned false target, RevealAnimation applies its
completed-versus-interrupted hiding contract, and a jointure owned by that
disabled Tab uses its muted border color without changing width

### UC-011 - Render a Tab as a link

Given a consumer supplies a ref-forwarding, prop-spreading, duplication-safe
link through `render` and sets `nativeButton={false}`
When the Tab is displayed or activated
Then Base UI Tab semantics and Powercoach visual composition land on the real
link surface while the decorative duplicate cannot navigate or activate

### UC-012 - Respect reduced motion

Given reduced motion is active
When a Panel enters or exits or Indicator crosses the no-active boundary
Then Panels receive no directional translate and retain the supplied
`175ms ease` opacity transition, while Indicator skips boundary translation
and appears at rest or disappears immediately, and each Tab reveal follows the
complete current RevealAnimation reduced-motion lifecycle

### UC-013 - Place equal-width vertical Tabs beside Panels

Given a consumer uses the EX-003 two-column vertical layout
When Tabs is displayed
Then the Tabs share the intrinsic width of the widest Tab in the left column,
following Tabs remove their block-start border, Indicator includes the incoming
jointure while traveling along the outside left edge and matching different Tab
heights, and the clipped animated Panel viewport occupies the directly adjacent
right column without adding a public Tabs part or making equal width a global
vertical default

### UC-014 - Merge logical Tab borders and align idle Indicator

Given a gapless horizontal LTR or RTL List or a gapless vertical List uses one
uniform supported border width with differently sized enabled, active, and
disabled Tabs in DOM order
When the first Tab or a following Tab becomes active and motion reaches idle
Then the first Tab keeps all borders, each following Tab removes its logical
start border on the real and overlay surfaces, the incoming jointure belongs to
the previous DOM Tab, the read-only leading-border offset is `0px` or the
uniform border width, and Indicator exactly covers the user-visible active
extent without changing the outgoing edge or allowing RevealAnimation unreveal
travel to change logical border ownership

### UC-015 - Enter and exit Indicator across the no-active boundary

Given controlled Tabs changes between `null` and a Tab value
When Indicator enters, exits, or reverses an unfinished boundary transition
Then it preserves the corresponding complete border-corrected geometry, moves
upward or downward by its own height in horizontal orientation or leftward or
rightward by its own width in vertical orientation with the documented 200ms
CSS translate transition, uses `data-starting-style` or `data-ending-style`,
does not fade, and unmounts only after exit completes

Given boundary entry interrupts exit and the next active value identifies a
different Tab
When the CSS transitions retarget
Then translate reverses from its current computed position while position and
size move concurrently toward the new Tab without a boundary snap

Given Tabs initially renders or hydrates with an active value
When Indicator first appears
Then it is directly at rest without boundary entry motion
