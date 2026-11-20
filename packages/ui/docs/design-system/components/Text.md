---
revision: 2
date: 2026-07-20
---

# Text

## Overview

Text renders classic inline text with the Powercoach body typography. It always
uses `font-sans`, renders foreground text by default, and uses the `md` size
treatment unless a consumer selects another supported size. Its typed `tone`
and `intent` props let consumers select the same semantic text-color contract
used by Heading.

Text renders a native `span` by default. Its Base UI-aligned `render` prop lets
consumers compose Text with another native element or React component while
preserving the Text visual treatment.

## Anatomy

Text exposes one public component.

- `Text`: renders a native `span` by default or the element supplied through
  `render`.

```tsx
<Text>Recovery between sets</Text>
```

## Examples

### EX-001 - Default inline text

Context: A consumer needs classic inline text without selecting a size or
replacement element.

Expected behavior: Text renders a native `span` with `font-sans`, foreground
text color, and the default `md` treatment of `tracking-wide text-md`.

Covers: UC-001, UC-002, UC-003

```tsx
import { Text } from '@powercoach/ui'

export function DefaultText() {
  return <Text>Recovery between sets</Text>
}
```

### EX-002 - Complete size scale

Context: A consumer needs to compare every supported classic text size.

Expected behavior: Each Text instance applies the documented treatment for its
selected size while retaining `font-sans` and foreground text color.

Covers: UC-001, UC-003

```tsx
import { Text } from '@powercoach/ui'

export function TextSizeScale() {
  return (
    <div className="grid gap-2">
      <Text size="xs">Extra small text</Text>
      <Text size="sm">Small text</Text>
      <Text size="md">Medium text</Text>
      <Text size="lg">Large text</Text>
      <Text size="xl">Extra large text</Text>
      <Text size="2xl">Two extra large text</Text>
      <Text size="3xl">Three extra large text</Text>
    </div>
  )
}
```

### EX-003 - Deterministic className override

Context: A consumer needs a local size and color that differ from the selected
Text treatment and semantic tone.

Expected behavior: The consumer `text-4xl` and `text-muted-foreground`
utilities override Text's conflicting default `md` size and selected `primary`
color utilities on the rendered `span`. Non-conflicting Text styles remain
applied.

Covers: UC-001, UC-004

```tsx
import { Text } from '@powercoach/ui'

export function OverriddenText() {
  return (
    <Text tone="primary" className="text-4xl text-muted-foreground">
      Consumer override
    </Text>
  )
}
```

### EX-004 - Element-form render replacement

Context: A consumer needs Text typography on an emphasized native element.

Expected behavior: Text renders a `strong` element instead of a `span`. The
replacement receives the Text typography, content, consumer className, native
attributes, and ref. Native `strong` semantics apply.

Covers: UC-001, UC-005, UC-006, UC-007

```tsx
import { Text } from '@powercoach/ui'

export function StrongText() {
  return (
    <Text
      render={<strong data-rendered-element="strong" />}
      className="text-muted-foreground"
      title="Emphasized recovery instruction"
    >
      Keep breathing steadily
    </Text>
  )
}
```

### EX-005 - Callback-form render replacement and ref probe

Context: A consumer needs callback control over the final element and a visible
confirmation that the Text ref reaches it.

Expected behavior: The callback receives the complete props and empty Text
state, spreads the props onto a `span`, and adds a visible suffix. The ref
resolves to that rendered `span`, and the probe displays its tag name.

Covers: UC-001, UC-005, UC-006, UC-007

```tsx
import { useState } from 'react'
import { Text } from '@powercoach/ui'

export function CallbackText() {
  const [tagName, setTagName] = useState('none')

  return (
    <div className="grid gap-2">
      <Text
        ref={(element) => setTagName(element?.tagName.toLowerCase() ?? 'none')}
        data-text-purpose="instruction"
        render={(props, state) => (
          <span {...props}>
            {props.children} · state keys: {Object.keys(state).length}
          </span>
        )}
      >
        Brace before the repetition
      </Text>
      <output>ref element: {tagName}</output>
    </div>
  )
}
```

### EX-006 - Shared semantic appearance scale

Context: A consumer needs to compare every tone and intent shared by Text and
Heading.

Expected behavior: Each Text instance applies the documented semantic
text-color token. Omitting both appearance props produces the same foreground
color as `tone="default"`; every other value applies its documented mapping and
does not add status or live-region semantics.

