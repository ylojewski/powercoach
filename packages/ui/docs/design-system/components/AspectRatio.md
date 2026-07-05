---
revision: 1
date: 2026-08-14
---

# AspectRatio

## Overview

AspectRatio renders a ratio-constrained media surface. Consumers provide a
sizing constraint, such as a width or height, and `ratio` supplies the preferred
relationship between the two axes.

The surface provides a relative positioning context and clips visual overflow.
Direct `img`, `svg`, and `video` children fill it and use the selected `fit`
treatment. Other children remain consumer-owned content and receive no automatic
sizing or positioning.

AspectRatio renders a `div` by default. Its Base UI `render` prop lets consumers
replace that element while preserving the ratio surface, content behavior, and
prop composition. AspectRatio adopts Base UI render semantics; Base UI does not
provide an AspectRatio primitive whose state or accessibility behavior is
inherited.

## Anatomy

AspectRatio exposes one public component.

- `AspectRatio`: renders one native `div` by default or one consumer-supplied
  surface through Base UI render semantics.

```tsx
<AspectRatio ratio={16 / 9}>
  <img src="/images/training-session.jpg" alt="Athlete starting a sprint" />
</AspectRatio>
```

## Examples

### EX-001 - Default cropped media surface

Context: A consumer needs a landscape training image to fill a sixteen-by-nine
surface.

Expected behavior: AspectRatio renders one `div` at the requested preferred
ratio. The direct image fills the surface, uses the default `cover` fit, retains
its alternative text, and is visually clipped at the surface boundary.

Covers: UC-001, UC-002, UC-008

```tsx
import { AspectRatio } from '@powercoach/ui'

export function TrainingSessionImage() {
  return (
    <AspectRatio ratio={16 / 9} className="w-80 bg-muted">
      <img src="/images/training-session.jpg" alt="Athlete starting a sprint" />
    </AspectRatio>
  )
}
```

### EX-002 - Contained direct media

Context: A consumer needs to display a square training diagram without cropping
its artwork.

Expected behavior: The direct `svg` fills the square surface and uses `contain`,
so the complete view box remains visible. The SVG's consumer-provided image
semantics remain intact.

Covers: UC-001, UC-003, UC-008

```tsx
import { AspectRatio } from '@powercoach/ui'

export function ContainedTrainingDiagram() {
  return (
    <AspectRatio ratio={1} fit="contain" className="size-64 bg-muted">
      <svg viewBox="0 0 160 100" role="img" aria-label="Three sprint phases">
        <rect width="160" height="100" fill="currentColor" opacity="0.1" />
        <path d="M16 76 L64 38 L104 60 L144 20" fill="none" stroke="currentColor" />
      </svg>
    </AspectRatio>
  )
}
```

### EX-003 - Replacement figure with consumer overlay

Context: A consumer needs figure semantics and a caption positioned over a
cropped session image.

Expected behavior: The childless `figure` replaces the default `div` as the one
final surface. AspectRatio children render once, the direct image fills the
surface, and the consumer positions the caption against the relative surface.
The replacement keeps its consumer-owned labeling semantics.

Covers: UC-004, UC-005, UC-008

```tsx
import { AspectRatio } from '@powercoach/ui'

export function SessionFigure() {
  return (
    <AspectRatio
      ratio={4 / 3}
      className="w-72 bg-muted"
      render={<figure aria-labelledby="session-caption" />}
    >
      <img src="/images/session-recap.jpg" alt="" />
      <figcaption id="session-caption" className="absolute inset-x-0 bottom-0 bg-background/80 p-2">
        Afternoon sprint session
      </figcaption>
    </AspectRatio>
  )
}
```

### EX-004 - Callback render with visible composition probe

Context: A consumer needs an interactive ratio surface and wants to verify the
final element, empty callback state, native event, and ref composition.

Expected behavior: The callback receives complete merged props and an empty
public state object. It spreads those props onto one `button`, including the
children and ref. Activating the button runs the consumer event and visibly
reports that the ref resolves to the final button and that the callback state
has no fields.

Covers: UC-005, UC-006, UC-008

```tsx
import * as React from 'react'
import { AspectRatio } from '@powercoach/ui'

export function InteractiveSessionPreview() {
  const finalElement = React.useRef<Element | null>(null)
  const [probe, setProbe] = React.useState('Activate the preview')

  return (
    <div className="grid w-72 gap-2">
      <AspectRatio
        ratio={3 / 2}
        aria-label="Open afternoon session"
        ref={(node) => {
          finalElement.current = node
        }}
        onClick={() => {
          setProbe(finalElement.current?.tagName ?? 'Missing element')
        }}
        render={(props, state) => (
          <button
            {...props}
            type="button"
            onClick={(event) => {
              props.onClick?.(event)
              setProbe(`${finalElement.current?.tagName} / ${Object.keys(state).length}`)
            }}
          />
        )}
      >
        <img src="/images/session-preview.jpg" alt="" />
      </AspectRatio>
      <output aria-live="polite">Final element / state fields: {probe}</output>
    </div>
  )
}
```

