import { render, screen } from '@testing-library/react'
import { type ReactElement } from 'react'
import { describe, expect, it, vi } from 'vitest'

import { Card } from './Card'
import { cardVariants } from './constants/cardVariants'

describe('Card implementation', () => {
  it('resolves Root and Surface state props and supports a null Surface render', () => {
    const rootClassName = vi.fn(() => 'root-state-class')
    const rootStyle = vi.fn(() => ({ minHeight: 120 }))
    const surfaceStyle = vi.fn(() => ({ color: 'rgb(1, 2, 3)' }))

    render(
      <>
        <Card.Root className={rootClassName} data-testid="stateful-root" style={rootStyle}>
          <Card.Surface data-testid="stateful-surface" style={surfaceStyle}>
            stateful surface
          </Card.Surface>
        </Card.Root>
        <Card.Root data-testid="empty-root">
          <Card.Surface render={() => null as unknown as ReactElement} />
        </Card.Root>
      </>
    )

    const root = screen.getByTestId('stateful-root')
    const surface = root.querySelector<HTMLElement>(
      '[data-testid="stateful-surface"][data-reveal-source]'
    )

    expect(root).toHaveClass('root-state-class')
    expect(root).toHaveStyle({ minHeight: '120px' })
    expect(surface).toBeInTheDocument()
    expect(surface as HTMLElement).toHaveStyle({ color: 'rgb(1, 2, 3)' })
    expect(screen.getByTestId('empty-root')).toBeEmptyDOMElement()
    expect(rootClassName).toHaveBeenCalledWith({
      disabled: false,
      readOnly: false,
      selectable: false,
      selected: false,
      size: 'md'
    })
    expect(rootStyle).toHaveBeenCalled()
    expect(surfaceStyle).toHaveBeenCalled()
  })

  it('scopes midpoint variants to the current rendered Selector branch', () => {
    const rootClassName = cardVariants.root({ selectable: true, selected: false })
    const midpointClasses = rootClassName
      .split(/\s+/)
      .filter(
        (className) =>
          className.includes('translate:-0.0625rem_-0.0625rem') ||
          className.includes('box-shadow:0.125rem_0.125rem_0_0_var(--color-border)')
      )

    expect(midpointClasses).toHaveLength(2)
    for (const className of midpointClasses) {
      expect(className).toContain(
        ':has(>:not([data-motion=reveal]):is([role=radio]:hover,:has([role=radio]:hover)))'
      )
      expect(className).toContain(':not([data-selected])')
      expect(className).toContain(':not([data-disabled])')
      expect(className).toContain(':not([data-readonly])')
    }
  })
})
