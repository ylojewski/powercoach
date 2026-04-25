import { render, screen } from '@testing-library/react'
import { generatePath } from 'react-router'

import { RouterPath } from '@/src/constants'

import { Router } from './Router'

vi.mock('./Layout', () => ({
  Layout: () => <>Layout component</>
}))

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
    expect(screen.getByText('Layout component')).toBeInTheDocument()
  })

  it('renders the layout on athlete application routes', () => {
    window.history.pushState(
      {},
      '',
      generatePath(RouterPath.AthleteReviews, { athleteSlug: 'kiro-flux' })
    )
    render(<Router />)
    expect(screen.getByText('Layout component')).toBeInTheDocument()
  })

  it('renders the not found route on unknown paths', () => {
    window.history.pushState({}, '', '/unknown/path')
    render(<Router />)
    expect(screen.getByText('NotFound component')).toBeInTheDocument()
  })
})
