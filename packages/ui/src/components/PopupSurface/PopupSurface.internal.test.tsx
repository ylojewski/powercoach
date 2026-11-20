import { render, screen } from '@testing-library/react'
import { type ComponentPropsWithRef, type CSSProperties } from 'react'

import { PopupSurface } from './PopupSurface'

describe('PopupSurface implementation', () => {
  it('preserves Group and GroupLabel callback renders and style state', () => {
    const groupStyle = vi.fn((): CSSProperties => ({ opacity: 0.75 }))
    const labelStyle = vi.fn((): CSSProperties => ({ color: 'rgb(1, 2, 3)' }))

    render(
      <PopupSurface.Group
        render={(props, state) => (
          <section {...props} data-group-state-keys={Object.keys(state).length} />
        )}
        style={groupStyle}
      >
        <PopupSurface.GroupLabel
          render={(props, state) => (
            <header {...props} data-label-state-keys={Object.keys(state).length} />
          )}
          style={labelStyle}
        >
          Strength
        </PopupSurface.GroupLabel>
        <PopupSurface.GroupLabel data-testid="base-label">Recovery</PopupSurface.GroupLabel>
      </PopupSurface.Group>
    )

    const group = screen.getByText('Strength').parentElement
    const label = screen.getByText('Strength')
    const baseLabel = screen.getByTestId('base-label')

    expect(group).toHaveAttribute('data-group-state-keys', '0')
    expect(group).toHaveStyle({ opacity: '0.75' })
    expect(label.tagName).toBe('HEADER')
    expect(label).toHaveAttribute('data-label-state-keys', '0')
    expect(label).toHaveAttribute('data-popup-surface-group-label')
    expect(label).toHaveStyle({ color: 'rgb(1, 2, 3)' })
    expect(baseLabel).toHaveAttribute('data-popup-surface-group-label')
    expect(groupStyle).toHaveBeenCalledWith({})
    expect(labelStyle).toHaveBeenCalledWith({})
  })

  it('preserves an immediate Item render callback and its resolved state', () => {
    render(
      <PopupSurface.Item
        render={(props, state) => (
          <a
            {...(props as unknown as ComponentPropsWithRef<'a'>)}
            data-rendered-size={state.size}
            href="settings"
          />
        )}
        reveal
        revealAnimationProps={false}
        size="md"
      >
        Settings
      </PopupSurface.Item>
    )

    expect(screen.getByRole('link', { name: 'Settings' })).toHaveAttribute(
      'data-rendered-size',
      'md'
    )
  })
})
