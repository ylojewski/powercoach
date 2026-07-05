---
revision: 9
date: 2026-08-20
---

# AvatarMenu

## Overview

AvatarMenu renders a Powercoach navigation rail whose triggers are md Avatars
and whose shared popup contains a leading full-name group label followed by Icon
plus Text links for the currently open avatar. The rail is vertical by default
and also supports horizontal orientation.

AvatarMenu wraps Base UI Navigation Menu 1.6. Base UI owns navigation-menu
semantics, controlled and uncontrolled value, trigger and link interaction,
focus movement, event reasons and cancellation, portal lifecycle, active
content movement into Viewport, positioning, collision handling, and transition
completion.

Powercoach defaults orientation to vertical, supports horizontal orientation,
fixes immediate opening, composes Avatar.Root directly onto each native Trigger
button, consumes PopupSurface at md size, changes Link closeOnClick to true by
default, and adapts the first Base UI Navigation Menu example's shared-popup
placement, translation, and movement to the active orientation axis.

AvatarMenu uses one Portal, Positioner, Popup, and Viewport for the whole rail.
Changing the open Avatar retargets that shared popup and swaps the active
Content. It does not create one portal per Avatar.

AvatarMenu uses the CSS animation engine. Popup opening and closing come from
PopupSurface. Trigger and Popup orientation-dependent translation, Positioner
movement, Popup size interpolation, and Content transition use CSS transitions.

AvatarMenu owns only the effective reveal targets it supplies through the
public Avatar and PopupSurface APIs. Avatar owns each Trigger's RevealAnimation
composition, and PopupSurface owns each Link's RevealAnimation composition.
Those descendants follow the complete current RevealAnimation motion,
lifecycle, accessibility, data-attribute, and CSS-variable contract.
AvatarMenu does not define RevealAnimation clip-path geometry or expose an
AvatarMenu-specific reveal override.

## Anatomy

AvatarMenu is a non-callable namespace with twelve public parts.

- AvatarMenu.Root: owns the open Item value, defaults Navigation Menu to
  vertical orientation, supports horizontal orientation, and fixes zero opening
  delay.
- AvatarMenu.List: groups the orientation-aware Item rail and owns composite
  focus navigation.
- AvatarMenu.Item: associates one Trigger and Content under a unique value.
- AvatarMenu.Trigger: renders one native button whose public content is composed
  through Avatar.Root at md size.
- AvatarMenu.Portal: portals the one shared popup layer.
- AvatarMenu.Positioner: follows the open Trigger at zero-gap inline-end
  placement vertically or bottom placement horizontally, always with start
  alignment.
- AvatarMenu.Popup: renders the shared PopupSurface Root at md size.
- AvatarMenu.Viewport: clips the active and outgoing Content.
- AvatarMenu.Content: contains one Group associated with one Avatar.
- AvatarMenu.Group: associates one leading full-name GroupLabel with the
  following Links, consumes PopupSurface Group presentation, and renders those
  children inside configurable Stripes by default.
- AvatarMenu.GroupLabel: renders the current Avatar's noninteractive full name
  with AvatarMenu Heading and row presentation through PopupSurface GroupLabel
  composition.
- AvatarMenu.Link: renders one Base UI navigation link through the shared
  PopupSurface md Icon plus Text row.

AvatarMenu does not expose Arrow, Icon, or Backdrop. Viewport is the required
child of Popup. Content remains inside its Item and is moved into the shared
Viewport by Base UI while active.

```tsx
<AvatarMenu.Root>
  <AvatarMenu.List className="grid gap-2">
    <AvatarMenu.Item value="yann">
      <AvatarMenu.Trigger aria-label="Open Yann navigation">
        <Avatar.Image src="/athletes/yann.jpg" alt="" />
        <Avatar.Fallback>YA</Avatar.Fallback>
      </AvatarMenu.Trigger>
      <AvatarMenu.Content>
        <AvatarMenu.Group>
          <AvatarMenu.GroupLabel>Yann Lojewski</AvatarMenu.GroupLabel>
          <AvatarMenu.Link icon={<Home />} href="home">
            Home
          </AvatarMenu.Link>
        </AvatarMenu.Group>
      </AvatarMenu.Content>
    </AvatarMenu.Item>
  </AvatarMenu.List>

  <AvatarMenu.Portal>
    <AvatarMenu.Positioner>
      <AvatarMenu.Popup>
        <AvatarMenu.Viewport />
      </AvatarMenu.Popup>
    </AvatarMenu.Positioner>
  </AvatarMenu.Portal>
</AvatarMenu.Root>
```

### Public Exports

| Export                           | Description                                          |
| -------------------------------- | ---------------------------------------------------- |
| AvatarMenu                       | Non-callable namespace containing every public part. |
| AvatarMenuNamespace              | Type of the namespace object.                        |
| AvatarMenuRoot                   | Direct Root component export.                        |
| AvatarMenuList                   | Direct List component export.                        |
| AvatarMenuItem                   | Direct Item component export.                        |
| AvatarMenuTrigger                | Direct Trigger component export.                     |
| AvatarMenuPortal                 | Direct Portal component export.                      |
| AvatarMenuPositioner             | Direct Positioner component export.                  |
| AvatarMenuPopup                  | Direct Popup component export.                       |
| AvatarMenuViewport               | Direct Viewport component export.                    |
| AvatarMenuContent                | Direct Content component export.                     |
| AvatarMenuGroup                  | Direct Group component export.                       |
| AvatarMenuGroupStripesProps      | Supported props for Group's nested Stripes element.  |
| AvatarMenuGroupLabel             | Direct GroupLabel component export.                  |
| AvatarMenuLink                   | Direct Link component export.                        |
| AvatarMenuRootValue              | Base UI Navigation Menu nullable value type.         |
| AvatarMenuRootActions            | Base UI imperative Root actions type.                |
| AvatarMenuRootChangeEventReason  | Base UI Root change reason union.                    |
| AvatarMenuRootChangeEventDetails | Base UI cancellable Root change details.             |

The package also exports AvatarMenuRootProps and the complete prefixed Props
and State aliases for List, Item, Trigger, Portal, Positioner, Popup, Viewport,
Content, Group, GroupLabel, and Link.

## Examples

### EX-001 - Default Avatar navigation

Context: A vertical athlete rail needs immediate Avatar flyouts with relative
navigation links.

Expected behavior: Root starts closed. Hovering or pressing Yann, Amina, or Leo
opens the one shared Popup immediately at logical inline-end and aligns its top
with the Avatar. Each Trigger is one native named button containing Avatar at
md size with its default border and permanent 3px hard shadow. The open Avatar
and Popup translate 10px toward logical inline-end. Popup width follows the
longest active GroupLabel or Link. Each Content begins with one noninteractive
full-name GroupLabel: Yann Lojewski, Amina Diallo, or Leo Martin. Each Group's
GroupLabel and Links render inside one nested Stripes div using the public
Stripes defaults. All three Avatars then expose the same Home, Programs,
Reviews, and Settings links. Every GroupLabel uses AvatarMenu-owned Heading md,
centered baseline, ps-8, pe-2.5, and a 34px minimum inner height. Every Link
uses the same 34px minimum, ps-8, and pe-2.5 while retaining PopupSurface md
Text, Icon, gap, padding, and reveal behavior. The default one-pixel top and
bottom Popup borders would make one ordinary Link row total the same 36px
border-box height as the md Avatar; hard shadows remain external. Each Link
closes the popup when clicked. Every Trigger Avatar and Link retains one
descendant RevealAnimation inspection structure through its owning Avatar or
PopupSurface public composition.

Covers: UC-019, UC-001, UC-002, UC-004, UC-005, UC-006, UC-007, UC-008,
UC-009, UC-010, UC-016, UC-017

```tsx
import { Dumbbell, Home, Settings, Star } from 'lucide-react'
import { Avatar, AvatarMenu } from '@powercoach/ui'

const athletes = [
  {
    id: 'yann',
    name: 'Yann',
    fullName: 'Yann Lojewski',
    initials: 'YA',
    image: '/athletes/yann.jpg'
  },
  { id: 'amina', name: 'Amina', fullName: 'Amina Diallo', initials: 'AM', image: undefined },
  { id: 'leo', name: 'Leo', fullName: 'Leo Martin', initials: 'LE', image: undefined }
] as const

const athleteLinks = [
  { label: 'Home', href: 'home', Icon: Home },
  { label: 'Programs', href: 'programs', Icon: Dumbbell },
  { label: 'Reviews', href: 'reviews', Icon: Star },
  { label: 'Settings', href: 'settings', Icon: Settings }
] as const

export function AthleteAvatarMenu() {
  return (
    <AvatarMenu.Root>
      <AvatarMenu.List className="grid gap-2">
        {athletes.map((athlete) => (
          <AvatarMenu.Item key={athlete.id} value={athlete.id}>
            <AvatarMenu.Trigger aria-label={`Open ${athlete.name} navigation`}>
              {athlete.image && <Avatar.Image src={athlete.image} alt="" />}
              <Avatar.Fallback>{athlete.initials}</Avatar.Fallback>
            </AvatarMenu.Trigger>
            <AvatarMenu.Content>
              <AvatarMenu.Group>
                <AvatarMenu.GroupLabel>{athlete.fullName}</AvatarMenu.GroupLabel>
                {athleteLinks.map(({ label, href, Icon }) => (
                  <AvatarMenu.Link key={href} icon={<Icon />} href={href}>
                    {label}
                  </AvatarMenu.Link>
                ))}
              </AvatarMenu.Group>
            </AvatarMenu.Content>
          </AvatarMenu.Item>
        ))}
      </AvatarMenu.List>

      <AvatarMenu.Portal>
        <AvatarMenu.Positioner>
          <AvatarMenu.Popup>
            <AvatarMenu.Viewport />
          </AvatarMenu.Popup>
        </AvatarMenu.Positioner>
      </AvatarMenu.Portal>
    </AvatarMenu.Root>
  )
}
```

