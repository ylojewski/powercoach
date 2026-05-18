import { fireEvent, render, screen } from '@testing-library/react'

import { LoadingOverlay } from './LoadingOverlay'

function fireAnimationEnd(element: Element, animationName: string): void {
  const event = new Event('animationend', { bubbles: true, cancelable: false })

  Object.defineProperty(event, 'animationName', {
    value: animationName
  })

  fireEvent(element, event)
}

describe('LoadingOverlay', () => {
  it('ignores bubbled animation events from its children', () => {
    const onClipInComplete = vi.fn()

    render(<LoadingOverlay contained onClipInComplete={onClipInComplete} />)

    const logo = screen.getByLabelText('loading powercoach').querySelector('svg')

    if (!logo) {
      throw new Error('Expected the loading logo to render')
    }

    fireAnimationEnd(logo, 'clip-in-ltr')

    expect(onClipInComplete).not.toHaveBeenCalled()
  })

  it('only completes the clip-out animation once', () => {
    const onClipOutComplete = vi.fn()

    render(<LoadingOverlay contained exiting onClipOutComplete={onClipOutComplete} />)

    const overlayContent = screen.getByLabelText('loading powercoach').firstElementChild

    if (!overlayContent) {
      throw new Error('Expected the loading overlay content to render')
    }

    fireAnimationEnd(overlayContent, 'clip-out-ltr')
    fireAnimationEnd(overlayContent, 'clip-out-ltr')

    expect(onClipOutComplete).toHaveBeenCalledTimes(1)
  })
})
