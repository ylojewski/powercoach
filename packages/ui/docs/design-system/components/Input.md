---
revision: 3
date: 2026-08-05
---

# Input

## Overview

Input renders a Powercoach text-entry field on top of Base UI Input semantics.
Use it when a native input needs the Powercoach field surface, a mandatory
decorative visual identifier, and the shared field emphasis interaction.

Input does not reinvent Base UI Input behavior. Base UI owns the native input
semantics, controlled and uncontrolled value behavior, Field integration,
native events, validation state, render composition, and control data
attributes. Powercoach Input owns the compound Root, AddOn, and Control
anatomy, logical AddOn placement, size treatments, visual presentation, and
composition with the public field-emphasis Tailwind utility.

field-emphasis is a reusable CSS utility rather than an animation component.
Input.Root consumes it automatically, and other form-control families can use
the same documented class, CSS variables, and AddOn hook.

Input also owns the package-level hard-shadow CSS contract. The contract shares
one foreground hard-shadow result without coupling consuming families through
component internals, copied values, or consumer-specific state rules.

## Anatomy

Input is a non-callable namespace with three public parts.

- Input.Root: renders the square field surface and coordinates layout, size,
  and field emphasis.
- Input.AddOn: renders the mandatory decorative visual identifier at logical
  inline start or inline end.
- Input.Control: renders Base UI Input with Powercoach control styling.

Each Root requires exactly one AddOn and one Control.

```tsx
<Input.Root>
  <Input.AddOn>
    <Icon />
  </Input.AddOn>
  <Input.Control />
</Input.Root>
```

### Public Exports

| Export                         | Description                                                              |
| ------------------------------ | ------------------------------------------------------------------------ |
| Input                          | Namespace object with Root, AddOn, and Control keys. It is not callable. |
| InputRoot                      | Direct Root component export.                                            |
| InputAddOn                     | Direct AddOn component export.                                           |
| InputControl                   | Direct Control component export.                                         |
| InputNamespace                 | Type of the public Input namespace object.                               |
| FieldSize                      | Package-level union of xs, md, and xl shared by field families.          |
| InputSize                      | Source-compatible alias of FieldSize.                                    |
| InputAddOnPosition             | Union of start and end.                                                  |
| InputRootProps                 | Public Root props.                                                       |
| InputAddOnProps                | Public AddOn props.                                                      |
| InputControlProps              | Base UI Input props preserved by Control.                                |
| InputControlState              | Alias of Base UI Input.State.                                            |
| InputControlChangeEventReason  | Alias of Base UI Input.ChangeEventReason.                                |
| InputControlChangeEventDetails | Alias of Base UI Input.ChangeEventDetails.                               |

## Examples

### EX-001 - Default xl Input with placeholder

Context: A consumer needs a labeled text field with the default Powercoach size
and a visual identifier.

Expected behavior: Input renders at size xl with a logical-start decorative
AddOn, foreground-at-50-percent placeholder text, and the resting field
treatment. Pointer hover alone does not emphasize the field. Focusing Control
activates field-emphasis and blurring reverses it.

Covers: UC-001, UC-002, UC-004, UC-006, UC-007, UC-008

```tsx
import { ALargeSmall } from 'lucide-react'
import { Input } from '@powercoach/ui'

export function WorkoutNameInput() {
  return (
    <label>
      Workout name
      <Input.Root>
        <Input.AddOn>
          <ALargeSmall />
        </Input.AddOn>
        <Input.Control placeholder="Some placeholder" />
      </Input.Root>
    </label>
  )
}
```

### EX-002 - Controlled value and logical-end AddOn

Context: A consumer needs to control one field value and initialize another
field without controlling subsequent edits.

Expected behavior: The first Control preserves Base UI controlled value and
onValueChange behavior and places its mandatory AddOn at logical inline end.
The second Control preserves Base UI uncontrolled defaultValue behavior. Both
fields use the default xl size, and the decorative AddOns remain inert.

Covers: UC-001, UC-003, UC-004, UC-005

```tsx
'use client'

import * as React from 'react'
import { Search, UserRound } from 'lucide-react'
import { Input } from '@powercoach/ui'

export function ValueInputs() {
  const [query, setQuery] = React.useState('Some value')

  return (
    <div>
      <label>
        Search
        <Input.Root>
          <Input.AddOn position="end">
            <Search />
          </Input.AddOn>
          <Input.Control value={query} onValueChange={setQuery} />
        </Input.Root>
      </label>

      <label>
        Athlete
        <Input.Root>
          <Input.AddOn>
            <UserRound />
          </Input.AddOn>
          <Input.Control defaultValue="Yann" />
        </Input.Root>
      </label>
    </div>
  )
}
```

