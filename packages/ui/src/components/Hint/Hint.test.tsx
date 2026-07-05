import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import {
  createRef,
  useState,
  type ComponentPropsWithRef,
  type CSSProperties,
  type Key,
  type ReactElement
} from 'react'
import { afterEach, beforeEach, describe, expect, expectTypeOf, it, vi } from 'vitest'

import {
  type HintProps as PublicHintProps,
  type HintTextProps as PublicHintTextProps,
  type ToneOrIntentProps
} from '../..'
import * as PackageExports from '../..'
import hintStoriesMeta, { Ex003InteractiveReactContent } from './Hint.stories'

type HintContent = string | ReactElement

interface HintItem {
  readonly condition: boolean
  readonly content: HintContent
  readonly key: Key
}

type HintStripesOptions = Pick<
  ComponentPropsWithRef<typeof PackageExports.Stripes>,
  'angle' | 'className' | 'color' | 'gap' | 'style' | 'width'
>

type HintSwitchAnimationOptions = Pick<
  ComponentPropsWithRef<typeof PackageExports.SwitchAnimation>,
  'className' | 'direction' | 'onSwitchChange' | 'onSwitchComplete' | 'onSwitchStart' | 'style'
>

type HintTextProps = Pick<
  ComponentPropsWithRef<typeof PackageExports.Text>,
  'className' | 'size' | 'style'
> &
  ToneOrIntentProps

interface HintProps extends Omit<ComponentPropsWithRef<'div'>, 'children'> {
  hints: readonly HintItem[]
  render?:
    | ReactElement
    | ((props: ComponentPropsWithRef<'div'>, state: Record<string, never>) => ReactElement)
  stripesOptions?: HintStripesOptions
  switchAnimationOptions?: HintSwitchAnimationOptions
  textProps?: HintTextProps
  waitingContent: HintContent
  waitingKey: Key
}

type HintComponent = (props: HintProps) => ReactElement | null

interface HintPackageContract {
  Components: typeof PackageExports.Components & {
    Hint: HintComponent
  }
  Hint: HintComponent
  Ui: typeof PackageExports.Ui & {
    Components: typeof PackageExports.Components & {
      Hint: HintComponent
    }
  }
}

type SwitchAnimationCssProperties = CSSProperties &
  Partial<
    Record<
      '--switch-animation-distance' | '--switch-animation-duration' | '--switch-animation-stagger',
      string
    >
  >

const PACKAGE_EXPORTS = PackageExports as typeof PackageExports & HintPackageContract
const Hint = PACKAGE_EXPORTS.Hint

const ZERO_MOTION_STYLE = {
  '--switch-animation-distance': '0px',
  '--switch-animation-duration': '0ms',
  '--switch-animation-stagger': '0ms'
} as SwitchAnimationCssProperties

const TEXT_SIZE_TREATMENTS = [
  ['xs', ['text-xs', 'tracking-wide']],
  ['sm', ['text-sm', 'tracking-wide']],
  ['md', ['text-md', 'tracking-wide']],
  ['lg', ['text-lg']],
  ['xl', ['text-xl', 'tracking-tight']],
  ['2xl', ['text-2xl', 'tracking-tight']],
  ['3xl', ['text-3xl', 'tracking-tight']]
] as const

function setReducedMotionPreference(matches: boolean) {
  vi.stubGlobal(
    'matchMedia',
    vi.fn((query: string) => {
      return {
        addEventListener: vi.fn(),
        addListener: vi.fn(),
        dispatchEvent: vi.fn(() => true),
        matches: query === '(prefers-reduced-motion: reduce)' ? matches : false,
        media: query,
        onchange: null,
        removeEventListener: vi.fn(),
        removeListener: vi.fn()
      } as MediaQueryList
    })
  )
}

function getSwitchRoot(container: HTMLElement): HTMLElement {
  const root = container.querySelector<HTMLElement>('[data-motion="switch"]')

  expect(root).toBeInTheDocument()

  return root as HTMLElement
}