### EX-002 - Controlled open Avatar and active routes

Context: A consumer needs to control the open flyout independently from the
current athlete and route.

Expected behavior: value controls the open Trigger while active marks the
current athlete independently. The current athlete Avatar remains revealed and
translated 10px toward logical inline-end even when another Avatar is open. The
open Avatar also remains revealed and translated while the pointer crosses into
Popup, so the active and open Avatars may both occupy the translated endpoint.
Closing from active Amina, reopening Amina from closed, and closing again keeps
Popup at that 10px endpoint throughout each opening and closing lifecycle, so
Popup never translates across or overlaps the already-translated Avatar. Moving
from active Amina to non-active Yann and back to active Amina retains the
existing Trigger, Popup, Positioner, and Content movement. active on Programs
keeps that Link revealed. The external open buttons change controlled value,
derive Content direction from the rendered Item order, and animate outgoing and
incoming Content exactly as Trigger interaction does. The output reports Base
UI reason and value, and completion reports the final open or closed phase.
AvatarMenu state remains independent from the complete descendant
RevealAnimation inspection contract owned by Avatar and PopupSurface.

Covers: UC-002, UC-005, UC-008, UC-009, UC-012, UC-016

```tsx
'use client'

import * as React from 'react'
import { Dumbbell, Home } from 'lucide-react'
import { Avatar, AvatarMenu, Button } from '@powercoach/ui'

const athletes = [
  { id: 'amina', name: 'Amina', fullName: 'Amina Diallo', initials: 'AM' },
  { id: 'yann', name: 'Yann', fullName: 'Yann Lojewski', initials: 'YA' }
]

export function ControlledAvatarMenu() {
  const [value, setValue] = React.useState<string | null>('amina')
  const [reason, setReason] = React.useState('none')
  const [phase, setPhase] = React.useState('open')

  return (
    <div className="grid gap-4">
      <div className="flex gap-2">
        <Button type="button" onClick={() => setValue('amina')}>
          open Amina
        </Button>
        <Button type="button" onClick={() => setValue('yann')}>
          open Yann
        </Button>
        <Button type="button" onClick={() => setValue(null)}>
          close
        </Button>
      </div>

      <AvatarMenu.Root
        value={value}
        onValueChange={(nextValue, details) => {
          setReason(details.reason)
          setValue(nextValue)
        }}
        onOpenChangeComplete={(open) => setPhase(open ? 'open' : 'closed')}
      >
        <AvatarMenu.List className="grid gap-2">
          {athletes.map((athlete) => (
            <AvatarMenu.Item key={athlete.id} value={athlete.id}>
              <AvatarMenu.Trigger
                active={athlete.id === 'amina'}
                aria-label={`Open ${athlete.name} navigation`}
              >
                <Avatar.Fallback>{athlete.initials}</Avatar.Fallback>
              </AvatarMenu.Trigger>
              <AvatarMenu.Content>
                <AvatarMenu.Group>
                  <AvatarMenu.GroupLabel>{athlete.fullName}</AvatarMenu.GroupLabel>
                  <AvatarMenu.Link icon={<Home />} href={`${athlete.id}/home`}>
                    Home for {athlete.name}
                  </AvatarMenu.Link>
                  <AvatarMenu.Link active icon={<Dumbbell />} href={`${athlete.id}/programs`}>
                    Programs for {athlete.name}
                  </AvatarMenu.Link>
                </AvatarMenu.Group>
              </AvatarMenu.Content>
            </AvatarMenu.Item>
          ))}
        </AvatarMenu.List>
        <AvatarMenu.Portal>
          <AvatarMenu.Positioner>
            <AvatarMenu.Popup>
              <AvatarMenu.Viewport />
            </AvatarMenu.Popup>
          </AvatarMenu.Positioner>
        </AvatarMenu.Portal>
      </AvatarMenu.Root>

      <output>
        value: {value ?? 'closed'}; reason: {reason}; phase: {phase}
      </output>
    </div>
  )
}
```

### EX-003 - Uncontrolled default and configurable close delay

Context: A consumer needs an initially open uncontrolled Avatar and more time
to cross from Trigger into Popup.

Expected behavior: defaultValue opens Amina without controlled state. delay is
not public and opening remains immediate. closeDelay uses the explicit 120ms
value instead of its default 50ms. Selecting Reviews closes because Link
defaults closeOnClick to true; Help keeps the popup open through its explicit
false override.

Covers: UC-002, UC-009, UC-016

```tsx
import { CircleHelp, Star } from 'lucide-react'
import { Avatar, AvatarMenu } from '@powercoach/ui'

export function UncontrolledAvatarMenu() {
  return (
    <AvatarMenu.Root defaultValue="amina" closeDelay={120}>
      <AvatarMenu.List className="grid gap-2">
        <AvatarMenu.Item value="amina">
          <AvatarMenu.Trigger aria-label="Open Amina navigation">
            <Avatar.Fallback>AM</Avatar.Fallback>
          </AvatarMenu.Trigger>
          <AvatarMenu.Content>
            <AvatarMenu.Group>
              <AvatarMenu.GroupLabel>Amina Diallo</AvatarMenu.GroupLabel>
              <AvatarMenu.Link icon={<Star />} href="reviews">
                Reviews
              </AvatarMenu.Link>
              <AvatarMenu.Link closeOnClick={false} icon={<CircleHelp />} href="help">
                Help
              </AvatarMenu.Link>
            </AvatarMenu.Group>
          </AvatarMenu.Content>
        </AvatarMenu.Item>
      </AvatarMenu.List>
      <AvatarMenu.Portal>
        <AvatarMenu.Positioner>
          <AvatarMenu.Popup>
            <AvatarMenu.Viewport />
          </AvatarMenu.Popup>
        </AvatarMenu.Positioner>
      </AvatarMenu.Portal>
    </AvatarMenu.Root>
  )
}
```

### EX-004 - Router-compatible Link render

Context: An application router needs to own client navigation while AvatarMenu
retains Base UI Link behavior and shared presentation.

Expected behavior: RouterLink receives the Base UI link props and forwarded ref
on its sole anchor. The real router link navigates and closes by default. The
RevealAnimation copy contains only the semantic-free Icon plus Text visual
surface and cannot navigate, activate, focus, or create a second link. The
PopupSurface composition preserves the complete current RevealAnimation
inspection surface without making its motion geometry an AvatarMenu contract.

Covers: UC-009, UC-010, UC-017

```tsx
import * as React from 'react'
import { Dumbbell } from 'lucide-react'
import { Avatar, AvatarMenu } from '@powercoach/ui'

const RouterLink = React.forwardRef<
  HTMLAnchorElement,
  React.ComponentPropsWithoutRef<'a'> & { to: string }
>(function RouterLink({ to, ...props }, ref) {
  return <a ref={ref} href={to} {...props} />
})

export function RouterAvatarMenu() {
  return (
    <AvatarMenu.Root defaultValue="yann">
      <AvatarMenu.List className="grid gap-2">
        <AvatarMenu.Item value="yann">
          <AvatarMenu.Trigger aria-label="Open Yann navigation">
            <Avatar.Fallback>YA</Avatar.Fallback>
          </AvatarMenu.Trigger>
          <AvatarMenu.Content>
            <AvatarMenu.Group>
              <AvatarMenu.GroupLabel>Yann Lojewski</AvatarMenu.GroupLabel>
              <AvatarMenu.Link
                icon={<Dumbbell />}
                href="programs"
                render={<RouterLink to="programs" />}
              >
                Programs
              </AvatarMenu.Link>
            </AvatarMenu.Group>
          </AvatarMenu.Content>
        </AvatarMenu.Item>
      </AvatarMenu.List>
      <AvatarMenu.Portal>
        <AvatarMenu.Positioner>
          <AvatarMenu.Popup>
            <AvatarMenu.Viewport />
          </AvatarMenu.Popup>
        </AvatarMenu.Positioner>
      </AvatarMenu.Portal>
    </AvatarMenu.Root>
  )
}
```

### EX-005 - Dynamic Avatar-to-Avatar movement

Context: A default vertical rail has differently positioned Avatars whose link
labels produce different popup dimensions.

Expected behavior: Moving from Amina to Yann retargets the one Positioner
vertically, interpolates Popup width and height, returns Amina to zero inline
translation, advances Yann 10px toward logical inline-end, and transitions old
and new Content in opposite vertical directions. Popup stays translated 10px
inline while its vertical movement runs. The longest active GroupLabel or Link
determines intrinsic width until available width is reached. Rapidly returning
to Amina continues every CSS transition from its current computed value without
snapping to either Avatar or prior popup size.

Covers: UC-006, UC-007, UC-008, UC-011, UC-012, UC-013

