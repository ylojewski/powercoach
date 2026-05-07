import { fireEvent, render, screen } from '@testing-library/react'
import { type ReactElement } from 'react'
import { type Location, MemoryRouter, useLocation } from 'react-router'

import { RoutedDrawerLink } from './RoutedDrawerLink'

let currentLocation: Location | null = null

function LocationProbe(): ReactElement {
  currentLocation = useLocation()

  return <span data-testid="pathname">{currentLocation.pathname}</span>
}

function renderLink(initialEntries: Parameters<typeof MemoryRouter>[0]['initialEntries']): void {
  currentLocation = null

  render(
    <MemoryRouter initialEntries={initialEntries}>
      <LocationProbe />
      <RoutedDrawerLink to="/drawer">Open drawer</RoutedDrawerLink>
    </MemoryRouter>
  )
}

describe('RoutedDrawerLink', () => {
  it('uses the current location as background location', () => {
    renderLink(['/source'])

    fireEvent.click(screen.getByRole('link', { name: 'Open drawer' }))

    expect(screen.getByTestId('pathname')).toHaveTextContent('/drawer')
    expect(currentLocation?.state).toMatchObject({
      backgroundLocation: expect.objectContaining({ pathname: '/source' })
    })
  })

  it('preserves an existing background location for nested drawers', () => {
    const backgroundLocation = {
      hash: '',
      key: 'home',
      pathname: '/',
      search: '',
      state: null
    } as Location

    renderLink([
      {
        pathname: '/source',
        state: { backgroundLocation }
      }
    ])

    fireEvent.click(screen.getByRole('link', { name: 'Open drawer' }))

    expect(currentLocation?.state).toEqual({ backgroundLocation })
  })
})
