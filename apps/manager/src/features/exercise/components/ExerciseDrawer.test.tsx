import { act, fireEvent, render, screen } from '@testing-library/react'
import { type ReactElement } from 'react'
import { createMemoryRouter, Outlet, RouterProvider, useLocation } from 'react-router'

import { RouterPath } from '@/core'

import { ExerciseDrawer } from './ExerciseDrawer'

vi.mock('./ExerciseCatalog', () => ({
  ExerciseCatalog: () => <div data-testid="exercise-catalog">Catalog</div>
}))

function PathnameProbe(): ReactElement {
  const location = useLocation()

  return <span data-testid="pathname">{location.pathname}</span>
}

function Shell(): ReactElement {
  return (
    <>
      <PathnameProbe />
      <Outlet />
      <ExerciseDrawer />
    </>
  )
}

function renderApp(initialEntries: string[]): ReturnType<typeof createMemoryRouter> {
  const router = createMemoryRouter(
    [{ children: [{ element: <div>home</div>, path: '*' }], element: <Shell />, path: '*' }],
    { initialEntries }
  )

  render(<RouterProvider router={router} />)

  return router
}

describe('ExerciseDrawer', () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true })
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('does not render the catalog when off the exercise route', () => {
    renderApp([RouterPath.Home])

    expect(screen.queryByTestId('exercise-catalog')).not.toBeInTheDocument()
  })

  it('opens the drawer with the catalog on the exercise route', () => {
    renderApp([RouterPath.Exercise])

    expect(screen.getByTestId('exercise-catalog')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Exercise' })).toBeInTheDocument()
  })

  it('navigates back when the close button is pressed', () => {
    renderApp([RouterPath.Home, RouterPath.Exercise])

    fireEvent.click(screen.getByRole('button', { name: 'Close' }))

    act(() => {
      vi.runAllTimers()
    })

    expect(screen.getByTestId('pathname')).toHaveTextContent(RouterPath.Home)
  })

  it('does not block programmatic navigation away from the drawer route', async () => {
    const router = renderApp([RouterPath.Home, RouterPath.Exercise])

    expect(screen.getByTestId('pathname')).toHaveTextContent(RouterPath.Exercise)

    await act(async () => {
      await router.navigate(RouterPath.Home)
    })

    expect(screen.getByTestId('pathname')).toHaveTextContent(RouterPath.Home)
  })
})
