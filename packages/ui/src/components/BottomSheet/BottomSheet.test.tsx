import { Drawer as BaseUiDrawer } from '@base-ui/react/drawer'
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { createRef, useState, type CSSProperties, type ReactNode } from 'react'
import { afterEach, describe, expect, expectTypeOf, it, vi } from 'vitest'

import {
  type BottomSheetBackdropProps,
  type BottomSheetBackdropState,
  type BottomSheetCloseProps,
  type BottomSheetCloseState,
  type BottomSheetContentProps,
  type BottomSheetContentState,
  type BottomSheetDescriptionProps,
  type BottomSheetDescriptionState,
  type BottomSheetNamespace,
  type BottomSheetPopupProps,
  type BottomSheetPopupState,
  type BottomSheetPortalProps,
  type BottomSheetPortalState,
  type BottomSheetRootChangeEventDetails,
  type BottomSheetRootChangeEventReason,
  type BottomSheetRootProps,
  type BottomSheetRootState,
  type BottomSheetSurfaceProps,
  type BottomSheetSurfaceState,
  type BottomSheetTitleProps,
  type BottomSheetTitleState,
  type BottomSheetTriggerProps,
  type BottomSheetTriggerState,
  type BottomSheetViewportProps,
  type BottomSheetViewportState
} from '../..'
import * as PackageExports from '../..'
import { Ex006NestedPageStack } from './BottomSheet.stories'

interface BottomSheetPackageContract {
  BottomSheet: BottomSheetNamespace
  BottomSheetBackdrop: BottomSheetNamespace['Backdrop']
  BottomSheetClose: BottomSheetNamespace['Close']
  BottomSheetContent: BottomSheetNamespace['Content']
  BottomSheetDescription: BottomSheetNamespace['Description']
  BottomSheetPopup: BottomSheetNamespace['Popup']
  BottomSheetPortal: BottomSheetNamespace['Portal']
  BottomSheetRoot: BottomSheetNamespace['Root']
  BottomSheetSurface: BottomSheetNamespace['Surface']
  BottomSheetTitle: BottomSheetNamespace['Title']
  BottomSheetTrigger: BottomSheetNamespace['Trigger']
  BottomSheetViewport: BottomSheetNamespace['Viewport']
}

type IsAny<TValue> = 0 extends 1 & TValue ? true : false
type IsCallable<TValue> =
  IsAny<TValue> extends true ? false : TValue extends (...args: never[]) => unknown ? true : false
type HasNoKeys<TValue, TKeys extends PropertyKey> =
  IsAny<TValue> extends true ? true : Extract<TKeys, keyof TValue> extends never ? true : false

interface ExpectedBottomSheetRootProps {
  children?: ReactNode
  defaultOpen?: boolean
  disablePointerDismissal?: boolean
  onOpenChange?: (open: boolean, eventDetails: BottomSheetRootChangeEventDetails) => void
  onOpenChangeComplete?: (open: boolean) => void
  open?: boolean
}

type BottomSheetRootExcludedProps =
  | 'actionsRef'
  | 'defaultSnapPoint'
  | 'defaultTriggerId'
  | 'handle'
  | 'modal'
  | 'onSnapPointChange'
  | 'snapPoint'
  | 'snapPoints'
  | 'snapToSequentialPoints'
  | 'swipeDirection'
  | 'triggerId'

type BottomSheetTriggerExcludedProps = 'handle' | 'payload'
type BottomSheetPortalExcludedProps = 'container'
type BottomSheetBackdropExcludedProps = 'forceRender'

const PACKAGE_EXPORTS = PackageExports as typeof PackageExports & BottomSheetPackageContract
const BottomSheet = PACKAGE_EXPORTS.BottomSheet
const BottomSheetBackdrop = PACKAGE_EXPORTS.BottomSheetBackdrop
const BottomSheetClose = PACKAGE_EXPORTS.BottomSheetClose
const BottomSheetContent = PACKAGE_EXPORTS.BottomSheetContent
const BottomSheetDescription = PACKAGE_EXPORTS.BottomSheetDescription
const BottomSheetPopup = PACKAGE_EXPORTS.BottomSheetPopup
const BottomSheetPortal = PACKAGE_EXPORTS.BottomSheetPortal
const BottomSheetRoot = PACKAGE_EXPORTS.BottomSheetRoot
const BottomSheetSurface = PACKAGE_EXPORTS.BottomSheetSurface
const BottomSheetTitle = PACKAGE_EXPORTS.BottomSheetTitle
const BottomSheetTrigger = PACKAGE_EXPORTS.BottomSheetTrigger
const BottomSheetViewport = PACKAGE_EXPORTS.BottomSheetViewport

afterEach(() => {
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})

