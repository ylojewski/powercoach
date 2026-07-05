import { useRender } from '@base-ui/react/use-render'
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import {
  createRef,
  type ComponentPropsWithRef,
  type ComponentType,
  type CSSProperties,
  type MouseEvent,
  type ReactElement,
  type Ref
} from 'react'
import { afterEach, describe, expect, expectTypeOf, it, vi } from 'vitest'

import * as PackageExports from '../..'
import {
  type LoadingCover as PublicLoadingCover,
  type LoadingCoverCascadeProps,
  type LoadingCoverCascadeState,
  type LoadingCoverLogoProps,
  type LoadingCoverLogoState,
  type LoadingCoverNamespace,
  type LoadingCoverRevealAnimationProps,
  type LoadingCoverRootProps,
  type LoadingCoverRootState,
  type LoadingCoverVisualState,
  type LogoIconProps,
  type RevealAnimationProps
} from '../..'

interface LoadingCoverNamespaceContract {
  Cascade: ComponentType<LoadingCoverCascadeProps>
  Logo: ComponentType<LoadingCoverLogoProps>
  Root: ComponentType<LoadingCoverRootProps>
}

interface LoadingCoverPackageContract {
  Components: typeof PackageExports.Components & {
    LoadingCover: LoadingCoverNamespaceContract
  }
  LoadingCover: LoadingCoverNamespaceContract
  LoadingCoverCascade: LoadingCoverNamespaceContract['Cascade']
  LoadingCoverLogo: LoadingCoverNamespaceContract['Logo']
  LoadingCoverRoot: LoadingCoverNamespaceContract['Root']
  Ui: typeof PackageExports.Ui & {
    Components: typeof PackageExports.Components & {
      LoadingCover: LoadingCoverNamespaceContract
    }
  }
}

interface LoadingCoverCssProperties extends CSSProperties {
  '--consumer-loading-state'?: string
}

type ExpectedLoadingCoverCascadeProps = Omit<
  useRender.ComponentProps<'div', LoadingCoverCascadeState>,
  'className' | 'style' | 'ref'
> & {
  className?: string | ((state: LoadingCoverCascadeState) => string | undefined)
  ref?: Ref<HTMLElement>
  style?: CSSProperties | ((state: LoadingCoverCascadeState) => CSSProperties | undefined)
}

type ExpectedLoadingCoverRootProps = Omit<
  useRender.ComponentProps<'div', LoadingCoverRootState>,
  'className' | 'style' | 'ref'
> & {
  'aria-label'?: string
  className?: string | ((state: LoadingCoverRootState) => string | undefined)
  fullscreen?: boolean
  loading: boolean
  logo?: ReactElement | null
  ref?: Ref<HTMLElement>
  revealAnimationProps?: LoadingCoverRevealAnimationProps
  style?: CSSProperties | ((state: LoadingCoverRootState) => CSSProperties | undefined)
}

const LOADING_COVER_FALLBACK: LoadingCoverNamespaceContract = {
  Cascade: () => null,
  Logo: () => null,
  Root: () => null
}

const PACKAGE_EXPORTS = PackageExports as typeof PackageExports & LoadingCoverPackageContract
const LoadingCover =
  (PackageExports as unknown as Partial<LoadingCoverPackageContract>).LoadingCover ??
  LOADING_COVER_FALLBACK
const REVEAL_TRANSITION_PROPERTY = 'clip-path'

function getRequiredElement<TElement extends Element>(
  element: TElement | null | undefined,
  message: string
): TElement {
  if (element == null) {
    throw new Error(message)
  }

  return element
}

function getLoadingRoot(testId: string): HTMLElement {
  return getRequiredElement(screen.queryByTestId(testId), `Expected LoadingCover Root ${testId}`)
}

function getDirectLoadingContent(root: HTMLElement): HTMLElement {
  return getRequiredElement(
    Array.from(root.children).find((element) => element.hasAttribute('data-loading-cover-content')),
    'Expected Root to own a direct application-content wrapper'
  ) as HTMLElement
}

function getDirectLoadingLayer(root: HTMLElement): HTMLElement {
  return getRequiredElement(
    Array.from(root.children).find((element) => element.hasAttribute('data-loading-cover-layer')),
    'Expected Root to own a direct local loading layer'
  ) as HTMLElement
}

function getLayerFromStatusText(text: string): HTMLElement {
  return getRequiredElement(
    screen.getByText(text).closest<HTMLElement>('[data-loading-cover-layer]'),
    `Expected ${text} status to belong to a loading layer`
  )
}

function getRevealRoot(layer: HTMLElement): HTMLElement {
  return getRequiredElement(
    layer.querySelector<HTMLElement>('[data-motion="reveal"]'),
    'Expected LoadingCover layer to compose RevealAnimation'
  )
}

function getRevealOverlay(layer: HTMLElement): HTMLElement {
  return getRequiredElement(
    layer.querySelector<HTMLElement>('[data-reveal-overlay]'),
    'Expected LoadingCover layer to contain the RevealAnimation overlay'
  )
}

function completeCurrentRevealTarget(layer: HTMLElement) {
  fireEvent.transitionEnd(getRevealOverlay(layer), {
    propertyName: REVEAL_TRANSITION_PROPERTY
  })
}

function expectOrderedStates(
  observedStates: LoadingCoverVisualState[],
  expectedStates: LoadingCoverVisualState[]
) {
  let previousIndex = -1

  for (const expectedState of expectedStates) {
    const nextIndex = observedStates.findIndex(
      (observedState, index) => index > previousIndex && observedState === expectedState
    )

    expect(nextIndex).toBeGreaterThan(previousIndex)
    previousIndex = nextIndex
  }
}

function createMatchMedia(reducedMotion: boolean) {
  return vi.fn().mockImplementation((query: string) => ({
    addEventListener: vi.fn(),
    addListener: vi.fn(),
    dispatchEvent: vi.fn(() => true),
    matches: reducedMotion && query === '(prefers-reduced-motion: reduce)',
    media: query,
    onchange: null,
    removeEventListener: vi.fn(),
    removeListener: vi.fn()
  }))
}

afterEach(() => {
  document.body.className = ''
  vi.unstubAllGlobals()
  vi.useRealTimers()
})