### EX-005 - Consumer ratio override and nested content

Context: A consumer needs a wide presentation surface while retaining a square
ratio value for a later style change, and owns the layout of nested content.

Expected behavior: The inline `aspectRatio` style produces a three-by-one final
surface and takes precedence over `ratio={1}`. The nested image is not a direct
media child, so AspectRatio does not size or fit it; the consumer wrapper owns
that layout.

Covers: UC-002, UC-003, UC-007

```tsx
import { AspectRatio } from '@powercoach/ui'

export function ConsumerOwnedPresentation() {
  return (
    <AspectRatio ratio={1} style={{ aspectRatio: '3 / 1' }} className="w-96 bg-muted">
      <div className="grid h-full grid-cols-3 items-center gap-3 p-3">
        <img
          className="size-16 object-cover"
          src="/images/session-thumbnail.jpg"
          alt="Sprint session thumbnail"
        />
        <span className="col-span-2">Afternoon sprint session</span>
      </div>
    </AspectRatio>
  )
}
```

### EX-006 - Namespace access

Context: A consumer uses the package component namespace instead of the direct
named export.

Expected behavior: `Components.AspectRatio` and `Ui.Components.AspectRatio`
reference the same public AspectRatio component and render the same ratio and
fit behavior.

Covers: UC-009

```tsx
import { Components, Ui } from '@powercoach/ui'

export function NamespacedRatioSurfaces() {
  return (
    <div className="grid grid-cols-2 gap-4">
      <Components.AspectRatio ratio={1} className="bg-muted">
        <img src="/images/mobility.jpg" alt="Athlete stretching" />
      </Components.AspectRatio>
      <Ui.Components.AspectRatio ratio={1} fit="contain" className="bg-muted">
        <img src="/images/strength.jpg" alt="Athlete lifting a barbell" />
      </Ui.Components.AspectRatio>
    </div>
  )
}
```

## AspectRatio

### Props

`AspectRatioProps` extends Base UI
`useRender.ComponentProps<"div", Record<string, never>>` with the `ratio` and
`fit` props below.

