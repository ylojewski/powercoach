import { DirectionProvider as BaseUiDirectionProvider } from '@base-ui/react/direction-provider'
import { Tabs as BaseUiTabs } from '@base-ui/react/tabs'
import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import {
  createRef,
  forwardRef,
  useState,
  type ComponentPropsWithoutRef,
  type CSSProperties
} from 'react'
import { hydrateRoot } from 'react-dom/client'
import { renderToString } from 'react-dom/server'
import { userEvent } from 'storybook/test'
import { afterEach, describe, expect, expectTypeOf, it, vi } from 'vitest'

import * as PackageExports from '../..'
import {
  Tabs,
  type TabsIndicatorProps,
  type TabsIndicatorState,
  type TabsListProps,
  type TabsListState,
  type TabsPanelMetadata,
  type TabsPanelProps,
  type TabsPanelState,
  type TabsRootChangeEventDetails,
  type TabsRootChangeEventReason,
  type TabsRootOrientation,
  type TabsRootProps,
  type TabsRootState,
  type TabsTabActivationDirection,
  type TabsTabMetadata,
  type TabsTabPosition,
  type TabsTabProps,
  type TabsTabRevealAnimationProps,
  type TabsTabSize,
  type TabsTabState,
  type TabsTabValue
} from '../..'
import { type RevealAnimationProps } from '../../animations'

type TabsValue = string | number | null

interface TabsChangeEventDetails {
  activationDirection: 'left' | 'right' | 'up' | 'down' | 'none'
  allowPropagation: () => void
  cancel: () => void
  event: Event
  isCanceled: boolean
  isPropagationAllowed: boolean
  reason: 'none' | 'disabled' | 'missing' | 'initial'
  trigger: Element | undefined
}

interface TabRect {
  height: number
  left: number
  top?: number
  width: number
}

interface MockPanelAnimationsOptions {
  holdDirectionalAnimations?: boolean
}

const ORIGINAL_GET_ANIMATIONS = HTMLElement.prototype.getAnimations
const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)' as const
const TABS_MOTION_EASING = 'cubic-bezier(0.22,1,0.36,1)' as const

function getRequiredElement<TElement extends Element>(
  element: TElement | null,
  message: string
): TElement {
  if (element === null) {
    throw new Error(message)
  }

  return element
}

function getRevealRoot(tab: HTMLElement): HTMLElement {
  return getRequiredElement(
    tab.closest<HTMLElement>('[data-motion="reveal"]'),
    `Expected ${tab.textContent ?? 'Tab'} to be wrapped in RevealAnimation`
  )
}

function getRevealOverlay(tab: HTMLElement): HTMLElement {
  return getRequiredElement(
    getRevealRoot(tab).querySelector<HTMLElement>('[data-reveal-overlay]'),
    `Expected ${tab.textContent ?? 'Tab'} RevealAnimation overlay`
  )
}

function getRevealOverlaySurface(tab: HTMLElement): HTMLElement {
  return getRequiredElement(
    getRevealRoot(tab).querySelector<HTMLElement>('[data-reveal-overlay-surface]'),
    `Expected ${tab.textContent ?? 'Tab'} decorative surface`
  )
}

function getRevealCopy(tab: HTMLElement): HTMLElement {
  return getRequiredElement(
    getRevealRoot(tab).querySelector<HTMLElement>('[data-reveal-copy]'),
    `Expected ${tab.textContent ?? 'Tab'} decorative copy`
  )
}

function getRevealCopyScale(tab: HTMLElement): HTMLElement {
  return getRequiredElement(
    getRevealRoot(tab).querySelector<HTMLElement>('[data-reveal-copy-scale]'),
    `Expected ${tab.textContent ?? 'Tab'} decorative copy scale`
  )
}

function getCssVariable(element: HTMLElement, variable: string): string {
  return (
    element.style.getPropertyValue(variable) || getComputedStyle(element).getPropertyValue(variable)
  ).trim()
}

function getTransitionEvidence(element: HTMLElement): string {
  const computedStyle = getComputedStyle(element)

  return [
    element.className,
    element.style.transition,
    element.style.transitionProperty,
    element.style.transitionDuration,
    element.style.transitionTimingFunction,
    computedStyle.transition,
    computedStyle.transitionProperty,
    computedStyle.transitionDuration,
    computedStyle.transitionTimingFunction
  ]
    .join(' ')
    .replaceAll(' ', '')
}

function expectTransitionContract(
  element: HTMLElement,
  {
    durations,
    easing,
    excluded = [],
    properties
  }: {
    durations: string[]
    easing: string[]
    excluded?: string[]
    properties: string[]
  }
) {
  const evidence = getTransitionEvidence(element)

  for (const property of properties) {
    expect(evidence).toContain(property)
  }
  for (const duration of durations) {
    expect(evidence).toContain(duration)
  }
  for (const timingFunction of easing) {
    expect(evidence).toContain(timingFunction.replaceAll(' ', ''))
  }
  for (const excludedValue of excluded) {
    expect(evidence).not.toContain(excludedValue)
  }
}

function setReducedMotionPreference(initialMatches: boolean) {
  const changeListeners = new Set<EventListenerOrEventListenerObject>()
  let matches = initialMatches
  const mediaQueryList = {
    addEventListener: vi.fn((eventName: string, listener: EventListenerOrEventListenerObject) => {
      if (eventName === 'change') {
        changeListeners.add(listener)
      }
    }),
    addListener: vi.fn(),
    dispatchEvent: vi.fn(() => true),
    get matches() {
      return matches
    },
    media: REDUCED_MOTION_QUERY,
    onchange: null,
    removeEventListener: vi.fn(
      (eventName: string, listener: EventListenerOrEventListenerObject) => {
        if (eventName === 'change') {
          changeListeners.delete(listener)
        }
      }
    ),
    removeListener: vi.fn()
  } as unknown as MediaQueryList

  vi.stubGlobal(
    'matchMedia',
    vi.fn((query: string) =>
      query === REDUCED_MOTION_QUERY
        ? mediaQueryList
        : ({ ...mediaQueryList, matches: false, media: query } as MediaQueryList)
    )
  )

  return {
    setMatches(nextMatches: boolean) {
      matches = nextMatches
      const event = { matches, media: REDUCED_MOTION_QUERY } as MediaQueryListEvent

      for (const listener of changeListeners) {
        if (typeof listener === 'function') {
          listener(event as unknown as Event)
        } else {
          listener.handleEvent(event as unknown as Event)
        }
      }
    }
  }
}

function expectNoActiveBoundaryTranslateTransition(element: HTMLElement) {
  const computedStyle = getComputedStyle(element)
  const inlineTransition = [element.style.transition, element.style.transitionProperty]
    .join(' ')
    .replaceAll(' ', '')
  const computedTransition = [
    computedStyle.transition,
    computedStyle.transitionProperty,
    computedStyle.transitionDuration
  ]
    .join(' ')
    .replaceAll(' ', '')
  const hasComputedTransition =
    computedStyle.transitionDuration !== '' &&
    !computedStyle.transitionDuration.split(',').every((duration) => duration.trim() === '0s')

  if (inlineTransition !== '') {
    expect(inlineTransition).not.toContain('translate')
  } else if (hasComputedTransition) {
    expect(computedTransition).not.toContain('translate')
  } else {
    const unguardedTransitionClasses = element.className
      .split(/\s+/)
      .filter(
        (className) => className.includes('transition') && !className.startsWith('motion-safe:')
      )
      .join('')

    expect(unguardedTransitionClasses).not.toContain('translate')
  }
}

function runPrehydrationScript(container: HTMLElement): HTMLScriptElement {
  const script = getRequiredElement(
    container.querySelector<HTMLScriptElement>('script'),
    'Expected renderBeforeHydration to emit its pre-hydration script'
  )
  const currentScriptSpy = vi.spyOn(document, 'currentScript', 'get').mockReturnValue(script)

  try {
    globalThis.eval(script.textContent ?? '')
  } finally {
    currentScriptSpy.mockRestore()
  }

  return script
}

function expectCompleteIndicatorGeometry(
  indicator: HTMLElement,
  {
    bottom,
    height,
    leadingBorderOffset,
    left,
    right,
    top,
    width
  }: {
    bottom: string
    height: string
    leadingBorderOffset: string
    left: string
    right: string
    top: string
    width: string
  }
) {
  expect(getCssVariable(indicator, '--active-tab-left')).toBe(left)
  expect(getCssVariable(indicator, '--active-tab-right')).toBe(right)
  expect(getCssVariable(indicator, '--active-tab-top')).toBe(top)
  expect(getCssVariable(indicator, '--active-tab-bottom')).toBe(bottom)
  expect(getCssVariable(indicator, '--active-tab-width')).toBe(width)
  expect(getCssVariable(indicator, '--active-tab-height')).toBe(height)
  expect(getCssVariable(indicator, '--tabs-active-leading-border-offset')).toBe(leadingBorderOffset)
}

function createTabRect({ height, left, top = 0, width }: TabRect): DOMRect {
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

function mockTabRects(rectsByTestId: Record<string, TabRect>) {
  vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function (
    this: HTMLElement
  ) {
    const testId = this.getAttribute('data-testid')

    return createTabRect(rectsByTestId[testId ?? ''] ?? { height: 0, left: 0, width: 0 })
  })
  vi.spyOn(HTMLElement.prototype, 'offsetHeight', 'get').mockImplementation(function (
    this: HTMLElement
  ) {
    return rectsByTestId[this.getAttribute('data-testid') ?? '']?.height ?? 0
  })
  vi.spyOn(HTMLElement.prototype, 'offsetWidth', 'get').mockImplementation(function (
    this: HTMLElement
  ) {
    return rectsByTestId[this.getAttribute('data-testid') ?? '']?.width ?? 0
  })
}

function mockPanelAnimations({
  holdDirectionalAnimations = false
}: MockPanelAnimationsOptions = {}) {
  const finishers = new Map<string, () => void>()

  Object.defineProperty(HTMLElement.prototype, 'getAnimations', {
    configurable: true,
    value(this: HTMLElement): Animation[] {
      const shouldHoldDirectionalAnimation =
        holdDirectionalAnimations && this.getAttribute('data-activation-direction') !== 'none'

      if (!this.hasAttribute('data-ending-style') && !shouldHoldDirectionalAnimation) {
        return [
          {
            finished: Promise.resolve(),
            pending: false,
            playState: 'finished'
          } as unknown as Animation
        ]
      }

      const testId = this.getAttribute('data-testid')
      let finish: () => void = () => undefined
      const finished = new Promise<void>((resolve) => {
        finish = resolve
      })

      if (testId !== null) {
        finishers.set(testId, finish)
      }

      return [
        {
          finished,
          pending: false,
          playState: 'running'
        } as unknown as Animation
      ]
    }
  })

  return {
    finish(testId: string) {
      const finish = finishers.get(testId)

      if (finish === undefined) {
        throw new Error(`Expected ${testId} to have a running CSS animation`)
      }

      finish()
    },
    hasObserved(testId: string) {
      return finishers.has(testId)
    }
  }
}

function DefaultTabsProbe({
  onValueChange
}: {
  onValueChange?: (value: TabsValue, eventDetails: TabsChangeEventDetails) => void
}) {
  return (
    <Tabs.Root data-testid="tabs-root" defaultValue="overview" onValueChange={onValueChange}>
      <Tabs.List data-testid="tabs-list">
        <Tabs.Tab value="overview">Overview</Tabs.Tab>
        <Tabs.Tab value="projects">Projects</Tabs.Tab>
        <Tabs.Tab value="account">Account</Tabs.Tab>
        <Tabs.Indicator data-testid="tabs-indicator" />
      </Tabs.List>

      <div className="relative grid min-h-32 w-full grid-cols-1 overflow-hidden">
        <Tabs.Panel data-testid="overview-panel" value="overview">
          Workspace stats and activity.
        </Tabs.Panel>
        <Tabs.Panel data-testid="projects-panel" value="projects">
          Milestones and deadlines.
        </Tabs.Panel>
        <Tabs.Panel data-testid="account-panel" value="account">
          Profile and preferences.
        </Tabs.Panel>
      </div>
    </Tabs.Root>
  )
}

