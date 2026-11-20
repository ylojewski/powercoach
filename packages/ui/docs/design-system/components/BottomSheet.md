---
revision: 4
date: 2026-08-19
---

# BottomSheet

## Overview

BottomSheet renders a modal page surface from the bottom edge of a bounded
Powercoach surface. It wraps Base UI Drawer semantics with one fixed product
pattern: full width, nearly full height, downward swipe dismissal, no snap
points, square geometry, and automatic background indentation.

BottomSheet does not expose Base UI Drawer as a general-purpose drawer. It has
no side, placement, size, height, modal, swipe-direction, snap-point,
swipe-to-open, detached-trigger, or imperative-action configuration.

BottomSheet.Surface is the Powercoach coordination boundary. It privately
installs the Base UI Drawer provider, indentation background, indentation
surface, and portal host so every descendant BottomSheet.Root receives the
same indentation behavior and every BottomSheet.Portal remains geometrically
contained by the Surface.

BottomSheet uses the CSS animation engine. Base UI owns modal dialog semantics,
focus management, dismissal reasons, swipe measurement, transition lifecycle,
nested-drawer state, and the documented public state attributes and CSS
variables preserved by this specification. Powercoach owns the narrowed API,
Surface coordination, fixed geometry, visual treatment, automatic decorative
handle, motion constants, and equal-height nested stack presentation.

Every Popup consumes Input's public hard-shadow CSS contract. BottomSheet does
not copy the shadow values and does not consume the field-emphasis focus,
translation, border, or AddOn protocol.

## Anatomy

BottomSheet is a non-callable namespace with eleven public parts.

- BottomSheet.Surface: renders the indented application surface and privately
  owns Drawer coordination and the portal host.
- BottomSheet.Root: coordinates one controlled or uncontrolled modal sheet.
- BottomSheet.Trigger: opens its owning Root.
- BottomSheet.Portal: renders modal layers into the nearest Surface portal host.
- BottomSheet.Backdrop: renders the modal backdrop.
- BottomSheet.Viewport: positions the Popup within Surface.
- BottomSheet.Popup: renders the fixed page surface and its automatic handle.
- BottomSheet.Content: preserves Base UI Drawer content and text-selection
  behavior.
- BottomSheet.Title: labels Popup.
- BottomSheet.Description: describes Popup.
- BottomSheet.Close: closes its owning Root from a consumer-selected position.

Every Root and Portal must be a React descendant of exactly one unnested
Surface in the same React tree. DOM containment without React ancestry does not
establish Surface ownership. A child Root is nested only when it is a React
descendant of its parent Root.

Every Popup requires an accessible label and one consumer-rendered Close. The
component never inserts or positions a Close automatically.

```tsx
<BottomSheet.Surface>
  <main>
    <BottomSheet.Root>
      <BottomSheet.Trigger>Open</BottomSheet.Trigger>

      <BottomSheet.Portal>
        <BottomSheet.Backdrop />
        <BottomSheet.Viewport>
          <BottomSheet.Popup>
            <BottomSheet.Content>
              <BottomSheet.Title>Workout details</BottomSheet.Title>
              <BottomSheet.Description>Edit the workout page.</BottomSheet.Description>
              {content}
            </BottomSheet.Content>

            <BottomSheet.Close>Close</BottomSheet.Close>
          </BottomSheet.Popup>
        </BottomSheet.Viewport>
      </BottomSheet.Portal>
    </BottomSheet.Root>
  </main>
</BottomSheet.Surface>
```

### Public Exports

| Export                            | Description                                                            |
| --------------------------------- | ---------------------------------------------------------------------- |
| BottomSheet                       | Non-callable namespace with all eleven public parts.                   |
| BottomSheetNamespace              | Type of the public BottomSheet namespace object.                       |
| BottomSheetSurface                | Direct Surface component export.                                       |
| BottomSheetRoot                   | Direct Root component export.                                          |
| BottomSheetTrigger                | Direct Trigger component export.                                       |
| BottomSheetPortal                 | Direct Portal component export.                                        |
| BottomSheetBackdrop               | Direct Backdrop component export.                                      |
| BottomSheetViewport               | Direct Viewport component export.                                      |
| BottomSheetPopup                  | Direct Popup component export.                                         |
| BottomSheetContent                | Direct Content component export.                                       |
| BottomSheetTitle                  | Direct Title component export.                                         |
| BottomSheetDescription            | Direct Description component export.                                   |
| BottomSheetClose                  | Direct Close component export.                                         |
| BottomSheetSurfaceProps           | Public Surface props derived from Base UI Drawer.Indent.Props.         |
| BottomSheetRootProps              | Narrowed controlled and uncontrolled Root props.                       |
| BottomSheetTriggerProps           | Base UI Drawer.Trigger.Props without detached-handle or payload props. |
| BottomSheetPortalProps            | Base UI Drawer.Portal.Props without container.                         |
| BottomSheetBackdropProps          | Base UI Drawer.Backdrop.Props without forceRender.                     |
| BottomSheetViewportProps          | Alias-compatible Base UI Drawer.Viewport props.                        |
| BottomSheetPopupProps             | Alias-compatible Base UI Drawer.Popup props.                           |
| BottomSheetContentProps           | Alias-compatible Base UI Drawer.Content props.                         |
| BottomSheetTitleProps             | Alias-compatible Base UI Drawer.Title props.                           |
| BottomSheetDescriptionProps       | Alias-compatible Base UI Drawer.Description props.                     |
| BottomSheetCloseProps             | Alias-compatible Base UI Drawer.Close props.                           |
| BottomSheetSurfaceState           | Alias of Base UI Drawer.Indent.State.                                  |
| BottomSheetRootState              | Alias of Base UI Drawer.Root.State.                                    |
| BottomSheetTriggerState           | Alias of Base UI Drawer.Trigger.State.                                 |
| BottomSheetPortalState            | Alias of Base UI Drawer.Portal.State.                                  |
| BottomSheetBackdropState          | Alias of Base UI Drawer.Backdrop.State.                                |
| BottomSheetViewportState          | Alias of Base UI Drawer.Viewport.State.                                |
| BottomSheetPopupState             | Alias of Base UI Drawer.Popup.State.                                   |
| BottomSheetContentState           | Alias of Base UI Drawer.Content.State.                                 |
| BottomSheetTitleState             | Alias of Base UI Drawer.Title.State.                                   |
| BottomSheetDescriptionState       | Alias of Base UI Drawer.Description.State.                             |
| BottomSheetCloseState             | Alias of Base UI Drawer.Close.State.                                   |
| BottomSheetRootChangeEventReason  | Alias of Base UI Drawer.Root.ChangeEventReason.                        |
| BottomSheetRootChangeEventDetails | Alias of Base UI Drawer.Root.ChangeEventDetails.                       |

