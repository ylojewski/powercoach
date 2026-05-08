import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'

import { RouterPath } from '@/core'

import { Exercises } from './Exercises'

describe('Exercises', () => {
  it('renders the catalog placeholder', () => {
    render(
      <MemoryRouter>
        <Exercises />
      </MemoryRouter>
    )

    expect(screen.getByTestId('exercise-catalog')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'New exercise' })).toHaveAttribute(
      'href',
      RouterPath.ExerciseNew
    )
  })
})