```tsx
import { CalendarDays, Dumbbell, Home, MessageSquareText } from 'lucide-react'
import { Avatar, AvatarMenu } from '@powercoach/ui'

export function MovingAvatarMenu() {
  return (
    <AvatarMenu.Root defaultValue="amina">
      <AvatarMenu.List className="grid gap-2">
        <AvatarMenu.Item value="amina">
          <AvatarMenu.Trigger aria-label="Open Amina navigation">
            <Avatar.Fallback>AM</Avatar.Fallback>
          </AvatarMenu.Trigger>
          <AvatarMenu.Content>
            <AvatarMenu.Group>
              <AvatarMenu.GroupLabel>Amina Diallo</AvatarMenu.GroupLabel>
              <AvatarMenu.Link icon={<Home />} href="home">
                Home
              </AvatarMenu.Link>
              <AvatarMenu.Link icon={<CalendarDays />} href="calendar">
                Competition calendar
              </AvatarMenu.Link>
            </AvatarMenu.Group>
          </AvatarMenu.Content>
        </AvatarMenu.Item>
        <AvatarMenu.Item value="yann">
          <AvatarMenu.Trigger aria-label="Open Yann navigation">
            <Avatar.Fallback>YA</Avatar.Fallback>
          </AvatarMenu.Trigger>
          <AvatarMenu.Content>
            <AvatarMenu.Group>
              <AvatarMenu.GroupLabel>Yann Lojewski</AvatarMenu.GroupLabel>
              <AvatarMenu.Link icon={<Dumbbell />} href="programs">
                Programs
              </AvatarMenu.Link>
              <AvatarMenu.Link icon={<MessageSquareText />} href="reviews">
                Reviews
              </AvatarMenu.Link>
            </AvatarMenu.Group>
          </AvatarMenu.Content>
        </AvatarMenu.Item>
      </AvatarMenu.List>
      <AvatarMenu.Portal>
        <AvatarMenu.Positioner>
          <AvatarMenu.Popup>
            <AvatarMenu.Viewport />
          </AvatarMenu.Popup>
        </AvatarMenu.Positioner>
      </AvatarMenu.Portal>
    </AvatarMenu.Root>
  )
}
```

### EX-006 - RTL collision, keyboard, and reduced-motion probes

Context: A default vertical right-to-left rail near a viewport edge needs
collision handling and keyboard access with the same final layout under reduced
motion.

Expected behavior: Preferred inline-end resolves logically and may flip when
the collision boundary requires it. The open Avatar and Popup translate 10px
toward logical inline-end, which is negative x in RTL, while collision geometry
uses the untranslated Trigger and reserves that translated extent. ArrowDown
and ArrowUp move focus without looping. ArrowLeft opens the focused Trigger in
RTL; Enter and Space retain native button activation. data-instant removes
coordinate, size, and spatial Content interpolation for retargeting without
canceling the separate opening or closing inline translation. Reduced motion
makes coordinate, size, scale, inline translation, and spatial Content changes
immediate, while the 175ms non-spatial Content opacity fade may remain. Trigger
Avatar and Link PopupSurface reveal descendants independently follow the
complete current RevealAnimation reduced-motion lifecycle.

Covers: UC-003, UC-006, UC-008, UC-012, UC-014, UC-015, UC-017, UC-018

```tsx
import { Home } from 'lucide-react'
import { Avatar, AvatarMenu } from '@powercoach/ui'

export function RtlAvatarMenu() {
  const athletes = [
    { id: 'amina', fullName: 'Amina Diallo' },
    { id: 'yann', fullName: 'Yann Lojewski' }
  ] as const

  return (
    <div dir="rtl" className="w-56 overflow-hidden p-8">
      <AvatarMenu.Root>
        <AvatarMenu.List className="grid gap-2">
          {athletes.map((athlete) => (
            <AvatarMenu.Item key={athlete.id} value={athlete.id}>
              <AvatarMenu.Trigger aria-label={`Open ${athlete.id} navigation`}>
                <Avatar.Fallback>{athlete.id.slice(0, 2)}</Avatar.Fallback>
              </AvatarMenu.Trigger>
              <AvatarMenu.Content>
                <AvatarMenu.Group>
                  <AvatarMenu.GroupLabel>{athlete.fullName}</AvatarMenu.GroupLabel>
                  <AvatarMenu.Link icon={<Home />} href="home">
                    Home
                  </AvatarMenu.Link>
                </AvatarMenu.Group>
              </AvatarMenu.Content>
            </AvatarMenu.Item>
          ))}
        </AvatarMenu.List>
        <AvatarMenu.Portal>
          <AvatarMenu.Positioner collisionAvoidance={{ side: 'flip', align: 'shift' }}>
            <AvatarMenu.Popup>
              <AvatarMenu.Viewport />
            </AvatarMenu.Popup>
          </AvatarMenu.Positioner>
        </AvatarMenu.Portal>
      </AvatarMenu.Root>
    </div>
  )
}
```

### EX-007 - Configure or remove Group Stripes

Context: Different Avatar groups need default, customized, or absent striped
backgrounds without changing their shared Group semantics.

Expected behavior: Omitted `stripesProps` renders the public Stripes defaults
around Amina's GroupLabel and Links. The object form renders Stripes around
Yann's GroupLabel and Links with the provided named stripe values and class,
while normal Stripes override precedence applies. `false` renders Leo's
GroupLabel and Links directly inside the outer PopupSurface Group with no
Stripes element. Every outer Group retains its labeled `group` semantics.

Covers: UC-019, UC-020

```tsx
import { Home } from 'lucide-react'
import { Avatar, AvatarMenu } from '@powercoach/ui'

const athletes = [
  { id: 'amina', fullName: 'Amina Diallo', initials: 'AM', stripesProps: undefined },
  {
    id: 'yann',
    fullName: 'Yann Lojewski',
    initials: 'YA',
    stripesProps: {
      angle: '45deg',
      gap: '6px',
      width: '2px',
      color: 'currentColor',
      className: 'text-muted-foreground'
    }
  },
  { id: 'leo', fullName: 'Leo Martin', initials: 'LE', stripesProps: false }
] as const

export function ConfigurableGroupStripesAvatarMenu() {
  return (
    <AvatarMenu.Root>
      <AvatarMenu.List className="grid gap-2">
        {athletes.map((athlete) => (
          <AvatarMenu.Item key={athlete.id} value={athlete.id}>
            <AvatarMenu.Trigger aria-label={`Open ${athlete.id} navigation`}>
              <Avatar.Fallback>{athlete.initials}</Avatar.Fallback>
            </AvatarMenu.Trigger>
            <AvatarMenu.Content>
              <AvatarMenu.Group stripesProps={athlete.stripesProps}>
                <AvatarMenu.GroupLabel>{athlete.fullName}</AvatarMenu.GroupLabel>
                <AvatarMenu.Link icon={<Home />} href="home">
                  Home
                </AvatarMenu.Link>
              </AvatarMenu.Group>
            </AvatarMenu.Content>
          </AvatarMenu.Item>
        ))}
      </AvatarMenu.List>
      <AvatarMenu.Portal>
        <AvatarMenu.Positioner>
          <AvatarMenu.Popup>
            <AvatarMenu.Viewport />
          </AvatarMenu.Popup>
        </AvatarMenu.Positioner>
      </AvatarMenu.Portal>
    </AvatarMenu.Root>
  )
}
```

### EX-008 - Horizontal orientation and axis movement

Context: A consumer needs the Avatar rail on one horizontal row and an
inspectable direction control for LTR and RTL behavior.

Expected behavior: orientation horizontal changes the owned List layout to one
non-wrapping row while vertical remains the omitted Root default. In LTR,
ArrowRight and ArrowLeft move focus to the next and previous enabled Triggers;
in RTL those focus directions reverse. ArrowDown opens the focused Trigger in
both text directions, and focus does not loop. Positioner prefers physical
bottom placement, start alignment, and zero gap. The open Avatar and Popup move
10px downward in both LTR and RTL. Dashed reference boxes remain at each
untranslated Avatar position so the downward displacement is visible, and the
example provides enough surrounding space to keep the primary bottom placement
unflipped. Moving between Amina, Yann, and Leo retargets Positioner horizontally
and reports right or left from their rendered physical positions for both
Trigger interaction and controlled changes. Content uses the matching opposite
translateX endpoints over 300ms with the existing 175ms opacity transition. The
visible output reports direction, preferred side bottom, alignment start, and
activation direction. Positioner and Popup expose the resolved result through
data-side and data-align, while Content exposes data-activation-direction and
Popup retains its public lifecycle attributes.

Covers: UC-003, UC-005, UC-006, UC-008, UC-011, UC-012, UC-013, UC-021

