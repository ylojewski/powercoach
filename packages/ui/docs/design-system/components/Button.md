---
revision: 8
date: 2026-08-20
---

# Button

## Overview

Button renders a Powercoach action control on top of Base UI Button semantics.
Use it for actions, form submission, and inline action text that behaves like a
button.

Button does not reinvent Base UI Button behavior. Base UI owns the native button
semantics, disabled behavior, keyboard interaction, `render` composition, and
`data-disabled` state. Powercoach Button owns the visual variants, base and
icon-prefixed size treatments, icon-slot sizing, loading state presentation,
and focus/disabled color treatments documented here.

Button can also compose the public `RevealAnimation` contract for consumers who
want the canonical Powercoach reveal interaction without manually wrapping a
Button. When `revealAnimation` is enabled, Button still owns the real action
surface while RevealAnimation owns the decorative overlay, reveal lifecycle, and
complete current motion and inspection contract. Button does not define or
freeze RevealAnimation clip-path geometry.

Button also owns a semantic-free chrome API for other Powercoach components
that need the same visual treatment without taking Button semantics. The chrome
API exposes visual classes and the matching Heading label size only. It does not
create an element, role, native button behavior, disabled behavior, events,
ARIA, loading state, render behavior, or RevealAnimation composition.

## Anatomy

Button exposes one public component.

- `Button`: renders the Base UI Button with Powercoach styling.

Button also exposes semantic-free chrome helpers for package consumers that own
their own element and semantics.

- `buttonChromeVariants`: returns the visual classes for the selected Button
  size and variant.
- `buttonChromeHeadingSize`: returns the mapped `Heading` size for any Button
  size.

```tsx
<Button>save workout</Button>
```

## Examples

### EX-001 - Default action button

Context: A consumer needs a primary action button with the default Powercoach
size and variant.

Expected behavior: Button renders an action button with `variant="default"` and
`size="lg"`, uses background with a foreground border, applies `Heading` at
size `sm`, and uses `h-10` with `px-6 py-1`.

Covers: UC-001, UC-002, UC-003

```tsx
import { Button } from '@powercoach/ui'

export function SaveWorkoutButton() {
  return <Button type="button">save workout</Button>
}
```

### EX-002 - Button with prepend and append icons

Context: A consumer needs leading and trailing visual icons around a button
label.

Expected behavior: Button renders the `prepend` icon, label, and `append` icon
in one stable row. For `size="xl"`, the label uses `Heading` at size `md`, the
box uses `h-12` with `px-8 py-1.5`, SVG icons use
`size-5`, and the text/icon gap is `gap-2.5`.

Covers: UC-002, UC-004

```tsx
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { Button } from '@powercoach/ui'

export function ContinuePlanButton() {
  return (
    <Button
      size="xl"
      prepend={<ArrowLeft aria-hidden="true" />}
      append={<ArrowRight aria-hidden="true" />}
    >
      continue plan
    </Button>
  )
}
```

### EX-003 - Ghost and link variants

Context: A consumer needs a lower-emphasis action and an inline action inside
body copy.

Expected behavior: The ghost button keeps the same `lg` box metrics as the
default button but reserves a transparent `1px` border instead of showing a
border. Enabled ghost uses `bg-muted` while hovered; disabled ghost does not
receive that hover background treatment. The enabled link button inherits its
parent text metrics and color, remains inline with surrounding text, displays
underline styling, and uses a pointer cursor when hovered. Disabled link uses
cursor default before hover and while hovered.

Covers: UC-003, UC-006

```tsx
import { Button } from '@powercoach/ui'

export function SecondaryAndInlineActions() {
  return (
    <p>
      <Button variant="ghost" type="button">
        skip
      </Button>{' '}
      <Button variant="ghost" disabled focusableWhenDisabled type="button">
        locked skip
      </Button>{' '}
      or{' '}
      <Button variant="link" type="button">
        reset filters
      </Button>{' '}
      <Button variant="link" disabled focusableWhenDisabled type="button">
        locked reset
      </Button>
    </p>
  )
}
```

