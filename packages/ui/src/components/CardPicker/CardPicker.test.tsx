import { useRender } from '@base-ui/react/use-render'
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import {
  createRef,
  useState,
  type ComponentPropsWithRef,
  type CSSProperties,
  type Key,
  type ReactElement,
  type ReactNode,
  type Ref
} from 'react'
import { renderToString } from 'react-dom/server'
import { describe, expect, expectTypeOf, it, vi } from 'vitest'

import {
  Card,
  type CardGroupChangeEventDetails,
  type CardGroupChangeEventReason,
  type CardGroupProps,
  type CardGroupState,
  type CardRootProps,
  type CardSelectorProps,
  type CardSurfaceProps,
  type HintItem,
  type HintProps
} from '../..'
import * as PackageExports from '../..'
import {
  CardPicker,
  CardPickerCard,
  CardPickerGroup,
  CardPickerHint,
  CardPickerRoot,
  type CardPickerCardHint,
  type CardPickerCardProps,
  type CardPickerGroupProps,
  type CardPickerGroupState,
  type CardPickerHintProps,
  type CardPickerNamespace,
  type CardPickerPlacement,
  type CardPickerRootChangeEventDetails,
  type CardPickerRootChangeEventReason,
  type CardPickerRootProps,
  type CardPickerRootState,
  type CardPickerSelectorProps,
  type CardPickerValue
} from './CardPicker'

type ExpectedCardPickerRootProps<TValue extends CardPickerValue = string> = Omit<
  useRender.ComponentProps<'div', CardPickerRootState<TValue>>,
  'children' | 'className' | 'style'
> & {
  children: ReactNode
  className?: string | ((state: CardPickerRootState<TValue>) => string | undefined)
  defaultValue?: TValue
  disabled?: boolean
  form?: string
  inputRef?: Ref<HTMLInputElement>
  name?: string
  onValueChange?: (value: TValue, eventDetails: CardPickerRootChangeEventDetails) => void
  placement?: CardPickerPlacement
  readOnly?: boolean
  required?: boolean
  style?: CSSProperties | ((state: CardPickerRootState<TValue>) => CSSProperties | undefined)
  value?: TValue | null
}

type ExpectedCardPickerGroupProps = Omit<
  CardGroupProps<CardPickerValue>,
  | 'defaultValue'
  | 'disabled'
  | 'form'
  | 'inputRef'
  | 'name'
  | 'onValueChange'
  | 'readOnly'
  | 'required'
  | 'value'
>

type ExpectedCardPickerCardProps<TValue extends CardPickerValue = string> = Omit<
  CardRootProps,
  'children'
> & {
  children: ReactElement<CardSurfaceProps>
  hint: CardPickerCardHint
  selectorProps: CardPickerSelectorProps<TValue>
  value: TValue
}

interface ExpectedCardPickerNamespace {
  Card: typeof CardPickerCard
  Group: typeof CardPickerGroup
  Hint: typeof CardPickerHint
  Root: typeof CardPickerRoot
}

type SwitchAnimationCssProperties = CSSProperties &
  Partial<
    Record<
      '--switch-animation-distance' | '--switch-animation-duration' | '--switch-animation-stagger',
      string
    >
  >

const ZERO_MOTION_STYLE = {
  '--switch-animation-distance': '0px',
  '--switch-animation-duration': '0ms',
  '--switch-animation-stagger': '0ms'
} as SwitchAnimationCssProperties

const PLACEMENT_CASES = [
  { cardsFirst: true, placement: 'block-start' },
  { cardsFirst: false, placement: 'block-end' },
  { cardsFirst: true, placement: 'inline-start' },
  { cardsFirst: false, placement: 'inline-end' }
] as const

