---
revision: 1
date: 2026-07-21
---

# Field

## Overview

Field provides Powercoach labeling, text entry, contextual guidance, and client
validation feedback on top of Base UI Field semantics. Use it when one field
needs the public Powercoach Input surface, a Heading label, and a Hint that
switches from waiting guidance to destructive validation feedback.

Field preserves Base UI ownership of field naming, validation timing, dirty and
touched state, label and description association, disabled precedence, render
composition, and validity data. Powercoach owns the required-state declaration,
the composed Input, Heading, and Hint surfaces, and the bounded option objects
that configure those components through their public APIs.

Field does not expose an Error part. Description is the one Powercoach
validation-message presentation. It maps every ordered native or custom client
validation message to a dedicated Hint item, while Hint's existing
first-fulfilled behavior displays only the first current message.

## Anatomy

Field is a non-callable namespace with six public parts.

- Field.Root: groups the field, owns validation and the Powercoach required
  declaration, and renders a div by default.
- Field.Item: preserves Base UI grouping for an individual checkbox or radio
  item and renders a div by default.
- Field.Description: renders the registered Hint-driven description and client
  validation feedback as a div by default.
- Field.Control: generates one public Input.Root with one public Input.AddOn and
  one public Input.Control.
- Field.Label: renders the associated Base UI label with Heading at size sm.
- Field.Validity: exposes Base UI validity data to a consumer render function.

Field.Error is not a public part or export.

```tsx
<Field.Root name="email" required>
  <Field.Label>Email</Field.Label>
  <Field.Control addOn={<AtSign />} type="email" />
  <Field.Description waitingKey="email-guidance" waitingContent="Used for workout notifications." />
  <Field.Validity>{(state) => <output>{state.errors.length} errors</output>}</Field.Validity>
</Field.Root>
```

### Public Exports

| Export                                 | Description                                                                             |
| -------------------------------------- | --------------------------------------------------------------------------------------- |
| Field                                  | Non-callable namespace with Root, Item, Description, Control, Label, and Validity keys. |
| FieldRoot                              | Direct Root component export.                                                           |
| FieldItem                              | Direct Item component export.                                                           |
| FieldDescription                       | Direct Description component export.                                                    |
| FieldControl                           | Direct Control component export.                                                        |
| FieldLabel                             | Direct Label component export.                                                          |
| FieldValidity                          | Direct Validity component export.                                                       |
| FieldNamespace                         | Type of the public Field namespace object.                                              |
| FieldRootProps                         | Public Root props.                                                                      |
| FieldRootState                         | Base UI Root state extended with required.                                              |
| FieldRootActions                       | Base UI Root imperative validation actions.                                             |
| FieldItemProps                         | Base UI Item props preserved by Item.                                                   |
| FieldItemState                         | Alias of Base UI Field.Item.State.                                                      |
| FieldDescriptionProps                  | Public Hint-driven Description props.                                                   |
| FieldDescriptionState                  | Alias of Base UI Field.Description.State.                                               |
| FieldDescriptionTextProps              | Bounded Text props forwarded through Hint.                                              |
| FieldDescriptionStripesOptions         | Alias of HintStripesOptions.                                                            |
| FieldDescriptionSwitchAnimationOptions | Alias of HintSwitchAnimationOptions.                                                    |
| FieldDescriptionGetErrorKey            | Function type for consumer-controlled validation-message keys.                          |
| FieldControlProps                      | Public generated Input props.                                                           |
| FieldControlState                      | Alias of InputControlState.                                                             |
| FieldControlChangeEventReason          | Alias of InputControlChangeEventReason.                                                 |
| FieldControlChangeEventDetails         | Alias of InputControlChangeEventDetails.                                                |
| FieldControlInputRootProps             | Input.Root props accepted by inputRootProps.                                            |
| FieldControlInputAddOnProps            | Input.AddOn props accepted by inputAddOnProps.                                          |
| FieldLabelProps                        | Public Heading-rendered Label props.                                                    |
| FieldLabelState                        | Base UI Label state extended with required.                                             |
| FieldLabelHeadingProps                 | Mutually exclusive Heading tone or intent accepted by headingProps.                     |
| FieldValidityProps                     | Alias of Base UI Field.Validity.Props.                                                  |
| FieldValidityState                     | Alias of Base UI Field.Validity.State.                                                  |
| FieldValidityData                      | Alias of Base UI Field.ValidityData.                                                    |

There is no FieldError runtime export, FieldError type export, or Error key on
Field.

## Examples

### EX-001 - Required field with waiting guidance

Context: A workout form needs a required email field with a visible label,
decorative identifier, and quiet guidance before validation fails.

Expected behavior: Root owns required. Label uses Heading at size sm and
appends a visible asterisk that is hidden from assistive technology. Control
renders the default xl Input with a logical-start decorative AddOn and receives
the native required attribute. Description registers the muted waiting content
as the Control's accessible description.

Covers: UC-001, UC-002, UC-003, UC-004, UC-006, UC-007, UC-011, UC-012

