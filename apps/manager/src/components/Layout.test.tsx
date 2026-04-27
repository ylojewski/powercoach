import { PRIMARY_ATHLETE_RESPONSE } from '@powercoach/util-fixture'
import { renderWithRouter } from '@powercoach/util-test/react'
import { screen } from '@testing-library/react'
import { generatePath } from 'react-router'

import { RouterPath } from '@/src/constants'
import { useRosterFeature } from '@/src/features'

import { Layout } from './Layout'

vi.mock('@/src/features', () => ({
  useRosterFeature: vi.fn()
}))

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
      load: vi.fn().mockReturnValue(vi.fn()),
      status: 'ready'
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

  it('renders not found when the current athlete route has no activated athlete', () => {
    renderWithRouter(<Layout />, {
      initialEntry: generatePath(RouterPath.AthleteHome, { athleteSlug: 'unknown-athlete' }),
      path: RouterPath.AthleteHome
    })

    expect(screen.getByText('Not found component')).toBeInTheDocument()
    expect(screen.queryByTestId('sidebar')).not.toBeInTheDocument()
  })

  it('renders the layout when the current athlete route has an activated athlete', () => {
    useRosterFeatureMock.mockReturnValue({
      activatedAthlete: PRIMARY_ATHLETE_RESPONSE,
      athletes: [],
      coach: null,
      defaultOrganization: null,
      load: vi.fn().mockReturnValue(vi.fn()),
      status: 'ready'
    })

    renderWithRouter(<Layout />, {
      initialEntry: generatePath(RouterPath.AthleteHome, { athleteSlug: 'kiro-flux' }),
      path: RouterPath.AthleteHome
    })

    expect(screen.getByTestId('sidebar')).toBeInTheDocument()
    expect(screen.getByTestId('home')).toBeInTheDocument()
  })
})
