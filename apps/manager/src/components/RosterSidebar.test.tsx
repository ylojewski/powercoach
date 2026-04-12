import { renderWithRouter } from '@powercoach/util-test/react'
import { fireEvent, screen } from '@testing-library/react'

import { routerPaths } from '@/src/constants/router-paths'

import { RosterSidebar } from './RosterSidebar'

vi.mock('@powercoach/ui', () => ({
  LogoIcon: () => <svg data-testid="logo-icon" />
}))

describe('RosterSidebar', () => {
  it('renders the logo icon with padding and the viewport height', () => {
    const { container } = renderWithRouter(<RosterSidebar />)

    const rosterSidebar = container.querySelector('aside')
    const logoIcon = screen.getByTestId('logo-icon')
    const homeLink = screen.getByRole('link', { name: 'Powercoach home' })

    expect(rosterSidebar).not.toBeNull()

    if (!rosterSidebar) {
      throw new Error('Roster sidebar not found')
    }

    expect(rosterSidebar).toHaveClass('h-screen')
    expect(rosterSidebar).toHaveClass('p-4')
    expect(homeLink).toContainElement(logoIcon)
  })

  it('navigates to the home route when the logo is clicked', () => {
    renderWithRouter(<RosterSidebar />, {
      initialEntry: routerPaths.reviews,
      pathnameProbe: true
    })

    const homeLink = screen.getByRole('link', { name: 'Powercoach home' })
    const pathname = screen.getByTestId('pathname')

    fireEvent.click(homeLink)

    expect(pathname).toHaveTextContent(routerPaths.home)
  })
})
