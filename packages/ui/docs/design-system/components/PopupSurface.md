---
revision: 3
date: 2026-08-10
---

# PopupSurface

## Overview

PopupSurface provides the semantic-free popup chrome, grouped layout, group
label, and row presentation shared by Powercoach popup families. It is a
non-callable namespace with four public parts: Root, Group, GroupLabel, and
Item.

Root supplies the square border, background, foreground, size-derived hard
shadow, and CSS opening and closing transition. Group supplies neutral grouped
layout. GroupLabel supplies only a presentation-agnostic composition surface.
Item supplies the matching Icon plus Text geometry and the default scale-1
RevealAnimation presentation.

PopupSurface does not own popup positioning, visibility state, roles, ARIA,
selection, highlighting, navigation, activation, focus management, item
registration, or keyboard behavior. A semantic owner composes its props and ref
onto the same final Root, Group, GroupLabel, or Item element through render
composition.

Autocomplete consumes PopupSurface at xs, md, and xl. AvatarMenu consumes the
same Root, Group, GroupLabel, and Item at md. Their group, label, option, and
link semantics remain owned by Base UI or AvatarMenu rather than PopupSurface.

PopupSurface uses the CSS animation engine. Root uses CSS scale, opacity, width,
and height transitions. Item composes the existing CSS RevealAnimation family.

## Anatomy

PopupSurface exposes four public parts.

- PopupSurface.Root: renders the semantic-free popup box and shared lifecycle
  transition on the final owner element.
- PopupSurface.Group: renders neutral full-width grouped layout on the final
  owner element.
- PopupSurface.GroupLabel: renders one presentation-agnostic group-label
  composition surface on the final owner element.
- PopupSurface.Item: renders one semantic-free row presentation with optional
  decorative Icon, Text, and RevealAnimation.

All four parts render a div when used directly. A render element replaces that
default and receives the complete PopupSurface presentation, native props,
children, and ref.

```tsx
<PopupSurface.Root size="md">
  <PopupSurface.Group>
    <PopupSurface.GroupLabel>Strength</PopupSurface.GroupLabel>
    <PopupSurface.Item size="md" icon={<Dumbbell />}>
      Deadlift
    </PopupSurface.Item>
  </PopupSurface.Group>
</PopupSurface.Root>
```

### Public Exports

| Export                               | Description                                            |
| ------------------------------------ | ------------------------------------------------------ |
| PopupSurface                         | Non-callable namespace containing all four parts.      |
| PopupSurfaceNamespace                | Type of the public namespace object.                   |
| PopupSurfaceRoot                     | Direct Root component export.                          |
| PopupSurfaceRootProps                | Direct Root props alias.                               |
| PopupSurfaceRootState                | Effective Root size state.                             |
| PopupSurfaceGroup                    | Direct Group component export.                         |
| PopupSurfaceGroupProps               | Direct Group props alias.                              |
| PopupSurfaceGroupState               | Empty semantic-free Group presentation state.          |
| PopupSurfaceGroupLabel               | Direct GroupLabel component export.                    |
| PopupSurfaceGroupLabelProps          | Direct GroupLabel props alias.                         |
| PopupSurfaceGroupLabelState          | Empty semantic-free GroupLabel state.                  |
| PopupSurfaceItem                     | Direct Item component export.                          |
| PopupSurfaceItemProps                | Direct Item props alias.                               |
| PopupSurfaceItemState                | Effective Item presentation state.                     |
| PopupSurfaceSize                     | Alias of the package FieldSize union xs, md, and xl.   |
| PopupSurfaceItemIcon                 | Required ReactElement shape accepted by the Icon slot. |
| PopupSurfaceItemIconPosition         | Logical start or end Icon position.                    |
| PopupSurfaceItemContentInset         | Base, start, or end logical content inset.             |
| PopupSurfaceItemRevealAnimationProps | Bounded RevealAnimation props accepted by Item.        |

