import { renderHook } from '@testing-library/react'
import { type PropsWithChildren, type ReactElement } from 'react'
import { Provider } from 'react-redux'
import { MemoryRouter } from 'react-router'

import { createStore } from '@/app'

import { useNavigation } from './useNavigation'

function Wrapper({ children }: PropsWithChildren): ReactElement {
  return (
    <Provider store={createStore()}>
      <MemoryRouter>{children}</MemoryRouter>
    </Provider>
  )
}

describe('useNavigation', () => {
  it('exposes app navigation augmented by mounted modules', () => {
    const { result } = renderHook(() => useNavigation(), { wrapper: Wrapper })

    expect(result.current.index()).toBe('/')
    expect(result.current.homeIndex()).toBe('/')
  })
})
