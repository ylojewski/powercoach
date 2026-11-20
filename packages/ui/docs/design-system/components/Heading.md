---
revision: 4
date: 2026-07-20
---

# Heading

## Overview

Heading renders prominent title or emphasized text with the Powercoach heading
typography. Use it only when an approved specification authorizes Heading for a
consumer-facing surface.

Heading always uses `font-heading`, renders foreground text by default, and
visually displays its text in lowercase. The visual lowercase treatment must not
rewrite the source content or accessible text values.

Its typed `tone` and `intent` props let consumers select the same semantic
text-color contract used by Text.

Heading renders a `span` by default. Its Base UI `render` prop lets consumers
replace that element while preserving Heading typography and content. Consumers
remain responsible for the HTML validity, document semantics, and accessibility
of the replacement.

## Anatomy

Heading exposes one public component.

- `Heading`: renders one native `span` by default or one consumer-supplied root
  through Base UI render semantics.

```tsx
<Heading>training focus</Heading>
```

## Examples

### EX-001 - Default emphasized text

Context: A consumer needs to emphasize a short inline label without creating a
document heading.

Expected behavior: Heading renders a `span`, uses the default `md` size, applies
foreground heading typography, and visually displays the label in lowercase
without changing its source or accessible text.

Covers: UC-001, UC-002, UC-005

```tsx
import { Heading } from '@powercoach/ui'

export function DefaultHeadingText() {
  return <Heading>Workout Focus</Heading>
}
```

### EX-002 - Semantic document heading

Context: A consumer needs Powercoach heading typography on a level-two document
heading.

Expected behavior: Heading renders the childless `h2` replacement as the one
final element, keeps the consumer-provided level-two semantics, applies the `xl`
size treatment, and renders the Heading children exactly once.

Covers: UC-002, UC-003, UC-006

```tsx
import { Heading } from '@powercoach/ui'

export function WorkoutSectionHeading() {
  return (
    <Heading render={<h2 />} size="xl">
      Session Recap
    </Heading>
  )
}
```

### EX-003 - Callback render with native attributes

Context: A consumer needs importance semantics, native attributes, and a local
class while retaining Heading content and presentation.

Expected behavior: The callback receives the complete merged props and an empty
public state object. It spreads the props, including the ref and children, onto
one `strong` root. The final element composes the local class with Heading
styles, the supported `text-muted-foreground` utility overrides the selected
warning intent, the accessible label is preserved, and the children render
exactly once.

Covers: UC-003, UC-004, UC-005, UC-006, UC-010

```tsx
import { Heading } from '@powercoach/ui'

export function ImportantHeadingText() {
  return (
    <Heading
      size="sm"
      intent="warning"
      className="text-muted-foreground"
      aria-label="Personal Record"
      render={(props) => <strong {...props} />}
    >
      Personal Record
    </Heading>
  )
}
```

### EX-004 - Shared semantic appearance scale

Context: A consumer needs to compare every tone and intent shared by Heading
and Text while retaining Heading typography.

Expected behavior: Each Heading instance applies the documented semantic
text-color token and retains the selected Heading size and lowercase visual
treatment. Omitting both appearance props produces the same foreground color
as `tone="default"`; no appearance value adds status or live-region semantics.

Covers: UC-001, UC-002, UC-007, UC-008, UC-009

```tsx
import { Heading } from '@powercoach/ui'

export function HeadingAppearanceScale() {
  return (
    <div className="grid gap-2">
      <Heading>Implicit Default</Heading>
      <Heading tone="default">Default Tone</Heading>
      <Heading tone="primary">Primary Tone</Heading>
      <Heading tone="secondary">Secondary Tone</Heading>
      <Heading tone="muted">Muted Tone</Heading>
      <Heading tone="accent">Accent Tone</Heading>
      <Heading intent="info">Informational Message</Heading>
      <Heading intent="success">Session Saved</Heading>
      <Heading intent="warning">Incomplete Session Data</Heading>
      <Heading intent="destructive">Unable To Save</Heading>
    </div>
  )
}
```

## Heading

### Props

The package exports the canonical shared `Tone`, `Intent`, and
`ToneOrIntentProps` types. `ToneOrIntentProps` is the mutually exclusive union
below. Omitting both props is valid; supplying both is a TypeScript error.