describe('CardPicker', () => {
  it('UC-001 - exposes the namespace, prefixed leaves, bounded props, and prefixed public types', () => {
    expect(CardPicker).toEqual({
      Card: CardPickerCard,
      Group: CardPickerGroup,
      Hint: CardPickerHint,
      Root: CardPickerRoot
    })
    expect(PackageExports.CardPicker).toBe(CardPicker)
    expect(PackageExports.CardPickerCard).toBe(CardPickerCard)
    expect(PackageExports.CardPickerGroup).toBe(CardPickerGroup)
    expect(PackageExports.CardPickerHint).toBe(CardPickerHint)
    expect(PackageExports.CardPickerRoot).toBe(CardPickerRoot)
    expect(PackageExports.Components.CardPicker).toBe(CardPicker)
    expect(PackageExports.Ui.Components).toBe(PackageExports.Components)
    expect(PackageExports.Ui.Components.CardPicker).toBe(CardPicker)

    expectTypeOf<CardPickerValue>().toEqualTypeOf<Key>()
    expectTypeOf<CardPickerPlacement>().toEqualTypeOf<
      'block-start' | 'block-end' | 'inline-start' | 'inline-end'
    >()
    expectTypeOf<CardPickerRootState<number>>().toEqualTypeOf<{
      disabled: boolean
      placement: CardPickerPlacement
      readOnly: boolean
      required: boolean
      value: number | null
    }>()
    expectTypeOf<CardPickerRootProps<number>>().toEqualTypeOf<ExpectedCardPickerRootProps<number>>()
    expectTypeOf<CardPickerGroupProps>().toEqualTypeOf<ExpectedCardPickerGroupProps>()
    expectTypeOf<CardPickerGroupState>().toEqualTypeOf<CardGroupState>()
    expectTypeOf<CardPickerCardHint>().toEqualTypeOf<Omit<HintItem, 'condition' | 'key'>>()
    expectTypeOf<CardPickerSelectorProps<number>>().toEqualTypeOf<
      Omit<CardSelectorProps<number>, 'value'>
    >()
    expectTypeOf<CardPickerCardProps<number>>().toEqualTypeOf<ExpectedCardPickerCardProps<number>>()
    expectTypeOf<CardPickerHintProps>().toEqualTypeOf<Omit<HintProps, 'hints' | 'waitingKey'>>()
    expectTypeOf<CardPickerRootChangeEventReason>().toEqualTypeOf<CardGroupChangeEventReason>()
    expectTypeOf<CardPickerRootChangeEventDetails>().toEqualTypeOf<CardGroupChangeEventDetails>()
    expectTypeOf<CardPickerNamespace>().toEqualTypeOf<ExpectedCardPickerNamespace>()
  })

  it('UC-001 / UC-013 / EX-001 - renders the documented direct anatomy and composed default elements', () => {
    render(
      <CardPicker.Root data-testid="picker-root">
        <CardPicker.Group aria-label="Exercise creation method" data-testid="picker-group">
          <CardPicker.Card
            data-testid="scratch-card"
            hint={{ content: 'Create every exercise setting yourself.' }}
            selectorProps={{ 'aria-label': 'From Scratch' }}
            value="from-scratch"
          >
            <Card.Surface data-testid="scratch-surface">
              <Card.Header>
                <Card.Title render={<h2 />}>From Scratch</Card.Title>
              </Card.Header>
            </Card.Surface>
          </CardPicker.Card>
          <CardPicker.Card
            data-testid="template-card"
            hint={{ content: 'Begin with a structure that is already configured.' }}
            selectorProps={{ 'aria-label': 'Template' }}
            value="template"
          >
            <Card.Surface data-testid="template-surface">
              <Card.Header>
                <Card.Title render={<h2 />}>Template</Card.Title>
              </Card.Header>
            </Card.Surface>
          </CardPicker.Card>
        </CardPicker.Group>
        <CardPicker.Hint
          data-testid="picker-hint"
          switchAnimationOptions={{ style: ZERO_MOTION_STYLE }}
          waitingContent="Choose a method to see more information."
        />
      </CardPicker.Root>
    )

    const root = screen.getByTestId('picker-root')
    const group = screen.getByTestId('picker-group')
    const hint = screen.getByTestId('picker-hint')
    const scratchCard = screen.getByTestId('scratch-card')
    const templateCard = screen.getByTestId('template-card')

    expect(root.tagName).toBe('DIV')
    expect(group.tagName).toBe('DIV')
    expect(scratchCard.tagName).toBe('DIV')
    expect(templateCard.tagName).toBe('DIV')
    expect(hint.tagName).toBe('DIV')
    expect(Array.from(root.children)).toEqual([group, hint])
    expect(Array.from(group.children)).toEqual([scratchCard, templateCard])
    expect(root).toHaveAttribute('data-placement', 'block-start')
    expect(root).not.toHaveAttribute('data-selected')
    expect(root).not.toHaveAttribute('data-value')
    expect(group).not.toHaveAttribute('data-placement')
    expect(group).not.toHaveAttribute('data-selected')
    expect(scratchCard).not.toHaveAttribute('data-value')
    expect(scratchCard).not.toHaveAttribute('data-hint')
    expect(templateCard).not.toHaveAttribute('data-value')
    expect(templateCard).not.toHaveAttribute('data-hint')
    expect(screen.getByRole('radiogroup', { name: 'Exercise creation method' })).toBe(group)
    expect(screen.getAllByRole('radio')).toHaveLength(2)
    expect(within(scratchCard).getAllByRole('radio')).toHaveLength(1)
    expect(within(templateCard).getAllByRole('radio')).toHaveLength(1)
    expect(screen.getAllByTestId('scratch-surface')).toHaveLength(2)
    expect(screen.getAllByTestId('template-surface')).toHaveLength(2)
    expect(screen.getAllByRole('heading', { level: 2 })).toHaveLength(2)
    expect(screen.getByText('Choose a method to see more information.')).toBeVisible()
  })

  it('UC-002 / UC-007 - derives direct arrays and conditional Cards synchronously during server rendering', () => {
    const choices = [
      {
        hint: 'Build every section yourself.',
        title: 'From Scratch',
        value: 'from-scratch'
      }
    ] as const
    const showTemplate = choices.some((choice) => choice.value === 'from-scratch')

    const markup = renderToString(
      <CardPicker.Root defaultValue="template">
        <CardPicker.Group aria-label="Server-rendered creation method">
          {choices.map((choice) => (
            <CardPicker.Card
              key={choice.value}
              hint={{ content: choice.hint }}
              selectorProps={{ 'aria-label': choice.title }}
              value={choice.value}
            >
              <Card.Surface />
            </CardPicker.Card>
          ))}
          {false}
          {null}
          {true}
          {showTemplate && (
            <CardPicker.Card
              hint={{ content: 'Template help is present on the first render.' }}
              selectorProps={{ 'aria-label': 'Template' }}
              value="template"
            >
              <Card.Surface />
            </CardPicker.Card>
          )}
        </CardPicker.Group>
        <CardPicker.Hint waitingContent="Waiting content must not win on the first render." />
      </CardPicker.Root>
    )

    expect(markup).toContain('Template help is present on the first render.')
    expect(markup).not.toContain('Waiting content must not win on the first render.')
    expect(markup).toContain('data-selected')
  })

  it('UC-002 / UC-003 / UC-006 / EX-001 - keeps typed values distinct and never deselects the active radio', async () => {
    const onValueChange = vi.fn()

    render(
      <CardPicker.Root<string | number> onValueChange={onValueChange} data-testid="typed-picker">
        <CardPicker.Group aria-label="Typed values">
          <CardPicker.Card
            hint={{ content: 'Numeric help' }}
            selectorProps={{ 'aria-label': 'Numeric one' }}
            value={1}
          >
            <Card.Surface />
          </CardPicker.Card>
          <CardPicker.Card
            hint={{ content: 'String help' }}
            selectorProps={{ 'aria-label': 'String one' }}
            value="1"
          >
            <Card.Surface />
          </CardPicker.Card>
        </CardPicker.Group>
        <CardPicker.Hint
          switchAnimationOptions={{ style: ZERO_MOTION_STYLE }}
          waitingContent="Choose a typed value."
        />
      </CardPicker.Root>
    )

    const root = screen.getByTestId('typed-picker')
    const numeric = screen.getByRole('radio', { name: 'Numeric one' })
    const string = screen.getByRole('radio', { name: 'String one' })

    expect(numeric).not.toBeChecked()
    expect(string).not.toBeChecked()
    expect(screen.getByText('Choose a typed value.')).toBeVisible()

    fireEvent.click(numeric)

    expect(onValueChange).toHaveBeenLastCalledWith(1, expect.any(Object))
    expect(numeric).toBeChecked()
    expect(string).not.toBeChecked()
    expect(root).toHaveAttribute('data-selected')
    expect(screen.getByText('Numeric help')).toBeVisible()

    fireEvent.click(numeric)

    expect(onValueChange).toHaveBeenCalledTimes(1)
    expect(numeric).toBeChecked()

    fireEvent.click(string)

    expect(onValueChange).toHaveBeenLastCalledWith('1', expect.any(Object))
    expect(numeric).not.toBeChecked()
    expect(string).toBeChecked()
    await waitFor(() => expect(screen.getByText('String help')).toBeVisible())
  })

  it('UC-002 / UC-003 / UC-006 / CR-001 - follows Base UI equality for signed zero and NaN values', async () => {
    const onSwitchChange = vi.fn()
    const renderStates: CardPickerRootState<number>[] = []

    function EqualityPicker({
      cardValue,
      retainedValue
    }: {
      cardValue: number
      retainedValue: number
    }) {
      return (
        <CardPicker.Root<number>
          data-testid="equality-root"
          render={(props: ComponentPropsWithRef<'div'>, state: CardPickerRootState<number>) => {
            renderStates.push(state)
            return <div {...props} />
          }}
          value={retainedValue}
        >
          <CardPicker.Group aria-label="Numeric equality">
            <CardPicker.Card
              hint={{ content: 'Exact numeric help' }}
              selectorProps={{ 'aria-label': 'Exact numeric value' }}
              value={cardValue}
            >
              <Card.Surface />
            </CardPicker.Card>
          </CardPicker.Group>
          <CardPicker.Hint
            switchAnimationOptions={{ onSwitchChange, style: ZERO_MOTION_STYLE }}
            waitingContent="No exact numeric match."
          />
        </CardPicker.Root>
      )
    }

    const { rerender } = render(<EqualityPicker cardValue={-0} retainedValue={0} />)
    const root = screen.getByTestId('equality-root')

    expect(screen.getByRole('radio', { name: 'Exact numeric value' })).toBeChecked()
    expect(root).toHaveAttribute('data-selected')
    expect(renderStates.at(-1)).toEqual({
      disabled: false,
      placement: 'block-start',
      readOnly: false,
      required: false,
      value: -0
    })
    expect(screen.getByText('Exact numeric help')).toBeVisible()
    expect(onSwitchChange).not.toHaveBeenCalled()

    rerender(<EqualityPicker cardValue={-0} retainedValue={-0} />)

    expect(screen.getByRole('radio', { name: 'Exact numeric value' })).toBeChecked()
    expect(root).toHaveAttribute('data-selected')
    expect(renderStates.at(-1)?.value).toBe(-0)
    expect(screen.getByText('Exact numeric help')).toBeVisible()
    expect(onSwitchChange).not.toHaveBeenCalled()

    rerender(<EqualityPicker cardValue={Number.NaN} retainedValue={Number.NaN} />)

    expect(screen.getByRole('radio', { name: 'Exact numeric value' })).not.toBeChecked()
    expect(root).not.toHaveAttribute('data-selected')
    expect(renderStates.at(-1)?.value).toBeNull()
    expect(screen.getByText('No exact numeric match.')).toBeVisible()
    await waitFor(() => expect(screen.queryByText('Exact numeric help')).not.toBeInTheDocument())
    expect(onSwitchChange).toHaveBeenCalledOnce()
    expect(onSwitchChange.mock.calls[0]?.[0].previousKey).not.toBe(
      onSwitchChange.mock.calls[0]?.[0].nextKey
    )

    rerender(<EqualityPicker cardValue={Number.NaN} retainedValue={Number.NaN} />)

    expect(screen.getByRole('radio', { name: 'Exact numeric value' })).not.toBeChecked()
    expect(root).not.toHaveAttribute('data-selected')
    expect(renderStates.at(-1)?.value).toBeNull()
    expect(screen.getByText('No exact numeric match.')).toBeVisible()
    expect(onSwitchChange).toHaveBeenCalledOnce()
  })

  it('UC-003 / UC-006 / EX-002 - treats controlled null as empty and lets the consumer reset selection', async () => {
    function ControlledPicker() {
      const [value, setValue] = useState<string | null>(null)

      return (
        <>
          <button type="button" onClick={() => setValue(null)}>
            reset selection
          </button>
          <output>controlled value: {value ?? 'none'}</output>
          <CardPicker.Root value={value} onValueChange={setValue} data-testid="controlled-root">
            <CardPicker.Group aria-label="Controlled creation method">
              <CardPicker.Card
                hint={{ content: 'Guided help' }}
                selectorProps={{ 'aria-label': 'Guided setup' }}
                value="guided"
              >
                <Card.Surface />
              </CardPicker.Card>
              <CardPicker.Card
                hint={{ content: 'Manual help' }}
                selectorProps={{ 'aria-label': 'Manual setup' }}
                value="manual"
              >
                <Card.Surface />
              </CardPicker.Card>
            </CardPicker.Group>
            <CardPicker.Hint
              switchAnimationOptions={{ style: ZERO_MOTION_STYLE }}
              waitingContent="Select guided or manual setup."
            />
          </CardPicker.Root>
        </>
      )
    }

    render(<ControlledPicker />)

    const root = screen.getByTestId('controlled-root')
    const guided = screen.getByRole('radio', { name: 'Guided setup' })

    expect(screen.getByText('controlled value: none')).toBeVisible()
    expect(screen.getByText('Select guided or manual setup.')).toBeVisible()
    expect(root).not.toHaveAttribute('data-selected')

    fireEvent.click(guided)

    expect(screen.getByText('controlled value: guided')).toBeVisible()
    expect(screen.getByText('Guided help')).toBeVisible()
    expect(guided).toBeChecked()
    expect(root).toHaveAttribute('data-selected')

    fireEvent.click(screen.getByRole('button', { name: 'reset selection' }))

    expect(screen.getByText('controlled value: none')).toBeVisible()
    await waitFor(() => expect(screen.getByText('Select guided or manual setup.')).toBeVisible())
    expect(guided).not.toBeChecked()
    expect(root).not.toHaveAttribute('data-selected')
  })

  it('UC-003 / UC-005 / UC-006 - reports only a matching retained value through Root render state', () => {
    const renderStates: CardPickerRootState<string>[] = []

    const { rerender } = render(
      <CardPicker.Root
        className={(state: CardPickerRootState<string>) => `effective-${state.value ?? 'none'}`}
        placement="inline-end"
        render={(props: ComponentPropsWithRef<'div'>, state: CardPickerRootState<string>) => {
          renderStates.push(state)
          return <section {...props} />
        }}
        style={(state: CardPickerRootState<string>) => ({
          opacity: state.value === null ? 0.5 : 1
        })}
        value="retained"
        data-testid="state-root"
      >
        <CardPicker.Group aria-label="Effective state">
          <CardPicker.Card
            hint={{ content: 'Other help' }}
            selectorProps={{ 'aria-label': 'Other' }}
            value="other"
          >
            <Card.Surface />
          </CardPicker.Card>
        </CardPicker.Group>
        <CardPicker.Hint waitingContent="No current Card matches." />
      </CardPicker.Root>
    )

    const root = screen.getByTestId('state-root')

    expect(root.tagName).toBe('SECTION')
    expect(root).toHaveAttribute('data-placement', 'inline-end')
    expect(root).not.toHaveAttribute('data-selected')
    expect(root).toHaveClass('effective-none')
    expect(root).toHaveStyle({ opacity: '0.5' })
    expect(screen.getByText('No current Card matches.')).toBeVisible()
    expect(renderStates.at(-1)).toEqual({
      disabled: false,
      placement: 'inline-end',
      readOnly: false,
      required: false,
      value: null
    })

    rerender(
      <CardPicker.Root
        className={(state: CardPickerRootState<string>) => `effective-${state.value ?? 'none'}`}
        placement="inline-end"
        render={(props: ComponentPropsWithRef<'div'>, state: CardPickerRootState<string>) => {
          renderStates.push(state)
          return <section {...props} />
        }}
        style={(state: CardPickerRootState<string>) => ({
          opacity: state.value === null ? 0.5 : 1
        })}
        value="retained"
        data-testid="state-root"
      >
        <CardPicker.Group aria-label="Effective state">
          <CardPicker.Card
            hint={{ content: 'Retained help' }}
            selectorProps={{ 'aria-label': 'Retained' }}
            value="retained"
          >
            <Card.Surface />
          </CardPicker.Card>
        </CardPicker.Group>
        <CardPicker.Hint waitingContent="No current Card matches." />
      </CardPicker.Root>
    )

    expect(screen.getByRole('radio', { name: 'Retained' })).toBeChecked()
    expect(screen.getByText('Retained help')).toBeVisible()
    expect(root).toHaveAttribute('data-selected')
    expect(root).toHaveClass('effective-retained')
    expect(root).toHaveStyle({ opacity: '1' })
    expect(renderStates.at(-1)?.value).toBe('retained')
  })

  it('UC-004 / EX-005 - preserves external form ownership, required state, inputRef, and cancellable details', async () => {
    const inputRef = createRef<HTMLInputElement>()
    const onValueChange = vi.fn((value: string, eventDetails: CardPickerRootChangeEventDetails) => {
      if (value === 'from-scratch') eventDetails.cancel()
    })

    render(
      <>
        <form id="creation-method-form" data-testid="creation-method-form" />
        <CardPicker.Root
          form="creation-method-form"
          inputRef={inputRef}
          name="creationMethod"
          onValueChange={onValueChange}
          required
          data-testid="form-picker"
        >
          <CardPicker.Group aria-label="Permitted creation method">
            <CardPicker.Card
              hint={{ content: 'This method is temporarily unavailable.' }}
              selectorProps={{ 'aria-label': 'From Scratch' }}
              value="from-scratch"
            >
              <Card.Surface />
            </CardPicker.Card>
            <CardPicker.Card
              hint={{ content: 'Template is ready to submit.' }}
              selectorProps={{ 'aria-label': 'Template' }}
              value="template"
            >
              <Card.Surface />
            </CardPicker.Card>
          </CardPicker.Group>
          <CardPicker.Hint
            switchAnimationOptions={{ style: ZERO_MOTION_STYLE }}
            waitingContent="Choose an available method."
          />
        </CardPicker.Root>
      </>
    )

    const form = screen.getByTestId('creation-method-form') as HTMLFormElement
    const scratch = screen.getByRole('radio', { name: 'From Scratch' })
    const template = screen.getByRole('radio', { name: 'Template' })

    expect(inputRef.current).toBeInstanceOf(HTMLInputElement)
    expect(inputRef.current).toHaveAttribute('form', 'creation-method-form')
    expect(scratch).toHaveAttribute('data-required')
    expect(template).toHaveAttribute('data-required')

    fireEvent.click(scratch)

    const canceledDetails = onValueChange.mock.calls[0]?.[1]

    expect(canceledDetails).toEqual(
      expect.objectContaining({
        allowPropagation: expect.any(Function),
        cancel: expect.any(Function),
        event: expect.any(Event),
        isCanceled: true,
        isPropagationAllowed: expect.any(Boolean),
        reason: 'none'
      })
    )
    expect(canceledDetails).toHaveProperty('trigger')
    expect(scratch).not.toBeChecked()
    expect(screen.getByText('Choose an available method.')).toBeVisible()
    expect(new FormData(form).get('creationMethod')).toBeNull()

    fireEvent.click(template)

    expect(template).toBeChecked()
    await waitFor(() => expect(screen.getByText('Template is ready to submit.')).toBeVisible())
    expect(new FormData(form).get('creationMethod')).toBe('template')
  })

  it('UC-005 / EX-002 - applies each consumer override only to its composed public surface', () => {
    render(
      <CardPicker.Root
        className="consumer-root"
        data-picker="controlled"
        placement="inline-start"
        render={<section aria-label="Controlled creation picker" />}
        style={{ minHeight: 240 }}
        value={null}
      >
        <CardPicker.Group
          aria-label="Controlled creation method"
          className="consumer-group"
          data-group="methods"
          render={<fieldset />}
        >
          <CardPicker.Card
            className="consumer-card"
            data-card="guided"
            hint={{ content: 'Follow a guided configuration sequence.' }}
            render={<article />}
            selectorProps={{
              'aria-label': 'Guided setup',
              'data-selector': 'guided',
              render: <button type="button" />
            }}
            size="xl"
            value="guided"
          >
            <Card.Surface
              className="consumer-surface"
              data-testid="overridden-surface"
              render={<section />}
            />
          </CardPicker.Card>
        </CardPicker.Group>
        <CardPicker.Hint
          className="consumer-hint"
          data-hint="method-help"
          id="controlled-method-help"
          render={<aside />}
          stripesOptions={{ gap: '6px', width: '2px' }}
          textProps={{ size: 'sm', tone: 'accent' }}
          waitingContent="Select guided setup."
        />
      </CardPicker.Root>
    )

    const root = screen.getByRole('region', {
      name: 'Controlled creation picker'
    })
    const group = screen.getByRole('radiogroup', {
      name: 'Controlled creation method'
    })
    const card = screen.getAllByTestId('overridden-surface')[0]?.closest('[data-card="guided"]')
    const selector = screen.getByRole('radio', { name: 'Guided setup' })
    const hint = screen.getByText('Select guided setup.').closest('[data-hint="method-help"]')
    const contentBox = screen.getByText('Select guided setup.').closest('[tabindex="-1"]')
    const stripedSurface = Array.from(
      (hint as HTMLElement).querySelectorAll<HTMLElement>('*')
    ).find((element) =>
      (element.style.backgroundImage || element.style.background).includes(
        'repeating-linear-gradient'
      )
    )

    expect(root.tagName).toBe('SECTION')
    expect(root).toHaveClass('consumer-root')
    expect(root).toHaveStyle({ minHeight: '240px' })
    expect(root).toHaveAttribute('data-picker', 'controlled')
    expect(root).toHaveAttribute('data-placement', 'inline-start')
    expect(group.tagName).toBe('FIELDSET')
    expect(group).toHaveClass('consumer-group')
    expect(group).toHaveAttribute('data-group', 'methods')
    expect(card?.tagName).toBe('ARTICLE')
    expect(card).toHaveClass('consumer-card')
    expect(card).toHaveAttribute('data-size', 'xl')
    expect(selector.tagName).toBe('BUTTON')
    expect(selector).toHaveAttribute('data-selector', 'guided')
    expect(screen.getAllByTestId('overridden-surface')).toHaveLength(2)
    for (const surface of screen.getAllByTestId('overridden-surface')) {
      expect(surface.tagName).toBe('SECTION')
      expect(surface).toHaveClass('consumer-surface')
    }
    expect(hint?.tagName).toBe('ASIDE')
    expect(hint).toHaveClass('consumer-hint')
    expect(hint).toHaveAttribute('id', 'controlled-method-help')
    expect(contentBox).toHaveClass('text-sm', 'text-accent-foreground')
    expect(stripedSurface?.style.getPropertyValue('--stripes-gap')).toBe('6px')
    expect(stripedSurface?.style.getPropertyValue('--stripes-width')).toBe('2px')
  })

  it('UC-007 / UC-008 / EX-004 - updates direct arrays, order, and a retained conditional Card in the same render', async () => {
    const onValueChange = vi.fn()

    function DynamicPicker() {
      const [reversed, setReversed] = useState(false)
      const [showTemplate, setShowTemplate] = useState(true)
      const [value, setValue] = useState<string | null>('template')
      const choices = [
        { title: 'From Scratch', value: 'from-scratch' },
        { title: 'Guided', value: 'guided' }
      ] as const
      const visibleChoices = reversed ? [...choices].reverse() : choices

      return (
        <>
          <button type="button" onClick={() => setShowTemplate((current) => !current)}>
            toggle template
          </button>
          <button type="button" onClick={() => setReversed((current) => !current)}>
            reverse Cards
          </button>
          <CardPicker.Root
            onValueChange={(nextValue: string, details: CardPickerRootChangeEventDetails) => {
              onValueChange(nextValue, details)
              setValue(nextValue)
            }}
            value={value}
            data-testid="dynamic-root"
          >
            <CardPicker.Group aria-label="Dynamic creation method" data-testid="dynamic-group">
              {visibleChoices.map((choice) => (
                <CardPicker.Card
                  key={choice.value}
                  data-testid={`${choice.value}-card`}
                  hint={{ content: `${choice.title} help` }}
                  selectorProps={{ 'aria-label': choice.title }}
                  value={choice.value}
                >
                  <Card.Surface />
                </CardPicker.Card>
              ))}
              {showTemplate && (
                <CardPicker.Card
                  key="template-card"
                  data-testid="template-card"
                  hint={{ content: 'Template help' }}
                  selectorProps={{ 'aria-label': 'Template' }}
                  value="template"
                >
                  <Card.Surface />
                </CardPicker.Card>
              )}
              {false}
              {null}
              {undefined}
              {true}
            </CardPicker.Group>
            <CardPicker.Hint
              switchAnimationOptions={{ style: ZERO_MOTION_STYLE }}
              waitingContent="The retained value has no current Card."
            />
          </CardPicker.Root>
        </>
      )
    }

    render(<DynamicPicker />)

    const root = screen.getByTestId('dynamic-root')
    const group = screen.getByTestId('dynamic-group')

    expect(screen.getByRole('radio', { name: 'Template' })).toBeChecked()
    expect(screen.getByText('Template help')).toBeVisible()
    expect(Array.from(group.children).map((child) => child.getAttribute('data-testid'))).toEqual([
      'from-scratch-card',
      'guided-card',
      'template-card'
    ])

    fireEvent.click(screen.getByRole('button', { name: 'toggle template' }))

    expect(screen.queryByRole('radio', { name: 'Template' })).not.toBeInTheDocument()
    expect(root).not.toHaveAttribute('data-selected')
    expect(screen.getByText('The retained value has no current Card.')).toBeVisible()
    expect(onValueChange).not.toHaveBeenCalled()

    fireEvent.click(screen.getByRole('button', { name: 'reverse Cards' }))

    expect(Array.from(group.children).map((child) => child.getAttribute('data-testid'))).toEqual([
      'guided-card',
      'from-scratch-card'
    ])

    fireEvent.click(screen.getByRole('button', { name: 'toggle template' }))

    expect(screen.getByRole('radio', { name: 'Template' })).toBeChecked()
    expect(root).toHaveAttribute('data-selected')
    await waitFor(() => expect(screen.getByText('Template help')).toBeVisible())
    expect(onValueChange).not.toHaveBeenCalled()
  })

  it('UC-008 - retains an unmatched uncontrolled value until its direct Card returns', async () => {
    const onValueChange = vi.fn()

    function UncontrolledRetainedPicker() {
      const [showTemplate, setShowTemplate] = useState(true)

      return (
        <>
          <button type="button" onClick={() => setShowTemplate((current) => !current)}>
            toggle uncontrolled template
          </button>
          <CardPicker.Root
            defaultValue="template"
            onValueChange={onValueChange}
            data-testid="uncontrolled-retained-root"
          >
            <CardPicker.Group aria-label="Uncontrolled retained value">
              <CardPicker.Card
                hint={{ content: 'Scratch help' }}
                selectorProps={{ 'aria-label': 'Uncontrolled Scratch' }}
                value="scratch"
              >
                <Card.Surface />
              </CardPicker.Card>
              {showTemplate && (
                <CardPicker.Card
                  hint={{ content: 'Uncontrolled Template help' }}
                  selectorProps={{ 'aria-label': 'Uncontrolled Template' }}
                  value="template"
                >
                  <Card.Surface />
                </CardPicker.Card>
              )}
            </CardPicker.Group>
            <CardPicker.Hint
              switchAnimationOptions={{ style: ZERO_MOTION_STYLE }}
              waitingContent="The uncontrolled value has no current Card."
            />
          </CardPicker.Root>
        </>
      )
    }

    render(<UncontrolledRetainedPicker />)

    const root = screen.getByTestId('uncontrolled-retained-root')

    expect(screen.getByRole('radio', { name: 'Uncontrolled Template' })).toBeChecked()
    expect(screen.getByText('Uncontrolled Template help')).toBeVisible()

    fireEvent.click(screen.getByRole('button', { name: 'toggle uncontrolled template' }))

    expect(screen.queryByRole('radio', { name: 'Uncontrolled Template' })).not.toBeInTheDocument()
    expect(root).not.toHaveAttribute('data-selected')
    expect(screen.getByText('The uncontrolled value has no current Card.')).toBeVisible()

    fireEvent.click(screen.getByRole('button', { name: 'toggle uncontrolled template' }))

    expect(screen.getByRole('radio', { name: 'Uncontrolled Template' })).toBeChecked()
    expect(root).toHaveAttribute('data-selected')
    await waitFor(() => expect(screen.getByText('Uncontrolled Template help')).toBeVisible())
    expect(onValueChange).not.toHaveBeenCalled()
  })

  it('UC-008 / UC-011 / EX-004 - gives changed help a replacement generation without changing selection', async () => {
    const onSwitchChange = vi.fn()
    const onValueChange = vi.fn()

    function ChangedHelpPicker() {
      const [detailed, setDetailed] = useState(false)

      return (
        <>
          <button type="button" onClick={() => setDetailed((current) => !current)}>
            change template help
          </button>
          <CardPicker.Root value="template" onValueChange={onValueChange}>
            <CardPicker.Group aria-label="Changed help">
              <CardPicker.Card
                hint={{ content: detailed ? 'Template detail' : 'Template summary' }}
                selectorProps={{ 'aria-label': 'Template' }}
                value="template"
              >
                <Card.Surface />
              </CardPicker.Card>
            </CardPicker.Group>
            <CardPicker.Hint
              switchAnimationOptions={{
                onSwitchChange,
                style: ZERO_MOTION_STYLE
              }}
              waitingContent="Waiting"
            />
          </CardPicker.Root>
        </>
      )
    }

    render(<ChangedHelpPicker />)

    const selector = screen.getByRole('radio', { name: 'Template' })

    expect(selector).toBeChecked()
    expect(screen.getByText('Template summary')).toBeVisible()

    fireEvent.click(screen.getByRole('button', { name: 'change template help' }))

    expect(selector).toBeChecked()
    expect(screen.getByText('Template detail')).toBeVisible()
    expect(onValueChange).not.toHaveBeenCalled()
    await waitFor(() => expect(onSwitchChange).toHaveBeenCalledOnce())

    const replacement = onSwitchChange.mock.calls[0]?.[0]

    expect(replacement.previousKey).not.toBe(replacement.nextKey)
  })

  it('UC-009 / UC-014 / EX-003 - exposes every placement with default gaps and aligned region order in RTL', () => {
    render(
      <div dir="rtl">
        {PLACEMENT_CASES.map(({ placement }) => (
          <CardPicker.Root
            key={placement}
            defaultValue="strength"
            placement={placement}
            data-testid={`${placement}-root`}
          >
            <CardPicker.Group
              aria-label={`${placement} training focus`}
              data-testid={`${placement}-group`}
            >
              <CardPicker.Card
                hint={{ content: `${placement} help` }}
                selectorProps={{ 'aria-label': `${placement} Strength` }}
                value="strength"
              >
                <Card.Surface />
              </CardPicker.Card>
            </CardPicker.Group>
            <CardPicker.Hint
              data-testid={`${placement}-hint`}
              waitingContent={`${placement} waiting`}
            />
          </CardPicker.Root>
        ))}
      </div>
    )

    for (const { cardsFirst, placement } of PLACEMENT_CASES) {
      const root = screen.getByTestId(`${placement}-root`)
      const group = screen.getByTestId(`${placement}-group`)
      const hint = screen.getByTestId(`${placement}-hint`)

      expect(root).toHaveAttribute('data-placement', placement)
      expect(root.closest('[dir="rtl"]')).toBeInTheDocument()
      expect(Array.from(root.children)).toEqual(cardsFirst ? [group, hint] : [hint, group])
      expect(root).toHaveClass('gap-4')
      expect(group).toHaveClass('gap-3')
      expect(screen.getByRole('radiogroup', { name: `${placement} training focus` })).toBe(group)
    }
  })

  it('UC-010 / EX-001 - names the radiogroup, merges a stable Hint description, and keeps Hint neutral', async () => {
    render(
      <>
        <p id="consumer-description">Consumer-owned description.</p>
        <CardPicker.Root>
          <CardPicker.Group
            aria-describedby="consumer-description"
            aria-label="Described creation method"
          >
            <CardPicker.Card
              hint={{ content: 'Template-specific group help.' }}
              selectorProps={{ 'aria-label': 'Template' }}
              value="template"
            >
              <Card.Surface />
            </CardPicker.Card>
          </CardPicker.Group>
          <CardPicker.Hint
            switchAnimationOptions={{ style: ZERO_MOTION_STYLE }}
            waitingContent="Choose a method for contextual help."
            data-testid="describing-hint"
          />
        </CardPicker.Root>
      </>
    )

    const group = screen.getByRole('radiogroup', {
      name: 'Described creation method'
    })
    const hint = screen.getByTestId('describing-hint')
    const selector = screen.getByRole('radio', { name: 'Template' })
    const hintId = hint.id
    const descriptionTokens = group.getAttribute('aria-describedby')?.split(/\s+/)

    expect(hintId).not.toBe('')
    expect(descriptionTokens).toEqual(expect.arrayContaining(['consumer-description', hintId]))
    expect(group).toHaveAccessibleDescription(
      'Consumer-owned description. Choose a method for contextual help.'
    )
    expect(selector).not.toHaveAttribute('aria-describedby')
    expect(selector).not.toHaveAccessibleDescription()
    expect(hint).not.toHaveAttribute('role')
    expect(hint).not.toHaveAttribute('aria-live')
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    expect(screen.queryByRole('status')).not.toBeInTheDocument()

    fireEvent.click(selector)

    await waitFor(() =>
      expect(group).toHaveAccessibleDescription(
        'Consumer-owned description. Template-specific group help.'
      )
    )
    expect(hint.id).toBe(hintId)
    expect(group.getAttribute('aria-describedby')?.split(/\s+/)).toEqual(
      expect.arrayContaining(['consumer-description', hintId])
    )
    expect(selector).not.toHaveAccessibleDescription()
  })

  it('UC-011 / EX-007 - preserves Hint focus transfer and the SwitchAnimation lifecycle', async () => {
    const onFocus = vi.fn()
    const onSwitchChange = vi.fn()
    const onSwitchComplete = vi.fn()
    const onSwitchStart = vi.fn()

    function InteractiveHelpPicker() {
      const [method, setMethod] = useState<'advanced' | 'basic'>('basic')

      return (
        <CardPicker.Root value={method} onValueChange={setMethod}>
          <CardPicker.Group aria-label="Configuration depth">
            <CardPicker.Card
              hint={{
                content: (
                  <section>
                    <strong>Basic configuration</strong>
                    <button type="button" onClick={() => setMethod('advanced')}>
                      continue to advanced help
                    </button>
                  </section>
                )
              }}
              selectorProps={{ 'aria-label': 'Basic configuration' }}
              value="basic"
            >
              <Card.Surface />
            </CardPicker.Card>
            <CardPicker.Card
              hint={{
                content: (
                  <section>
                    <strong>Advanced configuration</strong>
                    Review load, tempo, and recovery together.
                  </section>
                )
              }}
              selectorProps={{ 'aria-label': 'Advanced configuration' }}
              value="advanced"
            >
              <Card.Surface />
            </CardPicker.Card>
          </CardPicker.Group>
          <CardPicker.Hint
            onFocus={onFocus}
            switchAnimationOptions={{
              onSwitchChange,
              onSwitchComplete,
              onSwitchStart,
              style: ZERO_MOTION_STYLE
            }}
            waitingContent="Choose a configuration depth."
          />
        </CardPicker.Root>
      )
    }

    render(<InteractiveHelpPicker />)

    const action = screen.getByRole('button', {
      name: 'continue to advanced help'
    })

    action.focus()
    fireEvent.click(action)

    const incomingContentBox = screen.getByText('Advanced configuration').closest('[tabindex="-1"]')

    await waitFor(() => expect(incomingContentBox).toHaveFocus())
    expect(onFocus).toHaveBeenCalled()
    expect(screen.getByRole('radio', { name: 'Advanced configuration' })).toBeChecked()
    await waitFor(() => {
      expect(onSwitchChange).toHaveBeenCalledOnce()
      expect(onSwitchStart).toHaveBeenCalledOnce()
      expect(onSwitchComplete).toHaveBeenCalledOnce()
    })

    const changeDetails = onSwitchChange.mock.calls[0]?.[0]
    const startDetails = onSwitchStart.mock.calls[0]?.[0]
    const completeDetails = onSwitchComplete.mock.calls[0]?.[0]

    expect(startDetails.replacementId).toBe(changeDetails.replacementId)
    expect(completeDetails).toEqual(
      expect.objectContaining({
        replacementId: changeDetails.replacementId,
        status: 'finished'
      })
    )
  })

  it('UC-012 / EX-006 - preserves disabled, read-only, and required radio state without disabling Card actions', () => {
    const disabledStates: CardPickerRootState<string>[] = []
    const onDisabledChange = vi.fn()
    const onReadOnlyChange = vi.fn()
    const onActionClick = vi.fn()
    const readOnlyStates: CardPickerRootState<string>[] = []

    render(
      <>
        <CardPicker.Root
          defaultValue="locked"
          disabled
          onValueChange={onDisabledChange}
          render={(props: ComponentPropsWithRef<'div'>, state: CardPickerRootState<string>) => {
            disabledStates.push(state)
            return <div {...props} />
          }}
          required
          data-testid="disabled-picker"
        >
          <CardPicker.Group aria-label="Disabled picker" data-testid="disabled-group">
            <CardPicker.Card
              hint={{ content: 'The locked method remains selected.' }}
              selectorProps={{ 'aria-label': 'Locked method' }}
              value="locked"
            >
              <Card.Surface>
                <Card.Footer>
                  <Card.Button type="button" onClick={onActionClick}>
                    Inspect locked method
                  </Card.Button>
                </Card.Footer>
              </Card.Surface>
            </CardPicker.Card>
            <CardPicker.Card
              hint={{ content: 'The alternate method cannot be selected.' }}
              selectorProps={{ 'aria-label': 'Alternate disabled method' }}
              value="alternate"
            >
              <Card.Surface />
            </CardPicker.Card>
          </CardPicker.Group>
          <CardPicker.Hint waitingContent="No disabled method is selected." />
        </CardPicker.Root>

        <CardPicker.Root
          defaultValue="fixed"
          onValueChange={onReadOnlyChange}
          readOnly
          render={(props: ComponentPropsWithRef<'div'>, state: CardPickerRootState<string>) => {
            readOnlyStates.push(state)
            return <div {...props} />
          }}
          data-testid="readonly-picker"
        >
          <CardPicker.Group aria-label="Read-only picker">
            <CardPicker.Card
              hint={{ content: 'The fixed method remains selected.' }}
              selectorProps={{ 'aria-label': 'Fixed method' }}
              value="fixed"
            >
              <Card.Surface />
            </CardPicker.Card>
            <CardPicker.Card
              hint={{ content: 'Read-only state prevents this selection.' }}
              selectorProps={{ 'aria-label': 'Alternate read-only method' }}
              value="alternate"
            >
              <Card.Surface />
            </CardPicker.Card>
          </CardPicker.Group>
          <CardPicker.Hint waitingContent="No read-only method is selected." />
        </CardPicker.Root>
      </>
    )

    const disabledGroup = screen.getByTestId('disabled-group')
    const locked = screen.getByRole('radio', { name: 'Locked method' })
    const disabledAlternate = screen.getByRole('radio', {
      name: 'Alternate disabled method'
    })
    const fixed = screen.getByRole('radio', { name: 'Fixed method' })
    const readOnlyAlternate = screen.getByRole('radio', {
      name: 'Alternate read-only method'
    })
    const action = screen.getByRole('button', { name: 'Inspect locked method' })

    expect(disabledGroup).toHaveAttribute('data-disabled')
    expect(locked).toBeChecked()
    expect(locked).toHaveAttribute('data-disabled')
    expect(locked).toHaveAttribute('data-required')
    expect(disabledAlternate).toHaveAttribute('data-disabled')
    expect(fixed).toBeChecked()
    expect(fixed).toHaveAttribute('data-readonly')
    expect(readOnlyAlternate).toHaveAttribute('data-readonly')
    expect(screen.getByText('The locked method remains selected.')).toBeVisible()
    expect(screen.getByText('The fixed method remains selected.')).toBeVisible()
    expect(action).not.toBeDisabled()

    fireEvent.click(disabledAlternate)
    fireEvent.click(readOnlyAlternate)
    fireEvent.click(action)

    expect(locked).toBeChecked()
    expect(disabledAlternate).not.toBeChecked()
    expect(fixed).toBeChecked()
    expect(readOnlyAlternate).not.toBeChecked()
    expect(onDisabledChange).not.toHaveBeenCalled()
    expect(onReadOnlyChange).not.toHaveBeenCalled()
    expect(onActionClick).toHaveBeenCalledOnce()
    expect(disabledStates.at(-1)).toEqual({
      disabled: true,
      placement: 'block-start',
      readOnly: false,
      required: true,
      value: 'locked'
    })
    expect(readOnlyStates.at(-1)).toEqual({
      disabled: false,
      placement: 'block-start',
      readOnly: true,
      required: false,
      value: 'fixed'
    })
  })

  it('UC-005 / UC-012 - keeps a Selector-specific unavailable state local to its Card selection', () => {
    const onActionClick = vi.fn()
    const onValueChange = vi.fn()

    render(
      <CardPicker.Root defaultValue="available" onValueChange={onValueChange}>
        <CardPicker.Group aria-label="Selector-specific state">
          <CardPicker.Card
            data-testid="available-card"
            hint={{ content: 'Available help' }}
            selectorProps={{ 'aria-label': 'Available option' }}
            value="available"
          >
            <Card.Surface />
          </CardPicker.Card>
          <CardPicker.Card
            data-testid="protected-card"
            hint={{ content: 'Protected help' }}
            selectorProps={{
              'aria-label': 'Protected option',
              disabled: true,
              required: true
            }}
            value="protected"
          >
            <Card.Surface>
              <Card.Footer>
                <Card.Button type="button" onClick={onActionClick}>
                  Inspect protected option
                </Card.Button>
              </Card.Footer>
            </Card.Surface>
          </CardPicker.Card>
        </CardPicker.Group>
        <CardPicker.Hint waitingContent="Waiting" />
      </CardPicker.Root>
    )

    const availableCard = screen.getByTestId('available-card')
    const protectedCard = screen.getByTestId('protected-card')
    const available = screen.getByRole('radio', { name: 'Available option' })
    const protectedSelector = screen.getByRole('radio', {
      name: 'Protected option'
    })
    const action = screen.getByRole('button', {
      name: 'Inspect protected option'
    })

    expect(available).toBeChecked()
    expect(availableCard).not.toHaveAttribute('data-disabled')
    expect(protectedSelector).toHaveAttribute('data-disabled')
    expect(protectedSelector).toHaveAttribute('data-required')
    expect(protectedCard).toHaveAttribute('data-disabled')
    expect(action).not.toBeDisabled()

    fireEvent.click(protectedSelector)
    fireEvent.click(action)

    expect(available).toBeChecked()
    expect(protectedSelector).not.toBeChecked()
    expect(screen.getByText('Available help')).toBeVisible()
    expect(onValueChange).not.toHaveBeenCalled()
    expect(onActionClick).toHaveBeenCalledOnce()
  })

  it('UC-013 - leaves deterministic Surface content duplicated while Selector and actions stay single', () => {
    const attachedNodes = new Set<HTMLSpanElement>()
    const onActionClick = vi.fn()
    const duplicateSafeRef = (node: HTMLSpanElement | null) => {
      if (node) attachedNodes.add(node)
    }

    render(
      <CardPicker.Root defaultValue="safe" data-testid="surface-picker">
        <CardPicker.Group aria-label="Duplicate-safe method">
          <CardPicker.Card
            data-testid="duplicate-safe-card"
            hint={{ content: 'Duplicate-safe help' }}
            selectorProps={{ 'aria-label': 'Duplicate-safe option' }}
            value="safe"
          >
            <Card.Surface data-purpose="consumer-surface">
              <span data-purpose="duplicate-safe-probe" ref={duplicateSafeRef}>
                deterministic content
              </span>
              <Card.Footer>
                <Card.Button type="button" onClick={onActionClick}>
                  Preview safe option
                </Card.Button>
              </Card.Footer>
            </Card.Surface>
          </CardPicker.Card>
        </CardPicker.Group>
        <CardPicker.Hint waitingContent="Waiting" />
      </CardPicker.Root>
    )

    const card = screen.getByTestId('duplicate-safe-card')
    const selector = screen.getByRole('radio', { name: 'Duplicate-safe option' })
    const action = screen.getByRole('button', { name: 'Preview safe option' })

    expect(selector).toBeChecked()
    expect(card.querySelectorAll('[role="radio"]')).toHaveLength(1)
    expect(card.querySelectorAll('[data-purpose="consumer-surface"]')).toHaveLength(2)
    expect(card.querySelectorAll('[data-purpose="duplicate-safe-probe"]')).toHaveLength(2)
    expect(attachedNodes.size).toBe(2)
    expect(screen.getAllByRole('button', { name: 'Preview safe option' })).toHaveLength(1)
    expect(screen.getByText('Duplicate-safe help')).toBeVisible()

    fireEvent.click(action)

    expect(onActionClick).toHaveBeenCalledOnce()
    expect(selector).toBeChecked()
  })

  it('UC-014 / EX-001 - applies the default Root and Group gaps', () => {
    render(
      <CardPicker.Root data-testid="default-gap-root">
        <CardPicker.Group aria-label="Default spacing" data-testid="default-gap-group">
          <CardPicker.Card
            hint={{ content: 'First help' }}
            selectorProps={{ 'aria-label': 'First option' }}
            value="first"
          >
            <Card.Surface />
          </CardPicker.Card>
          <CardPicker.Card
            hint={{ content: 'Second help' }}
            selectorProps={{ 'aria-label': 'Second option' }}
            value="second"
          >
            <Card.Surface />
          </CardPicker.Card>
        </CardPicker.Group>
        <CardPicker.Hint waitingContent="Choose an option." />
      </CardPicker.Root>
    )

    expect(screen.getByTestId('default-gap-root')).toHaveClass('gap-4')
    expect(screen.getByTestId('default-gap-group')).toHaveClass('gap-3')
  })

  it('UC-014 / EX-001 - transfers the automatic stack fallback immediately with selection', () => {
    render(
      <CardPicker.Root defaultValue="first">
        <CardPicker.Group aria-label="Automatic stacking">
          <CardPicker.Card
            data-testid="first-auto-card"
            hint={{ content: 'First help' }}
            selectorProps={{ 'aria-label': 'First automatic option' }}
            value="first"
          >
            <Card.Surface />
          </CardPicker.Card>
          <CardPicker.Card
            data-testid="second-auto-card"
            hint={{ content: 'Second help' }}
            selectorProps={{ 'aria-label': 'Second automatic option' }}
            value="second"
          >
            <Card.Surface />
          </CardPicker.Card>
        </CardPicker.Group>
        <CardPicker.Hint waitingContent="Choose an option." />
      </CardPicker.Root>
    )

    const firstCard = screen.getByTestId('first-auto-card')
    const secondCard = screen.getByTestId('second-auto-card')

    expect(firstCard).toHaveClass('z-[var(--card-picker-card-z-index,1)]')
    expect(secondCard).toHaveClass('z-[var(--card-picker-card-z-index,0)]')

    fireEvent.click(screen.getByRole('radio', { name: 'Second automatic option' }))

    expect(firstCard).toHaveClass('z-[var(--card-picker-card-z-index,0)]')
    expect(secondCard).toHaveClass('z-[var(--card-picker-card-z-index,1)]')
  })

  it('UC-005 / UC-014 / EX-008 - lets consumer gaps and an explicit Card stack level override defaults', () => {
    const priorityStackStyle = {
      '--card-picker-card-z-index': 2
    } as CSSProperties

    render(
      <CardPicker.Root
        className="gap-8"
        data-testid="override-gap-root"
        defaultValue="ordinary"
        style={{ gap: '2.5rem' }}
      >
        <CardPicker.Group
          aria-label="Stacking priority"
          className="gap-1"
          data-testid="override-gap-group"
          style={{ gap: '0.5rem' }}
        >
          <CardPicker.Card
            data-testid="ordinary-card"
            hint={{ content: 'Uses automatic stack levels zero and one.' }}
            selectorProps={{ 'aria-label': 'Ordinary stacking' }}
            value="ordinary"
          >
            <Card.Surface />
          </CardPicker.Card>
          <CardPicker.Card
            data-testid="priority-card"
            hint={{ content: 'Keeps explicit stack level two in every state.' }}
            selectorProps={{ 'aria-label': 'Priority stacking' }}
            style={priorityStackStyle}
            value="priority"
          >
            <Card.Surface />
          </CardPicker.Card>
        </CardPicker.Group>
        <CardPicker.Hint waitingContent="Choose a stacking treatment." />
      </CardPicker.Root>
    )

    const root = screen.getByTestId('override-gap-root')
    const group = screen.getByTestId('override-gap-group')
    const ordinaryCard = screen.getByTestId('ordinary-card')
    const priorityCard = screen.getByTestId('priority-card')

    expect(root).toHaveClass('gap-8')
    expect(root).not.toHaveClass('gap-4')
    expect(root).toHaveStyle({ gap: '2.5rem' })
    expect(group).toHaveClass('gap-1')
    expect(group).not.toHaveClass('gap-3')
    expect(group).toHaveStyle({ gap: '0.5rem' })
    expect(ordinaryCard).toHaveClass('z-[var(--card-picker-card-z-index,1)]')
    expect(priorityCard).toHaveClass('z-[var(--card-picker-card-z-index,0)]')
    expect(priorityCard.style.getPropertyValue('--card-picker-card-z-index')).toBe('2')

    fireEvent.click(screen.getByRole('radio', { name: 'Priority stacking' }))

    expect(ordinaryCard).toHaveClass('z-[var(--card-picker-card-z-index,0)]')
    expect(priorityCard).toHaveClass('z-[var(--card-picker-card-z-index,1)]')
    expect(priorityCard.style.getPropertyValue('--card-picker-card-z-index')).toBe('2')
  })
})