### EX-003 - Proportional Input sizes

Context: A consumer needs compact, medium, and asset-sized text fields.

Expected behavior: Each Root applies its documented Tailwind size treatment to
the field height, AddOn side, Control padding, typography, descendant SVG,
focus offset, and hard shadow while preserving the standard border and
separator widths.

Covers: UC-002, UC-004, UC-007, UC-008

```tsx
import { Hash } from 'lucide-react'
import { Input } from '@powercoach/ui'

export function InputSizes() {
  return (
    <div>
      <Input.Root size="xs">
        <Input.AddOn>
          <Hash />
        </Input.AddOn>
        <Input.Control aria-label="Extra-small code" placeholder="xs" />
      </Input.Root>

      <Input.Root size="md">
        <Input.AddOn>
          <Hash />
        </Input.AddOn>
        <Input.Control aria-label="Medium code" placeholder="md" />
      </Input.Root>

      <Input.Root size="xl">
        <Input.AddOn>
          <Hash />
        </Input.AddOn>
        <Input.Control aria-label="Extra-large code" placeholder="xl" />
      </Input.Root>
    </div>
  )
}
```

### EX-004 - Base UI Field integration

Context: A consumer needs accessible labeling, description, validation, and
form participation around Powercoach Input.

Expected behavior: Input.Control automatically participates in Field.Root.
Field.Label names the Control, Field.Description describes it, Field.Root name
owns form submission naming, and the Base UI validity and interaction data
attributes remain on Control.

Covers: UC-001, UC-005, UC-006

```tsx
import { AtSign } from 'lucide-react'
import { Field } from '@base-ui/react/field'
import { Input } from '@powercoach/ui'

export function EmailField() {
  return (
    <Field.Root name="email">
      <Field.Label>Email</Field.Label>
      <Input.Root size="md">
        <Input.AddOn>
          <AtSign />
        </Input.AddOn>
        <Input.Control type="email" required placeholder="coach@example.com" />
      </Input.Root>
      <Field.Description>Used for workout notifications.</Field.Description>
      <Field.Error />
    </Field.Root>
  )
}
```

### EX-005 - Shared field-emphasis utility

Context: Another form-control surface needs the same Powercoach focus
interaction without composing Input or creating an animation component.

Expected behavior: The generic host uses the public field-emphasis class,
Tailwind theme-derived variables, and data-field-addon hook. Focus within the
textarea applies the same border, translation, hard shadow, and decorative rail
inversion. Reduced motion removes the transition duration while preserving the
focused result.

Covers: UC-008, UC-009, UC-010

```tsx
import { MessageSquareText } from 'lucide-react'

export function EmphasizedNotesField() {
  return (
    <label>
      Notes
      <div className="flex min-w-0 field-emphasis border border-foreground/30 bg-background text-foreground [--field-emphasis-offset:--spacing(0.5)] [--field-emphasis-shadow-offset:--spacing(1)]">
        <span
          aria-hidden="true"
          inert
          data-field-addon
          className="pointer-events-none flex w-9 shrink-0 items-center justify-center border-e border-foreground/30 bg-muted text-muted-foreground [&_svg]:size-4 [&_svg]:shrink-0"
        >
          <MessageSquareText />
        </span>
        <textarea className="min-w-0 flex-1 bg-transparent px-3 text-base/5 text-foreground outline-none placeholder:text-foreground/50" />
      </div>
    </label>
  )
}
```

### EX-006 - Shared hard shadow and consumer override

Context: A consumer needs the package hard shadow on one square surface and a
deliberately shadowless treatment on another.

Expected behavior: The first surface resolves the public hard-shadow variable
to the default positive 0.25rem foreground shadow. The second surface uses the
same public application utility, then removes the shadow with a later
conflicting consumer utility. Non-conflicting surface styles remain applied.

Covers: UC-011, UC-012

```tsx
export function HardShadowSurfaces() {
  return (
    <div className="grid gap-4">
      <div className="border border-foreground bg-background p-4 shadow-(--hard-shadow)">
        shared hard shadow
      </div>
      <div className="border border-foreground bg-background p-4 shadow-(--hard-shadow) shadow-none">
        consumer-owned shadow override
      </div>
    </div>
  )
}
```

## Root