Covers: UC-001, UC-008, UC-009, UC-010

```tsx
import { Text } from '@powercoach/ui'

export function TextAppearanceScale() {
  return (
    <div className="grid gap-2">
      <Text>Implicit default</Text>
      <Text tone="default">Default tone</Text>
      <Text tone="primary">Primary tone</Text>
      <Text tone="secondary">Secondary tone</Text>
      <Text tone="muted">Muted tone</Text>
      <Text tone="accent">Accent tone</Text>
      <Text intent="info">Informational message</Text>
      <Text intent="success">Session saved</Text>
      <Text intent="warning">Session data is incomplete</Text>
      <Text intent="destructive">Unable to save the session</Text>
    </div>
  )
}
```

## Text

### Props

The package exports the canonical shared `Tone`, `Intent`, and
`ToneOrIntentProps` types. `ToneOrIntentProps` is the mutually exclusive union
below. Omitting both props is valid; supplying both is a TypeScript error.

```ts
type Tone = 'default' | 'primary' | 'secondary' | 'muted' | 'accent'

type Intent = 'info' | 'success' | 'warning' | 'destructive'

type ToneOrIntentProps = { tone?: Tone; intent?: never } | { tone?: never; intent: Intent }
```

`TextProps` is a type alias that intersects `ToneOrIntentProps`, the existing
Base UI `useRender.ComponentProps<"span", Record<string, never>,
React.ComponentPropsWithRef<"span">>` contract, and `{ size?: TextSize }`.
`TextSize` remains exported and unchanged.

| Prop                   | Type                                                     | Default     | Description                                                                                                                                                     |
| ---------------------- | -------------------------------------------------------- | ----------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `tone`                 | `Tone`                                                   | `"default"` | Selects a non-status semantic text-color treatment. Mutually exclusive with `intent`.                                                                           |
| `intent`               | `Intent`                                                 | None        | Selects a status semantic text-color treatment. Mutually exclusive with `tone`.                                                                                 |
| `size`                 | `"xs" \| "sm" \| "md" \| "lg" \| "xl" \| "2xl" \| "3xl"` | `"md"`      | Selects the Text size and tracking treatment.                                                                                                                   |
| `render`               | `ReactElement \| ((props, state) => ReactElement)`       | None        | Replaces the default `span` using Base UI render semantics. Text exposes no state fields, so callback state is an empty object.                                 |
| `className`            | `string`                                                 | None        | Composes a consumer class on the final element. Supported conflicting Tailwind typography and text-color utilities override Text treatments through the merger. |
| native span attributes | `React.ComponentPropsWithRef<"span">`                    | None        | Passed to the default `span` or composed into the supplied render element, including children, native handlers, global attributes, and `ref`.                   |

#### Size Treatments

| Size  | Treatment                 |
| ----- | ------------------------- |
| `xs`  | `tracking-wide text-xs`   |
| `sm`  | `tracking-wide text-sm`   |
| `md`  | `tracking-wide text-md`   |
| `lg`  | `text-lg`                 |
| `xl`  | `text-xl tracking-tight`  |
| `2xl` | `text-2xl tracking-tight` |
| `3xl` | `text-3xl tracking-tight` |

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

Text defines no custom events. Native event handlers pass through to the final
rendered element and Text does not reinterpret their behavior.

### Data Attributes

Text defines no custom or state data attributes. Consumer `data-*` attributes
pass through to the final rendered element.

### CSS Variables

Text defines no public CSS variables.

## Accessibility

The default `span` has generic inline text semantics. Text adds no role,
accessible name, heading level, live-region behavior, focusability, or keyboard
behavior. Its visible children and consumer-provided native or ARIA attributes
determine its accessible output.

Selecting an `intent` or `tone` changes only presentation. It does not add a
status role, alert role, live region, accessible name, focus behavior, or
keyboard behavior. Color alone does not satisfy a consumer's obligation to
communicate status accessibly.

When `render` replaces the default `span`, the replacement element's native
semantics apply. The consumer owns valid DOM nesting and every semantic,
interactive, and accessibility obligation introduced by the replacement. Text
does not synthesize a role, `tabIndex`, keyboard handlers, or element-specific
attributes to compensate for a replacement.

A custom React component supplied through `render` must spread the received
props and forward the received ref to its underlying DOM element so that native
attributes, handlers, accessible attributes, Text styles, and the ref are
preserved.