```ts
type Tone = 'default' | 'primary' | 'secondary' | 'muted' | 'accent'

type Intent = 'info' | 'success' | 'warning' | 'destructive'

type ToneOrIntentProps = { tone?: Tone; intent?: never } | { tone?: never; intent: Intent }
```

`HeadingProps` is a type alias that intersects `ToneOrIntentProps`, Base UI
`useRender.ComponentProps<"span", Record<string, never>>`, and
`{ size?: HeadingSize }`. Heading exports `HeadingSize` unchanged. It does not
expose `variant` or `HeadingVariant`.

| Prop                   | Type                                                                      | Default     | Description                                                                                                                                                        |
| ---------------------- | ------------------------------------------------------------------------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `tone`                 | `Tone`                                                                    | `"default"` | Selects a non-status semantic text-color treatment. Mutually exclusive with `intent`.                                                                              |
| `intent`               | `Intent`                                                                  | None        | Selects a status semantic text-color treatment. Mutually exclusive with `tone`.                                                                                    |
| `size`                 | `"xs" \| "sm" \| "md" \| "lg" \| "xl" \| "2xl" \| "3xl"`                  | `"md"`      | Selects the Heading size treatment.                                                                                                                                |
| `render`               | `ReactElement \| ((props, state: Record<string, never>) => ReactElement)` | None        | Replaces the default `span` through Base UI render semantics.                                                                                                      |
| `className`            | `string`                                                                  | None        | Composes a consumer class on the final element. Supported conflicting Tailwind typography and text-color utilities override Heading treatments through the merger. |
| `style`                | `React.CSSProperties`                                                     | None        | Merges consumer styles onto the final element through Base UI render semantics.                                                                                    |
| native span attributes | `useRender.ComponentProps<"span", Record<string, never>>` inherited props | None        | Passed to the default `span` or merged onto the replacement element, including native events, `aria-*`, `data-*`, children, and ref.                               |

#### Size Treatments

| Size  | Treatment                 |
| ----- | ------------------------- |
| `xs`  | `tracking-wide`           |
| `sm`  | `text-lg tracking-wide`   |
| `md`  | `text-xl tracking-wide`   |
| `lg`  | `text-2xl`                |
| `xl`  | `text-4xl tracking-tight` |
| `2xl` | `text-6xl tracking-tight` |
| `3xl` | `text-9xl tracking-tight` |

#### Appearance Treatments

| Prop     | Value         | Treatment                     |
| -------- | ------------- | ----------------------------- |
| `tone`   | `default`     | `text-foreground`             |
| `tone`   | `primary`     | `text-primary`                |
| `tone`   | `secondary`   | `text-secondary-foreground`   |
| `tone`   | `muted`       | `text-muted-foreground`       |
| `tone`   | `accent`      | `text-accent-foreground`      |
| `intent` | `info`        | `text-info-foreground`        |
| `intent` | `success`     | `text-success-foreground`     |
| `intent` | `warning`     | `text-warning-foreground`     |
| `intent` | `destructive` | `text-destructive-foreground` |

### Events

Heading defines no custom events. Native event handlers pass through and
compose according to Base UI render semantics.

### Data Attributes

Heading defines no custom or state-derived data attributes. Consumer `data-*`
attributes pass through to the final element.

### CSS Variables

Heading defines no public CSS variables.

## Accessibility

The default `span` creates neither heading nor importance semantics. A native
replacement preserves its native semantics. Rendering `h1` through `h6` creates
real heading semantics, so consumers must select the correct level for the
document structure. Rendering `strong` creates importance semantics rather than
heading semantics.

Consumers own valid HTML structure, native attributes, document semantics, and
accessibility for replacement elements and components. Heading does not infer a
heading level, add a heading role, repair invalid nesting, create an accessible
name, or suppress semantics supplied by the replacement.

Selecting an `intent` or `tone` changes only presentation. It does not add a
status role, alert role, live region, accessible name, focus behavior, or
keyboard behavior. Color alone does not satisfy a consumer's obligation to
communicate status accessibly.

Visual lowercase is presentation-only for every render form. Heading must not
lowercase children, `aria-label`, `title`, or other accessible text values in
JavaScript.

## Behavior

