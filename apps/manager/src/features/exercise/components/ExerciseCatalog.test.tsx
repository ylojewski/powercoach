import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'

import { RouterPath } from '@/app'

import { ExerciseCatalog } from './ExerciseCatalog'

describe('ExerciseCatalog', () => {
  it('renders the catalog placeholder', () => {
    render(
      <MemoryRouter>
        <ExerciseCatalog />
      </MemoryRouter>
    )

    expect(screen.getByTestId('exercise-catalog')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'New exercise' })).toHaveAttribute(
      'href',
      RouterPath.ExerciseNew
    )
  })
})