### EX-004 - Icon action button

Context: A consumer needs a square icon-only action.

Expected behavior: Button renders `size="icon-lg"` with the default variant as
a square action with `size-10`, background, foreground border, and a normalized
SVG icon size of `size-4.5`. The consumer provides an accessible label for
icon-only content.

Covers: UC-002, UC-003, UC-004

```tsx
import { SlidersHorizontal } from 'lucide-react'
import { Button } from '@powercoach/ui'

export function FilterIconButton() {
  return (
    <Button size="icon-lg" type="button" aria-label="Open filters">
      <SlidersHorizontal />
    </Button>
  )
}
```

### EX-005 - Stable loading state

Context: A consumer needs to show progress after an action starts.

Expected behavior: While `loading` is true, Button exposes `data-loading`, sets
`aria-busy="true"`, becomes effectively disabled through Base UI, remains
focusable as a disabled button, and displays a decorative centered Lucide loading
spinner. The existing prepend, label, and append layout space is preserved and
visually suppressed so the button box does not flicker or change size.

Covers: UC-005

```tsx
import { Save } from 'lucide-react'
import { Button } from '@powercoach/ui'

export function SavingWorkoutButton() {
  return (
    <Button type="button" loading prepend={<Save aria-hidden="true" />}>
      save workout
    </Button>
  )
}
```

### EX-006 - Disabled and keyboard focus treatments

Context: A consumer needs a disabled action that still keeps its place in the
keyboard order.

Expected behavior: The disabled button displays muted text. The default variant
uses `muted-foreground` for both text and border in light and dark themes, while
the ghost variant keeps its reserved border transparent. When keyboard focus is
visible, Button shows a foreground outline separated from the button by a `1px`
empty gap.

Covers: UC-006, UC-007

```tsx
import { Button } from '@powercoach/ui'

export function FocusableDisabledButton() {
  return (
    <Button disabled focusableWhenDisabled type="button">
      save workout
    </Button>
  )
}
```

### EX-007 - Default Button revealAnimation

Context: A consumer needs the canonical reveal interaction on a default Button
without wrapping Button manually.

Expected behavior: Button renders through RevealAnimation, keeps the same
default Button size, border, Heading mapping, accessibility, focus treatment,
and action behavior, and renders the decorative overlay without a conflicting
foreground overlay border. The composition uses every current RevealAnimation
default and preserves its complete public inspection contract, including the
default return unreveal configuration.

Covers: UC-008, UC-009, UC-010

```tsx
import { Button } from '@powercoach/ui'

export function RevealedSaveWorkoutButton() {
  return (
    <Button type="button" revealAnimation>
      save workout
    </Button>
  )
}
```

### EX-008 - Icon-prefixed RevealAnimation variants

Context: A consumer needs controlled and interaction-derived reveal inspection
across every Button variant at icon-prefixed sizes, including a link reveal
inside phrasing content.

Expected behavior: The provided RevealAnimation props control each reveal. The
default overlay uses a transparent overlay border. Every real and copied icon
keeps the normalized SVG size paired with its icon-prefixed Button size before
RevealAnimation scaling. The ghost Button uses interaction-derived reveal with
`unrevealBehavior="continue"`; after a completed hover or keyboard-focus reveal,
leaving both interactions continues through the opposite side and exposes the
current continue configuration through the RevealAnimation inspection
contract. The output makes that configured value visible. The ghost overlay
uses background instead of its hover-muted background. The link overlay uses
background and foreground content; because this link is inside phrasing
content, the consumer passes
`contentMode="phrasing"` and `scale={1}` so the reveal root uses valid phrasing
structure and the copied icon does not enlarge.

Covers: UC-002, UC-003, UC-004, UC-008, UC-009, UC-011, UC-012, UC-013

