import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { useState, type RefCallback } from 'react'

import { RailsHeader } from './components/RailsHeader'
import { RailsItem, type RailsItemChangeEventDetails } from './components/RailsItem'
import { RailsList } from './components/RailsList'
import { RailsPanel } from './components/RailsPanel'
import { RailsRail } from './components/RailsRail'
import { RailsRoot, type RailsRootChangeEventDetails } from './components/RailsRoot'

const ORIGINAL_GET_ANIMATIONS = HTMLElement.prototype.getAnimations

describe('Rails mounting implementation', () => {
  afterEach(() => {
    vi.restoreAllMocks()

    if (ORIGINAL_GET_ANIMATIONS === undefined) {
      Reflect.deleteProperty(HTMLElement.prototype, 'getAnimations')
    } else {
      Object.defineProperty(HTMLElement.prototype, 'getAnimations', {
        configurable: true,
        value: ORIGINAL_GET_ANIMATIONS
      })
    }
  })

  it('routes a dynamically findable generated Item through the Base UI change pipeline', async () => {
    const changeOrder: string[] = []
    const onOpenChange = vi.fn((_nextOpen: boolean, _eventDetails: RailsItemChangeEventDetails) => {
      changeOrder.push('item')
    })
    const onValueChange = vi.fn(
      (_nextValue: unknown[], _eventDetails: RailsRootChangeEventDetails) => {
        changeOrder.push('root')
      }
    )

    function DynamicFindableRails() {
      const [hiddenUntilFound, setHiddenUntilFound] = useState(false)

      return (
        <>
          <button type="button" onClick={() => setHiddenUntilFound(true)}>
            enable find-in-page
          </button>
          <RailsRoot hiddenUntilFound={hiddenUntilFound} onValueChange={onValueChange}>
            <RailsList>
              <RailsItem onOpenChange={onOpenChange}>
                <RailsHeader>
                  <RailsRail>Programs</RailsRail>
                </RailsHeader>
                <RailsPanel data-testid="dynamic-findable-panel">
                  Programs findable content
                </RailsPanel>
              </RailsItem>
            </RailsList>
          </RailsRoot>
        </>
      )
    }

    render(<DynamicFindableRails />)

    fireEvent.click(screen.getByRole('button', { name: 'enable find-in-page' }))

    const panel = screen.getByTestId('dynamic-findable-panel')
    const beforeMatchEvent = new Event('beforematch')

    expect(panel).toHaveAttribute('hidden', 'until-found')

    fireEvent(panel, beforeMatchEvent)

    await waitFor(() => {
      expect(onOpenChange).toHaveBeenCalledOnce()
      expect(onValueChange).toHaveBeenCalledOnce()
      expect(screen.getByRole('button', { name: 'Programs' })).toHaveAttribute('data-panel-open')
      expect(panel).toHaveAttribute('data-open')
    })

    const [nextOpen, itemDetails] = onOpenChange.mock.calls[0] as [
      boolean,
      RailsItemChangeEventDetails
    ]
    const [nextValue, rootDetails] = onValueChange.mock.calls[0] as [
      unknown[],
      RailsRootChangeEventDetails
    ]

    expect(nextOpen).toBe(true)
    expect(nextValue).toEqual([expect.any(String)])
    expect(itemDetails).toBe(rootDetails)
    expect(itemDetails).toMatchObject({
      event: beforeMatchEvent,
      isCanceled: false,
      reason: 'none',
      trigger: undefined
    })
    expect(changeOrder).toEqual(['item', 'root'])
  })

  it('honors generated Item cancellation after dynamically enabling find-in-page mounting', async () => {
    const onOpenChange = vi.fn((_nextOpen: boolean, eventDetails: RailsItemChangeEventDetails) => {
      eventDetails.cancel()
    })
    const onValueChange = vi.fn()

    function CanceledFindableRails() {
      const [hiddenUntilFound, setHiddenUntilFound] = useState(false)

      return (
        <>
          <button type="button" onClick={() => setHiddenUntilFound(true)}>
            enable canceled find-in-page
          </button>
          <RailsRoot hiddenUntilFound={hiddenUntilFound} onValueChange={onValueChange}>
            <RailsList>
              <RailsItem onOpenChange={onOpenChange}>
                <RailsHeader>
                  <RailsRail>Programs canceled</RailsRail>
                </RailsHeader>
                <RailsPanel data-testid="canceled-findable-panel">
                  Programs canceled findable content
                </RailsPanel>
              </RailsItem>
            </RailsList>
          </RailsRoot>
        </>
      )
    }

    render(<CanceledFindableRails />)

    fireEvent.click(screen.getByRole('button', { name: 'enable canceled find-in-page' }))

    const panel = screen.getByTestId('canceled-findable-panel')

    fireEvent(panel, new Event('beforematch'))

    await waitFor(() => expect(onOpenChange).toHaveBeenCalledOnce())

    expect(onValueChange).not.toHaveBeenCalled()
    expect(screen.getByRole('button', { name: 'Programs canceled' })).not.toHaveAttribute(
      'data-panel-open'
    )
    expect(panel).toHaveAttribute('hidden', 'until-found')
  })

  it('preserves a consumer callback-ref cleanup across Panel remount and unmount', async () => {
    const cleanup = vi.fn()
    const panelRef: RefCallback<HTMLDivElement> = vi.fn((panel) => {
      if (panel === null) {
        return
      }

      return () => cleanup(panel)
    })

    function RefCleanupRails() {
      const [hiddenUntilFound, setHiddenUntilFound] = useState(false)

      return (
        <>
          <button type="button" onClick={() => setHiddenUntilFound((current) => !current)}>
            toggle find-in-page
          </button>
          <RailsRoot hiddenUntilFound={hiddenUntilFound}>
            <RailsList>
              <RailsItem value="programs">
                <RailsHeader>
                  <RailsRail>Programs ref cleanup</RailsRail>
                </RailsHeader>
                <RailsPanel data-testid="ref-cleanup-panel" ref={panelRef}>
                  Programs ref cleanup content
                </RailsPanel>
              </RailsItem>
            </RailsList>
          </RailsRoot>
        </>
      )
    }

    const { unmount } = render(<RefCleanupRails />)

    fireEvent.click(screen.getByRole('button', { name: 'toggle find-in-page' }))

    const firstPanel = screen.getByTestId('ref-cleanup-panel')

    expect(panelRef).toHaveBeenCalledWith(firstPanel)

    fireEvent.click(screen.getByRole('button', { name: 'toggle find-in-page' }))

    await waitFor(() => {
      expect(screen.queryByTestId('ref-cleanup-panel')).not.toBeInTheDocument()
      expect(cleanup).toHaveBeenCalledWith(firstPanel)
    })

    expect(panelRef).not.toHaveBeenCalledWith(null)

    fireEvent.click(screen.getByRole('button', { name: 'toggle find-in-page' }))

    const secondPanel = screen.getByTestId('ref-cleanup-panel')

    expect(secondPanel).not.toBe(firstPanel)

    unmount()

    expect(cleanup).toHaveBeenCalledWith(secondPanel)
    expect(cleanup).toHaveBeenCalledTimes(2)
    expect(panelRef).not.toHaveBeenCalledWith(null)
  })

  it('preserves an open Panel when find-in-page mounting changes', () => {
    const cleanup = vi.fn()
    const panelRef: RefCallback<HTMLDivElement> = vi.fn((panel) => {
      if (panel === null) {
        return
      }

      return () => cleanup(panel)
    })

    function OpenPanelRails() {
      const [hiddenUntilFound, setHiddenUntilFound] = useState(false)
      const [panelHiddenUntilFound, setPanelHiddenUntilFound] = useState<boolean | undefined>()

      return (
        <>
          <button type="button" onClick={() => setHiddenUntilFound((current) => !current)}>
            toggle open find-in-page
          </button>
          <button type="button" onClick={() => setPanelHiddenUntilFound(true)}>
            enable open Panel find-in-page
          </button>
          <button type="button" onClick={() => setPanelHiddenUntilFound(false)}>
            disable open Panel find-in-page
          </button>
          <RailsRoot defaultValue={['programs']} hiddenUntilFound={hiddenUntilFound}>
            <RailsList>
              <RailsItem value="programs">
                <RailsHeader>
                  <RailsRail>Programs open identity</RailsRail>
                </RailsHeader>
                <RailsPanel
                  data-testid="open-identity-panel"
                  hiddenUntilFound={panelHiddenUntilFound}
                  ref={panelRef}
                >
                  <input aria-label="Panel-local value" defaultValue="initial" />
                </RailsPanel>
              </RailsItem>
            </RailsList>
          </RailsRoot>
        </>
      )
    }

    const { unmount } = render(<OpenPanelRails />)
    const panel = screen.getByTestId('open-identity-panel')
    const input = screen.getByRole('textbox', { name: 'Panel-local value' })

    fireEvent.change(input, { target: { value: 'preserved' } })
    fireEvent.click(screen.getByRole('button', { name: 'toggle open find-in-page' }))

    expect(screen.getByTestId('open-identity-panel')).toBe(panel)
    expect(screen.getByRole('textbox', { name: 'Panel-local value' })).toBe(input)
    expect(input).toHaveValue('preserved')
    expect(cleanup).not.toHaveBeenCalled()

    fireEvent.click(screen.getByRole('button', { name: 'toggle open find-in-page' }))

    expect(screen.getByTestId('open-identity-panel')).toBe(panel)
    expect(screen.getByRole('textbox', { name: 'Panel-local value' })).toBe(input)
    expect(input).toHaveValue('preserved')
    expect(cleanup).not.toHaveBeenCalled()

    fireEvent.click(screen.getByRole('button', { name: 'enable open Panel find-in-page' }))

    expect(screen.getByTestId('open-identity-panel')).toBe(panel)
    expect(screen.getByRole('textbox', { name: 'Panel-local value' })).toBe(input)
    expect(input).toHaveValue('preserved')
    expect(cleanup).not.toHaveBeenCalled()

    fireEvent.click(screen.getByRole('button', { name: 'disable open Panel find-in-page' }))

    expect(screen.getByTestId('open-identity-panel')).toBe(panel)
    expect(screen.getByRole('textbox', { name: 'Panel-local value' })).toBe(input)
    expect(input).toHaveValue('preserved')
    expect(cleanup).not.toHaveBeenCalled()

    unmount()

    expect(cleanup).toHaveBeenCalledOnce()
    expect(cleanup).toHaveBeenCalledWith(panel)
    expect(panelRef).not.toHaveBeenCalledWith(null)
  })

  it('preserves a Panel ending transition when find-in-page mounting changes', async () => {
    const cleanup = vi.fn()
    const panelRef: RefCallback<HTMLDivElement> = vi.fn((panel) => {
      if (panel === null) {
        return
      }

      return () => cleanup(panel)
    })
    let finishClosingAnimation: () => void = () => undefined
    const closingAnimationFinished = new Promise<void>((resolve) => {
      finishClosingAnimation = resolve
    })

    vi.spyOn(HTMLElement.prototype, 'scrollWidth', 'get').mockReturnValue(320)
    Object.defineProperty(HTMLElement.prototype, 'getAnimations', {
      configurable: true,
      value(this: HTMLElement): Animation[] {
        if (!this.hasAttribute('data-ending-style')) {
          return []
        }

        return [
          {
            finished: closingAnimationFinished,
            pending: false,
            playState: 'running'
          } as unknown as Animation
        ]
      }
    })

    function EndingPanelRails() {
      const [hiddenUntilFound, setHiddenUntilFound] = useState(false)
      const [value, setValue] = useState(['programs'])

      return (
        <>
          <button type="button" onClick={() => setValue([])}>
            close ending Panel
          </button>
          <button type="button" onClick={() => setHiddenUntilFound(true)}>
            retain ending Panel for find-in-page
          </button>
          <RailsRoot hiddenUntilFound={hiddenUntilFound} onValueChange={setValue} value={value}>
            <RailsList>
              <RailsItem value="programs">
                <RailsHeader>
                  <RailsRail>Programs ending identity</RailsRail>
                </RailsHeader>
                <RailsPanel data-testid="ending-identity-panel" ref={panelRef}>
                  <input data-testid="ending-local-value" defaultValue="initial" />
                </RailsPanel>
              </RailsItem>
            </RailsList>
          </RailsRoot>
        </>
      )
    }

    const { unmount } = render(<EndingPanelRails />)
    const panel = screen.getByTestId('ending-identity-panel')
    const input = screen.getByTestId('ending-local-value')

    fireEvent.change(input, { target: { value: 'preserved' } })
    fireEvent.click(screen.getByRole('button', { name: 'close ending Panel' }))

    await waitFor(() => expect(panel).toHaveAttribute('data-ending-style'))

    fireEvent.click(screen.getByRole('button', { name: 'retain ending Panel for find-in-page' }))

    expect(screen.getByTestId('ending-identity-panel')).toBe(panel)
    expect(screen.getByTestId('ending-local-value')).toBe(input)
    expect(input).toHaveValue('preserved')
    expect(panel).toHaveAttribute('data-ending-style')
    expect(cleanup).not.toHaveBeenCalled()

    finishClosingAnimation()

    await waitFor(() => {
      expect(panel).not.toHaveAttribute('data-ending-style')
      expect(panel).toHaveAttribute('hidden', 'until-found')
    })

    expect(screen.getByTestId('ending-identity-panel')).toBe(panel)
    expect(screen.getByTestId('ending-local-value')).toBe(input)
    expect(input).toHaveValue('preserved')
    expect(cleanup).not.toHaveBeenCalled()

    unmount()

    expect(cleanup).toHaveBeenCalledOnce()
    expect(cleanup).toHaveBeenCalledWith(panel)
    expect(panelRef).not.toHaveBeenCalledWith(null)
  })

  it('preserves a retained closed Panel when find-in-page mounting changes', () => {
    const cleanup = vi.fn()
    const panelRef: RefCallback<HTMLDivElement> = vi.fn((panel) => {
      if (panel === null) {
        return
      }

      return () => cleanup(panel)
    })

    function RetainedPanelRails() {
      const [hiddenUntilFound, setHiddenUntilFound] = useState(false)

      return (
        <>
          <button type="button" onClick={() => setHiddenUntilFound((current) => !current)}>
            toggle retained find-in-page
          </button>
          <RailsRoot defaultValue={[]} hiddenUntilFound={hiddenUntilFound} keepMounted>
            <RailsList>
              <RailsItem value="programs">
                <RailsHeader>
                  <RailsRail>Programs retained identity</RailsRail>
                </RailsHeader>
                <RailsPanel data-testid="retained-identity-panel" ref={panelRef}>
                  <input data-testid="retained-local-value" defaultValue="initial" />
                </RailsPanel>
              </RailsItem>
            </RailsList>
          </RailsRoot>
        </>
      )
    }

    const { unmount } = render(<RetainedPanelRails />)
    const panel = screen.getByTestId('retained-identity-panel')
    const input = screen.getByTestId('retained-local-value')

    fireEvent.change(input, { target: { value: 'preserved' } })
    fireEvent.click(screen.getByRole('button', { name: 'toggle retained find-in-page' }))

    expect(screen.getByTestId('retained-identity-panel')).toBe(panel)
    expect(screen.getByTestId('retained-local-value')).toBe(input)
    expect(input).toHaveValue('preserved')
    expect(panel).toHaveAttribute('hidden', 'until-found')
    expect(cleanup).not.toHaveBeenCalled()

    fireEvent.click(screen.getByRole('button', { name: 'toggle retained find-in-page' }))

    expect(screen.getByTestId('retained-identity-panel')).toBe(panel)
    expect(screen.getByTestId('retained-local-value')).toBe(input)
    expect(input).toHaveValue('preserved')
    expect(panel).toHaveAttribute('hidden', '')
    expect(cleanup).not.toHaveBeenCalled()

    unmount()

    expect(cleanup).toHaveBeenCalledOnce()
    expect(cleanup).toHaveBeenCalledWith(panel)
    expect(panelRef).not.toHaveBeenCalledWith(null)
  })
})
