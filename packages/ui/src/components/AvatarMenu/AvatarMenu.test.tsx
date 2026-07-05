import { NavigationMenu as BaseUiNavigationMenu } from '@base-ui/react/navigation-menu'
import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import {
  createRef,
  forwardRef,
  useState,
  type ComponentPropsWithoutRef,
  type CSSProperties,
  type ReactNode
} from 'react'
import { expectTypeOf } from 'vitest'

import {
  type AvatarMenuContentProps,
  type AvatarMenuContentState,
  type AvatarMenuGroupLabelProps,
  type AvatarMenuGroupLabelState,
  type AvatarMenuGroupProps,
  type AvatarMenuGroupStripesProps,
  type AvatarMenuGroupState,
  type AvatarMenuItemProps,
  type AvatarMenuItemState,
  type AvatarMenuLinkProps,
  type AvatarMenuLinkState,
  type AvatarMenuListProps,
  type AvatarMenuListState,
  type AvatarMenuNamespace,
  type AvatarMenuPopupProps,
  type AvatarMenuPopupState,
  type AvatarMenuPortalProps,
  type AvatarMenuPortalState,
  type AvatarMenuPositionerProps,
  type AvatarMenuPositionerState,
  type AvatarMenuRootActions,
  type AvatarMenuRootChangeEventDetails,
  type AvatarMenuRootChangeEventReason,
  type AvatarMenuRootProps,
  type AvatarMenuRootState,
  type AvatarMenuRootValue,
  type AvatarMenuTriggerProps,
  type AvatarMenuTriggerState,
  type AvatarMenuViewportProps,
  type AvatarMenuViewportState,
  type PopupSurfaceItemIcon
} from '../..'
import * as PackageExports from '../..'
import { Ex008HorizontalOrientationAndAxisMovement } from './AvatarMenu.stories'

interface AvatarMenuPackageContract {
  AvatarMenu: AvatarMenuNamespace
  AvatarMenuContent: AvatarMenuNamespace['Content']
  AvatarMenuGroup: AvatarMenuNamespace['Group']
  AvatarMenuGroupLabel: AvatarMenuNamespace['GroupLabel']
  AvatarMenuItem: AvatarMenuNamespace['Item']
  AvatarMenuLink: AvatarMenuNamespace['Link']
  AvatarMenuList: AvatarMenuNamespace['List']
  AvatarMenuPopup: AvatarMenuNamespace['Popup']
  AvatarMenuPortal: AvatarMenuNamespace['Portal']
  AvatarMenuPositioner: AvatarMenuNamespace['Positioner']
  AvatarMenuRoot: AvatarMenuNamespace['Root']
  AvatarMenuTrigger: AvatarMenuNamespace['Trigger']
  AvatarMenuViewport: AvatarMenuNamespace['Viewport']
}

type IsAny<TValue> = 0 extends 1 & TValue ? true : false
type IsCallable<TValue> =
  IsAny<TValue> extends true ? false : TValue extends (...args: never[]) => unknown ? true : false
type HasNoKey<TValue, TKey extends PropertyKey> =
  IsAny<TValue> extends true ? true : TKey extends keyof TValue ? false : true
type HasRequiredKey<TValue, TKey extends keyof TValue> =
  IsAny<TValue> extends true ? true : undefined extends TValue[TKey] ? false : true

const PACKAGE_EXPORTS = PackageExports as typeof PackageExports & AvatarMenuPackageContract
const AvatarMenu = PACKAGE_EXPORTS.AvatarMenu
const AvatarMenuContent = PACKAGE_EXPORTS.AvatarMenuContent
const AvatarMenuGroup = PACKAGE_EXPORTS.AvatarMenuGroup
const AvatarMenuGroupLabel = PACKAGE_EXPORTS.AvatarMenuGroupLabel
const AvatarMenuItem = PACKAGE_EXPORTS.AvatarMenuItem
const AvatarMenuLink = PACKAGE_EXPORTS.AvatarMenuLink
const AvatarMenuList = PACKAGE_EXPORTS.AvatarMenuList
const AvatarMenuPopup = PACKAGE_EXPORTS.AvatarMenuPopup
const AvatarMenuPortal = PACKAGE_EXPORTS.AvatarMenuPortal
const AvatarMenuPositioner = PACKAGE_EXPORTS.AvatarMenuPositioner
const AvatarMenuRoot = PACKAGE_EXPORTS.AvatarMenuRoot
const AvatarMenuTrigger = PACKAGE_EXPORTS.AvatarMenuTrigger
const AvatarMenuViewport = PACKAGE_EXPORTS.AvatarMenuViewport

