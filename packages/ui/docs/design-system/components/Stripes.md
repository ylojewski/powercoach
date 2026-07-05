---
revision: 3
date: 2026-07-09
---

# Stripes

## Overview

Stripes renders a Powercoach support surface with a repeating diagonal striped
background. Use it for empty zones, feedback areas, media drop areas, and
contextual explanation zones.

Stripes is not decoration by default. It provides the striped background and
passes through consumer content, native attributes, styling, and render
replacement. Consumers provide any box metrics such as padding, border, width,
height, or layout.

## Anatomy

Stripes exposes one public component.

- `Stripes`: renders a striped support surface.

By default, Stripes renders a `div`.

```tsx
<Stripes>drop reference media here</Stripes>
```

## Examples

### EX-001 - Default support surface

Context: A consumer needs a visible empty-state surface for a media drop area.

Expected behavior: Stripes renders a `div`, displays the default repeating
diagonal stripe background, and renders the consumer text inside the surface.
The consumer class supplies the visible border and padding; Stripes supplies
only the stripe background.

Covers: UC-001, UC-002, UC-006

```tsx
import { Stripes } from '@powercoach/ui'

export function EmptyMediaSlot() {
  return <Stripes className="border border-foreground/30 p-4">Drop a reference image here</Stripes>
}
```

### EX-002 - Named stripe overrides

Context: A consumer needs a denser feedback area whose stripe values are set
directly on the component.

Expected behavior: Stripes uses the provided `angle`, `gap`, `width`, and
`color` values instead of the defaults. The transparent band between each
stripe is `6px`, each stripe is `2px`, and the stripes use `currentColor`.

Covers: UC-001, UC-003, UC-006

```tsx
import { Stripes } from '@powercoach/ui'

export function DenseFeedbackSurface() {
  return (
    <Stripes
      angle="45deg"
      gap="6px"
      width="2px"
      color="currentColor"
      className="p-4 text-muted-foreground"
    >
      Coach feedback is still being generated.
    </Stripes>
  )
}
```

### EX-003 - CSS variable overrides

Context: A consumer needs local CSS variable control for a contextual
explanation zone.

Expected behavior: Stripes reads the consumer-provided CSS variables from
`style` and uses them for the striped background because no matching named
props are provided.

Covers: UC-001, UC-004, UC-006

```tsx
import type { CSSProperties } from 'react'
import { Stripes } from '@powercoach/ui'

const stripesVariables = {
  '--stripes-angle': '60deg',
  '--stripes-gap': '8px',
  '--stripes-width': '1px',
  '--stripes-color': 'color-mix(in oklab, currentColor 22%, transparent)'
} as CSSProperties

export function ExplanationSurface() {
  return (
    <Stripes className="p-4 text-muted-foreground" style={stripesVariables}>
      Add one clear constraint before creating the workout.
    </Stripes>
  )
}
```

### EX-004 - Phrasing placement with render

Context: A consumer needs a short striped phrase inside paragraph text.

Expected behavior: Stripes renders the consumer-provided `span`, spreads the
Stripes props onto it, preserves the consumer-provided `title`, and keeps the
stripe background decorative. The consumer owns valid phrasing content and
semantics for the rendered `span`; the `title` may create an accessible name
according to normal HTML and ARIA rules.

Covers: UC-001, UC-005, UC-006, UC-007, UC-008

```tsx
import { Stripes } from '@powercoach/ui'

export function InlinePendingPhrase() {
  return (
    <p>
      Your{' '}
      <Stripes render={<span />} className="px-1" title="Estimated macros">
        estimated macros
      </Stripes>{' '}
      are pending.
    </p>
  )
}
```

## Stripes

### Props

| Prop                  | Type                                                                  | Default           | Description                                                                                                                                                                          |
| --------------------- | --------------------------------------------------------------------- | ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `children`            | `React.ReactNode`                                                     | None              | Content rendered inside the striped surface.                                                                                                                                         |
| `render`              | `ReactElement \| ((props: HTMLProps, state: object) => ReactElement)` | None              | Replaces the default `div` using Base UI `useRender` semantics. Stripes defines no public state fields for the render callback.                                                      |
| `angle`               | `string`                                                              | `"135deg"`        | Overrides the stripe angle by setting `--stripes-angle`.                                                                                                                             |
| `gap`                 | `string`                                                              | `"3px"`           | Overrides the transparent band between each stripe by setting `--stripes-gap`.                                                                                                       |
| `width`               | `string`                                                              | `"4px"`           | Overrides the visible stripe width by setting `--stripes-width`.                                                                                                                     |
| `color`               | `string`                                                              | `--stripes-color` | Overrides the stripe color by setting `--stripes-color`.                                                                                                                             |
| `className`           | `string`                                                              | None              | Composes a consumer class with the default Stripes background class on the rendered element.                                                                                         |
| `style`               | `React.CSSProperties`                                                 | None              | Applies consumer styles to the rendered element. Consumer styles may set Stripes CSS variables; matching named props take precedence when they are provided.                         |
| native div attributes | `React.ComponentPropsWithRef<"div">`                                  | None              | Passed to the rendered `div` by default, including ARIA attributes. When `render` replaces the element, consumers own valid attributes for the rendered element or custom component. |

