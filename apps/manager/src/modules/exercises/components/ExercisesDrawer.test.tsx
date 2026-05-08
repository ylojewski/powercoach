import { act, fireEvent, render, screen } from '@testing-library/react'
import { type ReactElement } from 'react'
import { createMemoryRouter, Outlet, RouterProvider, useLocation } from 'react-router'

import { RouterPath } from '@/app'

import { ExercisesDrawer } from './ExercisesDrawer'

type MemoryRouterOptions = NonNullable<Parameters<typeof createMemoryRouter>[1]>
type InitialEntries = NonNullable<MemoryRouterOptions['initialEntries']>

function PathnameProbe(): ReactElement {
  const location = useLocation()

  return <span data-testid="pathname">{location.pathname}</span>
}

function Shell(): ReactElement {
  return (
    <>
      <PathnameProbe />
      <Outlet />
      <ExercisesDrawer />
    </>
  )
}

function renderApp(initialEntries: InitialEntries): ReturnType<typeof createMemoryRouter> {
  const router = createMemoryRouter(
    [{ children: [{ element: <div>home</div>, path: '*' }], element: <Shell />, path: '*' }],
    { initialEntries }
  )

  render(<RouterProvider router={router} />)

  return router
}

describe('ExercisesDrawer', () => {
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

  it('opens the nested drawer on the new catalog exercise route', () => {
    renderApp([RouterPath.ExerciseNew])

    expect(screen.getByTestId('exercise-catalog')).toBeInTheDocument()
    expect(screen.getByTestId('exercise-catalog-new')).toBeInTheDocument()
    expect(screen.getByText('Exercise')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'New exercise' })).toBeInTheDocument()
  })

  it('preserves the background location when opening the nested drawer', async () => {
    const backgroundLocation = {
      hash: '',
      key: 'home',
      pathname: RouterPath.Home,
      search: '',
      state: null
    }
    const router = renderApp([
      {
        pathname: RouterPath.Exercise,
        state: { backgroundLocation }
      }
    ])

    await act(async () => {
      fireEvent.click(screen.getByRole('link', { name: 'New exercise' }))
    })

    expect(screen.getByTestId('pathname')).toHaveTextContent(RouterPath.ExerciseNew)
    expect(router.state.location.state).toEqual({ backgroundLocation })
  })

  it('navigates back when the close button is pressed', () => {
    renderApp([RouterPath.Home, RouterPath.Exercise])

    fireEvent.click(screen.getByRole('button', { name: 'Close' }))

    act(() => {
      vi.runAllTimers()
    })

    expect(screen.getByTestId('pathname')).toHaveTextContent(RouterPath.Home)
  })

  it('returns to the catalog route when the nested drawer is closed directly', () => {
    renderApp([RouterPath.ExerciseNew])

    fireEvent.click(screen.getByRole('button', { name: 'Close' }))

    act(() => {
      vi.runAllTimers()
    })

    expect(screen.getByTestId('pathname')).toHaveTextContent(RouterPath.Exercise)
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
