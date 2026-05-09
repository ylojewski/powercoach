import { ROSTER_RESPONSE } from '@powercoach/util-fixture'
import { renderWithRouter } from '@powercoach/util-test/react'
import { fireEvent, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { generatePath } from 'react-router'

import { AUTHENTICATED_COACH_EMAIL, type Athlete, type GetCurrentRosterApiResponse } from '@/core'
import { createTestStore } from '@/test/utils/store'

import { useRoster } from '../hooks'
import { RosterSidebar } from './RosterSidebar'

vi.mock('../hooks', () => ({
  useRoster: vi.fn()
}))

const rosterResponse: GetCurrentRosterApiResponse = {
  athletes: [...ROSTER_RESPONSE.athletes],
  coach: {
    ...ROSTER_RESPONSE.coach,
    email: AUTHENTICATED_COACH_EMAIL
  },
  organizations: [...ROSTER_RESPONSE.organizations]
}

const useRosterMock = vi.mocked(useRoster)

function mockRosterFeature(activatedAthlete?: Athlete): void {
  useRosterMock.mockReturnValue({
    activatedAthlete: activatedAthlete ?? null,
    athletes: rosterResponse.athletes,
    coach: rosterResponse.coach,
    defaultOrganization: rosterResponse.organizations[0] ?? null,
    load: vi.fn(),
    status: 'ready'
  })
}

function renderRosterSidebar(initialEntry = '/', path = '*') {
  const store = createTestStore()
  return renderWithRouter(
    <RosterSidebar renderSeparator={() => <div data-testid="roster-separator" />} />,
    {
      initialEntry,
      path,
      pathnameProbe: true,
      wrapper: ({ children }) => <Provider store={store}>{children}</Provider>
    }
  )
}

describe('RosterSidebar', () => {
  beforeEach(() => {
    mockRosterFeature()
  })

  afterEach(() => {
    vi.resetAllMocks()
  })

  it('renders organization, coach and athlete links', async () => {
    renderRosterSidebar()
    expect(await screen.findAllByTestId('roster-organization')).toHaveLength(1)
    expect(screen.getAllByTestId('roster-coach')).toHaveLength(1)
    expect(screen.getAllByTestId('roster-athlete')).toHaveLength(2)
  })

  it('renders nothing before roster is ready', () => {
    useRosterMock.mockReturnValue({
      activatedAthlete: null,
      athletes: [],
      coach: null,
      defaultOrganization: null,
      load: vi.fn(),
      status: 'loading'
    })

    renderRosterSidebar()

    expect(screen.queryByTestId('roster-organization')).not.toBeInTheDocument()
    expect(screen.queryByTestId('roster-coach')).not.toBeInTheDocument()
    expect(screen.queryByTestId('roster-athlete')).not.toBeInTheDocument()
  })

  it('navigates to home when a roster avatar is clicked', async () => {
    renderRosterSidebar('/reviews')
    const organizationLinks = await screen.findAllByTestId('roster-organization')
    expect(organizationLinks.length).toBeGreaterThanOrEqual(1)
    fireEvent.click(organizationLinks[0] as HTMLElement)
    expect(screen.getByTestId('pathname')).toHaveTextContent('/')
  })

  it('activates the coach avatar when the home route is hit', async () => {
    renderRosterSidebar('/')
    const coachLink = screen.getByTestId('roster-coach')
    expect(coachLink?.querySelector('[data-slot="avatar"]')).toHaveAttribute('data-active', 'true')
  })

  it('navigates to the selected athlete home when an athlete avatar is clicked', async () => {
    renderRosterSidebar('/reviews')
    const athleteLinks = await screen.findAllByTestId('roster-athlete')
    expect(athleteLinks.length).toBeGreaterThanOrEqual(1)
    fireEvent.click(athleteLinks[0] as HTMLElement)
    expect(screen.getByTestId('pathname')).toHaveTextContent(
      generatePath('/:athleteSlug', { athleteSlug: 'kiro-flux' })
    )
  })

  it('activates the selected athlete avatar when its home route is hit', async () => {
    mockRosterFeature(ROSTER_RESPONSE.athletes[0])
    renderRosterSidebar('/')
    const athleteLinks = await screen.findAllByTestId('roster-athlete')
    const [firstAthleteLink] = athleteLinks
    fireEvent.click(firstAthleteLink as HTMLElement)
    expect(firstAthleteLink?.querySelector('[data-slot="avatar"]')).toHaveAttribute(
      'data-active',
      'true'
    )
    athleteLinks.slice(1).forEach((athleteLink) => {
      expect(athleteLink.querySelector('[data-slot="avatar"]')).not.toHaveAttribute('data')
    })
  })
})
