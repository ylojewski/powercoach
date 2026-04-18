import { managerApi as api } from '@/src/store/manager'
const injectedRtkApi = api.injectEndpoints({
  endpoints: (build) => ({
    getCurrentCoachContext: build.query<
      GetCurrentCoachContextApiResponse,
      GetCurrentCoachContextApiArg
    >({
      query: () => ({ url: `/v1/coaches/me` })
    })
  }),
  overrideExisting: false
})
export { injectedRtkApi as coachesApi }
export type GetCurrentCoachContextApiResponse = /** status 200 Default Response */ {
  athletes: AthleteSummary[]
  coach: CoachSummary
  organizations: OrganizationSummary[]
}
export type GetCurrentCoachContextApiArg = void
export type AthleteSummary = {
  email: string
  firstName: string
  id: number
  lastName: string
}
export type CoachSummary = {
  email: string
  firstName: string
  id: number
  lastName: string
}
export type OrganizationSummary = {
  id: number
  name: string
}
export const { useGetCurrentCoachContextQuery, useLazyGetCurrentCoachContextQuery } = injectedRtkApi
