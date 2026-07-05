import { Checkbox } from '@base-ui/react/checkbox'
import { Field as BaseUiField } from '@base-ui/react/field'
import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import {
  createRef,
  useState,
  type ComponentPropsWithRef,
  type CSSProperties,
  type Key
} from 'react'
import { describe, expect, expectTypeOf, it, vi } from 'vitest'

import {
  type FieldControlChangeEventDetails,
  type FieldControlChangeEventReason,
  type FieldControlInputAddOnProps,
  type FieldControlInputRootProps,
  type FieldControlProps,
  type FieldControlState,
  type FieldDescriptionGetErrorKey,
  type FieldDescriptionProps,
  type FieldDescriptionState,
  type FieldDescriptionStripesOptions,
  type FieldDescriptionSwitchAnimationOptions,
  type FieldDescriptionTextProps,
  type FieldItemProps,
  type FieldItemState,
  type FieldLabelHeadingProps,
  type FieldLabelProps,
  type FieldLabelState,
  type FieldNamespace,
  type FieldRootActions,
  type FieldRootProps,
  type FieldRootState,
  type FieldValidityData,
  type FieldValidityProps,
  type FieldValidityState,
  type HintStripesOptions,
  type HintSwitchAnimationOptions,
  type HintTextProps,
  type InputAddOnProps,
  type InputControlChangeEventDetails,
  type InputControlChangeEventReason,
  type InputControlState,
  type InputRootProps,
  type ToneOrIntentProps
} from '../..'
import * as PackageExports from '../..'

interface FieldPackageContract {
  Field: FieldNamespace
  FieldControl: FieldNamespace['Control']
  FieldDescription: FieldNamespace['Description']
  FieldItem: FieldNamespace['Item']
  FieldLabel: FieldNamespace['Label']
  FieldRoot: FieldNamespace['Root']
  FieldValidity: FieldNamespace['Validity']
}

type IsAny<TValue> = 0 extends 1 & TValue ? true : false
type OmitsKey<TValue, TKey extends PropertyKey> =
  IsAny<TValue> extends true ? true : TKey extends keyof TValue ? false : true

type FieldControlOmitsChildren = OmitsKey<FieldControlProps, 'children'>
type FieldDescriptionOmitsChildren = OmitsKey<FieldDescriptionProps, 'children'>
type FieldDescriptionOmitsHints = OmitsKey<FieldDescriptionProps, 'hints'>
type FieldDescriptionOmitsIntent = OmitsKey<FieldDescriptionProps, 'intent'>
type FieldDescriptionOmitsTone = OmitsKey<FieldDescriptionProps, 'tone'>
type FieldDescriptionClassNameCallback = Exclude<
  NonNullable<FieldDescriptionProps['className']>,
  string
>
type FieldDescriptionStyleCallback = Exclude<
  NonNullable<FieldDescriptionProps['style']>,
  CSSProperties
>

type SwitchAnimationCssProperties = CSSProperties &
  Partial<
    Record<
      '--switch-animation-distance' | '--switch-animation-duration' | '--switch-animation-stagger',
      string
    >
  >

const PACKAGE_EXPORTS = PackageExports as typeof PackageExports & FieldPackageContract
const Field = PACKAGE_EXPORTS.Field
const FieldControl = PACKAGE_EXPORTS.FieldControl
const FieldDescription = PACKAGE_EXPORTS.FieldDescription
const FieldItem = PACKAGE_EXPORTS.FieldItem
const FieldLabel = PACKAGE_EXPORTS.FieldLabel
const FieldRoot = PACKAGE_EXPORTS.FieldRoot
const FieldValidity = PACKAGE_EXPORTS.FieldValidity

const ZERO_MOTION_STYLE = {
  '--switch-animation-distance': '0px',
  '--switch-animation-duration': '0ms',
  '--switch-animation-stagger': '0ms'
} as SwitchAnimationCssProperties

function getDescriptionWrapper(control: HTMLElement): HTMLElement {
  const descriptionId = control.getAttribute('aria-describedby')

  expect(descriptionId).toBeTruthy()

  const wrapper = document.getElementById(descriptionId as string)

  expect(wrapper).toBeInTheDocument()

  return wrapper as HTMLElement
}

function ConfiguredFieldsProbe() {
  const [query, setQuery] = useState('tempo')

  return (
    <div>
      <Field.Root name="search">
        <Field.Label headingProps={{ tone: 'accent' }}>Search</Field.Label>
        <Field.Control
          addOn={<svg data-testid="search-icon" />}
          inputAddOnProps={{ 'data-rail': 'search', position: 'end' }}
          inputRootProps={{ 'data-surface': 'search', size: 'md' }}
          onValueChange={setQuery}
          value={query}
        />
        <Field.Description
          stripesOptions={{ angle: '45deg', gap: '6px' }}
          switchAnimationOptions={{ direction: 'right', style: ZERO_MOTION_STYLE }}
          textProps={{ className: 'font-medium', size: 'sm' }}
          waitingContent="Search by exercise or equipment."
          waitingKey="search-guidance"
        />
        <output>Current search: {query}</output>
      </Field.Root>

      <Field.Root name="athlete">
        <Field.Label>Athlete</Field.Label>
        <Field.Control addOn={<svg />} defaultValue="Yann" />
        <Field.Description
          waitingContent="Use the athlete's display name."
          waitingKey="athlete-guidance"
        />
      </Field.Root>
    </div>
  )
}

