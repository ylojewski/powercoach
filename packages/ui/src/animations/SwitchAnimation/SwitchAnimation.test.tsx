import { Button as BaseButton } from '@base-ui/react/button'
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import {
  createElement,
  createRef,
  useState,
  type CSSProperties,
  type HTMLAttributes,
  type Key,
  type ReactElement,
  type ReactNode,
  type Ref
} from 'react'
import { afterEach, beforeEach, describe, expect, expectTypeOf, it, vi } from 'vitest'

import {
  type SwitchAnimationCompleteDetails,
  type SwitchAnimationCompletionStatus,
  type SwitchAnimationContentMode,
  type SwitchAnimationDirection,
  type SwitchAnimationReplacementDetails
} from '../..'
import * as PackageExports from '../..'
import { Ex003BaseUiButtonComposition } from './SwitchAnimation.stories'

type SwitchAnimationRenderProps = HTMLAttributes<HTMLElement> & {
  children?: ReactNode
  ref?: Ref<HTMLElement>
}

type SwitchAnimationProps = Omit<HTMLAttributes<HTMLElement>, 'children'> & {
  children: ReactElement
  contentMode?: SwitchAnimationContentMode
  direction?: SwitchAnimationDirection
  onSwitchChange?: (details: SwitchAnimationReplacementDetails) => void
  onSwitchComplete?: (details: SwitchAnimationCompleteDetails) => void
  onSwitchStart?: (details: SwitchAnimationReplacementDetails) => void
  render?:
    | ReactElement
    | ((props: SwitchAnimationRenderProps, state: Record<string, never>) => ReactElement)
  ref?: Ref<HTMLElement>
}

interface SwitchAnimationPackageContract {
  Animations: {
    SwitchAnimation: (props: SwitchAnimationProps) => ReactElement | null
  }
  SwitchAnimation: (props: SwitchAnimationProps) => ReactElement | null
  Ui: {
    Animations: {
      SwitchAnimation: (props: SwitchAnimationProps) => ReactElement | null
    }
  }
}

interface SwitchRect {
  height: number
  left: number
  top: number
  width: number
}

interface SavingButtonLabelProps {
  buttonRef: Ref<HTMLButtonElement>
}

type SwitchTransitionEventName = 'transitioncancel' | 'transitionend'

const PACKAGE_EXPORTS = PackageExports as unknown as SwitchAnimationPackageContract
const SwitchAnimation = PACKAGE_EXPORTS.SwitchAnimation

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)' as const
const SWITCH_DIRECTIONS = ['down', 'up', 'left', 'right'] as const
const CUSTOM_MOTION_STYLE = {
  '--switch-animation-distance': '24px',
  '--switch-animation-duration': '260ms',
  '--switch-animation-easing': 'cubic-bezier(0.4, 0, 0.2, 1)',
  '--switch-animation-stagger': '70ms'
} as const as CSSProperties
const ZERO_MOTION_STYLE = {
  '--switch-animation-distance': '0px',
  '--switch-animation-duration': '0ms',
  '--switch-animation-stagger': '0ms'
} as const as CSSProperties

function setReducedMotionPreference(matches: boolean) {
  const matchMedia = vi.fn((query: string) => {
    return {
      addEventListener: vi.fn(),
      addListener: vi.fn(),
      dispatchEvent: vi.fn(() => true),
      matches: query === REDUCED_MOTION_QUERY ? matches : false,
      media: query,
      onchange: null,
      removeEventListener: vi.fn(),
      removeListener: vi.fn()
    } as MediaQueryList
  })

  vi.stubGlobal('matchMedia', matchMedia)
}

function getSwitchRoot(container: HTMLElement): HTMLElement {
  const root = container.querySelector<HTMLElement>('[data-motion="switch"]')

  expect(root).toBeInTheDocument()

  return root as HTMLElement
}

function getCssVariable(element: HTMLElement, variable: string): string {
  return (
    element.style.getPropertyValue(variable) || getComputedStyle(element).getPropertyValue(variable)
  ).trim()
}

function getOwnedItem(contentRoot: HTMLElement): HTMLElement {
  const item = contentRoot.parentElement

  expect(item).toBeInstanceOf(HTMLElement)

  return item as HTMLElement
}

function getDecorativeOwner(contentRoot: HTMLElement): HTMLElement {
  const owner = contentRoot.closest<HTMLElement>('[aria-hidden="true"]')

  expect(owner).toBeInTheDocument()

  return owner as HTMLElement
}

function createSwitchRect({ height, left, top, width }: SwitchRect): DOMRect {
  return {
    bottom: top + height,
    height,
    left,
    right: left + width,
    toJSON: () => ({}),
    top,
    width,
    x: left,
    y: top
  } as DOMRect
}

function mockStableSwitchRects(rects: Record<string, SwitchRect>) {
  const emptyRect = createSwitchRect({ height: 0, left: 0, top: 0, width: 0 })

  vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function (
    this: HTMLElement
  ) {
    if (this.matches('[data-motion="switch"]')) return emptyRect

    const ownSize = this.getAttribute('data-switch-size')
    const descendantSizes = Array.from(
      this.querySelectorAll<HTMLElement>('[data-switch-size]')
    ).map((element) => element.getAttribute('data-switch-size'))
    const sizeNames = new Set([ownSize, ...descendantSizes].filter((value) => value !== null))

    if (sizeNames.size !== 1) return emptyRect

    const sizeName = Array.from(sizeNames)[0]
    const rect = sizeName === undefined ? undefined : (rects[sizeName] ?? rects.zero)

    return rect === undefined ? emptyRect : createSwitchRect(rect)
  })
}

function createSwitchTransitionEvent(
  eventName: SwitchTransitionEventName,
  propertyName: string
): Event {
  const event = new Event(eventName, { bubbles: true })

  Object.defineProperty(event, 'propertyName', {
    configurable: true,
    value: propertyName
  })

  return event
}

function fireSwitchTransition(
  element: HTMLElement,
  eventName: SwitchTransitionEventName,
  propertyName: string
) {
  fireEvent(element, createSwitchTransitionEvent(eventName, propertyName))
}

function finishItemTransitions(contentRoot: HTMLElement) {
  const item = getOwnedItem(contentRoot)

  fireSwitchTransition(item, 'transitionend', 'opacity')
  fireSwitchTransition(item, 'transitionend', 'transform')
}

function WorkoutDetailsSwitch() {
  const [view, setView] = useState<'summary' | 'details'>('summary')

  return (
    <div>
      <button
        type="button"
        onClick={() => setView((value) => (value === 'summary' ? 'details' : 'summary'))}
      >
        switch content
      </button>

      <p>Before the animated slot.</p>

      <SwitchAnimation>
        {view === 'summary' ? (
          <div key="summary">
            <strong>Strength block</strong>
          </div>
        ) : (
          <section key="details" aria-label="Workout details">
            <h3>Strength block</h3>
            <p>Four movements, three working sets, and two accessory rounds.</p>
          </section>
        )}
      </SwitchAnimation>

      <p>After the animated slot.</p>
      <output>Active key: {view}</output>
    </div>
  )
}