### Props

The package exports the canonical shared size contract below. InputSize remains
available as an alias, so revision 1 consumer imports remain source-compatible.

```ts
type FieldSize = 'xs' | 'md' | 'xl'
type InputSize = FieldSize
```

InputRootProps extends the native ref-capable div props.

| Prop             | Type                               | Default  | Description                                                                                                                                 |
| ---------------- | ---------------------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| size             | xs, md, or xl                      | xl       | Selects the coordinated Root, AddOn, Control, SVG, and emphasis metric treatment.                                                           |
| children         | React.ReactNode                    | Required | Requires exactly one Input.AddOn and one Input.Control. No other public part is accepted.                                                   |
| className        | Native div className               | None     | Composes consumer classes with the Powercoach Root classes.                                                                                 |
| style            | React.CSSProperties                | None     | Composes consumer styles with the Root style.                                                                                               |
| native div props | React.ComponentPropsWithRef of div | None     | Native div attributes, native events, consumer aria and data attributes, and the div ref pass through except for reserved Input attributes. |

Root forwards its ref to the rendered div. Root does not expose a render prop
and is not polymorphic.

### Events

Root defines no custom events. Supported native div events pass through Root.

### Data Attributes

| Attribute | Description                                             |
| --------- | ------------------------------------------------------- |
| data-size | Contains xs, md, or xl for the selected size treatment. |

Consumer data attributes pass through except for data-size. Root does not copy
Base UI Control state attributes.

### CSS Variables

Input.Root consumes the public field-emphasis variables. Its size treatment
sets both variables through Tailwind theme functions.

| Variable                       | xl utility default                            | Description                                           |
| ------------------------------ | --------------------------------------------- | ----------------------------------------------------- |
| --field-emphasis-offset        | [--field-emphasis-offset:--spacing(0.5)]      | Negative logical x and y focus translation magnitude. |
| --field-emphasis-shadow-offset | [--field-emphasis-shadow-offset:--spacing(1)] | Positive logical x and y hard-shadow offset.          |
| --hard-shadow                  | Derived from the size-specific shadow offset  | Complete shadow consumed by field-emphasis.           |

## AddOn

### Props

InputAddOnProps derives from the native ref-capable span props, omits children,
and reintroduces children as one required ReactElement.

| Prop               | Type                                                                    | Default  | Description                                                                                                 |
| ------------------ | ----------------------------------------------------------------------- | -------- | ----------------------------------------------------------------------------------------------------------- |
| children           | React.ReactElement                                                      | Required | One decorative visual element. Descendant SVG elements receive the Root size treatment.                     |
| position           | start or end                                                            | start    | Places AddOn at logical inline start or inline end and selects the matching separator side.                 |
| className          | Native span className                                                   | None     | Composes consumer classes with the AddOn visual classes.                                                    |
| style              | React.CSSProperties without an effective pointerEvents override         | None     | Extends the visual surface while the fixed pointer-events-none treatment keeps final precedence.            |
| passive span props | id, data attributes, dir, lang, hidden, nonce, slot, translate, and ref | None     | Pass through without adding semantics or interaction. Reserved AddOn data attributes keep final precedence. |

InputAddOnProps excludes every aria attribute, every React event prop whose key
begins with on, and accessKey, autoFocus, contentEditable, contextMenu,
dangerouslySetInnerHTML, draggable, inert, popover, popoverTarget,
popoverTargetAction, role, suppressContentEditableWarning, tabIndex, and title.

AddOn owns aria-hidden true, inert true, pointer-events-none, no role, and no
tabIndex. Consumer event handlers are not forwarded at runtime, including from
untyped JavaScript. AddOn forwards its ref to the rendered span for measurement
or inspection, not focus or activation. AddOn does not expose a render prop and
is not polymorphic.

### Events

AddOn defines no events and excludes native or React event props. Its subtree
does not receive pointer or keyboard interaction.

### Data Attributes

| Attribute        | Description                                                      |
| ---------------- | ---------------------------------------------------------------- |
| data-position    | Contains start or end for the logical position.                  |
| data-field-addon | Marks the decorative rail for the public field-emphasis utility. |

Consumer data attributes pass through except for data-position and
data-field-addon. AddOn does not copy Base UI Control state attributes.

### CSS Variables

AddOn defines no public CSS variables. It consumes Root size and the public
data-field-addon field-emphasis hook.

## Control

### Props

InputControlProps extends Base UI Input.Props without narrowing it.

