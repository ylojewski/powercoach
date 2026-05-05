import { render, screen } from '@testing-library/react'

import { ExerciseCatalog } from './ExerciseCatalog'

describe('ExerciseCatalog', () => {
  it('renders the catalog placeholder', () => {
    render(<ExerciseCatalog />)

    expect(screen.getByTestId('exercise-catalog')).toBeInTheDocument()
  })
})