```tsx
import { RotateCcw, SkipForward, UserRound } from 'lucide-react'
import { Button } from '@powercoach/ui'

export function RevealedButtonVariants() {
  const ghostUnrevealBehavior = 'continue' as const

  return (
    <p>
      <Button
        size="icon-lg"
        type="button"
        aria-label="Open profile"
        revealAnimation={{
          reveal: true,
          direction: 'top-to-bottom',
          alignX: 'center',
          alignY: 'center',
          scale: 1.2
        }}
      >
        <UserRound />
      </Button>{' '}
      <Button
        size="icon-sm"
        variant="ghost"
        type="button"
        aria-label="Skip"
        revealAnimation={{ direction: 'left-to-right', unrevealBehavior: ghostUnrevealBehavior }}
      >
        <SkipForward />
      </Button>{' '}
      <output>ghost unreveal: {ghostUnrevealBehavior}</output>{' '}
      <Button
        size="icon-xs"
        variant="link"
        type="button"
        aria-label="Reset filters"
        revealAnimation={{ reveal: true, contentMode: 'phrasing', scale: 1 }}
      >
        <RotateCcw />
      </Button>
    </p>
  )
}
```

### EX-009 - Shared Button chrome without Button semantics

Context: A Powercoach component owns its own semantic surface but needs the
same default Button chrome and mapped Heading size.

Expected behavior: The custom surface receives the selected Button visual
classes and uses the same mapped Heading size as Button. The chrome helpers do
not create a Button role, native button behavior, disabled behavior, events,
ARIA, loading state, render behavior, or RevealAnimation composition.

Covers: UC-014

```tsx
import { Heading, buttonChromeHeadingSize, buttonChromeVariants } from '@powercoach/ui'

export function SharedButtonChromeProbe() {
  return (
    <span className={buttonChromeVariants({ size: 'lg', variant: 'default' })}>
      <Heading size={buttonChromeHeadingSize('lg')}>shared chrome</Heading>
    </span>
  )
}
```

## Button

### Props

`ButtonProps` includes Base UI Button props plus the Powercoach props below.

| Prop                    | Type                                                                                                                                                  | Default     | Description                                                                                                                                                                                                                                  |
| ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `size`                  | `"xs" \| "sm" \| "md" \| "lg" \| "xl" \| "2xl" \| "3xl" \| "icon-xs" \| "icon-sm" \| "icon-md" \| "icon-lg" \| "icon-xl" \| "icon-2xl" \| "icon-3xl"` | `"lg"`      | Selects the Powercoach base or icon-prefixed size treatment. Base sizes have no effect on inline `link` metrics; icon-prefixed sizes give every variant square geometry.                                                                     |
| `variant`               | `"default" \| "ghost" \| "link"`                                                                                                                      | `"default"` | Selects the Powercoach visual treatment. Every variant accepts every base and icon-prefixed size.                                                                                                                                            |
| `prepend`               | `React.ReactNode`                                                                                                                                     | None        | Optional leading icon slot displayed for base sizes and omitted for icon-prefixed sizes. SVG content is normalized to the selected size treatment.                                                                                           |
| `append`                | `React.ReactNode`                                                                                                                                     | None        | Optional trailing icon slot displayed for base sizes and omitted for icon-prefixed sizes. SVG content is normalized to the selected size treatment.                                                                                          |
| `loading`               | `boolean`                                                                                                                                             | `false`     | Shows the stable loading state. Loading creates an effective disabled state, exposes `data-loading`, and sets `aria-busy="true"`.                                                                                                            |
| `revealAnimation`       | `boolean \| Omit<RevealAnimationProps, 'render' \| 'children'>`                                                                                       | `false`     | Composes Button through RevealAnimation. `true` uses every current RevealAnimation default. An object passes every current RevealAnimation prop except `render` and `children`, including `unrevealBehavior`. Button owns the omitted props. |
| `disabled`              | `boolean`                                                                                                                                             | Base UI     | Passed to Base UI Button. Disabled Button uses `muted-foreground` for visible text and visible default borders, and Base UI exposes `data-disabled`.                                                                                         |
| `focusableWhenDisabled` | `boolean`                                                                                                                                             | Base UI     | Passed to Base UI Button. When `loading` is true, Button behaves as though this were true so focus is not lost while loading.                                                                                                                |
| `nativeButton`          | `boolean`                                                                                                                                             | Base UI     | Passed to Base UI Button for render-prop polymorphism.                                                                                                                                                                                       |
| `render`                | `ReactElement \| ((props, state) => ReactElement)`                                                                                                    | None        | Passed to Base UI Button. Do not render Button as an `<a>`; anchors and navigation are out of scope for Button.                                                                                                                              |
| `className`             | `Base UI Button className prop`                                                                                                                       | None        | Composes consumer classes with the Powercoach and Base UI classes on Button.                                                                                                                                                                 |
| `style`                 | `Base UI Button style prop`                                                                                                                           | None        | Applies consumer styles through the Base UI Button style prop.                                                                                                                                                                               |
| native button props     | `Base UI Button native props`                                                                                                                         | None        | Native button attributes, form props, `type`, native events, `aria-*`, `data-*`, and `ref` pass through according to Base UI Button behavior.                                                                                                |