```tsx
'use client'

import * as React from 'react'
import { Home } from 'lucide-react'
import { Avatar, AvatarMenu } from '@powercoach/ui'

const horizontalAthletes = [
  { id: 'amina', fullName: 'Amina Diallo', initials: 'AM' },
  { id: 'yann', fullName: 'Yann Lojewski', initials: 'YA' },
  { id: 'leo', fullName: 'Leo Martin', initials: 'LE' }
] as const

type HorizontalAvatarMenuProps = {
  direction?: 'ltr' | 'rtl'
}

export function HorizontalAvatarMenu({ direction = 'ltr' }: HorizontalAvatarMenuProps) {
  const [value, setValue] = React.useState<string | null>('amina')
  const [activationDirection, setActivationDirection] = React.useState<'left' | 'right' | 'none'>(
    'none'
  )

  return (
    <div dir={direction} className="grid gap-4 p-16">
      <AvatarMenu.Root
        orientation="horizontal"
        value={value}
        onValueChange={(nextValue) => {
          if (value !== null && nextValue !== null && value !== nextValue) {
            const previousIndex = horizontalAthletes.findIndex((athlete) => athlete.id === value)
            const nextIndex = horizontalAthletes.findIndex((athlete) => athlete.id === nextValue)
            const movesForward = nextIndex > previousIndex

            setActivationDirection(
              direction === 'ltr'
                ? movesForward
                  ? 'right'
                  : 'left'
                : movesForward
                  ? 'left'
                  : 'right'
            )
          }
          setValue(nextValue)
        }}
      >
        <AvatarMenu.List className="gap-2">
          {horizontalAthletes.map((athlete) => (
            <AvatarMenu.Item
              key={athlete.id}
              value={athlete.id}
              className="relative before:pointer-events-none before:absolute before:top-0 before:left-0 before:size-9 before:border before:border-dashed before:border-muted-foreground before:content-['']"
            >
              <AvatarMenu.Trigger aria-label={`Open ${athlete.id} navigation`}>
                <Avatar.Fallback>{athlete.initials}</Avatar.Fallback>
              </AvatarMenu.Trigger>
              <AvatarMenu.Content>
                <AvatarMenu.Group>
                  <AvatarMenu.GroupLabel>{athlete.fullName}</AvatarMenu.GroupLabel>
                  <AvatarMenu.Link icon={<Home />} href={`${athlete.id}/home`}>
                    Home for {athlete.fullName}
                  </AvatarMenu.Link>
                </AvatarMenu.Group>
              </AvatarMenu.Content>
            </AvatarMenu.Item>
          ))}
        </AvatarMenu.List>
        <AvatarMenu.Portal>
          <AvatarMenu.Positioner>
            <AvatarMenu.Popup>
              <AvatarMenu.Viewport />
            </AvatarMenu.Popup>
          </AvatarMenu.Positioner>
        </AvatarMenu.Portal>
      </AvatarMenu.Root>

      <output>
        direction: {direction}; preferred side: bottom; align: start; activation direction:{' '}
        {activationDirection}
      </output>
    </div>
  )
}
```

## Root

### Props

AvatarMenuRootProps preserves NavigationMenu.Root.Props except delay. Root
resolves omitted orientation to vertical before passing it to Base UI and
always supplies delay 0.

| Prop                 | Type                                                             | Default  | Description                                                                                      |
| -------------------- | ---------------------------------------------------------------- | -------- | ------------------------------------------------------------------------------------------------ |
| defaultValue         | AvatarMenuRootValue                                              | null     | Initial uncontrolled open Item value; null starts closed.                                        |
| value                | AvatarMenuRootValue                                              | None     | Controlled open Item value; null closes the shared Popup.                                        |
| onValueChange        | Function receiving value and AvatarMenuRootChangeEventDetails    | None     | Preserves Base UI value requests, reasons, native event, cancellation, propagation, and trigger. |
| actionsRef           | React.RefObject of AvatarMenuRootActions                         | None     | Exposes Base UI imperative unmount behavior.                                                     |
| onOpenChangeComplete | Function receiving final open boolean                            | None     | Runs after Base UI detects the active Popup transition.                                          |
| orientation          | "horizontal" \| "vertical"                                       | vertical | Sets List layout, composite focus, opening arrow, placement, translation, and Content movement.  |
| closeDelay           | number                                                           | 50       | Wait before closing after pointer leaves according to Base UI.                                   |
| className            | String or function receiving AvatarMenuRootState                 | None     | Composes consumer classes on the Root nav.                                                       |
| style                | Object or function receiving AvatarMenuRootState                 | None     | Applies consumer style on the Root nav.                                                          |
| render               | ReactElement or callback receiving props and AvatarMenuRootState | nav      | Preserves Base UI Root element replacement and ref composition.                                  |
| native nav props     | Base UI ref-capable nav props                                    | None     | Native attributes, events, ARIA, consumer data attributes, children, and ref pass through.       |

delay is omitted from the public props. orientation preserves the Base UI
horizontal or vertical union but replaces Base UI's horizontal default with
vertical. AvatarMenu exposes no nonzero-opening-delay escape hatch and adds no
separate orientation type export.

AvatarMenuRootValue, AvatarMenuRootActions, AvatarMenuRootChangeEventReason,
AvatarMenuRootChangeEventDetails, AvatarMenuRootProps, and AvatarMenuRootState
are package exports aligned to Base UI Navigation Menu types.

### Events

AvatarMenuRootChangeEventReason preserves trigger-press, trigger-hover,
outside-press, list-navigation, focus-out, escape-key, link-press, and none.

AvatarMenuRootChangeEventDetails preserves reason, native event, cancel,
allowPropagation, isCanceled, isPropagationAllowed, and trigger. active on
Trigger and Link never emits a Root value change by itself.

### Data Attributes

Root preserves Base UI Root state through className and style callbacks. It adds
no AvatarMenu-specific Root data attribute.

### CSS Variables

Root defines no public CSS variables.

## List

### Props

AvatarMenuListProps and AvatarMenuListState preserve Base UI Navigation Menu
List props and state, including className, style, render, native ul props,
children, events, and ref.

List owns a non-wrapping column when Root orientation is vertical and a
non-wrapping row when orientation is horizontal. It establishes no separate
public size or orientation control. Consumer className or style declarations
that replace the owned layout become consumer-owned under the existing visual
override policy. Base UI owns ordered Trigger focus movement and disabled-item
handling. Focus does not loop from the last enabled Trigger to the first or from
the first to the last.

### Events

List defines no custom events. Native events and Base UI composite navigation
pass through.

### Data Attributes

List preserves owner and consumer data attributes. Base UI open state remains
available to its state callbacks.

### CSS Variables

List defines no public CSS variables.

## Item

### Props

AvatarMenuItemProps and AvatarMenuItemState preserve Base UI Navigation Menu
Item props and state, including value, className, style, render, native li
props, children, events, and ref.

value uniquely identifies the Item for Root control. When omitted, Base UI may
generate a value, but explicit values are required for controlled value,
defaultValue, and stable consumer observation.

### Events

Item defines no custom events.

### Data Attributes

Item preserves owner and consumer data attributes.

### CSS Variables

Item defines no public CSS variables.

## Trigger

### Props

AvatarMenuTriggerProps preserves the native-button portion of Navigation Menu
Trigger, omits render and nativeButton, requires aria-label, and adds active.

| Prop                | Type                                                | Default  | Description                                                                                                  |
| ------------------- | --------------------------------------------------- | -------- | ------------------------------------------------------------------------------------------------------------ |
| aria-label          | non-empty string                                    | Required | Names the Avatar navigation button.                                                                          |
| active              | boolean                                             | false    | Marks the current athlete for persistent reveal and orientation-dependent translation without changing Root. |
| children            | React.ReactNode                                     | None     | Avatar.Image and Avatar.Fallback anatomy composed inside the owned Avatar.Root.                              |
| disabled            | Native button and Base UI Trigger disabled behavior | false    | Prevents interaction according to the preserved button contract.                                             |
| className           | String or function receiving AvatarMenuTriggerState | None     | Composes consumer classes on the one native Trigger button after the owned Avatar composition.               |
| style               | Object or function receiving AvatarMenuTriggerState | None     | Merges consumer style on the one native Trigger button.                                                      |
| native button props | Ref-capable native button props                     | None     | Native attributes, events, ARIA except required label, data attributes, children, and ref pass through.      |

Trigger always renders one native button. A consumer cannot replace it or set
nativeButton false.

The same final button composes Navigation Menu Trigger and Avatar.Root through
Avatar.Root render. AvatarMenu fixes Avatar size md and preserves Avatar's
default Button-chrome border and permanent 3px hard shadow. Avatar Image,
Fallback, loading lifecycle, Heading composition, RevealAnimation, and
accessibility remain owned by Avatar.

AvatarMenu supplies Avatar controlled reveal true while active or
data-popup-open is present. Otherwise Avatar reveal remains interaction-derived
from pointer hover and keyboard focus. active does not open Popup, set Root
value, or add aria-current.

Avatar owns the Trigger's one descendant RevealAnimation structure. AvatarMenu
preserves its complete current public inspection contract, including
data-motion, data-content-mode, data-unreveal-behavior, conditional
data-active-unreveal-behavior, the data-reveal structure attributes, and public
CSS variables. AvatarMenu does not expose unrevealBehavior, direction,
lifecycle callbacks, or geometry overrides on Trigger.

The complete Avatar visual box rests at zero translation only while neither
active nor data-popup-open is present. Either state translates it with the
individual CSS translate property. Vertical orientation uses 10px toward
logical inline-end: positive x in LTR and negative x in RTL. Horizontal
orientation uses 10px downward, or positive y, in both text directions. The
translation vector follows Root orientation and text direction rather than the
collision-resolved Popup side. It does not alter the Trigger border box used for
anchor measurement.

Pointer hover remains stable across the vacated 10px strip between the
untranslated Trigger geometry and its translated Avatar visual box: the inline
strip in vertical orientation and the block-axis strip in horizontal
orientation. This continuity adds no public prop, state field, or data
attribute.

### Events

Trigger preserves native button and Base UI Navigation Menu events. AvatarMenu
adds no key handler and does not prevent Base UI composite or opening keys.

### Data Attributes

| Attribute       | Description                                                 |
| --------------- | ----------------------------------------------------------- |
| data-active     | Present when the explicit active prop is true.              |
| data-popup-open | Base UI marks the Trigger whose associated Content is open. |
| data-pressed    | Base UI marks pressed Trigger state.                        |

