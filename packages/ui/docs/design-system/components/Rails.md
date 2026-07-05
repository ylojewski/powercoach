---
revision: 11
date: 2026-08-20
---

# Rails

## Overview

Rails renders a Powercoach accordion that follows Base UI Accordion semantics
and selects the Rail presentation through `orientation`.

Use vertical Rails when a set of vertical Rail parts should reveal one Panel
on the inline axis. Use horizontal Rails when a set of horizontal Rail parts
should reveal one Panel on the block axis. Rails is not multiple: its state may
contain zero or one active item. An empty value array is the all-collapsed
state. Once a user activates an enabled Rail, one item remains active until
another enabled Rail is activated. Controlled consumers may return to the
all-collapsed state by passing an empty value array.

`orientation` accepts `vertical` and `horizontal` and defaults to `vertical`.
Vertical preserves the revision 9 visual layout. Horizontal is its complete
axis-transposed equivalent.

Rails uses CSS transitions. Vertical Panel motion transposes the Base UI
Accordion Panel animation model from height to width. Horizontal Panel motion
uses the Base UI height model.

Rails.Rail preserves Accordion Trigger semantics and activation. It
does not render Button and does not take Button semantics. It uses the shared
Button default chrome and composes RevealAnimation around the semantic Accordion
Trigger surface with the orientation-owned reveal direction so only the real
Rail is accessible and interactive. Vertical Rails reveal left to right;
horizontal Rails reveal top to bottom.

Rails supports LTR only in this revision. RTL and multiple-open behavior are
out of scope.

## Anatomy

Rails exposes six public parts.

- `Rails.Root`: groups the rail accordion and owns state.
- `Rails.List`: lays out rail items in visual order.
- `Rails.Item`: groups one Header and its associated Panel.
- `Rails.Header`: labels one Panel and contains its Rail.
- `Rails.Rail`: activates the associated Panel.
- `Rails.Panel`: reveals and clips the associated content.

Each Item contains a Header followed immediately by its associated Panel, and
each Header contains one Rail.

The family namespace export is `Rails`. The runtime leaf exports are
`RailsRoot`, `RailsList`, `RailsItem`, `RailsHeader`, `RailsRail`, and
`RailsPanel`.

The renamed package type aliases are `RailsRootValue`, `RailsRootState`,
`RailsRootProps`, `RailsRootChangeEventReason`, `RailsRootChangeEventDetails`,
`RailsListProps`, `RailsItemState`, `RailsItemProps`,
`RailsItemChangeEventReason`, `RailsItemChangeEventDetails`, `RailsHeaderState`,
`RailsHeaderProps`, `RailsRailState`, `RailsRailProps`, `RailsPanelState`,
and `RailsPanelProps`. The corresponding namespaced types remain available on
their Rails parts. `RailsOrientation` is the exported orientation type.

```tsx
<Rails.Root>
  <Rails.List>
    <Rails.Item value="overview">
      <Rails.Header>
        <Rails.Rail>Overview</Rails.Rail>
      </Rails.Header>
      <Rails.Panel>Overview content</Rails.Panel>
    </Rails.Item>
  </Rails.List>
</Rails.Root>
```

## Examples

### EX-001 - Default vertical Rails

Context: A consumer needs the default vertical Rails with an initially active
Panel.

Expected behavior: Rails defaults to `orientation="vertical"` and fills the
`w-100 h-100` example container. The active Panel takes the available width
after the Headers and signed Item start margins are measured, the
Panel width uses `cubic-bezier(0.22, 1, 0.36, 1)` while opening and closing,
the active Rail remains revealed, enabled inactive Rails reveal while hovered,
and adjacent closed rail borders read as one shared vertical border with no
gap. Every reveal sweeps left to right. Rail titles sit on one inset top-edge
axis inside each Rail so the visual top spacing balances the left and right
spacing. Revealed Rail titles use the RevealAnimation default content scale
while sharing that same inset top-edge axis and the existing center axis with
their source titles.

Covers: UC-001, UC-003, UC-004, UC-005, UC-007, UC-011, UC-012

```tsx
import { Rails } from '@powercoach/ui'

export function DefaultRails() {
  return (
    <div className="h-100 w-100">
      <Rails.Root defaultValue={['overview']}>
        <Rails.List>
          <Rails.Item value="overview">
            <Rails.Header>
              <Rails.Rail>Overview</Rails.Rail>
            </Rails.Header>
            <Rails.Panel>
              <div className="p-4">Overview content</div>
            </Rails.Panel>
          </Rails.Item>

          <Rails.Item value="training">
            <Rails.Header>
              <Rails.Rail>Training</Rails.Rail>
            </Rails.Header>
            <Rails.Panel>
              <div className="p-4">Training content</div>
            </Rails.Panel>
          </Rails.Item>

          <Rails.Item value="nutrition">
            <Rails.Header>
              <Rails.Rail>Nutrition</Rails.Rail>
            </Rails.Header>
            <Rails.Panel>
              <div className="p-4">Nutrition content</div>
            </Rails.Panel>
          </Rails.Item>
        </Rails.List>
      </Rails.Root>
    </div>
  )
}
```

### EX-002 - Controlled vertical all-collapsed state

Context: A consumer needs external state to inspect the no-active state and
single-active updates.

Expected behavior: Rails defaults to vertical orientation. Passing an empty
value array collapses every Panel and stacks the Rails to the right of the
List. Activating an enabled Rail replaces
the value with that item value. Activating the already active Rail keeps the
same value. Changing from the all-collapsed state to one active Panel animates
the opening Panel from width `0` to its measured open width when the external
`open programs` button sets the value or when the Programs Rail activation
changes the value from empty to `programs`.

Covers: UC-002, UC-003, UC-004, UC-014

```tsx
import * as React from 'react'
import { Rails } from '@powercoach/ui'

export function ControlledRails() {
  const [value, setValue] = React.useState<string[]>([])

  return (
    <div>
      <button type="button" onClick={() => setValue([])}>
        collapse all
      </button>
      <button type="button" onClick={() => setValue(['programs'])}>
        open programs
      </button>
      <output>{value[0] ?? 'none'}</output>

      <div className="h-100 w-100">
        <Rails.Root value={value} onValueChange={setValue}>
          <Rails.List>
            <Rails.Item value="programs">
              <Rails.Header>
                <Rails.Rail>Programs</Rails.Rail>
              </Rails.Header>
              <Rails.Panel>
                <div className="p-4">Programs panel</div>
              </Rails.Panel>
            </Rails.Item>

            <Rails.Item value="athletes">
              <Rails.Header>
                <Rails.Rail>Athletes</Rails.Rail>
              </Rails.Header>
              <Rails.Panel>
                <div className="p-4">Athletes panel</div>
              </Rails.Panel>
            </Rails.Item>
          </Rails.List>
        </Rails.Root>
      </div>
    </div>
  )
}
```

