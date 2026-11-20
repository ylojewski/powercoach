---
revision: 2
date: 2026-08-08
---

# Avatar

## Overview

Avatar displays a square profile image or a textual fallback. It is a complete
Powercoach wrapper around Base UI Avatar and exposes the public `Avatar.Root`,
`Avatar.Image`, and `Avatar.Fallback` parts.

Avatar uses the semantic-free default Button chrome for its fixed square sizes,
composes fallback text through `Heading`, and applies the shared public hard
shadow permanently. It composes the CSS `RevealAnimation` by default around the
background and the active fallback presentation. The real image is never
duplicated, inverted, scaled, or covered by the reveal overlay.

Avatar uses the CSS animation engine. Reveal motion follows the public
`RevealAnimation` contract. Separate 150ms linear CSS opacity transitions apply
when Base UI marks an Image with `data-starting-style` or
`data-ending-style`.

## Anatomy

Import the compound component and assemble its public parts:

```tsx
import { Avatar } from '@powercoach/ui'
;<Avatar.Root>
  <Avatar.Image src="/athletes/ava-king.jpg" alt="Ava King" />
  <Avatar.Fallback headingProps={{ tone: 'muted' }}>AK</Avatar.Fallback>
</Avatar.Root>
```

- `Avatar.Root`: wraps Base UI Avatar Root, selects the shared square chrome and
  size, owns clipping and the permanent external hard shadow, and coordinates
  the optional reveal composition.
- `Avatar.Image`: wraps Base UI Avatar Image and displays the sole real image in
  the inner square.
- `Avatar.Fallback`: wraps the sole real Base UI Avatar Fallback and composes its
  children through `Heading`.

When reveal is enabled, one persistent `RevealAnimation` instance owns an
internal phrasing-content visual surface. Its real presentation contains the
only Base UI Image and Fallback. Its decorative presentation contains only the
opposite-theme background and, while Fallback is present, an inert copy of the
fallback Heading. The real Image remains above the complete reveal layer.

## Examples

### EX-001 - Default image Avatar

Context: A consumer needs a standard athlete avatar with a textual fallback.

Expected behavior: Root uses the default `md` size as a `size-9` square with
`2px` internal padding, default Button chrome, a permanent `3px` hard-shadow
offset, and enabled reveal behavior. Once loaded, the image fills and
square-crops the inner box while remaining uninverted above the revealed
background.

Covers: UC-001, UC-002, UC-003, UC-007, UC-010

```tsx
import { Avatar } from '@powercoach/ui'

export function AthleteAvatar() {
  return (
    <Avatar.Root>
      <Avatar.Image src="/athletes/ava-king.jpg" alt="Ava King" />
      <Avatar.Fallback>AK</Avatar.Fallback>
    </Avatar.Root>
  )
}
```

### EX-002 - Immediate, delayed, and failed fallbacks

Context: A consumer needs to observe the Base UI loading lifecycle and choose
whether one fallback should be delayed.

Expected behavior: The first fallback appears immediately while its image is
idle, loading, or failed. The second fallback remains absent until its explicit
600ms delay elapses. Each fallback renders its content through Heading, and the
visible status probe follows Base UI Image loading-status callbacks.

Covers: UC-004, UC-005, UC-006, UC-016

```tsx
import * as React from 'react'
import { Avatar } from '@powercoach/ui'
import type { ImageLoadingStatus } from '@powercoach/ui'

export function FallbackStates() {
  const [status, setStatus] = React.useState<ImageLoadingStatus>('idle')

  return (
    <div className="flex items-center gap-4">
      <Avatar.Root>
        <Avatar.Image src="/athletes/missing.jpg" alt="" onLoadingStatusChange={setStatus} />
        <Avatar.Fallback headingProps={{ tone: 'muted' }}>YA</Avatar.Fallback>
      </Avatar.Root>

      <Avatar.Root>
        <Avatar.Image src="/athletes/slow.jpg" alt="Slow-loading athlete" />
        <Avatar.Fallback delay={600}>SA</Avatar.Fallback>
      </Avatar.Root>

      <output aria-live="polite">image status: {status}</output>
    </div>
  )
}
```

### EX-003 - Complete size scale

Context: A consumer needs Avatar at each shared Heading size.