| Prop               | Type                                                         | Default      | Description                                                                                                                           |
| ------------------ | ------------------------------------------------------------ | ------------ | ------------------------------------------------------------------------------------------------------------------------------------- |
| defaultValue       | string, number, or string array                              | Base UI      | Sets the initial value for uncontrolled usage.                                                                                        |
| value              | string, string array, or number                              | Base UI      | Sets the value for controlled usage.                                                                                                  |
| onValueChange      | Function receiving string and InputControlChangeEventDetails | Base UI      | Fires when the Base UI value changes.                                                                                                 |
| render             | ReactElement or render function                              | Base UI      | Preserves Base UI render composition. Render replacements forward the received ref and props to an input-compatible semantic surface. |
| className          | Base UI Input className prop                                 | None         | Composes consumer classes with the Powercoach Control classes. State functions receive InputControlState.                             |
| style              | Base UI Input style prop                                     | None         | Composes consumer style with the Control style. State functions receive InputControlState.                                            |
| size               | Native numeric input size                                    | Native input | Preserves the native attribute. Powercoach xs, md, and xl sizing exists only on Root.                                                 |
| native input props | Base UI Input native props                                   | None         | Native input attributes, form props, native events, aria attributes, consumer data attributes, and the Base UI ref pass through.      |

The preserved native surface includes type, name, disabled, required, readOnly,
placeholder, autoComplete, inputMode, pattern, min, max, step, and form. A
Field.Root name or disabled value keeps Base UI precedence over the matching
Control prop.

Without render replacement, Control renders a native input. Base UI's public
ref type remains HTMLElement because render can replace the default element;
the default node is an HTMLInputElement.

### Events

Control preserves Base UI onValueChange and all native input events, including
onChange, onInput, onFocus, onBlur, keyboard, pointer, composition, clipboard,
and form events.

InputControlChangeEventReason is none. InputControlChangeEventDetails preserves
the Base UI reason, native event, cancel, allowPropagation, cancellation and
propagation flags, and trigger fields.

### Data Attributes

| Attribute     | Description                                        |
| ------------- | -------------------------------------------------- |
| data-disabled | Present when Base UI Input is disabled.            |
| data-valid    | Present when Control is valid inside Field.Root.   |
| data-invalid  | Present when Control is invalid inside Field.Root. |
| data-dirty    | Present when the Field value has changed.          |
| data-touched  | Present when the Field has been touched.           |
| data-filled   | Present when the Field has a value.                |
| data-focused  | Present when the Field Control is focused.         |

Consumer data attributes pass through Control. Root and AddOn do not redefine
or mirror these Base UI states.

### CSS Variables

Control defines no public CSS variables.

## hard shadow

The package stylesheet exported through @powercoach/ui and
@powercoach/ui/index.css defines one public CSS custom property.

| Variable      | Type   | Default                                     | Description                                                       |
| ------------- | ------ | ------------------------------------------- | ----------------------------------------------------------------- |
| --hard-shadow | shadow | 0.25rem 0.25rem 0 0 var(--color-foreground) | Complete positive x and y, zero-blur, zero-spread surface shadow. |

The canonical Tailwind application is shadow-(--hard-shadow). There is no
hard-shadow React component, JavaScript constant, hook, type, data attribute,
or custom utility class.

A field-emphasis host applies focus-within:shadow-(--hard-shadow). Other
families independently own when they apply the canonical hard-shadow utility.

Powercoach defaults are merged before the explicit consumer className. When
tailwind-merge recognizes a conflict, a later consumer shadow-none, shadow-lg,
or arbitrary shadow utility replaces shadow-(--hard-shadow). Consumer style is
merged last and may override --hard-shadow directly. A deliberate override
supersedes the documented default and makes the resulting shadow
consumer-owned. For a stateful default, a direct competing shadow utility uses
the corresponding state variant.

## field-emphasis

field-emphasis is a public Tailwind utility for square form-control hosts with a
decorative rail. The host applies the field-emphasis class and supplies
--field-emphasis-offset and --field-emphasis-shadow-offset from Tailwind's
spacing theme. Each decorative rail exposes data-field-addon.

The utility contract is:

```css
@utility field-emphasis {
  --field-emphasis-offset: --spacing(0.5);
  --field-emphasis-shadow-offset: --spacing(1);
  --hard-shadow: var(--field-emphasis-shadow-offset) var(--field-emphasis-shadow-offset) 0 0
    var(--color-foreground);
  @apply transition-[translate,border-color,box-shadow] duration-150 ease-out motion-reduce:duration-0;

  &:focus-within {
    @apply border-foreground shadow-(--hard-shadow);
    translate: calc(var(--field-emphasis-offset) * -1) calc(var(--field-emphasis-offset) * -1);
  }

  & [data-field-addon] {
    @apply transition-[background-color,color,border-color] duration-150 ease-out motion-reduce:duration-0;
  }

  &:focus-within [data-field-addon] {
    @apply border-foreground bg-foreground text-background;
  }
}
```

The utility adapts the revision 1 --field-emphasis-shadow-offset value into the
shared --hard-shadow value. Existing consumers can therefore retain their
size-specific offset override. Other hard-shadow consumers never read the
field-specific variable.

The utility does not depend on Input class names, child indexes, DOM adjacency,
React context, or undocumented attributes. Input.Root uses the class by
default. Future form-control families use the same public class, variables, and
data attribute instead of copying the interaction or creating a private
protocol.

## Accessibility

Input.Control follows Base UI Input native input semantics, controlled and
uncontrolled behavior, Field integration, validation, render composition, and
event behavior.

Every Control requires an accessible name. Consumers provide one through
Field.Label, a native label, aria-label, or aria-labelledby. Input.Root has no
role. Input.AddOn never labels or describes Control.

Input.AddOn is always decorative. Its fixed aria-hidden and inert attributes
remove the subtree from the accessibility tree and focus order. Its fixed
pointer-events-none treatment prevents pointer activation. Interactive AddOn
descendants are unsupported and remain inert even when the required
ReactElement renders a button, link, focusable SVG, tabIndex, or custom
interactive component.

Control is the only focusable or interactive Input part. Focusing it activates
the visible field-emphasis treatment on Root and AddOn without creating an
additional focus target.

Reduced motion removes transition duration while retaining the focused border,
translation, shadow, and AddOn inversion as immediate state feedback.

## Behavior

Input.Root renders a full-width, min-width-zero square field surface. It uses
flexible layout so Control occupies the remaining inline space while the
mandatory AddOn keeps its documented side. Root uses border,
border-foreground/30, bg-background, and text-foreground. It never adds radius.

Input.AddOn defaults to position start. Start uses border-e and end uses
border-s, both with border-foreground/30. AddOn uses bg-muted and
text-muted-foreground at rest. Position follows the logical inline axis and
therefore adapts to left-to-right and right-to-left direction.

Input.Control uses min-w-0, flex-1, bg-transparent, text-foreground,
caret-foreground, outline-none, and placeholder:text-foreground/50. Root owns
the only outer border, and AddOn owns the only internal separator. Control does
not add another border.

AddOn centers its child on both axes. Every descendant SVG uses the documented
size, does not shrink, and receives no pointer interaction. This is the same
public visual convention used by Button icon content, but Input does not consume
Button semantics, Button chrome, or Button internals.

### Size Treatments

Every metric uses a Tailwind utility or Tailwind theme function. No size uses a
raw length or arbitrary pixel value.

| Size | Root | AddOn | Control            | Placeholder                                                  | Descendant SVG   | Emphasis offset                            | Shadow offset                                    |
| ---- | ---- | ----- | ------------------ | ------------------------------------------------------------ | ---------------- | ------------------------------------------ | ------------------------------------------------ |
| xs   | h-6  | w-6   | px-2 text-xs/4     | inherits text-xs/4 and uses placeholder:text-foreground/50   | [&_svg]:size-3   | [--field-emphasis-offset:--spacing(0.25)]  | [--field-emphasis-shadow-offset:--spacing(0.5)]  |
| md   | h-8  | w-8   | px-2.5 text-sm/4.5 | inherits text-sm/4.5 and uses placeholder:text-foreground/50 | [&_svg]:size-3.5 | [--field-emphasis-offset:--spacing(0.375)] | [--field-emphasis-shadow-offset:--spacing(0.75)] |
| xl   | h-9  | w-9   | px-3 text-base/5   | inherits text-base/5 and uses placeholder:text-foreground/50 | [&_svg]:size-4   | [--field-emphasis-offset:--spacing(0.5)]   | [--field-emphasis-shadow-offset:--spacing(1)]    |

Every Root uses border. A start AddOn uses border-e, and an end AddOn uses
border-s. These standard Tailwind border-width utilities remain invariant across
sizes.

The default size is xl. Size changes metrics only; they do not change anatomy,
semantics, state behavior, or focus activation.