### EX-003 - Disabled item

Context: A consumer needs one rail item to be unavailable while keeping it in
the visual rail.

Expected behavior: The disabled Item exposes Base UI disabled state through the
Item, Header, and Rail state attributes. Its closed Panel uses `keepMounted`, so
the retained Panel also exposes disabled state. The Rail uses the disabled
Button chrome treatment, does not activate its Panel, and does not reveal while
hovered.

Covers: UC-008

```tsx
import { Rails } from '@powercoach/ui'

export function DisabledRailsItem() {
  return (
    <div className="h-100 w-100">
      <Rails.Root defaultValue={['available']}>
        <Rails.List>
          <Rails.Item value="available">
            <Rails.Header>
              <Rails.Rail>Available</Rails.Rail>
            </Rails.Header>
            <Rails.Panel>
              <div className="p-4">Available panel</div>
            </Rails.Panel>
          </Rails.Item>

          <Rails.Item value="locked" disabled>
            <Rails.Header>
              <Rails.Rail>Locked</Rails.Rail>
            </Rails.Header>
            <Rails.Panel keepMounted>
              <div className="p-4">Locked panel</div>
            </Rails.Panel>
          </Rails.Item>
        </Rails.List>
      </Rails.Root>
    </div>
  )
}
```

### EX-004 - React Router Link Rail

Context: The Manager needs Rails for primary navigation while preserving
Accordion Trigger semantics.

Expected behavior: Item owns the value. Rail renders through a React Router
Link with `nativeButton={false}`. The Link forwards its ref and spreads received
props onto the underlying DOM element so Accordion Trigger props and
Rails chrome props land on the same semantic surface. Button remains an
action component and is not used for navigation.

Covers: UC-009

```tsx
import { Link } from 'react-router-dom'
import { Rails } from '@powercoach/ui'

export function NavigationRails() {
  return (
    <div className="h-100 w-100">
      <Rails.Root defaultValue={['programs']}>
        <Rails.List>
          <Rails.Item value="programs">
            <Rails.Header>
              <Rails.Rail nativeButton={false} render={<Link to="/programs" />}>
                Programs
              </Rails.Rail>
            </Rails.Header>
            <Rails.Panel>
              <div className="p-4">Programs navigation panel</div>
            </Rails.Panel>
          </Rails.Item>

          <Rails.Item value="athletes">
            <Rails.Header>
              <Rails.Rail nativeButton={false} render={<Link to="/athletes" />}>
                Athletes
              </Rails.Rail>
            </Rails.Header>
            <Rails.Panel>
              <div className="p-4">Athletes navigation panel</div>
            </Rails.Panel>
          </Rails.Item>
        </Rails.List>
      </Rails.Root>
    </div>
  )
}
```

### EX-005 - Uneven vertical Rail widths

Context: A consumer needs vertical Rails with different widths.

Expected behavior: Rail width defaults to `w-10` and may be overridden with
`className`. Differently sized Rails remain aligned to their complete visible
extents and preserve the horizontal Rail layout when their associated Panels
open or close.

Covers: UC-004, UC-007

```tsx
import { Rails } from '@powercoach/ui'

export function UnevenRails() {
  return (
    <div className="h-100 w-100">
      <Rails.Root defaultValue={['wide']}>
        <Rails.List>
          <Rails.Item value="narrow">
            <Rails.Header>
              <Rails.Rail>Narrow</Rails.Rail>
            </Rails.Header>
            <Rails.Panel>
              <div className="p-4">Narrow rail panel</div>
            </Rails.Panel>
          </Rails.Item>

          <Rails.Item value="wide">
            <Rails.Header>
              <Rails.Rail className="w-14">Wide</Rails.Rail>
            </Rails.Header>
            <Rails.Panel>
              <div className="p-4">Wide rail panel</div>
            </Rails.Panel>
          </Rails.Item>
        </Rails.List>
      </Rails.Root>
    </div>
  )
}
```

### EX-007 - Vertical Rail borders, titles, and stable motion

Context: A consumer needs to inspect vertical Rail border ownership and title
geometry with a border wider than the default while Panel motion is running.

Expected behavior: List supplies a uniform `3px` Rail border. Every following
Item keeps a static `-3px` inline-start margin, and every real and overlay Rail
surface keeps its complete border-box geometry. During the final `3px` of a
Panel closing, the following Rail's inline-start border progressively overlaps
the preceding Rail's inline-end border. At zero Panel width, the two retained
borders occupy the same pixels and read as one shared jointure. The differently
sized Rails remain aligned to their complete visible extents.
Source Rail titles sit on one inset top-edge axis inside their Rail so the
visual top spacing balances the left and right spacing. When an enabled
inactive Rail reveals, the revealed title shares that same inset top-edge axis
and the existing center axis with the source title and grows with
RevealAnimation's default scale of `1.2`. Activating Training opens its Panel
while Nutrition moves continuously on the inline axis without jumping left or
right before returning.

Covers: UC-004, UC-007, UC-011, UC-012, UC-013

```tsx
import { Rails } from '@powercoach/ui'

export function StableRailMotion() {
  return (
    <div className="h-100 w-100">
      <Rails.Root defaultValue={['training']}>
        <Rails.List className="[--rails-border-width:3px]">
          <Rails.Item value="overview">
            <Rails.Header>
              <Rails.Rail>Overview</Rails.Rail>
            </Rails.Header>
            <Rails.Panel>
              <div className="p-4">Overview content</div>
            </Rails.Panel>
          </Rails.Item>

          <Rails.Item value="training">
            <Rails.Header>
              <Rails.Rail className="w-14">Training</Rails.Rail>
            </Rails.Header>
            <Rails.Panel>
              <div className="p-4">Training content</div>
            </Rails.Panel>
          </Rails.Item>

          <Rails.Item value="nutrition">
            <Rails.Header>
              <Rails.Rail>Nutrition</Rails.Rail>
            </Rails.Header>
            <Rails.Panel>
              <div className="p-4">Nutrition content</div>
            </Rails.Panel>
          </Rails.Item>
        </Rails.List>
      </Rails.Root>
    </div>
  )
}
```