| Prop                  | Type                                                                      | Default   | Description                                                                                                                                           |
| --------------------- | ------------------------------------------------------------------------- | --------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ratio`               | `number`                                                                  | None      | Required preferred width divided by height. AspectRatio adds no runtime validation, clamping, fallback, or error behavior.                            |
| `fit`                 | `"contain" \| "cover"`                                                    | `"cover"` | Selects the object-fit treatment for direct `img`, `svg`, and `video` children.                                                                       |
| `render`              | `ReactElement \| ((props, state: Record<string, never>) => ReactElement)` | None      | Replaces the default `div` through Base UI render semantics.                                                                                          |
| `className`           | `string`                                                                  | None      | Composes a consumer class with the component's internal layout classes on the final element.                                                          |
| `style`               | `React.CSSProperties`                                                     | None      | Merges consumer styles onto the final element. A consumer `style.aspectRatio` value takes precedence over the component's class-based ratio behavior. |
| native div attributes | `useRender.ComponentProps<"div", Record<string, never>>` inherited props  | None      | Passed to the default `div` or merged onto the replacement element, including native events, `aria-*`, consumer `data-*`, children, and ref.          |

`ratio` and `fit` are consumed AspectRatio props. They are not forwarded as
native attributes, exposed as render callback state, or emitted as data
attributes.

### Events

AspectRatio defines no custom events. Native event handlers pass through and
compose according to Base UI render semantics.

### Data Attributes

AspectRatio defines no component-authored or state-derived data attributes.
Consumer `data-*` attributes pass through to the final element.

### CSS Variables

AspectRatio defines no public CSS variables.

## Accessibility

AspectRatio is a visual layout primitive. Its default `div` adds no role,
accessible name, focusability, keyboard behavior, live-region behavior, or ARIA
state. `ratio` and `fit` affect presentation only.

Children retain their native semantics. Consumers remain responsible for image
alternative text, video captions and controls, interactive descendants, valid
HTML, and any labeling required by their content. Visual overflow clipping does
not add `aria-hidden` or otherwise remove descendants from the accessibility
tree. Consumers placing interactive descendants inside the clipped surface must
keep focus indicators perceivable.

A replacement element contributes its own native semantics. Consumers must
choose an element valid for the external parent and supplied children.
AspectRatio does not infer, suppress, or repair replacement semantics.

## Behavior

Without `render`, AspectRatio applies its effective props and children to one
default `div`. The final element establishes the requested preferred ratio,
acts as a relative positioning context, and clips visual overflow. AspectRatio
adds no width, height, minimum size, display, padding, border, typography,
absolute positioning, or interaction behavior. A consumer or containing layout
must supply the sizing constraint from which the preferred ratio operates.
Explicitly constraining both axes can override the preferred ratio under normal
CSS sizing rules.

The `ratio` prop accepts the JavaScript `number` type and has no default.
Consumers should supply a finite value greater than zero to express a usable
width-to-height relationship. AspectRatio does not validate, warn, throw, clamp,
or substitute a fallback for other numeric values; their final layout follows
the browser's CSS handling. The technique used internally to apply the ratio is
not public API.

Every direct child whose native element is `img`, `svg`, or `video` fills the
final surface in both axes. `fit="cover"` applies cover fitting and
`fit="contain"` applies contain fitting to every such direct child. `cover` is
used when `fit` is omitted or explicitly `undefined`.

The direct-child behavior does not target nested media, `picture`, `canvas`, or
other elements. Nonmatching children receive no component-authored sizing or
fit treatment. Descendants remain in normal flow; AspectRatio does not
absolutely position them or stack multiple children. Consumers own overlays,
nested-media layout, and arbitrary descendant positioning.

Consumer `className` composes with AspectRatio's layout classes on the final
element. AspectRatio guarantees composition, not internal class names, class
ordering, selector syntax, or deterministic replacement through conflicting
utility classes. Consumer `style` merges onto the final element with normal
inline precedence over class-based defaults. A valid consumer
`style.aspectRatio` therefore overrides the ratio-derived class behavior.

With an element `render` value, Base UI clones the supplied childless element
and merges AspectRatio's effective props with the element's own props onto one
final element. AspectRatio children remain authoritative and render exactly
once. Class names compose, style objects merge, native event handlers compose,
and ordinary colliding props supplied on the render element take precedence.
The ref passed to AspectRatio and a ref already present on the render element
merge and resolve to the same final DOM element.

With a callback `render` value, AspectRatio passes the complete merged element
props, including children, className, style, native attributes, events, and ref.
The callback receives an empty `Record<string, never>` as its second argument;
AspectRatio defines no public state fields. The callback must spread all
received props onto exactly one root, preserve the received ref, and render
`props.children` exactly once without replacing, reordering, duplicating, or
decorating them.

A native replacement must be a non-void element that accepts AspectRatio
children and received props. A custom component must accept the merged ref and
spread all received props onto one underlying DOM element. Render replacement
does not add an extra wrapper.

The package exports `AspectRatio` and `AspectRatioProps` as named exports from
`@powercoach/ui`. It also exposes the runtime component through
`Components.AspectRatio` and `Ui.Components.AspectRatio`. AspectRatio defines no
`Root` part, `AspectRatioRoot`, separate family namespace object, or public
component deep import.

## Motion

AspectRatio has no motion behavior.

## Use Cases

### UC-001 - Render a ratio-constrained surface

Given a consumer supplies a sizing constraint and a usable `ratio`
When AspectRatio renders without `render`
Then one `div` provides the requested preferred width-to-height relationship

### UC-002 - Fill and crop direct media by default

Given a direct `img`, `svg`, or `video` child is rendered without `fit`
When the ratio surface is displayed
Then the media fills both axes and uses cover fitting within the clipped surface

### UC-003 - Contain direct media and preserve descendant boundaries

Given a consumer selects `fit="contain"` or supplies content outside the direct
eligible media set
When AspectRatio renders
Then direct eligible media uses contain fitting and all other content remains
consumer-owned without automatic sizing or positioning

### UC-004 - Replace the default element

Given a consumer supplies a compatible childless element through `render`
When AspectRatio renders
Then one replacement element receives the merged ratio-surface props and
authoritative children while preserving its consumer-owned native semantics

### UC-005 - Use callback render semantics

Given a consumer supplies a callback through `render`
When AspectRatio renders
Then the callback receives complete merged props and an empty public state
object and returns one root that preserves the received ref and children

### UC-006 - Merge native props, events, and refs

Given a consumer supplies native attributes, classes, styles, events, or refs to
AspectRatio or its render element
When AspectRatio renders
Then Base UI render semantics compose those values onto the one final element
and all merged refs resolve to that element

### UC-007 - Override the preferred ratio with inline style

Given a consumer supplies both `ratio` and a valid `style.aspectRatio`
When AspectRatio renders
Then the consumer's inline aspect ratio determines the final surface ratio

### UC-008 - Preserve consumer-owned accessibility

Given a consumer supplies semantic children, ARIA attributes, or a semantic
render replacement
When AspectRatio renders
Then those semantics reach the final element and children without additional
roles, names, focus behavior, keyboard behavior, ARIA state, or hiding

### UC-009 - Use package namespace access

Given a consumer accesses AspectRatio through `Components.AspectRatio` or
`Ui.Components.AspectRatio`
When the component renders
Then it provides the same public ratio, fit, composition, and accessibility
behavior as the direct named export
