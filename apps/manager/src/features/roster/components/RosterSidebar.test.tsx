import { ROSTER_RESPONSE, SETTINGS_RESPONSE } from '@powercoach/util-fixture'
import { renderWithRouter } from '@powercoach/util-test/react'
import { fireEvent, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { generatePath } from 'react-router'

import {
  AUTHENTICATED_COACH_EMAIL,
  type GetCurrentRosterApiResponse,
  type GetCurrentSettingsApiResponse,
  rosterApi,
  settingsApi
} from '@/src/api'
import { RouterPath } from '@/src/constants'
import { createStore } from '@/src/store'

import { RosterSidebar } from './RosterSidebar'

const rosterResponse: GetCurrentRosterApiResponse = {
  athletes: [...ROSTER_RESPONSE.athletes],
  coach: {
    ...ROSTER_RESPONSE.coach,
    email: AUTHENTICATED_COACH_EMAIL
  },
  organizations: [...ROSTER_RESPONSE.organizations]
}

const settingsResponse: GetCurrentSettingsApiResponse = { ...SETTINGS_RESPONSE }

function renderRosterSidebar(
  initialEntry: string = RouterPath.Home,
  path = '*',
  store = createStore()
) {
  vi.stubGlobal(
    'fetch',
    vi.fn().mockImplementation((input: URL | RequestInfo) => {
      const url =
        typeof input === 'string' ? input : input instanceof URL ? input.toString() : input.url
      const payload = url.endsWith('/v1/settings/me') ? settingsResponse : rosterResponse

      return Promise.resolve(
        new Response(JSON.stringify(payload), {
          headers: { 'Content-Type': 'application/json' },
          status: 200
        })
      )
    })
  )

  store.dispatch(settingsApi.endpoints.getCurrentSettings.initiate())
  store.dispatch(rosterApi.endpoints.getCurrentRoster.initiate({}))

  const renderResult = renderWithRouter(
    <Provider store={store}>
      <RosterSidebar renderSeparator={() => <div data-testid="roster-separator" />} />
    </Provider>,
    {
      initialEntry,
      path,
      pathnameProbe: true
    }
  )

  return { ...renderResult, store }
}

describe('RosterSidebar', () => {
  afterEach(() => {
    vi.resetAllMocks()
    vi.unstubAllGlobals()
  })

  it('renders organization, coach and athlete links', async () => {
    renderRosterSidebar()
    expect(await screen.findAllByTestId('roster-organization')).toHaveLength(1)
    expect(screen.getAllByTestId('roster-coach')).toHaveLength(1)
    expect(screen.getAllByTestId('roster-athlete')).toHaveLength(2)
  })

  it('navigates to home when a roster avatar is clicked', async () => {
    renderRosterSidebar(RouterPath.Reviews)
    const organizationLinks = await screen.findAllByTestId('roster-organization')
    expect(organizationLinks.length).toBeGreaterThanOrEqual(1)
    fireEvent.click(organizationLinks[0] as HTMLElement)
    expect(screen.getByTestId('pathname')).toHaveTextContent(RouterPath.Home)
  })

  it('navigates to the selected athlete home when an athlete avatar is clicked', async () => {
    renderRosterSidebar(RouterPath.Reviews)
    const athleteLinks = await screen.findAllByTestId('roster-athlete')
    expect(athleteLinks.length).toBeGreaterThanOrEqual(1)
    fireEvent.click(athleteLinks[0] as HTMLElement)
    expect(screen.getByTestId('pathname')).toHaveTextContent(
      generatePath(RouterPath.AthleteHome, { athleteSlug: 'kiro-flux' })
    )
  })
})
