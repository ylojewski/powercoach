import { renderHook } from '@testing-library/react'
import { type PropsWithChildren, type ReactElement } from 'react'
import { MemoryRouter } from 'react-router'

import { useBackgroundLocationState } from './useBackgroundLocationState'
import { RouterPath } from '../constants'

function createWrapper(state: unknown): ({ children }: PropsWithChildren) => ReactElement {
  return function Wrapper({ children }: PropsWithChildren): ReactElement {
    return (
      <MemoryRouter initialEntries={[{ pathname: RouterPath.Home, state }]}>
        {children}
      </MemoryRouter>
    )
  }
}

describe('useBackgroundLocationState', () => {
  it('returns null when location has no state', () => {
    const { result } = renderHook(() => useBackgroundLocationState(), {
      wrapper: createWrapper(null)
    })

    expect(result.current).toBeNull()
  })

  it('returns null when state is not an object', () => {
    const { result } = renderHook(() => useBackgroundLocationState(), {
      wrapper: createWrapper('not-an-object')
    })

    expect(result.current).toBeNull()
  })

  it('returns null when state has no backgroundLocation key', () => {
    const { result } = renderHook(() => useBackgroundLocationState(), {
      wrapper: createWrapper({ unrelated: true })
    })

    expect(result.current).toBeNull()
  })

  it('returns the state when it carries a backgroundLocation', () => {
    const backgroundLocation = {
      hash: '',
      key: 'bg',
      pathname: RouterPath.Home,
      search: '',
      state: null
    }

    const { result } = renderHook(() => useBackgroundLocationState(), {
      wrapper: createWrapper({ backgroundLocation })
    })

    expect(result.current).toEqual({ backgroundLocation })
  })
})
