import { PRIMARY_ATHLETE_RESPONSE } from '@powercoach/util-fixture'
import { render, screen } from '@testing-library/react'

import { useRosterFeature } from '@/modules/roster'

import { Home } from './Home'

vi.mock('@/modules/roster', () => ({
  useRosterFeature: vi.fn()
}))

const useRosterFeatureMock = vi.mocked(useRosterFeature)

describe('Home', () => {
  beforeEach(() => {
    useRosterFeatureMock.mockReturnValue({
      activatedAthlete: null,
      activatedAthleteSlug: null,
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

  it('displays the home content with the viewport height and panel border styles', () => {
    const { container } = render(<Home />)

    const home = container.firstElementChild

    expect(screen.getByText('Home content')).toBeInTheDocument()
    expect(home).not.toBeNull()

    if (!home) {
      throw new Error('Home not found')
    }

    expect(home).toHaveClass('min-h-screen')
    expect(home).toHaveClass('border-l')
    expect(home).toHaveClass('border-gray-200')
    expect(home).toHaveClass('dark:border-gray-700')
  })

  it('displays the selected athlete when provided', () => {
    useRosterFeatureMock.mockReturnValue({
      activatedAthlete: PRIMARY_ATHLETE_RESPONSE,
      activatedAthleteSlug: 'kiro-flux',
      athletes: [],
      coach: null,
      defaultOrganization: null,
      load: vi.fn().mockReturnValue(vi.fn()),
      status: 'ready'
    })

    render(<Home />)

    expect(screen.getByText('Home content for Kiro Flux')).toBeInTheDocument()
  })
})
