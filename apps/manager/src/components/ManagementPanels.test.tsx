import { expectCollapsed, expectExpanded } from '@powercoach/util-test'
import { renderWithRouter } from '@powercoach/util-test/react'
import { fireEvent, screen } from '@testing-library/react'

import { RouterPath } from '@/src/constants'

import { ManagementPanels } from './ManagementPanels'

describe('ManagementPanels', () => {
  let programsButton: HTMLElement
  let reviewsButton: HTMLElement
  let metricsButton: HTMLElement
  let notesButton: HTMLElement
  let pathname: HTMLElement
  let allButtons: HTMLElement[]

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
      renderWithRouter(<ManagementPanels />, {
        initialEntry: RouterPath.Home,
        pathnameProbe: true
      })

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

  describe('when rendered on the metrics route', () => {
    beforeEach(() => {
      renderWithRouter(<ManagementPanels />, {
        initialEntry: RouterPath.Metrics,
        pathnameProbe: true
      })

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

  describe('when rendered on the notes route', () => {
    beforeEach(() => {
      renderWithRouter(<ManagementPanels />, {
        initialEntry: RouterPath.Notes,
        pathnameProbe: true
      })

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

  describe('when rendered on the reviews route', () => {
    beforeEach(() => {
      renderWithRouter(<ManagementPanels />, {
        initialEntry: RouterPath.Reviews,
        pathnameProbe: true
      })

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
      renderWithRouter(<ManagementPanels />, {
        initialEntry: RouterPath.Programs,
        pathnameProbe: true
      })

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
})
