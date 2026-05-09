import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router'

import { ModuleLoader } from './ModuleLoader'
import { useModuleLoader } from '../hooks'

vi.mock('../hooks', () => ({
  useModuleLoader: vi.fn()
}))

const loadMock = vi.fn()
const unloadMock = vi.fn()
const useModuleLoaderMock = vi.mocked(useModuleLoader)

function renderModuleLoader(): ReturnType<typeof render> {
  return render(
    <MemoryRouter initialEntries={['/']}>
      <Routes>
        <Route element={<ModuleLoader />}>
          <Route element={<div>Application content</div>} path="/" />
        </Route>
      </Routes>
    </MemoryRouter>
  )
}

describe('ModuleLoader', () => {
  beforeEach(() => {
    loadMock.mockReturnValue(unloadMock)
    useModuleLoaderMock.mockReturnValue({
      load: loadMock,
      status: 'ready'
    })
  })

  afterEach(() => {
    vi.resetAllMocks()
  })

  it('loads startup modules and renders the splash screen while loading', async () => {
    useModuleLoaderMock.mockReturnValue({
      load: loadMock,
      status: 'loading'
    })

    const { unmount } = renderModuleLoader()

    expect(screen.getByLabelText('loading powercoach')).toBeInTheDocument()
    expect(screen.queryByText('Application content')).not.toBeInTheDocument()

    await waitFor(() => {
      expect(loadMock).toHaveBeenCalledOnce()
    })

    unmount()

    expect(unloadMock).toHaveBeenCalledOnce()
  })

  it('renders the error screen if a module failed to load', async () => {
    useModuleLoaderMock.mockReturnValue({
      load: loadMock,
      status: 'error'
    })

    renderModuleLoader()

    expect(screen.getByLabelText('failed to load powercoach')).toBeInTheDocument()
    expect(screen.queryByText('Application content')).not.toBeInTheDocument()
  })

  it('renders the outlet once startup modules are loaded', async () => {
    renderModuleLoader()

    expect(screen.getByText('Application content')).toBeInTheDocument()

    await waitFor(() => {
      expect(loadMock).toHaveBeenCalledOnce()
    })
  })
})