### CSS Variables

Trigger defines no public CSS variable. The composed Avatar retains its public
size-derived --hard-shadow value.

## Portal

### Props

AvatarMenuPortalProps and AvatarMenuPortalState preserve Base UI Navigation
Menu Portal children, container, keepMounted, className, native portal behavior,
and state. The one Portal is shared across every Item.

keepMounted keeps the closed subtree in the DOM under Base UI's hidden and
interaction-inert rules. It does not make closed links interactive.

## Positioner

### Props

AvatarMenuPositionerProps preserves NavigationMenu.Positioner.Props except
side, align, and sideOffset. Vertical Root orientation fixes preferred side to
logical inline-end. Horizontal Root orientation fixes preferred side to physical
bottom. Both orientations fix align start and sideOffset 0. Vertical start
aligns Popup block-start with the Trigger; horizontal start aligns Popup
inline-start with the Trigger, resolving left in LTR and right in RTL. Base UI
has no block-end Side value, so non-horizontal writing modes are outside this
contract.

The preserved API includes disableAnchorTracking, alignOffset, arrowPadding,
anchor, collisionAvoidance, collisionBoundary, collisionPadding, sticky,
positionMethod, className, style, render, native div props, events, and ref.

Collision handling may resolve the opposite physical side or shift alignment.
Popup follows data-side and data-align from the resolved placement. A vertical
Popup normally reports the physical side corresponding to inline-end and may
flip to the physical inline-start side. A horizontal Popup normally reports
bottom and may flip to top.

Anchor positioning uses the untranslated Trigger border box. The reference x
and y come from the untranslated Avatar while its width and height remain
unchanged. Collision geometry adds the translated Popup extent to consumer
collision padding at the destination edge: 10px at logical inline-end for
vertical orientation, meaning right in LTR and left in RTL, or 10px at physical
bottom for horizontal orientation in both text directions. The translated
extent is not encoded as sideOffset, an enlarged anchor, or Positioner
coordinates, so placement is not double-counted after a collision flip.

### Events

Positioner defines no custom events. Native and Base UI events pass through.

### Data Attributes

Positioner preserves data-open, data-closed, data-anchor-hidden, data-align,
data-instant, and data-side.

### CSS Variables

| Variable            | Description                                  |
| ------------------- | -------------------------------------------- |
| --anchor-height     | Open Trigger border-box height.              |
| --anchor-width      | Open Trigger border-box width.               |
| --available-height  | Collision-aware available height.            |
| --available-width   | Collision-aware available width.             |
| --positioner-height | Fixed shared Positioner height from Base UI. |
| --positioner-width  | Fixed shared Positioner width from Base UI.  |
| --transform-origin  | Collision-aware Popup transform origin.      |

Positioner uses width and height from --positioner-width and
--positioner-height, caps inline size with --available-width, and transitions
top, right, bottom, and left. data-instant disables that coordinate transition.

## Popup

### Props

AvatarMenuPopupProps and AvatarMenuPopupState preserve Base UI Navigation Menu
Popup props and state: className, style, render, native nav props, events, ARIA,
children, ref, open state, transition status, side, align, and anchor-hidden
state.

Popup delegates its final element to PopupSurface.Root with fixed size md. It
uses Base UI --popup-width and --popup-height as its current dimensions and
caps them with --available-width and --available-height. PopupSurface layout
duration is set to 300ms. Viewport clips transitioning Content.

Content uses intrinsic max-content inline sizing. The longest GroupLabel or Link
in the active Content determines popup width until --available-width is reached.
Overlong text wraps within that cap. Popup height follows active Content within
--available-height.

Popup requires exactly one Viewport in its semantic subtree. Passive layout
wrappers are allowed. Popup owns its PopupSurface md border and hard shadow,
while each Trigger Avatar independently preserves its own default border and
permanent hard shadow.

With the default one-pixel Popup border and one ordinary Link as the only
Content row, the 34px Link minimum plus the top and bottom borders produces the
same 36px border-box height as the md Avatar. Hard shadows remain outside both
border boxes. Wrapping, complex content, additional rows, or consumer border,
typography, padding, or minimum-height overrides may grow or replace that
alignment and become consumer-owned.

Popup rests at the orientation endpoint while open: 10px toward logical
inline-end in vertical orientation or 10px downward in horizontal orientation.
The endpoint follows Root orientation and text direction, not the
collision-resolved side. A horizontal Popup that flips above its Trigger still
translates downward. When the anchor Trigger is active, data-starting-style and
data-ending-style keep the same orientation endpoint, so Popup does not
translate across or overlap the already-translated Avatar during opening or
closing. For a non-active anchor, those lifecycle endpoints use zero
translation. The individual CSS translate property composes with PopupSurface
scale and opacity and with Positioner's independently animated coordinates.

### Data Attributes

Popup preserves data-open, data-closed, data-anchor-hidden, data-align,
data-side, data-starting-style, and data-ending-style. Through PopupSurface it
also exposes data-popup-surface-root and data-size md.

### CSS Variables

Popup preserves --popup-width and --popup-height. It consumes Positioner
--available-width, --available-height, and --transform-origin and PopupSurface
--hard-shadow and timing variables. It fixes
--popup-surface-layout-duration to 300ms and
--popup-surface-layout-easing to cubic-bezier(0.22, 1, 0.36, 1).

## Viewport

### Props

AvatarMenuViewportProps and AvatarMenuViewportState preserve Base UI Navigation
Menu Viewport className, style, render, native div props, children, events, and
ref.

Viewport uses relative positioning, full Popup width and height, and clipped
overflow. Base UI moves the active Content into it.

### Events

Viewport defines no custom events.

### Data Attributes

Viewport preserves owner and consumer data attributes.

### CSS Variables

Viewport defines no public CSS variables.

## Content

### Props

AvatarMenuContentProps and AvatarMenuContentState preserve Base UI Navigation
Menu Content props and state, including keepMounted, className, style, render,
native div props, events, children, ref, open, transition status, and activation
direction.

Content lays out exactly one Group. Its intrinsic max-content inline size
includes GroupLabel and Links, participates in Popup measurement, and is capped
by available geometry.

Every valid non-null value change to a different non-null value derives
activation direction from the rendered physical Trigger positions on the active
orientation axis. A Trigger below or above the previous Trigger produces down
or up in vertical orientation. A Trigger physically right or left of the
previous Trigger produces right or left in horizontal orientation. With the
owned non-wrapping layout, later and earlier Items therefore map to down and up
vertically, right and left in horizontal LTR, and left and right in horizontal
RTL. Base UI supplies that result for Trigger interaction; AvatarMenu supplies
the equivalent for external controlled changes through the existing
AvatarMenuContentState activationDirection and data-activation-direction
contract. Base UI retains the outgoing Content through its detected ending
transition. Consumers keep one Content under each Item and one shared Viewport;
keepMounted is not required for that transient retention. A null-to-value or
value-to-null change is Popup opening or closing, not a directional Content
swap.

### Events

Content defines no custom events.

### Data Attributes

Content preserves data-open, data-closed, data-activation-direction with left,
right, up, or down, data-starting-style, and data-ending-style.

### CSS Variables

Content consumes PopupSurface layout duration and easing for its spatial
transition. It defines no new public variable.

## Group

### Props

AvatarMenuGroupProps is based on the public Base UI useRender component-props
contract for a div with AvatarMenuGroupState.

```ts
type AvatarMenuGroupStripesProps = Omit<
  StripesProps,
  | 'aria-hidden'
  | 'aria-labelledby'
  | 'children'
  | 'dangerouslySetInnerHTML'
  | 'hidden'
  | 'inert'
  | 'render'
  | 'role'
>
```

AvatarMenuGroupStripesProps is a package export. AvatarMenuGroupState remains
`Record<string, never>` because stripe configuration is input rather than
render state.

| Prop             | Type                                                              | Default | Description                                                                                                                   |
| ---------------- | ----------------------------------------------------------------- | ------- | ----------------------------------------------------------------------------------------------------------------------------- |
| children         | React.ReactNode                                                   | None    | Exactly one leading GroupLabel followed by the current Avatar's Links.                                                        |
| stripesProps     | boolean or AvatarMenuGroupStripesProps                            | true    | Uses default Stripes, removes Stripes with false, or passes supported public Stripes props through an object.                 |
| className        | String or function receiving AvatarMenuGroupState                 | None    | Composes consumer classes after PopupSurface Group presentation on the outer final element.                                   |
| style            | Object or function receiving AvatarMenuGroupState                 | None    | Merges consumer style last on the outer final element.                                                                        |
| render           | ReactElement or callback receiving props and AvatarMenuGroupState | div     | Replaces the outer default div and receives final outer props, children, state, and ref.                                      |
| native div props | Ref-capable native div props                                      | None    | Native attributes, events, data attributes, children, and ref pass through to the outer element except owned Group semantics. |

Group composes PopupSurface.Group onto one final element. AvatarMenu fixes role
group and aria-labelledby to the id of its one leading GroupLabel. Consumers
cannot replace those owned association props. GroupLabel must precede every
Link in the semantic subtree.

Omitted `stripesProps` and `stripesProps={true}` render GroupLabel and Links
inside one nested default Stripes `div`. The object form renders the same nested
`div` and passes Stripes named props, `className`, `style`, compatible native
attributes and events, consumer data attributes, and ref. `stripesProps={false}`
renders no Stripes element and places GroupLabel and Links directly inside the
outer Group.

