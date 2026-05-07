import { ROSTER_RESPONSE, SETTINGS_RESPONSE } from '@powercoach/util-fixture'
import { type LoaderFunctionArgs } from 'react-router'

import {
  type GetCurrentRosterApiResponse,
  type GetCurrentSettingsApiResponse,
  rosterApi,
  settingsApi
} from '@/api'

import { createStartupLoader } from './createStartupLoader'
import { createStore } from '../store'

const loaderArgs = {
  context: {},
  params: {},
  request: new Request('http://localhost/')
} as unknown as LoaderFunctionArgs

const rosterResponse: GetCurrentRosterApiResponse = {
  athletes: [...ROSTER_RESPONSE.athletes],
  coach: { ...ROSTER_RESPONSE.coach },
  organizations: [...ROSTER_RESPONSE.organizations]
}
const settingsResponse: GetCurrentSettingsApiResponse = { ...SETTINGS_RESPONSE }

function createApiResponse(
  payload: GetCurrentRosterApiResponse | GetCurrentSettingsApiResponse
): Response {
  return new Response(JSON.stringify(payload), {
    headers: { 'Content-Type': 'application/json' },
    status: 200
  })
}

function stubStartupFetch(): ReturnType<typeof vi.fn<typeof fetch>> {
  const fetchMock = vi.fn<typeof fetch>().mockImplementation((input: URL | RequestInfo) => {
    const url =
      typeof input === 'string' ? input : input instanceof URL ? input.toString() : input.url
    const payload = url.endsWith('/v1/settings/me') ? settingsResponse : rosterResponse

    return Promise.resolve(createApiResponse(payload))
  })

  vi.stubGlobal('fetch', fetchMock)

  return fetchMock
}

describe('createStartupLoader', () => {
  afterEach(() => {
    vi.resetAllMocks()
    vi.unstubAllGlobals()
  })

  it('loads settings and roster once and keeps their data in the store', async () => {
    const fetchMock = stubStartupFetch()
    const store = createStore()
    const loader = createStartupLoader(store)

    await expect(loader(loaderArgs)).resolves.toBeNull()
    await expect(loader(loaderArgs)).resolves.toBeNull()

    expect(fetchMock).toHaveBeenCalledTimes(2)
    expect(settingsApi.endpoints.getCurrentSettings.select()(store.getState()).data).toStrictEqual(
      settingsResponse
    )
    expect(rosterApi.endpoints.getCurrentRoster.select({})(store.getState()).data).toStrictEqual(
      rosterResponse
    )
  })

  it('clears the startup request after a loading failure', async () => {
    const fetchMock = vi.fn<typeof fetch>().mockImplementation(() =>
      Promise.resolve(
        new Response(JSON.stringify({}), {
          headers: { 'Content-Type': 'application/json' },
          status: 500
        })
      )
    )
    vi.stubGlobal('fetch', fetchMock)

    const loader = createStartupLoader(createStore())

    await expect(loader(loaderArgs)).rejects.toBeDefined()

    fetchMock.mockImplementation((input: URL | RequestInfo) => {
      const url =
        typeof input === 'string' ? input : input instanceof URL ? input.toString() : input.url
      const payload = url.endsWith('/v1/settings/me') ? settingsResponse : rosterResponse

      return Promise.resolve(createApiResponse(payload))
    })

    await expect(loader(loaderArgs)).resolves.toBeNull()
    expect(fetchMock).toHaveBeenCalledTimes(4)
  })
})
