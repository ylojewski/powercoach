import { render, screen } from '@testing-library/react'
import { generatePath } from 'react-router'

import { createRouterRoutes, Router } from './Router'
import { RouterPath } from '../constants'

vi.mock('./Layout', () => ({
  Layout: () => <>Layout component</>
}))

vi.mock('../loaders', () => ({
  createStartupLoader: () => () => null
}))

vi.mock('./NotFound', () => ({
  NotFound: () => <>NotFound component</>
}))

describe('Router', () => {
  beforeEach(() => {
    window.history.pushState({}, '', RouterPath.Home)
  })

  it('renders the layout on application routes', async () => {
    window.history.pushState({}, '', RouterPath.Reviews)
    render(<Router />)
    expect(await screen.findByText('Layout component')).toBeInTheDocument()
  })

  it('renders the layout on athlete application routes', async () => {
    window.history.pushState(
      {},
      '',
      generatePath(RouterPath.AthleteReviews, { athleteSlug: 'kiro-flux' })
    )
    render(<Router />)
    expect(await screen.findByText('Layout component')).toBeInTheDocument()
  })

  it('renders the not found route on unknown paths', async () => {
    window.history.pushState({}, '', '/unknown/path')
    render(<Router />)
    expect(await screen.findByText('NotFound component')).toBeInTheDocument()
  })

  it('does not revalidate the startup loader after boot', () => {
    const [route] = createRouterRoutes()

    expect(route?.shouldRevalidate?.({} as never)).toBe(false)
  })
})