AvatarMenu owns the nested Stripes children and fixed `div`, so the object form
does not accept `children`, `dangerouslySetInnerHTML`, or `render`. The outer
Group exclusively owns its group relationship, and the nested children must
remain available and interactive, so the object form also excludes `role`,
`aria-labelledby`, `aria-hidden`, `hidden`, and `inert`. Visual declarations in
`stripesProps.className` or `stripesProps.style` that disrupt or hide the owned
children are consumer-owned and unsupported when they contradict Group layout
or accessibility.

Switching between `false` and a rendered Stripes form changes the React parent
of GroupLabel and Links and may remount that subtree, including loss of
descendant focus, local state, and ref identity. Group adds no navigation
registration, value, focus, activation, or closing behavior.

### Events

Group defines no custom events. Native events pass through without changing
Base UI Navigation Menu behavior.

### Data Attributes

The outer Group exposes data-popup-surface-group through PopupSurface and
preserves Group consumer data attributes. Stripes defines no custom data
attribute. Object-form `stripesProps` consumer data attributes apply to the
nested Stripes element. With `false`, those nested attributes have no rendered
target.

### CSS Variables

Group defines no AvatarMenu CSS variables. Ancestor or outer Group values for
public Stripes CSS variables inherit into the nested Stripes. Object-form
`className` or `style` variables override inherited values, and matching
`angle`, `gap`, `width`, or `color` props retain highest precedence under the
Stripes contract. With `false`, nested Stripes variables and props have no
rendered target.

## GroupLabel

### Props

AvatarMenuGroupLabelProps is based on the public Base UI useRender
component-props contract for a div with AvatarMenuGroupLabelState.

| Prop             | Type                                                                   | Default   | Description                                                                                   |
| ---------------- | ---------------------------------------------------------------------- | --------- | --------------------------------------------------------------------------------------------- |
| children         | React.ReactNode                                                        | Required  | Authoritative visible and accessible full name for the current Avatar.                        |
| id               | string                                                                 | Generated | Overrides the generated id used by the parent Group aria-labelledby relationship.             |
| className        | String or function receiving AvatarMenuGroupLabelState                 | None      | Composes consumer classes after AvatarMenu presentation on the final composed GroupLabel.     |
| style            | Object or function receiving AvatarMenuGroupLabelState                 | None      | Merges consumer style last on the final element.                                              |
| render           | ReactElement or callback receiving props and AvatarMenuGroupLabelState | div       | Replaces the default div and receives the complete final props, children, state, id, and ref. |
| native div props | Ref-capable native div props                                           | None      | Native attributes, events, ARIA, data attributes, children, and ref pass through.             |

GroupLabel composes the presentation-agnostic PopupSurface.GroupLabel and owns
muted Heading md, centered block alignment, zero block padding, ps-8, pe-2.5,
and a minimum height of calc(2.25rem - 2px), or 34px at the default root font
size. Heading md matches Avatar.Fallback's fixed md Heading contract, so their
line boxes share the same baseline when Popup and Avatar top edges align.
GroupLabel exposes no href, active, closeOnClick, icon, size, contentInset,
reveal, or revealAnimationProps. Its children must supply the full name
explicitly because AvatarMenu cannot derive it reliably from Image, Fallback
initials, or the Trigger action label.

### Events

GroupLabel defines no custom events and is never focusable or activatable.
Native passive events pass through. A render replacement must preserve the
received id, props, children, and ref on one noninteractive final element.

### Data Attributes

Through PopupSurface.GroupLabel, the same final element exposes
data-popup-surface-group-label. It preserves consumer data attributes.

### CSS Variables

GroupLabel defines no public CSS variables.

## Link

### Props

AvatarMenuLinkProps preserves Base UI Navigation Menu Link props and native
anchor props, adds one required decorative icon, and changes the Powercoach
closeOnClick default.

| Prop                | Type                                               | Default  | Description                                                                       |
| ------------------- | -------------------------------------------------- | -------- | --------------------------------------------------------------------------------- |
| icon                | PopupSurfaceItemIcon                               | Required | One decorative logical-start md row Icon.                                         |
| active              | boolean                                            | false    | Marks the current page and keeps the shared row revealed.                         |
| closeOnClick        | boolean                                            | true     | Closes AvatarMenu after link activation; false preserves the open value.          |
| href                | Native anchor href                                 | None     | Supplies the destination; AvatarMenu does not construct routes from Item value.   |
| children            | React.ReactNode                                    | None     | Authoritative visible and accessible Link content.                                |
| className           | String or function receiving AvatarMenuLinkState   | None     | Resolves once and merges through the shared semantic and visual branches.         |
| style               | Object or function receiving AvatarMenuLinkState   | None     | Merges last on the one semantic Link and is not duplicated.                       |
| render              | ReactElement or callback receiving props and state | a        | Replaces the anchor for a ref-forwarding, prop-spreading router Link.             |
| native anchor props | Base UI ref-capable anchor props                   | None     | Native attributes, events, ARIA, data attributes, children, and ref pass through. |

Link composes PopupSurface.Item with size md, required Icon, iconPosition start,
and inferred start contentInset. AvatarMenu overrides the generic Item geometry
with ps-8, pe-2.5, and a minimum height of calc(2.25rem - 2px), or 34px at the
default root font size. It retains Text sm, py-1.5, gap-2.5, the spacing-8
logical-start Icon column, and spacing-3.5 SVG size. The Link text begins after
the 32px Icon column without PopupSurface's additional 10px base start inset.
Complex content may grow from the minimum.

Link passes reveal true while active and leaves reveal uncontrolled otherwise.
Inactive links therefore use PopupSurface hover and keyboard focus-visible
reveal. Link does not expose an AvatarMenu-specific RevealAnimation override.

PopupSurface owns the Link's one descendant RevealAnimation structure.
AvatarMenu preserves its complete current public inspection contract, including
data-motion, data-content-mode, data-unreveal-behavior, conditional
data-active-unreveal-behavior, the data-reveal structure attributes, and public
CSS variables. AvatarMenu does not expose unrevealBehavior, direction,
lifecycle callbacks, or geometry overrides on Link.

A render replacement remains the sole Base UI Link element. It must forward the
received ref, spread the received anchor props, and render the supplied children
once. PopupSurface duplicates only its internal semantic-free visual content,
not the router component, link role, events, or ref.

### Events

Link preserves native anchor and Base UI link-press behavior. closeOnClick true
requests Root closure through the existing link-press reason. Event details and
cancellation remain Base UI-owned.

### Data Attributes

Link preserves Base UI data-active. Through PopupSurface.Item it also exposes
data-popup-surface-item, data-size md, data-icon-position start,
data-content-inset start, and data-revealed when effective reveal is true.
Its descendant RevealAnimation preserves the complete current RevealAnimation
data-attribute contract without mirroring those attributes onto the Link.

### CSS Variables

Link defines no public CSS variables. Its internal RevealAnimation retains the
complete current public RevealAnimation variables on owned descendants.

## Accessibility

AvatarMenu preserves Base UI Navigation Menu accessibility. Root is a nav,
List is a navigation list, Item associates Trigger and Content, Trigger is a
native button, Popup is the shared navigation container, and Link remains an
anchor or compatible router link. Each Content Group is a role group labeled by
its leading GroupLabel full name.

Every Trigger requires a non-empty aria-label because its Avatar image may be
decorative and its visible initials are not guaranteed to provide the intended
action name. The label names the action, such as Open Yann navigation.

Trigger composes Navigation Menu Trigger and Avatar.Root on one native button.
There is no nested button, duplicate Avatar Root, second trigger role, or custom
keyboard handler. Avatar.Image and Avatar.Fallback retain their current public
semantics inside that button.

active on Trigger is a visual current-athlete signal only. It adds data-active
plus persistent reveal and orientation-dependent translation but no
aria-current, pressed state, selected state, or Root value change. Consumers
provide a separate accessible current-athlete signal when product context
requires one.

Group and GroupLabel are AvatarMenu-owned semantic parts because Base UI
Navigation Menu provides no equivalent grouping primitives. Group owns role
group and aria-labelledby. GroupLabel owns the referenced generated or
consumer-supplied id, remains noninteractive, and supplies the current Avatar's
authoritative full name through children. PopupSurface contributes neutral Group
layout and presentation-agnostic GroupLabel composition only; it does not
generate ids, roles, relationships, registration, or focus behavior.

The nested Stripes is a visual wrapper inside Group and adds no role,
accessible-name source, hidden state, or custom data attribute of its own. Its
striped background is decorative while GroupLabel and Link children retain
their meaning. Removing or configuring Stripes through `stripesProps` does not
change the outer Group semantics, the GroupLabel relationship, Link focus, or
Link activation.

Link Icon is decorative through PopupSurface. Link children remain the visible
and accessible label. active preserves Base UI current-page data state.

A router Link replacement forwards every received prop and ref to its sole
anchor-compatible DOM element. RevealAnimation never duplicates the router
component, navigation action, link semantics, accessible name, focus target, or
events. The descendant RevealAnimation inspection structure does not change
that sole semantic ownership.

