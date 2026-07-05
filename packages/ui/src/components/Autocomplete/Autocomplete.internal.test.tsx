import { Autocomplete as BaseUiAutocomplete } from '@base-ui/react/autocomplete'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { useRef, useState } from 'react'

import { AutocompleteAddOn, type AutocompleteAddOnProps } from './components/AutocompleteAddOn'
import { AutocompleteClear } from './components/AutocompleteClear'
import { AutocompleteCollection } from './components/AutocompleteCollection'
import { AutocompleteEmpty } from './components/AutocompleteEmpty'
import { AutocompleteGroup } from './components/AutocompleteGroup'
import { AutocompleteGroupLabel } from './components/AutocompleteGroupLabel'
import { AutocompleteIcon } from './components/AutocompleteIcon'
import { AutocompleteInput } from './components/AutocompleteInput'
import { AutocompleteInputGroup } from './components/AutocompleteInputGroup'
import { AutocompleteItem } from './components/AutocompleteItem'
import { AutocompleteList } from './components/AutocompleteList'
import { AutocompletePopup } from './components/AutocompletePopup'
import { AutocompletePortal } from './components/AutocompletePortal'
import {
  AutocompletePositioner,
  type AutocompletePositionerProps
} from './components/AutocompletePositioner'
import {
  AutocompleteRoot,
  type AutocompleteRootChangeEventDetails
} from './components/AutocompleteRoot'
import { AutocompleteStatus } from './components/AutocompleteStatus'
import { AutocompleteTrigger } from './components/AutocompleteTrigger'
import { resolveAutocompleteAutomaticPresentation } from './utils/resolveAutocompleteAutomaticPresentation'

