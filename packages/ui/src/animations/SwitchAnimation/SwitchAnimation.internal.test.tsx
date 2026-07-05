import { act, render } from '@testing-library/react'
import { type CSSProperties } from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import {
  getSwitchAnimationPixelSum,
  getSwitchAnimationTransforms
} from './constants/switchAnimationConstants'
import { SwitchAnimation } from './SwitchAnimation'

describe('SwitchAnimation implementation', () => {
  let changeListener: ((event: MediaQueryListEvent) => void) | undefined
  let matches: boolean

  beforeEach(() => {
    matches = false
    vi.stubGlobal(
      'matchMedia',
      vi.fn(
        () =>
          ({
            addEventListener: vi.fn((eventName, listener) => {
              if (eventName === 'change') {
                changeListener = listener as (event: MediaQueryListEvent) => void
              }
            }),
            addListener: vi.fn(),
            dispatchEvent: vi.fn(() => true),
            get matches() {
              return matches
            },
            media: '(prefers-reduced-motion: reduce)',
            onchange: null,
            removeEventListener: vi.fn(),
            removeListener: vi.fn()
          }) as MediaQueryList
      )
    )
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('reconciles fallback variables with consumer styles and reduced motion', () => {
    const { container, rerender } = render(
      <SwitchAnimation>
        <span key="initial">initial</span>
      </SwitchAnimation>
    )
    const root = container.querySelector<HTMLElement>('[data-motion="switch"]') as HTMLElement

    expect(root.style.getPropertyValue('--switch-animation-duration')).toBe('200ms')

    rerender(
      <SwitchAnimation style={{ '--switch-animation-duration': '320ms' } as CSSProperties}>
        <span key="initial">initial</span>
      </SwitchAnimation>
    )

    expect(root.style.getPropertyValue('--switch-animation-duration')).toBe('320ms')

    act(() => {
      matches = true
      changeListener?.({ matches: true } as MediaQueryListEvent)
    })

    expect(root.style.getPropertyValue('--switch-animation-distance')).toBe('0px')
    expect(root.style.getPropertyValue('--switch-animation-duration')).toBe('0ms')
    expect(root.style.getPropertyValue('--switch-animation-easing')).toBe('ease-in-out')
    expect(root.style.getPropertyValue('--switch-animation-stagger')).toBe('0ms')
  })

  it('positions leaving overlays against the root positioning context', () => {
    const clientRect = {} as DOMRect
    const clientRects = {
      0: clientRect,
      [Symbol.iterator]: () => [clientRect][Symbol.iterator](),
      item: (index: number) => (index === 0 ? clientRect : null),
      length: 1
    } satisfies DOMRectList
    const clientRectsSpy = vi
      .spyOn(HTMLElement.prototype, 'getClientRects')
      .mockReturnValue(clientRects)
    const { container, rerender } = render(
      <SwitchAnimation contentMode="phrasing">
        <span key="first" data-testid="first-content">
          first
        </span>
      </SwitchAnimation>
    )

    rerender(
      <SwitchAnimation contentMode="phrasing">
        <span key="second">second</span>
      </SwitchAnimation>
    )

    const root = container.querySelector<HTMLElement>('[data-motion="switch"]') as HTMLElement
    const leavingContent = container.querySelector<HTMLElement>('[data-testid="first-content"]')
    const leavingItem = leavingContent?.parentElement as HTMLElement
    const slot = leavingItem.parentElement as HTMLElement

    expect(root).toHaveStyle({ position: 'relative' })
    expect(slot).toHaveStyle({ position: 'static' })
    expect(leavingItem).toHaveStyle({ position: 'absolute' })

    clientRectsSpy.mockRestore()
  })

  it('absolutizes sibling leaving boxes before target layout measurement', () => {
    const rect = {
      bottom: 24,
      height: 24,
      left: 0,
      right: 100,
      toJSON: () => ({}),
      top: 0,
      width: 100,
      x: 0,
      y: 0
    } as DOMRect
    const clientRects = {
      0: rect,
      [Symbol.iterator]: () => [rect][Symbol.iterator](),
      item: (index: number) => (index === 0 ? rect : null),
      length: 1
    } satisfies DOMRectList
    const siblingMeasurementStates: boolean[] = []
    const clientRectsSpy = vi
      .spyOn(HTMLElement.prototype, 'getClientRects')
      .mockReturnValue(clientRects)
    const rectSpy = vi
      .spyOn(HTMLElement.prototype, 'getBoundingClientRect')
      .mockImplementation(function (this: HTMLElement) {
        const firstIncoming = document.querySelector('[data-testid="first-incoming"]')
        const secondIncoming = document.querySelector('[data-testid="second-incoming"]')

        if (
          this.matches('[data-motion="switch"]') &&
          firstIncoming !== null &&
          secondIncoming !== null
        ) {
          const firstLeaving = document.querySelector('[data-testid="first-leaving"]')
            ?.parentElement as HTMLElement
          const secondLeaving = document.querySelector('[data-testid="second-leaving"]')
            ?.parentElement as HTMLElement

          siblingMeasurementStates.push(
            firstLeaving.style.position === 'absolute' &&
              secondLeaving.style.position === 'absolute'
          )
        }

        return rect
      })
    const { rerender } = render(
      <div>
        <SwitchAnimation>
          <span key="first-a" data-testid="first-leaving">
            first leaving
          </span>
        </SwitchAnimation>
        <SwitchAnimation>
          <span key="second-a" data-testid="second-leaving">
            second leaving
          </span>
        </SwitchAnimation>
      </div>
    )

    rerender(
      <div>
        <SwitchAnimation>
          <span key="first-b" data-testid="first-incoming">
            first incoming
          </span>
        </SwitchAnimation>
        <SwitchAnimation>
          <span key="second-b" data-testid="second-incoming">
            second incoming
          </span>
        </SwitchAnimation>
      </div>
    )

    expect(siblingMeasurementStates.length).toBeGreaterThan(0)
    expect(siblingMeasurementStates).not.toContain(false)

    rectSpy.mockRestore()
    clientRectsSpy.mockRestore()
  })

  it('starts a replacement from the last settled root size', () => {
    const createRect = (width: number) =>
      ({
        bottom: 24,
        height: 24,
        left: 0,
        right: width,
        toJSON: () => ({}),
        top: 0,
        width,
        x: 0,
        y: 0
      }) as DOMRect
    const rectSpy = vi
      .spyOn(HTMLElement.prototype, 'getBoundingClientRect')
      .mockImplementation(function (this: HTMLElement) {
        const sizes = Array.from(this.querySelectorAll<HTMLElement>('[data-switch-size]')).map(
          (element) => element.dataset.switchSize
        )
        const ownSize = this.dataset.switchSize
        const presentSizes = new Set([ownSize, ...sizes].filter(Boolean))

        if (presentSizes.has('first') && presentSizes.has('second')) return createRect(190)
        if (presentSizes.has('second')) return createRect(110)
        if (presentSizes.has('first')) return createRect(80)

        return createRect(0)
      })
    let root: HTMLElement
    let widthAtChange = ''
    const { container, rerender } = render(
      <SwitchAnimation
        contentMode="phrasing"
        onSwitchChange={() => {
          widthAtChange = root.style.width
        }}
      >
        <span data-switch-size="first" key="first">
          first
        </span>
      </SwitchAnimation>
    )

    root = container.querySelector<HTMLElement>('[data-motion="switch"]') as HTMLElement

    rerender(
      <SwitchAnimation
        contentMode="phrasing"
        onSwitchChange={() => {
          widthAtChange = root.style.width
        }}
      >
        <span data-switch-size="second" key="second">
          second
        </span>
      </SwitchAnimation>
    )

    expect(widthAtChange).toBe('80px')

    rectSpy.mockRestore()
  })

  it('builds every direction from one captured distance', () => {
    expect(getSwitchAnimationTransforms('down', '24px')).toEqual({
      entering: 'translateY(calc(-1 * 24px))',
      leaving: 'translateY(24px)'
    })
    expect(getSwitchAnimationTransforms('up', '24px')).toEqual({
      entering: 'translateY(24px)',
      leaving: 'translateY(calc(-1 * 24px))'
    })
    expect(getSwitchAnimationTransforms('right', '24px')).toEqual({
      entering: 'translateX(calc(-1 * 24px))',
      leaving: 'translateX(24px)'
    })
    expect(getSwitchAnimationTransforms('left', '24px')).toEqual({
      entering: 'translateX(24px)',
      leaving: 'translateX(calc(-1 * 24px))'
    })
  })

  it('sums computed composed-root edges', () => {
    expect(getSwitchAnimationPixelSum('1px', '2.5px', '', 'normal')).toBe(3.5)
  })
})
