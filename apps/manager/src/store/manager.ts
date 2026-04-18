import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const COACH_EMAIL_HEADER = 'x-coach-email' as const
export const AUTHENTICATED_COACH_EMAIL = 'astra.quill@example.test' as const

const apiBaseUrl =
  typeof window === 'undefined'
    ? 'http://localhost/api'
    : new URL('/api', window.location.origin).toString()

export const managerApi = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: apiBaseUrl,
    prepareHeaders: (headers) => {
      headers.set(COACH_EMAIL_HEADER, AUTHENTICATED_COACH_EMAIL)
      return headers
    }
  }),
  endpoints: () => ({}),
  reducerPath: 'manager'
})
