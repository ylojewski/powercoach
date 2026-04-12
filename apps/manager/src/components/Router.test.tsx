import { render, screen } from '@testing-library/react'

import { routerPaths } from '@/src/constants/router-paths'

import { Router } from './Router'

vi.mock('./Layout', () => ({
  Layout: () => <>Layout component</>
}))

vi.mock('./NotFound', () => ({
  NotFound: () => <>NotFound component</>
}))

describe('Router', () => {
  beforeEach(() => {
    window.history.pushState({}, '', routerPaths.home)
  })

  it('renders the layout on application routes', () => {
    window.history.pushState({}, '', routerPaths.reviews)
    render(<Router />)
    expect(screen.getByText('Layout component')).toBeInTheDocument()
  })

  it('renders the not found route on unknown paths', () => {
    window.history.pushState({}, '', '/unknown')
    render(<Router />)
    expect(screen.getByText('NotFound component')).toBeInTheDocument()
  })
})
