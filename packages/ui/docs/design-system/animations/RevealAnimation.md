---
revision: 9
date: 2026-08-20
---

# RevealAnimation

## Overview

RevealAnimation renders a decorative reveal layer over a supplied surface while
leaving the real surface accessible and interactive.

The surface is the React element supplied through `render`. RevealAnimation
renders that surface twice with the same children:

- one real surface, visible, accessible, and interactive;
- one overlay surface, decorative and inert, used only to obtain the same
  composed visual content through the surface public API.

RevealAnimation does not copy the surface styles, tokens, markup, or internals.
It composes the provided surface as a consumer would. If a surface cannot accept
children or cannot be rendered twice safely, it is not compatible with
RevealAnimation.

The default public examples and use cases in this spec use the default
Powercoach `Button` as the `render` surface with no Button props. The phrasing
content-mode example documents an explicit link Button surface.

## Anatomy

RevealAnimation exposes one public component.

- `RevealAnimation`: renders the real surface and decorative overlay surface.

The documented DOM contract is:

- `data-motion="reveal"` identifies the animation family on the root.
- `data-content-mode` identifies the effective HTML content mode on the root.
- `data-unreveal-behavior` identifies the effective unreveal configuration on
  the root.
- `data-active-unreveal-behavior` identifies the behavior latched for an
  unresolved unreveal cycle, including its temporary recovery toward revealed,
  or for an active forced-return hidden target on the root.
- `data-reveal-root` establishes the root stacking context.
- `data-reveal-surface` contains the real surface.
- `data-reveal-overlay` covers the real surface border box.
- `data-reveal-overlay-surface` marks the decorative surface instance.
- `data-reveal-source` marks the real content passed to the real surface.
- `data-reveal-copy` marks the decorative copy that receives offsets.
- `data-reveal-copy-scale` marks the decorative copy content that receives
  scale and transform origin.

```tsx
<RevealAnimation render={<Button />}>start workout</RevealAnimation>
```

## Examples

### EX-001 - Default Button reveal

Context: A consumer needs the default reveal treatment on the default
Powercoach Button surface.

Expected behavior: RevealAnimation renders one accessible default Button and one
decorative default Button overlay. Hovering the real Button or focusing it with
the keyboard reveals the overlay with a diagonal sweep whose moving frontier
remains a literal 45-degree line, and leaving hover and keyboard focus returns
it to the starting state. The overlay does not create a second Button role,
accessible name, focus target, or action. Clicking the Button with a pointer
does not keep the overlay revealed after the pointer hover leaves.

Covers: UC-001, UC-002, UC-003, UC-004

```tsx
import { Button, RevealAnimation } from '@powercoach/ui'

export function DefaultButtonReveal() {
  return <RevealAnimation render={<Button />}>start workout</RevealAnimation>
}
```

### EX-002 - Direction variants on default Button

Context: A consumer needs to inspect the five supported reveal directions on
the default Powercoach Button surface.

Expected behavior: Each RevealAnimation instance uses a default Button surface
with no Button props. The first reveals left to right, the second right to left,
the third top to bottom, the fourth bottom to top, and the fifth sweeps
diagonally across the surface while its moving frontier remains a literal
45-degree line. Every reveal and unreveal uses a 300ms CSS clip-path transition
with cubic-bezier(0.4, 0, 0.2, 1) easing. The frontier does not rotate. Changing
the direction value changes the clip origin immediately instead of animating
the overlay position.

Covers: UC-004

```tsx
import { Button, RevealAnimation } from '@powercoach/ui'

const revealDirections = [
  ['left-to-right', 'left to right'],
  ['right-to-left', 'right to left'],
  ['top-to-bottom', 'top to bottom'],
  ['bottom-to-top', 'bottom to top'],
  ['diagonal-45-to-135', 'diagonal 45 to 135']
] as const

export function DirectionButtonReveals() {
  return (
    <div>
      {revealDirections.map(([direction, label]) => (
        <RevealAnimation key={direction} render={<Button />} direction={direction}>
          {label}
        </RevealAnimation>
      ))}
    </div>
  )
}
```

### EX-003 - Positioned revealed content on default Button

Context: A consumer needs the revealed copy to scale from a specific content
anchor and then move by a pixel offset while the Button geometry stays fixed.

