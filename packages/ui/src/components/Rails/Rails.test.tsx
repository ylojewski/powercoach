import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import {
  createRef,
  forwardRef,
  useCallback,
  useEffect,
  useState,
  type ComponentPropsWithoutRef,
  type ComponentPropsWithRef,
  type ComponentType,
  type CSSProperties,
  type Ref,
  type ReactElement,
  type ReactNode
} from 'react'

import * as PackageExports from '../..'
import {
  type Rails as PublicRails,
  type RailsHeaderProps,
  type RailsHeaderState,
  type RailsItemChangeEventDetails,
  type RailsItemChangeEventReason,
  type RailsItemProps as PublicRailsItemProps,
  type RailsItemState,
  type RailsListProps,
  type RailsPanelProps,
  type RailsPanelState,
  type RailsOrientation,
  type RailsRailProps as PublicRailsRailProps,
  type RailsRailState,
  type RailsRootChangeEventDetails,
  type RailsRootChangeEventReason,
  type RailsRootProps as PublicRailsRootProps,
  type RailsRootState,
  type RailsRootValue
} from '../..'

interface RailsPackageContract {
  Components: typeof PackageExports.Components & {
    Rails: RailsNamespace
  }
  Rails: RailsNamespace
  RailsHeader: RailsNamespace['Header']
  RailsItem: RailsNamespace['Item']
  RailsList: RailsNamespace['List']
  RailsPanel: RailsNamespace['Panel']
  RailsRail: RailsNamespace['Rail']
  RailsRoot: RailsNamespace['Root']
  Ui: typeof PackageExports.Ui & {
    Components: typeof PackageExports.Components & {
      Rails: RailsNamespace
    }
  }
}

interface RailsNamespace {
  Header: ComponentType<RailsPartProps>
  Item: ComponentType<RailsItemProps>
  List: ComponentType<RailsNativeDivProps>
  Panel: ComponentType<RailsPartProps>
  Root: ComponentType<RailsRootProps>
  Rail: ComponentType<RailsRailProps>
}

interface RailsChangeEventDetails {
  allowPropagation: () => void
  cancel: () => void
  event: Event
  isCanceled: boolean
  isPropagationAllowed: boolean
  reason: 'trigger-press' | 'none'
  trigger: Element | undefined
}

interface RailsPartProps {
  [key: string]: unknown
  children?: ReactNode
  className?: string | ((state: unknown) => string | undefined)
  render?: ReactElement | ((props: Record<string, unknown>, state: unknown) => ReactElement)
  style?: CSSProperties | ((state: unknown) => CSSProperties | undefined)
}

interface RailsRootProps extends RailsPartProps {
  defaultValue?: string[]
  disabled?: boolean
  hiddenUntilFound?: boolean
  keepMounted?: boolean
  onValueChange?: (value: string[], eventDetails: RailsChangeEventDetails) => void
  orientation?: RailsOrientation
  ref?: Ref<HTMLDivElement>
  value?: string[]
}

interface RailsItemProps extends RailsPartProps {
  disabled?: boolean
  onOpenChange?: (open: boolean, eventDetails: RailsChangeEventDetails) => void
  value: string
}

interface RailsRailProps extends RailsPartProps {
  nativeButton?: boolean
}

interface RailsNativeDivProps extends ComponentPropsWithRef<'div'> {
  children?: ReactNode
}

interface RouterLinkProps extends Omit<ComponentPropsWithoutRef<'a'>, 'href'> {
  to: string
}

type RailsRailOmitsRevealControls =
  Extract<'direction' | 'revealAnimation', keyof PublicRailsRailProps> extends never ? true : false
type RailsRootOmitsIndicator =
  Extract<'indicator', keyof PublicRailsRootProps> extends never ? true : false
type RailsNamespaceOmitsIndicator =
  Extract<'Indicator', keyof typeof PackageExports.Rails> extends never ? true : false

const PACKAGE_EXPORTS = PackageExports as typeof PackageExports & RailsPackageContract
const Rails = PACKAGE_EXPORTS.Rails as RailsNamespace
const REVEALED_CLIP_PATH = 'inset(0 0 0 0)'
const LEFT_TO_RIGHT_HIDDEN_CLIP_PATH = 'inset(0 100% 0 0)'
const TOP_TO_BOTTOM_HIDDEN_CLIP_PATH = 'inset(0 0 100% 0)'
const REVEAL_COPY_SCALE_AXIS_CLASS_PREFIX =
  '[&[data-reveal-overlay-surface]_[data-reveal-copy-scale]]:'
const CSS_ABSOLUTE_LENGTH_TO_PX = {
  cm: 96 / 2.54,
  in: 96,
  mm: 96 / 25.4,
  pc: 16,
  pt: 96 / 72,
  px: 1,
  q: 96 / 101.6
} as const
const ORIGINAL_GET_ANIMATIONS = HTMLElement.prototype.getAnimations
const ORIGINAL_GET_COMPUTED_STYLE = globalThis.getComputedStyle

interface RailsElementRect {
  height?: number
  left: number
  top?: number
  width: number
}

const RouterLink = forwardRef<HTMLAnchorElement, RouterLinkProps>(({ to, ...props }, ref) => (
  <a href={to} ref={ref} {...props} />
))

RouterLink.displayName = 'RouterLink'

function getRequiredElement<TElement extends Element>(
  element: TElement | null,
  message: string
): TElement {
  if (element === null) {
    throw new Error(message)
  }

  return element
}

function getRevealRoot(trigger: HTMLElement): HTMLElement {
  return getRequiredElement(
    trigger.closest<HTMLElement>('[data-motion="reveal"]'),
    `Expected ${trigger.textContent ?? 'trigger'} to be wrapped in RevealAnimation`
  )
}

function getRevealOverlay(trigger: HTMLElement): HTMLElement {
  return getRequiredElement(
    getRevealRoot(trigger).querySelector<HTMLElement>('[data-reveal-overlay]'),
    `Expected ${trigger.textContent ?? 'trigger'} RevealAnimation overlay`
  )
}

function getRevealOverlaySurface(trigger: HTMLElement): HTMLElement {
  return getRequiredElement(
    getRevealRoot(trigger).querySelector<HTMLElement>('[data-reveal-overlay-surface]'),
    `Expected ${trigger.textContent ?? 'trigger'} RevealAnimation overlay surface`
  )
}

function getRevealSource(trigger: HTMLElement): HTMLElement {
  return getRequiredElement(
    getRevealRoot(trigger).querySelector<HTMLElement>('[data-reveal-source]'),
    `Expected ${trigger.textContent ?? 'trigger'} RevealAnimation source title`
  )
}

function getRevealCopyScale(trigger: HTMLElement): HTMLElement {
  return getRequiredElement(
    getRevealRoot(trigger).querySelector<HTMLElement>('[data-reveal-copy-scale]'),
    `Expected ${trigger.textContent ?? 'trigger'} RevealAnimation copied content scale`
  )
}

function getFirstHtmlElementChild(element: HTMLElement, message: string): HTMLElement {
  return getRequiredElement(element.firstElementChild as HTMLElement | null, message)
}

function getInsetTopAxisClass(element: HTMLElement, message: string): string {
  const topAxisClass = Array.from(element.classList).find(
    (className) => className.startsWith('top-') && className !== 'top-0'
  )

  if (topAxisClass === undefined) {
    throw new Error(message)
  }

  return topAxisClass
}

function getRevealCopyScaleInsetTopAxisClass(trigger: HTMLElement): string {
  const overlaySurface = getRevealOverlaySurface(trigger)
  const topAxisClass = Array.from(overlaySurface.classList).find(
    (className) =>
      className.startsWith(`${REVEAL_COPY_SCALE_AXIS_CLASS_PREFIX}top-`) &&
      className !== `${REVEAL_COPY_SCALE_AXIS_CLASS_PREFIX}top-0`
  )

  if (topAxisClass === undefined) {
    throw new Error(
      `Expected ${trigger.textContent ?? 'trigger'} revealed title to use an inset top-edge axis`
    )
  }

  return topAxisClass.slice(REVEAL_COPY_SCALE_AXIS_CLASS_PREFIX.length)
}

function getCssClipPath(element: HTMLElement): string {
  return element.style.clipPath || getComputedStyle(element).clipPath
}

function getCssTransform(element: HTMLElement): string {
  return element.style.transform || getComputedStyle(element).transform
}

function getCssTransitionTimingFunction(element: HTMLElement): string {
  return (
    element.style.transitionTimingFunction || getComputedStyle(element).transitionTimingFunction
  ).replaceAll(' ', '')
}

function expectClipPath(element: HTMLElement, clipPath: string) {
  expect(getCssClipPath(element)).toBe(clipPath)
}

function getCssVariable(element: HTMLElement, propertyName: string): string {
  return element.style.getPropertyValue(propertyName).trim()
}

function getEffectivePanelMotionSize(panel: HTMLElement, orientation: RailsOrientation): string {
  const computedStyle = getComputedStyle(panel)
  const property = orientation === 'vertical' ? 'width' : 'height'
  const variable = orientation === 'vertical' ? '--rails-panel-width' : '--rails-panel-height'
  const value = computedStyle[property] || panel.style[property]

  return value === `var(${variable})` ? getCssVariable(panel, variable) : value
}

function hasSuppressedSizeTransition(panel: HTMLElement): boolean {
  const computedStyle = getComputedStyle(panel)
  const transitionProperties = (computedStyle.transitionProperty || panel.style.transitionProperty)
    .split(',')
    .map((property) => property.trim())

  if (
    transitionProperties.length > 0 &&
    transitionProperties.every((property) => property === '' || property === 'none')
  ) {
    return true
  }

  const transitionDurations = (computedStyle.transitionDuration || panel.style.transitionDuration)
    .split(',')
    .map((duration) => duration.trim())

  return (
    transitionDurations.length > 0 &&
    transitionDurations.every((duration) => /^0(?:\.0+)?(?:ms|s)$/.test(duration))
  )
}

function resolveAbsoluteCssLength(value: string): number | undefined {
  const match = value
    .trim()
    .toLowerCase()
    .match(/^(-?\d+(?:\.\d+)?)(cm|in|mm|pc|pt|px|q)$/)

  if (match === null) {
    return undefined
  }

  const amount = Number.parseFloat(match[1] ?? '')
  const unit = match[2] as keyof typeof CSS_ABSOLUTE_LENGTH_TO_PX

  return amount * CSS_ABSOLUTE_LENGTH_TO_PX[unit]
}

function resolveElementCssLength(element: HTMLElement, value: string): number | undefined {
  const directValue = resolveAbsoluteCssLength(value)

  if (directValue !== undefined) {
    return directValue
  }

  const computedStyle = getComputedStyle(element)
  const expression = value.replaceAll(
    /var\((--[\w-]+)(?:,\s*([^)]+))?\)/g,
    (_match, propertyName: string, fallbackValue: string | undefined) => {
      const inheritedValue = computedStyle.getPropertyValue(propertyName).trim()
      const listValue = element
        .closest<HTMLElement>('[data-rails-list]')
        ?.style.getPropertyValue(propertyName)
        .trim()

      return inheritedValue || listValue || fallbackValue?.trim() || '0px'
    }
  )
  const resolvedExpression = resolveAbsoluteCssLength(expression)

  if (resolvedExpression !== undefined) {
    return resolvedExpression
  }

  const calcMatch = expression.match(/^calc\((.*)\)$/)

  if (calcMatch === null) {
    return undefined
  }

  const calcExpression = calcMatch[1] ?? ''
  const termPattern = /[+-]?\s*\d+(?:\.\d+)?(?:cm|in|mm|pc|pt|px|q)/gi
  const terms = calcExpression.match(termPattern)

  if (terms === null || calcExpression.replace(termPattern, '').replaceAll(/\s/g, '') !== '') {
    return undefined
  }

  return terms.reduce((total, term) => {
    const normalizedTerm = term.replaceAll(/\s/g, '')
    const resolvedTerm = resolveAbsoluteCssLength(normalizedTerm.replace(/^\+/, ''))

    return total + (resolvedTerm ?? 0)
  }, 0)
}

function getResolvedCssLength(element: HTMLElement, propertyNames: string[]): number {
  const computedStyle = getComputedStyle(element)

  for (const propertyName of propertyNames) {
    const values = [
      element.style.getPropertyValue(propertyName).trim(),
      computedStyle.getPropertyValue(propertyName).trim()
    ]

    for (const value of values) {
      const resolved = resolveElementCssLength(element, value)

      if (resolved !== undefined) {
        return resolved
      }
    }
  }

  return 0
}

function getRailAxisBorderWidth(
  surface: HTMLElement,
  orientation: RailsOrientation,
  edge: 'start' | 'end'
): number {
  const vertical = orientation === 'vertical'
  const propertyNames = vertical
    ? edge === 'start'
      ? ['border-inline-start-width', 'border-left-width']
      : ['border-inline-end-width', 'border-right-width']
    : edge === 'start'
      ? ['border-top-width']
      : ['border-bottom-width']
  const list = surface.closest<HTMLElement>('[data-rails-list]')
  const configuredBorderWidth =
    resolveAbsoluteCssLength(list?.style.getPropertyValue('--rails-border-width').trim() ?? '') ?? 1

  for (const propertyName of propertyNames) {
    const resolved = resolveElementCssLength(
      surface,
      surface.style.getPropertyValue(propertyName).trim()
    )

    if (resolved !== undefined) {
      return resolved
    }
  }

  const shorthandWidth = resolveElementCssLength(surface, surface.style.borderWidth)

  return shorthandWidth ?? configuredBorderWidth
}

function getRenderedRailTitleAxisPosition(
  title: HTMLElement,
  orientation: RailsOrientation
): number {
  const surface = getRequiredElement(
    title.closest<HTMLElement>('[data-reveal-source], [data-reveal-overlay-surface]'),
    `Expected ${title.textContent ?? 'Rail title'} inside a rendered Rail surface`
  )
  const rect = surface.getBoundingClientRect()
  const vertical = orientation === 'vertical'
  const outerStart = vertical ? rect.left : rect.top
  const outerSize = vertical ? rect.width : rect.height

  if (vertical) {
    return outerStart + outerSize / 2
  }

  const borderStart = getRailAxisBorderWidth(surface, orientation, 'start')
  const borderEnd = getRailAxisBorderWidth(surface, orientation, 'end')
  const paddingStart = getResolvedCssLength(surface, ['padding-top', 'padding-block', 'padding'])
  const paddingEnd = getResolvedCssLength(surface, ['padding-bottom', 'padding-block', 'padding'])
  const contentStart = borderStart + paddingStart
  const contentEnd = borderEnd + paddingEnd

  return outerStart + contentStart + (outerSize - contentStart - contentEnd) / 2
}

