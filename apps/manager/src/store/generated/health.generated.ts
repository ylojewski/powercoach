import { managerApi as api } from '@/src/store/manager'
const injectedRtkApi = api.injectEndpoints({
  endpoints: (build) => ({
    getHealthStatus: build.query<GetHealthStatusApiResponse, GetHealthStatusApiArg>({
      query: () => ({ url: `/v1/health/` })
    })
  }),
  overrideExisting: false
})
export { injectedRtkApi as healthApi }
export type GetHealthStatusApiResponse = /** status 200 Default Response */ {
  database: boolean
  live: boolean
  ready: boolean
  uptime: number
}
export type GetHealthStatusApiArg = void
export const { useGetHealthStatusQuery, useLazyGetHealthStatusQuery } = injectedRtkApi