`angle`, `gap`, `width`, and `color` accept CSS strings so consumers can
provide values such as `deg`, `px`, `rem`, `var()`, `calc()`, `currentColor`,
or `color-mix()`.

### Events

Stripes defines no custom events. Native events may be passed through to the
rendered element.

### Data Attributes

Stripes defines no custom data attributes. Consumer `data-*` attributes are
passed through to the rendered element.

### CSS Variables

| Variable          | Default              | Description                                                                                        |
| ----------------- | -------------------- | -------------------------------------------------------------------------------------------------- |
| `--stripes-angle` | `135deg`             | Angle of the repeating diagonal stripes.                                                           |
| `--stripes-gap`   | `3px`                | Transparent band between each visible stripe.                                                      |
| `--stripes-width` | `4px`                | Width of each visible stripe.                                                                      |
| `--stripes-color` | bg-muted theme token | Color of each visible stripe. This variable is the public color hook for the default stripe color. |

Override precedence is:

1. Component defaults.
2. Consumer CSS variables provided through `className` or `style`.
3. Matching named props when provided.

## Accessibility

Stripes does not add a semantic role, `aria-label`, `aria-labelledby`, `title`,
hidden label, or other accessible-name source by default. The striped
background is decorative.

Meaningful empty-state, feedback, drop-zone, or explanation messaging may come
from Stripes children, rendered element semantics, or consumer-provided
attributes.

Native attributes, `data-*` attributes, and ARIA attributes pass through
unchanged. If consumers provide naming attributes such as `title`, `aria-label`,
or `aria-labelledby`, the rendered element may receive an accessible name
according to normal HTML and ARIA rules.

Stripes must not add `role="presentation"`, `aria-hidden`, or otherwise
suppress consumer-provided semantics solely to keep the background decorative.

When `render` replaces the default `div`, the rendered element or custom
component must forward the ref and spread the received props. Consumers own
valid HTML content and semantics for the replacement element. To place Stripes
directly inside paragraph phrasing content, render a phrasing element such as
`span`; the default `div` is not valid directly inside a paragraph.

## Behavior

Stripes renders its children inside the rendered element and applies a
repeating diagonal striped background.

The default stripes use a `135deg` angle, a `3px` transparent gap between
stripes, a `4px` visible stripe width, and `--stripes-color`, whose default
value is the bg-muted theme token.

The stripe repeat period is the visible stripe width plus the transparent gap.

Stripes does not provide default padding, border, minimum size, typography,
layout, or interaction behavior. Consumers provide those surface metrics with
`className`, `style`, native attributes, or a rendered custom component.

## Motion

Stripes has no motion behavior.

## Use Cases

### UC-001 - Render a striped support surface

Given a consumer renders Stripes
When the component is displayed
Then the rendered element displays a repeating diagonal striped background and
contains the consumer-provided children

### UC-002 - Use the default stripe values

Given a consumer renders Stripes without stripe overrides
When the component is displayed
Then the stripe angle is `135deg`, the transparent gap is `3px`, the stripe
width is `4px`, and the stripe color comes from `--stripes-color`

### UC-003 - Override stripes with named props

Given a consumer provides `angle`, `gap`, `width`, or `color`
When Stripes renders
Then the provided prop values control the matching stripe variables

### UC-004 - Override stripes with CSS variables

Given a consumer provides Stripes CSS variables through `className` or `style`
and omits matching named props
When Stripes renders
Then the consumer CSS variables control the matching stripe values

### UC-005 - Replace the rendered element

Given a consumer provides `render`
When Stripes renders
Then Stripes uses the replacement element or component instead of the default
`div` and spreads the received props onto it

### UC-006 - Keep the striped background decorative

Given a consumer renders Stripes for an empty zone, feedback area, media drop
area, or contextual explanation zone
When assistive technology reads the surface
Then Stripes adds no role, accessible-name attribute, title, hidden label, or
other accessible-name source of its own and meaningful messaging comes from
children, rendered element semantics, or consumer-provided attributes

### UC-007 - Pass consumer attributes through unchanged

Given a consumer passes native attributes, `data-*` attributes, or ARIA
attributes to Stripes
When the component renders
Then those attributes are applied to the rendered element

### UC-008 - Preserve consumer-provided naming semantics

Given a consumer passes naming attributes such as `title`, `aria-label`, or
`aria-labelledby` to Stripes
When the component renders
Then Stripes does not suppress those attributes and the rendered element may
receive an accessible name according to normal HTML and ARIA rules