function mockRenderedRailTitleRect(title: HTMLElement, orientation: RailsOrientation) {
  Object.defineProperty(title, 'getBoundingClientRect', {
    configurable: true,
    value: () => {
      const axisPosition = getRenderedRailTitleAxisPosition(title, orientation)

      return createRailsRect({
        height: 20,
        left: orientation === 'vertical' ? axisPosition : 0,
        top: orientation === 'horizontal' ? axisPosition : 0,
        width: 20
      })
    }
  })
}

function expectCompleteRailAxisBorders(
  surface: HTMLElement,
  orientation: RailsOrientation,
  borderWidth: number
) {
  expect(getRailAxisBorderWidth(surface, orientation, 'start')).toBeCloseTo(borderWidth)
  expect(getRailAxisBorderWidth(surface, orientation, 'end')).toBeCloseTo(borderWidth)
}

function getRailsItemStartMargin(item: HTMLElement, orientation: RailsOrientation): number {
  const computedStyle = getComputedStyle(item)
  const value =
    orientation === 'vertical' ? computedStyle.marginInlineStart : computedStyle.marginBlockStart

  return resolveAbsoluteCssLength(value) ?? 0
}

function mockRailsItemStartMargins() {
  vi.spyOn(globalThis, 'getComputedStyle').mockImplementation((element, pseudoElement) => {
    const computedStyle = ORIGINAL_GET_COMPUTED_STYLE(element, pseudoElement)

    if (!(element instanceof HTMLElement)) {
      return computedStyle
    }

    const list = element.parentElement

    if (list?.hasAttribute('data-rails-list') !== true || !element.hasAttribute('data-index')) {
      return computedStyle
    }

    const orientation = list.closest<HTMLElement>('[data-orientation]')?.dataset.orientation
    const configuredBorderWidth =
      resolveAbsoluteCssLength(list.style.getPropertyValue('--rails-border-width').trim()) ?? 1
    const hasPrecedingItem = Array.from(list.children).some(
      (sibling) => sibling !== element && sibling.nextElementSibling === element
    )
    const startMargin = `${hasPrecedingItem ? -configuredBorderWidth : 0}px`

    return new Proxy(computedStyle, {
      get(target, property) {
        if (property === 'marginInlineStart' && orientation === 'vertical') {
          return startMargin
        }

        if (property === 'marginBlockStart' && orientation === 'horizontal') {
          return startMargin
        }

        if (property === 'getPropertyValue') {
          return (propertyName: string) => {
            if (propertyName === 'margin-inline-start' && orientation === 'vertical') {
              return startMargin
            }

            if (propertyName === 'margin-block-start' && orientation === 'horizontal') {
              return startMargin
            }

            return target.getPropertyValue(propertyName)
          }
        }

        const value = Reflect.get(target, property, target)

        return typeof value === 'function' ? value.bind(target) : value
      }
    })
  })
}

function expectMeasuredPanelWidthVariables(panel: HTMLElement) {
  const railsPanelWidth = getCssVariable(panel, '--rails-panel-width')
  const baseAccordionPanelWidth = getCssVariable(panel, '--accordion-panel-width')

  expect(railsPanelWidth).toMatch(/^\d+(?:\.\d+)?px$/)
  expect(baseAccordionPanelWidth).toBe(railsPanelWidth)
}

function expectMeasuredPanelHeightVariables(panel: HTMLElement) {
  const railsPanelHeight = getCssVariable(panel, '--rails-panel-height')
  const baseAccordionPanelHeight = getCssVariable(panel, '--accordion-panel-height')

  expect(railsPanelHeight).toMatch(/^\d+(?:\.\d+)?px$/)
  expect(baseAccordionPanelHeight).toBe(railsPanelHeight)
}

function createRailsRect({ height = 40, left, top = 0, width }: RailsElementRect): DOMRect {
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

function mockRailsRects(rectsByTestId: Record<string, RailsElementRect>) {
  mockRailsItemStartMargins()
  vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function (
    this: HTMLElement
  ) {
    const testId = this.getAttribute('data-testid')
    const rect = testId ? rectsByTestId[testId] : undefined

    return createRailsRect(rect ?? { height: 0, left: 0, width: 0 })
  })
}

function DefaultRailsProbe() {
  return (
    <div className="h-100 w-100">
      <Rails.Root data-testid="rail-root" defaultValue={['overview']}>
        <Rails.List data-testid="rail-list">
          <Rails.Item data-testid="rail-item-overview" value="overview">
            <Rails.Header data-testid="rail-header-overview">
              <Rails.Rail>Overview</Rails.Rail>
            </Rails.Header>
            <Rails.Panel data-testid="rail-panel-overview">
              <div className="p-4" data-testid="rail-panel-overview-content">
                Overview content
              </div>
            </Rails.Panel>
          </Rails.Item>

          <Rails.Item data-testid="rail-item-training" value="training">
            <Rails.Header data-testid="rail-header-training">
              <Rails.Rail>Training</Rails.Rail>
            </Rails.Header>
            <Rails.Panel data-testid="rail-panel-training">
              <div className="p-4">Training content</div>
            </Rails.Panel>
          </Rails.Item>

          <Rails.Item data-testid="rail-item-nutrition" value="nutrition">
            <Rails.Header data-testid="rail-header-nutrition">
              <Rails.Rail>Nutrition</Rails.Rail>
            </Rails.Header>
            <Rails.Panel data-testid="rail-panel-nutrition">
              <div className="p-4">Nutrition content</div>
            </Rails.Panel>
          </Rails.Item>
        </Rails.List>
      </Rails.Root>
    </div>
  )
}

function ControlledRailsProbe() {
  const [value, setValue] = useState<string[]>([])

  return (
    <div>
      <button type="button" onClick={() => setValue([])}>
        collapse all
      </button>
      <button type="button" onClick={() => setValue(['programs'])}>
        open programs
      </button>
      <output aria-label="active item">{value[0] ?? 'none'}</output>

      <div className="h-100 w-100">
        <Rails.Root data-testid="controlled-root" onValueChange={setValue} value={value}>
          <Rails.List data-testid="controlled-list">
            <Rails.Item data-testid="controlled-item-programs" value="programs">
              <Rails.Header data-testid="controlled-header-programs">
                <Rails.Rail>Programs</Rails.Rail>
              </Rails.Header>
              <Rails.Panel data-testid="controlled-panel-programs">
                <div className="p-4">Programs panel</div>
              </Rails.Panel>
            </Rails.Item>

            <Rails.Item data-testid="controlled-item-athletes" value="athletes">
              <Rails.Header data-testid="controlled-header-athletes">
                <Rails.Rail>Athletes</Rails.Rail>
              </Rails.Header>
              <Rails.Panel data-testid="controlled-panel-athletes">
                <div className="p-4">Athletes panel</div>
              </Rails.Panel>
            </Rails.Item>
          </Rails.List>
        </Rails.Root>
      </div>
    </div>
  )
}

function StableRailsMotionProbe() {
  return (
    <div className="h-100 w-100">
      <Rails.Root data-testid="fusion-root" defaultValue={['training']}>
        <Rails.List
          data-testid="fusion-list"
          style={{ '--rails-border-width': '3px' } as CSSProperties}
        >
          <Rails.Item data-testid="fusion-item-overview" value="overview">
            <Rails.Header data-testid="fusion-header-overview">
              <Rails.Rail>Overview</Rails.Rail>
            </Rails.Header>
            <Rails.Panel>Overview content</Rails.Panel>
          </Rails.Item>

          <Rails.Item data-testid="fusion-item-training" value="training">
            <Rails.Header data-testid="fusion-header-training">
              <Rails.Rail className="w-14">Training</Rails.Rail>
            </Rails.Header>
            <Rails.Panel>Training content</Rails.Panel>
          </Rails.Item>

          <Rails.Item data-testid="fusion-item-nutrition" value="nutrition">
            <Rails.Header data-testid="fusion-header-nutrition">
              <Rails.Rail>Nutrition</Rails.Rail>
            </Rails.Header>
            <Rails.Panel>Nutrition content</Rails.Panel>
          </Rails.Item>
        </Rails.List>
      </Rails.Root>
    </div>
  )
}

function HorizontalRailsProbe() {
  const [value, setValue] = useState<string[]>(['training'])

  return (
    <div>
      <button type="button" onClick={() => setValue([])}>
        collapse horizontal all
      </button>
      <button type="button" onClick={() => setValue(['programs'])}>
        open horizontal programs
      </button>
      <output aria-label="horizontal active Rail">{value[0] ?? 'none'}</output>

      <div className="h-100 w-100">
        <Rails.Root
          data-testid="horizontal-root"
          onValueChange={setValue}
          orientation="horizontal"
          value={value}
        >
          <Rails.List
            data-testid="horizontal-list"
            style={{ '--rails-border-width': '3px' } as CSSProperties}
          >
            <Rails.Item data-testid="horizontal-item-overview" value="overview">
              <Rails.Header data-testid="horizontal-header-overview">
                <Rails.Rail>Horizontal Overview</Rails.Rail>
              </Rails.Header>
              <Rails.Panel data-testid="horizontal-panel-overview">
                <div data-testid="horizontal-content-overview">
                  Overview content keeps its final layout
                </div>
              </Rails.Panel>
            </Rails.Item>

            <Rails.Item data-testid="horizontal-item-training" value="training">
              <Rails.Header data-testid="horizontal-header-training">
                <Rails.Rail className="h-14">Horizontal Training</Rails.Rail>
              </Rails.Header>
              <Rails.Panel data-testid="horizontal-panel-training">
                <div data-testid="horizontal-content-training">
                  Training content keeps its final layout
                </div>
              </Rails.Panel>
            </Rails.Item>

            <Rails.Item data-testid="horizontal-item-programs" value="programs">
              <Rails.Header data-testid="horizontal-header-programs">
                <Rails.Rail>Horizontal Programs</Rails.Rail>
              </Rails.Header>
              <Rails.Panel data-testid="horizontal-panel-programs">
                <div data-testid="horizontal-content-programs">
                  Programs content keeps its final layout
                </div>
              </Rails.Panel>
            </Rails.Item>
          </Rails.List>
        </Rails.Root>
      </div>
    </div>
  )
}

function ConstrainedHorizontalRailsProbe() {
  return (
    <div>
      <output>Expected open Panel height: 2px</output>
      <div className="h-30 w-100">
        <Rails.Root
          data-testid="constrained-horizontal-root"
          defaultValue={['overview']}
          orientation="horizontal"
        >
          <Rails.List data-testid="constrained-horizontal-list">
            <Rails.Item data-testid="constrained-horizontal-item-overview" value="overview">
              <Rails.Header data-testid="constrained-horizontal-header-overview">
                <Rails.Rail>Constrained Overview</Rails.Rail>
              </Rails.Header>
              <Rails.Panel data-testid="constrained-horizontal-panel-overview">
                <div>This content is clipped from view</div>
              </Rails.Panel>
            </Rails.Item>
            <Rails.Item data-testid="constrained-horizontal-item-training" value="training">
              <Rails.Header data-testid="constrained-horizontal-header-training">
                <Rails.Rail>Constrained Training</Rails.Rail>
              </Rails.Header>
              <Rails.Panel>Training content</Rails.Panel>
            </Rails.Item>
            <Rails.Item data-testid="constrained-horizontal-item-nutrition" value="nutrition">
              <Rails.Header data-testid="constrained-horizontal-header-nutrition">
                <Rails.Rail>Constrained Nutrition</Rails.Rail>
              </Rails.Header>
              <Rails.Panel>Nutrition content</Rails.Panel>
            </Rails.Item>
          </Rails.List>
        </Rails.Root>
      </div>
    </div>
  )
}

function DefaultPanelLifecycleProbe({ panelRef }: { panelRef: Ref<HTMLDivElement> }) {
  const [value, setValue] = useState<string[]>(['programs'])

  return (
    <div className="h-100 w-100">
      <button type="button" onClick={() => setValue(['programs'])}>
        open programs lifecycle
      </button>
      <button type="button" onClick={() => setValue([])}>
        collapse programs lifecycle
      </button>

      <Rails.Root
        data-testid="lifecycle-root"
        onValueChange={setValue}
        orientation="horizontal"
        value={value}
      >
        <Rails.List data-testid="lifecycle-list">
          <Rails.Item value="programs">
            <Rails.Header data-testid="lifecycle-header-programs">
              <Rails.Rail>Programs lifecycle</Rails.Rail>
            </Rails.Header>
            <Rails.Panel data-testid="lifecycle-panel-programs" ref={panelRef}>
              <label>
                Programs draft
                <input aria-label="Programs draft" defaultValue="initial" />
              </label>
            </Rails.Panel>
          </Rails.Item>
        </Rails.List>
      </Rails.Root>
    </div>
  )
}

function ReducedMotionRailsProbe({ orientation }: { orientation: RailsOrientation }) {
  const [value, setValue] = useState<string[]>(['programs'])

  return (
    <div>
      <button type="button" onClick={() => setValue([])}>
        collapse reduced {orientation} Panel
      </button>
      <button type="button" onClick={() => setValue(['programs'])}>
        open reduced {orientation} Panel
      </button>

      <Rails.Root
        data-testid={`reduced-${orientation}-root`}
        onValueChange={setValue}
        orientation={orientation}
        value={value}
      >
        <Rails.List data-testid={`reduced-${orientation}-list`}>
          <Rails.Item value="programs">
            <Rails.Header data-testid={`reduced-${orientation}-header`}>
              <Rails.Rail>Reduced {orientation} Programs</Rails.Rail>
            </Rails.Header>
            <Rails.Panel data-testid={`reduced-${orientation}-panel`} keepMounted>
              Reduced {orientation} content
            </Rails.Panel>
          </Rails.Item>
        </Rails.List>
      </Rails.Root>
    </div>
  )
}

function ContinuousFinalRailProbe({
  borderWidth,
  orientation
}: {
  borderWidth: string
  orientation: RailsOrientation
}) {
  const [value, setValue] = useState<string[]>([])

  return (
    <div>
      <button type="button" onClick={() => setValue(['leading'])}>
        open continuous {orientation} Panel
      </button>
      <button type="button" onClick={() => setValue([])}>
        close continuous {orientation} Panel
      </button>

      <Rails.Root
        data-testid={`continuous-${orientation}-root`}
        onValueChange={setValue}
        orientation={orientation}
        value={value}
      >
        <Rails.List
          data-testid={`continuous-${orientation}-list`}
          style={{ '--rails-border-width': borderWidth } as CSSProperties}
        >
          <Rails.Item value="leading">
            <Rails.Header data-testid={`continuous-${orientation}-header-leading`}>
              <Rails.Rail style={{ borderWidth }}>Leading {orientation} Rail</Rails.Rail>
            </Rails.Header>
            <Rails.Panel data-testid={`continuous-${orientation}-panel`}>
              Leading {orientation} content
            </Rails.Panel>
          </Rails.Item>
          <Rails.Item data-testid={`continuous-${orientation}-item-final`} value="final">
            <Rails.Header data-testid={`continuous-${orientation}-header-final`}>
              <Rails.Rail
                data-testid={`continuous-${orientation}-final-rail`}
                style={{ borderWidth }}
              >
                Final {orientation} Rail
              </Rails.Rail>
            </Rails.Header>
            <Rails.Panel>Final {orientation} content</Rails.Panel>
          </Rails.Item>
        </Rails.List>
      </Rails.Root>
    </div>
  )
}

