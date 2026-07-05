import { type useRender } from '@base-ui/react/use-render'
import { fireEvent, render, screen } from '@testing-library/react'
import { createRef, type ReactElement } from 'react'
import { describe, expect, expectTypeOf, it, vi } from 'vitest'

import { type AspectRatioProps } from '../..'
import * as PackageExports from '../..'

type ExpectedAspectRatioProps = useRender.ComponentProps<'div', Record<string, never>> & {
  fit?: 'contain' | 'cover'
  ratio: number
}

type AspectRatioComponent = (props: ExpectedAspectRatioProps) => ReactElement | null
type AspectRatioRenderCallback = Exclude<
  ExpectedAspectRatioProps['render'],
  ReactElement | undefined
>

interface AspectRatioPackageContract {
  AspectRatio: AspectRatioComponent
  Components: typeof PackageExports.Components & {
    AspectRatio: AspectRatioComponent
  }
  Ui: typeof PackageExports.Ui & {
    Components: typeof PackageExports.Components & {
      AspectRatio: AspectRatioComponent
    }
  }
}

const PACKAGE_EXPORTS = PackageExports as typeof PackageExports & AspectRatioPackageContract
const AspectRatio = PACKAGE_EXPORTS.AspectRatio

describe('AspectRatio', () => {
  it('UC-001 / UC-005 / UC-009 - exposes the direct single-part component and its Base UI render props', () => {
    expect(AspectRatio).toBeTypeOf('function')
    expect('Root' in AspectRatio).toBe(false)

    expectTypeOf<AspectRatioProps['render']>().toEqualTypeOf<ExpectedAspectRatioProps['render']>()
    expectTypeOf<AspectRatioProps['ratio']>().toEqualTypeOf<number>()
    expectTypeOf<AspectRatioProps['fit']>().toEqualTypeOf<'contain' | 'cover' | undefined>()
  })

  it('UC-001 / UC-002 / UC-008 / EX-001 - renders the default cropped-media consumer usage on one neutral div', () => {
    const onClick = vi.fn()

    render(
      <AspectRatio
        ratio={16 / 9}
        className="consumer-surface"
        data-owner="training-session"
        data-testid="training-session"
        onClick={onClick}
        style={{ width: '320px' }}
      >
        <img src="/images/training-session.jpg" alt="Athlete starting a sprint" />
      </AspectRatio>
    )

    const surface = screen.getByTestId('training-session')
    const image = screen.getByRole('img', { name: 'Athlete starting a sprint' })

    fireEvent.click(surface)

    expect(surface.tagName).toBe('DIV')
    expect(surface).toHaveClass('consumer-surface')
    expect(surface).toHaveStyle({ width: '320px' })
    expect(surface).toHaveAttribute('data-owner', 'training-session')
    expect(surface).not.toHaveAttribute('ratio')
    expect(surface).not.toHaveAttribute('fit')
    expect(surface).not.toHaveAttribute('role')
    expect(surface).not.toHaveAttribute('tabindex')
    expect(surface).not.toHaveAttribute('aria-hidden')
    expect(surface).not.toHaveAttribute('data-slot')
    expect(
      surface
        .getAttributeNames()
        .filter((attribute) => attribute.startsWith('data-'))
        .sort()
    ).toEqual(['data-owner', 'data-testid'])
    expect(surface.children).toHaveLength(1)
    expect(surface.firstElementChild).toBe(image)
    expect(onClick).toHaveBeenCalledOnce()
  })

  it('UC-001 / UC-003 / UC-008 / EX-002 - preserves contained SVG consumer semantics on the direct child', () => {
    render(
      <AspectRatio
        ratio={1}
        fit="contain"
        className="consumer-diagram"
        data-testid="training-diagram"
      >
        <svg viewBox="0 0 160 100" role="img" aria-label="Three sprint phases">
          <rect width="160" height="100" />
          <path d="M16 76 L64 38 L104 60 L144 20" />
        </svg>
      </AspectRatio>
    )

    const surface = screen.getByTestId('training-diagram')
    const diagram = screen.getByRole('img', { name: 'Three sprint phases' })

    expect(surface.tagName).toBe('DIV')
    expect(surface).toHaveClass('consumer-diagram')
    expect(surface).not.toHaveAttribute('fit')
    expect(surface.children).toHaveLength(1)
    expect(surface.firstElementChild).toBe(diagram)
    expect(diagram.tagName.toLowerCase()).toBe('svg')
    expect(diagram).toHaveAttribute('viewBox', '0 0 160 100')
  })

  it('UC-002 / UC-003 - preserves every eligible direct-media element and arbitrary sibling content', () => {
    render(
      <AspectRatio ratio={4 / 3} data-testid="mixed-media">
        <img src="/images/start.jpg" alt="Sprint start" />
        <svg role="img" aria-label="Split chart" />
        <video aria-label="Session replay" controls />
        <span>Consumer overlay</span>
      </AspectRatio>
    )

    const surface = screen.getByTestId('mixed-media')

    expect(surface.children).toHaveLength(4)
    expect(screen.getByRole('img', { name: 'Sprint start' })).toBe(surface.children[0])
    expect(screen.getByRole('img', { name: 'Split chart' })).toBe(surface.children[1])
    expect(screen.getByLabelText('Session replay')).toBe(surface.children[2])
    expect(screen.getByText('Consumer overlay')).toBe(surface.children[3])
  })

  it('UC-004 / UC-008 / EX-003 - replaces the default element without a wrapper and keeps authoritative children once', () => {
    const { container } = render(
      <AspectRatio
        ratio={4 / 3}
        data-testid="session-figure"
        render={<figure aria-labelledby="session-caption" data-origin="replacement" />}
      >
        <img src="/images/session-recap.jpg" alt="" />
        <figcaption id="session-caption">Afternoon sprint session</figcaption>
      </AspectRatio>
    )

    const figure = screen.getByRole('figure', { name: 'Afternoon sprint session' })
    const caption = screen.getByText('Afternoon sprint session')

    expect(figure).toBe(screen.getByTestId('session-figure'))
    expect(figure.tagName).toBe('FIGURE')
    expect(figure).toHaveAttribute('data-origin', 'replacement')
    expect(figure).toHaveAttribute('aria-labelledby', 'session-caption')
    expect(container.children).toHaveLength(1)
    expect(container.firstElementChild).toBe(figure)
    expect(figure.querySelectorAll('#session-caption')).toHaveLength(1)
    expect(caption.tagName).toBe('FIGCAPTION')
    expect(figure.children).toHaveLength(2)
  })

  it('UC-005 / UC-006 / UC-008 / EX-004 - passes complete callback props, empty state, children, events, and the final ref', () => {
    let finalElement: Element | null = null
    let receivedState: Record<string, never> | undefined
    const onAspectRatioClick = vi.fn()
    const onCallbackClick = vi.fn()
    const callbackRender: AspectRatioRenderCallback = (props, state) => {
      receivedState = state

      return (
        <button
          {...props}
          type="button"
          onClick={(event) => {
            props.onClick?.(event)
            onCallbackClick()
          }}
        />
      )
    }

    render(
      <AspectRatio
        ratio={3 / 2}
        aria-label="Open afternoon session"
        className="interactive-preview"
        data-preview="afternoon"
        onClick={onAspectRatioClick}
        ref={(node) => {
          finalElement = node
        }}
        render={callbackRender}
        style={{ opacity: 0.8 }}
      >
        <img src="/images/session-preview.jpg" alt="" />
      </AspectRatio>
    )

    const button = screen.getByRole('button', { name: 'Open afternoon session' })

    fireEvent.click(button)

    expect(finalElement).toBe(button)
    expect(receivedState).toEqual({})
    expect(button.tagName).toBe('BUTTON')
    expect(button).toHaveClass('interactive-preview')
    expect(button).toHaveStyle({ opacity: '0.8' })
    expect(button).toHaveAttribute('data-preview', 'afternoon')
    expect(button.children).toHaveLength(1)
    expect(onAspectRatioClick).toHaveBeenCalledOnce()
    expect(onCallbackClick).toHaveBeenCalledOnce()
  })

  it('UC-006 - composes element-render classes, styles, events, colliding props, and refs', () => {
    const aspectRatioRef = createRef<HTMLDivElement>()
    const replacementRef = createRef<HTMLElement>()
    const onAspectRatioClick = vi.fn()
    const onReplacementClick = vi.fn()

    render(
      <AspectRatio
        ratio={2}
        className="aspect-ratio-consumer"
        data-priority="aspect-ratio"
        data-testid="composed-surface"
        onClick={onAspectRatioClick}
        ref={aspectRatioRef}
        render={
          <section
            ref={replacementRef}
            className="replacement-consumer"
            data-priority="replacement"
            onClick={onReplacementClick}
            style={{ letterSpacing: '2px', opacity: 0.75 }}
          />
        }
        style={{ color: 'rgb(1, 2, 3)', opacity: 0.5 }}
      >
        Composed surface
      </AspectRatio>
    )

    const surface = screen.getByTestId('composed-surface')

    fireEvent.click(surface)

    expect(surface.tagName).toBe('SECTION')
    expect(surface).toHaveTextContent('Composed surface')
    expect(surface).toHaveClass('aspect-ratio-consumer', 'replacement-consumer')
    expect(surface).toHaveStyle({
      color: 'rgb(1, 2, 3)',
      letterSpacing: '2px',
      opacity: '0.75'
    })
    expect(surface).toHaveAttribute('data-priority', 'replacement')
    expect(aspectRatioRef.current).toBe(surface)
    expect(replacementRef.current).toBe(surface)
    expect(onAspectRatioClick).toHaveBeenCalledOnce()
    expect(onReplacementClick).toHaveBeenCalledOnce()
  })

  it('UC-003 / UC-007 / EX-005 - preserves inline ratio precedence and consumer-owned nested-media layout', () => {
    render(
      <AspectRatio
        ratio={1}
        style={{ aspectRatio: '3 / 1' }}
        className="consumer-presentation"
        data-testid="consumer-presentation"
      >
        <div data-testid="nested-layout">
          <img
            className="consumer-thumbnail"
            src="/images/session-thumbnail.jpg"
            alt="Sprint session thumbnail"
          />
          <span>Afternoon sprint session</span>
        </div>
      </AspectRatio>
    )

    const surface = screen.getByTestId('consumer-presentation')
    const nestedLayout = screen.getByTestId('nested-layout')
    const image = screen.getByRole('img', { name: 'Sprint session thumbnail' })

    expect(surface).toHaveStyle({ aspectRatio: '3 / 1' })
    expect(surface).toHaveClass('consumer-presentation')
    expect(nestedLayout.parentElement).toBe(surface)
    expect(image.parentElement).toBe(nestedLayout)
    expect(image).toHaveClass('consumer-thumbnail')
    expect(screen.getByText('Afternoon sprint session').parentElement).toBe(nestedLayout)
  })

  it('UC-008 - forwards consumer accessibility while adding no visual-primitive semantics', () => {
    render(
      <AspectRatio
        ratio={1}
        aria-label="Consumer-owned training region"
        data-testid="accessible-surface"
      >
        <button type="button">Open workout</button>
      </AspectRatio>
    )

    const surface = screen.getByTestId('accessible-surface')
    const button = screen.getByRole('button', { name: 'Open workout' })

    expect(surface).toHaveAttribute('aria-label', 'Consumer-owned training region')
    expect(surface).not.toHaveAttribute('role')
    expect(surface).not.toHaveAttribute('tabindex')
    expect(surface).not.toHaveAttribute('aria-hidden')
    expect(surface).not.toHaveAttribute('aria-live')
    expect(button.parentElement).toBe(surface)
  })

  it('UC-009 / EX-006 - renders the direct component through both package namespace paths', () => {
    expect(PACKAGE_EXPORTS.Components.AspectRatio).toBe(AspectRatio)
    expect(PACKAGE_EXPORTS.Ui.Components).toBe(PACKAGE_EXPORTS.Components)
    expect(PACKAGE_EXPORTS.Ui.Components.AspectRatio).toBe(AspectRatio)

    render(
      <div>
        <PACKAGE_EXPORTS.Components.AspectRatio ratio={1} data-testid="components-surface">
          <img src="/images/mobility.jpg" alt="Athlete stretching" />
        </PACKAGE_EXPORTS.Components.AspectRatio>
        <PACKAGE_EXPORTS.Ui.Components.AspectRatio
          ratio={1}
          fit="contain"
          data-testid="ui-components-surface"
        >
          <img src="/images/strength.jpg" alt="Athlete lifting a barbell" />
        </PACKAGE_EXPORTS.Ui.Components.AspectRatio>
      </div>
    )

    expect(screen.getByTestId('components-surface').firstElementChild).toBe(
      screen.getByRole('img', { name: 'Athlete stretching' })
    )
    expect(screen.getByTestId('ui-components-surface').firstElementChild).toBe(
      screen.getByRole('img', { name: 'Athlete lifting a barbell' })
    )
  })
})
