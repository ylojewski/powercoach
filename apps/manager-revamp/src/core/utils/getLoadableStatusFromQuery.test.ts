import { type BaseQueryFn, type TypedUseQueryStateResult } from '@reduxjs/toolkit/query/react'

import { getLoadableStatusFromQuery } from './getLoadableStatusFromQuery'

function createQueryState(
  overrides: Partial<TypedUseQueryStateResult<unknown, unknown, BaseQueryFn>>
): TypedUseQueryStateResult<unknown, unknown, BaseQueryFn> {
  return {
    isError: false,
    isFetching: false,
    isLoading: false,
    isUninitialized: false,
    ...overrides
  } as TypedUseQueryStateResult<unknown, unknown, BaseQueryFn>
}

describe('getLoadableStatusFromQuery', () => {
  it('returns idle when the query is uninitialized', () => {
    expect(getLoadableStatusFromQuery(createQueryState({ isUninitialized: true }))).toBe('idle')
  })

  it('returns error when the query is errored', () => {
    expect(getLoadableStatusFromQuery(createQueryState({ isError: true }))).toBe('error')
  })

  it('returns loading when the query is loading', () => {
    expect(getLoadableStatusFromQuery(createQueryState({ isLoading: true }))).toBe('loading')
  })

  it('returns loading when the query is fetching', () => {
    expect(getLoadableStatusFromQuery(createQueryState({ isFetching: true }))).toBe('loading')
  })

  it('returns ready when the query is fulfilled', () => {
    expect(getLoadableStatusFromQuery(createQueryState({}))).toBe('ready')
  })
})
