import { ScrollArea as BaseUiScrollArea } from '@base-ui/react/scroll-area'
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { createRef, type ComponentPropsWithRef, type ReactElement, type ReactNode } from 'react'
import { afterEach, beforeEach, describe, expect, expectTypeOf, it, vi } from 'vitest'

import * as PackageExports from '../..'

interface ScrollAreaViewportMetrics {
  clientHeight: number
  clientWidth: number
  scrollHeight: number
  scrollWidth: number
}

type ScrollAreaProps = Omit<BaseUiScrollArea.Root.Props, 'children'> & {
  children: ReactNode
}

type ScrollAreaComponent = (props: ScrollAreaProps) => ReactElement | null

interface ScrollAreaPackageContract {
  Components: typeof PackageExports.Components & {
    ScrollArea: ScrollAreaComponent
  }
  ScrollArea: ScrollAreaComponent
  Ui: typeof PackageExports.Ui & {
    Components: typeof PackageExports.Components & {
      ScrollArea: ScrollAreaComponent
    }
  }
}

type InternalScrollAreaProp = Extract<
  | 'cornerProps'
  | 'horizontalScrollbarProps'
  | 'orientation'
  | 'scrollbarProps'
  | 'thumbProps'
  | 'verticalScrollbarProps'
  | 'viewportProps',
  keyof ScrollAreaProps
>

const PACKAGE_EXPORTS = PackageExports as typeof PackageExports & ScrollAreaPackageContract
const ScrollArea = PACKAGE_EXPORTS.ScrollArea as ScrollAreaComponent
const SCROLL_AREA_OMITS_INTERNAL_PART_PROPS = true satisfies InternalScrollAreaProp extends never
  ? true
  : false
const ORIGINAL_GET_ANIMATIONS = HTMLElement.prototype.getAnimations
const ORIGINAL_HAS_POINTER_CAPTURE = HTMLElement.prototype.hasPointerCapture
const ORIGINAL_RELEASE_POINTER_CAPTURE = HTMLElement.prototype.releasePointerCapture
const ORIGINAL_SET_POINTER_CAPTURE = HTMLElement.prototype.setPointerCapture

function getViewport(root: HTMLElement): HTMLElement {
  const viewport = root.querySelector<HTMLElement>('[tabindex]')

  expect(viewport).toBeInTheDocument()

  return viewport as HTMLElement
}

function queryScrollbar(
  root: HTMLElement,
  orientation: 'horizontal' | 'vertical'
): HTMLElement | null {
  const scrollbar = Array.from(root.children).find(
    (element) => element.getAttribute('data-orientation') === orientation
  )

  return scrollbar instanceof HTMLElement ? scrollbar : null
}

function getScrollbar(root: HTMLElement, orientation: 'horizontal' | 'vertical'): HTMLElement {
  const scrollbar = queryScrollbar(root, orientation)

  expect(scrollbar).toBeInTheDocument()

  return scrollbar as HTMLElement
}

function getThumb(scrollbar: HTMLElement): HTMLElement {
  const thumb = scrollbar.querySelector<HTMLElement>('[data-orientation]')

  expect(thumb).toBeInTheDocument()

  return thumb as HTMLElement
}

