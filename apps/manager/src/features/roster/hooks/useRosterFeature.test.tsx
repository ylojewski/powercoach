import { ROSTER_RESPONSE, SETTINGS_RESPONSE } from '@powercoach/util-fixture'
import { act, renderHook, waitFor } from '@testing-library/react'
import { type PropsWithChildren, type ReactElement } from 'react'
import { Provider } from 'react-redux'

import {
  AUTHENTICATED_COACH_EMAIL,
  type GetCurrentRosterApiResponse,
  type GetCurrentSettingsApiResponse,
  settingsApi
} from '@/src/api'
import { createStore, type Store } from '@/src/store'

import { activateAthlete, selectActivatedAthlete } from '../store'
import { useRosterFeature } from './useRosterFeature'

const rosterResponse: GetCurrentRosterApiResponse = {
  athletes: [...ROSTER_RESPONSE.athletes],
  coach: {
    ...ROSTER_RESPONSE.coach,
    email: AUTHENTICATED_COACH_EMAIL
  },
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

function stubFeatureFetch(settingsPayload: GetCurrentSettingsApiResponse = settingsResponse): void {
  vi.stubGlobal(
    'fetch',
    vi.fn().mockImplementation((input: URL | RequestInfo) => {
      const url =
        typeof input === 'string' ? input : input instanceof URL ? input.toString() : input.url
      const payload = url.endsWith('/v1/settings/me') ? settingsPayload : rosterResponse

      return Promise.resolve(createApiResponse(payload))
    })
  )
}

function createWrapper(
  store: Store = createStore(),
  settingsPayload?: GetCurrentSettingsApiResponse
): ({ children }: PropsWithChildren) => ReactElement {
  stubFeatureFetch(settingsPayload)

  return function Wrapper({ children }: PropsWithChildren): ReactElement {
    return <Provider store={store}>{children}</Provider>
  }
}

describe('useRosterFeature', () => {
  afterEach(() => {
    vi.resetAllMocks()
    vi.unstubAllGlobals()
  })

  it('loads roster data and derives the default organization from settings', async () => {
    const store = createStore()
    const { result } = renderHook(() => useRosterFeature(), {
      wrapper: createWrapper(store)
    })

    expect(result.current.isLoading).toBe(true)

    let unloadRoster: VoidFunction | undefined

    act(() => {
      store.dispatch(settingsApi.endpoints.getCurrentSettings.initiate())
      unloadRoster = result.current.load()
    })

    await waitFor(() => {
      expect(result.current.defaultOrganization).toStrictEqual(rosterResponse.organizations[0])
    })

    expect(result.current.athletes).toStrictEqual(rosterResponse.athletes)
    expect(result.current.coach).toStrictEqual(rosterResponse.coach)
    expect(result.current.isLoading).toBe(false)

    act(() => {
      unloadRoster?.()
    })
  })

  it('exposes no default organization when settings do not match roster organizations', async () => {
    const store = createStore()
    const { result } = renderHook(() => useRosterFeature(), {
      wrapper: createWrapper(store, { defaultOrganizationId: 999 })
    })

    act(() => {
      store.dispatch(settingsApi.endpoints.getCurrentSettings.initiate())
      result.current.load()
    })

    await waitFor(() => {
      expect(result.current.athletes).toStrictEqual(rosterResponse.athletes)
    })

    expect(result.current.defaultOrganization).toBeNull()
  })

  it('activates the athlete from the current athlete route', async () => {
    const store = createStore()
    const { result } = renderHook(() => useRosterFeature(), {
      wrapper: createWrapper(store)
    })

    act(() => {
      result.current.load()
    })

    await waitFor(() => {
      expect(result.current.athletes).toStrictEqual(rosterResponse.athletes)
    })

    let syncResult: ReturnType<typeof result.current.sync> | undefined

    act(() => {
      syncResult = result.current.sync({ athleteSlug: 'kiro-flux' })
    })

    await waitFor(() => {
      expect(selectActivatedAthlete(store.getState())).toStrictEqual(rosterResponse.athletes[0])
    })

    expect(syncResult).toBe('synced')
    expect(result.current.activatedAthlete).toStrictEqual(rosterResponse.athletes[0])
  })

  it('clears the activated athlete when no athlete route is active', async () => {
    const store = createStore()
    const firstAthlete = rosterResponse.athletes[0]

    if (!firstAthlete) {
      throw new Error('Expected at least one athlete in the roster fixture')
    }

    store.dispatch(activateAthlete(firstAthlete))

    const { result } = renderHook(() => useRosterFeature(), {
      wrapper: createWrapper(store)
    })

    act(() => {
      result.current.load()
    })

    await waitFor(() => {
      expect(result.current.athletes).toStrictEqual(rosterResponse.athletes)
    })

    let syncResult: ReturnType<typeof result.current.sync> | undefined

    act(() => {
      syncResult = result.current.sync({})
    })

    await waitFor(() => {
      expect(selectActivatedAthlete(store.getState())).toBeNull()
    })

    expect(syncResult).toBe('synced')
    expect(result.current.activatedAthlete).toBeNull()
  })

  it('clears the activated athlete when the current athlete route does not match the roster', async () => {
    const store = createStore()
    const firstAthlete = rosterResponse.athletes[0]

    if (!firstAthlete) {
      throw new Error('Expected at least one athlete in the roster fixture')
    }

    store.dispatch(activateAthlete(firstAthlete))

    const { result } = renderHook(() => useRosterFeature(), {
      wrapper: createWrapper(store)
    })

    act(() => {
      result.current.load()
    })

    await waitFor(() => {
      expect(result.current.athletes).toStrictEqual(rosterResponse.athletes)
    })

    let syncResult: ReturnType<typeof result.current.sync> | undefined

    act(() => {
      syncResult = result.current.sync({ athleteSlug: 'unknown-athlete' })
    })

    await waitFor(() => {
      expect(selectActivatedAthlete(store.getState())).toBeNull()
    })

    expect(syncResult).toBe('not-found')
    expect(result.current.activatedAthlete).toBeNull()
  })

  it('keeps the activated athlete unchanged when syncing before roster is loaded', () => {
    const store = createStore()
    const firstAthlete = rosterResponse.athletes[0]

    if (!firstAthlete) {
      throw new Error('Expected at least one athlete in the roster fixture')
    }

    store.dispatch(activateAthlete(firstAthlete))

    const { result } = renderHook(() => useRosterFeature(), {
      wrapper: createWrapper(store)
    })

    let syncResult: ReturnType<typeof result.current.sync> | undefined

    act(() => {
      syncResult = result.current.sync({ athleteSlug: 'kiro-flux' })
    })

    expect(syncResult).toBe('pending')
    expect(selectActivatedAthlete(store.getState())).toStrictEqual(firstAthlete)
  })
})