```tsx
import { AtSign } from 'lucide-react'
import { Field } from '@powercoach/ui'

export function RequiredEmailField() {
  return (
    <Field.Root name="email" required>
      <Field.Label>Email address</Field.Label>
      <Field.Control
        addOn={<AtSign />}
        type="email"
        autoComplete="email"
        placeholder="coach@example.com"
      />
      <Field.Description
        waitingKey="email-guidance"
        waitingContent="Used for workout notifications."
      />
    </Field.Root>
  )
}
```

### EX-002 - Ordered client validation errors

Context: A training code can fail more than one custom client rule, and the
consumer needs to inspect every current message while Field displays one
destructive message.

Expected behavior: Calling validate runs Base UI validation. Validity exposes
the complete ordered error array to the visible probe. Description creates a
dedicated Hint item for every message, selects the first ordered item, applies
destructive intent, and uses the consumer error key callback. When no error
remains, it returns to the muted waiting content. No Field.Error is rendered or
available.

Covers: UC-002, UC-007, UC-008, UC-009, UC-010, UC-014, UC-015

```tsx
'use client'

import * as React from 'react'
import { KeyRound } from 'lucide-react'
import { Field, type FieldRootActions } from '@powercoach/ui'

export function TrainingCodeField() {
  const actionsRef = React.useRef<FieldRootActions | null>(null)

  return (
    <Field.Root
      name="trainingCode"
      actionsRef={actionsRef}
      validate={(value) => {
        const code = String(value ?? '')
        const errors: string[] = []

        if (code.length < 8) errors.push('Use at least eight characters.')
        if (!/[A-Z]/.test(code)) errors.push('Add one uppercase letter.')

        return errors.length > 0 ? errors : null
      }}
    >
      <Field.Label>Training code</Field.Label>
      <Field.Control addOn={<KeyRound />} defaultValue="coach" />
      <Field.Description
        waitingKey="training-code-guidance"
        waitingContent="Use a memorable code with at least eight characters."
        getErrorKey={(error, index) => `training-code-${index}-${error}`}
      />
      <button type="button" onClick={() => actionsRef.current?.validate()}>
        validate code
      </button>
      <Field.Validity>
        {(state) => (
          <output>
            Current errors: {state.errors.length > 0 ? state.errors.join(' | ') : 'none'}
          </output>
        )}
      </Field.Validity>
    </Field.Root>
  )
}
```

### EX-003 - Forward Input, Heading, and Hint options

Context: Two fields need controlled and uncontrolled values plus bounded visual
configuration of their composed Powercoach components.

Expected behavior: The first Control forwards controlled Input.Control props,
uses a medium Input.Root, and places the decorative AddOn at logical inline end.
Its Label forwards an accent tone to Heading. Its Description forwards Text,
Stripes, and SwitchAnimation options without exposing Hint items or appearance.
The second Control preserves Input's uncontrolled defaultValue behavior.

Covers: UC-004, UC-005, UC-006, UC-007, UC-010, UC-013, UC-015

```tsx
'use client'

import * as React from 'react'
import { Search, UserRound } from 'lucide-react'
import { Field } from '@powercoach/ui'

export function ConfiguredFields() {
  const [query, setQuery] = React.useState('tempo')

  return (
    <div>
      <Field.Root name="search">
        <Field.Label headingProps={{ tone: 'accent' }}>Search</Field.Label>
        <Field.Control
          addOn={<Search />}
          value={query}
          onValueChange={setQuery}
          inputRootProps={{ size: 'md', data-surface: 'search' }}
          inputAddOnProps={{ position: 'end', data-rail: 'search' }}
        />
        <Field.Description
          waitingKey="search-guidance"
          waitingContent="Search by exercise or equipment."
          textProps={{ size: 'sm', className: 'font-medium' }}
          stripesOptions={{ angle: '45deg', gap: '6px' }}
          switchAnimationOptions={{
            direction: 'right',
            style: {
              '--switch-animation-duration': '180ms'
            } as React.CSSProperties
          }}
        />
        <output>Current search: {query}</output>
      </Field.Root>

      <Field.Root name="athlete">
        <Field.Label>Athlete</Field.Label>
        <Field.Control addOn={<UserRound />} defaultValue="Yann" />
        <Field.Description
          waitingKey="athlete-guidance"
          waitingContent="Use the athlete's display name."
        />
      </Field.Root>
    </div>
  )
}
```

### EX-004 - Replace public wrapper elements

Context: A consumer needs section semantics for Root, a callback-rendered label,
an input probe, and an aside description while retaining Field state and
associations.

Expected behavior: Root, Label, Control, and Description preserve their public
render contracts. Label's callback receives required in FieldLabelState and
keeps the authoritative label content plus asterisk exactly once. Description's
callback receives FieldDescriptionState, spreads the registered id and state
attributes, and preserves Hint as its sole owned child. Focusing Control updates
the visible consumer probe through native events.

Covers: UC-002, UC-003, UC-005, UC-006, UC-010, UC-011, UC-012, UC-013

