import { fireEvent, render, screen } from '@testing-library/react'
import { createRef, type ComponentPropsWithoutRef, type ComponentPropsWithRef } from 'react'
import { describe, expect, it, vi } from 'vitest'

import { composeRailsRefs } from './composeRailsRefs'
import { renderRailsElement } from './renderRailsElement'
import { resolveRailsProp } from './resolveRailsProp'

describe('Rails utils', () => {
  it('resolves static, function, and empty state props', () => {
    expect(resolveRailsProp('static-value', { open: false })).toBe('static-value')
    expect(
      resolveRailsProp((state: { open: boolean }) => (state.open ? 'open' : undefined), {
        open: true
      })
    ).toBe('open')
    expect(resolveRailsProp(undefined, { open: false })).toBeUndefined()
  })

  it('composes object and function refs', () => {
    const objectRef = createRef<HTMLButtonElement>()
    const functionRef = vi.fn()

    render(
      <button ref={composeRailsRefs(undefined, objectRef, functionRef)} type="button">
        Ref target
      </button>
    )

    const target = screen.getByRole('button', { name: 'Ref target' })

    expect(objectRef.current).toBe(target)
    expect(functionRef).toHaveBeenCalledWith(target)
  })

  it('preserves callback-ref cleanup and clears refs without cleanup', () => {
    const target = document.createElement('button')
    const objectRef = createRef<HTMLButtonElement>()
    const cleanup = vi.fn()
    const refWithCleanup = vi.fn(() => cleanup)
    const refWithoutCleanup = vi.fn()
    const composedRef = composeRailsRefs(objectRef, refWithCleanup, refWithoutCleanup)
    const composedCleanup = composedRef(target)

    expect(objectRef.current).toBe(target)
    expect(refWithCleanup).toHaveBeenCalledWith(target)
    expect(refWithoutCleanup).toHaveBeenCalledWith(target)
    expect(composedCleanup).toBeTypeOf('function')

    if (typeof composedCleanup === 'function') {
      composedCleanup()
    }

    expect(cleanup).toHaveBeenCalledOnce()
    expect(refWithCleanup).not.toHaveBeenCalledWith(null)
    expect(refWithoutCleanup).toHaveBeenCalledWith(null)
    expect(objectRef.current).toBeNull()
  })

  it('renders fallback, element, and function render surfaces', () => {
    const functionRender = vi.fn((props: Record<string, unknown>) => (
      <a {...props} href="/programs">
        function surface
      </a>
    ))

    render(
      <>
        {renderRailsElement('button', undefined, { children: 'fallback surface' }, {})}
        {renderRailsElement(
          'button',
          <span />,
          {
            children: 'element surface',
            'data-mode': 'element'
          } as ComponentPropsWithoutRef<'button'>,
          {}
        )}
        {renderRailsElement(
          'button',
          functionRender,
          {
            children: 'function surface',
            'data-mode': 'function'
          } as ComponentPropsWithoutRef<'button'>,
          {}
        )}
      </>
    )

    expect(screen.getByRole('button', { name: 'fallback surface' })).toBeInTheDocument()
    expect(screen.getByText('element surface')).toHaveAttribute('data-mode', 'element')
    expect(screen.getByRole('link', { name: 'function surface' })).toHaveAttribute(
      'data-mode',
      'function'
    )
    expect(functionRender).toHaveBeenCalledWith(
      expect.objectContaining({ children: 'function surface' }),
      {}
    )
  })

  it('merges element render override props and refs', () => {
    const calls: string[] = []
    const incomingRef = vi.fn()
    const renderedRef = createRef<HTMLButtonElement>()
    const incomingClick = vi.fn(() => calls.push('incoming'))
    const renderedClick = vi.fn(() => calls.push('rendered'))

    render(
      renderRailsElement(
        'button',
        <button
          className="rendered-class"
          onClick={renderedClick}
          ref={renderedRef}
          style={{ color: 'red' }}
          type="button"
        />,
        {
          children: 'element surface',
          className: 'incoming-class',
          'data-mode': 'element',
          onClick: incomingClick,
          ref: incomingRef,
          style: { backgroundColor: 'black' },
          type: 'button'
        } as ComponentPropsWithRef<'button'>,
        {},
        {
          className: 'enforced-class',
          'data-mode': 'enforced'
        } as ComponentPropsWithRef<'button'>
      )
    )

    const surface = screen.getByRole('button', { name: 'element surface' })

    expect(surface).toHaveAttribute('data-mode', 'enforced')
    expect(surface).toHaveClass('incoming-class', 'rendered-class', 'enforced-class')
    expect(surface.style.backgroundColor).toBe('black')
    expect(surface.style.color).toBe('red')
    expect(renderedRef.current).toBe(surface)
    expect(incomingRef).toHaveBeenCalledWith(surface)

    fireEvent.click(surface)

    expect(calls).toEqual(['rendered', 'incoming'])
  })
})
