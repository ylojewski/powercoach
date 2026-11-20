import { Field } from '@base-ui/react/field'
import { Input as BaseUiInput } from '@base-ui/react/input'
import { fireEvent, render, screen } from '@testing-library/react'
import {
  createRef,
  useState,
  type ComponentPropsWithRef,
  type CSSProperties,
  type ReactElement
} from 'react'

import * as PackageExports from '../..'
import {
  type FieldSize,
  type InputAddOn as InputAddOnComponent,
  type InputAddOnPosition,
  type InputAddOnProps,
  type InputControl as InputControlComponent,
  type InputControlChangeEventDetails,
  type InputControlChangeEventReason,
  type InputControlProps,
  type InputControlState,
  type InputNamespace,
  type InputRoot as InputRootComponent,
  type InputRootProps,
  type InputSize
} from './Input'

interface ControlledInputProbeProps {
  onValueChange: (value: string, eventDetails: InputControlChangeEventDetails) => void
}

interface InputPackageContract {
  Input: InputNamespace
  InputAddOn: typeof InputAddOnComponent
  InputControl: typeof InputControlComponent
  InputRoot: typeof InputRootComponent
}

type IsMutuallyAssignable<TLeft, TRight> = [TLeft] extends [TRight]
  ? [TRight] extends [TLeft]
    ? true
    : false
  : false
type IsAny<TValue> = 0 extends 1 & TValue ? true : false
type OmitsKey<TValue, TKey extends PropertyKey> =
  IsAny<TValue> extends true ? true : TKey extends keyof TValue ? false : true

type SpanAriaProp = Extract<keyof ComponentPropsWithRef<'span'>, `aria-${string}`>
type SpanEventProp = Extract<keyof ComponentPropsWithRef<'span'>, `on${string}`>
type InteractiveSpanProp =
  | 'accessKey'
  | 'autoFocus'
  | 'contentEditable'
  | 'contextMenu'
  | 'dangerouslySetInnerHTML'
  | 'draggable'
  | 'inert'
  | 'popover'
  | 'popoverTarget'
  | 'popoverTargetAction'
  | 'role'
  | 'suppressContentEditableWarning'
  | 'tabIndex'
  | 'title'

type InputAddOnChildrenAreReactElement = IsMutuallyAssignable<
  InputAddOnProps['children'],
  ReactElement
>
type InputAddOnOmitsAriaProps =
  Extract<keyof InputAddOnProps, SpanAriaProp> extends never ? true : false
type InputAddOnOmitsEventProps =
  Extract<keyof InputAddOnProps, SpanEventProp> extends never ? true : false
type InputAddOnOmitsInteractiveProps =
  Extract<keyof InputAddOnProps, InteractiveSpanProp> extends never ? true : false
type InputAddOnOmitsRender = OmitsKey<InputAddOnProps, 'render'>
type InputControlDetailsMatchBaseUi = IsMutuallyAssignable<
  InputControlChangeEventDetails,
  BaseUiInput.ChangeEventDetails
>
type InputControlPropsMatchBaseUi = IsMutuallyAssignable<InputControlProps, BaseUiInput.Props>
type InputControlReasonMatchesBaseUi = IsMutuallyAssignable<
  InputControlChangeEventReason,
  BaseUiInput.ChangeEventReason
>
type InputControlStateMatchesBaseUi = IsMutuallyAssignable<InputControlState, BaseUiInput.State>
type InputRootOmitsRender = OmitsKey<InputRootProps, 'render'>
type InputSizeMatchesFieldSize = IsMutuallyAssignable<InputSize, FieldSize>

