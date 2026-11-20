import { act, createEvent, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { useContext } from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { TilesRoot } from './TilesRoot'
import { TilesTile } from './TilesTile'
import { tilesRootContext } from '../constants/tilesRootContext'
import { type TilesLayout } from '../types/TilesTypes'

interface ResizeObserverRecord {
  callback: ResizeObserverCallback
  observedElement: Element | null
  observer: ResizeObserver
}

const RESPONSIVE_LAYOUT = {
  base: [['content']],
  sm: [['content']]
} as const satisfies TilesLayout<'content'>

const RETARGET_LAYOUT = {
  base: [['first'], ['second']],
  sm: [['second'], ['first']],
  xs: [['first', 'second']]
} as const satisfies TilesLayout<'first' | 'second'>

function CompletionProbe() {
  const context = useContext(tilesRootContext)

  return (
    <button type="button" onClick={() => context?.completeGeometryTransition('missing', 'left')}>
      Complete missing transition
    </button>
  )
}

describe('TilesRoot', () => {
  let matchMediaDescriptor: PropertyDescriptor | undefined
  let originalFontSize: string
  let originalResizeObserver: typeof ResizeObserver | undefined
  let resizeObservers: ResizeObserverRecord[]

  beforeEach(() => {
    matchMediaDescriptor = Object.getOwnPropertyDescriptor(window, 'matchMedia')
    originalFontSize = document.documentElement.style.fontSize
    originalResizeObserver = globalThis.ResizeObserver
    resizeObservers = []

    class TestResizeObserver implements ResizeObserver {
      readonly disconnect = vi.fn()
      readonly observe = vi.fn((element: Element) => {
        const record = resizeObservers.find(({ observer }) => observer === this)

        if (record !== undefined) {
          record.observedElement = element
        }
      })
      readonly unobserve = vi.fn()

      constructor(callback: ResizeObserverCallback) {
        resizeObservers.push({ callback, observedElement: null, observer: this })
      }
    }

    globalThis.ResizeObserver = TestResizeObserver
    Object.defineProperty(window, 'matchMedia', {
      configurable: true,
      value: vi.fn(
        (query: string): MediaQueryList =>
          ({
            addEventListener: vi.fn(),
            addListener: vi.fn(),
            dispatchEvent: vi.fn(() => true),
            matches: false,
            media: query,
            onchange: null,
            removeEventListener: vi.fn(),
            removeListener: vi.fn()
          }) as MediaQueryList
      )
    })
  })

  afterEach(() => {
    document.documentElement.style.fontSize = originalFontSize

    if (originalResizeObserver === undefined) {
      Reflect.deleteProperty(globalThis, 'ResizeObserver')
    } else {
      globalThis.ResizeObserver = originalResizeObserver
    }

    if (matchMediaDescriptor === undefined) {
      Reflect.deleteProperty(window, 'matchMedia')
    } else {
      Object.defineProperty(window, 'matchMedia', matchMediaDescriptor)
    }
  })

  it('uses the document root font size to resolve rem container thresholds', async () => {
    document.documentElement.style.fontSize = '10px'

    render(
      <TilesRoot layout={RESPONSIVE_LAYOUT} data-testid="root" style={{ height: '10rem' }}>
        <TilesTile area="content">Content</TilesTile>
      </TilesRoot>
    )

    const root = screen.getByTestId('root')
    const record = resizeObservers.find(({ observedElement }) => observedElement === root)
    const contentBoxSize = [{ blockSize: 100, inlineSize: 240 }] as ResizeObserverSize[]

    act(() => {
      record?.callback(
        [
          {
            borderBoxSize: contentBoxSize,
            contentBoxSize,
            contentRect: new DOMRect(0, 0, 240, 100),
            devicePixelContentBoxSize: contentBoxSize,
            target: root
          } as ResizeObserverEntry
        ],
        record.observer
      )
    })

    await waitFor(() => expect(root).toHaveAttribute('data-layout', 'sm'))
  })

  it('commits a newly keyed area immediately when the layout configuration is replaced', async () => {
    const firstLayout = { base: [['first']] } as const satisfies TilesLayout<'first'>
    const secondLayout = { base: [['second']] } as const satisfies TilesLayout<'second'>
    const rendered = render(
      <TilesRoot layout={firstLayout} data-testid="root" style={{ height: '10rem' }}>
        <TilesTile area="first" key="first">
          First
        </TilesTile>
      </TilesRoot>
    )
    const root = screen.getByTestId('root')
    const firstRecord = resizeObservers.find(({ observedElement }) => observedElement === root)
    const contentBoxSize = [{ blockSize: 100, inlineSize: 100 }] as ResizeObserverSize[]

    act(() => {
      firstRecord?.callback(
        [
          {
            borderBoxSize: contentBoxSize,
            contentBoxSize,
            contentRect: new DOMRect(0, 0, 100, 100),
            devicePixelContentBoxSize: contentBoxSize,
            target: root
          } as ResizeObserverEntry
        ],
        firstRecord.observer
      )
    })

    rendered.rerender(
      <TilesRoot layout={secondLayout} data-testid="root" style={{ height: '10rem' }}>
        <TilesTile area="second" key="second">
          Second
        </TilesTile>
      </TilesRoot>
    )

    const secondRecord = resizeObservers[resizeObservers.length - 1] as ResizeObserverRecord

    act(() => {
      secondRecord?.callback(
        [
          {
            borderBoxSize: contentBoxSize,
            contentBoxSize,
            contentRect: new DOMRect(0, 0, 100, 100),
            devicePixelContentBoxSize: contentBoxSize,
            target: root
          } as ResizeObserverEntry
        ],
        secondRecord.observer
      )
    })

    const secondTile = screen.getByText('Second')

    await waitFor(() => expect(secondTile).not.toHaveAttribute('data-moving'))
  })

  it('ignores cancellation from an interrupted target until the replacement transitions settle', async () => {
    render(
      <TilesRoot layout={RETARGET_LAYOUT} data-testid="root" style={{ height: '10rem' }}>
        <TilesTile area="first">
          First
          <CompletionProbe />
        </TilesTile>
        <TilesTile area="second">Second</TilesTile>
      </TilesRoot>
    )

    const root = screen.getByTestId('root')
    const record = resizeObservers.find(({ observedElement }) => observedElement === root)
    const tiles = Array.from(root.querySelectorAll<HTMLElement>('[data-area]'))

    function notifyResize(width: number) {
      const contentBoxSize = [{ blockSize: 100, inlineSize: width }] as ResizeObserverSize[]

      act(() => {
        record?.callback(
          [
            {
              borderBoxSize: contentBoxSize,
              contentBoxSize,
              contentRect: new DOMRect(0, 0, width, 100),
              devicePixelContentBoxSize: contentBoxSize,
              target: root
            } as ResizeObserverEntry
          ],
          record.observer
        )
      })
    }

    function dispatchTransition(
      tile: HTMLElement,
      type: 'transitioncancel' | 'transitionend' | 'transitionrun',
      propertyName: string
    ) {
      const event =
        type === 'transitioncancel'
          ? createEvent.transitionCancel(tile)
          : type === 'transitionend'
            ? createEvent.transitionEnd(tile)
            : createEvent.transitionRun(tile)

      Object.defineProperty(event, 'propertyName', { value: propertyName })
      fireEvent(tile, event)
    }

    notifyResize(300)
    await waitFor(() => expect(root).toHaveAttribute('data-layout', 'base'))

    notifyResize(350)
    await waitFor(() => expect(root).toHaveAttribute('data-layout', 'xs'))

    act(() => {
      for (const tile of tiles) {
        for (const propertyName of ['left', 'top', 'width', 'height']) {
          dispatchTransition(tile, 'transitionrun', propertyName)
        }
      }
    })

    notifyResize(400)
    await waitFor(() => expect(root).toHaveAttribute('data-layout', 'sm'))

    act(() => {
      for (const tile of tiles) {
        for (const propertyName of ['left', 'top', 'width', 'height']) {
          dispatchTransition(tile, 'transitioncancel', propertyName)
        }
      }
    })

    expect(root).toHaveAttribute('data-animating')

    act(() => {
      for (const tile of tiles) {
        for (const propertyName of ['left', 'top', 'width', 'height']) {
          dispatchTransition(tile, 'transitionrun', propertyName)
          dispatchTransition(tile, 'transitionend', propertyName)
        }
      }
    })

    await waitFor(() => expect(root).not.toHaveAttribute('data-animating'))

    fireEvent.click(screen.getByRole('button', { name: 'Complete missing transition' }))
  })
})
