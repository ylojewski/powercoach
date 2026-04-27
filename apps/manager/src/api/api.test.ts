import { createStore } from '@/core'

import { api, AUTHENTICATED_COACH_EMAIL, COACH_EMAIL_HEADER } from './api'

const PROBE_RESPONSE = { ok: true } as const

describe('api', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('prefixes requests with /api and seeds the authenticated coach header', async () => {
    const {
      endpoints: { getManagerProbe }
    } = api.injectEndpoints({
      endpoints: (build) => ({
        getManagerProbe: build.query<{ ok: boolean }, undefined>({
          query: () => ({ url: '/v1/manager-probe' })
        })
      }),
      overrideExisting: false
    })
    const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(
      new Response(JSON.stringify(PROBE_RESPONSE), {
        headers: { 'Content-Type': 'application/json' },
        status: 200
      })
    )

    vi.stubGlobal('fetch', fetchMock)

    const store = createStore()
    const query = store.dispatch(getManagerProbe.initiate(undefined))

    expect(await query.unwrap()).toStrictEqual(PROBE_RESPONSE)

    const [{ headers, url }] = fetchMock.mock.calls[0] as [Request]

    expect(url).toBe(new URL('/api/v1/manager-probe', window.location.origin).toString())
    expect(headers.get(COACH_EMAIL_HEADER)).toBe(AUTHENTICATED_COACH_EMAIL)

    query.unsubscribe()
  })

  it('falls back to the localhost api base url when window is unavailable', async () => {
    vi.resetModules()
    vi.stubGlobal('window', undefined)

    const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(
      new Response(JSON.stringify(PROBE_RESPONSE), {
        headers: { 'Content-Type': 'application/json' },
        status: 200
      })
    )

    vi.stubGlobal('fetch', fetchMock)

    const apiModule = await import('./api')
    const coreModule = await import('@/core')

    const {
      endpoints: { getFallbackManagerProbe }
    } = apiModule.api.injectEndpoints({
      endpoints: (build) => ({
        getFallbackManagerProbe: build.query<{ ok: boolean }, undefined>({
          query: () => ({ url: '/v1/manager-probe' })
        })
      }),
      overrideExisting: false
    })

    const store = coreModule.createStore()
    const query = store.dispatch(getFallbackManagerProbe.initiate(undefined))

    await query.unwrap()

    const [{ url }] = fetchMock.mock.calls[0] as [Request]

    expect(url).toBe('http://localhost/api/v1/manager-probe')

    query.unsubscribe()
  })
})
