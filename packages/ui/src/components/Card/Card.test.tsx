import { Radio as BaseUiRadio } from '@base-ui/react/radio'
import { RadioGroup as BaseUiRadioGroup } from '@base-ui/react/radio-group'
import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import {
  createRef,
  type ComponentPropsWithRef,
  type CSSProperties,
  type ReactElement,
  type ReactNode
} from 'react'
import { expectTypeOf } from 'vitest'

import {
  type ButtonProps,
  type CardButtonProps,
  type CardContentProps,
  type CardDescriptionProps,
  type CardFooterProps,
  type CardGroupChangeEventDetails,
  type CardGroupChangeEventReason,
  type CardGroupProps,
  type CardGroupState,
  type CardHeaderProps,
  type CardRootProps,
  type CardRootState,
  type CardSelectorProps,
  type CardSelectorState,
  type CardSize,
  type CardSurfaceProps,
  type CardSurfaceState,
  type CardTitleProps,
  type CardVisualPlacement,
  type CardVisualProps,
  type CardVisualStripesProps,
  type HeadingProps,
  type StripesProps,
  type TextProps
} from '../..'
import * as PackageExports from '../..'

type CardButtonComponent = (props: CardButtonProps) => ReactElement | null

type CardContentComponent = (props: CardContentProps) => ReactElement | null

type CardDescriptionComponent = (props: CardDescriptionProps) => ReactElement | null

type CardFooterComponent = (props: CardFooterProps) => ReactElement | null

type CardGroupComponent = <TValue>(props: CardGroupProps<TValue>) => ReactElement | null

type CardHeaderComponent = (props: CardHeaderProps) => ReactElement | null

type CardRootComponent = (props: CardRootProps) => ReactElement | null

type CardSelectorComponent = <TValue>(props: CardSelectorProps<TValue>) => ReactElement | null

type CardSurfaceComponent = (props: CardSurfaceProps) => ReactElement | null

type CardTitleComponent = (props: CardTitleProps) => ReactElement | null

type CardVisualComponent = (props: CardVisualProps) => ReactElement | null

interface CardNamespaceContract {
  Button: CardButtonComponent
  Content: CardContentComponent
  Description: CardDescriptionComponent
  Footer: CardFooterComponent
  Group: CardGroupComponent
  Header: CardHeaderComponent
  Root: CardRootComponent
  Selector: CardSelectorComponent
  Surface: CardSurfaceComponent
  Title: CardTitleComponent
  Visual: CardVisualComponent
}

interface CardPackageContract {
  Card: CardNamespaceContract
  CardButton: CardButtonComponent
  CardContent: CardContentComponent
  CardDescription: CardDescriptionComponent
  CardFooter: CardFooterComponent
  CardGroup: CardGroupComponent
  CardHeader: CardHeaderComponent
  CardRoot: CardRootComponent
  CardSelector: CardSelectorComponent
  CardSurface: CardSurfaceComponent
  CardTitle: CardTitleComponent
  CardVisual: CardVisualComponent
  Components: typeof PackageExports.Components & {
    Card: CardNamespaceContract
  }
  Ui: typeof PackageExports.Ui & {
    Components: typeof PackageExports.Components & {
      Card: CardNamespaceContract
    }
  }
}

type CardButtonOmitsSize = Extract<'size', keyof CardButtonProps> extends never ? true : false

type CardSelectorOmitsChildren =
  Extract<'children', keyof CardSelectorProps<string>> extends never ? true : false

type CardSurfaceOmitsUniqueProps =
  Extract<'id' | 'ref', keyof CardSurfaceProps> extends never ? true : false

type CardSurfaceOmitsRevealControls =
  Extract<
    | 'alignX'
    | 'alignY'
    | 'contentMode'
    | 'direction'
    | 'offsetX'
    | 'offsetY'
    | 'onRevealChange'
    | 'onRevealComplete'
    | 'onRevealStart'
    | 'reveal'
    | 'scale',
    keyof CardSurfaceProps
  > extends never
    ? true
    : false

type StripesCssProperties = CSSProperties &
  Partial<
    Record<'--stripes-angle' | '--stripes-color' | '--stripes-gap' | '--stripes-width', string>
  >

const PACKAGE_EXPORTS = PackageExports as typeof PackageExports & CardPackageContract
const Button = PACKAGE_EXPORTS.Button
const Card = PACKAGE_EXPORTS.Card
const CardButton = PACKAGE_EXPORTS.CardButton
const CardContent = PACKAGE_EXPORTS.CardContent
const CardDescription = PACKAGE_EXPORTS.CardDescription
const CardFooter = PACKAGE_EXPORTS.CardFooter
const CardGroup = PACKAGE_EXPORTS.CardGroup
const CardHeader = PACKAGE_EXPORTS.CardHeader
const CardRoot = PACKAGE_EXPORTS.CardRoot
const CardSelector = PACKAGE_EXPORTS.CardSelector
const CardSurface = PACKAGE_EXPORTS.CardSurface
const CardTitle = PACKAGE_EXPORTS.CardTitle
const CardVisual = PACKAGE_EXPORTS.CardVisual
const CARD_BUTTON_OMITS_SIZE = true satisfies CardButtonOmitsSize
const CARD_SELECTOR_OMITS_CHILDREN = true satisfies CardSelectorOmitsChildren
const CARD_SURFACE_OMITS_UNIQUE_PROPS = true satisfies CardSurfaceOmitsUniqueProps
const CARD_SURFACE_OMITS_REVEAL_CONTROLS = true satisfies CardSurfaceOmitsRevealControls

const CARD_SIZE_CASES = [
  {
    axisSpacing: '2',
    buttonClassName: 'h-7',
    contentClassNames: ['px-2', 'pb-2'],
    descriptionClassName: 'text-xs',
    footerClassNames: ['gap-2', 'px-2', 'py-2'],
    headerClassNames: ['gap-0', 'p-2'],
    iconClassName: 'size-8',
    rootSize: 'xs',
    svgClassName: '[&_svg]:size-4',
    titleClassName: 'text-lg',
    visualClassNames: ['h-12', 'p-2']
  },
  {
    axisSpacing: '3',
    buttonClassName: 'h-9',
    contentClassNames: ['px-3', 'pb-3'],
    descriptionClassName: 'text-sm',
    footerClassNames: ['gap-3', 'px-3', 'py-3'],
    headerClassNames: ['gap-1', 'p-3'],
    iconClassName: 'size-10',
    rootSize: 'md',
    svgClassName: '[&_svg]:size-5',
    titleClassName: 'text-2xl',
    visualClassNames: ['h-16.5', 'shrink-0', 'p-3']
  },
  {
    axisSpacing: '5',
    buttonClassName: 'h-10',
    contentClassNames: ['px-5', 'pb-5'],
    descriptionClassName: 'text-md',
    footerClassNames: ['gap-5', 'px-5', 'py-5'],
    headerClassNames: ['gap-2', 'p-5'],
    iconClassName: 'size-14',
    rootSize: 'xl',
    svgClassName: '[&_svg]:size-7',
    titleClassName: 'text-4xl',
    visualClassNames: ['h-24.5', 'shrink-0', 'p-5']
  }
] as const