function ConsumerStyledFinalRailProbe({ orientation }: { orientation: RailsOrientation }) {
  const [value, setValue] = useState<string[]>(['leading'])

  return (
    <Rails.Root
      data-testid={`styled-${orientation}-root`}
      onValueChange={setValue}
      orientation={orientation}
      value={value}
    >
      <Rails.List
        data-testid={`styled-${orientation}-list`}
        style={{ '--rails-border-width': '2px' } as CSSProperties}
      >
        <Rails.Item value="leading">
          <Rails.Header data-testid={`styled-${orientation}-header-leading`}>
            <Rails.Rail style={{ borderWidth: '2px' }}>
              Styled leading {orientation} Rail
            </Rails.Rail>
          </Rails.Header>
          <Rails.Panel data-testid={`styled-${orientation}-panel`}>
            Styled leading {orientation} content
          </Rails.Panel>
        </Rails.Item>
        <Rails.Item data-testid={`styled-${orientation}-item-final`} value="final">
          <Rails.Header data-testid={`styled-${orientation}-header-final`}>
            <Rails.Rail
              data-testid={`styled-${orientation}-final-rail`}
              style={(state) => {
                const railState = state as RailsRailState
                const padding = railState.open ? '9px' : '5px'

                return orientation === 'vertical'
                  ? { borderWidth: '2px', paddingInlineStart: padding }
                  : { borderWidth: '2px', paddingTop: padding }
              }}
            >
              Styled final {orientation} Rail
            </Rails.Rail>
          </Rails.Header>
          <Rails.Panel data-testid={`styled-${orientation}-final-panel`}>
            Styled final {orientation} content
          </Rails.Panel>
        </Rails.Item>
      </Rails.List>
    </Rails.Root>
  )
}

function DynamicFirstRailProbe({ orientation }: { orientation: RailsOrientation }) {
  const [showLeadingRail, setShowLeadingRail] = useState(true)
  const railStyle =
    orientation === 'vertical'
      ? { borderWidth: '2px', paddingInlineStart: '5px' }
      : { borderWidth: '2px', paddingTop: '5px' }

  return (
    <div>
      <button type="button" onClick={() => setShowLeadingRail(false)}>
        remove leading {orientation} Rail
      </button>

      <Rails.Root orientation={orientation} value={[]}>
        <Rails.List
          data-testid={`dynamic-order-${orientation}-list`}
          style={{ '--rails-border-width': '2px' } as CSSProperties}
        >
          {showLeadingRail ? (
            <Rails.Item key="leading" value="leading">
              <Rails.Header>
                <Rails.Rail style={railStyle}>Leading {orientation} Rail</Rails.Rail>
              </Rails.Header>
              <Rails.Panel>Leading {orientation} content</Rails.Panel>
            </Rails.Item>
          ) : null}

          <Rails.Item
            key="remaining"
            data-testid={`dynamic-order-${orientation}-remaining-item`}
            value="remaining"
          >
            <Rails.Header>
              <Rails.Rail style={railStyle}>Remaining {orientation} Rail</Rails.Rail>
            </Rails.Header>
            <Rails.Panel>Remaining {orientation} content</Rails.Panel>
          </Rails.Item>
        </Rails.List>
      </Rails.Root>
    </div>
  )
}

function PanelMountingControlsProbe() {
  const [value, setValue] = useState<string[]>(['programs'])
  const [keepMounted, setKeepMounted] = useState(false)
  const [hiddenUntilFound, setHiddenUntilFound] = useState(false)
  const [keepProgramsMounted, setKeepProgramsMounted] = useState(false)
  const [mounted, setMounted] = useState<Record<string, boolean>>({})

  const setPanelMounted = useCallback((name: string, nextMounted: boolean) => {
    setMounted((current) => ({ ...current, [name]: nextMounted }))
  }, [])

  return (
    <div>
      <button type="button" onClick={() => setValue(['programs'])}>
        open programs mounting
      </button>
      <button type="button" onClick={() => setValue(['athletes'])}>
        open athletes mounting
      </button>
      <button type="button" onClick={() => setValue([])}>
        collapse all mounting
      </button>

      <label>
        <input
          type="checkbox"
          checked={keepMounted}
          onChange={(event) => setKeepMounted(event.currentTarget.checked)}
        />
        keep all Panels mounted
      </label>
      <label>
        <input
          type="checkbox"
          checked={keepProgramsMounted}
          onChange={(event) => setKeepProgramsMounted(event.currentTarget.checked)}
        />
        keep Programs mounted
      </label>
      <label>
        <input
          type="checkbox"
          checked={hiddenUntilFound}
          onChange={(event) => setHiddenUntilFound(event.currentTarget.checked)}
        />
        make closed Panels findable
      </label>

      <output>Programs mounted: {mounted.programs ? 'yes' : 'no'}</output>
      <output>Athletes mounted: {mounted.athletes ? 'yes' : 'no'}</output>

      <div className="h-100 w-100">
        <Rails.Root
          hiddenUntilFound={hiddenUntilFound}
          keepMounted={keepMounted}
          onValueChange={setValue}
          orientation="horizontal"
          value={value}
        >
          <Rails.List>
            <Rails.Item value="programs">
              <Rails.Header>
                <Rails.Rail>Programs mounting</Rails.Rail>
              </Rails.Header>
              <Rails.Panel data-testid="mounting-panel-programs" keepMounted={keepProgramsMounted}>
                <PanelMountProbe name="programs" onMountedChange={setPanelMounted}>
                  Programs findable content
                </PanelMountProbe>
              </Rails.Panel>
            </Rails.Item>

            <Rails.Item value="athletes">
              <Rails.Header>
                <Rails.Rail>Athletes mounting</Rails.Rail>
              </Rails.Header>
              <Rails.Panel data-testid="mounting-panel-athletes">
                <PanelMountProbe name="athletes" onMountedChange={setPanelMounted}>
                  Athletes unique findable content
                </PanelMountProbe>
              </Rails.Panel>
            </Rails.Item>
          </Rails.List>
        </Rails.Root>
      </div>
    </div>
  )
}

function PanelMountProbe({
  children,
  name,
  onMountedChange
}: {
  children: ReactNode
  name: string
  onMountedChange: (name: string, mounted: boolean) => void
}) {
  useEffect(() => {
    onMountedChange(name, true)
    return () => onMountedChange(name, false)
  }, [name, onMountedChange])

  return <div>{children}</div>
}

