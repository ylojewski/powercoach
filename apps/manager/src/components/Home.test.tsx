import { render, screen } from '@testing-library/react'

import { Home } from './Home'

describe('Home', () => {
  it('displays the home content with the viewport height and panel border styles', () => {
    const { container } = render(<Home />)

    const home = container.firstElementChild

    expect(screen.getByText('Home component')).toBeInTheDocument()
    expect(home).not.toBeNull()

    if (!home) {
      throw new Error('Home not found')
    }

    expect(home).toHaveClass('min-h-screen')
    expect(home).toHaveClass('border-l')
    expect(home).toHaveClass('border-gray-200')
    expect(home).toHaveClass('dark:border-gray-700')
  })
})