BottomSheet exports no Actions, Handle, createHandle, payload, snap-point,
swipe-direction, virtual-keyboard-provider, or portal-container types.

## Examples

### EX-001 - Default modal page surface

Context: A consumer needs an uncontrolled page-like surface that opens from the
bottom and automatically indents the application behind it.

Expected behavior: Trigger opens one full-width Popup with the fixed safe-area
top gap, automatic foreground handle, modal focus behavior, document scroll
lock, public hard shadow, and downward CSS motion. Surface has no
component-owned border, stays at scale 1, and translates 2rem upward while Popup
is open. Close is consumer-rendered inside Popup. Closing through Close, Escape,
backdrop press, or downward swipe restores focus and the unindented borderless
Surface. Reduced motion preserves the same states without transition duration.

Covers: UC-001, UC-002, UC-004, UC-005, UC-006, UC-007, UC-009, UC-010, UC-013

```tsx
import { BottomSheet } from '@powercoach/ui'

export function WorkoutSheet() {
  return (
    <BottomSheet.Surface className="h-dvh">
      <main className="grid h-full place-items-center bg-background">
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
}
```

### EX-002 - Controlled state and dismissal reasons

Context: A consumer needs to control open state and observe why state changes
were requested and when CSS transitions completed.

Expected behavior: onOpenChange receives the complete Base UI event details,
including swipe, outside-press, escape-key, close-press, and cancellation APIs.
The visible outputs expose the latest reason and completed phase. Pointer
dismissal is disabled, while Close, Escape, and swipe remain available.

Covers: UC-002, UC-003, UC-006, UC-007, UC-009, UC-014

```tsx
'use client'

import * as React from 'react'
import { BottomSheet } from '@powercoach/ui'

export function ControlledBottomSheet() {
  const [open, setOpen] = React.useState(false)
  const [reason, setReason] = React.useState('none')
  const [phase, setPhase] = React.useState('closed')

  return (
    <BottomSheet.Surface className="h-dvh">
      <div className="grid h-full content-center gap-4 border border-foreground p-6">
        <BottomSheet.Root
          open={open}
          disablePointerDismissal
          onOpenChange={(nextOpen, eventDetails) => {
            setReason(eventDetails.reason)
            setOpen(nextOpen)
          }}
          onOpenChangeComplete={(nextOpen) => setPhase(nextOpen ? 'open' : 'closed')}
        >
          <BottomSheet.Trigger>Open controlled sheet</BottomSheet.Trigger>
          <output aria-live="polite">
            Last reason: {reason}; phase: {phase}
          </output>
          <BottomSheet.Portal>
            <BottomSheet.Backdrop />
            <BottomSheet.Viewport>
              <BottomSheet.Popup>
                <BottomSheet.Content>
                  <BottomSheet.Title>Controlled sheet</BottomSheet.Title>
                  <BottomSheet.Description>
                    Backdrop presses do not dismiss this sheet.
                  </BottomSheet.Description>
                  <output aria-live="polite">
                    Last reason: {reason}; phase: {phase}
                  </output>
                </BottomSheet.Content>
                <BottomSheet.Close>Done</BottomSheet.Close>
              </BottomSheet.Popup>
            </BottomSheet.Viewport>
          </BottomSheet.Portal>
        </BottomSheet.Root>
      </div>
    </BottomSheet.Surface>
  )
}
```

### EX-003 - Fixed page height and internal scrolling

Context: A mobile surface contains more page content than the available Popup
height.

Expected behavior: Popup leaves 2.2rem plus the top safe-area inset visible above
it, stays at that fixed height regardless of content length, and scrolls its
own contents. The bottom padding includes the bottom safe-area inset. Text in
Content remains selectable, and the range control opts out of swipe handling.

Covers: UC-004, UC-005, UC-006, UC-008

```tsx
import { BottomSheet } from '@powercoach/ui'

export function ExerciseLibrarySheet() {
  return (
    <BottomSheet.Surface className="h-[36rem]">
      <div className="grid h-full place-items-center border border-foreground">
        <BottomSheet.Root>
          <BottomSheet.Trigger>Browse exercises</BottomSheet.Trigger>
          <BottomSheet.Portal>
            <BottomSheet.Backdrop />
            <BottomSheet.Viewport>
              <BottomSheet.Popup>
                <BottomSheet.Content>
                  <BottomSheet.Title>Exercise library</BottomSheet.Title>
                  <BottomSheet.Description>
                    Select text or scroll through the complete page.
                  </BottomSheet.Description>
                  <label>
                    Difficulty
                    <input data-base-ui-swipe-ignore type="range" min="1" max="5" />
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
      </div>
    </BottomSheet.Surface>
  )
}
```

### EX-004 - Render composition and focus overrides

Context: A consumer composes Powercoach Button surfaces with Trigger and Close
and renders Surface as a semantic section.

Expected behavior: Surface render forwards the supplied DOM element, ref,
props, and children while retaining indentation. Trigger and Close preserve
Base UI button composition. Popup focuses the supplied heading on keyboard
open and restores focus to Trigger on close.

Covers: UC-003, UC-006, UC-008

```tsx
'use client'

import * as React from 'react'
import { BottomSheet, Button } from '@powercoach/ui'

export function ComposedBottomSheet() {
  const titleRef = React.useRef<HTMLHeadingElement>(null)

  return (
    <BottomSheet.Surface render={<section aria-label="Workout editor" />} className="h-dvh">
      <BottomSheet.Root>
        <BottomSheet.Trigger render={<Button />}>Edit workout</BottomSheet.Trigger>
        <BottomSheet.Portal>
          <BottomSheet.Backdrop />
          <BottomSheet.Viewport>
            <BottomSheet.Popup initialFocus={titleRef}>
              <BottomSheet.Content>
                <BottomSheet.Title ref={titleRef} tabIndex={-1}>
                  Edit workout
                </BottomSheet.Title>
                <BottomSheet.Description>Change the page content.</BottomSheet.Description>
              </BottomSheet.Content>
              <BottomSheet.Close render={<Button />}>Save and close</BottomSheet.Close>
            </BottomSheet.Popup>
          </BottomSheet.Viewport>
        </BottomSheet.Portal>
      </BottomSheet.Root>
    </BottomSheet.Surface>
  )
}
```

