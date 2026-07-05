import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import {
  cloneElement,
  createContext,
  isValidElement,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type ReactElement,
  type ReactNode,
  useContext
} from 'react'
import { Provider } from 'react-redux'

import { createTestStore } from '@/test/utils/store'

import { Router } from './Router'

const mocks = vi.hoisted(() => ({
  bottomSheetRoot: vi.fn(),
  legacyDrawer: vi.fn()
}))

vi.mock('@powercoach/ui', () => {
  const BottomSheetOpenChangeContext = createContext<(open: boolean) => void>(() => undefined)

  function Passthrough({ children }: { children?: ReactNode }): ReactElement {
    return <>{children}</>
  }

  function BottomSheetRoot({
    children,
    disablePointerDismissal,
    onOpenChange = () => undefined,
    open = false
  }: {
    children?: ReactNode
    disablePointerDismissal?: boolean
    onOpenChange?: (open: boolean) => void
    open?: boolean
  }): ReactElement | null {
    mocks.bottomSheetRoot({ disablePointerDismissal, open })

    if (!open) {
      return null
    }

    return (
      <BottomSheetOpenChangeContext.Provider value={onOpenChange}>
        {children}
      </BottomSheetOpenChangeContext.Provider>
    )
  }

  function BottomSheetSurface({ children }: { children?: ReactNode }): ReactElement {
    return <section aria-label="Bottom sheet surface">{children}</section>
  }

  function BottomSheetPopup({ children }: { children?: ReactNode }): ReactElement {
    return (
      <div
        aria-describedby="bottom-sheet-description"
        aria-labelledby="bottom-sheet-title"
        aria-modal="true"
        role="dialog"
      >
        {children}
      </div>
    )
  }

  function BottomSheetTitle({ children }: { children?: ReactNode }): ReactElement {
    return <h2 id="bottom-sheet-title">{children}</h2>
  }

  function BottomSheetDescription({ children }: { children?: ReactNode }): ReactElement {
    return <p id="bottom-sheet-description">{children}</p>
  }

  function BottomSheetClose({
    children,
    render
  }: {
    children?: ReactNode
    render?: ReactElement<ButtonHTMLAttributes<HTMLButtonElement>>
  }): ReactElement {
    const onOpenChange = useContext(BottomSheetOpenChangeContext)
    const closeProps = { onClick: (): void => onOpenChange(false) }

    if (render && isValidElement(render)) {
      return cloneElement(render, closeProps, children)
    }

    return <button {...closeProps}>{children}</button>
  }

  function Button({
    children,
    revealAnimation = false,
    size = 'lg',
    variant = 'default',
    ...props
  }: ButtonHTMLAttributes<HTMLButtonElement> & {
    revealAnimation?: boolean
    size?: string
    variant?: string
  }): ReactElement {
    return (
      <button
        data-reveal-animation={String(revealAnimation)}
        data-size={size}
        data-variant={variant}
        {...props}
      >
        {children}
      </button>
    )
  }

  function LegacyDrawer({
    children,
    open = false
  }: {
    children?: ReactNode
    open?: boolean
  }): ReactElement | null {
    mocks.legacyDrawer({ open })
    return open ? <>{children}</> : null
  }

  function LegacyDrawerPopup({ children }: { children?: ReactNode }): ReactElement {
    return <div role="dialog">{children}</div>
  }

  function LegacyDrawerTitle({ children }: { children?: ReactNode }): ReactElement {
    return <h2>{children}</h2>
  }

  function LegacyDrawerDescription({ children }: { children?: ReactNode }): ReactElement {
    return <p>{children}</p>
  }

  function LegacyDrawerPanel({ children }: HTMLAttributes<HTMLDivElement>): ReactElement {
    return <div>{children}</div>
  }

  return {
    BottomSheet: {
      Backdrop: Passthrough,
      Close: BottomSheetClose,
      Content: Passthrough,
      Description: BottomSheetDescription,
      Popup: BottomSheetPopup,
      Portal: Passthrough,
      Root: BottomSheetRoot,
      Surface: BottomSheetSurface,
      Title: BottomSheetTitle,
      Viewport: Passthrough
    },
    Button,
    Drawer: LegacyDrawer,
    DrawerDescription: LegacyDrawerDescription,
    DrawerHeader: Passthrough,
    DrawerIndent: Passthrough,
    DrawerPanel: LegacyDrawerPanel,
    DrawerPopup: LegacyDrawerPopup,
    DrawerProvider: Passthrough,
    DrawerTitle: LegacyDrawerTitle
  }
})

function expectBefore(first: HTMLElement, second: HTMLElement): void {
  expect(first.compareDocumentPosition(second) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
}

describe('Router', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    window.history.pushState({}, '', '/')
  })

  it('presents the routed Home overlay with the approved BottomSheet contract', async () => {
    render(
      <Provider store={createTestStore()}>
        <Router />
      </Provider>
    )

    const home = screen.getByRole('main')
    const surface = screen.getByRole('region', { name: 'Bottom sheet surface' })

    expect(surface).toContainElement(home)

    fireEvent.click(screen.getByRole('link', { name: 'Hello world' }))

    await waitFor(() => {
      expect(window.location.pathname).toBe('/drawer')
    })

    const dialog = await screen.findByRole('dialog', {
      description: 'This drawer is mounted by the home module route.',
      name: 'Hello drawer'
    })
    const sheet = within(dialog)
    const title = sheet.getByRole('heading', { name: 'Hello drawer' })
    const description = sheet.getByText('This drawer is mounted by the home module route.')
    const close = sheet.getByRole('button', { name: 'close' })
    const content = sheet.getByText('Hello world')

    expect(screen.getByRole('main')).toBeInTheDocument()
    expect(close).toHaveAttribute('data-size', 'lg')
    expect(close).toHaveAttribute('data-variant', 'default')
    expect(close).toHaveAttribute('data-reveal-animation', 'true')
    expectBefore(title, description)
    expectBefore(description, close)
    expectBefore(close, content)
    expect(mocks.bottomSheetRoot).toHaveBeenLastCalledWith({
      disablePointerDismissal: undefined,
      open: true
    })
    expect(mocks.legacyDrawer).not.toHaveBeenCalled()

    fireEvent.click(close)

    await waitFor(() => {
      expect(window.location.pathname).toBe('/')
    })
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('keeps the routed BottomSheet open on a descendant URL', async () => {
    render(
      <Provider store={createTestStore()}>
        <Router />
      </Provider>
    )

    act(() => {
      window.history.pushState({}, '', '/drawer/descendant')
      window.dispatchEvent(new PopStateEvent('popstate'))
    })

    await waitFor(() => {
      expect(window.location.pathname).toBe('/drawer/descendant')
    })

    const dialog = await screen.findByRole('dialog', { name: 'Hello drawer' })

    fireEvent.click(within(dialog).getByRole('button', { name: 'close' }))

    await waitFor(() => {
      expect(window.location.pathname).toBe('/')
    })
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })
})