## Behavior

Text always applies `font-sans`. The selected `size` applies the corresponding
documented size and tracking treatment, and `size` defaults to `md`. Omitting
both `tone` and `intent` is equivalent to `tone="default"` and applies
`text-foreground`. Every other appearance value applies its documented
treatment. `primary` promises the current `text-primary` token mapping and does
not promise a particular underlying token value.

`tone` and `intent` are consumed Text props. They are not forwarded to the
final DOM element, exposed in render callback state, or emitted as data
attributes.

Without `render`, Text renders a native `span` containing the consumer-provided
children. Native span props, including `className`, `style`, `id`, `title`,
`lang`, `dir`, `hidden`, `tabIndex`, native event handlers, global HTML
attributes, consumer `data-*` attributes, valid ARIA attributes, and `ref`, pass
through to that element.

Consumer `className` values compose with Text styles on the final rendered
element. When a supported Tailwind utility conflicts and the package Tailwind
conflict merger recognizes that conflict, the consumer utility wins. This
guarantee includes supported font family, text color, font size, and letter
spacing conflicts; for example, consumer `text-muted-foreground` overrides
`tone="primary"`, and consumer `text-4xl` overrides the default `md` `text-md`
utility. The consumer owns conflicts involving custom CSS classes, selector
variants, important declarations, or external stylesheet specificity.

The element form of `render` replaces the default `span` and receives the Text
typography, children, consumer props, composed `className`, merged `style`,
native handlers, attributes, and external ref. A `className` already present on
the supplied render element also composes on the final element, with conflicting
consumer utilities overriding Text defaults.

The callback form receives the complete props to apply to the final element and
an empty state object. The callback consumer must spread or deliberately apply
those props; omitted props are not forwarded automatically.

Text's top-level native props remain based on `span`. Element-specific props for
a replacement, such as `href` for a link or `type` for a button, belong on the
supplied render element or custom component.

The ref resolves to the final rendered DOM element. A custom component used in
the element form must accept and forward the received ref.

`Tone`, `Intent`, and `ToneOrIntentProps` are one canonical package-level
contract shared with Heading. A future text-rendering component may reuse
`ToneOrIntentProps` only when it adopts the complete values, default, token
mapping, mutual exclusion, supported className precedence boundary, and
accessibility neutrality documented here.

## Motion

Text has no motion behavior.

## Use Cases

### UC-001 - Render classic text typography

Given a consumer renders Text
When the component is displayed
Then it uses `font-sans` and the implicit default or selected appearance
treatment

### UC-002 - Render native inline text by default

Given a consumer renders Text without a `render` prop
When the component is displayed
Then it renders a native `span` containing the consumer-provided children

### UC-003 - Select a documented size

Given a consumer omits `size` or selects a supported size
When Text is displayed
Then the default `md` treatment or the selected documented treatment is applied

### UC-004 - Override conflicting default styles

Given a consumer passes a supported Tailwind `className` utility whose font,
color, size, or tracking conflict is recognized by the package merger
When Text is displayed
Then the consumer utility overrides the conflicting Text treatment and
non-conflicting Text styles remain applied

### UC-005 - Pass native attributes, handlers, and a ref

Given a consumer passes native span attributes, native handlers, consumer data
or ARIA attributes, or a ref to Text
When Text renders
Then those values are applied to the final rendered element and the ref resolves
to that element

### UC-006 - Replace the default element

Given a consumer supplies an element or callback through `render`
When Text renders
Then the supplied element replaces the default `span` and receives the Text
visual treatment and composed consumer props

### UC-007 - Preserve replacement semantics and responsibility

Given a consumer replaces the default `span` through `render`
When the replacement is displayed
Then its native semantics apply and the consumer owns its validity,
accessibility, interaction obligations, prop spreading, and ref forwarding

### UC-008 - Select a non-status tone

Given a consumer omits both appearance props or selects a supported `tone`
When Text is displayed
Then the implicit default or selected documented tone treatment is applied

### UC-009 - Select a status intent

Given a consumer selects a supported `intent`
When Text is displayed
Then the documented intent treatment is applied without adding accessibility
or interaction semantics

### UC-010 - Enforce one appearance category

Given a consumer uses the typed Text API
When appearance props are checked by TypeScript
Then omitting both is valid and supplying `tone` and `intent` together is an
error