### EX-008 - Consumer-controlled horizontal Panel mounting

Context: A consumer needs to inspect the horizontal height lifecycle and choose
whether closed Panels remain mounted globally or for one Panel.

Expected behavior: Programs starts open and mounted. With every checkbox
cleared, collapsing all keeps Programs mounted through its closing height
transition, then removes it from the DOM, while the already closed Athletes
Panel is absent. Selecting keep all Panels mounted retains closed Panels through
the Root setting, while the Programs Panel checkbox may override that setting
for Programs. Selecting make closed Panels findable overrides the keep-mounted
settings, retains closed Panels with hidden="until-found", and lets browser
find-in-page reveal their unique content. The outputs visibly report whether
each Panel content subtree is mounted. Under reduced motion, the requested
height target is reached immediately and a default closing Panel unmounts
without waiting for a transition.

Covers: UC-002, UC-004, UC-005, UC-015, UC-016, UC-019

```tsx
import * as React from 'react'
import { Rails } from '@powercoach/ui'

export function PanelMountingControls() {
  const [value, setValue] = React.useState<string[]>(['programs'])
  const [keepMounted, setKeepMounted] = React.useState(false)
  const [hiddenUntilFound, setHiddenUntilFound] = React.useState(false)
  const [keepProgramsMounted, setKeepProgramsMounted] = React.useState(false)
  const [mounted, setMounted] = React.useState<Record<string, boolean>>({})

  const setPanelMounted = React.useCallback((name: string, nextMounted: boolean) => {
    setMounted((current) => ({ ...current, [name]: nextMounted }))
  }, [])

  return (
    <div>
      <button type="button" onClick={() => setValue(['programs'])}>
        open programs
      </button>
      <button type="button" onClick={() => setValue(['athletes'])}>
        open athletes
      </button>
      <button type="button" onClick={() => setValue([])}>
        collapse all
      </button>

      <label>
        <input
          type="checkbox"
          checked={keepMounted}
          onChange={(event) => setKeepMounted(event.currentTarget.checked)}
        />
        keep all Panels mounted
      </label>
      <label>
        <input
          type="checkbox"
          checked={keepProgramsMounted}
          onChange={(event) => setKeepProgramsMounted(event.currentTarget.checked)}
        />
        keep Programs mounted
      </label>
      <label>
        <input
          type="checkbox"
          checked={hiddenUntilFound}
          onChange={(event) => setHiddenUntilFound(event.currentTarget.checked)}
        />
        make closed Panels findable
      </label>

      <output>Programs mounted: {mounted.programs ? 'yes' : 'no'}</output>
      <output>Athletes mounted: {mounted.athletes ? 'yes' : 'no'}</output>

      <div className="h-100 w-100">
        <Rails.Root
          orientation="horizontal"
          value={value}
          onValueChange={setValue}
          keepMounted={keepMounted}
          hiddenUntilFound={hiddenUntilFound}
        >
          <Rails.List>
            <Rails.Item value="programs">
              <Rails.Header>
                <Rails.Rail>Programs</Rails.Rail>
              </Rails.Header>
              <Rails.Panel keepMounted={keepProgramsMounted}>
                <PanelMountProbe name="programs" onMountedChange={setPanelMounted}>
                  Programs findable content
                </PanelMountProbe>
              </Rails.Panel>
            </Rails.Item>

            <Rails.Item value="athletes">
              <Rails.Header>
                <Rails.Rail>Athletes</Rails.Rail>
              </Rails.Header>
              <Rails.Panel>
                <PanelMountProbe name="athletes" onMountedChange={setPanelMounted}>
                  Athletes unique findable content
                </PanelMountProbe>
              </Rails.Panel>
            </Rails.Item>
          </Rails.List>
        </Rails.Root>
      </div>
    </div>
  )
}

function PanelMountProbe({
  name,
  onMountedChange,
  children
}: {
  name: string
  onMountedChange: (name: string, mounted: boolean) => void
  children: React.ReactNode
}) {
  React.useEffect(() => {
    onMountedChange(name, true)
    return () => onMountedChange(name, false)
  }, [name, onMountedChange])

  return <div className="p-4">{children}</div>
}
```

### EX-009 - Horizontal Rails

Context: A consumer needs the horizontal equivalent of the default vertical
Rails with controlled activation, unequal Rail heights, and an inspectable
border wider than the default.

Expected behavior: Rails reports horizontal orientation. The List uses the
definite `h-100` container height and block-end layout. Each Rail spans the
available width, uses an unrotated one-line title aligned left and vertically
centered, and reveals top to bottom with scale `1.2`. Training uses `h-14` while
the other Rails use the default `h-10`. The active Panel occupies the available
height after every Header is measured and clips its final-layout content while
height transitions with `cubic-bezier(0.22, 1, 0.36, 1)`. Every following Item
keeps a static negative block-start margin equal to the uniform Rail border
width, and every Rail keeps its complete border-box geometry. During the final
border-width portion of a Panel closing, the following Rail's block-start
border progressively overlaps the preceding Rail's block-end border. At zero
Panel height, the two retained borders occupy the same pixels and read as one
shared border. Neighboring Rails move continuously on the block axis without
changing height.
Collapsing all moves the Rail stack to the bottom; opening Programs reveals its
Panel downward from the Programs Header.

Covers: UC-001, UC-002, UC-003, UC-004, UC-005, UC-007, UC-011, UC-012,
UC-013, UC-014, UC-017

```tsx
import * as React from 'react'
import { Rails } from '@powercoach/ui'

export function HorizontalRails() {
  const [value, setValue] = React.useState<string[]>(['training'])

  return (
    <div>
      <button type="button" onClick={() => setValue([])}>
        collapse all
      </button>
      <button type="button" onClick={() => setValue(['programs'])}>
        open programs
      </button>
      <output>Active Rail: {value[0] ?? 'none'}</output>

      <div className="h-100 w-100">
        <Rails.Root orientation="horizontal" value={value} onValueChange={setValue}>
          <Rails.List className="[--rails-border-width:3px]">
            <Rails.Item value="overview">
              <Rails.Header>
                <Rails.Rail>Overview</Rails.Rail>
              </Rails.Header>
              <Rails.Panel>
                <div className="p-4">Overview content keeps its final layout</div>
              </Rails.Panel>
            </Rails.Item>

            <Rails.Item value="training">
              <Rails.Header>
                <Rails.Rail className="h-14">Training</Rails.Rail>
              </Rails.Header>
              <Rails.Panel>
                <div className="p-4">Training content keeps its final layout</div>
              </Rails.Panel>
            </Rails.Item>

            <Rails.Item value="programs">
              <Rails.Header>
                <Rails.Rail>Programs</Rails.Rail>
              </Rails.Header>
              <Rails.Panel>
                <div className="p-4">Programs content keeps its final layout</div>
              </Rails.Panel>
            </Rails.Item>
          </Rails.List>
        </Rails.Root>
      </div>
    </div>
  )
}
```