Expected behavior: Every Root uses its paired icon-prefixed Button square,
passes the same size unchanged to the fallback Heading, and keeps the documented
padding inside the fixed outer square. The `2xl` and `3xl` Roots use corrected
`size-20` and `size-40` squares so their literal fallback labels remain fully
visible. Hard-shadow offsets scale from `2px` at `xs` through `13.3333px` at
`3xl`.

Covers: UC-002, UC-003, UC-004

```tsx
import { Avatar } from '@powercoach/ui'
import type { AvatarSize } from '@powercoach/ui'

const sizes: AvatarSize[] = ['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl']

export function AvatarSizes() {
  return (
    <div className="flex items-end gap-4">
      {sizes.map((size) => (
        <Avatar.Root key={size} size={size}>
          <Avatar.Fallback>{size}</Avatar.Fallback>
        </Avatar.Root>
      ))}
    </div>
  )
}
```

### EX-004 - Default, disabled, and controlled reveal

Context: A consumer needs the canonical full-Root hover and focus reveal, one
static Avatar, and an externally controlled reveal with visible lifecycle
feedback.

Expected behavior: The first Avatar reveals when its complete border box is
hovered or contains focus, including its border and padding; external shadow
pixels are not interactive. The second never reveals. The third follows the
controlled target while forwarding the normal RevealAnimation change, start,
and completion lifecycle to the visible probe. All three keep their real Image
above the background reveal.

Covers: UC-007, UC-008, UC-009, UC-010, UC-011

```tsx
import * as React from 'react'
import { Avatar, Button } from '@powercoach/ui'

export function AvatarRevealStates() {
  const [revealed, setRevealed] = React.useState(false)
  const [phase, setPhase] = React.useState('idle')

  return (
    <div className="flex items-center gap-4">
      <Avatar.Root>
        <Avatar.Fallback>AR</Avatar.Fallback>
      </Avatar.Root>

      <Avatar.Root revealAnimationProps={false}>
        <Avatar.Fallback>ST</Avatar.Fallback>
      </Avatar.Root>

      <Avatar.Root
        revealAnimationProps={{
          reveal: revealed,
          onRevealChange: setRevealed,
          onRevealStart: () => setPhase('transitioning'),
          onRevealComplete: () => setPhase('complete')
        }}
      >
        <Avatar.Image src="/athletes/controlled.jpg" alt="Controlled athlete" />
        <Avatar.Fallback>CA</Avatar.Fallback>
      </Avatar.Root>

      <Button type="button" onClick={() => setRevealed((value) => !value)}>
        toggle reveal
      </Button>
      <output aria-live="polite">
        reveal: {String(revealed)}, phase: {phase}
      </output>
    </div>
  )
}
```

### EX-005 - Image entry and exit transitions

Context: A consumer needs a visible probe for Image entry, exit, interruption,
and delayed-Fallback overlap.

Expected behavior: When Base UI mounts Image with `data-starting-style`, Image
transitions from transparent to opaque over 150ms linear. When Base UI retains
Image with `data-ending-style`, it transitions from opaque to transparent over
150ms linear above the eligible Fallback. Restoring the source during exit
reverses the same transition toward opaque. Because Fallback has an explicit
600ms delay, the background alone may remain visible after Image reaches zero
opacity and before Fallback appears. Reduced motion makes entry and exit
immediate. The probe reports the Base UI loading status without claiming whether
the resource came from cache.

Covers: UC-006, UC-012, UC-013, UC-014, UC-018

```tsx
import * as React from 'react'
import { Avatar } from '@powercoach/ui'
import type { ImageLoadingStatus } from '@powercoach/ui'

export function AvatarImageLifecycle() {
  const imageUrl = '/athletes/image-entry.jpg'
  const [src, setSrc] = React.useState<string | undefined>(imageUrl)
  const [status, setStatus] = React.useState<ImageLoadingStatus>('idle')

  return (
    <div>
      <button type="button" onClick={() => setSrc(undefined)}>
        remove image
      </button>
      <button type="button" onClick={() => setSrc(imageUrl)}>
        restore image
      </button>
      <Avatar.Root>
        <Avatar.Image
          src={src}
          alt="Athlete entering or leaving"
          onLoadingStatusChange={setStatus}
        />
        <Avatar.Fallback delay={600}>IE</Avatar.Fallback>
      </Avatar.Root>
      <output aria-live="polite">image status: {status}</output>
    </div>
  )
}
```

