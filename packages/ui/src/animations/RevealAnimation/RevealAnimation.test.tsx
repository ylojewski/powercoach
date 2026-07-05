import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { useState, type ComponentPropsWithRef, type ReactElement, type ReactNode } from 'react'
import { afterEach, describe, expect, expectTypeOf, it, vi } from 'vitest'

import * as PackageExports from '../..'
import {
  type RevealAnimationContentMode,
  type RevealAnimationDirection,
  type RevealAnimationUnrevealBehavior
} from '../..'
import { Button as LocalButton } from '../../components/Button'

interface RevealAnimationPackageContract {
  Button: typeof LocalButton
  RevealAnimation: (props: RevealAnimationProps) => ReactElement | null
}

interface RevealAnimationProps {
  alignX?: 'start' | 'center' | 'end'
  alignY?: 'start' | 'center' | 'end'
  children?: ReactNode
  contentMode?: RevealAnimationContentMode
  direction?: RevealAnimationDirection
  offsetX?: number
  offsetY?: number
  onRevealChange?: (revealed: boolean) => void
  onRevealComplete?: (revealed: boolean) => void
  onRevealStart?: (revealed: boolean) => void
  render: ReactElement
  reveal?: boolean
  scale?: number
  unrevealBehavior?: RevealAnimationUnrevealBehavior
}

type ObservedCustomRevealSurfaceProps = ComponentPropsWithRef<'section'> & Record<string, unknown>

interface CustomRevealSurfaceProps extends ComponentPropsWithRef<'section'> {
  observeProps: (props: ObservedCustomRevealSurfaceProps) => void
}

const PACKAGE_EXPORTS = PackageExports as typeof PackageExports & RevealAnimationPackageContract
const Button = PACKAGE_EXPORTS.Button
const RevealAnimation = PACKAGE_EXPORTS.RevealAnimation

const REVEAL_DIRECTIONS = [
  {
    direction: 'left-to-right',
    hiddenClipPath: 'inset(0 100% 0 0)',
    label: 'left to right',
    oppositeHiddenClipPath: 'inset(0 0 0 100%)',
    revealedClipPath: 'inset(0 0 0 0)'
  },
  {
    direction: 'right-to-left',
    hiddenClipPath: 'inset(0 0 0 100%)',
    label: 'right to left',
    oppositeHiddenClipPath: 'inset(0 100% 0 0)',
    revealedClipPath: 'inset(0 0 0 0)'
  },
  {
    direction: 'top-to-bottom',
    hiddenClipPath: 'inset(0 0 100% 0)',
    label: 'top to bottom',
    oppositeHiddenClipPath: 'inset(100% 0 0 0)',
    revealedClipPath: 'inset(0 0 0 0)'
  },
  {
    direction: 'bottom-to-top',
    hiddenClipPath: 'inset(100% 0 0 0)',
    label: 'bottom to top',
    oppositeHiddenClipPath: 'inset(0 0 100% 0)',
    revealedClipPath: 'inset(0 0 0 0)'
  },
  {
    direction: 'diagonal-45-to-135',
    hiddenClipPath:
      'polygon(0 0, 0 0, calc(0px - var(--reveal-height)) 100%, calc(0px - var(--reveal-height)) 100%)',
    label: 'diagonal 45 to 135',
    oppositeHiddenClipPath:
      'polygon(calc(100% + var(--reveal-height)) 0, calc(100% + var(--reveal-height)) 0, 100% 100%, 100% 100%)',
    revealedClipPath:
      'polygon(0 0, calc(100% + var(--reveal-height)) 0, 100% 100%, calc(0px - var(--reveal-height)) 100%)'
  }
] as const

const DEFAULT_REVEAL_DIRECTION = REVEAL_DIRECTIONS[4]
const REVEAL_TRANSITION_DURATION_MS = 300
const REVEAL_TRANSITION_EASING = 'cubic-bezier(0.4, 0, 0.2, 1)'
const REVEAL_TRANSITION_PROPERTY = 'clip-path'

function CustomRevealSurface({ observeProps, ...props }: CustomRevealSurfaceProps): ReactElement {
  observeProps(props as ObservedCustomRevealSurfaceProps)

  return <section {...props} />
}

function ControlledButtonRevealProbe() {
  const [completeMessage, setCompleteMessage] = useState('idle')
  const [revealed, setRevealed] = useState(false)
  const [startMessage, setStartMessage] = useState('idle')
  const [stateMessage, setStateMessage] = useState('idle')
  const [unrevealBehavior, setUnrevealBehavior] =
    useState<RevealAnimationUnrevealBehavior>('return')

  return (
    <div>
      <label>
        <input
          checked={revealed}
          onChange={(event) => setRevealed(event.currentTarget.checked)}
          type="checkbox"
        />
        reveal
      </label>
      <label>
        unreveal behavior
        <select
          onChange={(event) =>
            setUnrevealBehavior(event.currentTarget.value as RevealAnimationUnrevealBehavior)
          }
          value={unrevealBehavior}
        >
          <option value="return">return</option>
          <option value="continue">continue</option>
        </select>
      </label>
      <RevealAnimation
        onRevealChange={(nextRevealed) => setStateMessage(nextRevealed ? 'revealed' : 'hidden')}
        onRevealComplete={(nextRevealed) =>
          setCompleteMessage(nextRevealed ? 'complete revealed' : 'complete hidden')
        }
        onRevealStart={(nextRevealed) => setStartMessage(nextRevealed ? 'revealing' : 'hiding')}
        render={<Button />}
        reveal={revealed}
        unrevealBehavior={unrevealBehavior}
      >
        controlled reveal
      </RevealAnimation>
      <output aria-label="state">{stateMessage}</output>
      <output aria-label="start">{startMessage}</output>
      <output aria-label="complete">{completeMessage}</output>
      <output aria-label="configured unreveal behavior">{unrevealBehavior}</output>
    </div>
  )
}

function getRevealRoot(container: HTMLElement): HTMLElement {
  const root = container.querySelector<HTMLElement>('[data-reveal-root]')

  expect(root).toBeInTheDocument()

  return root as HTMLElement
}

function getRevealOverlay(container: HTMLElement): HTMLElement {
  const overlay = container.querySelector<HTMLElement>('[data-reveal-overlay]')

  expect(overlay).toBeInTheDocument()

  return overlay as HTMLElement
}

function getRevealCopy(container: HTMLElement): HTMLElement {
  const copy = container.querySelector<HTMLElement>('[data-reveal-copy]')

  expect(copy).toBeInTheDocument()

  return copy as HTMLElement
}

function getRevealCopyScale(container: HTMLElement): HTMLElement {
  const copyScale = container.querySelector<HTMLElement>('[data-reveal-copy-scale]')

  expect(copyScale).toBeInTheDocument()

  return copyScale as HTMLElement
}

function getCssClipPath(element: HTMLElement): string {
  return element.style.clipPath || getComputedStyle(element).clipPath
}

function getCssTransform(element: HTMLElement): string {
  return element.style.transform || getComputedStyle(element).transform
}

function getCssTransitionDuration(element: HTMLElement): string {
  return element.style.transitionDuration || getComputedStyle(element).transitionDuration
}

function getCssTransitionProperty(element: HTMLElement): string {
  return element.style.transitionProperty || getComputedStyle(element).transitionProperty
}