### EX-010 - Horizontal Rails at the collapsed-border allowance

Context: A consumer needs to inspect horizontal Rails when stable Header
heights equal the complete definite container height before the List's static
border-collapse offsets are applied.

Expected behavior: The three default `h-10` Rails equal the `h-30` container
height. The two following Items each contribute the default `-1px` block-start
margin, so Overview remains active with a measured `2px` open Panel height. The
Panel exposes that collapsed-border allowance while every Rail remains fully
visible without Panel-created overflow.

Covers: UC-017, UC-018

```tsx
import { Rails } from '@powercoach/ui'

export function ConstrainedHorizontalRails() {
  return (
    <div>
      <output>Expected open Panel height: 2px</output>
      <div className="h-30 w-100">
        <Rails.Root orientation="horizontal" defaultValue={['overview']}>
          <Rails.List>
            <Rails.Item value="overview">
              <Rails.Header>
                <Rails.Rail>Overview</Rails.Rail>
              </Rails.Header>
              <Rails.Panel>
                <div className="p-4">This content is clipped from view</div>
              </Rails.Panel>
            </Rails.Item>
            <Rails.Item value="training">
              <Rails.Header>
                <Rails.Rail>Training</Rails.Rail>
              </Rails.Header>
              <Rails.Panel>Training content</Rails.Panel>
            </Rails.Item>
            <Rails.Item value="nutrition">
              <Rails.Header>
                <Rails.Rail>Nutrition</Rails.Rail>
              </Rails.Header>
              <Rails.Panel>Nutrition content</Rails.Panel>
            </Rails.Item>
          </Rails.List>
        </Rails.Root>
      </div>
    </div>
  )
}
```

## Root

### Props

| Prop               | Type                                                                                             | Default    | Description                                                                                                                                                            |
| ------------------ | ------------------------------------------------------------------------------------------------ | ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `orientation`      | `RailsOrientation`                                                                               | `vertical` | Selects the Rail presentation. Vertical uses vertical Rails and width-based Panels. Horizontal uses horizontal Rails and height-based Panels.                          |
| `defaultValue`     | `Rails.Root.Value<TValue>`                                                                       | `[]`       | Uncontrolled value array for the initially expanded item. The array may contain zero or one item value. Use `value` for a controlled Rails.                            |
| `value`            | `Rails.Root.Value<TValue>`                                                                       | None       | Controlled value array for the expanded item. The array may contain zero or one item value. An empty array is the all-collapsed state.                                 |
| `onValueChange`    | `(value: Rails.Root.Value<TValue>, eventDetails: Rails.Root.ChangeEventDetails) => void`         | None       | Called when an enabled Rail requests a new active item. The value argument follows Base UI Accordion array semantics.                                                  |
| `disabled`         | `boolean`                                                                                        | `false`    | Whether every Rails item should ignore user interaction according to Base UI Accordion disabled behavior.                                                              |
| `keepMounted`      | `boolean`                                                                                        | `false`    | Whether closed Panels remain in the DOM, following Base UI Accordion mounting behavior. A Panel may override this value.                                               |
| `hiddenUntilFound` | `boolean`                                                                                        | `false`    | Whether closed Panels remain in the DOM with `hidden="until-found"` so browser find-in-page can reveal them. Overrides `keepMounted`. A Panel may override this value. |
| `className`        | `string \| ((state: Rails.Root.State<TValue>) => string \| undefined)`                           | None       | CSS class applied to the Root element, or a function that returns a class based on state.                                                                              |
| `style`            | `React.CSSProperties \| ((state: Rails.Root.State<TValue>) => React.CSSProperties \| undefined)` | None       | Style applied to the Root element, or a function that returns a style object based on state.                                                                           |
| `render`           | `ReactElement \| ((props: HTMLProps, state: Rails.Root.State<TValue>) => ReactElement)`          | None       | Allows replacing the Root element or composing it with another component according to Base UI render override behavior.                                                |

Rails does not expose a `multiple` prop.

`orientation` is Rails-owned. `RailsRootProps` omits the deprecated Base UI
Accordion `orientation` prop and redeclares it with Rails presentation
semantics. The deprecated Base UI value is private adapter metadata and does
not pass through Rails public props, state, render callbacks, or DOM metadata
unchanged.

```ts
type RailsOrientation = 'vertical' | 'horizontal'

type RailsRootValue<TValue = any> = TValue[]
```

`RailsOrientation` is exported through the package entry point. Root, Item,
Header, Rail, and Panel public state types replace the inherited deprecated
Base UI orientation field with `orientation: RailsOrientation`. Every
function-valued `className`, `style`, and `render` prop on those parts receives
the Rails orientation. List remains stateless.

### Events

`onValueChange` is the Root change callback. Its `eventDetails` argument follows
Base UI Accordion `Root.ChangeEventDetails`, including `reason`, `event`,
`cancel`, `allowPropagation`, `isCanceled`, `isPropagationAllowed`, and
`trigger`.

### Data Attributes

| Attribute                       | Description                                                                                           |
| ------------------------------- | ----------------------------------------------------------------------------------------------------- |
| `data-orientation="vertical"`   | Indicates the vertical Rail presentation. Present when `orientation` is omitted or set to `vertical`. |
| `data-orientation="horizontal"` | Indicates the horizontal Rail presentation. Present when `orientation="horizontal"`.                  |
| `data-disabled`                 | Present when the Root is disabled.                                                                    |

`data-orientation` is Rails-owned and cannot be overridden by a consumer. It
reports Rail presentation rather than the deprecated Base UI Panel-axis
meaning.

### CSS Variables

Root defines no public CSS variables.

## List

### Props