Expected behavior: RevealAnimation uses a default Button surface with no Button
props. Only the decorative content copy grows by the default scale of 1.2. Its
top-left content corner remains anchored, then the revealed copy moves 20px left
and 4px down. The Button border box, padding, layout, overlay box, and focus
outline are not scaled or distorted.

Covers: UC-005

```tsx
import { Button, RevealAnimation } from '@powercoach/ui'

export function PositionedButtonReveal() {
  return (
    <RevealAnimation render={<Button />} alignX="start" alignY="start" offsetX={-20} offsetY={4}>
      tune plan
    </RevealAnimation>
  )
}
```

### EX-004 - Controlled default Button reveal

Context: A consumer needs external state to control the reveal and visible
probes for lifecycle callbacks.

Expected behavior: RevealAnimation uses a default Button surface with no Button
props. The `reveal` prop controls the visual state, so hover and keyboard focus
do not change the reveal state. The select controls the current unreveal
behavior and the output displays that selection with the latest effective
reveal state, transition start, or transition completion callback. An unreveal
that starts from fully revealed latches the selected behavior. Changing the
select during that unreveal does not redirect it, but the new value applies to
the next unreveal after revealed is completely reached. If a true target
interrupts an unreveal and a second false target interrupts that temporary
recovery before it reaches revealed, the overlay resumes the previously
latched behavior from its current geometry. The configuration attribute follows
the select immediately while the active attribute keeps the cycle latch through
that temporary recovery. Hiding during an initial reveal with no suspended
unreveal cycle forces return. Under reduced motion, each target is reached
immediately and completion is reported without waiting for a CSS transition.

Covers: UC-006, UC-007, UC-010, UC-012, UC-013, UC-014

```tsx
import * as React from 'react'
import { Button, RevealAnimation, type RevealAnimationUnrevealBehavior } from '@powercoach/ui'

export function ControlledButtonReveal() {
  const [revealed, setRevealed] = React.useState(false)
  const [unrevealBehavior, setUnrevealBehavior] =
    React.useState<RevealAnimationUnrevealBehavior>('return')
  const [message, setMessage] = React.useState('idle')

  return (
    <div>
      <label>
        <input
          type="checkbox"
          checked={revealed}
          onChange={(event) => setRevealed(event.currentTarget.checked)}
        />
        reveal
      </label>

      <label>
        unreveal behavior
        <select
          value={unrevealBehavior}
          onChange={(event) =>
            setUnrevealBehavior(event.currentTarget.value as RevealAnimationUnrevealBehavior)
          }
        >
          <option value="return">return</option>
          <option value="continue">continue</option>
        </select>
      </label>

      <RevealAnimation
        render={<Button />}
        reveal={revealed}
        unrevealBehavior={unrevealBehavior}
        onRevealChange={(nextRevealed) => setMessage(nextRevealed ? 'revealed' : 'hidden')}
        onRevealStart={(nextRevealed) => setMessage(nextRevealed ? 'revealing' : 'hiding')}
        onRevealComplete={(nextRevealed) =>
          setMessage(nextRevealed ? 'complete revealed' : 'complete hidden')
        }
      >
        controlled reveal
      </RevealAnimation>

      <output>
        {unrevealBehavior}: {message}
      </output>
    </div>
  )
}
```

### EX-005 - Theme inversion inspection on default Button

Context: A consumer needs to inspect theme inversion behavior on the default
Powercoach Button surface.

Expected behavior: RevealAnimation uses a default Button surface with no Button
props. In light mode, the overlay renders with dark-mode tokens. In dark mode,
the overlay renders with light-mode tokens.

Covers: UC-008

```tsx
import { Button, RevealAnimation } from '@powercoach/ui'

export function ThemeInversionButtonReveal() {
  return (
    <RevealAnimation render={<Button />} reveal>
      inspect reveal
    </RevealAnimation>
  )
}
```

### EX-006 - Phrasing-content catalog reveal

Context: A consumer needs a reveal action inside phrasing content without
enlarging the revealed copy.

