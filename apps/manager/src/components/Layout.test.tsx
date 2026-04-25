import { renderWithRouter } from '@powercoach/util-test/react'
import { screen, waitFor } from '@testing-library/react'
import { generatePath } from 'react-router'

import { RouterPath } from '@/src/constants'
import { useRosterFeature } from '@/src/features'

import { Layout } from './Layout'

vi.mock('@/src/features', () => ({
  useRosterFeature: vi.fn()
}))

const syncMock = vi.fn()
const useRosterFeatureMock = vi.mocked(useRosterFeature)

vi.mock('./Home', () => ({
  Home: () => <div data-testid="home">Home component</div>
}))

vi.mock('./ManagementPanels', () => ({
  ManagementPanels: () => (
    <div data-testid="management-panels">Athlete management panels component</div>
  )
}))

vi.mock('./NotFound', () => ({
  NotFound: () => <div>Not found component</div>
}))

vi.mock('./Sidebar', () => ({
  Sidebar: () => <div data-testid="sidebar">Sidebar component</div>
}))

describe('Layout', () => {
  beforeEach(() => {
    useRosterFeatureMock.mockReturnValue({
      activatedAthlete: null,
      athletes: [],
      coach: null,
      defaultOrganization: null,
      isLoading: false,
      load: vi.fn().mockReturnValue(vi.fn()),
      sync: syncMock.mockReturnValue('synced')
    })
  })

  afterEach(() => {
    vi.resetAllMocks()
  })

  it('renders the roster sidebar on the left and the main content to its right', () => {
    const { container } = renderWithRouter(<Layout />)

    const sidebar = screen.getByTestId('sidebar')
    const home = screen.getByTestId('home')
    const managementPanels = screen.getByTestId('management-panels')
    const layout = container.firstElementChild
    const mainContent = home.parentElement

    expect(layout).not.toBeNull()
    expect(mainContent).not.toBeNull()

    if (!layout || !mainContent) {
      throw new Error('Layout structure not found')
    }

    expect([...layout.children]).toEqual([sidebar, mainContent])
    expect([...mainContent.children]).toEqual([home, managementPanels])
  })

  it('syncs features with the current athlete route', async () => {
    renderWithRouter(<Layout />, {
      initialEntry: generatePath(RouterPath.AthleteHome, { athleteSlug: 'kiro-flux' }),
      path: RouterPath.AthleteHome
    })

    await waitFor(() => {
      expect(syncMock).toHaveBeenCalledWith({ athleteSlug: 'kiro-flux' })
    })
  })

  it('renders not found when the current athlete route cannot be synced', async () => {
    syncMock.mockReturnValue('not-found')

    renderWithRouter(<Layout />, {
      initialEntry: generatePath(RouterPath.AthleteHome, { athleteSlug: 'unknown-athlete' }),
      path: RouterPath.AthleteHome
    })

    expect(await screen.findByText('Not found component')).toBeInTheDocument()
    expect(screen.queryByTestId('sidebar')).not.toBeInTheDocument()
  })
})