function getStripesSurface(content: HTMLElement): HTMLElement {
  let current: HTMLElement | null = content

  while (current !== null) {
    const background = current.style.backgroundImage || current.style.background

    if (background.includes('repeating-linear-gradient')) return current

    current = current.parentElement
  }

  throw new Error('Expected content to be inside the public Stripes surface')
}

function getCssVariable(element: HTMLElement, variable: string): string {
  return (
    element.style.getPropertyValue(variable) || getComputedStyle(element).getPropertyValue(variable)
  ).trim()
}

function RecoveryHint() {
  const [longEffort, setLongEffort] = useState(false)

  return (
    <div>
      <label>
        <input
          type="checkbox"
          checked={longEffort}
          onChange={(event) => setLongEffort(event.currentTarget.checked)}
        />
        effort longer than 30 seconds
      </label>

      <Hint
        waitingKey="waiting"
        waitingContent="Choose an effort duration to see recovery guidance."
        hints={[
          {
            condition: longEffort,
            content: 'Add enough recovery to preserve rep quality.',
            key: 'long-effort'
          }
        ]}
        switchAnimationOptions={{ style: ZERO_MOTION_STYLE }}
      />
    </div>
  )
}

function RapidZeroMotionHint() {
  const [fulfilled, setFulfilled] = useState(false)
  const [records, setRecords] = useState<string[]>([])

  function append(record: string) {
    setRecords((current) => [...current, record])
  }

  function runRapidSequence() {
    setFulfilled(true)
    window.setTimeout(() => setFulfilled(false), 0)
  }

  return (
    <div>
      <button type="button" onClick={runRapidSequence}>
        run waiting → fulfilled → waiting
      </button>

      <Hint
        waitingKey="waiting"
        waitingContent="Waiting for the constraint."
        hints={[
          {
            condition: fulfilled,
            content: 'The constraint is fulfilled.',
            key: 'fulfilled'
          }
        ]}
        switchAnimationOptions={{
          onSwitchChange: (details) =>
            append(
              `change ${details.replacementId} ${String(details.previousKey)} → ${String(details.nextKey)}`
            ),
          onSwitchComplete: (details) =>
            append(
              `complete ${details.replacementId} ${String(details.previousKey)} → ${String(details.nextKey)} ${details.status}`
            ),
          onSwitchStart: (details) =>
            append(
              `start ${details.replacementId} ${String(details.previousKey)} → ${String(details.nextKey)}`
            ),
          style: {
            '--switch-animation-duration': '0ms',
            '--switch-animation-stagger': '0ms'
          } as CSSProperties
        }}
      />

      <output>Active selection: {fulfilled ? 'fulfilled' : 'waiting'}</output>
      <ol aria-label="Replacement lifecycle records">
        {records.map((record, index) => (
          <li key={`${record}-${index}`}>{record}</li>
        ))}
      </ol>
    </div>
  )
}

