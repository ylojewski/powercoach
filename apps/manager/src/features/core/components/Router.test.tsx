import { act, render, screen } from '@testing-library/react'
import { type ReactNode } from 'react'
import { generatePath } from 'react-router'

import { Router } from './Router'
import { RouterPath } from '../constants'

interface ExerciseCatalogDrawerMockProps {
  closing?: boolean
  onClosed?: () => void
  onCloseNavigation?: () => void
}

const exerciseCatalogDrawerMock = vi.hoisted(() => ({
  mountCount: 0,
  props: [] as ExerciseCatalogDrawerMockProps[]
}))

vi.mock('./Layout', async () => {
  const { useLocation, useParams } =
    await vi.importActual<typeof import('react-router')>('react-router')

  return {
    Layout: () => {
      const { pathname } = useLocation()
      const { athleteSlug } = useParams()

      return (
        <>
          Layout component
          <div data-testid="layout-pathname">{pathname}</div>
          <div data-testid="layout-athlete-slug">{athleteSlug}</div>
        </>
      )
    }
  }
})

vi.mock('@/exercises', async () => {
  const { useEffect } = await vi.importActual<typeof import('react')>('react')

  return {
    ExerciseCatalogDrawer: (props: ExerciseCatalogDrawerMockProps) => {
      useEffect(() => {
        exerciseCatalogDrawerMock.mountCount += 1
      }, [])

      exerciseCatalogDrawerMock.props.push(props)

      return (
        <>
          Exercise catalog drawer component
          {props.closing ? <div data-testid="exercise-catalog-drawer-closing" /> : null}
        </>
      )
    }
  }
})

vi.mock('./FeatureLoader', async () => {
  const { Outlet } = await vi.importActual<typeof import('react-router')>('react-router')

  return {
    FeatureLoader: ({ children }: { children?: ReactNode }) => (
      <div data-testid="feature-loader">{children ?? <Outlet />}</div>
    )
  }
})

vi.mock('./NotFound', () => ({
  NotFound: () => <>NotFound component</>
}))

describe('Router', () => {
  beforeEach(() => {
    exerciseCatalogDrawerMock.mountCount = 0
    exerciseCatalogDrawerMock.props = []
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

  it('renders the exercise catalog drawer over the layout route', () => {
    window.history.pushState({}, '', RouterPath.Exercises)
    render(<Router />)
    expect(screen.getByTestId('feature-loader')).toBeInTheDocument()
    expect(screen.getByText('Layout component')).toBeInTheDocument()
    expect(screen.getByTestId('layout-pathname')).toHaveTextContent(RouterPath.Home)
    expect(screen.getByText('Exercise catalog drawer component')).toBeInTheDocument()
  })

  it('uses the navigation state background route behind the exercise catalog drawer', () => {
    const backgroundLocation = {
      hash: '',
      key: 'reviews-route',
      pathname: RouterPath.Reviews,
      search: '',
      state: null
    }

    window.history.pushState(
      {
        key: 'exercise-catalog-route',
        usr: { backgroundLocation }
      },
      '',
      RouterPath.Exercises
    )

    render(<Router />)

    expect(screen.getByText('Exercise catalog drawer component')).toBeInTheDocument()
    expect(screen.getByTestId('layout-pathname')).toHaveTextContent(RouterPath.Reviews)
  })

  it('keeps the previous manager route behind the exercise catalog drawer', () => {
    window.history.pushState({}, '', RouterPath.Reviews)
    render(<Router />)

    expect(screen.getByTestId('layout-pathname')).toHaveTextContent(RouterPath.Reviews)

    act(() => {
      window.history.pushState({}, '', RouterPath.Exercises)
      window.dispatchEvent(new PopStateEvent('popstate', { state: window.history.state }))
    })

    expect(screen.getByText('Exercise catalog drawer component')).toBeInTheDocument()
    expect(screen.getByTestId('layout-pathname')).toHaveTextContent(RouterPath.Reviews)
  })

  it('animates the exercise catalog drawer closed on browser back', () => {
    window.history.pushState({}, '', RouterPath.Reviews)
    render(<Router />)

    act(() => {
      window.history.pushState({}, '', RouterPath.Exercises)
      window.dispatchEvent(new PopStateEvent('popstate', { state: window.history.state }))
    })

    expect(screen.getByText('Exercise catalog drawer component')).toBeInTheDocument()
    expect(exerciseCatalogDrawerMock.mountCount).toBe(1)

    act(() => {
      window.history.pushState({}, '', RouterPath.Reviews)
      window.dispatchEvent(new PopStateEvent('popstate', { state: window.history.state }))
    })

    expect(screen.getByText('Exercise catalog drawer component')).toBeInTheDocument()
    expect(screen.getByTestId('exercise-catalog-drawer-closing')).toBeInTheDocument()
    expect(exerciseCatalogDrawerMock.mountCount).toBe(1)

    act(() => {
      exerciseCatalogDrawerMock.props.at(-1)?.onClosed?.()
    })

    expect(screen.queryByText('Exercise catalog drawer component')).not.toBeInTheDocument()
  })

  it('does not replay the close animation after the drawer navigates itself away', () => {
    window.history.pushState({}, '', RouterPath.Reviews)
    render(<Router />)

    act(() => {
      window.history.pushState({}, '', RouterPath.Exercises)
      window.dispatchEvent(new PopStateEvent('popstate', { state: window.history.state }))
    })

    act(() => {
      exerciseCatalogDrawerMock.props.at(-1)?.onCloseNavigation?.()
    })

    act(() => {
      window.history.pushState({}, '', RouterPath.Reviews)
      window.dispatchEvent(new PopStateEvent('popstate', { state: window.history.state }))
    })

    expect(screen.queryByText('Exercise catalog drawer component')).not.toBeInTheDocument()
  })

  it('keeps the previous athlete route context behind the exercise catalog drawer', () => {
    const athleteReviewsPath = generatePath(RouterPath.AthleteReviews, {
      athleteSlug: 'kiro-flux'
    })

    window.history.pushState({}, '', athleteReviewsPath)
    render(<Router />)

    expect(screen.getByTestId('layout-pathname')).toHaveTextContent(athleteReviewsPath)
    expect(screen.getByTestId('layout-athlete-slug')).toHaveTextContent('kiro-flux')

    act(() => {
      window.history.pushState({}, '', RouterPath.Exercises)
      window.dispatchEvent(new PopStateEvent('popstate', { state: window.history.state }))
    })

    expect(screen.getByText('Exercise catalog drawer component')).toBeInTheDocument()
    expect(screen.getByTestId('layout-pathname')).toHaveTextContent(athleteReviewsPath)
    expect(screen.getByTestId('layout-athlete-slug')).toHaveTextContent('kiro-flux')
  })

  it('renders the not found route on unknown paths', () => {
    window.history.pushState({}, '', '/unknown/path')
    render(<Router />)
    expect(screen.getByText('NotFound component')).toBeInTheDocument()
    expect(screen.queryByTestId('feature-loader')).not.toBeInTheDocument()
  })
})