#### Size Treatments

Base sizes keep the documented text-button treatment. The `default` and
`ghost` variants use the fixed height, padding, SVG size, gap, and mapped
`Heading`; `link` inherits inline text metrics and does not use those base-size
box metrics.

Every icon-prefixed size is valid with every variant. It uses the square side
and SVG normalization paired with its base size, centers children, omits
`Heading`, and omits `prepend` and `append`. `buttonChromeHeadingSize` remains a
total helper and maps an icon-prefixed size to the same Heading size as its base
size even though Button does not use that Heading mapping for icon-prefixed
content.

| Base size | Icon-prefixed size | Heading mapping | Base box height | Icon-prefixed side | Default/ghost base padding | SVG icon size | Base text/icon gap |
| --------- | ------------------ | --------------- | --------------- | ------------------ | -------------------------- | ------------- | ------------------ |
| `xs`      | `icon-xs`          | `xs`            | `h-7`           | `size-7`           | `px-2 py-1`                | `size-3.5`    | `gap-1`            |
| `sm`      | `icon-sm`          | `xs`            | `h-8`           | `size-8`           | `px-3 py-1`                | `size-4`      | `gap-1.5`          |
| `md`      | `icon-md`          | `xs`            | `h-9`           | `size-9`           | `px-4 py-1`                | `size-4`      | `gap-2`            |
| `lg`      | `icon-lg`          | `sm`            | `h-10`          | `size-10`          | `px-6 py-1`                | `size-4.5`    | `gap-2`            |
| `xl`      | `icon-xl`          | `md`            | `h-12`          | `size-12`          | `px-8 py-1.5`              | `size-5`      | `gap-2.5`          |
| `2xl`     | `icon-2xl`         | `lg`            | `h-14`          | `size-14`          | `px-10 py-2`               | `size-6`      | `gap-3`            |
| `3xl`     | `icon-3xl`         | `xl`            | `h-20`          | `size-20`          | `px-12 py-3`               | `size-8`      | `gap-4`            |

#### Variant Treatments

| Variant   | Treatment                                                                                                                                                                                                                                                                                                                                            |
| --------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `default` | Uses background and a visible foreground `1px` border. With a base size, it uses the mapped `Heading` and text-button metrics. With an icon-prefixed size, it uses the square and icon-content treatment and exactly replaces the former `variant="icon"` plus paired base size combination.                                                         |
| `ghost`   | Uses background and reserves a `1px` border with transparent border color. Enabled ghost uses `bg-muted` while hovered; disabled ghost does not receive that hover treatment. It uses mapped Heading and text-button metrics with a base size, or the square and icon-content treatment with an icon-prefixed size.                                  |
| `link`    | Inherits parent font and color, uses a transparent borderless surface, displays underlined content, uses a pointer cursor while enabled and hovered, and uses cursor default while disabled. It uses inline inherited text metrics with a base size, or the square and icon-content treatment with an icon-prefixed size. It does not use `Heading`. |

