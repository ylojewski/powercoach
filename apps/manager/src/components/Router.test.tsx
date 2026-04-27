import { render, screen } from '@testing-library/react'
import { generatePath } from 'react-router'

import { RouterPath } from '@/src/constants'

import { Router } from './Router'

vi.mock('./Layout', () => ({
  Layout: () => <>Layout component</>
}))

vi.mock('./FeatureLoader', async () => {
  const { Outlet } = await vi.importActual<typeof import('react-router')>('react-router')

  return {
    FeatureLoader: () => (
      <div data-testid="feature-loader">
        <Outlet />
      </div>
    )
  }
})

vi.mock('./NotFound', () => ({
  NotFound: () => <>NotFound component</>
}))

describe('Router', () => {
  beforeEach(() => {
    window.history.pushState({}, '', RouterPath.Home)
  })

  it('renders the layout on application routes', () => {
    window.history.pushState({}, '', RouterPath.Reviews)
    render(<Router />)
    expect(screen.getByTestId('feature-loader')).toBeInTheDocument()
    expect(screen.getByText('Layout component')).toBeInTheDocument()
  })

  it('renders the layout on athlete application routes', () => {
    window.history.pushState(
      {},
      '',
      generatePath(RouterPath.AthleteReviews, { athleteSlug: 'kiro-flux' })
    )
    render(<Router />)
    expect(screen.getByTestId('feature-loader')).toBeInTheDocument()
    expect(screen.getByText('Layout component')).toBeInTheDocument()
  })

  it('renders the not found route on unknown paths', () => {
    window.history.pushState({}, '', '/unknown/path')
    render(<Router />)
    expect(screen.getByText('NotFound component')).toBeInTheDocument()
    expect(screen.queryByTestId('feature-loader')).not.toBeInTheDocument()
  })
})