function getCssTransitionTimingFunction(element: HTMLElement): string {
  return (
    element.style.transitionTimingFunction || getComputedStyle(element).transitionTimingFunction
  )
}

function parseCssList(value: string): string[] {
  const parts: string[] = []
  let currentPart = ''
  let functionDepth = 0

  for (const character of value) {
    if (character === '(') {
      functionDepth += 1
    } else if (character === ')') {
      functionDepth = Math.max(0, functionDepth - 1)
    }

    if (character === ',' && functionDepth === 0) {
      const part = currentPart.trim()

      if (part) {
        parts.push(part)
      }

      currentPart = ''
      continue
    }

    currentPart += character
  }

  const finalPart = currentPart.trim()

  if (finalPart) {
    parts.push(finalPart)
  }

  return parts
}

function parseCssDurationMs(value: string): number {
  if (value.endsWith('ms')) {
    return Number.parseFloat(value)
  }

  if (value.endsWith('s')) {
    return Number.parseFloat(value) * 1000
  }

  return Number.NaN
}

function expectClipPath(element: HTMLElement, clipPath: string) {
  expect(getCssClipPath(element)).toBe(clipPath)
}

function expectRevealCssTransition(element: HTMLElement) {
  const transitionProperties = parseCssList(getCssTransitionProperty(element))
  const transitionDurations = parseCssList(getCssTransitionDuration(element)).map(
    parseCssDurationMs
  )
  const transitionTimingFunctions = parseCssList(getCssTransitionTimingFunction(element))

  expect(transitionProperties).toContain(REVEAL_TRANSITION_PROPERTY)
  expect(transitionDurations).toContain(REVEAL_TRANSITION_DURATION_MS)
  expect(transitionTimingFunctions).toContain(REVEAL_TRANSITION_EASING)
}