function ControlledTabsProbe() {
  const [value, setValue] = useState<TabsValue>('overview')

  return (
    <div>
      <button onClick={() => setValue('overview')} type="button">
        show overview
      </button>
      <button onClick={() => setValue('projects')} type="button">
        show projects
      </button>
      <button onClick={() => setValue(null)} type="button">
        clear selection
      </button>
      <output aria-label="current controlled value">{value ?? 'none'}</output>

      <Tabs.Root value={value} onValueChange={setValue}>
        <Tabs.List>
          <Tabs.Tab value="overview">Overview</Tabs.Tab>
          <Tabs.Tab value="projects">Projects</Tabs.Tab>
          <Tabs.Indicator data-testid="controlled-indicator" />
        </Tabs.List>
        <div className="relative grid min-h-32 grid-cols-1 overflow-hidden">
          <Tabs.Panel value="overview">Overview content</Tabs.Panel>
          <Tabs.Panel value="projects">Projects content</Tabs.Panel>
        </div>
      </Tabs.Root>
    </div>
  )
}

function BoundaryTabsProbe({ orientation }: { orientation: 'horizontal' | 'vertical' }) {
  const [value, setValue] = useState<TabsValue>(null)
  const vertical = orientation === 'vertical'

  return (
    <section aria-label={`${orientation} boundary tabs`}>
      <button onClick={() => setValue('first')} type="button">
        show first
      </button>
      <button onClick={() => setValue('second')} type="button">
        show second
      </button>
      <button onClick={() => setValue(null)} type="button">
        clear selection
      </button>
      <output aria-label={`${orientation} boundary value`}>
        {orientation}: {value ?? 'none'}
      </output>

      <Tabs.Root
        className={vertical ? 'grid grid-cols-[max-content_minmax(0,1fr)]' : undefined}
        onValueChange={setValue}
        orientation={orientation}
        value={value}
      >
        <Tabs.List
          className={vertical ? 'relative grid grid-cols-1' : undefined}
          data-testid={`${orientation}-boundary-list`}
        >
          <Tabs.Tab
            className={vertical ? 'w-full' : undefined}
            data-testid={`${orientation}-boundary-first`}
            value="first"
          >
            First
          </Tabs.Tab>
          <Tabs.Tab
            className={vertical ? 'h-14 w-full' : undefined}
            data-testid={`${orientation}-boundary-second`}
            value="second"
          >
            Longer second Tab
          </Tabs.Tab>
          <Tabs.Indicator data-testid={`${orientation}-boundary-indicator`} />
        </Tabs.List>

        <div className="relative grid min-h-32 min-w-0 grid-cols-1 overflow-hidden">
          <Tabs.Panel value="first">First content</Tabs.Panel>
          <Tabs.Panel value="second">Second content</Tabs.Panel>
        </div>
      </Tabs.Root>
    </section>
  )
}

function IndicatorBoundaryTabsProbe() {
  return (
    <div>
      <BoundaryTabsProbe orientation="horizontal" />
      <BoundaryTabsProbe orientation="vertical" />
    </div>
  )
}

function HydrationTabsProbe({ value }: { value: TabsValue }) {
  return (
    <Tabs.Root value={value} onValueChange={() => undefined}>
      <Tabs.List
        data-testid="hydration-list"
        style={{ '--tabs-border-width': '3px' } as CSSProperties}
      >
        <Tabs.Tab data-testid="hydration-overview" value="overview">
          Overview
        </Tabs.Tab>
        <Tabs.Tab data-testid="hydration-projects" value="projects">
          Projects
        </Tabs.Tab>
        <Tabs.Indicator data-testid="hydration-indicator" renderBeforeHydration />
      </Tabs.List>
      <Tabs.Panel value="overview">Overview content</Tabs.Panel>
      <Tabs.Panel value="projects">Projects content</Tabs.Panel>
    </Tabs.Root>
  )
}

function VerticalTabsProbe() {
  return (
    <Tabs.Root
      className="grid w-full min-w-0 grid-cols-[max-content_minmax(0,1fr)]"
      data-testid="vertical-root"
      defaultValue="training"
      orientation="vertical"
    >
      <Tabs.List className="relative grid grid-cols-1 items-stretch" loopFocus={false}>
        <Tabs.Tab className="w-full" data-testid="vertical-overview-tab" value="overview">
          Overview
        </Tabs.Tab>
        <Tabs.Tab className="w-full" data-testid="vertical-training-tab" value="training">
          Training
        </Tabs.Tab>
        <Tabs.Tab className="h-14 w-full" data-testid="vertical-nutrition-tab" value="nutrition">
          Nutrition
        </Tabs.Tab>
        <Tabs.Indicator data-testid="vertical-indicator" />
      </Tabs.List>

      <div
        className="relative grid min-h-32 min-w-0 grid-cols-1 overflow-hidden"
        data-testid="vertical-panel-viewport"
      >
        <Tabs.Panel data-testid="vertical-overview-panel" keepMounted value="overview">
          Overview content
        </Tabs.Panel>
        <Tabs.Panel data-testid="vertical-training-panel" keepMounted value="training">
          Training content
        </Tabs.Panel>
        <Tabs.Panel data-testid="vertical-nutrition-panel" keepMounted value="nutrition">
          Nutrition content
        </Tabs.Panel>
      </div>
    </Tabs.Root>
  )
}

function PersistentTabsProbe() {
  const [value, setValue] = useState<TabsValue>('first')

  return (
    <div>
      <button onClick={() => setValue('first')} type="button">
        first
      </button>
      <button onClick={() => setValue('second')} type="button">
        second
      </button>
      <output aria-label="current persistent value">{value ?? 'none'}</output>

      <Tabs.Root value={value} onValueChange={setValue}>
        <Tabs.List>
          <Tabs.Tab value="first">First</Tabs.Tab>
          <Tabs.Tab value="second">Second</Tabs.Tab>
          <Tabs.Indicator />
        </Tabs.List>
        <div className="relative grid min-h-32 grid-cols-1 overflow-hidden">
          <Tabs.Panel data-testid="persistent-first-panel" keepMounted value="first">
            First persistent content
          </Tabs.Panel>
          <Tabs.Panel data-testid="persistent-second-panel" keepMounted value="second">
            Second persistent content
          </Tabs.Panel>
        </div>
      </Tabs.Root>
    </div>
  )
}

const SafeLink = forwardRef<HTMLAnchorElement, ComponentPropsWithoutRef<'a'>>(
  ({ children, ...props }, ref) => (
    <a ref={ref} {...props}>
      {children}
    </a>
  )
)

SafeLink.displayName = 'SafeLink'

