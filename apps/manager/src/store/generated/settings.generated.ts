import { managerApi as api } from '@/src/store/manager'
const injectedRtkApi = api.injectEndpoints({
  endpoints: (build) => ({
    getCurrentSettings: build.query<GetCurrentSettingsApiResponse, GetCurrentSettingsApiArg>({
      query: () => ({ url: `/v1/settings/me` })
    })
  }),
  overrideExisting: false
})
export { injectedRtkApi as settingsApi }
export type GetCurrentSettingsApiResponse = /** status 200 Default Response */ {
  defaultOrganizationId: number
}
export type GetCurrentSettingsApiArg = void
export const { useGetCurrentSettingsQuery, useLazyGetCurrentSettingsQuery } = injectedRtkApi