```tsx
'use client'

import * as React from 'react'
import { Link } from 'lucide-react'
import { Field } from '@powercoach/ui'

export function RenderedProfileField() {
  const [focused, setFocused] = React.useState(false)

  return (
    <Field.Root required render={<section data-region="profile" />}>
      <Field.Label
        render={(props, state) => (
          <label {...props} data-required-probe={state.required ? '' : undefined} />
        )}
      >
        Profile link
      </Field.Label>
      <Field.Control
        addOn={<Link />}
        type="url"
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        render={(props, state) => (
          <input {...props} data-focused-probe={state.focused ? '' : undefined} />
        )}
      />
      <Field.Description
        waitingKey="profile-link-guidance"
        waitingContent="Paste a complete public profile URL."
        render={(props, state) => (
          <aside {...props} data-field-focused={state.focused ? '' : undefined} />
        )}
      />
      <output>Input focus: {focused ? 'inside' : 'outside'}</output>
    </Field.Root>
  )
}
```

### EX-005 - Preserve Item and Validity composition

Context: A Base UI checkbox needs Powercoach Field grouping, labeling,
description, and a visible validity probe without using the generated text
Control.

Expected behavior: Item preserves Base UI field-item state and wrapper behavior.
Label remains the association owner and uses Heading at size sm around the
checkbox and source text. Description registers muted waiting guidance. Validity
exposes the Base UI validity data without rendering an owned wrapper. Root's
required prop is omitted because it only owns the requirement for generated
Field.Control.

Covers: UC-001, UC-002, UC-006, UC-007, UC-013, UC-016

```tsx
import { Checkbox } from '@base-ui/react/checkbox'
import { Check } from 'lucide-react'
import { Field } from '@powercoach/ui'

export function ConsentField() {
  return (
    <Field.Root name="trainingConsent">
      <Field.Item>
        <Field.Label>
          <Checkbox.Root className="inline-flex size-4 border border-foreground">
            <Checkbox.Indicator>
              <Check />
            </Checkbox.Indicator>
          </Checkbox.Root>
          I accept the training data policy
        </Field.Label>
        <Field.Description
          waitingKey="consent-guidance"
          waitingContent="You can withdraw consent later."
        />
      </Field.Item>
      <Field.Validity>
        {(state) => <output>Consent valid: {String(state.validity.valid)}</output>}
      </Field.Validity>
    </Field.Root>
  )
}
```

## Root

### Props

FieldRootProps preserves Base UI Field.Root.Props and adds required. Its render
state is FieldRootState, which preserves Base UI Field.Root.State and adds the
same required boolean.

```ts
type FieldRootState = BaseField.Root.State & {
  required: boolean
}

type FieldRootActions = {
  validate: () => void
}
```

| Prop                   | Type                                                                                                   | Default  | Description                                                                                                                              |
| ---------------------- | ------------------------------------------------------------------------------------------------------ | -------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| required               | boolean                                                                                                | false    | Single Powercoach declaration that controls the generated native Control requirement, Label asterisk, required state, and data-required. |
| name                   | string                                                                                                 | None     | Identifies the field for form submission and takes Base UI precedence over a name on Control.                                            |
| actionsRef             | React.RefObject of FieldRootActions or null                                                            | None     | Exposes Base UI's imperative validate action.                                                                                            |
| dirty                  | boolean                                                                                                | Base UI  | Externally controls whether the field value has changed from its initial value.                                                          |
| touched                | boolean                                                                                                | Base UI  | Externally controls whether the field has been touched.                                                                                  |
| disabled               | boolean                                                                                                | false    | Disables the field and takes Base UI precedence over disabled on Control.                                                                |
| invalid                | boolean                                                                                                | Base UI  | Externally controls whether the field is invalid.                                                                                        |
| validate               | Function receiving value and form values and returning string, string array, Promise of those, or null | None     | Preserves Base UI custom client validation.                                                                                              |
| validationMode         | onSubmit, onBlur, or onChange                                                                          | onSubmit | Preserves Base UI validation timing and Field precedence over a parent Form.                                                             |
| validationDebounceTime | number                                                                                                 | 0        | Preserves the Base UI onChange validation debounce in milliseconds.                                                                      |
| className              | string or function receiving FieldRootState                                                            | None     | Composes a consumer class on the final Root element.                                                                                     |
| style                  | React.CSSProperties or function receiving FieldRootState                                               | None     | Composes consumer style on the final Root element.                                                                                       |
| render                 | ReactElement or function receiving merged props and FieldRootState                                     | None     | Preserves Base UI render replacement with the extended required state.                                                                   |
| native div attributes  | Base UI Root native props                                                                              | None     | Native attributes, events, ARIA attributes, data attributes, children, and the HTMLDivElement ref pass through to the final element.     |

Root's public state fields are disabled, touched, dirty, valid, filled, focused,
and required. The Base UI fields retain their documented meanings.

Root forwards its default ref to the rendered div. A render replacement follows
Base UI ref and prop-merging semantics.

### Events

Root defines no custom events. Supported native events pass through and compose
according to Base UI render semantics. Base UI owns validation timing and the
imperative validate action.