describe('Tabs', () => {
  afterEach(() => {
    vi.restoreAllMocks()
    vi.unstubAllGlobals()

    if (ORIGINAL_GET_ANIMATIONS === undefined) {
      Reflect.deleteProperty(HTMLElement.prototype, 'getAnimations')
    } else {
      Object.defineProperty(HTMLElement.prototype, 'getAnimations', {
        configurable: true,
        value: ORIGINAL_GET_ANIMATIONS
      })
    }
  })

  it('UC-001 / EX-001 / EX-002 / EX-003 / EX-004 / EX-005 / EX-006 / EX-007 / EX-008 - exposes the documented package namespace and only its five public parts', () => {
    const partNames = ['Root', 'List', 'Tab', 'Indicator', 'Panel'] as const

    expect(Tabs).toBeDefined()
    expect(PackageExports.Tabs).toBe(Tabs)
    expect(PackageExports.Components.Tabs).toBe(Tabs)
    expect(PackageExports.Ui.Components).toBe(PackageExports.Components)
    expect(PackageExports.Ui.Components.Tabs).toBe(Tabs)

    for (const partName of partNames) {
      expect(Tabs[partName]).toBeTypeOf('function')
    }

    expect(Tabs).not.toHaveProperty('Panels')
    expect(Tabs).not.toHaveProperty('Viewport')
  })

  it('UC-001 / CR-002 - exposes every documented namespaced type and its package alias from the real Tabs export', () => {
    expectTypeOf<Tabs.Root.Orientation>().toEqualTypeOf<TabsRootOrientation>()
    expectTypeOf<Tabs.Root.State>().toEqualTypeOf<TabsRootState>()
    expectTypeOf<Tabs.Root.Props>().toEqualTypeOf<TabsRootProps>()
    expectTypeOf<Tabs.Root.ChangeEventReason>().toEqualTypeOf<TabsRootChangeEventReason>()
    expectTypeOf<Tabs.Root.ChangeEventDetails>().toEqualTypeOf<TabsRootChangeEventDetails>()
    expectTypeOf<Tabs.List.State>().toEqualTypeOf<TabsListState>()
    expectTypeOf<Tabs.List.Props>().toEqualTypeOf<TabsListProps>()
    expectTypeOf<Tabs.Tab.Value>().toEqualTypeOf<TabsTabValue>()
    expectTypeOf<Tabs.Tab.ActivationDirection>().toEqualTypeOf<TabsTabActivationDirection>()
    expectTypeOf<Tabs.Tab.Position>().toEqualTypeOf<TabsTabPosition>()
    expectTypeOf<Tabs.Tab.Size>().toEqualTypeOf<TabsTabSize>()
    expectTypeOf<Tabs.Tab.Metadata>().toEqualTypeOf<TabsTabMetadata>()
    expectTypeOf<Tabs.Tab.State>().toEqualTypeOf<TabsTabState>()
    expectTypeOf<TabsTabRevealAnimationProps>().toEqualTypeOf<
      Omit<RevealAnimationProps, 'children' | 'render' | 'reveal'>
    >()
    expectTypeOf<Tabs.Tab.Props>().toEqualTypeOf<TabsTabProps>()
    expectTypeOf<Tabs.Indicator.State>().toEqualTypeOf<TabsIndicatorState>()
    expectTypeOf<Tabs.Indicator.Props>().toEqualTypeOf<TabsIndicatorProps>()
    expectTypeOf<Tabs.Panel.Metadata>().toEqualTypeOf<TabsPanelMetadata>()
    expectTypeOf<Tabs.Panel.State>().toEqualTypeOf<TabsPanelState>()
    expectTypeOf<Tabs.Panel.Props>().toEqualTypeOf<TabsPanelProps>()

    expectTypeOf<Tabs.Root.Orientation>().toEqualTypeOf<BaseUiTabs.Root.Orientation>()
    expectTypeOf<Tabs.Root.State>().toEqualTypeOf<BaseUiTabs.Root.State>()
    expectTypeOf<Tabs.Root.Props>().toMatchTypeOf<BaseUiTabs.Root.Props>()
    expectTypeOf<Tabs.Root.Props['dir']>().toEqualTypeOf<'ltr' | 'rtl' | undefined>()
    expectTypeOf<Tabs.Root.ChangeEventReason>().toEqualTypeOf<BaseUiTabs.Root.ChangeEventReason>()
    expectTypeOf<Tabs.Root.ChangeEventDetails>().toEqualTypeOf<BaseUiTabs.Root.ChangeEventDetails>()
    expectTypeOf<Tabs.List.State>().toEqualTypeOf<BaseUiTabs.List.State>()
    expectTypeOf<Tabs.List.Props>().toEqualTypeOf<BaseUiTabs.List.Props>()
    expectTypeOf<Tabs.Tab.Value>().toEqualTypeOf<BaseUiTabs.Tab.Value>()
    expectTypeOf<Tabs.Tab.ActivationDirection>().toEqualTypeOf<BaseUiTabs.Tab.ActivationDirection>()
    expectTypeOf<Tabs.Tab.Position>().toEqualTypeOf<BaseUiTabs.Tab.Position>()
    expectTypeOf<Tabs.Tab.Size>().toEqualTypeOf<BaseUiTabs.Tab.Size>()
    expectTypeOf<Tabs.Tab.Metadata>().toEqualTypeOf<BaseUiTabs.Tab.Metadata>()
    expectTypeOf<Tabs.Tab.State>().toEqualTypeOf<BaseUiTabs.Tab.State>()
    expectTypeOf<Tabs.Tab.Props>().toEqualTypeOf<
      BaseUiTabs.Tab.Props & { revealAnimation?: TabsTabRevealAnimationProps }
    >()
    expectTypeOf<Tabs.Indicator.State>().toEqualTypeOf<BaseUiTabs.Indicator.State>()
    expectTypeOf<Tabs.Indicator.Props>().toEqualTypeOf<BaseUiTabs.Indicator.Props>()
    expectTypeOf<Tabs.Panel.Metadata>().toEqualTypeOf<BaseUiTabs.Panel.Metadata>()
    expectTypeOf<Tabs.Panel.State>().toEqualTypeOf<BaseUiTabs.Panel.State>()
    expectTypeOf<Tabs.Panel.Props>().toEqualTypeOf<BaseUiTabs.Panel.Props>()
  })

  it('UC-001 / EX-001 - renders the documented Base UI Tabs anatomy and associations', () => {
    render(<DefaultTabsProbe />)

    const root = screen.getByTestId('tabs-root')
    const list = screen.getByRole('tablist')
    const overviewTab = screen.getByRole('tab', { name: 'Overview' })
    const projectsTab = screen.getByRole('tab', { name: 'Projects' })
    const overviewPanel = screen.getByRole('tabpanel', { name: 'Overview' })
    const indicator = screen.getByTestId('tabs-indicator')

    expect(root).toHaveAttribute('data-orientation', 'horizontal')
    expect(root).toHaveAttribute('data-activation-direction', 'none')
    expect(list).toHaveAttribute('data-orientation', 'horizontal')
    expect(list).not.toHaveAttribute('aria-orientation')
    expect(screen.getAllByRole('tab')).toHaveLength(3)
    expect(overviewTab).toHaveAttribute('aria-selected', 'true')
    expect(overviewTab).toHaveAttribute('data-active')
    expect(projectsTab).toHaveAttribute('aria-selected', 'false')
    expect(overviewPanel).toHaveAttribute('aria-labelledby', overviewTab.id)
    expect(overviewTab).toHaveAttribute('aria-controls', overviewPanel.id)
    expect(overviewPanel).toHaveAttribute('tabindex', '0')
    expect(overviewPanel).toHaveAttribute('data-index', '0')
    expect(indicator.tagName).toBe('SPAN')
    expect(indicator).toHaveAttribute('role', 'presentation')
    expect(indicator).not.toHaveAttribute('data-starting-style')
    expect(indicator).not.toHaveAttribute('data-ending-style')
    expect(getRevealRoot(overviewTab)).toHaveAttribute('data-motion', 'reveal')
    expect(getRevealRoot(projectsTab)).toHaveAttribute('data-motion', 'reveal')
    expect(getRevealRoot(overviewTab)).toHaveAttribute('data-unreveal-behavior', 'return')
    expect(getRevealRoot(projectsTab)).toHaveAttribute('data-unreveal-behavior', 'return')
  })

  it('UC-007 / UC-008 / EX-001 / EX-003 - exposes the documented Indicator and Panel CSS transition contracts', () => {
    const horizontal = render(<DefaultTabsProbe />)

    expectTransitionContract(screen.getByTestId('tabs-indicator'), {
      durations: ['300ms', '200ms'],
      easing: [TABS_MOTION_EASING],
      excluded: ['ease-out', 'opacity'],
      properties: ['left', 'width', 'translate']
    })
    expectTransitionContract(screen.getByTestId('overview-panel'), {
      durations: ['175ms', '300ms'],
      easing: ['ease', TABS_MOTION_EASING],
      excluded: ['350ms'],
      properties: ['opacity', 'translate']
    })

    horizontal.unmount()
    render(<VerticalTabsProbe />)

    expectTransitionContract(screen.getByTestId('vertical-indicator'), {
      durations: ['300ms', '200ms'],
      easing: [TABS_MOTION_EASING],
      excluded: ['ease-out', 'opacity'],
      properties: ['top', 'height', 'translate']
    })
  })

  it('UC-004 / UC-006 / UC-014 / EX-007 - preserves ordered public Reveal units and the uniform List border input', async () => {
    mockTabRects({
      'fusion-list': { height: 40, left: 0, width: 320 },
      'fusion-locked': { height: 40, left: 220, width: 100 },
      'fusion-overview': { height: 40, left: 0, width: 90 },
      'fusion-projects': { height: 40, left: 90, width: 130 }
    })
    render(
      <Tabs.Root defaultValue="overview" dir="rtl">
        <Tabs.List
          data-testid="fusion-list"
          style={{ '--tabs-border-width': '3px' } as CSSProperties}
        >
          <span data-testid="fusion-leading-child">Label</span>
          <Tabs.Tab data-testid="fusion-overview" value="overview">
            Overview
          </Tabs.Tab>
          <Tabs.Tab
            data-testid="fusion-projects"
            nativeButton={false}
            render={<SafeLink href="#projects" />}
            value="projects"
          >
            Projects
          </Tabs.Tab>
          <Tabs.Tab data-testid="fusion-locked" disabled value="locked">
            Locked
          </Tabs.Tab>
          <Tabs.Indicator data-testid="fusion-indicator" />
        </Tabs.List>
        <Tabs.Panel value="overview">Overview content</Tabs.Panel>
        <Tabs.Panel value="projects">Projects content</Tabs.Panel>
        <Tabs.Panel value="locked">Locked content</Tabs.Panel>
      </Tabs.Root>
    )

    const list = screen.getByRole('tablist')
    const overviewTab = screen.getByRole('tab', { name: 'Overview' })
    const projectsTab = screen.getByRole('tab', { name: 'Projects' })
    const lockedTab = screen.getByRole('tab', { name: 'Locked' })
    const tabUnits = Array.from(list.children).filter((child) =>
      child.hasAttribute('data-reveal-root')
    )

    expect(getCssVariable(list, '--tabs-border-width')).toBe('3px')
    expect(tabUnits).toEqual([
      getRevealRoot(overviewTab),
      getRevealRoot(projectsTab),
      getRevealRoot(lockedTab)
    ])
    expect(screen.getByTestId('fusion-leading-child')).toBe(list.firstElementChild)
    expect(projectsTab.tagName).toBe('A')
    expect(lockedTab).toHaveAttribute('data-disabled')

    for (const tab of [overviewTab, projectsTab, lockedTab]) {
      const unit = getRevealRoot(tab)
      const realSurface = getRequiredElement(
        unit.querySelector<HTMLElement>('[data-reveal-surface]'),
        `Expected ${tab.textContent ?? 'Tab'} real RevealAnimation surface`
      )

      expect(realSurface).toContainElement(tab)
      expect(unit).toHaveAttribute('data-content-mode', 'flow')
      expect(unit).toHaveAttribute('data-unreveal-behavior', 'return')
      expect(unit).not.toHaveAttribute('data-active-unreveal-behavior')
      expect(getRevealOverlaySurface(tab)).toHaveAttribute('data-reveal-overlay-surface')
    }

    await waitFor(() =>
      expect(
        getCssVariable(
          screen.getByTestId('fusion-indicator'),
          '--tabs-active-leading-border-offset'
        )
      ).toBe('0px')
    )
  })

  it('UC-001 - preserves native props, state callbacks, render overrides, and refs on every part', () => {
    const indicatorRef = createRef<HTMLElement>()
    const listRef = createRef<HTMLDivElement>()
    const panelRef = createRef<HTMLDivElement>()
    const rootRef = createRef<HTMLDivElement>()

    render(
      <Tabs.Root
        className={(state) => `root-${state.orientation}`}
        data-consumer-root="preserved"
        data-testid="consumer-root"
        defaultValue="overview"
        ref={rootRef}
        render={<section />}
        style={(state) => ({ opacity: state.orientation === 'horizontal' ? 0.9 : 1 })}
      >
        <Tabs.List
          aria-label="Consumer tab list"
          className={(state) => `list-${state.orientation}`}
          data-consumer-list="preserved"
          ref={listRef}
          render={<nav />}
        >
          <Tabs.Tab
            className={(state) =>
              `tab-${state.orientation}-${state.active ? 'active' : 'inactive'}`
            }
            value="overview"
          >
            Overview
          </Tabs.Tab>
          <Tabs.Indicator
            className={(state) => `indicator-${state.orientation}`}
            data-consumer-indicator="preserved"
            data-testid="consumer-indicator"
            ref={indicatorRef}
            render={<i />}
          />
        </Tabs.List>
        <Tabs.Panel
          className={(state) => `panel-${state.orientation}`}
          data-consumer-panel="preserved"
          ref={panelRef}
          render={<article />}
          value="overview"
        >
          Overview content
        </Tabs.Panel>
      </Tabs.Root>
    )

    const root = screen.getByTestId('consumer-root')
    const list = screen.getByRole('tablist', { name: 'Consumer tab list' })
    const indicator = screen.getByTestId('consumer-indicator')
    const panel = screen.getByRole('tabpanel', { name: 'Overview' })
    const tab = screen.getByRole('tab', { name: 'Overview' })

    expect(root.tagName).toBe('SECTION')
    expect(root).toHaveAttribute('data-consumer-root', 'preserved')
    expect(root).toHaveClass('root-horizontal')
    expect(root).toHaveStyle({ opacity: '0.9' })
    expect(rootRef.current).toBe(root)
    expect(list.tagName).toBe('NAV')
    expect(list).toHaveAttribute('data-consumer-list', 'preserved')
    expect(list).toHaveClass('list-horizontal')
    expect(listRef.current).toBe(list)
    expect(tab).toHaveClass('tab-horizontal-active')
    expect(indicator.tagName).toBe('I')
    expect(indicator).toHaveAttribute('data-consumer-indicator', 'preserved')
    expect(indicator).toHaveClass('indicator-horizontal')
    expect(indicatorRef.current).toBe(indicator)
    expect(panel.tagName).toBe('ARTICLE')
    expect(panel).toHaveAttribute('data-consumer-panel', 'preserved')
    expect(panel).toHaveClass('panel-horizontal')
    expect(panelRef.current).toBe(panel)
  })

  it('UC-002 / EX-001 - changes uncontrolled selection and preserves Base UI event details', () => {
    const onValueChange = vi.fn()

    render(<DefaultTabsProbe onValueChange={onValueChange} />)

    const projectsTab = screen.getByRole('tab', { name: 'Projects' })

    fireEvent.click(projectsTab)

    expect(projectsTab).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByRole('tabpanel', { name: 'Projects' })).toHaveTextContent(
      'Milestones and deadlines.'
    )
    expect(onValueChange).toHaveBeenCalledOnce()
    expect(onValueChange).toHaveBeenCalledWith(
      'projects',
      expect.objectContaining({
        activationDirection: 'none',
        allowPropagation: expect.any(Function),
        cancel: expect.any(Function),
        event: expect.any(Event),
        isCanceled: false,
        isPropagationAllowed: false,
        reason: 'none'
      })
    )
  })

  it('UC-002 - automatically selects the first enabled mounted Tab with the initial reason', async () => {
    const onValueChange = vi.fn()

    render(
      <Tabs.Root onValueChange={onValueChange}>
        <Tabs.List>
          <Tabs.Tab disabled value="locked">
            Locked
          </Tabs.Tab>
          <Tabs.Tab value="overview">Overview</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="locked">Locked content</Tabs.Panel>
        <Tabs.Panel value="overview">Overview content</Tabs.Panel>
      </Tabs.Root>
    )

    await waitFor(() => {
      expect(screen.getByRole('tab', { name: 'Overview' })).toHaveAttribute('aria-selected', 'true')
    })
    expect(onValueChange).toHaveBeenCalledWith(
      'overview',
      expect.objectContaining({ reason: 'initial' })
    )
  })

  it('UC-002 - falls back from an unmatched explicit default with the missing reason', async () => {
    const onValueChange = vi.fn()

    render(
      <Tabs.Root defaultValue="missing" onValueChange={onValueChange}>
        <Tabs.List>
          <Tabs.Tab value="overview">Overview</Tabs.Tab>
          <Tabs.Tab value="projects">Projects</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="overview">Overview content</Tabs.Panel>
        <Tabs.Panel value="projects">Projects content</Tabs.Panel>
      </Tabs.Root>
    )

    await waitFor(() => {
      expect(screen.getByRole('tab', { name: 'Overview' })).toHaveAttribute('aria-selected', 'true')
    })
    expect(onValueChange).toHaveBeenCalledWith(
      'overview',
      expect.objectContaining({ reason: 'missing' })
    )
  })

  it('UC-002 - falls back when an uncontrolled active Tab becomes disabled', async () => {
    const onValueChange = vi.fn()

    function DisabledFallbackProbe() {
      const [overviewDisabled, setOverviewDisabled] = useState(false)

      return (
        <div>
          <button onClick={() => setOverviewDisabled(true)} type="button">
            disable overview
          </button>
          <Tabs.Root defaultValue="overview" onValueChange={onValueChange}>
            <Tabs.List>
              <Tabs.Tab disabled={overviewDisabled} value="overview">
                Overview
              </Tabs.Tab>
              <Tabs.Tab value="projects">Projects</Tabs.Tab>
            </Tabs.List>
            <Tabs.Panel value="overview">Overview content</Tabs.Panel>
            <Tabs.Panel value="projects">Projects content</Tabs.Panel>
          </Tabs.Root>
        </div>
      )
    }

    render(<DisabledFallbackProbe />)
    fireEvent.click(screen.getByRole('button', { name: 'disable overview' }))

    await waitFor(() => {
      expect(screen.getByRole('tab', { name: 'Projects' })).toHaveAttribute('aria-selected', 'true')
    })
    expect(onValueChange).toHaveBeenCalledWith(
      'projects',
      expect.objectContaining({ reason: 'disabled' })
    )
  })

  it('UC-002 / UC-007 / UC-015 / EX-002 - preserves controlled selection while Indicator exits and re-enters across null', async () => {
    render(<ControlledTabsProbe />)

    expect(screen.getByLabelText('current controlled value')).toHaveTextContent('overview')
    expect(screen.getByRole('tab', { name: 'Overview' })).toHaveAttribute('aria-selected', 'true')
    const initialIndicator = screen.getByTestId('controlled-indicator')

    expect(initialIndicator).toHaveAttribute('role', 'presentation')
    expect(initialIndicator).not.toHaveAttribute('data-starting-style')
    expect(initialIndicator).not.toHaveAttribute('data-ending-style')

    fireEvent.click(screen.getByRole('button', { name: 'clear selection' }))

    expect(screen.getByLabelText('current controlled value')).toHaveTextContent('none')
    expect(screen.getByRole('tab', { name: 'Overview' })).toHaveAttribute('aria-selected', 'false')
    expect(screen.getByRole('tab', { name: 'Projects' })).toHaveAttribute('aria-selected', 'false')
    expect(screen.queryByRole('tabpanel')).not.toBeInTheDocument()
    const exitingIndicator = screen.getByTestId('controlled-indicator')

    expect(exitingIndicator).toBe(initialIndicator)
    expect(exitingIndicator).toHaveAttribute('role', 'presentation')
    expect(exitingIndicator).toHaveAttribute('data-ending-style')
    expect(exitingIndicator).not.toHaveAttribute('data-starting-style')

    fireEvent.transitionEnd(exitingIndicator, { propertyName: 'opacity' })
    expect(screen.getByTestId('controlled-indicator')).toBe(exitingIndicator)

    fireEvent.transitionEnd(exitingIndicator, { propertyName: 'translate' })
    await waitFor(() =>
      expect(screen.queryByTestId('controlled-indicator')).not.toBeInTheDocument()
    )

    fireEvent.click(screen.getByRole('button', { name: 'show projects' }))

    expect(screen.getByLabelText('current controlled value')).toHaveTextContent('projects')
    expect(screen.getByRole('tab', { name: 'Projects' })).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByRole('tabpanel', { name: 'Projects' })).toHaveTextContent('Projects content')
    const enteringIndicator = screen.getByTestId('controlled-indicator')

    expect(enteringIndicator).toHaveAttribute('role', 'presentation')
    expect(enteringIndicator).toHaveAttribute('data-starting-style')
    expect(enteringIndicator).not.toHaveAttribute('data-ending-style')
  })

  it('UC-002 / UC-007 / UC-014 / UC-015 / EX-002 / EX-008 / CR-002 - mounts the controlled Indicator from null with entry lifecycle, ref, and corrected geometry', async () => {
    mockTabRects({
      'null-indicator-list': { height: 40, left: 20, width: 200 },
      'null-indicator-overview': { height: 40, left: 20, width: 80 },
      'null-indicator-projects': { height: 40, left: 100, width: 120 }
    })
    const indicatorRef = createRef<HTMLElement>()

    function NullIndicatorProbe() {
      const [value, setValue] = useState<TabsValue>(null)

      return (
        <div>
          <button onClick={() => setValue('projects')} type="button">
            select projects from none
          </button>
          <Tabs.Root value={value} onValueChange={setValue}>
            <Tabs.List
              data-testid="null-indicator-list"
              style={{ '--tabs-border-width': '3px', height: 40, width: 200 } as CSSProperties}
            >
              <Tabs.Tab
                data-testid="null-indicator-overview"
                style={{ height: 40, width: 80 }}
                value="overview"
              >
                Overview
              </Tabs.Tab>
              <Tabs.Tab
                data-testid="null-indicator-projects"
                style={{ height: 40, width: 120 }}
                value="projects"
              >
                Projects
              </Tabs.Tab>
              <Tabs.Indicator data-testid="null-indicator" ref={indicatorRef} />
            </Tabs.List>
            <Tabs.Panel value="overview">Overview content</Tabs.Panel>
            <Tabs.Panel value="projects">Projects content</Tabs.Panel>
          </Tabs.Root>
        </div>
      )
    }

    expect(() => render(<NullIndicatorProbe />)).not.toThrow()
    expect(screen.queryByTestId('null-indicator')).not.toBeInTheDocument()
    expect(indicatorRef.current).toBeNull()

    fireEvent.click(screen.getByRole('button', { name: 'select projects from none' }))

    await waitFor(() => {
      const indicator = screen.getByTestId('null-indicator')
      const listBorderWidth = getCssVariable(
        screen.getByTestId('null-indicator-list'),
        '--tabs-border-width'
      )

      expect(listBorderWidth).toBe('3px')
      expect(indicatorRef.current).toBe(indicator)
      expect(indicator).toHaveAttribute('data-starting-style')
      expect(indicator).not.toHaveAttribute('data-ending-style')
      expect(getCssVariable(indicator, '--active-tab-left')).toBe('80px')
      expect(getCssVariable(indicator, '--active-tab-width')).toBe('120px')
      expect(getCssVariable(indicator, '--active-tab-height')).toBe('40px')
      expect(getCssVariable(indicator, '--tabs-active-leading-border-offset')).toBe(listBorderWidth)
    })
  })

  it('UC-002 / UC-007 / UC-015 / EX-002 / CR-002 - preserves renderBeforeHydration presentation for active and null server states through hydration', async () => {
    mockTabRects({
      'hydration-list': { height: 40, left: 20, top: 10, width: 200 },
      'hydration-overview': { height: 40, left: 20, top: 10, width: 80 },
      'hydration-projects': { height: 40, left: 100, top: 10, width: 120 }
    })
    vi.spyOn(HTMLElement.prototype, 'scrollWidth', 'get').mockImplementation(function (
      this: HTMLElement
    ) {
      return this.getAttribute('data-testid') === 'hydration-list' ? 200 : 0
    })
    vi.spyOn(HTMLElement.prototype, 'scrollHeight', 'get').mockImplementation(function (
      this: HTMLElement
    ) {
      return this.getAttribute('data-testid') === 'hydration-list' ? 40 : 0
    })
    const firstActiveContainer = document.createElement('div')
    const followingActiveContainer = document.createElement('div')
    const nullContainer = document.createElement('div')

    firstActiveContainer.innerHTML = renderToString(<HydrationTabsProbe value="overview" />)
    followingActiveContainer.innerHTML = renderToString(<HydrationTabsProbe value="projects" />)
    nullContainer.innerHTML = renderToString(<HydrationTabsProbe value={null} />)
    document.body.append(firstActiveContainer, followingActiveContainer, nullContainer)

    let firstActiveRoot: ReturnType<typeof hydrateRoot> | undefined
    let followingActiveRoot: ReturnType<typeof hydrateRoot> | undefined
    let nullRoot: ReturnType<typeof hydrateRoot> | undefined

    try {
      const firstServerIndicator = getRequiredElement(
        firstActiveContainer.querySelector<HTMLElement>('[data-testid="hydration-indicator"]'),
        'Expected renderBeforeHydration to emit the first active Indicator presentation node'
      )
      const followingServerIndicator = getRequiredElement(
        followingActiveContainer.querySelector<HTMLElement>('[data-testid="hydration-indicator"]'),
        'Expected renderBeforeHydration to emit the following active Indicator presentation node'
      )

      for (const serverIndicator of [firstServerIndicator, followingServerIndicator]) {
        expect(serverIndicator).toHaveAttribute('role', 'presentation')
        expect(serverIndicator).toHaveAttribute('hidden')
        expect(serverIndicator).not.toHaveAttribute('data-starting-style')
        expect(serverIndicator).not.toHaveAttribute('data-ending-style')
      }
      expect(
        nullContainer.querySelector('[data-testid="hydration-indicator"]')
      ).not.toBeInTheDocument()
      expect(nullContainer.querySelector('script')).not.toBeInTheDocument()

      expect(runPrehydrationScript(firstActiveContainer)).toBeInTheDocument()
      expect(runPrehydrationScript(followingActiveContainer)).toBeInTheDocument()

      expect(firstServerIndicator).not.toHaveAttribute('hidden')
      expectCompleteIndicatorGeometry(firstServerIndicator, {
        bottom: '0px',
        height: '40px',
        leadingBorderOffset: '0px',
        left: '0px',
        right: '120px',
        top: '0px',
        width: '80px'
      })
      expect(followingServerIndicator).not.toHaveAttribute('hidden')
      expectCompleteIndicatorGeometry(followingServerIndicator, {
        bottom: '0px',
        height: '40px',
        leadingBorderOffset: '3px',
        left: '80px',
        right: '0px',
        top: '0px',
        width: '120px'
      })

      await act(async () => {
        firstActiveRoot = hydrateRoot(firstActiveContainer, <HydrationTabsProbe value="overview" />)
        followingActiveRoot = hydrateRoot(
          followingActiveContainer,
          <HydrationTabsProbe value="projects" />
        )
        nullRoot = hydrateRoot(nullContainer, <HydrationTabsProbe value={null} />)
      })

      await waitFor(() => {
        const firstHydratedIndicator = firstActiveContainer.querySelector<HTMLElement>(
          '[data-testid="hydration-indicator"]'
        )
        const followingHydratedIndicator = followingActiveContainer.querySelector<HTMLElement>(
          '[data-testid="hydration-indicator"]'
        )

        expect(firstHydratedIndicator).toBe(firstServerIndicator)
        expect(followingHydratedIndicator).toBe(followingServerIndicator)
        for (const hydratedIndicator of [firstHydratedIndicator, followingHydratedIndicator]) {
          expect(hydratedIndicator).toHaveAttribute('role', 'presentation')
          expect(hydratedIndicator).not.toHaveAttribute('hidden')
          expect(hydratedIndicator).not.toHaveAttribute('data-starting-style')
          expect(hydratedIndicator).not.toHaveAttribute('data-ending-style')
        }
        expectCompleteIndicatorGeometry(firstServerIndicator, {
          bottom: '0px',
          height: '40px',
          leadingBorderOffset: '0px',
          left: '0px',
          right: '120px',
          top: '0px',
          width: '80px'
        })
        expectCompleteIndicatorGeometry(followingServerIndicator, {
          bottom: '0px',
          height: '40px',
          leadingBorderOffset: '3px',
          left: '80px',
          right: '0px',
          top: '0px',
          width: '120px'
        })
        expect(
          nullContainer.querySelector('[data-testid="hydration-indicator"]')
        ).not.toBeInTheDocument()
      })
    } finally {
      await act(async () => {
        firstActiveRoot?.unmount()
        followingActiveRoot?.unmount()
        nullRoot?.unmount()
      })
      firstActiveContainer.remove()
      followingActiveContainer.remove()
      nullContainer.remove()
    }
  })

  it('UC-002 / UC-007 / UC-012 / UC-015 / EX-008 - enters and exits beneath horizontal and vertical Tabs before unmounting', async () => {
    mockTabRects({
      'horizontal-boundary-first': { height: 40, left: 0, width: 80 },
      'horizontal-boundary-list': { height: 40, left: 0, width: 200 },
      'horizontal-boundary-second': { height: 40, left: 80, width: 120 },
      'vertical-boundary-first': { height: 32, left: 0, top: 0, width: 140 },
      'vertical-boundary-list': { height: 80, left: 0, width: 140 },
      'vertical-boundary-second': { height: 48, left: 0, top: 32, width: 140 }
    })
    render(<IndicatorBoundaryTabsProbe />)

    for (const orientation of ['horizontal', 'vertical'] as const) {
      const region = screen.getByRole('region', { name: `${orientation} boundary tabs` })
      const indicatorTestId = `${orientation}-boundary-indicator`

      expect(within(region).getByText(`${orientation}: none`)).toBeInTheDocument()
      expect(screen.queryByTestId(indicatorTestId)).not.toBeInTheDocument()

      fireEvent.click(within(region).getByRole('button', { name: 'show first' }))

      await waitFor(() => {
        const indicator = screen.getByTestId(indicatorTestId)

        expect(indicator).toHaveAttribute('role', 'presentation')
        expect(indicator).toHaveAttribute('data-orientation', orientation)
        expect(indicator).toHaveAttribute('data-starting-style')
        expect(indicator).not.toHaveAttribute('data-ending-style')
      })

      const enteringIndicator = screen.getByTestId(indicatorTestId)

      expect(getTransitionEvidence(enteringIndicator)).not.toContain('opacity')
      fireEvent.click(within(region).getByRole('button', { name: 'clear selection' }))

      const exitingIndicator = screen.getByTestId(indicatorTestId)

      expect(exitingIndicator).toBe(enteringIndicator)
      expect(exitingIndicator).toHaveAttribute('data-ending-style')
      expect(exitingIndicator).not.toHaveAttribute('data-starting-style')
      expect(within(region).getByText(`${orientation}: none`)).toBeInTheDocument()

      fireEvent.transitionEnd(exitingIndicator, { propertyName: 'translate' })
      await waitFor(() => expect(screen.queryByTestId(indicatorTestId)).not.toBeInTheDocument())
    }
  })

  it('UC-012 / UC-015 / EX-008 / CR-004 / CR-008 - removes Indicator boundary translate motion when reduced motion is active initially or begins during entry', async () => {
    setReducedMotionPreference(true)
    const initiallyReduced = render(<BoundaryTabsProbe orientation="horizontal" />)

    const region = screen.getByRole('region', { name: 'horizontal boundary tabs' })

    expect(screen.queryByTestId('horizontal-boundary-indicator')).not.toBeInTheDocument()
    fireEvent.click(within(region).getByRole('button', { name: 'show first' }))

    await waitFor(() => {
      const indicator = screen.getByTestId('horizontal-boundary-indicator')

      expect(indicator).not.toHaveAttribute('data-starting-style')
      expect(indicator).not.toHaveAttribute('data-ending-style')
    })
    expectNoActiveBoundaryTranslateTransition(screen.getByTestId('horizontal-boundary-indicator'))
    expect(screen.getByRole('tabpanel', { name: 'First' }).getAttribute('class') ?? '').toContain(
      'motion-safe:'
    )

    fireEvent.click(within(region).getByRole('button', { name: 'clear selection' }))
    await waitFor(() =>
      expect(screen.queryByTestId('horizontal-boundary-indicator')).not.toBeInTheDocument()
    )

    initiallyReduced.unmount()
    const preference = setReducedMotionPreference(false)
    let nextAnimationFrameId = 1
    const animationFrameCallbacks = new Map<number, FrameRequestCallback>()
    const requestAnimationFrameSpy = vi
      .spyOn(globalThis, 'requestAnimationFrame')
      .mockImplementation((callback: FrameRequestCallback): number => {
        const id = nextAnimationFrameId
        nextAnimationFrameId += 1
        animationFrameCallbacks.set(id, callback)
        return id
      })
    const cancelAnimationFrameSpy = vi
      .spyOn(globalThis, 'cancelAnimationFrame')
      .mockImplementation((id: number) => {
        animationFrameCallbacks.delete(id)
      })
    const dynamic = render(<BoundaryTabsProbe orientation="horizontal" />)

    try {
      const dynamicRegion = screen.getByRole('region', { name: 'horizontal boundary tabs' })

      fireEvent.click(within(dynamicRegion).getByRole('button', { name: 'show first' }))

      const enteringIndicator = screen.getByTestId('horizontal-boundary-indicator')

      expect(enteringIndicator).toHaveAttribute('data-starting-style')
      expect(getTransitionEvidence(enteringIndicator)).toContain('translate')
      expect(animationFrameCallbacks.size).toBeGreaterThan(0)

      act(() => preference.setMatches(true))

      expect(enteringIndicator).not.toHaveAttribute('data-starting-style')
      expect(enteringIndicator).not.toHaveAttribute('data-ending-style')
      expectNoActiveBoundaryTranslateTransition(enteringIndicator)

      fireEvent.click(within(dynamicRegion).getByRole('button', { name: 'clear selection' }))
      expect(screen.queryByTestId('horizontal-boundary-indicator')).not.toBeInTheDocument()
    } finally {
      dynamic.unmount()
      requestAnimationFrameSpy.mockRestore()
      cancelAnimationFrameSpy.mockRestore()
    }
  })

  it('UC-003 / EX-007 - synchronizes explicit Root direction with its rendered DOM and RTL keyboard behavior', async () => {
    render(
      <BaseUiDirectionProvider direction="ltr">
        <Tabs.Root
          data-testid="explicit-rtl-root"
          defaultValue="overview"
          dir="rtl"
          render={<section />}
        >
          <Tabs.List activateOnFocus loopFocus={false}>
            <Tabs.Tab value="overview">Overview</Tabs.Tab>
            <Tabs.Tab value="projects">Projects</Tabs.Tab>
            <Tabs.Tab value="account">Account</Tabs.Tab>
          </Tabs.List>
          <Tabs.Panel value="overview">Overview content</Tabs.Panel>
          <Tabs.Panel value="projects">Projects content</Tabs.Panel>
          <Tabs.Panel value="account">Account content</Tabs.Panel>
        </Tabs.Root>
      </BaseUiDirectionProvider>
    )

    const root = screen.getByTestId('explicit-rtl-root')
    const overviewTab = screen.getByRole('tab', { name: 'Overview' })
    const projectsTab = screen.getByRole('tab', { name: 'Projects' })

    expect(root.tagName).toBe('SECTION')
    expect(root).toHaveAttribute('dir', 'rtl')

    act(() => overviewTab.focus())
    fireEvent.keyDown(overviewTab, { key: 'ArrowLeft' })

    await waitFor(() => {
      expect(projectsTab).toHaveFocus()
      expect(projectsTab).toHaveAttribute('aria-selected', 'true')
    })
  })

  it('UC-003 - applies inherited Base UI direction and the ltr fallback to Root DOM', () => {
    const inheritedDirection = render(
      <BaseUiDirectionProvider direction="rtl">
        <Tabs.Root data-testid="inherited-direction-root" defaultValue="overview">
          <Tabs.List>
            <Tabs.Tab value="overview">Overview</Tabs.Tab>
          </Tabs.List>
          <Tabs.Panel value="overview">Overview content</Tabs.Panel>
        </Tabs.Root>
      </BaseUiDirectionProvider>
    )

    expect(screen.getByTestId('inherited-direction-root')).toHaveAttribute('dir', 'rtl')

    inheritedDirection.unmount()
    render(
      <Tabs.Root data-testid="fallback-direction-root" defaultValue="overview">
        <Tabs.List>
          <Tabs.Tab value="overview">Overview</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="overview">Overview content</Tabs.Panel>
      </Tabs.Root>
    )

    expect(screen.getByTestId('fallback-direction-root')).toHaveAttribute('dir', 'ltr')
  })

  it('UC-003 / EX-003 / CR-001 - moves vertical focus without looping and activates explicitly with Enter or Space', async () => {
    const user = userEvent.setup()

    mockTabRects({
      'vertical-nutrition-tab': { height: 40, left: 0, top: 80, width: 100 },
      'vertical-overview-tab': { height: 40, left: 0, top: 0, width: 100 },
      'vertical-training-tab': { height: 40, left: 0, top: 40, width: 100 }
    })
    render(<VerticalTabsProbe />)

    const list = screen.getByRole('tablist')
    const overviewTab = screen.getByRole('tab', { name: 'Overview' })
    const trainingTab = screen.getByRole('tab', { name: 'Training' })
    const nutritionTab = screen.getByRole('tab', { name: 'Nutrition' })

    expect(list).toHaveAttribute('aria-orientation', 'vertical')
    expect(list).toHaveAttribute('data-orientation', 'vertical')
    act(() => trainingTab.focus())
    fireEvent.keyDown(trainingTab, { key: 'ArrowDown' })

    await waitFor(() => {
      expect(nutritionTab).toHaveFocus()
      expect(trainingTab).toHaveAttribute('aria-selected', 'true')
      expect(nutritionTab).toHaveAttribute('aria-selected', 'false')
    })

    await act(async () => user.keyboard('{Enter}'))

    await waitFor(() => {
      expect(nutritionTab).toHaveAttribute('aria-selected', 'true')
      expect(list).toHaveAttribute('data-activation-direction', 'down')
    })

    fireEvent.keyDown(nutritionTab, { key: 'ArrowDown' })
    expect(nutritionTab).toHaveFocus()

    fireEvent.keyDown(nutritionTab, { key: 'Home' })
    await waitFor(() => {
      expect(overviewTab).toHaveFocus()
      expect(nutritionTab).toHaveAttribute('aria-selected', 'true')
      expect(overviewTab).toHaveAttribute('aria-selected', 'false')
    })

    await act(async () => user.keyboard(' '))

    await waitFor(() => {
      expect(overviewTab).toHaveAttribute('aria-selected', 'true')
      expect(list).toHaveAttribute('data-activation-direction', 'up')
    })

    fireEvent.keyDown(overviewTab, { key: 'End' })
    await waitFor(() => {
      expect(nutritionTab).toHaveFocus()
      expect(overviewTab).toHaveAttribute('aria-selected', 'true')
      expect(nutritionTab).toHaveAttribute('aria-selected', 'false')
    })
  })

  it('UC-013 / EX-003 / CR-001 - keeps the example layout consumer-owned without adding a public Tabs part', () => {
    render(<VerticalTabsProbe />)

    expect(screen.getByRole('tablist')).toHaveAttribute('aria-orientation', 'vertical')
    expect(screen.getAllByRole('tab')).toHaveLength(3)
    expect(screen.getByRole('tabpanel', { name: 'Training' })).toHaveTextContent('Training content')
    expect(Tabs).not.toHaveProperty('Viewport')
  })

  it('UC-003 - separates horizontal roving focus from Enter and Space activation by default', async () => {
    render(
      <Tabs.Root defaultValue="overview">
        <Tabs.List loopFocus={false}>
          <Tabs.Tab value="overview">Overview</Tabs.Tab>
          <Tabs.Tab value="projects">Projects</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel keepMounted value="overview">
          Overview content
        </Tabs.Panel>
        <Tabs.Panel keepMounted value="projects">
          Projects content
        </Tabs.Panel>
      </Tabs.Root>
    )

    const overviewTab = screen.getByRole('tab', { name: 'Overview' })
    const projectsTab = screen.getByRole('tab', { name: 'Projects' })

    act(() => overviewTab.focus())
    fireEvent.keyDown(overviewTab, { key: 'ArrowRight' })

    await waitFor(() => {
      expect(projectsTab).toHaveFocus()
      expect(overviewTab).toHaveAttribute('aria-selected', 'true')
      expect(projectsTab).toHaveAttribute('aria-selected', 'false')
    })

    fireEvent.keyDown(projectsTab, { key: 'Enter' })
    fireEvent.click(projectsTab)
    await waitFor(() => expect(projectsTab).toHaveAttribute('aria-selected', 'true'))

    fireEvent.keyDown(projectsTab, { key: 'ArrowLeft' })
    await waitFor(() => expect(overviewTab).toHaveFocus())
    fireEvent.keyDown(overviewTab, { key: ' ' })
    fireEvent.click(overviewTab)
    await waitFor(() => expect(overviewTab).toHaveAttribute('aria-selected', 'true'))
  })

  it('UC-004 / EX-001 / CR-004 - applies semantic-free Button default chrome and Heading size sm treatment to the real Tab', () => {
    render(<DefaultTabsProbe />)

    const overviewTab = screen.getByRole('tab', { name: 'Overview' })
    const label = within(overviewTab).getByText('Overview')

    expect(overviewTab.tagName).toBe('BUTTON')
    expect(overviewTab).toHaveAttribute('role', 'tab')
    expect(overviewTab).toHaveClass(
      'bg-background',
      'border',
      'border-foreground',
      'duration-300',
      'focus-visible:outline-foreground',
      'h-10',
      'px-6',
      'py-1',
      'text-foreground',
      'transition-colors'
    )
    expect(label).toHaveClass('text-lg', 'tracking-wide')
    expect(screen.queryByRole('button', { name: 'Overview' })).not.toBeInTheDocument()
  })

  it('UC-005 / EX-004 - derives reveal state with active-first precedence and forwards presentation overrides', () => {
    const onRevealStart = vi.fn()
    const revealAnimation = {
      alignX: 'start',
      direction: 'top-to-bottom',
      offsetX: 4,
      offsetY: -2,
      onRevealStart,
      scale: 1.1,
      unrevealBehavior: 'continue'
    } as const satisfies TabsTabRevealAnimationProps

    render(
      <Tabs.Root defaultValue="training">
        <Tabs.List>
          <Tabs.Tab revealAnimation={revealAnimation} value="overview">
            Overview
          </Tabs.Tab>
          <Tabs.Tab revealAnimation={revealAnimation} value="training">
            Training
          </Tabs.Tab>
          <Tabs.Tab disabled revealAnimation={revealAnimation} value="locked">
            Locked
          </Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="overview">Overview content</Tabs.Panel>
        <Tabs.Panel value="training">Training content</Tabs.Panel>
        <Tabs.Panel value="locked">Locked content</Tabs.Panel>
      </Tabs.Root>
    )

    const overviewTab = screen.getByRole('tab', { name: 'Overview' })
    const trainingTab = screen.getByRole('tab', { name: 'Training' })
    const lockedTab = screen.getByRole('tab', { name: 'Locked' })
    const overviewRevealRoot = getRevealRoot(overviewTab)
    const trainingRevealRoot = getRevealRoot(trainingTab)
    const lockedRevealRoot = getRevealRoot(lockedTab)

    expect(overviewTab).toHaveAttribute('aria-selected', 'false')
    expect(trainingTab).toHaveAttribute('aria-selected', 'true')
    expect(lockedTab).toHaveAttribute('data-disabled')
    for (const revealRoot of [overviewRevealRoot, trainingRevealRoot, lockedRevealRoot]) {
      expect(revealRoot).toHaveAttribute('data-motion', 'reveal')
      expect(revealRoot).toHaveAttribute('data-unreveal-behavior', 'continue')
      expect(revealRoot).not.toHaveAttribute('data-active-unreveal-behavior')
    }
    expect(getCssVariable(getRevealCopy(trainingTab), '--reveal-offset-x')).toBe('4px')
    expect(getCssVariable(getRevealCopy(trainingTab), '--reveal-offset-y')).toBe('-2px')
    expect(getCssVariable(getRevealCopyScale(trainingTab), '--reveal-origin')).toBe('left center')
    expect(getRevealCopyScale(trainingTab)).toHaveStyle({ transform: 'scale(1.1)' })

    onRevealStart.mockClear()
    fireEvent.mouseEnter(overviewTab)

    expect(onRevealStart).toHaveBeenCalledWith(true)

    fireEvent.transitionEnd(getRevealOverlay(overviewTab), { propertyName: 'clip-path' })

    fireEvent.mouseLeave(overviewTab)
    expect(onRevealStart).toHaveBeenLastCalledWith(false)
    expect(overviewRevealRoot).toHaveAttribute('data-active-unreveal-behavior', 'continue')

    onRevealStart.mockClear()
    fireEvent.mouseEnter(lockedTab)
    expect(lockedRevealRoot).not.toHaveAttribute('data-active-unreveal-behavior')
    expect(onRevealStart).not.toHaveBeenCalled()
  })

  it('UC-005 / UC-010 - preserves default reveal inspection while controlling disabled Tab activation', () => {
    const onValueChange = vi.fn()
    const onRevealStart = vi.fn()

    const { rerender } = render(
      <Tabs.Root value="overview" onValueChange={onValueChange}>
        <Tabs.List>
          <Tabs.Tab value="overview">Overview</Tabs.Tab>
          <Tabs.Tab disabled revealAnimation={{ onRevealStart }} value="locked">
            Locked
          </Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="overview">Overview content</Tabs.Panel>
        <Tabs.Panel value="locked">Locked content</Tabs.Panel>
      </Tabs.Root>
    )

    const lockedTab = screen.getByRole('tab', { name: 'Locked' })

    expect(lockedTab).toHaveAttribute('data-disabled')
    expect(lockedTab).toHaveAttribute('aria-disabled', 'true')
    expect(getRevealRoot(lockedTab)).toHaveAttribute('data-motion', 'reveal')
    expect(getRevealRoot(lockedTab)).toHaveAttribute('data-unreveal-behavior', 'return')
    expect(getRevealRoot(lockedTab)).not.toHaveAttribute('data-active-unreveal-behavior')

    fireEvent.click(lockedTab)

    expect(screen.getByRole('tab', { name: 'Overview' })).toHaveAttribute('aria-selected', 'true')
    expect(onValueChange).not.toHaveBeenCalled()
    expect(onRevealStart).not.toHaveBeenCalled()

    rerender(
      <Tabs.Root value="locked" onValueChange={onValueChange}>
        <Tabs.List>
          <Tabs.Tab value="overview">Overview</Tabs.Tab>
          <Tabs.Tab disabled revealAnimation={{ onRevealStart }} value="locked">
            Locked
          </Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="overview">Overview content</Tabs.Panel>
        <Tabs.Panel value="locked">Locked content</Tabs.Panel>
      </Tabs.Root>
    )

    const activeLockedTab = screen.getByRole('tab', { name: 'Locked' })

    expect(activeLockedTab).toHaveAttribute('aria-selected', 'true')
    expect(getRevealRoot(activeLockedTab)).toHaveAttribute('data-unreveal-behavior', 'return')
    expect(getRevealRoot(activeLockedTab)).not.toHaveAttribute('data-active-unreveal-behavior')
    expect(onRevealStart).toHaveBeenCalledOnce()
    expect(onRevealStart).toHaveBeenCalledWith(true)
  })

  it('UC-006 - keeps identity, ARIA, focus, refs, and events on the sole real Tab surface', () => {
    const onClick = vi.fn()
    const tabRef = createRef<HTMLButtonElement>()

    render(
      <Tabs.Root defaultValue="overview">
        <Tabs.List>
          <Tabs.Tab onClick={onClick} ref={tabRef} value="overview">
            Overview
          </Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="overview">Overview content</Tabs.Panel>
      </Tabs.Root>
    )

    const realTab = screen.getByRole('tab', { name: 'Overview' })
    const overlay = getRevealOverlay(realTab)
    const overlaySurface = getRevealOverlaySurface(realTab)

    expect(screen.getAllByRole('tab', { name: 'Overview' })).toHaveLength(1)
    expect(tabRef.current).toBe(realTab)
    expect(realTab).toHaveAttribute('id')
    expect(realTab).toHaveAttribute('aria-controls')
    expect(realTab).toHaveAttribute('aria-selected', 'true')
    expect(overlay).toHaveAttribute('aria-hidden', 'true')
    expect(overlay).toHaveAttribute('inert')
    expect(overlay).toHaveStyle({ pointerEvents: 'none' })
    expect(overlaySurface).toHaveAttribute('data-reveal-overlay-surface')
    expect(overlaySurface).not.toHaveAttribute('id', realTab.id)
    expect(overlaySurface).not.toHaveAttribute('aria-controls')
    expect(overlaySurface).not.toHaveAttribute('aria-selected')
    expect(overlaySurface).not.toHaveAttribute('role', 'tab')

    fireEvent.click(realTab)
    expect(onClick).toHaveBeenCalledOnce()

    fireEvent.click(overlaySurface)
    expect(onClick).toHaveBeenCalledOnce()
  })

  it('UC-006 / UC-011 / EX-005 - renders a duplication-safe link while only the real anchor navigates or activates', () => {
    const linkRef = createRef<HTMLButtonElement>()
    const onClick = vi.fn()

    render(
      <Tabs.Root defaultValue="overview">
        <Tabs.List>
          <Tabs.Tab
            nativeButton={false}
            onClick={onClick}
            ref={linkRef}
            render={<SafeLink href="#overview" />}
            value="overview"
          >
            Overview
          </Tabs.Tab>
          <Tabs.Tab
            nativeButton={false}
            onClick={onClick}
            render={<SafeLink href="#projects" />}
            value="projects"
          >
            Projects
          </Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="overview">Overview content</Tabs.Panel>
        <Tabs.Panel value="projects">Projects content</Tabs.Panel>
      </Tabs.Root>
    )

    const overviewLink = screen.getByRole('tab', { name: 'Overview' })
    const projectsLink = screen.getByRole('tab', { name: 'Projects' })
    const decorativeProjectsLink = getRevealOverlaySurface(projectsLink)

    expect(overviewLink.tagName).toBe('A')
    expect(overviewLink).toHaveAttribute('href', '#overview')
    expect(overviewLink).toHaveAttribute('role', 'tab')
    expect(linkRef.current).toBe(overviewLink)
    expect(projectsLink.tagName).toBe('A')
    expect(projectsLink).toHaveAttribute('href', '#projects')
    expect(decorativeProjectsLink.tagName).toBe('A')
    expect(decorativeProjectsLink).not.toHaveAttribute('href')
    expect(decorativeProjectsLink).not.toHaveAttribute('role', 'tab')

    fireEvent.click(projectsLink)

    expect(projectsLink).toHaveAttribute('aria-selected', 'true')
    expect(onClick).toHaveBeenCalledOnce()

    fireEvent.click(decorativeProjectsLink)
    expect(onClick).toHaveBeenCalledOnce()
  })

  it('UC-006 / UC-011 / EX-005 / CR-007 - gives a duplication-safe function render the exact Base UI Tab state while only the real link acts', async () => {
    const linkRef = createRef<HTMLButtonElement>()
    const onClick = vi.fn()
    const renderStates: TabsTabState[] = []

    render(
      <Tabs.Root defaultValue="overview">
        <Tabs.List>
          <Tabs.Tab value="overview">Overview</Tabs.Tab>
          <Tabs.Tab
            nativeButton={false}
            onClick={onClick}
            ref={linkRef}
            render={(props, state) => {
              renderStates.push(state)

              return (
                <a
                  {...props}
                  data-render-active={state.active ? 'true' : 'false'}
                  href="#projects"
                />
              )
            }}
            value="projects"
          >
            Projects
          </Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="overview">Overview content</Tabs.Panel>
        <Tabs.Panel value="projects">Projects content</Tabs.Panel>
      </Tabs.Root>
    )

    const projectsLink = screen.getByRole('tab', { name: 'Projects' })
    const decorativeProjectsLink = getRevealOverlaySurface(projectsLink)

    expect(renderStates.length).toBeGreaterThanOrEqual(2)
    for (const state of renderStates) {
      expect(state).toEqual({
        active: false,
        disabled: false,
        orientation: 'horizontal',
        tabActivationDirection: 'none'
      })
    }
    expect(projectsLink.tagName).toBe('A')
    expect(projectsLink).toHaveAttribute('href', '#projects')
    expect(projectsLink).toHaveAttribute('id')
    expect(projectsLink).toHaveAttribute('aria-selected', 'false')
    expect(projectsLink).toHaveAttribute('data-render-active', 'false')
    expect(linkRef.current).toBe(projectsLink)
    expect(decorativeProjectsLink.tagName).toBe('A')
    expect(decorativeProjectsLink).toHaveAttribute('data-render-active', 'false')
    expect(decorativeProjectsLink).not.toHaveAttribute('href')
    expect(decorativeProjectsLink).not.toHaveAttribute('id')
    expect(decorativeProjectsLink).not.toHaveAttribute('aria-controls')
    expect(decorativeProjectsLink).not.toHaveAttribute('aria-selected')
    expect(decorativeProjectsLink).not.toHaveAttribute('role')

    renderStates.length = 0
    fireEvent.click(projectsLink)

    await waitFor(() => expect(projectsLink).toHaveAttribute('aria-selected', 'true'))
    expect(onClick).toHaveBeenCalledOnce()
    expect(projectsLink).toHaveAttribute('aria-controls')
    expect(renderStates.length).toBeGreaterThanOrEqual(2)
    for (const state of renderStates) {
      expect(state).toEqual({
        active: true,
        disabled: false,
        orientation: 'horizontal',
        tabActivationDirection: 'none'
      })
    }
    expect(projectsLink).toHaveAttribute('data-render-active', 'true')
    expect(decorativeProjectsLink).toHaveAttribute('data-render-active', 'true')

    fireEvent.click(decorativeProjectsLink)
    expect(onClick).toHaveBeenCalledOnce()
  })

  it('UC-007 / UC-014 / UC-015 / EX-001 / EX-002 / EX-008 / CR-001 - freezes Indicator geometry through exit and retargets an interrupted entry', async () => {
    mockTabRects({
      'indicator-list': { height: 40, left: 20, width: 200 },
      'indicator-overview': { height: 40, left: 20, width: 80 },
      'indicator-projects': { height: 40, left: 100, width: 120 }
    })
    let latestIndicatorState: TabsIndicatorState | undefined

    function IndicatorProbe() {
      const [value, setValue] = useState<TabsValue>('overview')

      return (
        <div>
          <button onClick={() => setValue('projects')} type="button">
            select projects
          </button>
          <button onClick={() => setValue('overview')} type="button">
            select overview
          </button>
          <button onClick={() => setValue(null)} type="button">
            clear
          </button>
          <Tabs.Root value={value} onValueChange={setValue}>
            <Tabs.List data-testid="indicator-list" style={{ height: 40, width: 200 }}>
              <Tabs.Tab
                data-testid="indicator-overview"
                style={{ height: 40, width: 80 }}
                value="overview"
              >
                Overview
              </Tabs.Tab>
              <Tabs.Tab
                data-testid="indicator-projects"
                style={{ height: 40, width: 120 }}
                value="projects"
              >
                Projects
              </Tabs.Tab>
              <Tabs.Indicator
                className={(state) => {
                  latestIndicatorState = state
                  return undefined
                }}
                data-testid="measured-indicator"
              />
            </Tabs.List>
            <Tabs.Panel value="overview">Overview content</Tabs.Panel>
            <Tabs.Panel value="projects">Projects content</Tabs.Panel>
          </Tabs.Root>
        </div>
      )
    }

    render(<IndicatorProbe />)

    await waitFor(() => {
      const indicator = screen.getByTestId('measured-indicator')

      expect(getCssVariable(indicator, '--active-tab-left')).toBe('0px')
      expect(getCssVariable(indicator, '--active-tab-right')).toMatch(/^-?\d+(?:\.\d+)?px$/)
      expect(getCssVariable(indicator, '--active-tab-top')).toMatch(/^-?\d+(?:\.\d+)?px$/)
      expect(getCssVariable(indicator, '--active-tab-bottom')).toMatch(/^-?\d+(?:\.\d+)?px$/)
      expect(getCssVariable(indicator, '--active-tab-width')).toBe('80px')
      expect(getCssVariable(indicator, '--active-tab-height')).toBe('40px')
      expect(getCssVariable(indicator, '--tabs-active-leading-border-offset')).toBe('0px')
      expect(indicator).not.toHaveAttribute('data-starting-style')
    })

    fireEvent.click(screen.getByRole('button', { name: 'select projects' }))

    await waitFor(() => {
      const indicator = screen.getByTestId('measured-indicator')

      expect(getCssVariable(indicator, '--active-tab-left')).toBe('80px')
      expect(getCssVariable(indicator, '--active-tab-right')).toMatch(/^-?\d+(?:\.\d+)?px$/)
      expect(getCssVariable(indicator, '--active-tab-top')).toMatch(/^-?\d+(?:\.\d+)?px$/)
      expect(getCssVariable(indicator, '--active-tab-bottom')).toMatch(/^-?\d+(?:\.\d+)?px$/)
      expect(getCssVariable(indicator, '--active-tab-width')).toBe('120px')
      expect(getCssVariable(indicator, '--active-tab-height')).toBe('40px')
      expect(getCssVariable(indicator, '--tabs-active-leading-border-offset')).toBe('1px')
    })

    const indicator = screen.getByTestId('measured-indicator')
    const frozenVariables = [
      '--active-tab-left',
      '--active-tab-right',
      '--active-tab-top',
      '--active-tab-bottom',
      '--active-tab-width',
      '--active-tab-height',
      '--tabs-active-leading-border-offset'
    ].map((variable) => [variable, getCssVariable(indicator, variable)] as const)

    fireEvent.click(screen.getByRole('button', { name: 'clear' }))

    const exitingIndicator = screen.getByTestId('measured-indicator')

    expect(exitingIndicator).toBe(indicator)
    expect(exitingIndicator).toHaveAttribute('role', 'presentation')
    expect(exitingIndicator).toHaveAttribute('data-ending-style')
    expect(latestIndicatorState?.activeTabPosition).toBeNull()
    expect(latestIndicatorState?.activeTabSize).toBeNull()
    for (const [variable, value] of frozenVariables) {
      expect(getCssVariable(exitingIndicator, variable)).toBe(value)
    }

    fireEvent.click(screen.getByRole('button', { name: 'select overview' }))

    await waitFor(() => {
      const interruptedIndicator = screen.getByTestId('measured-indicator')

      expect(interruptedIndicator).toBe(exitingIndicator)
      expect(interruptedIndicator).toHaveAttribute('data-starting-style')
      expect(interruptedIndicator).not.toHaveAttribute('data-ending-style')
      expect(getCssVariable(interruptedIndicator, '--active-tab-left')).toBe('0px')
      expect(getCssVariable(interruptedIndicator, '--active-tab-width')).toBe('80px')
      expect(getCssVariable(interruptedIndicator, '--tabs-active-leading-border-offset')).toBe(
        '0px'
      )
      expect(latestIndicatorState?.activeTabPosition).not.toBeNull()
      expect(latestIndicatorState?.activeTabSize).not.toBeNull()
    })

    fireEvent.transitionEnd(exitingIndicator, { propertyName: 'translate' })
    expect(screen.getByTestId('measured-indicator')).toBe(exitingIndicator)

    fireEvent.click(screen.getByRole('button', { name: 'clear' }))
    expect(screen.getByTestId('measured-indicator')).toHaveAttribute('data-ending-style')
    fireEvent.transitionEnd(exitingIndicator, { propertyName: 'translate' })

    await waitFor(() => expect(screen.queryByTestId('measured-indicator')).not.toBeInTheDocument())
  })

  it('UC-002 / UC-007 / UC-010 / UC-014 / EX-007 - resolves a custom leading-border offset for following and first Tabs in LTR and RTL', async () => {
    mockTabRects({
      'ltr-fusion-list': { height: 40, left: 0, width: 320 },
      'ltr-fusion-locked': { height: 40, left: 220, width: 100 },
      'ltr-fusion-overview': { height: 40, left: 0, width: 90 },
      'ltr-fusion-projects': { height: 40, left: 90, width: 130 },
      'rtl-fusion-list': { height: 40, left: 0, width: 320 },
      'rtl-fusion-locked': { height: 40, left: 0, width: 100 },
      'rtl-fusion-overview': { height: 40, left: 230, width: 90 },
      'rtl-fusion-projects': { height: 40, left: 100, width: 130 }
    })

    function LogicalBorderFusionProbe() {
      const directions = ['ltr', 'rtl'] as const
      const [values, setValues] = useState<Record<(typeof directions)[number], TabsValue>>({
        ltr: 'projects',
        rtl: 'projects'
      })

      return (
        <div>
          {directions.map((direction) => (
            <section aria-label={`${direction} fusion tabs`} key={direction}>
              <output aria-label={`${direction} active value`}>{values[direction]}</output>
              <Tabs.Root
                data-testid={`${direction}-fusion-root`}
                dir={direction}
                onValueChange={(nextValue) =>
                  setValues((current) => ({ ...current, [direction]: nextValue }))
                }
                value={values[direction]}
              >
                <Tabs.List
                  activateOnFocus
                  data-testid={`${direction}-fusion-list`}
                  style={{ '--tabs-border-width': '3px' } as CSSProperties}
                >
                  <Tabs.Tab data-testid={`${direction}-fusion-overview`} value="overview">
                    Overview
                  </Tabs.Tab>
                  <Tabs.Tab data-testid={`${direction}-fusion-projects`} value="projects">
                    Longer projects label
                  </Tabs.Tab>
                  <Tabs.Tab data-testid={`${direction}-fusion-locked`} disabled value="locked">
                    Locked
                  </Tabs.Tab>
                  <Tabs.Indicator data-testid={`${direction}-fusion-indicator`} />
                </Tabs.List>
                <Tabs.Panel value="overview">Overview content</Tabs.Panel>
                <Tabs.Panel value="projects">Projects content</Tabs.Panel>
                <Tabs.Panel value="locked">Locked content</Tabs.Panel>
              </Tabs.Root>
            </section>
          ))}
        </div>
      )
    }

    render(<LogicalBorderFusionProbe />)

    for (const direction of ['ltr', 'rtl'] as const) {
      const region = screen.getByRole('region', { name: `${direction} fusion tabs` })

      expect(screen.getByTestId(`${direction}-fusion-root`)).toHaveAttribute('dir', direction)
      expect(
        getCssVariable(screen.getByTestId(`${direction}-fusion-list`), '--tabs-border-width')
      ).toBe('3px')
      expect(within(region).getByRole('tab', { name: 'Locked' })).toHaveAttribute('data-disabled')
      await waitFor(() =>
        expect(
          getCssVariable(
            screen.getByTestId(`${direction}-fusion-indicator`),
            '--tabs-active-leading-border-offset'
          )
        ).toBe('3px')
      )

      fireEvent.click(within(region).getByRole('tab', { name: 'Overview' }))

      await waitFor(() => {
        expect(screen.getByLabelText(`${direction} active value`)).toHaveTextContent('overview')
        expect(
          getCssVariable(
            screen.getByTestId(`${direction}-fusion-indicator`),
            '--tabs-active-leading-border-offset'
          )
        ).toBe('0px')
      })
    }
  })

  it('UC-007 / UC-013 / UC-014 / EX-003 / CR-001 - publishes vertical active measurements and logical border offset', async () => {
    const user = userEvent.setup()

    mockTabRects({
      'vertical-nutrition-tab': { height: 36, left: 0, top: 80, width: 140 },
      'vertical-overview-tab': { height: 32, left: 0, top: 0, width: 140 },
      'vertical-training-tab': { height: 48, left: 0, top: 32, width: 140 }
    })
    render(<VerticalTabsProbe />)

    const indicator = screen.getByTestId('vertical-indicator')

    await waitFor(() => {
      expect(getCssVariable(indicator, '--active-tab-top')).toBe('32px')
      expect(getCssVariable(indicator, '--active-tab-height')).toBe('48px')
      expect(getCssVariable(indicator, '--tabs-active-leading-border-offset')).toBe('1px')
    })

    const trainingTab = screen.getByRole('tab', { name: 'Training' })
    const nutritionTab = screen.getByRole('tab', { name: 'Nutrition' })

    act(() => trainingTab.focus())
    fireEvent.keyDown(trainingTab, { key: 'ArrowDown' })

    await waitFor(() => {
      expect(nutritionTab).toHaveFocus()
      expect(trainingTab).toHaveAttribute('aria-selected', 'true')
    })

    await act(async () => user.keyboard('{Enter}'))

    await waitFor(() => {
      expect(nutritionTab).toHaveAttribute('aria-selected', 'true')
      expect(indicator).toHaveAttribute('data-activation-direction', 'down')
      expect(getCssVariable(indicator, '--active-tab-top')).toBe('80px')
      expect(getCssVariable(indicator, '--active-tab-height')).toBe('36px')
      expect(getCssVariable(indicator, '--tabs-active-leading-border-offset')).toBe('1px')
    })

    fireEvent.keyDown(nutritionTab, { key: 'Home' })

    await waitFor(() => {
      expect(screen.getByRole('tab', { name: 'Overview' })).toHaveFocus()
      expect(nutritionTab).toHaveAttribute('aria-selected', 'true')
    })

    const overviewTab = screen.getByRole('tab', { name: 'Overview' })
    await act(async () => user.keyboard(' '))

    await waitFor(() => {
      expect(overviewTab).toHaveAttribute('aria-selected', 'true')
      expect(getCssVariable(indicator, '--tabs-active-leading-border-offset')).toBe('0px')
    })
  })

  it('UC-008 / EX-001 / EX-003 - exposes horizontal and vertical activation direction on every public state surface', async () => {
    const user = userEvent.setup()

    mockTabRects({
      'direction-overview-tab': { height: 40, left: 0, width: 80 },
      'direction-projects-tab': { height: 40, left: 80, width: 120 },
      'vertical-nutrition-tab': { height: 40, left: 0, top: 80, width: 100 },
      'vertical-overview-tab': { height: 40, left: 0, top: 0, width: 100 },
      'vertical-training-tab': { height: 40, left: 0, top: 40, width: 100 }
    })
    const horizontal = render(
      <Tabs.Root data-testid="direction-root" defaultValue="overview">
        <Tabs.List activateOnFocus data-testid="direction-list">
          <Tabs.Tab data-testid="direction-overview-tab" value="overview">
            Overview
          </Tabs.Tab>
          <Tabs.Tab data-testid="direction-projects-tab" value="projects">
            Projects
          </Tabs.Tab>
          <Tabs.Indicator data-testid="direction-indicator" />
        </Tabs.List>
        <Tabs.Panel keepMounted value="overview">
          Overview content
        </Tabs.Panel>
        <Tabs.Panel keepMounted value="projects">
          Projects content
        </Tabs.Panel>
      </Tabs.Root>
    )

    const overviewTab = screen.getByRole('tab', { name: 'Overview' })

    act(() => overviewTab.focus())
    fireEvent.keyDown(overviewTab, { key: 'ArrowRight' })

    await waitFor(() => {
      expect(screen.getByTestId('direction-root')).toHaveAttribute(
        'data-activation-direction',
        'right'
      )
      expect(screen.getByTestId('direction-list')).toHaveAttribute(
        'data-activation-direction',
        'right'
      )
      expect(screen.getByRole('tab', { name: 'Projects' })).toHaveAttribute(
        'data-activation-direction',
        'right'
      )
      expect(screen.getByRole('tabpanel', { name: 'Projects' })).toHaveAttribute(
        'data-activation-direction',
        'right'
      )
      expect(screen.getByTestId('direction-indicator')).toHaveAttribute(
        'data-activation-direction',
        'right'
      )
    })

    horizontal.unmount()
    render(<VerticalTabsProbe />)

    const trainingTab = screen.getByRole('tab', { name: 'Training' })
    const nutritionTab = screen.getByRole('tab', { name: 'Nutrition' })

    act(() => trainingTab.focus())
    fireEvent.keyDown(trainingTab, { key: 'ArrowDown' })

    await waitFor(() => {
      expect(nutritionTab).toHaveFocus()
      expect(trainingTab).toHaveAttribute('aria-selected', 'true')
    })

    await act(async () => user.keyboard('{Enter}'))

    await waitFor(() => {
      expect(screen.getByRole('tabpanel', { name: 'Nutrition' })).toHaveAttribute(
        'data-activation-direction',
        'down'
      )
    })
  })

  it('UC-009 / EX-006 - keeps inactive Panels mounted, hidden, and inert through rapid controlled changes', async () => {
    render(<PersistentTabsProbe />)

    const firstPanel = screen.getByTestId('persistent-first-panel')
    const secondPanel = screen.getByTestId('persistent-second-panel')

    expect(firstPanel).toHaveAttribute('tabindex', '0')
    expect(firstPanel).not.toHaveAttribute('inert')
    expect(secondPanel).toHaveAttribute('tabindex', '-1')
    expect(secondPanel).toHaveAttribute('inert')

    fireEvent.click(screen.getByRole('button', { name: 'second' }))
    fireEvent.click(screen.getByRole('button', { name: 'first' }))
    fireEvent.click(screen.getByRole('button', { name: 'second' }))

    expect(screen.getByLabelText('current persistent value')).toHaveTextContent('second')
    expect(firstPanel).toBeInTheDocument()
    expect(secondPanel).toBeInTheDocument()

    await waitFor(() => {
      expect(firstPanel).toHaveAttribute('tabindex', '-1')
      expect(firstPanel).toHaveAttribute('inert')
      expect(secondPanel).toHaveAttribute('tabindex', '0')
      expect(secondPanel).not.toHaveAttribute('inert')
    })
  })

  it('UC-009 - keeps every interrupted outgoing Panel mounted until its own CSS exit completes', async () => {
    const panelTransition = { transition: 'opacity 175ms ease' }
    const panelAnimations = mockPanelAnimations()

    render(
      <Tabs.Root defaultValue="first">
        <Tabs.List>
          <Tabs.Tab value="first">First</Tabs.Tab>
          <Tabs.Tab value="second">Second</Tabs.Tab>
          <Tabs.Tab value="third">Third</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel data-testid="interrupt-first-panel" style={panelTransition} value="first">
          First content
        </Tabs.Panel>
        <Tabs.Panel data-testid="interrupt-second-panel" style={panelTransition} value="second">
          Second content
        </Tabs.Panel>
        <Tabs.Panel data-testid="interrupt-third-panel" style={panelTransition} value="third">
          Third content
        </Tabs.Panel>
      </Tabs.Root>
    )

    fireEvent.click(screen.getByRole('tab', { name: 'Second' }))
    const firstPanel = screen.getByTestId('interrupt-first-panel')

    expect(firstPanel).toHaveAttribute('data-ending-style')
    await waitFor(() => expect(panelAnimations.hasObserved('interrupt-first-panel')).toBe(true))

    fireEvent.click(screen.getByRole('tab', { name: 'Third' }))
    const secondPanel = screen.getByTestId('interrupt-second-panel')

    expect(firstPanel).toBeInTheDocument()
    expect(secondPanel).toHaveAttribute('data-ending-style')
    expect(screen.getByRole('tabpanel', { name: 'Third' })).toHaveAttribute('tabindex', '0')
    await waitFor(() => expect(panelAnimations.hasObserved('interrupt-second-panel')).toBe(true))

    panelAnimations.finish('interrupt-first-panel')
    panelAnimations.finish('interrupt-second-panel')

    await waitFor(() => {
      expect(screen.queryByText('First content')).not.toBeInTheDocument()
      expect(screen.queryByText('Second content')).not.toBeInTheDocument()
    })
  })

  it('UC-008 / EX-003 / CR-001 / CR-002 - exposes vertical Panel direction and lifecycle during down and up activation', async () => {
    const user = userEvent.setup()

    let nextAnimationFrameId = 1
    const animationFrameCallbacks = new Map<number, FrameRequestCallback>()

    vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback): number => {
      const id = nextAnimationFrameId
      nextAnimationFrameId += 1
      animationFrameCallbacks.set(id, callback)
      return id
    })
    vi.stubGlobal('cancelAnimationFrame', (id: number) => {
      animationFrameCallbacks.delete(id)
    })

    mockTabRects({
      'vertical-nutrition-tab': { height: 40, left: 0, top: 80, width: 100 },
      'vertical-overview-tab': { height: 40, left: 0, top: 0, width: 100 },
      'vertical-training-tab': { height: 40, left: 0, top: 40, width: 100 }
    })
    const panelAnimations = mockPanelAnimations({ holdDirectionalAnimations: true })
    render(<VerticalTabsProbe />)

    const trainingTab = screen.getByRole('tab', { name: 'Training' })
    const nutritionTab = screen.getByRole('tab', { name: 'Nutrition' })
    const trainingPanel = screen.getByTestId('vertical-training-panel')
    const nutritionPanel = screen.getByTestId('vertical-nutrition-panel')

    act(() => trainingTab.focus())
    await act(async () => {
      fireEvent.keyDown(trainingTab, { key: 'ArrowDown' })
      await Promise.resolve()
    })

    expect(nutritionTab).toHaveFocus()
    expect(trainingTab).toHaveAttribute('aria-selected', 'true')

    await act(async () => user.keyboard('{Enter}'))

    expect(nutritionPanel).toHaveAttribute('data-starting-style')
    expect(trainingPanel).toHaveAttribute('data-ending-style')

    await act(async () => {
      const currentAnimationFrameCallbacks = [...animationFrameCallbacks.values()]
      animationFrameCallbacks.clear()

      for (const callback of currentAnimationFrameCallbacks) {
        callback(performance.now())
      }
      await Promise.resolve()
    })

    await waitFor(() => {
      expect(nutritionPanel).toHaveAttribute('data-orientation', 'vertical')
      expect(nutritionPanel).toHaveAttribute('data-activation-direction', 'down')
      expect(trainingPanel).toHaveAttribute('data-activation-direction', 'down')
      expect(panelAnimations.hasObserved('vertical-nutrition-panel')).toBe(true)
      expect(panelAnimations.hasObserved('vertical-training-panel')).toBe(true)
    })

    fireEvent.keyDown(nutritionTab, { key: 'ArrowUp' })

    await waitFor(() => {
      expect(trainingTab).toHaveFocus()
      expect(nutritionTab).toHaveAttribute('aria-selected', 'true')
    })

    await act(async () => user.keyboard(' '))

    await waitFor(() => {
      expect(trainingPanel).toHaveAttribute('data-activation-direction', 'up')
      expect(nutritionPanel).toHaveAttribute('data-activation-direction', 'up')
    })
  })
})
