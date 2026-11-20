import { BottomSheet } from '@powercoach/ui'
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { type ReactElement, type ReactNode } from 'react'
import { createMemoryRouter, RouterProvider, useLocation } from 'react-router'

import { RouteDrawer } from './RouteDrawer'

type MemoryRouterOptions = NonNullable<Parameters<typeof createMemoryRouter>[1]>
type InitialEntries = NonNullable<MemoryRouterOptions['initialEntries']>

const dismissalMethods = ['close', 'Escape', 'backdrop', 'swipe'] as const

const mocks = vi.hoisted(() => ({
  bottomSheetRoot: vi.fn()
}))

vi.mock('@powercoach/ui', () => ({
  BottomSheet: {
    Root: ({
      children,
      disablePointerDismissal,
      onOpenChange,
      open
    }: {
      children: ReactNode
      disablePointerDismissal?: boolean
      onOpenChange: (open: boolean) => void
      open: boolean
    }): ReactElement => {
      mocks.bottomSheetRoot({ disablePointerDismissal, open })
      return (
        <section data-open={open}>
          <button onClick={() => onOpenChange(true)}>open</button>
          {dismissalMethods.map((method) => (
            <button key={method} onClick={() => onOpenChange(false)}>
              {method}
            </button>
          ))}
          {children}
        </section>
      )
    }
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
            <RouteDrawer drawer={<BottomSheet.Root />} fallbackPath="/fallback" path={path}>
              <div>bottom sheet content</div>
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

function expectBottomSheetOpen(open: boolean): void {
  expect(mocks.bottomSheetRoot).toHaveBeenLastCalledWith({
    disablePointerDismissal: undefined,
    open
  })
}

describe('RouteDrawer', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('opens the bottom sheet and renders its content on the exact route', async () => {
    await renderRouteDrawer()

    expect(screen.getByText('bottom sheet content')).toBeInTheDocument()
    expectBottomSheetOpen(true)
  })

  it('matches descendant routes', async () => {
    await renderRouteDrawer({
      initialEntries: ['/items/new']
    })

    expectBottomSheetOpen(true)
  })

  it('matches descendants from the root route', async () => {
    await renderRouteDrawer({
      initialEntries: ['/items'],
      path: '/'
    })

    expectBottomSheetOpen(true)
  })

  it('does not match similarly prefixed routes as descendants', async () => {
    await renderRouteDrawer({
      initialEntries: ['/items-other']
    })

    expectBottomSheetOpen(false)
  })

  it('ignores open events', async () => {
    await renderRouteDrawer()

    fireEvent.click(screen.getByRole('button', { name: 'open' }))

    expect(screen.getByTestId('pathname')).toHaveTextContent('/items')
    expectBottomSheetOpen(true)
  })

  it.each(dismissalMethods)(
    'returns to the background location after a %s dismissal request',
    async (method) => {
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

      fireEvent.click(screen.getByRole('button', { name: method }))

      await waitFor(() => {
        expect(screen.getByTestId('pathname')).toHaveTextContent('/home')
      })
    }
  )

  it.each(dismissalMethods)(
    'returns to the fallback route after a direct-entry %s dismissal request',
    async (method) => {
      await renderRouteDrawer()

      fireEvent.click(screen.getByRole('button', { name: method }))

      await waitFor(() => {
        expect(screen.getByTestId('pathname')).toHaveTextContent('/fallback')
      })
    }
  )
})