### Data Attributes

| Attribute     | Description                                               |
| ------------- | --------------------------------------------------------- |
| data-disabled | Present when the field is disabled.                       |
| data-valid    | Present when the field is valid.                          |
| data-invalid  | Present when the field is invalid.                        |
| data-dirty    | Present when the field value has changed.                 |
| data-touched  | Present when the field has been touched.                  |
| data-filled   | Present when the field has a value.                       |
| data-focused  | Present when the field Control is focused.                |
| data-required | Present when the Powercoach required declaration is true. |

Consumer data attributes pass through except for the state attributes above.

### CSS Variables

Root defines no public CSS variables.

## Item

### Props

FieldItemProps and FieldItemState alias Base UI Field.Item.Props and
Field.Item.State without narrowing.

| Prop                  | Type                                                               | Default | Description                                                                                                     |
| --------------------- | ------------------------------------------------------------------ | ------- | --------------------------------------------------------------------------------------------------------------- |
| disabled              | boolean                                                            | false   | Disables the wrapped control unless Root disabled takes precedence.                                             |
| className             | string or function receiving FieldItemState                        | None    | Preserves the Base UI state-aware class contract.                                                               |
| style                 | React.CSSProperties or function receiving FieldItemState           | None    | Preserves the Base UI state-aware style contract.                                                               |
| render                | ReactElement or function receiving merged props and FieldItemState | None    | Preserves Base UI render replacement.                                                                           |
| native div attributes | Base UI Item native props                                          | None    | Native attributes, events, ARIA attributes, data attributes, children, and the HTMLDivElement ref pass through. |

FieldItemState contains disabled, touched, dirty, valid, filled, and focused
with the documented Base UI meanings.

### Events

Item defines no custom events. Supported native events pass through and compose
according to Base UI render semantics.

### Data Attributes

| Attribute     | Description                                |
| ------------- | ------------------------------------------ |
| data-disabled | Present when the item is disabled.         |
| data-valid    | Present when the field is valid.           |
| data-invalid  | Present when the field is invalid.         |
| data-dirty    | Present when the field value has changed.  |
| data-touched  | Present when the field has been touched.   |
| data-filled   | Present when the field has a value.        |
| data-focused  | Present when the field control is focused. |

Consumer data attributes pass through except for the Base UI state attributes.

### CSS Variables

Item defines no public CSS variables.

## Description

### Props

Description is a public Base UI Field.Description adapter whose owned child is
one Hint. It replaces Base UI Description's paragraph default with a
block-capable div so Hint's block subtree remains valid.

```ts
type FieldDescriptionTextProps = Pick<HintTextProps, 'className' | 'size' | 'style'>

type FieldDescriptionStripesOptions = HintStripesOptions

type FieldDescriptionSwitchAnimationOptions = HintSwitchAnimationOptions

type FieldDescriptionGetErrorKey = (
  error: string,
  index: number,
  errors: readonly string[]
) => React.Key
```

| Prop                   | Type                                                                      | Default           | Description                                                                                                                  |
| ---------------------- | ------------------------------------------------------------------------- | ----------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| waitingContent         | HintContent                                                               | Required          | String or React element selected when Field.Validity exposes no client validation error.                                     |
| waitingKey             | React.Key                                                                 | Required          | Stable Hint key for waiting content. It must differ from every resolved error key.                                           |
| getErrorKey            | FieldDescriptionGetErrorKey                                               | Derived key       | Returns the React key for one ordered error.                                                                                 |
| textProps              | FieldDescriptionTextProps                                                 | Hint size default | Forwards Text className, size, and style to Hint. Appearance remains Field-owned.                                            |
| stripesOptions         | FieldDescriptionStripesOptions                                            | Hint default      | Forwards Hint's bounded Stripes options unchanged.                                                                           |
| switchAnimationOptions | FieldDescriptionSwitchAnimationOptions                                    | Hint default      | Forwards Hint's bounded SwitchAnimation options unchanged.                                                                   |
| className              | string or function receiving FieldDescriptionState                        | None              | Composes a class on the one registered public wrapper.                                                                       |
| style                  | React.CSSProperties or function receiving FieldDescriptionState           | None              | Composes style on the one registered public wrapper.                                                                         |
| render                 | ReactElement or function receiving merged props and FieldDescriptionState | None              | Replaces the default div while preserving Base UI description registration and the owned Hint child.                         |
| native div attributes  | Ref-capable native div props                                              | None              | Native attributes, events, ARIA attributes, data attributes, and the HTMLElement ref pass through to the registered wrapper. |

FieldDescriptionState aliases Base UI Field.Description.State and contains
disabled, touched, dirty, valid, filled, and focused.

Description does not accept children, hints, tone, or intent. It does not expose
Hint's render or ref, Text's render, ref, native attributes, or appearance,
Stripes children, render, or ref, or SwitchAnimation children, contentMode,
render, or ref.