### EX-005 - Shared Surface indentation

Context: Two independent sheet entry points share one bounded application
surface.

Expected behavior: Either top-level Root activates the same Surface
indentation and portal host. The modal interaction prevents the other sibling
Trigger from opening while one sheet is active, so no two top-level sibling
modals are open simultaneously.

Covers: UC-001, UC-011

```tsx
import { BottomSheet } from '@powercoach/ui'

export function SharedBottomSheetSurface() {
  return (
    <BottomSheet.Surface className="h-dvh">
      <div className="flex h-full items-center justify-center gap-4 border border-foreground">
        <BottomSheet.Root>
          <BottomSheet.Trigger>Open filters</BottomSheet.Trigger>
          <BottomSheet.Portal>
            <BottomSheet.Backdrop />
            <BottomSheet.Viewport>
              <BottomSheet.Popup>
                <BottomSheet.Content>
                  <BottomSheet.Title>Filters</BottomSheet.Title>
                </BottomSheet.Content>
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
                <BottomSheet.Content>
                  <BottomSheet.Title>History</BottomSheet.Title>
                </BottomSheet.Content>
                <BottomSheet.Close>Close history</BottomSheet.Close>
              </BottomSheet.Popup>
            </BottomSheet.Viewport>
          </BottomSheet.Portal>
        </BottomSheet.Root>
      </div>
    </BottomSheet.Surface>
  )
}
```

### EX-006 - Nested page stack

Context: A page opens a child page and then a grandchild page without leaving
the modal sheet flow.

Expected behavior: Every active page remains full width and fixed height. Each
open child scales and lifts its background ancestors using the Base UI nested
stack constants. Every Popup keeps the same foreground public hard shadow before,
during, and after stacking, so nested state changes do not animate the shadow.
Background pages hide their Content and handle, show the dim overlay, and
continuously restore their content during a child downward swipe. Base UI
suppresses child Backdrops. Every Popup retains its own consumer-positioned
Close.

Covers: UC-006, UC-009, UC-010, UC-012, UC-013, UC-014

```tsx
import { BottomSheet } from '@powercoach/ui'

export function NestedBottomSheets() {
  return (
    <BottomSheet.Surface className="h-dvh">
      <div className="grid h-full place-items-center border border-foreground">
        <BottomSheet.Root>
          <BottomSheet.Trigger>Open account</BottomSheet.Trigger>
          <BottomSheet.Portal>
            <BottomSheet.Backdrop />
            <BottomSheet.Viewport>
              <BottomSheet.Popup>
                <BottomSheet.Content>
                  <BottomSheet.Title>Account</BottomSheet.Title>
                  <BottomSheet.Description>Manage your account page.</BottomSheet.Description>

                  <BottomSheet.Root>
                    <BottomSheet.Trigger>Security settings</BottomSheet.Trigger>
                    <BottomSheet.Portal>
                      <BottomSheet.Backdrop />
                      <BottomSheet.Viewport>
                        <BottomSheet.Popup>
                          <BottomSheet.Content>
                            <BottomSheet.Title>Security</BottomSheet.Title>
                            <BottomSheet.Description>
                              Review security settings.
                            </BottomSheet.Description>

                            <BottomSheet.Root>
                              <BottomSheet.Trigger>Advanced options</BottomSheet.Trigger>
                              <BottomSheet.Portal>
                                <BottomSheet.Backdrop />
                                <BottomSheet.Viewport>
                                  <BottomSheet.Popup>
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
      </div>
    </BottomSheet.Surface>
  )
}
```

## Surface

### Props

BottomSheetSurfaceProps derives from Base UI Drawer.Indent.Props. Surface
privately renders the surrounding provider, background, and portal-host
structure; the public props describe only the rendered indented content
element.

| Prop             | Type                                                | Default | Description                                                                                                          |
| ---------------- | --------------------------------------------------- | ------- | -------------------------------------------------------------------------------------------------------------------- |
| children         | React.ReactNode                                     | None    | Application content and descendant BottomSheet Roots.                                                                |
| className        | Base UI Drawer.Indent className prop                | None    | Composes consumer classes with required Surface classes. State functions receive BottomSheetSurfaceState.            |
| style            | Base UI Drawer.Indent style prop                    | None    | Composes consumer styles with Surface style. State functions receive BottomSheetSurfaceState.                        |
| render           | ReactElement or render function                     | div     | Replaces only the rendered indented content element. The replacement forwards its ref, supplied props, and children. |
| native div props | Ref-capable props accepted by Base UI Drawer.Indent | None    | Native attributes, events, aria attributes, consumer data attributes, and the element ref pass through.              |

The render replacement must be one ref-forwarding DOM element. Fragment is
unsupported. Surface forwards its ref to the rendered indented content element,
never to the private portal host. The private portal host and IndentBackground
are not render-overridable.

Consumer className and style may extend Surface presentation. Replacing its
required positioning, full-size, overflow, transform, transform-origin, or
transition behavior is unsupported.

Surface adds no border in any state. A border supplied through consumer
className or style is supported and consumer-owned.

### Events

Surface defines no custom events. Supported native events pass through the
rendered indented content element.

### Data Attributes

| Attribute   | Description                                                                |
| ----------- | -------------------------------------------------------------------------- |
| data-active | Present while any Root within the nearest private Drawer provider is open. |

Consumer data attributes pass through Surface except for data-active, which is
owned by Base UI Drawer.Indent.

### CSS Variables

| Variable                | Type   | Description                                                     |
| ----------------------- | ------ | --------------------------------------------------------------- |
| --drawer-swipe-progress | number | Downward swipe progress shared with the active descendant Root. |

Surface uses this Base UI variable for direct gesture tracking and indentation
reversal. It does not define a public customization variable for indentation
scale, lift, duration, easing, top gap, or bleed.

## Root

### Props

BottomSheetRootProps is a non-generic interface with only the following props.

