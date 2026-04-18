import { renderWithRouter } from '@powercoach/util-test/react'
import { fireEvent, screen } from '@testing-library/react'
import { Provider } from 'react-redux'

import { RouterPath } from '@/src/constants'
import {
  AUTHENTICATED_COACH_EMAIL,
  createStore,
  type GetCurrentCoachContextApiResponse
} from '@/src/store'

import { RosterSidebar } from './RosterSidebar'

const rosterResponse: GetCurrentCoachContextApiResponse = {
  athletes: [
    {
      email: 'kiro.flux@example.test',
      firstName: 'Kiro',
      id: 11,
      lastName: 'Flux'
    },
    {
      email: 'nexa.vale@example.test',
      firstName: 'Nexa',
      id: 12,
      lastName: 'Vale'
    }
  ],
  coach: {
    email: AUTHENTICATED_COACH_EMAIL,
    firstName: 'Astra',
    id: 10,
    lastName: 'Quill'
  },
  organizations: [{ id: 1, name: 'Orbit Foundry' }]
}

function renderRosterSidebar(initialEntry = RouterPath.Home) {
  vi.stubGlobal(
    'fetch',
    vi.fn().mockResolvedValue(
      new Response(JSON.stringify(rosterResponse), {
        headers: { 'Content-Type': 'application/json' },
        status: 200
      })
    )
  )

  return renderWithRouter(
    <Provider store={createStore()}>
      <RosterSidebar />
    </Provider>,
    {
      initialEntry,
      pathnameProbe: true
    }
  )
}

describe('RosterSidebar', () => {
  afterEach(() => {
    vi.resetAllMocks()
    vi.unstubAllGlobals()
  })

  it('renders the logo, organization, coach and athlete avatars', async () => {
    renderRosterSidebar()
    expect(screen.getByTestId('roster-logo')).toContainElement(screen.getByTestId('logo-icon'))
    expect(await screen.findByLabelText('Orbit Foundry')).toBeInTheDocument()
    expect(screen.getByLabelText('Astra Quill')).toBeInTheDocument()
    expect(screen.getByLabelText('Kiro Flux')).toBeInTheDocument()
    expect(screen.getByLabelText('Nexa Vale')).toBeInTheDocument()
  })

  it('navigates to home when the logo is clicked', async () => {
    renderRosterSidebar(RouterPath.Reviews)
    await screen.findByLabelText('Orbit Foundry')
    fireEvent.click(screen.getByTestId('roster-logo'))
    expect(screen.getByTestId('pathname')).toHaveTextContent(RouterPath.Home)
  })

  it('navigates to home when a roster avatar is clicked', async () => {
    renderRosterSidebar(RouterPath.Reviews)
    const organizationLinks = await screen.findAllByTestId('roster-organization')
    expect(organizationLinks.length).toBeGreaterThanOrEqual(1)
    fireEvent.click(organizationLinks[0] as HTMLElement)
    expect(screen.getByTestId('pathname')).toHaveTextContent(RouterPath.Home)
  })
})
