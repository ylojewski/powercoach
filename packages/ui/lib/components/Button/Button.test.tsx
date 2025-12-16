import { render, screen } from '@testing-library/react'

import { Button } from './Button'

describe('Button', () => {
  it('displays the logo', async () => {
    render(<Button />)
    await screen.findByText(/button/i)
  })
})
