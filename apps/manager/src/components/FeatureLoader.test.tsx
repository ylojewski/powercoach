import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router'

import { useFeatureLoader } from '@/src/hooks'

import { FeatureLoader } from './FeatureLoader'

vi.mock('@/src/hooks', () => ({
  useFeatureLoader: vi.fn()
}))

const loadMock = vi.fn()
const unloadMock = vi.fn()
const useFeatureLoaderMock = vi.mocked(useFeatureLoader)

function renderFeatureLoader(): ReturnType<typeof render> {
  return render(
    <MemoryRouter initialEntries={['/']}>
      <Routes>
        <Route element={<FeatureLoader />}>
          <Route element={<div>Application content</div>} path="/" />
        </Route>
      </Routes>
    </MemoryRouter>
  )
}

describe('FeatureLoader', () => {
  beforeEach(() => {
    loadMock.mockReturnValue(unloadMock)
    useFeatureLoaderMock.mockReturnValue({
      load: loadMock,
      status: 'ready'
    })
  })

  afterEach(() => {
    vi.resetAllMocks()
  })

  it('loads startup features and renders the splash screen while loading', async () => {
    useFeatureLoaderMock.mockReturnValue({
      load: loadMock,
      status: 'loading'
    })

    const { unmount } = renderFeatureLoader()

    expect(screen.getByLabelText('loading powercoach')).toBeInTheDocument()
    expect(screen.queryByText('Application content')).not.toBeInTheDocument()

    await waitFor(() => {
      expect(loadMock).toHaveBeenCalledOnce()
    })

    unmount()

    expect(unloadMock).toHaveBeenCalledOnce()
  })

  it('renders the error screen if a feature failed to load', async () => {
    useFeatureLoaderMock.mockReturnValue({
      load: loadMock,
      status: 'error'
    })

    renderFeatureLoader()

    expect(screen.getByLabelText('failed to load powercoach')).toBeInTheDocument()
    expect(screen.queryByText('Application content')).not.toBeInTheDocument()
  })

  it('renders the outlet once startup features are loaded', async () => {
    renderFeatureLoader()

    expect(screen.getByText('Application content')).toBeInTheDocument()

    await waitFor(() => {
      expect(loadMock).toHaveBeenCalledOnce()
    })
  })
})