With vertical orientation, ArrowDown moves focus to the next enabled Trigger
and ArrowUp moves to the previous enabled Trigger. ArrowRight opens the focused
Trigger in LTR and ArrowLeft opens it in RTL. With horizontal orientation,
ArrowRight moves to the next enabled Trigger and ArrowLeft to the previous in
LTR; RTL reverses those focus directions so ArrowLeft moves next and ArrowRight
moves previous. ArrowDown opens the focused horizontal Trigger in both text
directions. Focus stops at the first and last enabled Trigger, the opening arrow
retains the Base UI list-navigation reason, and Enter and Space retain native
button activation. AvatarMenu adds no custom key handling.

Orientation does not change public semantics. Root remains nav, List remains
ul, Item remains li, and AvatarMenu adds no aria-orientation, menu, menubar,
selected, or orientation data-attribute contract. Root and List state callbacks
do not receive a custom orientation field.

Escape, outside press, focus movement, link press, and other dismissal paths
remain Base UI-owned. Reduced motion and data-instant do not change roles,
focus, keyboard mapping, accessible names, or final open state.

## Behavior

Root renders one Base UI Navigation Menu with immediate opening. orientation
defaults to vertical and also accepts horizontal. defaultValue and value
identify the open Item, not the active Trigger or current route. null means
closed. Controlled and uncontrolled APIs are not mixed.

Root forwards closeDelay to Base UI and defaults to 50ms. Trigger hover may open
immediately because delay is fixed to 0. closeDelay keeps the shared Popup open
briefly while pointer intent crosses between Trigger and Popup.

List lays Items in a non-wrapping column for vertical orientation and a
non-wrapping row for horizontal orientation. It preserves Base UI composite
focus order and disabled-item handling without looping. Item values must be
unique for stable controlled state. One Portal, Positioner, Popup, and Viewport
serve every Item.

Trigger uses Avatar.Root only through Avatar's public API. AvatarMenu fixes md,
uses Avatar render composition to land on the Navigation Menu native button,
and preserves Avatar's default border and permanent 3px hard shadow. Avatar
Image, Fallback, loading, Heading, RevealAnimation, theme inversion, and
reduced-motion behavior remain unchanged.

AvatarMenu does not recreate or freeze RevealAnimation motion, lifecycle,
clip-path endpoints, hidden resets, data attributes, or CSS variables. It
preserves the complete current RevealAnimation public contract through Avatar
and PopupSurface while owning only the effective Trigger and Link reveal targets
described below.

Trigger effective reveal uses active-first and open-first control. active or
popup-open passes true to Avatar. Otherwise Avatar derives hover and keyboard
focus. active and open are independent. Either active or popup-open applies the
orientation endpoint to the complete Avatar visual box: 10px toward logical
inline-end vertically or 10px downward horizontally. Separate active and open
Triggers may both occupy that endpoint. Pointer hover remains stable across the
vacated 10px strip on the selected axis.

When Popup opens or closes around a Trigger whose active prop remains true, the
Avatar already occupies its orientation endpoint. Popup therefore uses the same
endpoint for data-starting-style, rest, and data-ending-style, without movement
across the Avatar. A Popup anchored to a non-active Trigger keeps zero for its
starting and ending lifecycle endpoints and moves between zero and the
orientation endpoint during opening or closing.

Positioner prefers logical inline-end for vertical orientation and physical
bottom for horizontal orientation, always with start alignment and no border-box
gap. It measures the untranslated Trigger border box. Effective collision
geometry reserves 10px at logical inline-end vertically or physical bottom
horizontally without changing sideOffset, anchor size, or Positioner
coordinates. The translation direction is orientation-dependent rather than
collision-side-dependent: a flipped vertical Popup still translates toward
logical inline-end, and a flipped horizontal Popup still translates downward.

Popup consumes PopupSurface Root rather than recreating its chrome. The fixed md
size gives the existing 0.1875rem foreground hard shadow. Trigger Avatar and
Popup each own their independent default border and hard shadow. Viewport
remains the sole Content clip.

For every non-null value change to a different non-null value, AvatarMenu uses
the previous and next Triggers' rendered physical positions on the orientation
axis. Vertical changes supply down or up. Horizontal changes supply right or
left, including the physical reversal produced by the owned RTL row. This
applies to Base UI interaction and external controlled state equally through
Content's existing activation-direction contract. Base UI retains outgoing
Content while its ending transition runs. Null transitions use Popup opening
and closing without a Content activation direction.

Content supplies intrinsic measurement. A one-line longest GroupLabel or Link
expands Popup until available width is reached. Longer text wraps within the
cap. Active Content height determines Popup height within available height.
Viewport clips simultaneously retained incoming and outgoing Content.

Content contains exactly one AvatarMenu Group. Group composes PopupSurface
Group while retaining AvatarMenu's role group and generated aria-labelledby
relationship. By default, its leading GroupLabel and following Links render
inside one nested Stripes div with public Stripes defaults. `stripesProps` true
retains those defaults, an object configures the nested Stripes through its
supported public props, and false removes the nested element without changing
the outer Group or its children. Stripes preserves its normal override
precedence from inherited variables through object variables to matching named
props. The leading GroupLabel explicitly names the current Avatar and composes
the presentation-agnostic PopupSurface GroupLabel. AvatarMenu supplies Heading
md, centered zero-block-padding layout, ps-8, pe-2.5, and the 34px border-aware
minimum. GroupLabel adds no focus, activation, closing, or Navigation Menu
state.

Link consumes PopupSurface Item rather than recreating its Text, reveal, or Icon
mechanics. It keeps md Text size, py-1.5, gap-2.5, Icon column spacing 8, and SVG
spacing 3.5, while AvatarMenu owns the 34px minimum, ps-8, and pe-2.5 overrides.
GroupLabel uses the same 34px minimum and inline padding with muted Heading md,
centered block alignment, and no block padding. Autocomplete separately owns
its Input-axis Item and GroupLabel geometry.

active Link controls shared reveal true. Inactive Link leaves reveal
interaction-derived. closeOnClick true requests closure after ordinary
activation. false leaves the open value unchanged. href and router destination
remain consumer-owned.

Consumer className and style values merge on each public Base UI owner through
its state contract. Supported visual conflicts replace the corresponding
defaults and become consumer-owned. Semantic ownership, required Trigger label,
and decorative Icon safety retain final precedence.

## Motion

AvatarMenu uses the CSS animation engine.

PopupSurface owns Popup opening and closing. Popup enters from scale 0.9 and
opacity 0 over 350ms with cubic-bezier(0.22, 1, 0.36, 1). It exits toward the
same endpoint over 150ms ease. transform-origin follows Base UI collision-aware
placement.

The Trigger Avatar and Popup each use the individual CSS translate property for
their orientation-dependent placement-axis movement.

| Root orientation | Text direction | Trigger or Popup rest endpoint | Active-anchor Popup starting and ending | Non-active-anchor Popup starting and ending |
| ---------------- | -------------- | ------------------------------ | --------------------------------------- | ------------------------------------------- |
| vertical         | LTR            | translate: 10px 0              | translate: 10px 0                       | translate: 0 0                              |
| vertical         | RTL            | translate: -10px 0             | translate: -10px 0                      | translate: 0 0                              |
| horizontal       | LTR or RTL     | translate: 0 10px              | translate: 0 10px                       | translate: 0 0                              |

A Trigger Avatar rests at zero only while neither active nor data-popup-open is
present. Either state selects the table's orientation endpoint. Popup rests at
the same endpoint while open. For a non-active anchor, data-starting-style and
data-ending-style select zero, so Popup moves between zero and its orientation
endpoint. For an active anchor, both lifecycle attributes retain the orientation
endpoint, so opening and closing perform no Popup translation and never cross or
overlap the already-translated Avatar. The vector follows Root orientation and
text direction rather than collision-resolved side. Every Trigger or Popup
translation whose endpoints differ lasts 150ms with
cubic-bezier(0.22, 1, 0.36, 1).

Positioner transitions top, right, bottom, and left over 300ms with
cubic-bezier(0.22, 1, 0.36, 1). During a non-null Avatar-to-Avatar change,
Positioner moves along the rendered rail axis while Popup remains at its
perpendicular orientation endpoint. Vertical orientation pairs vertical
Positioner movement with logical-inline x translation. Horizontal orientation
pairs horizontal Positioner movement with downward y translation. Popup
translate and Positioner coordinates remain separate CSS properties.

Popup transitions width and height through PopupSurface's public layout timing
at 300ms with cubic-bezier(0.22, 1, 0.36, 1). Scale and opacity retain their
independent PopupSurface entry and exit durations.

Content transitions opacity over 175ms ease and translate over 300ms with
cubic-bezier(0.22, 1, 0.36, 1). data-starting-style and data-ending-style both
set opacity 0.

| Activation direction | Entering starting translate | Exiting ending translate |
| -------------------- | --------------------------- | ------------------------ |
| down                 | translateY(50%)             | translateY(-50%)         |
| up                   | translateY(-50%)            | translateY(50%)          |
| right                | translateX(50%)             | translateX(-50%)         |
| left                 | translateX(-50%)            | translateX(50%)          |

Every non-null value change to a different non-null value, including an external
controlled change, reports up or down from rendered physical position in
vertical orientation and right or left in horizontal orientation. The physical
horizontal result naturally reverses with the owned RTL row. Null-to-value and
value-to-null changes use Popup opening and closing rather than a directional
Content swap.

All movement uses CSS transitions. If open value changes before the previous
movement completes, Trigger and Popup orientation-dependent translate,
Positioner coordinates, Popup width and height, Content opacity, and Content
orientation-axis translate continue from their current computed values toward
the new target. No property resets to the previous Avatar or prior popup size.