describe('LoadingCover', () => {
  it('UC-001 / UC-019 / EX-007 - exposes the public namespace, corrected Base UI prop aliases, and package assemblies', () => {
    expect(PACKAGE_EXPORTS.LoadingCover).toBeDefined()
    expect(Object.keys(PACKAGE_EXPORTS.LoadingCover).sort()).toEqual(['Cascade', 'Logo', 'Root'])
    expect(PACKAGE_EXPORTS.LoadingCoverCascade).toBe(PACKAGE_EXPORTS.LoadingCover.Cascade)
    expect(PACKAGE_EXPORTS.LoadingCoverLogo).toBe(PACKAGE_EXPORTS.LoadingCover.Logo)
    expect(PACKAGE_EXPORTS.LoadingCoverRoot).toBe(PACKAGE_EXPORTS.LoadingCover.Root)
    expect(PACKAGE_EXPORTS.Components.LoadingCover).toBe(PACKAGE_EXPORTS.LoadingCover)
    expect(PACKAGE_EXPORTS.Ui.Components.LoadingCover).toBe(PACKAGE_EXPORTS.LoadingCover)

    expectTypeOf<LoadingCoverNamespace['Cascade']>().toEqualTypeOf<
      typeof PACKAGE_EXPORTS.LoadingCoverCascade
    >()
    expectTypeOf<PublicLoadingCover.Cascade.Props>().toEqualTypeOf<LoadingCoverCascadeProps>()
    expectTypeOf<PublicLoadingCover.Cascade.State>().toEqualTypeOf<LoadingCoverCascadeState>()
    expectTypeOf<PublicLoadingCover.Root.Props>().toEqualTypeOf<LoadingCoverRootProps>()
    expectTypeOf<PublicLoadingCover.Root.State>().toEqualTypeOf<LoadingCoverRootState>()
    expectTypeOf<PublicLoadingCover.Logo.Props>().toEqualTypeOf<LoadingCoverLogoProps>()
    expectTypeOf<PublicLoadingCover.Logo.State>().toEqualTypeOf<LoadingCoverLogoState>()
    expectTypeOf<LoadingCoverCascadeProps>().toEqualTypeOf<ExpectedLoadingCoverCascadeProps>()
    expectTypeOf<LoadingCoverRootProps>().toEqualTypeOf<ExpectedLoadingCoverRootProps>()
    expectTypeOf<LoadingCoverLogoProps>().toMatchTypeOf<LogoIconProps>()
    expectTypeOf<LoadingCoverLogoProps['ref']>().toEqualTypeOf<Ref<SVGSVGElement> | undefined>()
    expectTypeOf<LoadingCoverCascadeState>().toEqualTypeOf<{ resolved: boolean }>()
    expectTypeOf<LoadingCoverRootState>().toEqualTypeOf<{
      busy: boolean
      fullscreen: boolean
      loading: boolean
      visualState: LoadingCoverVisualState
    }>()
    expectTypeOf<LoadingCoverVisualState>().toEqualTypeOf<
      'hidden' | 'revealing' | 'revealed' | 'unrevealing'
    >()
    expectTypeOf<LoadingCoverRevealAnimationProps>().toEqualTypeOf<
      Omit<
        RevealAnimationProps,
        'children' | 'contentMode' | 'render' | 'reveal' | 'scale' | 'unrevealBehavior'
      >
    >()
    expectTypeOf<LoadingCoverRootProps['loading']>().toEqualTypeOf<boolean>()
  })

  it('UC-001 / UC-018 - renders stable default elements, refs, native props, and the initial public state', () => {
    const cascadeRef = createRef<HTMLElement>()
    const logoRef = createRef<SVGSVGElement>()
    const rootRef = createRef<HTMLElement>()

    render(
      <LoadingCover.Cascade data-testid="cascade" ref={cascadeRef}>
        <LoadingCover.Root
          data-consumer-root="preserved"
          data-testid="root"
          fullscreen
          loading={false}
          ref={rootRef}
        >
          application content
        </LoadingCover.Root>
        <LoadingCover.Logo data-consumer-logo="preserved" ref={logoRef} />
      </LoadingCover.Cascade>
    )

    const cascade = screen.getByTestId('cascade')
    const root = getLoadingRoot('root')
    const content = getDirectLoadingContent(root)
    const logo = getRequiredElement(
      document.querySelector<SVGSVGElement>('[data-consumer-logo="preserved"]'),
      'Expected direct LoadingCover Logo'
    )

    expect(cascade.tagName).toBe('DIV')
    expect(cascadeRef.current).toBe(cascade)
    expect(cascade).toHaveAttribute('data-loading-cover-cascade')
    expect(cascade).toHaveAttribute('data-loading-cover-cascade-state', 'resolved')
    expect(root.tagName).toBe('DIV')
    expect(rootRef.current).toBe(root)
    expect(root).toHaveAttribute('data-consumer-root', 'preserved')
    expect(root).toHaveAttribute('data-loading-cover-root')
    expect(root).toHaveAttribute('data-loading-cover-state', 'hidden')
    expect(root).toHaveAttribute('data-fullscreen')
    expect(root).not.toHaveAttribute('data-loading')
    expect(content).toHaveTextContent('application content')
    expect(content).not.toHaveAttribute('inert')
    expect(content).not.toHaveAttribute('aria-hidden')
    expect(content).not.toHaveAttribute('aria-busy')
    expect(root.querySelector('[data-loading-cover-layer]')).not.toBeInTheDocument()
    expect(root.querySelector('[data-loading-cover-status]')).not.toBeInTheDocument()
    expect(logo.tagName.toLowerCase()).toBe('svg')
    expect(logoRef.current).toBe(logo)
    expect(logo).toHaveAttribute('data-loading-cover-logo')
    expect(logo).toHaveAttribute('data-consumer-logo', 'preserved')
    expect(root).not.toHaveAttribute('data-loading-cover-depth')
    expect(cascade).not.toHaveAttribute('data-loading-cover-member-count')
  })

  it('UC-002 / UC-003 / UC-004 / UC-005 / UC-016 / UC-018 / EX-001 / CR-002 - completes entrance before an immediate exit and releases content when unreveal starts', async () => {
    const onRevealChange = vi.fn()
    const onRevealComplete = vi.fn()
    const onRevealStart = vi.fn()
    const observedStates: LoadingCoverVisualState[] = []
    const renderRoot = (loading: boolean) => (
      <LoadingCover.Cascade data-testid="cascade">
        <LoadingCover.Root
          aria-label="Loading training plan"
          className={(state: LoadingCoverRootState) => {
            observedStates.push(state.visualState)
            return undefined
          }}
          data-testid="root"
          loading={loading}
          revealAnimationProps={{ onRevealChange, onRevealComplete, onRevealStart }}
        >
          <button type="button">edit training plan</button>
        </LoadingCover.Root>
      </LoadingCover.Cascade>
    )
    const view = render(renderRoot(false))
    const root = getLoadingRoot('root')
    const content = getDirectLoadingContent(root)
    const applicationButton = screen.getByRole('button', { name: 'edit training plan' })

    expect(applicationButton).toBeInTheDocument()
    expect(root).toHaveAttribute('data-loading-cover-state', 'hidden')

    view.rerender(renderRoot(true))

    await waitFor(() => expect(root).toHaveAttribute('data-loading-cover-state', 'revealing'))

    const layer = getDirectLoadingLayer(root)
    const revealRoot = getRevealRoot(layer)
    const status = screen.getByRole('status')

    expect(root).toHaveAttribute('data-loading')
    expect(applicationButton).toBeInTheDocument()
    expect(content).toContainElement(applicationButton)
    expect(screen.queryByRole('button', { name: 'edit training plan' })).not.toBeInTheDocument()
    expect(content).toHaveAttribute('inert')
    expect(content).toHaveAttribute('aria-hidden', 'true')
    expect(content).toHaveAttribute('aria-busy', 'true')
    expect(status).toHaveAttribute('aria-live', 'polite')
    expect(status).toHaveAttribute('aria-atomic', 'true')
    expect(status).toHaveAttribute('data-loading-cover-status')
    expect(status).toHaveTextContent('Loading training plan')
    expect(root).not.toHaveAttribute('aria-label')
    expect(revealRoot).toHaveAttribute('data-motion', 'reveal')
    expect(revealRoot).toHaveAttribute('data-content-mode', 'flow')
    expect(revealRoot).toHaveAttribute('data-unreveal-behavior', 'continue')
    expect(layer.querySelectorAll('[data-loading-cover-logo]')).toHaveLength(2)
    expect(onRevealChange).toHaveBeenCalledWith(true)
    expect(onRevealStart).toHaveBeenCalledWith(true)

    view.rerender(renderRoot(false))

    expect(root).toHaveAttribute('data-loading-cover-state', 'revealing')
    expect(root).not.toHaveAttribute('data-loading')
    expect(applicationButton).toBeInTheDocument()
    expect(content).toContainElement(applicationButton)
    expect(screen.queryByRole('button', { name: 'edit training plan' })).not.toBeInTheDocument()
    expect(onRevealChange).not.toHaveBeenCalledWith(false)

    completeCurrentRevealTarget(layer)

    await waitFor(() => expect(root).toHaveAttribute('data-loading-cover-state', 'unrevealing'))

    expect(onRevealComplete).toHaveBeenCalledWith(true)
    expect(onRevealChange).toHaveBeenCalledWith(false)
    expect(onRevealStart).toHaveBeenCalledWith(false)
    expect(screen.getByRole('button', { name: 'edit training plan' })).toBe(applicationButton)
    expect(content).toContainElement(applicationButton)
    expect(content).not.toHaveAttribute('inert')
    expect(content).not.toHaveAttribute('aria-hidden')
    expect(content).not.toHaveAttribute('aria-busy')
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
    expect(screen.getByTestId('cascade')).toHaveAttribute(
      'data-loading-cover-cascade-state',
      'pending'
    )

    completeCurrentRevealTarget(layer)

    await waitFor(() => expect(root).toHaveAttribute('data-loading-cover-state', 'hidden'))

    expect(onRevealComplete.mock.calls.map(([revealed]) => revealed)).toEqual([true, false])
    expect(root.querySelector('[data-loading-cover-layer]')).not.toBeInTheDocument()
    expect(screen.getAllByRole('button', { name: 'edit training plan' })).toHaveLength(1)
    expect(screen.getByTestId('cascade')).toHaveAttribute(
      'data-loading-cover-cascade-state',
      'resolved'
    )
    expectOrderedStates(observedStates, [
      'hidden',
      'revealing',
      'revealed',
      'unrevealing',
      'hidden'
    ])
  })

  it('UC-003 / UC-010 - unmounts mounted application children only after loading reaches complete coverage', async () => {
    const onRevealComplete = vi.fn()
    const renderRoot = (loading: boolean) => (
      <LoadingCover.Root
        data-testid="coverage-root"
        loading={loading}
        revealAnimationProps={{ onRevealComplete }}
      >
        <button type="button">covered application action</button>
      </LoadingCover.Root>
    )
    const view = render(renderRoot(false))
    const root = getLoadingRoot('coverage-root')
    const content = getDirectLoadingContent(root)
    const applicationButton = screen.getByRole('button', {
      name: 'covered application action'
    })

    view.rerender(renderRoot(true))

    await waitFor(() => expect(root).toHaveAttribute('data-loading-cover-state', 'revealing'))

    const layer = getDirectLoadingLayer(root)

    expect(applicationButton).toBeInTheDocument()
    expect(content).toContainElement(applicationButton)
    expect(getRevealRoot(layer)).not.toHaveTextContent('covered application action')
    expect(screen.queryByRole('button', { name: 'covered application action' })).toBeNull()

    completeCurrentRevealTarget(layer)

    await waitFor(() => expect(root).toHaveAttribute('data-loading-cover-state', 'revealed'))

    expect(onRevealComplete).toHaveBeenCalledWith(true)
    expect(applicationButton).not.toBeInTheDocument()
    expect(content).not.toHaveTextContent('covered application action')
  })

  it('UC-006 / EX-003 - passes allowed RevealAnimation configuration while owned controls remain fixed', async () => {
    const onRevealChange = vi.fn()
    const onRevealComplete = vi.fn()
    const onRevealStart = vi.fn()
    const unsafeRevealProps = {
      alignX: 'start',
      alignY: 'end',
      children: 'unsafe animation children',
      contentMode: 'phrasing',
      direction: 'top-to-bottom',
      offsetX: 8,
      offsetY: -3,
      onRevealChange,
      onRevealComplete,
      onRevealStart,
      render: <button type="button">unsafe render</button>,
      reveal: false,
      scale: 4,
      unrevealBehavior: 'return'
    } as unknown as LoadingCoverRevealAnimationProps
    const view = render(
      <LoadingCover.Root
        data-testid="configured-root"
        loading
        revealAnimationProps={unsafeRevealProps}
      />
    )
    const root = getLoadingRoot('configured-root')

    await waitFor(() => expect(root).toHaveAttribute('data-loading-cover-state', 'revealing'))

    const layer = getDirectLoadingLayer(root)
    const revealRoot = getRevealRoot(layer)
    const copy = getRequiredElement(
      layer.querySelector<HTMLElement>('[data-reveal-copy]'),
      'Expected RevealAnimation copy'
    )
    const copyScale = getRequiredElement(
      layer.querySelector<HTMLElement>('[data-reveal-copy-scale]'),
      'Expected RevealAnimation scale wrapper'
    )

    expect(revealRoot).toHaveAttribute('data-content-mode', 'flow')
    expect(revealRoot).toHaveAttribute('data-unreveal-behavior', 'continue')
    expect(copy).toHaveStyle({ '--reveal-offset-x': '8px', '--reveal-offset-y': '-3px' })
    expect(copyScale).toHaveStyle({ '--reveal-origin': 'left bottom' })
    expect(copyScale.style.transform).toContain('scale(1)')
    expect(layer).not.toHaveTextContent('unsafe animation children')
    expect(screen.queryByRole('button', { name: 'unsafe render' })).not.toBeInTheDocument()
    expect(onRevealChange).toHaveBeenCalledTimes(1)
    expect(onRevealChange).toHaveBeenLastCalledWith(true)
    expect(onRevealStart).toHaveBeenCalledTimes(1)
    expect(onRevealStart).toHaveBeenLastCalledWith(true)

    completeCurrentRevealTarget(layer)

    expect(onRevealComplete).toHaveBeenCalledTimes(1)
    expect(onRevealComplete).toHaveBeenCalledWith(true)

    view.rerender(
      <LoadingCover.Root
        data-testid="configured-root"
        loading={false}
        revealAnimationProps={unsafeRevealProps}
      />
    )

    await waitFor(() => expect(root).toHaveAttribute('data-loading-cover-state', 'unrevealing'))

    expect(onRevealChange).toHaveBeenLastCalledWith(false)
    expect(onRevealStart).toHaveBeenLastCalledWith(false)

    completeCurrentRevealTarget(layer)

    await waitFor(() => expect(root).toHaveAttribute('data-loading-cover-state', 'hidden'))

    expect(onRevealComplete.mock.calls.map(([revealed]) => revealed)).toEqual([true, false])
  })

  it('UC-007 / EX-008 - preserves the complete logical state and callback order under reduced motion', async () => {
    vi.stubGlobal('matchMedia', createMatchMedia(true))

    const observedStates: LoadingCoverVisualState[] = []
    const completedTargets: boolean[] = []
    const renderRoot = (loading: boolean) => (
      <LoadingCover.Root
        className={(state: LoadingCoverRootState) => {
          observedStates.push(state.visualState)
          return undefined
        }}
        data-testid="reduced-root"
        loading={loading}
        revealAnimationProps={{
          onRevealComplete: (revealed: boolean) => completedTargets.push(revealed)
        }}
      >
        reduced-motion content
      </LoadingCover.Root>
    )
    const view = render(renderRoot(false))
    const root = getLoadingRoot('reduced-root')

    view.rerender(renderRoot(true))

    await waitFor(() => expect(root).toHaveAttribute('data-loading-cover-state', 'revealed'))

    expect(screen.queryByText('reduced-motion content')).not.toBeInTheDocument()

    view.rerender(renderRoot(false))

    await waitFor(() => expect(root).toHaveAttribute('data-loading-cover-state', 'hidden'))

    expect(screen.getByText('reduced-motion content')).toBeInTheDocument()
    expect(completedTargets).toEqual([true, false])
    expectOrderedStates(observedStates, [
      'hidden',
      'revealing',
      'revealed',
      'unrevealing',
      'hidden'
    ])
  })

  it('UC-008 / UC-015 / UC-017 / EX-006 - presents one coordinated fullscreen cycle after local entrance', async () => {
    const onDialogRevealStart = vi.fn()
    const renderTree = (pageLoading: boolean, dialogLoading: boolean) => (
      <div>
        <button data-testid="outside-content" type="button">
          unrelated content
        </button>
        <LoadingCover.Cascade>
          <LoadingCover.Root
            aria-label="Loading page"
            data-testid="page-root"
            loading={pageLoading}
          >
            <main>
              <LoadingCover.Root
                aria-label="Loading workout editor"
                data-testid="dialog-root"
                fullscreen
                loading={dialogLoading}
                revealAnimationProps={{ onRevealStart: onDialogRevealStart }}
              >
                workout editor
              </LoadingCover.Root>
            </main>
          </LoadingCover.Root>
        </LoadingCover.Cascade>
      </div>
    )
    const view = render(renderTree(true, false))
    const pageRoot = getLoadingRoot('page-root')
    const pageLayer = getDirectLoadingLayer(pageRoot)
    const pageContent = getDirectLoadingContent(pageRoot)
    const initialDialogRoot = getLoadingRoot('dialog-root')

    await waitFor(() => expect(pageRoot).toHaveAttribute('data-loading-cover-state', 'revealing'))

    expect(initialDialogRoot).toHaveAttribute('data-loading-cover-state', 'hidden')
    expect(
      document.body.querySelector(':scope > [data-loading-cover-layer]')
    ).not.toBeInTheDocument()
    expect(screen.getAllByRole('status')).toHaveLength(1)
    expect(screen.getByRole('status')).toHaveTextContent('Loading page')
    expect(onDialogRevealStart).not.toHaveBeenCalled()

    completeCurrentRevealTarget(pageLayer)

    await waitFor(() => expect(pageRoot).toHaveAttribute('data-loading-cover-state', 'revealed'))

    expect(onDialogRevealStart).not.toHaveBeenCalled()

    view.rerender(renderTree(false, true))

    await waitFor(() =>
      expect(getLoadingRoot('dialog-root')).toHaveAttribute('data-loading-cover-state', 'revealing')
    )

    const dialogRoot = getLoadingRoot('dialog-root')
    const fullscreenLayer = getLayerFromStatusText('Loading workout editor')
    const dialogContent = getDirectLoadingContent(dialogRoot)

    expect(pageRoot).toHaveAttribute('data-loading-cover-state', 'revealed')
    expect(pageContent).toHaveAttribute('inert')
    expect(pageContent).toHaveAttribute('aria-hidden', 'true')
    expect(pageLayer.parentElement).toBe(pageRoot)
    expect(fullscreenLayer.parentElement).toBe(document.body)
    expect(dialogRoot.parentElement).not.toBe(document.body)
    expect(dialogRoot).toHaveAttribute('data-fullscreen')
    expect(pageRoot).not.toHaveAttribute('data-fullscreen')
    expect(screen.getByTestId('outside-content')).not.toHaveAttribute('inert')
    expect(screen.getByTestId('outside-content')).not.toHaveAttribute('aria-hidden')
    expect(dialogContent).toHaveTextContent('workout editor')
    expect(dialogContent).toHaveAttribute('inert')
    expect(dialogContent).toHaveAttribute('aria-hidden', 'true')
    expect(screen.getAllByRole('status')).toHaveLength(1)
    expect(screen.getByRole('status')).toHaveTextContent('Loading workout editor')
    expect(onDialogRevealStart.mock.calls.map(([revealed]) => revealed)).toEqual([true])
    expect(fullscreenLayer).not.toHaveAttribute('data-loading-cover-stack-rank')
    expect(pageLayer).not.toHaveAttribute('data-loading-cover-stack-rank')

    completeCurrentRevealTarget(fullscreenLayer)
    view.rerender(renderTree(false, false))

    await waitFor(() =>
      expect(dialogRoot).toHaveAttribute('data-loading-cover-state', 'unrevealing')
    )

    expect(screen.getAllByRole('status')).toHaveLength(1)
    expect(screen.getByRole('status')).toHaveTextContent('Loading page')
    expect(onDialogRevealStart.mock.calls.map(([revealed]) => revealed)).toEqual([true, false])

    completeCurrentRevealTarget(fullscreenLayer)

    await waitFor(() => expect(pageRoot).toHaveAttribute('data-loading-cover-state', 'unrevealing'))

    completeCurrentRevealTarget(pageLayer)

    await waitFor(() => expect(pageRoot).toHaveAttribute('data-loading-cover-state', 'hidden'))

    expect(onDialogRevealStart.mock.calls.map(([revealed]) => revealed)).toEqual([true, false])
  })

  it('UC-009 / UC-010 / UC-020 / EX-002 - renders only duplicate-safe loading marks twice and never duplicates application content', async () => {
    const renderOptions = (loading: boolean) => (
      <div>
        <LoadingCover.Root data-testid="default-root" loading={loading}>
          <button type="button">application action</button>
        </LoadingCover.Root>
        <LoadingCover.Root
          data-testid="replacement-root"
          loading
          logo={
            <span aria-hidden data-custom-loading-logo="initials">
              PC
            </span>
          }
        />
        <LoadingCover.Root data-testid="removed-root" loading logo={null} />
      </div>
    )
    const view = render(renderOptions(true))
    const defaultRoot = getLoadingRoot('default-root')
    const defaultLayer = getDirectLoadingLayer(defaultRoot)
    const replacementLayer = getDirectLoadingLayer(getLoadingRoot('replacement-root'))
    const removedLayer = getDirectLoadingLayer(getLoadingRoot('removed-root'))

    expect(defaultLayer.querySelectorAll('[data-loading-cover-logo]')).toHaveLength(2)
    expect(defaultLayer.querySelectorAll('[data-reveal-source]')).toHaveLength(1)
    expect(defaultLayer.querySelectorAll('[data-reveal-overlay-surface]')).toHaveLength(1)
    expect(replacementLayer.querySelectorAll('[data-custom-loading-logo="initials"]')).toHaveLength(
      2
    )
    expect(replacementLayer.querySelectorAll('[data-loading-cover-logo]')).toHaveLength(0)
    expect(removedLayer).not.toHaveTextContent('PC')
    expect(removedLayer.querySelectorAll('[data-loading-cover-logo]')).toHaveLength(0)
    expect(screen.queryByRole('button', { name: 'application action' })).not.toBeInTheDocument()
    expect(getRevealRoot(defaultLayer)).not.toHaveTextContent('application action')

    completeCurrentRevealTarget(defaultLayer)
    view.rerender(renderOptions(false))

    await waitFor(() =>
      expect(defaultRoot).toHaveAttribute('data-loading-cover-state', 'unrevealing')
    )

    expect(screen.getAllByRole('button', { name: 'application action' })).toHaveLength(1)
    expect(getRevealRoot(defaultLayer)).not.toHaveTextContent('application action')
    expect(getDirectLoadingContent(defaultRoot)).toContainElement(
      screen.getByRole('button', { name: 'application action' })
    )
  })

  it('UC-011 / UC-017 / EX-004 - waits for a nested Root and suppresses its same-tier announcement', async () => {
    const renderTree = (pageLoading: boolean, panelLoading: boolean) => (
      <LoadingCover.Cascade>
        <LoadingCover.Root aria-label="Loading page" data-testid="page-root" loading={pageLoading}>
          <LoadingCover.Root
            aria-label="Loading panel"
            data-testid="panel-root"
            loading={panelLoading}
          >
            panel data
          </LoadingCover.Root>
        </LoadingCover.Root>
      </LoadingCover.Cascade>
    )
    const view = render(renderTree(true, true))
    const pageRoot = getLoadingRoot('page-root')
    const pageLayer = getDirectLoadingLayer(pageRoot)
    const panelRoot = getLoadingRoot('panel-root')

    await waitFor(() => expect(panelRoot).toHaveAttribute('data-loading-cover-state', 'revealing'))

    const panelLayer = getDirectLoadingLayer(panelRoot)

    view.rerender(renderTree(false, true))

    expect(pageRoot).toHaveAttribute('data-loading-cover-state', 'revealing')
    expect(getLoadingRoot('panel-root')).toBe(panelRoot)

    completeCurrentRevealTarget(pageLayer)

    await waitFor(() => expect(pageRoot).toHaveAttribute('data-loading-cover-state', 'revealed'))

    expect(getLoadingRoot('panel-root')).toBe(panelRoot)
    expect(pageRoot).toHaveAttribute('data-loading-cover-state', 'revealed')
    expect(screen.getAllByRole('status')).toHaveLength(1)
    expect(screen.getByRole('status')).toHaveTextContent('Loading page')

    completeCurrentRevealTarget(panelLayer)
    view.rerender(renderTree(false, false))

    await waitFor(() =>
      expect(panelRoot).toHaveAttribute('data-loading-cover-state', 'unrevealing')
    )

    expect(pageRoot).toHaveAttribute('data-loading-cover-state', 'revealed')

    completeCurrentRevealTarget(panelLayer)

    await waitFor(() => expect(pageRoot).toHaveAttribute('data-loading-cover-state', 'unrevealing'))
  })

  it('UC-005 / UC-011 / EX-004 / CR-001 - waits for an unresolved descendant remounted after sustained complete coverage', async () => {
    const onPageRevealChange = vi.fn()
    const renderTree = (pageLoading: boolean, panelLoading: boolean) => (
      <LoadingCover.Cascade>
        <LoadingCover.Root
          data-testid="remount-page-root"
          loading={pageLoading}
          revealAnimationProps={{ onRevealChange: onPageRevealChange }}
        >
          <LoadingCover.Root data-testid="remount-panel-root" loading={panelLoading}>
            panel data
          </LoadingCover.Root>
        </LoadingCover.Root>
      </LoadingCover.Cascade>
    )
    const view = render(renderTree(true, true))
    const pageRoot = getLoadingRoot('remount-page-root')
    const pageLayer = getDirectLoadingLayer(pageRoot)
    const initialPanelRoot = getLoadingRoot('remount-panel-root')

    await waitFor(() =>
      expect(initialPanelRoot).toHaveAttribute('data-loading-cover-state', 'revealing')
    )

    completeCurrentRevealTarget(pageLayer)

    await waitFor(() => expect(pageRoot).toHaveAttribute('data-loading-cover-state', 'revealed'))

    expect(initialPanelRoot).not.toBeInTheDocument()

    view.rerender(renderTree(false, true))

    const remountedPanelRoot = await screen.findByTestId('remount-panel-root')

    await waitFor(() =>
      expect(remountedPanelRoot).toHaveAttribute('data-loading-cover-state', 'revealing')
    )

    const panelLayer = getDirectLoadingLayer(remountedPanelRoot)

    expect(remountedPanelRoot).not.toBe(initialPanelRoot)
    expect(pageRoot).toHaveAttribute('data-loading-cover-state', 'revealed')
    expect(onPageRevealChange.mock.calls.map(([revealed]) => revealed)).toEqual([true])

    completeCurrentRevealTarget(panelLayer)

    await waitFor(() =>
      expect(remountedPanelRoot).toHaveAttribute('data-loading-cover-state', 'revealed')
    )

    view.rerender(renderTree(false, false))

    await waitFor(() =>
      expect(remountedPanelRoot).toHaveAttribute('data-loading-cover-state', 'unrevealing')
    )

    expect(pageRoot).toHaveAttribute('data-loading-cover-state', 'revealed')
    expect(onPageRevealChange.mock.calls.map(([revealed]) => revealed)).toEqual([true])

    completeCurrentRevealTarget(panelLayer)

    await waitFor(() =>
      expect(remountedPanelRoot).toHaveAttribute('data-loading-cover-state', 'hidden')
    )
    await waitFor(() => expect(pageRoot).toHaveAttribute('data-loading-cover-state', 'unrevealing'))

    expect(onPageRevealChange.mock.calls.map(([revealed]) => revealed)).toEqual([true, false])
  })

  it('UC-012 / EX-005 - recursively aggregates current Root and Cascade membership and resolves removal or emptiness', async () => {
    const renderTree = (showMember: boolean, loading: boolean) => (
      <LoadingCover.Cascade data-testid="outer-cascade">
        <LoadingCover.Cascade data-testid="inner-cascade">
          {showMember ? (
            <LoadingCover.Root data-testid="member-root" loading={loading}>
              member content
            </LoadingCover.Root>
          ) : null}
        </LoadingCover.Cascade>
      </LoadingCover.Cascade>
    )
    const view = render(renderTree(false, false))
    const outerCascade = screen.getByTestId('outer-cascade')
    const innerCascade = screen.getByTestId('inner-cascade')

    expect(innerCascade).toHaveAttribute('data-loading-cover-cascade-state', 'resolved')
    expect(outerCascade).toHaveAttribute('data-loading-cover-cascade-state', 'resolved')

    view.rerender(renderTree(true, true))

    await waitFor(() =>
      expect(innerCascade).toHaveAttribute('data-loading-cover-cascade-state', 'pending')
    )

    expect(outerCascade).toHaveAttribute('data-loading-cover-cascade-state', 'pending')
    expect(getLoadingRoot('member-root')).toHaveAttribute('data-loading-cover-state', 'revealing')

    view.rerender(renderTree(false, true))

    await waitFor(() =>
      expect(innerCascade).toHaveAttribute('data-loading-cover-cascade-state', 'resolved')
    )

    expect(outerCascade).toHaveAttribute('data-loading-cover-cascade-state', 'resolved')

    view.rerender(renderTree(true, false))

    await waitFor(() =>
      expect(innerCascade).toHaveAttribute('data-loading-cover-cascade-state', 'resolved')
    )

    expect(getLoadingRoot('member-root')).toHaveAttribute('data-loading-cover-state', 'hidden')
  })

  it('UC-013 / EX-005 - leaves nested Roots independent outside Cascade and keeps hidden Roots as propagation boundaries', async () => {
    const renderTree = (parentLoading: boolean, childLoading: boolean) => (
      <LoadingCover.Root data-testid="parent-root" loading={parentLoading}>
        <LoadingCover.Root data-testid="child-root" loading={childLoading}>
          child content
        </LoadingCover.Root>
      </LoadingCover.Root>
    )
    const view = render(renderTree(true, true))
    const parentRoot = getLoadingRoot('parent-root')
    const parentLayer = getDirectLoadingLayer(parentRoot)

    completeCurrentRevealTarget(parentLayer)
    view.rerender(renderTree(false, true))

    const childRoot = await screen.findByTestId('child-root')

    await waitFor(() =>
      expect(parentRoot).toHaveAttribute('data-loading-cover-state', 'unrevealing')
    )

    expect(childRoot).toHaveAttribute('data-loading-cover-state', 'revealing')

    completeCurrentRevealTarget(parentLayer)

    await waitFor(() => expect(parentRoot).toHaveAttribute('data-loading-cover-state', 'hidden'))

    expect(childRoot).toHaveAttribute('data-loading-cover-state', 'revealing')

    view.rerender(renderTree(false, false))

    expect(parentRoot).toHaveAttribute('data-loading-cover-state', 'hidden')
  })

  it('UC-014 / EX-004 - keeps a coordinated tree mounted and reaches complete recovery before a resolved descendant permits another exit', async () => {
    const renderTree = (parentLoading: boolean, childLoading: boolean) => (
      <LoadingCover.Cascade>
        <LoadingCover.Root data-testid="parent-root" loading={parentLoading}>
          <LoadingCover.Root data-testid="child-root" loading={childLoading}>
            child content
          </LoadingCover.Root>
        </LoadingCover.Root>
      </LoadingCover.Cascade>
    )
    const view = render(renderTree(true, false))
    const parentRoot = getLoadingRoot('parent-root')
    const parentLayer = getDirectLoadingLayer(parentRoot)

    completeCurrentRevealTarget(parentLayer)
    view.rerender(renderTree(false, false))

    const childRoot = await screen.findByTestId('child-root')

    await waitFor(() =>
      expect(parentRoot).toHaveAttribute('data-loading-cover-state', 'unrevealing')
    )

    view.rerender(renderTree(false, true))

    await waitFor(() => expect(parentRoot).toHaveAttribute('data-loading-cover-state', 'revealing'))

    const childLayer = getDirectLoadingLayer(childRoot)

    expect(childRoot).toBeInTheDocument()
    expect(childRoot).toHaveAttribute('data-loading-cover-state', 'revealing')
    expect(getDirectLoadingContent(parentRoot)).toHaveAttribute('inert')
    expect(getDirectLoadingContent(parentRoot)).toHaveAttribute('aria-hidden', 'true')
    expect(getDirectLoadingContent(parentRoot)).toHaveAttribute('aria-busy', 'true')

    view.rerender(renderTree(false, false))

    expect(parentRoot).toHaveAttribute('data-loading-cover-state', 'revealing')
    expect(childRoot).toBeInTheDocument()
    expect(childRoot).toHaveAttribute('data-loading-cover-state', 'revealing')

    completeCurrentRevealTarget(childLayer)

    await waitFor(() =>
      expect(childRoot).toHaveAttribute('data-loading-cover-state', 'unrevealing')
    )

    completeCurrentRevealTarget(childLayer)

    await waitFor(() => expect(childRoot).toHaveAttribute('data-loading-cover-state', 'hidden'))

    expect(parentRoot).toHaveAttribute('data-loading-cover-state', 'revealing')
    expect(childRoot).toBeInTheDocument()

    completeCurrentRevealTarget(parentLayer)

    await waitFor(() =>
      expect(parentRoot).toHaveAttribute('data-loading-cover-state', 'unrevealing')
    )

    expect(childRoot).toBeInTheDocument()
  })

  it('UC-004 / UC-014 - keeps application content mounted through interrupted recovery and completes coverage before resuming exit', async () => {
    const onRevealChange = vi.fn()
    const onRevealComplete = vi.fn()
    const onRevealStart = vi.fn()
    const renderRoot = (loading: boolean) => (
      <LoadingCover.Root
        data-testid="root"
        loading={loading}
        revealAnimationProps={{ onRevealChange, onRevealComplete, onRevealStart }}
      >
        <button type="button">application action</button>
      </LoadingCover.Root>
    )
    const view = render(renderRoot(true))
    const root = getLoadingRoot('root')
    const layer = getDirectLoadingLayer(root)
    const initiallyMountedButton = screen.getByText('application action')

    await waitFor(() => expect(root).toHaveAttribute('data-loading-cover-state', 'revealing'))

    expect(initiallyMountedButton).toBeInTheDocument()

    completeCurrentRevealTarget(layer)

    await waitFor(() => expect(root).toHaveAttribute('data-loading-cover-state', 'revealed'))

    expect(initiallyMountedButton).not.toBeInTheDocument()

    view.rerender(renderRoot(false))

    await waitFor(() => expect(root).toHaveAttribute('data-loading-cover-state', 'unrevealing'))

    const applicationButton = screen.getByRole('button', { name: 'application action' })

    expect(applicationButton).toBeInTheDocument()

    view.rerender(renderRoot(true))

    await waitFor(() => expect(root).toHaveAttribute('data-loading-cover-state', 'revealing'))

    expect(applicationButton).toBeInTheDocument()
    expect(getDirectLoadingContent(root)).toContainElement(applicationButton)
    expect(screen.queryByRole('button', { name: 'application action' })).not.toBeInTheDocument()
    expect(getDirectLoadingContent(root)).toHaveAttribute('inert')
    expect(onRevealChange.mock.calls.map(([revealed]) => revealed)).toEqual([true, false, true])

    view.rerender(renderRoot(false))

    expect(root).toHaveAttribute('data-loading-cover-state', 'revealing')
    expect(applicationButton).toBeInTheDocument()
    expect(onRevealChange.mock.calls.map(([revealed]) => revealed)).toEqual([true, false, true])
    expect(onRevealStart.mock.calls.map(([revealed]) => revealed)).toEqual([true, false, true])

    completeCurrentRevealTarget(layer)

    await waitFor(() => expect(root).toHaveAttribute('data-loading-cover-state', 'unrevealing'))

    expect(applicationButton).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'application action' })).toBe(applicationButton)
    expect(getDirectLoadingContent(root)).not.toHaveAttribute('inert')
    expect(onRevealChange.mock.calls.map(([revealed]) => revealed)).toEqual([
      true,
      false,
      true,
      false
    ])
    expect(onRevealComplete.mock.calls.map(([revealed]) => revealed)).toEqual([true, true])

    completeCurrentRevealTarget(layer)

    await waitFor(() => expect(root).toHaveAttribute('data-loading-cover-state', 'hidden'))

    expect(onRevealComplete.mock.calls.map(([revealed]) => revealed)).toEqual([true, true, false])
  })

  it('UC-017 - preserves independent sibling announcements', async () => {
    render(
      <div>
        <LoadingCover.Root aria-label="Loading summary" loading />
        <LoadingCover.Root aria-label="Loading details" loading />
      </div>
    )

    await waitFor(() => expect(screen.getAllByRole('status')).toHaveLength(2))

    expect(screen.getByText('Loading summary')).toHaveAttribute('data-loading-cover-status')
    expect(screen.getByText('Loading details')).toHaveAttribute('data-loading-cover-status')
  })

  it('UC-018 / UC-019 / EX-007 - composes function and element renders with state-aware class, style, events, native props, children, and refs', () => {
    const cascadeRef = createRef<HTMLElement>()
    const cascadeStates: LoadingCoverCascadeState[] = []
    const onCascadeClick = vi.fn()
    const onRootClick = vi.fn()
    const rootRef = createRef<HTMLElement>()
    const rootStates: LoadingCoverRootState[] = []

    render(
      <LoadingCover.Cascade
        className={(state: LoadingCoverCascadeState) => {
          cascadeStates.push(state)
          return 'consumer-cascade'
        }}
        data-native-cascade="preserved"
        onClick={onCascadeClick}
        ref={cascadeRef}
        render={(props: ComponentPropsWithRef<'div'>, state: LoadingCoverCascadeState) => (
          <section {...props} data-visible-cascade-state={state.resolved ? 'resolved' : 'pending'}>
            {props.children}
          </section>
        )}
      >
        <LoadingCover.Root
          aria-label="Consumed Root label"
          className={(state: LoadingCoverRootState) => {
            rootStates.push(state)
            return 'consumer-root'
          }}
          data-native-root="preserved"
          loading={false}
          onClick={(event: MouseEvent<HTMLElement>) => {
            event.stopPropagation()
            onRootClick()
          }}
          ref={rootRef}
          render={(props: ComponentPropsWithRef<'div'>, state: LoadingCoverRootState) => (
            <article {...props} data-visible-root-state={state.visualState}>
              {props.children}
              <output>root: {state.visualState}</output>
            </article>
          )}
          style={(state: LoadingCoverRootState) =>
            ({ '--consumer-loading-state': state.visualState }) as LoadingCoverCssProperties
          }
        >
          composed content
        </LoadingCover.Root>
        <LoadingCover.Root
          data-testid="element-root"
          loading={false}
          render={<aside data-element-render="preserved" />}
        >
          element content
        </LoadingCover.Root>
      </LoadingCover.Cascade>
    )

    const cascade = getRequiredElement(
      document.querySelector<HTMLElement>('section[data-loading-cover-cascade]'),
      'Expected composed Cascade section'
    )
    const root = getRequiredElement(
      document.querySelector<HTMLElement>('article[data-loading-cover-root]'),
      'Expected composed Root article'
    )
    const elementRoot = getLoadingRoot('element-root')

    expect(cascadeRef.current).toBe(cascade)
    expect(rootRef.current).toBe(root)
    expect(cascade).toHaveClass('consumer-cascade')
    expect(cascade).toHaveAttribute('data-native-cascade', 'preserved')
    expect(cascade).toHaveAttribute('data-visible-cascade-state', 'resolved')
    expect(root).toHaveClass('consumer-root')
    expect(root).toHaveAttribute('data-native-root', 'preserved')
    expect(root).toHaveAttribute('data-visible-root-state', 'hidden')
    expect(root).toHaveStyle({ '--consumer-loading-state': 'hidden' })
    expect(root).not.toHaveAttribute('aria-label')
    expect(root).toHaveTextContent('composed content')
    expect(root).toHaveTextContent('root: hidden')
    expect(elementRoot.tagName).toBe('ASIDE')
    expect(elementRoot).toHaveAttribute('data-element-render', 'preserved')
    expect(elementRoot).toHaveTextContent('element content')
    expect(cascadeStates.at(-1)).toEqual({ resolved: true })
    expect(rootStates.at(-1)).toEqual({
      busy: false,
      fullscreen: false,
      loading: false,
      visualState: 'hidden'
    })

    fireEvent.click(root)

    expect(onRootClick).toHaveBeenCalledTimes(1)
    expect(onCascadeClick).not.toHaveBeenCalled()

    fireEvent.click(cascade)

    expect(onCascadeClick).toHaveBeenCalledTimes(1)
  })

  it('UC-021 / EX-003 - recognizes direction-change attainment without synthesizing consumer completion', async () => {
    const onRevealChange = vi.fn()
    const onRevealComplete = vi.fn()
    const onRevealStart = vi.fn()
    const renderRoot = (loading: boolean, direction: 'left-to-right' | 'top-to-bottom') => (
      <LoadingCover.Root
        data-testid="direction-root"
        loading={loading}
        revealAnimationProps={{
          direction,
          onRevealChange,
          onRevealComplete,
          onRevealStart
        }}
      >
        direction content
      </LoadingCover.Root>
    )
    const view = render(renderRoot(true, 'left-to-right'))
    const root = getLoadingRoot('direction-root')
    const applicationContent = screen.getByText('direction content')

    await waitFor(() => expect(root).toHaveAttribute('data-loading-cover-state', 'revealing'))

    expect(applicationContent).toBeInTheDocument()

    view.rerender(renderRoot(false, 'top-to-bottom'))

    await waitFor(() => expect(root).toHaveAttribute('data-loading-cover-state', 'unrevealing'))

    expect(onRevealComplete).not.toHaveBeenCalledWith(true)
    expect(applicationContent).toBeInTheDocument()
    expect(getDirectLoadingContent(root)).toContainElement(applicationContent)
    expect(onRevealChange.mock.calls.map(([revealed]) => revealed)).toEqual([true, false])
    expect(onRevealStart.mock.calls.map(([revealed]) => revealed)).toEqual([true, false])

    const layer = getDirectLoadingLayer(root)

    completeCurrentRevealTarget(layer)

    await waitFor(() => expect(root).toHaveAttribute('data-loading-cover-state', 'hidden'))

    expect(onRevealComplete.mock.calls.map(([revealed]) => revealed)).toEqual([false])
  })

  it('UC-008 / UC-015 - keeps overlapping fullscreen peers on one intentionally unordered public tier', async () => {
    render(
      <LoadingCover.Cascade>
        <LoadingCover.Root aria-label="Loading first fullscreen" fullscreen loading />
        <LoadingCover.Root aria-label="Loading second fullscreen" fullscreen loading />
      </LoadingCover.Cascade>
    )

    await waitFor(() =>
      expect(document.body.querySelectorAll('[data-loading-cover-layer]')).toHaveLength(2)
    )

    const fullscreenLayers = Array.from(
      document.body.querySelectorAll<HTMLElement>(':scope > [data-loading-cover-layer]')
    )

    expect(fullscreenLayers).toHaveLength(2)
    for (const layer of fullscreenLayers) {
      expect(layer).not.toHaveAttribute('data-loading-cover-depth')
      expect(layer).not.toHaveAttribute('data-loading-cover-order')
      expect(layer).not.toHaveAttribute('data-loading-cover-stack-rank')
    }
  })

  it('UC-016 / UC-017 - keeps the live status outside the busy application and decorative reveal subtrees', async () => {
    render(
      <LoadingCover.Root aria-label="Loading athlete data" data-testid="root" loading>
        athlete data
      </LoadingCover.Root>
    )
    const root = getLoadingRoot('root')

    await waitFor(() => expect(root).toHaveAttribute('data-loading-cover-state', 'revealing'))

    const content = getDirectLoadingContent(root)
    const layer = getDirectLoadingLayer(root)
    const status = screen.getByRole('status')
    const revealRoot = getRevealRoot(layer)
    const revealSource = getRequiredElement(
      revealRoot.querySelector<HTMLElement>('[data-reveal-source]'),
      'Expected the real loading source'
    )
    const overlayLoadingSurface = getRequiredElement(
      revealRoot.querySelector<HTMLElement>('[data-reveal-overlay-surface]'),
      'Expected the decorative LoadingCover overlay surface'
    )

    expect(content).toHaveAttribute('inert')
    expect(content).toHaveAttribute('aria-hidden', 'true')
    expect(content).toHaveAttribute('aria-busy', 'true')
    expect(content).toHaveTextContent('athlete data')
    expect(revealRoot).not.toHaveTextContent('athlete data')
    expect(content).not.toContainElement(status)
    expect(revealRoot).not.toContainElement(status)
    expect(revealSource).toHaveAttribute('aria-hidden', 'true')
    expect(revealSource).toHaveAttribute('inert')
    expect(overlayLoadingSurface).toHaveAttribute('aria-hidden', 'true')
    expect(overlayLoadingSurface).toHaveAttribute('inert')
    expect(within(revealRoot).queryByRole('status')).not.toBeInTheDocument()
  })
})
