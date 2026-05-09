import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { generatePath } from 'react-router'

import { createTestStore } from '@/test/utils/store'

import { Router } from './Router'

vi.mock('@/modules/exercises', () => ({
  exercisesDrawers: null,
  ExercisesRouterPath: { New: 'new' },
  exercisesRoutes: null
}))

vi.mock('./Layout', () => ({
  Layout: () => <>Layout component</>
}))

vi.mock('./ModuleLoader', async () => {
  const { Outlet } = await vi.importActual<typeof import('react-router')>('react-router')

  return {
    ModuleLoader: () => (
      <div data-testid="module-loader">
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
    window.history.pushState({}, '', '/')
  })

  function renderRouter(): void {
    render(
      <Provider store={createTestStore()}>
        <Router />
      </Provider>
    )
  }

  it('renders the layout on application routes', () => {
    window.history.pushState({}, '', '/reviews')
    renderRouter()
    expect(screen.getByTestId('module-loader')).toBeInTheDocument()
    expect(screen.getByText('Layout component')).toBeInTheDocument()
  })

  it('renders the layout on athlete application routes', () => {
    window.history.pushState(
      {},
      '',
      generatePath('/:athleteSlug/reviews', { athleteSlug: 'kiro-flux' })
    )
    renderRouter()
    expect(screen.getByTestId('module-loader')).toBeInTheDocument()
    expect(screen.getByText('Layout component')).toBeInTheDocument()
  })

  it('renders the not found route on unknown paths', () => {
    window.history.pushState({}, '', '/unknown/path')
    renderRouter()
    expect(screen.getByText('NotFound component')).toBeInTheDocument()
    expect(screen.queryByTestId('module-loader')).not.toBeInTheDocument()
  })
})
