import { render, screen, waitFor } from '@testing-library/react'

import { useRosterFeature, useSettingsFeature } from '@/src/features'

import { FeatureLoader } from './FeatureLoader'

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

describe('FeatureLoader', () => {
  afterEach(() => {
    vi.resetAllMocks()
  })

  it('loads startup features and renders the splash screen while loading', async () => {
    mockFeatures({ isRosterLoading: true })

    const { unmount } = render(
      <FeatureLoader>
        <div>Application content</div>
      </FeatureLoader>
    )

    expect(screen.getByLabelText('Loading Powercoach')).toBeInTheDocument()
    expect(screen.queryByText('Application content')).not.toBeInTheDocument()

    await waitFor(() => {
      expect(loadSettingsMock).toHaveBeenCalledOnce()
      expect(loadRosterMock).toHaveBeenCalledOnce()
    })

    unmount()

    expect(unloadSettingsMock).toHaveBeenCalledOnce()
    expect(unloadRosterMock).toHaveBeenCalledOnce()
  })

  it('renders children once startup features are loaded', async () => {
    mockFeatures()

    render(
      <FeatureLoader>
        <div>Application content</div>
      </FeatureLoader>
    )

    expect(screen.getByText('Application content')).toBeInTheDocument()

    await waitFor(() => {
      expect(loadSettingsMock).toHaveBeenCalledOnce()
      expect(loadRosterMock).toHaveBeenCalledOnce()
    })
  })
})
