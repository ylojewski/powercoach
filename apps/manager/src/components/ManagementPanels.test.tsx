import { expectCollapsed, expectExpanded } from '@powercoach/util-test'
import { renderWithRouter } from '@powercoach/util-test/react'
import { fireEvent, screen } from '@testing-library/react'

import { routerPaths } from '@/src/constants/router-paths'

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
        initialEntry: routerPaths.home,
        pathnameProbe: true
      })

      getPanelElements()
    })

    it('renders the home route with all panels collapsed', () => {
      expect(allButtons).toEqual([programsButton, reviewsButton, metricsButton, notesButton])
      expectCollapsed(metricsButton)
      expectCollapsed(notesButton)
      expectCollapsed(reviewsButton)
      expectCollapsed(programsButton)
      expect(pathname).toHaveTextContent(routerPaths.home)
    })
  })

  describe('when rendered on the metrics route', () => {
    beforeEach(() => {
      renderWithRouter(<ManagementPanels />, {
        initialEntry: routerPaths.metrics,
        pathnameProbe: true
      })

      getPanelElements()
    })

    it('opens the metrics panel for the metrics route', () => {
      expectExpanded(metricsButton)
      expectCollapsed(notesButton)
      expectCollapsed(reviewsButton)
      expectCollapsed(programsButton)
      expect(pathname).toHaveTextContent(routerPaths.metrics)
    })
  })

  describe('when rendered on the notes route', () => {
    beforeEach(() => {
      renderWithRouter(<ManagementPanels />, {
        initialEntry: routerPaths.notes,
        pathnameProbe: true
      })

      getPanelElements()
    })

    it('opens the notes panel for the notes route', () => {
      expectCollapsed(metricsButton)
      expectExpanded(notesButton)
      expectCollapsed(reviewsButton)
      expectCollapsed(programsButton)
      expect(pathname).toHaveTextContent(routerPaths.notes)
    })
  })

  describe('when rendered on the reviews route', () => {
    beforeEach(() => {
      renderWithRouter(<ManagementPanels />, {
        initialEntry: routerPaths.reviews,
        pathnameProbe: true
      })

      getPanelElements()
    })

    it('opens the reviews panel for the reviews route', () => {
      expectCollapsed(metricsButton)
      expectCollapsed(notesButton)
      expectExpanded(reviewsButton)
      expectCollapsed(programsButton)
      expect(pathname).toHaveTextContent(routerPaths.reviews)
    })

    it('keeps the active panel open when its trigger is clicked', () => {
      fireEvent.click(reviewsButton)

      expectExpanded(reviewsButton)
      expect(pathname).toHaveTextContent(routerPaths.reviews)
    })

    it('switches from reviews to programs when another panel is opened', () => {
      fireEvent.click(programsButton)

      expectCollapsed(metricsButton)
      expectCollapsed(notesButton)
      expectCollapsed(reviewsButton)
      expectExpanded(programsButton)
      expect(pathname).toHaveTextContent(routerPaths.programs)
    })
  })

  describe('when rendered on the programs route', () => {
    beforeEach(() => {
      renderWithRouter(<ManagementPanels />, {
        initialEntry: routerPaths.programs,
        pathnameProbe: true
      })

      getPanelElements()
    })

    it('opens the programs panel for the programs route', () => {
      expectCollapsed(metricsButton)
      expectCollapsed(notesButton)
      expectCollapsed(reviewsButton)
      expectExpanded(programsButton)
      expect(pathname).toHaveTextContent(routerPaths.programs)
    })
  })
})