The default error key is a namespaced serialization of the error string followed
by the number of equal messages that precede that item. The first occurrence
therefore uses ordinal zero. This distinguishes duplicates and remains stable
while the same message occurrence remains in the ordered array. getErrorKey
replaces that default and receives the error, its array index, and the complete
ordered errors array.

waitingKey and every resolved error key must be mutually unique. Behavior is
unspecified when keys collide.

#### Wrapper prop precedence

Base UI owns the registered final id and Field state attributes. Field owns the
Hint child and its state-dependent appearance. A consumer render callback must
spread all received props, preserve the received ref, and render the received
children exactly once.

Consumer wrapper className and style values compose through Base UI render
semantics. They target the registered wrapper, not Hint's owned Stripes,
SwitchAnimation, or Text content box.

#### Text prop precedence

When no error exists, Field supplies tone muted to Hint. When at least one error
exists, Field supplies intent destructive. Consumers cannot replace those props
through textProps.

textProps className, size, and style otherwise retain Hint's documented Text
precedence. A supported conflicting text-color utility or inline color may
visually override the selected treatment according to Hint and Text's public
contracts. Hint retains ownership of its Background surface, inherited font
family, content, key, div render, and focusability.

#### Stripes and SwitchAnimation option precedence

stripesOptions and switchAnimationOptions retain the exact bounded fields,
defaults, owned values, precedence, lifecycle callbacks, public CSS variables,
and reduced-motion behavior documented by Hint. Description does not widen
either option object.

### Events

Description defines no custom events. Native events pass through to the public
registered wrapper.

SwitchAnimation lifecycle callbacks may be supplied through
switchAnimationOptions. They retain Hint and SwitchAnimation's details,
ordering, interruption, completion, and unmount contracts.

### Data Attributes

| Attribute     | Description                                |
| ------------- | ------------------------------------------ |
| data-disabled | Present when the field is disabled.        |
| data-valid    | Present when the field is valid.           |
| data-invalid  | Present when the field is invalid.         |
| data-dirty    | Present when the field value has changed.  |
| data-touched  | Present when the field has been touched.   |
| data-filled   | Present when the field has a value.        |
| data-focused  | Present when the field Control is focused. |

Consumer data attributes pass through except for the Base UI state attributes.
The composed Hint and SwitchAnimation retain their own public attributes, but
they do not become Field selectors or expose Field internals.

### CSS Variables

Description defines no public CSS variables. Public Stripes and SwitchAnimation
variables may be supplied through their matching option style objects and retain
their owning component contracts.

## Control

### Props

Field.Control generates one complete public Input composition. It does not wrap
Base UI Field.Control because Input.Control is already Base UI Field-compatible.

```ts
type FieldControlInputRootProps = Omit<InputRootProps, 'children'>

type FieldControlInputAddOnProps = Omit<InputAddOnProps, 'children'>

type FieldControlProps = Omit<InputControlProps, 'required'> & {
  addOn: React.ReactElement
  inputRootProps?: FieldControlInputRootProps
  inputAddOnProps?: FieldControlInputAddOnProps
  required?: never
}
```

| Prop               | Type                                                         | Default  | Description                                                                                                                               |
| ------------------ | ------------------------------------------------------------ | -------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| addOn              | React.ReactElement                                           | Required | Becomes the sole child of the generated decorative Input.AddOn.                                                                           |
| inputRootProps     | FieldControlInputRootProps                                   | None     | Configures the generated Input.Root without replacing its owned children.                                                                 |
| inputAddOnProps    | FieldControlInputAddOnProps                                  | None     | Configures the generated Input.AddOn without replacing addOn or its owned decorative behavior.                                            |
| defaultValue       | InputControlProps defaultValue                               | Input    | Preserves Input and Base UI uncontrolled value behavior.                                                                                  |
| value              | InputControlProps value                                      | Input    | Preserves Input and Base UI controlled value behavior.                                                                                    |
| onValueChange      | Function receiving string and FieldControlChangeEventDetails | Input    | Preserves Input's Base UI value-change event.                                                                                             |
| render             | InputControlProps render                                     | Input    | Replaces only the actual input-compatible Control surface. Input.Root and Input.AddOn remain.                                             |
| className          | InputControlProps className                                  | None     | Composes on Input.Control; state functions receive FieldControlState.                                                                     |
| style              | InputControlProps style                                      | None     | Composes on Input.Control; state functions receive FieldControlState.                                                                     |
| native input props | Remaining InputControlProps                                  | None     | Native input attributes, form props, events, ARIA attributes, consumer data attributes, and the Control ref pass through except required. |

FieldControlState aliases InputControlState. FieldControlChangeEventReason
aliases InputControlChangeEventReason and remains none.
FieldControlChangeEventDetails aliases InputControlChangeEventDetails and
preserves reason, native event, cancel, allowPropagation, cancellation and
propagation flags, and trigger.

Top-level Control props belong to Input.Control. inputRootProps owns Input size,
native div attributes and events, className, style, consumer data attributes,
and the HTMLDivElement ref. inputAddOnProps owns position, passive span
attributes, className, bounded style, consumer data attributes, and the
HTMLSpanElement ref. The top-level Control ref retains Input's public HTMLElement
type because render can replace the default HTMLInputElement.

