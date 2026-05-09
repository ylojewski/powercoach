import { act, fireEvent, render, screen } from '@testing-library/react'
import { type ReactElement } from 'react'
import { createMemoryRouter, RouterProvider, useLocation } from 'react-router'

import { RoutedDrawerLink } from './RoutedDrawerLink'

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
          <RoutedDrawerLink state={linkState} to="/target">
            go
          </RoutedDrawerLink>
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

describe('RoutedDrawerLink', () => {
  it('renders a link', async () => {
    const router = createMemoryRouter([
      { element: <RoutedDrawerLink to="/target">go</RoutedDrawerLink>, path: '/' }
    ])

    await act(async () => {
      render(<RouterProvider router={router} />)
    })

    expect(screen.getByRole('link', { name: 'go' })).toBeInTheDocument()
  })

  it('sets the current location as backgroundLocation when there is no background location state', async () => {
    await renderLink({ linkState: { foo: 'bar' } })

    expect(getState()).toEqual({
      backgroundLocation: expect.objectContaining({ pathname: '/' }),
      foo: 'bar'
    })
  })

  it('merges the background location state when present on the current location', async () => {
    const backgroundLocation = { hash: '', key: 'home', pathname: '/home', search: '', state: null }

    await renderLink({
      initialEntries: [{ pathname: '/', state: { backgroundLocation } }],
      linkState: { foo: 'bar' }
    })

    expect(getState()).toEqual({ backgroundLocation, foo: 'bar' })
  })

  it('background location state takes precedence over the state prop', async () => {
    const backgroundLocation = { hash: '', key: 'home', pathname: '/home', search: '', state: null }

    await renderLink({
      initialEntries: [{ pathname: '/', state: { backgroundLocation } }],
      linkState: { backgroundLocation: { pathname: '/should-be-overridden' } }
    })

    expect(getState()).toEqual({ backgroundLocation })
  })
})