Positioner data-instant disables coordinate transition, sets the descendant
PopupSurface layout duration to zero, and removes the axis-matched Content
spatial translation for that activation. It does not cancel a separate Trigger
or non-active-anchor Popup opening or closing orientation-dependent translation,
just as Popup opening or closing scale and opacity still follow the lifecycle
state unless reduced motion is also active.

Base UI keeps outgoing Content, Popup, and Portal subtrees mounted while their
detected transitions complete. onOpenChangeComplete reports the final open
boolean after the active Popup transition. Portal or Content keepMounted keeps
the closed or inactive subtree under Base UI hidden and interaction-inert rules.

Under reduced motion, Trigger and Popup orientation-dependent translate,
Positioner coordinates, Popup width and height, Popup scale and opacity, and
Content orientation-axis translate reach their target immediately. Content may
retain its 175ms non-spatial opacity transition, matching the approved Tabs
reduced-motion policy. Trigger Avatar and Link Item RevealAnimation independently
follow their complete current immediate reduced-motion lifecycle. AvatarMenu
does not redefine their clip-path endpoints, completion rules, or hidden reset.

## Use Cases

### UC-001 - Expose the AvatarMenu family

Given a consumer imports AvatarMenu, a direct part, or a documented type from
@powercoach/ui
When the public API is inspected
Then the twelve-part non-callable namespace and prefixed exports are available
without Arrow, Icon, or Backdrop

### UC-002 - Control or default the open Avatar

Given a consumer uses value and onValueChange, defaultValue, or null
When the open Item changes
Then Base UI controlled or uncontrolled value, reasons, cancellation,
completion, and one shared Popup lifecycle are preserved

### UC-003 - Navigate according to orientation

Given focus is on an enabled Trigger in vertical or horizontal orientation and
LTR or RTL
When an orientation arrow, opening arrow, Enter, or Space is pressed
Then Base UI moves focus without looping with ArrowDown and ArrowUp vertically,
ArrowRight and ArrowLeft horizontally in LTR, reversed ArrowLeft and ArrowRight
horizontally in RTL, opens vertically with the logical inline-end arrow, opens
horizontally with ArrowDown, and retains native button activation without custom
handlers

### UC-004 - Compose one named Avatar Trigger button

Given Trigger receives a non-empty aria-label and Avatar Image or Fallback
children
When it renders
Then one native Navigation Menu button composes Avatar.Root at md size without a
nested button or duplicated Avatar semantic owner

### UC-005 - Reveal current and open Avatars

Given Trigger is active, popup-open, hovered, or keyboard-focused
When reveal state is resolved
Then active or popup-open keeps Avatar reveal controlled on, otherwise Avatar
retains interaction reveal, active alone translates Avatar to the
orientation-dependent endpoint without opening Popup or changing Root value,
pointer hover remains stable across the vacated 10px axis strip, and Avatar
owns the complete current RevealAnimation motion and inspection contract

### UC-006 - Position and collide the shared Popup

Given an Item opens in vertical or horizontal orientation near available
viewport boundaries in LTR or RTL
When Positioner resolves placement
Then vertical orientation prefers logical inline-end and horizontal orientation
prefers physical bottom, both use start alignment and zero gap before preserved
collision handling, positioning measures the untranslated Trigger border box,
and collision geometry reserves 10px at logical inline-end vertically or
physical bottom horizontally without changing sideOffset, anchor size, or
Positioner coordinates

### UC-007 - Size Popup from active Content

Given active Content contains differently sized GroupLabel and Link labels
When Popup is measured
Then the longest GroupLabel or Link determines intrinsic width within available
width, overlong text wraps at the cap, and height follows Content within
available height

### UC-008 - Translate active and open Avatars with Popup by orientation

Given Popup opens or closes from an active or non-active Trigger in vertical or
horizontal orientation and LTR or RTL
When Trigger and Popup translation targets resolve
Then active or popup-open moves the complete Avatar visual box 10px toward
logical inline-end vertically or 10px downward horizontally, an Avatar with
neither state returns to zero, Popup remains at the same orientation endpoint
throughout opening and closing when its anchor stays active, otherwise Popup
moves between zero and that endpoint, collision flips do not reverse the vector,
and every differing translation uses 150ms with
cubic-bezier(0.22, 1, 0.36, 1) while preserving independent default borders and
hard shadows

### UC-009 - Navigate with active and closing Links

Given Link receives required Icon, href or router render, active, and optional
closeOnClick
When it is displayed or activated
Then it retains one Base UI link, active stays revealed, default true requests
closure, false preserves the open value, AvatarMenu never constructs routes,
and PopupSurface owns the complete current RevealAnimation motion and inspection
contract

### UC-010 - Compose the AvatarMenu md Icon plus Text row

Given AvatarMenu.Link renders
When its visual surface is inspected
Then PopupSurface supplies md Text, the start Icon column, RevealAnimation,
duplication, consumer precedence, and decorative safety while AvatarMenu
overrides the row to a 34px minimum with ps-8 and pe-2.5 and leaves
Autocomplete geometry independent, without AvatarMenu defining RevealAnimation
clip-path geometry or exposing a reveal override

### UC-011 - Move and resize between Avatars

Given the open value changes between Items with different rail positions and
Content dimensions
When shared geometry retargets
Then Positioner coordinates, Popup width, and Popup height interpolate for
300ms with cubic-bezier(0.22, 1, 0.36, 1) along the rendered Trigger axis,
while Popup retains its perpendicular orientation endpoint

### UC-012 - Transition Content along the orientation axis

Given active Content changes between rendered Triggers through interaction or
an external controlled value change
When incoming and outgoing Content transition
Then AvatarMenu derives up or down vertically and right or left horizontally
from rendered physical position, including RTL reversal, exposes the result
through the existing Content state and data attribute, retains outgoing Content,
and uses the documented opposite translateY or translateX endpoints over 300ms
and opacity over 175ms while Viewport clips them

### UC-013 - Reverse interrupted movement

Given another Avatar opens before current movement or Content transition
completes
When every CSS property retargets
Then coordinates, dimensions, opacity, and translate continue from current
computed values without snapping to the previous Avatar or popup size,
including Trigger and Popup orientation-dependent translation

### UC-014 - Honor data-instant

Given Base UI marks Positioner data-instant
When anchor or Content changes
Then coordinate, Popup layout, and Content spatial transitions reach the new
target immediately for that activation while separate opening or closing
orientation-dependent translation, scale, and opacity retain their lifecycle
timing

### UC-015 - Respect reduced motion

Given reduced motion is active
When Popup opens, closes, moves, resizes, or swaps Content
Then scale, shared opacity, spatial movement, and layout reach their endpoints
immediately, including Trigger and Popup orientation-dependent translation,
while the approved 175ms Content opacity fade may remain and both
RevealAnimation instances follow their complete current immediate lifecycle

### UC-016 - Preserve close delay and transition completion

Given pointer intent leaves Trigger or Popup, Link closes, or Portal and Content
use keepMounted
When Base UI advances the lifecycle
Then configurable closeDelay defaults to 50ms, opening remains immediate,
outgoing nodes persist through detected transitions, completion reports final
open state, and kept closed nodes remain hidden and inert

### UC-017 - Preserve accessibility and render composition

Given Trigger, Popup, Content, or Link receives supported native props or render
composition
When AvatarMenu is inspected
Then Base UI roles, ARIA, ids, events, refs, focus, router navigation, and one
semantic element per part remain intact while copied visuals stay decorative
and each Avatar or PopupSurface composition preserves one complete descendant
RevealAnimation inspection structure

### UC-018 - Preserve consumer visual overrides and collision state

Given a public part receives supported className or style conflicts and
Positioner resolves a collision side
When presentation merges
Then consumer-owned conflicts win within documented boundaries, semantic and
safety rules remain, and data-side, data-align, dimensions, and public CSS
variables remain inspectable

### UC-019 - Label one full-name link group

Given Content renders one Group with one leading GroupLabel and following Links
When the open Avatar's popup is inspected
Then Group consumes PopupSurface layout and GroupLabel consumes its
presentation-agnostic composition on their same final elements, Group is
labeled by the explicit full-name children through its owned
aria-labelledby relationship, the GroupLabel and Links render inside default
Stripes, GroupLabel remains noninteractive and aligns its muted Heading md
baseline with Avatar.Fallback through centered zero-block-padding geometry,
GroupLabel and Link use ps-8, pe-2.5, and a 34px minimum, and the default Popup
borders make one ordinary Link row total the md Avatar's 36px border-box height
while Base UI Link focus, activation, and closing behavior remain unchanged

### UC-020 - Configure or remove Group Stripes

Given Group receives omitted, true, false, or object `stripesProps`
When Group renders its one leading GroupLabel and following Links
Then omitted or true wraps those children in default Stripes, an object wraps
them in Stripes with the supported public props and normal override precedence,
false renders them directly inside the outer PopupSurface Group, and every form
preserves the same outer role group, aria-labelledby relationship, public Group
props, and Link interaction

### UC-021 - Choose vertical or horizontal orientation

Given Root receives omitted, vertical, or horizontal orientation
When AvatarMenu renders
Then omitted orientation resolves to vertical, List owns the matching
non-wrapping column or row, Positioner uses logical inline-end vertically or
physical bottom horizontally with start alignment and zero gap, Base UI owns the
orientation-specific keyboard contract, and Root and List expose no custom
orientation state field, data attribute, ARIA role, or additional orientation
type