describe('Hint', () => {
  beforeEach(() => {
    setReducedMotionPreference(false)
  })

  afterEach(() => {
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
  })

  it('UC-001 / UC-006 / UC-010 / EX-001 - renders the waiting content in the default composed surface', () => {
    const { container } = render(
      <Hint waitingKey="waiting" waitingContent="Complete a field to see a hint." hints={[]} />
    )

    const contentBox = screen.getByText('Complete a field to see a hint.')
    const wrapper = container.firstElementChild
    const switchRoot = getSwitchRoot(container)
    const stripesSurface = getStripesSurface(contentBox)

    expect(wrapper).toBeInstanceOf(HTMLDivElement)
    expect(contentBox.tagName).toBe('DIV')
    expect(contentBox).toHaveAttribute('tabindex', '-1')
    expect(stripesSurface).not.toBe(wrapper)
    expect(switchRoot).toHaveAttribute('data-content-mode', 'flow')
    expect(switchRoot).toHaveAttribute('data-direction', 'down')
    expect(switchRoot).toBe(stripesSurface.firstElementChild)
  })

  it('UC-002 / UC-004 / EX-001 - follows consumer-owned booleans and returns to waiting content', async () => {
    render(<RecoveryHint />)

    const condition = screen.getByRole('checkbox', {
      name: 'effort longer than 30 seconds'
    })

    expect(screen.getByText('Choose an effort duration to see recovery guidance.')).toBeVisible()

    fireEvent.click(condition)

    expect(screen.getByText('Add enough recovery to preserve rep quality.')).toBeVisible()

    fireEvent.click(condition)

    const activeWaitingContent = screen
      .getAllByText('Choose an effort duration to see recovery guidance.')
      .filter((contentBox) => contentBox.closest('[aria-hidden="true"]') === null)

    expect(activeWaitingContent).toHaveLength(1)
    expect(activeWaitingContent[0]).toBeVisible()

    await waitFor(() => {
      expect(
        screen.queryAllByText('Choose an effort duration to see recovery guidance.')
      ).toHaveLength(1)
      expect(
        screen.queryByText('Add enough recovery to preserve rep quality.')
      ).not.toBeInTheDocument()
    })
  })

  it('UC-003 / EX-002 - selects the first fulfilled hint and passes its exact key', async () => {
    const onSwitchChange = vi.fn()
    const { rerender } = render(
      <Hint
        waitingKey="waiting"
        waitingContent="Select a training condition."
        hints={[
          { condition: false, content: 'Keep the main lift first.', key: 'strength' },
          { condition: false, content: 'Keep work repeatable.', key: 'conditioning' }
        ]}
        switchAnimationOptions={{ onSwitchChange, style: ZERO_MOTION_STYLE }}
      />
    )

    rerender(
      <Hint
        waitingKey="waiting"
        waitingContent="Select a training condition."
        hints={[
          { condition: true, content: 'Keep the main lift first.', key: 'strength' },
          { condition: true, content: 'Keep work repeatable.', key: 'conditioning' }
        ]}
        switchAnimationOptions={{ onSwitchChange, style: ZERO_MOTION_STYLE }}
      />
    )

    expect(screen.getByText('Keep the main lift first.')).toBeVisible()
    expect(screen.queryByText('Keep work repeatable.')).not.toBeInTheDocument()
    await waitFor(() =>
      expect(onSwitchChange).toHaveBeenCalledWith(
        expect.objectContaining({ nextKey: 'strength', previousKey: 'waiting' })
      )
    )
  })

  it('UC-005 / UC-009 / UC-010 / EX-003 / QA-001 - preserves React content, transfers focus, and updates the visible story probe', async () => {
    const Story = Ex003InteractiveReactContent.render

    render(<Story {...hintStoriesMeta.args} />)

    const action = screen.getByRole('button', { name: 'show progression hint' })
    const outgoingSection = screen.getByText('Start with one working set.').closest('section')
    const focusProbe = screen.getByText('No transferred focus yet')

    expect(outgoingSection?.parentElement).toHaveAttribute('tabindex', '-1')

    action.focus()
    fireEvent.click(action)

    const incomingSection = screen
      .getByText('Add load only after every target rep is controlled.')
      .closest('section')
    const incomingContentBox = incomingSection?.parentElement

    expect(incomingSection?.tagName).toBe('SECTION')
    expect(incomingContentBox).toHaveAttribute('tabindex', '-1')
    await waitFor(() => expect(incomingContentBox).toHaveFocus())
    await waitFor(() => expect(focusProbe).toHaveTextContent('Progression hint focused'))
  })

  it('UC-005 / UC-013 - uses Text with the default xs treatment for the selected content box', () => {
    render(<Hint waitingKey="waiting" waitingContent="Compact hint content" hints={[]} />)

    const contentBox = screen.getByText('Compact hint content')

    expect(contentBox.tagName).toBe('DIV')
    expect(contentBox).toHaveAttribute('tabindex', '-1')
    expect(contentBox).toHaveClass('text-xs', 'tracking-wide')
    expect(contentBox).toHaveClass('bg-background', 'text-muted-foreground')
    expect(contentBox).not.toHaveClass('text-sm')
  })

  it('UC-013 - resolves an omitted or explicitly undefined Text size to xs', () => {
    render(
      <>
        <Hint
          waitingKey="omitted-size"
          waitingContent="Omitted Text size"
          hints={[]}
          textProps={{ className: 'uppercase' }}
        />
        <Hint
          waitingKey="undefined-size"
          waitingContent="Undefined Text size"
          hints={[]}
          textProps={{ size: undefined }}
        />
      </>
    )

    expect(screen.getByText('Omitted Text size')).toHaveClass('text-xs', 'tracking-wide')
    expect(screen.getByText('Undefined Text size')).toHaveClass('text-xs', 'tracking-wide')
  })

  it.each(TEXT_SIZE_TREATMENTS)(
    'UC-013 - forwards textProps.size=%s unchanged to the owned Text treatment',
    (size, treatment) => {
      render(
        <Hint
          waitingKey="waiting"
          waitingContent={`${size} hint content`}
          hints={[]}
          textProps={{ size }}
        />
      )

      const contentBox = screen.getByText(`${size} hint content`)

      expect(contentBox).toHaveClass(...treatment)
      expect(contentBox).toHaveClass('bg-background', 'text-muted-foreground')
    }
  )

  it.each([
    [{ tone: 'accent' }, 'text-accent-foreground'],
    [{ intent: 'warning' }, 'text-warning-foreground']
  ] as const satisfies readonly [ToneOrIntentProps, string][])(
    'UC-013 - forwards the supplied Text appearance unchanged',
    (appearance, expectedClassName) => {
      render(
        <Hint
          waitingKey="waiting"
          waitingContent="Semantic hint content"
          hints={[]}
          textProps={appearance}
        />
      )

      const contentBox = screen.getByText('Semantic hint content')

      expect(contentBox).toHaveClass(expectedClassName)
      expect(contentBox).not.toHaveClass('text-muted-foreground')
    }
  )

  it('UC-012 / UC-013 - replaces textSize with the bounded mutually exclusive HintTextProps contract', () => {
    expectTypeOf<
      Extract<keyof PublicHintProps, 'textProps' | 'textSize'>
    >().toEqualTypeOf<'textProps'>()
    expectTypeOf<PublicHintProps['textProps']>().toEqualTypeOf<PublicHintTextProps | undefined>()
    expectTypeOf<PublicHintTextProps>().toEqualTypeOf<HintTextProps>()
  })

  it('UC-013 - composes consumer Text overrides while preserving Hint-owned treatments', () => {
    render(
      <Hint
        waitingKey="waiting"
        waitingContent="Customized Text treatment"
        hints={[]}
        textProps={{
          className: 'bg-destructive font-mono text-2xl tracking-tight text-primary uppercase',
          style: {
            backgroundColor: 'rgb(1, 2, 3)',
            color: 'rgb(4, 5, 6)',
            font: 'italic 20px serif',
            fontFamily: 'serif',
            fontSize: '2rem',
            letterSpacing: '0.2em',
            textTransform: 'uppercase'
          }
        }}
      />
    )

    const contentBox = screen.getByText('Customized Text treatment')

    expect(contentBox).toHaveClass(
      'bg-background',
      'font-[inherit]',
      'text-2xl',
      'tracking-tight',
      'text-primary',
      'uppercase'
    )
    expect(contentBox).not.toHaveClass(
      'bg-destructive',
      'font-mono',
      'text-xs',
      'tracking-wide',
      'text-muted-foreground'
    )
    expect(contentBox).toHaveStyle({
      color: 'rgb(4, 5, 6)',
      fontSize: '2rem',
      letterSpacing: '0.2em',
      textTransform: 'uppercase'
    })
    expect(contentBox.style.backgroundColor).not.toBe('rgb(1, 2, 3)')
    expect(contentBox.style.font).not.toBe('italic 20px serif')
    expect(contentBox.style.fontFamily).not.toBe('serif')
    expect(contentBox.tagName).toBe('DIV')
    expect(contentBox).toHaveAttribute('tabindex', '-1')
    expect(contentBox).toHaveTextContent('Customized Text treatment')
  })

  it('UC-013 / QA-001 - preserves inline fontSize when consumer textProps update after mount', () => {
    const { rerender } = render(
      <Hint
        waitingKey="waiting"
        waitingContent="Updated Text treatment"
        hints={[]}
        textProps={{ className: 'text-2xl' }}
      />
    )

    rerender(
      <Hint
        waitingKey="waiting"
        waitingContent="Updated Text treatment"
        hints={[]}
        textProps={{
          className: 'text-2xl',
          style: { color: 'rgb(4, 5, 6)', fontSize: '22px', letterSpacing: '0.2em' }
        }}
      />
    )

    const contentBox = screen.getByText('Updated Text treatment')

    expect(contentBox.style.fontSize).toBe('22px')
    expect(contentBox).toHaveClass('bg-background', 'font-[inherit]', 'text-2xl')
  })

  it('UC-013 / CR-001 - preserves the Background surface against a consumer background shorthand', () => {
    const consumerBackground = 'linear-gradient(rgb(7, 8, 9), rgb(7, 8, 9))'

    render(
      <Hint
        waitingKey="waiting"
        waitingContent="Background-owned Text treatment"
        hints={[]}
        textProps={{ style: { background: consumerBackground } }}
      />
    )

    const contentBox = screen.getByText('Background-owned Text treatment')

    expect(contentBox).toHaveClass('bg-background')
    expect(contentBox.style.background).not.toBe(consumerBackground)
  })

  it('UC-002 / UC-003 / UC-010 / UC-011 / EX-006 - observes rapid zero-motion replacements by generation', async () => {
    render(<RapidZeroMotionHint />)

    fireEvent.click(screen.getByRole('button', { name: 'run waiting → fulfilled → waiting' }))

    expect(screen.getByText('Active selection: fulfilled')).toBeVisible()

    await screen.findByText('Active selection: waiting')
    await waitFor(() => {
      const records = screen.getAllByRole('listitem').map((item) => item.textContent ?? '')

      expect(records.filter((record) => record.startsWith('complete '))).toHaveLength(2)
    })

    const records = screen.getAllByRole('listitem').map((item) => item.textContent ?? '')
    const generationOneChange = records.indexOf('change 1 waiting → fulfilled')
    const generationOneStart = records.indexOf('start 1 waiting → fulfilled')
    const generationOneComplete = records.findIndex((record) =>
      /^complete 1 waiting → fulfilled (finished|interrupted)$/.test(record)
    )
    const generationTwoChange = records.indexOf('change 2 fulfilled → waiting')
    const generationTwoStart = records.indexOf('start 2 fulfilled → waiting')
    const generationTwoComplete = records.findIndex((record) =>
      /^complete 2 fulfilled → waiting (finished|interrupted)$/.test(record)
    )

    expect(generationOneChange).toBeGreaterThanOrEqual(0)
    expect(generationOneStart).toBeGreaterThan(generationOneChange)
    expect(generationOneComplete).toBeGreaterThan(generationOneStart)
    expect(generationTwoChange).toBeGreaterThanOrEqual(0)
    expect(generationTwoStart).toBeGreaterThan(generationTwoChange)
    expect(generationTwoComplete).toBeGreaterThan(generationTwoStart)

    await waitFor(() => {
      const mountedContentBoxes = [
        ...screen.queryAllByText('Waiting for the constraint.'),
        ...screen.queryAllByText('The constraint is fulfilled.')
      ]
      const activeContentBoxes = mountedContentBoxes.filter(
        (contentBox) => contentBox.closest('[aria-hidden="true"]') === null
      )

      expect(mountedContentBoxes).toHaveLength(1)
      expect(activeContentBoxes).toHaveLength(1)
      expect(activeContentBoxes[0]).toHaveTextContent('Waiting for the constraint.')
      expect(activeContentBoxes[0]).toBeVisible()
      expect(activeContentBoxes[0]?.parentElement?.style.position).not.toBe('absolute')
    })
  })

  it('UC-006 / CR-009 - keeps the documented Stripes defaults when no stripe options are supplied', () => {
    render(<Hint waitingKey="waiting" waitingContent="Default stripes" hints={[]} />)

    const stripesSurface = getStripesSurface(screen.getByText('Default stripes'))
    const background = stripesSurface.style.backgroundImage || stripesSurface.style.background

    expect(background).toContain('var(--stripes-angle, 135deg)')
    expect(background).toContain('var(--stripes-color, var(--muted))')
    expect(background).toContain('var(--stripes-gap, 3px)')
    expect(background).toContain('var(--stripes-width, 4px)')
  })

  it('UC-007 / UC-011 / UC-013 / EX-004 - forwards the documented composition options', async () => {
    const onSwitchChange = vi.fn()
    const onSwitchStart = vi.fn()
    const { container, rerender } = render(
      <Hint
        waitingKey="waiting"
        waitingContent="Waiting for the constraint."
        hints={[{ condition: false, content: 'Constraint fulfilled.', key: 'fulfilled' }]}
        textProps={{
          className: 'font-semibold',
          size: 'lg',
          style: { textTransform: 'uppercase' },
          tone: 'accent'
        }}
        stripesOptions={{
          angle: '45deg',
          className: 'stripe-option-class',
          color: 'currentColor',
          gap: '6px',
          style: { color: 'rgb(1, 2, 3)' },
          width: '2px'
        }}
        switchAnimationOptions={{
          className: 'switch-option-class',
          direction: 'right',
          onSwitchChange,
          onSwitchStart,
          style: ZERO_MOTION_STYLE
        }}
      />
    )

    const stripesSurface = getStripesSurface(screen.getByText('Waiting for the constraint.'))
    const switchRoot = getSwitchRoot(container)
    const contentBox = screen.getByText('Waiting for the constraint.')
    const wrapper = container.firstElementChild

    expect(wrapper).not.toHaveAttribute('textprops')
    expect(contentBox).toHaveClass(
      'bg-background',
      'font-[inherit]',
      'font-semibold',
      'text-lg',
      'text-accent-foreground'
    )
    expect(contentBox).toHaveStyle({ textTransform: 'uppercase' })
    expect(stripesSurface).toHaveClass('stripe-option-class')
    expect(stripesSurface.style.color).toBe('rgb(1, 2, 3)')
    expect(getCssVariable(stripesSurface, '--stripes-angle')).toBe('45deg')
    expect(getCssVariable(stripesSurface, '--stripes-color')).toBe('currentColor')
    expect(getCssVariable(stripesSurface, '--stripes-gap')).toBe('6px')
    expect(getCssVariable(stripesSurface, '--stripes-width')).toBe('2px')
    expect(switchRoot).toHaveClass('switch-option-class')
    expect(switchRoot).toHaveAttribute('data-direction', 'right')
    expect(switchRoot).toHaveAttribute('data-content-mode', 'flow')
    expect(getCssVariable(switchRoot, '--switch-animation-duration')).toBe('0ms')

    rerender(
      <Hint
        waitingKey="waiting"
        waitingContent="Waiting for the constraint."
        hints={[{ condition: true, content: 'Constraint fulfilled.', key: 'fulfilled' }]}
        textProps={{
          className: 'font-semibold',
          size: 'lg',
          style: { textTransform: 'uppercase' },
          tone: 'accent'
        }}
        stripesOptions={{ angle: '45deg', color: 'currentColor', gap: '6px', width: '2px' }}
        switchAnimationOptions={{
          direction: 'right',
          onSwitchChange,
          onSwitchStart,
          style: ZERO_MOTION_STYLE
        }}
      />
    )

    await waitFor(() => expect(onSwitchChange).toHaveBeenCalledOnce())
    expect(onSwitchStart).toHaveBeenCalledOnce()
    expect(onSwitchChange).toHaveBeenCalledWith(
      expect.objectContaining({ direction: 'right', nextKey: 'fulfilled', previousKey: 'waiting' })
    )
  })

  it('UC-008 / UC-009 / UC-012 / EX-005 - replaces and labels only the public wrapper', () => {
    const ref = createRef<HTMLDivElement>()
    const onClick = vi.fn()
    const { container } = render(
      <Hint
        ref={ref}
        render={<section />}
        aria-label="Workout guidance"
        data-context="workout-builder"
        className="consumer-wrapper-class"
        style={{ inlineSize: '18rem' }}
        onClick={onClick}
        waitingKey="waiting"
        waitingContent="Add an exercise to see guidance."
        hints={[]}
      />
    )

    const wrapper = screen.getByRole('region', { name: 'Workout guidance' })
    const switchRoot = getSwitchRoot(container)

    fireEvent.click(wrapper)

    expect(wrapper.tagName).toBe('SECTION')
    expect(wrapper).toHaveAttribute('data-context', 'workout-builder')
    expect(wrapper).toHaveClass('consumer-wrapper-class')
    expect(wrapper.style.inlineSize).toBe('18rem')
    expect(ref.current).toBe(wrapper)
    expect(onClick).toHaveBeenCalledOnce()
    expect(wrapper).not.toHaveAttribute('data-motion')
    expect(switchRoot).not.toBe(wrapper)
  })

  it('UC-008 / UC-012 - forwards render callback props without Hint state fields', () => {
    let stateKeys: string[] | undefined

    render(
      <Hint
        render={(props: ComponentPropsWithRef<'div'>, state: Record<string, never>) => {
          stateKeys = Object.keys(state)

          return <aside {...props} aria-label="Contextual coaching" />
        }}
        data-source="workout"
        waitingKey="waiting"
        waitingContent="Callback wrapper content"
        hints={[]}
      />
    )

    const wrapper = screen.getByRole('complementary', { name: 'Contextual coaching' })

    expect(wrapper).toHaveAttribute('data-source', 'workout')
    expect(wrapper).toHaveTextContent('Callback wrapper content')
    expect(stateKeys).toEqual([])
  })

  it('UC-009 / UC-012 - adds no contextual semantics or private protocol by default', () => {
    const { container } = render(
      <Hint waitingKey="waiting" waitingContent="Neutral contextual content" hints={[]} />
    )

    const wrapper = container.firstElementChild as HTMLElement

    expect(wrapper).not.toHaveAttribute('role')
    expect(wrapper).not.toHaveAttribute('aria-live')
    expect(wrapper).not.toHaveAttribute('aria-label')
    expect(wrapper).not.toHaveAccessibleName()
    expect(wrapper.getAttributeNames().filter((name) => name.startsWith('data-'))).toEqual([])
    expect(wrapper.getAttribute('style') ?? '').not.toContain('--hint-')
  })

  it('UC-001 / EX-001 / EX-002 / EX-003 / EX-004 / EX-005 / EX-006 - exports Hint as one public component', () => {
    expect(PACKAGE_EXPORTS.Hint).toBeTypeOf('function')
    expect(PACKAGE_EXPORTS.Components.Hint).toBe(PACKAGE_EXPORTS.Hint)
    expect(PACKAGE_EXPORTS.Ui.Components).toBe(PACKAGE_EXPORTS.Components)
    expect(PACKAGE_EXPORTS.Ui.Components.Hint).toBe(PACKAGE_EXPORTS.Hint)
    expect(PACKAGE_EXPORTS.Hint).not.toHaveProperty('Root')
    expect(PACKAGE_EXPORTS).not.toHaveProperty('HintRoot')
  })
})