describe('Rails', () => {
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

  it('UC-001 / EX-001 - defaults to the documented vertical Base UI-aligned accordion', () => {
    render(<DefaultRailsProbe />)

    const root = screen.getByTestId('rail-root')
    const list = screen.getByTestId('rail-list')
    const overviewItem = screen.getByTestId('rail-item-overview')
    const overviewHeader = screen.getByTestId('rail-header-overview')
    const overviewRail = screen.getByRole('button', { name: 'Overview' })
    const overviewPanel = screen.getByTestId('rail-panel-overview')
    const trainingItem = screen.getByTestId('rail-item-training')
    const trainingRail = screen.getByRole('button', { name: 'Training' })

    expect(root).toHaveAttribute('data-orientation', 'vertical')
    expect(list).toHaveAttribute('data-rails-list')
    expect(overviewItem).toHaveAttribute('data-open')
    expect(overviewItem).toHaveAttribute('data-index', '0')
    expect(overviewHeader).toHaveAttribute('data-open')
    expect(overviewHeader).toHaveAttribute('data-index', '0')
    expect(overviewRail).toHaveAttribute('data-panel-open')
    expect(overviewPanel).toHaveAttribute('data-open')
    expect(overviewPanel).toHaveAttribute('data-orientation', 'vertical')
    expect(overviewPanel).toHaveAttribute('data-index', '0')
    expect(trainingItem).not.toHaveAttribute('data-open')
    expect(trainingItem).toHaveAttribute('data-index', '1')
    expect(trainingRail).not.toHaveAttribute('data-panel-open')
    expect(getCssVariable(root, '--active-rail-left')).toBe('')
    expect(getCssVariable(root, '--active-rail-width')).toBe('')
    expect(getCssVariable(root, '--rails-active-leading-border-offset')).toBe('')
    expect(screen.getAllByRole('button', { name: 'Overview' })).toHaveLength(1)
    expect(screen.getByText('Overview content')).toBeInTheDocument()
  })

  it('UC-001 - exposes the Rails presentation orientation to every stateful part', () => {
    const rootClassName = vi.fn(() => undefined)
    const itemClassName = vi.fn(() => undefined)
    const headerClassName = vi.fn(() => undefined)
    const railClassName = vi.fn(() => undefined)
    const panelClassName = vi.fn(() => undefined)
    const rootStyle = vi.fn(() => undefined)
    const itemStyle = vi.fn(() => undefined)
    const headerStyle = vi.fn(() => undefined)
    const railStyle = vi.fn(() => undefined)
    const panelStyle = vi.fn(() => undefined)
    const rootRenderState = vi.fn()
    const itemRenderState = vi.fn()
    const headerRenderState = vi.fn()
    const railRenderState = vi.fn()
    const panelRenderState = vi.fn()

    render(
      <Rails.Root
        className={rootClassName}
        data-orientation="vertical"
        data-testid="orientation-root"
        orientation="horizontal"
        render={(props, state) => {
          rootRenderState(state)
          return <section {...(props as ComponentPropsWithRef<'section'>)} />
        }}
        style={rootStyle}
        value={['programs']}
      >
        <Rails.List>
          <Rails.Item
            className={itemClassName}
            render={(props, state) => {
              itemRenderState(state)
              return <div {...(props as ComponentPropsWithRef<'div'>)} />
            }}
            style={itemStyle}
            value="programs"
          >
            <Rails.Header
              className={headerClassName}
              render={(props, state) => {
                headerRenderState(state)
                return <h3 {...(props as ComponentPropsWithRef<'h3'>)} />
              }}
              style={headerStyle}
            >
              <Rails.Rail
                className={railClassName}
                render={(props, state) => {
                  railRenderState(state)
                  return <button {...(props as ComponentPropsWithRef<'button'>)} />
                }}
                style={railStyle}
              >
                Orientation Programs
              </Rails.Rail>
            </Rails.Header>
            <Rails.Panel
              className={panelClassName}
              data-orientation="vertical"
              data-testid="orientation-panel"
              render={(props, state) => {
                panelRenderState(state)
                return <div {...(props as ComponentPropsWithRef<'div'>)} />
              }}
              style={panelStyle}
            >
              Programs content
            </Rails.Panel>
          </Rails.Item>
        </Rails.List>
      </Rails.Root>
    )

    expect(screen.getByTestId('orientation-root')).toHaveAttribute('data-orientation', 'horizontal')
    expect(screen.getByTestId('orientation-panel')).toHaveAttribute(
      'data-orientation',
      'horizontal'
    )

    for (const stateCallback of [
      rootClassName,
      itemClassName,
      headerClassName,
      railClassName,
      panelClassName,
      rootStyle,
      itemStyle,
      headerStyle,
      railStyle,
      panelStyle,
      rootRenderState,
      itemRenderState,
      headerRenderState,
      railRenderState,
      panelRenderState
    ]) {
      expect(stateCallback).toHaveBeenCalledWith(
        expect.objectContaining({ orientation: 'horizontal' })
      )
    }
  })

  it('UC-001 - keeps Accordion keyboard behavior independent from presentation orientation', async () => {
    render(
      <Rails.Root orientation="horizontal" value={[]}>
        <Rails.List>
          <Rails.Item value="programs">
            <Rails.Header>
              <Rails.Rail>Keyboard Programs</Rails.Rail>
            </Rails.Header>
            <Rails.Panel>Programs content</Rails.Panel>
          </Rails.Item>
          <Rails.Item value="athletes">
            <Rails.Header>
              <Rails.Rail>Keyboard Athletes</Rails.Rail>
            </Rails.Header>
            <Rails.Panel>Athletes content</Rails.Panel>
          </Rails.Item>
        </Rails.List>
      </Rails.Root>
    )

    const programsRail = screen.getByRole('button', { name: 'Keyboard Programs' })
    const athletesRail = screen.getByRole('button', { name: 'Keyboard Athletes' })

    await act(async () => {
      programsRail.focus()
      fireEvent.keyDown(programsRail, { key: 'ArrowDown' })
      await Promise.resolve()
    })

    expect(programsRail).toHaveFocus()
    expect(programsRail).not.toHaveAttribute('data-panel-open')
    expect(athletesRail).not.toHaveAttribute('data-panel-open')
  })

  it('UC-001 - preserves a consumer Root ref', () => {
    const rootRef = createRef<HTMLDivElement>()

    render(
      <Rails.Root data-testid="rail-root" ref={rootRef} value={[]}>
        <Rails.List />
      </Rails.Root>
    )

    expect(rootRef.current).toBe(screen.getByTestId('rail-root'))
  })

  it('UC-001 - preserves the native div ref on List', () => {
    const listRef = createRef<HTMLDivElement>()

    render(
      <Rails.Root value={[]}>
        <Rails.List data-testid="rail-list" ref={listRef} />
      </Rails.Root>
    )

    expect(listRef.current).toBe(screen.getByTestId('rail-list'))
  })

  it('UC-002 / UC-003 / EX-002 - supports controlled all-collapsed state and single-open activation', () => {
    render(<ControlledRailsProbe />)

    const programsRail = screen.getByRole('button', { name: 'Programs' })
    const athletesRail = screen.getByRole('button', { name: 'Athletes' })

    expect(screen.getByLabelText('active item')).toHaveTextContent('none')
    expect(programsRail).not.toHaveAttribute('data-panel-open')
    expect(athletesRail).not.toHaveAttribute('data-panel-open')
    expect(screen.queryByTestId('controlled-panel-programs')).not.toBeInTheDocument()
    expect(screen.queryByTestId('controlled-panel-athletes')).not.toBeInTheDocument()

    fireEvent.click(programsRail)

    expect(screen.getByLabelText('active item')).toHaveTextContent('programs')
    expect(programsRail).toHaveAttribute('data-panel-open')
    expect(athletesRail).not.toHaveAttribute('data-panel-open')

    fireEvent.click(programsRail)

    expect(screen.getByLabelText('active item')).toHaveTextContent('programs')
    expect(programsRail).toHaveAttribute('data-panel-open')

    fireEvent.click(screen.getByRole('button', { name: 'collapse all' }))

    expect(screen.getByLabelText('active item')).toHaveTextContent('none')
    expect(programsRail).not.toHaveAttribute('data-panel-open')
    expect(athletesRail).not.toHaveAttribute('data-panel-open')

    fireEvent.click(screen.getByRole('button', { name: 'open programs' }))

    expect(screen.getByLabelText('active item')).toHaveTextContent('programs')
    expect(programsRail).toHaveAttribute('data-panel-open')
  })

  it('UC-003 / EX-002 - emits Base UI-shaped array values and event details', () => {
    const onValueChange = vi.fn()

    render(
      <Rails.Root onValueChange={onValueChange} value={[]}>
        <Rails.List>
          <Rails.Item value="programs">
            <Rails.Header>
              <Rails.Rail>Programs</Rails.Rail>
            </Rails.Header>
            <Rails.Panel>Programs panel</Rails.Panel>
          </Rails.Item>

          <Rails.Item value="athletes">
            <Rails.Header>
              <Rails.Rail>Athletes</Rails.Rail>
            </Rails.Header>
            <Rails.Panel>Athletes panel</Rails.Panel>
          </Rails.Item>
        </Rails.List>
      </Rails.Root>
    )

    const athletesRail = screen.getByRole('button', { name: 'Athletes' })

    fireEvent.click(athletesRail)

    expect(onValueChange).toHaveBeenCalledWith(
      ['athletes'],
      expect.objectContaining({
        reason: 'trigger-press',
        trigger: athletesRail
      })
    )

    const eventDetails = onValueChange.mock.calls[0]?.[1] as RailsChangeEventDetails | undefined

    expect(eventDetails?.cancel).toBeTypeOf('function')
    expect(eventDetails?.allowPropagation).toBeTypeOf('function')
    expect(eventDetails?.isCanceled).toBe(false)
    expect(eventDetails?.isPropagationAllowed).toBe(false)
  })

  it('UC-004 / UC-005 / EX-001 - exposes vertical width clipping contracts', () => {
    render(<DefaultRailsProbe />)

    const overviewPanel = screen.getByTestId('rail-panel-overview')
    const overviewContent = screen.getByTestId('rail-panel-overview-content')
    const panelStyle = overviewPanel.getAttribute('style') ?? ''

    expect(overviewPanel).toHaveClass('overflow-hidden')
    expect(panelStyle).toContain('--rails-panel-width')
    expect(panelStyle).toContain('--accordion-panel-width')
    expect(panelStyle).not.toContain('--rails-panel-height')
    expect(overviewContent).not.toHaveClass('opacity-0', 'scale-0', 'translate-x-0')
  })

  it('UC-005 / EX-001 - uses the Tabs Indicator easing for opening and closing Panel widths', () => {
    render(<DefaultRailsProbe />)

    expect(getCssTransitionTimingFunction(screen.getByTestId('rail-panel-overview'))).toBe(
      'cubic-bezier(0.22,1,0.36,1)'
    )
  })

  it('UC-005 - exposes measured Panel width variables as matching pixel values', () => {
    render(<DefaultRailsProbe />)

    const openPanel = screen.getByTestId('rail-panel-overview')

    expectMeasuredPanelWidthVariables(openPanel)
    expect(openPanel.style.getPropertyValue('--rails-panel-width')).not.toBe('auto')
  })

  it('UC-005 / UC-013 - resynchronizes Panel width variables when the rail box resizes', async () => {
    const originalResizeObserver = globalThis.ResizeObserver
    const resizeObservers: {
      callback: ResizeObserverCallback
      observedElements: Element[]
    }[] = []
    const rectsByTestId = {
      'rail-header-nutrition': { left: 480, width: 40 },
      'rail-header-overview': { left: 100, width: 40 },
      'rail-header-training': { left: 440, width: 40 },
      'rail-list': { left: 100, width: 420 },
      'rail-root': { left: 100, width: 420 }
    } satisfies Record<string, RailsElementRect>
    let rendered: { unmount: () => void } | undefined

    class TestResizeObserver implements ResizeObserver {
      private readonly observedElements: Element[] = []

      disconnect = vi.fn()
      observe = vi.fn((element: Element) => {
        this.observedElements.push(element)
      })
      unobserve = vi.fn()

      constructor(callback: ResizeObserverCallback) {
        resizeObservers.push({ callback, observedElements: this.observedElements })
      }
    }

    globalThis.ResizeObserver = TestResizeObserver as unknown as typeof ResizeObserver
    mockRailsRects(rectsByTestId)

    try {
      rendered = render(<DefaultRailsProbe />)

      const root = screen.getByTestId('rail-root')
      const list = screen.getByTestId('rail-list')
      const overviewPanel = screen.getByTestId('rail-panel-overview')

      await waitFor(() => {
        expect(getCssVariable(overviewPanel, '--rails-panel-width')).toBe('302px')
      })

      const railResizeObserver = resizeObservers.find(
        ({ observedElements }) => observedElements.includes(root) && observedElements.includes(list)
      )

      if (railResizeObserver === undefined) {
        throw new Error('Expected one ResizeObserver to watch the Rails Root and List')
      }

      rectsByTestId['rail-list'] = { left: 100, width: 460 }
      rectsByTestId['rail-root'] = { left: 100, width: 460 }
      railResizeObserver.callback([] as ResizeObserverEntry[], {} as ResizeObserver)

      await waitFor(() => {
        expect(getCssVariable(overviewPanel, '--rails-panel-width')).toBe('342px')
      })
    } finally {
      rendered?.unmount()
      globalThis.ResizeObserver = originalResizeObserver
    }
  })

  it('UC-001 / UC-004 / UC-005 / UC-007 / UC-012 / UC-017 / EX-009 - renders the complete horizontal transposition', async () => {
    mockRailsRects({
      'horizontal-header-overview': { height: 40, left: 100, width: 420 },
      'horizontal-header-programs': { height: 40, left: 100, width: 420 },
      'horizontal-header-training': { height: 56, left: 100, width: 420 },
      'horizontal-list': { height: 400, left: 100, width: 420 },
      'horizontal-root': { height: 400, left: 100, width: 420 }
    })

    render(<HorizontalRailsProbe />)

    const root = screen.getByTestId('horizontal-root')
    const list = screen.getByTestId('horizontal-list')
    const overviewRail = screen.getByRole('button', { name: 'Horizontal Overview' })
    const trainingRail = screen.getByRole('button', { name: 'Horizontal Training' })
    const programsRail = screen.getByRole('button', { name: 'Horizontal Programs' })
    const trainingPanel = screen.getByTestId('horizontal-panel-training')
    const trainingSourceTitle = getFirstHtmlElementChild(
      getRevealSource(trainingRail),
      'Expected horizontal Training source title'
    )

    expect(root).toHaveAttribute('data-orientation', 'horizontal')
    expect(list).toHaveClass('flex-col', 'justify-end')
    expect(getCssVariable(list, '--rails-border-width')).toBe('3px')
    expect(trainingPanel).toHaveAttribute('data-orientation', 'horizontal')
    expect(trainingPanel).toHaveClass('overflow-hidden', 'transition-[height]')
    expect(trainingPanel.style.transitionProperty).toBe('height')
    expect(trainingPanel.style.height).toBe('var(--rails-panel-height)')
    expect(getCssTransitionTimingFunction(trainingPanel)).toBe('cubic-bezier(0.22,1,0.36,1)')

    await waitFor(() => {
      expect(getCssVariable(trainingPanel, '--rails-panel-height')).toBe('270px')
      expect(getCssVariable(trainingPanel, '--accordion-panel-height')).toBe('270px')
    })
    expect(getCssVariable(trainingPanel, '--rails-panel-width')).toBe('')
    expectMeasuredPanelHeightVariables(trainingPanel)
    expect(screen.getByTestId('horizontal-content-training')).not.toHaveClass(
      'opacity-0',
      'scale-0',
      'translate-y-0'
    )

    expect(overviewRail).toHaveClass('h-10', 'w-full')
    expect(trainingRail).toHaveClass('h-14', 'w-full', 'items-center', 'justify-start')
    expect(programsRail).toHaveClass('h-10', 'w-full')
    expect(trainingSourceTitle).toHaveClass('text-left', 'whitespace-nowrap')
    expect(getCssTransform(trainingSourceTitle)).not.toContain('rotate')
    expectClipPath(getRevealOverlay(overviewRail), TOP_TO_BOTTOM_HIDDEN_CLIP_PATH)
    expectClipPath(getRevealOverlay(trainingRail), REVEALED_CLIP_PATH)
    expect(getRevealCopyScale(trainingRail)).toHaveStyle({
      '--reveal-origin': 'left center'
    })
    expect(getCssTransform(getRevealCopyScale(trainingRail))).toContain('scale(1.2)')
    expect(
      [
        screen.getByTestId('horizontal-item-overview'),
        screen.getByTestId('horizontal-item-training'),
        screen.getByTestId('horizontal-item-programs')
      ].map((item) => getRailsItemStartMargin(item, 'horizontal'))
    ).toEqual([0, -3, -3])

    for (const rail of [overviewRail, trainingRail, programsRail]) {
      for (const surface of [rail, getRevealOverlaySurface(rail)]) {
        expectCompleteRailAxisBorders(surface, 'horizontal', 3)
      }
    }
  })

  it('UC-002 / UC-003 / UC-014 / UC-017 / EX-009 - opens a horizontal Panel from the block-end all-collapsed state', async () => {
    mockRailsRects({
      'horizontal-header-overview': { height: 40, left: 100, width: 420 },
      'horizontal-header-programs': { height: 40, left: 100, width: 420 },
      'horizontal-header-training': { height: 56, left: 100, width: 420 },
      'horizontal-list': { height: 400, left: 100, width: 420 },
      'horizontal-root': { height: 400, left: 100, width: 420 }
    })
    render(<HorizontalRailsProbe />)

    fireEvent.click(screen.getByRole('button', { name: 'collapse horizontal all' }))

    await waitFor(() => {
      expect(screen.getByLabelText('horizontal active Rail')).toHaveTextContent('none')
      expect(screen.getByRole('button', { name: 'Horizontal Training' })).not.toHaveAttribute(
        'data-panel-open'
      )
    })

    fireEvent.click(screen.getByRole('button', { name: 'open horizontal programs' }))

    const programsPanel = screen.getByTestId('horizontal-panel-programs')

    expect(programsPanel).toHaveAttribute('data-starting-style')

    await waitFor(() => {
      expect(screen.getByLabelText('horizontal active Rail')).toHaveTextContent('programs')
      expect(screen.getByRole('button', { name: 'Horizontal Programs' })).toHaveAttribute(
        'data-panel-open'
      )
      expect(getCssVariable(programsPanel, '--rails-panel-height')).toBe('270px')
      expect(getCssVariable(programsPanel, '--accordion-panel-height')).toBe('270px')
    })
  })

  it('UC-011 / UC-017 / UC-018 / EX-010 / CR-004 - includes the collapsed-border allowance without changing Rail borders', async () => {
    mockRailsRects({
      'constrained-horizontal-header-nutrition': { height: 40, left: 100, width: 400 },
      'constrained-horizontal-header-overview': { height: 40, left: 100, width: 400 },
      'constrained-horizontal-header-training': { height: 40, left: 100, width: 400 },
      'constrained-horizontal-list': { height: 120, left: 100, width: 400 },
      'constrained-horizontal-root': { height: 120, left: 100, width: 400 }
    })
    render(<ConstrainedHorizontalRailsProbe />)

    const panel = screen.getByTestId('constrained-horizontal-panel-overview')
    const overviewRail = screen.getByRole('button', { name: 'Constrained Overview' })
    const trainingRail = screen.getByRole('button', { name: 'Constrained Training' })
    const nutritionRail = screen.getByRole('button', { name: 'Constrained Nutrition' })
    const items = [
      screen.getByTestId('constrained-horizontal-item-overview'),
      screen.getByTestId('constrained-horizontal-item-training'),
      screen.getByTestId('constrained-horizontal-item-nutrition')
    ]

    await waitFor(() => {
      expect(panel).toHaveAttribute('data-open')
      expect(getCssVariable(panel, '--rails-panel-height')).toBe('2px')
      expect(getCssVariable(panel, '--accordion-panel-height')).toBe('2px')
    })
    expect(panel.style.height).toBe('var(--rails-panel-height)')
    expect(panel).toHaveClass('overflow-hidden')
    expect(screen.getAllByRole('button', { name: /Constrained/ })).toHaveLength(3)
    expect(items.map((item) => getRailsItemStartMargin(item, 'horizontal'))).toEqual([0, -1, -1])

    for (const rail of [overviewRail, trainingRail, nutritionRail]) {
      for (const surface of [rail, getRevealOverlaySurface(rail)]) {
        expectCompleteRailAxisBorders(surface, 'horizontal', 1)
      }
    }
  })

  it.each(['vertical', 'horizontal'] as const)(
    'UC-011 / EX-001 / EX-009 / CR-017 - removes the %s first Item overlap while preserving Rail border and padding',
    async (orientation) => {
      mockRailsItemStartMargins()
      render(<DynamicFirstRailProbe orientation={orientation} />)

      const remainingItem = screen.getByTestId(`dynamic-order-${orientation}-remaining-item`)
      const remainingRail = screen.getByRole('button', {
        name: `Remaining ${orientation} Rail`
      })
      const remainingSurfaces = [remainingRail, getRevealOverlaySurface(remainingRail)]
      const paddingProperty = orientation === 'vertical' ? 'padding-inline-start' : 'padding-top'

      await waitFor(() => {
        expect(remainingItem).toHaveAttribute('data-index', '1')
        expect(getRailsItemStartMargin(remainingItem, orientation)).toBe(-2)

        for (const surface of remainingSurfaces) {
          expectCompleteRailAxisBorders(surface, orientation, 2)
          expect(getResolvedCssLength(surface, [paddingProperty])).toBe(5)
        }
      })

      fireEvent.click(screen.getByRole('button', { name: `remove leading ${orientation} Rail` }))

      await waitFor(() => {
        expect(remainingItem).toHaveAttribute('data-index', '0')
        expect(getRailsItemStartMargin(remainingItem, orientation)).toBe(0)

        for (const surface of remainingSurfaces) {
          expectCompleteRailAxisBorders(surface, orientation, 2)
          expect(getResolvedCssLength(surface, [paddingProperty])).toBe(5)
        }
      })
    }
  )

  it('UC-011 / UC-013 / EX-009 / CR-004 - retains static overlap and complete Rail borders while a Panel closes visibly', async () => {
    const retainedPanelLifetime = new Promise<void>(() => undefined)

    mockRailsRects({
      'horizontal-header-overview': { height: 40, left: 100, width: 420 },
      'horizontal-header-programs': { height: 40, left: 100, width: 420 },
      'horizontal-header-training': { height: 56, left: 100, width: 420 },
      'horizontal-list': { height: 400, left: 100, width: 420 },
      'horizontal-panel-training': { height: 270, left: 100, width: 420 },
      'horizontal-root': { height: 400, left: 100, width: 420 }
    })
    vi.spyOn(HTMLElement.prototype, 'scrollHeight', 'get').mockReturnValue(270)
    Object.defineProperty(HTMLElement.prototype, 'getAnimations', {
      configurable: true,
      value(this: HTMLElement): Animation[] {
        if (!this.hasAttribute('data-ending-style')) {
          return []
        }

        return [
          {
            finished: retainedPanelLifetime,
            pending: false,
            playState: 'idle'
          } as unknown as Animation
        ]
      }
    })
    render(<HorizontalRailsProbe />)

    const trainingPanel = screen.getByTestId('horizontal-panel-training')
    const programsItem = screen.getByTestId('horizontal-item-programs')
    const trainingRail = screen.getByRole('button', { name: 'Horizontal Training' })
    const programsRail = screen.getByRole('button', { name: 'Horizontal Programs' })

    await waitFor(() => {
      expect(getCssVariable(trainingPanel, '--rails-panel-height')).toBe('270px')
    })

    fireEvent.click(screen.getByRole('button', { name: 'collapse horizontal all' }))

    await waitFor(() => {
      expect(trainingPanel).toHaveAttribute('data-ending-style')
    })
    expect(getCssVariable(trainingPanel, '--rails-panel-height')).toBe('270px')
    expect(trainingPanel.getBoundingClientRect().height).toBe(270)
    expect(
      trainingPanel
        .getAnimations()
        .some((animation) => animation.pending || animation.playState === 'running')
    ).toBe(false)

    expect(getRailsItemStartMargin(programsItem, 'horizontal')).toBe(-3)

    for (const rail of [trainingRail, programsRail]) {
      for (const surface of [rail, getRevealOverlaySurface(rail)]) {
        expectCompleteRailAxisBorders(surface, 'horizontal', 3)
      }
    }
  })

  it('UC-011 / UC-013 / EX-009 / CR-006 - keeps static overlap and complete borders while a resized Panel reaches zero', async () => {
    const originalResizeObserver = globalThis.ResizeObserver
    const resizeObservers: {
      callback: ResizeObserverCallback
      observedElements: Element[]
    }[] = []
    const rectsByTestId = {
      'horizontal-header-overview': { height: 40, left: 100, width: 420 },
      'horizontal-header-programs': { height: 40, left: 100, width: 420 },
      'horizontal-header-training': { height: 56, left: 100, width: 420 },
      'horizontal-list': { height: 400, left: 100, width: 420 },
      'horizontal-panel-training': { height: 270, left: 100, width: 420 },
      'horizontal-root': { height: 400, left: 100, width: 420 }
    } satisfies Record<string, RailsElementRect>
    let rendered: { unmount: () => void } | undefined
    let resizeAnimationPlayState: AnimationPlayState | null = null
    const resizeAnimationFinished = new Promise<void>(() => undefined)

    class TestResizeObserver implements ResizeObserver {
      private readonly observedElements: Element[] = []

      disconnect = vi.fn()
      observe = vi.fn((element: Element) => {
        this.observedElements.push(element)
      })
      unobserve = vi.fn()

      constructor(callback: ResizeObserverCallback) {
        resizeObservers.push({ callback, observedElements: this.observedElements })
      }
    }

    globalThis.ResizeObserver = TestResizeObserver as unknown as typeof ResizeObserver
    mockRailsRects(rectsByTestId)
    Object.defineProperty(HTMLElement.prototype, 'getAnimations', {
      configurable: true,
      value(this: HTMLElement): Animation[] {
        if (
          this.getAttribute('data-testid') !== 'horizontal-panel-training' ||
          resizeAnimationPlayState === null
        ) {
          return []
        }

        return [
          {
            finished: resizeAnimationFinished,
            pending: false,
            playState: resizeAnimationPlayState
          } as unknown as Animation
        ]
      }
    })

    try {
      rendered = render(<HorizontalRailsProbe />)

      const trainingPanel = screen.getByTestId('horizontal-panel-training')
      const programsItem = screen.getByTestId('horizontal-item-programs')
      const programsRail = screen.getByRole('button', { name: 'Horizontal Programs' })
      const programsSurfaces = [programsRail, getRevealOverlaySurface(programsRail)]

      await waitFor(() => {
        expect(getCssVariable(trainingPanel, '--rails-panel-height')).toBe('270px')
      })
      expect(trainingPanel.getBoundingClientRect().height).toBe(270)
      expect(getRailsItemStartMargin(programsItem, 'horizontal')).toBe(-3)
      for (const surface of programsSurfaces) {
        expectCompleteRailAxisBorders(surface, 'horizontal', 3)
      }

      resizeAnimationPlayState = 'running'
      rectsByTestId['horizontal-list'] = { height: 130, left: 100, width: 420 }
      rectsByTestId['horizontal-root'] = { height: 130, left: 100, width: 420 }
      act(() => {
        for (const observer of resizeObservers) {
          observer.callback([] as ResizeObserverEntry[], {} as ResizeObserver)
        }
      })

      await waitFor(() => {
        expect(getCssVariable(trainingPanel, '--rails-panel-height')).toBe('0px')
      })
      expect(trainingPanel.getBoundingClientRect().height).toBe(270)
      expect(getRailsItemStartMargin(programsItem, 'horizontal')).toBe(-3)
      for (const surface of programsSurfaces) {
        expectCompleteRailAxisBorders(surface, 'horizontal', 3)
      }

      rectsByTestId['horizontal-panel-training'] = { height: 2, left: 100, width: 420 }
      act(() => {
        for (const observer of resizeObservers) {
          observer.callback([] as ResizeObserverEntry[], {} as ResizeObserver)
        }
      })

      expect(trainingPanel.getBoundingClientRect().height).toBe(2)
      expect(getRailsItemStartMargin(programsItem, 'horizontal')).toBe(-3)
      for (const surface of programsSurfaces) {
        expectCompleteRailAxisBorders(surface, 'horizontal', 3)
      }

      rectsByTestId['horizontal-panel-training'] = { height: 0, left: 100, width: 420 }
      act(() => {
        for (const observer of resizeObservers) {
          observer.callback([] as ResizeObserverEntry[], {} as ResizeObserver)
        }
      })

      expect(trainingPanel.getBoundingClientRect().height).toBe(0)
      expect(resizeAnimationPlayState).toBe('running')
      expect(getRailsItemStartMargin(programsItem, 'horizontal')).toBe(-3)
      for (const surface of programsSurfaces) {
        expectCompleteRailAxisBorders(surface, 'horizontal', 3)
      }

      resizeAnimationPlayState = 'finished'
      fireEvent.transitionEnd(trainingPanel, { propertyName: 'height' })
      act(() => {
        for (const observer of resizeObservers) {
          observer.callback([] as ResizeObserverEntry[], {} as ResizeObserver)
        }
      })
      for (const surface of programsSurfaces) {
        expectCompleteRailAxisBorders(surface, 'horizontal', 3)
      }
    } finally {
      rendered?.unmount()
      globalThis.ResizeObserver = originalResizeObserver
    }
  })

  it.each([
    ['vertical', '2px'],
    ['horizontal', '2px'],
    ['vertical', '1.5pt'],
    ['horizontal', '1.5pt']
  ] as const)(
    'UC-013 / EX-007 / EX-009 / QA-001 / CR-008 / CR-010 - keeps the final %s Rail titles continuous with a %s border',
    async (orientation, borderWidth) => {
      const originalResizeObserver = globalThis.ResizeObserver
      const resizeObservers: ResizeObserverCallback[] = []
      const vertical = orientation === 'vertical'
      const rectsByTestId = {
        [`continuous-${orientation}-final-rail`]: {
          height: vertical ? 160 : 40,
          left: vertical ? 120 : 0,
          top: vertical ? 0 : 120,
          width: vertical ? 40 : 160
        },
        [`continuous-${orientation}-header-final`]: {
          height: vertical ? 160 : 40,
          left: vertical ? 120 : 0,
          top: vertical ? 0 : 120,
          width: vertical ? 40 : 160
        },
        [`continuous-${orientation}-header-leading`]: {
          height: vertical ? 160 : 40,
          left: 0,
          top: 0,
          width: vertical ? 40 : 160
        },
        [`continuous-${orientation}-list`]: { height: 160, left: 0, top: 0, width: 160 },
        [`continuous-${orientation}-panel`]: {
          height: vertical ? 160 : 0,
          left: vertical ? 40 : 0,
          top: vertical ? 0 : 40,
          width: vertical ? 0 : 160
        },
        [`continuous-${orientation}-root`]: { height: 160, left: 0, top: 0, width: 160 }
      } satisfies Record<string, RailsElementRect>
      let retainClosingPanel = false
      let finishRetainedPanelLifetime: () => void = () => undefined
      const retainedPanelLifetime = new Promise<void>((resolve) => {
        finishRetainedPanelLifetime = resolve
      })
      let rendered: { unmount: () => void } | undefined

      class TestResizeObserver implements ResizeObserver {
        disconnect = vi.fn()
        observe = vi.fn()
        unobserve = vi.fn()

        constructor(callback: ResizeObserverCallback) {
          resizeObservers.push(callback)
        }
      }

      globalThis.ResizeObserver = TestResizeObserver as unknown as typeof ResizeObserver
      mockRailsRects(rectsByTestId)
      Object.defineProperty(HTMLElement.prototype, 'getAnimations', {
        configurable: true,
        value(this: HTMLElement): Animation[] {
          if (
            !retainClosingPanel ||
            this.getAttribute('data-testid') !== `continuous-${orientation}-panel` ||
            !this.hasAttribute('data-ending-style')
          ) {
            return []
          }

          return [
            {
              finished: retainedPanelLifetime,
              pending: false,
              playState: 'running'
            } as unknown as Animation
          ]
        }
      })

      const notifyResizeObservers = () => {
        act(() => {
          for (const callback of resizeObservers) {
            callback([] as ResizeObserverEntry[], {} as ResizeObserver)
          }
        })
      }

      try {
        rendered = render(
          <ContinuousFinalRailProbe borderWidth={borderWidth} orientation={orientation} />
        )

        const borderWidthPx = resolveAbsoluteCssLength(borderWidth) as number
        const finalItem = screen.getByTestId(`continuous-${orientation}-item-final`)
        const finalRail = screen.getByRole('button', { name: `Final ${orientation} Rail` })
        const finalSurfaces = [finalRail, getRevealOverlaySurface(finalRail)]
        const sourceTitle = getFirstHtmlElementChild(
          getRevealSource(finalRail),
          `Expected final ${orientation} source title`
        )
        const decorativeTitle = getFirstHtmlElementChild(
          getRevealCopyScale(finalRail),
          `Expected final ${orientation} decorative copied title`
        )
        const finalTitles = [sourceTitle, decorativeTitle]

        for (const title of finalTitles) {
          mockRenderedRailTitleRect(title, orientation)
        }

        const samples: Record<string, number[]> = {}
        const marginSamples: Record<string, number> = {}
        const sample = (name: string) => {
          samples[name] = finalTitles.map((title) => {
            const titleRect = title.getBoundingClientRect()

            return orientation === 'vertical' ? titleRect.left : titleRect.top
          })
          marginSamples[name] = getRailsItemStartMargin(finalItem, orientation)

          for (const surface of finalSurfaces) {
            expectCompleteRailAxisBorders(surface, orientation, borderWidthPx)
          }
        }

        sample('collapsed')

        fireEvent.click(
          screen.getByRole('button', { name: `open continuous ${orientation} Panel` })
        )

        const panel = await screen.findByTestId(`continuous-${orientation}-panel`)
        const measuredVariable = vertical ? '--rails-panel-width' : '--rails-panel-height'

        await waitFor(() => {
          expect(panel).toHaveAttribute('data-open')
          expect(getCssVariable(panel, measuredVariable)).toBe('82px')
        })
        sample('opening-zero')

        rectsByTestId[`continuous-${orientation}-panel`] = {
          height: vertical ? 160 : 41,
          left: vertical ? 40 : 0,
          top: vertical ? 0 : 40,
          width: vertical ? 41 : 160
        }
        notifyResizeObservers()
        sample('opening-midpoint')

        rectsByTestId[`continuous-${orientation}-panel`] = {
          height: vertical ? 160 : 82,
          left: vertical ? 40 : 0,
          top: vertical ? 0 : 40,
          width: vertical ? 82 : 160
        }
        notifyResizeObservers()
        sample('open-target')

        retainClosingPanel = true
        fireEvent.click(
          screen.getByRole('button', { name: `close continuous ${orientation} Panel` })
        )

        await waitFor(() => {
          expect(panel).toHaveAttribute('data-ending-style')
          expect(panel).not.toHaveAttribute('hidden')
        })
        expect(
          vertical ? panel.getBoundingClientRect().width : panel.getBoundingClientRect().height
        ).toBe(82)
        notifyResizeObservers()
        sample('closing-target')

        rectsByTestId[`continuous-${orientation}-panel`] = {
          height: vertical ? 160 : 41,
          left: vertical ? 40 : 0,
          top: vertical ? 0 : 40,
          width: vertical ? 41 : 160
        }
        notifyResizeObservers()
        sample('closing-midpoint')

        rectsByTestId[`continuous-${orientation}-panel`] = {
          height: vertical ? 160 : 0,
          left: vertical ? 40 : 0,
          top: vertical ? 0 : 40,
          width: vertical ? 0 : 160
        }
        notifyResizeObservers()
        sample('closing-zero')

        await act(async () => {
          finishRetainedPanelLifetime()
          await retainedPanelLifetime
          await Promise.resolve()
        })
        await waitFor(() => {
          expect(screen.queryByTestId(`continuous-${orientation}-panel`)).not.toBeInTheDocument()
        })
        notifyResizeObservers()
        sample('lifecycle-complete')

        for (const [titleIndex, title] of finalTitles.entries()) {
          const coordinates = Object.values(samples).map((values) => values[titleIndex])

          expect(
            coordinates,
            `${title === sourceTitle ? 'source' : 'decorative'} final ${orientation} title axis samples with ${borderWidth}: ${JSON.stringify(samples)}`
          ).toEqual(coordinates.map(() => coordinates[0]))
        }

        expect(Object.values(marginSamples)).toEqual(
          Object.values(marginSamples).map(() => -borderWidthPx)
        )
      } finally {
        rendered?.unmount()
        globalThis.ResizeObserver = originalResizeObserver
      }
    }
  )

  it.each(['vertical', 'horizontal'] as const)(
    'UC-012 / UC-013 / EX-007 / EX-009 / CR-012 - preserves consumer %s Rail padding and title trajectories across state updates and static overlap',
    async (orientation) => {
      const originalResizeObserver = globalThis.ResizeObserver
      const resizeObservers: ResizeObserverCallback[] = []
      const vertical = orientation === 'vertical'
      const rectsByTestId = {
        [`styled-${orientation}-final-rail`]: {
          height: vertical ? 160 : 40,
          left: vertical ? 120 : 0,
          top: vertical ? 0 : 120,
          width: vertical ? 40 : 160
        },
        [`styled-${orientation}-header-final`]: {
          height: vertical ? 160 : 40,
          left: vertical ? 120 : 0,
          top: vertical ? 0 : 120,
          width: vertical ? 40 : 160
        },
        [`styled-${orientation}-header-leading`]: {
          height: vertical ? 160 : 40,
          left: 0,
          top: 0,
          width: vertical ? 40 : 160
        },
        [`styled-${orientation}-list`]: { height: 160, left: 0, top: 0, width: 160 },
        [`styled-${orientation}-panel`]: {
          height: vertical ? 160 : 82,
          left: vertical ? 40 : 0,
          top: vertical ? 0 : 40,
          width: vertical ? 82 : 160
        },
        [`styled-${orientation}-root`]: { height: 160, left: 0, top: 0, width: 160 }
      } satisfies Record<string, RailsElementRect>
      let finishRetainedPanelLifetime: () => void = () => undefined
      const retainedPanelLifetime = new Promise<void>((resolve) => {
        finishRetainedPanelLifetime = resolve
      })
      let rendered: { unmount: () => void } | undefined

      class TestResizeObserver implements ResizeObserver {
        disconnect = vi.fn()
        observe = vi.fn()
        unobserve = vi.fn()

        constructor(callback: ResizeObserverCallback) {
          resizeObservers.push(callback)
        }
      }

      globalThis.ResizeObserver = TestResizeObserver as unknown as typeof ResizeObserver
      mockRailsRects(rectsByTestId)
      Object.defineProperty(HTMLElement.prototype, 'getAnimations', {
        configurable: true,
        value(this: HTMLElement): Animation[] {
          if (
            this.getAttribute('data-testid') !== `styled-${orientation}-panel` ||
            !this.hasAttribute('data-ending-style')
          ) {
            return []
          }

          return [
            {
              finished: retainedPanelLifetime,
              pending: false,
              playState: 'running'
            } as unknown as Animation
          ]
        }
      })

      const notifyResizeObservers = () => {
        act(() => {
          for (const callback of resizeObservers) {
            callback([] as ResizeObserverEntry[], {} as ResizeObserver)
          }
        })
      }

      try {
        rendered = render(<ConsumerStyledFinalRailProbe orientation={orientation} />)

        const panel = screen.getByTestId(`styled-${orientation}-panel`)
        const finalItem = screen.getByTestId(`styled-${orientation}-item-final`)
        const finalRail = screen.getByRole('button', {
          name: `Styled final ${orientation} Rail`
        })
        const finalSurfaces = [finalRail, getRevealOverlaySurface(finalRail)]
        const sourceTitle = getFirstHtmlElementChild(
          getRevealSource(finalRail),
          `Expected styled final ${orientation} source title`
        )
        const decorativeTitle = getFirstHtmlElementChild(
          getRevealCopyScale(finalRail),
          `Expected styled final ${orientation} decorative copied title`
        )
        const finalTitles = [sourceTitle, decorativeTitle]
        const measuredVariable = vertical ? '--rails-panel-width' : '--rails-panel-height'
        const paddingProperties = vertical
          ? ['padding-inline-start', 'padding-left']
          : ['padding-top']
        const axisSamples: Record<string, number[]> = {}
        const paddingSamples: Record<string, number[]> = {}
        const marginSamples: Record<string, number> = {}

        for (const title of finalTitles) {
          mockRenderedRailTitleRect(title, orientation)
        }

        const sample = (name: string) => {
          axisSamples[name] = finalTitles.map((title) => {
            const titleRect = title.getBoundingClientRect()

            return vertical ? titleRect.left : titleRect.top
          })
          paddingSamples[name] = finalSurfaces.map((surface) =>
            getResolvedCssLength(surface, paddingProperties)
          )
          marginSamples[name] = getRailsItemStartMargin(finalItem, orientation)

          for (const surface of finalSurfaces) {
            expectCompleteRailAxisBorders(surface, orientation, 2)
          }
        }

        await waitFor(() => {
          expect(panel).toHaveAttribute('data-open')
          expect(getCssVariable(panel, measuredVariable)).toBe('82px')
        })
        notifyResizeObservers()
        sample('consumer-closed')

        fireEvent.click(finalRail)

        await waitFor(() => {
          expect(finalRail).toHaveAttribute('aria-expanded', 'true')
          expect(panel).toHaveAttribute('data-ending-style')
        })
        notifyResizeObservers()
        sample('closing-target')

        rectsByTestId[`styled-${orientation}-panel`] = {
          height: vertical ? 160 : 41,
          left: vertical ? 40 : 0,
          top: vertical ? 0 : 40,
          width: vertical ? 41 : 160
        }
        notifyResizeObservers()
        sample('closing-midpoint')

        rectsByTestId[`styled-${orientation}-panel`] = {
          height: vertical ? 160 : 0,
          left: vertical ? 40 : 0,
          top: vertical ? 0 : 40,
          width: vertical ? 0 : 160
        }
        notifyResizeObservers()
        sample('closing-zero')

        await act(async () => {
          finishRetainedPanelLifetime()
          await retainedPanelLifetime
          await Promise.resolve()
        })
        await waitFor(() => {
          expect(screen.queryByTestId(`styled-${orientation}-panel`)).not.toBeInTheDocument()
        })
        notifyResizeObservers()
        sample('lifecycle-complete')

        expect(paddingSamples['consumer-closed']).toEqual([5, 5])
        expect(paddingSamples['closing-target']).toEqual([9, 9])
        expect(paddingSamples['closing-midpoint']).toEqual([9, 9])
        expect(paddingSamples['closing-zero']).toEqual([9, 9])
        expect(paddingSamples['lifecycle-complete']).toEqual([9, 9])
        expect(Object.values(marginSamples)).toEqual(Object.values(marginSamples).map(() => -2))

        const continuousSamples = [
          axisSamples['closing-target'],
          axisSamples['closing-midpoint'],
          axisSamples['closing-zero'],
          axisSamples['lifecycle-complete']
        ]

        for (const [titleIndex, title] of finalTitles.entries()) {
          const coordinates = continuousSamples.map((values) => values?.[titleIndex])

          expect(
            coordinates,
            `${title === sourceTitle ? 'source' : 'decorative'} styled final ${orientation} title axis samples: ${JSON.stringify(axisSamples)}`
          ).toEqual(coordinates.map(() => coordinates[0]))
        }

        for (const values of continuousSamples) {
          expect(values?.[0]).toBe(values?.[1])
        }
      } finally {
        rendered?.unmount()
        globalThis.ResizeObserver = originalResizeObserver
      }
    }
  )

  it('UC-019 / EX-008 / CR-002 - reaches immediate width and height targets with transitions suppressed under reduced motion', async () => {
    vi.stubGlobal(
      'matchMedia',
      vi.fn((query: string) => ({
        addEventListener: vi.fn(),
        addListener: vi.fn(),
        dispatchEvent: vi.fn(),
        matches: query === '(prefers-reduced-motion: reduce)',
        media: query,
        onchange: null,
        removeEventListener: vi.fn(),
        removeListener: vi.fn()
      }))
    )
    mockRailsRects({
      'reduced-horizontal-header': { height: 40, left: 100, width: 420 },
      'reduced-horizontal-list': { height: 420, left: 100, width: 420 },
      'reduced-horizontal-root': { height: 420, left: 100, width: 420 },
      'reduced-vertical-header': { height: 420, left: 100, width: 40 },
      'reduced-vertical-list': { height: 420, left: 100, width: 420 },
      'reduced-vertical-root': { height: 420, left: 100, width: 420 }
    })

    for (const orientation of ['vertical', 'horizontal'] as const) {
      const rendered = render(<ReducedMotionRailsProbe orientation={orientation} />)
      const panel = screen.getByTestId(`reduced-${orientation}-panel`)
      const variable = orientation === 'vertical' ? '--rails-panel-width' : '--rails-panel-height'

      await waitFor(() => {
        expect(panel).toHaveAttribute('data-open')
        expect(getCssVariable(panel, variable)).toBe('380px')
      })
      expect(getEffectivePanelMotionSize(panel, orientation)).toBe('380px')
      expect(hasSuppressedSizeTransition(panel)).toBe(true)

      fireEvent.click(screen.getByRole('button', { name: `collapse reduced ${orientation} Panel` }))

      await waitFor(() => {
        expect(panel).toHaveAttribute('hidden')
        expect(panel).not.toHaveAttribute('data-ending-style')
        expect(getEffectivePanelMotionSize(panel, orientation)).toBe('0px')
      })
      expect(hasSuppressedSizeTransition(panel)).toBe(true)

      fireEvent.click(screen.getByRole('button', { name: `open reduced ${orientation} Panel` }))

      await waitFor(() => {
        expect(panel).toHaveAttribute('data-open')
        expect(panel).not.toHaveAttribute('hidden')
        expect(panel).not.toHaveAttribute('data-starting-style')
        expect(getEffectivePanelMotionSize(panel, orientation)).toBe('380px')
      })
      expect(hasSuppressedSizeTransition(panel)).toBe(true)

      rendered.unmount()
    }
  })

  it('UC-015 / EX-008 - unmounts after the horizontal closing transition and remounts with fresh Panel lifetime', async () => {
    const panelRef = createRef<HTMLDivElement>()
    const rectsByTestId = {
      'lifecycle-header-programs': { height: 40, left: 100, width: 420 },
      'lifecycle-list': { height: 420, left: 100, width: 420 },
      'lifecycle-root': { height: 420, left: 100, width: 420 }
    } satisfies Record<string, RailsElementRect>
    let finishClosingAnimation: () => void = () => undefined
    const closingAnimationFinished = new Promise<void>((resolve) => {
      finishClosingAnimation = resolve
    })

    mockRailsRects(rectsByTestId)
    vi.spyOn(HTMLElement.prototype, 'scrollHeight', 'get').mockReturnValue(380)
    Object.defineProperty(HTMLElement.prototype, 'getAnimations', {
      configurable: true,
      value(this: HTMLElement): Animation[] {
        if (!this.hasAttribute('data-ending-style')) {
          return []
        }

        return [
          {
            finished: closingAnimationFinished,
            pending: false,
            playState: 'running'
          } as unknown as Animation
        ]
      }
    })

    render(<DefaultPanelLifecycleProbe panelRef={panelRef} />)

    const initialPanel = screen.getByTestId('lifecycle-panel-programs')
    const draft = screen.getByRole('textbox', { name: 'Programs draft' })

    await waitFor(() => {
      expect(getCssVariable(initialPanel, '--rails-panel-height')).toBe('380px')
      expect(getCssVariable(initialPanel, '--accordion-panel-height')).toBe('380px')
    })
    expect(panelRef.current).toBe(initialPanel)

    fireEvent.change(draft, { target: { value: 'edited' } })
    expect(draft).toHaveValue('edited')

    fireEvent.click(screen.getByRole('button', { name: 'collapse programs lifecycle' }))

    await waitFor(() => {
      expect(initialPanel).toHaveAttribute('data-ending-style')
    })
    expect(initialPanel).toBeInTheDocument()
    expect(panelRef.current).toBe(initialPanel)

    finishClosingAnimation()

    await waitFor(() => {
      expect(screen.queryByTestId('lifecycle-panel-programs')).not.toBeInTheDocument()
      expect(panelRef.current).toBeNull()
    })

    rectsByTestId['lifecycle-list'] = { height: 500, left: 100, width: 420 }
    rectsByTestId['lifecycle-root'] = { height: 500, left: 100, width: 420 }
    fireEvent.click(screen.getByRole('button', { name: 'open programs lifecycle' }))

    const remountedPanel = screen.getByTestId('lifecycle-panel-programs')

    expect(remountedPanel).not.toBe(initialPanel)
    expect(remountedPanel).toHaveAttribute('data-starting-style')
    expect(panelRef.current).toBe(remountedPanel)
    expect(screen.getByRole('textbox', { name: 'Programs draft' })).toHaveValue('initial')
    await waitFor(() => {
      expect(getCssVariable(remountedPanel, '--rails-panel-height')).toBe('460px')
      expect(getCssVariable(remountedPanel, '--accordion-panel-height')).toBe('460px')
    })
  })

  it('UC-016 / EX-008 - inherits Root retention and applies per-Panel keepMounted overrides', async () => {
    render(<PanelMountingControlsProbe />)

    await waitFor(() => {
      expect(screen.getByText('Programs mounted: yes')).toBeInTheDocument()
      expect(screen.getByText('Athletes mounted: no')).toBeInTheDocument()
    })

    fireEvent.click(screen.getByRole('checkbox', { name: 'keep Programs mounted' }))
    fireEvent.click(screen.getByRole('button', { name: 'collapse all mounting' }))

    await waitFor(() => {
      expect(screen.getByText('Programs mounted: yes')).toBeInTheDocument()
      expect(screen.getByText('Athletes mounted: no')).toBeInTheDocument()
      expect(screen.getByTestId('mounting-panel-programs')).toBeInTheDocument()
      expect(screen.queryByTestId('mounting-panel-athletes')).not.toBeInTheDocument()
    })

    fireEvent.click(screen.getByRole('checkbox', { name: 'keep Programs mounted' }))
    fireEvent.click(screen.getByRole('checkbox', { name: 'keep all Panels mounted' }))

    await waitFor(() => {
      expect(screen.getByText('Programs mounted: no')).toBeInTheDocument()
      expect(screen.getByText('Athletes mounted: yes')).toBeInTheDocument()
      expect(screen.queryByTestId('mounting-panel-programs')).not.toBeInTheDocument()
      expect(screen.getByTestId('mounting-panel-athletes')).toBeInTheDocument()
    })
  })

  it('UC-016 / EX-008 - lets hiddenUntilFound override retention and reveal find-in-page content', async () => {
    render(<PanelMountingControlsProbe />)

    fireEvent.click(screen.getByRole('checkbox', { name: 'keep all Panels mounted' }))
    fireEvent.click(screen.getByRole('checkbox', { name: 'make closed Panels findable' }))
    fireEvent.click(screen.getByRole('button', { name: 'collapse all mounting' }))

    const programsPanel = screen.getByTestId('mounting-panel-programs')
    const athletesPanel = screen.getByTestId('mounting-panel-athletes')

    await waitFor(() => {
      expect(programsPanel).toHaveAttribute('hidden', 'until-found')
      expect(athletesPanel).toHaveAttribute('hidden', 'until-found')
      expect(screen.getByText('Programs mounted: yes')).toBeInTheDocument()
      expect(screen.getByText('Athletes mounted: yes')).toBeInTheDocument()
    })

    fireEvent(athletesPanel, new Event('beforematch'))

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Athletes mounting' })).toHaveAttribute(
        'data-panel-open'
      )
      expect(athletesPanel).toHaveAttribute('data-open')
      expect(athletesPanel).not.toHaveAttribute('hidden')
      expect(screen.getByText('Athletes unique findable content')).toBeInTheDocument()
    })
  })

  it('UC-016 / EX-008 / QA-001 - retains a dynamically findable closed Panel without an opening lifecycle', async () => {
    const { rerender } = render(
      <Rails.Root defaultValue={[]} hiddenUntilFound={false}>
        <Rails.List>
          <Rails.Item value="programs">
            <Rails.Header>
              <Rails.Rail>Programs retained lifecycle</Rails.Rail>
            </Rails.Header>
            <Rails.Panel data-testid="retained-lifecycle-panel">
              Programs retained lifecycle content
            </Rails.Panel>
          </Rails.Item>
        </Rails.List>
      </Rails.Root>
    )

    expect(screen.queryByTestId('retained-lifecycle-panel')).not.toBeInTheDocument()

    rerender(
      <Rails.Root defaultValue={[]} hiddenUntilFound>
        <Rails.List>
          <Rails.Item value="programs">
            <Rails.Header>
              <Rails.Rail>Programs retained lifecycle</Rails.Rail>
            </Rails.Header>
            <Rails.Panel data-testid="retained-lifecycle-panel">
              Programs retained lifecycle content
            </Rails.Panel>
          </Rails.Item>
        </Rails.List>
      </Rails.Root>
    )

    const panel = await screen.findByTestId('retained-lifecycle-panel')

    await waitFor(() => {
      expect(panel).toHaveAttribute('hidden', 'until-found')
      expect(panel).not.toHaveAttribute('data-open')
      expect(panel).not.toHaveAttribute('data-starting-style')
      expect(panel).not.toHaveAttribute('data-ending-style')
    })
  })

  it('UC-016 / CR-001 - reports Base UI-aligned Item details for find-in-page reveal', async () => {
    const onOpenChange = vi.fn()

    const { rerender } = render(
      <Rails.Root defaultValue={[]} hiddenUntilFound={false}>
        <Rails.List>
          <Rails.Item onOpenChange={onOpenChange} value="programs">
            <Rails.Header>
              <Rails.Rail>Programs findable details</Rails.Rail>
            </Rails.Header>
            <Rails.Panel data-testid="findable-details-panel">
              Programs findable details content
            </Rails.Panel>
          </Rails.Item>
        </Rails.List>
      </Rails.Root>
    )

    expect(screen.queryByTestId('findable-details-panel')).not.toBeInTheDocument()

    rerender(
      <Rails.Root defaultValue={[]} hiddenUntilFound>
        <Rails.List>
          <Rails.Item onOpenChange={onOpenChange} value="programs">
            <Rails.Header>
              <Rails.Rail>Programs findable details</Rails.Rail>
            </Rails.Header>
            <Rails.Panel data-testid="findable-details-panel">
              Programs findable details content
            </Rails.Panel>
          </Rails.Item>
        </Rails.List>
      </Rails.Root>
    )

    const panel = await screen.findByTestId('findable-details-panel')
    const beforeMatchEvent = new Event('beforematch')

    await waitFor(() => {
      expect(panel).toHaveAttribute('hidden', 'until-found')
    })

    fireEvent(panel, beforeMatchEvent)

    await waitFor(() => {
      expect(onOpenChange).toHaveBeenCalledTimes(1)
      expect(screen.getByRole('button', { name: 'Programs findable details' })).toHaveAttribute(
        'data-panel-open'
      )
      expect(panel).toHaveAttribute('data-open')
      expect(panel).not.toHaveAttribute('hidden')
    })

    const [nextOpen, eventDetails] = onOpenChange.mock.calls[0] as [
      boolean,
      RailsChangeEventDetails
    ]

    expect(nextOpen).toBe(true)
    expect(eventDetails).toMatchObject({
      event: beforeMatchEvent,
      isCanceled: false,
      isPropagationAllowed: false,
      reason: 'none',
      trigger: undefined
    })
    expect(eventDetails.cancel).toEqual(expect.any(Function))
    expect(eventDetails.allowPropagation).toEqual(expect.any(Function))
  })

  it('UC-016 / CR-001 - lets Item cancellation prevent find-in-page reveal', async () => {
    const onOpenChange = vi.fn((_open: boolean, eventDetails: RailsChangeEventDetails) => {
      eventDetails.cancel()
    })

    const { rerender } = render(
      <Rails.Root defaultValue={[]} hiddenUntilFound={false}>
        <Rails.List>
          <Rails.Item onOpenChange={onOpenChange} value="athletes">
            <Rails.Header>
              <Rails.Rail>Athletes canceled findable reveal</Rails.Rail>
            </Rails.Header>
            <Rails.Panel data-testid="canceled-findable-panel">
              Athletes canceled findable content
            </Rails.Panel>
          </Rails.Item>
        </Rails.List>
      </Rails.Root>
    )

    expect(screen.queryByTestId('canceled-findable-panel')).not.toBeInTheDocument()

    rerender(
      <Rails.Root defaultValue={[]} hiddenUntilFound>
        <Rails.List>
          <Rails.Item onOpenChange={onOpenChange} value="athletes">
            <Rails.Header>
              <Rails.Rail>Athletes canceled findable reveal</Rails.Rail>
            </Rails.Header>
            <Rails.Panel data-testid="canceled-findable-panel">
              Athletes canceled findable content
            </Rails.Panel>
          </Rails.Item>
        </Rails.List>
      </Rails.Root>
    )

    const panel = await screen.findByTestId('canceled-findable-panel')
    const beforeMatchEvent = new Event('beforematch')

    await waitFor(() => {
      expect(panel).toHaveAttribute('hidden', 'until-found')
    })

    await act(async () => {
      fireEvent(panel, beforeMatchEvent)
      await Promise.resolve()
    })

    expect(onOpenChange).toHaveBeenCalledTimes(1)

    const [nextOpen, eventDetails] = onOpenChange.mock.calls[0] as [
      boolean,
      RailsChangeEventDetails
    ]

    expect(nextOpen).toBe(true)
    expect(eventDetails).toMatchObject({
      event: beforeMatchEvent,
      isCanceled: true,
      reason: 'none',
      trigger: undefined
    })
    expect(
      screen.getByRole('button', { name: 'Athletes canceled findable reveal' })
    ).not.toHaveAttribute('data-panel-open')
    expect(panel).not.toHaveAttribute('data-open')
    expect(panel).toHaveAttribute('hidden', 'until-found')
  })

  it('UC-016 / CR-004 - applies per-Panel hiddenUntilFound overrides in both directions', async () => {
    render(
      <>
        <Rails.Root defaultValue={[]} hiddenUntilFound={false}>
          <Rails.List>
            <Rails.Item value="programs">
              <Rails.Header>
                <Rails.Rail>Programs Panel override</Rails.Rail>
              </Rails.Header>
              <Rails.Panel data-testid="panel-enables-hidden-until-found" hiddenUntilFound>
                Programs Panel override content
              </Rails.Panel>
            </Rails.Item>
          </Rails.List>
        </Rails.Root>

        <Rails.Root defaultValue={[]} hiddenUntilFound>
          <Rails.List>
            <Rails.Item value="athletes">
              <Rails.Header>
                <Rails.Rail>Athletes Panel override</Rails.Rail>
              </Rails.Header>
              <Rails.Panel data-testid="panel-disables-hidden-until-found" hiddenUntilFound={false}>
                Athletes Panel override content
              </Rails.Panel>
            </Rails.Item>
          </Rails.List>
        </Rails.Root>
      </>
    )

    await waitFor(() => {
      expect(screen.getByTestId('panel-enables-hidden-until-found')).toHaveAttribute(
        'hidden',
        'until-found'
      )
      expect(screen.queryByTestId('panel-disables-hidden-until-found')).not.toBeInTheDocument()
    })
  })

  it('UC-004 / UC-007 / UC-011 / EX-005 / EX-007 - preserves static Item overlap and complete Rail borders for uneven Rails', () => {
    mockRailsItemStartMargins()
    render(<StableRailsMotionProbe />)

    const list = screen.getByTestId('fusion-list')
    const overviewRail = screen.getByRole('button', { name: 'Overview' })
    const trainingRail = screen.getByRole('button', { name: 'Training' })
    const nutritionRail = screen.getByRole('button', { name: 'Nutrition' })
    const orderedItems = Array.from(list.children)

    expect(list).toHaveAttribute('data-rails-list')
    expect(getCssVariable(list, '--rails-border-width')).toBe('3px')
    expect(orderedItems).toEqual([
      screen.getByTestId('fusion-item-overview'),
      screen.getByTestId('fusion-item-training'),
      screen.getByTestId('fusion-item-nutrition')
    ])
    expect(orderedItems.map((item) => item.getAttribute('data-index'))).toEqual(['0', '1', '2'])
    expect(
      orderedItems.map((item) => getRailsItemStartMargin(item as HTMLElement, 'vertical'))
    ).toEqual([0, -3, -3])
    expect(screen.getByTestId('fusion-item-overview')).not.toHaveAttribute('data-open')
    expect(screen.getByTestId('fusion-item-training')).toHaveAttribute('data-open')
    expect(screen.getByTestId('fusion-item-nutrition')).not.toHaveAttribute('data-open')
    expect(overviewRail).toHaveClass('w-10')
    expect(trainingRail).toHaveClass('w-14')
    expect(nutritionRail).toHaveClass('w-10')

    for (const rail of [overviewRail, trainingRail, nutritionRail]) {
      expect(getRevealRoot(rail)).toHaveAttribute('data-reveal-root')
      expectCompleteRailAxisBorders(rail, 'vertical', 3)

      const overlaySurface = getRevealOverlaySurface(rail)

      expect(overlaySurface).toHaveAttribute('data-reveal-overlay-surface')
      expectCompleteRailAxisBorders(overlaySurface, 'vertical', 3)
      expect(overlaySurface).not.toHaveClass('border-transparent')
    }
  })

  it('UC-005 / UC-014 / EX-002 / QA-004 / CR-001 - keeps external controlled opening from all-collapsed on the zero-width starting state', async () => {
    mockRailsRects({
      'controlled-header-athletes': { left: 580, width: 40 },
      'controlled-header-programs': { left: 200, width: 40 },
      'controlled-list': { left: 200, width: 420 },
      'controlled-root': { left: 200, width: 420 }
    })
    render(<ControlledRailsProbe />)

    const programsRail = screen.getByRole('button', { name: 'Programs' })
    const athletesRail = screen.getByRole('button', { name: 'Athletes' })
    const programsItem = screen.getByTestId('controlled-item-programs')

    expect(screen.getByLabelText('active item')).toHaveTextContent('none')
    expect(programsRail).not.toHaveAttribute('data-panel-open')
    expect(athletesRail).not.toHaveAttribute('data-panel-open')
    expect(programsItem).not.toHaveAttribute('data-open')
    expect(screen.queryByTestId('controlled-panel-programs')).not.toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'open programs' }))

    const programsPanel = screen.getByTestId('controlled-panel-programs')

    await waitFor(() => {
      expect(screen.getByLabelText('active item')).toHaveTextContent('programs')
      expect(programsItem).toHaveAttribute('data-open')
      expect(programsRail).toHaveAttribute('data-panel-open')
      expect(athletesRail).not.toHaveAttribute('data-panel-open')
      expect(programsPanel).toHaveAttribute('data-open')
      expect(programsPanel).toHaveAttribute('data-starting-style')
    })

    expect(getCssVariable(programsPanel, '--rails-panel-width')).toBe('341px')
    expect(getCssVariable(programsPanel, '--accordion-panel-width')).toBe('341px')
  })

  it('UC-014 / EX-002 / CR-001 - keeps Rail-controlled opening from all-collapsed on the zero-width starting state', async () => {
    mockRailsRects({
      'controlled-header-athletes': { left: 580, width: 40 },
      'controlled-header-programs': { left: 200, width: 40 },
      'controlled-list': { left: 200, width: 420 },
      'controlled-root': { left: 200, width: 420 }
    })
    render(<ControlledRailsProbe />)

    const programsRail = screen.getByRole('button', { name: 'Programs' })
    const athletesRail = screen.getByRole('button', { name: 'Athletes' })
    const programsItem = screen.getByTestId('controlled-item-programs')

    expect(screen.getByLabelText('active item')).toHaveTextContent('none')
    expect(programsRail).not.toHaveAttribute('data-panel-open')
    expect(athletesRail).not.toHaveAttribute('data-panel-open')
    expect(screen.queryByTestId('controlled-panel-programs')).not.toBeInTheDocument()

    fireEvent.click(programsRail)

    const programsPanel = screen.getByTestId('controlled-panel-programs')

    await waitFor(() => {
      expect(screen.getByLabelText('active item')).toHaveTextContent('programs')
      expect(programsItem).toHaveAttribute('data-open')
      expect(programsRail).toHaveAttribute('data-panel-open')
      expect(athletesRail).not.toHaveAttribute('data-panel-open')
      expect(programsPanel).toHaveAttribute('data-open')
      expect(programsPanel).toHaveAttribute('data-starting-style')
    })

    expect(getCssVariable(programsPanel, '--rails-panel-width')).toBe('341px')
    expect(getCssVariable(programsPanel, '--accordion-panel-width')).toBe('341px')
  })

  it('UC-007 / EX-001 / SQ-001 - renders Rail with Button chrome and fixed left-to-right hover reveal behavior', () => {
    render(<DefaultRailsProbe />)

    const overviewRail = screen.getByRole('button', { name: 'Overview' })
    const trainingRail = screen.getByRole('button', { name: 'Training' })

    expect(overviewRail).toHaveClass(
      'bg-background',
      'border',
      'border-foreground',
      'focus-visible:outline-foreground',
      'text-foreground',
      'transition-colors',
      'w-10'
    )
    expect(overviewRail).toHaveAttribute('data-panel-open')
    expect(trainingRail).not.toHaveAttribute('data-panel-open')
    expect(screen.getAllByRole('button', { name: 'Overview' })).toHaveLength(1)
    expect(screen.getAllByRole('button', { name: 'Training' })).toHaveLength(1)
    expect(getRevealRoot(overviewRail)).toHaveAttribute('data-motion', 'reveal')
    expect(getRevealRoot(trainingRail)).toHaveAttribute('data-motion', 'reveal')
    expectClipPath(getRevealOverlay(overviewRail), REVEALED_CLIP_PATH)
    expectClipPath(getRevealOverlay(trainingRail), LEFT_TO_RIGHT_HIDDEN_CLIP_PATH)
    expect(getRevealCopyScale(overviewRail)).toHaveStyle({
      '--reveal-origin': 'left center'
    })

    const overviewRailClassName = overviewRail.getAttribute('class') ?? ''

    expect(overviewRailClassName).toContain('[&_[data-reveal-source]]:flex')
    expect(overviewRailClassName).toContain('[&_[data-reveal-source]]:size-full')
    expect(getRevealOverlaySurface(overviewRail)).toHaveClass('border', 'border-foreground')

    fireEvent.mouseEnter(trainingRail)

    expectClipPath(getRevealOverlay(trainingRail), REVEALED_CLIP_PATH)

    fireEvent.mouseLeave(trainingRail)

    expectClipPath(getRevealOverlay(trainingRail), LEFT_TO_RIGHT_HIDDEN_CLIP_PATH)

    fireEvent.mouseEnter(overviewRail)

    expectClipPath(getRevealOverlay(overviewRail), REVEALED_CLIP_PATH)

    fireEvent.mouseLeave(overviewRail)

    expectClipPath(getRevealOverlay(overviewRail), REVEALED_CLIP_PATH)
  })

  it('UC-007 / UC-012 / EX-001 / EX-007 / QA-002 - aligns Rail reveal titles on one inset top-edge axis with the default RevealAnimation scale', () => {
    render(<DefaultRailsProbe />)

    const trainingRail = screen.getByRole('button', { name: 'Training' })
    const sourceTitle = getFirstHtmlElementChild(
      getRevealSource(trainingRail),
      'Expected Training source title'
    )
    const revealCopyScale = getRevealCopyScale(trainingRail)
    const revealedTitle = getFirstHtmlElementChild(
      revealCopyScale,
      'Expected Training revealed title'
    )
    const sourceTopAxisClass = getInsetTopAxisClass(
      sourceTitle,
      'Expected Training source title to use an inset top-edge axis'
    )

    expect(screen.getAllByRole('button', { name: 'Training' })).toHaveLength(1)
    expect(getRevealRoot(trainingRail)).toHaveAttribute('data-motion', 'reveal')
    expect(revealedTitle).toHaveClass(sourceTopAxisClass)
    expect(getRevealCopyScaleInsetTopAxisClass(trainingRail)).toBe(sourceTopAxisClass)
    expect(sourceTitle).toHaveClass(
      'absolute',
      'left-1/2',
      'origin-[left_center]',
      '[transform:translateY(-50%)_rotate(90deg)]',
      'text-left'
    )
    expect(revealedTitle).toHaveClass(
      'absolute',
      'left-1/2',
      'origin-[left_center]',
      '[transform:translateY(-50%)_rotate(90deg)]',
      'text-left'
    )
    expect(revealCopyScale).toHaveStyle({
      '--reveal-origin': 'left center'
    })
    expect(getCssTransform(revealCopyScale)).toContain('scale(1.2)')
  })

  it('UC-011 / UC-013 / EX-001 / QA-001 - keeps static Item overlap and complete borders throughout Panel motion', async () => {
    mockRailsRects({
      'rail-header-nutrition': { left: 480, width: 40 },
      'rail-header-overview': { left: 100, width: 40 },
      'rail-header-training': { left: 440, width: 40 },
      'rail-list': { left: 100, width: 420 },
      'rail-root': { left: 100, width: 420 }
    })
    render(<DefaultRailsProbe />)

    const items = [
      screen.getByTestId('rail-item-overview'),
      screen.getByTestId('rail-item-training'),
      screen.getByTestId('rail-item-nutrition')
    ]
    const trainingRail = screen.getByRole('button', { name: 'Training' })
    const nutritionRail = screen.getByRole('button', { name: 'Nutrition' })
    const nutritionSurfaces = [nutritionRail, getRevealOverlaySurface(nutritionRail)]
    const expectStaticGeometry = () => {
      expect(items.map((item) => getRailsItemStartMargin(item, 'vertical'))).toEqual([0, -1, -1])

      for (const surface of nutritionSurfaces) {
        expectCompleteRailAxisBorders(surface, 'vertical', 1)
      }
    }

    await waitFor(() => {
      expect(getCssVariable(screen.getByTestId('rail-panel-overview'), '--rails-panel-width')).toBe(
        '302px'
      )
      expect(screen.getByTestId('rail-panel-overview')).toHaveAttribute('data-open')
      expect(screen.queryByTestId('rail-panel-training')).not.toBeInTheDocument()
      expect(screen.queryByTestId('rail-panel-nutrition')).not.toBeInTheDocument()
    })
    expectStaticGeometry()

    fireEvent.click(trainingRail)

    const trainingPanel = screen.getByTestId('rail-panel-training')

    await waitFor(() => {
      expect(trainingRail).toHaveAttribute('data-panel-open')
      expect(trainingPanel).toHaveAttribute('data-open')
    })
    expectStaticGeometry()

    fireEvent.click(screen.getByRole('button', { name: 'Overview' }))

    await waitFor(() => {
      expect(trainingPanel).toHaveAttribute('data-ending-style')
    })
    expect(getCssVariable(trainingPanel, '--rails-panel-width')).toBe('302px')
    expectStaticGeometry()

    expect(trainingPanel.style.transitionProperty).toBe('width')
    expect(trainingPanel).toHaveClass('transition-[width]')
    expect(trainingPanel).toHaveClass('[&>*]:min-w-[var(--rails-panel-width)]')
  })

  it('UC-007 / UC-008 / EX-003 / SQ-001 - disables an item and prevents hover reveal or activation', () => {
    const onValueChange = vi.fn()

    render(
      <div className="h-100 w-100">
        <Rails.Root defaultValue={['available']} onValueChange={onValueChange}>
          <Rails.List>
            <Rails.Item data-testid="available-item" value="available">
              <Rails.Header data-testid="available-header">
                <Rails.Rail>Available</Rails.Rail>
              </Rails.Header>
              <Rails.Panel data-testid="available-panel">
                <div className="p-4">Available panel</div>
              </Rails.Panel>
            </Rails.Item>

            <Rails.Item data-testid="locked-item" disabled value="locked">
              <Rails.Header data-testid="locked-header">
                <Rails.Rail>Locked</Rails.Rail>
              </Rails.Header>
              <Rails.Panel data-testid="locked-panel" keepMounted>
                <div className="p-4">Locked panel</div>
              </Rails.Panel>
            </Rails.Item>
          </Rails.List>
        </Rails.Root>
      </div>
    )

    const availableRail = screen.getByRole('button', { name: 'Available' })
    const lockedRail = screen.getByRole('button', { name: 'Locked' })

    expect(screen.getByTestId('locked-item')).toHaveAttribute('data-disabled')
    expect(screen.getByTestId('locked-header')).toHaveAttribute('data-disabled')
    expect(lockedRail).toHaveAttribute('data-disabled')
    expect(screen.getByTestId('locked-panel')).toHaveAttribute('data-disabled')
    expect(availableRail).toHaveAttribute('data-panel-open')
    expect(lockedRail).not.toHaveAttribute('data-panel-open')
    expectClipPath(getRevealOverlay(lockedRail), LEFT_TO_RIGHT_HIDDEN_CLIP_PATH)

    fireEvent.mouseEnter(lockedRail)

    expectClipPath(getRevealOverlay(lockedRail), LEFT_TO_RIGHT_HIDDEN_CLIP_PATH)

    fireEvent.mouseLeave(lockedRail)

    expectClipPath(getRevealOverlay(lockedRail), LEFT_TO_RIGHT_HIDDEN_CLIP_PATH)

    fireEvent.click(lockedRail)

    expect(availableRail).toHaveAttribute('data-panel-open')
    expect(lockedRail).not.toHaveAttribute('data-panel-open')
    expect(onValueChange).not.toHaveBeenCalled()
  })

  it('UC-009 / EX-004 - renders a Link Rail without routing through Button navigation', () => {
    render(
      <div className="h-100 w-100">
        <Rails.Root defaultValue={['programs']}>
          <Rails.List>
            <Rails.Item value="programs">
              <Rails.Header>
                <Rails.Rail nativeButton={false} render={<RouterLink to="/programs" />}>
                  Programs
                </Rails.Rail>
              </Rails.Header>
              <Rails.Panel>
                <div className="p-4">Programs navigation panel</div>
              </Rails.Panel>
            </Rails.Item>

            <Rails.Item value="athletes">
              <Rails.Header>
                <Rails.Rail nativeButton={false} render={<RouterLink to="/athletes" />}>
                  Athletes
                </Rails.Rail>
              </Rails.Header>
              <Rails.Panel>
                <div className="p-4">Athletes navigation panel</div>
              </Rails.Panel>
            </Rails.Item>
          </Rails.List>
        </Rails.Root>
      </div>
    )

    const programsLink = getRequiredElement(
      screen.getByRole('button', { name: 'Programs' }).closest('a'),
      'Expected Programs Rail to render on the Link surface'
    )
    const athletesLink = getRequiredElement(
      screen.getByRole('button', { name: 'Athletes' }).closest('a'),
      'Expected Athletes Rail to render on the Link surface'
    )

    expect(programsLink.tagName).toBe('A')
    expect(programsLink).toHaveAttribute('href', '/programs')
    expect(programsLink).toHaveAttribute('data-panel-open')
    expect(programsLink).toHaveClass(
      'bg-background',
      'border',
      'border-foreground',
      'text-foreground',
      'transition-colors'
    )
    expect(programsLink).not.toHaveAttribute('data-loading')
    expect(athletesLink.tagName).toBe('A')
    expect(athletesLink).toHaveAttribute('href', '/athletes')
    expect(athletesLink).not.toHaveAttribute('data-panel-open')
  })

  it('UC-001 / UC-015 / UC-016 - exposes every renamed namespaced type and mounting prop', () => {
    expectTypeOf<RailsOrientation>().toEqualTypeOf<'vertical' | 'horizontal'>()
    expectTypeOf<PublicRails.Root.Value>().toEqualTypeOf<RailsRootValue>()
    expectTypeOf<PublicRails.Root.State>().toEqualTypeOf<RailsRootState>()
    expectTypeOf<PublicRails.Root.Props>().toEqualTypeOf<PublicRailsRootProps>()
    expectTypeOf<PublicRails.Root.ChangeEventReason>().toEqualTypeOf<RailsRootChangeEventReason>()
    expectTypeOf<PublicRails.Root.ChangeEventDetails>().toEqualTypeOf<RailsRootChangeEventDetails>()
    expectTypeOf<PublicRailsRootProps['keepMounted']>().toEqualTypeOf<boolean | undefined>()
    expectTypeOf<PublicRailsRootProps['hiddenUntilFound']>().toEqualTypeOf<boolean | undefined>()
    expectTypeOf<PublicRailsRootProps['orientation']>().toEqualTypeOf<
      RailsOrientation | undefined
    >()
    expectTypeOf<RailsRootState['orientation']>().toEqualTypeOf<RailsOrientation>()
    expectTypeOf<PublicRails.List.Props>().toEqualTypeOf<RailsListProps>()
    expectTypeOf<PublicRails.Item.State>().toEqualTypeOf<RailsItemState>()
    expectTypeOf<RailsItemState['orientation']>().toEqualTypeOf<RailsOrientation>()
    expectTypeOf<PublicRails.Item.Props>().toEqualTypeOf<PublicRailsItemProps>()
    expectTypeOf<PublicRails.Item.ChangeEventReason>().toEqualTypeOf<RailsItemChangeEventReason>()
    expectTypeOf<PublicRails.Item.ChangeEventDetails>().toEqualTypeOf<RailsItemChangeEventDetails>()
    expectTypeOf<PublicRails.Header.State>().toEqualTypeOf<RailsHeaderState>()
    expectTypeOf<RailsHeaderState['orientation']>().toEqualTypeOf<RailsOrientation>()
    expectTypeOf<PublicRails.Header.Props>().toEqualTypeOf<RailsHeaderProps>()
    expectTypeOf<PublicRails.Rail.State>().toEqualTypeOf<RailsRailState>()
    expectTypeOf<RailsRailState['orientation']>().toEqualTypeOf<RailsOrientation>()
    expectTypeOf<PublicRails.Rail.Props>().toEqualTypeOf<PublicRailsRailProps>()
    expectTypeOf<RailsRailOmitsRevealControls>().toEqualTypeOf<true>()
    expectTypeOf<RailsRootOmitsIndicator>().toEqualTypeOf<true>()
    expectTypeOf<RailsNamespaceOmitsIndicator>().toEqualTypeOf<true>()
    expectTypeOf<PublicRails.Panel.State>().toEqualTypeOf<RailsPanelState>()
    expectTypeOf<RailsPanelState['orientation']>().toEqualTypeOf<RailsOrientation>()
    expectTypeOf<PublicRails.Panel.Props>().toEqualTypeOf<RailsPanelProps>()
    expectTypeOf<RailsPanelProps['keepMounted']>().toEqualTypeOf<boolean | undefined>()
    expectTypeOf<RailsPanelProps['hiddenUntilFound']>().toEqualTypeOf<boolean | undefined>()
  })

  it('UC-001 / EX-001 / EX-002 / EX-003 / EX-004 / EX-005 / EX-007 / EX-008 / EX-009 / EX-010 - exposes only the documented Rails parts and leaves through public package assemblies', () => {
    const partNames = ['Root', 'List', 'Item', 'Header', 'Rail', 'Panel'] as const
    const leafExports = {
      Header: PACKAGE_EXPORTS.RailsHeader,
      Item: PACKAGE_EXPORTS.RailsItem,
      List: PACKAGE_EXPORTS.RailsList,
      Panel: PACKAGE_EXPORTS.RailsPanel,
      Rail: PACKAGE_EXPORTS.RailsRail,
      Root: PACKAGE_EXPORTS.RailsRoot
    }

    expect(PACKAGE_EXPORTS.Rails).toBeDefined()
    expect(PACKAGE_EXPORTS.Components.Rails).toBe(PACKAGE_EXPORTS.Rails)
    expect(PACKAGE_EXPORTS.Ui.Components).toBe(PACKAGE_EXPORTS.Components)
    expect(PACKAGE_EXPORTS.Ui.Components.Rails).toBe(PACKAGE_EXPORTS.Rails)

    for (const partName of partNames) {
      expect(PACKAGE_EXPORTS.Rails[partName]).toBeTypeOf('function')
      expect(leafExports[partName]).toBe(PACKAGE_EXPORTS.Rails[partName])
    }

    expect(PACKAGE_EXPORTS.Rails).not.toHaveProperty('Indicator')
    expect(PackageExports).not.toHaveProperty('RailsIndicator')
    expect(PACKAGE_EXPORTS.Rails).not.toHaveProperty('multiple')
    expect(PACKAGE_EXPORTS.Rails).not.toHaveProperty('orientation')
    expect(PACKAGE_EXPORTS.Rails).not.toHaveProperty('Trigger')
    expect(PackageExports).not.toHaveProperty('RailAccordion')
  })
})