required is reserved at both the type and runtime boundaries. Typed consumers
cannot supply it to Control. An untyped required value is ignored. Root's
required value is the only value passed to the generated Input.Control.

Input defaults remain authoritative: Root size is xl, AddOn position is start,
and AddOn remains decorative, aria-hidden, inert, pointer-inert, and outside the
focus order. Field.Root name and disabled keep Base UI precedence over matching
top-level Control props.

inputRootProps cannot supply children or render. inputAddOnProps cannot supply
children, interaction, ARIA semantics, events, role, tabIndex, render, or the
Input-owned data-position and data-field-addon values. Input's reserved
children, decorative semantics, pointer treatment, data-size, data-position,
and data-field-addon keep final precedence.

### Events

Control preserves Input's Base UI onValueChange and all supported native input
events, including change, input, focus, blur, keyboard, pointer, composition,
clipboard, and form events. inputRootProps additionally preserves supported
native div events. Input.AddOn accepts no event props.

### Data Attributes

| Attribute     | Description                                  |
| ------------- | -------------------------------------------- |
| data-disabled | Present when Input.Control is disabled.      |
| data-valid    | Present when Control is valid inside Root.   |
| data-invalid  | Present when Control is invalid inside Root. |
| data-dirty    | Present when the field value has changed.    |
| data-touched  | Present when the field has been touched.     |
| data-filled   | Present when the field has a value.          |
| data-focused  | Present when the field Control is focused.   |

Consumer data attributes pass through the top-level Control. The generated
Input.Root retains data-size, and the generated Input.AddOn retains
data-position and data-field-addon. These attributes stay on their owning Input
parts and are not mirrored onto Field.Root.

### CSS Variables

Control defines no Field CSS variables. inputRootProps may supply Input's public
field-emphasis variables through style, and Input retains their documented
defaults and behavior.

## Label

### Props

FieldLabelProps preserves Base UI Field.Label.Props and adds headingProps.
FieldLabelState preserves Base UI Field.Label.State and adds required.

```ts
type FieldLabelHeadingProps = ToneOrIntentProps

type FieldLabelState = BaseField.Label.State & {
  required: boolean
}
```

| Prop                    | Type                                                                | Default | Description                                                                                                                           |
| ----------------------- | ------------------------------------------------------------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| headingProps            | FieldLabelHeadingProps                                              | None    | Forwards one mutually exclusive Heading tone or intent. Heading size remains fixed to sm.                                             |
| nativeLabel             | boolean                                                             | true    | Preserves Base UI behavior when render replaces the native label.                                                                     |
| children                | React.ReactNode                                                     | None    | Authoritative consumer label content. Field appends the owned asterisk when required is true.                                         |
| className               | string or function receiving FieldLabelState                        | None    | Composes on the same final element as Heading and retains Heading's supported Tailwind conflict behavior.                             |
| style                   | React.CSSProperties or function receiving FieldLabelState           | None    | Composes on the same final element as Heading.                                                                                        |
| render                  | ReactElement or function receiving merged props and FieldLabelState | None    | Replaces the final label element while preserving Base UI association, Heading treatment, authoritative children, and required state. |
| native label attributes | Base UI Label native props                                          | None    | Native attributes, events, ARIA attributes, data attributes, and the HTMLElement ref pass through to the final element.               |

FieldLabelState contains disabled, touched, dirty, valid, filled, focused,
and required.

Heading children, render, ref, native and global attributes, ARIA and data
attributes, events, className, style, and size are not duplicated through
headingProps. Base UI Label's top-level props own those final-element surfaces.
Heading appearance props are consumed and do not reach the DOM.

When Root required is true, Label appends a separate span containing an asterisk
after the consumer children. The span has aria-hidden true. Consumers cannot
remove the asterisk through headingProps. A render callback receives the
consumer content and owned asterisk together in props.children and must render
those children exactly once.

Heading always receives size sm. It retains font-heading, its documented sm
typography, visual lowercase treatment, default tone, semantic appearance,
class conflict behavior, and accessibility neutrality.

### Events

Label defines no custom events. Native events pass through and compose according
to Base UI Label render semantics.

### Data Attributes

| Attribute     | Description                                |
| ------------- | ------------------------------------------ |
| data-disabled | Present when the field is disabled.        |
| data-valid    | Present when the field is valid.           |
| data-invalid  | Present when the field is invalid.         |
| data-dirty    | Present when the field value has changed.  |
| data-touched  | Present when the field has been touched.   |
| data-filled   | Present when the field has a value.        |
| data-focused  | Present when the field Control is focused. |
| data-required | Present when Root required is true.        |

Consumer data attributes pass through except for the state attributes above.

### CSS Variables

Label defines no public CSS variables.

## Validity

### Props

FieldValidityProps, FieldValidityState, and FieldValidityData alias the matching
Base UI Field contracts without narrowing.