| Prop                    | Type                                                             | Default | Description                                                                                                  |
| ----------------------- | ---------------------------------------------------------------- | ------- | ------------------------------------------------------------------------------------------------------------ |
| open                    | boolean                                                          | None    | Controls whether the sheet is open.                                                                          |
| defaultOpen             | boolean                                                          | false   | Sets the initial open state for uncontrolled usage.                                                          |
| onOpenChange            | Function receiving boolean and BottomSheetRootChangeEventDetails | None    | Runs when Base UI requests an open-state change.                                                             |
| onOpenChangeComplete    | Function receiving boolean                                       | None    | Runs after detected CSS transitions finish for an opening or closing state.                                  |
| disablePointerDismissal | boolean                                                          | false   | Prevents outside pointer presses from closing the sheet. Escape, Close, and downward swipe remain available. |
| children                | React.ReactNode                                                  | None    | Root parts and consumer content. Payload render-function children are not supported.                         |

Root renders no HTML element and has no ref. It fixes Base UI Drawer modal to
true and swipeDirection to down.

Root does not expose modal, swipeDirection, snapPoints, defaultSnapPoint,
snapPoint, onSnapPointChange, snapToSequentialPoints, actionsRef,
defaultTriggerId, triggerId, handle, or payload behavior.

### Events

BottomSheetRootChangeEventReason and BottomSheetRootChangeEventDetails are
aliases of Base UI Drawer.Root.ChangeEventReason and
Drawer.Root.ChangeEventDetails.

| Reason            | Request source                                  |
| ----------------- | ----------------------------------------------- |
| trigger-press     | The active Trigger was pressed.                 |
| outside-press     | A pointer press occurred outside Popup.         |
| escape-key        | Escape requested dismissal.                     |
| close-watcher     | The platform close watcher requested dismissal. |
| close-press       | Close was pressed.                              |
| focus-out         | Base UI observed a focus-out request.           |
| imperative-action | Base UI emitted an internal imperative request. |
| swipe             | A downward swipe requested dismissal.           |
| none              | No more specific Base UI reason applies.        |

Every detail object preserves reason, event, trigger, cancel,
allowPropagation, isCanceled, isPropagationAllowed, and
preventUnmountOnClose. Reasons that cannot be initiated by BottomSheet's
narrowed public API remain part of the Base-compatible read-only union.

onOpenChangeComplete receives the final boolean open state after Base UI
detects that all opening or closing CSS transitions have completed.

### Data Attributes

Root renders no element and defines no data attributes.

### CSS Variables

Root renders no element and defines no CSS variables.

## Trigger

### Props

BottomSheetTriggerProps derives from Base UI Drawer.Trigger.Props while
omitting handle and payload.

| Prop                | Type                                  | Default | Description                                                                                     |
| ------------------- | ------------------------------------- | ------- | ----------------------------------------------------------------------------------------------- |
| id                  | string                                | None    | Forwards to the rendered element. It does not enable public detached-trigger coordination.      |
| disabled            | boolean                               | false   | Disables Trigger and preserves Base UI disabled state.                                          |
| nativeButton        | boolean                               | true    | Indicates whether a render replacement is a native button.                                      |
| children            | React.ReactNode                       | None    | Trigger content.                                                                                |
| className           | Base UI Drawer.Trigger className prop | None    | Composes classes; state functions receive BottomSheetTriggerState.                              |
| style               | Base UI Drawer.Trigger style prop     | None    | Composes style; state functions receive BottomSheetTriggerState.                                |
| render              | ReactElement or render function       | button  | Replaces or composes the button while preserving Base UI behavior.                              |
| native button props | Base UI Trigger native button props   | None    | Type, name, value, form, native events, aria attributes, data attributes, and ref pass through. |

Render replacements forward the received ref and props to one semantic
interactive element. When the element is not a native button, consumers set
nativeButton to false and provide equivalent keyboard semantics.

### Events

Trigger preserves Base UI Trigger and native button events. It defines no new
Powercoach event.

### Data Attributes

| Attribute       | Description                                       |
| --------------- | ------------------------------------------------- |
| data-popup-open | Present when this Trigger opened its owning Root. |
| data-disabled   | Present when Trigger is disabled.                 |

Consumer data attributes pass through except for Base UI-owned state
attributes.

### CSS Variables

Trigger defines no public CSS variables.

## Portal

### Props

BottomSheetPortalProps derives from Base UI Drawer.Portal.Props while omitting
container. Portal always supplies the nearest Surface private host as its Base
UI container.

| Prop             | Type                                 | Default | Description                                                                                 |
| ---------------- | ------------------------------------ | ------- | ------------------------------------------------------------------------------------------- |
| keepMounted      | boolean                              | false   | Keeps the portal mounted while Popup is hidden.                                             |
| children         | React.ReactNode                      | None    | Backdrop and Viewport layers.                                                               |
| className        | Base UI Drawer.Portal className prop | None    | Composes classes with the portal element.                                                   |
| style            | Base UI Drawer.Portal style prop     | None    | Composes style with the portal element.                                                     |
| render           | ReactElement or render function      | div     | Replaces or composes the portal element.                                                    |
| native div props | Base UI Portal native div props      | None    | Native attributes, events, aria attributes, consumer data attributes, and ref pass through. |

Portal does not expose container. A Portal outside Surface is unsupported.

### Events

Portal defines no custom events. Supported native events pass through.

### Data Attributes

Portal defines no state data attributes.

### CSS Variables

Portal defines no public CSS variables.

## Backdrop

### Props

BottomSheetBackdropProps derives from Base UI Drawer.Backdrop.Props while
omitting forceRender. Base UI therefore suppresses a child Backdrop in a nested
stack.

| Prop             | Type                                   | Default | Description                                                                                 |
| ---------------- | -------------------------------------- | ------- | ------------------------------------------------------------------------------------------- |
| children         | React.ReactNode                        | None    | Optional backdrop element content.                                                          |
| className        | Base UI Drawer.Backdrop className prop | None    | Composes classes; state functions receive BottomSheetBackdropState.                         |
| style            | Base UI Drawer.Backdrop style prop     | None    | Composes style; state functions receive BottomSheetBackdropState.                           |
| render           | ReactElement or render function        | div     | Replaces or composes the backdrop element.                                                  |
| native div props | Base UI Backdrop native div props      | None    | Native attributes, events, aria attributes, consumer data attributes, and ref pass through. |

Consumer className and style may extend Backdrop presentation. Replacing its
required inset, color, opacity, pointer, or transition behavior is unsupported.

### Events

Backdrop preserves Base UI outside-press behavior and supported native events.
It defines no new custom event.

### Data Attributes