## Examples

### EX-001 - Complete shared size scale

Context: A consumer needs to inspect the exact Item rows and neutral grouped
composition shared with Autocomplete at xs, md, and xl.

Expected behavior: Each Root displays square background and foreground chrome
with the matching hard shadow. Each Group adds no accumulated padding or gap.
Each GroupLabel remains one generic presentation-agnostic element. Each Item
composes Text, a decorative logical-start Icon, the matching generic row
metrics, and default scale-1 RevealAnimation. The start inset includes the
complete size-derived Icon column.

Covers: UC-001, UC-002, UC-003, UC-004, UC-005, UC-008, UC-013

```tsx
import { Dumbbell } from 'lucide-react'
import { PopupSurface } from '@powercoach/ui'

export function PopupSurfaceSizes() {
  return (
    <div className="grid gap-4">
      {(['xs', 'md', 'xl'] as const).map((size) => (
        <PopupSurface.Root key={size} size={size}>
          <PopupSurface.Group>
            <PopupSurface.GroupLabel>Strength</PopupSurface.GroupLabel>
            <PopupSurface.Item size={size} icon={<Dumbbell />}>
              Deadlift
            </PopupSurface.Item>
            <PopupSurface.Item size={size} icon={<Dumbbell />}>
              Front squat
            </PopupSurface.Item>
          </PopupSurface.Group>
        </PopupSurface.Root>
      ))}
    </div>
  )
}
```

### EX-002 - Logical Icon and content positions

Context: A consumer needs row text aligned with an external logical-start or
logical-end rail.

Expected behavior: The first row reserves the md logical-start Icon column. The
second reserves the md logical-end Icon column. The third has no Icon but still
reserves the logical-start column through contentInset. Direction changes keep
start and end logical rather than physical.

Covers: UC-004, UC-005, UC-008

```tsx
import { Search, UserRound } from 'lucide-react'
import { PopupSurface } from '@powercoach/ui'

export function PopupSurfaceLogicalGeometry() {
  return (
    <PopupSurface.Root size="md" dir="rtl">
      <PopupSurface.Item size="md" icon={<Search />} iconPosition="start">
        Search
      </PopupSurface.Item>
      <PopupSurface.Item size="md" icon={<UserRound />} iconPosition="end">
        Athlete
      </PopupSurface.Item>
      <PopupSurface.Item size="md" contentInset="start">
        Reserved start rail
      </PopupSurface.Item>
    </PopupSurface.Root>
  )
}
```

### EX-003 - Controlled and interaction-derived Link reveal

Context: A navigation surface needs one route to remain revealed while other
links reveal only on hover or keyboard focus.

Expected behavior: The active link receives controlled reveal true and remains
revealed. The other link omits reveal and derives reveal from pointer hover or
keyboard focus-visible. Pointer-created persistent DOM focus does not keep the
second link revealed after hover leaves. Each anchor remains the only semantic,
focusable, interactive link.

Covers: UC-001, UC-006, UC-007, UC-009, UC-010

```tsx
import { Home, Star } from 'lucide-react'
import { PopupSurface } from '@powercoach/ui'

export function PopupSurfaceLinks() {
  return (
    <PopupSurface.Root size="md" render={<nav aria-label="Athlete pages" />}>
      <PopupSurface.Item
        size="md"
        icon={<Home />}
        reveal
        render={<a href="home" aria-current="page" />}
      >
        Home
      </PopupSurface.Item>
      <PopupSurface.Item size="md" icon={<Star />} render={<a href="reviews" />}>
        Reviews
      </PopupSurface.Item>
    </PopupSurface.Root>
  )
}
```

### EX-004 - Immediate fallback and presentation overrides

Context: A consumer has mount-sensitive Item content and needs deliberate
surface colors.

Expected behavior: revealAnimationProps false renders the children and Icon
once, keeps the anchor as the only semantic element, and applies immediate
background and foreground inversion while reveal is true. The consumer colors
replace conflicting Item defaults while the shared md geometry remains.

