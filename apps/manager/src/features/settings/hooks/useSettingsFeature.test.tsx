import { SETTINGS_RESPONSE } from '@powercoach/util-fixture'
import { act, renderHook, waitFor } from '@testing-library/react'
import { type PropsWithChildren, type ReactElement } from 'react'
import { Provider } from 'react-redux'

import { type GetCurrentSettingsApiResponse } from '@/src/api'
import { createStore } from '@/src/store'

import { useSettingsFeature } from './useSettingsFeature'

const settingsResponse: GetCurrentSettingsApiResponse = { ...SETTINGS_RESPONSE }

function createSettingsResponse(): Response {
  return new Response(JSON.stringify(settingsResponse), {
    headers: { 'Content-Type': 'application/json' },
    status: 200
  })
}

function createWrapper(): ({ children }: PropsWithChildren) => ReactElement {
  const store = createStore()

  return function Wrapper({ children }: PropsWithChildren): ReactElement {
    return <Provider store={store}>{children}</Provider>
  }
}

describe('useSettingsFeature', () => {
  afterEach(() => {
    vi.resetAllMocks()
    vi.unstubAllGlobals()
  })

  it('exposes the loading state before settings are loaded', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockImplementation(() => new Promise<Response>(() => undefined))
    )

    const { result } = renderHook(() => useSettingsFeature(), {
      wrapper: createWrapper()
    })

    let unloadSettings: VoidFunction | undefined

    act(() => {
      unloadSettings = result.current.load()
    })

    await waitFor(() => {
      expect(result.current).toStrictEqual({
        defaultOrganizationId: null,
        load: expect.any(Function),
        status: 'loading'
      })
    })

    act(() => {
      unloadSettings?.()
    })
  })

  it('exposes the loaded default organization id', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(createSettingsResponse()))

    const { result } = renderHook(() => useSettingsFeature(), {
      wrapper: createWrapper()
    })

    let unloadSettings: VoidFunction | undefined

    act(() => {
      unloadSettings = result.current.load()
    })

    await waitFor(() => {
      expect(result.current).toStrictEqual({
        defaultOrganizationId: settingsResponse.defaultOrganizationId,
        load: expect.any(Function),
        status: 'ready'
      })
    })

    act(() => {
      unloadSettings?.()
    })
  })

  it('exposes the idle state before settings load starts', () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(createSettingsResponse()))

    const { result } = renderHook(() => useSettingsFeature(), {
      wrapper: createWrapper()
    })

    expect(result.current).toStrictEqual({
      defaultOrganizationId: null,
      load: expect.any(Function),
      status: 'idle'
    })
  })

  it('exposes the error state when settings cannot be loaded', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify({}), {
          headers: { 'Content-Type': 'application/json' },
          status: 500
        })
      )
    )

    const { result } = renderHook(() => useSettingsFeature(), {
      wrapper: createWrapper()
    })

    act(() => {
      result.current.load()
    })

    await waitFor(() => {
      expect(result.current.status).toBe('error')
    })
  })
})
