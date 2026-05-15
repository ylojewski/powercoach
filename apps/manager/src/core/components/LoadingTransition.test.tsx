import { act, fireEvent, render, screen } from '@testing-library/react'

import { LoadingTransition } from './LoadingTransition'

function fireAnimationEnd(element: Element, animationName: string): void {
  const event = new Event('animationend', { bubbles: true, cancelable: false })

  Object.defineProperty(event, 'animationName', {
    value: animationName
  })

  fireEvent(element, event)
}

describe('LoadingTransition', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('renders children immediately when loading is complete', () => {
    render(
      <LoadingTransition loading={false}>
        <div>Application content</div>
      </LoadingTransition>
    )

    expect(screen.getByText('Application content')).toBeInTheDocument()
    expect(screen.queryByLabelText('loading powercoach')).not.toBeInTheDocument()
  })

  it('renders children after the loading overlay has clipped in', () => {
    vi.useFakeTimers()

    const { rerender } = render(
      <LoadingTransition loading>
        <div>Application content</div>
      </LoadingTransition>
    )

    const overlay = screen.getByLabelText('loading powercoach')
    const overlayContent = overlay.firstElementChild as HTMLElement

    expect(screen.getByTestId('loading-transition-background').className).toContain('bg-white')
    expect(screen.queryByText('Application content')).not.toBeInTheDocument()

    rerender(
      <LoadingTransition loading={false}>
        <div>Application content</div>
      </LoadingTransition>
    )

    expect(screen.queryByText('Application content')).not.toBeInTheDocument()

    fireAnimationEnd(overlayContent, 'clip-in-ltr')

    expect(screen.getByText('Application content')).toBeInTheDocument()
    expect(screen.queryByTestId('loading-transition-background')).not.toBeInTheDocument()
    expect(screen.getByLabelText('loading powercoach')).toBeInTheDocument()

    act(() => {
      vi.advanceTimersByTime(1000)
    })

    expect(screen.getByLabelText('loading powercoach').className).toContain('pointer-events-none')

    fireAnimationEnd(overlayContent, 'clip-out-ltr')

    expect(screen.queryByLabelText('loading powercoach')).not.toBeInTheDocument()
  })

  it('can render the overlay within its own container', () => {
    render(
      <section data-testid="loading-container">
        <LoadingTransition contained loading>
          <div>Drawer content</div>
        </LoadingTransition>
      </section>
    )

    const container = screen.getByTestId('loading-container')
    const overlay = screen.getByLabelText('loading powercoach')

    expect(container).toContainElement(overlay)
    expect(overlay.className).toContain('absolute')
    expect(screen.getByTestId('loading-transition-background').className).toContain('absolute')
  })
})