```ts
type FieldValidityState = {
  validity: {
    badInput: boolean
    customError: boolean
    patternMismatch: boolean
    rangeOverflow: boolean
    rangeUnderflow: boolean
    stepMismatch: boolean
    tooLong: boolean
    tooShort: boolean
    typeMismatch: boolean
    valueMissing: boolean
    valid: boolean | null
  }
  transitionStatus: TransitionStatus
  errors: string[]
  value: unknown
  error: string
  initialValue: unknown
}
```

| Prop     | Type                                                          | Default  | Description                                              |
| -------- | ------------------------------------------------------------- | -------- | -------------------------------------------------------- |
| children | Function receiving FieldValidityState and returning ReactNode | Required | Preserves the Base UI validity render-function contract. |

FieldValidityData exposes the equivalent validity state object, error, errors,
value, and initialValue fields documented by Base UI.

Validity renders no owned element, accepts no ref or render replacement, and
adds no props beyond Base UI Field.Validity.

### Events

Validity defines no events.

### Data Attributes

Validity renders no owned element and defines no data attributes.

### CSS Variables

Validity defines no public CSS variables.

## Accessibility

Base UI Field remains the semantic and validation authority. Label associates
with Input.Control automatically. Description owns one registered id, and Base
UI applies that id to Control through aria-describedby. Item preserves Base UI
label and description association for supported group controls.

Root required is the only Powercoach required declaration. It applies the native
required attribute to the generated Input.Control, which communicates the
requirement and participates in native constraint validation. The visible Label
asterisk is aria-hidden, so it does not add duplicate spoken punctuation or
replace the native required state.

Input.Control remains the only interactive part of the generated Input.
Input.AddOn retains its decorative, inert, aria-hidden, pointer-inert, and
unfocusable contract. Every generated Control requires an accessible name from
Field.Label, another native label, aria-label, or aria-labelledby.

Heading's lowercase treatment remains visual. Field does not rewrite Label
children, aria-label, title, or other accessible text values. A Heading tone or
intent changes presentation only and adds no status or live-region semantics.

Description adds no role, alert role, live region, accessible name,
announcement behavior, keyboard behavior, or pointer behavior. Its currently
selected waiting or error content remains the Control's accessible description.
Consumers may add context-appropriate semantics to the public Description
wrapper through top-level native and ARIA props.

Hint's active content box, outgoing decorative content, focus transfer, and
reduced-motion accessibility retain the Hint and SwitchAnimation contracts.
Changing the selected validation message is not automatically announced.

Render replacements must keep valid HTML semantics. Root, Item, Label, Control,
and Description callbacks must spread the received props, preserve the received
ref when one exists, and render received children exactly once. A Label render
replacement must also follow Base UI nativeLabel rules. A Control replacement
must remain an input-compatible semantic surface.

## Behavior

Field.Root coordinates Base UI state for its public parts. Root, Item,
Description, Control, and Label expose the matching disabled, valid, invalid,
dirty, touched, filled, and focused attributes. Their public state callbacks
receive the matching Base UI state. Root and Label additionally receive the
same required boolean and expose data-required while it is true.

Root required defaults to false. It is the only source for the generated native
Control requirement and the Label asterisk. Field.Control excludes required
from its typed API and ignores an untyped value. Root required is intended for a
generated Field.Control. When consumers compose another Base UI control through
Item instead, they own that control's required declaration and omit Root required
unless they intentionally want the Powercoach Label indicator.

Field.Control constructs exactly this public composition:

```tsx
<Input.Root {...inputRootProps}>
  <Input.AddOn {...inputAddOnProps}>{addOn}</Input.AddOn>
  <Input.Control {...controlProps} required={rootRequired} />
</Input.Root>
```

Consumers do not supply Control children. addOn, the generated AddOn, and the
generated Control satisfy Input's mandatory anatomy without child inspection.
The composed Input retains its square field geometry, left or right decorative
rail, size treatments, Base UI input state, and public field-emphasis utility.

Description reads the complete ordered errors array supplied by Base UI
Field.Validity. The array contains native constraint and custom client
validation messages available through that public state. Description creates
one Hint item for every array entry, in the same order, and sets every item
condition to true. Hint selects the first item. It does not display every error
simultaneously.

When the errors array is empty, Description selects waitingContent with
waitingKey and supplies tone muted. When the array contains at least one entry,
Description selects the first error item's content and resolved key and supplies
intent destructive. A later error becomes visible only after every error before
it is removed or reordered by Base UI validation state.

The default error-key derivation uses message content and duplicate occurrence,
not validity kinds or array indexes alone. getErrorKey is available when a
consumer needs another public identity. Base UI exposes no stable ID or validity
kind for each individual error string.

Description does not accept ordinary consumer Hint items. Form-level server
errors and custom Base UI Field.Error children are not part of Description's
public error source. Field exposes no Error part as an alternative or duplicate
presentation.

Root, Item, and Validity otherwise retain Base UI behavior. Root validationMode
and validationDebounceTime control when client validation runs. Root name and
disabled keep their documented precedence over generated Control values.
Validity provides the complete public state to consumer code without creating a
second presentation.