Covers: UC-006, UC-007, UC-009, UC-011

```tsx
import { Settings } from 'lucide-react'
import { PopupSurface } from '@powercoach/ui'

export function StaticPopupSurfaceItem() {
  return (
    <PopupSurface.Root size="md" className="bg-accent text-accent-foreground">
      <PopupSurface.Item
        size="md"
        icon={<Settings />}
        reveal
        revealAnimationProps={false}
        className="bg-accent text-accent-foreground"
        render={<a href="settings" />}
      >
        Settings
      </PopupSurface.Item>
    </PopupSurface.Root>
  )
}
```

### EX-005 - Base UI Popup lifecycle composition

Context: A consumer-owned Base UI popup needs the shared Powercoach chrome and
opening lifecycle on its one semantic Popup element.

Expected behavior: Popover owns trigger, popup role, open state, positioning,
focus, lifecycle attributes, completion, and mounting. PopupSurface.Root
receives those props and ref on the same final element. Opening moves from
scale 0.9 and opacity 0 to rest over 350ms; closing uses 150ms ease. A reversed
request continues from current computed scale and opacity. Reduced motion
reaches the same endpoints immediately.

Covers: UC-001, UC-002, UC-003, UC-012

```tsx
import { Popover } from '@base-ui/react/popover'
import { Info } from 'lucide-react'
import { PopupSurface } from '@powercoach/ui'

export function SharedPopoverSurface() {
  return (
    <Popover.Root>
      <Popover.Trigger>Open details</Popover.Trigger>
      <Popover.Portal>
        <Popover.Positioner>
          <Popover.Popup render={<PopupSurface.Root size="md" />}>
            <PopupSurface.Item size="md" icon={<Info />}>
              Recovery details
            </PopupSurface.Item>
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  )
}
```

## Root

### Props

PopupSurfaceRootProps is based on the public Base UI useRender component-props
contract for a div with PopupSurfaceRootState.

```ts
type PopupSurfaceSize = FieldSize

type PopupSurfaceRootState = {
  size: PopupSurfaceSize
}
```

| Prop             | Type                                                               | Default  | Description                                                                                |
| ---------------- | ------------------------------------------------------------------ | -------- | ------------------------------------------------------------------------------------------ |
| size             | xs, md, or xl                                                      | Required | Selects the shared hard shadow and exposes the effective size.                             |
| children         | React.ReactNode                                                    | None     | Authoritative popup content.                                                               |
| className        | String or function receiving PopupSurfaceRootState                 | None     | Composes consumer classes after shared defaults on the final element.                      |
| style            | Object or function receiving PopupSurfaceRootState                 | None     | Merges consumer style last on the final element.                                           |
| render           | ReactElement or callback receiving props and PopupSurfaceRootState | div      | Replaces the default div and receives the complete presentation, children, and ref.        |
| native div props | Ref-capable div props                                              | None     | Native attributes, events, ARIA, consumer data attributes, children, and ref pass through. |

Root uses square box-border geometry, one foreground border, background fill,
foreground content, and shadow-(--hard-shadow). It does not impose an anchor
width, intrinsic width, minimum width, maximum width, height, overflow, popup
role, focus behavior, or positioning strategy.

| Size | Default --hard-shadow value                     |
| ---- | ----------------------------------------------- |
| xs   | 0.125rem 0.125rem 0 0 var(--color-foreground)   |
| md   | 0.1875rem 0.1875rem 0 0 var(--color-foreground) |
| xl   | 0.25rem 0.25rem 0 0 var(--color-foreground)     |

Root classes already present on a render element compose before the explicit
consumer className. Shared defaults resolve before both. Consumer className
passes through Tailwind conflict resolution last, and consumer style merges
last. Recognized conflicting border, background, foreground, shadow, scale,
opacity, width, height, transition, or transform-origin values replace the
shared default and become consumer-owned.

