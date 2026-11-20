import { type BaseQueryFn } from '@reduxjs/toolkit/query'
import { type TypedUseQuery, type TypedUseQueryHookResult } from '@reduxjs/toolkit/query/react'
import { useEffect, useRef, useState } from 'react'

export const MIN_PENDING_MS = 500

export function usePendingQuery<ResultType, QueryArg, BaseQuery extends BaseQueryFn>(
  useQuery: TypedUseQuery<ResultType, QueryArg, BaseQuery>
): (
  useQueryArg: Parameters<TypedUseQuery<ResultType, QueryArg, BaseQuery>>[0],
  useQueryOptions?: Parameters<TypedUseQuery<ResultType, QueryArg, BaseQuery>>[1]
) => TypedUseQueryHookResult<ResultType, QueryArg, BaseQuery>
export function usePendingQuery(
  useQuery: (
    useQueryArg: never,
    useQueryOptions?: { skip?: boolean }
  ) => { isFetching: boolean; isLoading: boolean }
) {
  return function usePendingQueryHook(useQueryArg: never, useQueryOptions?: { skip?: boolean }) {
    const timeout = useRef(0)
    const [isMinimumPending, setIsMinimumPending] = useState(false)
    const query = useQuery(useQueryArg, useQueryOptions)
    const skip = useQueryOptions?.skip

    useEffect(() => {
      return () => {
        window.clearTimeout(timeout.current)
      }
    }, [])

    useEffect(() => {
      if (skip) {
        window.clearTimeout(timeout.current)
        setIsMinimumPending(false)
        return
      }

      if (query.isFetching) {
        window.clearTimeout(timeout.current)
        setIsMinimumPending(true)
        timeout.current = window.setTimeout(() => {
          setIsMinimumPending(false)
        }, MIN_PENDING_MS)
      }
    }, [query.isFetching, skip])

    const isFetching = query.isFetching || isMinimumPending
    const isLoading = query.isLoading || isFetching

    return Object.assign({}, query, {
      isFetching,
      isLoading
    })
  }
}
