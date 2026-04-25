import { api } from '@/src/api'

import { createStore } from './store'

const PROBE_RESPONSE = { ok: true } as const

const {
  endpoints: { getStoreProbe }
} = api.injectEndpoints({
  endpoints: (build) => ({
    getStoreProbe: build.query<{ ok: boolean }, undefined>({
      query: () => ({ url: '/v1/store-probe' })
    })
  }),
  overrideExisting: false
})

function createSuccessResponse() {
  return new Response(JSON.stringify(PROBE_RESPONSE), {
    headers: { 'Content-Type': 'application/json' },
    status: 200
  })
}

describe('createStore', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('wires the manager reducer and middleware into a fresh store', async () => {
    const fetchMock = vi.fn().mockResolvedValue(createSuccessResponse())

    vi.stubGlobal('fetch', fetchMock)

    const store = createStore()
    const query = store.dispatch(getStoreProbe.initiate(undefined))

    expect(await query.unwrap()).toStrictEqual(PROBE_RESPONSE)

    const state = store.getState()

    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(state).toHaveProperty(api.reducerPath)
    expect(state).toHaveProperty('roster')
    expect(getStoreProbe.select(undefined)(state)).toMatchObject({
      data: PROBE_RESPONSE,
      status: 'fulfilled'
    })

    query.unsubscribe()
  })

  it('returns isolated store instances', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(createSuccessResponse()))

    const firstStore = createStore()
    const secondStore = createStore()
    const query = firstStore.dispatch(getStoreProbe.initiate(undefined))

    expect(await query.unwrap()).toStrictEqual(PROBE_RESPONSE)

    const firstState = firstStore.getState()
    const secondState = secondStore.getState()

    expect(getStoreProbe.select(undefined)(firstState)).toMatchObject({
      data: PROBE_RESPONSE,
      status: 'fulfilled'
    })
    expect(getStoreProbe.select(undefined)(secondState).status).toBe('uninitialized')

    query.unsubscribe()
  })
})