Expected behavior: RevealAnimation uses phrasing content mode, renders its root
and owned structural wrappers as `span` elements, aligns the root with
surrounding text on the baseline, and renders one accessible link Button plus
one decorative link Button overlay. The copied reveal content uses a scale of
1, so the surrounding text metrics do not enlarge during reveal. Hovering the
real button or focusing it with the keyboard reveals the overlay, and
click-created DOM focus does not keep the overlay revealed after hover leaves.

Covers: UC-002, UC-005, UC-009

```tsx
import { Button, RevealAnimation } from '@powercoach/ui'

export function InlineCatalogReveal() {
  return (
    <span>
      Open{' '}
      <RevealAnimation contentMode="phrasing" render={<Button variant="link" />} scale={1}>
        exercice catalog
      </RevealAnimation>{' '}
      popup
    </span>
  )
}
```

### EX-007 - Return and continue on default Button

Context: A consumer needs to choose whether unreveal reverses the reveal travel
or continues through the opposite side.

Expected behavior: Both RevealAnimation instances reveal left to right on a
default Button surface with no Button props. After each overlay becomes fully
revealed, leaving hover and keyboard focus makes the first overlay return right
to left toward its starting hidden position. The second overlay continues left
to right toward the opposite hidden position, then resets without a transition
to its starting hidden position. If the second overlay is re-hovered during its
continuing unreveal, it returns toward revealed from its current geometry. If
hover leaves again before that recovery becomes completely revealed, the
overlay resumes the same left-to-right continuing unreveal from its current
geometry without forming an isolated clipped band. Each later reveal starts
again from the left.

Covers: UC-011, UC-014

```tsx
import { Button, RevealAnimation } from '@powercoach/ui'

export function UnrevealBehaviorButtonReveals() {
  return (
    <div>
      <RevealAnimation render={<Button />} direction="left-to-right">
        return
      </RevealAnimation>
      <RevealAnimation render={<Button />} direction="left-to-right" unrevealBehavior="continue">
        continue
      </RevealAnimation>
    </div>
  )
}
```

## RevealAnimation

### Props

| Prop               | Type                                                                                               | Default                | Description                                                                                                                                                                         |
| ------------------ | -------------------------------------------------------------------------------------------------- | ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `render`           | `React.ReactElement`                                                                               | Required               | Surface element to render twice. The element must accept children, forward received props to its real DOM surface, and be safe to render twice.                                     |
| `children`         | `React.ReactNode`                                                                                  | None                   | Content passed to the real surface and the decorative overlay surface.                                                                                                              |
| `reveal`           | `boolean`                                                                                          | None                   | Controlled reveal state. When provided, this value overrides hover and keyboard focus interaction state.                                                                            |
| `contentMode`      | `"flow" \| "phrasing"`                                                                             | `"flow"`               | Selects the HTML content structure. Flow uses `div` elements for the root and owned structural wrappers; phrasing uses `span` elements.                                             |
| `direction`        | `"left-to-right" \| "right-to-left" \| "top-to-bottom" \| "bottom-to-top" \| "diagonal-45-to-135"` | `"diagonal-45-to-135"` | Direction used by the overlay clip path. Direction changes are not animated.                                                                                                        |
| `unrevealBehavior` | `RevealAnimationUnrevealBehavior` (`"return" \| "continue"`)                                       | `"return"`             | Selects whether an unreveal returns toward the configured starting hidden position or continues in the reveal direction toward the opposite hidden position.                        |
| `alignX`           | `"start" \| "center" \| "end"`                                                                     | `"center"`             | Horizontal transform-origin alignment for the revealed content copy, relative to the content copy rectangle.                                                                        |
| `alignY`           | `"start" \| "center" \| "end"`                                                                     | `"center"`             | Vertical transform-origin alignment for the revealed content copy, relative to the content copy rectangle.                                                                          |
| `scale`            | `number`                                                                                           | `1.2`                  | Scale multiplier applied only to the decorative revealed content copy.                                                                                                              |
| `offsetX`          | `number`                                                                                           | `0`                    | Horizontal pixel offset applied to the revealed content copy after scaling.                                                                                                         |
| `offsetY`          | `number`                                                                                           | `0`                    | Vertical pixel offset applied to the revealed content copy after scaling.                                                                                                           |
| `onRevealChange`   | `(revealed: boolean) => void`                                                                      | None                   | Called when the effective target reveal state changes.                                                                                                                              |
| `onRevealStart`    | `(revealed: boolean) => void`                                                                      | None                   | Called when a transition toward the effective target reveal state is requested or begins.                                                                                           |
| `onRevealComplete` | `(revealed: boolean) => void`                                                                      | None                   | Called when the `clip-path` transition reaches the current effective target reveal state. A silent hidden reset after a completed continue unreveal does not call it a second time. |

