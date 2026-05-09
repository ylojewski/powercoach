import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { MemoryRouter } from 'react-router'

import { createTestStore } from '@/test/utils/store'

import { Exercises } from './Exercises'

describe('Exercises', () => {
  it('renders the catalog placeholder', () => {
    render(
      <Provider store={createTestStore()}>
        <MemoryRouter>
          <Exercises />
        </MemoryRouter>
      </Provider>
    )

    expect(screen.getByTestId('exercise-catalog')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'New exercise' })).toHaveAttribute(
      'href',
      '/exercise/new'
    )
  })
})