### EX-006 - Consumer visual overrides

Context: A consumer needs the Avatar anatomy and lifecycle with a deliberate
custom surface treatment.

Expected behavior: Consumer classes apply after Avatar defaults. The selected
background, text, border, and shadow utilities supersede conflicting default
treatments and make those visual results consumer-owned. Non-conflicting size,
padding, crop, and lifecycle behavior remains in place.

Covers: UC-015

```tsx
import { Avatar } from '@powercoach/ui'

export function CustomAvatarSurface() {
  return (
    <Avatar.Root className="border-accent bg-accent text-accent-foreground shadow-none">
      <Avatar.Image src="/athletes/custom.jpg" alt="Athlete with custom treatment" />
      <Avatar.Fallback headingProps={{ tone: 'accent' }}>CT</Avatar.Fallback>
    </Avatar.Root>
  )
}
```

### EX-007 - Supported render composition

Context: A consumer needs a focusable custom Root element and a customized real
Fallback outer while reveal remains enabled.

Expected behavior: Root remains one local child-bearing element and preserves
the received props, children, ref, and composed pointer and focus handlers. Its
complete border box activates consumer-uncontrolled reveal on pointer hover and
focus. Fallback preserves its composed Heading child exactly once. The
decorative Heading copy remains inert, while the real Base UI parts keep their
single refs and lifecycle.

Covers: UC-017

```tsx
import { Avatar } from '@powercoach/ui'

export function ComposedAvatar() {
  return (
    <Avatar.Root
      render={
        <div
          role="group"
          tabIndex={0}
          aria-label="Composed athlete avatar"
          data-avatar-frame="profile"
        />
      }
    >
      <Avatar.Image src="/athletes/composed.jpg" alt="Composed athlete" />
      <Avatar.Fallback render={<span data-avatar-fallback="initials" />}>CO</Avatar.Fallback>
    </Avatar.Root>
  )
}
```

## Root

### Props

`AvatarRootProps` includes Base UI Avatar Root props plus the Powercoach props
below. `AvatarSize` is exported as the same seven-value union as `HeadingSize`.

| Prop                   | Type                                                                                        | Default | Description                                                                                                                                                                                   |
| ---------------------- | ------------------------------------------------------------------------------------------- | ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `size`                 | `AvatarSize`                                                                                | `"md"`  | Selects the fixed square, inner padding, and unchanged fallback Heading size.                                                                                                                 |
| `revealAnimationProps` | `boolean \| Omit<RevealAnimationProps, "render" \| "children" \| "contentMode" \| "scale">` | `true`  | Enables the owned RevealAnimation. `true` uses its allowed defaults, `false` disables it, and an object passes the allowed reveal target, direction, alignment, offsets, and lifecycle props. |
| `className`            | Base UI Avatar Root `className` prop                                                        | None    | Composes consumer classes after Powercoach defaults on the one real Root. Conflicting supported utilities override the corresponding defaults.                                                |
| `style`                | Base UI Avatar Root `style` prop                                                            | None    | Applies consumer styles to the one real Root and may override `--hard-shadow`.                                                                                                                |
| `render`               | Base UI Avatar Root `render` prop                                                           | None    | Replaces the default `span` through Base UI render semantics, subject to the enabled-reveal composition requirements below.                                                                   |
| native span props      | Base UI Avatar Root native props                                                            | None    | Native attributes, events, ARIA, data attributes, children, and ref pass through according to Base UI.                                                                                        |

#### Size Treatments

Root calls the public `buttonChromeVariants` helper once with the `default`
variant and the icon-prefixed Button size paired below. It does not use
`buttonChromeHeadingSize`; Avatar passes its own size unchanged to Heading.
Padding is included inside the fixed square. For `2xl` and `3xl`, Avatar keeps
the `icon-2xl` and `icon-3xl` chrome selections but applies the documented Root
square as the final geometry override.

