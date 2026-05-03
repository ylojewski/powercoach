import { act, render, screen } from '@testing-library/react'
import { type ReactNode } from 'react'
import { useLocation, useNavigate } from 'react-router'

import { RouterPath } from '@/core'

import { ExerciseCatalogDrawer } from './ExerciseCatalogDrawer'

interface DrawerMockProps {
  children?: ReactNode
  handle?: {
    close: () => void
    open: (triggerId: string | null) => void
  }
  onOpenChange?: (open: boolean) => void
  onOpenChangeComplete?: (open: boolean) => void
  position?: string
}

interface DrawerPartMockProps {
  children?: ReactNode
  className?: string
}

const drawerMock = vi.hoisted(() => ({
  handle: {
    close: vi.fn(),
    open: vi.fn()
  },
  props: [] as DrawerMockProps[]
}))

vi.mock('@powercoach/ui', () => ({
  Drawer: ({ children, ...props }: DrawerMockProps) => {
    drawerMock.props.push(props)

    return <div data-testid="drawer">{children}</div>
  },
  DrawerCreateHandle: () => drawerMock.handle,
  DrawerDescription: ({ children }: DrawerPartMockProps) => <p>{children}</p>,
  DrawerHeader: ({ children }: DrawerPartMockProps) => <header>{children}</header>,
  DrawerPanel: ({ children }: DrawerPartMockProps) => <main>{children}</main>,
  DrawerPopup: ({ children, className }: DrawerPartMockProps) => (
    <section className={className}>{children}</section>
  ),
  DrawerTitle: ({ children }: DrawerPartMockProps) => <h2>{children}</h2>
}))

vi.mock('react-router', async () => {
  const actual = await vi.importActual<typeof import('react-router')>('react-router')

  return {
    ...actual,
    useLocation: vi.fn(),
    useNavigate: vi.fn()
  }
})

const navigateMock = vi.fn()
const useLocationMock = vi.mocked(useLocation)
const useNavigateMock = vi.mocked(useNavigate)
let animationFrameCallback: FrameRequestCallback | null = null

function createLocation(key: string): ReturnType<typeof useLocation> {
  return {
    hash: '',
    key,
    pathname: RouterPath.Exercises,
    search: '',
    state: null,
    unstable_mask: undefined
  }
}

function getDrawerProps(): DrawerMockProps {
  const props = drawerMock.props.at(-1)

  if (!props) {
    throw new Error('Drawer was not rendered')
  }

  return props
}

function runAnimationFrame(): void {
  if (!animationFrameCallback) {
    throw new Error('Animation frame was not scheduled')
  }

  act(() => {
    animationFrameCallback?.(0)
  })
}

describe('ExerciseCatalogDrawer', () => {
  beforeEach(() => {
    animationFrameCallback = null
    drawerMock.handle.close.mockReset()
    drawerMock.handle.open.mockReset()
    drawerMock.props = []
    navigateMock.mockReset()
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation(
      (callback: FrameRequestCallback): number => {
        animationFrameCallback = callback

        return 1
      }
    )
    vi.spyOn(window, 'cancelAnimationFrame').mockImplementation(() => undefined)
    useLocationMock.mockReturnValue(createLocation('default'))
    useNavigateMock.mockReturnValue(navigateMock)
  })

  afterEach(() => {
    vi.restoreAllMocks()
    vi.resetAllMocks()
  })

  it('renders the catalog in a bottom drawer near the top of the viewport', () => {
    const { container } = render(<ExerciseCatalogDrawer />)

    expect(screen.getByRole('heading', { name: 'Exercise catalog' })).toBeInTheDocument()
    expect(screen.getByText('Back squat')).toBeInTheDocument()
    expect(screen.getByText('Assault bike intervals')).toBeInTheDocument()
    expect(getDrawerProps()).toMatchObject({
      handle: drawerMock.handle,
      position: 'bottom'
    })
    expect(container.querySelector('section')).toHaveClass('[--drawer-height:calc(100svh-3rem)]')

    runAnimationFrame()

    expect(drawerMock.handle.open).toHaveBeenCalledWith(null)
  })

  it('ignores open change events that keep the drawer open', () => {
    render(<ExerciseCatalogDrawer />)

    act(() => {
      getDrawerProps().onOpenChange?.(true)
      getDrawerProps().onOpenChangeComplete?.(true)
      getDrawerProps().onOpenChangeComplete?.(false)
    })

    expect(navigateMock).not.toHaveBeenCalled()
  })

  it('notifies before returning to the home route when a directly loaded catalog drawer closes', () => {
    const onCloseNavigation = vi.fn()

    render(<ExerciseCatalogDrawer onCloseNavigation={onCloseNavigation} />)

    act(() => {
      getDrawerProps().onOpenChange?.(true)
      getDrawerProps().onOpenChange?.(false)
    })

    expect(navigateMock).not.toHaveBeenCalled()

    act(() => {
      getDrawerProps().onOpenChangeComplete?.(false)
    })

    expect(onCloseNavigation).toHaveBeenCalledOnce()
    expect(navigateMock).toHaveBeenCalledWith(RouterPath.Home, { replace: true })
  })

  it('returns to the previous route when an in-app catalog drawer closes', () => {
    useLocationMock.mockReturnValue(createLocation('manager-navigation'))

    render(<ExerciseCatalogDrawer />)

    act(() => {
      getDrawerProps().onOpenChange?.(true)
      getDrawerProps().onOpenChange?.(false)
    })

    expect(navigateMock).not.toHaveBeenCalled()

    act(() => {
      getDrawerProps().onOpenChangeComplete?.(false)
    })

    expect(navigateMock).toHaveBeenCalledWith(-1)
  })

  it('closes without navigation when the parent is animating a browser back close', () => {
    const onClosed = vi.fn()
    const { rerender } = render(<ExerciseCatalogDrawer onClosed={onClosed} />)

    runAnimationFrame()

    act(() => {
      getDrawerProps().onOpenChange?.(true)
      getDrawerProps().onOpenChangeComplete?.(true)
    })

    rerender(<ExerciseCatalogDrawer closing onClosed={onClosed} />)

    expect(drawerMock.handle.close).toHaveBeenCalledOnce()

    act(() => {
      getDrawerProps().onOpenChange?.(false)
      getDrawerProps().onOpenChangeComplete?.(false)
    })

    expect(onClosed).toHaveBeenCalledOnce()
    expect(navigateMock).not.toHaveBeenCalled()
  })
})
