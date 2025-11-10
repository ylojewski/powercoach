import { render, screen } from '@testing-library/react'

import { App } from './App'

describe('App', () => {
  it('displays the logo', () => {
    render(<App />)

    expect(screen.getByRole('img', { name: /logo/i })).toBeInTheDocument()
  })
})
