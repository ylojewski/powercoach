import { act, createEvent, fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { TilesTile } from './TilesTile'
import {
  tilesRootContext,
  type TilesGeometry,
  type TilesRootContextValue
} from '../constants/tilesRootContext'

const GEOMETRY: TilesGeometry = {
  height: 100,
  left: 0,
  separatorBlockEnd: false,
  separatorInlineEnd: false,
  top: 0,
  width: 100
}

function createContext(left: number, completeGeometryTransition = vi.fn()) {
  const geometries = new Map([['content', { ...GEOMETRY, left }]])

  return {
    baseGeometries: geometries,
    completeGeometryTransition,
    layoutState: {
      geometries,
      layoutKey: 'base',
      movingProperties: new Map([['content', new Set(['left' as const])]]),
      targetVersions: new Map([['content', new Map([['left' as const, left]])]]),
      transitionsSuppressed: false
    },
    separatorBlockEndClassName: 'border-b-1',
    separatorColor: 'currentColor',
    separatorInlineEndClassName: 'border-e-1'
  } satisfies TilesRootContextValue
}

function dispatchTransition(
  element: HTMLElement,
  type: 'transitioncancel' | 'transitionend' | 'transitionrun',
  propertyName: string
) {
  const event =
    type === 'transitioncancel'
      ? createEvent.transitionCancel(element)
      : type === 'transitionend'
        ? createEvent.transitionEnd(element)
        : createEvent.transitionRun(element)

  Object.defineProperty(event, 'propertyName', { value: propertyName })
  fireEvent(element, event)
}

describe('TilesTile', () => {
  it('filters unrelated geometry events and ignores cancellation from a replaced target', () => {
    const completeGeometryTransition = vi.fn()
    const initialContext = createContext(0, completeGeometryTransition)
    const rendered = render(
      <tilesRootContext.Provider value={initialContext}>
        <TilesTile area="content">
          <span data-testid="child">Content</span>
        </TilesTile>
      </tilesRootContext.Provider>
    )
    const tile = screen.getByTestId('child').parentElement as HTMLElement
    const child = screen.getByTestId('child')

    act(() => {
      dispatchTransition(child, 'transitionrun', 'left')
      dispatchTransition(tile, 'transitionrun', 'opacity')
      dispatchTransition(tile, 'transitionrun', 'left')
      dispatchTransition(child, 'transitioncancel', 'left')
      dispatchTransition(tile, 'transitioncancel', 'opacity')
    })

    expect(completeGeometryTransition).not.toHaveBeenCalled()

    const retargetedContext = createContext(25, completeGeometryTransition)

    rendered.rerender(
      <tilesRootContext.Provider value={retargetedContext}>
        <TilesTile area="content">
          <span data-testid="child">Content</span>
        </TilesTile>
      </tilesRootContext.Provider>
    )

    act(() => {
      dispatchTransition(tile, 'transitioncancel', 'left')
      dispatchTransition(child, 'transitionend', 'left')
      dispatchTransition(tile, 'transitionend', 'opacity')
      dispatchTransition(tile, 'transitionend', 'left')
    })

    expect(completeGeometryTransition).not.toHaveBeenCalled()

    act(() => {
      dispatchTransition(tile, 'transitionrun', 'left')
      dispatchTransition(tile, 'transitioncancel', 'left')
    })

    expect(completeGeometryTransition).toHaveBeenCalledOnce()
    expect(completeGeometryTransition).toHaveBeenCalledWith('content', 'left')
  })
})
