import { act, renderHook } from '@testing-library/react'
import { type PropsWithChildren, type ReactElement } from 'react'
import { MemoryRouter, Route, Routes } from 'react-router'

import { RouterPath } from '@/src/constants'
import { useRosterFeature, useSettingsFeature } from '@/src/features'
import { type LoadableStatus } from '@/src/types'

import { useFeatureLoader } from './useFeatureLoader'

vi.mock('@/src/features', () => ({
  useRosterFeature: vi.fn(),
  useSettingsFeature: vi.fn()
}))

const loadRosterMock = vi.fn()
const loadSettingsMock = vi.fn()
const unloadRosterMock = vi.fn()
const unloadSettingsMock = vi.fn()
const useRosterFeatureMock = vi.mocked(useRosterFeature)
const useSettingsFeatureMock = vi.mocked(useSettingsFeature)

function mockFeatures({
  activatedAthlete = null,
  rosterStatus = 'ready',
  settingsStatus = 'ready'
}: {
  activatedAthlete?: ReturnType<typeof useRosterFeature>['activatedAthlete']
  rosterStatus?: LoadableStatus
  settingsStatus?: LoadableStatus
} = {}): void {
  useRosterFeatureMock.mockReturnValue({
    activatedAthlete,
    athletes: [],
    coach: null,
    defaultOrganization: null,
    load: loadRosterMock.mockReturnValue(unloadRosterMock),
    status: rosterStatus
  })
  useSettingsFeatureMock.mockReturnValue({
    defaultOrganizationId: null,
    load: loadSettingsMock.mockReturnValue(unloadSettingsMock),
    status: settingsStatus
  })
}

function createWrapper({
  initialEntry = RouterPath.Home,
  path = RouterPath.Home
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

describe('useFeatureLoader', () => {
  afterEach(() => {
    vi.resetAllMocks()
  })

  it('loads startup features', () => {
    mockFeatures()

    const { result } = renderHook(() => useFeatureLoader(), {
      wrapper: createWrapper()
    })

    expect(result.current.status).toBe('ready')

    let unloadFeatures: VoidFunction | undefined

    act(() => {
      unloadFeatures = result.current.load()
    })

    expect(loadSettingsMock).toHaveBeenCalledOnce()
    expect(loadRosterMock).toHaveBeenCalledOnce()

    act(() => {
      unloadFeatures?.()
    })

    expect(unloadSettingsMock).toHaveBeenCalledOnce()
    expect(unloadRosterMock).toHaveBeenCalledOnce()
  })

  it('is idle before startup features are loaded', () => {
    mockFeatures({
      rosterStatus: 'idle',
      settingsStatus: 'idle'
    })

    const { result } = renderHook(() => useFeatureLoader(), {
      wrapper: createWrapper()
    })

    expect(result.current.status).toBe('idle')
  })

  it('stays loading while a feature is loading', () => {
    mockFeatures({ settingsStatus: 'loading' })

    const { result } = renderHook(() => useFeatureLoader(), {
      wrapper: createWrapper()
    })

    expect(result.current.status).toBe('loading')
  })

  it('stays loading while roster is loading', () => {
    mockFeatures({ rosterStatus: 'loading' })

    const { result } = renderHook(() => useFeatureLoader(), {
      wrapper: createWrapper()
    })

    expect(result.current.status).toBe('loading')
  })

  it('is ready once startup features are ready', () => {
    mockFeatures()

    const { result } = renderHook(() => useFeatureLoader(), {
      wrapper: createWrapper()
    })

    expect(result.current.status).toBe('ready')
  })

  it('is errored when a feature is errored', () => {
    mockFeatures({ rosterStatus: 'error' })

    const { result } = renderHook(() => useFeatureLoader(), {
      wrapper: createWrapper()
    })

    expect(result.current.status).toBe('error')
  })
})
