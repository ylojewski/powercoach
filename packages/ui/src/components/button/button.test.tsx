import { render, screen } from '@testing-library/react'

import { Button } from './button'

describe('Button', () => {
  it('renders', async () => {
    render(<Button>button</Button>)
    await screen.findByText(/button/i)
  })

  it('renders asChild', async () => {
    render(
      <Button asChild>
        <a href="#">link</a>
      </Button>
    )
    await screen.findByText(/link/i)
  })
})