function getRealSurface(root: HTMLElement): HTMLElement {
  const wrapper = root.querySelector<HTMLElement>('[data-reveal-surface]')
  const surface = wrapper?.firstElementChild

  expect(wrapper).toBeInTheDocument()
  expect(surface).toBeInstanceOf(HTMLElement)

  return surface as HTMLElement
}

function getDecorativeSurface(root: HTMLElement): HTMLElement {
  const surface = root.querySelector<HTMLElement>('[data-reveal-overlay-surface]')

  expect(surface).toBeInTheDocument()

  return surface as HTMLElement
}

function getRevealOverlay(root: HTMLElement): HTMLElement {
  const overlay = root.querySelector<HTMLElement>('[data-reveal-overlay]')

  expect(overlay).toBeInTheDocument()

  return overlay as HTMLElement
}

function getStripedLayers(surface: HTMLElement): HTMLElement[] {
  return Array.from(surface.querySelectorAll<HTMLElement>('*')).filter((element) =>
    (element.style.backgroundImage || element.style.background).includes(
      'repeating-linear-gradient'
    )
  )
}

describe('Card', () => {
  it('UC-001 / UC-019 - exposes Surface in the multipart namespace, prefixed leaves, and public types', () => {
    expect(typeof Card).toBe('object')
    expect(Card.Surface).toBeTypeOf('function')
    expect(CardSurface).toBeTypeOf('function')
    expect(Card).toEqual({
      Button: CardButton,
      Content: CardContent,
      Description: CardDescription,
      Footer: CardFooter,
      Group: CardGroup,
      Header: CardHeader,
      Root: CardRoot,
      Selector: CardSelector,
      Surface: CardSurface,
      Title: CardTitle,
      Visual: CardVisual
    })
    expect(PACKAGE_EXPORTS.Components.Card).toBe(Card)
    expect(PACKAGE_EXPORTS.Ui.Components).toBe(PACKAGE_EXPORTS.Components)
    expect(PACKAGE_EXPORTS.Ui.Components.Card).toBe(Card)

    expectTypeOf<CardSize>().toEqualTypeOf<'xs' | 'md' | 'xl'>()
    expectTypeOf<CardVisualPlacement>().toEqualTypeOf<'flow' | 'overlay'>()
    expectTypeOf<CardGroupProps<string>>().toEqualTypeOf<BaseUiRadioGroup.Props<string>>()
    expectTypeOf<CardGroupState>().toEqualTypeOf<BaseUiRadioGroup.State>()
    expectTypeOf<CardGroupChangeEventReason>().toEqualTypeOf<BaseUiRadioGroup.ChangeEventReason>()
    expectTypeOf<CardGroupChangeEventDetails>().toEqualTypeOf<BaseUiRadioGroup.ChangeEventDetails>()
    expectTypeOf<CardSelectorProps<string>>().toEqualTypeOf<
      Omit<BaseUiRadio.Root.Props<string>, 'children'>
    >()
    expectTypeOf<CardSelectorState>().toEqualTypeOf<BaseUiRadio.Root.State>()
    expectTypeOf<CardRootState>().toEqualTypeOf<{
      disabled: boolean
      readOnly: boolean
      selectable: boolean
      selected: boolean
      size: CardSize
    }>()
    expectTypeOf<CardSurfaceState>().toEqualTypeOf<CardRootState>()
    expectTypeOf<CardTitleProps>().toEqualTypeOf<HeadingProps>()
    expectTypeOf<CardDescriptionProps>().toEqualTypeOf<TextProps>()
    expectTypeOf<CardHeaderProps>().toEqualTypeOf<ComponentPropsWithRef<'div'>>()
    expectTypeOf<CardContentProps>().toEqualTypeOf<ComponentPropsWithRef<'div'>>()
    expectTypeOf<CardFooterProps>().toEqualTypeOf<ComponentPropsWithRef<'div'>>()
    expectTypeOf<CardButtonProps>().toEqualTypeOf<Omit<ButtonProps, 'size'>>()
    expectTypeOf<CardVisualStripesProps>().toEqualTypeOf<
      Omit<StripesProps, 'aria-hidden' | 'children' | 'render'>
    >()
    expect(CARD_BUTTON_OMITS_SIZE).toBe(true)
    expect(CARD_SELECTOR_OMITS_CHILDREN).toBe(true)
    expect(CARD_SURFACE_OMITS_UNIQUE_PROPS).toBe(true)
    expect(CARD_SURFACE_OMITS_REVEAL_CONTROLS).toBe(true)
  })

  it('UC-001 / UC-019 / CR-007 - gives the Surface render callback its complete subtree before duplicating it', () => {
    const rootRef = createRef<HTMLDivElement>()
    const onRootClick = vi.fn()
    const onSurfaceClick = vi.fn()
    const surfaceClassName = vi.fn(
      (state: CardSurfaceState) => `surface-${state.size}-${state.selected ? 'selected' : 'idle'}`
    )
    const surfaceRenderChildren: ReactNode[] = []
    const surfaceRenderStates: CardSurfaceState[] = []
    const surfaceChildren = (
      <>
        <Card.Header>
          <Card.Title render={<h2 />}>From Scratch</Card.Title>
          <Card.Description>Create an exercise from scratch.</Card.Description>
        </Card.Header>
        <Card.Content>Optional content</Card.Content>
        <Card.Footer>Blank build</Card.Footer>
      </>
    )

    const { container } = render(
      <Card.Root
        className="consumer-root"
        data-testid="card-root"
        onClick={onRootClick}
        ref={rootRef}
        style={{ minHeight: 240 }}
      >
        <Card.Surface
          className={surfaceClassName}
          data-purpose="visual-envelope"
          onClick={onSurfaceClick}
          render={(props: ComponentPropsWithRef<'section'>, state: CardSurfaceState) => {
            surfaceRenderChildren.push(props.children)
            surfaceRenderStates.push(state)
            return <section {...props} />
          }}
          style={{ color: 'rgb(1, 2, 3)' }}
        >
          {surfaceChildren}
        </Card.Surface>
      </Card.Root>
    )

    const root = screen.getByTestId('card-root')
    const surfaces = container.querySelectorAll<HTMLElement>(
      'section[data-purpose="visual-envelope"]'
    )
    const realSurface = getRealSurface(root)
    const decorativeSurface = getDecorativeSurface(root)
    const overlay = getRevealOverlay(root)

    fireEvent.click(realSurface)

    expect(root.tagName).toBe('DIV')
    expect(root).toHaveClass('consumer-root')
    expect(root).toHaveStyle({ minHeight: '240px' })
    expect(root).toHaveAttribute('data-size', 'md')
    expect(root).not.toHaveAttribute('role')
    expect(root).not.toHaveAttribute('tabindex')
    expect(rootRef.current).toBe(root)
    expect(surfaces).toHaveLength(2)
    expect(realSurface.tagName).toBe('SECTION')
    expect(decorativeSurface.tagName).toBe('SECTION')
    expect(realSurface).toHaveAttribute('data-size', 'md')
    expect(decorativeSurface).toHaveAttribute('data-size', 'md')
    expect(realSurface).toHaveClass('surface-md-idle')
    expect(decorativeSurface).toHaveClass('surface-md-idle')
    expect(realSurface).toHaveStyle({ color: 'rgb(1, 2, 3)' })
    expect(decorativeSurface).toHaveStyle({ color: 'rgb(1, 2, 3)' })
    for (const surface of surfaces) {
      expect(surface).toHaveTextContent('From Scratch')
      expect(surface).toHaveTextContent('Create an exercise from scratch.')
      expect(surface).toHaveTextContent('Optional content')
      expect(surface).toHaveTextContent('Blank build')
    }
    expect(screen.getAllByRole('heading', { level: 2, name: 'From Scratch' })).toHaveLength(1)
    expect(container.querySelectorAll('h2')).toHaveLength(2)
    expect(overlay).toHaveAttribute('aria-hidden', 'true')
    expect(overlay).toHaveAttribute('inert')
    expect(overlay).toHaveStyle({ pointerEvents: 'none' })
    expect(onSurfaceClick).toHaveBeenCalledOnce()
    expect(onRootClick).toHaveBeenCalledOnce()
    expect(surfaceClassName).toHaveBeenCalled()
    expect(surfaceRenderChildren).not.toHaveLength(0)
    for (const receivedChildren of surfaceRenderChildren) {
      expect(receivedChildren).toBe(surfaceChildren)
    }
    expect(surfaceRenderStates).not.toHaveLength(0)
    for (const state of surfaceRenderStates) {
      expect(state).toEqual({
        disabled: false,
        readOnly: false,
        selectable: false,
        selected: false,
        size: 'md'
      })
      expect(Object.keys(state).sort()).toEqual([
        'disabled',
        'readOnly',
        'selectable',
        'selected',
        'size'
      ])
    }
  })

  it('UC-002 / UC-003 / UC-005 / UC-012 / EX-002 - maps every Card size through Surface without imposing Root dimensions', () => {
    for (const testCase of CARD_SIZE_CASES) {
      const { unmount } = render(
        <Card.Root
          data-testid={`root-${testCase.rootSize}`}
          size={testCase.rootSize === 'md' ? undefined : testCase.rootSize}
        >
          <Card.Surface>
            <Card.Visual
              data-testid={`visual-${testCase.rootSize}`}
              icon={<svg data-testid={`icon-${testCase.rootSize}`} />}
              stripesProps={false}
            />
            <Card.Header data-testid={`header-${testCase.rootSize}`}>
              <Card.Title>Card {testCase.rootSize}</Card.Title>
              <Card.Description>Description {testCase.rootSize}</Card.Description>
            </Card.Header>
            <Card.Content data-testid={`content-${testCase.rootSize}`} />
            <Card.Footer data-testid={`footer-${testCase.rootSize}`}>
              <Card.Button type="button">Action {testCase.rootSize}</Card.Button>
            </Card.Footer>
          </Card.Surface>
        </Card.Root>
      )

      const root = screen.getByTestId(`root-${testCase.rootSize}`)
      const surface = getRealSurface(root)
      const visual = within(surface).getByTestId(`visual-${testCase.rootSize}`)
      const icon = within(surface).getByTestId(`icon-${testCase.rootSize}`)
      const iconTile = icon.parentElement as HTMLElement
      const header = within(surface).getByTestId(`header-${testCase.rootSize}`)
      const title = within(surface).getByText(`Card ${testCase.rootSize}`)
      const description = within(surface).getByText(`Description ${testCase.rootSize}`)
      const content = within(surface).getByTestId(`content-${testCase.rootSize}`)
      const footer = within(surface).getByTestId(`footer-${testCase.rootSize}`)
      const button = screen.getByRole('button', { name: `Action ${testCase.rootSize}` })
      const rootDimensionClasses = root.className
        .split(/\s+/)
        .filter((className) => /^(aspect-|h-|min-h-|w-)/.test(className))

      expect(root).toHaveAttribute('data-size', testCase.rootSize)
      expect(rootDimensionClasses).toEqual([])
      expect(root.style.width).toBe('')
      expect(root.style.height).toBe('')
      expect(root.style.minHeight).toBe('')
      expect(surface).toHaveAttribute('data-size', testCase.rootSize)
      expect(surface).toHaveClass('flex', 'flex-col', 'border', 'border-border')
      expect(visual).toHaveClass(...testCase.visualClassNames)
      expect(iconTile).toHaveClass(testCase.iconClassName, testCase.svgClassName)
      expect(header).toHaveClass(...testCase.headerClassNames)
      expect(title).toHaveClass(testCase.titleClassName)
      expect(description).toHaveClass(testCase.descriptionClassName)
      expect(content).toHaveClass(...testCase.contentClassNames)
      expect(footer).toHaveClass(...testCase.footerClassNames)
      expect(button).toHaveClass(testCase.buttonClassName)

      unmount()
    }
  })

  it('UC-003 - derives typography inside Surface, honors overrides, and preserves render semantics', () => {
    render(
      <Card.Root size="xs" data-testid="typography-root">
        <Card.Surface>
          <Card.Header>
            <Card.Title>Derived title</Card.Title>
            <Card.Description>Derived description</Card.Description>
            <Card.Title size="lg" render={<h2 />}>
              Explicit title
            </Card.Title>
            <Card.Description size="lg" tone="primary" render={<p />}>
              Explicit description
            </Card.Description>
          </Card.Header>
        </Card.Surface>
      </Card.Root>
    )

    const surface = getRealSurface(screen.getByTestId('typography-root'))
    const derivedTitle = within(surface).getByText('Derived title')
    const derivedDescription = within(surface).getByText('Derived description')
    const explicitTitle = screen.getByRole('heading', { level: 2, name: 'Explicit title' })
    const explicitDescription = within(surface).getByText('Explicit description')

    expect(derivedTitle).toHaveClass('text-lg', 'tracking-wide')
    expect(derivedDescription).toHaveClass('text-xs', 'text-muted-foreground')
    expect(explicitTitle).toHaveClass('text-2xl')
    expect(explicitTitle).not.toHaveClass('text-lg')
    expect(explicitDescription.tagName).toBe('P')
    expect(explicitDescription).toHaveClass('text-lg', 'text-primary')
    expect(explicitDescription).not.toHaveClass('text-muted-foreground')
  })

  it('UC-004 / UC-005 / EX-006 - renders Stripes options and preserves SVG and non-SVG icon content', () => {
    const stripeVariables = {
      '--stripes-angle': '45deg',
      '--stripes-color': 'currentColor',
      '--stripes-gap': '6px',
      '--stripes-width': '2px'
    } as StripesCssProperties

    render(
      <Card.Root data-testid="visual-root">
        <Card.Surface>
          <Card.Visual
            data-testid="default-visual"
            icon={<svg data-testid="svg-icon" fill="rebeccapurple" stroke="#123456" />}
          >
            Default Stripes
          </Card.Visual>
          <Card.Visual data-testid="true-visual" stripesProps>
            Explicit default Stripes
          </Card.Visual>
          <Card.Visual
            data-testid="configured-visual"
            icon={<span data-testid="arbitrary-icon">PC</span>}
            stripesProps={{
              angle: '45deg',
              color: 'currentColor',
              'data-testid': 'configured-stripes',
              gap: '6px',
              width: '2px'
            }}
          >
            Configured Stripes
          </Card.Visual>
          <Card.Visual data-testid="plain-visual" stripesProps={false}>
            No Stripes
          </Card.Visual>
        </Card.Surface>
      </Card.Root>
    )

    const surface = getRealSurface(screen.getByTestId('visual-root'))
    const defaultVisual = within(surface).getByTestId('default-visual')
    const trueVisual = within(surface).getByTestId('true-visual')
    const configuredVisual = within(surface).getByTestId('configured-visual')
    const configuredStripes = within(surface).getByTestId('configured-stripes')
    const plainVisual = within(surface).getByTestId('plain-visual')
    const svgIcon = within(surface).getByTestId('svg-icon')
    const svgTile = svgIcon.parentElement as HTMLElement
    const arbitraryIcon = within(surface).getByTestId('arbitrary-icon')

    expect(getStripedLayers(defaultVisual)).toHaveLength(1)
    expect(getStripedLayers(trueVisual)).toHaveLength(1)
    expect(getStripedLayers(configuredVisual)).toEqual([configuredStripes])
    expect(getStripedLayers(plainVisual)).toHaveLength(0)
    expect(configuredStripes).toHaveAttribute('aria-hidden', 'true')
    expect(configuredStripes).toHaveClass('pointer-events-none')
    for (const [variableName, variableValue] of Object.entries(stripeVariables)) {
      expect(configuredStripes.style.getPropertyValue(variableName)).toBe(variableValue)
    }
    expect(svgTile).toHaveClass('size-10', '[&_svg]:size-5')
    expect(svgTile.className).toContain('[&_svg]:shrink-0')
    expect(svgTile.className).toContain('[&_svg]:pointer-events-none')
    expect(svgIcon).toHaveAttribute('fill', 'rebeccapurple')
    expect(svgIcon).toHaveAttribute('stroke', '#123456')
    expect(arbitraryIcon).toHaveTextContent('PC')
    expect(arbitraryIcon).not.toHaveAttribute('aria-hidden')
  })

  it('UC-006 / UC-008 / UC-009 / EX-003 / EX-009 - mounts one named Selector before duplicated state-mirroring Surface', () => {
    render(
      <>
        <Card.Group aria-label="Exercise creation method" defaultValue="template">
          <Card.Root data-testid="template-root">
            <Card.Selector aria-label="Template" value="template" />
            <Card.Surface>
              <Card.Header>
                <Card.Title render={<h2 />}>Template</Card.Title>
                <Card.Description>Start with an existing structure.</Card.Description>
              </Card.Header>
            </Card.Surface>
          </Card.Root>
          <Card.Root data-testid="scratch-root">
            <Card.Selector aria-label="From Scratch" value="scratch" />
            <Card.Surface>
              <Card.Header>
                <Card.Title render={<h2 />}>From Scratch</Card.Title>
              </Card.Header>
            </Card.Surface>
          </Card.Root>
        </Card.Group>
        <Card.Group aria-label="Disabled method" defaultValue="locked" disabled>
          <Card.Root data-testid="disabled-root">
            <Card.Selector aria-label="Locked method" value="locked" />
            <Card.Surface>
              <Card.Header>
                <Card.Title>Locked method</Card.Title>
              </Card.Header>
            </Card.Surface>
          </Card.Root>
        </Card.Group>
        <Card.Group aria-label="Read-only method" defaultValue="fixed" readOnly>
          <Card.Root data-testid="readonly-root">
            <Card.Selector aria-label="Fixed method" value="fixed" />
            <Card.Surface>
              <Card.Header>
                <Card.Title>Fixed method</Card.Title>
              </Card.Header>
            </Card.Surface>
          </Card.Root>
        </Card.Group>
      </>
    )

    const templateRoot = screen.getByTestId('template-root')
    const scratchRoot = screen.getByTestId('scratch-root')
    const disabledRoot = screen.getByTestId('disabled-root')
    const readonlyRoot = screen.getByTestId('readonly-root')
    const template = screen.getByRole('radio', { name: 'Template' })
    const scratch = screen.getByRole('radio', { name: 'From Scratch' })

    expect(screen.getByRole('radiogroup', { name: 'Exercise creation method' })).toBeInTheDocument()
    expect(template.tagName).toBe('BUTTON')
    expect(template).toBeChecked()
    expect(scratch).not.toBeChecked()
    expect(templateRoot.querySelectorAll('[role="radio"]')).toHaveLength(1)
    expect(scratchRoot.querySelectorAll('[role="radio"]')).toHaveLength(1)
    expect(getRealSurface(templateRoot)).toHaveAttribute('data-selected')
    expect(getDecorativeSurface(templateRoot)).toHaveAttribute('data-selected')
    expect(getRealSurface(scratchRoot)).not.toHaveAttribute('data-selected')
    expect(getDecorativeSurface(scratchRoot)).not.toHaveAttribute('data-selected')
    expect(templateRoot).toHaveAttribute('data-selectable')
    expect(templateRoot).toHaveAttribute('data-selected')
    expect(templateRoot).not.toHaveAttribute('role')
    expect(templateRoot).not.toHaveAttribute('tabindex')
    expect(disabledRoot).toHaveAttribute('data-disabled')
    expect(getRealSurface(disabledRoot)).toHaveAttribute('data-disabled')
    expect(getDecorativeSurface(disabledRoot)).toHaveAttribute('data-disabled')
    expect(readonlyRoot).toHaveAttribute('data-readonly')
    expect(getRealSurface(readonlyRoot)).toHaveAttribute('data-readonly')
    expect(getDecorativeSurface(readonlyRoot)).toHaveAttribute('data-readonly')
  })

  it('UC-006 / UC-007 / EX-003 / EX-004 - preserves controlled and uncontrolled Base UI selection contracts', async () => {
    const onValueChange = vi.fn()
    const controlled = render(
      <Card.Group aria-label="Controlled method" onValueChange={onValueChange} value="template">
        <Card.Root data-testid="controlled-template-root">
          <Card.Selector aria-label="Template" value="template" />
          <Card.Surface />
        </Card.Root>
        <Card.Root data-testid="controlled-scratch-root">
          <Card.Selector aria-label="From Scratch" value="scratch" />
          <Card.Surface />
        </Card.Root>
      </Card.Group>
    )

    const template = screen.getByRole('radio', { name: 'Template' })
    const scratch = screen.getByRole('radio', { name: 'From Scratch' })

    fireEvent.click(scratch)

    const eventDetails = onValueChange.mock.calls[0]?.[1] as CardGroupChangeEventDetails

    expect(onValueChange).toHaveBeenCalledWith(
      'scratch',
      expect.objectContaining({
        allowPropagation: expect.any(Function),
        cancel: expect.any(Function),
        event: expect.any(Event),
        isCanceled: expect.any(Boolean),
        isPropagationAllowed: expect.any(Boolean),
        reason: 'none'
      })
    )
    expect(eventDetails).toHaveProperty('trigger')
    expect(template).toBeChecked()
    expect(scratch).not.toBeChecked()

    controlled.rerender(
      <Card.Group aria-label="Controlled method" onValueChange={onValueChange} value="scratch">
        <Card.Root data-testid="controlled-template-root">
          <Card.Selector aria-label="Template" value="template" />
          <Card.Surface />
        </Card.Root>
        <Card.Root data-testid="controlled-scratch-root">
          <Card.Selector aria-label="From Scratch" value="scratch" />
          <Card.Surface />
        </Card.Root>
      </Card.Group>
    )

    expect(template).not.toBeChecked()
    expect(scratch).toBeChecked()
    expect(screen.getByTestId('controlled-template-root')).not.toHaveAttribute('data-selected')
    expect(screen.getByTestId('controlled-scratch-root')).toHaveAttribute('data-selected')

    controlled.unmount()

    const observedChange = vi.fn()
    render(
      <Card.Group
        aria-label="Uncontrolled method"
        defaultValue="coach"
        onValueChange={observedChange}
      >
        <Card.Root>
          <Card.Selector aria-label="Coach plan" value="coach" />
          <Card.Surface />
        </Card.Root>
        <Card.Root>
          <Card.Selector aria-label="Blank plan" value="blank" />
          <Card.Surface />
        </Card.Root>
      </Card.Group>
    )

    const coach = screen.getByRole('radio', { name: 'Coach plan' })
    const blank = screen.getByRole('radio', { name: 'Blank plan' })

    coach.focus()
    fireEvent.keyDown(coach, { code: 'ArrowRight', key: 'ArrowRight' })

    await waitFor(() => {
      expect(coach).not.toBeChecked()
      expect(blank).toBeChecked()
      expect(blank).toHaveFocus()
    })
    expect(observedChange).toHaveBeenCalledWith('blank', expect.any(Object))
  })

  it('UC-006 / UC-007 - keeps exactly one hidden form value for each single-mounted Selector', () => {
    render(
      <form data-testid="method-form">
        <Card.Group
          aria-label="Submitted method"
          defaultValue="scratch"
          name="creation-method"
          required
        >
          <Card.Root data-testid="form-template-root">
            <Card.Selector aria-label="Template" value="template" />
            <Card.Surface>
              <Card.Header>
                <Card.Title>Template</Card.Title>
              </Card.Header>
            </Card.Surface>
          </Card.Root>
          <Card.Root data-testid="form-scratch-root">
            <Card.Selector aria-label="From Scratch" value="scratch" />
            <Card.Surface>
              <Card.Header>
                <Card.Title>From Scratch</Card.Title>
              </Card.Header>
            </Card.Surface>
          </Card.Root>
        </Card.Group>
      </form>
    )

    const form = screen.getByTestId('method-form') as HTMLFormElement
    const formData = new FormData(form)

    expect(formData.getAll('creation-method')).toEqual(['scratch'])
    expect(screen.getByRole('radio', { name: 'From Scratch' })).toHaveAttribute('data-required')
    expect(screen.getByTestId('form-template-root').querySelectorAll('input')).toHaveLength(1)
    expect(screen.getByTestId('form-scratch-root').querySelectorAll('input')).toHaveLength(1)
  })

  it('UC-010 / UC-019 / EX-003 - keeps the real Footer action independent while its duplicate remains inert', () => {
    const onFooterClick = vi.fn()
    const onActionClick = vi.fn()

    const { container } = render(
      <Card.Group aria-label="Exercise creation method" defaultValue="template">
        <Card.Root data-testid="independent-template-root">
          <Card.Selector aria-label="Template" value="template" />
          <Card.Surface />
        </Card.Root>
        <Card.Root data-testid="independent-scratch-root">
          <Card.Selector aria-label="From Scratch" value="scratch" />
          <Card.Surface>
            <Card.Footer data-purpose="scratch-footer" onClick={onFooterClick}>
              <span>Blank build</span>
              <Card.Button onClick={onActionClick} type="button">
                Preview
              </Card.Button>
            </Card.Footer>
          </Card.Surface>
        </Card.Root>
      </Card.Group>
    )

    const template = screen.getByRole('radio', { name: 'Template' })
    const scratch = screen.getByRole('radio', { name: 'From Scratch' })
    const action = screen.getByRole('button', { name: 'Preview' })
    const scratchRoot = screen.getByTestId('independent-scratch-root')
    const realFooter = within(getRealSurface(scratchRoot)).getByText('Blank build').parentElement
    const overlay = getRevealOverlay(scratchRoot)

    fireEvent.click(realFooter as HTMLElement)
    fireEvent.click(action)

    expect(template).toBeChecked()
    expect(scratch).not.toBeChecked()
    expect(onFooterClick).toHaveBeenCalledTimes(2)
    expect(onActionClick).toHaveBeenCalledOnce()
    expect(container.querySelectorAll('[data-purpose="scratch-footer"]')).toHaveLength(2)
    expect(screen.getAllByRole('button', { name: 'Preview' })).toHaveLength(1)
    expect(overlay).toHaveAttribute('aria-hidden', 'true')
    expect(overlay).toHaveAttribute('inert')
  })

  it('UC-017 / UC-019 / EX-003 / EX-008 / CR-001 - keeps Selector hover semantic-free and leaves Reveal controlled by selection', () => {
    render(
      <Card.Group aria-label="Hover midpoint" defaultValue="selected">
        <Card.Root data-testid="selected-hover-root">
          <Card.Selector aria-label="Selected option" value="selected" />
          <Card.Surface />
        </Card.Root>
        <Card.Root data-testid="available-hover-root">
          <Card.Selector aria-label="Available option" value="available" />
          <Card.Surface />
        </Card.Root>
      </Card.Group>
    )

    const selectedRoot = screen.getByTestId('selected-hover-root')
    const availableRoot = screen.getByTestId('available-hover-root')
    const selectedSelector = screen.getByRole('radio', { name: 'Selected option' })
    const availableSelector = screen.getByRole('radio', { name: 'Available option' })
    const selectedRealSurface = getRealSurface(selectedRoot)
    const selectedDecorativeSurface = getDecorativeSurface(selectedRoot)
    const availableRealSurface = getRealSurface(availableRoot)
    const availableDecorativeSurface = getDecorativeSurface(availableRoot)
    const selectedSurfaces = [selectedRealSurface, selectedDecorativeSurface]
    const availableSurfaces = [availableRealSurface, availableDecorativeSurface]

    expect(selectedSelector).toBeChecked()
    expect(selectedRoot).toHaveAttribute('data-selected')
    for (const surface of selectedSurfaces) {
      expect(surface).toHaveAttribute('data-selected')
    }
    expect(selectedDecorativeSurface).toHaveAttribute('data-reveal-overlay-surface')
    expect(availableSelector).not.toBeChecked()
    expect(availableRoot).not.toHaveAttribute('data-selected')
    for (const surface of availableSurfaces) {
      expect(surface).not.toHaveAttribute('data-selected')
    }
    expect(availableDecorativeSurface).toHaveAttribute('data-reveal-overlay-surface')

    fireEvent.mouseEnter(availableSelector)

    expect(availableSelector).not.toBeChecked()
    expect(availableRoot).not.toHaveAttribute('data-selected')
    for (const surface of availableSurfaces) {
      expect(surface).not.toHaveAttribute('data-selected')
    }
    expect(availableDecorativeSurface).toHaveAttribute('data-reveal-overlay-surface')
  })

  it('UC-017 / EX-002 / EX-003 - keeps non-selectable Root and Footer hover outside the midpoint request', () => {
    render(
      <>
        <Card.Root data-testid="non-selectable-hover-root">
          <Card.Surface>
            <Card.Footer>Static footer</Card.Footer>
          </Card.Surface>
        </Card.Root>
        <Card.Group aria-label="Footer hover" defaultValue="selected">
          <Card.Root>
            <Card.Selector aria-label="Selected method" value="selected" />
            <Card.Surface />
          </Card.Root>
          <Card.Root data-testid="footer-hover-root">
            <Card.Selector aria-label="Footer method" value="footer" />
            <Card.Surface>
              <Card.Footer>
                <Card.Button type="button">Footer action</Card.Button>
              </Card.Footer>
            </Card.Surface>
          </Card.Root>
        </Card.Group>
      </>
    )

    const nonSelectableRoot = screen.getByTestId('non-selectable-hover-root')
    const footerRoot = screen.getByTestId('footer-hover-root')
    const footerSelector = screen.getByRole('radio', { name: 'Footer method' })
    const footerAction = screen.getByRole('button', { name: 'Footer action' })

    expect(nonSelectableRoot).not.toHaveAttribute('data-selectable')
    expect(nonSelectableRoot).not.toHaveAttribute('data-selected')

    fireEvent.mouseEnter(footerAction)

    expect(footerSelector).not.toBeChecked()
    expect(footerRoot).not.toHaveAttribute('data-selected')
  })

  it('UC-017 / EX-009 - excludes unselected disabled and read-only Selectors from the midpoint target', () => {
    render(
      <>
        <Card.Group aria-label="Disabled hover" defaultValue="selected" disabled>
          <Card.Root>
            <Card.Selector aria-label="Disabled selected" value="selected" />
            <Card.Surface />
          </Card.Root>
          <Card.Root data-testid="disabled-hover-root">
            <Card.Selector aria-label="Disabled option" value="disabled" />
            <Card.Surface />
          </Card.Root>
        </Card.Group>
        <Card.Group aria-label="Read-only hover" defaultValue="selected" readOnly>
          <Card.Root>
            <Card.Selector aria-label="Read-only selected" value="selected" />
            <Card.Surface />
          </Card.Root>
          <Card.Root data-testid="readonly-hover-root">
            <Card.Selector aria-label="Read-only option" value="readonly" />
            <Card.Surface />
          </Card.Root>
        </Card.Group>
      </>
    )

    const disabledRoot = screen.getByTestId('disabled-hover-root')
    const readonlyRoot = screen.getByTestId('readonly-hover-root')
    const disabledSelector = screen.getByRole('radio', { name: 'Disabled option' })
    const readonlySelector = screen.getByRole('radio', { name: 'Read-only option' })

    fireEvent.mouseEnter(disabledSelector)
    fireEvent.mouseEnter(readonlySelector)

    expect(disabledRoot).toHaveAttribute('data-disabled')
    expect(readonlyRoot).toHaveAttribute('data-readonly')
    expect(disabledSelector).toHaveAttribute('data-disabled')
    expect(readonlySelector).toHaveAttribute('data-readonly')
    expect(disabledSelector).not.toBeChecked()
    expect(readonlySelector).not.toBeChecked()
  })

  it('UC-011 / UC-017 / UC-019 / EX-008 / CR-009 / CR-011 - keeps Root identity and public selected state synchronized in both directions', async () => {
    render(
      <Card.Group aria-label="Selection motion" defaultValue="blank">
        <Card.Root data-testid="motion-blank-root">
          <Card.Selector aria-label="Blank" value="blank" />
          <Card.Surface />
        </Card.Root>
        <Card.Root data-testid="motion-template-root">
          <Card.Selector aria-label="Template" value="template" />
          <Card.Surface />
        </Card.Root>
      </Card.Group>
    )

    const blankRoot = screen.getByTestId('motion-blank-root')
    const templateRoot = screen.getByTestId('motion-template-root')
    const blankSelector = screen.getByRole('radio', { name: 'Blank' })
    const templateSelector = screen.getByRole('radio', { name: 'Template' })
    const blankDecorativeSurface = getDecorativeSurface(blankRoot)
    const templateDecorativeSurface = getDecorativeSurface(templateRoot)

    expect(blankRoot).toHaveAttribute('data-selected')
    expect(templateRoot).not.toHaveAttribute('data-selected')
    for (const surface of [blankDecorativeSurface, templateDecorativeSurface]) {
      expect(surface).toHaveAttribute('data-reveal-overlay-surface')
    }

    fireEvent.click(templateSelector)

    await waitFor(() => {
      expect(blankRoot).not.toHaveAttribute('data-selected')
      expect(templateRoot).toHaveAttribute('data-selected')
      expect(screen.getByTestId('motion-blank-root')).toBe(blankRoot)
      expect(screen.getByTestId('motion-template-root')).toBe(templateRoot)
    })

    act(() => {
      templateSelector.focus()
    })

    await waitFor(() => {
      expect(templateSelector).toHaveFocus()
      expect(templateSelector).toBeChecked()
      expect(templateRoot).toHaveAttribute('data-selected')
    })

    fireEvent.click(blankSelector)

    await waitFor(() => {
      expect(blankRoot).toHaveAttribute('data-selected')
      expect(templateRoot).not.toHaveAttribute('data-selected')
      expect(screen.getByTestId('motion-blank-root')).toBe(blankRoot)
      expect(screen.getByTestId('motion-template-root')).toBe(templateRoot)
    })
  })

  it('UC-012 / UC-013 / EX-007 / EX-010 / EX-011 / EX-012 - preserves Button alternatives, nearest inheritance, and fallback', () => {
    render(
      <>
        <Card.Root size="xl">
          <Card.Surface>
            <Card.Footer>
              <Card.Button type="button">Outer inherited</Card.Button>
              <Button size="md" type="button">
                Direct explicit
              </Button>
            </Card.Footer>
            <Card.Content>
              <Card.Root size="xs">
                <Card.Surface>
                  <Card.Footer>
                    <Card.Button type="button">Nearest inherited</Card.Button>
                  </Card.Footer>
                </Card.Surface>
              </Card.Root>
            </Card.Content>
          </Card.Surface>
        </Card.Root>
        <Card.Root>
          <Card.Surface>
            <Card.Footer>
              <Card.Button render={<button data-rendered="card-button" />} type="button">
                Rendered action
              </Card.Button>
              <Card.Button loading type="button">
                Loading action
              </Card.Button>
            </Card.Footer>
          </Card.Surface>
        </Card.Root>
        <Card.Button type="button">Outside fallback</Card.Button>
      </>
    )

    const outer = screen.getByRole('button', { name: 'Outer inherited' })
    const direct = screen.getByRole('button', { name: 'Direct explicit' })
    const nearest = screen.getByRole('button', { name: 'Nearest inherited' })
    const rendered = screen.getByRole('button', { name: 'Rendered action' })
    const loading = screen.getByRole('button', { name: 'Loading action' })
    const fallback = screen.getByRole('button', { name: 'Outside fallback' })

    expect(outer).toHaveClass('h-10')
    expect(direct).toHaveClass('h-9')
    expect(direct).not.toHaveClass('h-10')
    expect(nearest).toHaveClass('h-7')
    expect(rendered).toHaveAttribute('data-rendered', 'card-button')
    expect(rendered).toHaveClass('h-9')
    expect(loading).toHaveClass('h-9')
    expect(loading).toHaveAttribute('data-loading')
    expect(loading).toHaveAttribute('data-disabled')
    expect(fallback).toHaveClass('h-9')
  })

  it('UC-014 / UC-016 / UC-019 / EX-005 / CR-004 - keeps duplicated Surface markers, subtree order, and Footer structure', () => {
    render(
      <>
        <Card.Root className="min-h-96" data-testid="flow-root">
          <Card.Surface>
            <Card.Visual data-testid="flow-visual" stripesProps={false}>
              Flow visual
            </Card.Visual>
            <Card.Footer data-testid="flow-footer">Flow footer</Card.Footer>
          </Card.Surface>
        </Card.Root>
        <Card.Root data-testid="overlay-root" style={{ height: 320 }}>
          <Card.Surface>
            <Card.Visual
              aria-hidden="true"
              data-testid="overlay-visual"
              placement="overlay"
              stripesProps={false}
            >
              Overlay visual
            </Card.Visual>
            <Card.Content>Normal-flow content</Card.Content>
            <Card.Footer data-testid="overlay-footer">Overlay footer</Card.Footer>
          </Card.Surface>
        </Card.Root>
      </>
    )

    const flowRoot = screen.getByTestId('flow-root')
    const overlayRoot = screen.getByTestId('overlay-root')
    const flowSurface = getRealSurface(flowRoot)
    const overlaySurface = getRealSurface(overlayRoot)
    const flow = within(flowSurface).getByTestId('flow-visual')
    const overlay = within(overlaySurface).getByTestId('overlay-visual')
    const flowFooter = within(flowSurface).getByTestId('flow-footer')
    const overlayFooter = within(overlaySurface).getByTestId('overlay-footer')
    const decorativeOverlaySurface = getDecorativeSurface(overlayRoot)
    const decorativeCopy = decorativeOverlaySurface.querySelector<HTMLElement>('[data-reveal-copy]')
    const decorativeCopyScale = decorativeOverlaySurface.querySelector<HTMLElement>(
      '[data-reveal-copy-scale]'
    )
    const decorativeVisual = within(decorativeOverlaySurface).getByTestId('overlay-visual')
    const decorativeContent = within(decorativeOverlaySurface).getByText('Normal-flow content')
    const decorativeFooter = within(decorativeOverlaySurface).getByTestId('overlay-footer')

    expect(flowRoot).toHaveClass('min-h-96')
    expect(flowRoot).not.toHaveClass('flex', 'flex-col')
    expect(flowSurface).toHaveClass('flex', 'flex-col')
    expect(flow).toHaveClass('h-16.5', 'shrink-0')
    expect(flow).not.toHaveClass('absolute', 'inset-0', 'pointer-events-none')
    expect(overlay).toHaveClass('absolute', 'inset-0', 'pointer-events-none')
    expect(overlay).not.toHaveClass('h-16.5', 'shrink-0')
    expect(overlayRoot).toHaveStyle({ height: '320px' })
    expect(overlaySurface).toHaveClass('flex', 'flex-col')
    expect(decorativeOverlaySurface).toHaveClass('flex', 'h-full', 'min-h-0', 'w-full', 'flex-col')
    expect(decorativeOverlaySurface).toHaveClass(
      '[&[data-reveal-overlay-surface]_[data-reveal-copy]]:flex',
      '[&[data-reveal-overlay-surface]_[data-reveal-copy]]:h-full',
      '[&[data-reveal-overlay-surface]_[data-reveal-copy]]:min-h-0',
      '[&[data-reveal-overlay-surface]_[data-reveal-copy]]:w-full',
      '[&[data-reveal-overlay-surface]_[data-reveal-copy-scale]]:!flex',
      '[&[data-reveal-overlay-surface]_[data-reveal-copy-scale]]:h-full',
      '[&[data-reveal-overlay-surface]_[data-reveal-copy-scale]]:min-h-0',
      '[&[data-reveal-overlay-surface]_[data-reveal-copy-scale]]:w-full',
      '[&[data-reveal-overlay-surface]_[data-reveal-copy-scale]]:flex-col'
    )
    expect(flowFooter).toHaveClass('mt-auto', 'shrink-0')
    expect(overlayFooter).toHaveClass('mt-auto', 'shrink-0')
    expect(decorativeFooter).toHaveClass('mt-auto', 'shrink-0')
    expect(flowSurface.lastElementChild).toBe(flowFooter)
    expect(overlaySurface.lastElementChild).toBe(overlayFooter)
    expect(decorativeCopy).toBeInTheDocument()
    expect(decorativeCopy?.parentElement).toBe(decorativeOverlaySurface)
    expect(decorativeCopyScale).toBeInTheDocument()
    expect(decorativeCopyScale?.parentElement).toBe(decorativeCopy)
    expect(Array.from(decorativeCopyScale?.children ?? [])).toEqual([
      decorativeVisual,
      decorativeContent,
      decorativeFooter
    ])
    expect(decorativeCopyScale?.lastElementChild).toBe(decorativeFooter)
  })

  it('UC-015 / UC-019 / EX-008 - mirrors selected state across both Surface instances in a semantic dark-theme composition', () => {
    render(
      <div className="dark">
        <Card.Group aria-label="Semantic method" defaultValue="blank">
          <Card.Root data-testid="semantic-root" size="xl">
            <Card.Selector aria-label="Blank method" value="blank" />
            <Card.Surface>
              <Card.Header>
                <Card.Title>From Scratch</Card.Title>
                <Card.Description>Semantic description</Card.Description>
              </Card.Header>
            </Card.Surface>
          </Card.Root>
        </Card.Group>
      </div>
    )

    const root = screen.getByTestId('semantic-root')
    const surface = getRealSurface(root)
    const decorativeSurface = getDecorativeSurface(root)
    const selector = screen.getByRole('radio', { name: 'Blank method' })

    expect(selector).toBeChecked()
    expect(root).toHaveAttribute('data-selected')
    for (const cardSurface of [surface, decorativeSurface]) {
      expect(cardSurface).toHaveAttribute('data-selected')
    }
    expect(decorativeSurface).toHaveAttribute('data-reveal-overlay-surface')
  })

  it('UC-015 / EX-008 / QA-003 - reveals the opposite light theme under an effective dark ancestor', async () => {
    render(
      <div className="dark">
        <Card.Group aria-label="Dark ancestor method" defaultValue="blank">
          <Card.Root data-testid="dark-ancestor-root">
            <Card.Selector aria-label="Blank method" value="blank" />
            <Card.Surface>
              <Card.Footer>
                <Card.Button type="button">Next</Card.Button>
              </Card.Footer>
            </Card.Surface>
          </Card.Root>
        </Card.Group>
      </div>
    )

    const overlay = getRevealOverlay(screen.getByTestId('dark-ancestor-root'))

    await waitFor(() => expect(overlay).toHaveClass('light'))

    expect(overlay).not.toHaveClass('dark')
  })

  it('UC-018 / EX-013 - shares one size-resolved inline-start axis across parts inside Surface', () => {
    for (const testCase of CARD_SIZE_CASES) {
      const { unmount } = render(
        <Card.Root
          data-testid={`axis-root-${testCase.rootSize}`}
          size={testCase.rootSize === 'md' ? undefined : testCase.rootSize}
        >
          <Card.Surface>
            <Card.Visual
              data-testid={`axis-visual-${testCase.rootSize}`}
              icon={<svg data-testid={`axis-icon-${testCase.rootSize}`} />}
              stripesProps={false}
            />
            <Card.Header data-testid={`axis-header-${testCase.rootSize}`}>
              <Card.Title data-testid={`axis-title-${testCase.rootSize}`}>
                Axis title {testCase.rootSize}
              </Card.Title>
              <Card.Description data-testid={`axis-description-${testCase.rootSize}`}>
                Axis description {testCase.rootSize}
              </Card.Description>
            </Card.Header>
            <Card.Content data-testid={`axis-content-${testCase.rootSize}`}>
              <span>Axis content {testCase.rootSize}</span>
            </Card.Content>
            <Card.Footer data-testid={`axis-footer-${testCase.rootSize}`}>
              <span data-testid={`axis-footer-first-${testCase.rootSize}`}>
                Axis footer {testCase.rootSize}
              </span>
              <Card.Button type="button">Axis action {testCase.rootSize}</Card.Button>
            </Card.Footer>
          </Card.Surface>
        </Card.Root>
      )

      const surface = getRealSurface(screen.getByTestId(`axis-root-${testCase.rootSize}`))
      const visual = within(surface).getByTestId(`axis-visual-${testCase.rootSize}`)
      const icon = within(surface).getByTestId(`axis-icon-${testCase.rootSize}`)
      const iconTile = icon.parentElement as HTMLElement
      const header = within(surface).getByTestId(`axis-header-${testCase.rootSize}`)
      const title = within(surface).getByTestId(`axis-title-${testCase.rootSize}`)
      const description = within(surface).getByTestId(`axis-description-${testCase.rootSize}`)
      const content = within(surface).getByTestId(`axis-content-${testCase.rootSize}`)
      const footer = within(surface).getByTestId(`axis-footer-${testCase.rootSize}`)
      const firstFooterChild = within(surface).getByTestId(`axis-footer-first-${testCase.rootSize}`)

      expect(visual).toHaveClass(`p-${testCase.axisSpacing}`)
      expect(header).toHaveClass(`p-${testCase.axisSpacing}`)
      expect(content).toHaveClass(`px-${testCase.axisSpacing}`)
      expect(footer).toHaveClass(`px-${testCase.axisSpacing}`)
      expect(iconTile.parentElement).toBe(visual)
      expect(title.parentElement).toBe(header)
      expect(description.parentElement).toBe(header)
      expect(footer.firstElementChild).toBe(firstFooterChild)

      unmount()
    }
  })

  it('UC-020 - keeps deterministic duplicate-safe content unchanged while Selector identity stays outside Surface', () => {
    const attachedNodes = new Set<HTMLSpanElement>()
    const duplicateSafeRef = (node: HTMLSpanElement | null) => {
      if (node) {
        attachedNodes.add(node)
      }
    }

    const { container } = render(
      <Card.Group aria-label="Duplicate-safe method" defaultValue="safe">
        <span id="safe-option-label">Duplicate-safe option</span>
        <span id="safe-option-description">Rendered twice without shared identity.</span>
        <Card.Root data-testid="duplicate-safe-root">
          <Card.Selector
            aria-describedby="safe-option-description"
            aria-labelledby="safe-option-label"
            value="safe"
          />
          <Card.Surface>
            <span data-purpose="duplicate-safe-probe" ref={duplicateSafeRef}>
              deterministic content
            </span>
          </Card.Surface>
        </Card.Root>
      </Card.Group>
    )

    const root = screen.getByTestId('duplicate-safe-root')
    const selector = screen.getByRole('radio', { name: 'Duplicate-safe option' })

    expect(selector).toHaveAccessibleDescription('Rendered twice without shared identity.')
    expect(root.querySelectorAll('[role="radio"]')).toHaveLength(1)
    expect(container.querySelectorAll('[data-purpose="duplicate-safe-probe"]')).toHaveLength(2)
    expect(attachedNodes.size).toBe(2)
    expect(getRealSurface(root)).toHaveTextContent('deterministic content')
    expect(getDecorativeSurface(root)).toHaveTextContent('deterministic content')
  })
})
