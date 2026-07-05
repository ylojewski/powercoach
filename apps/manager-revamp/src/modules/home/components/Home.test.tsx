import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { MemoryRouter } from 'react-router'

import { createTestStore } from '@/test/utils/store'

import { Home } from './Home'

describe('Home', () => {
  it('renders the only application output', () => {
    render(
      <Provider store={createTestStore()}>
        <MemoryRouter>
          <Home />
        </MemoryRouter>
      </Provider>
    )

    expect(screen.getByRole('main')).toHaveClass('min-h-screen', 'bg-background')
    expect(screen.getByRole('link', { name: 'Hello world' })).toHaveAttribute('href', '/drawer')
  })
})