| Attribute           | Description                                  |
| ------------------- | -------------------------------------------- |
| data-open           | Present while the sheet is open.             |
| data-closed         | Present while the sheet is closed.           |
| data-starting-style | Present while the sheet is animating open.   |
| data-ending-style   | Present while the sheet is animating closed. |
| data-swiping        | Present during direct swipe tracking.        |

### CSS Variables

| Variable                | Type   | Description                                                      |
| ----------------------- | ------ | ---------------------------------------------------------------- |
| --drawer-swipe-progress | number | Current downward swipe progress used to fade Backdrop.           |
| --drawer-swipe-strength | number | Scalar from 0.1 to 1 used for swipe-release transition duration. |

## Viewport

### Props

BottomSheetViewportProps preserves Base UI Drawer.Viewport.Props.

| Prop             | Type                                   | Default | Description                                                                                 |
| ---------------- | -------------------------------------- | ------- | ------------------------------------------------------------------------------------------- |
| children         | React.ReactNode                        | None    | Popup.                                                                                      |
| className        | Base UI Drawer.Viewport className prop | None    | Composes classes; state functions receive BottomSheetViewportState.                         |
| style            | Base UI Drawer.Viewport style prop     | None    | Composes style; state functions receive BottomSheetViewportState.                           |
| render           | ReactElement or render function        | div     | Replaces or composes the positioning element.                                               |
| native div props | Base UI Viewport native div props      | None    | Native attributes, events, aria attributes, consumer data attributes, and ref pass through. |

Consumer className and style may extend Viewport presentation. Replacing its
required inset, bottom alignment, sizing, pointer, or transition behavior is
unsupported.

### Events

Viewport defines no custom events. Supported native events pass through.

### Data Attributes

| Attribute           | Description                                      |
| ------------------- | ------------------------------------------------ |
| data-open           | Present while the sheet is open.                 |
| data-closed         | Present while the sheet is closed.               |
| data-nested         | Present when Root is nested within another Root. |
| data-starting-style | Present while the sheet is animating open.       |
| data-ending-style   | Present while the sheet is animating closed.     |

### CSS Variables

Viewport publishes no software-keyboard inset or other Powercoach variable.

## Popup

### Props

BottomSheetPopupProps preserves Base UI Drawer.Popup.Props and its ref-capable
div surface.

| Prop             | Type                                   | Default | Description                                                                                                                  |
| ---------------- | -------------------------------------- | ------- | ---------------------------------------------------------------------------------------------------------------------------- |
| initialFocus     | Base UI Drawer.Popup initialFocus prop | Base UI | Selects or suppresses focus placement when Popup opens.                                                                      |
| finalFocus       | Base UI Drawer.Popup finalFocus prop   | Base UI | Selects or suppresses focus restoration when Popup closes.                                                                   |
| children         | React.ReactNode                        | None    | Content, required consumer-rendered Close, and other consumer content. The automatic handle is inserted before children.     |
| className        | Base UI Drawer.Popup className prop    | None    | Composes classes; state functions receive BottomSheetPopupState. Recognized consumer shadow conflicts have final precedence. |
| style            | Base UI Drawer.Popup style prop        | None    | Composes style after Powercoach defaults; consumers may override --hard-shadow.                                              |
| render           | ReactElement or render function        | div     | Replaces or composes the dialog surface.                                                                                     |
| native div props | Base UI Popup native div props         | None    | Focus, semantic, aria, native event, data attribute, and ref props pass through without weakening Base UI-owned props.       |

Base UI-owned role, aria-modal, hidden state, focus guards, and modal mechanics
retain final precedence. Consumers may supply aria-label, aria-labelledby, and
aria-describedby. Consumer className and style may extend presentation.
Conflicting height, width, inset, margin, padding, overflow, border, transform,
handle, or transition behavior is unsupported. A deliberate consumer shadow
utility or --hard-shadow style override is supported, takes final precedence,
and makes the resulting shadow consumer-owned.

### Events

Popup defines no Powercoach change event. Supported native events and Base UI
focus behavior pass through.

### Data Attributes

| Attribute                  | Value or description                                  |
| -------------------------- | ----------------------------------------------------- |
| data-open                  | Present while the sheet is open.                      |
| data-closed                | Present while the sheet is closed.                    |
| data-nested-drawer-open    | Present on a background Popup with open nested Roots. |
| data-nested-drawer-swiping | Present while a nested child is being swiped.         |
| data-swipe-direction       | Always down.                                          |
| data-swipe-dismiss         | Present when swipe dismissal is active.               |
| data-swiping               | Present during direct swipe tracking.                 |
| data-starting-style        | Present while Popup is animating open.                |
| data-ending-style          | Present while Popup is animating closed.              |

BottomSheet does not advertise data-expanded because snap-point expansion is
not part of its public state.

### CSS Variables

| Variable                  | Type   | Description                                                             |
| ------------------------- | ------ | ----------------------------------------------------------------------- |
| --drawer-swipe-progress   | number | Current downward swipe progress.                                        |
| --drawer-swipe-movement-y | CSS    | Current downward swipe translation.                                     |
| --drawer-swipe-strength   | number | Scalar from 0.1 to 1 used for swipe-release duration.                   |
| --nested-drawers          | number | Number of currently open descendant Roots; frontmost index is zero.     |
| --drawer-height           | CSS    | Measured Popup box height, including the private bleed.                 |
| --drawer-frontmost-height | CSS    | Measured box height of the frontmost Popup in the current nested stack. |
| --hard-shadow             | shadow | Public Input-owned hard shadow consumed by every Popup.                 |

BottomSheet does not publish --drawer-swipe-movement-x,
--drawer-snap-point-offset, --drawer-keyboard-inset, or any Powercoach
customization variable for fixed geometry and motion constants.

## Content

### Props

BottomSheetContentProps preserves Base UI Drawer.Content.Props.

| Prop             | Type                                  | Default | Description                                                                                 |
| ---------------- | ------------------------------------- | ------- | ------------------------------------------------------------------------------------------- |
| children         | React.ReactNode                       | None    | Selectable sheet content.                                                                   |
| className        | Base UI Drawer.Content className prop | None    | Composes classes; state functions receive BottomSheetContentState.                          |
| style            | Base UI Drawer.Content style prop     | None    | Composes style; state functions receive BottomSheetContentState.                            |
| render           | ReactElement or render function       | div     | Replaces or composes Base UI Drawer.Content without removing its behavior.                  |
| native div props | Base UI Content native div props      | None    | Native attributes, events, aria attributes, consumer data attributes, and ref pass through. |

