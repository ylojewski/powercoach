import { act, renderHook } from '@testing-library/react'
import { type PropsWithChildren, type ReactElement } from 'react'
import { MemoryRouter, Route, Routes } from 'react-router'

import { type LoadableStatus } from '@/core'
import { useRoster } from '@/modules/roster'
import { useSettings } from '@/modules/settings'

import { useModuleLoader } from './useModuleLoader'

vi.mock('@/modules/roster', () => ({
  useRoster: vi.fn()
}))

vi.mock('@/modules/settings', () => ({
  useSettings: vi.fn()
}))

const loadRosterMock = vi.fn()
const loadSettingsMock = vi.fn()
const unloadRosterMock = vi.fn()
const unloadSettingsMock = vi.fn()
const useRosterMock = vi.mocked(useRoster)
const useSettingsMock = vi.mocked(useSettings)

function mockModules({
  activatedAthlete = null,
  rosterStatus = 'ready',
  settingsStatus = 'ready'
}: {
  activatedAthlete?: ReturnType<typeof useRoster>['activatedAthlete']
  rosterStatus?: LoadableStatus
  settingsStatus?: LoadableStatus
} = {}): void {
  useRosterMock.mockReturnValue({
    activatedAthlete,
    athletes: [],
    coach: null,
    defaultOrganization: null,
    load: loadRosterMock.mockReturnValue(unloadRosterMock),
    status: rosterStatus
  })
  useSettingsMock.mockReturnValue({
    defaultOrganizationId: null,
    load: loadSettingsMock.mockReturnValue(unloadSettingsMock),
    status: settingsStatus
  })
}

function createWrapper({
  initialEntry = '/',
  path = '/'
}: {
  initialEntry?: string
  path?: string
} = {}): ({ children }: PropsWithChildren) => ReactElement {
  return function Wrapper({ children }: PropsWithChildren): ReactElement {
    return (
      <MemoryRouter initialEntries={[initialEntry]}>
        <Routes>
          <Route element={<>{children}</>}>
            <Route element={null} path={path} />
          </Route>
        </Routes>
      </MemoryRouter>
    )
  }
}

describe('useModuleLoader', () => {
  afterEach(() => {
    vi.resetAllMocks()
  })

  it('loads startup modules', () => {
    mockModules()

    const { result } = renderHook(() => useModuleLoader(), {
      wrapper: createWrapper()
    })

    expect(result.current.status).toBe('ready')

    let unloadModules: VoidFunction | undefined

    act(() => {
      unloadModules = result.current.load()
    })

    expect(loadSettingsMock).toHaveBeenCalledOnce()
    expect(loadRosterMock).toHaveBeenCalledOnce()

    act(() => {
      unloadModules?.()
    })

    expect(unloadSettingsMock).toHaveBeenCalledOnce()
    expect(unloadRosterMock).toHaveBeenCalledOnce()
  })

  it('is idle before startup modules are loaded', () => {
    mockModules({
      rosterStatus: 'idle',
      settingsStatus: 'idle'
    })

    const { result } = renderHook(() => useModuleLoader(), {
      wrapper: createWrapper()
    })

    expect(result.current.status).toBe('idle')
  })

  it('stays loading while a module is loading', () => {
    mockModules({ settingsStatus: 'loading' })

    const { result } = renderHook(() => useModuleLoader(), {
      wrapper: createWrapper()
    })

    expect(result.current.status).toBe('loading')
  })

  it('stays loading while roster is loading', () => {
    mockModules({ rosterStatus: 'loading' })

    const { result } = renderHook(() => useModuleLoader(), {
      wrapper: createWrapper()
    })

    expect(result.current.status).toBe('loading')
  })

  it('is ready once startup modules are ready', () => {
    mockModules()

    const { result } = renderHook(() => useModuleLoader(), {
      wrapper: createWrapper()
    })

    expect(result.current.status).toBe('ready')
  })

  it('is errored when a module is errored', () => {
    mockModules({ rosterStatus: 'error' })

    const { result } = renderHook(() => useModuleLoader(), {
      wrapper: createWrapper()
    })

    expect(result.current.status).toBe('error')
  })
})
