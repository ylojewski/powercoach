import { act, fireEvent, render, screen } from '@testing-library/react'
import { type ReactElement } from 'react'
import { Provider } from 'react-redux'
import { createMemoryRouter, Outlet, RouterProvider, useLocation } from 'react-router'

import { createTestStore } from '@/test/utils/store'

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

async function renderApp(
  initialEntries: InitialEntries
): Promise<ReturnType<typeof createMemoryRouter>> {
  const router = createMemoryRouter(
    [{ children: [{ element: <div>home</div>, path: '*' }], element: <Shell />, path: '*' }],
    { initialEntries }
  )

  await act(async () => {
    render(
      <Provider store={createTestStore()}>
        <RouterProvider router={router} />
      </Provider>
    )
  })

  return router
}

describe('ExercisesDrawer', () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true })
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('does not render the catalog when off the exercise route', async () => {
    await renderApp(['/'])

    expect(screen.queryByTestId('exercise-catalog')).not.toBeInTheDocument()
  })

  it('opens the drawer with the catalog on the exercise route', async () => {
    await renderApp(['/exercise'])

    expect(screen.getByTestId('exercise-catalog')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Exercise' })).toBeInTheDocument()
  })

  it('opens the nested drawer on the new catalog exercise route', async () => {
    await renderApp(['/exercise/new'])

    expect(screen.getByTestId('exercise-catalog')).toBeInTheDocument()
    expect(screen.getByTestId('exercise-catalog-new')).toBeInTheDocument()
    expect(screen.getByText('Exercise')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'New exercise' })).toBeInTheDocument()
  })

  it('preserves the background location when opening the nested drawer', async () => {
    const backgroundLocation = {
      hash: '',
      key: 'home',
      pathname: '/',
      search: '',
      state: null
    }
    const router = await renderApp([
      {
        pathname: '/exercise',
        state: { backgroundLocation }
      }
    ])

    await act(async () => {
      fireEvent.click(screen.getByRole('link', { name: 'New exercise' }))
    })

    expect(screen.getByTestId('pathname')).toHaveTextContent('/exercise/new')
    expect(router.state.location.state).toEqual({ backgroundLocation })
  })

  it('navigates back when the close button is pressed', async () => {
    await renderApp(['/', '/exercise'])

    fireEvent.click(screen.getByRole('button', { name: 'Close' }))

    act(() => {
      vi.runAllTimers()
    })

    expect(screen.getByTestId('pathname')).toHaveTextContent('/')
  })

  it('returns to the catalog route when the nested drawer is closed directly', async () => {
    await renderApp(['/exercise/new'])

    fireEvent.click(screen.getByRole('button', { name: 'Close' }))

    act(() => {
      vi.runAllTimers()
    })

    expect(screen.getByTestId('pathname')).toHaveTextContent('/exercise')
  })

  it('does not block programmatic navigation away from the drawer route', async () => {
    const router = await renderApp(['/', '/exercise'])

    expect(screen.getByTestId('pathname')).toHaveTextContent('/exercise')

    await act(async () => {
      await router.navigate('/')
    })

    expect(screen.getByTestId('pathname')).toHaveTextContent('/')
  })
})