Content is centered and constrained to the documented maximum width. Consumer
width, margin, opacity, and nested-visibility overrides that conflict with the
fixed treatment are unsupported.

### Events

Content preserves mouse text selection without swipe interference. Supported
native events pass through. Descendants may expose data-base-ui-swipe-ignore to
ignore swipe dismissal for mouse, touch, pen, and other supported input types.

### Data Attributes

Content defines no public state data attributes.

### CSS Variables

Content defines no public CSS variables.

## Title

### Props

BottomSheetTitleProps preserves Base UI Drawer.Title.Props. Without render,
Title renders an h2 heading.

| Prop                 | Type                                | Default | Description                                                                                 |
| -------------------- | ----------------------------------- | ------- | ------------------------------------------------------------------------------------------- |
| children             | React.ReactNode                     | None    | Accessible sheet title.                                                                     |
| className            | Base UI Drawer.Title className prop | None    | Composes classes; state functions receive BottomSheetTitleState.                            |
| style                | Base UI Drawer.Title style prop     | None    | Composes style; state functions receive BottomSheetTitleState.                              |
| render               | ReactElement or render function     | h2      | Replaces or composes the heading while preserving its labeling relationship.                |
| native heading props | Base UI Title native heading props  | None    | Native attributes, events, aria attributes, consumer data attributes, and ref pass through. |

### Events

Title defines no custom events. Supported native events pass through.

### Data Attributes

Title defines no public state data attributes.

### CSS Variables

Title defines no public CSS variables.

## Description

### Props

BottomSheetDescriptionProps preserves Base UI Drawer.Description.Props. Without
render, Description renders a paragraph.

| Prop                   | Type                                       | Default | Description                                                                                 |
| ---------------------- | ------------------------------------------ | ------- | ------------------------------------------------------------------------------------------- |
| children               | React.ReactNode                            | None    | Accessible sheet description.                                                               |
| className              | Base UI Drawer.Description className prop  | None    | Composes classes; state functions receive BottomSheetDescriptionState.                      |
| style                  | Base UI Drawer.Description style prop      | None    | Composes style; state functions receive BottomSheetDescriptionState.                        |
| render                 | ReactElement or render function            | p       | Replaces or composes the paragraph while preserving its description relationship.           |
| native paragraph props | Base UI Description native paragraph props | None    | Native attributes, events, aria attributes, consumer data attributes, and ref pass through. |

### Events

Description defines no custom events. Supported native events pass through.

### Data Attributes

Description defines no public state data attributes.

### CSS Variables

Description defines no public CSS variables.

## Close

### Props

BottomSheetCloseProps preserves Base UI Drawer.Close.Props without narrowing.

| Prop                | Type                                | Default | Description                                                                                     |
| ------------------- | ----------------------------------- | ------- | ----------------------------------------------------------------------------------------------- |
| disabled            | boolean                             | false   | Disables Close and preserves Base UI disabled state.                                            |
| nativeButton        | boolean                             | true    | Indicates whether a render replacement is a native button.                                      |
| children            | React.ReactNode                     | None    | Close content. Icon-only content requires an accessible name.                                   |
| className           | Base UI Drawer.Close className prop | None    | Composes classes; state functions receive BottomSheetCloseState.                                |
| style               | Base UI Drawer.Close style prop     | None    | Composes style; state functions receive BottomSheetCloseState.                                  |
| render              | ReactElement or render function     | button  | Replaces or composes the button while preserving Base UI behavior.                              |
| native button props | Base UI Close native button props   | None    | Type, name, value, form, native events, aria attributes, data attributes, and ref pass through. |

BottomSheet renders no default Close. The consumer places at least one Close
anywhere inside every Popup. Render replacements forward the received ref and
props to one semantic interactive element.

### Events

Pressing Close requests open false with the close-press reason. Close preserves
Base UI and native button events.

### Data Attributes

| Attribute     | Description                     |
| ------------- | ------------------------------- |
| data-disabled | Present when Close is disabled. |

### CSS Variables

Close defines no public CSS variables.

## Accessibility

BottomSheet preserves Base UI Drawer modal dialog semantics. Popup receives the
Base UI-owned dialog role and modal relationships. Powercoach styling and
render composition must not weaken role, aria-modal, labeling, description,
hidden-state, or focus-guard behavior.

Every Popup requires an accessible name. Consumers render BottomSheet.Title or
supply aria-label or aria-labelledby to Popup. BottomSheet.Description supplies
the accessible description; consumers may instead use aria-describedby when
the description comes from another element.

Every Popup also requires at least one enabled, consumer-rendered
BottomSheet.Close inside Popup. BottomSheet inserts no button and imposes no
position. This required escape action keeps the modal dismissible for touch
screen-reader users. An icon-only Close requires an accessible name.

When Popup opens through keyboard, mouse, or pen interaction, Base UI moves
focus to the first tabbable element or Popup by default. When touch opens Popup,
Base UI focuses Popup by default so opening does not automatically invoke the
software keyboard. initialFocus may select an element, use the default, or
suppress focus movement through the exact Base UI contract.

When Popup closes, focus returns to the active Trigger or the previously
focused element by default. finalFocus may select, preserve, or suppress that
restoration through the exact Base UI contract.

While open, modal true traps focus inside Popup, disables outside pointer
interaction, and locks scrolling for the entire document. Portal containment
inside Surface changes geometry, not the scope of modality or scroll locking.

Users may dismiss the active Popup through Close, Escape, an outside press when
disablePointerDismissal is false, a supported platform close watcher, or a
downward swipe. onOpenChange event details identify and may cancel each request.
A swipe gesture is never the only escape mechanism because Close is mandatory.

Nested Popups remain independently focus-managed by Base UI. Only the
frontmost Popup is active. Child Backdrops are suppressed, while the original
Backdrop continues to represent the modal stack.

The automatic handle is visual only. It is aria-hidden, has no role or tabIndex,
is pointer-inert, cannot label Popup, and does not imply that swipe is the only
dismissal route.

Reduced motion removes transition duration while preserving the same modal,
focus, layout, stacking, and dismissal states.

## Behavior

### Surface Coordination

Surface privately renders one Base UI Drawer.Provider and one full-size,
positioned, overflow-clipped portal host. Drawer.IndentBackground and the
rendered Drawer.Indent content surface live within that private coordination
boundary. Surface children render inside Drawer.Indent, while each descendant
BottomSheet.Portal reads Surface context and uses the private host as its Base
UI portal container.