Without `render`, Heading applies all effective props to one default `span`.
`size` defaults to `md`, and Heading uses `font-heading` for every size.
Omitting both `tone` and `intent` is equivalent to `tone="default"` and applies
`text-foreground`. Every other appearance value applies its documented
treatment. `primary` promises the current `text-primary` token mapping and does
not promise a particular underlying token value.

`tone` and `intent` are consumed Heading props. They are not forwarded to the
final DOM element, exposed in render callback state, or emitted as data
attributes.

Consumer `className` values compose with Heading styles on the final rendered
element. When a supported Tailwind utility conflicts and the package Tailwind
conflict merger recognizes that conflict, the consumer utility wins. This
guarantee includes supported font family, text color, font size, and letter
spacing conflicts; for example, consumer `text-foreground` overrides
`intent="warning"`. The consumer owns conflicts involving custom CSS classes,
selector variants, important declarations, or external stylesheet specificity.

With an element `render` value, Base UI clones the supplied childless element
and merges Heading's effective props with the element's own props onto one final
element. Heading children remain authoritative and render exactly once.
`className` values compose, style objects merge, native event handlers compose,
and ordinary colliding props supplied on the render element take precedence.
The ref passed to Heading and a ref already present on the render element merge
and resolve to the same final DOM element.

With a callback `render` value, Heading passes the complete merged element props,
including children, className, style, native attributes, events, and ref. The
callback receives an empty `Record<string, never>` as its second argument;
Heading defines no public state fields, and consumers must not derive behavior
from that object. The callback must spread all received props onto exactly one
root, preserve the received ref, and render `props.children` exactly once
without replacing, reordering, duplicating, or decorating it.

A native replacement must be a non-void element that accepts Heading children
and received props, is valid in its external parent, and permits the supplied
child content. A custom component must forward the received ref and spread all
received props onto one underlying DOM element.

`Tone`, `Intent`, and `ToneOrIntentProps` are one canonical package-level
contract shared with Text. A future text-rendering component may reuse
`ToneOrIntentProps` only when it adopts the complete values, default, token
mapping, mutual exclusion, supported className precedence boundary, and
accessibility neutrality documented here.

## Motion

Heading has no motion behavior.

## Use Cases

### UC-001 - Render default emphasized text

Given a consumer uses Heading in a surface where Heading is authorized
When the consumer renders Heading without `render`
Then one `span` displays the content with Powercoach heading typography

### UC-002 - Select a documented size

Given a consumer renders Heading with a supported `size`
When the component is displayed through the default or a replacement element
Then the corresponding size treatment is applied to the final element

### UC-003 - Replace the default element

Given a consumer supplies a compatible childless element through `render`
When Heading renders
Then one replacement element receives the merged Heading props and authoritative
children while preserving its consumer-owned native semantics

### UC-004 - Use callback render semantics

Given a consumer supplies a callback through `render`
When Heading renders
Then the callback receives the complete merged props and an empty public state
object and returns one root that preserves the received ref and children

### UC-005 - Preserve source and accessible text

Given consumer content or accessible attributes contain uppercase letters
When Heading is displayed through any render form
Then the visual text is lowercase and the source content and accessible text
values are preserved

### UC-006 - Merge native props and refs

Given a consumer supplies native attributes, classes, styles, events, or refs to
Heading or its render element
When Heading renders
Then Base UI render semantics merge those values onto the one final element,
with render-element precedence for ordinary colliding props and all merged refs
resolving to that element

### UC-007 - Select a non-status tone

Given a consumer omits both appearance props or selects a supported `tone`
When Heading is displayed
Then the implicit default or selected documented tone treatment is applied

### UC-008 - Select a status intent

Given a consumer selects a supported `intent`
When Heading is displayed
Then the documented intent treatment is applied without adding accessibility
or interaction semantics

### UC-009 - Enforce one appearance category

Given a consumer uses the typed Heading API
When appearance props are checked by TypeScript
Then omitting both is valid and supplying `tone` and `intent` together is an
error

### UC-010 - Override a selected appearance

Given a consumer passes a supported Tailwind text-color utility whose conflict
with the selected appearance is recognized by the package merger
When Heading is displayed
Then the consumer utility overrides the selected appearance and
non-conflicting Heading styles remain applied
