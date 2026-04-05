import { render, screen } from '@testing-library/react'

import { App } from './App'

describe('App', () => {
  it('displays the app content', async () => {
    render(<App />)
    expect(screen.getByText('App component')).toBeInTheDocument()
  })
})