### Events

RevealAnimation defines no DOM custom events.

`onRevealChange`, `onRevealStart`, and `onRevealComplete` are React callback
props. They report the effective target reveal state and the normal CSS
transition lifecycle for the `clip-path` transition. When `reveal` is
controlled, hover and keyboard focus do not request or emit state changes.
Under reduced motion, a changed target still emits change and start, then emits
completion for the immediately reached current target without waiting for a
`transitionend`. A transitionless hidden reset after a completed continue
unreveal emits none of these callbacks.

### Data Attributes

| Attribute                                  | Element                 | Description                                                                                                                                             |
| ------------------------------------------ | ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `data-motion="reveal"`                     | Root                    | Identifies the RevealAnimation family.                                                                                                                  |
| `data-content-mode="flow"`                 | Root                    | Identifies effective flow content mode when selected or defaulted.                                                                                      |
| `data-content-mode="phrasing"`             | Root                    | Identifies effective phrasing content mode when selected.                                                                                               |
| `data-unreveal-behavior="return"`          | Root                    | Identifies the effective return configuration when selected or defaulted.                                                                               |
| `data-unreveal-behavior="continue"`        | Root                    | Identifies the effective continue configuration when selected.                                                                                          |
| `data-active-unreveal-behavior="return"`   | Root                    | Identifies return as the behavior latched for an unresolved unreveal cycle, including temporary recovery, or for an active forced-return hidden target. |
| `data-active-unreveal-behavior="continue"` | Root                    | Identifies continue as the behavior latched for an unresolved unreveal cycle, including temporary recovery toward revealed.                             |
| `data-reveal-root`                         | Root                    | Marks the wrapper that owns stacking and layout for the real surface and overlay.                                                                       |
| `data-reveal-surface`                      | Real surface wrapper    | Contains the accessible and interactive surface instance.                                                                                               |
| `data-reveal-overlay`                      | Overlay wrapper         | Marks the clipped overlay that covers the real surface border box.                                                                                      |
| `data-reveal-overlay-surface`              | Overlay surface         | Marks the decorative duplicate surface.                                                                                                                 |
| `data-reveal-source`                       | Real content wrapper    | Marks the real surface content.                                                                                                                         |
| `data-reveal-copy`                         | Overlay content wrapper | Marks the decorative content copy that receives offsets.                                                                                                |
| `data-reveal-copy-scale`                   | Overlay content wrapper | Marks the decorative content copy that receives scale and transform origin.                                                                             |

### CSS Variables

Consumers control reveal positioning through props. RevealAnimation exposes the
following CSS variables as part of its data-motion inspection contract:

| Variable            | Element                  | Description                                                                                                    |
| ------------------- | ------------------------ | -------------------------------------------------------------------------------------------------------------- |
| `--reveal-offset-x` | `data-reveal-copy`       | Pixel offset derived from `offsetX`.                                                                           |
| `--reveal-offset-y` | `data-reveal-copy`       | Pixel offset derived from `offsetY`.                                                                           |
| `--reveal-origin`   | `data-reveal-copy-scale` | Transform origin derived from `alignX` and `alignY`.                                                           |
| `--reveal-height`   | `data-reveal-overlay`    | Read-only measured height of the untransformed overlay border box, published by RevealAnimation in CSS pixels. |

## Accessibility

RevealAnimation is decorative. It must not change the accessibility of the real
surface.

The real surface is the only accessible and interactive surface. It owns the
role, accessible name, tab order, focus behavior, pointer behavior, and user
events supplied by the composed surface.

The overlay surface is hidden from assistive technology, inert, not focusable,
and has no pointer interaction. It must not create a second role, second
accessible name, second focus target, or second action.

The overlay must not alter the real surface focus outline. The overlay covers
the real surface border box, including borders, while the focus outline remains
outside the overlay coverage.