Any descendant Root activates Surface data-active and the common indentation.
Multiple sibling Roots may share one Surface, but simultaneous top-level
sibling modals are unsupported. Modal outside-interaction blocking naturally
prevents an inactive sibling Trigger from being pressed while another Root is
open. Programmatically opening two top-level siblings is non-conforming.

A valid child stack nests each child Root within its parent Root's React tree.
Two sibling Roots do not form a nested stack even when they share Surface.
Nested Surface instances are unsupported.

Surface needs a definite available height from its layout context. Popup height
cannot resolve correctly when Surface has indefinite height.

### Geometry and Presentation

Powercoach square geometry applies to Surface, Popup, and the automatic handle.
BottomSheet never introduces radius, including while Surface is indented or
Popups are nested.

The private top gap is:

```css
calc(2.2rem + env(safe-area-inset-top, 0px))
```

Popup is bottom anchored and its visible height is exactly Surface height minus
that gap. Every Popup uses this fixed page-surface height regardless of content
length or nested depth. Variable-height sheets are unsupported.

The private Base UI bleed is 3rem. Popup's measured box height includes the
visible height plus the bleed, and a matching negative bottom margin keeps the
bleed below Surface. The bleed makes downward entry and dismissal continuous
without exposing the bottom edge.

Popup uses border-box, full Surface width, background, foreground text,
overflow-y-auto, overscroll-contain, and touch-action auto. It has 1rem top
padding, 1.5rem inline padding, and 1.5rem bottom content padding. Bottom
padding additionally includes env(safe-area-inset-bottom, 0px) and the private
bleed.

The active full-width Popup exposes a 1px top border using border. The nested
Base UI box treatment keeps its inline borders outside the active full-width
bounds and exposes foreground inline borders when a background Popup scales
inward. The bottom border remains below the private bleed.

Content is centered, full width, and has a 32rem maximum width. Content owns no
separate scrolling surface; Popup scrolls the page.

The automatic handle renders before Popup children. It is 3rem wide, 0.25rem
high, centered, foreground colored, square, and separated from following
content by 1rem. It is not a public part and accepts no consumer content,
classes, style, ref, render override, or state.

IndentBackground reproduces the Base UI Indent example: black in light mode and
neutral-300 in dark mode. Surface's indented content treatment uses the Base UI
example's background fill and foreground text, but adds no border at rest,
while opening, while open, during a swipe, or while closing. Consumers may add
and own a Surface border through className or style.

Backdrop is black. Its fully open resting opacity is 0.2 in light mode and 0.7
in dark mode. Swipe progress and transition state adjust that opacity as
defined in Motion.

Every Popup applies shadow-(--hard-shadow). Input owns the public --hard-shadow
contract, whose default resolves to positive 0.25rem x and y offsets, zero blur,
zero spread, and foreground color. Scaling a background Popup exposes the
already-present shadow around its inset bounds. Because the same default shadow
remains applied at every nested depth, opening, swiping, or closing a nested Root
does not add, remove, or animate the shadow. This does not add field-emphasis
focus translation, focus activation, border mutation, rail behavior, class
names, or private Input dependencies.

Powercoach shadow defaults are merged before the explicit consumer className,
and consumer style is merged last. A matching shadow-none, another recognized
shadow utility, or a consumer --hard-shadow value replaces the default. The
consumer then owns the resulting shadow while all non-conflicting BottomSheet
behavior remains.

### Content and Dismissal

Content composes Base UI Drawer.Content rather than recreating it. Mouse users
may select text inside Content without starting a swipe. A descendant with
data-base-ui-swipe-ignore opts out of swipe dismissal for every supported input
type. Consumers use the escape hatch for controls such as sliders, maps,
canvases, and other horizontal or vertical drag surfaces.

disablePointerDismissal prevents outside presses from closing Popup. It does
not disable Trigger, Close, Escape, platform close watcher, or downward swipe.
Consumers inspect or cancel requests through onOpenChange details instead of
recreating dismissal logic.

### Nested Stack

Nested stacking uses Base UI measurement and state rather than public
BottomSheet nesting props. --nested-drawers reports the number of open
descendant Roots, and the frontmost Popup has index zero. Every Popup retains
the same fixed page-surface height, so --drawer-height and
--drawer-frontmost-height remain equal apart from lifecycle measurement.

The nested stack uses a 1rem peek and a 0.05 scale step per open descendant.
Background Popups scale inward and lift upward while the frontmost Popup stays
anchored to the bottom. The scale is clamped so formulas remain finite at deep
Base UI-supported nesting depths; BottomSheet exposes no maximum-depth prop.

When a child is fully open, its background parent:

- exposes data-nested-drawer-open;
- uses the child-aligned fixed stack height and hides overflow;
- hides its Content and automatic handle;
- applies a black-at-5-percent pointer-inert dim overlay;
- retains the same visible Input-owned public hard shadow; and
- remains non-interactive behind the frontmost modal Popup.

During a downward child swipe, the parent exposes
data-nested-drawer-swiping, continuously returns toward scale 1 and zero lift,
and restores Content and handle visibility. Releasing a canceled swipe returns
the parent to its fully nested state. Completing dismissal restores the parent
as the active full-width Popup without changing its shadow.

Base UI suppresses Backdrop rendering for nested children. BottomSheet omits
forceRender so consumers cannot defeat this invariant.

## Motion

BottomSheet uses the CSS animation engine. It does not use Motion and does not
compose a named reusable animation family.

### Surface Indentation

Let p be --drawer-swipe-progress, where zero represents fully open and one
represents fully dismissed during a downward swipe.

At rest with no open Root, Surface uses scale 1 and translateY 0. With a Root
fully open, Surface remains at scale 1 and translates upward by 2rem. During
downward swipe reversal, Surface uses:

```css
scale(1)
translateY(calc(-2rem * (1 - var(--drawer-swipe-progress))))
```

Surface transform uses a 400ms transition with
cubic-bezier(0.32, 0.72, 0, 1). Direct swipe tracking has zero duration. A
canceled swipe restores the fully indented state through the same transition.
Surface never transitions radius.

### Popup and Backdrop

Popup rests at translateY(--drawer-swipe-movement-y). Its starting and ending
styles place it below the visible Surface by translating it to
calc(100% - 3rem + 2px), where 3rem is the private bleed.

