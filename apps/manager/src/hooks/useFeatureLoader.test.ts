import { act, renderHook } from '@testing-library/react'

import { useRosterFeature, useSettingsFeature } from '@/src/features'

import { useFeatureLoader } from './useFeatureLoader'

vi.mock('@/src/features', () => ({
  useRosterFeature: vi.fn(),
  useSettingsFeature: vi.fn()
}))

const loadRosterMock = vi.fn()
const loadSettingsMock = vi.fn()
const unloadRosterMock = vi.fn()
const unloadSettingsMock = vi.fn()
const syncRosterMock = vi.fn()
const useRosterFeatureMock = vi.mocked(useRosterFeature)
const useSettingsFeatureMock = vi.mocked(useSettingsFeature)

function mockFeatures({
  isRosterLoading = false,
  isSettingsLoading = false
}: {
  isRosterLoading?: boolean
  isSettingsLoading?: boolean
} = {}): void {
  useRosterFeatureMock.mockReturnValue({
    activatedAthlete: null,
    athletes: [],
    coach: null,
    defaultOrganization: null,
    isLoading: isRosterLoading,
    load: loadRosterMock.mockReturnValue(unloadRosterMock),
    sync: syncRosterMock.mockReturnValue('synced')
  })
  useSettingsFeatureMock.mockReturnValue({
    defaultOrganizationId: null,
    isLoading: isSettingsLoading,
    load: loadSettingsMock.mockReturnValue(unloadSettingsMock)
  })
}

describe('useFeatureLoader', () => {
  afterEach(() => {
    vi.resetAllMocks()
  })

  it('loads startup features and exposes their loading state', () => {
    mockFeatures({ isRosterLoading: true })

    const { result } = renderHook(() => useFeatureLoader())

    expect(result.current.isLoading).toBe(true)

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

  it('stays loading while settings are loading', () => {
    mockFeatures({ isSettingsLoading: true })

    const { result } = renderHook(() => useFeatureLoader())

    expect(result.current.isLoading).toBe(true)
  })

  it('stops loading once startup features are loaded', () => {
    mockFeatures()

    const { result } = renderHook(() => useFeatureLoader())

    expect(result.current.isLoading).toBe(false)
  })
})