### Events

Root defines no custom events. Native handlers and events supplied by a
semantic owner pass through to the final element. PopupSurface does not request
open or close changes and does not emit a completion callback.

### Data Attributes

| Attribute               | Description                         |
| ----------------------- | ----------------------------------- |
| data-popup-surface-root | Identifies the shared Root element. |
| data-size="xs"          | Root uses xs treatment.             |
| data-size="md"          | Root uses md treatment.             |
| data-size="xl"          | Root uses xl treatment.             |

Consumer and semantic-owner data attributes remain on the same final element.
In particular, data-starting-style and data-ending-style may be supplied by a
Base UI popup owner and activate the Root lifecycle transition.

### CSS Variables

| Variable                        | Default                        | Description                                               |
| ------------------------------- | ------------------------------ | --------------------------------------------------------- |
| --hard-shadow                   | Size-specific                  | Complete shared foreground hard shadow.                   |
| --transform-origin              | Inherited                      | Collision-aware scale origin supplied by the popup owner. |
| --popup-surface-enter-duration  | 350ms                          | Scale and opacity entrance duration.                      |
| --popup-surface-enter-easing    | cubic-bezier(0.22, 1, 0.36, 1) | Scale and opacity entrance easing.                        |
| --popup-surface-exit-duration   | 150ms                          | Scale and opacity exit duration.                          |
| --popup-surface-exit-easing     | ease                           | Scale and opacity exit easing.                            |
| --popup-surface-layout-duration | 0ms                            | Width and height transition duration.                     |
| --popup-surface-layout-easing   | cubic-bezier(0.22, 1, 0.36, 1) | Width and height transition easing.                       |

The timing variables are public presentation inputs. A semantic popup owner may
override layout duration while retaining the shared entry and exit timings.

## Group

### Props

```ts
type PopupSurfaceGroupState = Record<string, never>
```

PopupSurfaceGroupProps is based on the public Base UI useRender component-props
contract for a div with PopupSurfaceGroupState.

| Prop             | Type                                                                | Default | Description                                                                                       |
| ---------------- | ------------------------------------------------------------------- | ------- | ------------------------------------------------------------------------------------------------- |
| children         | React.ReactNode                                                     | None    | Authoritative group-label and item content.                                                       |
| className        | String or function receiving PopupSurfaceGroupState                 | None    | Composes consumer classes after the neutral grouped-layout defaults on the final element.         |
| style            | Object or function receiving PopupSurfaceGroupState                 | None    | Merges consumer style last on the final element.                                                  |
| render           | ReactElement or callback receiving props and PopupSurfaceGroupState | div     | Replaces the default div and receives the complete presentation, children, native props, and ref. |
| native div props | Ref-capable div props                                               | None    | Native attributes, events, ARIA, consumer data attributes, children, and ref pass through.        |

Group uses the full available inline size and adds no inline padding, block
padding, or gap. GroupLabel and Item own their row-local geometry. Group owns no
registration, item collection, generated id, role, aria-labelledby, focus, or
interaction behavior.

### Events

Group defines no custom events. Native handlers and events supplied by a
semantic owner pass through to the final element.

### Data Attributes

| Attribute                | Description                               |
| ------------------------ | ----------------------------------------- |
| data-popup-surface-group | Identifies the shared Group presentation. |

Group preserves consumer and semantic-owner data attributes.

### CSS Variables

Group defines no public CSS variables.

## GroupLabel

### Props

```ts
type PopupSurfaceGroupLabelState = Record<string, never>
```

PopupSurfaceGroupLabelProps is based on the public Base UI useRender
component-props contract for a div with PopupSurfaceGroupLabelState.

