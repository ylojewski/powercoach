import { render, screen } from '@testing-library/react'
import { createMemoryRouter, RouterProvider } from 'react-router'

import { RouterPath } from '@/core/constants'

import { ExerciseCatalog } from './ExerciseCatalog'

describe('ExerciseCatalog', () => {
  it('renders the catalog placeholder', () => {
    const router = createMemoryRouter(
      [{ element: <ExerciseCatalog />, path: RouterPath.Exercise }],
      { initialEntries: [RouterPath.Exercise] }
    )

    render(<RouterProvider router={router} />)

    expect(screen.getByTestId('exercise-catalog')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'New exercise' })).toHaveAttribute(
      'href',
      RouterPath.ExerciseNew
    )
  })
})
