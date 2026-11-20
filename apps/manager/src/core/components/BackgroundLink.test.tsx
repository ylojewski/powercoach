import { act, fireEvent, render, screen } from '@testing-library/react'
import { type ReactElement } from 'react'
import { createMemoryRouter, RouterProvider, useLocation } from 'react-router'

import { BackgroundLink } from './BackgroundLink'

function StateProbe(): ReactElement {
  const { state } = useLocation()
  return <span data-testid="state">{JSON.stringify(state)}</span>
}

function getState(): unknown {
  return JSON.parse(screen.getByTestId('state').textContent ?? 'null')
}

type InitialEntries = NonNullable<Parameters<typeof createMemoryRouter>[1]>['initialEntries']

async function renderLink({
  initialEntries = ['/'],
  linkState
}: {
  initialEntries?: InitialEntries
  linkState?: unknown
} = {}): Promise<void> {
  const router = createMemoryRouter(
    [
      {
        element: (
          <BackgroundLink state={linkState} to="/target">
            go
          </BackgroundLink>
        ),
        path: '/'
      },
      {
        element: <StateProbe />,
        path: '/target'
      }
    ],
    { initialEntries }
  )

  await act(async () => {
    render(<RouterProvider router={router} />)
  })

  fireEvent.click(screen.getByRole('link', { name: 'go' }))
}

describe('BackgroundLink', () => {
  it('renders a link', async () => {
    const router = createMemoryRouter([
      { element: <BackgroundLink to="/target">go</BackgroundLink>, path: '/' }
    ])

    await act(async () => {
      render(<RouterProvider router={router} />)
    })

    expect(screen.getByRole('link', { name: 'go' })).toBeInTheDocument()
  })

  it('sets the current location and params as background state', async () => {
    await renderLink({ linkState: { foo: 'bar' } })

    expect(getState()).toEqual({
      foo: 'bar',
      location: expect.objectContaining({ pathname: '/' }),
      params: {}
    })
  })

  it('merges the background state when present on the current location', async () => {
    const location = { hash: '', key: 'home', pathname: '/home', search: '', state: null }
    const params = { athleteSlug: 'kiro-flux' }

    await renderLink({
      initialEntries: [{ pathname: '/', state: { location, params } }],
      linkState: { foo: 'bar' }
    })

    expect(getState()).toEqual({ foo: 'bar', location, params })
  })

  it('background state takes precedence over the state prop', async () => {
    const location = { hash: '', key: 'home', pathname: '/home', search: '', state: null }
    const params = { athleteSlug: 'kiro-flux' }

    await renderLink({
      initialEntries: [{ pathname: '/', state: { location, params } }],
      linkState: { location: { pathname: '/should-be-overridden' }, params: {} }
    })

    expect(getState()).toEqual({ location, params })
  })
})
