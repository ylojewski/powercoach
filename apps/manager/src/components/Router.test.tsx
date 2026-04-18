import { render, screen } from '@testing-library/react'

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

  it('renders the not found route on unknown paths', () => {
    window.history.pushState({}, '', '/unknown')
    render(<Router />)
    expect(screen.getByText('NotFound component')).toBeInTheDocument()
  })
})