| Avatar size | Button chrome size | Root square | Fallback Heading size | Inner padding | Hard-shadow offset |
| ----------- | ------------------ | ----------- | --------------------- | ------------- | ------------------ |
| `xs`        | `icon-xs`          | `size-7`    | `xs`                  | `1px`         | `2px`              |
| `sm`        | `icon-sm`          | `size-8`    | `sm`                  | `1px`         | `2.5px`            |
| `md`        | `icon-md`          | `size-9`    | `md`                  | `2px`         | `3px`              |
| `lg`        | `icon-lg`          | `size-10`   | `lg`                  | `2px`         | `3.3333px`         |
| `xl`        | `icon-xl`          | `size-12`   | `xl`                  | `2px`         | `4px`              |
| `2xl`       | `icon-2xl`         | `size-20`   | `2xl`                 | `3px`         | `6.6667px`         |
| `3xl`       | `icon-3xl`         | `size-40`   | `3xl`                 | `4px`         | `13.3333px`        |

The hard-shadow scale preserves the Input anchors of `2px` at `xs`, `3px` at
`md`, and `4px` at `xl`. Values interpolate linearly from `xs` through `md`.
From `md` upward, the offset equals one twelfth of the corrected Root square.

Root owns one default Button-chrome border, background, foreground, square
geometry, and focus treatment. It also owns relative isolated stacking, square
overflow clipping, and the permanent external `shadow-(--hard-shadow)`
treatment. Avatar does not apply the form-specific `field-emphasis` utility,
focus translation, or decorative rail behavior.

### Events

Avatar defines no custom Root events. Native Root events and Base UI Avatar Root
behavior pass through. Root composes consumer pointer and focus handlers with
the internal handlers that derive consumer-uncontrolled reveal. When
`revealAnimationProps` is an object, its documented RevealAnimation lifecycle
callbacks retain their normal meanings and are emitted only by
RevealAnimation.

### Data Attributes

Avatar defines no Root-specific data attributes. Base UI state remains
available to Root `className` and `style` callbacks through
`imageLoadingStatus`.

When reveal is enabled, the internal RevealAnimation owns its documented
`data-motion`, `data-content-mode`, and `data-reveal-*` attributes. In
particular, `data-reveal-overlay-surface` publicly identifies the decorative
surface so its border can remain transparent. Avatar does not redefine those
attributes.

### CSS Variables

Root consumes the package-level hard-shadow variable already exported through
the package stylesheet and resolves it to the selected size's offset on both
axes.

