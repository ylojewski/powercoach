import { ROSTER_RESPONSE, SETTINGS_RESPONSE } from '@powercoach/util-fixture'
import { act, renderHook, waitFor } from '@testing-library/react'
import { type PropsWithChildren, type ReactElement } from 'react'
import { Provider } from 'react-redux'
import { generatePath, MemoryRouter, Route, Routes } from 'react-router'

import {
  AUTHENTICATED_COACH_EMAIL,
  type GetCurrentRosterApiResponse,
  type GetCurrentSettingsApiResponse,
  rosterApi,
  settingsApi
} from '@/src/api'
import { RouterPath } from '@/src/constants'
import { createStore, type Store } from '@/src/store'

import { activateAthlete, selectActivatedAthlete } from '../store'
import { getAthleteSlug } from '../utils'
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

interface WrapperOptions {
  initialEntry?: string
  path?: string
}

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

function createRouterWrapper(
  store: Store = createStore(),
  { initialEntry = RouterPath.Home, path = RouterPath.Home }: WrapperOptions = {}
): ({ children }: PropsWithChildren) => ReactElement {
  return function Wrapper({ children }: PropsWithChildren): ReactElement {
    return (
      <Provider store={store}>
        <MemoryRouter initialEntries={[initialEntry]}>
          <Routes>
            <Route element={<>{children}</>} path={path} />
          </Routes>
        </MemoryRouter>
      </Provider>
    )
  }
}

function createWrapper(
  store: Store = createStore(),
  settingsPayload?: GetCurrentSettingsApiResponse,
  options?: WrapperOptions
): ({ children }: PropsWithChildren) => ReactElement {
  stubFeatureFetch(settingsPayload)

  return createRouterWrapper(store, options)
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

    expect(result.current.status).toBe('idle')

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
    expect(result.current.activatedAthlete).toBeNull()
    expect(result.current.status).toBe('ready')

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

  it('activates the athlete from the current athlete route context', async () => {
    const store = createStore()
    const { result } = renderHook(() => useRosterFeature(), {
      wrapper: createWrapper(store, undefined, {
        initialEntry: generatePath(RouterPath.AthleteHome, { athleteSlug: 'kiro-flux' }),
        path: RouterPath.AthleteHome
      })
    })

    let unloadRoster: VoidFunction | undefined

    act(() => {
      unloadRoster = result.current.load()
    })

    await waitFor(() => {
      expect(selectActivatedAthlete(store.getState())).toStrictEqual(rosterResponse.athletes[0])
    })

    expect(result.current.activatedAthlete).toStrictEqual(rosterResponse.athletes[0])
    expect(result.current.status).toBe('ready')

    act(() => {
      unloadRoster?.()
    })
  })

  it('exposes the route athlete without waiting for the store sync', async () => {
    const store = createStore()
    const firstAthlete = rosterResponse.athletes[0]
    const secondAthlete = rosterResponse.athletes[1]

    if (!firstAthlete || !secondAthlete) {
      throw new Error('Expected at least two athletes in the roster fixture')
    }

    store.dispatch(activateAthlete(firstAthlete))

    await act(async () => {
      await store.dispatch(rosterApi.util.upsertQueryData('getCurrentRoster', {}, rosterResponse))
    })

    const { result } = renderHook(() => useRosterFeature(), {
      wrapper: createWrapper(store, undefined, {
        initialEntry: generatePath(RouterPath.AthleteHome, {
          athleteSlug: getAthleteSlug(secondAthlete)
        }),
        path: RouterPath.AthleteHome
      })
    })

    expect(result.current.activatedAthlete).toStrictEqual(secondAthlete)
    expect(result.current.status).toBe('ready')
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

    let unloadRoster: VoidFunction | undefined

    act(() => {
      unloadRoster = result.current.load()
    })

    await waitFor(() => {
      expect(result.current.athletes).toStrictEqual(rosterResponse.athletes)
    })

    await waitFor(() => {
      expect(selectActivatedAthlete(store.getState())).toBeNull()
    })

    expect(result.current.activatedAthlete).toBeNull()
    expect(result.current.status).toBe('ready')

    act(() => {
      unloadRoster?.()
    })
  })

  it('clears the activated athlete when the current athlete route does not match the roster', async () => {
    const store = createStore()
    const firstAthlete = rosterResponse.athletes[0]

    if (!firstAthlete) {
      throw new Error('Expected at least one athlete in the roster fixture')
    }

    store.dispatch(activateAthlete(firstAthlete))

    const { result } = renderHook(() => useRosterFeature(), {
      wrapper: createWrapper(store, undefined, {
        initialEntry: generatePath(RouterPath.AthleteHome, { athleteSlug: 'unknown-athlete' }),
        path: RouterPath.AthleteHome
      })
    })

    let unloadRoster: VoidFunction | undefined

    act(() => {
      unloadRoster = result.current.load()
    })

    await waitFor(() => {
      expect(selectActivatedAthlete(store.getState())).toBeNull()
    })

    expect(result.current.activatedAthlete).toBeNull()
    expect(result.current.status).toBe('ready')

    act(() => {
      unloadRoster?.()
    })
  })

  it('keeps the activated athlete unchanged while roster load is pending', async () => {
    const store = createStore()
    const firstAthlete = rosterResponse.athletes[0]

    if (!firstAthlete) {
      throw new Error('Expected at least one athlete in the roster fixture')
    }

    store.dispatch(activateAthlete(firstAthlete))
    vi.stubGlobal(
      'fetch',
      vi.fn().mockImplementation(() => new Promise<Response>(() => undefined))
    )

    const { result } = renderHook(() => useRosterFeature(), {
      wrapper: createRouterWrapper(store)
    })

    let unloadRoster: VoidFunction | undefined

    act(() => {
      unloadRoster = result.current.load()
    })

    await waitFor(() => {
      expect(result.current.status).toBe('loading')
    })
    expect(selectActivatedAthlete(store.getState())).toStrictEqual(firstAthlete)

    await act(async () => {
      unloadRoster?.()
      await Promise.resolve()
    })
  })

  it('exposes the error state when roster cannot be loaded', async () => {
    const store = createStore()

    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify({}), {
          headers: { 'Content-Type': 'application/json' },
          status: 500
        })
      )
    )

    const { result } = renderHook(() => useRosterFeature(), {
      wrapper: createRouterWrapper(store)
    })

    act(() => {
      result.current.load()
    })

    await waitFor(() => {
      expect(result.current.status).toBe('error')
    })
  })
})