At rest, Root has no translation or hard shadow. Hover alone does not alter the
resting treatment. On focus within, field-emphasis applies the documented final
state. When focus leaves, the same properties return to rest.

The external hard shadow requires visible overflow. An ancestor with hidden
overflow may clip the effect; Input does not create a containment workaround.

## Motion

Input uses the CSS animation engine through the field-emphasis Tailwind
@utility. It does not compose a reusable animation component and does not use
Motion.

On focus within, Root transitions translate, border-color, and box-shadow with
transition-[translate,border-color,box-shadow], duration-150, and ease-out. It
translates negatively on both axes by --field-emphasis-offset, changes its
border to foreground, resolves --hard-shadow from the positive x and y
--field-emphasis-shadow-offset, and applies shadow-(--hard-shadow).

At the same time, AddOn transitions background-color, color, and border-color
with transition-[background-color,color,border-color], duration-150, and
ease-out. Its separator becomes foreground, its background becomes foreground,
and its content becomes background.

Blur reverses the same transitions. Hover does not activate motion. Input does
not animate size, layout metrics, border width, value, placeholder, or AddOn
position.

motion-reduce:duration-0 applies to both host and AddOn transitions. Reduced
motion preserves the same resting and focused states and changes between them
immediately.

## Use Cases

### UC-001 - Render the mandatory compound anatomy

Given a consumer renders Input.Root with exactly one Input.AddOn and one
Input.Control
When the field is displayed
Then Root renders the Powercoach field surface, AddOn renders the mandatory
decorative identifier, and Control renders Base UI Input semantics

### UC-002 - Select a coordinated size

Given a consumer renders Input.Root with size xs, md, or xl
When the field is displayed
Then Root, AddOn, Control, placeholder, descendant SVG, emphasis offset, and
hard shadow use the corresponding Tailwind treatment and xl is the default

### UC-003 - Place AddOn on the logical inline axis

Given a consumer renders Input.AddOn with position start or end
When the field is displayed in left-to-right or right-to-left direction
Then AddOn uses the corresponding logical inline placement and separator side,
with start as the default

### UC-004 - Keep AddOn decorative and normalize SVG content

Given a consumer supplies one ReactElement to Input.AddOn
When AddOn is displayed
Then the subtree remains hidden, inert, unfocusable, and pointer-inert while
every descendant SVG is centered and normalized to the selected Root size

### UC-005 - Preserve Base UI value and Field state behavior

Given a consumer uses value and onValueChange, defaultValue, or wraps Input in
Field.Root
When the value or Field state changes
Then Control preserves Base UI controlled and uncontrolled behavior, Field
precedence, form participation, state, events, and documented data attributes

### UC-006 - Provide an accessible name

Given a consumer renders Input.Control
When assistive technology encounters the field
Then Control receives its accessible name from Field.Label, a native label,
aria-label, or aria-labelledby, while Root and AddOn add no name or role

### UC-007 - Render resting value and placeholder treatments

Given Control is empty, contains a value, or is hovered without focus
When Input is displayed
Then placeholder uses placeholder:text-foreground/50, value uses
text-foreground, the resting border and AddOn colors remain unchanged, and Root
does not translate or show the hard shadow

### UC-008 - Emphasize only on focus within

Given Input.Root or another field-emphasis host contains a focusable control
When focus enters or leaves that host
Then the host and data-field-addon descendant transition between the documented
resting and focused states without hover activation

### UC-009 - Share field-emphasis with another form family

Given another form-control host applies field-emphasis, the two public spacing
variables, and a data-field-addon descendant
When focus enters the host
Then it receives the same CSS-only focus interaction without composing Input,
Motion, or an animation component

### UC-010 - Preserve focused feedback under reduced motion

Given the user prefers reduced motion
When focus enters or leaves Input.Root or another field-emphasis host
Then transition duration is removed and the same final border, translation,
hard shadow, and AddOn inversion appear immediately

### UC-011 - Apply the shared hard shadow

Given a consumer or another approved Powercoach family applies
shadow-(--hard-shadow)
When the surface is displayed without an override
Then it receives the default positive 0.25rem x and y foreground shadow with
zero blur and zero spread

### UC-012 - Override the shared hard shadow

Given a consumer supplies a supported conflicting Tailwind shadow utility or a
style override after the Powercoach default
When the class or style conflict is resolved
Then the consumer shadow wins, non-conflicting Powercoach styles remain, and
the resulting shadow becomes consumer-owned