describe('ScrollArea', () => {
  let viewportMetrics: ScrollAreaViewportMetrics

  beforeEach(() => {
    viewportMetrics = {
      clientHeight: 160,
      clientWidth: 320,
      scrollHeight: 160,
      scrollWidth: 320
    }

    vi.spyOn(HTMLElement.prototype, 'clientHeight', 'get').mockImplementation(function (
      this: HTMLElement
    ) {
      return this.style.overflow === 'scroll' ? viewportMetrics.clientHeight : 0
    })
    vi.spyOn(HTMLElement.prototype, 'clientWidth', 'get').mockImplementation(function (
      this: HTMLElement
    ) {
      return this.style.overflow === 'scroll' ? viewportMetrics.clientWidth : 0
    })
    vi.spyOn(HTMLElement.prototype, 'scrollHeight', 'get').mockImplementation(function (
      this: HTMLElement
    ) {
      return this.style.overflow === 'scroll' ? viewportMetrics.scrollHeight : 0
    })
    vi.spyOn(HTMLElement.prototype, 'scrollWidth', 'get').mockImplementation(function (
      this: HTMLElement
    ) {
      return this.style.overflow === 'scroll' ? viewportMetrics.scrollWidth : 0
    })
    vi.spyOn(HTMLElement.prototype, 'offsetHeight', 'get').mockImplementation(function (
      this: HTMLElement
    ) {
      const orientation = this.getAttribute('data-orientation')
      const isThumb = this.parentElement?.getAttribute('data-orientation') === orientation

      if (orientation === 'horizontal') return isThumb ? 22 : 24
      if (orientation === 'vertical') return isThumb ? 48 : viewportMetrics.clientHeight

      return 0
    })
    vi.spyOn(HTMLElement.prototype, 'offsetWidth', 'get').mockImplementation(function (
      this: HTMLElement
    ) {
      const orientation = this.getAttribute('data-orientation')
      const isThumb = this.parentElement?.getAttribute('data-orientation') === orientation

      if (orientation === 'vertical') return isThumb ? 22 : 24
      if (orientation === 'horizontal') return isThumb ? 64 : viewportMetrics.clientWidth

      return 0
    })

    Object.defineProperty(HTMLElement.prototype, 'getAnimations', {
      configurable: true,
      value: vi.fn(() => [])
    })
    Object.defineProperty(HTMLElement.prototype, 'hasPointerCapture', {
      configurable: true,
      value: vi.fn(() => true)
    })
    Object.defineProperty(HTMLElement.prototype, 'releasePointerCapture', {
      configurable: true,
      value: vi.fn()
    })
    Object.defineProperty(HTMLElement.prototype, 'setPointerCapture', {
      configurable: true,
      value: vi.fn()
    })
  })

  afterEach(() => {
    vi.restoreAllMocks()

    if (ORIGINAL_GET_ANIMATIONS === undefined) {
      Reflect.deleteProperty(HTMLElement.prototype, 'getAnimations')
    } else {
      Object.defineProperty(HTMLElement.prototype, 'getAnimations', {
        configurable: true,
        value: ORIGINAL_GET_ANIMATIONS
      })
    }

    if (ORIGINAL_HAS_POINTER_CAPTURE === undefined) {
      Reflect.deleteProperty(HTMLElement.prototype, 'hasPointerCapture')
    } else {
      Object.defineProperty(HTMLElement.prototype, 'hasPointerCapture', {
        configurable: true,
        value: ORIGINAL_HAS_POINTER_CAPTURE
      })
    }

    if (ORIGINAL_RELEASE_POINTER_CAPTURE === undefined) {
      Reflect.deleteProperty(HTMLElement.prototype, 'releasePointerCapture')
    } else {
      Object.defineProperty(HTMLElement.prototype, 'releasePointerCapture', {
        configurable: true,
        value: ORIGINAL_RELEASE_POINTER_CAPTURE
      })
    }

    if (ORIGINAL_SET_POINTER_CAPTURE === undefined) {
      Reflect.deleteProperty(HTMLElement.prototype, 'setPointerCapture')
    } else {
      Object.defineProperty(HTMLElement.prototype, 'setPointerCapture', {
        configurable: true,
        value: ORIGINAL_SET_POINTER_CAPTURE
      })
    }
  })

  it('UC-001 - exports one preassembled component with the Base UI Root public prop surface', () => {
    expect(ScrollArea).toBeTypeOf('function')
    expect(ScrollArea).not.toHaveProperty('Root')
    expect(PACKAGE_EXPORTS.Components.ScrollArea).toBe(ScrollArea)
    expect(PACKAGE_EXPORTS.Ui.Components).toBe(PACKAGE_EXPORTS.Components)
    expect(PACKAGE_EXPORTS.Ui.Components.ScrollArea).toBe(ScrollArea)

    expectTypeOf<Omit<ScrollAreaProps, 'children'>>().toEqualTypeOf<
      Omit<BaseUiScrollArea.Root.Props, 'children'>
    >()
    expectTypeOf<ScrollAreaProps['children']>().toEqualTypeOf<ReactNode>()
    expect(SCROLL_AREA_OMITS_INTERNAL_PART_PROPS).toBe(true)
  })

  it('UC-001 / UC-005 / EX-001 - renders the documented vertical workout history with only its needed axis', async () => {
    viewportMetrics.scrollHeight = 640
    const sessions = Array.from({ length: 20 }, (_, index) => `Session ${index + 1}`)

    render(
      <ScrollArea className="h-48 w-80 border border-foreground" data-testid="workout-history">
        <ol className="m-0 grid list-decimal gap-3 p-4 pl-10">
          {sessions.map((session) => (
            <li key={session}>{session}</li>
          ))}
        </ol>
      </ScrollArea>
    )

    const root = screen.getByTestId('workout-history')

    await waitFor(() => expect(root).toHaveAttribute('data-has-overflow-y'))

    const viewport = getViewport(root)
    const verticalScrollbar = getScrollbar(root, 'vertical')

    expect(within(root).getAllByRole('listitem')).toHaveLength(20)
    expect(verticalScrollbar).toHaveAttribute('data-overflow-y-end')
    expect(queryScrollbar(root, 'horizontal')).toBeNull()
    expect(root).not.toHaveAttribute('data-has-overflow-x')
    expect(viewport).toHaveAttribute('tabindex', '0')
  })

  it.each([
    {
      label: 'horizontal overflow',
      metrics: { clientHeight: 160, clientWidth: 320, scrollHeight: 160, scrollWidth: 640 },
      tabIndex: '0',
      x: true,
      y: false
    },
    {
      label: 'dual-axis overflow',
      metrics: { clientHeight: 160, clientWidth: 320, scrollHeight: 640, scrollWidth: 640 },
      tabIndex: '0',
      x: true,
      y: true
    },
    {
      label: 'no overflow',
      metrics: { clientHeight: 160, clientWidth: 320, scrollHeight: 160, scrollWidth: 320 },
      tabIndex: '-1',
      x: false,
      y: false
    }
  ])('UC-001 - follows Base UI axis detection for $label', async ({ metrics, tabIndex, x, y }) => {
    viewportMetrics = metrics

    render(
      <ScrollArea data-testid="axis-contract">
        <div>Scrollable content</div>
      </ScrollArea>
    )

    const root = screen.getByTestId('axis-contract')
    const viewport = getViewport(root)

    await waitFor(() => expect(viewport).toHaveAttribute('tabindex', tabIndex))

    if (x) {
      expect(root).toHaveAttribute('data-has-overflow-x')
      expect(getScrollbar(root, 'horizontal')).toBeInTheDocument()
    } else {
      expect(root).not.toHaveAttribute('data-has-overflow-x')
      expect(queryScrollbar(root, 'horizontal')).toBeNull()
    }

    if (y) {
      expect(root).toHaveAttribute('data-has-overflow-y')
      expect(getScrollbar(root, 'vertical')).toBeInTheDocument()
    } else {
      expect(root).not.toHaveAttribute('data-has-overflow-y')
      expect(queryScrollbar(root, 'vertical')).toBeNull()
    }
  })

  it('UC-002 / UC-003 / EX-002 - exposes the documented dual-axis and corner states', async () => {
    viewportMetrics.scrollHeight = 640
    viewportMetrics.scrollWidth = 768

    render(
      <ScrollArea className="h-64 w-80 border border-foreground" data-testid="training-matrix">
        <div className="grid h-[40rem] w-[48rem] grid-cols-8 grid-rows-8 gap-px bg-foreground">
          {Array.from({ length: 64 }, (_, index) => (
            <div className="flex items-center justify-center bg-background" key={index}>
              {index + 1}
            </div>
          ))}
        </div>
      </ScrollArea>
    )

    const root = screen.getByTestId('training-matrix')

    await waitFor(() => {
      expect(root).toHaveAttribute('data-has-overflow-x')
      expect(root).toHaveAttribute('data-has-overflow-y')
    })

    const horizontalScrollbar = getScrollbar(root, 'horizontal')
    const verticalScrollbar = getScrollbar(root, 'vertical')
    const horizontalThumb = getThumb(horizontalScrollbar)
    const verticalThumb = getThumb(verticalScrollbar)
    const cornerVariables = root.style

    expect(within(root).getAllByText(/^\d+$/)).toHaveLength(64)
    expect(horizontalScrollbar).toHaveAttribute('data-orientation', 'horizontal')
    expect(verticalScrollbar).toHaveAttribute('data-orientation', 'vertical')
    expect(horizontalThumb).toHaveAttribute('data-orientation', 'horizontal')
    expect(verticalThumb).toHaveAttribute('data-orientation', 'vertical')
    expect(cornerVariables.getPropertyValue('--scroll-area-corner-height')).toBe('24px')
    expect(cornerVariables.getPropertyValue('--scroll-area-corner-width')).toBe('24px')
  })

  it('UC-004 - exposes the idle and hover interaction states on both axes', async () => {
    viewportMetrics.scrollHeight = 640
    viewportMetrics.scrollWidth = 768

    render(
      <ScrollArea data-testid="hover-scroll-area">
        <div>Dual-axis content</div>
      </ScrollArea>
    )

    const root = screen.getByTestId('hover-scroll-area')

    await waitFor(() => expect(root).toHaveAttribute('data-has-overflow-x'))

    const horizontalScrollbar = getScrollbar(root, 'horizontal')
    const verticalScrollbar = getScrollbar(root, 'vertical')

    for (const scrollbar of [horizontalScrollbar, verticalScrollbar]) {
      expect(scrollbar).not.toHaveAttribute('data-hovering')
      expect(scrollbar).not.toHaveAttribute('data-scrolling')
    }

    fireEvent.pointerEnter(root, { pointerType: 'mouse' })

    await waitFor(() => {
      expect(horizontalScrollbar).toHaveAttribute('data-hovering')
      expect(verticalScrollbar).toHaveAttribute('data-hovering')
    })

    fireEvent.pointerLeave(root, { pointerType: 'mouse' })

    await waitFor(() => {
      expect(horizontalScrollbar).not.toHaveAttribute('data-hovering')
      expect(verticalScrollbar).not.toHaveAttribute('data-hovering')
    })
  })

  it('UC-004 - keeps the active axis revealed for touch scrolling without hover', async () => {
    viewportMetrics.scrollHeight = 640

    render(
      <ScrollArea data-testid="touch-scroll-area">
        <div>Touch content</div>
      </ScrollArea>
    )

    const root = screen.getByTestId('touch-scroll-area')

    await waitFor(() => expect(root).toHaveAttribute('data-has-overflow-y'))

    const viewport = getViewport(root)
    const verticalScrollbar = getScrollbar(root, 'vertical')

    fireEvent.touchMove(viewport)
    viewport.scrollTop = 40
    fireEvent.scroll(viewport)

    await waitFor(() => {
      expect(root).toHaveAttribute('data-scrolling')
      expect(verticalScrollbar).toHaveAttribute('data-scrolling')
    })

    expect(verticalScrollbar).not.toHaveAttribute('data-hovering')
  })

  it('UC-004 / EX-002 - keeps a dragged thumb active after the pointer leaves and hides it after release', async () => {
    viewportMetrics.scrollHeight = 640

    render(
      <ScrollArea data-testid="drag-scroll-area">
        <div>Draggable content</div>
      </ScrollArea>
    )

    const root = screen.getByTestId('drag-scroll-area')

    await waitFor(() => expect(root).toHaveAttribute('data-has-overflow-y'))

    const verticalScrollbar = getScrollbar(root, 'vertical')
    const verticalThumb = getThumb(verticalScrollbar)

    fireEvent.pointerEnter(root, { pointerType: 'mouse' })
    fireEvent.pointerDown(verticalThumb, { button: 0, clientY: 24, pointerId: 1 })
    fireEvent.pointerMove(verticalThumb, { clientY: 48, pointerId: 1 })

    await waitFor(() => expect(verticalScrollbar).toHaveAttribute('data-scrolling'))

    fireEvent.pointerLeave(root, { pointerType: 'mouse' })

    await waitFor(() => expect(verticalScrollbar).not.toHaveAttribute('data-hovering'))
    expect(verticalScrollbar).toHaveAttribute('data-scrolling')

    fireEvent.pointerUp(verticalThumb, { button: 0, clientY: 48, pointerId: 1 })

    await waitFor(() => expect(verticalScrollbar).not.toHaveAttribute('data-scrolling'))
  })

  it('UC-005 - preserves focus and native keyboard scrolling while focus alone stays idle', async () => {
    viewportMetrics.scrollHeight = 640

    render(
      <ScrollArea data-testid="keyboard-scroll-area">
        <div>Keyboard content</div>
      </ScrollArea>
    )

    const root = screen.getByTestId('keyboard-scroll-area')

    await waitFor(() => expect(root).toHaveAttribute('data-has-overflow-y'))

    const viewport = getViewport(root)
    const verticalScrollbar = getScrollbar(root, 'vertical')

    viewport.focus()

    expect(viewport).toHaveFocus()
    expect(verticalScrollbar).not.toHaveAttribute('data-hovering')
    expect(verticalScrollbar).not.toHaveAttribute('data-scrolling')
    expect(fireEvent.keyDown(viewport, { key: 'PageDown' })).toBe(true)

    viewport.scrollTop = 96
    fireEvent.scroll(viewport)

    await waitFor(() => {
      expect(root).toHaveAttribute('data-scrolling')
      expect(root).toHaveAttribute('data-overflow-y-start')
      expect(verticalScrollbar).toHaveAttribute('data-scrolling')
    })
  })

  it('UC-001 - forwards Root render, native props, events, styles, classes, state, and refs', async () => {
    viewportMetrics.scrollHeight = 640
    const consumerRef = createRef<HTMLDivElement>()
    const renderRef = createRef<HTMLElement>()
    const onConsumerClick = vi.fn()
    const onRenderClick = vi.fn()

    render(
      <ScrollArea
        aria-label="Rendered scroll area"
        className="consumer-class"
        data-collision="consumer"
        data-consumer="scroll-area"
        onClick={onConsumerClick}
        ref={consumerRef}
        render={
          <section
            className="render-class"
            data-collision="render"
            onClick={onRenderClick}
            ref={renderRef}
            style={{ color: 'rgb(255, 255, 255)' }}
          />
        }
        style={{ backgroundColor: 'rgb(0, 0, 0)', color: 'rgb(0, 0, 0)' }}
      >
        Rendered content
      </ScrollArea>
    )

    const root = screen.getByLabelText('Rendered scroll area')

    await waitFor(() => expect(root).toHaveAttribute('data-has-overflow-y'))

    fireEvent.click(root)

    expect(root.tagName).toBe('SECTION')
    expect(root).toHaveClass('consumer-class', 'render-class')
    expect(root).toHaveAttribute('data-collision', 'render')
    expect(root).toHaveAttribute('data-consumer', 'scroll-area')
    expect(root).toHaveStyle({
      backgroundColor: 'rgb(0, 0, 0)',
      color: 'rgb(255, 255, 255)'
    })
    expect(root).toHaveTextContent('Rendered content')
    expect(onConsumerClick).toHaveBeenCalledOnce()
    expect(onRenderClick).toHaveBeenCalledOnce()
    expect(consumerRef.current).toBe(root)
    expect(renderRef.current).toBe(root)
  })

  it('UC-001 - forwards the complete Base UI Root state through callback render', async () => {
    viewportMetrics.scrollHeight = 640
    let latestState: BaseUiScrollArea.Root.State | undefined
    const renderRoot: Exclude<ScrollAreaProps['render'], ReactElement | undefined> = (
      props,
      state
    ) => {
      latestState = state

      return <section {...(props as ComponentPropsWithRef<'section'>)} />
    }

    render(
      <ScrollArea aria-label="Stateful rendered scroll area" render={renderRoot}>
        Rendered content
      </ScrollArea>
    )

    const root = screen.getByLabelText('Stateful rendered scroll area')

    await waitFor(() => expect(root).toHaveAttribute('data-has-overflow-y'))

    expect(latestState).toMatchObject({
      cornerHidden: true,
      hasOverflowX: false,
      hasOverflowY: true,
      overflowXEnd: false,
      overflowXStart: false,
      overflowYEnd: true,
      overflowYStart: false,
      scrolling: false
    })
  })

  it('UC-001 - applies overflowEdgeThreshold to the public Root edge states', async () => {
    viewportMetrics.scrollHeight = 640
    viewportMetrics.scrollWidth = 768

    render(
      <ScrollArea
        data-testid="threshold-scroll-area"
        overflowEdgeThreshold={{ xEnd: 20, xStart: 20, yEnd: 20, yStart: 20 }}
      >
        Threshold content
      </ScrollArea>
    )

    const root = screen.getByTestId('threshold-scroll-area')

    await waitFor(() => {
      expect(root).toHaveAttribute('data-overflow-x-end')
      expect(root).toHaveAttribute('data-overflow-y-end')
    })

    const viewport = getViewport(root)

    viewport.scrollLeft = 12
    viewport.scrollTop = 12
    fireEvent.scroll(viewport)

    expect(root).not.toHaveAttribute('data-overflow-x-start')
    expect(root).not.toHaveAttribute('data-overflow-y-start')

    viewport.scrollLeft = 24
    viewport.scrollTop = 24
    fireEvent.scroll(viewport)

    await waitFor(() => {
      expect(root).toHaveAttribute('data-overflow-x-start')
      expect(root).toHaveAttribute('data-overflow-y-start')
    })
  })

  it('UC-006 / EX-003 - preserves the public visibility states for reduced-motion consumer usage', async () => {
    viewportMetrics.scrollHeight = 640

    render(
      <ScrollArea
        className="h-40 w-72 border border-foreground"
        data-testid="reduced-motion-history"
      >
        <div className="grid gap-3 p-4">
          {Array.from({ length: 16 }, (_, index) => (
            <p className="m-0" key={index}>
              Training entry {index + 1}
            </p>
          ))}
        </div>
      </ScrollArea>
    )

    const root = screen.getByTestId('reduced-motion-history')

    await waitFor(() => expect(root).toHaveAttribute('data-has-overflow-y'))

    const verticalScrollbar = getScrollbar(root, 'vertical')

    expect(within(root).getAllByText(/^Training entry \d+$/)).toHaveLength(16)
    expect(verticalScrollbar).not.toHaveAttribute('data-hovering')
    expect(verticalScrollbar).not.toHaveAttribute('data-scrolling')

    fireEvent.pointerEnter(root, { pointerType: 'mouse' })

    await waitFor(() => expect(verticalScrollbar).toHaveAttribute('data-hovering'))

    fireEvent.pointerLeave(root, { pointerType: 'mouse' })

    await waitFor(() => expect(verticalScrollbar).not.toHaveAttribute('data-hovering'))
  })
})