## Behavior

RevealAnimation renders the provided `render` element twice. The same children
are passed through the real surface and through the overlay surface so the
decorative copy receives the same public surface composition as the real
content.

RevealAnimation does not inspect or rebuild the surface internals. When the
surface transforms its children through public composition, the overlay receives
that same transformation because it passes through the same surface.

RevealAnimation exports `RevealAnimationContentMode` as the public
`"flow" | "phrasing"` union through the animation family and package entry
points. `contentMode` accepts that type and defaults to `flow`. RevealAnimation
does not expose an `inline` compatibility alias.

RevealAnimation exports `RevealAnimationDirection` as the public
`"left-to-right" | "right-to-left" | "top-to-bottom" | "bottom-to-top" |
"diagonal-45-to-135"` union through the animation family and package entry
points. `direction` accepts that type and defaults to `diagonal-45-to-135`.

RevealAnimation exports `RevealAnimationUnrevealBehavior` as the public
`"return" | "continue"` union through the animation family and package entry
points. `unrevealBehavior` accepts that type and defaults to `return`.

In flow content mode, the root and owned real-surface and overlay structural
wrappers render as `div` elements. In phrasing content mode, those elements
render as `span` elements. The supplied `render` surface is unchanged by
content mode.

Both content modes preserve the existing root box treatment: a relative,
isolated inline-grid box. Flow uses middle alignment and phrasing uses baseline
alignment. The real-surface wrapper remains inline-flex, and the overlay remains
absolutely positioned over the root. `flow` and `phrasing` describe valid HTML
content structure only; neither value promises CSS `display: block` or
`display: inline` behavior.

The root always exposes `data-content-mode` with the effective `flow` or
`phrasing` value, including `flow` when `contentMode` is omitted. The attribute
does not communicate reveal state, CSS display behavior, ARIA semantics, or the
element type of the supplied render surface.

Consumers must choose a content mode that is valid for the external parent and
for RevealAnimation-owned descendants. The supplied render surface must still
accept children and forwarded props and remain safe to render twice.

The overlay covers the full border box of the real surface. The overlay sits
above the real surface border in the revealed area, so the real border is not
visible where the reveal layer is visible. The overlay does not cover the focus
outline.

Only the copied revealed content is scaled. The copied content scales to the
`scale` prop value, which defaults to 1.2. When `scale` is 1, no visual scaling
is applied to the copied content. The surface, overlay, border box, padding, and
layout are not scaled or distorted.

The revealed content is first placed by the same layout as the real content. It
is then scaled by `scale` around the anchor defined by `alignX` and `alignY`.
It is then moved by `offsetX` and `offsetY`. Offsets are applied after scaling,
so an `offsetX` of `-20` moves the revealed copy 20px left, not 24px left.

`alignX="start"` anchors the copied content on its left edge,
`alignX="center"` anchors it on its horizontal center, and `alignX="end"`
anchors it on its right edge. `alignY="start"` anchors the copied content on
its top edge, `alignY="center"` anchors it on its vertical center, and
`alignY="end"` anchors it on its bottom edge.

When the pointer hovers the real surface, RevealAnimation reveals. When the real
surface receives keyboard focus, RevealAnimation reveals. RevealAnimation
returns to its starting state when the real surface is no longer hovered and no
longer has keyboard focus. Hover and keyboard focus activate the same effective
reveal state.

Pointer-created DOM focus does not activate or preserve the reveal state. When
a pointer click moves DOM focus to the real surface, RevealAnimation still
returns to its starting state after the pointer hover leaves unless keyboard
focus or a controlled `reveal` value is keeping it revealed.

If the reveal is already active, another activating interaction does not restart
the transition from the beginning. Other user events do not interfere with the
reveal transition.

RevealAnimation does not add cursor or pointer affordances. Any cursor or
pointer treatment from the real surface is preserved.

When `reveal` is provided, it controls the effective reveal state. Hover and
keyboard focus do not change the RevealAnimation state while `reveal` is
controlled.

An unreveal begins when the effective target changes to hidden while the
overlay is completely at its revealed clip path. An overlay that is initially
mounted with `reveal={true}` is completely revealed. A direction change that
immediately places a true target at the revealed clip path also leaves it
completely revealed.

