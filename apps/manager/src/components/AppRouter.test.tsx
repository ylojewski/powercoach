import { render, screen } from '@testing-library/react'

import { AppRouter } from './AppRouter'

describe('AppRouter', () => {
  it('renders the index route', async () => {
    render(<AppRouter />)
    expect(await screen.findByText('App component')).toBeInTheDocument()
  })

  it('renders not found for unknown routes', async () => {
    window.history.replaceState({}, '', '/missing')
    render(<AppRouter />)
    expect(screen.getByText('404 Not Found')).toBeInTheDocument()
  })
})