function DirectionSwitches() {
  const [alternate, setAlternate] = useState(false)

  return (
    <div>
      <button type="button" onClick={() => setAlternate((value) => !value)}>
        switch every direction
      </button>

      {SWITCH_DIRECTIONS.map((direction) => (
        <SwitchAnimation
          key={direction}
          contentMode="phrasing"
          direction={direction}
          style={CUSTOM_MOTION_STYLE}
        >
          <span key={alternate ? `${direction}-second` : `${direction}-first`}>
            {direction}: {alternate ? 'second' : 'first'}
          </span>
        </SwitchAnimation>
      ))}
    </div>
  )
}

function SavingButtonLabel({ buttonRef }: SavingButtonLabelProps) {
  const [saving, setSaving] = useState(false)

  return (
    <BaseButton
      ref={buttonRef}
      aria-label="Save workout"
      onClick={() => setSaving((value) => !value)}
      render={
        <SwitchAnimation contentMode="phrasing" render={<button type="button" />}>
          <span key={saving ? 'saving' : 'save'}>{saving ? 'saving…' : 'save workout'}</span>
        </SwitchAnimation>
      }
    />
  )
}

function FocusTransferSwitch() {
  const [view, setView] = useState<'editor' | 'summary'>('editor')
  const [focusProbe, setFocusProbe] = useState('No transferred focus yet')

  return (
    <div>
      <SwitchAnimation>
        {view === 'editor' ? (
          <section
            key="editor"
            tabIndex={-1}
            aria-label="Workout editor"
            onFocus={(event) => {
              if (event.currentTarget === event.target) setFocusProbe('Editor root focused')
            }}
          >
            <h3>Edit workout</h3>
            <button type="button" onClick={() => setView('summary')}>
              show summary
            </button>
          </section>
        ) : (
          <section
            key="summary"
            tabIndex={-1}
            aria-label="Workout summary"
            onFocus={(event) => {
              if (event.currentTarget === event.target) setFocusProbe('Summary root focused')
            }}
          >
            <h3>Workout summary</h3>
            <button type="button" onClick={() => setView('editor')}>
              edit workout
            </button>
          </section>
        )}
      </SwitchAnimation>

      <output>{focusProbe}</output>
    </div>
  )
}

function SwitchLifecycleProbe() {
  const [activeKey, setActiveKey] = useState<'a' | 'b'>('a')
  const [records, setRecords] = useState<string[]>([])

  return (
    <div>
      <button type="button" onClick={() => setActiveKey('a')}>
        show A
      </button>
      <button type="button" onClick={() => setActiveKey('b')}>
        show B
      </button>

      <SwitchAnimation
        style={ZERO_MOTION_STYLE}
        onSwitchChange={(details) =>
          setRecords((current) => [...current, `change:${details.replacementId}`])
        }
        onSwitchStart={(details) =>
          setRecords((current) => [...current, `start:${details.replacementId}`])
        }
        onSwitchComplete={(details) =>
          setRecords((current) => [
            ...current,
            `complete:${details.replacementId}:${details.status}`
          ])
        }
      >
        <div key={activeKey}>Content {activeKey.toUpperCase()}</div>
      </SwitchAnimation>

      <output aria-label="lifecycle records">{records.join('|') || 'none'}</output>
    </div>
  )
}

function ConsumerClippingSwitches() {
  const [alternate, setAlternate] = useState(false)
  const content = alternate ? 'longer incoming label' : 'short label'
  const key = alternate ? 'long' : 'short'

  return (
    <div>
      <button type="button" onClick={() => setAlternate((value) => !value)}>
        switch labels
      </button>

      <p>Visible overflow:</p>
      <SwitchAnimation contentMode="phrasing" direction="right">
        <span key={key}>{content}</span>
      </SwitchAnimation>

      <p>Consumer-owned clipping:</p>
      <span data-testid="outer-clip" style={{ display: 'inline-block', overflow: 'clip' }}>
        <SwitchAnimation contentMode="phrasing" direction="right">
          <span key={key}>{content}</span>
        </SwitchAnimation>
      </span>
    </div>
  )
}