| Prop             | Type                                                                     | Default | Description                                                                                       |
| ---------------- | ------------------------------------------------------------------------ | ------- | ------------------------------------------------------------------------------------------------- |
| children         | React.ReactNode                                                          | None    | Authoritative group-label content.                                                                |
| className        | String or function receiving PopupSurfaceGroupLabelState                 | None    | Composes consumer classes on the final element.                                                   |
| style            | Object or function receiving PopupSurfaceGroupLabelState                 | None    | Merges consumer style last on the final element.                                                  |
| render           | ReactElement or callback receiving props and PopupSurfaceGroupLabelState | div     | Replaces the default div and receives the complete presentation, children, native props, and ref. |
| native div props | Ref-capable div props                                                    | None    | Native attributes, events, ARIA, consumer data attributes, children, and ref pass through.        |

GroupLabel adds no typography, tone, case transformation, size, minimum height,
padding, inset, Icon slot, reveal, or interactive presentation. It generates no
id, role, association, registration, or state. The semantic owner supplies all
label meaning and presentation on the one final element.

### Events

GroupLabel defines no custom events. Native handlers and events supplied by a
semantic owner pass through to the final element. Render replacements remain
noninteractive and forward every owner prop and ref.

### Data Attributes

| Attribute                      | Description                                    |
| ------------------------------ | ---------------------------------------------- |
| data-popup-surface-group-label | Identifies the shared GroupLabel presentation. |

GroupLabel preserves consumer and semantic-owner data attributes.

### CSS Variables

GroupLabel defines no public CSS variables.

## Item

### Props

```ts
type PopupSurfaceItemIcon = React.ReactElement
type PopupSurfaceItemIconPosition = 'start' | 'end'
type PopupSurfaceItemContentInset = 'base' | 'start' | 'end'

type PopupSurfaceItemRevealAnimationProps = Omit<
  RevealAnimationProps,
  'children' | 'render' | 'reveal'
>

type PopupSurfaceItemState = {
  size: PopupSurfaceSize
  iconPosition: PopupSurfaceItemIconPosition
  contentInset: PopupSurfaceItemContentInset
  revealed: boolean
}
```

PopupSurfaceItemProps is based on the public Base UI useRender component-props
contract for a div with PopupSurfaceItemState.

| Prop                 | Type                                                               | Default                        | Description                                                                                             |
| -------------------- | ------------------------------------------------------------------ | ------------------------------ | ------------------------------------------------------------------------------------------------------- |
| size                 | xs, md, or xl                                                      | Required                       | Selects Text, row, inset, Icon-column, and SVG geometry.                                                |
| icon                 | PopupSurfaceItemIcon                                               | None                           | One decorative visual in the selected logical Icon slot.                                                |
| iconPosition         | start or end                                                       | start                          | Selects the logical side of a present Icon.                                                             |
| contentInset         | base, start, or end                                                | Icon side or base without Icon | Selects whether text reserves no Icon column or the complete logical-start or logical-end column.       |
| reveal               | boolean                                                            | None                           | Controls effective reveal when supplied; omission derives hover and keyboard focus-visible.             |
| revealAnimationProps | boolean or PopupSurfaceItemRevealAnimationProps                    | true                           | Uses scale-1 RevealAnimation, passes bounded overrides, or uses one immediate visual branch with false. |
| children             | React.ReactNode                                                    | None                           | Authoritative simple or complex row content.                                                            |
| className            | String or function receiving PopupSurfaceItemState                 | None                           | Resolves once and merges after shared defaults on semantic and duplicated visual branches.              |
| style                | Object or function receiving PopupSurfaceItemState                 | None                           | Merges last on the final semantic element and is not duplicated.                                        |
| render               | ReactElement or callback receiving props and PopupSurfaceItemState | div                            | Replaces the default div and receives the final props, children, and ref.                               |
| native div props     | Ref-capable div props                                              | None                           | Native attributes, events, ARIA, consumer data attributes, children, and ref pass through.              |