describe('BottomSheet', () => {
  it('UC-003 - exposes the non-callable eleven-part namespace, direct exports, and approved public types', () => {
    expect(typeof BottomSheet).toBe('object')
    expect(BottomSheet).toEqual({
      Backdrop: BottomSheetBackdrop,
      Close: BottomSheetClose,
      Content: BottomSheetContent,
      Description: BottomSheetDescription,
      Popup: BottomSheetPopup,
      Portal: BottomSheetPortal,
      Root: BottomSheetRoot,
      Surface: BottomSheetSurface,
      Title: BottomSheetTitle,
      Trigger: BottomSheetTrigger,
      Viewport: BottomSheetViewport
    })

    expect(
      Object.keys(PACKAGE_EXPORTS)
        .filter((exportName) => exportName.startsWith('BottomSheet'))
        .sort()
    ).toEqual(
      [
        'BottomSheet',
        'BottomSheetBackdrop',
        'BottomSheetClose',
        'BottomSheetContent',
        'BottomSheetDescription',
        'BottomSheetPopup',
        'BottomSheetPortal',
        'BottomSheetRoot',
        'BottomSheetSurface',
        'BottomSheetTitle',
        'BottomSheetTrigger',
        'BottomSheetViewport'
      ].sort()
    )

    expectTypeOf<IsCallable<BottomSheetNamespace>>().toEqualTypeOf<false>()
    expectTypeOf<BottomSheetNamespace['Surface']>().toEqualTypeOf<typeof BottomSheetSurface>()
    expectTypeOf<BottomSheetNamespace['Root']>().toEqualTypeOf<typeof BottomSheetRoot>()
    expectTypeOf<BottomSheetNamespace['Trigger']>().toEqualTypeOf<typeof BottomSheetTrigger>()
    expectTypeOf<BottomSheetNamespace['Portal']>().toEqualTypeOf<typeof BottomSheetPortal>()
    expectTypeOf<BottomSheetNamespace['Backdrop']>().toEqualTypeOf<typeof BottomSheetBackdrop>()
    expectTypeOf<BottomSheetNamespace['Viewport']>().toEqualTypeOf<typeof BottomSheetViewport>()
    expectTypeOf<BottomSheetNamespace['Popup']>().toEqualTypeOf<typeof BottomSheetPopup>()
    expectTypeOf<BottomSheetNamespace['Content']>().toEqualTypeOf<typeof BottomSheetContent>()
    expectTypeOf<BottomSheetNamespace['Title']>().toEqualTypeOf<typeof BottomSheetTitle>()
    expectTypeOf<BottomSheetNamespace['Description']>().toEqualTypeOf<
      typeof BottomSheetDescription
    >()
    expectTypeOf<BottomSheetNamespace['Close']>().toEqualTypeOf<typeof BottomSheetClose>()

    expectTypeOf<BottomSheetSurfaceProps>().toEqualTypeOf<BaseUiDrawer.Indent.Props>()
    expectTypeOf<BottomSheetRootProps>().toEqualTypeOf<ExpectedBottomSheetRootProps>()
    expectTypeOf<BottomSheetTriggerProps>().toEqualTypeOf<
      Omit<BaseUiDrawer.Trigger.Props, BottomSheetTriggerExcludedProps>
    >()
    expectTypeOf<BottomSheetPortalProps>().toEqualTypeOf<
      Omit<BaseUiDrawer.Portal.Props, BottomSheetPortalExcludedProps>
    >()
    expectTypeOf<BottomSheetBackdropProps>().toEqualTypeOf<
      Omit<BaseUiDrawer.Backdrop.Props, BottomSheetBackdropExcludedProps>
    >()
    expectTypeOf<BottomSheetViewportProps>().toEqualTypeOf<BaseUiDrawer.Viewport.Props>()
    expectTypeOf<BottomSheetPopupProps>().toEqualTypeOf<BaseUiDrawer.Popup.Props>()
    expectTypeOf<BottomSheetContentProps>().toEqualTypeOf<BaseUiDrawer.Content.Props>()
    expectTypeOf<BottomSheetTitleProps>().toEqualTypeOf<BaseUiDrawer.Title.Props>()
    expectTypeOf<BottomSheetDescriptionProps>().toEqualTypeOf<BaseUiDrawer.Description.Props>()
    expectTypeOf<BottomSheetCloseProps>().toEqualTypeOf<BaseUiDrawer.Close.Props>()

    expectTypeOf<BottomSheetSurfaceState>().toEqualTypeOf<BaseUiDrawer.Indent.State>()
    expectTypeOf<BottomSheetRootState>().toEqualTypeOf<BaseUiDrawer.Root.State>()
    expectTypeOf<BottomSheetTriggerState>().toEqualTypeOf<BaseUiDrawer.Trigger.State>()
    expectTypeOf<BottomSheetPortalState>().toEqualTypeOf<BaseUiDrawer.Portal.State>()
    expectTypeOf<BottomSheetBackdropState>().toEqualTypeOf<BaseUiDrawer.Backdrop.State>()
    expectTypeOf<BottomSheetViewportState>().toEqualTypeOf<BaseUiDrawer.Viewport.State>()
    expectTypeOf<BottomSheetPopupState>().toEqualTypeOf<BaseUiDrawer.Popup.State>()
    expectTypeOf<BottomSheetContentState>().toEqualTypeOf<BaseUiDrawer.Content.State>()
    expectTypeOf<BottomSheetTitleState>().toEqualTypeOf<BaseUiDrawer.Title.State>()
    expectTypeOf<BottomSheetDescriptionState>().toEqualTypeOf<BaseUiDrawer.Description.State>()
    expectTypeOf<BottomSheetCloseState>().toEqualTypeOf<BaseUiDrawer.Close.State>()
    expectTypeOf<BottomSheetRootChangeEventReason>().toEqualTypeOf<BaseUiDrawer.Root.ChangeEventReason>()
    expectTypeOf<BottomSheetRootChangeEventDetails>().toEqualTypeOf<BaseUiDrawer.Root.ChangeEventDetails>()

    expectTypeOf<
      HasNoKeys<BottomSheetRootProps, BottomSheetRootExcludedProps>
    >().toEqualTypeOf<true>()
    expectTypeOf<
      HasNoKeys<BottomSheetTriggerProps, BottomSheetTriggerExcludedProps>
    >().toEqualTypeOf<true>()
    expectTypeOf<
      HasNoKeys<BottomSheetPortalProps, BottomSheetPortalExcludedProps>
    >().toEqualTypeOf<true>()
    expectTypeOf<
      HasNoKeys<BottomSheetBackdropProps, BottomSheetBackdropExcludedProps>
    >().toEqualTypeOf<true>()
  })

  it('UC-001 / UC-002 / UC-006 / EX-001 - opens and closes the documented uncontrolled modal page surface', async () => {
    render(
      <BottomSheet.Surface data-testid="surface">
        <main>
          <BottomSheet.Root>
            <BottomSheet.Trigger>Open workout</BottomSheet.Trigger>
            <BottomSheet.Portal>
              <BottomSheet.Backdrop />
              <BottomSheet.Viewport>
                <BottomSheet.Popup>
                  <BottomSheet.Content>
                    <BottomSheet.Title>Workout</BottomSheet.Title>
                    <BottomSheet.Description>
                      Review today&apos;s session before starting.
                    </BottomSheet.Description>
                    <p>5 exercises · 45 minutes</p>
                  </BottomSheet.Content>
                  <BottomSheet.Close>Close workout</BottomSheet.Close>
                </BottomSheet.Popup>
              </BottomSheet.Viewport>
            </BottomSheet.Portal>
          </BottomSheet.Root>
        </main>
      </BottomSheet.Surface>
    )

    const surface = screen.getByTestId('surface')
    const trigger = screen.getByRole('button', { name: 'Open workout' })

    expect(surface).not.toHaveAttribute('data-active')
    expect(trigger).not.toHaveAttribute('data-popup-open')

    fireEvent.click(trigger)

    const popup = await screen.findByRole('dialog', { name: 'Workout' })

    expect(popup).toHaveAttribute('aria-modal', 'true')
    expect(popup).toHaveAccessibleDescription("Review today's session before starting.")
    expect(surface).toHaveAttribute('data-active')
    expect(trigger).toHaveAttribute('data-popup-open')
    expect(screen.getByRole('button', { name: 'Close workout' })).toHaveFocus()

    fireEvent.click(screen.getByRole('button', { name: 'Close workout' }))

    await waitFor(() => {
      expect(screen.queryByRole('dialog', { name: 'Workout' })).not.toBeInTheDocument()
      expect(surface).not.toHaveAttribute('data-active')
    })
    expect(trigger).toHaveFocus()
  })

  it('UC-005 - preserves a consumer-owned Surface border supplied through className and style', () => {
    render(
      <BottomSheet.Surface
        className="border-2"
        data-testid="consumer-bordered-surface"
        style={{ borderColor: 'hotpink', borderStyle: 'solid' }}
      >
        <main>Consumer-owned bordered surface</main>
      </BottomSheet.Surface>
    )

    const surface = screen.getByTestId('consumer-bordered-surface')

    expect(surface).toHaveClass('border-2')
    expect(surface.style.borderColor).toBe('hotpink')
    expect(surface.style.borderStyle).toBe('solid')
  })

  it('UC-002 / UC-007 / CR-007 - reports complete change details and lets a consumer cancel dismissal', async () => {
    const onOpenChange = vi.fn(
      (nextOpen: boolean, eventDetails: BottomSheetRootChangeEventDetails) => {
        if (!nextOpen && eventDetails.reason === 'close-press') {
          eventDetails.cancel()
        }
      }
    )

    render(
      <BottomSheet.Surface>
        <BottomSheet.Root defaultOpen onOpenChange={onOpenChange}>
          <BottomSheet.Portal>
            <BottomSheet.Backdrop />
            <BottomSheet.Viewport>
              <BottomSheet.Popup>
                <BottomSheet.Title>Cancelable sheet</BottomSheet.Title>
                <BottomSheet.Close>Try close</BottomSheet.Close>
              </BottomSheet.Popup>
            </BottomSheet.Viewport>
          </BottomSheet.Portal>
        </BottomSheet.Root>
      </BottomSheet.Surface>
    )

    const popup = screen.getByRole('dialog', { name: 'Cancelable sheet' })

    fireEvent.click(screen.getByRole('button', { name: 'Try close' }))

    expect(popup).toBeInTheDocument()
    expect(onOpenChange).toHaveBeenCalledTimes(1)

    const closeCall = onOpenChange.mock.calls[0]

    if (closeCall === undefined) {
      throw new Error('Expected Close to request an open-state change')
    }

    const closeDetails = closeCall[1]

    expect(closeDetails).toEqual(
      expect.objectContaining({
        allowPropagation: expect.any(Function),
        cancel: expect.any(Function),
        event: expect.any(Event),
        isCanceled: true,
        isPropagationAllowed: false,
        preventUnmountOnClose: expect.any(Function),
        reason: 'close-press'
      })
    )
    expect(closeDetails).toHaveProperty('trigger')

    fireEvent.keyDown(document, { key: 'Escape' })

    await waitFor(() => {
      expect(screen.queryByRole('dialog', { name: 'Cancelable sheet' })).not.toBeInTheDocument()
    })
    const escapeCall = onOpenChange.mock.calls[1]

    if (escapeCall === undefined) {
      throw new Error('Expected Escape to request an open-state change')
    }

    expect(escapeCall[0]).toBe(false)
    expect(escapeCall[1].reason).toBe('escape-key')
  })

  it('UC-002 / UC-006 / UC-007 / UC-009 / UC-014 / EX-002 - supports controlled state, pointer-dismissal narrowing, reasons, and completion', async () => {
    const eventOrder: string[] = []

    function ControlledBottomSheet() {
      const [open, setOpen] = useState(false)
      const [reason, setReason] = useState('none')
      const [phase, setPhase] = useState('closed')

      return (
        <BottomSheet.Surface>
          <BottomSheet.Root
            disablePointerDismissal
            onOpenChange={(nextOpen: boolean, eventDetails: BottomSheetRootChangeEventDetails) => {
              eventOrder.push(`change:${String(nextOpen)}:${eventDetails.reason}`)
              setReason(eventDetails.reason)
              setOpen(nextOpen)
            }}
            onOpenChangeComplete={(nextOpen: boolean) => {
              eventOrder.push(`complete:${String(nextOpen)}`)
              setPhase(nextOpen ? 'open' : 'closed')
            }}
            open={open}
          >
            <BottomSheet.Trigger>Open controlled sheet</BottomSheet.Trigger>
            <output aria-live="polite">
              Last reason: {reason}; phase: {phase}
            </output>
            <BottomSheet.Portal>
              <BottomSheet.Backdrop data-testid="controlled-backdrop" />
              <BottomSheet.Viewport>
                <BottomSheet.Popup>
                  <BottomSheet.Title>Controlled sheet</BottomSheet.Title>
                  <BottomSheet.Description>
                    Backdrop presses do not dismiss this sheet.
                  </BottomSheet.Description>
                  <BottomSheet.Close>Done</BottomSheet.Close>
                </BottomSheet.Popup>
              </BottomSheet.Viewport>
            </BottomSheet.Portal>
          </BottomSheet.Root>
        </BottomSheet.Surface>
      )
    }

    render(<ControlledBottomSheet />)

    fireEvent.click(screen.getByRole('button', { name: 'Open controlled sheet' }))

    await screen.findByRole('dialog', { name: 'Controlled sheet' })
    await waitFor(() => {
      expect(screen.getByText('Last reason: trigger-press; phase: open')).toBeInTheDocument()
    })
    expect(eventOrder).toEqual(['change:true:trigger-press', 'complete:true'])

    fireEvent.pointerDown(screen.getByTestId('controlled-backdrop'), {
      button: 0,
      pointerType: 'mouse'
    })

    expect(screen.getByRole('dialog', { name: 'Controlled sheet' })).toBeInTheDocument()
    expect(screen.getByText('Last reason: trigger-press; phase: open')).toBeInTheDocument()

    fireEvent.keyDown(document, { key: 'Escape' })

    await waitFor(() => {
      expect(screen.queryByRole('dialog', { name: 'Controlled sheet' })).not.toBeInTheDocument()
      expect(screen.getByText('Last reason: escape-key; phase: closed')).toBeInTheDocument()
    })
    expect(eventOrder).toEqual([
      'change:true:trigger-press',
      'complete:true',
      'change:false:escape-key',
      'complete:false'
    ])
  })

  it('UC-003 - fixes modal, downward, non-snap behavior even when excluded Root props are forced at runtime', () => {
    const unsupportedRootProps = {
      defaultSnapPoint: 0.5,
      modal: false,
      snapPoint: 0.5,
      snapPoints: [0.5, 1],
      swipeDirection: 'right'
    } as unknown as BottomSheetRootProps

    render(
      <BottomSheet.Surface>
        <BottomSheet.Root {...unsupportedRootProps} defaultOpen>
          <BottomSheet.Portal>
            <BottomSheet.Backdrop />
            <BottomSheet.Viewport>
              <BottomSheet.Popup>
                <BottomSheet.Title>Fixed contract</BottomSheet.Title>
                <BottomSheet.Close>Close fixed contract</BottomSheet.Close>
              </BottomSheet.Popup>
            </BottomSheet.Viewport>
          </BottomSheet.Portal>
        </BottomSheet.Root>
      </BottomSheet.Surface>
    )

    const popup = screen.getByRole('dialog', { name: 'Fixed contract' })

    expect(popup).toHaveAttribute('aria-modal', 'true')
    expect(popup).toHaveAttribute('data-swipe-direction', 'down')
    expect(popup).not.toHaveAttribute('data-expanded')
  })

  it('UC-003 / CR-005 - rejects function-valued Root children instead of invoking Base UI payload rendering', () => {
    const payloadRenderer = vi.fn(() => (
      <BottomSheet.Portal>
        <BottomSheet.Backdrop />
        <BottomSheet.Viewport>
          <BottomSheet.Popup>
            <BottomSheet.Title>Leaked payload sheet</BottomSheet.Title>
            <BottomSheet.Close>Close leaked payload sheet</BottomSheet.Close>
          </BottomSheet.Popup>
        </BottomSheet.Viewport>
      </BottomSheet.Portal>
    ))
    const unsupportedRootProps = {
      children: payloadRenderer
    } as unknown as BottomSheetRootProps

    render(
      <BottomSheet.Surface>
        <BottomSheet.Root {...unsupportedRootProps} defaultOpen />
      </BottomSheet.Surface>
    )

    expect(payloadRenderer).not.toHaveBeenCalled()
    expect(screen.queryByRole('dialog', { name: 'Leaked payload sheet' })).not.toBeInTheDocument()
  })

  it('UC-003 / UC-006 / CR-003 - preserves Base UI role and hidden-state precedence over conflicting Popup inputs', async () => {
    function SemanticPrecedenceBottomSheet() {
      const [open, setOpen] = useState(false)

      return (
        <BottomSheet.Surface>
          <BottomSheet.Root onOpenChange={(nextOpen: boolean) => setOpen(nextOpen)} open={open}>
            <BottomSheet.Trigger>Open semantic sheet</BottomSheet.Trigger>
            <BottomSheet.Portal keepMounted>
              <BottomSheet.Backdrop />
              <BottomSheet.Viewport>
                <BottomSheet.Popup data-testid="semantic-popup" hidden={open} role="presentation">
                  <BottomSheet.Title>Semantic sheet</BottomSheet.Title>
                  <BottomSheet.Close>Close semantic sheet</BottomSheet.Close>
                </BottomSheet.Popup>
              </BottomSheet.Viewport>
            </BottomSheet.Portal>
          </BottomSheet.Root>
        </BottomSheet.Surface>
      )
    }

    render(<SemanticPrecedenceBottomSheet />)

    const popup = screen.getByTestId('semantic-popup')

    expect(popup).toHaveAttribute('data-closed')
    expect(popup).toHaveAttribute('hidden')
    expect(popup).toHaveAttribute('role', 'dialog')

    fireEvent.click(screen.getByRole('button', { name: 'Open semantic sheet' }))

    await waitFor(() => {
      expect(popup).toHaveAttribute('data-open')
      expect(popup).not.toHaveAttribute('hidden')
      expect(popup).toHaveAttribute('role', 'dialog')
    })
    expect(screen.getByRole('dialog', { name: 'Semantic sheet' })).toBe(popup)

    fireEvent.click(screen.getByRole('button', { name: 'Close semantic sheet' }))

    await waitFor(() => {
      expect(popup).toHaveAttribute('data-closed')
      expect(popup).toHaveAttribute('hidden')
      expect(popup).toHaveAttribute('role', 'dialog')
    })
  })

  it('UC-003 / UC-006 / UC-008 / CR-003 - preserves Base UI semantic precedence over a conflicting element-form Popup render', async () => {
    function RenderSemanticPrecedenceBottomSheet() {
      const [open, setOpen] = useState(false)

      return (
        <BottomSheet.Surface>
          <BottomSheet.Root onOpenChange={(nextOpen: boolean) => setOpen(nextOpen)} open={open}>
            <BottomSheet.Trigger>Open rendered semantic sheet</BottomSheet.Trigger>
            <BottomSheet.Portal keepMounted>
              <BottomSheet.Backdrop />
              <BottomSheet.Viewport>
                <BottomSheet.Popup
                  render={
                    <section
                      aria-modal="false"
                      data-testid="rendered-semantic-popup"
                      hidden={open}
                      role="presentation"
                    />
                  }
                >
                  <BottomSheet.Title>Rendered semantic sheet</BottomSheet.Title>
                  <BottomSheet.Close>Close rendered semantic sheet</BottomSheet.Close>
                </BottomSheet.Popup>
              </BottomSheet.Viewport>
            </BottomSheet.Portal>
          </BottomSheet.Root>
        </BottomSheet.Surface>
      )
    }

    render(<RenderSemanticPrecedenceBottomSheet />)

    const popup = screen.getByTestId('rendered-semantic-popup')

    expect(popup.tagName).toBe('SECTION')
    expect(popup).toHaveAttribute('data-closed')
    expect(popup).toHaveAttribute('hidden')
    expect(popup).toHaveAttribute('role', 'dialog')
    expect(popup).toHaveAttribute('aria-modal', 'true')

    fireEvent.click(screen.getByRole('button', { name: 'Open rendered semantic sheet' }))

    await waitFor(() => {
      expect(popup).toHaveAttribute('data-open')
      expect(popup).not.toHaveAttribute('hidden')
      expect(popup).toHaveAttribute('role', 'dialog')
      expect(popup).toHaveAttribute('aria-modal', 'true')
    })
    expect(screen.getByRole('dialog', { name: 'Rendered semantic sheet' })).toBe(popup)

    fireEvent.click(screen.getByRole('button', { name: 'Close rendered semantic sheet' }))

    await waitFor(() => {
      expect(popup).toHaveAttribute('data-closed')
      expect(popup).toHaveAttribute('hidden')
      expect(popup).toHaveAttribute('role', 'dialog')
      expect(popup).toHaveAttribute('aria-modal', 'true')
    })
  })

  it('UC-003 / UC-006 / UC-008 / EX-004 / QA-002 - composes consumer elements, preserves the default h2 Title, and honors focus overrides', async () => {
    const surfaceRef = createRef<HTMLDivElement>()
    const triggerRef = createRef<HTMLButtonElement>()
    const portalRef = createRef<HTMLDivElement>()
    const backdropRef = createRef<HTMLDivElement>()
    const viewportRef = createRef<HTMLDivElement>()
    const popupRef = createRef<HTMLDivElement>()
    const contentRef = createRef<HTMLDivElement>()
    const titleRef = createRef<HTMLHeadingElement>()
    const descriptionRef = createRef<HTMLParagraphElement>()
    const closeRef = createRef<HTMLButtonElement>()

    render(
      <BottomSheet.Surface
        data-consumer-surface="workout"
        ref={surfaceRef}
        render={<section aria-label="Workout editor" />}
      >
        <BottomSheet.Root>
          <BottomSheet.Trigger
            data-consumer-trigger="edit"
            ref={triggerRef}
            render={<PackageExports.Button />}
          >
            Edit workout
          </BottomSheet.Trigger>
          <BottomSheet.Portal data-consumer-portal="workout" ref={portalRef}>
            <BottomSheet.Backdrop data-consumer-backdrop="workout" ref={backdropRef} />
            <BottomSheet.Viewport data-consumer-viewport="workout" ref={viewportRef}>
              <BottomSheet.Popup
                data-consumer-popup="workout"
                initialFocus={titleRef}
                ref={popupRef}
              >
                <BottomSheet.Content data-consumer-content="workout" ref={contentRef}>
                  <BottomSheet.Title data-consumer-title="workout" ref={titleRef} tabIndex={-1}>
                    Edit workout
                  </BottomSheet.Title>
                  <BottomSheet.Description
                    data-consumer-description="workout"
                    ref={descriptionRef}
                    render={<div />}
                  >
                    Change the page content.
                  </BottomSheet.Description>
                </BottomSheet.Content>
                <BottomSheet.Close
                  data-consumer-close="save"
                  ref={closeRef}
                  render={<PackageExports.Button />}
                >
                  Save and close
                </BottomSheet.Close>
              </BottomSheet.Popup>
            </BottomSheet.Viewport>
          </BottomSheet.Portal>
        </BottomSheet.Root>
      </BottomSheet.Surface>
    )

    const surface = screen.getByRole('region', { name: 'Workout editor' })
    const trigger = screen.getByRole('button', { name: 'Edit workout' })

    expect(surface).toBe(surfaceRef.current)
    expect(surface.tagName).toBe('SECTION')
    expect(surface).toHaveAttribute('data-consumer-surface', 'workout')
    expect(trigger).toBe(triggerRef.current)
    expect(trigger).toHaveAttribute('data-consumer-trigger', 'edit')

    fireEvent.click(trigger)

    const popup = await screen.findByRole('dialog', { name: 'Edit workout' })

    await waitFor(() => {
      expect(titleRef.current).toHaveFocus()
    })
    expect(portalRef.current).toHaveAttribute('data-consumer-portal', 'workout')
    expect(backdropRef.current).toHaveAttribute('data-consumer-backdrop', 'workout')
    expect(viewportRef.current).toHaveAttribute('data-consumer-viewport', 'workout')
    expect(popup).toBe(popupRef.current)
    expect(popup).toHaveAttribute('data-consumer-popup', 'workout')
    expect(contentRef.current).toHaveAttribute('data-consumer-content', 'workout')
    expect(titleRef.current?.tagName).toBe('H2')
    expect(titleRef.current).toHaveAttribute('data-consumer-title', 'workout')
    expect(descriptionRef.current?.tagName).toBe('DIV')
    expect(descriptionRef.current).toHaveAttribute('data-consumer-description', 'workout')
    expect(closeRef.current).toHaveAttribute('data-consumer-close', 'save')
    expect(popup).toHaveAccessibleDescription('Change the page content.')

    fireEvent.click(screen.getByRole('button', { name: 'Save and close' }))

    await waitFor(() => {
      expect(screen.queryByRole('dialog', { name: 'Edit workout' })).not.toBeInTheDocument()
    })
    expect(trigger).toHaveFocus()
  })

  it('UC-004 / UC-005 / UC-006 / UC-008 / EX-003 - renders the fixed page content contract, decorative handle, and swipe-ignore escape hatch', () => {
    render(
      <BottomSheet.Surface>
        <BottomSheet.Root defaultOpen>
          <BottomSheet.Portal>
            <BottomSheet.Backdrop />
            <BottomSheet.Viewport>
              <BottomSheet.Popup>
                <BottomSheet.Content data-testid="library-content">
                  <BottomSheet.Title>Exercise library</BottomSheet.Title>
                  <BottomSheet.Description>
                    Select text or scroll through the complete page.
                  </BottomSheet.Description>
                  <label>
                    Difficulty
                    <input data-base-ui-swipe-ignore max="5" min="1" type="range" />
                  </label>
                  {Array.from({ length: 24 }, (_, index) => (
                    <p key={index}>Exercise {index + 1}</p>
                  ))}
                </BottomSheet.Content>
                <BottomSheet.Close>Close library</BottomSheet.Close>
              </BottomSheet.Popup>
            </BottomSheet.Viewport>
          </BottomSheet.Portal>
        </BottomSheet.Root>
      </BottomSheet.Surface>
    )

    const popup = screen.getByRole('dialog', { name: 'Exercise library' })
    const content = screen.getByTestId('library-content')
    const handle = popup.firstElementChild
    const range = screen.getByRole('slider', { name: 'Difficulty' })

    expect(content).toContainElement(screen.getByText('Exercise 24'))
    expect(range).toHaveAttribute('data-base-ui-swipe-ignore')
    expect(handle).not.toBe(content)
    expect(handle).toHaveAttribute('aria-hidden', 'true')
    expect(handle).not.toHaveAttribute('role')
    expect(handle).not.toHaveAttribute('tabindex')
    expect(popup).toHaveAccessibleDescription('Select text or scroll through the complete page.')
  })

  it('UC-005 / UC-009 / UC-010 / UC-014 - preserves CSS lifecycle states and public drawer variables without changing modal outcomes', async () => {
    const onOpenChangeComplete = vi.fn<(open: boolean) => void>()
    let popupState: BottomSheetPopupState | undefined

    render(
      <BottomSheet.Surface data-testid="state-surface">
        <BottomSheet.Root onOpenChangeComplete={onOpenChangeComplete}>
          <BottomSheet.Trigger disabled>Disabled trigger</BottomSheet.Trigger>
          <BottomSheet.Trigger>Open state sheet</BottomSheet.Trigger>
          <BottomSheet.Portal keepMounted>
            <BottomSheet.Backdrop data-testid="state-backdrop" />
            <BottomSheet.Viewport data-testid="state-viewport">
              <BottomSheet.Popup
                className={(state: BottomSheetPopupState) => {
                  popupState = state
                  return state.swipeDirection === 'down' ? 'consumer-down-state' : undefined
                }}
                data-testid="state-popup"
              >
                <BottomSheet.Title>State sheet</BottomSheet.Title>
                <BottomSheet.Close disabled>Disabled close</BottomSheet.Close>
                <BottomSheet.Close>Close state sheet</BottomSheet.Close>
              </BottomSheet.Popup>
            </BottomSheet.Viewport>
          </BottomSheet.Portal>
        </BottomSheet.Root>
      </BottomSheet.Surface>
    )

    const disabledTrigger = screen.getByRole('button', { name: 'Disabled trigger' })
    const trigger = screen.getByRole('button', { name: 'Open state sheet' })
    const backdrop = screen.getByTestId('state-backdrop')
    const viewport = screen.getByTestId('state-viewport')
    const popup = screen.getByTestId('state-popup')

    expect(disabledTrigger).toBeDisabled()
    expect(disabledTrigger).toHaveAttribute('data-disabled')
    expect(backdrop).toHaveAttribute('data-closed')
    expect(viewport).toHaveAttribute('data-closed')
    expect(popup).toHaveAttribute('data-closed')
    expect(popup).toHaveAttribute('data-swipe-direction', 'down')
    expect(popup).not.toHaveAttribute('data-expanded')
    fireEvent.click(trigger)

    await waitFor(() => {
      expect(popup).toHaveAttribute('data-open')
      expect(backdrop).toHaveAttribute('data-open')
      expect(viewport).toHaveAttribute('data-open')
      expect(onOpenChangeComplete).toHaveBeenCalledWith(true)
    })

    expect(popup).toHaveClass('consumer-down-state')
    expect(popupState).toEqual(
      expect.objectContaining({
        nested: false,
        nestedDrawerOpen: false,
        nestedDrawerSwiping: false,
        open: true,
        swipeDirection: 'down',
        swiping: false
      })
    )
    expect(backdrop.style.getPropertyValue('--drawer-swipe-progress')).toBe('0')
    expect(backdrop.style.getPropertyValue('--drawer-swipe-strength')).toBe('1')
    expect(popup.style.getPropertyValue('--drawer-swipe-progress')).toBe('0')
    expect(popup.style.getPropertyValue('--drawer-swipe-strength')).toBe('1')
    expect(popup.style.getPropertyValue('--nested-drawers')).toBe('0')

    const disabledClose = screen.getByRole('button', { name: 'Disabled close' })

    expect(disabledClose).toBeDisabled()
    expect(disabledClose).toHaveAttribute('data-disabled')
    fireEvent.click(disabledClose)
    expect(popup).toHaveAttribute('data-open')

    fireEvent.click(screen.getByRole('button', { name: 'Close state sheet' }))

    await waitFor(() => {
      expect(backdrop).toHaveAttribute('data-closed')
      expect(viewport).toHaveAttribute('data-closed')
      expect(popup).toHaveAttribute('data-closed')
      expect(onOpenChangeComplete).toHaveBeenCalledWith(false)
    })
  })

  it('UC-010 / EX-001 - preserves accessible open and closed states when reduced motion is requested', async () => {
    vi.stubGlobal(
      'matchMedia',
      vi.fn(
        (query) =>
          ({
            addEventListener: vi.fn(),
            addListener: vi.fn(),
            dispatchEvent: vi.fn(),
            matches: query === '(prefers-reduced-motion: reduce)',
            media: query,
            onchange: null,
            removeEventListener: vi.fn(),
            removeListener: vi.fn()
          }) as MediaQueryList
      )
    )

    render(
      <BottomSheet.Surface data-testid="reduced-motion-surface">
        <BottomSheet.Root>
          <BottomSheet.Trigger>Open reduced-motion sheet</BottomSheet.Trigger>
          <BottomSheet.Portal>
            <BottomSheet.Backdrop />
            <BottomSheet.Viewport>
              <BottomSheet.Popup>
                <BottomSheet.Title>Reduced-motion sheet</BottomSheet.Title>
                <BottomSheet.Close>Close reduced-motion sheet</BottomSheet.Close>
              </BottomSheet.Popup>
            </BottomSheet.Viewport>
          </BottomSheet.Portal>
        </BottomSheet.Root>
      </BottomSheet.Surface>
    )

    const surface = screen.getByTestId('reduced-motion-surface')
    const trigger = screen.getByRole('button', { name: 'Open reduced-motion sheet' })

    fireEvent.click(trigger)

    const popup = await screen.findByRole('dialog', { name: 'Reduced-motion sheet' })

    expect(surface).toHaveAttribute('data-active')
    expect(popup).toHaveAttribute('data-open')
    expect(popup).toHaveAttribute('aria-modal', 'true')

    fireEvent.click(screen.getByRole('button', { name: 'Close reduced-motion sheet' }))

    await waitFor(() => {
      expect(screen.queryByRole('dialog', { name: 'Reduced-motion sheet' })).not.toBeInTheDocument()
      expect(surface).not.toHaveAttribute('data-active')
    })
    expect(trigger).toHaveFocus()
  })

  it('UC-001 / UC-011 / EX-005 - lets sibling Roots reuse one Surface coordination boundary one at a time', async () => {
    render(
      <BottomSheet.Surface data-testid="shared-surface">
        <div>
          <BottomSheet.Root>
            <BottomSheet.Trigger>Open filters</BottomSheet.Trigger>
            <BottomSheet.Portal>
              <BottomSheet.Backdrop />
              <BottomSheet.Viewport>
                <BottomSheet.Popup>
                  <BottomSheet.Title>Filters</BottomSheet.Title>
                  <BottomSheet.Close>Close filters</BottomSheet.Close>
                </BottomSheet.Popup>
              </BottomSheet.Viewport>
            </BottomSheet.Portal>
          </BottomSheet.Root>

          <BottomSheet.Root>
            <BottomSheet.Trigger>Open history</BottomSheet.Trigger>
            <BottomSheet.Portal>
              <BottomSheet.Backdrop />
              <BottomSheet.Viewport>
                <BottomSheet.Popup>
                  <BottomSheet.Title>History</BottomSheet.Title>
                  <BottomSheet.Close>Close history</BottomSheet.Close>
                </BottomSheet.Popup>
              </BottomSheet.Viewport>
            </BottomSheet.Portal>
          </BottomSheet.Root>
        </div>
      </BottomSheet.Surface>
    )

    const surface = screen.getByTestId('shared-surface')

    fireEvent.click(screen.getByRole('button', { name: 'Open filters' }))

    expect(await screen.findByRole('dialog', { name: 'Filters' })).toBeInTheDocument()
    expect(surface).toHaveAttribute('data-active')
    expect(screen.getAllByRole('dialog')).toHaveLength(1)
    expect(screen.getByRole('button', { hidden: true, name: 'Open history' })).not.toHaveAttribute(
      'data-popup-open'
    )

    fireEvent.click(screen.getByRole('button', { name: 'Close filters' }))

    await waitFor(() => {
      expect(screen.queryByRole('dialog', { name: 'Filters' })).not.toBeInTheDocument()
      expect(surface).not.toHaveAttribute('data-active')
    })

    fireEvent.click(screen.getByRole('button', { name: 'Open history' }))

    expect(await screen.findByRole('dialog', { name: 'History' })).toBeInTheDocument()
    expect(surface).toHaveAttribute('data-active')
    expect(screen.getAllByRole('dialog')).toHaveLength(1)
  })

  it('UC-006 / UC-009 / UC-010 / UC-012 / UC-013 / UC-014 / EX-006 - exposes and restores the equal-height nested stack contract', async () => {
    vi.spyOn(HTMLElement.prototype, 'offsetHeight', 'get').mockReturnValue(640)

    const unsupportedNestedBackdropProps = {
      forceRender: true
    } as unknown as BottomSheetBackdropProps

    render(
      <BottomSheet.Surface>
        <BottomSheet.Root>
          <BottomSheet.Trigger>Open account</BottomSheet.Trigger>
          <BottomSheet.Portal>
            <BottomSheet.Backdrop data-testid="account-backdrop" />
            <BottomSheet.Viewport>
              <BottomSheet.Popup data-testid="account-popup">
                <BottomSheet.Content>
                  <BottomSheet.Title>Account</BottomSheet.Title>
                  <BottomSheet.Description>Manage your account page.</BottomSheet.Description>

                  <BottomSheet.Root>
                    <BottomSheet.Trigger>Security settings</BottomSheet.Trigger>
                    <BottomSheet.Portal>
                      <BottomSheet.Backdrop
                        {...unsupportedNestedBackdropProps}
                        data-testid="security-backdrop"
                      />
                      <BottomSheet.Viewport data-testid="security-viewport">
                        <BottomSheet.Popup data-testid="security-popup">
                          <BottomSheet.Content>
                            <BottomSheet.Title>Security</BottomSheet.Title>
                            <BottomSheet.Description>
                              Review security settings.
                            </BottomSheet.Description>

                            <BottomSheet.Root>
                              <BottomSheet.Trigger>Advanced options</BottomSheet.Trigger>
                              <BottomSheet.Portal>
                                <BottomSheet.Backdrop data-testid="advanced-backdrop" />
                                <BottomSheet.Viewport data-testid="advanced-viewport">
                                  <BottomSheet.Popup data-testid="advanced-popup">
                                    <BottomSheet.Content>
                                      <BottomSheet.Title>Advanced</BottomSheet.Title>
                                      <BottomSheet.Description>
                                        Manage advanced security options.
                                      </BottomSheet.Description>
                                    </BottomSheet.Content>
                                    <BottomSheet.Close>Done</BottomSheet.Close>
                                  </BottomSheet.Popup>
                                </BottomSheet.Viewport>
                              </BottomSheet.Portal>
                            </BottomSheet.Root>
                          </BottomSheet.Content>
                          <BottomSheet.Close>Close security</BottomSheet.Close>
                        </BottomSheet.Popup>
                      </BottomSheet.Viewport>
                    </BottomSheet.Portal>
                  </BottomSheet.Root>
                </BottomSheet.Content>
                <BottomSheet.Close>Close account</BottomSheet.Close>
              </BottomSheet.Popup>
            </BottomSheet.Viewport>
          </BottomSheet.Portal>
        </BottomSheet.Root>
      </BottomSheet.Surface>
    )

    fireEvent.click(screen.getByRole('button', { name: 'Open account' }))

    const accountPopup = await screen.findByRole('dialog', { name: 'Account' })

    expect(accountPopup).toHaveClass('shadow-(--hard-shadow)')
    expect(accountPopup).not.toHaveClass('shadow-none')
    expect(accountPopup.className).not.toContain('data-nested-drawer-open:shadow-')

    fireEvent.click(screen.getByRole('button', { name: 'Security settings' }))

    const securityPopup = await screen.findByRole('dialog', { name: 'Security' })

    await waitFor(() => {
      expect(accountPopup).toHaveAttribute('data-nested-drawer-open')
    })
    expect(accountPopup).toHaveClass('shadow-(--hard-shadow)')
    expect(securityPopup).not.toHaveAttribute('data-nested-drawer-open')
    expect(securityPopup).toHaveClass('shadow-(--hard-shadow)')
    for (const popup of [accountPopup, securityPopup]) {
      expect(popup).not.toHaveClass('shadow-none')
      expect(popup.className).not.toContain('data-nested-drawer-open:shadow-')
      expect(popup.className).not.toContain('box-shadow_')
    }
    expect(screen.getByTestId('security-viewport')).toHaveAttribute('data-nested')
    expect(screen.getByTestId('account-backdrop')).toBeInTheDocument()
    expect(screen.queryByTestId('security-backdrop')).not.toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Advanced options' }))

    const advancedPopup = await screen.findByRole('dialog', { name: 'Advanced' })

    await waitFor(() => {
      expect(securityPopup).toHaveAttribute('data-nested-drawer-open')
      expect(accountPopup.style.getPropertyValue('--nested-drawers')).toBe('2')
      expect(securityPopup.style.getPropertyValue('--nested-drawers')).toBe('1')
      expect(advancedPopup.style.getPropertyValue('--nested-drawers')).toBe('0')
    })
    expect(advancedPopup).not.toHaveAttribute('data-nested-drawer-open')
    for (const popup of [accountPopup, securityPopup, advancedPopup]) {
      expect(popup).toHaveClass('shadow-(--hard-shadow)')
      expect(popup).not.toHaveClass('shadow-none')
      expect(popup.className).not.toContain('data-nested-drawer-open:shadow-')
      expect(popup.className).not.toContain('box-shadow_')
    }
    expect(screen.getByTestId('advanced-viewport')).toHaveAttribute('data-nested')
    expect(screen.queryByTestId('advanced-backdrop')).not.toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Done' }))

    await waitFor(() => {
      expect(screen.queryByRole('dialog', { name: 'Advanced' })).not.toBeInTheDocument()
      expect(securityPopup).not.toHaveAttribute('data-nested-drawer-open')
    })

    fireEvent.click(screen.getByRole('button', { name: 'Close security' }))

    await waitFor(() => {
      expect(screen.queryByRole('dialog', { name: 'Security' })).not.toBeInTheDocument()
      expect(accountPopup).not.toHaveAttribute('data-nested-drawer-open')
      expect(screen.getByRole('dialog', { name: 'Account' })).toBeInTheDocument()
    })
  })

  it('UC-013 / EX-006 / CR-004 - lets consumer className and style deliberately replace the always-applied hard shadow', () => {
    render(
      <BottomSheet.Surface>
        <BottomSheet.Root defaultOpen>
          <BottomSheet.Portal>
            <BottomSheet.Backdrop />
            <BottomSheet.Viewport>
              <BottomSheet.Popup
                className="shadow-lg"
                data-testid="overridden-shadow-popup"
                style={
                  {
                    '--hard-shadow': '0 0 0 0 transparent'
                  } as CSSProperties
                }
              >
                <BottomSheet.Title>Shadow override</BottomSheet.Title>
                <BottomSheet.Close>Close shadow override</BottomSheet.Close>
              </BottomSheet.Popup>
            </BottomSheet.Viewport>
          </BottomSheet.Portal>
        </BottomSheet.Root>
      </BottomSheet.Surface>
    )

    const popup = screen.getByRole('dialog', { name: 'Shadow override' })

    expect(popup).toBe(screen.getByTestId('overridden-shadow-popup'))
    expect(popup).toHaveClass('shadow-lg', 'box-border', 'border', 'bg-background', 'outline-none')
    expect(popup).not.toHaveClass('shadow-none')
    expect(popup).not.toHaveClass('shadow-(--hard-shadow)')
    expect(popup.className).not.toContain('data-nested-drawer-open:shadow-')
    expect(popup).toHaveStyle({ '--hard-shadow': '0 0 0 0 transparent' })
  })

  it('UC-013 / EX-006 - keeps the default hard shadow on every Popup in the nested Storybook example', async () => {
    const Story = Ex006NestedPageStack.render

    expect(Story).toBeTypeOf('function')

    render(<Story />)

    fireEvent.click(screen.getByRole('button', { name: 'Open account' }))
    fireEvent.click(await screen.findByRole('button', { name: 'Security settings' }))

    const accountPopup = screen.getByRole('dialog', { hidden: true, name: 'Account' })
    const securityPopup = await screen.findByRole('dialog', { name: 'Security' })

    await waitFor(() => {
      expect(accountPopup).toHaveAttribute('data-nested-drawer-open')
    })

    expect(accountPopup).toHaveClass('shadow-(--hard-shadow)')
    expect(accountPopup.className).not.toContain('data-nested-drawer-open:shadow-')
    expect(accountPopup).toHaveClass('box-border', 'border', 'bg-background')
    expect(securityPopup).not.toHaveAttribute('data-nested-drawer-open')
    expect(securityPopup).toHaveClass('shadow-(--hard-shadow)')
    expect(securityPopup.className).not.toContain('data-nested-drawer-open:shadow-')
  })

  it('UC-003 / UC-014 - keeps Portal containment and nested Backdrop suppression private and non-overridable', () => {
    const externalContainer = document.createElement('div')
    externalContainer.setAttribute('data-testid', 'unsupported-external-container')
    document.body.append(externalContainer)

    const unsupportedPortalProps = {
      container: externalContainer
    } as unknown as BottomSheetPortalProps

    render(
      <BottomSheet.Surface>
        <BottomSheet.Root defaultOpen>
          <BottomSheet.Portal {...unsupportedPortalProps}>
            <BottomSheet.Backdrop />
            <BottomSheet.Viewport>
              <BottomSheet.Popup>
                <BottomSheet.Title>Contained sheet</BottomSheet.Title>
                <BottomSheet.Close>Close contained sheet</BottomSheet.Close>
              </BottomSheet.Popup>
            </BottomSheet.Viewport>
          </BottomSheet.Portal>
        </BottomSheet.Root>
      </BottomSheet.Surface>
    )

    const popup = screen.getByRole('dialog', { name: 'Contained sheet' })

    expect(externalContainer).not.toContainElement(popup)
    expect(popup).toHaveAttribute('data-swipe-direction', 'down')

    externalContainer.remove()
  })

  it('UC-006 - supports an explicit Popup label and description without inserting a Close or Title', () => {
    render(
      <BottomSheet.Surface>
        <BottomSheet.Root defaultOpen>
          <BottomSheet.Portal>
            <BottomSheet.Backdrop />
            <BottomSheet.Viewport>
              <BottomSheet.Popup
                aria-describedby="external-sheet-description"
                aria-label="Explicitly labeled sheet"
              >
                <p id="external-sheet-description">Description supplied by the consumer.</p>
                <BottomSheet.Close aria-label="Close explicitly labeled sheet">
                  <span aria-hidden="true">×</span>
                </BottomSheet.Close>
              </BottomSheet.Popup>
            </BottomSheet.Viewport>
          </BottomSheet.Portal>
        </BottomSheet.Root>
      </BottomSheet.Surface>
    )

    const popup = screen.getByRole('dialog', { name: 'Explicitly labeled sheet' })

    expect(popup).toHaveAccessibleDescription('Description supplied by the consumer.')
    expect(screen.queryByRole('heading')).not.toBeInTheDocument()
    expect(screen.getAllByRole('button')).toHaveLength(1)
    expect(
      screen.getByRole('button', { name: 'Close explicitly labeled sheet' })
    ).toBeInTheDocument()
    expect(within(popup).queryByRole('button', { name: /close/i })).toBeInTheDocument()
  })
})
