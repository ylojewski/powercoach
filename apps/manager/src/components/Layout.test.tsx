import { render, screen } from '@testing-library/react'

import { Layout } from './Layout'

vi.mock('./Home', () => ({
  Home: () => <div data-testid="home">Home component</div>
}))

vi.mock('./ManagementPanels', () => ({
  ManagementPanels: () => (
    <div data-testid="management-panels">Athlete management panels component</div>
  )
}))

vi.mock('./RosterSidebar', () => ({
  RosterSidebar: () => <div data-testid="roster-sidebar">Roster sidebar component</div>
}))

describe('Layout', () => {
  it('renders the roster sidebar on the left and the main content to its right', () => {
    const { container } = render(<Layout />)

    const rosterSidebar = screen.getByTestId('roster-sidebar')
    const home = screen.getByTestId('home')
    const managementPanels = screen.getByTestId('management-panels')
    const layout = container.firstElementChild
    const mainContent = home.parentElement

    expect(layout).not.toBeNull()
    expect(mainContent).not.toBeNull()

    if (!layout || !mainContent) {
      throw new Error('Layout structure not found')
    }

    expect([...layout.children]).toEqual([rosterSidebar, mainContent])
    expect([...mainContent.children]).toEqual([home, managementPanels])
  })
})
