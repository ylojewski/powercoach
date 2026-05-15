import { act, fireEvent, render, type RenderResult, screen } from '@testing-library/react'
import { type ReactElement } from 'react'
import { Provider } from 'react-redux'
import { createMemoryRouter, MemoryRouter, Outlet, RouterProvider, useLocation } from 'react-router'

import { RouteDrawer } from '@/core'
import { useReferences } from '@/modules/references/hooks'
import { createTestStore } from '@/test/utils/store'

import { ExercisesDrawer } from './ExercisesDrawer'
import { NewExerciseDrawer } from './NewExerciseDrawer'

vi.mock('@/modules/references/hooks', () => ({
  useReferences: vi.fn()
}))

vi.mock('./NewExercise', () => ({
  NewExercise: () => <div data-testid="new-exercise" />
}))

type MemoryRouterOptions = NonNullable<Parameters<typeof createMemoryRouter>[1]>
type InitialEntries = NonNullable<MemoryRouterOptions['initialEntries']>

const cancelReferencesLoadMock = vi.fn()
const loadReferencesMock = vi.fn(() => cancelReferencesLoadMock)
const useReferencesMock = vi.mocked(useReferences)

function mockReferences(loading = false): void {
  useReferencesMock.mockReturnValue({
    load: loadReferencesMock,
    loading,
    references: null
  })
}

function PathnameProbe(): ReactElement {
  const location = useLocation()

  return <span data-testid="pathname">{location.pathname}</span>
}

function Shell(): ReactElement {
  return (
    <>
      <PathnameProbe />
      <Outlet />
      <RouteDrawer drawer={<ExercisesDrawer />} fallbackPath="/" path="/exercises">
        <RouteDrawer
          drawer={<NewExerciseDrawer />}
          fallbackPath="/exercises"
          path="/exercises/new"
        />
      </RouteDrawer>
    </>
  )
}

async function renderDrawer(open = true): Promise<RenderResult> {
  let renderResult: RenderResult | undefined

  await act(async () => {
    renderResult = render(
      <Provider store={createTestStore()}>
        <MemoryRouter>
          <ExercisesDrawer open={open} />
        </MemoryRouter>
      </Provider>
    )
  })

  if (!renderResult) {
    throw new Error('Expected the drawer to render')
  }

  return renderResult
}

async function renderNewDrawer(open = true): Promise<RenderResult> {
  let renderResult: RenderResult | undefined

  await act(async () => {
    renderResult = render(
      <Provider store={createTestStore()}>
        <MemoryRouter>
          <NewExerciseDrawer open={open} />
        </MemoryRouter>
      </Provider>
    )
  })

  if (!renderResult) {
    throw new Error('Expected the new exercise drawer to render')
  }

  return renderResult
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
    mockReferences()
  })

  afterEach(() => {
    vi.clearAllMocks()
    vi.useRealTimers()
  })

  it('does not render the catalog when off the exercise route', async () => {
    await renderApp(['/'])

    expect(screen.queryByTestId('exercise-catalog')).not.toBeInTheDocument()
  })

  it('opens the drawer with the catalog on the exercise route', async () => {
    await renderApp(['/exercises'])

    expect(screen.getByTestId('exercise-catalog')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Exercise' })).toBeInTheDocument()
  })

  it('opens the nested drawer on the new catalog exercise route', async () => {
    await renderApp(['/exercises/new'])

    expect(screen.getByTestId('exercise-catalog')).toBeInTheDocument()
    expect(screen.getByTestId('new-exercise')).toBeInTheDocument()
    expect(screen.getByText('Exercise')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'New exercise' })).toBeInTheDocument()
  })

  it('covers both exercise drawers while references load on the new catalog exercise route', async () => {
    mockReferences(true)

    await renderApp(['/exercises/new'])

    const loaderPopups = new Set(
      screen
        .getAllByLabelText('loading powercoach')
        .map((overlay) => overlay.closest('[data-slot="drawer-popup"]'))
    )

    expect(loaderPopups.size).toBe(2)
  })

  it('preserves the background location when opening the nested drawer', async () => {
    const backgroundState = {
      location: {
        hash: '',
        key: 'home',
        pathname: '/',
        search: '',
        state: null
      },
      params: {}
    }
    const router = await renderApp([
      {
        pathname: '/exercises',
        state: backgroundState
      }
    ])

    await act(async () => {
      fireEvent.click(screen.getByRole('link', { name: 'New exercise' }))
    })

    expect(screen.getByTestId('pathname')).toHaveTextContent('/exercises/new')
    expect(router.state.location.state).toEqual(backgroundState)
  })

  it('navigates back when the close button is pressed', async () => {
    await renderApp(['/', '/exercises'])

    fireEvent.click(screen.getByRole('button', { name: 'Close' }))

    act(() => {
      vi.runAllTimers()
    })

    expect(screen.getByTestId('pathname')).toHaveTextContent('/')
  })

  it('returns to the catalog route when the nested drawer is closed directly', async () => {
    await renderApp(['/exercises/new'])

    const closeButtons = screen.getAllByRole('button', { name: 'Close' })
    const nestedCloseButton = closeButtons.at(-1)

    if (!nestedCloseButton) {
      throw new Error('Expected the nested drawer close button to exist')
    }

    fireEvent.click(nestedCloseButton)

    act(() => {
      vi.runAllTimers()
    })

    expect(screen.getByTestId('pathname')).toHaveTextContent('/exercises')
  })

  it('does not block programmatic navigation away from the drawer route', async () => {
    const router = await renderApp(['/', '/exercises'])

    expect(screen.getByTestId('pathname')).toHaveTextContent('/exercises')

    await act(async () => {
      await router.navigate('/')
    })

    expect(screen.getByTestId('pathname')).toHaveTextContent('/')
  })

  it('loads references when the drawer is opened', async () => {
    await renderDrawer()

    expect(loadReferencesMock).toHaveBeenCalledOnce()
  })

  it('cancels the references load when the drawer is removed', async () => {
    const { unmount } = await renderDrawer()

    cancelReferencesLoadMock.mockClear()
    unmount()

    expect(cancelReferencesLoadMock).toHaveBeenCalledOnce()
  })

  it('covers the drawer while references are loading', async () => {
    mockReferences(true)

    await renderDrawer()

    const overlay = screen.getByLabelText('loading powercoach')

    expect(overlay).toBeInTheDocument()
    expect(overlay.closest('[data-slot="drawer-popup"]')).toBeInTheDocument()
  })

  it('skips the loader when references are already loaded', async () => {
    await renderDrawer()

    expect(screen.queryByLabelText('loading powercoach')).not.toBeInTheDocument()
  })

  it('loads references when the new exercise drawer is opened', async () => {
    await renderNewDrawer()

    expect(loadReferencesMock).toHaveBeenCalledOnce()
  })

  it('cancels the references load when the new exercise drawer is removed', async () => {
    const { unmount } = await renderNewDrawer()

    cancelReferencesLoadMock.mockClear()
    unmount()

    expect(cancelReferencesLoadMock).toHaveBeenCalledOnce()
  })

  it('covers the new exercise drawer while references are loading', async () => {
    mockReferences(true)

    await renderNewDrawer()

    const overlay = screen.getByLabelText('loading powercoach')

    expect(overlay).toBeInTheDocument()
    expect(overlay.closest('[data-slot="drawer-popup"]')).toBeInTheDocument()
  })

  it('skips the loader when references do not need loading coverage', async () => {
    await renderDrawer()

    expect(screen.queryByLabelText('loading powercoach')).not.toBeInTheDocument()
  })
})