describe('Autocomplete implementation', () => {
  it('preserves grouped Base UI state through PopupSurface callback renders', () => {
    render(
      <AutocompleteRoot inline items={['Amina']} open>
        <AutocompleteInput aria-label="Grouped callback autocomplete" />
        <AutocompleteList>
          <AutocompleteGroup
            items={['Amina']}
            render={(props, state) => (
              <section {...props} data-group-state-keys={Object.keys(state).length} />
            )}
          >
            <AutocompleteGroupLabel
              render={(props, state) => (
                <header {...props} data-label-state-keys={Object.keys(state).length} />
              )}
            >
              Athletes
            </AutocompleteGroupLabel>
            <AutocompleteCollection>
              {(name: string) => <AutocompleteItem value={name}>{name}</AutocompleteItem>}
            </AutocompleteCollection>
          </AutocompleteGroup>
        </AutocompleteList>
      </AutocompleteRoot>
    )

    const group = screen.getByRole('group', { name: 'Athletes' })
    const label = screen.getByText('Athletes')

    expect(group.tagName).toBe('SECTION')
    expect(group).toHaveAttribute('data-group-state-keys', '0')
    expect(group).toHaveAttribute('data-popup-surface-group')
    expect(label.tagName).toBe('HEADER')
    expect(label).toHaveAttribute('data-label-state-keys', '0')
    expect(label).toHaveAttribute('data-popup-surface-group-label')
    expect(label).toHaveClass('relative')
  })

  it('preserves React callback-ref cleanup through every composed anchor ref', async () => {
    const inputGroupCleanup = vi.fn()
    const inputCleanup = vi.fn()
    const triggerCleanup = vi.fn()
    const positionerCleanup = vi.fn()
    const inputGroupRef = vi.fn((_element: HTMLDivElement | null) => inputGroupCleanup)
    const inputRef = vi.fn((_element: HTMLInputElement | null) => inputCleanup)
    const triggerRef = vi.fn((_element: HTMLButtonElement | null) => triggerCleanup)
    const positionerRef = vi.fn((_element: HTMLDivElement | null) => positionerCleanup)
    const { unmount } = render(
      <AutocompleteRoot items={['Amina']} open>
        <AutocompleteInputGroup ref={inputGroupRef}>
          <AutocompleteInput aria-label="Cleanup autocomplete" ref={inputRef} />
          <AutocompleteTrigger aria-label="Cleanup trigger" ref={triggerRef} />
        </AutocompleteInputGroup>
        <AutocompletePortal>
          <AutocompletePositioner ref={positionerRef}>
            <AutocompletePopup>
              <AutocompleteList />
            </AutocompletePopup>
          </AutocompletePositioner>
        </AutocompletePortal>
      </AutocompleteRoot>
    )

    await screen.findByRole('listbox')

    expect(inputGroupRef).toHaveBeenCalledWith(expect.any(HTMLDivElement))
    expect(inputRef).toHaveBeenCalledWith(expect.any(HTMLInputElement))
    expect(triggerRef).toHaveBeenCalledWith(expect.any(HTMLButtonElement))
    expect(positionerRef).toHaveBeenCalledWith(expect.any(HTMLDivElement))

    unmount()

    expect(inputGroupCleanup).toHaveBeenCalledOnce()
    expect(inputCleanup).toHaveBeenCalledOnce()
    expect(triggerCleanup).toHaveBeenCalledOnce()
    expect(positionerCleanup).toHaveBeenCalledOnce()
    expect(inputGroupRef).not.toHaveBeenCalledWith(null)
    expect(inputRef).not.toHaveBeenCalledWith(null)
    expect(triggerRef).not.toHaveBeenCalledWith(null)
    expect(positionerRef).not.toHaveBeenCalledWith(null)
  })

  it('clears a callback ref that does not return a React cleanup', () => {
    const inputRef = vi.fn()
    const { unmount } = render(
      <AutocompleteRoot items={['Amina']}>
        <AutocompleteInput aria-label="Legacy callback ref autocomplete" ref={inputRef} />
      </AutocompleteRoot>
    )

    expect(inputRef).toHaveBeenCalledWith(expect.any(HTMLInputElement))

    unmount()

    expect(inputRef).toHaveBeenLastCalledWith(null)
  })

  it('rejects mixed automatic flat and grouped object collections', () => {
    expect(
      resolveAutocompleteAutomaticPresentation([
        { items: [{ text: 'Deadlift' }], text: 'Strength' },
        { text: 'Amina' }
      ])
    ).toBeNull()
    expect(resolveAutocompleteAutomaticPresentation([{ items: 'metadata', text: 'Amina' }])).toBe(
      'flat'
    )
  })

  it('discards every excluded AddOn prop received from untyped consumers', () => {
    const unsafeProps = {
      accessKey: 'a',
      'aria-describedby': 'unsafe-description',
      autoFocus: true,
      contentEditable: true,
      contextMenu: 'unsafe-menu',
      dangerouslySetInnerHTML: { __html: 'unsafe content' },
      draggable: true,
      inert: false,
      onPointerDown: vi.fn(),
      popover: 'auto',
      popoverTarget: 'unsafe-target',
      popoverTargetAction: 'show',
      role: 'button',
      suppressContentEditableWarning: true,
      tabIndex: 0,
      title: 'Unsafe title'
    } as unknown as Omit<AutocompleteAddOnProps, 'children'>

    render(
      <AutocompleteAddOn {...unsafeProps} data-testid="add-on">
        <svg data-testid="safe-child" />
      </AutocompleteAddOn>
    )

    const addOn = screen.getByTestId('add-on')

    expect(addOn).not.toHaveAttribute('accesskey')
    expect(addOn).not.toHaveAttribute('autofocus')
    expect(addOn).not.toHaveAttribute('contenteditable')
    expect(addOn).not.toHaveAttribute('contextmenu')
    expect(addOn).not.toHaveAttribute('draggable')
    expect(addOn).not.toHaveAttribute('popover')
    expect(addOn).not.toHaveAttribute('popovertarget')
    expect(addOn).not.toHaveAttribute('popovertargetaction')
    expect(addOn).not.toHaveAttribute('role')
    expect(addOn).not.toHaveAttribute('tabindex')
    expect(addOn).not.toHaveAttribute('title')
    expect(addOn).not.toHaveTextContent('unsafe content')
    expect(addOn).toContainElement(screen.getByTestId('safe-child'))
  })

  it('leaves standalone Clear and Icon outside the Powercoach InputGroup treatment', () => {
    render(
      <AutocompleteRoot defaultValue="Amina" inline items={['Amina']} open>
        <AutocompleteInput aria-label="Standalone autocomplete" />
        <AutocompleteClear
          aria-label="Clear standalone autocomplete"
          data-testid="standalone-clear"
          keepMounted
        />
        <AutocompleteTrigger aria-label="Standalone trigger">
          <AutocompleteIcon data-testid="standalone-icon" />
        </AutocompleteTrigger>
        <AutocompleteList />
      </AutocompleteRoot>
    )

    expect(screen.getByTestId('standalone-clear')).not.toHaveClass('w-9')
    expect(screen.getByTestId('standalone-icon')).not.toHaveClass('w-9')
  })

  it('keeps only InputGroup controls mounted and shrink-proof by default', () => {
    render(
      <>
        <AutocompleteRoot items={['Amina']}>
          <AutocompleteInput aria-label="Empty standalone autocomplete" />
          <AutocompleteClear
            aria-label="Clear empty standalone autocomplete"
            data-testid="empty-standalone-clear"
          />
          <AutocompleteList />
        </AutocompleteRoot>
        <AutocompleteRoot items={['Amina']}>
          <AutocompleteInputGroup>
            <AutocompleteAddOn>
              <svg />
            </AutocompleteAddOn>
            <AutocompleteInput aria-label="Empty grouped autocomplete" />
            <AutocompleteClear
              aria-label="Clear empty grouped autocomplete"
              data-testid="empty-grouped-clear"
            />
            <AutocompleteTrigger
              aria-label="Open empty grouped autocomplete"
              data-testid="empty-grouped-trigger"
            >
              <AutocompleteIcon />
            </AutocompleteTrigger>
          </AutocompleteInputGroup>
          <AutocompleteList />
        </AutocompleteRoot>
      </>
    )

    expect(screen.queryByTestId('empty-standalone-clear')).not.toBeInTheDocument()
    expect(screen.getByTestId('empty-grouped-clear')).toHaveClass('shrink-0')
    expect(screen.getByTestId('empty-grouped-trigger')).toHaveClass('shrink-0')
  })

  it('maps Status and Empty typography at the two smaller Root sizes', () => {
    for (const size of ['xs', 'md'] as const) {
      const { unmount } = render(
        <AutocompleteRoot inline items={[]} open size={size}>
          <AutocompleteInput aria-label={`${size} empty autocomplete`} />
          <AutocompleteStatus data-testid={`${size}-status`}>
            No pending request.
          </AutocompleteStatus>
          <AutocompleteEmpty data-testid={`${size}-empty`}>No result.</AutocompleteEmpty>
          <AutocompleteList />
        </AutocompleteRoot>
      )

      expect(screen.getByTestId(`${size}-status`)).toBeInTheDocument()
      expect(screen.getByTestId(`${size}-empty`)).toBeInTheDocument()

      unmount()
    }
  })

  it('resolves Popup style functions after its presentation defaults', () => {
    render(
      <AutocompleteRoot items={['Amina']} open>
        <AutocompleteInput aria-label="Styled autocomplete" />
        <AutocompletePortal>
          <AutocompletePositioner>
            <AutocompletePopup
              data-testid="styled-popup"
              style={(state) => ({ opacity: state.open ? 0.6 : 0.2 })}
            >
              <AutocompleteList />
            </AutocompletePopup>
          </AutocompletePositioner>
        </AutocompletePortal>
      </AutocompleteRoot>
    )

    expect(screen.getByTestId('styled-popup')).toHaveStyle({ opacity: '0.6' })
  })

  it('preserves Root state when consumer event handlers cancel changes', () => {
    const onOpenChange = vi.fn((_nextOpen: boolean, details: { cancel: () => void }) =>
      details.cancel()
    )
    const onValueChange = vi.fn((_nextValue: string, details: { cancel: () => void }) =>
      details.cancel()
    )

    render(
      <AutocompleteRoot
        filteredItems={['Amina']}
        items={['Amina']}
        onOpenChange={onOpenChange}
        onValueChange={onValueChange}
      >
        <AutocompleteInput aria-label="Cancelable autocomplete" />
        <AutocompleteTrigger aria-label="Open cancelable autocomplete" />
        <AutocompleteList />
      </AutocompleteRoot>
    )

    const input = screen.getByRole('combobox', { name: 'Cancelable autocomplete' })

    fireEvent.input(input, { target: { value: 'A' } })

    expect(onValueChange).toHaveBeenCalled()
    expect(onValueChange.mock.calls[0]?.[1]).toMatchObject({ isCanceled: true })

    fireEvent.click(screen.getByRole('button', { name: 'Open cancelable autocomplete' }))

    expect(onOpenChange).toHaveBeenCalled()
    expect(onOpenChange.mock.calls[0]?.[1]).toMatchObject({ isCanceled: true })
    expect(input).toHaveAttribute('aria-expanded', 'false')
  })

  it('discards a canceled final-character snapshot before a later close', async () => {
    let resolveClosingAnimation: (() => void) | undefined
    const closingAnimationFinished = new Promise<void>((resolve) => {
      resolveClosingAnimation = resolve
    })

    function CanceledClosingAutocomplete() {
      const cancelInputClearRef = useRef(true)
      const [open, setOpen] = useState(true)
      const [value, setValue] = useState('May')

      return (
        <AutocompleteRoot
          items={['Amina', 'Maya']}
          onOpenChange={(nextOpen, details) => {
            if (!nextOpen && details.reason === 'input-clear' && cancelInputClearRef.current) {
              cancelInputClearRef.current = false
              details.cancel()
              return
            }

            setOpen(nextOpen)
          }}
          onValueChange={setValue}
          open={open}
          value={value}
        >
          <AutocompleteInput aria-label="Cancelable closing autocomplete" />
          <AutocompletePortal keepMounted>
            <AutocompletePositioner>
              <AutocompletePopup data-testid="cancelable-closing-popup">
                <AutocompleteList>
                  {(name: string) => (
                    <div key={name}>
                      <span>{name}</span>
                    </div>
                  )}
                </AutocompleteList>
              </AutocompletePopup>
            </AutocompletePositioner>
          </AutocompletePortal>
        </AutocompleteRoot>
      )
    }

    render(<CanceledClosingAutocomplete />)

    const input = screen.getByRole('combobox', { name: 'Cancelable closing autocomplete' })
    const popup = await screen.findByTestId('cancelable-closing-popup')

    expect(screen.getByText('Maya')).toBeInTheDocument()
    expect(screen.queryByText('Amina')).not.toBeInTheDocument()

    Object.defineProperty(popup, 'getAnimations', {
      configurable: true,
      value: vi.fn(() => [{ finished: closingAnimationFinished }])
    })

    fireEvent.input(input, {
      inputType: 'deleteContentBackward',
      target: { value: '' }
    })

    expect(popup).toHaveAttribute('data-open')

    fireEvent.input(input, {
      inputType: 'insertText',
      target: { value: 'Am' }
    })
    fireEvent.keyDown(input, { key: 'Escape' })

    expect(popup).toHaveAttribute('data-closed')
    expect(screen.getByText('Amina')).toBeInTheDocument()
    expect(screen.queryByText('Maya')).not.toBeInTheDocument()

    resolveClosingAnimation?.()

    await waitFor(() => {
      expect(popup).toHaveAttribute('data-closed')
    })
  })

  it('keeps every Root size one pixel from the bottom and other sides', async () => {
    for (const size of ['xs', 'md', 'xl'] as const) {
      const { unmount } = render(
        <AutocompleteRoot items={['Amina']} open size={size}>
          <AutocompleteInputGroup>
            <AutocompleteAddOn>
              <svg />
            </AutocompleteAddOn>
            <AutocompleteInput aria-label={`${size} positioned autocomplete`} />
          </AutocompleteInputGroup>
          <AutocompletePortal>
            <AutocompletePositioner
              collisionAvoidance={{ align: 'none', side: 'none' }}
              data-testid={`${size}-bottom-positioner`}
              side="bottom"
            >
              <AutocompletePopup>
                <AutocompleteList />
              </AutocompletePopup>
            </AutocompletePositioner>
          </AutocompletePortal>
        </AutocompleteRoot>
      )

      expect(await screen.findByTestId(`${size}-bottom-positioner`)).toHaveStyle({
        transform: 'translate(0px, 1px)'
      })

      unmount()
    }

    render(
      <AutocompleteRoot items={['Amina']} open>
        <AutocompleteInput aria-label="Top positioned autocomplete" />
        <AutocompletePortal>
          <AutocompletePositioner
            collisionAvoidance={{ align: 'none', side: 'none' }}
            data-testid="top-positioner"
            side="top"
          >
            <AutocompletePopup>
              <AutocompleteList />
            </AutocompletePopup>
          </AutocompletePositioner>
        </AutocompletePortal>
      </AutocompleteRoot>
    )

    expect(await screen.findByTestId('top-positioner')).toHaveStyle({
      transform: 'translate(0px, -1px)'
    })
  })

  it('CR-002 - keeps every resolved side one CSS pixel away across device-pixel ratios', async () => {
    const devicePixelRatioDescriptor = Object.getOwnPropertyDescriptor(window, 'devicePixelRatio')
    const anchorRect = {
      bottom: 132.5,
      height: 32,
      left: 100.5,
      right: 200.5,
      top: 100.5,
      width: 100,
      x: 100.5,
      y: 100.5
    } as DOMRect
    const positionerWidth = 100
    const positionerHeight = 60
    const rectSpy = vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect')
    const originalGetBoundingClientRect = rectSpy.getMockImplementation()

    rectSpy.mockImplementation(function (this: HTMLElement): DOMRect {
      if (this.dataset.testid === 'gap-anchor') {
        return anchorRect
      }

      const side = this.parentElement?.dataset.gapSide
      const dpr = Number(this.parentElement?.dataset.gapDpr)

      if (side === undefined || Number.isNaN(dpr)) {
        return originalGetBoundingClientRect?.call(this) ?? new DOMRect()
      }

      const physicalSide = side === 'inline-start' ? 'right' : side === 'inline-end' ? 'left' : side
      const roundToDevicePixel = (value: number) => Math.round(value * dpr) / dpr
      const translateValues = this.style.translate.split(' ')
      const translateX = Number.parseFloat(translateValues[0] ?? '') || 0
      const translateY = Number.parseFloat(translateValues[1] ?? '') || 0
      const baseLeft =
        physicalSide === 'left'
          ? roundToDevicePixel(anchorRect.left - 1 - positionerWidth)
          : physicalSide === 'right'
            ? roundToDevicePixel(anchorRect.right + 1)
            : roundToDevicePixel(anchorRect.left)
      const baseTop =
        physicalSide === 'top'
          ? roundToDevicePixel(anchorRect.top - 1 - positionerHeight)
          : physicalSide === 'bottom'
            ? roundToDevicePixel(anchorRect.bottom + 1)
            : roundToDevicePixel(anchorRect.top)
      const left = baseLeft + translateX
      const top = baseTop + translateY

      return {
        bottom: top + positionerHeight,
        height: positionerHeight,
        left,
        right: left + positionerWidth,
        top,
        width: positionerWidth,
        x: left,
        y: top
      } as DOMRect
    })

    try {
      for (const dpr of [1, 1.25, 1.5, 2, 3]) {
        Object.defineProperty(window, 'devicePixelRatio', {
          configurable: true,
          value: dpr
        })

        for (const side of [
          'top',
          'bottom',
          'left',
          'right',
          'inline-start',
          'inline-end'
        ] as const) {
          const { unmount } = render(
            <div dir="rtl">
              <AutocompleteRoot items={['Amina']} open size="md">
                <AutocompleteInputGroup data-testid="gap-anchor" style={{ direction: 'rtl' }}>
                  <AutocompleteAddOn>
                    <svg />
                  </AutocompleteAddOn>
                  <AutocompleteInput aria-label={`${dpr} ${side} gap`} />
                </AutocompleteInputGroup>
                <AutocompletePortal>
                  <AutocompletePositioner
                    collisionAvoidance={{ align: 'none', side: 'none' }}
                    data-gap-dpr={dpr}
                    data-gap-side={side}
                    data-testid="gap-positioner"
                    side={side}
                  >
                    <AutocompletePopup>
                      <AutocompleteList />
                    </AutocompletePopup>
                  </AutocompletePositioner>
                </AutocompletePortal>
              </AutocompleteRoot>
            </div>
          )
          const positioner = await screen.findByTestId('gap-positioner')
          const gapElement = positioner.firstElementChild as HTMLElement
          const physicalSide =
            side === 'inline-start' ? 'right' : side === 'inline-end' ? 'left' : side

          await waitFor(() => {
            const positionerRect = gapElement.getBoundingClientRect()
            const gap =
              physicalSide === 'top'
                ? anchorRect.top - positionerRect.bottom
                : physicalSide === 'bottom'
                  ? positionerRect.top - anchorRect.bottom
                  : physicalSide === 'left'
                    ? anchorRect.left - positionerRect.right
                    : positionerRect.left - anchorRect.right

            expect(gap).toBeCloseTo(1, 6)
          })

          unmount()
        }
      }
    } finally {
      rectSpy.mockRestore()

      if (devicePixelRatioDescriptor === undefined) {
        Reflect.deleteProperty(window, 'devicePixelRatio')
      } else {
        Object.defineProperty(window, 'devicePixelRatio', devicePixelRatioDescriptor)
      }
    }
  })

  it('CR-003 - waits for a hidden keepMounted Positioner to have a measurable border box', async () => {
    const anchorRect = {
      bottom: 132.5,
      height: 32,
      left: 100.5,
      right: 200.5,
      top: 100.5,
      width: 100,
      x: 100.5,
      y: 100.5
    } as DOMRect
    const rectSpy = vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect')
    const originalGetBoundingClientRect = rectSpy.getMockImplementation()
    let measurable = false

    rectSpy.mockImplementation(function (this: HTMLElement): DOMRect {
      if (this.dataset.testid === 'hidden-gap-anchor') {
        return anchorRect
      }

      if (this.parentElement?.dataset.testid !== 'hidden-gap-positioner') {
        return originalGetBoundingClientRect?.call(this) ?? new DOMRect()
      }

      if (!measurable) {
        return new DOMRect()
      }

      const translateY = Number.parseFloat(this.style.translate.split(' ')[1] ?? '') || 0
      const top = 134 + translateY

      return {
        bottom: top + 60,
        height: 60,
        left: 100.5,
        right: 200.5,
        top,
        width: 100,
        x: 100.5,
        y: top
      } as DOMRect
    })

    try {
      render(
        <AutocompleteRoot items={['Amina']} open={false}>
          <AutocompleteInputGroup data-testid="hidden-gap-anchor">
            <AutocompleteInput aria-label="Hidden gap autocomplete" />
          </AutocompleteInputGroup>
          <AutocompletePortal keepMounted>
            <AutocompletePositioner
              collisionAvoidance={{ align: 'none', side: 'none' }}
              data-testid="hidden-gap-positioner"
              side="bottom"
            >
              <AutocompletePopup>
                <AutocompleteList />
              </AutocompletePopup>
            </AutocompletePositioner>
          </AutocompletePortal>
        </AutocompleteRoot>
      )

      const positioner = await screen.findByTestId('hidden-gap-positioner')
      const gapElement = positioner.firstElementChild as HTMLElement

      expect(gapElement).toHaveStyle({ translate: '0px 0px' })

      positioner.setAttribute('hidden', '')
      measurable = true
      positioner.removeAttribute('hidden')

      await waitFor(() => {
        expect(gapElement).toHaveStyle({ translate: '0px -0.5px' })
      })
      expect(gapElement.getBoundingClientRect().top - anchorRect.bottom).toBe(1)
    } finally {
      rectSpy.mockRestore()
    }
  })

  it('CR-004 - composes consumer translate independently from the gap correction', async () => {
    const anchorRect = {
      bottom: 132.5,
      height: 32,
      left: 100.5,
      right: 200.5,
      top: 100.5,
      width: 100,
      x: 100.5,
      y: 100.5
    } as DOMRect
    const rectSpy = vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect')
    const originalGetBoundingClientRect = rectSpy.getMockImplementation()

    rectSpy.mockImplementation(function (this: HTMLElement): DOMRect {
      if (this.dataset.testid === 'translated-gap-anchor') {
        return anchorRect
      }

      const positioner = this.parentElement

      if (positioner?.dataset.testid !== 'translated-gap-positioner') {
        return originalGetBoundingClientRect?.call(this) ?? new DOMRect()
      }

      const consumerTranslate = positioner.style.translate.split(' ')
      const correctionTranslate = this.style.translate.split(' ')
      const translateX =
        (Number.parseFloat(consumerTranslate[0] ?? '') || 0) +
        (Number.parseFloat(correctionTranslate[0] ?? '') || 0)
      const translateY =
        (Number.parseFloat(consumerTranslate[1] ?? '') || 0) +
        (Number.parseFloat(correctionTranslate[1] ?? '') || 0)
      const left = 100.5 + translateX
      const top = 133.5 + translateY

      return {
        bottom: top + 60,
        height: 60,
        left,
        right: left + 100,
        top,
        width: 100,
        x: left,
        y: top
      } as DOMRect
    })

    const translatedAutocomplete = (translateY: number) => (
      <AutocompleteRoot items={['Amina']} open>
        <AutocompleteInputGroup data-testid="translated-gap-anchor">
          <AutocompleteInput aria-label="Translated gap autocomplete" />
        </AutocompleteInputGroup>
        <AutocompletePortal>
          <AutocompletePositioner
            collisionAvoidance={{ align: 'none', side: 'none' }}
            data-testid="translated-gap-positioner"
            side="bottom"
            style={() => ({ opacity: 0.75, translate: `12px ${translateY}px` })}
          >
            <AutocompletePopup>
              <AutocompleteList />
            </AutocompletePopup>
          </AutocompletePositioner>
        </AutocompletePortal>
      </AutocompleteRoot>
    )

    try {
      const { rerender } = render(translatedAutocomplete(20))
      const positioner = await screen.findByTestId('translated-gap-positioner')
      const gapElement = positioner.firstElementChild as HTMLElement

      await waitFor(() => {
        expect(positioner).toHaveStyle({ opacity: '0.75', translate: '12px 20px' })
        expect(gapElement).toHaveStyle({ translate: '0px -20px' })
      })
      expect(gapElement.getBoundingClientRect().top - anchorRect.bottom).toBe(1)

      rerender(translatedAutocomplete(30))

      await waitFor(() => {
        expect(positioner).toHaveStyle({ translate: '12px 30px' })
        expect(gapElement).toHaveStyle({ translate: '0px -30px' })
      })
      expect(gapElement.getBoundingClientRect().top - anchorRect.bottom).toBe(1)
    } finally {
      rectSpy.mockRestore()
    }
  })

  it('resolves every supported explicit Positioner anchor form and layout fallback', async () => {
    const anchorRect = {
      bottom: 132.5,
      height: 32,
      left: 100.5,
      right: 200.5,
      top: 100.5,
      width: 100,
      x: 100.5,
      y: 100.5
    } as DOMRect
    const rectSpy = vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect')
    const originalGetBoundingClientRect = rectSpy.getMockImplementation()
    const resizeCallbacks: ResizeObserverCallback[] = []
    const originalResizeObserver = globalThis.ResizeObserver

    class TestResizeObserver implements ResizeObserver {
      constructor(callback: ResizeObserverCallback) {
        resizeCallbacks.push(callback)
      }

      disconnect = vi.fn()
      observe = vi.fn()
      unobserve = vi.fn()
    }

    rectSpy.mockImplementation(function (this: HTMLElement): DOMRect {
      if (this.dataset.testid === 'explicit-anchor') {
        return anchorRect
      }

      if (this.parentElement?.dataset.testid !== 'explicit-positioner') {
        return originalGetBoundingClientRect?.call(this) ?? new DOMRect()
      }

      const translateValues = this.style.translate.split(' ')
      const translateX = Number.parseFloat(translateValues[0] ?? '') || 0
      const translateY = Number.parseFloat(translateValues[1] ?? '') || 0

      return {
        bottom: 193.5 + translateY,
        height: 60,
        left: 100.5 + translateX,
        right: 200.5 + translateX,
        top: 133.5 + translateY,
        width: 100,
        x: 100.5 + translateX,
        y: 133.5 + translateY
      } as DOMRect
    })
    globalThis.ResizeObserver = TestResizeObserver

    const positioner = (anchor: AutocompletePositionerProps['anchor'], side = 'bottom') => (
      <AutocompleteRoot items={['Amina']} open>
        <AutocompleteInput aria-label="Explicitly anchored autocomplete" />
        <AutocompletePortal>
          <AutocompletePositioner
            anchor={anchor}
            collisionAvoidance={{ align: 'none', side: 'none' }}
            data-testid="explicit-positioner"
            key={side}
            side={side as NonNullable<AutocompletePositionerProps['side']>}
            style={() => ({ opacity: 0.75 })}
          >
            <AutocompletePopup>
              <AutocompleteList />
            </AutocompletePopup>
          </AutocompletePositioner>
        </AutocompletePortal>
      </AutocompleteRoot>
    )

    try {
      const { rerender, unmount } = render(<div data-testid="explicit-anchor" />)
      const anchorElement = screen.getByTestId('explicit-anchor')
      const anchorRef = { current: anchorElement }

      rerender(
        <>
          <div data-testid="explicit-anchor" />
          {positioner(anchorElement, 'inline-start')}
        </>
      )

      expect(await screen.findByTestId('explicit-positioner')).toHaveStyle({ opacity: '0.75' })

      rerender(
        <>
          <div data-testid="explicit-anchor" />
          {positioner(() => anchorElement, 'inline-end')}
        </>
      )
      rerender(
        <>
          <div data-testid="explicit-anchor" />
          {positioner(anchorRef)}
        </>
      )

      for (const callback of resizeCallbacks) {
        callback([], {} as ResizeObserver)
      }

      const contextVirtualAnchor = {
        contextElement: anchorElement,
        getBoundingClientRect: () => anchorRect
      }

      rerender(
        <>
          <div data-testid="explicit-anchor" />
          {positioner(contextVirtualAnchor, 'inline-start')}
        </>
      )

      rerender(
        <>
          <div data-testid="explicit-anchor" />
          {positioner(contextVirtualAnchor, 'inline-end')}
        </>
      )

      await waitFor(() => {
        expect(screen.getByTestId('explicit-positioner')).toHaveAttribute('data-side', 'inline-end')
      })

      document.documentElement.dir = 'rtl'
      rerender(
        <>
          <div data-testid="explicit-anchor" />
          {positioner({ getBoundingClientRect: () => anchorRect }, 'inline-start')}
        </>
      )

      document.documentElement.removeAttribute('dir')
      rerender(
        <>
          <div data-testid="explicit-anchor" />
          {positioner({ getBoundingClientRect: () => anchorRect }, 'inline-end')}
        </>
      )

      screen.getByTestId('explicit-positioner').removeAttribute('data-side')

      await waitFor(() => {
        expect(screen.getByTestId('explicit-positioner')).not.toHaveAttribute('data-side')
      })

      rerender(
        <>
          <div data-testid="explicit-anchor" />
          {positioner(() => null)}
        </>
      )

      unmount()
    } finally {
      document.documentElement.removeAttribute('dir')
      rectSpy.mockRestore()
      globalThis.ResizeObserver = originalResizeObserver
    }
  })

  it('does not require Powercoach anchor refs inside a Base UI Root', () => {
    render(
      <BaseUiAutocomplete.Root items={['Amina']} open>
        <BaseUiAutocomplete.Input aria-label="Base UI anchored autocomplete" />
        <BaseUiAutocomplete.Portal>
          <AutocompletePositioner>
            <BaseUiAutocomplete.Popup />
          </AutocompletePositioner>
        </BaseUiAutocomplete.Portal>
      </BaseUiAutocomplete.Root>
    )
  })

  it('resolves an Input nested in Positioner through the optional Trigger anchor', () => {
    const { rerender } = render(
      <AutocompleteRoot inline items={['Amina']} open>
        <AutocompletePortal>
          <AutocompletePositioner data-testid="nested-input-positioner">
            <AutocompleteInput aria-label="Nested positioned autocomplete" />
            <AutocompleteTrigger aria-label="Nested positioned trigger" />
            <AutocompletePopup>
              <AutocompleteList />
            </AutocompletePopup>
          </AutocompletePositioner>
        </AutocompletePortal>
      </AutocompleteRoot>
    )

    fireEvent.focus(screen.getByRole('combobox', { name: 'Nested positioned trigger' }))

    rerender(
      <AutocompleteRoot inline items={['Amina']} open>
        <AutocompletePortal>
          <AutocompletePositioner data-testid="nested-input-positioner">
            <AutocompleteInput aria-label="Nested positioned autocomplete" />
            <AutocompletePopup>
              <AutocompleteList />
            </AutocompletePopup>
          </AutocompletePositioner>
        </AutocompletePortal>
      </AutocompleteRoot>
    )
  })

  it('tolerates a Positioner render callback that does not expose its element ref', () => {
    render(
      <AutocompleteRoot items={['Amina']} open>
        <AutocompleteInput aria-label="Ref-less positioned autocomplete" />
        <AutocompletePortal>
          <AutocompletePositioner render={() => <div data-testid="ref-less-positioner" />} />
        </AutocompletePortal>
      </AutocompleteRoot>
    )

    expect(screen.getByTestId('ref-less-positioner')).toBeInTheDocument()
  })

  it('completes grouped automatic inline items through the item-press contract', () => {
    const groups = [
      {
        items: [{ text: 'Deadlift' }],
        text: 'Strength'
      }
    ]
    const onValueChange = vi.fn()

    render(
      <AutocompleteRoot inline items={groups} onValueChange={onValueChange} open>
        <AutocompleteInput aria-label="Grouped automatic completion" />
        <AutocompleteList />
      </AutocompleteRoot>
    )

    fireEvent.click(screen.getByRole('option', { name: 'Deadlift' }))

    expect(screen.getByRole('combobox', { name: 'Grouped automatic completion' })).toHaveValue(
      'Deadlift'
    )
    expect(onValueChange).toHaveBeenCalledWith(
      'Deadlift',
      expect.objectContaining({ reason: 'item-press' })
    )
  })

  it('keeps value and open item-press cancellation independent for inline automatic completion', () => {
    const openDetails: AutocompleteRootChangeEventDetails[] = []
    const valueDetails: AutocompleteRootChangeEventDetails[] = []

    render(
      <AutocompleteRoot
        inline
        items={[{ text: 'Deadlift' }]}
        onOpenChange={(_nextOpen, details) => openDetails.push(details)}
        onValueChange={(_nextValue, details) => {
          valueDetails.push(details)
          details.allowPropagation()
          details.cancel()
        }}
        open
      >
        <AutocompleteInput aria-label="Cancelable automatic completion" />
        <AutocompleteList />
      </AutocompleteRoot>
    )

    fireEvent.click(screen.getByRole('option', { name: 'Deadlift' }))

    expect(valueDetails).toHaveLength(1)
    expect(openDetails).toHaveLength(1)
    expect(valueDetails[0]).not.toBe(openDetails[0])
    expect(valueDetails[0]?.event).toBe(openDetails[0]?.event)
    expect(valueDetails[0]).toMatchObject({
      isCanceled: true,
      isPropagationAllowed: true,
      reason: 'item-press'
    })
    expect(openDetails[0]).toMatchObject({
      isCanceled: false,
      isPropagationAllowed: false,
      reason: 'item-press'
    })
    expect(screen.getByRole('combobox', { name: 'Cancelable automatic completion' })).toHaveValue(
      ''
    )
  })

  it('keeps unsupported omitted Collection content empty and renders immediate decorative icons', () => {
    render(
      <AutocompleteRoot inline items={['Deadlift']} open>
        <AutocompleteInput aria-label="Explicit immediate item" />
        <AutocompleteCollection />
        <AutocompleteList>
          <AutocompleteItem
            icon={<svg data-testid="immediate-icon" />}
            revealAnimationProps={false}
            value="Deadlift"
          >
            Deadlift
          </AutocompleteItem>
        </AutocompleteList>
      </AutocompleteRoot>
    )

    expect(screen.getByTestId('immediate-icon')).toBeInTheDocument()
    expect(screen.getAllByRole('option')).toHaveLength(1)
  })

  it('applies opaque revealed Item classes to every surface and style to the semantic Item', () => {
    render(
      <AutocompleteRoot inline items={['Deadlift']} open>
        <AutocompleteInput aria-label="Revealed visual overrides" />
        <AutocompleteList>
          <AutocompleteItem
            className={(state) =>
              state.highlighted
                ? 'bg-accent p-12 text-destructive underline'
                : 'bg-muted p-12 text-primary'
            }
            style={(state) => ({ opacity: state.highlighted ? 0.7 : 0.4 })}
            value="Deadlift"
          >
            Deadlift
          </AutocompleteItem>
        </AutocompleteList>
      </AutocompleteRoot>
    )

    const input = screen.getByRole('combobox', { name: 'Revealed visual overrides' })
    const item = screen.getByRole('option', { name: 'Deadlift' })
    const visualSurface = item.querySelector('[data-reveal-source]')

    expect(item).toHaveClass('bg-muted', 'p-12', 'text-primary')
    expect(item).toHaveStyle({ opacity: '0.4' })
    expect(visualSurface).toHaveClass('bg-muted', 'p-12', 'text-primary')
    expect(visualSurface).not.toHaveStyle({ opacity: '0.4' })

    fireEvent.focus(input)
    fireEvent.keyDown(input, { key: 'ArrowDown' })

    expect(item).toHaveClass('bg-accent', 'p-12', 'text-destructive', 'underline')
    expect(item).toHaveStyle({ opacity: '0.7' })
    expect(visualSurface).toHaveClass('bg-accent', 'p-12', 'text-destructive', 'underline')
    expect(visualSurface).not.toHaveStyle({ opacity: '0.7' })
  })

  it('lets Base UI complete non-inline automatic items inside Popup', () => {
    const items = [{ text: 'Deadlift' }]

    render(
      <AutocompleteRoot items={items} open>
        <AutocompleteInput aria-label="Popup automatic completion" />
        <AutocompletePortal>
          <AutocompletePositioner>
            <AutocompletePopup>
              <AutocompleteList />
            </AutocompletePopup>
          </AutocompletePositioner>
        </AutocompletePortal>
      </AutocompleteRoot>
    )

    fireEvent.click(screen.getByRole('option', { name: 'Deadlift' }))

    expect(screen.getByRole('combobox', { name: 'Popup automatic completion' })).toHaveValue(
      'Deadlift'
    )
  })
})