describe('AvatarMenu', () => {
  it('UC-001 - exposes the twelve-part non-callable namespace and Base UI-aligned public types without Arrow, Icon, or Backdrop', () => {
    expect(typeof AvatarMenu).toBe('object')
    expect(AvatarMenu).toEqual({
      Content: AvatarMenuContent,
      Group: AvatarMenuGroup,
      GroupLabel: AvatarMenuGroupLabel,
      Item: AvatarMenuItem,
      Link: AvatarMenuLink,
      List: AvatarMenuList,
      Popup: AvatarMenuPopup,
      Portal: AvatarMenuPortal,
      Positioner: AvatarMenuPositioner,
      Root: AvatarMenuRoot,
      Trigger: AvatarMenuTrigger,
      Viewport: AvatarMenuViewport
    })
    expect(typeof AvatarMenuGroup).toBe('function')
    expect(typeof AvatarMenuGroupLabel).toBe('function')
    expect(AvatarMenu).toHaveProperty('Group', AvatarMenuGroup)
    expect(AvatarMenu).toHaveProperty('GroupLabel', AvatarMenuGroupLabel)

    expectTypeOf<IsCallable<AvatarMenuNamespace>>().toEqualTypeOf<false>()
    expectTypeOf<AvatarMenuRootValue>().toEqualTypeOf<BaseUiNavigationMenu.Root.Value>()
    expectTypeOf<AvatarMenuRootActions>().toEqualTypeOf<BaseUiNavigationMenu.Root.Actions>()
    expectTypeOf<AvatarMenuRootChangeEventReason>().toEqualTypeOf<BaseUiNavigationMenu.Root.ChangeEventReason>()
    expectTypeOf<AvatarMenuRootChangeEventDetails>().toEqualTypeOf<BaseUiNavigationMenu.Root.ChangeEventDetails>()
    expectTypeOf<AvatarMenuRootState>().toEqualTypeOf<BaseUiNavigationMenu.Root.State>()
    expectTypeOf<AvatarMenuListProps>().toEqualTypeOf<BaseUiNavigationMenu.List.Props>()
    expectTypeOf<AvatarMenuListState>().toEqualTypeOf<BaseUiNavigationMenu.List.State>()
    expectTypeOf<AvatarMenuItemProps>().toEqualTypeOf<BaseUiNavigationMenu.Item.Props>()
    expectTypeOf<AvatarMenuItemState>().toEqualTypeOf<BaseUiNavigationMenu.Item.State>()
    expectTypeOf<AvatarMenuTriggerState>().toEqualTypeOf<BaseUiNavigationMenu.Trigger.State>()
    expectTypeOf<AvatarMenuPortalProps>().toEqualTypeOf<BaseUiNavigationMenu.Portal.Props>()
    expectTypeOf<AvatarMenuPortalState>().toEqualTypeOf<BaseUiNavigationMenu.Portal.State>()
    expectTypeOf<AvatarMenuPositionerState>().toEqualTypeOf<BaseUiNavigationMenu.Positioner.State>()
    expectTypeOf<AvatarMenuPopupProps>().toEqualTypeOf<BaseUiNavigationMenu.Popup.Props>()
    expectTypeOf<AvatarMenuPopupState>().toEqualTypeOf<BaseUiNavigationMenu.Popup.State>()
    expectTypeOf<AvatarMenuViewportProps>().toEqualTypeOf<BaseUiNavigationMenu.Viewport.Props>()
    expectTypeOf<AvatarMenuViewportState>().toEqualTypeOf<BaseUiNavigationMenu.Viewport.State>()
    expectTypeOf<AvatarMenuContentProps>().toEqualTypeOf<BaseUiNavigationMenu.Content.Props>()
    expectTypeOf<AvatarMenuContentState>().toEqualTypeOf<BaseUiNavigationMenu.Content.State>()
    expectTypeOf<AvatarMenuGroupProps['children']>().toMatchTypeOf<ReactNode>()
    expectTypeOf<AvatarMenuGroupProps['stripesProps']>().toEqualTypeOf<
      boolean | AvatarMenuGroupStripesProps | undefined
    >()
    expectTypeOf<AvatarMenuGroupStripesProps['angle']>().toEqualTypeOf<string | undefined>()
    expectTypeOf<AvatarMenuGroupStripesProps['color']>().toEqualTypeOf<string | undefined>()
    expectTypeOf<AvatarMenuGroupStripesProps['gap']>().toEqualTypeOf<string | undefined>()
    expectTypeOf<AvatarMenuGroupStripesProps['width']>().toEqualTypeOf<string | undefined>()
    expectTypeOf<HasNoKey<AvatarMenuGroupStripesProps, 'aria-hidden'>>().toEqualTypeOf<true>()
    expectTypeOf<HasNoKey<AvatarMenuGroupStripesProps, 'aria-labelledby'>>().toEqualTypeOf<true>()
    expectTypeOf<HasNoKey<AvatarMenuGroupStripesProps, 'children'>>().toEqualTypeOf<true>()
    expectTypeOf<
      HasNoKey<AvatarMenuGroupStripesProps, 'dangerouslySetInnerHTML'>
    >().toEqualTypeOf<true>()
    expectTypeOf<HasNoKey<AvatarMenuGroupStripesProps, 'hidden'>>().toEqualTypeOf<true>()
    expectTypeOf<HasNoKey<AvatarMenuGroupStripesProps, 'inert'>>().toEqualTypeOf<true>()
    expectTypeOf<HasNoKey<AvatarMenuGroupStripesProps, 'render'>>().toEqualTypeOf<true>()
    expectTypeOf<HasNoKey<AvatarMenuGroupStripesProps, 'role'>>().toEqualTypeOf<true>()
    expectTypeOf<AvatarMenuGroupState>().toEqualTypeOf<Record<string, never>>()
    expectTypeOf<AvatarMenuGroupLabelProps['id']>().toEqualTypeOf<string | undefined>()
    expectTypeOf<AvatarMenuGroupLabelState>().toEqualTypeOf<Record<string, never>>()
    expectTypeOf<AvatarMenuLinkState>().toEqualTypeOf<BaseUiNavigationMenu.Link.State>()
    expectTypeOf<AvatarMenuRootProps['orientation']>().toEqualTypeOf<
      'horizontal' | 'vertical' | undefined
    >()
    expectTypeOf<HasNoKey<AvatarMenuRootProps, 'delay'>>().toEqualTypeOf<true>()
    expectTypeOf<HasNoKey<AvatarMenuTriggerProps, 'render'>>().toEqualTypeOf<true>()
    expectTypeOf<HasNoKey<AvatarMenuTriggerProps, 'nativeButton'>>().toEqualTypeOf<true>()
    expectTypeOf<HasRequiredKey<AvatarMenuTriggerProps, 'aria-label'>>().toEqualTypeOf<true>()
    expectTypeOf<HasNoKey<AvatarMenuPositionerProps, 'side'>>().toEqualTypeOf<true>()
    expectTypeOf<HasNoKey<AvatarMenuPositionerProps, 'align'>>().toEqualTypeOf<true>()
    expectTypeOf<HasNoKey<AvatarMenuPositionerProps, 'sideOffset'>>().toEqualTypeOf<true>()
    expectTypeOf<HasRequiredKey<AvatarMenuLinkProps, 'icon'>>().toEqualTypeOf<true>()
    expectTypeOf<AvatarMenuLinkProps['icon']>().toEqualTypeOf<PopupSurfaceItemIcon>()
    expectTypeOf<HasNoKey<AvatarMenuNamespace, 'Indicator'>>().toEqualTypeOf<true>()
    expect(PACKAGE_EXPORTS).not.toHaveProperty('AvatarMenuIndicator')
    expect(PACKAGE_EXPORTS).not.toHaveProperty('AvatarMenuArrow')
    expect(PACKAGE_EXPORTS).not.toHaveProperty('AvatarMenuIcon')
    expect(PACKAGE_EXPORTS).not.toHaveProperty('AvatarMenuBackdrop')
  })

  it('UC-019 / UC-002 / UC-004 / UC-006 / UC-007 / UC-008 / UC-009 / UC-010 / UC-016 / UC-017 / EX-001 - opens one shared labeled Popup for Yann, Amina, and Leo with independent Avatar and Popup chrome', async () => {
    const athletes = [
      { fullName: 'Yann Lojewski', id: 'yann', initials: 'YA', name: 'Yann' },
      { fullName: 'Amina Diallo', id: 'amina', initials: 'AM', name: 'Amina' },
      { fullName: 'Leo Martin', id: 'leo', initials: 'LE', name: 'Leo' }
    ] as const
    const links = ['Home', 'Programs', 'Reviews', 'Settings'] as const

    render(
      <AvatarMenu.Root>
        <AvatarMenu.List className="grid gap-2" data-testid="default-list">
          {athletes.map((athlete) => (
            <AvatarMenu.Item key={athlete.id} value={athlete.id}>
              <AvatarMenu.Trigger aria-label={`Open ${athlete.name} navigation`}>
                <PackageExports.Avatar.Fallback>{athlete.initials}</PackageExports.Avatar.Fallback>
              </AvatarMenu.Trigger>
              <AvatarMenu.Content>
                <AvatarMenu.Group>
                  <AvatarMenu.GroupLabel>{athlete.fullName}</AvatarMenu.GroupLabel>
                  {links.map((label) => (
                    <AvatarMenu.Link
                      icon={<svg data-testid={`${athlete.id}-${label.toLowerCase()}-icon`} />}
                      href={label.toLowerCase()}
                      key={label}
                    >
                      {label}
                    </AvatarMenu.Link>
                  ))}
                </AvatarMenu.Group>
              </AvatarMenu.Content>
            </AvatarMenu.Item>
          ))}
        </AvatarMenu.List>
        <AvatarMenu.Portal>
          <AvatarMenu.Positioner data-testid="avatar-positioner">
            <AvatarMenu.Popup data-testid="avatar-popup">
              <div data-testid="passive-popup-layout">
                <AvatarMenu.Viewport data-testid="avatar-viewport" />
              </div>
            </AvatarMenu.Popup>
          </AvatarMenu.Positioner>
        </AvatarMenu.Portal>
      </AvatarMenu.Root>
    )

    const trigger = screen.getByRole('button', { name: 'Open Yann navigation' })

    expect(screen.getByTestId('default-list')).toHaveClass('grid', 'gap-2')
    expect(trigger).toHaveClass('size-9', 'border', 'border-foreground', 'shadow-(--hard-shadow)')
    expect(trigger).toHaveStyle({
      '--hard-shadow': '3px 3px 0 0 var(--color-foreground)'
    })
    expect(trigger.querySelectorAll('button')).toHaveLength(0)
    expect(screen.queryByTestId('avatar-popup')).not.toBeInTheDocument()

    fireEvent.click(trigger)

    const popup = await screen.findByTestId('avatar-popup')
    const positioner = screen.getByTestId('avatar-positioner')
    const viewport = screen.getByTestId('avatar-viewport')
    const homeLink = within(popup).getByRole('link', { name: 'Home' })
    const triggerRevealRoot = trigger.querySelector<HTMLElement>('[data-reveal-root]')
    const homeRevealRoot = homeLink.querySelector<HTMLElement>('[data-reveal-root]')
    const yannGroup = within(popup).getByRole('group', { name: 'Yann Lojewski' })
    const yannGroupLabel = within(yannGroup).getByText('Yann Lojewski')
    const yannStripes = yannGroupLabel.parentElement
    const homeIconCopies = screen.getAllByTestId('yann-home-icon')

    expect(trigger).toHaveAttribute('data-popup-open')
    expect(positioner).toHaveAttribute('data-open')
    expect(positioner).toHaveAttribute('data-align', 'start')
    expect(positioner).toHaveAttribute('data-side')
    expect(popup).toHaveAttribute('data-open')
    expect(popup).toHaveAttribute('data-popup-surface-root')
    expect(popup).toHaveAttribute('data-size', 'md')
    expect(popup).toHaveClass(
      'border',
      'border-foreground',
      'overflow-visible',
      'shadow-(--hard-shadow)',
      'max-w-(--available-width)',
      'max-h-(--available-height)'
    )
    expect(popup).toHaveStyle({
      '--hard-shadow': '0.1875rem 0.1875rem 0 0 var(--color-foreground)',
      '--popup-surface-layout-duration': '300ms'
    })
    expect(viewport).toHaveClass('relative', 'h-full', 'w-full', 'overflow-hidden')
    expect(yannGroup).toHaveAttribute('data-popup-surface-group')
    expect(yannGroup).toHaveAttribute('aria-labelledby', yannGroupLabel.id)
    expect(yannStripes).not.toBe(yannGroup)
    expect(yannStripes?.tagName).toBe('DIV')
    expect(yannStripes?.parentElement).toBe(yannGroup)
    expect(yannStripes).toContainElement(homeLink)
    expect(yannStripes).not.toHaveAttribute('role')
    expect(yannStripes).not.toHaveAttribute('aria-hidden')
    expect(yannStripes).not.toHaveAttribute('hidden')
    expect(yannStripes).not.toHaveAttribute('inert')
    expect(yannStripes?.style.backgroundImage).toContain('repeating-linear-gradient')
    expect(yannStripes?.style.backgroundImage).toContain('var(--stripes-angle, 135deg)')
    expect(yannStripes?.style.backgroundImage).toContain('var(--stripes-gap, 3px)')
    expect(yannStripes?.style.backgroundImage).toContain('var(--stripes-width, 4px)')
    expect(yannStripes?.style.backgroundImage).toContain('var(--stripes-color, var(--muted))')
    expect(yannGroupLabel).toHaveAttribute('data-popup-surface-group-label')
    expect(yannGroupLabel).not.toHaveAttribute('data-size')
    expect(yannGroupLabel).not.toHaveAttribute('data-icon-position')
    expect(yannGroupLabel).not.toHaveAttribute('data-content-inset')
    expect(yannGroupLabel).toHaveClass(
      'flex',
      'items-center',
      'font-heading',
      'text-xl',
      'tracking-wide',
      'lowercase',
      'text-muted-foreground',
      'min-h-[calc(2.25rem-2px)]',
      'py-0',
      'ps-8',
      'pe-2.5'
    )
    expect(yannGroupLabel.querySelector('[data-motion="reveal"]')).toBeNull()
    expect(homeLink).toHaveAttribute('data-popup-surface-item')
    expect(homeLink).toHaveAttribute('data-size', 'md')
    expect(homeLink).toHaveAttribute('data-icon-position', 'start')
    expect(homeLink).toHaveAttribute('data-content-inset', 'start')
    expect(homeLink.querySelector('[data-reveal-source]')).toHaveClass(
      'min-h-[calc(2.25rem-2px)]',
      'py-1.5',
      'ps-8',
      'pe-2.5'
    )
    expect(homeLink.querySelectorAll('[data-motion="reveal"]')).toHaveLength(1)
    for (const [revealRoot, contentMode] of [
      [triggerRevealRoot, 'phrasing'],
      [homeRevealRoot, 'flow']
    ] as const) {
      expect(revealRoot).toHaveAttribute('data-motion', 'reveal')
      expect(revealRoot).toHaveAttribute('data-content-mode', contentMode)
      expect(revealRoot).toHaveAttribute('data-unreveal-behavior', 'return')
      expect(revealRoot).not.toHaveAttribute('data-active-unreveal-behavior')
      expect(revealRoot?.querySelector('[data-reveal-surface]')).toBeInTheDocument()
      expect(revealRoot?.querySelector('[data-reveal-overlay]')).toHaveAttribute(
        'aria-hidden',
        'true'
      )
      expect(revealRoot?.querySelector('[data-reveal-overlay]')).toHaveAttribute('inert')
      expect(revealRoot?.querySelector('[data-reveal-overlay-surface]')).toBeInTheDocument()
      expect(
        revealRoot
          ?.querySelector<HTMLElement>('[data-reveal-copy]')
          ?.style.getPropertyValue('--reveal-offset-x')
      ).not.toBe('')
      expect(
        revealRoot
          ?.querySelector<HTMLElement>('[data-reveal-copy-scale]')
          ?.style.getPropertyValue('--reveal-origin')
      ).not.toBe('')
    }
    expect(homeIconCopies).toHaveLength(2)
    expect(screen.getAllByRole('link', { name: 'Home' })).toHaveLength(1)

    for (const [index, athlete] of athletes.entries()) {
      const currentTrigger = screen.getByRole('button', {
        name: `Open ${athlete.name} navigation`
      })

      if (index > 0) {
        fireEvent.click(currentTrigger)
        await waitFor(() => {
          expect(currentTrigger).toHaveAttribute('data-popup-open')
        })
      }

      expect(screen.getByTestId('avatar-popup')).toBe(popup)
      const group = within(popup).getByRole('group', { name: athlete.fullName })
      const groupLabel = within(group).getByText(athlete.fullName)
      const stripes = groupLabel.parentElement

      expect(group).toHaveAttribute('aria-labelledby', groupLabel.id)
      expect(group).toHaveAttribute('data-popup-surface-group')
      expect(stripes).not.toBe(group)
      expect(stripes?.tagName).toBe('DIV')
      expect(stripes?.parentElement).toBe(group)
      expect(stripes?.style.backgroundImage).toContain('repeating-linear-gradient')
      expect(groupLabel).toHaveAttribute('data-popup-surface-group-label')
      for (const label of links) {
        expect(within(popup).getByRole('link', { name: label })).toHaveAttribute(
          'href',
          label.toLowerCase()
        )
      }
      expect(screen.getAllByTestId(`${athlete.id}-home-icon`)).toHaveLength(2)
    }
  })

  it('UC-019 / UC-020 / EX-007 - configures or removes nested Stripes without changing outer Group semantics or Link interaction', async () => {
    const objectStripesRef = createRef<HTMLDivElement>()
    const onObjectStripesClick = vi.fn()
    const linkClicks = {
      false: vi.fn(),
      object: vi.fn(),
      omitted: vi.fn(),
      true: vi.fn()
    }
    const objectStripesStyle = {
      '--stripes-angle': '60deg',
      '--stripes-color': 'red',
      '--stripes-gap': '8px',
      '--stripes-width': '1px',
      color: 'rgb(1, 2, 3)'
    } as CSSProperties
    const athletes = [
      {
        fullName: 'Amina Diallo',
        id: 'omitted',
        initials: 'AM',
        stripesProps: undefined
      },
      {
        fullName: 'True Stripes',
        id: 'true',
        initials: 'TS',
        stripesProps: true
      },
      {
        fullName: 'Yann Lojewski',
        id: 'object',
        initials: 'YA',
        stripesProps: {
          angle: '45deg',
          className: 'text-muted-foreground',
          color: 'currentColor',
          'data-stripes-form': 'object',
          gap: '6px',
          onClick: onObjectStripesClick,
          ref: objectStripesRef,
          style: objectStripesStyle,
          width: '2px'
        }
      },
      {
        fullName: 'Leo Martin',
        id: 'false',
        initials: 'LE',
        stripesProps: false
      }
    ] as const satisfies readonly {
      fullName: string
      id: keyof typeof linkClicks
      initials: string
      stripesProps: boolean | AvatarMenuGroupStripesProps | undefined
    }[]

    render(
      <AvatarMenu.Root defaultValue="omitted">
        <AvatarMenu.List className="grid gap-2">
          {athletes.map((athlete) => (
            <AvatarMenu.Item key={athlete.id} value={athlete.id}>
              <AvatarMenu.Trigger aria-label={`Open ${athlete.id} navigation`}>
                <PackageExports.Avatar.Fallback>{athlete.initials}</PackageExports.Avatar.Fallback>
              </AvatarMenu.Trigger>
              <AvatarMenu.Content>
                <AvatarMenu.Group
                  className="consumer-group"
                  data-group-form={athlete.id}
                  stripesProps={athlete.stripesProps}
                  style={{ borderTopWidth: '3px' }}
                >
                  <AvatarMenu.GroupLabel>{athlete.fullName}</AvatarMenu.GroupLabel>
                  <AvatarMenu.Link
                    href={`${athlete.id}/home`}
                    icon={<svg />}
                    onClick={linkClicks[athlete.id]}
                  >
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
    )

    for (const [index, athlete] of athletes.entries()) {
      if (index > 0) {
        fireEvent.click(screen.getByRole('button', { name: `Open ${athlete.id} navigation` }))
      }

      const group = await screen.findByRole('group', { name: athlete.fullName })
      const groupLabel = within(group).getByText(athlete.fullName)
      const link = within(group).getByRole('link', {
        name: `Home for ${athlete.fullName}`
      })
      const stripes = groupLabel.parentElement

      expect(group).toHaveAttribute('data-popup-surface-group')
      expect(group).toHaveAttribute('data-group-form', athlete.id)
      expect(group).toHaveAttribute('aria-labelledby', groupLabel.id)
      expect(group).toHaveClass('consumer-group')
      expect(group).toHaveStyle({ borderTopWidth: '3px' })
      expect(groupLabel).toHaveAttribute('data-popup-surface-group-label')
      expect(link).toHaveAttribute('href', `${athlete.id}/home`)

      act(() => {
        link.focus()
      })
      expect(link).toHaveFocus()

      if (athlete.stripesProps === false) {
        expect(stripes).toBe(group)
        expect(link.parentElement).toBe(group)
        expect(group.style.backgroundImage).not.toContain('repeating-linear-gradient')
      } else {
        expect(stripes).not.toBe(group)
        expect(stripes?.tagName).toBe('DIV')
        expect(stripes?.parentElement).toBe(group)
        expect(stripes).toContainElement(link)
        expect(stripes).not.toHaveAttribute('role')
        expect(stripes).not.toHaveAttribute('aria-labelledby')
        expect(stripes).not.toHaveAttribute('aria-hidden')
        expect(stripes).not.toHaveAttribute('hidden')
        expect(stripes).not.toHaveAttribute('inert')
        expect(stripes?.style.backgroundImage).toContain('repeating-linear-gradient')

        if (typeof athlete.stripesProps === 'object') {
          expect(stripes).toHaveAttribute('data-stripes-form', 'object')
          expect(stripes).toHaveClass('text-muted-foreground')
          expect(stripes).toHaveStyle({ color: 'rgb(1, 2, 3)' })
          expect(stripes?.style.getPropertyValue('--stripes-angle')).toBe('45deg')
          expect(stripes?.style.getPropertyValue('--stripes-color')).toBe('currentColor')
          expect(stripes?.style.getPropertyValue('--stripes-gap')).toBe('6px')
          expect(stripes?.style.getPropertyValue('--stripes-width')).toBe('2px')
          expect(objectStripesRef.current).toBe(stripes)

          fireEvent.click(stripes as HTMLDivElement)
          expect(onObjectStripesClick).toHaveBeenCalledOnce()
        } else {
          expect(stripes?.style.backgroundImage).toContain('var(--stripes-angle, 135deg)')
          expect(stripes?.style.backgroundImage).toContain('var(--stripes-gap, 3px)')
          expect(stripes?.style.backgroundImage).toContain('var(--stripes-width, 4px)')
          expect(stripes?.style.backgroundImage).toContain('var(--stripes-color, var(--muted))')
        }
      }

      fireEvent.click(link)
      expect(linkClicks[athlete.id]).toHaveBeenCalledOnce()
    }
  })

  it.each(['missing', 'duplicate'] as const)(
    'UC-001 / UC-017 - rejects a Popup with a %s Viewport contract',
    (mode) => {
      expect(() =>
        render(
          <AvatarMenu.Root defaultValue="yann">
            <AvatarMenu.List>
              <AvatarMenu.Item value="yann">
                <AvatarMenu.Trigger aria-label="Open Yann navigation">
                  <PackageExports.Avatar.Fallback>YA</PackageExports.Avatar.Fallback>
                </AvatarMenu.Trigger>
                <AvatarMenu.Content>
                  <AvatarMenu.Group>
                    <AvatarMenu.GroupLabel>Yann Lojewski</AvatarMenu.GroupLabel>
                  </AvatarMenu.Group>
                </AvatarMenu.Content>
              </AvatarMenu.Item>
            </AvatarMenu.List>
            <AvatarMenu.Portal>
              <AvatarMenu.Positioner>
                <AvatarMenu.Popup>
                  {mode === 'duplicate' ? (
                    <>
                      <AvatarMenu.Viewport />
                      <AvatarMenu.Viewport />
                    </>
                  ) : null}
                </AvatarMenu.Popup>
              </AvatarMenu.Positioner>
            </AvatarMenu.Portal>
          </AvatarMenu.Root>
        )
      ).toThrow(/exactly one.*Viewport|Viewport.*exactly one/i)
    }
  )

  it('UC-002 / UC-005 / UC-008 / UC-009 / UC-012 / UC-016 / EX-002 / QA-001 / CR-002 - transitions athlete-specific Content for external controlled value changes', async () => {
    const onValueChange = vi.fn()
    const onOpenChangeComplete = vi.fn()
    let setControlledValue: ((value: AvatarMenuRootValue) => void) | undefined
    let resolveAminaExit: (() => void) | undefined
    let resolveYannExit: (() => void) | undefined
    const aminaExitFinished = new Promise<void>((resolve) => {
      resolveAminaExit = resolve
    })
    const yannExitFinished = new Promise<void>((resolve) => {
      resolveYannExit = resolve
    })

    function ControlledAvatarMenu() {
      const [value, setValue] = useState<AvatarMenuRootValue>('amina')

      setControlledValue = setValue

      return (
        <div>
          <PackageExports.Button onClick={() => setValue('amina')} type="button">
            open Amina
          </PackageExports.Button>
          <PackageExports.Button onClick={() => setValue('yann')} type="button">
            open Yann
          </PackageExports.Button>
          <PackageExports.Button onClick={() => setValue(null)} type="button">
            close
          </PackageExports.Button>
          <AvatarMenu.Root
            onOpenChangeComplete={onOpenChangeComplete}
            onValueChange={(nextValue, details) => {
              onValueChange(nextValue, details)
              setValue(nextValue)
            }}
            value={value}
          >
            <AvatarMenu.List className="grid gap-2">
              <AvatarMenu.Item value="amina">
                <AvatarMenu.Trigger active aria-label="Open Amina navigation">
                  <PackageExports.Avatar.Fallback>AM</PackageExports.Avatar.Fallback>
                </AvatarMenu.Trigger>
                <AvatarMenu.Content data-testid="controlled-amina-content">
                  <AvatarMenu.Group>
                    <AvatarMenu.GroupLabel>Amina Diallo</AvatarMenu.GroupLabel>
                    <AvatarMenu.Link icon={<svg />} href="amina/home">
                      Home for Amina
                    </AvatarMenu.Link>
                    <AvatarMenu.Link active icon={<svg />} href="amina/programs">
                      Programs for Amina
                    </AvatarMenu.Link>
                  </AvatarMenu.Group>
                </AvatarMenu.Content>
              </AvatarMenu.Item>
              <AvatarMenu.Item value="yann">
                <AvatarMenu.Trigger aria-label="Open Yann navigation">
                  <PackageExports.Avatar.Fallback>YA</PackageExports.Avatar.Fallback>
                </AvatarMenu.Trigger>
                <AvatarMenu.Content data-testid="controlled-yann-content">
                  <AvatarMenu.Group>
                    <AvatarMenu.GroupLabel>Yann Lojewski</AvatarMenu.GroupLabel>
                    <AvatarMenu.Link icon={<svg />} href="yann/home">
                      Home for Yann
                    </AvatarMenu.Link>
                    <AvatarMenu.Link active icon={<svg />} href="yann/programs">
                      Programs for Yann
                    </AvatarMenu.Link>
                  </AvatarMenu.Group>
                </AvatarMenu.Content>
              </AvatarMenu.Item>
            </AvatarMenu.List>
            <AvatarMenu.Portal keepMounted>
              <AvatarMenu.Positioner>
                <AvatarMenu.Popup data-testid="controlled-popup">
                  <AvatarMenu.Viewport />
                </AvatarMenu.Popup>
              </AvatarMenu.Positioner>
            </AvatarMenu.Portal>
          </AvatarMenu.Root>
        </div>
      )
    }

    render(<ControlledAvatarMenu />)

    const aminaTrigger = screen.getByRole('button', { name: 'Open Amina navigation' })
    const yannTrigger = screen.getByRole('button', { name: 'Open Yann navigation' })
    const popup = await screen.findByTestId('controlled-popup')
    const activeLink = within(popup).getByRole('link', { name: 'Programs for Amina' })
    const aminaContent = screen.getByTestId('controlled-amina-content')

    Object.defineProperty(aminaContent, 'getAnimations', {
      configurable: true,
      value: vi.fn(() => [{ finished: aminaExitFinished }])
    })

    expect(aminaTrigger).toHaveAttribute('data-active')
    expect(aminaTrigger).toHaveAttribute('data-popup-open')
    expect(yannTrigger).not.toHaveAttribute('data-popup-open')
    expect(activeLink).toHaveAttribute('data-active')
    expect(activeLink).toHaveAttribute('data-revealed')
    expect(popup).toHaveAttribute('data-open')
    for (const [revealOwner, contentMode] of [
      [aminaTrigger, 'phrasing'],
      [activeLink, 'flow']
    ] as const) {
      const revealRoot = revealOwner.querySelector('[data-reveal-root]')
      const revealOverlay = revealOwner.querySelector('[data-reveal-overlay]')

      expect(revealRoot).toHaveAttribute('data-motion', 'reveal')
      expect(revealRoot).toHaveAttribute('data-content-mode', contentMode)
      expect(revealRoot).toHaveAttribute('data-unreveal-behavior', 'return')
      expect(revealRoot).not.toHaveAttribute('data-active-unreveal-behavior')
      expect(revealOverlay).toHaveAttribute('aria-hidden', 'true')
      expect(revealOverlay).toHaveAttribute('inert')
    }
    expect(onValueChange).not.toHaveBeenCalled()

    fireEvent.click(screen.getByRole('button', { name: 'open Yann' }))

    const yannContent = await screen.findByTestId('controlled-yann-content')

    await waitFor(() => {
      expect(yannContent).toHaveAttribute('data-activation-direction', 'down')
      expect(aminaContent).toHaveAttribute('data-activation-direction', 'down')
      expect(aminaContent).toHaveAttribute('data-ending-style')
    })
    expect(within(yannContent).getByRole('link', { name: 'Home for Yann' })).toBeInTheDocument()
    expect(within(aminaContent).getByRole('link', { name: 'Home for Amina' })).toBeInTheDocument()
    expect(aminaTrigger).toHaveAttribute('data-active')
    expect(aminaTrigger).not.toHaveAttribute('data-popup-open')
    expect(yannTrigger).toHaveAttribute('data-popup-open')
    expect(popup).toHaveAttribute('data-open')
    expect(popup).toBe(screen.getByTestId('controlled-popup'))
    expect(onValueChange).toHaveBeenCalledOnce()
    expect(onValueChange).toHaveBeenCalledWith(
      null,
      expect.objectContaining({
        allowPropagation: expect.any(Function),
        cancel: expect.any(Function),
        event: expect.any(MouseEvent),
        reason: 'outside-press'
      })
    )

    resolveAminaExit?.()

    await waitFor(() => {
      expect(screen.queryByTestId('controlled-amina-content')).not.toBeInTheDocument()
    })

    Object.defineProperty(yannContent, 'getAnimations', {
      configurable: true,
      value: vi.fn(() => [{ finished: yannExitFinished }])
    })

    act(() => {
      setControlledValue?.(null)
    })

    await waitFor(() => {
      expect(yannContent).toHaveAttribute('data-ending-style')
      expect(yannContent).not.toHaveAttribute('data-activation-direction')
    })

    resolveYannExit?.()

    await waitFor(() => {
      expect(onOpenChangeComplete).toHaveBeenCalledWith(false)
      expect(popup).toHaveAttribute('data-closed')
    })

    fireEvent.click(aminaTrigger)

    await waitFor(() => {
      expect(onValueChange).toHaveBeenCalledWith(
        'amina',
        expect.objectContaining({
          allowPropagation: expect.any(Function),
          cancel: expect.any(Function),
          reason: 'trigger-press'
        })
      )
      expect(screen.getByTestId('controlled-amina-content')).not.toHaveAttribute(
        'data-activation-direction'
      )
      expect(aminaTrigger).toHaveAttribute('data-popup-open')
      expect(aminaTrigger).toHaveAttribute('data-active')
      expect(popup).toHaveAttribute('data-open')
      expect(popup).toBe(screen.getByTestId('controlled-popup'))
    })

    act(() => {
      setControlledValue?.(null)
    })

    await waitFor(() => {
      expect(aminaTrigger).toHaveAttribute('data-active')
      expect(aminaTrigger).not.toHaveAttribute('data-popup-open')
      expect(popup).toHaveAttribute('data-closed')
    })
  })

  it('UC-002 / UC-009 / UC-016 / EX-003 - preserves uncontrolled defaults, close delay, and Link closeOnClick behavior', async () => {
    const closeByDefault = vi.fn()
    const defaultProbe = render(
      <AvatarMenu.Root closeDelay={120} defaultValue="amina" onValueChange={closeByDefault}>
        <AvatarMenu.List className="grid gap-2">
          <AvatarMenu.Item value="amina">
            <AvatarMenu.Trigger aria-label="Open Amina navigation">
              <PackageExports.Avatar.Fallback>AM</PackageExports.Avatar.Fallback>
            </AvatarMenu.Trigger>
            <AvatarMenu.Content>
              <AvatarMenu.Group>
                <AvatarMenu.GroupLabel>Amina Diallo</AvatarMenu.GroupLabel>
                <AvatarMenu.Link icon={<svg />} href="reviews">
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

    fireEvent.click(await screen.findByRole('link', { name: 'Reviews' }))

    expect(closeByDefault).toHaveBeenCalledWith(
      null,
      expect.objectContaining({ reason: 'link-press' })
    )

    defaultProbe.unmount()

    const remainOpen = vi.fn()

    render(
      <AvatarMenu.Root defaultValue="amina" onValueChange={remainOpen}>
        <AvatarMenu.List className="grid gap-2">
          <AvatarMenu.Item value="amina">
            <AvatarMenu.Trigger aria-label="Open Amina navigation">
              <PackageExports.Avatar.Fallback>AM</PackageExports.Avatar.Fallback>
            </AvatarMenu.Trigger>
            <AvatarMenu.Content>
              <AvatarMenu.Group>
                <AvatarMenu.GroupLabel>Amina Diallo</AvatarMenu.GroupLabel>
                <AvatarMenu.Link closeOnClick={false} icon={<svg />} href="help">
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

    fireEvent.click(await screen.findByRole('link', { name: 'Help' }))

    expect(remainOpen).not.toHaveBeenCalled()
    expect(screen.getByRole('link', { name: 'Help' })).toBeInTheDocument()
  })

  it('UC-009 / UC-010 / UC-017 / EX-004 - composes one router Link while duplicating only semantic-free visuals', async () => {
    const routerRef = createRef<HTMLAnchorElement>()
    const onClick = vi.fn()

    const RouterLink = forwardRef<
      HTMLAnchorElement,
      ComponentPropsWithoutRef<'a'> & { to: string }
    >(function RouterLink({ to, ...props }, ref) {
      return <a {...props} data-router-link="" href={to} ref={ref} />
    })

    render(
      <AvatarMenu.Root defaultValue="yann">
        <AvatarMenu.List className="grid gap-2">
          <AvatarMenu.Item value="yann">
            <AvatarMenu.Trigger aria-label="Open Yann navigation">
              <PackageExports.Avatar.Fallback>YA</PackageExports.Avatar.Fallback>
            </AvatarMenu.Trigger>
            <AvatarMenu.Content>
              <AvatarMenu.Group>
                <AvatarMenu.GroupLabel>Yann Lojewski</AvatarMenu.GroupLabel>
                <AvatarMenu.Link
                  icon={<svg data-testid="router-icon" />}
                  onClick={onClick}
                  ref={routerRef}
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

    const link = await screen.findByRole('link', { name: 'Programs' })

    expect(screen.getAllByRole('link', { name: 'Programs' })).toHaveLength(1)
    expect(link).toHaveAttribute('data-router-link')
    expect(link).toHaveAttribute('href', 'programs')
    expect(routerRef.current).toBe(link)
    expect(screen.getAllByTestId('router-icon')).toHaveLength(2)
    expect(link.querySelector('[data-reveal-overlay]')).toHaveAttribute('aria-hidden', 'true')

    fireEvent.click(link)

    expect(onClick).toHaveBeenCalledOnce()
  })

  it('UC-006 / UC-007 / UC-008 / UC-011 / UC-012 / UC-013 / EX-005 - retargets one shared Popup and vertical Content transition', async () => {
    let resolveAminaExit: (() => void) | undefined
    let resolveYannExit: (() => void) | undefined
    const aminaExitFinished = new Promise<void>((resolve) => {
      resolveAminaExit = resolve
    })
    const yannExitFinished = new Promise<void>((resolve) => {
      resolveYannExit = resolve
    })

    function MovingAvatarMenu() {
      const [value, setValue] = useState<AvatarMenuRootValue>('amina')

      return (
        <AvatarMenu.Root onValueChange={setValue} value={value}>
          <AvatarMenu.List className="grid gap-2">
            <AvatarMenu.Item value="amina">
              <AvatarMenu.Trigger aria-label="Open Amina navigation">
                <PackageExports.Avatar.Fallback>AM</PackageExports.Avatar.Fallback>
              </AvatarMenu.Trigger>
              <AvatarMenu.Content data-testid="amina-content">
                <AvatarMenu.Group>
                  <AvatarMenu.GroupLabel>Amina Diallo</AvatarMenu.GroupLabel>
                  <AvatarMenu.Link icon={<svg />} href="home">
                    Home
                  </AvatarMenu.Link>
                  <AvatarMenu.Link icon={<svg />} href="calendar">
                    Competition calendar
                  </AvatarMenu.Link>
                </AvatarMenu.Group>
              </AvatarMenu.Content>
            </AvatarMenu.Item>
            <AvatarMenu.Item value="yann">
              <AvatarMenu.Trigger aria-label="Open Yann navigation">
                <PackageExports.Avatar.Fallback>YA</PackageExports.Avatar.Fallback>
              </AvatarMenu.Trigger>
              <AvatarMenu.Content data-testid="yann-content">
                <AvatarMenu.Group>
                  <AvatarMenu.GroupLabel>Yann Lojewski</AvatarMenu.GroupLabel>
                  <AvatarMenu.Link icon={<svg />} href="programs">
                    Programs
                  </AvatarMenu.Link>
                </AvatarMenu.Group>
              </AvatarMenu.Content>
            </AvatarMenu.Item>
          </AvatarMenu.List>
          <AvatarMenu.Portal keepMounted>
            <AvatarMenu.Positioner data-testid="moving-positioner">
              <AvatarMenu.Popup data-testid="moving-popup">
                <AvatarMenu.Viewport />
              </AvatarMenu.Popup>
            </AvatarMenu.Positioner>
          </AvatarMenu.Portal>
        </AvatarMenu.Root>
      )
    }

    render(<MovingAvatarMenu />)

    const popup = await screen.findByTestId('moving-popup')
    const positioner = screen.getByTestId('moving-positioner')
    const aminaTrigger = screen.getByRole('button', { name: 'Open Amina navigation' })
    const yannTrigger = screen.getByRole('button', { name: 'Open Yann navigation' })
    const aminaContent = screen.getByTestId('amina-content')

    vi.spyOn(aminaTrigger, 'getBoundingClientRect').mockReturnValue(new DOMRect(0, 0, 36, 36))
    vi.spyOn(yannTrigger, 'getBoundingClientRect').mockReturnValue(new DOMRect(0, 80, 36, 36))
    Object.defineProperty(aminaContent, 'getAnimations', {
      configurable: true,
      value: vi.fn(() => [{ finished: aminaExitFinished }])
    })

    expect(positioner).toHaveAttribute('data-open')
    expect(positioner).toHaveAttribute('data-align')
    expect(positioner).toHaveAttribute('data-side')
    expect(popup).toHaveAttribute('data-open')
    expect(popup).toHaveStyle({
      '--popup-surface-layout-duration': '300ms',
      '--popup-surface-layout-easing': 'cubic-bezier(0.22, 1, 0.36, 1)'
    })

    fireEvent.click(yannTrigger)

    const incoming = await screen.findByTestId('yann-content')
    const outgoing = screen.getByTestId('amina-content')

    await waitFor(() => {
      expect(incoming).toHaveAttribute('data-activation-direction', 'down')
      expect(outgoing).toHaveAttribute('data-ending-style')
    })
    Object.defineProperty(incoming, 'getAnimations', {
      configurable: true,
      value: vi.fn(() => [{ finished: yannExitFinished }])
    })

    fireEvent.click(aminaTrigger)

    await waitFor(() => {
      expect(screen.getByTestId('amina-content')).toHaveAttribute('data-activation-direction', 'up')
      expect(screen.getByTestId('yann-content')).toHaveAttribute('data-ending-style')
    })

    resolveAminaExit?.()
    resolveYannExit?.()

    await waitFor(() => {
      expect(screen.queryByTestId('yann-content')).not.toBeInTheDocument()
    })
  })

  it('UC-003 / UC-006 / UC-017 / EX-006 / QA-002 / QA-003 - preserves fixed vertical non-looping keyboard navigation and logical placement from ancestor RTL', async () => {
    render(
      <div dir="rtl">
        <AvatarMenu.Root>
          <AvatarMenu.List className="grid gap-2">
            {['amina', 'yann'].map((athlete) => (
              <AvatarMenu.Item key={athlete} value={athlete}>
                <AvatarMenu.Trigger aria-label={`Open ${athlete} navigation`}>
                  <PackageExports.Avatar.Fallback>
                    {athlete.slice(0, 2)}
                  </PackageExports.Avatar.Fallback>
                </AvatarMenu.Trigger>
                <AvatarMenu.Content>
                  <AvatarMenu.Group>
                    <AvatarMenu.GroupLabel>
                      {athlete === 'amina' ? 'Amina Diallo' : 'Yann Lojewski'}
                    </AvatarMenu.GroupLabel>
                    <AvatarMenu.Link icon={<svg />} href="home">
                      {athlete} home
                    </AvatarMenu.Link>
                  </AvatarMenu.Group>
                </AvatarMenu.Content>
              </AvatarMenu.Item>
            ))}
          </AvatarMenu.List>
          <AvatarMenu.Portal>
            <AvatarMenu.Positioner collisionAvoidance={{ align: 'none', side: 'none' }}>
              <AvatarMenu.Popup data-testid="rtl-popup">
                <AvatarMenu.Viewport />
              </AvatarMenu.Popup>
            </AvatarMenu.Positioner>
          </AvatarMenu.Portal>
        </AvatarMenu.Root>
      </div>
    )

    const first = screen.getByRole('button', { name: 'Open amina navigation' })
    const second = screen.getByRole('button', { name: 'Open yann navigation' })

    fireEvent.focus(first)
    fireEvent.keyDown(first, { key: 'ArrowDown' })

    await waitFor(() => {
      expect(second).toHaveFocus()
    })

    fireEvent.keyDown(second, { key: 'ArrowDown' })

    await waitFor(() => {
      expect(second).toHaveFocus()
    })

    fireEvent.keyDown(second, { key: 'ArrowUp' })

    await waitFor(() => {
      expect(first).toHaveFocus()
    })

    fireEvent.keyDown(first, { key: 'ArrowRight' })

    expect(first).not.toHaveAttribute('data-popup-open')
    expect(screen.queryByTestId('rtl-popup')).not.toBeInTheDocument()

    fireEvent.keyDown(first, { key: 'ArrowLeft' })

    const popup = await screen.findByTestId('rtl-popup')

    expect(first).toHaveAttribute('data-popup-open')
    expect(popup).toHaveAttribute('data-side', 'left')
    expect(popup).toHaveAttribute('data-open')

    fireEvent.keyDown(first, { key: 'Enter' })
    fireEvent.keyDown(first, { key: ' ' })
  })

  it('UC-003 / CR-007 - moves focus across disabled Triggers without looping', async () => {
    render(
      <AvatarMenu.Root>
        <AvatarMenu.List>
          <AvatarMenu.Item value="amina">
            <AvatarMenu.Trigger aria-label="Open Amina navigation">
              <PackageExports.Avatar.Fallback>AM</PackageExports.Avatar.Fallback>
            </AvatarMenu.Trigger>
            <AvatarMenu.Content>
              <AvatarMenu.Group>
                <AvatarMenu.GroupLabel>Amina Diallo</AvatarMenu.GroupLabel>
              </AvatarMenu.Group>
            </AvatarMenu.Content>
          </AvatarMenu.Item>
          <AvatarMenu.Item value="disabled">
            <AvatarMenu.Trigger aria-label="Unavailable navigation" disabled>
              <PackageExports.Avatar.Fallback>UN</PackageExports.Avatar.Fallback>
            </AvatarMenu.Trigger>
            <AvatarMenu.Content>
              <AvatarMenu.Group>
                <AvatarMenu.GroupLabel>Unavailable athlete</AvatarMenu.GroupLabel>
              </AvatarMenu.Group>
            </AvatarMenu.Content>
          </AvatarMenu.Item>
          <AvatarMenu.Item value="yann">
            <AvatarMenu.Trigger aria-label="Open Yann navigation">
              <PackageExports.Avatar.Fallback>YA</PackageExports.Avatar.Fallback>
            </AvatarMenu.Trigger>
            <AvatarMenu.Content>
              <AvatarMenu.Group>
                <AvatarMenu.GroupLabel>Yann Lojewski</AvatarMenu.GroupLabel>
              </AvatarMenu.Group>
            </AvatarMenu.Content>
          </AvatarMenu.Item>
        </AvatarMenu.List>
      </AvatarMenu.Root>
    )

    const first = screen.getByRole('button', { name: 'Open Amina navigation' })
    const disabled = screen.getByRole('button', { name: 'Unavailable navigation' })
    const last = screen.getByRole('button', { name: 'Open Yann navigation' })

    expect(disabled).toHaveAttribute('aria-disabled', 'true')

    first.focus()
    fireEvent.keyDown(first, { key: 'ArrowDown' })

    await waitFor(() => {
      expect(last).toHaveFocus()
    })

    fireEvent.keyDown(last, { key: 'ArrowDown' })

    await waitFor(() => {
      expect(last).toHaveFocus()
    })

    fireEvent.keyDown(last, { key: 'ArrowUp' })

    await waitFor(() => {
      expect(first).toHaveFocus()
    })
  })

  it.each([
    ['omitted', undefined],
    ['vertical', 'vertical'],
    ['horizontal', 'horizontal']
  ] as const)(
    'UC-021 / CR-011 - accepts %s orientation without changing semantics or exposing custom orientation state and attributes',
    (_mode, orientation) => {
      let rootState: AvatarMenuRootState | undefined
      let listState: AvatarMenuListState | undefined
      const rootClassName = vi.fn((state: AvatarMenuRootState) => {
        rootState = state
        return 'consumer-root'
      })
      const listClassName = vi.fn((state: AvatarMenuListState) => {
        listState = state
        return 'consumer-list'
      })

      render(
        <AvatarMenu.Root
          aria-label={`${_mode} athlete navigation`}
          className={rootClassName}
          orientation={orientation}
        >
          <AvatarMenu.List className={listClassName}>
            <AvatarMenu.Item value="amina">
              <AvatarMenu.Trigger aria-label="Open Amina navigation">
                <PackageExports.Avatar.Fallback>AM</PackageExports.Avatar.Fallback>
              </AvatarMenu.Trigger>
              <AvatarMenu.Content>
                <AvatarMenu.Group>
                  <AvatarMenu.GroupLabel>Amina Diallo</AvatarMenu.GroupLabel>
                </AvatarMenu.Group>
              </AvatarMenu.Content>
            </AvatarMenu.Item>
          </AvatarMenu.List>
        </AvatarMenu.Root>
      )

      const root = screen.getByRole('navigation', { name: `${_mode} athlete navigation` })
      const list = screen.getByRole('list')

      expect(root.tagName).toBe('NAV')
      expect(list.tagName).toBe('UL')
      expect(screen.getByRole('button', { name: 'Open Amina navigation' })).toBeInTheDocument()
      expect(root).not.toHaveAttribute('data-orientation')
      expect(root).not.toHaveAttribute('aria-orientation')
      expect(list).not.toHaveAttribute('data-orientation')
      expect(list).not.toHaveAttribute('aria-orientation')
      expect(Object.keys(rootState ?? {})).not.toContain('orientation')
      expect(Object.keys(listState ?? {})).not.toContain('orientation')
    }
  )

  it.each([
    ['ltr', 'ArrowRight', 'ArrowLeft'],
    ['rtl', 'ArrowLeft', 'ArrowRight']
  ] as const)(
    'UC-003 / UC-006 / UC-018 / UC-021 / EX-008 / CR-011 - preserves horizontal %s keyboard navigation, physical bottom placement, and non-looping disabled-item handling',
    async (direction, nextKey, previousKey) => {
      const positionerClassName = vi.fn((_state: AvatarMenuPositionerState) => undefined)
      const popupClassName = vi.fn((_state: AvatarMenuPopupState) => undefined)

      render(
        <div dir={direction}>
          <AvatarMenu.Root orientation="horizontal">
            <AvatarMenu.List>
              <AvatarMenu.Item value="amina">
                <AvatarMenu.Trigger aria-label="Open Amina navigation">
                  <PackageExports.Avatar.Fallback>AM</PackageExports.Avatar.Fallback>
                </AvatarMenu.Trigger>
                <AvatarMenu.Content>
                  <AvatarMenu.Group>
                    <AvatarMenu.GroupLabel>Amina Diallo</AvatarMenu.GroupLabel>
                  </AvatarMenu.Group>
                </AvatarMenu.Content>
              </AvatarMenu.Item>
              <AvatarMenu.Item value="disabled">
                <AvatarMenu.Trigger aria-label="Unavailable navigation" disabled>
                  <PackageExports.Avatar.Fallback>UN</PackageExports.Avatar.Fallback>
                </AvatarMenu.Trigger>
                <AvatarMenu.Content>
                  <AvatarMenu.Group>
                    <AvatarMenu.GroupLabel>Unavailable athlete</AvatarMenu.GroupLabel>
                  </AvatarMenu.Group>
                </AvatarMenu.Content>
              </AvatarMenu.Item>
              <AvatarMenu.Item value="yann">
                <AvatarMenu.Trigger aria-label="Open Yann navigation">
                  <PackageExports.Avatar.Fallback>YA</PackageExports.Avatar.Fallback>
                </AvatarMenu.Trigger>
                <AvatarMenu.Content>
                  <AvatarMenu.Group>
                    <AvatarMenu.GroupLabel>Yann Lojewski</AvatarMenu.GroupLabel>
                  </AvatarMenu.Group>
                </AvatarMenu.Content>
              </AvatarMenu.Item>
            </AvatarMenu.List>
            <AvatarMenu.Portal>
              <AvatarMenu.Positioner
                className={positionerClassName}
                collisionAvoidance={{ align: 'none', side: 'none' }}
                data-testid="horizontal-keyboard-positioner"
              >
                <AvatarMenu.Popup
                  className={popupClassName}
                  data-testid="horizontal-keyboard-popup"
                >
                  <AvatarMenu.Viewport />
                </AvatarMenu.Popup>
              </AvatarMenu.Positioner>
            </AvatarMenu.Portal>
          </AvatarMenu.Root>
        </div>
      )

      const first = screen.getByRole('button', { name: 'Open Amina navigation' })
      const disabled = screen.getByRole('button', { name: 'Unavailable navigation' })
      const last = screen.getByRole('button', { name: 'Open Yann navigation' })

      expect(disabled).toHaveAttribute('aria-disabled', 'true')

      fireEvent.focus(first)
      fireEvent.keyDown(first, { key: nextKey })

      await waitFor(() => {
        expect(last).toHaveFocus()
      })

      fireEvent.keyDown(last, { key: nextKey })

      await waitFor(() => {
        expect(last).toHaveFocus()
      })

      fireEvent.keyDown(last, { key: previousKey })

      await waitFor(() => {
        expect(first).toHaveFocus()
      })

      fireEvent.keyDown(first, { key: direction === 'ltr' ? 'ArrowLeft' : 'ArrowRight' })
      expect(first).toHaveFocus()
      expect(first).not.toHaveAttribute('data-popup-open')

      fireEvent.keyDown(first, { key: 'ArrowDown' })

      const popup = await screen.findByTestId('horizontal-keyboard-popup')
      const positioner = screen.getByTestId('horizontal-keyboard-positioner')

      expect(first).toHaveAttribute('data-popup-open')
      expect(positioner).toHaveAttribute('data-align', 'start')
      expect(positioner).toHaveAttribute('data-side', 'bottom')
      expect(popup).toHaveAttribute('data-align', 'start')
      expect(popup).toHaveAttribute('data-side', 'bottom')
      expect(positionerClassName).toHaveBeenCalledWith(
        expect.objectContaining({ align: 'start', open: true, side: 'bottom' })
      )
      expect(popupClassName).toHaveBeenCalledWith(
        expect.objectContaining({ align: 'start', open: true, side: 'bottom' })
      )
      expect(positioner?.style.getPropertyValue('--anchor-height')).not.toBe('')
      expect(positioner?.style.getPropertyValue('--anchor-width')).not.toBe('')

      fireEvent.keyDown(first, { key: 'Enter' })
      fireEvent.keyDown(first, { key: ' ' })
    }
  )

  it.each([
    ['interaction-ltr', 'ltr', false, 'right', 'left'],
    ['interaction-rtl', 'rtl', false, 'left', 'right'],
    ['controlled-ltr', 'ltr', true, 'right', 'left'],
    ['controlled-rtl', 'rtl', true, 'left', 'right']
  ] as const)(
    'UC-011 / UC-012 / UC-013 / EX-008 / QA-001 / CR-011 - exposes horizontal physical direction and public Content lifecycle for %s changes',
    async (_mode, direction, controlled, forwardDirection, reverseDirection) => {
      const aminaClassName = vi.fn((_state: AvatarMenuContentState) => undefined)
      const yannClassName = vi.fn((_state: AvatarMenuContentState) => undefined)
      let resolveAminaExit: (() => void) | undefined
      let resolveYannExit: (() => void) | undefined
      const aminaExitFinished = new Promise<void>((resolve) => {
        resolveAminaExit = resolve
      })
      const yannExitFinished = new Promise<void>((resolve) => {
        resolveYannExit = resolve
      })

      function HorizontalMovementProbe() {
        const [value, setValue] = useState<AvatarMenuRootValue>('amina')
        const [activationDirection, setActivationDirection] = useState<'left' | 'none' | 'right'>(
          'none'
        )

        return (
          <div dir={direction}>
            {controlled ? (
              <div aria-label="External Avatar controls" role="group">
                <button
                  onClick={() => {
                    setActivationDirection(reverseDirection)
                    setValue('amina')
                  }}
                  type="button"
                >
                  Open Amina externally
                </button>
                <button
                  onClick={() => {
                    setActivationDirection(forwardDirection)
                    setValue('yann')
                  }}
                  type="button"
                >
                  Open Yann externally
                </button>
              </div>
            ) : null}
            <AvatarMenu.Root
              defaultValue={controlled ? undefined : 'amina'}
              onValueChange={controlled ? setValue : undefined}
              orientation="horizontal"
              value={controlled ? value : undefined}
            >
              <AvatarMenu.List>
                <AvatarMenu.Item value="amina">
                  <AvatarMenu.Trigger aria-label="Open Amina navigation">
                    <PackageExports.Avatar.Fallback>AM</PackageExports.Avatar.Fallback>
                  </AvatarMenu.Trigger>
                  <AvatarMenu.Content
                    className={aminaClassName}
                    data-testid="horizontal-amina-content"
                  >
                    <AvatarMenu.Group>
                      <AvatarMenu.GroupLabel>Amina Diallo</AvatarMenu.GroupLabel>
                    </AvatarMenu.Group>
                  </AvatarMenu.Content>
                </AvatarMenu.Item>
                <AvatarMenu.Item value="yann">
                  <AvatarMenu.Trigger aria-label="Open Yann navigation">
                    <PackageExports.Avatar.Fallback>YA</PackageExports.Avatar.Fallback>
                  </AvatarMenu.Trigger>
                  <AvatarMenu.Content
                    className={yannClassName}
                    data-testid="horizontal-yann-content"
                  >
                    <AvatarMenu.Group>
                      <AvatarMenu.GroupLabel>Yann Lojewski</AvatarMenu.GroupLabel>
                    </AvatarMenu.Group>
                  </AvatarMenu.Content>
                </AvatarMenu.Item>
              </AvatarMenu.List>
              <AvatarMenu.Portal keepMounted>
                <AvatarMenu.Positioner data-testid="horizontal-moving-positioner">
                  <AvatarMenu.Popup>
                    <AvatarMenu.Viewport />
                  </AvatarMenu.Popup>
                </AvatarMenu.Positioner>
              </AvatarMenu.Portal>
            </AvatarMenu.Root>
            <output aria-label="Horizontal movement status">
              direction: {direction}; activation direction: {activationDirection}
            </output>
          </div>
        )
      }

      render(<HorizontalMovementProbe />)

      const aminaTrigger = screen.getByRole('button', { name: 'Open Amina navigation' })
      const yannTrigger = screen.getByRole('button', { name: 'Open Yann navigation' })
      const aminaContent = await screen.findByTestId('horizontal-amina-content')
      const positioner = screen.getByTestId('horizontal-moving-positioner')

      vi.spyOn(aminaTrigger, 'getBoundingClientRect').mockReturnValue(
        direction === 'ltr' ? new DOMRect(0, 0, 36, 36) : new DOMRect(80, 0, 36, 36)
      )
      vi.spyOn(yannTrigger, 'getBoundingClientRect').mockReturnValue(
        direction === 'ltr' ? new DOMRect(80, 0, 36, 36) : new DOMRect(0, 0, 36, 36)
      )
      Object.defineProperty(aminaContent, 'getAnimations', {
        configurable: true,
        value: vi.fn(() => [{ finished: aminaExitFinished }])
      })

      expect(positioner).toHaveAttribute('data-open')

      if (controlled) {
        expect(screen.getByRole('group', { name: 'External Avatar controls' })).toBeVisible()
        fireEvent.click(screen.getByRole('button', { name: 'Open Yann externally' }))
      } else {
        fireEvent.click(yannTrigger)
      }

      const yannContent = await screen.findByTestId('horizontal-yann-content')

      await waitFor(() => {
        expect(yannContent).toHaveAttribute('data-activation-direction', forwardDirection)
        expect(aminaContent).toHaveAttribute('data-activation-direction', forwardDirection)
        expect(aminaContent).toHaveAttribute('data-ending-style')
        expect(aminaClassName).toHaveBeenCalledWith(
          expect.objectContaining({ activationDirection: forwardDirection })
        )
        expect(yannClassName).toHaveBeenCalledWith(
          expect.objectContaining({ activationDirection: forwardDirection })
        )
        expect(screen.getByTestId('horizontal-moving-positioner')).toBe(positioner)
        if (controlled) {
          expect(
            screen.getByRole('status', { name: 'Horizontal movement status' })
          ).toHaveTextContent(`direction: ${direction}; activation direction: ${forwardDirection}`)
        }
      })

      Object.defineProperty(yannContent, 'getAnimations', {
        configurable: true,
        value: vi.fn(() => [{ finished: yannExitFinished }])
      })

      if (controlled) {
        fireEvent.click(screen.getByRole('button', { name: 'Open Amina externally' }))
      } else {
        fireEvent.click(aminaTrigger)
      }

      await waitFor(() => {
        expect(screen.getByTestId('horizontal-amina-content')).toHaveAttribute(
          'data-activation-direction',
          reverseDirection
        )
        expect(screen.getByTestId('horizontal-yann-content')).toHaveAttribute('data-ending-style')
        expect(aminaClassName).toHaveBeenCalledWith(
          expect.objectContaining({ activationDirection: reverseDirection })
        )
        expect(yannClassName).toHaveBeenCalledWith(
          expect.objectContaining({ activationDirection: reverseDirection })
        )
        expect(screen.getByTestId('horizontal-moving-positioner')).toBe(positioner)
        if (controlled) {
          expect(
            screen.getByRole('status', { name: 'Horizontal movement status' })
          ).toHaveTextContent(`direction: ${direction}; activation direction: ${reverseDirection}`)
        }
      })

      await act(async () => {
        resolveAminaExit?.()
        resolveYannExit?.()
        await Promise.resolve()
      })
    }
  )

  it.each([
    ['ltr', 'right', 'left'],
    ['rtl', 'left', 'right']
  ] as const)(
    'UC-005 / UC-006 / UC-008 / UC-012 / UC-018 / EX-008 / QA-001 - exposes horizontal bottom placement, public lifecycle, and synchronized external direction in %s',
    async (direction, forwardDirection, reverseDirection) => {
      const Story = Ex008HorizontalOrientationAndAxisMovement.render

      expect(Story).toBeTypeOf('function')

      if (!Story) {
        throw new Error('Expected EX-008 to provide an inspectable render function')
      }

      render(<Story direction={direction} />)

      const aminaTrigger = screen.getByRole('button', { name: 'Open amina navigation' })
      const yannTrigger = screen.getByRole('button', { name: 'Open yann navigation' })
      const output = screen.getByRole('status', { name: 'Horizontal movement status' })
      const popup = document.querySelector<HTMLElement>('[data-popup-surface-root]')

      expect(popup).toBeInTheDocument()

      if (popup?.parentElement === null || popup === null) {
        throw new Error('Expected EX-008 to render Popup inside Positioner')
      }

      const positioner = popup.parentElement

      vi.spyOn(aminaTrigger, 'getBoundingClientRect').mockReturnValue(
        direction === 'ltr' ? new DOMRect(0, 0, 36, 36) : new DOMRect(80, 0, 36, 36)
      )
      vi.spyOn(yannTrigger, 'getBoundingClientRect').mockReturnValue(
        direction === 'ltr' ? new DOMRect(80, 0, 36, 36) : new DOMRect(0, 0, 36, 36)
      )

      expect(output).toHaveTextContent(
        `direction: ${direction}; preferred side: bottom; align: start; activation direction: none`
      )
      expect(positioner).toHaveAttribute('data-open')
      expect(positioner).toHaveAttribute('data-side', 'bottom')
      expect(positioner).toHaveAttribute('data-align', 'start')
      expect(popup).toHaveAttribute('data-open')
      expect(popup).toHaveAttribute('data-side', 'bottom')
      expect(popup).toHaveAttribute('data-align', 'start')

      fireEvent.click(screen.getByRole('button', { name: 'Open Yann externally' }))

      await waitFor(() => {
        expect(output).toHaveTextContent(
          `direction: ${direction}; preferred side: bottom; align: start; activation direction: ${forwardDirection}`
        )
        expect(
          document.querySelector(`[data-activation-direction="${forwardDirection}"]`)
        ).not.toBeNull()
        expect(document.querySelector('[data-popup-surface-root]')).toBe(popup)
        expect(positioner).toHaveAttribute('data-side', 'bottom')
        expect(popup).toHaveAttribute('data-side', 'bottom')
      })

      fireEvent.click(screen.getByRole('button', { name: 'Open Amina externally' }))

      await waitFor(() => {
        expect(output).toHaveTextContent(
          `direction: ${direction}; preferred side: bottom; align: start; activation direction: ${reverseDirection}`
        )
        expect(
          document.querySelector(`[data-activation-direction="${reverseDirection}"]`)
        ).not.toBeNull()
        expect(document.querySelector('[data-popup-surface-root]')).toBe(popup)
        expect(positioner).toHaveAttribute('data-open')
        expect(popup).toHaveAttribute('data-open')
      })
    }
  )

  it('UC-002 / UC-003 / CR-007 - preserves cancellable Base UI list-navigation event details', () => {
    let listNavigationDetails: AvatarMenuRootChangeEventDetails | undefined
    const onValueChange = vi.fn(
      (_nextValue: AvatarMenuRootValue, details: AvatarMenuRootChangeEventDetails) => {
        if (details.reason === 'list-navigation') {
          listNavigationDetails = details
          details.cancel()
        }
      }
    )

    render(
      <AvatarMenu.Root onValueChange={onValueChange}>
        <AvatarMenu.List>
          <AvatarMenu.Item value="amina">
            <AvatarMenu.Trigger aria-label="Open Amina navigation">
              <PackageExports.Avatar.Fallback>AM</PackageExports.Avatar.Fallback>
            </AvatarMenu.Trigger>
            <AvatarMenu.Content>
              <AvatarMenu.Group>
                <AvatarMenu.GroupLabel>Amina Diallo</AvatarMenu.GroupLabel>
                <AvatarMenu.Link icon={<svg />} href="home">
                  Home
                </AvatarMenu.Link>
              </AvatarMenu.Group>
            </AvatarMenu.Content>
          </AvatarMenu.Item>
        </AvatarMenu.List>
        <AvatarMenu.Portal>
          <AvatarMenu.Positioner>
            <AvatarMenu.Popup data-testid="canceled-keyboard-popup">
              <AvatarMenu.Viewport />
            </AvatarMenu.Popup>
          </AvatarMenu.Positioner>
        </AvatarMenu.Portal>
      </AvatarMenu.Root>
    )

    const trigger = screen.getByRole('button', { name: 'Open Amina navigation' })

    trigger.focus()
    fireEvent.keyDown(trigger, { key: 'ArrowRight' })

    expect(onValueChange).toHaveBeenCalledOnce()
    expect(listNavigationDetails).toEqual(
      expect.objectContaining({
        allowPropagation: expect.any(Function),
        cancel: expect.any(Function),
        event: expect.any(KeyboardEvent),
        isCanceled: true,
        isPropagationAllowed: false,
        reason: 'list-navigation'
      })
    )
    expect(listNavigationDetails?.event).toHaveProperty('key', 'ArrowRight')
    expect(trigger).not.toHaveAttribute('data-popup-open')
    expect(screen.queryByTestId('canceled-keyboard-popup')).not.toBeInTheDocument()
  })

  it('UC-002 / UC-017 / CR-002 - preserves controlled outside-press timing and cancellation in the original change lifecycle', async () => {
    let dispatchPhase: 'before' | 'dispatching' | 'settled' = 'before'
    let observedCallbackPhase: 'before' | 'dispatching' | 'settled' | undefined
    let outsidePressDetails: AvatarMenuRootChangeEventDetails | undefined
    const onValueChange = vi.fn(
      (_nextValue: AvatarMenuRootValue, details: AvatarMenuRootChangeEventDetails) => {
        observedCallbackPhase = dispatchPhase
        outsidePressDetails = details
        details.cancel()
      }
    )

    render(
      <div>
        <button type="button">Outside action</button>
        <AvatarMenu.Root onValueChange={onValueChange} value="amina">
          <AvatarMenu.List>
            <AvatarMenu.Item value="amina">
              <AvatarMenu.Trigger aria-label="Open Amina navigation">
                <PackageExports.Avatar.Fallback>AM</PackageExports.Avatar.Fallback>
              </AvatarMenu.Trigger>
              <AvatarMenu.Content>
                <AvatarMenu.Group>
                  <AvatarMenu.GroupLabel>Amina Diallo</AvatarMenu.GroupLabel>
                  <AvatarMenu.Link href="home" icon={<svg />}>
                    Home
                  </AvatarMenu.Link>
                </AvatarMenu.Group>
              </AvatarMenu.Content>
            </AvatarMenu.Item>
          </AvatarMenu.List>
          <AvatarMenu.Portal keepMounted>
            <AvatarMenu.Positioner>
              <AvatarMenu.Popup data-testid="outside-press-popup">
                <AvatarMenu.Viewport />
              </AvatarMenu.Popup>
            </AvatarMenu.Positioner>
          </AvatarMenu.Portal>
        </AvatarMenu.Root>
      </div>
    )

    const trigger = screen.getByRole('button', { name: 'Open Amina navigation' })
    const popup = await screen.findByTestId('outside-press-popup')

    dispatchPhase = 'dispatching'
    fireEvent.click(screen.getByRole('button', { name: 'Outside action' }))
    dispatchPhase = 'settled'

    expect(observedCallbackPhase).toBe('dispatching')
    expect(onValueChange).toHaveBeenCalledOnce()
    expect(onValueChange).toHaveBeenCalledWith(null, outsidePressDetails)
    expect(outsidePressDetails).toEqual(
      expect.objectContaining({
        allowPropagation: expect.any(Function),
        cancel: expect.any(Function),
        event: expect.any(MouseEvent),
        isCanceled: true,
        isPropagationAllowed: false,
        reason: 'outside-press'
      })
    )
    expect(trigger).toHaveAttribute('data-popup-open')
    expect(popup).toHaveAttribute('data-open')
  })

  it('UC-014 / UC-015 / EX-006 / QA-004 / CR-005 - exposes public lifecycle state for data-instant and reduced-motion inspection', async () => {
    render(
      <AvatarMenu.Root defaultValue="amina">
        <AvatarMenu.List className="grid gap-2">
          <AvatarMenu.Item value="amina">
            <AvatarMenu.Trigger aria-label="Open Amina navigation">
              <PackageExports.Avatar.Fallback>AM</PackageExports.Avatar.Fallback>
            </AvatarMenu.Trigger>
            <AvatarMenu.Content data-testid="instant-content">
              <AvatarMenu.Group>
                <AvatarMenu.GroupLabel>Amina Diallo</AvatarMenu.GroupLabel>
                <AvatarMenu.Link icon={<svg />} href="home">
                  Home
                </AvatarMenu.Link>
              </AvatarMenu.Group>
            </AvatarMenu.Content>
          </AvatarMenu.Item>
        </AvatarMenu.List>
        <AvatarMenu.Portal keepMounted>
          <AvatarMenu.Positioner data-instant="" data-testid="instant-positioner">
            <AvatarMenu.Popup data-testid="instant-popup">
              <AvatarMenu.Viewport />
            </AvatarMenu.Popup>
          </AvatarMenu.Positioner>
        </AvatarMenu.Portal>
      </AvatarMenu.Root>
    )

    const positioner = await screen.findByTestId('instant-positioner')
    const popup = screen.getByTestId('instant-popup')
    const content = screen.getByTestId('instant-content')

    expect(positioner).toHaveAttribute('data-instant')
    expect(positioner).toHaveAttribute('data-open')
    expect(popup).toHaveAttribute('data-open')
    expect(popup).toHaveStyle({
      '--popup-surface-layout-duration': '300ms',
      '--popup-surface-layout-easing': 'cubic-bezier(0.22, 1, 0.36, 1)'
    })
    expect(content).toHaveAttribute('data-open')
    expect(within(popup).getByRole('link', { name: 'Home' })).toBeInTheDocument()
  })

  it.each([
    ['default', undefined],
    ['false', false]
  ] as const)(
    'UC-016 / CR-008 - unmounts %s Content after its Base UI exit completes',
    async (_mode, keepMounted) => {
      let resolveExit: (() => void) | undefined
      const exitFinished = new Promise<void>((resolve) => {
        resolveExit = resolve
      })
      const actionsRef = createRef<AvatarMenuRootActions>()

      function ContentUnmountProbe() {
        const [value, setValue] = useState<AvatarMenuRootValue>('amina')

        return (
          <div>
            <button onClick={() => setValue(null)} type="button">
              Close content
            </button>
            <AvatarMenu.Root actionsRef={actionsRef} onValueChange={setValue} value={value}>
              <AvatarMenu.List>
                <AvatarMenu.Item value="amina">
                  <AvatarMenu.Trigger aria-label="Open Amina navigation">
                    <PackageExports.Avatar.Fallback>AM</PackageExports.Avatar.Fallback>
                  </AvatarMenu.Trigger>
                  <AvatarMenu.Content data-testid="unmounting-content" keepMounted={keepMounted}>
                    <AvatarMenu.Group>
                      <AvatarMenu.GroupLabel>Amina Diallo</AvatarMenu.GroupLabel>
                      <AvatarMenu.Link icon={<svg />} href="home">
                        Home
                      </AvatarMenu.Link>
                    </AvatarMenu.Group>
                  </AvatarMenu.Content>
                </AvatarMenu.Item>
              </AvatarMenu.List>
              <AvatarMenu.Portal keepMounted>
                <AvatarMenu.Positioner>
                  <AvatarMenu.Popup>
                    <AvatarMenu.Viewport />
                  </AvatarMenu.Popup>
                </AvatarMenu.Positioner>
              </AvatarMenu.Portal>
            </AvatarMenu.Root>
          </div>
        )
      }

      render(<ContentUnmountProbe />)

      const content = await screen.findByTestId('unmounting-content')

      Object.defineProperty(content, 'getAnimations', {
        configurable: true,
        value: vi.fn(() => [{ finished: exitFinished }])
      })

      fireEvent.click(screen.getByRole('button', { name: 'Close content' }))

      await waitFor(() => {
        expect(content).toHaveAttribute('data-closed')
        expect(content).toHaveAttribute('data-ending-style')
      })
      expect(content).not.toHaveAttribute('hidden')

      resolveExit?.()

      await waitFor(() => {
        expect(screen.queryByTestId('unmounting-content')).not.toBeInTheDocument()
      })
    }
  )

  it('UC-016 / CR-008 - keeps explicit keepMounted Content hidden without stale lifecycle attributes', async () => {
    let resolveExit: (() => void) | undefined
    const exitFinished = new Promise<void>((resolve) => {
      resolveExit = resolve
    })
    const actionsRef = createRef<AvatarMenuRootActions>()

    function KeptContentProbe() {
      const [value, setValue] = useState<AvatarMenuRootValue>('amina')

      return (
        <div>
          <button onClick={() => setValue(null)} type="button">
            Close kept content
          </button>
          <AvatarMenu.Root actionsRef={actionsRef} onValueChange={setValue} value={value}>
            <AvatarMenu.List>
              <AvatarMenu.Item value="amina">
                <AvatarMenu.Trigger aria-label="Open Amina navigation">
                  <PackageExports.Avatar.Fallback>AM</PackageExports.Avatar.Fallback>
                </AvatarMenu.Trigger>
                <AvatarMenu.Content data-testid="kept-content" keepMounted>
                  <AvatarMenu.Group>
                    <AvatarMenu.GroupLabel>Amina Diallo</AvatarMenu.GroupLabel>
                    <AvatarMenu.Link icon={<svg />} href="home">
                      Home
                    </AvatarMenu.Link>
                  </AvatarMenu.Group>
                </AvatarMenu.Content>
              </AvatarMenu.Item>
            </AvatarMenu.List>
            <AvatarMenu.Portal keepMounted>
              <AvatarMenu.Positioner>
                <AvatarMenu.Popup>
                  <AvatarMenu.Viewport />
                </AvatarMenu.Popup>
              </AvatarMenu.Positioner>
            </AvatarMenu.Portal>
          </AvatarMenu.Root>
        </div>
      )
    }

    render(<KeptContentProbe />)

    const content = await screen.findByTestId('kept-content')

    Object.defineProperty(content, 'getAnimations', {
      configurable: true,
      value: vi.fn(() => [{ finished: exitFinished }])
    })

    fireEvent.click(screen.getByRole('button', { name: 'Close kept content' }))

    await waitFor(() => {
      expect(content).toHaveAttribute('data-closed')
      expect(content).toHaveAttribute('data-ending-style')
    })
    expect(content).not.toHaveAttribute('hidden')

    resolveExit?.()

    await waitFor(() => {
      expect(content).toHaveAttribute('hidden')
      expect(content).toHaveAttribute('data-closed')
      expect(content).not.toHaveAttribute('data-starting-style')
      expect(content).not.toHaveAttribute('data-ending-style')
    })
  })

  it('UC-010 / UC-017 - keeps Link copies decorative while public owners retain semantics', async () => {
    const linkRef = createRef<HTMLAnchorElement>()

    render(
      <AvatarMenu.Root defaultValue="amina" aria-label="Athlete navigation">
        <AvatarMenu.List>
          <AvatarMenu.Item value="amina">
            <AvatarMenu.Trigger aria-label="Open Amina navigation">
              <PackageExports.Avatar.Fallback>AM</PackageExports.Avatar.Fallback>
            </AvatarMenu.Trigger>
            <AvatarMenu.Content>
              <AvatarMenu.Group>
                <AvatarMenu.GroupLabel>Amina Diallo</AvatarMenu.GroupLabel>
                <AvatarMenu.Link icon={<svg data-testid="safe-icon" />} href="home" ref={linkRef}>
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
    )

    const root = screen.getByRole('navigation', { name: 'Athlete navigation' })
    const link = await screen.findByRole('link', { name: 'Home' })

    expect(root).toBeInTheDocument()
    expect(linkRef.current).toBe(link)
    expect(screen.getAllByRole('link', { name: 'Home' })).toHaveLength(1)
    expect(screen.getAllByTestId('safe-icon')).toHaveLength(2)
  })

  it('UC-002 / UC-017 / UC-018 / UC-019 - preserves owner state callbacks, grouped composition, native props, refs, collision hooks, and completion', async () => {
    const groupRef = createRef<HTMLElement>()
    const groupLabelRef = createRef<HTMLElement>()
    const rootRef = createRef<HTMLElement>()
    const popupRef = createRef<HTMLElement>()
    const onOpenChangeComplete = vi.fn()
    const rootClassName = vi.fn((state: BaseUiNavigationMenu.Root.State) =>
      state.open ? 'root-open' : 'root-closed'
    )
    const groupClassName = vi.fn((_state: AvatarMenuGroupState) => 'consumer-group')
    const groupLabelClassName = vi.fn((_state: AvatarMenuGroupLabelState) => 'consumer-group-label')
    const popupStyle = vi.fn(
      (state: BaseUiNavigationMenu.Popup.State): CSSProperties => ({
        opacity: state.open ? 0.8 : 0.2
      })
    )

    render(
      <AvatarMenu.Root
        aria-label="Composed athlete navigation"
        className={rootClassName}
        defaultValue="amina"
        onOpenChangeComplete={onOpenChangeComplete}
        ref={rootRef}
      >
        <AvatarMenu.List data-consumer="list">
          <AvatarMenu.Item data-consumer="item" value="amina">
            <AvatarMenu.Trigger aria-label="Open Amina navigation" data-consumer="trigger">
              <PackageExports.Avatar.Fallback>AM</PackageExports.Avatar.Fallback>
            </AvatarMenu.Trigger>
            <AvatarMenu.Content data-consumer="content">
              <AvatarMenu.Group
                className={groupClassName}
                ref={groupRef}
                render={<section data-consumer="group" />}
              >
                <AvatarMenu.GroupLabel
                  className={groupLabelClassName}
                  id="amina-full-name"
                  ref={groupLabelRef}
                  render={<header data-consumer="group-label" />}
                >
                  Amina Diallo
                </AvatarMenu.GroupLabel>
                <AvatarMenu.Link icon={<svg />} href="home">
                  Home
                </AvatarMenu.Link>
              </AvatarMenu.Group>
            </AvatarMenu.Content>
          </AvatarMenu.Item>
        </AvatarMenu.List>
        <AvatarMenu.Portal keepMounted>
          <AvatarMenu.Positioner
            alignOffset={4}
            collisionAvoidance={{ align: 'shift', side: 'flip' }}
            data-consumer="positioner"
          >
            <AvatarMenu.Popup
              data-consumer="popup"
              ref={popupRef}
              render={<section aria-label="Shared athlete pages" />}
              style={popupStyle}
            >
              <AvatarMenu.Viewport />
            </AvatarMenu.Popup>
          </AvatarMenu.Positioner>
        </AvatarMenu.Portal>
      </AvatarMenu.Root>
    )

    const root = screen.getByRole('navigation', { name: 'Composed athlete navigation' })
    const popup = await screen.findByRole('region', { name: 'Shared athlete pages' })
    const group = within(popup).getByRole('group', { name: 'Amina Diallo' })
    const groupLabel = within(group).getByText('Amina Diallo')
    const positioner = popup.parentElement

    expect(rootRef.current).toBe(root)
    expect(root).toHaveClass('root-open')
    expect(rootClassName).toHaveBeenCalledWith(expect.objectContaining({ open: true }))
    expect(popupRef.current).toBe(popup)
    expect(popup.tagName).toBe('SECTION')
    expect(popup).toHaveAttribute('data-consumer', 'popup')
    expect(popup).toHaveAttribute('data-side')
    expect(popup).toHaveAttribute('data-align')
    expect(popup).toHaveStyle({ opacity: '0.8' })
    expect(popupStyle).toHaveBeenCalledWith(expect.objectContaining({ open: true }))
    expect(group.tagName).toBe('SECTION')
    expect(group).toHaveAttribute('data-consumer', 'group')
    expect(group).toHaveAttribute('data-popup-surface-group')
    expect(group).toHaveAttribute('aria-labelledby', 'amina-full-name')
    expect(group).toHaveClass('consumer-group')
    expect(groupRef.current).toBe(group)
    expect(groupLabel.tagName).toBe('HEADER')
    expect(groupLabel).toHaveAttribute('data-consumer', 'group-label')
    expect(groupLabel).toHaveAttribute('data-popup-surface-group-label')
    expect(groupLabel).toHaveAttribute('id', 'amina-full-name')
    expect(groupLabel).toHaveClass('consumer-group-label')
    expect(groupLabel).not.toHaveAttribute('tabindex')
    expect(groupLabelRef.current).toBe(groupLabel)
    expect(groupClassName).toHaveBeenCalledWith({})
    expect(groupLabelClassName).toHaveBeenCalledWith({})
    expect(positioner).toHaveAttribute('data-consumer', 'positioner')
    expect(positioner?.style.getPropertyValue('--available-height')).not.toBe('')
    expect(positioner?.style.getPropertyValue('--available-width')).not.toBe('')

    fireEvent.keyDown(document, { key: 'Escape' })

    await waitFor(() => {
      expect(onOpenChangeComplete).toHaveBeenCalledWith(false)
    })
  })

  it('UC-018 / CR-009 - applies consumer visual conflicts across every affected public part', async () => {
    const triggerClassName = vi.fn((_state: AvatarMenuTriggerState) => 'size-12 bg-accent')
    const triggerStyle = vi.fn(
      (_state: AvatarMenuTriggerState): CSSProperties => ({ opacity: 0.51 })
    )
    const listClassName = vi.fn((_state: AvatarMenuListState) => 'flex-row gap-7')
    const listStyle = vi.fn((_state: AvatarMenuListState): CSSProperties => ({ rowGap: '1.75rem' }))
    const positionerClassName = vi.fn((_state: AvatarMenuPositionerState) => 'max-w-none')
    const positionerStyle = vi.fn(
      (_state: AvatarMenuPositionerState): CSSProperties => ({ maxWidth: '18rem' })
    )
    const contentClassName = vi.fn((_state: AvatarMenuContentState) => 'w-full opacity-50')
    const contentStyle = vi.fn(
      (_state: AvatarMenuContentState): CSSProperties => ({ inlineSize: '18rem' })
    )
    const viewportClassName = vi.fn(
      (_state: AvatarMenuViewportState) => 'static h-auto w-auto overflow-visible'
    )
    const viewportStyle = vi.fn(
      (_state: AvatarMenuViewportState): CSSProperties => ({ blockSize: '11rem' })
    )

    render(
      <AvatarMenu.Root defaultValue="amina">
        <AvatarMenu.List className={listClassName} data-testid="override-list" style={listStyle}>
          <AvatarMenu.Item value="amina">
            <AvatarMenu.Trigger
              aria-label="Open Amina navigation"
              className={triggerClassName}
              style={triggerStyle}
            >
              <PackageExports.Avatar.Fallback>AM</PackageExports.Avatar.Fallback>
            </AvatarMenu.Trigger>
            <AvatarMenu.Content
              className={contentClassName}
              data-testid="override-content"
              style={contentStyle}
            >
              <AvatarMenu.Group>
                <AvatarMenu.GroupLabel>Amina Diallo</AvatarMenu.GroupLabel>
                <AvatarMenu.Link icon={<svg />} href="home">
                  Home
                </AvatarMenu.Link>
              </AvatarMenu.Group>
            </AvatarMenu.Content>
          </AvatarMenu.Item>
        </AvatarMenu.List>
        <AvatarMenu.Portal>
          <AvatarMenu.Positioner
            className={positionerClassName}
            data-testid="override-positioner"
            style={positionerStyle}
          >
            <AvatarMenu.Popup>
              <AvatarMenu.Viewport
                className={viewportClassName}
                data-testid="override-viewport"
                style={viewportStyle}
              />
            </AvatarMenu.Popup>
          </AvatarMenu.Positioner>
        </AvatarMenu.Portal>
      </AvatarMenu.Root>
    )

    const trigger = screen.getByRole('button', { name: 'Open Amina navigation' })
    const list = screen.getByTestId('override-list')
    const positioner = await screen.findByTestId('override-positioner')
    const content = screen.getByTestId('override-content')
    const viewport = screen.getByTestId('override-viewport')

    expect(trigger).toHaveClass('size-12', 'bg-accent')
    expect(trigger).not.toHaveClass('size-9', 'bg-background')
    expect(trigger).toHaveStyle({ opacity: '0.51' })
    expect(list).toHaveClass('flex-row', 'gap-7')
    expect(list).not.toHaveClass('flex-col')
    expect(list).toHaveStyle({ rowGap: '1.75rem' })
    expect(positioner).toHaveClass('max-w-none')
    expect(positioner).not.toHaveClass('max-w-(--available-width)')
    expect(positioner).toHaveStyle({ maxWidth: '18rem' })
    expect(content).toHaveClass('w-full', 'opacity-50')
    expect(content).not.toHaveClass('w-max', 'opacity-100')
    expect(content).toHaveStyle({ inlineSize: '18rem' })
    expect(viewport).toHaveClass('static', 'h-auto', 'w-auto', 'overflow-visible')
    expect(viewport).not.toHaveClass('relative', 'h-full', 'w-full', 'overflow-hidden')
    expect(viewport).toHaveStyle({ blockSize: '11rem' })
    expect(triggerClassName).toHaveBeenCalledWith(expect.objectContaining({ open: true }))
    expect(triggerStyle).toHaveBeenCalledWith(expect.objectContaining({ open: true }))
    expect(listClassName).toHaveBeenCalledWith(expect.objectContaining({ open: true }))
    expect(listStyle).toHaveBeenCalledWith(expect.objectContaining({ open: true }))
    expect(positionerClassName).toHaveBeenCalledWith(
      expect.objectContaining({ align: expect.any(String), open: true, side: expect.any(String) })
    )
    expect(positionerStyle).toHaveBeenCalledWith(expect.objectContaining({ open: true }))
    expect(contentClassName).toHaveBeenCalledWith(expect.objectContaining({ open: true }))
    expect(contentStyle).toHaveBeenCalledWith(expect.objectContaining({ open: true }))
    expect(viewportClassName).toHaveBeenCalledWith({})
    expect(viewportStyle).toHaveBeenCalledWith({})
  })
})