Popup transform and Backdrop opacity use 450ms transitions with
cubic-bezier(0.32, 0.72, 0, 1). During data-swiping, transition duration is
zero so visual movement follows the gesture directly. For a completed swipe
dismissal, Popup and Backdrop ending duration is:

```css
calc(var(--drawer-swipe-strength) * 400ms)
```

Backdrop resting opacity is its theme value multiplied by
1 - --drawer-swipe-progress. data-starting-style and data-ending-style set
opacity to zero.

CSS transitions reverse from their current computed values when open and close
requests interrupt each other. Base UI keeps transitioning parts mounted until
detected transitions finish, then onOpenChangeComplete reports the final open
state.

### Nested Motion

For nested motion, let n be --nested-drawers, p be the active child swipe
progress clamped between zero and one, peek be 1rem, step be 0.05, and bleed be
3rem. The background Popup uses:

```text
peek offset = max(0px, (n - p) * peek)
base scale = max(0, 1 - n * step)
live scale = clamp(0, base scale + step * p, 1)
shrink = 1 - live scale
stack height = max(0px, var(--drawer-frontmost-height, var(--drawer-height)) - bleed)
translate y = --drawer-swipe-movement-y - peek offset - shrink * stack height
```

The transform combines translate y and live scale from an origin centered at
the bottom edge above the bleed. Parent transform, fixed stack height, opacity,
and dim overlay use 450ms transitions with cubic-bezier(0.32, 0.72, 0, 1).
Their duration is zero while data-nested-drawer-swiping is present.

Parent Content opacity uses 300ms with
cubic-bezier(0.45, 1.005, 0, 1.005). The automatic handle opacity uses 200ms.
Both become invisible while data-nested-drawer-open is present and return
during data-nested-drawer-swiping so dismissal reveals the parent continuously.

### Reduced Motion

When reduced motion is requested, every Surface, Popup, Backdrop, nested-stack,
dim-overlay, Content, and handle transition duration becomes zero. Direct swipe
tracking remains coupled to gesture progress, and the same fully open, swiping,
nested, canceled, dismissed, and restored states remain visible without timed
interpolation.

## Use Cases

### UC-001 - Coordinate one bounded Surface

Given one BottomSheet.Surface contains one or more descendant Roots and Portals
When any conforming Root opens
Then Surface activates its private Base UI provider, indentation background,
indentation surface, and portal host for that Root without exposing those parts

### UC-002 - Support controlled and uncontrolled open state

Given a consumer uses defaultOpen or uses open with onOpenChange
When Trigger, Close, Escape, outside press, platform close watcher, or swipe
requests a state change
Then Root preserves Base UI controlled or uncontrolled behavior and reports the
complete event details

### UC-003 - Preserve the narrowed composable API

Given a consumer uses public BottomSheet parts, direct exports, types, native
props, refs, or render composition
When the component renders
Then every approved Base UI-compatible contract is preserved while snap,
directional, modal, detached-trigger, imperative, payload, portal-container,
and force-rendered nested-backdrop APIs remain unavailable

### UC-004 - Render the fixed page-surface geometry

Given Surface has a definite available height
When Popup opens with short or overflowing content
Then Popup fills the Surface width, leaves exactly 2.2rem plus the top safe-area
inset, retains its fixed page height, scrolls internally, and respects the
bottom safe-area inset

### UC-005 - Render the Powercoach visual treatment

Given BottomSheet is displayed in light or dark mode
When Surface, Backdrop, Popup, Content, and the automatic handle are visible
Then they use the documented Base UI reference treatment, semantic token
exceptions, square geometry, spacing, maximum width, Popup borders, and opacity,
while Surface has no component-owned border in any state

### UC-006 - Keep every modal Popup accessible and escapable

Given a consumer renders Popup with Title or an explicit accessible label and a
consumer-positioned Close
When the modal opens, receives focus, or is dismissed
Then Base UI preserves labeling, optional description, focus trapping,
document scroll lock, outside interaction blocking, touch focus behavior,
focus restoration, and a reliable non-gesture escape action

### UC-007 - Distinguish and control dismissal requests

Given Root receives an open-state request
When the request comes from Trigger, Close, Escape, outside press, platform
close watcher, or downward swipe
Then onOpenChange identifies the Base UI reason and exposes cancellation, while
disablePointerDismissal affects only outside pointer dismissal

### UC-008 - Preserve composition and swipe-ignore behavior

Given a consumer replaces a rendered element, selects text in Content, or marks
a drag-sensitive descendant with data-base-ui-swipe-ignore
When refs, props, focus, selection, or pointer gestures are used
Then public render composition remains semantic, Content preserves Base UI
selection behavior, and the marked descendant does not initiate swipe dismissal

### UC-009 - Open, reverse, and dismiss with CSS motion

Given Popup is opening, open, swiping, canceling a swipe, or closing
When its state or gesture progress changes
Then Surface indentation, Popup translation, and Backdrop opacity use the
documented CSS constants, reverse from current computed values, and complete
before onOpenChangeComplete fires

### UC-010 - Preserve final states under reduced motion

Given the user requests reduced motion
When BottomSheet opens, closes, swipes, or changes nested depth
Then all timed transition durations are zero while direct tracking and the same
final modal, indentation, Popup, Backdrop, Content, handle, and stack states are
preserved

### UC-011 - Share Surface without simultaneous sibling modals

Given several top-level sibling Roots share one Surface
When the user opens either Root
Then it uses the common indentation and portal host while the other sibling
remains inactive and no two top-level sibling modals open simultaneously

### UC-012 - Stack nested page surfaces

Given a child Root is a React descendant of its parent Root
When the child opens or swipes down
Then the fixed-height Popups use Base UI nested depth and measurement to scale,
lift, hide, reveal, dim, and restore background pages with the documented peek,
scale, and timing constants

### UC-013 - Apply the same hard shadow to every sheet

Given one Popup is active alone or several Popups form a nested stack
When a Popup opens, moves between frontmost and background depth, or closes
Then every Popup retains the Input-owned public hard shadow without a nested
state shadow transition unless a consumer deliberately overrides that shadow
treatment

### UC-014 - Preserve public state styling hooks

Given a consumer inspects Surface, Trigger, Close, Backdrop, Viewport, or Popup
while BottomSheet changes state
When Base UI open, closed, transition, swipe, direction, dismissal, disabled,
or nested state applies
Then the documented data attributes and downward, strength, height, and nesting
CSS variables remain available without snap-point or horizontal configuration
