import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const apiBaseUrl =
  typeof window === 'undefined'
    ? 'http://localhost/api'
    : new URL('/api', window.location.origin).toString()

export const apiSlice = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: apiBaseUrl
  }),
  endpoints: () => ({}),
  reducerPath: 'api'
})
