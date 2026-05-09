import { PRIMARY_ATHLETE_RESPONSE } from '@powercoach/util-fixture'
import { expectCollapsed, expectExpanded } from '@powercoach/util-test'
import { renderWithRouter } from '@powercoach/util-test/react'
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { type ReactElement } from 'react'
import { Provider } from 'react-redux'
import { createMemoryRouter, generatePath, RouterProvider, useLocation } from 'react-router'

import { getAthleteSlug, useRoster } from '@/modules/roster'
import { type Athlete } from '@/src/api'
import { createTestStore } from '@/test/utils/store'

import { ManagementPanels } from './ManagementPanels'

vi.mock('@/modules/roster', () => ({
  getAthleteSlug: vi.fn(() => 'kiro-flux'),
  useRoster: vi.fn()
}))

const getAthleteSlugMock = vi.mocked(getAthleteSlug)
const useRosterMock = vi.mocked(useRoster)

function PathnameProbe(): ReactElement {
  const location = useLocation()

  return <div data-testid="pathname">{location.pathname}</div>
}

describe('ManagementPanels', () => {
  const athleteSlug = 'kiro-flux'
  let programsButton: HTMLElement
  let reviewsButton: HTMLElement
  let metricsButton: HTMLElement
  let notesButton: HTMLElement
  let pathname: HTMLElement
  let allButtons: HTMLElement[]

  function renderManagementPanels(
    initialEntry: string,
    activatedAthlete: Athlete | null = null
  ): void {
    getAthleteSlugMock.mockReturnValue('kiro-flux')
    useRosterMock.mockReturnValue({
      activatedAthlete,
      athletes: [],
      coach: null,
      defaultOrganization: null,
      load: vi.fn().mockReturnValue(vi.fn()),
      status: 'ready'
    })

    const store = createTestStore()
    renderWithRouter(<ManagementPanels />, {
      initialEntry,
      pathnameProbe: true,
      wrapper: ({ children }) => <Provider store={store}>{children}</Provider>
    })
  }

  function renderRoutedManagementPanels(
    initialEntries: string[],
    activatedAthlete: Athlete | null = null
  ): ReturnType<typeof createMemoryRouter> {
    getAthleteSlugMock.mockReturnValue('kiro-flux')
    useRosterMock.mockReturnValue({
      activatedAthlete,
      athletes: [],
      coach: null,
      defaultOrganization: null,
      load: vi.fn().mockReturnValue(vi.fn()),
      status: 'ready'
    })

    const router = createMemoryRouter(
      [
        {
          element: (
            <>
              <PathnameProbe />
              <ManagementPanels />
            </>
          ),
          path: '*'
        }
      ],
      { initialEntries }
    )

    render(
      <Provider store={createTestStore()}>
        <RouterProvider router={router} />
      </Provider>
    )

    return router
  }

  function getPanelElements(): void {
    allButtons = screen.getAllByRole('button')
    metricsButton = screen.getByRole('button', { name: 'metrics' })
    notesButton = screen.getByRole('button', { name: 'notes' })
    pathname = screen.getByTestId('pathname')
    programsButton = screen.getByRole('button', { name: 'programs' })
    reviewsButton = screen.getByRole('button', { name: 'reviews' })
  }

  describe('when rendered on the home route', () => {
    beforeEach(() => {
      renderManagementPanels('/')

      getPanelElements()
    })

    it('renders the home route with all panels collapsed', () => {
      expect(allButtons).toEqual([programsButton, reviewsButton, metricsButton, notesButton])
      expect(programsButton).toHaveAttribute('href', '/programs')
      expect(reviewsButton).toHaveAttribute('href', '/reviews')
      expect(metricsButton).toHaveAttribute('href', '/metrics')
      expect(notesButton).toHaveAttribute('href', '/notes')
      expectCollapsed(metricsButton)
      expectCollapsed(notesButton)
      expectCollapsed(reviewsButton)
      expectCollapsed(programsButton)
      expect(pathname).toHaveTextContent('/')
    })
  })

  describe('when rendered on an athlete home route', () => {
    beforeEach(() => {
      renderManagementPanels(
        generatePath('/:athleteSlug', { athleteSlug }),
        PRIMARY_ATHLETE_RESPONSE
      )

      getPanelElements()
    })

    it('keeps all panels collapsed on the athlete home route', () => {
      expect(allButtons).toEqual([programsButton, reviewsButton, metricsButton, notesButton])
      expect(programsButton).toHaveAttribute(
        'href',
        generatePath('/:athleteSlug/programs', { athleteSlug })
      )
      expect(reviewsButton).toHaveAttribute(
        'href',
        generatePath('/:athleteSlug/reviews', { athleteSlug })
      )
      expect(metricsButton).toHaveAttribute(
        'href',
        generatePath('/:athleteSlug/metrics', { athleteSlug })
      )
      expect(notesButton).toHaveAttribute(
        'href',
        generatePath('/:athleteSlug/notes', { athleteSlug })
      )
      expectCollapsed(metricsButton)
      expectCollapsed(notesButton)
      expectCollapsed(reviewsButton)
      expectCollapsed(programsButton)
      expect(pathname).toHaveTextContent(generatePath('/:athleteSlug', { athleteSlug }))
    })
  })

  it('returns to the athlete home route after opening a panel and navigating back once', async () => {
    const athleteHomePath = generatePath('/:athleteSlug', { athleteSlug })
    const athleteReviewsPath = generatePath('/:athleteSlug/reviews', { athleteSlug })
    const router = renderRoutedManagementPanels([athleteHomePath], PRIMARY_ATHLETE_RESPONSE)

    getPanelElements()
    fireEvent.click(reviewsButton)

    await waitFor(() => {
      expect(pathname).toHaveTextContent(athleteReviewsPath)
    })

    await act(async () => {
      await router.navigate(-1)
    })

    expect(pathname).toHaveTextContent(athleteHomePath)
  })

  describe('when rendered on the metrics route', () => {
    beforeEach(() => {
      renderManagementPanels('/metrics')

      getPanelElements()
    })

    it('opens the metrics panel for the metrics route', () => {
      expectExpanded(metricsButton)
      expectCollapsed(notesButton)
      expectCollapsed(reviewsButton)
      expectCollapsed(programsButton)
      expect(pathname).toHaveTextContent('/metrics')
    })
  })

  describe('when rendered on an athlete metrics route', () => {
    beforeEach(() => {
      renderManagementPanels(
        generatePath('/:athleteSlug/metrics', { athleteSlug }),
        PRIMARY_ATHLETE_RESPONSE
      )

      getPanelElements()
    })

    it('opens the metrics panel with athlete specific content', () => {
      expectExpanded(metricsButton)
      expectCollapsed(notesButton)
      expectCollapsed(reviewsButton)
      expectCollapsed(programsButton)
      expect(screen.getByText('Metrics content for Kiro Flux')).toBeInTheDocument()
      expect(pathname).toHaveTextContent(generatePath('/:athleteSlug/metrics', { athleteSlug }))
    })
  })

  describe('when rendered on the notes route', () => {
    beforeEach(() => {
      renderManagementPanels('/notes')

      getPanelElements()
    })

    it('opens the notes panel for the notes route', () => {
      expectCollapsed(metricsButton)
      expectExpanded(notesButton)
      expectCollapsed(reviewsButton)
      expectCollapsed(programsButton)
      expect(pathname).toHaveTextContent('/notes')
    })
  })

  describe('when rendered on an athlete notes route', () => {
    beforeEach(() => {
      renderManagementPanels(
        generatePath('/:athleteSlug/notes', { athleteSlug }),
        PRIMARY_ATHLETE_RESPONSE
      )

      getPanelElements()
    })

    it('opens the notes panel with athlete specific content', () => {
      expectCollapsed(metricsButton)
      expectExpanded(notesButton)
      expectCollapsed(reviewsButton)
      expectCollapsed(programsButton)
      expect(screen.getByText('Notes content for Kiro Flux')).toBeInTheDocument()
      expect(pathname).toHaveTextContent(generatePath('/:athleteSlug/notes', { athleteSlug }))
    })
  })

  describe('when rendered on the reviews route', () => {
    beforeEach(() => {
      renderManagementPanels('/reviews')

      getPanelElements()
    })

    it('opens the reviews panel for the reviews route', () => {
      expectCollapsed(metricsButton)
      expectCollapsed(notesButton)
      expectExpanded(reviewsButton)
      expectCollapsed(programsButton)
      expect(pathname).toHaveTextContent('/reviews')
    })

    it('keeps the active panel open when its trigger is clicked', () => {
      fireEvent.click(reviewsButton)

      expectExpanded(reviewsButton)
      expect(pathname).toHaveTextContent('/reviews')
    })

    it('switches from reviews to programs when another panel is opened', () => {
      fireEvent.click(programsButton)

      expectCollapsed(metricsButton)
      expectCollapsed(notesButton)
      expectCollapsed(reviewsButton)
      expectExpanded(programsButton)
      expect(pathname).toHaveTextContent('/programs')
    })
  })

  describe('when rendered on the programs route', () => {
    beforeEach(() => {
      renderManagementPanels('/programs')

      getPanelElements()
    })

    it('opens the programs panel for the programs route', () => {
      expectCollapsed(metricsButton)
      expectCollapsed(notesButton)
      expectCollapsed(reviewsButton)
      expectExpanded(programsButton)
      expect(pathname).toHaveTextContent('/programs')
    })
  })

  describe('when rendered on an athlete route', () => {
    beforeEach(() => {
      renderManagementPanels(
        generatePath('/:athleteSlug/reviews', { athleteSlug }),
        PRIMARY_ATHLETE_RESPONSE
      )

      getPanelElements()
    })

    it('keeps athlete specific panel links and content in sync with the route', () => {
      expect(programsButton).toHaveAttribute(
        'href',
        generatePath('/:athleteSlug/programs', { athleteSlug })
      )
      expect(reviewsButton).toHaveAttribute(
        'href',
        generatePath('/:athleteSlug/reviews', { athleteSlug })
      )
      expect(metricsButton).toHaveAttribute(
        'href',
        generatePath('/:athleteSlug/metrics', { athleteSlug })
      )
      expect(notesButton).toHaveAttribute(
        'href',
        generatePath('/:athleteSlug/notes', { athleteSlug })
      )
      expectExpanded(reviewsButton)
      expect(screen.getByText('Reviews content for Kiro Flux')).toBeInTheDocument()
      expect(pathname).toHaveTextContent(generatePath('/:athleteSlug/reviews', { athleteSlug }))
    })

    it('switches panels within the selected athlete context', () => {
      fireEvent.click(programsButton)

      expectCollapsed(metricsButton)
      expectCollapsed(notesButton)
      expectCollapsed(reviewsButton)
      expectExpanded(programsButton)
      expect(screen.getByText('Programs content for Kiro Flux')).toBeInTheDocument()
      expect(pathname).toHaveTextContent(generatePath('/:athleteSlug/programs', { athleteSlug }))
    })
  })
})