When an unreveal begins, RevealAnimation latches the current
`unrevealBehavior` for that completely revealed cycle. `return` moves toward
the configured starting hidden clip path. `continue` moves in the reveal
direction toward the opposite hidden clip path. Changing `unrevealBehavior`
during that unreveal updates the public configuration but does not redirect the
active motion.

If hover, keyboard focus, or controlled `reveal` changes the target back to
revealed during that unreveal, the overlay transitions from its current clip
geometry toward revealed and preserves the cycle latch while this temporary
recovery remains incomplete. If the effective target changes to hidden again
before the overlay becomes completely revealed, RevealAnimation resumes the
preserved return or continue behavior from its current clip geometry toward the
same latched hidden endpoint. A change to `unrevealBehavior` during the
temporary recovery does not replace that latch.

When the temporary recovery reaches the completely revealed clip path, its
preserved latch is cleared. The next unreveal then latches the current
`unrevealBehavior`. The latch is also cleared when the resumed hidden target
completes or when a direction change invalidates the cycle.

If the effective target changes to hidden during an initial reveal that has not
become completely revealed and has no preserved unreveal cycle, the motion is a
forced return from the interrupted reveal. RevealAnimation latches `return`
for that active hidden target regardless of `unrevealBehavior` and moves from
the current clip geometry toward the starting hidden clip path. If a true target
interrupts that forced return, it is not preserved as a resumable unreveal
cycle.

The root always exposes `data-unreveal-behavior` with the current effective
`return` or `continue` configuration, including `return` when
`unrevealBehavior` is omitted. While an unreveal cycle is unresolved, the root
also exposes `data-active-unreveal-behavior` with its sampled behavior. The
active attribute remains present when a true target temporarily recovers toward
revealed and the sampled cycle can still resume. An active forced-return hidden
target also exposes `data-active-unreveal-behavior="return"`, but that value is
removed rather than preserved if a true target interrupts it. A prop change
updates `data-unreveal-behavior` immediately without changing the active latch.
The active attribute is removed when revealed completes, hidden completes, or a
direction change invalidates the cycle.

For `direction="diagonal-45-to-135"`, RevealAnimation measures the untransformed
overlay border-box height before the first visible diagonal state and publishes
that geometry through `--reveal-height`. It updates the value when the overlay
height changes. Geometry measurement and resize changes do not represent reveal
state changes and do not emit reveal lifecycle callbacks.

The overlay and revealed content invert the active theme mode by applying the
opposite theme class on the overlay. When global dark mode is not active, the
overlay renders under dark mode. When global dark mode is active, the overlay
renders under light mode. Applying `dark` or `light` on the overlay must make
the overlay and its descendants receive the inverted token values from the
active theme.

## Motion

RevealAnimation uses CSS transitions.

The visible reveal is driven by `clip-path` on `data-reveal-overlay`. The
content copy does not own the clipping animation.

The normal lifecycle aligns to the CSS `TransitionEvent` for the `clip-path`
transition on `data-reveal-overlay`.

The default direction is `diagonal-45-to-135`. The supported directions map to
clip-path as follows:

| Direction            | Starting hidden clip path                                                                         | Revealed clip path                                                                                    | Opposite hidden clip path                                                                                 |
| -------------------- | ------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| `left-to-right`      | `inset(0 100% 0 0)`                                                                               | `inset(0 0 0 0)`                                                                                      | `inset(0 0 0 100%)`                                                                                       |
| `right-to-left`      | `inset(0 0 0 100%)`                                                                               | `inset(0 0 0 0)`                                                                                      | `inset(0 100% 0 0)`                                                                                       |
| `top-to-bottom`      | `inset(0 0 100% 0)`                                                                               | `inset(0 0 0 0)`                                                                                      | `inset(100% 0 0 0)`                                                                                       |
| `bottom-to-top`      | `inset(100% 0 0 0)`                                                                               | `inset(0 0 0 0)`                                                                                      | `inset(0 0 100% 0)`                                                                                       |
| `diagonal-45-to-135` | `polygon(0 0, 0 0, calc(0px - var(--reveal-height)) 100%, calc(0px - var(--reveal-height)) 100%)` | `polygon(0 0, calc(100% + var(--reveal-height)) 0, 100% 100%, calc(0px - var(--reveal-height)) 100%)` | `polygon(calc(100% + var(--reveal-height)) 0, calc(100% + var(--reveal-height)) 0, 100% 100%, 100% 100%)` |

