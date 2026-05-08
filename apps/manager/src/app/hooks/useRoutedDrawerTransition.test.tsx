import { act, renderHook } from '@testing-library/react'
import { type PropsWithChildren, type ReactElement } from 'react'
import { MemoryRouter } from 'react-router'

import { useRoutedDrawerTransition } from './useRoutedDrawerTransition'
import { RouterPath } from '../constants'

function createWrapper(initialEntry: string): ({ children }: PropsWithChildren) => ReactElement {
  return function Wrapper({ children }: PropsWithChildren): ReactElement {
    return <MemoryRouter initialEntries={[initialEntry]}>{children}</MemoryRouter>
  }
}

describe('useRoutedDrawerTransition', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('opens the drawer and renders the transition overlay while the route matches', () => {
    vi.useFakeTimers()

    const { result } = renderHook(
      () =>
        useRoutedDrawerTransition({
          delay: 250,
          pathname: RouterPath.Home
        }),
      { wrapper: createWrapper(RouterPath.Home) }
    )

    expect(result.current.isOpened).toBe(true)
    expect(result.current.isPathnameMatching).toBe(true)
    expect(result.current.isAnimating).toBe(true)
    expect(result.current.drawerTransitionOverlay).not.toBeNull()

    act(() => {
      vi.advanceTimersByTime(250)
    })

    expect(result.current.isAnimating).toBe(false)
    expect(result.current.drawerTransitionOverlay).toBeNull()
  })

  it('keeps the drawer closed and hides the transition overlay when the route does not match', () => {
    vi.useFakeTimers()

    const { result } = renderHook(
      () =>
        useRoutedDrawerTransition({
          pathname: RouterPath.Home
        }),
      { wrapper: createWrapper('/missing') }
    )

    expect(result.current.isOpened).toBe(false)
    expect(result.current.isPathnameMatching).toBe(false)
    expect(result.current.drawerTransitionOverlay).toBeNull()
  })

  it('matches descendant routes when requested', () => {
    vi.useFakeTimers()

    const { result } = renderHook(
      () =>
        useRoutedDrawerTransition({
          matchDescendants: true,
          pathname: RouterPath.Exercise
        }),
      { wrapper: createWrapper(RouterPath.ExerciseNew) }
    )

    expect(result.current.isOpened).toBe(true)
    expect(result.current.isPathnameMatching).toBe(true)
  })

  it('does not match similarly prefixed routes as descendants', () => {
    vi.useFakeTimers()

    const { result } = renderHook(
      () =>
        useRoutedDrawerTransition({
          matchDescendants: true,
          pathname: RouterPath.Exercise
        }),
      { wrapper: createWrapper('/exercise-other') }
    )

    expect(result.current.isOpened).toBe(false)
    expect(result.current.isPathnameMatching).toBe(false)
  })
})
