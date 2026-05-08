import { fireEvent, render, screen } from '@testing-library/react'
import { type ReactElement, type ReactNode } from 'react'

import { NewExerciseDrawer } from './NewExerciseDrawer'

const mocks = vi.hoisted(() => ({
  navigate: vi.fn(),
  setIsOpened: vi.fn(),
  useBackgroundLocationState: vi.fn(),
  useRoutedDrawerTransition: vi.fn()
}))

vi.mock('react-router', () => ({
  useNavigate: () => mocks.navigate
}))

vi.mock('@/app', () => ({
  RouterPath: {
    Exercise: '/exercise',
    ExerciseNew: '/exercise/new',
    Home: '/'
  },
  useBackgroundLocationState: mocks.useBackgroundLocationState,
  useRoutedDrawerTransition: mocks.useRoutedDrawerTransition
}))

vi.mock('@powercoach/ui', async () => {
  const React = await vi.importActual<typeof import('react')>('react')
  const Passthrough = ({ children }: { children: ReactNode }): ReactElement => <>{children}</>

  return {
    Drawer: ({
      children,
      onOpenChange
    }: {
      children: ReactNode
      onOpenChange: (open: boolean) => void
    }): ReactElement => (
      <section>
        <button onClick={() => onOpenChange(true)}>open</button>
        <button onClick={() => onOpenChange(false)}>close</button>
        {children}
      </section>
    ),
    DrawerDescription: Passthrough,
    DrawerHeader: Passthrough,
    DrawerPanel: Passthrough,
    DrawerPopup: Passthrough,
    DrawerTitle: Passthrough
  }
})

vi.mock('./NewExercise', () => ({
  NewExercise: () => <div>new exercise</div>
}))

describe('NewExerciseDrawer open change', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mocks.useBackgroundLocationState.mockReturnValue(null)
    mocks.useRoutedDrawerTransition.mockReturnValue({
      drawerTransitionOverlay: null,
      isOpened: true,
      setIsOpened: mocks.setIsOpened
    })
  })

  it('ignores open events', () => {
    render(<NewExerciseDrawer />)

    fireEvent.click(screen.getByRole('button', { name: 'open' }))

    expect(mocks.setIsOpened).not.toHaveBeenCalled()
    expect(mocks.navigate).not.toHaveBeenCalled()
  })

  it('returns to the background location when closing from one', () => {
    mocks.useBackgroundLocationState.mockReturnValue({
      backgroundLocation: {
        pathname: '/'
      }
    })

    render(<NewExerciseDrawer />)

    fireEvent.click(screen.getByRole('button', { name: 'close' }))

    expect(mocks.setIsOpened).toHaveBeenCalledExactlyOnceWith(false)
    expect(mocks.navigate).toHaveBeenCalledExactlyOnceWith(-1)
  })
})