The diagonal polygons make each moving frontier's horizontal displacement
equal its physical vertical displacement. The reveal frontier and the
continuing unreveal frontier therefore remain literal 45-degree lines for every
surface width and height rather than changing angle with the surface aspect
ratio.

Reveal always transitions from the configured starting hidden clip path toward
the revealed clip path. A `return` unreveal transitions from revealed toward
the starting hidden clip path. A `continue` unreveal transitions from revealed
toward the opposite hidden clip path. After a continue unreveal completes,
RevealAnimation reports completion once, then resets from opposite hidden to
starting hidden without a transition or lifecycle callback.

Reveal and unreveal transitions use a 300ms duration and
`cubic-bezier(0.4, 0, 0.2, 1)` easing. A true target that interrupts an active
unreveal transitions from the current visual clip state toward revealed while
preserving the sampled cycle latch. A false target that interrupts that
temporary recovery before it reaches revealed resumes the preserved endpoint
from the current visual clip state. A false target that instead interrupts an
initial incomplete reveal with no preserved cycle transitions from the current
visual clip state toward starting hidden with `return`.

Every effective target change emits one `onRevealChange` and one
`onRevealStart`. For a false, true, false sequence in which the first false and
the true targets are interrupted, neither interrupted target emits
`onRevealComplete`; only the final false target completes. Transition events
for interrupted targets are stale and do not complete them. Completion is
reported only after `clip-path` reaches the current effective target. A
completed continue target is disarmed before its silent hidden reset, so the
reset and any stale event after it emit no lifecycle callback.

Changing `direction` changes the clip-path direction immediately without
animating from the previous direction. It cancels the active transition and
sampled or forced-return behavior, invalidates pending completion for the
abandoned motion, and immediately places the overlay at revealed when the
effective target is true or starting hidden when it is false. The direction
change emits no reveal lifecycle callback. A true target placed at revealed is
eligible to use the current `unrevealBehavior` for its next unreveal.

Under reduced motion, `clip-path` reaches each requested reveal or unreveal
target immediately with no CSS transition. A completed continue unreveal
reaches opposite hidden, emits completion once, then resets silently to
starting hidden. `onRevealChange` and `onRevealStart` still report the target,
and `onRevealComplete` reports the immediately reached current target without
waiting for `transitionend`. If reduced motion becomes active during temporary
recovery toward revealed, that true target reaches revealed immediately,
completes once, and clears the preserved latch. If it becomes active during a
resumed hidden target, that target reaches its preserved endpoint immediately
and completes once before a continue cycle resets silently. When reduced motion
is already active, a true target completes and clears any earlier cycle before
a later false target samples the then-current `unrevealBehavior`.

## Use Cases

### UC-001 - Render a duplicated default Button surface

Given a consumer renders RevealAnimation with `render={<Button />}` and text
children
When the component is displayed
Then it renders one real default Button and one decorative default Button
overlay using the same children

### UC-002 - Reveal from hover and keyboard focus

Given a consumer renders RevealAnimation with `render={<Button />}` and text
children
When the real default Button is hovered, receives keyboard focus, or keeps DOM
focus after a pointer click
Then the overlay reveals only for hover or keyboard focus, returns to the
starting state after the Button is no longer hovered or keyboard-focused, and
pointer-created DOM focus does not keep it revealed after hover leaves

### UC-003 - Preserve Button accessibility and interaction

Given a consumer renders RevealAnimation with `render={<Button />}` and text
children
When the real default Button is inspected or activated
Then only the real Button is accessible, focusable, interactive, and able to
receive pointer events

### UC-004 - Select a reveal direction

Given a consumer renders RevealAnimation with `render={<Button />}` and omits
`direction` or supplies a supported `direction`
When the reveal state changes
Then the overlay defaults to diagonal-45-to-135 when `direction` is omitted or
reveals from the selected explicit direction using clip-path, including a
literal 45-degree moving frontier for diagonal-45-to-135 on every surface aspect
ratio, and reveal and default return unreveal use a 300ms CSS transition with
cubic-bezier(0.4, 0, 0.2, 1) easing

