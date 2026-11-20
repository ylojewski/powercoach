import { renderHook } from '@testing-library/react'
import { type PropsWithChildren, type ReactElement } from 'react'
import { Provider } from 'react-redux'

import { createStore } from '@/app'

import { useAppDispatch } from './useAppDispatch'
import { useAppSelector } from './useAppSelector'

function Wrapper({ children }: PropsWithChildren): ReactElement {
  return <Provider store={createStore()}>{children}</Provider>
}

describe('store hooks', () => {
  it('exposes the typed store dispatch and selector hooks', () => {
    const { result } = renderHook(
      () => ({
        api: useAppSelector((state) => state.api),
        dispatch: useAppDispatch()
      }),
      { wrapper: Wrapper }
    )

    expect(result.current.dispatch).toEqual(expect.any(Function))
    expect(result.current.api).toHaveProperty('queries')
  })
})
