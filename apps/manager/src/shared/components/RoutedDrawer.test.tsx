import { DrawerPanel, DrawerPopup, DrawerTrigger } from '@powercoach/ui'
import { act, fireEvent, render, screen } from '@testing-library/react'
import { type ReactElement } from 'react'
import { createMemoryRouter, Outlet, RouterProvider, useLocation } from 'react-router'

import { RoutedDrawer } from './RoutedDrawer'

type MemoryRouterOptions = NonNullable<Parameters<typeof createMemoryRouter>[1]>
type InitialEntries = NonNullable<MemoryRouterOptions['initialEntries']>

interface ShellProps {
  matchDescendants?: boolean
  withTrigger?: boolean
}

function PathnameProbe(): ReactElement {
  const location = useLocation()

  return <span data-testid="pathname">{location.pathname}</span>
}

function Shell({ matchDescendants = false, withTrigger = false }: ShellProps): ReactElement {
  return (
    <>
      <PathnameProbe />
      <Outlet />
      <RoutedDrawer closeTo="/fallback" matchDescendants={matchDescendants} pathname="/drawer">
        {withTrigger && <DrawerTrigger>Open drawer</DrawerTrigger>}
        <DrawerPopup showCloseButton>
          <DrawerPanel>Drawer content</DrawerPanel>
        </DrawerPopup>
      </RoutedDrawer>
    </>
  )
}

function renderApp(
  initialEntries: InitialEntries,
  { matchDescendants = false, withTrigger = false }: ShellProps = {}
): ReturnType<typeof createMemoryRouter> {
  const router = createMemoryRouter(
    [
      {
        children: [{ element: <div>page content</div>, path: '*' }],
        element: <Shell matchDescendants={matchDescendants} withTrigger={withTrigger} />,
        path: '*'
      }
    ],
    { initialEntries }
  )

  render(<RouterProvider router={router} />)

  return router
}

describe('RoutedDrawer', () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true })
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('opens when the current route matches the drawer route', () => {
    renderApp(['/drawer'])

    expect(screen.getByText('Drawer content')).toBeInTheDocument()
  })

  it('matches nested routes when requested', () => {
    renderApp(['/drawer/new'], { matchDescendants: true })

    expect(screen.getByText('Drawer content')).toBeInTheDocument()
  })

  it('ignores direct open events because the route owns drawer visibility', () => {
    renderApp(['/source'], { withTrigger: true })

    fireEvent.click(screen.getByRole('button', { name: 'Open drawer' }))

    expect(screen.getByTestId('pathname')).toHaveTextContent('/source')
    expect(screen.queryByText('Drawer content')).not.toBeInTheDocument()
  })

  it('navigates back when closing with a background location', () => {
    renderApp([
      '/source',
      {
        pathname: '/drawer',
        state: {
          backgroundLocation: {
            hash: '',
            key: 'source',
            pathname: '/source',
            search: '',
            state: null
          }
        }
      }
    ])

    fireEvent.click(screen.getByRole('button', { name: 'Close' }))

    act(() => {
      vi.runAllTimers()
    })

    expect(screen.getByTestId('pathname')).toHaveTextContent('/source')
  })

  it('falls back to the close route without a background location', () => {
    renderApp(['/drawer'])

    fireEvent.click(screen.getByRole('button', { name: 'Close' }))

    act(() => {
      vi.runAllTimers()
    })

    expect(screen.getByTestId('pathname')).toHaveTextContent('/fallback')
  })
})
