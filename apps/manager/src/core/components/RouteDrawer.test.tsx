import { Drawer } from '@powercoach/ui'
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { type ReactElement, type ReactNode } from 'react'
import { createMemoryRouter, RouterProvider, useLocation } from 'react-router'

import { RouteDrawer } from './RouteDrawer'

type MemoryRouterOptions = NonNullable<Parameters<typeof createMemoryRouter>[1]>
type InitialEntries = NonNullable<MemoryRouterOptions['initialEntries']>

const mocks = vi.hoisted(() => ({
  drawer: vi.fn()
}))

vi.mock('@powercoach/ui', () => ({
  Drawer: ({
    children,
    onOpenChange,
    open,
    position
  }: {
    children: ReactNode
    onOpenChange: (open: boolean) => void
    open: boolean
    position?: string
  }): ReactElement => {
    mocks.drawer({ open, position })
    return (
      <section data-open={open}>
        <button onClick={() => onOpenChange(true)}>open</button>
        <button onClick={() => onOpenChange(false)}>close</button>
        {children}
      </section>
    )
  }
}))

function PathnameProbe(): ReactElement {
  const location = useLocation()

  return <span data-testid="pathname">{location.pathname}</span>
}

async function renderRouteDrawer({
  initialEntries = ['/items'],
  path = '/items'
}: {
  initialEntries?: InitialEntries
  path?: string
} = {}): Promise<ReturnType<typeof createMemoryRouter>> {
  const router = createMemoryRouter(
    [
      {
        element: (
          <>
            <PathnameProbe />
            <RouteDrawer drawer={<Drawer position="bottom" />} fallbackPath="/fallback" path={path}>
              <div>drawer content</div>
            </RouteDrawer>
          </>
        ),
        path: '*'
      }
    ],
    { initialEntries }
  )

  await act(async () => {
    render(<RouterProvider router={router} />)
  })

  return router
}

function expectDrawerOpen(open: boolean): void {
  expect(mocks.drawer).toHaveBeenLastCalledWith({ open, position: 'bottom' })
}

describe('RouteDrawer', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('opens the drawer and renders its content on the exact route', async () => {
    await renderRouteDrawer()

    expect(screen.getByText('drawer content')).toBeInTheDocument()
    expectDrawerOpen(true)
  })

  it('matches descendant routes', async () => {
    await renderRouteDrawer({
      initialEntries: ['/items/new']
    })

    expectDrawerOpen(true)
  })

  it('matches descendants from the root route', async () => {
    await renderRouteDrawer({
      initialEntries: ['/items'],
      path: '/'
    })

    expectDrawerOpen(true)
  })

  it('does not match similarly prefixed routes as descendants', async () => {
    await renderRouteDrawer({
      initialEntries: ['/items-other']
    })

    expectDrawerOpen(false)
  })

  it('ignores open events', async () => {
    await renderRouteDrawer()

    fireEvent.click(screen.getByRole('button', { name: 'open' }))

    expect(screen.getByTestId('pathname')).toHaveTextContent('/items')
    expectDrawerOpen(true)
  })

  it('returns to the background location when closing from one', async () => {
    const location = {
      hash: '',
      key: 'home',
      pathname: '/home',
      search: '',
      state: null
    }

    await renderRouteDrawer({
      initialEntries: [
        location,
        {
          pathname: '/items',
          state: { location, params: {} }
        }
      ]
    })

    fireEvent.click(screen.getByRole('button', { name: 'close' }))

    await waitFor(() => {
      expect(screen.getByTestId('pathname')).toHaveTextContent('/home')
    })
  })

  it('returns to the fallback route when closing directly', async () => {
    await renderRouteDrawer()

    fireEvent.click(screen.getByRole('button', { name: 'close' }))

    await waitFor(() => {
      expect(screen.getByTestId('pathname')).toHaveTextContent('/fallback')
    })
  })
})