describe('RevealAnimation', () => {
  beforeEach(() => {
    document.body.className = ''
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('UC-001 / EX-001 / CR-001 - renders the duplicated default Button surface contract', () => {
    const { container } = render(
      <RevealAnimation render={<Button />}>start workout</RevealAnimation>
    )

    const root = getRevealRoot(container)
    const realSurface = container.querySelector<HTMLElement>('[data-reveal-surface]')
    const overlay = getRevealOverlay(container)
    const overlaySurface = container.querySelector<HTMLElement>('[data-reveal-overlay-surface]')
    const source = container.querySelector<HTMLElement>('[data-reveal-source]')
    const copy = getRevealCopy(container)
    const copyScale = getRevealCopyScale(container)
    const button = screen.getByRole('button', { name: 'start workout' })

    expect(root).toHaveAttribute('data-motion', 'reveal')
    expect(root).toHaveAttribute('data-content-mode', 'flow')
    expect(root.tagName).toBe('DIV')
    expect(realSurface).toBeInTheDocument()
    expect(realSurface?.tagName).toBe('DIV')
    expect(overlay.tagName).toBe('DIV')
    expect(overlaySurface).toBeInTheDocument()
    expect(source).toHaveTextContent('start workout')
    expect(copy).toHaveTextContent('start workout')
    expect(copyScale).toHaveTextContent('start workout')
    expect(within(realSurface as HTMLElement).getByRole('button', { name: 'start workout' })).toBe(
      button
    )
    expect(overlay).toHaveAttribute('aria-hidden', 'true')
    expect(overlay).toHaveAttribute('inert')
    expect(overlay).toHaveStyle({ pointerEvents: 'none' })
  })

  it('UC-001 / CR-001 - duplicates a conforming custom element surface with only documented reveal differences', () => {
    const attachedSurfaces = new Set<HTMLElement>()
    const receivedProps: ObservedCustomRevealSurfaceProps[] = []
    const children = <span data-custom-content="">custom surface content</span>
    const { container } = render(
      <RevealAnimation
        render={
          <CustomRevealSurface
            aria-label="Custom reveal surface"
            className="consumer-custom-surface"
            data-consumer-surface="preserved"
            observeProps={(props) => receivedProps.push(props)}
            ref={(node) => {
              if (node) {
                attachedSurfaces.add(node)
              }
            }}
            style={{ color: 'rgb(1, 2, 3)' }}
          />
        }
      >
        {children}
      </RevealAnimation>
    )

    const surfaces = container.querySelectorAll<HTMLElement>(
      'section[data-consumer-surface="preserved"]'
    )
    const realSurface = surfaces[0]
    const decorativeSurface = surfaces[1]
    const decorativeProps = receivedProps.find((props) => 'data-reveal-overlay-surface' in props)
    const realProps = receivedProps.find((props) => !('data-reveal-overlay-surface' in props))

    expect(surfaces).toHaveLength(2)
    expect(attachedSurfaces.size).toBe(2)
    for (const surface of surfaces) {
      expect(surface).toHaveClass('consumer-custom-surface')
      expect(surface).toHaveAttribute('aria-label', 'Custom reveal surface')
      expect(surface).toHaveStyle({ color: 'rgb(1, 2, 3)' })
      expect(surface).toHaveTextContent('custom surface content')
      expect(surface.querySelectorAll('[data-custom-content]')).toHaveLength(1)
    }
    expect(realSurface).not.toHaveAttribute('data-reveal-overlay-surface')
    expect(decorativeSurface).toHaveAttribute('data-reveal-overlay-surface')
    expect(realProps).not.toHaveProperty('nativeButton')
    expect(realProps).not.toHaveProperty('render')
    expect(decorativeProps).not.toHaveProperty('nativeButton')
    expect(decorativeProps).not.toHaveProperty('render')
  })

  it('UC-002 / EX-001 - reveals from hover and keyboard focus on the real default Button', () => {
    const { container } = render(
      <RevealAnimation render={<Button />}>start workout</RevealAnimation>
    )

    const overlay = getRevealOverlay(container)
    const button = screen.getByRole('button', { name: 'start workout' })

    expectClipPath(overlay, DEFAULT_REVEAL_DIRECTION.hiddenClipPath)

    fireEvent.mouseEnter(button)

    expectClipPath(overlay, DEFAULT_REVEAL_DIRECTION.revealedClipPath)
    expectRevealCssTransition(overlay)

    fireEvent.focus(button)
    fireEvent.mouseLeave(button)

    expect(button).toHaveFocus()
    expectClipPath(overlay, DEFAULT_REVEAL_DIRECTION.revealedClipPath)

    fireEvent.blur(button)

    expectClipPath(overlay, DEFAULT_REVEAL_DIRECTION.hiddenClipPath)
  })

  it('UC-002 / EX-001 - ignores pointer-created DOM focus after hover leaves', () => {
    const { container } = render(
      <RevealAnimation render={<Button />}>start workout</RevealAnimation>
    )

    const overlay = getRevealOverlay(container)
    const button = screen.getByRole('button', { name: 'start workout' })

    fireEvent.mouseEnter(button)

    expectClipPath(overlay, DEFAULT_REVEAL_DIRECTION.revealedClipPath)

    fireEvent.pointerDown(button)
    fireEvent.focus(button)
    fireEvent.click(button)

    expect(button).toHaveFocus()

    fireEvent.mouseLeave(button)

    expect(button).toHaveFocus()
    expectClipPath(overlay, DEFAULT_REVEAL_DIRECTION.hiddenClipPath)
  })

  it('UC-003 / EX-001 - keeps the duplicated Button surface inert while only the real Button is accessible and interactive', () => {
    const { container } = render(
      <RevealAnimation render={<Button />}>start workout</RevealAnimation>
    )

    const overlay = getRevealOverlay(container)
    const button = screen.getByRole('button', { name: 'start workout' })
    const decorativeButton = overlay.querySelector('button')

    fireEvent.click(button)
    fireEvent.focus(button)

    expect(screen.getAllByRole('button', { name: 'start workout' })).toHaveLength(1)
    expect(decorativeButton).toBeInTheDocument()
    expect(decorativeButton).toHaveTextContent('start workout')
    expect(within(overlay).queryByRole('button', { name: 'start workout' })).not.toBeInTheDocument()
    expect(button).toHaveFocus()
    expect(overlay).toHaveAttribute('aria-hidden', 'true')
    expect(overlay).toHaveAttribute('inert')
    expect(overlay).toHaveStyle({ pointerEvents: 'none' })
  })

  it('UC-004 / EX-001 / EX-002 - defaults to the diagonal and maps explicit direction variants to the documented clip-path reveal states', () => {
    const onRevealStart = vi.fn()
    const directionProbe = render(
      <RevealAnimation onRevealStart={onRevealStart} render={<Button />}>
        direction check
      </RevealAnimation>
    )

    expectClipPath(
      getRevealOverlay(directionProbe.container),
      DEFAULT_REVEAL_DIRECTION.hiddenClipPath
    )

    directionProbe.rerender(
      <RevealAnimation direction="left-to-right" onRevealStart={onRevealStart} render={<Button />}>
        direction check
      </RevealAnimation>
    )

    expectClipPath(getRevealOverlay(directionProbe.container), REVEAL_DIRECTIONS[0].hiddenClipPath)
    expect(onRevealStart).not.toHaveBeenCalled()

    directionProbe.rerender(
      <RevealAnimation direction="right-to-left" onRevealStart={onRevealStart} render={<Button />}>
        direction check
      </RevealAnimation>
    )

    expectClipPath(getRevealOverlay(directionProbe.container), REVEAL_DIRECTIONS[1].hiddenClipPath)
    expect(onRevealStart).not.toHaveBeenCalled()

    directionProbe.unmount()

    const { container, rerender } = render(
      <div>
        {REVEAL_DIRECTIONS.map(({ direction, label }) => (
          <RevealAnimation direction={direction} key={direction} render={<Button />}>
            {label}
          </RevealAnimation>
        ))}
      </div>
    )

    for (const { hiddenClipPath, label } of REVEAL_DIRECTIONS) {
      const button = screen.getByRole('button', { name: label })
      const root = button.closest('[data-reveal-root]')
      const overlay = root?.querySelector<HTMLElement>('[data-reveal-overlay]')

      expect(overlay).toBeInTheDocument()
      expectClipPath(overlay as HTMLElement, hiddenClipPath)
    }

    rerender(
      <div>
        {REVEAL_DIRECTIONS.map(({ direction, label }) => (
          <RevealAnimation direction={direction} key={direction} render={<Button />} reveal>
            {label}
          </RevealAnimation>
        ))}
      </div>
    )

    for (const { label, revealedClipPath } of REVEAL_DIRECTIONS) {
      const button = screen.getByRole('button', { name: label })
      const root = button.closest('[data-reveal-root]')
      const overlay = root?.querySelector<HTMLElement>('[data-reveal-overlay]')

      expect(overlay).toBeInTheDocument()
      expectClipPath(overlay as HTMLElement, revealedClipPath)
      expectRevealCssTransition(overlay as HTMLElement)
    }

    expect(container.querySelectorAll('[data-motion="reveal"]')).toHaveLength(
      REVEAL_DIRECTIONS.length
    )
  })

  it('UC-004 / EX-002 - publishes diagonal height before reveal and updates geometry without lifecycle callbacks', async () => {
    const resizeCallbacks: ResizeObserverCallback[] = []
    const onRevealChange = vi.fn()
    const onRevealComplete = vi.fn()
    const onRevealStart = vi.fn()

    class TestResizeObserver implements ResizeObserver {
      constructor(callback: ResizeObserverCallback) {
        resizeCallbacks.push(callback)
      }

      disconnect() {
        return undefined
      }

      observe() {
        return undefined
      }

      unobserve() {
        return undefined
      }
    }

    vi.stubGlobal('ResizeObserver', TestResizeObserver)

    const { container, rerender } = render(
      <RevealAnimation
        direction="diagonal-45-to-135"
        onRevealChange={onRevealChange}
        onRevealComplete={onRevealComplete}
        onRevealStart={onRevealStart}
        render={<Button />}
        reveal={false}
      >
        diagonal geometry
      </RevealAnimation>
    )

    const overlay = getRevealOverlay(container)
    let overlayHeight = 48

    vi.spyOn(overlay, 'getBoundingClientRect').mockImplementation(
      () =>
        ({
          bottom: overlayHeight,
          height: overlayHeight,
          left: 0,
          right: 160,
          toJSON: () => ({}),
          top: 0,
          width: 160,
          x: 0,
          y: 0
        }) as DOMRect
    )
    Object.defineProperty(overlay, 'offsetHeight', {
      configurable: true,
      get: () => overlayHeight
    })

    resizeCallbacks[0]?.(
      [
        {
          borderBoxSize: [{ blockSize: overlayHeight, inlineSize: 160 }],
          contentBoxSize: [{ blockSize: overlayHeight, inlineSize: 160 }],
          contentRect: overlay.getBoundingClientRect(),
          devicePixelContentBoxSize: [{ blockSize: overlayHeight, inlineSize: 160 }],
          target: overlay
        } as ResizeObserverEntry
      ],
      {} as ResizeObserver
    )

    await waitFor(() =>
      expect(overlay.style.getPropertyValue('--reveal-height')).toBe(`${overlayHeight}px`)
    )
    expectClipPath(overlay, REVEAL_DIRECTIONS[4].hiddenClipPath)
    expect(onRevealChange).not.toHaveBeenCalled()
    expect(onRevealStart).not.toHaveBeenCalled()
    expect(onRevealComplete).not.toHaveBeenCalled()

    rerender(
      <RevealAnimation
        direction="diagonal-45-to-135"
        onRevealChange={onRevealChange}
        onRevealComplete={onRevealComplete}
        onRevealStart={onRevealStart}
        render={<Button />}
        reveal
      >
        diagonal geometry
      </RevealAnimation>
    )

    expectClipPath(overlay, REVEAL_DIRECTIONS[4].revealedClipPath)
    expect(onRevealChange).toHaveBeenCalledWith(true)
    expect(onRevealStart).toHaveBeenCalledWith(true)

    overlayHeight = 72
    resizeCallbacks[0]?.(
      [
        {
          borderBoxSize: [{ blockSize: overlayHeight, inlineSize: 160 }],
          contentBoxSize: [{ blockSize: overlayHeight, inlineSize: 160 }],
          contentRect: overlay.getBoundingClientRect(),
          devicePixelContentBoxSize: [{ blockSize: overlayHeight, inlineSize: 160 }],
          target: overlay
        } as ResizeObserverEntry
      ],
      {} as ResizeObserver
    )

    await waitFor(() =>
      expect(overlay.style.getPropertyValue('--reveal-height')).toBe(`${overlayHeight}px`)
    )
    expect(onRevealChange).toHaveBeenCalledTimes(1)
    expect(onRevealStart).toHaveBeenCalledTimes(1)
    expect(onRevealComplete).not.toHaveBeenCalled()
  })

  it('UC-005 / EX-003 - positions and scales only the decorative revealed content copy', () => {
    const { container } = render(
      <RevealAnimation
        alignX="start"
        alignY="start"
        offsetX={-20}
        offsetY={4}
        render={<Button />}
        reveal
      >
        tune plan
      </RevealAnimation>
    )

    const root = getRevealRoot(container)
    const overlay = getRevealOverlay(container)
    const copy = getRevealCopy(container)
    const copyScale = getRevealCopyScale(container)

    expect(copy).toHaveStyle({
      '--reveal-offset-x': '-20px',
      '--reveal-offset-y': '4px'
    })
    expect(copyScale).toHaveStyle({ '--reveal-origin': 'left top' })
    expect(getCssTransform(copyScale)).toContain('scale(1.2)')
    expect(getCssTransform(root)).not.toContain('scale')
    expect(getCssTransform(overlay)).not.toContain('scale')
  })

  it('UC-005 - applies the requested decorative content scale including scale 1', () => {
    const { container, rerender } = render(
      <RevealAnimation render={<Button />} reveal scale={1}>
        tune plan
      </RevealAnimation>
    )

    expect(getCssTransform(getRevealCopyScale(container))).toContain('scale(1)')
    expect(getCssTransform(getRevealCopyScale(container))).not.toContain('scale(1.2)')

    rerender(
      <RevealAnimation render={<Button />} reveal scale={1.4}>
        tune plan
      </RevealAnimation>
    )

    expect(getCssTransform(getRevealCopyScale(container))).toContain('scale(1.4)')
  })

  it('UC-002 / UC-005 / UC-009 / EX-006 / CR-001 - renders the catalog reveal as phrasing content', () => {
    const { container } = render(
      <span>
        Open{' '}
        <RevealAnimation
          contentMode="phrasing"
          render={<button className="cursor-pointer bg-background text-foreground underline" />}
          scale={1}
        >
          exercice catalog
        </RevealAnimation>{' '}
        popup
      </span>
    )

    const button = screen.getByRole('button', { name: 'exercice catalog' })
    const root = button.closest<HTMLElement>('[data-reveal-root]')
    const realSurface = container.querySelector<HTMLElement>('[data-reveal-surface]')
    const overlay = getRevealOverlay(container)
    const copy = getRevealCopy(container)
    const copyScale = getRevealCopyScale(container)

    expect(root).toBeInTheDocument()
    expect(root?.tagName).toBe('SPAN')
    expect(root).toHaveAttribute('data-content-mode', 'phrasing')
    expect(realSurface?.tagName).toBe('SPAN')
    expect(overlay.tagName).toBe('SPAN')
    expect(copy.tagName).toBe('SPAN')
    expect(copyScale.tagName).toBe('SPAN')
    expect(screen.getAllByRole('button', { name: 'exercice catalog' })).toHaveLength(1)
    expect(overlay).toHaveAttribute('aria-hidden', 'true')
    expect(getCssTransform(copyScale)).toContain('scale(1)')

    fireEvent.focus(button)

    expect(button).toHaveFocus()
    expectClipPath(overlay, DEFAULT_REVEAL_DIRECTION.revealedClipPath)

    fireEvent.blur(button)

    expectClipPath(overlay, DEFAULT_REVEAL_DIRECTION.hiddenClipPath)

    fireEvent.mouseEnter(button)

    expectClipPath(overlay, DEFAULT_REVEAL_DIRECTION.revealedClipPath)

    fireEvent.pointerDown(button)
    fireEvent.focus(button)
    fireEvent.click(button)

    expect(button).toHaveFocus()

    fireEvent.mouseLeave(button)

    expect(button).toHaveFocus()
    expectClipPath(overlay, DEFAULT_REVEAL_DIRECTION.hiddenClipPath)
  })

  it('UC-006 / UC-007 / UC-012 / EX-004 - displays controlled reveal, unreveal behavior, and lifecycle probes', () => {
    const { container } = render(<ControlledButtonRevealProbe />)
    const root = getRevealRoot(container)
    const overlay = getRevealOverlay(container)
    const checkbox = screen.getByRole('checkbox', { name: 'reveal' })
    const behaviorSelect = screen.getByRole('combobox', { name: 'unreveal behavior' })
    const button = screen.getByRole('button', { name: 'controlled reveal' })
    const stateOutput = screen.getByLabelText('state')
    const startOutput = screen.getByLabelText('start')
    const completeOutput = screen.getByLabelText('complete')
    const behaviorOutput = screen.getByLabelText('configured unreveal behavior')

    expect(root).toHaveAttribute('data-unreveal-behavior', 'return')
    expect(root).not.toHaveAttribute('data-active-unreveal-behavior')
    expect(behaviorOutput).toHaveTextContent('return')

    fireEvent.change(behaviorSelect, { target: { value: 'continue' } })

    expect(root).toHaveAttribute('data-unreveal-behavior', 'continue')
    expect(root).not.toHaveAttribute('data-active-unreveal-behavior')
    expect(behaviorOutput).toHaveTextContent('continue')

    fireEvent.mouseEnter(button)
    fireEvent.focus(button)

    expectClipPath(overlay, DEFAULT_REVEAL_DIRECTION.hiddenClipPath)
    expect(stateOutput).toHaveTextContent('idle')
    expect(startOutput).toHaveTextContent('idle')
    expect(completeOutput).toHaveTextContent('idle')

    fireEvent.transitionEnd(overlay, { propertyName: REVEAL_TRANSITION_PROPERTY })

    expect(completeOutput).toHaveTextContent('idle')

    fireEvent.click(checkbox)

    expect(stateOutput).toHaveTextContent('revealed')
    expect(startOutput).toHaveTextContent('revealing')
    expect(completeOutput).toHaveTextContent('idle')
    expectClipPath(overlay, DEFAULT_REVEAL_DIRECTION.revealedClipPath)

    fireEvent.transitionEnd(overlay, { propertyName: 'opacity' })

    expect(completeOutput).toHaveTextContent('idle')

    fireEvent.transitionEnd(overlay, { propertyName: REVEAL_TRANSITION_PROPERTY })

    expect(completeOutput).toHaveTextContent('complete revealed')

    fireEvent.click(checkbox)

    expect(stateOutput).toHaveTextContent('hidden')
    expect(startOutput).toHaveTextContent('hiding')
    expect(completeOutput).toHaveTextContent('complete revealed')
    expect(root).toHaveAttribute('data-unreveal-behavior', 'continue')
    expect(root).toHaveAttribute('data-active-unreveal-behavior', 'continue')
    expectClipPath(overlay, DEFAULT_REVEAL_DIRECTION.oppositeHiddenClipPath)

    fireEvent.transitionEnd(overlay, { propertyName: REVEAL_TRANSITION_PROPERTY })

    expect(completeOutput).toHaveTextContent('complete hidden')
    expect(root).not.toHaveAttribute('data-active-unreveal-behavior')
    expectClipPath(overlay, DEFAULT_REVEAL_DIRECTION.hiddenClipPath)
  })

  it('UC-007 / EX-004 - completes only the final reached target after rapid changes', () => {
    const onRevealChange = vi.fn()
    const onRevealComplete = vi.fn()
    const onRevealStart = vi.fn()
    const { container, rerender } = render(
      <RevealAnimation
        onRevealChange={onRevealChange}
        onRevealComplete={onRevealComplete}
        onRevealStart={onRevealStart}
        render={<Button />}
        reveal={false}
      >
        controlled reveal
      </RevealAnimation>
    )

    const overlay = getRevealOverlay(container)

    rerender(
      <RevealAnimation
        onRevealChange={onRevealChange}
        onRevealComplete={onRevealComplete}
        onRevealStart={onRevealStart}
        render={<Button />}
        reveal
      >
        controlled reveal
      </RevealAnimation>
    )

    rerender(
      <RevealAnimation
        onRevealChange={onRevealChange}
        onRevealComplete={onRevealComplete}
        onRevealStart={onRevealStart}
        render={<Button />}
        reveal={false}
      >
        controlled reveal
      </RevealAnimation>
    )

    fireEvent.transitionEnd(overlay, { propertyName: 'opacity' })

    expect(onRevealChange).toHaveBeenNthCalledWith(1, true)
    expect(onRevealChange).toHaveBeenNthCalledWith(2, false)
    expect(onRevealStart).toHaveBeenNthCalledWith(1, true)
    expect(onRevealStart).toHaveBeenNthCalledWith(2, false)
    expect(onRevealComplete).not.toHaveBeenCalled()

    fireEvent.transitionEnd(overlay, { propertyName: REVEAL_TRANSITION_PROPERTY })

    expect(onRevealComplete).toHaveBeenCalledOnce()
    expect(onRevealComplete).toHaveBeenCalledWith(false)
    expect(onRevealComplete).not.toHaveBeenCalledWith(true)
  })

  it('UC-010 / EX-004 - reaches both controlled targets with default return and completes immediately under reduced motion', async () => {
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

    const onRevealChange = vi.fn()
    const onRevealComplete = vi.fn()
    const onRevealStart = vi.fn()
    const { container, rerender } = render(
      <RevealAnimation
        onRevealChange={onRevealChange}
        onRevealComplete={onRevealComplete}
        onRevealStart={onRevealStart}
        render={<Button />}
        reveal={false}
      >
        reduced reveal
      </RevealAnimation>
    )

    const overlay = getRevealOverlay(container)

    rerender(
      <RevealAnimation
        onRevealChange={onRevealChange}
        onRevealComplete={onRevealComplete}
        onRevealStart={onRevealStart}
        render={<Button />}
        reveal
      >
        reduced reveal
      </RevealAnimation>
    )

    await waitFor(() => expect(onRevealComplete).toHaveBeenCalledWith(true))
    expectClipPath(overlay, DEFAULT_REVEAL_DIRECTION.revealedClipPath)
    expect(onRevealChange).toHaveBeenNthCalledWith(1, true)
    expect(onRevealStart).toHaveBeenNthCalledWith(1, true)

    rerender(
      <RevealAnimation
        onRevealChange={onRevealChange}
        onRevealComplete={onRevealComplete}
        onRevealStart={onRevealStart}
        render={<Button />}
        reveal={false}
      >
        reduced reveal
      </RevealAnimation>
    )

    await waitFor(() => expect(onRevealComplete).toHaveBeenNthCalledWith(2, false))
    expectClipPath(overlay, DEFAULT_REVEAL_DIRECTION.hiddenClipPath)
    expect(getCssTransitionDuration(overlay)).toBe('0ms')
    expect(onRevealChange).toHaveBeenNthCalledWith(2, false)
    expect(onRevealStart).toHaveBeenNthCalledWith(2, false)
  })

  it('UC-010 / EX-004 - completes continue immediately under reduced motion and resets silently to starting hidden', async () => {
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

    const onRevealChange = vi.fn()
    const onRevealComplete = vi.fn()
    const onRevealStart = vi.fn()
    const { container, rerender } = render(
      <RevealAnimation
        onRevealChange={onRevealChange}
        onRevealComplete={onRevealComplete}
        onRevealStart={onRevealStart}
        render={<Button />}
        reveal
        unrevealBehavior="continue"
      >
        reduced continue
      </RevealAnimation>
    )

    const root = getRevealRoot(container)
    const overlay = getRevealOverlay(container)

    expect(root).toHaveAttribute('data-unreveal-behavior', 'continue')
    expectClipPath(overlay, DEFAULT_REVEAL_DIRECTION.revealedClipPath)

    rerender(
      <RevealAnimation
        onRevealChange={onRevealChange}
        onRevealComplete={onRevealComplete}
        onRevealStart={onRevealStart}
        render={<Button />}
        reveal={false}
        unrevealBehavior="continue"
      >
        reduced continue
      </RevealAnimation>
    )

    await waitFor(() => expect(onRevealComplete).toHaveBeenCalledWith(false))
    expect(onRevealChange).toHaveBeenCalledOnce()
    expect(onRevealChange).toHaveBeenCalledWith(false)
    expect(onRevealStart).toHaveBeenCalledOnce()
    expect(onRevealStart).toHaveBeenCalledWith(false)
    expect(onRevealComplete).toHaveBeenCalledOnce()
    expect(root).not.toHaveAttribute('data-active-unreveal-behavior')
    expectClipPath(overlay, DEFAULT_REVEAL_DIRECTION.hiddenClipPath)
    expect(getCssTransitionDuration(overlay)).toBe('0ms')

    fireEvent.transitionEnd(overlay, { propertyName: REVEAL_TRANSITION_PROPERTY })

    expect(onRevealComplete).toHaveBeenCalledOnce()
  })

  it('UC-011 / EX-007 - maps default return and continue unreveal travel across all directions', () => {
    for (const {
      direction,
      hiddenClipPath,
      label,
      oppositeHiddenClipPath,
      revealedClipPath
    } of REVEAL_DIRECTIONS) {
      for (const behavior of [undefined, 'continue'] as const) {
        const effectiveBehavior = behavior ?? 'return'
        const onRevealChange = vi.fn()
        const onRevealComplete = vi.fn()
        const onRevealStart = vi.fn()
        const result = render(
          <RevealAnimation
            direction={direction}
            onRevealChange={onRevealChange}
            onRevealComplete={onRevealComplete}
            onRevealStart={onRevealStart}
            render={<Button />}
            reveal
            unrevealBehavior={behavior}
          >
            {label} {effectiveBehavior}
          </RevealAnimation>
        )

        const root = getRevealRoot(result.container)
        const overlay = getRevealOverlay(result.container)

        expect(root).toHaveAttribute('data-unreveal-behavior', effectiveBehavior)
        expect(root).not.toHaveAttribute('data-active-unreveal-behavior')
        expectClipPath(overlay, revealedClipPath)

        result.rerender(
          <RevealAnimation
            direction={direction}
            onRevealChange={onRevealChange}
            onRevealComplete={onRevealComplete}
            onRevealStart={onRevealStart}
            render={<Button />}
            reveal={false}
            unrevealBehavior={behavior}
          >
            {label} {effectiveBehavior}
          </RevealAnimation>
        )

        expect(root).toHaveAttribute('data-active-unreveal-behavior', effectiveBehavior)
        expectClipPath(
          overlay,
          effectiveBehavior === 'continue' ? oppositeHiddenClipPath : hiddenClipPath
        )
        expectRevealCssTransition(overlay)
        expect(onRevealChange).toHaveBeenCalledOnce()
        expect(onRevealChange).toHaveBeenCalledWith(false)
        expect(onRevealStart).toHaveBeenCalledOnce()
        expect(onRevealStart).toHaveBeenCalledWith(false)
        expect(onRevealComplete).not.toHaveBeenCalled()

        fireEvent.transitionEnd(overlay, { propertyName: REVEAL_TRANSITION_PROPERTY })

        expect(onRevealComplete).toHaveBeenCalledOnce()
        expect(onRevealComplete).toHaveBeenCalledWith(false)
        expect(root).not.toHaveAttribute('data-active-unreveal-behavior')
        expectClipPath(overlay, hiddenClipPath)

        fireEvent.transitionEnd(overlay, { propertyName: REVEAL_TRANSITION_PROPERTY })

        expect(onRevealComplete).toHaveBeenCalledOnce()

        result.unmount()
      }
    }
  })

  it('UC-012 / EX-004 - latches one unreveal behavior while configuration changes apply to the next cycle', () => {
    const onRevealComplete = vi.fn()
    const { container, rerender } = render(
      <RevealAnimation
        direction="left-to-right"
        onRevealComplete={onRevealComplete}
        render={<Button />}
        reveal
        unrevealBehavior="continue"
      >
        latch behavior
      </RevealAnimation>
    )

    const root = getRevealRoot(container)
    const overlay = getRevealOverlay(container)

    rerender(
      <RevealAnimation
        direction="left-to-right"
        onRevealComplete={onRevealComplete}
        render={<Button />}
        reveal={false}
        unrevealBehavior="continue"
      >
        latch behavior
      </RevealAnimation>
    )

    expect(root).toHaveAttribute('data-unreveal-behavior', 'continue')
    expect(root).toHaveAttribute('data-active-unreveal-behavior', 'continue')
    expectClipPath(overlay, REVEAL_DIRECTIONS[0].oppositeHiddenClipPath)

    rerender(
      <RevealAnimation
        direction="left-to-right"
        onRevealComplete={onRevealComplete}
        render={<Button />}
        reveal={false}
        unrevealBehavior="return"
      >
        latch behavior
      </RevealAnimation>
    )

    expect(root).toHaveAttribute('data-unreveal-behavior', 'return')
    expect(root).toHaveAttribute('data-active-unreveal-behavior', 'continue')
    expectClipPath(overlay, REVEAL_DIRECTIONS[0].oppositeHiddenClipPath)

    rerender(
      <RevealAnimation
        direction="left-to-right"
        onRevealComplete={onRevealComplete}
        render={<Button />}
        reveal
        unrevealBehavior="return"
      >
        latch behavior
      </RevealAnimation>
    )

    expect(root).toHaveAttribute('data-active-unreveal-behavior', 'continue')
    expectClipPath(overlay, REVEAL_DIRECTIONS[0].revealedClipPath)

    fireEvent.transitionEnd(overlay, { propertyName: REVEAL_TRANSITION_PROPERTY })

    expect(onRevealComplete).toHaveBeenCalledOnce()
    expect(onRevealComplete).toHaveBeenCalledWith(true)
    expect(onRevealComplete).not.toHaveBeenCalledWith(false)
    expect(root).not.toHaveAttribute('data-active-unreveal-behavior')

    rerender(
      <RevealAnimation
        direction="left-to-right"
        onRevealComplete={onRevealComplete}
        render={<Button />}
        reveal={false}
        unrevealBehavior="return"
      >
        latch behavior
      </RevealAnimation>
    )

    expect(root).toHaveAttribute('data-active-unreveal-behavior', 'return')
    expectClipPath(overlay, REVEAL_DIRECTIONS[0].hiddenClipPath)
  })

  it('UC-007 / UC-012 / UC-014 / EX-004 / EX-007 - resumes each sampled unreveal after temporary recovery and completes only the final hidden target', () => {
    for (const latchedBehavior of ['return', 'continue'] as const) {
      const configuredBehavior = latchedBehavior === 'return' ? 'continue' : 'return'
      const onRevealChange = vi.fn()
      const onRevealComplete = vi.fn()
      const onRevealStart = vi.fn()
      const result = render(
        <RevealAnimation
          onRevealChange={onRevealChange}
          onRevealComplete={onRevealComplete}
          onRevealStart={onRevealStart}
          render={<Button />}
          reveal
          unrevealBehavior={latchedBehavior}
        >
          resume {latchedBehavior}
        </RevealAnimation>
      )

      const root = getRevealRoot(result.container)
      const overlay = getRevealOverlay(result.container)
      const latchedEndpoint =
        latchedBehavior === 'continue'
          ? DEFAULT_REVEAL_DIRECTION.oppositeHiddenClipPath
          : DEFAULT_REVEAL_DIRECTION.hiddenClipPath

      result.rerender(
        <RevealAnimation
          onRevealChange={onRevealChange}
          onRevealComplete={onRevealComplete}
          onRevealStart={onRevealStart}
          render={<Button />}
          reveal={false}
          unrevealBehavior={latchedBehavior}
        >
          resume {latchedBehavior}
        </RevealAnimation>
      )

      expect(root).toHaveAttribute('data-active-unreveal-behavior', latchedBehavior)
      expectClipPath(overlay, latchedEndpoint)

      result.rerender(
        <RevealAnimation
          onRevealChange={onRevealChange}
          onRevealComplete={onRevealComplete}
          onRevealStart={onRevealStart}
          render={<Button />}
          reveal
          unrevealBehavior={configuredBehavior}
        >
          resume {latchedBehavior}
        </RevealAnimation>
      )

      expect(getRevealOverlay(result.container)).toBe(overlay)
      expect(root).toHaveAttribute('data-unreveal-behavior', configuredBehavior)
      expect(root).toHaveAttribute('data-active-unreveal-behavior', latchedBehavior)
      expectClipPath(overlay, DEFAULT_REVEAL_DIRECTION.revealedClipPath)
      expect(onRevealComplete).not.toHaveBeenCalled()

      result.rerender(
        <RevealAnimation
          onRevealChange={onRevealChange}
          onRevealComplete={onRevealComplete}
          onRevealStart={onRevealStart}
          render={<Button />}
          reveal={false}
          unrevealBehavior={configuredBehavior}
        >
          resume {latchedBehavior}
        </RevealAnimation>
      )

      expect(getRevealOverlay(result.container)).toBe(overlay)
      expect(root).toHaveAttribute('data-unreveal-behavior', configuredBehavior)
      expect(root).toHaveAttribute('data-active-unreveal-behavior', latchedBehavior)
      expectClipPath(overlay, latchedEndpoint)
      expect(onRevealChange).toHaveBeenCalledTimes(3)
      expect(onRevealChange).toHaveBeenNthCalledWith(1, false)
      expect(onRevealChange).toHaveBeenNthCalledWith(2, true)
      expect(onRevealChange).toHaveBeenNthCalledWith(3, false)
      expect(onRevealStart).toHaveBeenCalledTimes(3)
      expect(onRevealStart).toHaveBeenNthCalledWith(1, false)
      expect(onRevealStart).toHaveBeenNthCalledWith(2, true)
      expect(onRevealStart).toHaveBeenNthCalledWith(3, false)
      expect(onRevealComplete).not.toHaveBeenCalled()

      fireEvent.transitionEnd(overlay, { propertyName: REVEAL_TRANSITION_PROPERTY })

      expect(onRevealComplete).toHaveBeenCalledOnce()
      expect(onRevealComplete).toHaveBeenCalledWith(false)
      expect(root).not.toHaveAttribute('data-active-unreveal-behavior')
      expectClipPath(overlay, DEFAULT_REVEAL_DIRECTION.hiddenClipPath)

      fireEvent.transitionEnd(overlay, { propertyName: REVEAL_TRANSITION_PROPERTY })

      expect(onRevealComplete).toHaveBeenCalledOnce()

      result.unmount()
    }
  })

  it('UC-013 / EX-004 - forces return on a hidden target that interrupts an incomplete reveal', () => {
    const onRevealComplete = vi.fn()
    const { container, rerender } = render(
      <RevealAnimation
        direction="left-to-right"
        onRevealComplete={onRevealComplete}
        render={<Button />}
        reveal={false}
        unrevealBehavior="continue"
      >
        interrupted reveal
      </RevealAnimation>
    )

    const root = getRevealRoot(container)
    const overlay = getRevealOverlay(container)

    rerender(
      <RevealAnimation
        direction="left-to-right"
        onRevealComplete={onRevealComplete}
        render={<Button />}
        reveal
        unrevealBehavior="continue"
      >
        interrupted reveal
      </RevealAnimation>
    )

    expectClipPath(overlay, REVEAL_DIRECTIONS[0].revealedClipPath)

    rerender(
      <RevealAnimation
        direction="left-to-right"
        onRevealComplete={onRevealComplete}
        render={<Button />}
        reveal={false}
        unrevealBehavior="continue"
      >
        interrupted reveal
      </RevealAnimation>
    )

    expect(getRevealOverlay(container)).toBe(overlay)
    expect(root).toHaveAttribute('data-unreveal-behavior', 'continue')
    expect(root).toHaveAttribute('data-active-unreveal-behavior', 'return')
    expectClipPath(overlay, REVEAL_DIRECTIONS[0].hiddenClipPath)
    expect(getCssClipPath(overlay)).not.toBe(REVEAL_DIRECTIONS[0].oppositeHiddenClipPath)

    rerender(
      <RevealAnimation
        direction="left-to-right"
        onRevealComplete={onRevealComplete}
        render={<Button />}
        reveal
        unrevealBehavior="continue"
      >
        interrupted reveal
      </RevealAnimation>
    )

    expect(getRevealOverlay(container)).toBe(overlay)
    expect(root).not.toHaveAttribute('data-active-unreveal-behavior')
    expectClipPath(overlay, REVEAL_DIRECTIONS[0].revealedClipPath)
    expect(onRevealComplete).not.toHaveBeenCalled()

    rerender(
      <RevealAnimation
        direction="left-to-right"
        onRevealComplete={onRevealComplete}
        render={<Button />}
        reveal={false}
        unrevealBehavior="continue"
      >
        interrupted reveal
      </RevealAnimation>
    )

    expect(getRevealOverlay(container)).toBe(overlay)
    expect(root).toHaveAttribute('data-active-unreveal-behavior', 'return')
    expectClipPath(overlay, REVEAL_DIRECTIONS[0].hiddenClipPath)
    expect(onRevealComplete).not.toHaveBeenCalled()

    fireEvent.transitionEnd(overlay, { propertyName: REVEAL_TRANSITION_PROPERTY })

    expect(onRevealComplete).toHaveBeenCalledOnce()
    expect(onRevealComplete).toHaveBeenCalledWith(false)
    expect(root).not.toHaveAttribute('data-active-unreveal-behavior')
  })

  it('UC-010 / UC-012 / UC-014 / EX-004 - settles a preserved recovery or resumed hidden target when reduced motion becomes active', async () => {
    for (const settledTarget of [true, false] as const) {
      let reducedMotion = false
      let notifyReducedMotionChange: (() => void) | undefined
      const mediaQueryList = {
        addEventListener: vi.fn((_type: string, listener: () => void) => {
          notifyReducedMotionChange = listener
        }),
        addListener: vi.fn(),
        dispatchEvent: vi.fn(),
        get matches() {
          return reducedMotion
        },
        media: '(prefers-reduced-motion: reduce)',
        onchange: null,
        removeEventListener: vi.fn(),
        removeListener: vi.fn()
      } as unknown as MediaQueryList

      vi.stubGlobal(
        'matchMedia',
        vi.fn(() => mediaQueryList)
      )

      const onRevealChange = vi.fn()
      const onRevealComplete = vi.fn()
      const onRevealStart = vi.fn()
      const result = render(
        <RevealAnimation
          onRevealChange={onRevealChange}
          onRevealComplete={onRevealComplete}
          onRevealStart={onRevealStart}
          render={<Button />}
          reveal
          unrevealBehavior="continue"
        >
          reduced resumed target
        </RevealAnimation>
      )

      const root = getRevealRoot(result.container)
      const overlay = getRevealOverlay(result.container)

      result.rerender(
        <RevealAnimation
          onRevealChange={onRevealChange}
          onRevealComplete={onRevealComplete}
          onRevealStart={onRevealStart}
          render={<Button />}
          reveal={false}
          unrevealBehavior="continue"
        >
          reduced resumed target
        </RevealAnimation>
      )
      result.rerender(
        <RevealAnimation
          onRevealChange={onRevealChange}
          onRevealComplete={onRevealComplete}
          onRevealStart={onRevealStart}
          render={<Button />}
          reveal
          unrevealBehavior="continue"
        >
          reduced resumed target
        </RevealAnimation>
      )

      expect(root).toHaveAttribute('data-active-unreveal-behavior', 'continue')

      if (!settledTarget) {
        result.rerender(
          <RevealAnimation
            onRevealChange={onRevealChange}
            onRevealComplete={onRevealComplete}
            onRevealStart={onRevealStart}
            render={<Button />}
            reveal={false}
            unrevealBehavior="continue"
          >
            reduced resumed target
          </RevealAnimation>
        )

        expect(root).toHaveAttribute('data-active-unreveal-behavior', 'continue')
        expectClipPath(overlay, DEFAULT_REVEAL_DIRECTION.oppositeHiddenClipPath)
      }

      expect(onRevealComplete).not.toHaveBeenCalled()

      act(() => {
        reducedMotion = true
        notifyReducedMotionChange?.()
      })

      await waitFor(() => expect(onRevealComplete).toHaveBeenCalledWith(settledTarget))

      const targetCount = settledTarget ? 2 : 3

      expect(onRevealChange).toHaveBeenCalledTimes(targetCount)
      expect(onRevealChange).toHaveBeenLastCalledWith(settledTarget)
      expect(onRevealStart).toHaveBeenCalledTimes(targetCount)
      expect(onRevealStart).toHaveBeenLastCalledWith(settledTarget)
      expect(onRevealComplete).toHaveBeenCalledOnce()
      expect(root).not.toHaveAttribute('data-active-unreveal-behavior')
      expectClipPath(
        overlay,
        settledTarget
          ? DEFAULT_REVEAL_DIRECTION.revealedClipPath
          : DEFAULT_REVEAL_DIRECTION.hiddenClipPath
      )
      expect(getCssTransitionDuration(overlay)).toBe('0ms')

      fireEvent.transitionEnd(overlay, { propertyName: REVEAL_TRANSITION_PROPERTY })

      expect(onRevealComplete).toHaveBeenCalledOnce()

      result.unmount()
      vi.unstubAllGlobals()
    }
  })

  it('UC-012 - cancels an active hidden target and its pending completion when direction changes', () => {
    const onRevealChange = vi.fn()
    const onRevealComplete = vi.fn()
    const onRevealStart = vi.fn()
    const { container, rerender } = render(
      <RevealAnimation
        direction="left-to-right"
        onRevealChange={onRevealChange}
        onRevealComplete={onRevealComplete}
        onRevealStart={onRevealStart}
        render={<Button />}
        reveal
        unrevealBehavior="continue"
      >
        direction cancellation
      </RevealAnimation>
    )

    const root = getRevealRoot(container)

    rerender(
      <RevealAnimation
        direction="left-to-right"
        onRevealChange={onRevealChange}
        onRevealComplete={onRevealComplete}
        onRevealStart={onRevealStart}
        render={<Button />}
        reveal={false}
        unrevealBehavior="continue"
      >
        direction cancellation
      </RevealAnimation>
    )

    expect(root).toHaveAttribute('data-active-unreveal-behavior', 'continue')
    expect(onRevealChange).toHaveBeenCalledOnce()
    expect(onRevealStart).toHaveBeenCalledOnce()
    expect(onRevealComplete).not.toHaveBeenCalled()

    rerender(
      <RevealAnimation
        direction="right-to-left"
        onRevealChange={onRevealChange}
        onRevealComplete={onRevealComplete}
        onRevealStart={onRevealStart}
        render={<Button />}
        reveal={false}
        unrevealBehavior="continue"
      >
        direction cancellation
      </RevealAnimation>
    )

    const redirectedOverlay = getRevealOverlay(container)

    expect(root).not.toHaveAttribute('data-active-unreveal-behavior')
    expectClipPath(redirectedOverlay, REVEAL_DIRECTIONS[1].hiddenClipPath)
    expect(onRevealChange).toHaveBeenCalledOnce()
    expect(onRevealStart).toHaveBeenCalledOnce()

    fireEvent.transitionEnd(redirectedOverlay, { propertyName: REVEAL_TRANSITION_PROPERTY })

    expect(onRevealComplete).not.toHaveBeenCalled()
  })

  it('UC-012 / UC-014 - invalidates a suspended unreveal silently when direction changes at a true target', () => {
    const onRevealChange = vi.fn()
    const onRevealComplete = vi.fn()
    const onRevealStart = vi.fn()
    const { container, rerender } = render(
      <RevealAnimation
        direction="left-to-right"
        onRevealChange={onRevealChange}
        onRevealComplete={onRevealComplete}
        onRevealStart={onRevealStart}
        render={<Button />}
        reveal
        unrevealBehavior="continue"
      >
        revealed direction change
      </RevealAnimation>
    )

    const root = getRevealRoot(container)

    rerender(
      <RevealAnimation
        direction="left-to-right"
        onRevealChange={onRevealChange}
        onRevealComplete={onRevealComplete}
        onRevealStart={onRevealStart}
        render={<Button />}
        reveal={false}
        unrevealBehavior="continue"
      >
        revealed direction change
      </RevealAnimation>
    )
    rerender(
      <RevealAnimation
        direction="left-to-right"
        onRevealChange={onRevealChange}
        onRevealComplete={onRevealComplete}
        onRevealStart={onRevealStart}
        render={<Button />}
        reveal
        unrevealBehavior="continue"
      >
        revealed direction change
      </RevealAnimation>
    )

    expect(root).toHaveAttribute('data-active-unreveal-behavior', 'continue')
    expect(onRevealComplete).not.toHaveBeenCalled()

    onRevealChange.mockClear()
    onRevealStart.mockClear()

    rerender(
      <RevealAnimation
        direction="right-to-left"
        onRevealChange={onRevealChange}
        onRevealComplete={onRevealComplete}
        onRevealStart={onRevealStart}
        render={<Button />}
        reveal
        unrevealBehavior="continue"
      >
        revealed direction change
      </RevealAnimation>
    )

    expectClipPath(getRevealOverlay(container), REVEAL_DIRECTIONS[1].revealedClipPath)
    expect(root).not.toHaveAttribute('data-active-unreveal-behavior')
    expect(onRevealChange).not.toHaveBeenCalled()
    expect(onRevealStart).not.toHaveBeenCalled()
    expect(onRevealComplete).not.toHaveBeenCalled()

    rerender(
      <RevealAnimation
        direction="right-to-left"
        onRevealChange={onRevealChange}
        onRevealComplete={onRevealComplete}
        onRevealStart={onRevealStart}
        render={<Button />}
        reveal={false}
        unrevealBehavior="continue"
      >
        revealed direction change
      </RevealAnimation>
    )

    expect(root).toHaveAttribute('data-active-unreveal-behavior', 'continue')
    expectClipPath(getRevealOverlay(container), REVEAL_DIRECTIONS[1].oppositeHiddenClipPath)
  })

  it('UC-008 / EX-005 - inverts the active theme mode on the overlay surface', async () => {
    const { container, unmount } = render(
      <RevealAnimation render={<Button />} reveal>
        inspect reveal
      </RevealAnimation>
    )

    expect(getRevealOverlay(container)).toHaveClass('dark')
    expect(getRevealOverlay(container)).not.toHaveClass('light')

    document.body.classList.add('dark')

    await waitFor(() => expect(getRevealOverlay(container)).toHaveClass('light'))

    expect(getRevealOverlay(container)).toHaveClass('light')
    expect(getRevealOverlay(container)).not.toHaveClass('dark')

    document.body.classList.remove('dark')

    await waitFor(() => expect(getRevealOverlay(container)).toHaveClass('dark'))

    expect(getRevealOverlay(container)).not.toHaveClass('light')

    unmount()
    document.body.classList.add('dark')

    const initialDarkRender = render(
      <RevealAnimation render={<Button />} reveal>
        inspect reveal
      </RevealAnimation>
    )

    expect(getRevealOverlay(initialDarkRender.container)).toHaveClass('light')
  })

  it('EX-001 / EX-002 / EX-003 / EX-004 / EX-005 / EX-006 / EX-007 - exposes RevealAnimation through the package entrypoint', () => {
    expect(PACKAGE_EXPORTS.RevealAnimation).toBeTypeOf('function')
    expectTypeOf<RevealAnimationDirection>().toEqualTypeOf<
      'left-to-right' | 'right-to-left' | 'top-to-bottom' | 'bottom-to-top' | 'diagonal-45-to-135'
    >()
    expectTypeOf<RevealAnimationUnrevealBehavior>().toEqualTypeOf<'return' | 'continue'>()

    if (typeof PACKAGE_EXPORTS.RevealAnimation === 'function') {
      expect(PACKAGE_EXPORTS.RevealAnimation).not.toHaveProperty('Root')
    }
  })
})
