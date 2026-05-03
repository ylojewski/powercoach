import { renderWithRouter } from '@powercoach/util-test/react'
import { fireEvent, screen } from '@testing-library/react'
import { type ReactElement } from 'react'

import { Sidebar } from './Sidebar'
import { RouterPath } from '../constants'

vi.mock('@/roster', () => ({
  RosterSidebar: ({ renderSeparator }: { renderSeparator: () => ReactElement }) => (
    <>
      <div data-testid="roster-sidebar">Roster sidebar component</div>
      {renderSeparator()}
    </>
  )
}))

describe('Sidebar', () => {
  it('renders the logo and roster sidebar content', () => {
    renderWithRouter(<Sidebar />)

    expect(screen.getByTestId('roster-logo')).toContainElement(screen.getByTestId('logo-icon'))
    expect(screen.getByTestId('roster-sidebar')).toBeInTheDocument()
  })

  it('opens the exercise catalog when the logo is clicked', () => {
    renderWithRouter(<Sidebar />, {
      initialEntry: RouterPath.Reviews,
      pathnameProbe: true
    })

    fireEvent.click(screen.getByTestId('roster-logo'))

    expect(screen.getByTestId('pathname').textContent).toBe(RouterPath.Exercises)
  })
})