describe('Field', () => {
  it('UC-001 / CR-002 - exposes the non-callable namespace, direct runtime exports, documented types, and no Error surface', () => {
    expect(typeof Field).toBe('object')
    expect(Field).toEqual({
      Control: FieldControl,
      Description: FieldDescription,
      Item: FieldItem,
      Label: FieldLabel,
      Root: FieldRoot,
      Validity: FieldValidity
    })
    expect(Field).not.toHaveProperty('Error')
    expect(PACKAGE_EXPORTS).not.toHaveProperty('FieldError')

    expectTypeOf<FieldRootProps>().toMatchTypeOf<BaseUiField.Root.Props>()
    expectTypeOf<FieldRootActions>().toEqualTypeOf<BaseUiField.Root.Actions>()
    expectTypeOf<FieldRootState>().toMatchTypeOf<BaseUiField.Root.State>()
    expectTypeOf<FieldRootState['required']>().toEqualTypeOf<boolean>()
    expectTypeOf<FieldItemProps>().toEqualTypeOf<BaseUiField.Item.Props>()
    expectTypeOf<FieldItemState>().toEqualTypeOf<BaseUiField.Item.State>()
    expectTypeOf<FieldDescriptionState>().toEqualTypeOf<BaseUiField.Description.State>()
    expectTypeOf<FieldDescriptionClassNameCallback>().toEqualTypeOf<
      (state: FieldDescriptionState) => string | undefined
    >()
    expectTypeOf<FieldDescriptionStyleCallback>().toEqualTypeOf<
      (state: FieldDescriptionState) => CSSProperties | undefined
    >()
    expectTypeOf<FieldDescriptionTextProps>().toEqualTypeOf<
      Pick<HintTextProps, 'className' | 'size' | 'style'>
    >()
    expectTypeOf<FieldDescriptionStripesOptions>().toEqualTypeOf<HintStripesOptions>()
    expectTypeOf<FieldDescriptionSwitchAnimationOptions>().toEqualTypeOf<HintSwitchAnimationOptions>()
    expectTypeOf<FieldDescriptionGetErrorKey>().toEqualTypeOf<
      (error: string, index: number, errors: readonly string[]) => Key
    >()
    expectTypeOf<FieldControlState>().toEqualTypeOf<InputControlState>()
    expectTypeOf<FieldControlChangeEventReason>().toEqualTypeOf<InputControlChangeEventReason>()
    expectTypeOf<FieldControlChangeEventDetails>().toEqualTypeOf<InputControlChangeEventDetails>()
    expectTypeOf<FieldControlInputRootProps>().toEqualTypeOf<Omit<InputRootProps, 'children'>>()
    expectTypeOf<FieldControlInputAddOnProps>().toEqualTypeOf<Omit<InputAddOnProps, 'children'>>()
    expectTypeOf<FieldLabelProps>().toMatchTypeOf<BaseUiField.Label.Props>()
    expectTypeOf<FieldLabelState>().toMatchTypeOf<BaseUiField.Label.State>()
    expectTypeOf<FieldLabelState['required']>().toEqualTypeOf<boolean>()
    expectTypeOf<FieldLabelHeadingProps>().toEqualTypeOf<ToneOrIntentProps>()
    expectTypeOf<FieldValidityProps>().toEqualTypeOf<BaseUiField.Validity.Props>()
    expectTypeOf<FieldValidityState>().toEqualTypeOf<BaseUiField.Validity.State>()
    expectTypeOf<FieldValidityData>().toEqualTypeOf<BaseUiField.ValidityData>()
    expectTypeOf<FieldControlOmitsChildren>().toEqualTypeOf<true>()
    expectTypeOf<FieldDescriptionOmitsChildren>().toEqualTypeOf<true>()
    expectTypeOf<FieldDescriptionOmitsHints>().toEqualTypeOf<true>()
    expectTypeOf<FieldDescriptionOmitsIntent>().toEqualTypeOf<true>()
    expectTypeOf<FieldDescriptionOmitsTone>().toEqualTypeOf<true>()
  })

  it('UC-003 / UC-004 / UC-006 / UC-007 / UC-011 / UC-012 / EX-001 - renders the required accessible consumer anatomy with waiting guidance', () => {
    render(
      <Field.Root data-testid="required-root" name="email" required>
        <Field.Label>Email address</Field.Label>
        <Field.Control
          addOn={<svg data-testid="email-icon" />}
          autoComplete="email"
          placeholder="coach@example.com"
          type="email"
        />
        <Field.Description
          waitingContent="Used for workout notifications."
          waitingKey="email-guidance"
        />
      </Field.Root>
    )

    const root = screen.getByTestId('required-root')
    const control = screen.getByRole('textbox', { name: 'Email address' }) as HTMLInputElement
    const label = control.labels?.[0] as HTMLLabelElement
    const asterisk = within(label).getByText('*')
    const addOn = screen.getByTestId('email-icon').parentElement as HTMLElement
    const inputRoot = addOn.parentElement as HTMLElement
    const description = getDescriptionWrapper(control)
    const waitingContent = screen.getByText('Used for workout notifications.')

    expect(root.tagName).toBe('DIV')
    expect(root).toHaveAttribute('data-required')
    expect(label).toHaveAttribute('data-required')
    expect(label).toHaveClass('font-heading', 'text-lg', 'tracking-wide', 'lowercase')
    expect(asterisk).toHaveAttribute('aria-hidden', 'true')
    expect(control).toBeRequired()
    expect(control).toHaveAttribute('name', 'email')
    expect(control).toHaveAttribute('autocomplete', 'email')
    expect(control).toHaveAccessibleDescription('Used for workout notifications.')
    expect(inputRoot).toHaveAttribute('data-size', 'xl')
    expect(inputRoot.querySelectorAll('[data-field-addon]')).toHaveLength(1)
    expect(inputRoot.querySelectorAll('input')).toHaveLength(1)
    expect(addOn).toHaveAttribute('data-field-addon')
    expect(addOn).toHaveAttribute('data-position', 'start')
    expect(addOn).toHaveAttribute('aria-hidden', 'true')
    expect(addOn).toHaveAttribute('inert')
    expect(description.tagName).toBe('DIV')
    expect(description).not.toHaveAttribute('role')
    expect(description).not.toHaveAttribute('aria-live')
    expect(waitingContent).toHaveClass('text-muted-foreground')
    expect(screen.queryByRole('heading', { name: 'Email address' })).not.toBeInTheDocument()
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('UC-003 - defaults required to false and ignores an untyped Control override', () => {
    const unsafeControlProps = { required: true } as unknown as FieldControlProps

    render(
      <Field.Root data-testid="optional-root">
        <Field.Label>Optional field</Field.Label>
        <Field.Control {...unsafeControlProps} addOn={<svg />} />
      </Field.Root>
    )

    const root = screen.getByTestId('optional-root')
    const control = screen.getByRole('textbox', { name: 'Optional field' }) as HTMLInputElement
    const label = control.labels?.[0] as HTMLLabelElement

    expect(root).not.toHaveAttribute('data-required')
    expect(label).not.toHaveAttribute('data-required')
    expect(within(label).queryByText('*')).not.toBeInTheDocument()
    expect(control).not.toBeRequired()
  })

  it('UC-002 - preserves Base UI state attributes on applicable parts without mirroring them to Input chrome', () => {
    render(
      <Field.Root data-testid="state-root" dirty invalid touched>
        <Field.Label>Stateful field</Field.Label>
        <Field.Control addOn={<svg data-testid="state-icon" />} defaultValue="filled" />
        <Field.Description waitingContent="State guidance" waitingKey="state-guidance" />
      </Field.Root>
    )

    const root = screen.getByTestId('state-root')
    const control = screen.getByRole('textbox', { name: 'Stateful field' }) as HTMLInputElement
    const label = control.labels?.[0] as HTMLLabelElement
    const description = getDescriptionWrapper(control)
    const addOn = screen.getByTestId('state-icon').parentElement as HTMLElement
    const inputRoot = addOn.parentElement as HTMLElement

    for (const part of [root, label, control, description]) {
      expect(part).toHaveAttribute('data-invalid')
      expect(part).toHaveAttribute('data-dirty')
      expect(part).toHaveAttribute('data-touched')
      expect(part).toHaveAttribute('data-filled')
    }

    expect(inputRoot).not.toHaveAttribute('data-invalid')
    expect(inputRoot).not.toHaveAttribute('data-dirty')
    expect(addOn).not.toHaveAttribute('data-invalid')
    expect(addOn).not.toHaveAttribute('data-dirty')

    fireEvent.focus(control)

    for (const part of [root, label, control, description]) {
      expect(part).toHaveAttribute('data-focused')
    }

    fireEvent.blur(control)

    for (const part of [root, label, control, description]) {
      expect(part).not.toHaveAttribute('data-focused')
    }
  })

  it('UC-002 - preserves Root render composition, events, refs, actions, and name and disabled precedence', () => {
    const actionsRef = createRef<FieldRootActions | null>()
    const rootRef = createRef<HTMLDivElement>()
    const rootState = vi.fn((_state: FieldRootState) => 'consumer-root-state')
    const onRootClick = vi.fn()
    const onRenderClick = vi.fn()

    render(
      <Field.Root
        actionsRef={actionsRef}
        className={rootState}
        data-consumer-root="preserved"
        disabled
        name="authoritative-name"
        onClick={onRootClick}
        ref={rootRef}
        render={<section data-testid="rendered-root" onClick={onRenderClick} />}
        required
      >
        <Field.Label>Disabled field</Field.Label>
        <Field.Control addOn={<svg />} disabled={false} name="ignored-name" />
      </Field.Root>
    )

    const root = screen.getByTestId('rendered-root')
    const control = screen.getByRole('textbox', { name: 'Disabled field' })

    fireEvent.click(root)

    expect(root.tagName).toBe('SECTION')
    expect(rootRef.current).toBe(root)
    expect(root).toHaveAttribute('data-consumer-root', 'preserved')
    expect(root).toHaveAttribute('data-disabled')
    expect(root).toHaveAttribute('data-required')
    expect(root).toHaveClass('consumer-root-state')
    expect(rootState).toHaveBeenCalledWith(
      expect.objectContaining({ disabled: true, required: true })
    )
    expect(onRootClick).toHaveBeenCalledOnce()
    expect(onRenderClick).toHaveBeenCalledOnce()
    expect(actionsRef.current?.validate).toBeTypeOf('function')
    expect(control).toBeDisabled()
    expect(control).toHaveAttribute('name', 'authoritative-name')
    expect(control).not.toHaveAttribute('name', 'ignored-name')
  })

  it('UC-002 - preserves onChange validation debounce timing', async () => {
    vi.useFakeTimers()

    try {
      const validate = vi.fn(() => null)

      render(
        <Field.Root validate={validate} validationDebounceTime={50} validationMode="onChange">
          <Field.Label>Debounced field</Field.Label>
          <Field.Control addOn={<svg />} />
        </Field.Root>
      )

      fireEvent.change(screen.getByRole('textbox', { name: 'Debounced field' }), {
        target: { value: 'tempo' }
      })

      expect(validate).not.toHaveBeenCalled()

      await act(async () => vi.advanceTimersByTimeAsync(49))
      expect(validate).not.toHaveBeenCalled()

      await act(async () => vi.advanceTimersByTimeAsync(1))
      expect(validate).toHaveBeenCalledWith('tempo', expect.any(Object))
    } finally {
      vi.useRealTimers()
    }
  })

  it('UC-004 / UC-005 - forwards bounded Input props and preserves three refs and owned anatomy', () => {
    const rootRef = createRef<HTMLDivElement>()
    const addOnRef = createRef<HTMLSpanElement>()
    const controlRef = createRef<HTMLElement>()
    const onRootClick = vi.fn()
    const onControlInput = vi.fn()
    const onUnsafeAddOnClick = vi.fn()
    const inputRootProps = {
      children: <span data-testid="unsafe-root-child" />,
      className: 'consumer-input-root',
      'data-size': 'consumer-size',
      'data-surface': 'search',
      onClick: onRootClick,
      ref: rootRef,
      render: <section />,
      size: 'md',
      style: { opacity: 0.9 }
    } as unknown as FieldControlInputRootProps
    const inputAddOnProps = {
      'aria-label': 'Unsafe AddOn label',
      children: <span data-testid="unsafe-addon-child" />,
      className: 'consumer-input-addon',
      'data-field-addon': 'consumer-addon',
      'data-position': 'consumer-position',
      'data-rail': 'search',
      onClick: onUnsafeAddOnClick,
      position: 'end',
      ref: addOnRef,
      role: 'button',
      tabIndex: 0
    } as unknown as FieldControlInputAddOnProps

    render(
      <Field.Root>
        <Field.Label>Forwarded field</Field.Label>
        <Field.Control
          addOn={<svg data-testid="owned-addon-child" />}
          data-control="search"
          defaultValue="tempo"
          inputAddOnProps={inputAddOnProps}
          inputRootProps={inputRootProps}
          onInput={onControlInput}
          ref={controlRef}
          style={{ letterSpacing: '1px' }}
        />
      </Field.Root>
    )

    const control = screen.getByRole('textbox', { name: 'Forwarded field' })
    const addOn = screen.getByTestId('owned-addon-child').parentElement as HTMLElement
    const inputRoot = addOn.parentElement as HTMLElement

    fireEvent.click(inputRoot)
    fireEvent.input(control, { target: { value: 'threshold' } })
    fireEvent.click(addOn)

    expect(rootRef.current).toBe(inputRoot)
    expect(addOnRef.current).toBe(addOn)
    expect(controlRef.current).toBe(control)
    expect(inputRoot.tagName).toBe('DIV')
    expect(inputRoot).toHaveAttribute('data-size', 'md')
    expect(inputRoot).toHaveAttribute('data-surface', 'search')
    expect(inputRoot).toHaveClass('consumer-input-root')
    expect(inputRoot).toHaveStyle({ opacity: '0.9' })
    expect(inputRoot).not.toHaveAttribute('render')
    expect(screen.queryByTestId('unsafe-root-child')).not.toBeInTheDocument()
    expect(inputRoot.querySelectorAll('[data-field-addon]')).toHaveLength(1)
    expect(inputRoot.querySelectorAll('input')).toHaveLength(1)
    expect(addOn).toHaveAttribute('data-position', 'end')
    expect(addOn).toHaveAttribute('data-field-addon')
    expect(addOn).not.toHaveAttribute('data-field-addon', 'consumer-addon')
    expect(addOn).toHaveAttribute('data-rail', 'search')
    expect(addOn).not.toHaveAttribute('aria-label')
    expect(addOn).not.toHaveAttribute('role')
    expect(addOn).not.toHaveAttribute('tabindex')
    expect(screen.queryByTestId('unsafe-addon-child')).not.toBeInTheDocument()
    expect(onUnsafeAddOnClick).not.toHaveBeenCalled()
    expect(control).toHaveValue('threshold')
    expect(control).toHaveAttribute('data-control', 'search')
    expect(control).toHaveStyle({ letterSpacing: '1px' })
    expect(onRootClick).toHaveBeenCalledOnce()
    expect(onControlInput).toHaveBeenCalledOnce()
  })

  it('UC-005 / UC-006 / UC-007 / UC-010 / UC-015 / EX-003 - supports configured controlled and uncontrolled consumer fields', () => {
    render(<ConfiguredFieldsProbe />)

    const controlled = screen.getByRole('textbox', { name: 'Search' })
    const uncontrolled = screen.getByRole('textbox', { name: 'Athlete' })
    const controlledRoot = screen.getByTestId('search-icon').parentElement?.parentElement
    const controlledAddOn = screen.getByTestId('search-icon').parentElement
    const controlledLabel = (controlled as HTMLInputElement).labels?.[0]
    const controlledHint = screen.getByText('Search by exercise or equipment.')
    const controlledSwitch = controlledHint.closest('[data-motion="switch"]')

    expect(controlled).toHaveValue('tempo')
    fireEvent.change(controlled, { target: { value: 'threshold' } })
    expect(controlled).toHaveValue('threshold')
    expect(screen.getByText('Current search: threshold')).toBeVisible()
    expect(uncontrolled).toHaveValue('Yann')
    expect(controlledRoot).toHaveAttribute('data-size', 'md')
    expect(controlledRoot).toHaveAttribute('data-surface', 'search')
    expect(controlledAddOn).toHaveAttribute('data-position', 'end')
    expect(controlledAddOn).toHaveAttribute('data-rail', 'search')
    expect(controlledLabel).toHaveClass('font-heading', 'text-lg', 'text-accent-foreground')
    expect(controlledHint).toHaveClass('font-medium', 'text-sm', 'text-muted-foreground')
    expect(controlledSwitch).toHaveAttribute('data-direction', 'right')
  })

  it('UC-007 / UC-008 / UC-009 / UC-012 / UC-014 / EX-002 / CR-004 - displays the first ordered client error and exposes every error through Validity and keys', async () => {
    const actionsRef = createRef<FieldRootActions | null>()
    const getErrorKey = vi.fn<FieldDescriptionGetErrorKey>(
      (error: string, index: number) => `training-code-${index}-${error}`
    )
    const onSwitchChange = vi.fn()
    let errors = [
      'Use at least eight characters.',
      'Add one uppercase letter.',
      'Use at least eight characters.'
    ]

    render(
      <Field.Root
        actionsRef={actionsRef}
        name="trainingCode"
        validate={() => (errors.length > 0 ? errors : null)}
      >
        <Field.Label>Training code</Field.Label>
        <Field.Control addOn={<svg />} defaultValue="coach" />
        <Field.Description
          getErrorKey={getErrorKey}
          switchAnimationOptions={{ onSwitchChange, style: ZERO_MOTION_STYLE }}
          waitingContent="Use a memorable code with at least eight characters."
          waitingKey="training-code-guidance"
        />
        <Field.Validity>
          {(state: FieldValidityState) => (
            <output>
              Current errors: {state.errors.length > 0 ? state.errors.join(' | ') : 'none'}
            </output>
          )}
        </Field.Validity>
      </Field.Root>
    )

    const control = screen.getByRole('textbox', { name: 'Training code' })

    act(() => control.focus())
    await act(async () => actionsRef.current?.validate())

    await waitFor(() => expect(screen.getByText('Use at least eight characters.')).toBeVisible())

    const activeError = screen.getByText('Use at least eight characters.')

    expect(activeError).toHaveClass('text-destructive-foreground')
    expect(screen.queryByText('Add one uppercase letter.')).not.toBeInTheDocument()
    expect(screen.getByText(/Current errors:/)).toHaveTextContent(
      'Use at least eight characters. | Add one uppercase letter. | Use at least eight characters.'
    )
    expect(getErrorKey.mock.calls).toEqual(
      expect.arrayContaining([
        ['Use at least eight characters.', 0, errors],
        ['Add one uppercase letter.', 1, errors],
        ['Use at least eight characters.', 2, errors]
      ])
    )
    await waitFor(() =>
      expect(onSwitchChange).toHaveBeenCalledWith(
        expect.objectContaining({
          nextKey: 'training-code-0-Use at least eight characters.',
          previousKey: 'training-code-guidance'
        })
      )
    )
    expect(control).toHaveFocus()
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    expect(getDescriptionWrapper(control)).not.toHaveAttribute('aria-live')

    errors = []
    await act(async () => actionsRef.current?.validate())

    await waitFor(() => {
      const activeWaiting = screen
        .getAllByText('Use a memorable code with at least eight characters.')
        .filter((content) => content.closest('[aria-hidden="true"]') === null)

      expect(activeWaiting).toHaveLength(1)
      expect(activeWaiting[0]).toHaveClass('text-muted-foreground')
    })
    expect(screen.getByText('Current errors: none')).toBeVisible()
  })

  it('UC-009 - derives stable selected error keys from message content when getErrorKey is omitted', async () => {
    const actionsRef = createRef<FieldRootActions | null>()
    const onSwitchChange = vi.fn()
    let errors: string[] = []

    render(
      <Field.Root actionsRef={actionsRef} validate={() => (errors.length > 0 ? errors : null)}>
        <Field.Label>Keyed field</Field.Label>
        <Field.Control addOn={<svg />} />
        <Field.Description
          switchAnimationOptions={{ onSwitchChange, style: ZERO_MOTION_STYLE }}
          waitingContent="Waiting for validation."
          waitingKey="waiting"
        />
      </Field.Root>
    )

    errors = ['First message']
    await act(async () => actionsRef.current?.validate())
    await waitFor(() => expect(onSwitchChange).toHaveBeenCalledTimes(1))
    const firstDerivedKey = onSwitchChange.mock.calls[0]?.[0].nextKey

    errors = []
    await act(async () => actionsRef.current?.validate())
    await waitFor(() => expect(onSwitchChange).toHaveBeenCalledTimes(2))

    errors = ['First message']
    await act(async () => actionsRef.current?.validate())
    await waitFor(() => expect(onSwitchChange).toHaveBeenCalledTimes(3))
    const repeatedDerivedKey = onSwitchChange.mock.calls[2]?.[0].nextKey

    errors = []
    await act(async () => actionsRef.current?.validate())
    await waitFor(() => expect(onSwitchChange).toHaveBeenCalledTimes(4))

    errors = ['Second message']
    await act(async () => actionsRef.current?.validate())
    await waitFor(() => expect(onSwitchChange).toHaveBeenCalledTimes(5))
    const secondDerivedKey = onSwitchChange.mock.calls[4]?.[0].nextKey

    expect(firstDerivedKey).toBe(repeatedDerivedKey)
    expect(firstDerivedKey).not.toBe(secondDerivedKey)
    expect(firstDerivedKey).not.toBe('waiting')
    expect(secondDerivedKey).not.toBe('waiting')
  })

  it('UC-007 / UC-010 / CR-002 - forwards Description wrapper, state callbacks, Text, Stripes, and SwitchAnimation options within their public boundaries', () => {
    const descriptionRef = createRef<HTMLElement>()
    const descriptionClassName = vi.fn((state: FieldDescriptionState) =>
      state.valid === false ? 'consumer-description-invalid' : 'consumer-description-valid'
    )
    const descriptionStyle = vi.fn((state: FieldDescriptionState) => ({
      inlineSize: '18rem',
      opacity: state.focused ? 1 : 0.5
    }))
    const onDescriptionClick = vi.fn()

    render(
      <Field.Root dirty invalid touched>
        <Field.Label>Configured description</Field.Label>
        <Field.Control addOn={<svg />} defaultValue="configured" />
        <Field.Description
          aria-label="Configured guidance"
          className={descriptionClassName}
          data-description="consumer"
          onClick={onDescriptionClick}
          ref={descriptionRef}
          stripesOptions={{
            angle: '45deg',
            className: 'consumer-stripes',
            color: 'currentColor',
            gap: '6px',
            style: { color: 'rgb(1, 2, 3)' },
            width: '2px'
          }}
          style={descriptionStyle}
          switchAnimationOptions={{
            className: 'consumer-switch',
            direction: 'right',
            style: {
              ...ZERO_MOTION_STYLE,
              '--switch-animation-duration': '180ms'
            } as CSSProperties
          }}
          textProps={{
            className: 'font-medium',
            size: 'lg',
            style: { textTransform: 'uppercase' }
          }}
          waitingContent="Configured waiting guidance."
          waitingKey="configured-guidance"
        />
      </Field.Root>
    )

    const control = screen.getByRole('textbox', { name: 'Configured description' })
    const wrapper = getDescriptionWrapper(control)
    const content = screen.getByText('Configured waiting guidance.')
    const stripes = content.closest('.consumer-stripes') as HTMLElement
    const switchRoot = content.closest('[data-motion="switch"]') as HTMLElement

    fireEvent.click(wrapper)

    expect(descriptionRef.current).toBe(wrapper)
    expect(wrapper).toHaveAccessibleName('Configured guidance')
    expect(wrapper).toHaveAttribute('data-description', 'consumer')
    expect(wrapper).toHaveClass('consumer-description-invalid')
    expect(wrapper).toHaveStyle({ inlineSize: '18rem', opacity: '0.5' })
    expect(descriptionClassName).toHaveBeenCalledWith(
      expect.objectContaining({
        dirty: true,
        filled: true,
        focused: false,
        touched: true,
        valid: false
      })
    )
    expect(descriptionStyle).toHaveBeenCalledWith(
      expect.objectContaining({
        dirty: true,
        filled: true,
        focused: false,
        touched: true,
        valid: false
      })
    )
    expect(onDescriptionClick).toHaveBeenCalledOnce()
    expect(wrapper).not.toHaveAttribute('data-motion')
    expect(content).toHaveClass('font-medium', 'text-lg', 'text-muted-foreground', 'bg-background')
    expect(content).toHaveStyle({ textTransform: 'uppercase' })
    expect(stripes).toHaveStyle({ color: 'rgb(1, 2, 3)' })
    expect(stripes.style.getPropertyValue('--stripes-angle')).toBe('45deg')
    expect(stripes.style.getPropertyValue('--stripes-color')).toBe('currentColor')
    expect(stripes.style.getPropertyValue('--stripes-gap')).toBe('6px')
    expect(stripes.style.getPropertyValue('--stripes-width')).toBe('2px')
    expect(switchRoot).toHaveClass('consumer-switch')
    expect(switchRoot).toHaveAttribute('data-direction', 'right')
    expect(switchRoot.style.getPropertyValue('--switch-animation-duration')).toBe('180ms')
    expect(screen.getAllByText('Configured waiting guidance.')).toHaveLength(1)

    fireEvent.focus(control)

    expect(wrapper).toHaveStyle({ inlineSize: '18rem', opacity: '1' })
    expect(descriptionClassName).toHaveBeenCalledWith(expect.objectContaining({ focused: true }))
    expect(descriptionStyle).toHaveBeenCalledWith(expect.objectContaining({ focused: true }))
  })

  it('UC-002 / UC-003 / UC-005 / UC-006 / UC-010 / UC-013 / EX-004 - preserves public render adapters, states, refs, props, and owned children', () => {
    const rootRef = createRef<HTMLDivElement>()
    const labelRef = createRef<HTMLElement>()
    const controlRef = createRef<HTMLElement>()
    const descriptionRef = createRef<HTMLElement>()
    let rootState: FieldRootState | undefined
    let labelState: FieldLabelState | undefined
    let controlState: FieldControlState | undefined
    let descriptionState: FieldDescriptionState | undefined

    render(
      <Field.Root
        data-region="profile"
        ref={rootRef}
        render={(props: ComponentPropsWithRef<'div'>, state: FieldRootState) => {
          rootState = state

          return <section {...(props as ComponentPropsWithRef<'section'>)} />
        }}
        required
      >
        <Field.Label
          data-label="profile"
          ref={labelRef}
          render={(props: ComponentPropsWithRef<'label'>, state: FieldLabelState) => {
            labelState = state

            return <label {...props} data-required-probe={state.required ? '' : undefined} />
          }}
        >
          Profile link
        </Field.Label>
        <Field.Control
          addOn={<svg />}
          data-control="profile"
          onBlur={() => undefined}
          onFocus={() => undefined}
          ref={controlRef}
          render={(props: ComponentPropsWithRef<'input'>, state: FieldControlState) => {
            controlState = state

            return <input {...props} data-focused-probe={state.focused ? '' : undefined} />
          }}
          type="url"
        />
        <Field.Description
          data-description="profile"
          ref={descriptionRef}
          render={(props: ComponentPropsWithRef<'div'>, state: FieldDescriptionState) => {
            descriptionState = state

            return <aside {...(props as ComponentPropsWithRef<'aside'>)} />
          }}
          waitingContent="Paste a complete public profile URL."
          waitingKey="profile-link-guidance"
        />
      </Field.Root>
    )

    const root = screen.getByText('Profile link').closest('section') as HTMLElement
    const control = screen.getByRole('textbox', { name: 'Profile link' })
    const label = (control as HTMLInputElement).labels?.[0] as HTMLLabelElement
    const description = getDescriptionWrapper(control)

    expect(root).toHaveAttribute('data-region', 'profile')
    expect(rootRef.current).toBe(root)
    expect(labelRef.current).toBe(label)
    expect(controlRef.current).toBe(control)
    expect(descriptionRef.current).toBe(description)
    expect(label).toHaveAttribute('data-label', 'profile')
    expect(label).toHaveAttribute('data-required-probe')
    expect(control).toHaveAttribute('data-control', 'profile')
    expect(description.tagName).toBe('ASIDE')
    expect(description).toHaveAttribute('data-description', 'profile')
    expect(rootState).toEqual(expect.objectContaining({ required: true }))
    expect(labelState).toEqual(expect.objectContaining({ required: true }))
    expect(controlState).toEqual(expect.objectContaining({ focused: false }))
    expect(descriptionState).toEqual(expect.objectContaining({ focused: false }))
    expect(screen.getAllByText('Profile link')).toHaveLength(1)
    expect(within(label).getAllByText('*')).toHaveLength(1)
    expect(screen.getAllByText('Paste a complete public profile URL.')).toHaveLength(1)

    fireEvent.focus(control)

    expect(control).toHaveAttribute('data-focused-probe')
    expect(controlState).toEqual(expect.objectContaining({ focused: true }))
    expect(descriptionState).toEqual(expect.objectContaining({ focused: true }))
  })

  it('UC-002 / UC-006 / UC-007 / UC-013 / UC-016 / EX-005 - preserves Item, Validity, and external checkbox composition', () => {
    const itemRef = createRef<HTMLDivElement>()
    let itemState: FieldItemState | undefined

    render(
      <Field.Root data-testid="consent-root" name="trainingConsent">
        <Field.Item
          data-item="consent"
          ref={itemRef}
          render={(props: ComponentPropsWithRef<'div'>, state: FieldItemState) => {
            itemState = state

            return <section {...(props as ComponentPropsWithRef<'section'>)} />
          }}
        >
          <Field.Label>
            <Checkbox.Root data-testid="consent-checkbox">
              <Checkbox.Indicator>checked</Checkbox.Indicator>
            </Checkbox.Root>
            I accept the training data policy
          </Field.Label>
          <Field.Description
            waitingContent="You can withdraw consent later."
            waitingKey="consent-guidance"
          />
        </Field.Item>
        <Field.Validity>
          {(state: FieldValidityState) => (
            <output>Current consent errors: {state.errors.length}</output>
          )}
        </Field.Validity>
      </Field.Root>
    )

    const root = screen.getByTestId('consent-root')
    const checkbox = screen.getByRole('checkbox', {
      name: 'I accept the training data policy'
    })
    const item = checkbox.closest('section') as HTMLElement
    const validityOutput = screen.getByText('Current consent errors: 0')

    expect(itemRef.current).toBe(item)
    expect(item).toHaveAttribute('data-item', 'consent')
    expect(itemState).toEqual(
      expect.objectContaining({ dirty: false, disabled: false, filled: false, focused: false })
    )
    expect(checkbox).toHaveAccessibleDescription('You can withdraw consent later.')
    expect(root).not.toHaveAttribute('data-required')
    expect(screen.queryByText('*')).not.toBeInTheDocument()
    expect(validityOutput.parentElement).toBe(root)

    fireEvent.click(checkbox)

    expect(checkbox).toBeChecked()
    expect(item).toHaveAttribute('data-dirty')
  })

  it('UC-015 - retains Input and Hint public CSS motion surfaces without adding Field-owned motion', async () => {
    const actionsRef = createRef<FieldRootActions | null>()
    const onSwitchChange = vi.fn()
    const onSwitchStart = vi.fn()
    const onSwitchComplete = vi.fn()

    render(
      <Field.Root actionsRef={actionsRef} data-testid="motion-root" validate={() => 'Required'}>
        <Field.Label>Motion field</Field.Label>
        <Field.Control addOn={<svg data-testid="motion-icon" />} />
        <Field.Description
          getErrorKey={() => 'required-error'}
          switchAnimationOptions={{
            direction: 'right',
            onSwitchChange,
            onSwitchComplete,
            onSwitchStart,
            style: ZERO_MOTION_STYLE
          }}
          waitingContent="Waiting content"
          waitingKey="waiting"
        />
      </Field.Root>
    )

    const fieldRoot = screen.getByTestId('motion-root')
    const control = screen.getByRole('textbox', { name: 'Motion field' })
    const inputRoot = screen.getByTestId('motion-icon').parentElement?.parentElement
    const description = getDescriptionWrapper(control)
    const switchRoot = screen.getByText('Waiting content').closest('[data-motion="switch"]')

    expect(fieldRoot).not.toHaveAttribute('data-motion')
    expect(description).not.toHaveAttribute('data-motion')
    expect(inputRoot).toHaveClass('field-emphasis')
    expect(inputRoot).not.toHaveAttribute('data-motion')
    expect(switchRoot).toHaveAttribute('data-motion', 'switch')
    expect(switchRoot).toHaveAttribute('data-direction', 'right')

    await act(async () => actionsRef.current?.validate())

    await waitFor(() => expect(onSwitchComplete).toHaveBeenCalledOnce())
    expect(onSwitchChange).toHaveBeenCalledWith(
      expect.objectContaining({ nextKey: 'required-error', previousKey: 'waiting' })
    )
    expect(onSwitchStart).toHaveBeenCalledWith(
      expect.objectContaining({ nextKey: 'required-error', previousKey: 'waiting' })
    )
    expect(onSwitchComplete).toHaveBeenCalledWith(
      expect.objectContaining({
        nextKey: 'required-error',
        previousKey: 'waiting',
        status: 'finished'
      })
    )
  })
})
