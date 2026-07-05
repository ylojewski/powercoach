import { type BaseQueryFn, type TypedUseQueryStateResult } from '@reduxjs/toolkit/query/react'

import { type LoadableStatus } from '../types'

export function getLoadableStatusFromQuery({
  isError,
  isFetching,
  isLoading,
  isUninitialized
}: TypedUseQueryStateResult<unknown, unknown, BaseQueryFn>): LoadableStatus {
  if (isUninitialized) {
    return 'idle'
  }

  if (isError) {
    return 'error'
  }

  if (isLoading || isFetching) {
    return 'loading'
  }

  return 'ready'
}
