import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { createRef } from 'react'
import { describe, expect, it } from 'vitest'

import { BottomSheetBackdrop } from './BottomSheetBackdrop'
import { BottomSheetClose } from './BottomSheetClose'
import { BottomSheetPopup, type BottomSheetPopupState } from './BottomSheetPopup'
import { BottomSheetPortal } from './BottomSheetPortal'
import { BottomSheetRoot } from './BottomSheetRoot'
import { BottomSheetSurface } from './BottomSheetSurface'
import { BottomSheetTitle } from './BottomSheetTitle'
import { BottomSheetTrigger } from './BottomSheetTrigger'
import { BottomSheetViewport } from './BottomSheetViewport'

describe('BottomSheetPopup', () => {
  it('protects semantics while forwarding function render state, props, and ref', () => {
    const popupRef = createRef<HTMLDivElement>()
    let popupState: BottomSheetPopupState | undefined

    render(
      <BottomSheetSurface>
        <BottomSheetRoot>
          <BottomSheetPortal keepMounted>
            <BottomSheetBackdrop />
            <BottomSheetViewport>
              <BottomSheetPopup
                data-consumer-popup="function-render"
                ref={popupRef}
                render={(props, state) => {
                  popupState = state

                  return (
                    <article
                      {...props}
                      aria-modal="false"
                      data-testid="function-render-popup"
                      hidden={false}
                      role="presentation"
                    />
                  )
                }}
              >
                <BottomSheetTitle>Function render sheet</BottomSheetTitle>
                <BottomSheetClose>Close function render sheet</BottomSheetClose>
              </BottomSheetPopup>
            </BottomSheetViewport>
          </BottomSheetPortal>
        </BottomSheetRoot>
      </BottomSheetSurface>
    )

    const popup = screen.getByTestId('function-render-popup')

    expect(popup).toBe(popupRef.current)
    expect(popup.tagName).toBe('ARTICLE')
    expect(popup).toHaveAttribute('aria-modal', 'true')
    expect(popup).toHaveAttribute('data-consumer-popup', 'function-render')
    expect(popup).toHaveAttribute('hidden')
    expect(popup).toHaveAttribute('role', 'dialog')
    expect(popupState).toEqual(expect.objectContaining({ open: false }))
  })

  it('focuses Popup instead of the first control when touch opens the sheet', async () => {
    render(
      <BottomSheetSurface>
        <BottomSheetRoot>
          <BottomSheetTrigger>Open touch sheet</BottomSheetTrigger>
          <BottomSheetPortal>
            <BottomSheetBackdrop />
            <BottomSheetViewport>
              <BottomSheetPopup>
                <BottomSheetTitle>Touch sheet</BottomSheetTitle>
                <BottomSheetClose>Close touch sheet</BottomSheetClose>
              </BottomSheetPopup>
            </BottomSheetViewport>
          </BottomSheetPortal>
        </BottomSheetRoot>
      </BottomSheetSurface>
    )

    const trigger = screen.getByRole('button', { name: 'Open touch sheet' })
    const touchPointerDown = new MouseEvent('pointerdown', {
      bubbles: true,
      button: 0,
      cancelable: true
    })

    Object.defineProperty(touchPointerDown, 'pointerType', { value: 'touch' })

    fireEvent(trigger, touchPointerDown)
    fireEvent.click(trigger, { detail: 1 })

    const popup = await screen.findByRole('dialog', { name: 'Touch sheet' })

    await waitFor(() => expect(popup).toHaveFocus())
    expect(screen.getByRole('button', { name: 'Close touch sheet' })).not.toHaveFocus()
  })
})