const PACKAGE_EXPORTS = PackageExports as typeof PackageExports & InputPackageContract
const Input = PACKAGE_EXPORTS.Input
const InputAddOn = PACKAGE_EXPORTS.InputAddOn
const InputControl = PACKAGE_EXPORTS.InputControl
const InputRoot = PACKAGE_EXPORTS.InputRoot
const INPUT_NAMESPACE: InputNamespace = Input
const INPUT_CHANGE_REASON: InputControlChangeEventReason = 'none'
const INPUT_ADDON_CHILDREN_ARE_REACT_ELEMENT = true satisfies InputAddOnChildrenAreReactElement
const INPUT_ADDON_OMITS_ARIA_PROPS = true satisfies InputAddOnOmitsAriaProps
const INPUT_ADDON_OMITS_EVENT_PROPS = true satisfies InputAddOnOmitsEventProps
const INPUT_ADDON_OMITS_INTERACTIVE_PROPS = true satisfies InputAddOnOmitsInteractiveProps
const INPUT_ADDON_OMITS_RENDER = true satisfies InputAddOnOmitsRender
const INPUT_CONTROL_DETAILS_MATCH_BASE_UI = true satisfies InputControlDetailsMatchBaseUi
const INPUT_CONTROL_PROPS_MATCH_BASE_UI = true satisfies InputControlPropsMatchBaseUi
const INPUT_CONTROL_REASON_MATCHES_BASE_UI = true satisfies InputControlReasonMatchesBaseUi
const INPUT_CONTROL_STATE_MATCHES_BASE_UI = true satisfies InputControlStateMatchesBaseUi
const INPUT_ROOT_OMITS_RENDER = true satisfies InputRootOmitsRender
const INPUT_SIZE_MATCHES_FIELD_SIZE = true satisfies InputSizeMatchesFieldSize

const INPUT_SIZE_CASES = [
  {
    addOnClassNames: ['w-6', '[&_svg]:size-3'],
    controlClassNames: ['px-2', 'text-xs/4'],
    rootClassNames: [
      'h-6',
      '[--field-emphasis-offset:--spacing(0.25)]',
      '[--field-emphasis-shadow-offset:--spacing(0.5)]'
    ],
    size: 'xs'
  },
  {
    addOnClassNames: ['w-8', '[&_svg]:size-3.5'],
    controlClassNames: ['px-2.5', 'text-sm/4.5'],
    rootClassNames: [
      'h-8',
      '[--field-emphasis-offset:--spacing(0.375)]',
      '[--field-emphasis-shadow-offset:--spacing(0.75)]'
    ],
    size: 'md'
  },
  {
    addOnClassNames: ['w-9', '[&_svg]:size-4'],
    controlClassNames: ['px-3', 'text-base/5'],
    rootClassNames: [
      'h-9',
      '[--field-emphasis-offset:--spacing(0.5)]',
      '[--field-emphasis-shadow-offset:--spacing(1)]'
    ],
    size: 'xl'
  }
] as const satisfies readonly {
  addOnClassNames: readonly string[]
  controlClassNames: readonly string[]
  rootClassNames: readonly string[]
  size: InputSize
}[]

const INPUT_ADDON_POSITIONS = ['start', 'end'] as const satisfies readonly InputAddOnPosition[]

function ControlledInputProbe({ onValueChange }: ControlledInputProbeProps) {
  const [value, setValue] = useState('Some value')

  return (
    <Input.Root>
      <Input.AddOn>
        <svg data-testid="controlled-icon" />
      </Input.AddOn>
      <Input.Control
        aria-label="Controlled search"
        onValueChange={(nextValue: string, eventDetails: InputControlChangeEventDetails) => {
          setValue(nextValue)
          onValueChange(nextValue, eventDetails)
        }}
        value={value}
      />
    </Input.Root>
  )
}