| Prop               | Type                                    | Default | Description                                                                                |
| ------------------ | --------------------------------------- | ------- | ------------------------------------------------------------------------------------------ |
| `className`        | `string`                                | None    | CSS class applied to the List element.                                                     |
| `style`            | `React.CSSProperties`                   | None    | Style applied to the List element.                                                         |
| native `div` props | `React.ComponentPropsWithoutRef<"div">` | None    | Native attributes, events, `aria-*`, `data-*`, and `ref` pass through to the List element. |

### Events

List defines no custom events. Native events may be passed through the rendered
List element.

### Data Attributes

| Attribute         | Description                     |
| ----------------- | ------------------------------- |
| `data-rails-list` | Marks the Powercoach List part. |

### CSS Variables

List owns the uniform border input inherited by every real and overlay Rail
surface.

| Variable               | Default | Description                                                                                                                                                                           |
| ---------------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--rails-border-width` | `1px`   | Uniform Rail border width used for the static Item overlap and coincident shared Rail jointure. Accepts a non-negative absolute CSS length smaller than the rendered Rail dimensions. |

The variable is set once on List. A local border width or
`--rails-border-width` override on one Rail, a positive List gap, CSS reordering,
or incompatible Rail heights leaves the guaranteed jointure contract.

## Item

### Props

| Prop           | Type                                                                                             | Default | Description                                                                                                             |
| -------------- | ------------------------------------------------------------------------------------------------ | ------- | ----------------------------------------------------------------------------------------------------------------------- |
| `value`        | `TValue`                                                                                         | None    | Unique value that identifies this item for Root `value` and `defaultValue`.                                             |
| `onOpenChange` | `(open: boolean, eventDetails: Rails.Item.ChangeEventDetails) => void`                           | None    | Called when this item opens or closes according to Base UI Accordion item behavior.                                     |
| `disabled`     | `boolean`                                                                                        | `false` | Whether this item should ignore user interaction according to Base UI Accordion disabled behavior.                      |
| `className`    | `string \| ((state: Rails.Item.State<TValue>) => string \| undefined)`                           | None    | CSS class applied to the Item element, or a function that returns a class based on state.                               |
| `style`        | `React.CSSProperties \| ((state: Rails.Item.State<TValue>) => React.CSSProperties \| undefined)` | None    | Style applied to the Item element, or a function that returns a style object based on state.                            |
| `render`       | `ReactElement \| ((props: HTMLProps, state: Rails.Item.State<TValue>) => ReactElement)`          | None    | Allows replacing the Item element or composing it with another component according to Base UI render override behavior. |

Item owns identity and disabled state. Rail does not expose `value` or
`disabled`.

### Events

`onOpenChange` is the Item change callback. Its `eventDetails` argument follows
Base UI Accordion `Item.ChangeEventDetails`, including `reason`, `event`,
`cancel`, `allowPropagation`, `isCanceled`, `isPropagationAllowed`, and
`trigger`.

### Data Attributes

| Attribute       | Type     | Description                        |
| --------------- | -------- | ---------------------------------- |
| `data-open`     | -        | Present when the Item is open.     |
| `data-disabled` | -        | Present when the Item is disabled. |
| `data-index`    | `number` | Indicates the index of the Item.   |

### CSS Variables

Item defines no public CSS variables.

## Header

### Props

| Prop        | Type                                                                                               | Default | Description                                                                                                               |
| ----------- | -------------------------------------------------------------------------------------------------- | ------- | ------------------------------------------------------------------------------------------------------------------------- |
| `className` | `string \| ((state: Rails.Header.State<TValue>) => string \| undefined)`                           | None    | CSS class applied to the Header element, or a function that returns a class based on state.                               |
| `style`     | `React.CSSProperties \| ((state: Rails.Header.State<TValue>) => React.CSSProperties \| undefined)` | None    | Style applied to the Header element, or a function that returns a style object based on state.                            |
| `render`    | `ReactElement \| ((props: HTMLProps, state: Rails.Header.State<TValue>) => ReactElement)`          | None    | Allows replacing the Header element or composing it with another component according to Base UI render override behavior. |

### Events

Header defines no custom events. Native events may be passed through the
rendered Header element.

### Data Attributes

| Attribute       | Type     | Description                        |
| --------------- | -------- | ---------------------------------- |
| `data-open`     | -        | Present when the Item is open.     |
| `data-disabled` | -        | Present when the Item is disabled. |
| `data-index`    | `number` | Indicates the index of the Item.   |

### CSS Variables

Header defines no public CSS variables.

## Rail

### Props

| Prop           | Type                                                                                             | Default | Description                                                                                                                                                                   |
| -------------- | ------------------------------------------------------------------------------------------------ | ------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `nativeButton` | `boolean`                                                                                        | `true`  | Whether the Rail renders a native `button` element when replacing it through `render`, following Base UI Accordion Trigger behavior.                                          |
| `className`    | `string \| ((state: Rails.Rail.State<TValue>) => string \| undefined)`                           | None    | CSS class applied to the Rail surface, or a function that returns a class based on state. May override the vertical default `w-10` width or horizontal default `h-10` height. |
| `style`        | `React.CSSProperties \| ((state: Rails.Rail.State<TValue>) => React.CSSProperties \| undefined)` | None    | Style applied to the Rail surface, or a function that returns a style object based on state.                                                                                  |
| `render`       | `ReactElement \| ((props: HTMLProps, state: Rails.Rail.State<TValue>) => ReactElement)`          | None    | Allows replacing the Rail surface or composing it with another component according to Base UI render override behavior.                                                       |

Rail does not expose `value` or `disabled`; those props belong to Item.

### Events

Rail defines no custom events. Native events and Base UI Accordion Trigger
event behavior pass through Rail.

### Data Attributes

| Attribute         | Description                                   |
| ----------------- | --------------------------------------------- |
| `data-panel-open` | Present when the associated Panel is open.    |
| `data-disabled`   | Present when the associated Item is disabled. |

### CSS Variables

Rail defines no Rails-specific CSS variables. Its real and overlay surfaces
inherit `--rails-border-width` from List and preserve RevealAnimation's public
CSS variables.

## Panel

### Props

| Prop               | Type                                                                                              | Default       | Description                                                                                                                                                          |
| ------------------ | ------------------------------------------------------------------------------------------------- | ------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `keepMounted`      | `boolean`                                                                                         | Inherits Root | Whether the closed Panel remains in the DOM. When omitted, inherits `Rails.Root` and therefore resolves to `false` by default.                                       |
| `hiddenUntilFound` | `boolean`                                                                                         | Inherits Root | Whether the closed Panel remains in the DOM with `hidden="until-found"` so browser find-in-page can reveal it. Overrides `keepMounted`; when omitted, inherits Root. |
| `className`        | `string \| ((state: Rails.Panel.State<TValue>) => string \| undefined)`                           | None          | CSS class applied to the Panel element, or a function that returns a class based on state.                                                                           |
| `style`            | `React.CSSProperties \| ((state: Rails.Panel.State<TValue>) => React.CSSProperties \| undefined)` | None          | Style applied to the Panel element, or a function that returns a style object based on state.                                                                        |
| `render`           | `ReactElement \| ((props: HTMLProps, state: Rails.Panel.State<TValue>) => ReactElement)`          | None          | Allows replacing the Panel element or composing it with another component according to Base UI render override behavior.                                             |

### Events

Panel defines no custom events. Native events may be passed through the rendered
Panel element.

### Data Attributes

| Attribute                       | Type     | Description                                   |
| ------------------------------- | -------- | --------------------------------------------- |
| `data-open`                     | -        | Present when the Panel is open.               |
| `data-orientation="vertical"`   | -        | Indicates the vertical Rail presentation.     |
| `data-orientation="horizontal"` | -        | Indicates the horizontal Rail presentation.   |
| `data-disabled`                 | -        | Present when the associated Item is disabled. |
| `data-index`                    | `number` | Indicates the index of the Item.              |
| `data-starting-style`           | -        | Present when the Panel is animating in.       |
| `data-ending-style`             | -        | Present when the Panel is animating out.      |

### CSS Variables

| Variable                   | Orientation | Description                                                                                          |
| -------------------------- | ----------- | ---------------------------------------------------------------------------------------------------- |
| `--rails-panel-width`      | Vertical    | Measured open width of the Panel on the inline axis.                                                 |
| `--accordion-panel-width`  | Vertical    | Base UI Accordion width variable preserved with the same measured width as `--rails-panel-width`.    |
| `--rails-panel-height`     | Horizontal  | Measured open height of the Panel on the block axis.                                                 |
| `--accordion-panel-height` | Horizontal  | Base UI Accordion height variable preserved with the same measured height as `--rails-panel-height`. |

The non-active-axis Base UI variable may still be emitted by Base UI, but it is
not part of Rails motion for that orientation.

## Accessibility

Rails follows Base UI Accordion accessibility semantics for Root, Item,
Header, Rail, and Panel where those parts align to Base UI Accordion.

Root owns Accordion state. Item owns item identity and disabled state. Header
labels the associated Panel. Rail owns Accordion Trigger role, accessible
name, keyboard interaction, activation, disabled state mapping, focus behavior,
render override behavior, and events. Panel owns the associated collapsible
content.

List is a layout part with no role.

`orientation` changes visual layout and Panel motion only. It does not add
orientation-dependent arrow-key behavior or change Base UI Accordion focus,
Trigger activation, or keyboard semantics. Rails privately maps vertical to
Base UI horizontal and horizontal to Base UI vertical by Panel motion axis,
then normalizes every public state callback and `data-orientation` value back
to the Rails presentation vocabulary.

Rails.Rail does not render Button and does not take Base UI Button
semantics. The real Rail surface is the only accessible, focusable, and
interactive Rail. RevealAnimation's overlay is decorative, inert, hidden from
assistive technology, and must not create a second Rail, link, accessible
name, focus target, or action.

When Rail uses `nativeButton={false}` with a rendered component such as a
React Router Link, that component must forward its ref and spread all received
props onto the underlying DOM element so Base UI Accordion Trigger props and
Rails chrome props land on the same semantic surface. This usage does
not make Button a navigation component.

## Behavior

Root fills the available width and height of its container by default. The
public examples wrap Root in a `w-100 h-100` container to make the default
geometry inspectable. Horizontal remaining-height geometry requires Root and
List to have a definite used block size; an automatic block size does not
provide a remaining-height target.

List is the direct Root child that contains participating Item children in DOM
and visual order and exposes `data-rails-list`. CSS reordering is outside the
documented Rails ordering contract. Vertical List follows the existing inline
flow. Horizontal List uses block flow aligned to the block end.

The Item and Header with `data-index="0"` identify the first Rail. Every later
participating Item receives one static negative orientation-start margin equal
to the uniform resolved Rail border width. The offset is independent of open,
closed, starting, and ending state. It lets the following Rail approach and
then overlap the preceding Rail during the final border-width portion of Panel
closing without changing either Rail's border box. Each Rail preserves
RevealAnimation's public `data-reveal-root`, `data-reveal-surface`, and
`data-reveal-overlay-surface` identification; the overlay is not another Rail.

Each Item contains a Header followed immediately by its associated Panel.
Header contains Rail. The Header and Panel order creates the visual flow of one
Rail followed by its associated Panel, then the next Rail followed by its
associated Panel. In vertical orientation, every Item and Header fills the
available block size. In horizontal orientation, every Item, Header, Rail, and
Panel spans the available inline size.

Rails owns presentation orientation. `orientation="vertical"` is the default
and preserves the revision 9 layout. `orientation="horizontal"` selects its
complete axis-transposed layout. Root, Item, Header, Rail, and Panel public
state expose the effective Rails orientation. Root and Panel expose the same
value through Rails-owned `data-orientation`.

Rails state follows Base UI Accordion array semantics. `value` and
`defaultValue` are arrays that may contain zero or one item value. An empty
array is the all-collapsed state. When no Panel is active, every Panel is
collapsed and no Rail is active. Vertical Rails stack to the right of List.
Horizontal Rails stack at the bottom of the definite List block size.

Rails is single-open. Activating an enabled inactive Rail replaces
the current value with that Rail's Item value. Activating the enabled active
Rail keeps the same value and does not close its Panel. Controlled consumers
may pass an empty value array to return to the all-collapsed state.
Changing a controlled value from an empty array to one item opens that item's
Panel with the same orientation-owned size transition as any other Panel
opening.

Root and Panel expose Base UI Accordion mounting controls. Root `keepMounted`
and `hiddenUntilFound` default to `false`. A Panel inherits each Root value when
the matching Panel prop is omitted and may override that value for its own
lifecycle.

With the default values, a closed idle Panel is absent from the DOM. A closing
Panel remains mounted with `data-ending-style` while its detectable
orientation-owned size transition runs, then unmounts after that transition
completes. Unmounting ends the Panel ref, DOM-local state, data attributes, and
CSS-variable lifetime. When the Panel opens again, it mounts with
`data-starting-style` and receives fresh measured width variables in vertical
orientation or fresh measured height variables in horizontal orientation.

When effective `keepMounted` is `true`, the closed Panel remains in the DOM.
When effective `hiddenUntilFound` is `true`, it overrides `keepMounted`, keeps
the closed Panel in the DOM with `hidden="until-found"`, and follows Base UI
Accordion browser find-in-page behavior to reveal matching Panel content.

Disabled Root or Item state follows Base UI Accordion disabled behavior. A
disabled Item does not activate from user interaction and passes disabled state
to Header, Rail, and Panel.

In vertical orientation, an open Panel occupies the available inline space
after the measured Header widths and signed Item inline-start margins are
removed. Because every following margin is negative, the measured Panel target
includes the static border-collapse allowance. Opening a Panel pushes
neighboring Rails along the inline axis. Closing a Panel attracts neighboring
Rails back toward it. Rails is LTR only in this revision; the Panel reveal reads
as right to left.

In horizontal orientation, the open Panel height is the definite List block
size minus the measured border-box heights of every Header and minus the signed
Item block-start margins, clamped to zero. Because every following margin is
negative, the measured Panel target includes the static border-collapse
allowance. Runtime measurement provides this target geometry while CSS remains
the animation engine. The open Panel exposes the measured value through
`--rails-panel-height` and preserves `--accordion-panel-height` with the same
value. Its top edge remains anchored immediately after its Header while its
opposite edge opens downward. Opening pushes following Rails on the block axis;
closing attracts them toward the Panel. When the effective Header footprint,
including the signed Item margins, consumes or exceeds the available List block
size, the Panel height is zero and no Panel content is visible.

Panel width is the vertical mask and Panel height is the horizontal mask. Panel
content keeps its final measured layout on the active motion axis while the
Panel size animates. The animated size must not temporarily re-constrain the
content, progressively reflow text, fade content, scale content, or slide
content. Content is simply clipped and revealed by Panel size.

Rail uses the shared Button chrome default variant for foreground border,
background, foreground text, muted disabled treatment, focus-visible outline,
square geometry, and color transition. Rail owns rail-specific dimensions,
orientation layout, and active-panel behavior. Vertical Rail fills the
available height, defaults to `w-10`, allows a className-overridden width, and
uses the existing rotated label. Horizontal Rail spans the available width,
defaults to `h-10`, allows a className-overridden unequal but stable height,
and keeps its title unrotated on one line.

Let `B` be the uniform resolved `--rails-border-width`. The first Item has no
Rails-owned start margin. Every following Item has a static orientation-start
margin of `-B`: `margin-inline-start` in vertical orientation and
`margin-block-start` in horizontal orientation. Each real and overlay Rail
surface keeps its complete border widths, padding, and border-box dimensions in
every state; Rails performs no state-driven border removal, padding
compensation, or zero-size ownership switch.

When a Panel is larger than `B`, the following Rail's start border supplies the
Panel-to-Rail boundary inside the final `B` of the preceding Item's occupied
range. As the rendered Panel size falls below `B`, that fixed start border
progressively overlaps the preceding Rail's orientation-end border. At Panel
size `0`, the two border strips occupy the same pixels. The later following
Item remains later in DOM order, but neither coincident border is removed or
transferred: the preceding Rail retains its orientation-end border and the
following Rail retains its orientation-start border. Together they read as one
border-width jointure. The decorative overlay preserves the same border-box
geometry and does not add a second opaque border. There is no discrete fusion
event and no extra synthetic jointure paint.

The static overlap applies equally during opening, closing, interruption, and
the Base UI starting and ending lifecycles. It keeps each Rail's dimensions and
title axes stable while its Item moves. Vertical jointure requires adjacent
Rails to share the same height. Horizontal jointure requires Rails to span the
same aligned width; unequal stable Rail heights remain supported. Positive
consumer gaps, CSS reordering, conflicting local border widths, incompatible
vertical heights, and misaligned horizontal widths are outside the guaranteed
jointure contract.

In vertical orientation, Rail text is aligned left before rotation. The visible
label is positioned on an inset top-edge axis inside the Rail so the visual top
spacing balances the left and right spacing, and is rotated 90 degrees with
transform origin at the left edge of the text on the horizontal axis and the
center of the text on the vertical axis. In horizontal orientation, the title
is unrotated, remains on one line, aligns left on an inset left-edge axis, and
is vertically centered.

Rail composes RevealAnimation around the semantic Accordion Trigger surface with
`direction="left-to-right"` in vertical orientation and
`direction="top-to-bottom"` in horizontal orientation. The active Rail passes
`reveal={true}` to RevealAnimation so it remains revealed. Enabled inactive
Rails reveal while hovered and return hidden when hover ends. Disabled Rails do
not reveal while hovered. The revealed title uses RevealAnimation's default
content scale of `1.2`, so it grows by 20 percent while only the decorative
revealed copy scales. Rail uses `alignX="start"` and `alignY="center"` for
RevealAnimation so the copied title shares the same orientation-owned inset
start axis and vertical center axis as the real title.

## Motion

Rails uses CSS transitions.

Vertical Panel motion uses width on the inline axis. The open Panel width is
`--rails-panel-width`, and `--accordion-panel-width` is preserved with the same
measured value. Horizontal Panel motion uses height on the block axis. The open
Panel height is `--rails-panel-height`, and `--accordion-panel-height` is
preserved with the same measured value. The closed Panel size is `0` on the
active motion axis. `data-starting-style` and `data-ending-style` correspond to
that zero-size state for opening and closing transitions. Opening and closing
size transitions use `cubic-bezier(0.22, 1, 0.36, 1)` easing, matching the Tabs
Indicator easing.

The default mounting lifecycle preserves the rendered Panel through its
closing transition. After the transition completes, the closed Panel unmounts.
On a later opening, the remounted Panel starts from size `0` under
`data-starting-style` and transitions to its freshly measured open width or
height. Keeping a Panel mounted does not change its documented size states or
transition. If the target changes before completion, the CSS transition
continues from the current visual size toward the new target.

During vertical opening, the Panel begins with no visible width. Its anchor edge
remains fixed next to its Header, and the opposite edge moves away to reveal
content laterally. During horizontal opening, the Panel begins with no visible
height. Its top edge remains fixed after its Header, and the bottom edge moves
downward to reveal content vertically. Closing reverses the orientation-owned
movement until size returns to `0`. During the final `B` of either closing
motion, the static negative Item margin makes the following Rail progressively
overlap the preceding Rail; their orientation-owned borders coincide when the
Panel reaches `0`. The same geometry runs in reverse during opening. The same
opening transition applies when the previous state had zero active Panels and
the next state has one active Panel.

Panel content does not fade, scale, or slide. Neighboring elements move only on
the active motion axis unless the surrounding layout forces wrapping. During
Panel opening and closing, neighboring Rails move continuously on that axis and
must not jump before returning to their expected position.

Under reduced motion, Panel width or height reaches each requested target
immediately with no CSS transition. A default closing Panel may therefore
unmount immediately after reaching size `0`. RevealAnimation preserves its own
documented reduced-motion lifecycle independently of Panel motion.

## Use Cases

### UC-001 - Select a Base UI-aligned Rails orientation

Given a consumer renders Rails parts in the documented anatomy
When `orientation` is omitted or set to `vertical` or `horizontal`
Then Rails preserves Base UI Accordion semantics, defaults to the vertical Rail
presentation, and exposes the effective Rails orientation through every
stateful part state and Root and Panel `data-orientation`

### UC-002 - Allow the all-collapsed state

Given Rails receives an empty `value` or `defaultValue` array
When Rails is displayed
Then every Panel is collapsed and no Rail is active

### UC-003 - Keep single-open activation

Given Rails has enabled items
When a user activates an inactive Rail
Then that Rail's Item becomes the only active value

### UC-004 - Preserve the orientation-owned Rail layout

Given a vertical or horizontal Panel opens or closes
When Rails lays out its Items
Then the open Panel occupies the available space on its motion axis after
Headers and signed Item start margins are removed, and neighboring Rails move
on that axis

### UC-005 - Reveal Panel content by orientation-owned clipping

Given a vertical or horizontal Panel is opening or closing
When its width or height transition runs
Then the Panel content keeps its final layout on the active motion axis and is
revealed or hidden by clipping while the Panel size uses
`cubic-bezier(0.22, 1, 0.36, 1)` easing

### UC-007 - Render Rail with Button chrome and reveal behavior

Given Rails renders a Rail
When the Rail is active, enabled inactive, or disabled
Then the Rail preserves Accordion Trigger semantics, uses Button default
chrome, stays revealed while active, reveals while hovered when enabled and
inactive, does not reveal while disabled, and uses RevealAnimation left to
right for vertical Rails or top to bottom for horizontal Rails

### UC-008 - Disable an item through Item state

Given a consumer renders `Rails.Item` with `disabled` and retains its associated
Panel with `keepMounted`
When the disabled Rail is displayed or activated
Then disabled state is exposed on the Item, Header, Rail, and Panel, and the
disabled Rail does not activate its Panel

### UC-009 - Render a Link Rail without Button navigation

Given a consumer renders Rail with `nativeButton={false}` and a React Router
Link through `render`
When the Link forwards its ref and spreads received props
Then Accordion Trigger semantics and Rails chrome props land on the Link
surface while Button remains action-only

### UC-011 - Fuse adjacent Rail borders

Given a gapless List uses one uniform supported Rail border width and two Rails
are adjacent because the preceding Panel has zero visible motion size
When Rails renders the adjacent Rail surfaces
Then every Rail keeps its complete border-box geometry, the following Item keeps
a static orientation-start margin equal to the negative uniform border width,
and at zero preceding Panel size the retained following Rail start border and
preceding Rail end border occupy the same pixels and read as one border-width
jointure without a pixel gap or extra synthetic paint

### UC-012 - Align and scale revealed Rail titles

Given an enabled `Rails.Rail` reveals
When the revealed title is visible
Then the source title and revealed title share the vertical inset top-edge axis
or horizontal inset left-edge axis and the same vertical center axis, and the
revealed title scales with RevealAnimation's default scale of `1.2`

### UC-013 - Keep Rail movement continuous during Panel motion

Given a Panel starts opening or closing
When neighboring Rails move in response to the Panel size transition
Then each neighboring Rail moves continuously on the orientation-owned axis
without jumping or changing its border-box dimensions before returning to its
expected position, including while the static Item overlap converges or
separates the Rail borders

### UC-014 - Animate from all-collapsed to one active Panel

Given controlled Rails has no active Panel
When the external `open programs` button or Programs Rail changes the value
from empty to `programs`
Then the Programs Panel opens from size `0` to its measured open width or
height, clips content on the orientation-owned axis, and moves neighboring
Rails continuously on that axis without jumps

### UC-015 - Unmount a closed Panel by default

Given a Panel resolves `keepMounted` and `hiddenUntilFound` to `false`
When the Panel closes
Then it remains mounted with `data-ending-style` through its closing size
transition, unmounts after completion, ends its ref, DOM-local state,
attributes, and CSS-variable lifetime, and remounts with `data-starting-style`
and fresh measured orientation-owned variables when it opens again

### UC-016 - Choose retained Panel mounting

Given a consumer configures `keepMounted` or `hiddenUntilFound` on Root or Panel
When a Panel is closed
Then Panel values override inherited Root values, effective `keepMounted=true`
retains the closed Panel, and effective `hiddenUntilFound=true` overrides
`keepMounted`, retains the Panel with `hidden="until-found"`, and lets browser
find-in-page reveal matching content

### UC-017 - Render the complete horizontal transposition

Given Rails has `orientation="horizontal"` inside a container with a definite
used block size
When a Panel is active, closes, or opens from the all-collapsed state
Then every Rail spans the available width, defaults to `h-10`, keeps an
unrotated one-line left-aligned and vertically centered title, may use a stable
consumer-overridden height, stacks at the block end when all Panels are closed,
and reveals the active Panel downward from its Header to the remaining measured
height

### UC-018 - Include the collapsed-border allowance in constrained height

Given gapless horizontal Rails uses `N` Items with uniform border width `B` and
the Header border-box heights equal the complete definite List block size
When an Item remains active
Then its measured open Panel height is `(N - 1) * B`, matching the magnitude of
the following Items' negative block-start margins, and the Rails remain fully
visible without Panel-created overflow

### UC-019 - Reach Panel targets under reduced motion

Given reduced motion is active and a vertical or horizontal Panel target
changes
When Rails updates the Panel
Then the Panel reaches its requested width or height immediately without a CSS
transition, and a default closing Panel may unmount after reaching size `0`