When reveal is a boolean, it is authoritative. Pointer hover and focus do not
change effective reveal. When reveal is omitted, pointer hover and keyboard
focus-visible derive effective reveal. Pointer-created DOM focus does not keep
Item revealed after hover leaves.

When revealAnimationProps is omitted or true, Item composes one persistent
RevealAnimation with scale 1. An object starts from scale 1 and may override
contentMode, direction, alignment, scale, offsets, and lifecycle callbacks.
PopupSurface retains render, children, and effective reveal.

RevealAnimation receives a semantic-free visual surface inside the one final
Item element. The final element remains the sole owner of roles, ARIA, state,
events, ref, render replacement, activation, and focus behavior. The Icon and
children pass unchanged through the real and decorative visual copies.

Children and Icon used with RevealAnimation must be deterministic,
noninteractive, and safe to render twice. Document-unique ids, effects,
registrations, form controls, portals, requests, single-owner refs, and other
mount-sensitive content require revealAnimationProps false.

When revealAnimationProps is false, Item renders no RevealAnimation or copied
visual branch. The one visual branch uses background and foreground at rest and
immediately inverts them while effective reveal is true.

The state-aware className is evaluated once. It remains on the final element and
is reused after Text, geometry, background, and foreground defaults on both
RevealAnimation visual copies. Consumer conflicts win independently on every
application through Tailwind conflict resolution. Repeated non-color effects
are consumer-owned. style remains on the final semantic element only.

### Size Treatments

| Size | Text size | Minimum height | Block padding | Inline child gap | Base inline inset | Icon column | Icon SVG    |
| ---- | --------- | -------------- | ------------- | ---------------- | ----------------- | ----------- | ----------- |
| xs   | xs        | min-h-6        | py-1          | gap-2            | spacing 2         | spacing 6   | spacing 3   |
| md   | sm        | min-h-8        | py-1.5        | gap-2.5          | spacing 2.5       | spacing 8   | spacing 3.5 |
| xl   | md        | min-h-9        | py-2          | gap-3            | spacing 3         | spacing 9   | spacing 4   |

Item centers content on the block axis. Ordinary single-line content finishes
at the matching generic minimum height. Complex content grows from that minimum.

contentInset base applies the base inset on both logical sides. start adds the
complete Icon-column width to the logical-start side. end adds it to the
logical-end side. A present Icon occupies the matching complete column and is
followed by the base text inset. Icon and text do not overlap.

The Icon is always aria-hidden, inert, pointer-inert, outside the focus order,
and normalized only for descendant SVG size. It cannot label, describe, focus,
activate, or register the Item.

### Events

Item defines no custom DOM events. Native and semantic-owner handlers pass
through to the final element. RevealAnimation lifecycle callbacks retain their
public meanings and report the effective reveal target.

### Data Attributes

| Attribute                      | Description                                  |
| ------------------------------ | -------------------------------------------- |
| data-popup-surface-item        | Identifies the shared Item element.          |
| data-size="xs" or "md" or "xl" | Effective shared size.                       |
| data-icon-position="start"     | Present Icon uses logical-start.             |
| data-icon-position="end"       | Present Icon uses logical-end.               |
| data-content-inset="base"      | Text uses base inline insets.                |
| data-content-inset="start"     | Text reserves the logical-start Icon column. |
| data-content-inset="end"       | Text reserves the logical-end Icon column.   |
| data-revealed                  | Effective reveal target is true.             |

Item preserves consumer and semantic-owner data attributes. When
RevealAnimation is enabled, its complete public data-motion and data-reveal
contract remains available inside Item.

### CSS Variables

Item defines no PopupSurface-specific CSS variables. RevealAnimation retains
its documented public variables on its owned descendants.

## Accessibility

PopupSurface is semantic-free. Root, Group, GroupLabel, and Item add no popup,
navigation, listbox, option, menu, link, button, selection, group, live-region,
label association, or focus semantics. The default div elements remain generic.
A render replacement or wrapping component owns the final semantics, generated
ids, registration, and accessible relationships.

