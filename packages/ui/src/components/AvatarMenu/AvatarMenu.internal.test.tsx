import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { useState, type CSSProperties, type ReactElement } from 'react'

import { Avatar } from '../Avatar'
import { AvatarMenu, type AvatarMenuContentState } from './AvatarMenu'

function MenuChrome(): ReactElement {
  return (
    <AvatarMenu.Portal keepMounted>
      <AvatarMenu.Positioner className={() => 'positioner-callback'}>
        <AvatarMenu.Popup
          className={() => 'popup-callback'}
          data-testid="menu-popup"
          render={(props, state) => (
            <aside {...props} data-popup-open={state.open ? '' : undefined} />
          )}
          style={() => ({ color: 'rgb(1, 2, 3)' })}
        >
          <AvatarMenu.Viewport className={() => 'viewport-callback'} />
        </AvatarMenu.Popup>
      </AvatarMenu.Positioner>
    </AvatarMenu.Portal>
  )
}

describe('AvatarMenu implementation', () => {
  it('preserves every state callback while composing the shared popup parts', async () => {
    render(
      <AvatarMenu.Root defaultValue="amina">
        <AvatarMenu.List className={() => 'list-callback'}>
          <AvatarMenu.Item value="amina">
            <AvatarMenu.Trigger aria-label="Open Amina navigation">
              <Avatar.Fallback>AM</Avatar.Fallback>
            </AvatarMenu.Trigger>
            <AvatarMenu.Content
              className={() => 'content-callback [transition:none]'}
              render={(props, state) => (
                <section {...props} data-content-open={state.open ? '' : undefined} />
              )}
            >
              <AvatarMenu.Group
                render={(props, state) => (
                  <section {...props} data-group-state-keys={Object.keys(state).length} />
                )}
              >
                <AvatarMenu.GroupLabel
                  className="group-label-callback"
                  render={(props, state) => (
                    <header {...props} data-label-state-keys={Object.keys(state).length} />
                  )}
                  style={() => ({ opacity: 0.75 })}
                >
                  Amina Diallo
                </AvatarMenu.GroupLabel>
                <AvatarMenu.Link
                  className={() => 'link-callback'}
                  href="home"
                  icon={<svg />}
                  render={(props, state) => (
                    <a {...props} data-link-active={state.active ? '' : undefined} />
                  )}
                >
                  Home
                </AvatarMenu.Link>
              </AvatarMenu.Group>
            </AvatarMenu.Content>
          </AvatarMenu.Item>
        </AvatarMenu.List>
        <MenuChrome />
      </AvatarMenu.Root>
    )

    const popup = await screen.findByTestId('menu-popup')
    const link = screen.getByRole('link', { name: 'Home' })
    const linkSource = link.querySelector('[data-reveal-source]')
    const linkOverlay = link.querySelector('[data-reveal-overlay-surface]')

    expect(screen.getByRole('list')).toHaveClass('list-callback')
    expect(link).toHaveClass(
      'link-callback',
      'data-[popup-surface-item]:min-h-0',
      'data-[popup-surface-item]:p-0'
    )
    expect(linkSource).toHaveClass('min-h-[calc(2.25rem-2px)]', 'py-1.5', 'ps-8', 'pe-2.5')
    expect(linkOverlay).toHaveClass('min-h-[calc(2.25rem-2px)]', 'py-1.5', 'ps-8', 'pe-2.5')
    expect(screen.getByRole('group', { name: 'Amina Diallo' })).toHaveAttribute(
      'data-group-state-keys',
      '0'
    )
    expect(screen.getByText('Amina Diallo')).toHaveAttribute('data-label-state-keys', '0')
    expect(screen.getByText('Amina Diallo')).toHaveClass('group-label-callback')
    expect(screen.getByText('Amina Diallo')).toHaveStyle({ opacity: '0.75' })
    expect(popup).toHaveClass('popup-callback')
    expect(popup).toHaveStyle({ color: 'rgb(1, 2, 3)' })
    expect(popup.parentElement).toHaveClass('positioner-callback')
    const content = popup.querySelector('[data-content-open]')

    expect(content).toHaveClass('content-callback', '[transition:none]')
    expect(content).not.toHaveClass(
      '[transition:opacity_175ms_ease,translate_var(--popup-surface-layout-duration)_var(--popup-surface-layout-easing)]'
    )
    expect(content?.parentElement).toHaveClass('viewport-callback')
  })

  it('generates an Item value when the consumer omits one', () => {
    render(
      <AvatarMenu.Root>
        <AvatarMenu.List>
          <AvatarMenu.Item data-testid="generated-item">
            <AvatarMenu.Trigger aria-label="Open generated navigation">
              <Avatar.Fallback>GE</Avatar.Fallback>
            </AvatarMenu.Trigger>
            <AvatarMenu.Content />
          </AvatarMenu.Item>
        </AvatarMenu.List>
      </AvatarMenu.Root>
    )

    expect(screen.getByTestId('generated-item')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Open generated navigation' })).toBeInTheDocument()
  })

  it('uses an active generated-value Trigger before the first Popup opening render', async () => {
    const popupClassNames: string[] = []

    render(
      <AvatarMenu.Root closeDelay={0}>
        <AvatarMenu.List>
          <AvatarMenu.Item>
            <AvatarMenu.Trigger active aria-label="Open active generated navigation">
              <Avatar.Fallback>AG</Avatar.Fallback>
            </AvatarMenu.Trigger>
            <AvatarMenu.Content>active generated content</AvatarMenu.Content>
          </AvatarMenu.Item>
        </AvatarMenu.List>
        <AvatarMenu.Portal keepMounted>
          <AvatarMenu.Positioner>
            <AvatarMenu.Popup
              data-testid="active-generated-popup"
              render={(props) => {
                popupClassNames.push(props.className ?? '')

                return <aside {...props} />
              }}
            >
              <AvatarMenu.Viewport />
            </AvatarMenu.Popup>
          </AvatarMenu.Positioner>
        </AvatarMenu.Portal>
      </AvatarMenu.Root>
    )

    const trigger = screen.getByRole('button', { name: 'Open active generated navigation' })
    const popup = screen.getByTestId('active-generated-popup')

    popupClassNames.length = 0
    fireEvent.click(trigger)

    await waitFor(() => expect(popup).toHaveAttribute('data-open'))
    expect(
      popupClassNames.some((className) => className.includes('data-starting-style:translate-x-0'))
    ).toBe(false)

    popupClassNames.length = 0
    fireEvent.click(trigger)

    await waitFor(() => expect(popup).toHaveAttribute('data-closed'))
    expect(
      popupClassNames.some((className) => className.includes('data-ending-style:translate-x-0'))
    ).toBe(false)
  })

  it('opens with the logical LTR arrow', async () => {
    render(
      <AvatarMenu.Root>
        <AvatarMenu.List>
          <AvatarMenu.Item value="amina">
            <AvatarMenu.Trigger aria-label="Open Amina navigation">
              <Avatar.Fallback>AM</Avatar.Fallback>
            </AvatarMenu.Trigger>
            <AvatarMenu.Content>
              <AvatarMenu.Link href="home" icon={<svg />}>
                Home
              </AvatarMenu.Link>
            </AvatarMenu.Content>
          </AvatarMenu.Item>
        </AvatarMenu.List>
        <MenuChrome />
      </AvatarMenu.Root>
    )

    fireEvent.keyDown(screen.getByRole('button', { name: 'Open Amina navigation' }), {
      key: 'ArrowRight'
    })

    expect(await screen.findByTestId('menu-popup')).toBeInTheDocument()
  })

  it('falls back to opacity-only activation when the prior Trigger is unavailable', async () => {
    function MissingPreviousTrigger(): ReactElement {
      const [value, setValue] = useState('missing')

      return (
        <>
          <button onClick={() => setValue('yann')} type="button">
            Open Yann
          </button>
          <AvatarMenu.Root onValueChange={setValue} value={value}>
            <AvatarMenu.List>
              <AvatarMenu.Item value="yann">
                <AvatarMenu.Trigger aria-label="Open Yann navigation">
                  <Avatar.Fallback>YA</Avatar.Fallback>
                </AvatarMenu.Trigger>
                <AvatarMenu.Content data-testid="yann-content">yann</AvatarMenu.Content>
              </AvatarMenu.Item>
            </AvatarMenu.List>
            <MenuChrome />
          </AvatarMenu.Root>
        </>
      )
    }

    render(<MissingPreviousTrigger />)
    fireEvent.click(screen.getByRole('button', { name: 'Open Yann' }))

    expect(await screen.findByTestId('yann-content')).not.toHaveAttribute(
      'data-activation-direction'
    )
  })

  it('falls back to opacity-only activation when Trigger order is indeterminate', async () => {
    function IndeterminateOrder(): ReactElement {
      const [value, setValue] = useState('amina')

      return (
        <>
          <button onClick={() => setValue('yann')} type="button">
            Open Yann
          </button>
          <AvatarMenu.Root onValueChange={setValue} value={value}>
            <AvatarMenu.List>
              {['amina', 'yann'].map((athlete) => (
                <AvatarMenu.Item key={athlete} value={athlete}>
                  <AvatarMenu.Trigger aria-label={`Open ${athlete} navigation`}>
                    <Avatar.Fallback>{athlete.slice(0, 2)}</Avatar.Fallback>
                  </AvatarMenu.Trigger>
                  <AvatarMenu.Content data-testid={`${athlete}-content`}>
                    {athlete}
                  </AvatarMenu.Content>
                </AvatarMenu.Item>
              ))}
            </AvatarMenu.List>
            <MenuChrome />
          </AvatarMenu.Root>
        </>
      )
    }

    render(<IndeterminateOrder />)

    const aminaTrigger = screen.getByRole('button', { name: 'Open amina navigation' })
    aminaTrigger.compareDocumentPosition = () => 0
    fireEvent.click(screen.getByRole('button', { name: 'Open Yann' }))

    expect(await screen.findByTestId('yann-content')).not.toHaveAttribute(
      'data-activation-direction'
    )
  })

  it('forwards controlled activation direction through every Content state callback', async () => {
    const className = vi.fn((state: AvatarMenuContentState) =>
      state.activationDirection === 'down' ? 'moving-down' : undefined
    )
    const style = vi.fn(
      (state: AvatarMenuContentState): CSSProperties => ({
        opacity: state.activationDirection === 'down' ? 0.75 : 1
      })
    )
    const renderState = vi.fn()

    function ControlledContentState(): ReactElement {
      const [value, setValue] = useState('amina')

      return (
        <>
          <button onClick={() => setValue('yann')} type="button">
            Open controlled Yann
          </button>
          <AvatarMenu.Root onValueChange={setValue} value={value}>
            <AvatarMenu.List>
              {['amina', 'yann'].map((athlete) => (
                <AvatarMenu.Item key={athlete} value={athlete}>
                  <AvatarMenu.Trigger aria-label={`Open ${athlete} navigation`}>
                    <Avatar.Fallback>{athlete.slice(0, 2)}</Avatar.Fallback>
                  </AvatarMenu.Trigger>
                  <AvatarMenu.Content
                    className={className}
                    data-testid={`${athlete}-state-content`}
                    render={(props, state) => {
                      renderState(state)
                      return <section {...props} />
                    }}
                    style={style}
                  />
                </AvatarMenu.Item>
              ))}
            </AvatarMenu.List>
            <MenuChrome />
          </AvatarMenu.Root>
        </>
      )
    }

    render(<ControlledContentState />)
    fireEvent.click(screen.getByRole('button', { name: 'Open controlled Yann' }))

    const content = await screen.findByTestId('yann-state-content')

    await waitFor(() => {
      expect(content).toHaveAttribute('data-activation-direction', 'down')
      expect(content).toHaveClass('moving-down')
      expect(content).toHaveStyle({ opacity: '0.75' })
      expect(renderState).toHaveBeenCalledWith(
        expect.objectContaining({ activationDirection: 'down' })
      )
    })
  })

  it.each([
    ['horizontal forward LTR', 'horizontal', 'ltr', 'amina', 'yann', 'right'],
    ['horizontal forward RTL', 'horizontal', 'rtl', 'amina', 'yann', 'left'],
    ['horizontal reverse LTR', 'horizontal', 'ltr', 'yann', 'amina', 'left'],
    ['horizontal reverse RTL', 'horizontal', 'rtl', 'yann', 'amina', 'right'],
    ['vertical reverse', 'vertical', 'ltr', 'yann', 'amina', 'up']
  ] as const)(
    'falls back to document order for equal-position %s controlled Triggers',
    async (_mode, orientation, direction, initialValue, nextValue, expectedDirection) => {
      function EqualPositionTriggers(): ReactElement {
        const [value, setValue] = useState(initialValue)

        return (
          <div dir={direction}>
            <button onClick={() => setValue(nextValue)} type="button">
              Change open athlete
            </button>
            <AvatarMenu.Root orientation={orientation} value={value}>
              <AvatarMenu.List>
                {['amina', 'yann'].map((athlete) => (
                  <AvatarMenu.Item key={athlete} value={athlete}>
                    <AvatarMenu.Trigger aria-label={`Open ${athlete} navigation`}>
                      <Avatar.Fallback>{athlete.slice(0, 2)}</Avatar.Fallback>
                    </AvatarMenu.Trigger>
                    <AvatarMenu.Content data-testid={`${athlete}-equal-position-content`}>
                      {athlete}
                    </AvatarMenu.Content>
                  </AvatarMenu.Item>
                ))}
              </AvatarMenu.List>
              <MenuChrome />
            </AvatarMenu.Root>
          </div>
        )
      }

      render(<EqualPositionTriggers />)
      fireEvent.click(screen.getByRole('button', { name: 'Change open athlete' }))

      await waitFor(() => {
        expect(screen.getByTestId(`${nextValue}-equal-position-content`)).toHaveAttribute(
          'data-activation-direction',
          expectedDirection
        )
      })
    }
  )

  it('preserves the last open Item direction across a real outside-control press sequence', async () => {
    function ControlledOutsideControl(): ReactElement {
      const [value, setValue] = useState<string | null>('amina')

      return (
        <>
          <button type="button">Start outside press</button>
          <button onClick={() => setValue('yann')} type="button">
            Open Yann outside
          </button>
          <AvatarMenu.Root onValueChange={setValue} value={value}>
            <AvatarMenu.List>
              {['amina', 'yann'].map((athlete) => (
                <AvatarMenu.Item key={athlete} value={athlete}>
                  <AvatarMenu.Trigger aria-label={`Open ${athlete} navigation`}>
                    <Avatar.Fallback>{athlete.slice(0, 2)}</Avatar.Fallback>
                  </AvatarMenu.Trigger>
                  <AvatarMenu.Content data-testid={`${athlete}-outside-content`}>
                    {athlete}
                  </AvatarMenu.Content>
                </AvatarMenu.Item>
              ))}
            </AvatarMenu.List>
            <MenuChrome />
          </AvatarMenu.Root>
        </>
      )
    }

    render(<ControlledOutsideControl />)

    const aminaContent = await screen.findByTestId('amina-outside-content')
    const outsideControl = screen.getByRole('button', { name: 'Open Yann outside' })
    const popup = screen.getByTestId('menu-popup')
    let resolveExit: (() => void) | undefined
    const unfinishedExit = new Promise<void>((resolve) => {
      resolveExit = resolve
    })

    Object.defineProperty(aminaContent, 'getAnimations', {
      configurable: true,
      value: vi.fn(() => [{ finished: unfinishedExit }])
    })
    Object.defineProperty(popup, 'getAnimations', {
      configurable: true,
      value: vi.fn(() => [{ finished: unfinishedExit }])
    })

    fireEvent.click(screen.getByRole('button', { name: 'Start outside press' }))

    await waitFor(() => {
      expect(aminaContent).toHaveAttribute('data-ending-style')
    })

    fireEvent.click(outsideControl)

    await waitFor(() => {
      expect(aminaContent).toHaveAttribute('data-activation-direction', 'down')
      expect(screen.getByTestId('yann-outside-content')).toHaveAttribute(
        'data-activation-direction',
        'down'
      )
    })

    act(() => resolveExit?.())
  })

  it('propagates inherited RTL direction to the portaled subtree', async () => {
    render(
      <div dir="rtl">
        <AvatarMenu.Root defaultValue="amina">
          <AvatarMenu.List>
            <AvatarMenu.Item value="amina">
              <AvatarMenu.Trigger aria-label="Open Amina navigation">
                <Avatar.Fallback>AM</Avatar.Fallback>
              </AvatarMenu.Trigger>
              <AvatarMenu.Content>content</AvatarMenu.Content>
            </AvatarMenu.Item>
          </AvatarMenu.List>
          <AvatarMenu.Portal data-testid="rtl-menu-portal" keepMounted>
            <AvatarMenu.Positioner>
              <AvatarMenu.Popup>
                <AvatarMenu.Viewport />
              </AvatarMenu.Popup>
            </AvatarMenu.Positioner>
          </AvatarMenu.Portal>
        </AvatarMenu.Root>
      </div>
    )

    await waitFor(() => {
      expect(screen.getByTestId('rtl-menu-portal')).toHaveAttribute('dir', 'rtl')
    })
  })

  it('rebinds the untranslated positioning reference when the active Trigger changes', async () => {
    render(
      <AvatarMenu.Root defaultValue="amina">
        <AvatarMenu.List>
          {['amina', 'yann'].map((athlete) => (
            <AvatarMenu.Item key={athlete} value={athlete}>
              <AvatarMenu.Trigger aria-label={`Open ${athlete} navigation`}>
                <Avatar.Fallback>{athlete.slice(0, 2)}</Avatar.Fallback>
              </AvatarMenu.Trigger>
              <AvatarMenu.Content>{athlete}</AvatarMenu.Content>
            </AvatarMenu.Item>
          ))}
        </AvatarMenu.List>
        <MenuChrome />
      </AvatarMenu.Root>
    )

    const yannTrigger = screen.getByRole('button', { name: 'Open yann navigation' })
    yannTrigger.style.translate = '10px -5px'
    const yannRect = vi
      .spyOn(yannTrigger, 'getBoundingClientRect')
      .mockReturnValue(new DOMRect(10, 80, 36, 36))

    fireEvent.click(yannTrigger)

    await waitFor(() => {
      expect(yannRect).toHaveBeenCalled()
      expect(screen.getByTestId('menu-popup').parentElement).toHaveStyle({ top: '85px' })
    })
  })

  it.each([12, { bottom: 3, left: 4, right: 2, top: 1 }] as const)(
    'reserves the logical inline motion extent from %j collision padding',
    async (collisionPadding) => {
      render(
        <AvatarMenu.Root defaultValue="amina">
          <AvatarMenu.List>
            <AvatarMenu.Item value="amina">
              <AvatarMenu.Trigger aria-label="Open Amina navigation">
                <Avatar.Fallback>AM</Avatar.Fallback>
              </AvatarMenu.Trigger>
              <AvatarMenu.Content>content</AvatarMenu.Content>
            </AvatarMenu.Item>
          </AvatarMenu.List>
          <AvatarMenu.Portal keepMounted>
            <AvatarMenu.Positioner collisionPadding={collisionPadding}>
              <AvatarMenu.Popup data-testid="collision-popup">
                <AvatarMenu.Viewport />
              </AvatarMenu.Popup>
            </AvatarMenu.Positioner>
          </AvatarMenu.Portal>
        </AvatarMenu.Root>
      )

      expect(await screen.findByTestId('collision-popup')).toHaveAttribute('data-open')
    }
  )
})
