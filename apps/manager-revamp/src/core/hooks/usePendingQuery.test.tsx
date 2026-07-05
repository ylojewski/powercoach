import { type BaseQueryFn } from '@reduxjs/toolkit/query'
import { type TypedUseQuery, type TypedUseQueryHookResult } from '@reduxjs/toolkit/query/react'
import { act, renderHook } from '@testing-library/react'

import { MIN_PENDING_MS, usePendingQuery } from './usePendingQuery'

type QueryResult = TypedUseQueryHookResult<unknown, void, BaseQueryFn>

function createQueryResult({
  isFetching = false,
  isLoading = false
}: {
  isFetching?: boolean
  isLoading?: boolean
} = {}): QueryResult {
  return { isFetching, isLoading } as QueryResult
}

describe('usePendingQuery', () => {
  let queryResult: QueryResult
  let useQuery: TypedUseQuery<unknown, void, BaseQueryFn>

  beforeEach(() => {
    vi.useFakeTimers()
    queryResult = createQueryResult()
    useQuery = vi.fn(() => queryResult) as unknown as typeof useQuery
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('returns a settled query unchanged', () => {
    const usePendingQueryHook = usePendingQuery(useQuery)
    const { result, unmount } = renderHook(() => usePendingQueryHook(undefined))

    expect(result.current.isFetching).toBe(false)
    expect(result.current.isLoading).toBe(false)

    unmount()
  })

  it('keeps a fetching query pending for the minimum duration', () => {
    queryResult = createQueryResult({ isFetching: true })
    const usePendingQueryHook = usePendingQuery(useQuery)
    const { result, rerender } = renderHook(() => usePendingQueryHook(undefined))

    expect(result.current.isFetching).toBe(true)
    expect(result.current.isLoading).toBe(true)

    queryResult = createQueryResult()
    rerender()
    expect(result.current.isFetching).toBe(true)

    act(() => {
      vi.advanceTimersByTime(MIN_PENDING_MS)
    })

    expect(result.current.isFetching).toBe(false)
    expect(result.current.isLoading).toBe(false)
  })

  it('preserves the query loading state', () => {
    queryResult = createQueryResult({ isLoading: true })
    const usePendingQueryHook = usePendingQuery(useQuery)
    const { result } = renderHook(() => usePendingQueryHook(undefined))

    expect(result.current.isFetching).toBe(false)
    expect(result.current.isLoading).toBe(true)
  })

  it('clears pending state when the query is skipped', () => {
    queryResult = createQueryResult({ isFetching: true })
    const usePendingQueryHook = usePendingQuery(useQuery)
    const { result, rerender } = renderHook(
      ({ skip }: { skip: boolean }) => usePendingQueryHook(undefined, { skip }),
      { initialProps: { skip: false } }
    )

    queryResult = createQueryResult()
    rerender({ skip: true })

    expect(result.current.isFetching).toBe(false)
    expect(result.current.isLoading).toBe(false)
  })
})