| Variable        | Type   | Default       | Description                                                                                                                                                   |
| --------------- | ------ | ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--hard-shadow` | shadow | Size-specific | Complete permanent external zero-blur Avatar shadow using the selected size's x and y offset and `var(--color-foreground)`. Consumer `style` may override it. |

Avatar defines no additional public CSS variables.

## Image

### Props

`AvatarImageProps` preserves Base UI Avatar Image props and native image props.

| Prop                    | Type                                  | Default | Description                                                                                                            |
| ----------------------- | ------------------------------------- | ------- | ---------------------------------------------------------------------------------------------------------------------- |
| `onLoadingStatusChange` | Base UI Avatar Image callback         | None    | Receives Base UI `idle`, `loading`, `loaded`, and `error` status changes.                                              |
| `className`             | Base UI Avatar Image `className` prop | None    | Composes consumer classes after the full-size square object-cover defaults.                                            |
| `style`                 | Base UI Avatar Image `style` prop     | None    | Applies consumer styles to the sole real Image.                                                                        |
| `render`                | Base UI Avatar Image `render` prop    | None    | Replaces the native `img` through Base UI render semantics, subject to the enabled-reveal geometry requirements below. |
| native image props      | Base UI Avatar Image native props     | None    | Native image attributes, events, ARIA, and ref pass through according to Base UI.                                      |

Image fills the remaining inner square, uses square `object-cover` cropping,
touches the inner padded edge, and receives no additional border. It remains
pointer-enabled and above the full reveal layer. Transparent image pixels may
show the background beneath them.

### Events

Image defines no custom events. Base UI `onLoadingStatusChange` and native Image
events pass through. Pointer and focus events from Image or its eligible
descendants participate in Root's complete border-box reveal target.

### Data Attributes

| Attribute             | Description                                                                                                                    |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| `data-starting-style` | Base UI marks a newly mounted Image visibility entry. Avatar uses it as the starting point for the default opacity transition. |
| `data-ending-style`   | Base UI marks a retained Image visibility exit. Avatar uses it as the ending point for the default opacity transition.         |

Image `className` and `style` callbacks receive Base UI `transitionStatus` and
`imageLoadingStatus` state.

### CSS Variables

Image defines no public CSS variables.

## Fallback

### Props

`AvatarFallbackProps` includes Base UI Avatar Fallback props and adds
`headingProps`.

| Prop              | Type                                       | Default | Description                                                                                                                                                     |
| ----------------- | ------------------------------------------ | ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `headingProps`    | `Omit<HeadingProps, "children" \| "size">` | None    | Passes Heading props to the real and decorative fallback Heading presentations. Avatar owns their shared children and maps Root size unchanged to Heading size. |
| `delay`           | Base UI Avatar Fallback `delay` prop       | Omitted | Waits the requested number of milliseconds before mounting Fallback. Omission keeps the Avatar default immediate.                                               |
| `className`       | Base UI Avatar Fallback `className` prop   | None    | Composes consumer classes on the one real Base UI Fallback outer.                                                                                               |
| `style`           | Base UI Avatar Fallback `style` prop       | None    | Applies consumer styles to the one real Base UI Fallback outer.                                                                                                 |
| `render`          | Base UI Avatar Fallback `render` prop      | None    | Replaces the real Fallback outer through Base UI render semantics while preserving its composed Heading child.                                                  |
| native span props | Base UI Avatar Fallback native props       | None    | Native attributes, events, ARIA, children, and ref pass through according to Base UI.                                                                           |

### Events

Fallback defines no custom events. Native events and Base UI Fallback behavior
pass through.

### Data Attributes

Avatar defines no Fallback-specific data attributes. Fallback `className` and
`style` callbacks receive Base UI `imageLoadingStatus` state.

### CSS Variables

Fallback defines no public CSS variables.

## Accessibility

Avatar preserves Base UI Avatar semantics. Root renders a `span` by default and
does not introduce a role, keyboard interaction, selection state, or action
semantics. Image retains native image semantics; consumers provide meaningful
alternative text for informative images and an empty alternative for images
whose fallback or surrounding content already provides the accessible label.

The real Base UI Fallback and its real Heading are the only accessible fallback
presentation. When reveal is enabled, the decorative surface and copied Heading
are pointer-inert, non-focusable, inert, and hidden from assistive technology.
They do not create a second accessible name, image, fallback, or live region.

Fallback Heading children are duplicated presentation content while reveal is
enabled. They must be deterministic, noninteractive, and safe to render twice.
Document-unique IDs, portals, functional controls, single-owner refs,
non-reentrant effects, and nondeterministic output are unsupported in those
children and in `headingProps` while reveal is enabled. Disabling
`revealAnimationProps` removes this duplication requirement.

## Behavior

Root uses Base UI Avatar as the sole owner of `imageLoadingStatus`. The Root,
Image, and Fallback state callbacks retain the Base UI status values and timing.
Avatar does not create a second image preloader, status machine, fallback timer,
or load-provenance signal.

Fallback is eligible during Base UI idle, loading, and error states. Because the
default `delay` is omitted, it appears immediately by default. A consumer may
provide a nonzero delay; in that case Base UI remains authoritative and the
Fallback stays absent until the delay elapses.

At loaded, Base UI mounts the sole Image and removes Fallback. The background
remains beneath Image while its opacity changes. This is not a Fallback-to-Image
crossfade. When Image leaves loaded, Base UI retains that same Image with
`data-ending-style` while Fallback becomes eligible again. The retained Image
stays on its higher real-image layer, fades toward transparent, and progressively
exposes Fallback or the background until Base UI unmounts it. If an explicit
Fallback delay outlasts the Image exit, only the background remains visible
after Image reaches zero opacity and before Fallback appears.

Root consumes `buttonChromeVariants` as a semantic-free visual API. Avatar does
not gain Button role, native button behavior, disabled behavior, action events,
loading behavior, or ARIA from the shared chrome. Its default border and hard
shadow remain in the real theme throughout reveal.

When `revealAnimationProps` is omitted or true, one `RevealAnimation` instance
stays mounted across idle, loading, loaded, error, starting, and ending states.
Avatar fixes its `contentMode` to `phrasing` and its copied-content `scale` to
`1`. Consumers may pass the remaining RevealAnimation direction, alignment,
offset, controlled reveal, and lifecycle props through the object form.

The real internal surface uses `bg-background` and `text-foreground`.
RevealAnimation provides the documented opposite-theme decorative surface for
the true light-to-dark or dark-to-light reveal. The decorative surface uses a
transparent border. Root remains the only owner of visible border chrome and
the permanent hard shadow.

The decorative layer reveals the padded background around Image and the active
Fallback Heading. It contains no Base UI Root, Image, or Fallback. The sole real
Image remains above the entire layer, so its pixels are never inverted or
covered. The background may remain visible beneath transparent Image pixels.

Root is the consumer-uncontrolled reveal interaction owner. Pointer hover over
its complete border box, including border, padding, and content, and focus within
Root derive one effective reveal target. CSS hard-shadow pixels remain outside
the hit-tested border box and are not interactive. Pointer interaction over
Image participates because Image remains inside Root.

Root tracks pointer-created focus separately so clicking Root does not keep
reveal open after pointer hover leaves. Consumer Root event handlers compose
with the internal pointer and focus handlers. When `revealAnimationProps`
contains a controlled `reveal` value, that value overrides the Root-derived
target. Root passes the single effective target through RevealAnimation's public
`reveal` prop; RevealAnimation remains the sole owner of change, start, and
completion callbacks.

Consumer `className` and `style` values merge after Powercoach defaults on the
corresponding real Base UI part. Supported conflicting utilities and style
values may replace the default background, foreground, border, shadow, crop,
or other visual treatment. The resulting conflict is consumer-owned. Root
styles are not copied or computed into the decorative surface; consumers who
replace its semantic colors own the revealed color result as well.

With reveal enabled, Root `render` must produce one local child-bearing DOM
element, forward all received props, children, ref, and composed pointer and
focus handlers, and preserve the square clipping and containing stack.
Fragments, void elements, portals, and output that relocates children are
unsupported. A local focusable Root may activate consumer-uncontrolled reveal
through Root's focus-within target.

Image `render` remains real-only and may preserve normal Base UI Image props,
callbacks, state, and ref. Its target must stay inside the inner image box,
remain above the reveal layer, and preserve event bubbling. Portals, escaped
stacking contexts, and geometry that covers the padded background are
unsupported while reveal is enabled.

Fallback `render` remains real-only and must preserve the Base UI props, ref,
and composed Heading child exactly once. Additional visuals introduced only by
a custom Fallback render are neither duplicated nor inverted. Consumers who
need their complete custom output revealed disable `revealAnimationProps`.

## Motion

Avatar uses the CSS animation engine.

Reveal direction, 300ms clip-path duration, interruption, callbacks,
opposite-theme surface, and reduced-motion lifecycle follow `RevealAnimation`.
Root supplies the consumer-uncontrolled target from its complete border box or
the consumer-controlled `reveal` value. Avatar fixes `contentMode` to
`phrasing` and `scale` to `1`; only the background and Fallback Heading
participate.

Image uses a 150ms linear opacity transition whenever Base UI mounts it with
`data-starting-style`. The starting opacity is `0` and the settled opacity is
`1`. Every entry that receives the attribute uses the transition, including an
entry whose resource may have come from browser cache. Base UI exposes no
reliable public cache-provenance signal, so Avatar does not distinguish cache
hits from other successful loads.

For Image exit, settled opacity is `1` and `data-ending-style` selects opacity
`0` through the same 150ms linear CSS transition. Base UI retains Image while
the transition runs and unmounts it after completion. The sole ending Image
remains above Fallback and progressively exposes that real and decorative
presentation as opacity falls.

If loaded returns before exit completes, Base UI removes
`data-ending-style`. The same CSS opacity transition reverses from its current
value toward `1`. This interruption does not create a new starting-style entry,
loading lifecycle, Image instance, or RevealAnimation lifecycle.

Under reduced motion, Image entry and exit transition durations are zero, so a
loaded Image appears immediately and an ending Image reaches transparent
immediately. RevealAnimation independently follows its documented
reduced-motion lifecycle and reaches each requested target immediately.

## Use Cases

### UC-001 - Render the Base UI Avatar anatomy

Given a consumer assembles Avatar.Root, Avatar.Image, and Avatar.Fallback
When Avatar renders
Then each public part preserves its corresponding Base UI lifecycle, state,
native props, callbacks, ref, render semantics, and accessibility ownership

### UC-002 - Use the default size and shared chrome

Given Root omits size
When Avatar renders
Then Root uses md, the icon-md default Button chrome, a size-9 square, 2px inner
padding, the md Fallback Heading size, and a permanent public hard shadow with
a 3px x and y offset

### UC-003 - Select every Avatar size

Given a consumer selects xs, sm, md, lg, xl, 2xl, or 3xl
When Avatar renders
Then Root uses the documented paired icon-prefixed Button square and internal
padding while Fallback uses the same Heading size unchanged, 2xl and 3xl use
size-20 and size-40, and the hard-shadow offset uses the documented proportional
value for the selected size

### UC-004 - Render the Heading fallback

Given Fallback receives safe textual children and optional headingProps
When Base UI makes Fallback eligible
Then the real Fallback renders those children through Heading at Root's selected
size and the decorative reveal copy remains inert and inaccessible

### UC-005 - Configure Fallback delay

Given Fallback omits delay or receives a nonzero delay
When Base UI enters idle, loading, or error
Then omission renders Fallback immediately while an explicit delay defers it by
the requested Base UI duration

### UC-006 - Observe Image loading state

Given Image receives onLoadingStatusChange or state-based className or style
When its resource moves through the Base UI lifecycle
Then the consumer receives the documented idle, loading, loaded, and error
states without a second Avatar loading lifecycle

### UC-007 - Reveal by default

Given Root omits revealAnimationProps or passes true
When pointer hover enters the complete Root border box or focus enters Root
Then one persistent CSS RevealAnimation reveals the background and eligible
Fallback Heading with phrasing content and scale 1 while external shadow pixels
remain non-interactive

### UC-008 - Disable reveal

Given Root passes false to revealAnimationProps
When Avatar is hovered or contains focus
Then no RevealAnimation overlay or copied Fallback Heading is present

### UC-009 - Control and observe reveal

Given Root passes allowed controlled target, direction, alignment, offset, or
lifecycle props through revealAnimationProps
When the target changes or a CSS reveal transition progresses
Then the persistent RevealAnimation follows its public controlled, interrupted,
callback, and completion contract

### UC-010 - Keep Image outside reveal

Given Base UI has mounted Image
When the background reveals or unreveals
Then the sole real Image remains square-cropped, geometrically stable,
uninverted, unscaled, pointer-enabled, and above the complete reveal layer

### UC-011 - Preserve external chrome during reveal

Given Avatar uses the default semantic surface
When RevealAnimation displays its opposite-theme background and foreground
Then the decorative border is transparent while Root's real-theme border and
external hard shadow remain permanent and unduplicated

### UC-012 - Fade a starting Image

Given Base UI mounts Image with data-starting-style
When Image becomes visible
Then its opacity transitions from 0 to 1 over 150ms linear regardless of known
or unknown browser cache provenance

### UC-013 - Fade an ending Image

Given Base UI retains Image with data-ending-style
When Image exits the loaded state
Then its opacity transitions from 1 to 0 over 150ms linear above the eligible
Fallback or background until Base UI unmounts it

### UC-014 - Respect reduced motion

Given the user prefers reduced motion
When Image enters, Image exits, or the reveal target changes
Then Image reaches its target opacity immediately and RevealAnimation reaches
its target through its documented reduced-motion lifecycle without a CSS
transition

### UC-015 - Override visual defaults

Given a consumer supplies supported conflicting className or style values
When Avatar merges its props
Then those values replace the corresponding real-part defaults and the
resulting visual treatment is consumer-owned

### UC-016 - Show a failed-image fallback

Given Image reaches the Base UI error state
When Fallback has no remaining delay
Then the sole real Fallback and its Heading are visible while the reveal
background remains available

### UC-017 - Preserve supported render composition

Given reveal is enabled and Root, Image, or Fallback receives a render override
When the override preserves the documented local children, geometry, stack,
event bubbling, props, refs, and Root pointer and focus handlers
Then each Base UI part remains single-owner and the decorative layer remains
inert without duplicating Image or the Fallback outer

### UC-018 - Reverse an interrupted Image exit

Given Image is fading toward transparent with data-ending-style
When loaded returns and Base UI removes the ending attribute before completion
Then the same 150ms linear CSS opacity transition reverses from its current
value toward 1 without a new starting entry, Image, loading lifecycle, or reveal
lifecycle