describe('Input', () => {
  it('UC-001 / UC-002 - exports the non-callable namespace, shared size, direct leaves, and Base UI-aligned public types', () => {
    expect(INPUT_NAMESPACE).toBe(Input)
    expect(typeof Input).toBe('object')
    expect(Input).toEqual({ AddOn: InputAddOn, Control: InputControl, Root: InputRoot })
    expect(INPUT_CHANGE_REASON).toBe('none')
    expect(INPUT_ADDON_CHILDREN_ARE_REACT_ELEMENT).toBe(true)
    expect(INPUT_ADDON_OMITS_ARIA_PROPS).toBe(true)
    expect(INPUT_ADDON_OMITS_EVENT_PROPS).toBe(true)
    expect(INPUT_ADDON_OMITS_INTERACTIVE_PROPS).toBe(true)
    expect(INPUT_ADDON_OMITS_RENDER).toBe(true)
    expect(INPUT_CONTROL_DETAILS_MATCH_BASE_UI).toBe(true)
    expect(INPUT_CONTROL_PROPS_MATCH_BASE_UI).toBe(true)
    expect(INPUT_CONTROL_REASON_MATCHES_BASE_UI).toBe(true)
    expect(INPUT_CONTROL_STATE_MATCHES_BASE_UI).toBe(true)
    expect(INPUT_ROOT_OMITS_RENDER).toBe(true)
    expect(INPUT_SIZE_MATCHES_FIELD_SIZE).toBe(true)
  })

  it('UC-001 / EX-001 - renders the mandatory Root, AddOn, and Control compound anatomy', () => {
    render(
      <Input.Root data-testid="input-root">
        <Input.AddOn data-testid="input-addon">
          <svg data-testid="input-icon" />
        </Input.AddOn>
        <Input.Control aria-label="Workout name" placeholder="Some placeholder" />
      </Input.Root>
    )

    const root = screen.getByTestId('input-root')
    const addOn = screen.getByTestId('input-addon')
    const control = screen.getByRole('textbox', { name: 'Workout name' })

    expect(root.tagName).toBe('DIV')
    expect(root).toHaveAttribute('data-size', 'xl')
    expect(addOn.tagName).toBe('SPAN')
    expect(addOn).toHaveAttribute('data-field-addon')
    expect(addOn).toHaveAttribute('data-position', 'start')
    expect(addOn).toContainElement(screen.getByTestId('input-icon'))
    expect(control.tagName).toBe('INPUT')
    expect(control).toHaveAttribute('placeholder', 'Some placeholder')
  })

  it('UC-001 - forwards refs, passive props, native events, and composed className and style props', () => {
    const rootRef = createRef<HTMLDivElement>()
    const addOnRef = createRef<HTMLSpanElement>()
    const controlRef = createRef<HTMLElement>()
    const onRootClick = vi.fn()
    const onControlFocus = vi.fn()

    render(
      <InputRoot
        className="consumer-root"
        data-consumer-root="workout"
        data-testid="direct-root"
        onClick={onRootClick}
        ref={rootRef}
        style={{ opacity: 0.9 }}
      >
        <InputAddOn
          className="consumer-addon"
          data-consumer-addon="identifier"
          data-testid="direct-addon"
          ref={addOnRef}
          style={{ color: 'rgb(1, 2, 3)' }}
        >
          <svg />
        </InputAddOn>
        <InputControl
          aria-label="Direct control"
          className="consumer-control"
          data-consumer-control="value"
          onFocus={onControlFocus}
          ref={controlRef}
          style={{ letterSpacing: '1px' }}
        />
      </InputRoot>
    )

    const root = screen.getByTestId('direct-root')
    const addOn = screen.getByTestId('direct-addon')
    const control = screen.getByRole('textbox', { name: 'Direct control' })

    fireEvent.click(root)
    fireEvent.focus(control)

    expect(rootRef.current).toBe(root)
    expect(addOnRef.current).toBe(addOn)
    expect(controlRef.current).toBe(control)
    expect(root).toHaveAttribute('data-consumer-root', 'workout')
    expect(root).toHaveClass('consumer-root')
    expect(root).toHaveStyle({ opacity: '0.9' })
    expect(addOn).toHaveAttribute('data-consumer-addon', 'identifier')
    expect(addOn).toHaveClass('consumer-addon')
    expect(addOn).toHaveStyle({ color: 'rgb(1, 2, 3)' })
    expect(control).toHaveAttribute('data-consumer-control', 'value')
    expect(control).toHaveClass('consumer-control')
    expect(control).toHaveStyle({ letterSpacing: '1px' })
    expect(onRootClick).toHaveBeenCalledOnce()
    expect(onControlFocus).toHaveBeenCalledOnce()
  })

  it('UC-002 / EX-003 - applies the documented Tailwind treatment to every size and defaults to xl', () => {
    render(
      <Input.Root data-size="consumer-value" data-testid="default-size-root">
        <Input.AddOn data-testid="default-size-addon">
          <svg />
        </Input.AddOn>
        <Input.Control aria-label="Default size" />
      </Input.Root>
    )

    expect(screen.getByTestId('default-size-root')).toHaveAttribute('data-size', 'xl')
    expect(screen.getByTestId('default-size-root')).toHaveClass(
      ...INPUT_SIZE_CASES[2].rootClassNames
    )
    expect(screen.getByTestId('default-size-addon')).toHaveClass(
      ...INPUT_SIZE_CASES[2].addOnClassNames
    )
    expect(screen.getByRole('textbox', { name: 'Default size' })).toHaveClass(
      ...INPUT_SIZE_CASES[2].controlClassNames
    )

    for (const testCase of INPUT_SIZE_CASES) {
      const { unmount } = render(
        <Input.Root data-testid={`root-${testCase.size}`} size={testCase.size}>
          <Input.AddOn data-testid={`addon-${testCase.size}`}>
            <span>
              <svg />
            </span>
          </Input.AddOn>
          <Input.Control aria-label={`${testCase.size} control`} placeholder={testCase.size} />
        </Input.Root>
      )

      expect(screen.getByTestId(`root-${testCase.size}`)).toHaveAttribute(
        'data-size',
        testCase.size
      )
      expect(screen.getByTestId(`root-${testCase.size}`)).toHaveClass(...testCase.rootClassNames)
      expect(screen.getByTestId(`addon-${testCase.size}`)).toHaveClass(...testCase.addOnClassNames)
      expect(screen.getByRole('textbox', { name: `${testCase.size} control` })).toHaveClass(
        ...testCase.controlClassNames,
        'placeholder:text-foreground/50'
      )

      unmount()
    }
  })

  it('UC-003 / EX-002 - exposes start and end as logical positions with matching separator sides', () => {
    render(
      <div>
        <Input.Root dir="ltr">
          <Input.AddOn data-testid="start-addon">
            <svg />
          </Input.AddOn>
          <Input.Control aria-label="Start identifier" />
        </Input.Root>
        <Input.Root dir="rtl">
          <Input.AddOn data-testid="end-addon" position={INPUT_ADDON_POSITIONS[1]}>
            <svg />
          </Input.AddOn>
          <Input.Control aria-label="End identifier" />
        </Input.Root>
      </div>
    )

    expect(screen.getByTestId('start-addon')).toHaveAttribute('data-position', 'start')
    expect(screen.getByTestId('start-addon')).toHaveClass('border-e')
    expect(screen.getByTestId('start-addon')).not.toHaveClass('border-s')
    expect(screen.getByTestId('end-addon')).toHaveAttribute('data-position', 'end')
    expect(screen.getByTestId('end-addon')).toHaveClass('border-s')
    expect(screen.getByTestId('end-addon')).not.toHaveClass('border-e')
  })

  it('UC-004 - fixes AddOn as decorative, inert chrome and rejects reserved or interactive overrides', () => {
    const onClick = vi.fn()
    const unsafeProps = {
      'aria-hidden': false,
      'aria-label': 'Unsafe label',
      'data-field-addon': 'consumer-value',
      'data-position': 'consumer-value',
      inert: false,
      onClick,
      position: 'end',
      role: 'button',
      style: { color: 'rgb(4, 5, 6)', pointerEvents: 'auto' },
      tabIndex: 0,
      title: 'Unsafe title'
    } as unknown as Omit<InputAddOnProps, 'children'>

    render(
      <Input.Root>
        <Input.AddOn {...unsafeProps} data-consumer-addon="preserved" data-testid="safe-addon">
          <button data-testid="unsupported-interactive-child" type="button">
            unsupported
          </button>
        </Input.AddOn>
        <Input.Control aria-label="Decorative AddOn control" />
      </Input.Root>
    )

    const addOn = screen.getByTestId('safe-addon')

    fireEvent.click(addOn)

    expect(addOn).toHaveAttribute('aria-hidden', 'true')
    expect(addOn).toHaveAttribute('inert')
    expect(addOn).toHaveAttribute('data-field-addon')
    expect(addOn).not.toHaveAttribute('data-field-addon', 'consumer-value')
    expect(addOn).toHaveAttribute('data-position', 'end')
    expect(addOn).toHaveAttribute('data-consumer-addon', 'preserved')
    expect(addOn).not.toHaveAttribute('aria-label')
    expect(addOn).not.toHaveAttribute('role')
    expect(addOn).not.toHaveAttribute('tabindex')
    expect(addOn).not.toHaveAttribute('title')
    expect(addOn).toHaveClass('pointer-events-none', 'flex', 'items-center', 'justify-center')
    expect(addOn.style.pointerEvents).not.toBe('auto')
    expect(addOn).toHaveStyle({ color: 'rgb(4, 5, 6)' })
    expect(addOn).toContainElement(screen.getByTestId('unsupported-interactive-child'))
    expect(onClick).not.toHaveBeenCalled()
  })

  it('UC-005 / EX-002 - preserves controlled value and Base UI onValueChange event details', () => {
    const onValueChange = vi.fn<ControlledInputProbeProps['onValueChange']>()

    render(<ControlledInputProbe onValueChange={onValueChange} />)

    const control = screen.getByRole('textbox', { name: 'Controlled search' })

    expect(control).toHaveValue('Some value')

    fireEvent.change(control, { target: { value: 'Updated value' } })

    expect(control).toHaveValue('Updated value')
    expect(onValueChange).toHaveBeenCalledOnce()
    expect(onValueChange).toHaveBeenCalledWith(
      'Updated value',
      expect.objectContaining({
        allowPropagation: expect.any(Function),
        cancel: expect.any(Function),
        event: expect.any(Event),
        isCanceled: false,
        isPropagationAllowed: false,
        reason: 'none'
      })
    )
  })

  it('UC-005 / EX-002 - preserves uncontrolled defaultValue, native props, events, and numeric size', () => {
    const onInput = vi.fn()

    render(
      <Input.Root>
        <Input.AddOn>
          <svg />
        </Input.AddOn>
        <Input.Control
          aria-label="Uncontrolled athlete"
          autoComplete="name"
          defaultValue="Yann"
          inputMode="text"
          name="athlete"
          onInput={onInput}
          required
          size={18}
        />
      </Input.Root>
    )

    const control = screen.getByRole('textbox', { name: 'Uncontrolled athlete' })

    expect(control).toHaveValue('Yann')
    expect(control).toHaveAttribute('autocomplete', 'name')
    expect(control).toHaveAttribute('inputmode', 'text')
    expect(control).toHaveAttribute('name', 'athlete')
    expect(control).toHaveAttribute('size', '18')
    expect(control).toBeRequired()

    fireEvent.input(control, { target: { value: 'Yannick' } })

    expect(control).toHaveValue('Yannick')
    expect(onInput).toHaveBeenCalledOnce()
  })

  it('UC-005 - preserves Base UI render composition and state className and style functions', () => {
    const controlRef = createRef<HTMLElement>()
    const className = vi.fn((_state: InputControlState) => 'consumer-state-class')
    const style = vi.fn((_state: InputControlState) => ({ letterSpacing: '2px' }))

    render(
      <Input.Root>
        <Input.AddOn>
          <svg />
        </Input.AddOn>
        <Input.Control
          aria-label="Composed control"
          className={className}
          data-consumer-render="preserved"
          ref={controlRef}
          render={<input data-testid="rendered-control" />}
          style={style}
          type="search"
        />
      </Input.Root>
    )

    const control = screen.getByRole('searchbox', { name: 'Composed control' })

    expect(control).toBe(screen.getByTestId('rendered-control'))
    expect(controlRef.current).toBe(control)
    expect(control.tagName).toBe('INPUT')
    expect(control).toHaveAttribute('data-consumer-render', 'preserved')
    expect(control).toHaveClass('consumer-state-class', 'min-w-0', 'flex-1')
    expect(control).toHaveStyle({ letterSpacing: '2px' })
    expect(className).toHaveBeenCalledWith(
      expect.objectContaining({ dirty: false, disabled: false, filled: false, focused: false })
    )
    expect(style).toHaveBeenCalledWith(
      expect.objectContaining({ dirty: false, disabled: false, filled: false, focused: false })
    )
  })

  it('UC-005 / UC-006 / EX-004 - integrates with Field labeling, description, precedence, form state, and submission', () => {
    render(
      <form data-testid="profile-form">
        <Field.Root dirty invalid name="email" touched>
          <Field.Label>Email</Field.Label>
          <Input.Root data-testid="field-input-root" size="md">
            <Input.AddOn data-testid="field-input-addon">
              <svg />
            </Input.AddOn>
            <Input.Control defaultValue="coach@example.com" name="ignored-email" required />
          </Input.Root>
          <Field.Description>Used for workout notifications.</Field.Description>
        </Field.Root>

        <Field.Root disabled name="disabled-email">
          <Field.Label>Disabled email</Field.Label>
          <Input.Root>
            <Input.AddOn>
              <svg />
            </Input.AddOn>
            <Input.Control disabled={false} name="ignored-disabled-email" />
          </Input.Root>
        </Field.Root>

        <Field.Root validationMode="onChange">
          <Field.Label>Valid field</Field.Label>
          <Input.Root>
            <Input.AddOn>
              <svg />
            </Input.AddOn>
            <Input.Control required />
          </Input.Root>
        </Field.Root>
      </form>
    )

    const control = screen.getByRole('textbox', { name: 'Email' })
    const disabledControl = screen.getByRole('textbox', { name: 'Disabled email' })
    const validControl = screen.getByRole('textbox', { name: 'Valid field' })
    const fieldRoot = screen.getByTestId('field-input-root')
    const fieldAddOn = screen.getByTestId('field-input-addon')
    const form = screen.getByTestId('profile-form') as HTMLFormElement

    expect(control).toHaveAccessibleDescription('Used for workout notifications.')
    expect(control).toHaveAttribute('name', 'email')
    expect(control).toHaveAttribute('data-invalid')
    expect(control).toHaveAttribute('data-dirty')
    expect(control).toHaveAttribute('data-touched')
    expect(control).toHaveAttribute('data-filled')
    expect(fieldRoot).not.toHaveAttribute('data-invalid')
    expect(fieldRoot).not.toHaveAttribute('data-dirty')
    expect(fieldAddOn).not.toHaveAttribute('data-invalid')
    expect(fieldAddOn).not.toHaveAttribute('data-dirty')
    expect(control).toBeRequired()
    expect(new FormData(form).get('email')).toBe('coach@example.com')
    expect(new FormData(form).has('ignored-email')).toBe(false)

    fireEvent.focus(control)
    expect(control).toHaveAttribute('data-focused')

    fireEvent.blur(control)
    expect(control).not.toHaveAttribute('data-focused')

    expect(disabledControl).toBeDisabled()
    expect(disabledControl).toHaveAttribute('data-disabled')
    expect(disabledControl).toHaveAttribute('name', 'disabled-email')

    expect(validControl).not.toHaveAttribute('data-valid')
    fireEvent.change(validControl, { target: { value: 'Validated value' } })
    expect(validControl).toHaveAttribute('data-valid')
  })

  it('UC-006 - accepts every documented accessible-name source while Root and AddOn add no semantics', () => {
    render(
      <div>
        <label>
          Workout name
          <Input.Root data-testid="native-label-root">
            <Input.AddOn data-testid="native-label-addon">
              <svg />
            </Input.AddOn>
            <Input.Control />
          </Input.Root>
        </label>

        <Input.Root data-testid="aria-label-root">
          <Input.AddOn data-testid="aria-label-addon">
            <svg />
          </Input.AddOn>
          <Input.Control aria-label="Search workouts" />
        </Input.Root>

        <span id="athlete-label">Athlete name</span>
        <Input.Root data-testid="labelledby-root">
          <Input.AddOn data-testid="labelledby-addon">
            <svg />
          </Input.AddOn>
          <Input.Control aria-labelledby="athlete-label" />
        </Input.Root>
      </div>
    )

    expect(screen.getByRole('textbox', { name: 'Workout name' })).toBeInTheDocument()
    expect(screen.getByRole('textbox', { name: 'Search workouts' })).toBeInTheDocument()
    expect(screen.getByRole('textbox', { name: 'Athlete name' })).toBeInTheDocument()

    for (const testId of ['native-label-root', 'aria-label-root', 'labelledby-root']) {
      expect(screen.getByTestId(testId)).not.toHaveAttribute('role')
    }

    for (const testId of ['native-label-addon', 'aria-label-addon', 'labelledby-addon']) {
      expect(screen.getByTestId(testId)).toHaveAttribute('aria-hidden', 'true')
      expect(screen.getByTestId(testId)).not.toHaveAttribute('role')
    }
  })

  it('UC-007 / EX-001 - exposes the documented resting value and placeholder Tailwind treatment without hover activation', () => {
    render(
      <div>
        <Input.Root data-testid="resting-root">
          <Input.AddOn data-testid="resting-addon">
            <svg />
          </Input.AddOn>
          <Input.Control aria-label="Placeholder field" placeholder="Some placeholder" />
        </Input.Root>

        <Input.Root>
          <Input.AddOn>
            <svg />
          </Input.AddOn>
          <Input.Control aria-label="Value field" defaultValue="Some value" />
        </Input.Root>
      </div>
    )

    const root = screen.getByTestId('resting-root')
    const addOn = screen.getByTestId('resting-addon')
    const placeholderControl = screen.getByRole('textbox', { name: 'Placeholder field' })
    const rootClassesBeforeHover = root.className
    const addOnClassesBeforeHover = addOn.className

    expect(root).toHaveClass(
      'w-full',
      'min-w-0',
      'border',
      'border-foreground/30',
      'bg-background',
      'text-foreground'
    )
    expect(root.className).not.toContain('rounded')
    expect(root.className).not.toContain('hover:')
    expect(addOn).toHaveClass(
      'border-e',
      'border-foreground/30',
      'bg-muted',
      'text-muted-foreground'
    )
    expect(placeholderControl).toHaveClass(
      'bg-transparent',
      'text-foreground',
      'caret-foreground',
      'outline-none',
      'placeholder:text-foreground/50'
    )
    expect(screen.getByDisplayValue('Some value')).toHaveClass('text-foreground')

    fireEvent.mouseEnter(root)

    expect(root.className).toBe(rootClassesBeforeHover)
    expect(addOn.className).toBe(addOnClassesBeforeHover)
  })

  it('UC-008 / UC-009 / UC-010 / EX-005 - exposes the reusable CSS-only field-emphasis protocol', () => {
    render(
      <div>
        <Input.Root data-testid="input-emphasis-host">
          <Input.AddOn data-testid="input-emphasis-addon">
            <svg />
          </Input.AddOn>
          <Input.Control aria-label="Input emphasis control" />
        </Input.Root>

        <label>
          Notes
          <div
            className={
              // prettier-ignore
              `
                flex min-w-0 field-emphasis
                border border-foreground/30 bg-background text-foreground
                [--field-emphasis-offset:--spacing(0.5)] [--field-emphasis-shadow-offset:--spacing(1)]
              `
            }
            data-testid="shared-emphasis-host"
          >
            <span
              aria-hidden="true"
              className={
                // prettier-ignore
                `
                  pointer-events-none flex w-9 shrink-0 items-center justify-center
                  border-e border-foreground/30 bg-muted text-muted-foreground
                  [&_svg]:size-4 [&_svg]:shrink-0
                `
              }
              data-field-addon
              data-testid="shared-emphasis-addon"
              inert
            >
              <svg />
            </span>
            <textarea aria-label="Notes" />
          </div>
        </label>
      </div>
    )

    const inputHost = screen.getByTestId('input-emphasis-host')
    const inputAddOn = screen.getByTestId('input-emphasis-addon')
    const inputControl = screen.getByRole('textbox', { name: 'Input emphasis control' })
    const sharedHost = screen.getByTestId('shared-emphasis-host')
    const sharedAddOn = screen.getByTestId('shared-emphasis-addon')
    const sharedControl = screen.getByRole('textbox', { name: 'Notes' })

    expect(inputHost).toHaveClass(
      'field-emphasis',
      '[--field-emphasis-offset:--spacing(0.5)]',
      '[--field-emphasis-shadow-offset:--spacing(1)]'
    )
    expect(inputHost).not.toHaveAttribute('data-motion')
    expect(inputAddOn).toHaveAttribute('data-field-addon')
    expect(sharedHost).toHaveClass(
      'field-emphasis',
      '[--field-emphasis-offset:--spacing(0.5)]',
      '[--field-emphasis-shadow-offset:--spacing(1)]'
    )
    expect(sharedAddOn).toHaveAttribute('data-field-addon')

    fireEvent.focus(inputControl)
    fireEvent.blur(inputControl)
    fireEvent.focus(sharedControl)
    fireEvent.blur(sharedControl)

    expect(inputHost).toHaveClass('field-emphasis')
    expect(inputAddOn).toHaveAttribute('data-field-addon')
    expect(sharedHost).toHaveClass('field-emphasis')
    expect(sharedAddOn).toHaveAttribute('data-field-addon')
  })

  it('UC-011 / EX-006 - exposes the shared hard-shadow application contract without changing Input rendering', () => {
    render(
      <div>
        <div
          className="border border-foreground bg-background p-4 shadow-(--hard-shadow)"
          data-testid="shared-hard-shadow"
        >
          shared hard shadow
        </div>
        <Input.Root data-testid="hard-shadow-input">
          <Input.AddOn>
            <svg />
          </Input.AddOn>
          <Input.Control aria-label="Hard shadow input" />
        </Input.Root>
      </div>
    )

    expect(screen.getByTestId('shared-hard-shadow')).toHaveClass(
      'border',
      'border-foreground',
      'bg-background',
      'p-4',
      'shadow-(--hard-shadow)'
    )
    expect(screen.getByTestId('hard-shadow-input')).toHaveClass(
      'field-emphasis',
      '[--field-emphasis-shadow-offset:--spacing(1)]'
    )
    expect(screen.getByTestId('hard-shadow-input').className).not.toContain(
      'shadow-[0.25rem_0.25rem'
    )
  })

  it('UC-012 / EX-006 - preserves consumer-final className and style overrides for the shared hard shadow', () => {
    render(
      <Input.Root
        className="focus-within:shadow-none"
        data-testid="overridden-hard-shadow-input"
        style={
          {
            '--hard-shadow': '0 0 0 0 transparent'
          } as CSSProperties
        }
      >
        <Input.AddOn>
          <svg />
        </Input.AddOn>
        <Input.Control aria-label="Overridden hard shadow input" />
      </Input.Root>
    )

    const root = screen.getByTestId('overridden-hard-shadow-input')

    expect(root).toHaveClass('field-emphasis', 'focus-within:shadow-none')
    expect(root).toHaveStyle({ '--hard-shadow': '0 0 0 0 transparent' })
    expect(root).toHaveClass('border', 'bg-background', 'text-foreground')
  })
})
