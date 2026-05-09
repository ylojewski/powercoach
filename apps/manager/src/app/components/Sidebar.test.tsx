import { renderWithRouter } from '@powercoach/util-test/react'
import { fireEvent, screen } from '@testing-library/react'
import { type ReactElement } from 'react'
import { Provider } from 'react-redux'

import { createTestStore } from '@/test/utils/store'

import { Sidebar } from './Sidebar'

vi.mock('@/modules/roster', () => ({
  RosterSidebar: ({ renderSeparator }: { renderSeparator: () => ReactElement }) => (
    <>
      <div data-testid="roster-sidebar">Roster sidebar component</div>
      {renderSeparator()}
    </>
  )
}))

function renderSidebar(initialEntry = '/') {
  const store = createTestStore()
  return renderWithRouter(<Sidebar />, {
    initialEntry,
    pathnameProbe: true,
    wrapper: ({ children }) => <Provider store={store}>{children}</Provider>
  })
}

describe('Sidebar', () => {
  it('renders the logo and roster sidebar content', () => {
    renderSidebar()

    expect(screen.getByTestId('roster-logo')).toContainElement(screen.getByTestId('logo-icon'))
    expect(screen.getByTestId('roster-sidebar')).toBeInTheDocument()
  })

  it('navigates to exercise when the logo is clicked', () => {
    renderSidebar('/reviews')

    fireEvent.click(screen.getByTestId('roster-logo'))

    expect(screen.getByTestId('pathname')).toHaveTextContent('/exercise')
  })
})
