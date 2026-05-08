import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { type ReactElement, type ReactNode } from 'react'
import { createMemoryRouter, RouterProvider, useLocation } from 'react-router'

import { RoutedDrawer } from './RoutedDrawer'

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

async function renderRoutedDrawer({
  initialEntries = ['/items'],
  props = {}
}: {
  initialEntries?: InitialEntries
  props?: Partial<Parameters<typeof RoutedDrawer>[0]>
} = {}): Promise<ReturnType<typeof createMemoryRouter>> {
  const router = createMemoryRouter(
    [
      {
        element: (
          <>
            <PathnameProbe />
            <RoutedDrawer
              fallbackPathname="/fallback"
              pathname="/items"
              position="bottom"
              {...props}
            >
              <div>drawer content</div>
            </RoutedDrawer>
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

describe('RoutedDrawer', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('opens the drawer and renders its content on the exact route', async () => {
    await renderRoutedDrawer()

    expect(screen.getByText('drawer content')).toBeInTheDocument()
    expectDrawerOpen(true)
  })

  it('does match descendant routes by default', async () => {
    await renderRoutedDrawer({
      initialEntries: ['/items/new']
    })

    expectDrawerOpen(true)
  })

  it('matches descendant routes when requested', async () => {
    await renderRoutedDrawer({
      initialEntries: ['/items/new'],
      props: {
        matchDescendants: true
      }
    })

    expectDrawerOpen(true)
  })

  it('does not match descendant routes when disabled', async () => {
    await renderRoutedDrawer({
      initialEntries: ['/items/new'],
      props: {
        matchDescendants: false
      }
    })

    expectDrawerOpen(false)
  })

  it('does not match similarly prefixed routes as descendants', async () => {
    await renderRoutedDrawer({
      initialEntries: ['/items-other'],
      props: {
        matchDescendants: true
      }
    })

    expectDrawerOpen(false)
  })

  it('ignores open events', async () => {
    await renderRoutedDrawer()

    fireEvent.click(screen.getByRole('button', { name: 'open' }))

    expect(screen.getByTestId('pathname')).toHaveTextContent('/items')
    expectDrawerOpen(true)
  })

  it('returns to the background location when closing from one', async () => {
    const backgroundLocation = {
      hash: '',
      key: 'home',
      pathname: '/home',
      search: '',
      state: null
    }

    await renderRoutedDrawer({
      initialEntries: [
        backgroundLocation,
        {
          pathname: '/items',
          state: { backgroundLocation }
        }
      ]
    })

    fireEvent.click(screen.getByRole('button', { name: 'close' }))

    await waitFor(() => {
      expect(screen.getByTestId('pathname')).toHaveTextContent('/home')
    })
  })

  it('returns to the fallback route when closing directly', async () => {
    await renderRoutedDrawer()

    fireEvent.click(screen.getByRole('button', { name: 'close' }))

    await waitFor(() => {
      expect(screen.getByTestId('pathname')).toHaveTextContent('/fallback')
    })
  })
})