The semantic owner must forward its complete props and ref through the
PopupSurface render composition. PopupSurface must not remove owner roles,
generated ids, ARIA, tab order, keyboard handlers, pointer handlers, state data
attributes, or focus management.

Item Icon is always decorative, aria-hidden, inert, pointer-inert, and
unfocusable. Visible Text or consumer children provide the accessible Item
content.

GroupLabel children pass through without receiving label semantics or
presentation. Direct PopupSurface Group and GroupLabel usage remains
unassociated unless a semantic owner supplies the relationship. GroupLabel
itself remains noninteractive.

With RevealAnimation enabled, only the final owner element is semantic,
focusable, and interactive. The copied visual branch remains hidden from
assistive technology, inert, unfocusable, and pointer-inert. With
revealAnimationProps false, no copied branch exists.

Reduced motion changes only timing. It does not change roles, ARIA, focus,
interaction, final visibility, or reveal state.

## Behavior

PopupSurface is not callable. Root, Group, GroupLabel, and Item may be used
directly or through a semantic owner. Direct use renders one div per part.
Render composition replaces that div rather than adding a wrapper.

Root resolves its hard shadow from size and keeps all lifecycle ownership
external. A Base UI popup composes Root onto the same element that receives
data-starting-style and data-ending-style, allowing Base UI to detect the final
CSS transitions and retain or unmount the subtree according to its own Portal
contract.

Root does not choose width. Autocomplete may apply exact anchor width on the
same element. AvatarMenu may apply measured popup width and height. A direct
consumer may use intrinsic or explicit geometry.

Group supplies only neutral full-width grouped layout. GroupLabel supplies only
one presentation-agnostic composition surface. Autocomplete composes them onto
its Base UI Group and GroupLabel elements, which retain registration, generated
ids, role, association, and consumer-specific presentation. AvatarMenu composes
them onto its own semantic Group and GroupLabel elements, which own role,
generated id, aria-labelledby, order, full-name meaning, and presentation.

Item resolves effective iconPosition to start by default. When contentInset is
omitted, it resolves it to the Icon side when an Icon is present and base
otherwise. An explicit contentInset remains authoritative even when no Icon is
present.

Item composes Text internally without changing semantics. Consumer children
remain authoritative and may contain their own Powercoach typography and
layout. The row grows for complex content instead of clipping it.

Controlled reveal is useful when a semantic owner already owns highlighted or
active state. Passing false remains controlled and prevents raw hover or focus
from revealing. Omission is the interaction-derived mode for ordinary links and
other focusable surfaces.

Class and style composition preserve the final owner element. Owner state
callbacks resolve before PopupSurface presentation is applied. Explicit
consumer className and style values merge last within their documented
boundaries. Semantic and safety-owned Icon values retain final precedence.

## Motion

PopupSurface uses the CSS animation engine.

Root rests at scale 1 and opacity 1. data-starting-style and
data-ending-style both select scale 0.9 and opacity 0. transform-origin uses
var(--transform-origin).

Entry transitions scale and opacity over
var(--popup-surface-enter-duration) with
var(--popup-surface-enter-easing). Exit overrides those properties with
var(--popup-surface-exit-duration) and var(--popup-surface-exit-easing).

Width and height transition over var(--popup-surface-layout-duration) with
var(--popup-surface-layout-easing). The default zero duration means Root does
not morph layout unless a semantic owner explicitly enables it through the
public variable.

CSS transitions reverse from current computed scale, opacity, width, and height
when lifecycle or geometry changes before completion. Root does not use
keyframes and does not reset to a previous endpoint.

Base UI popup owners detect transitions on the final composed Root element,
retain it through exit, emit their own completion callback, and then unmount or
keep the closed subtree according to their documented Portal behavior.

Item reveal motion is owned by RevealAnimation: scale-1 composition retains its
300ms clip-path transition, theme inversion, current-value interruption,
callbacks, and reduced-motion lifecycle. revealAnimationProps false changes
reveal presentation immediately without motion.