describe('SwitchAnimation', () => {
  beforeEach(() => {
    setReducedMotionPreference(false)
  })

  afterEach(() => {
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
  })

  it('UC-001 - renders the initial keyed element in its present state without a lifecycle', () => {
    const onSwitchChange = vi.fn()
    const onSwitchComplete = vi.fn()
    const onSwitchStart = vi.fn()
    const { container } = render(
      <SwitchAnimation
        onSwitchChange={onSwitchChange}
        onSwitchComplete={onSwitchComplete}
        onSwitchStart={onSwitchStart}
      >
        <button key="ready" type="button">
          ready
        </button>
      </SwitchAnimation>
    )

    const root = getSwitchRoot(container)
    const activeButton = screen.getByRole('button', { name: 'ready' })

    expect(root).toHaveAttribute('data-content-mode', 'flow')
    expect(root).toHaveAttribute('data-direction', 'down')
    expect(root).not.toHaveAttribute('role')
    expect(activeButton).not.toHaveAttribute('aria-hidden')
    expect(getOwnedItem(activeButton).closest('[aria-hidden="true"]')).toBeNull()
    expect(onSwitchChange).not.toHaveBeenCalled()
    expect(onSwitchStart).not.toHaveBeenCalled()
    expect(onSwitchComplete).not.toHaveBeenCalled()
  })

  it('UC-001 / UC-009 - treats only a key change as a replacement trigger', () => {
    const onSwitchChange = vi.fn()
    const onSwitchComplete = vi.fn()
    const onSwitchStart = vi.fn()
    const { rerender } = render(
      <SwitchAnimation
        direction="down"
        onSwitchChange={onSwitchChange}
        onSwitchComplete={onSwitchComplete}
        onSwitchStart={onSwitchStart}
      >
        <span key="same">first content</span>
      </SwitchAnimation>
    )

    rerender(
      <SwitchAnimation
        direction="left"
        style={CUSTOM_MOTION_STYLE}
        onSwitchChange={onSwitchChange}
        onSwitchComplete={onSwitchComplete}
        onSwitchStart={onSwitchStart}
      >
        <span key="same">updated content</span>
      </SwitchAnimation>
    )

    expect(screen.getByText('updated content')).toBeInTheDocument()
    expect(screen.queryByText('first content')).not.toBeInTheDocument()
    expect(onSwitchChange).not.toHaveBeenCalled()
    expect(onSwitchStart).not.toHaveBeenCalled()
    expect(onSwitchComplete).not.toHaveBeenCalled()
  })

  it('UC-002 / UC-003 / EX-001 - replaces flow content while retaining a decorative outgoing subtree', () => {
    const { container } = render(<WorkoutDetailsSwitch />)
    const summary = screen.getByText('Strength block').closest('div')

    expect(summary).toBeInTheDocument()
    expect(screen.getByText('Active key: summary')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'switch content' }))

    const details = screen.getByRole('region', { name: 'Workout details' })
    const decorativeOwner = getDecorativeOwner(summary as HTMLElement)

    expect(details).toHaveTextContent(
      'Four movements, three working sets, and two accessory rounds.'
    )
    expect(summary).toBeInTheDocument()
    expect(decorativeOwner).toHaveAttribute('inert')
    expect(screen.getByText('Active key: details')).toBeInTheDocument()
    expect(screen.getByText('Before the animated slot.')).toBeInTheDocument()
    expect(screen.getByText('After the animated slot.')).toBeInTheDocument()
    expect(getSwitchRoot(container)).toContainElement(details)
  })

  it('UC-002 / UC-008 / CR-012 - keeps the outgoing subtree connected until its leaving work is terminal', async () => {
    const connectionRecords: string[] = []
    const connectionProbeTag = 'switch-animation-connection-probe'

    customElements.define(
      connectionProbeTag,
      class extends HTMLElement {
        connectedCallback() {
          connectionRecords.push('connected')
        }

        disconnectedCallback() {
          connectionRecords.push('disconnected')
        }
      }
    )

    const onSwitchComplete = vi.fn()
    const { rerender } = render(
      <SwitchAnimation onSwitchComplete={onSwitchComplete}>
        <section key="outgoing" aria-label="Connected outgoing content">
          {createElement(connectionProbeTag, null, 'connection probe')}
        </section>
      </SwitchAnimation>
    )

    const outgoingContent = screen.getByRole('region', { name: 'Connected outgoing content' })
    const connectionProbe = screen.getByText('connection probe')

    expect(connectionProbe.tagName.toLowerCase()).toBe(connectionProbeTag)
    expect(connectionProbe.isConnected).toBe(true)
    expect(connectionRecords).toEqual(['connected'])

    rerender(
      <SwitchAnimation onSwitchComplete={onSwitchComplete}>
        <section key="incoming" aria-label="Connected incoming content">
          incoming content
        </section>
      </SwitchAnimation>
    )

    const incomingContent = screen.getByRole('region', { name: 'Connected incoming content' })

    expect(connectionProbe.isConnected).toBe(true)
    expect(connectionRecords).toEqual(['connected'])

    act(() => {
      finishItemTransitions(outgoingContent)
      finishItemTransitions(incomingContent)
    })

    await waitFor(() => expect(onSwitchComplete).toHaveBeenCalledOnce())

    expect(connectionProbe.isConnected).toBe(false)
    expect(connectionRecords).toEqual(['connected', 'disconnected'])
  })

  it('UC-003 - exposes the measured outgoing and incoming root-size endpoints to lifecycle observers', async () => {
    mockStableSwitchRects({
      details: { height: 96, left: 12, top: 18, width: 240 },
      summary: { height: 40, left: 12, top: 18, width: 120 },
      zero: { height: 0, left: 0, top: 0, width: 0 }
    })

    const snapshots: string[] = []
    const rootRef = createRef<HTMLElement>()
    const { rerender } = render(
      <SwitchAnimation
        ref={rootRef}
        onSwitchChange={() => {
          snapshots.push(`change:${rootRef.current?.style.width}:${rootRef.current?.style.height}`)
        }}
        onSwitchStart={() => {
          snapshots.push(`start:${rootRef.current?.style.width}:${rootRef.current?.style.height}`)
        }}
      >
        <div key="summary" data-switch-size="summary">
          summary
        </div>
      </SwitchAnimation>
    )

    rerender(
      <SwitchAnimation
        ref={rootRef}
        onSwitchChange={() => {
          snapshots.push(`change:${rootRef.current?.style.width}:${rootRef.current?.style.height}`)
        }}
        onSwitchStart={() => {
          snapshots.push(`start:${rootRef.current?.style.width}:${rootRef.current?.style.height}`)
        }}
      >
        <section key="details" data-switch-size="details">
          details
        </section>
      </SwitchAnimation>
    )

    await waitFor(() => expect(snapshots).toHaveLength(2))

    const root = rootRef.current as HTMLElement
    const transitionProperties = getComputedStyle(root)
      .transitionProperty.split(',')
      .map((property) => property.trim())

    expect(snapshots).toEqual(['change:120px:40px', 'start:240px:96px'])
    expect(transitionProperties).toEqual(expect.arrayContaining(['width', 'height']))
  })

  it('UC-003 / EX-002 / EX-006 / QA-002 - preserves each item stable box during slot interpolation', () => {
    mockStableSwitchRects({
      first: { height: 24, left: 8, top: 12, width: 80 },
      second: { height: 24, left: 8, top: 12, width: 110 },
      zero: { height: 0, left: 0, top: 0, width: 0 }
    })

    const { rerender } = render(
      <SwitchAnimation contentMode="phrasing">
        <span key="first" data-switch-size="first">
          short label
        </span>
      </SwitchAnimation>
    )
    const outgoingContent = screen.getByText('short label')

    rerender(
      <SwitchAnimation contentMode="phrasing">
        <span key="second" data-switch-size="second">
          longer incoming label
        </span>
      </SwitchAnimation>
    )

    const incomingContent = screen.getByText('longer incoming label')
    const outgoingItem = getOwnedItem(outgoingContent)
    const incomingItem = getOwnedItem(incomingContent)
    const root = incomingContent.closest<HTMLElement>('[data-motion="switch"]')

    expect(outgoingItem).toHaveStyle({ height: '24px', width: '80px' })
    expect(incomingItem).toHaveStyle({ height: '24px', width: '110px' })
    expect(root).toHaveStyle({ height: '24px', width: '110px' })
  })

  it('UC-004 - selects div or span roots and owned boxes for the requested content model', () => {
    const { container } = render(
      <div>
        <SwitchAnimation>
          <section key="flow">Flow content</section>
        </SwitchAnimation>
        <SwitchAnimation contentMode="phrasing">
          <strong key="phrasing">Phrasing content</strong>
        </SwitchAnimation>
      </div>
    )

    const roots = container.querySelectorAll<HTMLElement>('[data-motion="switch"]')
    const flowContent = screen.getByText('Flow content')
    const phrasingContent = screen.getByText('Phrasing content')

    expect(roots).toHaveLength(2)
    expect(roots[0]?.tagName).toBe('DIV')
    expect(roots[0]).toHaveAttribute('data-content-mode', 'flow')
    expect(getOwnedItem(flowContent).tagName).toBe('DIV')
    expect(getOwnedItem(flowContent).parentElement?.tagName).toBe('DIV')
    expect(getOwnedItem(flowContent).parentElement?.parentElement).toBe(roots[0])
    expect(roots[1]?.tagName).toBe('SPAN')
    expect(roots[1]).toHaveAttribute('data-content-mode', 'phrasing')
    expect(getOwnedItem(phrasingContent).tagName).toBe('SPAN')
    expect(getOwnedItem(phrasingContent).parentElement?.tagName).toBe('SPAN')
    expect(getOwnedItem(phrasingContent).parentElement?.parentElement).toBe(roots[1])
  })

  it('UC-005 - composes an element root with consumer props, events, style, and a merged external ref', () => {
    const rootRef = createRef<HTMLElement>()
    const onClick = vi.fn()
    const { container } = render(
      <SwitchAnimation
        ref={rootRef}
        aria-label="Composed switch"
        className="consumer-class"
        data-consumer="preserved"
        onClick={onClick}
        render={<article />}
        style={{ color: 'rgb(1, 2, 3)' }}
      >
        <section key="content">Owned content</section>
      </SwitchAnimation>
    )

    const root = getSwitchRoot(container)

    expect(root.tagName).toBe('ARTICLE')
    expect(root).toHaveAttribute('aria-label', 'Composed switch')
    expect(root).toHaveAttribute('data-consumer', 'preserved')
    expect(root).toHaveClass('consumer-class')
    expect(root).toHaveStyle({ color: 'rgb(1, 2, 3)' })
    expect(rootRef.current).toBe(root)
    expect(screen.getAllByText('Owned content')).toHaveLength(1)

    fireEvent.click(root)

    expect(onClick).toHaveBeenCalledOnce()
  })

  it('UC-005 - gives render callbacks empty state and preserves the owned subtree exactly once', () => {
    const renderRoot = vi.fn((props: SwitchAnimationRenderProps, state: Record<string, never>) => (
      <section {...props} data-state-keys={Object.keys(state).join(',')} />
    ))
    const { container } = render(
      <SwitchAnimation render={renderRoot}>
        <div key="content">Callback-owned content</div>
      </SwitchAnimation>
    )

    const root = getSwitchRoot(container)
    const renderState = renderRoot.mock.calls.at(-1)?.[1]

    expect(root.tagName).toBe('SECTION')
    expect(root).toHaveAttribute('data-state-keys', '')
    expect(renderState).toEqual({})
    expect(screen.getAllByText('Callback-owned content')).toHaveLength(1)
  })

  it('UC-001 / UC-004 / UC-005 / UC-007 / EX-003 - composes as one native Base UI Button root', () => {
    const buttonRef = createRef<HTMLButtonElement>()

    render(<SavingButtonLabel buttonRef={buttonRef} />)

    const button = screen.getByRole('button', { name: 'Save workout' })

    button.focus()
    fireEvent.click(button)

    expect(screen.getAllByRole('button', { name: 'Save workout' })).toHaveLength(1)
    expect(screen.getByText('saving…')).toBeInTheDocument()
    expect(buttonRef.current).toBe(button)
    expect(button).toHaveFocus()
    expect(button).toHaveAttribute('data-motion', 'switch')
    expect(button).toHaveAttribute('data-content-mode', 'phrasing')
  })

  it('UC-003 / UC-005 / EX-003 / QA-003 - measures and cleans up the complete composed button border box', async () => {
    const emptyRect = createSwitchRect({ height: 0, left: 0, top: 0, width: 0 })
    const labelRects: Record<string, SwitchRect> = {
      save: { height: 20, left: 17, top: 9, width: 86 },
      saving: { height: 20, left: 17, top: 9, width: 50 }
    }
    const rootRects: Record<string, SwitchRect> = {
      save: { height: 38, left: 0, top: 0, width: 120 },
      saving: { height: 38, left: 0, top: 0, width: 84 }
    }

    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function (
      this: HTMLElement
    ) {
      const ownSize = this.getAttribute('data-composed-size')
      const descendantSizes = Array.from(
        this.querySelectorAll<HTMLElement>('[data-composed-size]')
      ).map((element) => element.getAttribute('data-composed-size'))

      if (this.matches('[data-motion="switch"]')) {
        const activeSize = descendantSizes.at(-1) ?? ownSize
        const rect = activeSize === null ? undefined : rootRects[activeSize]

        return rect === undefined ? emptyRect : createSwitchRect(rect)
      }

      const sizeNames = new Set(
        [ownSize, ...descendantSizes].filter((value): value is string => value !== null)
      )

      if (sizeNames.size !== 1) return emptyRect

      const sizeName = Array.from(sizeNames)[0]
      const rect = sizeName === undefined ? undefined : labelRects[sizeName]

      return rect === undefined ? emptyRect : createSwitchRect(rect)
    })

    const buttonRef = createRef<HTMLButtonElement>()
    const onSwitchComplete = vi.fn()
    const snapshots: string[] = []
    const { rerender } = render(
      <BaseButton
        ref={buttonRef}
        aria-label="Save workout"
        className="border px-4 py-2"
        render={
          <SwitchAnimation
            contentMode="phrasing"
            onSwitchChange={() => {
              snapshots.push(
                `change:${buttonRef.current?.style.width}:${buttonRef.current?.style.height}`
              )
            }}
            onSwitchComplete={onSwitchComplete}
            onSwitchStart={() => {
              snapshots.push(
                `start:${buttonRef.current?.style.width}:${buttonRef.current?.style.height}`
              )
            }}
            render={<button type="button" />}
          >
            <span key="save" data-composed-size="save">
              save workout
            </span>
          </SwitchAnimation>
        }
      />
    )
    const outgoingContent = screen.getByText('save workout')

    rerender(
      <BaseButton
        ref={buttonRef}
        aria-label="Save workout"
        className="border px-4 py-2"
        render={
          <SwitchAnimation
            contentMode="phrasing"
            onSwitchChange={() => {
              snapshots.push(
                `change:${buttonRef.current?.style.width}:${buttonRef.current?.style.height}`
              )
            }}
            onSwitchComplete={onSwitchComplete}
            onSwitchStart={() => {
              snapshots.push(
                `start:${buttonRef.current?.style.width}:${buttonRef.current?.style.height}`
              )
            }}
            render={<button type="button" />}
          >
            <span key="saving" data-composed-size="saving">
              saving…
            </span>
          </SwitchAnimation>
        }
      />
    )

    const incomingContent = screen.getByText('saving…')
    const button = buttonRef.current as HTMLButtonElement

    await waitFor(() => expect(snapshots).toHaveLength(2))

    expect(button.tagName).toBe('BUTTON')
    expect(snapshots).toEqual(['change:120px:38px', 'start:84px:38px'])

    act(() => {
      finishItemTransitions(outgoingContent)
      finishItemTransitions(incomingContent)
      fireSwitchTransition(button, 'transitionend', 'width')
    })

    await waitFor(() => expect(onSwitchComplete).toHaveBeenCalledOnce())

    expect(button.style.width).toBe('')
    expect(button.style.height).toBe('')
    expect(button.getBoundingClientRect()).toEqual(
      expect.objectContaining({ height: 38, width: 84 })
    )
    expect(buttonRef.current).toBe(button)
  })

  it('UC-003 / UC-005 / EX-003 / QA-003 - preserves equal composed button widths imposed by external layout', async () => {
    const emptyRect = createSwitchRect({ height: 0, left: 0, top: 0, width: 0 })
    const labelRects: Record<string, SwitchRect> = {
      save: { height: 20, left: 17, top: 9, width: 86 },
      saving: { height: 20, left: 17, top: 9, width: 50 }
    }
    const stableRootRect = createSwitchRect({ height: 38, left: 0, top: 0, width: 150 })
    const intrinsicMeasurementRect = createSwitchRect({
      height: 38,
      left: 0,
      top: 0,
      width: 138
    })

    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function (
      this: HTMLElement
    ) {
      const ownSize = this.getAttribute('data-layout-size')
      const descendantSizes = Array.from(
        this.querySelectorAll<HTMLElement>('[data-layout-size]')
      ).map((element) => element.getAttribute('data-layout-size'))

      if (this.matches('[data-motion="switch"]')) {
        const inlineHeight = Number.parseFloat(this.style.height)
        const inlineWidth = Number.parseFloat(this.style.width)

        if (Number.isFinite(inlineHeight) && Number.isFinite(inlineWidth)) {
          return createSwitchRect({
            height: inlineHeight,
            left: 0,
            top: 0,
            width: inlineWidth
          })
        }

        return descendantSizes.length > 1 ? intrinsicMeasurementRect : stableRootRect
      }

      const sizeNames = new Set(
        [ownSize, ...descendantSizes].filter((value): value is string => value !== null)
      )

      if (sizeNames.size !== 1) return emptyRect

      const sizeName = Array.from(sizeNames)[0]
      const rect = sizeName === undefined ? undefined : labelRects[sizeName]

      return rect === undefined ? emptyRect : createSwitchRect(rect)
    })

    const buttonRef = createRef<HTMLButtonElement>()
    const onSwitchComplete = vi.fn()
    const snapshots: string[] = []
    const { rerender } = render(
      <div style={{ display: 'grid', width: 'fit-content' }}>
        <BaseButton
          ref={buttonRef}
          aria-label="Save workout"
          className="border px-4 py-2"
          render={
            <SwitchAnimation
              contentMode="phrasing"
              onSwitchChange={() => {
                snapshots.push(
                  `change:${buttonRef.current?.style.width}:${buttonRef.current?.style.height}`
                )
              }}
              onSwitchComplete={onSwitchComplete}
              onSwitchStart={() => {
                snapshots.push(
                  `start:${buttonRef.current?.style.width}:${buttonRef.current?.style.height}`
                )
              }}
              render={<button type="button" />}
            >
              <span key="save" data-layout-size="save">
                save workout
              </span>
            </SwitchAnimation>
          }
        />
        <output>Merged ref target: BUTTON</output>
      </div>
    )
    const outgoingContent = screen.getByText('save workout')
    const button = buttonRef.current as HTMLButtonElement

    expect(button.getBoundingClientRect()).toEqual(
      expect.objectContaining({ height: 38, width: 150 })
    )

    button.focus()

    rerender(
      <div style={{ display: 'grid', width: 'fit-content' }}>
        <BaseButton
          ref={buttonRef}
          aria-label="Save workout"
          className="border px-4 py-2"
          render={
            <SwitchAnimation
              contentMode="phrasing"
              onSwitchChange={() => {
                snapshots.push(
                  `change:${buttonRef.current?.style.width}:${buttonRef.current?.style.height}`
                )
              }}
              onSwitchComplete={onSwitchComplete}
              onSwitchStart={() => {
                snapshots.push(
                  `start:${buttonRef.current?.style.width}:${buttonRef.current?.style.height}`
                )
              }}
              render={<button type="button" />}
            >
              <span key="saving" data-layout-size="saving">
                saving…
              </span>
            </SwitchAnimation>
          }
        />
        <output>Merged ref target: BUTTON</output>
      </div>
    )

    const incomingContent = screen.getByText('saving…')

    await waitFor(() => expect(snapshots).toHaveLength(2))

    expect(snapshots).toEqual(['change:150px:38px', 'start:150px:38px'])
    expect(button).toHaveFocus()

    act(() => {
      finishItemTransitions(outgoingContent)
      finishItemTransitions(incomingContent)
      fireSwitchTransition(button, 'transitionend', 'width')
    })

    await waitFor(() => expect(onSwitchComplete).toHaveBeenCalledOnce())

    expect(button.style.width).toBe('')
    expect(button.style.height).toBe('')
    expect(button.getBoundingClientRect()).toEqual(
      expect.objectContaining({ height: 38, width: 150 })
    )
    expect(buttonRef.current).toBe(button)
  })

  it('UC-003 / UC-005 / EX-003 / CR-010 - reaches a smaller externally constrained composed root without a terminal jump', async () => {
    const emptyRect = createSwitchRect({ height: 0, left: 0, top: 0, width: 0 })
    const labelRects: Record<string, SwitchRect> = {
      long: { height: 20, left: 17, top: 9, width: 86 },
      short: { height: 20, left: 17, top: 9, width: 50 }
    }
    const stableRootRects: Record<string, SwitchRect> = {
      long: { height: 38, left: 0, top: 0, width: 150 },
      short: { height: 38, left: 0, top: 0, width: 120 }
    }

    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function (
      this: HTMLElement
    ) {
      const ownSize = this.getAttribute('data-constrained-size')
      const descendantSizes = Array.from(
        this.querySelectorAll<HTMLElement>('[data-constrained-size]')
      ).map((element) => element.getAttribute('data-constrained-size'))

      if (this.matches('[data-motion="switch"]')) {
        const inlineHeight = Number.parseFloat(this.style.height)
        const inlineWidth = Number.parseFloat(this.style.width)

        if (Number.isFinite(inlineHeight) && Number.isFinite(inlineWidth)) {
          return createSwitchRect({
            height: inlineHeight,
            left: 0,
            top: 0,
            width: inlineWidth
          })
        }

        const activeSize = descendantSizes.at(-1)
        const rect =
          activeSize === null || activeSize === undefined ? undefined : stableRootRects[activeSize]

        return rect === undefined ? emptyRect : createSwitchRect(rect)
      }

      const sizeNames = new Set(
        [ownSize, ...descendantSizes].filter((value): value is string => value !== null)
      )

      if (sizeNames.size !== 1) return emptyRect

      const sizeName = Array.from(sizeNames)[0]
      const rect = sizeName === undefined ? undefined : labelRects[sizeName]

      return rect === undefined ? emptyRect : createSwitchRect(rect)
    })

    const buttonRef = createRef<HTMLButtonElement>()
    const completionSnapshots: string[] = []
    const snapshots: string[] = []
    const { rerender } = render(
      <div style={{ display: 'grid', width: 'fit-content' }}>
        <BaseButton
          ref={buttonRef}
          aria-label="Constrained workout action"
          className="border px-4 py-2"
          render={
            <SwitchAnimation
              contentMode="phrasing"
              onSwitchChange={() => {
                snapshots.push(
                  `change:${buttonRef.current?.style.width}:${buttonRef.current?.style.height}`
                )
              }}
              onSwitchComplete={() => {
                completionSnapshots.push(
                  `complete:${buttonRef.current?.style.width || 'auto'}:${buttonRef.current?.getBoundingClientRect().width}`
                )
              }}
              onSwitchStart={() => {
                snapshots.push(
                  `start:${buttonRef.current?.style.width}:${buttonRef.current?.style.height}`
                )
              }}
              render={<button type="button" />}
            >
              <span key="long" data-constrained-size="long">
                longer action
              </span>
            </SwitchAnimation>
          }
        />
        <output>External minimum width</output>
      </div>
    )
    const outgoingContent = screen.getByText('longer action')
    const button = buttonRef.current as HTMLButtonElement

    expect(button.getBoundingClientRect()).toEqual(
      expect.objectContaining({ height: 38, width: 150 })
    )

    rerender(
      <div style={{ display: 'grid', width: 'fit-content' }}>
        <BaseButton
          ref={buttonRef}
          aria-label="Constrained workout action"
          className="border px-4 py-2"
          render={
            <SwitchAnimation
              contentMode="phrasing"
              onSwitchChange={() => {
                snapshots.push(
                  `change:${buttonRef.current?.style.width}:${buttonRef.current?.style.height}`
                )
              }}
              onSwitchComplete={() => {
                completionSnapshots.push(
                  `complete:${buttonRef.current?.style.width || 'auto'}:${buttonRef.current?.getBoundingClientRect().width}`
                )
              }}
              onSwitchStart={() => {
                snapshots.push(
                  `start:${buttonRef.current?.style.width}:${buttonRef.current?.style.height}`
                )
              }}
              render={<button type="button" />}
            >
              <span key="short" data-constrained-size="short">
                short action
              </span>
            </SwitchAnimation>
          }
        />
        <output>External minimum width</output>
      </div>
    )

    const incomingContent = screen.getByText('short action')

    await waitFor(() => expect(snapshots).toHaveLength(2))

    expect(snapshots).toEqual(['change:150px:38px', 'start:120px:38px'])

    act(() => {
      finishItemTransitions(outgoingContent)
      finishItemTransitions(incomingContent)
      fireSwitchTransition(button, 'transitionend', 'width')
    })

    await waitFor(() => expect(completionSnapshots).toEqual(['complete:auto:120']))

    expect(button.style.width).toBe('')
    expect(button.style.height).toBe('')
    expect(button.getBoundingClientRect()).toEqual(
      expect.objectContaining({ height: 38, width: 120 })
    )
    expect(buttonRef.current).toBe(button)
  })

  it('UC-005 / EX-003 / QA-004 - exposes the composed root ref target in the story probe', async () => {
    const Story = Ex003BaseUiButtonComposition.render

    render(<Story />)

    const button = screen.getByRole('button', { name: 'Save workout' })
    const probe = await screen.findByRole('status', { name: 'Merged ref target' })

    expect(button.tagName).toBe('BUTTON')
    expect(probe).toHaveTextContent('Merged ref target: BUTTON')
  })

  it('UC-006 - exposes the documented default direction and motion variables', () => {
    const { container } = render(
      <SwitchAnimation>
        <div key="default">default motion</div>
      </SwitchAnimation>
    )

    const root = getSwitchRoot(container)

    expect(root).toHaveAttribute('data-direction', 'down')
    expect(getCssVariable(root, '--switch-animation-duration')).toBe('200ms')
    expect(getCssVariable(root, '--switch-animation-easing')).toBe('ease-in-out')
    expect(getCssVariable(root, '--switch-animation-stagger')).toBe('50ms')
    expect(getCssVariable(root, '--switch-animation-distance')).toBe('15px')
  })

  it('UC-002 / UC-006 / EX-002 - supports four physical directions and consumer motion variables', () => {
    const { container } = render(<DirectionSwitches />)

    fireEvent.click(screen.getByRole('button', { name: 'switch every direction' }))

    const roots = container.querySelectorAll<HTMLElement>('[data-motion="switch"]')

    expect(roots).toHaveLength(SWITCH_DIRECTIONS.length)

    for (const direction of SWITCH_DIRECTIONS) {
      const activeLabel = screen.getByText(`${direction}: second`)
      const leavingLabel = screen.getByText(`${direction}: first`)
      const root = activeLabel.closest<HTMLElement>('[data-motion="switch"]')

      expect(root).toHaveAttribute('data-direction', direction)
      expect(root).toHaveAttribute('data-content-mode', 'phrasing')
      expect(getCssVariable(root as HTMLElement, '--switch-animation-duration')).toBe('260ms')
      expect(getCssVariable(root as HTMLElement, '--switch-animation-easing')).toBe(
        'cubic-bezier(0.4, 0, 0.2, 1)'
      )
      expect(getCssVariable(root as HTMLElement, '--switch-animation-stagger')).toBe('70ms')
      expect(getCssVariable(root as HTMLElement, '--switch-animation-distance')).toBe('24px')
      expect(getDecorativeOwner(leavingLabel)).toHaveAttribute('inert')
      expect(activeLabel.closest('[aria-hidden="true"]')).toBeNull()
    }
  })

  it('UC-002 / UC-006 / CR-001 - uses className motion variables for a keyed replacement', async () => {
    const onSwitchComplete = vi.fn()
    const { container, rerender } = render(
      <>
        <style>
          {`
            .class-variable-switch {
              --switch-animation-duration: 0ms;
              --switch-animation-stagger: 0ms;
            }
          `}
        </style>
        <SwitchAnimation className="class-variable-switch" onSwitchComplete={onSwitchComplete}>
          <span key="first">class-controlled first</span>
        </SwitchAnimation>
      </>
    )

    const root = getSwitchRoot(container)
    const outgoingContent = screen.getByText('class-controlled first')

    expect(root).toHaveClass('class-variable-switch')
    expect(getCssVariable(root, '--switch-animation-duration')).toBe('0ms')
    expect(getCssVariable(root, '--switch-animation-stagger')).toBe('0ms')

    rerender(
      <>
        <style>
          {`
            .class-variable-switch {
              --switch-animation-duration: 0ms;
              --switch-animation-stagger: 0ms;
            }
          `}
        </style>
        <SwitchAnimation className="class-variable-switch" onSwitchComplete={onSwitchComplete}>
          <span key="second">class-controlled second</span>
        </SwitchAnimation>
      </>
    )

    await waitFor(() => expect(onSwitchComplete).toHaveBeenCalledOnce())

    expect(screen.getByText('class-controlled second')).toBeInTheDocument()
    expect(outgoingContent).not.toBeInTheDocument()
    expect(onSwitchComplete).toHaveBeenCalledWith(
      expect.objectContaining({ nextKey: 'second', previousKey: 'first', status: 'finished' })
    )
  })

  it('UC-002 / UC-007 / EX-004 - transfers descendant focus without scrolling before making the outgoing subtree decorative', async () => {
    const focusSpy = vi.spyOn(HTMLElement.prototype, 'focus')

    render(<FocusTransferSwitch />)

    const outgoingRoot = screen.getByRole('region', { name: 'Workout editor' })
    const outgoingAction = screen.getByRole('button', { name: 'show summary' })

    outgoingAction.focus()
    fireEvent.click(outgoingAction)

    const incomingRoot = screen.getByRole('region', { name: 'Workout summary' })
    const decorativeOwner = getDecorativeOwner(outgoingRoot)

    await waitFor(() => expect(incomingRoot).toHaveFocus())

    expect(focusSpy).toHaveBeenCalledWith({ preventScroll: true })
    expect(screen.getByText('Summary root focused')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'show summary' })).not.toBeInTheDocument()
    expect(decorativeOwner).toHaveAttribute('aria-hidden', 'true')
    expect(decorativeOwner).toHaveAttribute('inert')
    expect(
      decorativeOwner.style.pointerEvents || getComputedStyle(decorativeOwner).pointerEvents
    ).toBe('none')
    expect(screen.getByRole('button', { name: 'edit workout' })).toBeEnabled()
  })

  it('UC-008 - retains every unfinished leaving subtree across rapid replacements', () => {
    const onSwitchChange = vi.fn()
    const onSwitchStart = vi.fn()
    const { rerender } = render(
      <SwitchAnimation onSwitchChange={onSwitchChange} onSwitchStart={onSwitchStart}>
        <section key="a" aria-label="Content A">
          Content A
        </section>
      </SwitchAnimation>
    )

    const contentA = screen.getByRole('region', { name: 'Content A' })

    rerender(
      <SwitchAnimation onSwitchChange={onSwitchChange} onSwitchStart={onSwitchStart}>
        <section key="b" aria-label="Content B">
          Content B
        </section>
      </SwitchAnimation>
    )

    const contentB = screen.getByRole('region', { name: 'Content B' })

    rerender(
      <SwitchAnimation onSwitchChange={onSwitchChange} onSwitchStart={onSwitchStart}>
        <section key="c" aria-label="Content C">
          Content C
        </section>
      </SwitchAnimation>
    )

    const contentC = screen.getByRole('region', { name: 'Content C' })

    expect(contentA).toBeInTheDocument()
    expect(contentB).toBeInTheDocument()
    expect(contentC).toBeInTheDocument()
    expect(getDecorativeOwner(contentA)).toHaveAttribute('inert')
    expect(getDecorativeOwner(contentB)).toHaveAttribute('inert')
    expect(screen.getAllByRole('region')).toEqual([contentC])
    expect(onSwitchChange).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({ nextKey: 'b', previousKey: 'a', replacementId: 1 })
    )
    expect(onSwitchChange).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({ nextKey: 'c', previousKey: 'b', replacementId: 2 })
    )
    expect(onSwitchStart).toHaveBeenCalledTimes(2)
  })

  it('UC-008 / UC-009 - reports interrupted and finished overlapping generations independently', async () => {
    const onSwitchComplete = vi.fn()
    const { rerender } = render(
      <SwitchAnimation onSwitchComplete={onSwitchComplete}>
        <span key="a">generation A</span>
      </SwitchAnimation>
    )

    const contentA = screen.getByText('generation A')

    rerender(
      <SwitchAnimation onSwitchComplete={onSwitchComplete}>
        <span key="b">generation B</span>
      </SwitchAnimation>
    )

    const contentB = screen.getByText('generation B')

    rerender(
      <SwitchAnimation onSwitchComplete={onSwitchComplete}>
        <span key="c">generation C</span>
      </SwitchAnimation>
    )

    const contentC = screen.getByText('generation C')
    const itemB = getOwnedItem(contentB)

    act(() => {
      fireSwitchTransition(itemB, 'transitioncancel', 'opacity')
      fireSwitchTransition(itemB, 'transitioncancel', 'transform')
      finishItemTransitions(contentA)
      finishItemTransitions(contentB)
      finishItemTransitions(contentC)
    })

    await waitFor(() => expect(onSwitchComplete).toHaveBeenCalledTimes(2))

    expect(onSwitchComplete).toHaveBeenCalledWith(
      expect.objectContaining({ replacementId: 1, status: 'interrupted' })
    )
    expect(onSwitchComplete).toHaveBeenCalledWith(
      expect.objectContaining({ replacementId: 2, status: 'finished' })
    )
  })

  it('UC-008 / UC-009 / CR-006 / CR-008 - ignores stale events before generation-owned cancels on a reused item', async () => {
    const onSwitchComplete = vi.fn()
    const { rerender } = render(
      <SwitchAnimation onSwitchComplete={onSwitchComplete}>
        <span key="a">stale generation A</span>
      </SwitchAnimation>
    )

    const contentA = screen.getByText('stale generation A')

    rerender(
      <SwitchAnimation onSwitchComplete={onSwitchComplete}>
        <span key="b">stale generation B</span>
      </SwitchAnimation>
    )

    const contentB = screen.getByText('stale generation B')
    const reusedItem = getOwnedItem(contentB)
    const staleOpacityEnd = createSwitchTransitionEvent('transitionend', 'opacity')
    const staleTransformEnd = createSwitchTransitionEvent('transitionend', 'transform')

    rerender(
      <SwitchAnimation onSwitchComplete={onSwitchComplete}>
        <span key="c">stale generation C</span>
      </SwitchAnimation>
    )

    const contentC = screen.getByText('stale generation C')

    act(() => {
      finishItemTransitions(contentA)
      finishItemTransitions(contentC)
    })

    await waitFor(() =>
      expect(onSwitchComplete).toHaveBeenCalledWith(
        expect.objectContaining({ replacementId: 1, status: 'interrupted' })
      )
    )

    act(() => {
      fireEvent(reusedItem, staleOpacityEnd)
      fireEvent(reusedItem, staleTransformEnd)
    })

    expect(onSwitchComplete).not.toHaveBeenCalledWith(expect.objectContaining({ replacementId: 2 }))

    act(() => {
      fireSwitchTransition(reusedItem, 'transitioncancel', 'opacity')
    })

    expect(onSwitchComplete).not.toHaveBeenCalledWith(expect.objectContaining({ replacementId: 2 }))

    act(() => {
      fireSwitchTransition(reusedItem, 'transitioncancel', 'transform')
    })

    await waitFor(() =>
      expect(onSwitchComplete).toHaveBeenCalledWith(
        expect.objectContaining({ replacementId: 2, status: 'interrupted' })
      )
    )
  })

  it('UC-009 - ignores descendant and unrelated transition events when observing completion', async () => {
    const onSwitchComplete = vi.fn()
    const { rerender } = render(
      <SwitchAnimation onSwitchComplete={onSwitchComplete}>
        <span key="a">old transition content</span>
      </SwitchAnimation>
    )

    const outgoingContent = screen.getByText('old transition content')

    rerender(
      <SwitchAnimation onSwitchComplete={onSwitchComplete}>
        <span key="b">new transition content</span>
      </SwitchAnimation>
    )

    const incomingContent = screen.getByText('new transition content')

    act(() => {
      fireSwitchTransition(outgoingContent, 'transitionend', 'opacity')
      fireSwitchTransition(outgoingContent, 'transitionend', 'transform')
      fireSwitchTransition(incomingContent, 'transitionend', 'opacity')
      fireSwitchTransition(incomingContent, 'transitionend', 'transform')
      fireSwitchTransition(getOwnedItem(outgoingContent), 'transitionend', 'color')
      fireSwitchTransition(getOwnedItem(incomingContent), 'transitionend', 'color')
    })

    expect(onSwitchComplete).not.toHaveBeenCalled()

    act(() => {
      finishItemTransitions(outgoingContent)
      finishItemTransitions(incomingContent)
    })

    await waitFor(() => expect(onSwitchComplete).toHaveBeenCalledOnce())
    expect(onSwitchComplete).toHaveBeenCalledWith(
      expect.objectContaining({ replacementId: 1, status: 'finished' })
    )
  })

  it('UC-009 / EX-005 - exposes ordered lifecycle records with unique IDs for repeated keys', async () => {
    render(<SwitchLifecycleProbe />)

    const records = screen.getByRole('status', { name: 'lifecycle records' })

    fireEvent.click(screen.getByRole('button', { name: 'show B' }))

    await waitFor(() => expect(records).toHaveTextContent('change:1|start:1|complete:1:finished'))

    fireEvent.click(screen.getByRole('button', { name: 'show A' }))

    await waitFor(() =>
      expect(records).toHaveTextContent(
        'change:1|start:1|complete:1:finished|change:2|start:2|complete:2:finished'
      )
    )
  })

  it('UC-010 / EX-005 - preserves focus and lifecycle order while reduced motion settles without transition events', async () => {
    setReducedMotionPreference(true)

    const order: string[] = []
    const onSwitchComplete = vi.fn((details: SwitchAnimationCompleteDetails) => {
      order.push(`complete:${details.replacementId}`)
    })
    const { rerender } = render(
      <SwitchAnimation
        style={CUSTOM_MOTION_STYLE}
        onSwitchChange={(details) => order.push(`change:${details.replacementId}`)}
        onSwitchComplete={onSwitchComplete}
        onSwitchStart={(details) => order.push(`start:${details.replacementId}`)}
      >
        <section key="editor" tabIndex={-1} aria-label="Reduced editor">
          <button type="button">focused action</button>
        </section>
      </SwitchAnimation>
    )

    const outgoingRoot = screen.getByRole('region', { name: 'Reduced editor' })

    screen.getByRole('button', { name: 'focused action' }).focus()

    rerender(
      <SwitchAnimation
        style={CUSTOM_MOTION_STYLE}
        onSwitchChange={(details) => order.push(`change:${details.replacementId}`)}
        onSwitchComplete={onSwitchComplete}
        onSwitchStart={(details) => order.push(`start:${details.replacementId}`)}
      >
        <section key="summary" tabIndex={-1} aria-label="Reduced summary">
          reduced summary
        </section>
      </SwitchAnimation>
    )

    const incomingRoot = screen.getByRole('region', { name: 'Reduced summary' })

    await waitFor(() => expect(onSwitchComplete).toHaveBeenCalledOnce())

    expect(incomingRoot).toHaveFocus()
    expect(outgoingRoot).not.toBeInTheDocument()
    expect(order).toEqual(['change:1', 'start:1', 'complete:1'])
    expect(onSwitchComplete).toHaveBeenCalledWith({
      direction: 'down',
      nextKey: 'summary',
      previousKey: 'editor',
      replacementId: 1,
      status: 'finished'
    })
  })

  it('UC-011 / EX-006 - leaves visible overflow and optional clipping to the consumer', () => {
    const { container } = render(<ConsumerClippingSwitches />)
    const roots = container.querySelectorAll<HTMLElement>('[data-motion="switch"]')
    const outerClip = screen.getByTestId('outer-clip')

    expect(roots).toHaveLength(2)

    for (const root of roots) {
      const computedStyle = getComputedStyle(root)

      expect(root.style.overflow).toBe('')
      expect(root.style.overflowX).toBe('')
      expect(root.style.overflowY).toBe('')
      expect(root.style.overflowClipMargin).toBe('')
      expect(['', 'visible']).toContain(computedStyle.overflow)
      expect(computedStyle.overflow).not.toMatch(/clip|hidden/)
    }

    expect(outerClip).toHaveStyle({ overflow: 'clip' })

    fireEvent.click(screen.getByRole('button', { name: 'switch labels' }))

    expect(screen.getAllByText('longer incoming label')).toHaveLength(2)
    expect(screen.getAllByText('short label')).toHaveLength(2)
  })

  it('UC-011 - preserves deliberate clipping applied to the actual root', () => {
    const { container } = render(
      <SwitchAnimation style={{ overflow: 'hidden' }}>
        <div key="clipped">consumer-clipped content</div>
      </SwitchAnimation>
    )

    expect(getSwitchRoot(container)).toHaveStyle({ overflow: 'hidden' })
  })

  it('EX-001 / EX-002 / EX-003 / EX-004 / EX-005 / EX-006 / CR-004 - exposes the single-part public assemblies and lifecycle types', () => {
    expect(PACKAGE_EXPORTS.SwitchAnimation).toBeTypeOf('function')
    expect(PACKAGE_EXPORTS.Animations.SwitchAnimation).toBe(PACKAGE_EXPORTS.SwitchAnimation)
    expect(PACKAGE_EXPORTS.Ui.Animations.SwitchAnimation).toBe(PACKAGE_EXPORTS.SwitchAnimation)

    if (typeof PACKAGE_EXPORTS.SwitchAnimation === 'function') {
      expect(PACKAGE_EXPORTS.SwitchAnimation).not.toHaveProperty('Root')
    }

    expectTypeOf<SwitchAnimationContentMode>().toEqualTypeOf<'flow' | 'phrasing'>()
    expectTypeOf<SwitchAnimationDirection>().toEqualTypeOf<'down' | 'up' | 'left' | 'right'>()
    expectTypeOf<SwitchAnimationCompletionStatus>().toEqualTypeOf<'finished' | 'interrupted'>()
    expectTypeOf<SwitchAnimationReplacementDetails>().toEqualTypeOf<{
      readonly direction: SwitchAnimationDirection
      readonly nextKey: Key
      readonly previousKey: Key
      readonly replacementId: number
    }>()
    expectTypeOf<SwitchAnimationCompleteDetails>().toEqualTypeOf<{
      readonly direction: SwitchAnimationDirection
      readonly nextKey: Key
      readonly previousKey: Key
      readonly replacementId: number
      readonly status: SwitchAnimationCompletionStatus
    }>()
  })
})