The former `icon` variant is removed without a compatibility alias. Consumers
migrate `variant="icon"` with base size `S` to `variant="default"` with
`size="icon-S"`.

#### RevealAnimation Overlay Treatments

When Button is used as the decorative RevealAnimation overlay surface, Button
keeps the same public variant, base or icon-prefixed size, content order,
Heading usage, and SVG icon sizing treatment as the real Button.
RevealAnimation owns the overlay surface attribute and reveal structure. Button
uses that public overlay surface only for the visual conflict treatments below.

| Variant   | Overlay treatment                                                                                                                                                                                                                               |
| --------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `default` | The overlay border is transparent so the inverted foreground border does not visually conflict with the real Button border. SVG or Lucide content at an icon-prefixed size keeps the Button-normalized icon size before copied-content scaling. |
| `ghost`   | The overlay background is background, including while the real Button is hovered or focused for reveal. SVG or Lucide content at an icon-prefixed size keeps its Button-normalized icon size before copied-content scaling.                     |
| `link`    | The overlay background is background and the overlay content is foreground. RevealAnimation `contentMode` and `scale` props decide root content structure and copied-content scaling, including at icon-prefixed sizes.                         |

### Shared Chrome API

Button owns a semantic-free chrome API for components that need Button visual
treatments while preserving their own semantics.

```ts
type ButtonSize =
  | 'xs'
  | 'sm'
  | 'md'
  | 'lg'
  | 'xl'
  | '2xl'
  | '3xl'
  | 'icon-xs'
  | 'icon-sm'
  | 'icon-md'
  | 'icon-lg'
  | 'icon-xl'
  | 'icon-2xl'
  | 'icon-3xl'

type ButtonVariant = 'default' | 'ghost' | 'link'

type ButtonChromeOptions = {
  size?: ButtonSize
  variant?: ButtonVariant
}

function buttonChromeVariants(options?: ButtonChromeOptions): string

function buttonChromeHeadingSize(size?: ButtonSize): HeadingSize
```

`ButtonSize`, `ButtonVariant`, `ButtonChromeOptions`, `buttonChromeVariants`,
and `buttonChromeHeadingSize` are package exports. Shared chrome consumers use
the public API rather than Button internals.