Group and GroupLabel add no motion. GroupLabel never composes RevealAnimation.

Under reduced motion, Root entry, exit, and layout durations become zero. The
same starting, resting, ending, and closed endpoints remain. RevealAnimation
independently reaches its Item target through its documented immediate
lifecycle.

## Use Cases

### UC-001 - Expose the semantic-free family

Given a consumer imports PopupSurface, a direct part, or a documented type from
@powercoach/ui
When the public surface is inspected
Then the non-callable Root, Group, GroupLabel, and Item namespace and prefixed
exports are available without adding popup, grouping, label, or item semantics

### UC-002 - Compose one final Root element

Given a semantic popup owner renders through PopupSurface.Root
When props, lifecycle attributes, children, and ref are composed
Then one final element receives both owner semantics and the shared Root
presentation without an additional semantic wrapper

### UC-003 - Apply shared Root chrome by size

Given Root receives xs, md, or xl
When it is displayed
Then it uses square foreground-border, background, foreground, and the matching
complete hard-shadow treatment while leaving width and positioning external

### UC-004 - Apply the shared row geometry

Given Item receives xs, md, or xl with simple or complex content
When it is displayed
Then Text, generic minimum height, block padding, inline gap, base inset, Icon
column, and SVG size use the documented mapping and complex content may grow

### UC-005 - Place a decorative Icon logically

Given Item receives an Icon, iconPosition, or explicit contentInset
When it is displayed in LTR or RTL
Then the complete decorative Icon column and text inset use the requested
logical side without overlap while base reserves no empty column

### UC-006 - Derive or control reveal

Given Item omits reveal or receives true or false
When pointer hover, keyboard focus-visible, or owner state changes
Then omission derives interaction reveal without pointer-focus persistence while
a boolean remains authoritative

### UC-007 - Select RevealAnimation or immediate presentation

Given Item omits revealAnimationProps, passes true, a bounded object, or false
When effective reveal changes
Then scale-1 or configured RevealAnimation displays the target or one
nonduplicated branch immediately inverts foreground and background

### UC-008 - Keep Icon decorative and Text semantic-neutral

Given Item renders Icon plus visible Text or consumer children
When accessibility is inspected
Then Icon remains hidden, inert, unfocusable, and pointer-inert while Text adds
no role and the owner element retains its accessible content

### UC-009 - Preserve one semantic Item element

Given an option, command, or link owner composes through PopupSurface.Item
When state, events, render replacement, and ref are inspected
Then only the final owner element registers, focuses, activates, navigates, and
receives ARIA while the optional reveal copy stays decorative

### UC-010 - Require duplication-safe visual content

Given Item uses RevealAnimation with Icon and children
When its real and decorative visual copies render
Then deterministic noninteractive content is supported and mount-sensitive
content uses revealAnimationProps false

### UC-011 - Preserve consumer presentation overrides

Given Root or Item receives supported className or style conflicts
When shared and consumer presentation merge
Then explicit consumer conflicts win, non-conflicting defaults remain, Item
className follows its documented repeated visual applications, and style stays
on the final element

### UC-012 - Enter, exit, interrupt, and reduce Root motion

Given a semantic popup owner applies starting or ending lifecycle state, reverses
it, changes layout, or requests reduced motion
When Root transitions
Then scale, opacity, optional width and height continue from current computed
values with the documented public timings and reach the same final endpoints or
complete immediately under reduced motion

### UC-013 - Share semantic-free grouped presentation

Given Group and GroupLabel are used directly or composed by Autocomplete or
AvatarMenu
When grouped popup content renders
Then Group adds neutral full-width layout, GroupLabel adds only one
presentation-agnostic composition surface and identity attribute, and the
semantic owner retains every role, id, association, registration, event, ref,
interaction, and presentation contract