## Motion

Field creates no independent animation engine, transition, or lifecycle. It
composes the existing public motion of Input and Hint.

Generated Input retains its CSS field-emphasis behavior. Focus within
Input.Root transitions the border, translation, hard shadow, and AddOn colors;
blur reverses them; hover alone does not activate them. Its reduced-motion
treatment removes transition duration while preserving the focused result.

Generated Hint retains SwitchAnimation's CSS replacement behavior. Initial
waiting or error content renders without replacement motion. A selected-key
change between waiting content and an error, or between two errors, uses the
direction, lifecycle callbacks, public variables, focus transfer, interruption,
completion, and outgoing-presence behavior documented by Hint and
SwitchAnimation.

Field does not add synchronous cleanup guarantees for zero-duration
replacements. Under reduced motion, Hint and SwitchAnimation retain their
documented immediate visual state and lifecycle behavior.

## Use Cases

### UC-001 - Expose the Powercoach Field family

Given a consumer imports Field or its direct public exports
When the family is inspected
Then Root, Item, Description, Control, Label, and Validity plus their documented
types are available, Field is not callable, and no Field.Error surface exists

### UC-002 - Preserve Base UI field state

Given a consumer configures Root validation, naming, disabled state, render
replacement, native props, or actions
When field state changes
Then Root and every applicable part preserve Base UI behavior, state callbacks,
refs, events, data attributes, and precedence except for the documented
Powercoach additions

### UC-003 - Own required state at Root

Given a consumer sets Root required or omits it
When Field renders
Then the value defaults to false, controls the generated native input
requirement, appears in Root and Label state and data-required, and controls the
Label asterisk while Control cannot override it

### UC-004 - Generate the Input anatomy

Given a consumer supplies one addOn ReactElement to Control
When Control renders inside Root
Then one Input.Root contains exactly one decorative Input.AddOn with that sole
child and one Field-compatible Input.Control

### UC-005 - Forward bounded Input props

Given a consumer supplies top-level Control props, inputRootProps, or
inputAddOnProps
When the generated Input renders
Then each prop reaches its documented Input part, the three refs remain
independent, and owned children, required state, decorative semantics, render
boundaries, and reserved Input attributes retain precedence

### UC-006 - Render the Heading label

Given a consumer renders Label with top-level Base UI Label props and optional
headingProps
When Label is displayed
Then one associated final element uses Heading at fixed size sm, preserves Base
UI label behavior and FieldLabelState, and forwards only the selected mutually
exclusive tone or intent through headingProps

### UC-007 - Show muted waiting guidance

Given Field.Validity exposes no client error
When Description selects its content
Then Hint displays the required waitingContent with waitingKey and tone muted
inside the one registered accessible-description wrapper

### UC-008 - Create one destructive item per client error

Given Field.Validity exposes one or more ordered native or custom client error
strings
When Description builds its Hint items
Then every string becomes one condition-true item in the same order and Hint
displays the first item with intent destructive

### UC-009 - Resolve validation-message keys

Given Description maps ordered client errors
When getErrorKey is omitted or supplied
Then each item uses the documented message-and-occurrence default or the exact
consumer key and every error key remains mutually unique with waitingKey

### UC-010 - Forward bounded Hint props

Given a consumer supplies Description wrapper props, textProps, stripesOptions,
or switchAnimationOptions
When Description renders
Then wrapper props and each bounded option reach their documented public surface
while Field retains Hint children, generated items, appearance, registration,
and owned composition

### UC-011 - Associate Label and Description with Control

Given a consumer renders Label, generated Control, and Description inside Root
When assistive technology encounters the input
Then Base UI associates the Label and registered Description with Control, the
native required state remains authoritative, and the visible asterisk and AddOn
remain hidden from assistive technology

### UC-012 - Preserve accessible presentation boundaries

Given Label uses a Heading appearance or Description switches to a destructive
error
When the field is rendered or updated
Then appearance changes add no heading level, status role, live region,
announcement behavior, focus target, or source-text mutation

### UC-013 - Preserve Item, Validity, and render adapters

Given a consumer uses Item, Validity, or a supported render replacement
When Field renders
Then Item and Validity preserve their Base UI contracts and each render adapter
receives its documented Field state while preserving merged props, refs, and
owned children

### UC-014 - Keep Description as the only Field error presentation

Given client validation produces one or more errors
When Field presents feedback
Then Description's Hint displays the first ordered message and the Field family
provides no Error part that duplicates or replaces it

### UC-015 - Retain composed motion

Given focus enters or leaves the generated Input or Description selects another
key
When composed motion runs, is interrupted, has zero duration, or is reduced
Then Input and Hint retain their documented CSS states, lifecycles, focus
behavior, completion, cleanup, and reduced-motion contracts without a
Field-owned animation

### UC-016 - Compose another Base UI control through Item

Given a consumer uses Item with a supported Base UI checkbox or radio control
instead of generated Field.Control
When the group item renders
Then Item, Label, Description, and Validity preserve Base UI association and
state while the consumer owns the external control's requirement and visual
contract