### UC-005 - Position and scale only the revealed content

Given a consumer renders RevealAnimation with `render={<Button />}`, `alignX`,
`alignY`, `scale`, `offsetX`, and `offsetY`
When the content is revealed
Then only the decorative content copy scales by the requested scale multiplier,
defaulting to 1.2 when `scale` is omitted, around the selected content anchor
and moves by the requested pixel offsets

### UC-006 - Control reveal externally

Given a consumer renders RevealAnimation with `render={<Button />}` and a
controlled `reveal` value
When the `reveal` value changes
Then RevealAnimation follows that value and ignores hover and keyboard focus
state as state inputs

### UC-007 - Observe reveal lifecycle

Given a consumer renders RevealAnimation with `render={<Button />}` and reveal
lifecycle callbacks
When the effective reveal state changes, starts transitioning, or completes
Then the callbacks report the effective target reveal state

### UC-008 - Invert theme mode in the overlay

Given a consumer renders RevealAnimation with `render={<Button />}` in light or
dark mode
When the overlay is visible
Then the overlay and revealed content use the opposite light or dark token mode
from the real Button

### UC-009 - Select the phrasing content mode

Given a consumer renders RevealAnimation with `contentMode="phrasing"`, a link
Button surface, and `scale={1}` inside surrounding text
When the component is displayed and revealed by hover or keyboard focus
Then the root and owned structural wrappers are `span` elements, the root
aligns to the surrounding text baseline, the surface remains unchanged, and the
decorative copied content remains at scale 1

### UC-010 - Reach each target under reduced motion

Given a consumer renders RevealAnimation with controlled reveal state and
reveal lifecycle callbacks while reduced motion is active
When the controlled reveal target changes
Then the overlay reaches the target immediately and change, start, and
completion callbacks report the current target without waiting for a CSS
transition event, while a completed continue unreveal resets silently from its
opposite hidden position to its starting hidden position

### UC-011 - Select return or continue unreveal travel

Given a consumer renders RevealAnimation with `render={<Button />}`, a supported
`direction`, and an omitted or explicit `unrevealBehavior`
When the overlay is completely revealed and unreveal begins
Then `return` or the omitted prop moves the overlay toward the configured
starting hidden position, while `continue` moves it in the reveal direction
toward the opposite hidden position and then resets silently to starting hidden

### UC-012 - Latch behavior for one unreveal

Given a consumer renders RevealAnimation with controlled reveal state and an
`unrevealBehavior` value while the overlay is completely revealed
When unreveal begins, the prop changes during that unreveal, or the unreveal is
interrupted by a new true target
Then the unresolved unreveal cycle keeps its initially latched behavior until
hidden completes, revealed completes, or a direction change invalidates it,
`data-unreveal-behavior` follows the current configuration,
`data-active-unreveal-behavior` preserves the sampled cycle latch including
during temporary recovery toward revealed, a prop change does not redirect the
cycle, and the next unreveal after the overlay becomes completely revealed
latches the then-current value

### UC-013 - Return after an initial incomplete reveal

Given a consumer renders RevealAnimation with `unrevealBehavior="continue"`
while an initial reveal transition is still incomplete and no sampled
unreveal cycle is suspended
When the effective target changes to hidden
Then the overlay latches `return`, transitions from its current clip geometry
toward the configured starting hidden position, and never continues through the
opposite hidden position for that interrupted reveal; if a true target
interrupts this forced return, it does not become a resumable unreveal cycle

### UC-014 - Resume an interrupted unreveal

Given a consumer renders RevealAnimation with a supported direction and a
sampled `unrevealBehavior` after the overlay became completely revealed
When a false target starts unreveal, a true target interrupts it, and another
false target interrupts the temporary recovery before it reaches revealed
Then the overlay preserves `data-active-unreveal-behavior` through the temporary
recovery and resumes the sampled hidden endpoint from its current clip geometry
without forming an isolated clipped band; the interrupted first false and true
targets emit no completion, only the final false target completes, and a
completed continue cycle resets silently to starting hidden
