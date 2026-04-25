import { api } from '@/src/api/api'
const injectedRtkApi = api.injectEndpoints({
  endpoints: (build) => ({
    getCurrentRoster: build.query<GetCurrentRosterApiResponse, GetCurrentRosterApiArg>({
      query: (queryArg) => ({
        url: `/v1/roster/me`,
        params: {
          organizationId: queryArg.organizationId
        }
      })
    })
  }),
  overrideExisting: false
})
export { injectedRtkApi as rosterApi }
export type GetCurrentRosterApiResponse = /** status 200 Default Response */ {
  athletes: Athlete[]
  coach: Coach
  organizations: Organization[]
}
export type GetCurrentRosterApiArg = {
  organizationId?: string
}
export type Athlete = {
  email: string
  firstName: string
  id: number
  lastName: string
  organizationId: number
}
export type Coach = {
  email: string
  firstName: string
  id: number
  lastName: string
}
export type Organization = {
  id: number
  name: string
}
export const { useGetCurrentRosterQuery, useLazyGetCurrentRosterQuery } = injectedRtkApi
