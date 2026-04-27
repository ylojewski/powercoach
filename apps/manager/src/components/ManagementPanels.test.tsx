import { PRIMARY_ATHLETE_RESPONSE } from '@powercoach/util-fixture'
import { expectCollapsed, expectExpanded } from '@powercoach/util-test'
import { renderWithRouter } from '@powercoach/util-test/react'
import { fireEvent, screen } from '@testing-library/react'
import { generatePath } from 'react-router'

import { type Athlete } from '@/src/api'
import { RouterPath } from '@/src/constants'
import { getAthleteSlug, useRosterFeature } from '@/src/features'

import { ManagementPanels } from './ManagementPanels'

vi.mock('@/src/features', () => ({
  getAthleteSlug: vi.fn(() => 'kiro-flux'),
  useRosterFeature: vi.fn()
}))

const getAthleteSlugMock = vi.mocked(getAthleteSlug)
const useRosterFeatureMock = vi.mocked(useRosterFeature)

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
    useRosterFeatureMock.mockReturnValue({
      activatedAthlete,
      athletes: [],
      coach: null,
      defaultOrganization: null,
      load: vi.fn().mockReturnValue(vi.fn()),
      status: 'ready'
    })

    renderWithRouter(<ManagementPanels />, {
      initialEntry,
      pathnameProbe: true
    })
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
      renderManagementPanels(RouterPath.Home)

      getPanelElements()
    })

    it('renders the home route with all panels collapsed', () => {
      expect(allButtons).toEqual([programsButton, reviewsButton, metricsButton, notesButton])
      expect(programsButton).toHaveAttribute('href', RouterPath.Programs)
      expect(reviewsButton).toHaveAttribute('href', RouterPath.Reviews)
      expect(metricsButton).toHaveAttribute('href', RouterPath.Metrics)
      expect(notesButton).toHaveAttribute('href', RouterPath.Notes)
      expectCollapsed(metricsButton)
      expectCollapsed(notesButton)
      expectCollapsed(reviewsButton)
      expectCollapsed(programsButton)
      expect(pathname).toHaveTextContent(RouterPath.Home)
    })
  })

  describe('when rendered on an athlete home route', () => {
    beforeEach(() => {
      renderManagementPanels(
        generatePath(RouterPath.AthleteHome, { athleteSlug }),
        PRIMARY_ATHLETE_RESPONSE
      )

      getPanelElements()
    })

    it('keeps all panels collapsed on the athlete home route', () => {
      expect(allButtons).toEqual([programsButton, reviewsButton, metricsButton, notesButton])
      expect(programsButton).toHaveAttribute(
        'href',
        generatePath(RouterPath.AthletePrograms, { athleteSlug })
      )
      expect(reviewsButton).toHaveAttribute(
        'href',
        generatePath(RouterPath.AthleteReviews, { athleteSlug })
      )
      expect(metricsButton).toHaveAttribute(
        'href',
        generatePath(RouterPath.AthleteMetrics, { athleteSlug })
      )
      expect(notesButton).toHaveAttribute(
        'href',
        generatePath(RouterPath.AthleteNotes, { athleteSlug })
      )
      expectCollapsed(metricsButton)
      expectCollapsed(notesButton)
      expectCollapsed(reviewsButton)
      expectCollapsed(programsButton)
      expect(pathname).toHaveTextContent(generatePath(RouterPath.AthleteHome, { athleteSlug }))
    })
  })

  describe('when rendered on the metrics route', () => {
    beforeEach(() => {
      renderManagementPanels(RouterPath.Metrics)

      getPanelElements()
    })

    it('opens the metrics panel for the metrics route', () => {
      expectExpanded(metricsButton)
      expectCollapsed(notesButton)
      expectCollapsed(reviewsButton)
      expectCollapsed(programsButton)
      expect(pathname).toHaveTextContent(RouterPath.Metrics)
    })
  })

  describe('when rendered on an athlete metrics route', () => {
    beforeEach(() => {
      renderManagementPanels(
        generatePath(RouterPath.AthleteMetrics, { athleteSlug }),
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
      expect(pathname).toHaveTextContent(generatePath(RouterPath.AthleteMetrics, { athleteSlug }))
    })
  })

  describe('when rendered on the notes route', () => {
    beforeEach(() => {
      renderManagementPanels(RouterPath.Notes)

      getPanelElements()
    })

    it('opens the notes panel for the notes route', () => {
      expectCollapsed(metricsButton)
      expectExpanded(notesButton)
      expectCollapsed(reviewsButton)
      expectCollapsed(programsButton)
      expect(pathname).toHaveTextContent(RouterPath.Notes)
    })
  })

  describe('when rendered on an athlete notes route', () => {
    beforeEach(() => {
      renderManagementPanels(
        generatePath(RouterPath.AthleteNotes, { athleteSlug }),
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
      expect(pathname).toHaveTextContent(generatePath(RouterPath.AthleteNotes, { athleteSlug }))
    })
  })

  describe('when rendered on the reviews route', () => {
    beforeEach(() => {
      renderManagementPanels(RouterPath.Reviews)

      getPanelElements()
    })

    it('opens the reviews panel for the reviews route', () => {
      expectCollapsed(metricsButton)
      expectCollapsed(notesButton)
      expectExpanded(reviewsButton)
      expectCollapsed(programsButton)
      expect(pathname).toHaveTextContent(RouterPath.Reviews)
    })

    it('keeps the active panel open when its trigger is clicked', () => {
      fireEvent.click(reviewsButton)

      expectExpanded(reviewsButton)
      expect(pathname).toHaveTextContent(RouterPath.Reviews)
    })

    it('switches from reviews to programs when another panel is opened', () => {
      fireEvent.click(programsButton)

      expectCollapsed(metricsButton)
      expectCollapsed(notesButton)
      expectCollapsed(reviewsButton)
      expectExpanded(programsButton)
      expect(pathname).toHaveTextContent(RouterPath.Programs)
    })
  })

  describe('when rendered on the programs route', () => {
    beforeEach(() => {
      renderManagementPanels(RouterPath.Programs)

      getPanelElements()
    })

    it('opens the programs panel for the programs route', () => {
      expectCollapsed(metricsButton)
      expectCollapsed(notesButton)
      expectCollapsed(reviewsButton)
      expectExpanded(programsButton)
      expect(pathname).toHaveTextContent(RouterPath.Programs)
    })
  })

  describe('when rendered on an athlete route', () => {
    beforeEach(() => {
      renderManagementPanels(
        generatePath(RouterPath.AthleteReviews, { athleteSlug }),
        PRIMARY_ATHLETE_RESPONSE
      )

      getPanelElements()
    })

    it('keeps athlete specific panel links and content in sync with the route', () => {
      expect(programsButton).toHaveAttribute(
        'href',
        generatePath(RouterPath.AthletePrograms, { athleteSlug })
      )
      expect(reviewsButton).toHaveAttribute(
        'href',
        generatePath(RouterPath.AthleteReviews, { athleteSlug })
      )
      expect(metricsButton).toHaveAttribute(
        'href',
        generatePath(RouterPath.AthleteMetrics, { athleteSlug })
      )
      expect(notesButton).toHaveAttribute(
        'href',
        generatePath(RouterPath.AthleteNotes, { athleteSlug })
      )
      expectExpanded(reviewsButton)
      expect(screen.getByText('Reviews content for Kiro Flux')).toBeInTheDocument()
      expect(pathname).toHaveTextContent(generatePath(RouterPath.AthleteReviews, { athleteSlug }))
    })

    it('switches panels within the selected athlete context', () => {
      fireEvent.click(programsButton)

      expectCollapsed(metricsButton)
      expectCollapsed(notesButton)
      expectCollapsed(reviewsButton)
      expectExpanded(programsButton)
      expect(screen.getByText('Programs content for Kiro Flux')).toBeInTheDocument()
      expect(pathname).toHaveTextContent(generatePath(RouterPath.AthletePrograms, { athleteSlug }))
    })
  })
})