| API                       | Default                              | Description                                                                                                                                                                                                                                             |
| ------------------------- | ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ButtonChromeOptions`     | `{ size: 'lg', variant: 'default' }` | Options object used by `buttonChromeVariants`. `size` accepts every base and icon-prefixed Button size; `variant` accepts `default`, `ghost`, or `link`.                                                                                                |
| `buttonChromeVariants`    | `size="lg"`, `variant="default"`     | Returns visual classes for every orthogonal Button size and variant combination. The classes own only visual treatment, including surface geometry, spacing, border, background, text color, focus selectors, disabled selectors, and color transition. |
| `buttonChromeHeadingSize` | `lg`                                 | Returns the `Heading` size mapped from any Button size. Each icon-prefixed size maps to the same Heading size as its paired base size.                                                                                                                  |

The chrome API does not create a DOM element, choose a role, set native button
behavior, set disabled state, set ARIA, attach events, manage loading state,
provide render composition, or compose RevealAnimation. It may include visual
selectors for states such as `data-disabled`, but the consuming semantic
component owns whether those attributes exist and what they mean.

### Events

Button defines no custom events. Native events and Base UI Button event behavior
pass through Button.

### Data Attributes

| Attribute       | Description                                                                              |
| --------------- | ---------------------------------------------------------------------------------------- |
| `data-disabled` | Present when Base UI Button is disabled, including the effective disabled loading state. |
| `data-loading`  | Present when `loading` is true.                                                          |

Consumer `data-*` attributes may be passed through Button.

Button does not define RevealAnimation data attributes. When `revealAnimation`
is enabled, RevealAnimation owns and Button preserves its complete current
inspection contract, including `data-motion`, `data-content-mode`,
`data-unreveal-behavior`, conditional `data-active-unreveal-behavior`, the
`data-reveal-*` structure, and every public RevealAnimation CSS variable.

### CSS Variables

Button defines no public CSS variables.

## Accessibility

Button follows Base UI Button accessibility semantics for native button
behavior, keyboard interaction, disabled behavior, render composition, and
`focusableWhenDisabled`.

When `revealAnimation` is enabled, Button follows RevealAnimation accessibility
semantics for the duplicated decorative overlay. The real Button remains the
only accessible, focusable, interactive action. The decorative overlay must not
create a second button role, accessible name, focus target, or action.

Button is for actions, not navigation. `variant="link"` remains a button action
styled like inline hyperlink text. Rendering Button as an `<a>` through
`render` is unsupported; style an anchor directly when the user should navigate.

The shared chrome API has no accessibility behavior. A component that consumes
Button chrome keeps full responsibility for its own role, accessible name, tab
order, keyboard behavior, disabled behavior, ARIA, and events.

Icon-only buttons, including every icon-prefixed size, must have an accessible
name, such as `aria-label`, when the visible content does not provide one.

When `loading` is true, Button sets `aria-busy="true"` and enters an effective
disabled state while keeping disabled focus behavior stable through Base UI.
The loading spinner is decorative.

Keyboard focus uses a foreground outline with a `1px` empty gap between the
button border and the outline.

## Behavior

Button renders a Base UI Button with Powercoach visual treatments. The `size`
prop defaults to `lg`, and the `variant` prop defaults to `default`.

`buttonChromeVariants` returns the same visual treatment that Button uses for
every selected base or icon-prefixed `size` and every selected `variant`,
without rendering Button. It defaults to the same `lg` size and `default`
variant as Button. `buttonChromeHeadingSize` is total across Button sizes and
returns the base-size Heading mapping for both a base size and its paired
icon-prefixed size. Button itself omits Heading at icon-prefixed sizes.
Components that use the shared chrome remain responsible for applying the
returned classes and any mapped Heading size to their own semantic surface.

When `revealAnimation` is omitted or false, Button renders the same single Base
UI Button surface as a non-reveal Button.

When `revealAnimation` is true, Button renders through RevealAnimation with the
complete current default RevealAnimation props. When `revealAnimation` is an
object, Button passes every current RevealAnimation prop to RevealAnimation
except for `render` and `children`, including `unrevealBehavior`. Button always
owns the RevealAnimation `render` surface and
`children`: the render surface is Button with the same Button props except
`revealAnimation` is omitted, so the composition does not recursively create
nested RevealAnimation instances.

Button does not add variant-specific overrides to RevealAnimation props.
Every current RevealAnimation option other than the two Button-owned props
applies according to the RevealAnimation contract. This includes content mode,
direction, unreveal behavior, copied-content placement and scale, lifecycle
callbacks, interruption, hidden reset, theme inversion, and reduced motion.
Callbacks report exactly the current RevealAnimation lifecycle, including one
completion for the active target and no additional callback for the silent
reset after a completed continue unreveal. `revealAnimation={true}` uses the
default flow content mode and return unreveal behavior. Button does not infer
content mode or unreveal behavior from `variant`, including `link`. Consumers
choose `contentMode="phrasing"` explicitly when a link Button reveal must
participate in phrasing content and choose `scale` based on whether the copied
link text should enlarge.

The `default` and `ghost` variants use Powercoach square geometry. `default`
does not have hover-specific visual treatment and does not set a custom cursor.
Enabled `ghost` uses `bg-muted` while hovered; disabled `ghost` does not receive
that hover background treatment. Enabled `link` uses a pointer cursor on hover;
disabled `link` uses cursor default before hover and while hovered.

Every variant and size combination is valid. With a base size, `default` and
`ghost` display their label with the mapped `Heading` treatment, while `link`
inherits its parent text treatment so it can sit naturally inside a text run
and ignores the base-size fixed box metrics. With an icon-prefixed size,
`default`, `ghost`, and `link` use the paired square side and SVG normalization,
center children, and omit Heading. `link` retains its transparent borderless
surface, inherited color, underline, cursor, disabled, and overlay treatments
while using the icon-prefixed square geometry.

The `prepend` and `append` slots render before and after the label for base
sizes. SVG and Lucide icon content in those slots is normalized to the
documented icon size for the selected base size. Icon-prefixed sizes omit
`prepend` and `append`; SVG and Lucide icon content inside the Button is
normalized to the documented icon size paired with that icon-prefixed size.

When Button is rendered as the decorative RevealAnimation overlay surface,
Button preserves the real Button variant, size, metrics, content order, Heading
usage, and content normalization while removing visual conflicts created by the
inverted overlay theme. The `default` overlay surface uses a transparent
border. The `ghost` and `link` overlay surfaces use background. The `link`
overlay surface uses foreground content. Every icon-prefixed overlay surface
keeps SVG or Lucide icon content normalized to the paired Button icon size
before RevealAnimation applies the requested copied-content scale, alignment,
and offsets.

When Button is disabled, the visible content uses `muted-foreground` in light
and dark themes. The `default` visible border uses `muted-foreground` in light
and dark themes while disabled at base and icon-prefixed sizes. The `ghost`
reserved border remains transparent when enabled, disabled, and focusable
disabled. The `link` surface remains transparent and borderless.

Color state changes use `transition-colors`. Button has no animation behavior
other than the loading spinner.

When `loading` is true, Button displays a decorative centered Lucide loading
spinner using the documented base or paired icon-prefixed size and a spin
animation. At base sizes, the existing prepend, label, and append content
preserve their layout space while visually suppressed. At icon-prefixed sizes,
the spinner stays centered and the paired square side remains stable. The button
box does not change size or flicker.

## Motion

Button has no component motion when `revealAnimation` is omitted or false. The
only moving element is the decorative Lucide loading spinner when `loading` is
true; it uses a spin animation.

Button uses `transition-colors` for color state changes. It does not animate
layout, size, border width, or variant changes.

The shared chrome API may return the same color-transition visual treatment as
Button, but it does not create component motion and does not compose
RevealAnimation.

When `revealAnimation` is enabled, RevealAnimation owns the reveal motion,
direction, unreveal behavior, target interruption, lifecycle callbacks, hidden
reset, theme inversion, copied-content transforms, public inspection surface,
and reduced-motion behavior. Button does not define RevealAnimation clip-path
strings, endpoint maps, transition bookkeeping, or reset mechanics. Button must
not animate its layout, size, border width, or variant treatment as part of the
reveal. RevealAnimation copied-content scaling applies normally to all Button
variants. Consumers pass `scale={1}` when no copied-content scaling is desired.

## Use Cases

### UC-001 - Render a Base UI action button

Given a consumer renders `Button`
When the component is displayed
Then Button behaves as a Base UI Button action with Powercoach styling

### UC-002 - Select a documented size

Given a consumer renders `Button` with a supported `size`
When the component is displayed
Then a base size applies its documented text-button treatment and an
icon-prefixed size applies its paired square side, centered normalized SVG
content, omitted Heading, and omitted prepend and append treatment

### UC-003 - Select a documented variant

Given a consumer renders `Button` with a supported `variant` and any supported
base or icon-prefixed `size`
When the component is displayed
Then the corresponding Powercoach variant treatment composes with the selected
size treatment

### UC-004 - Render icon content at the matching size

Given a consumer provides `prepend` or `append` at a base size, or SVG
icon-only content at an icon-prefixed size
When Button is displayed
Then SVG content is normalized to the documented paired icon size and
icon-prefixed sizes omit prepend and append

### UC-005 - Show loading without layout shift

Given a consumer renders `Button` with `loading`
When Button is displayed
Then it exposes the loading state, becomes effectively disabled, shows a centered
spinner, and keeps the same box dimensions

### UC-006 - Render inline and low-emphasis actions

Given a consumer selects `variant="ghost"` or `variant="link"`
When Button is displayed
Then ghost uses the selected base or icon-prefixed geometry with a transparent
reserved border, enabled ghost uses `bg-muted` on hover while disabled ghost
does not, link uses inline inherited metrics at base sizes or paired square
geometry at icon-prefixed sizes, and disabled link uses cursor default

### UC-007 - Preserve disabled and focus treatments

Given Button is disabled or receives keyboard focus
When the state is displayed
Then disabled Button uses the documented `muted-foreground` text treatment,
visible default disabled borders use the documented `muted-foreground`
treatment at base and icon-prefixed sizes, ghost reserved borders stay
transparent, link surfaces stay transparent and borderless, and keyboard focus
uses a foreground outline with a `1px` empty gap

### UC-008 - Enable the canonical reveal through Button

Given a consumer renders `Button` with `revealAnimation`
When Button is displayed
Then Button composes RevealAnimation around the Button action surface instead of
requiring the consumer to wrap Button manually, preserves the complete current
RevealAnimation motion and inspection contract, and keeps RevealAnimation as
the sole owner of clip-path geometry

### UC-009 - Pass RevealAnimation props without recursion

Given a consumer renders `Button` with a `revealAnimation` props object
When Button is displayed
Then those RevealAnimation props are passed to the composed RevealAnimation
except for `render` and `children`, including `unrevealBehavior`, the Button
render surface does not receive `revealAnimation`, and lifecycle callbacks
retain their complete current RevealAnimation meanings

### UC-010 - Render default reveal overlay without border conflict

Given a consumer renders the default Button with `revealAnimation`
When the RevealAnimation overlay is visible
Then the overlay Button keeps the default Button treatment while using a
transparent overlay border

### UC-011 - Render icon-prefixed reveal overlays with normal scaling

Given a consumer renders `Button` with an icon-prefixed size, any supported
variant, and `revealAnimation`
When the RevealAnimation overlay is visible
Then the overlay Button keeps the real Button size and variant, normalizes SVG
content to the paired Button icon size before RevealAnimation scaling, applies
the variant overlay conflict treatment, and applies the requested
RevealAnimation scale, alignment, and offsets to the copied icon content

### UC-012 - Render ghost reveal overlay on background

Given a consumer renders `Button` with `variant="ghost"` and `revealAnimation`
When the RevealAnimation overlay is visible
Then the overlay Button uses background while preserving the ghost Button box
metrics and content treatment at base and icon-prefixed sizes

### UC-013 - Control link reveal content structure and scale

Given a consumer renders `Button` with `variant="link"` and a `revealAnimation`
props object
When the RevealAnimation overlay is visible
Then the overlay Button uses background and foreground content, preserves base
inline or icon-prefixed square geometry, and RevealAnimation uses the explicitly
consumer-provided `contentMode="phrasing"` and `scale` props to decide root
content structure and copied-content scale without Button inferring content mode
from the link variant or size

### UC-014 - Share Button chrome without Button semantics

Given a Powercoach component calls `buttonChromeVariants` and
`buttonChromeHeadingSize`
When it applies the returned values to its own semantic surface
Then every base or icon-prefixed size and every variant combination returns the
same semantic-free visual treatment and total Heading mapping as Button while
the consuming component continues to own its element, role, accessibility,
events, disabled behavior, loading behavior, render behavior, and
RevealAnimation composition
