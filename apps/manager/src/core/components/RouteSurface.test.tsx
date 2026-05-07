import { render, screen } from '@testing-library/react'
import { type ReactElement } from 'react'
import { MemoryRouter, type RouteObject, useLocation } from 'react-router'

import { RouteSurface } from './RouteSurface'

interface ShellProps {
  fallback?: ReactElement | null
  routes: RouteObject[]
}

function Shell({ fallback, routes }: ShellProps): ReactElement {
  const location = useLocation()

  return <RouteSurface fallback={fallback} location={location} routes={routes} />
}

function renderRouteSurface(initialEntry: string, props: ShellProps): void {
  render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <Shell {...props} />
    </MemoryRouter>
  )
}

describe('RouteSurface', () => {
  it('renders the route matching the current location', () => {
    renderRouteSurface('/matched', {
      routes: [{ element: <div>Matched route</div>, path: '/matched' }]
    })

    expect(screen.getByText('Matched route')).toBeInTheDocument()
  })

  it('renders the fallback when no route matches', () => {
    renderRouteSurface('/missing', {
      fallback: <div>Fallback route</div>,
      routes: [{ element: <div>Matched route</div>, path: '/matched' }]
    })

    expect(screen.getByText('Fallback route')).toBeInTheDocument()
    expect(screen.queryByText('Matched route')).not.toBeInTheDocument()
  })

  it('renders nothing without a matching route or fallback', () => {
    const { container } = render(
      <MemoryRouter initialEntries={['/missing']}>
        <Shell routes={[{ element: <div>Matched route</div>, path: '/matched' }]} />
      </MemoryRouter>
    )

    expect(container).toBeEmptyDOMElement()
  })
})
