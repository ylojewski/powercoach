import { Popover } from '@base-ui/react/popover'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { createRef, type CSSProperties, type ReactElement, type ReactNode } from 'react'
import { expectTypeOf } from 'vitest'

import {
  type FieldSize,
  type PopupSurfaceGroupLabelProps,
  type PopupSurfaceGroupLabelState,
  type PopupSurfaceGroupProps,
  type PopupSurfaceGroupState,
  type PopupSurfaceItemContentInset,
  type PopupSurfaceItemIcon,
  type PopupSurfaceItemIconPosition,
  type PopupSurfaceItemProps,
  type PopupSurfaceItemRevealAnimationProps,
  type PopupSurfaceItemState,
  type PopupSurfaceNamespace,
  type PopupSurfaceRootProps,
  type PopupSurfaceRootState,
  type PopupSurfaceSize,
  type RevealAnimationProps
} from '../..'
import * as PackageExports from '../..'

interface PopupSurfacePackageContract {
  PopupSurface: PopupSurfaceNamespace
  PopupSurfaceGroup: PopupSurfaceNamespace['Group']
  PopupSurfaceGroupLabel: PopupSurfaceNamespace['GroupLabel']
  PopupSurfaceItem: PopupSurfaceNamespace['Item']
  PopupSurfaceRoot: PopupSurfaceNamespace['Root']
}

type IsAny<TValue> = 0 extends 1 & TValue ? true : false
type IsCallable<TValue> =
  IsAny<TValue> extends true ? false : TValue extends (...args: never[]) => unknown ? true : false
type HasNoKey<TValue, TKey extends PropertyKey> =
  IsAny<TValue> extends true ? true : TKey extends keyof TValue ? false : true

type PopupSurfaceItemRevealPropsAreBounded =
  IsAny<PopupSurfaceItemRevealAnimationProps> extends true
    ? true
    : PopupSurfaceItemRevealAnimationProps extends Omit<
          RevealAnimationProps,
          'children' | 'render' | 'reveal'
        >
      ? true
      : false

const PACKAGE_EXPORTS = PackageExports as typeof PackageExports & PopupSurfacePackageContract
const PopupSurface = PACKAGE_EXPORTS.PopupSurface
const PopupSurfaceGroup = PACKAGE_EXPORTS.PopupSurfaceGroup
const PopupSurfaceGroupLabel = PACKAGE_EXPORTS.PopupSurfaceGroupLabel
const PopupSurfaceItem = PACKAGE_EXPORTS.PopupSurfaceItem
const PopupSurfaceRoot = PACKAGE_EXPORTS.PopupSurfaceRoot

const POPUP_SURFACE_SIZES = [
  {
    hardShadow: '0.125rem 0.125rem 0 0 var(--color-foreground)',
    iconClasses: ['w-6', '[&_svg]:size-3'],
    rowClasses: ['min-h-6', 'gap-2', 'py-1'],
    size: 'xs',
    textClasses: ['text-xs', 'tracking-wide']
  },
  {
    hardShadow: '0.1875rem 0.1875rem 0 0 var(--color-foreground)',
    iconClasses: ['w-8', '[&_svg]:size-3.5'],
    rowClasses: ['min-h-8', 'gap-2.5', 'py-1.5'],
    size: 'md',
    textClasses: ['text-sm', 'tracking-wide']
  },
  {
    hardShadow: '0.25rem 0.25rem 0 0 var(--color-foreground)',
    iconClasses: ['w-9', '[&_svg]:size-4'],
    rowClasses: ['min-h-9', 'gap-3', 'py-2'],
    size: 'xl',
    textClasses: ['text-md', 'tracking-wide']
  }
] as const satisfies readonly {
  hardShadow:
    | '0.125rem 0.125rem 0 0 var(--color-foreground)'
    | '0.1875rem 0.1875rem 0 0 var(--color-foreground)'
    | '0.25rem 0.25rem 0 0 var(--color-foreground)'
  iconClasses: readonly string[]
  rowClasses: readonly string[]
  size: PopupSurfaceSize
  textClasses: readonly string[]
}[]

describe('PopupSurface', () => {
  it('UC-001 - exposes the four-part non-callable namespace, direct parts, and shared public types', () => {
    expect(typeof PopupSurface).toBe('object')
    expect(PopupSurface).toEqual({
      Group: PopupSurfaceGroup,
      GroupLabel: PopupSurfaceGroupLabel,
      Item: PopupSurfaceItem,
      Root: PopupSurfaceRoot
    })
    expect(typeof PopupSurfaceGroup).toBe('function')
    expect(typeof PopupSurfaceGroupLabel).toBe('function')
    expect(PopupSurface).toHaveProperty('Group', PopupSurfaceGroup)
    expect(PopupSurface).toHaveProperty('GroupLabel', PopupSurfaceGroupLabel)

    expectTypeOf<IsCallable<PopupSurfaceNamespace>>().toEqualTypeOf<false>()
    expectTypeOf<PopupSurfaceSize>().toEqualTypeOf<FieldSize>()
    expectTypeOf<PopupSurfaceItemIcon>().toEqualTypeOf<ReactElement>()
    expectTypeOf<PopupSurfaceItemIconPosition>().toEqualTypeOf<'start' | 'end'>()
    expectTypeOf<PopupSurfaceItemContentInset>().toEqualTypeOf<'base' | 'start' | 'end'>()
    expectTypeOf<PopupSurfaceItemRevealPropsAreBounded>().toEqualTypeOf<true>()
    expectTypeOf<PopupSurfaceRootProps['size']>().toEqualTypeOf<PopupSurfaceSize>()
    expectTypeOf<PopupSurfaceGroupProps['children']>().toEqualTypeOf<ReactNode>()
    expectTypeOf<PopupSurfaceGroupState>().toEqualTypeOf<Record<string, never>>()
    expectTypeOf<PopupSurfaceGroupLabelState>().toEqualTypeOf<Record<string, never>>()
    expectTypeOf<HasNoKey<PopupSurfaceGroupLabelProps, 'size'>>().toEqualTypeOf<true>()
    expectTypeOf<HasNoKey<PopupSurfaceGroupLabelProps, 'icon'>>().toEqualTypeOf<true>()
    expectTypeOf<HasNoKey<PopupSurfaceGroupLabelProps, 'iconPosition'>>().toEqualTypeOf<true>()
    expectTypeOf<HasNoKey<PopupSurfaceGroupLabelProps, 'contentInset'>>().toEqualTypeOf<true>()
    expectTypeOf<PopupSurfaceItemProps['size']>().toEqualTypeOf<PopupSurfaceSize>()
  })

  it('UC-001 / UC-002 - renders semantic-free direct parts and one composed Root owner element', () => {
    const rootRef = createRef<HTMLElement>()
    const onClick = vi.fn()
    const rootClassName = vi.fn((_state: PopupSurfaceRootState) => 'consumer-root')
    const rootStyle = vi.fn((_state: PopupSurfaceRootState) => ({ opacity: 0.75 }))

    render(
      <PopupSurface.Root
        className={rootClassName}
        data-owner-state="open"
        onClick={onClick}
        ref={rootRef}
        render={<nav aria-label="Shared popup" className="render-root" />}
        size="md"
        style={rootStyle}
      >
        <PopupSurface.Group>
          <PopupSurface.GroupLabel>Recovery</PopupSurface.GroupLabel>
          <PopupSurface.Item size="md">Recovery details</PopupSurface.Item>
        </PopupSurface.Group>
      </PopupSurface.Root>
    )

    const root = screen.getByRole('navigation', { name: 'Shared popup' })
    const group = root.querySelector('[data-popup-surface-group]')
    const groupLabel = screen.getByText('Recovery')
    const item = root.querySelector('[data-popup-surface-item]')

    expect(root).toHaveAttribute('data-owner-state', 'open')
    expect(root).toHaveAttribute('data-popup-surface-root')
    expect(root).toHaveAttribute('data-size', 'md')
    expect(root).toHaveClass('render-root', 'consumer-root')
    expect(root).toHaveStyle({ opacity: '0.75' })
    expect(rootRef.current).toBe(root)
    expect(rootClassName).toHaveBeenCalledOnce()
    expect(rootClassName).toHaveBeenCalledWith({ size: 'md' })
    expect(rootStyle).toHaveBeenCalledOnce()
    expect(rootStyle).toHaveBeenCalledWith({ size: 'md' })
    expect(group).toHaveAttribute('data-popup-surface-group')
    expect(group).not.toHaveAttribute('role')
    expect(groupLabel).toHaveAttribute('data-popup-surface-group-label')
    expect(groupLabel).not.toHaveAttribute('role')
    expect(item).toHaveAttribute('data-popup-surface-item')
    expect(item).not.toHaveAttribute('role')

    fireEvent.click(root)

    expect(onClick).toHaveBeenCalledOnce()
  })

  it('UC-003 / UC-004 / UC-013 / EX-001 / QA-001 - applies the complete Root and Item size scale while GroupLabel stays presentation-agnostic', () => {
    for (const testCase of POPUP_SURFACE_SIZES) {
      const { unmount } = render(
        <PopupSurface.Root data-testid={`root-${testCase.size}`} size={testCase.size}>
          <PopupSurface.Group data-testid={`group-${testCase.size}`}>
            <PopupSurface.GroupLabel data-testid={`label-${testCase.size}`}>
              Strength
            </PopupSurface.GroupLabel>
            <PopupSurface.Item
              data-testid={`item-${testCase.size}`}
              icon={<svg data-testid={`icon-${testCase.size}`} />}
              size={testCase.size}
            >
              Deadlift
            </PopupSurface.Item>
          </PopupSurface.Group>
        </PopupSurface.Root>
      )

      const root = screen.getByTestId(`root-${testCase.size}`)
      const group = screen.getByTestId(`group-${testCase.size}`)
      const groupLabel = screen.getByTestId(`label-${testCase.size}`)
      const item = screen.getByTestId(`item-${testCase.size}`)
      const visualSurfaces = [
        item.querySelector<HTMLElement>('[data-reveal-source]'),
        item.querySelector<HTMLElement>('[data-reveal-overlay-surface]')
      ]
      const iconSurfaces = screen
        .getAllByTestId(`icon-${testCase.size}`)
        .map((icon) => icon.closest<HTMLElement>('[aria-hidden="true"][inert]'))

      expect(root).toHaveAttribute('data-popup-surface-root')
      expect(root).toHaveAttribute('data-size', testCase.size)
      expect(root).toHaveClass(
        'box-border',
        'border',
        'border-foreground',
        'bg-background',
        'text-foreground',
        'shadow-(--hard-shadow)'
      )
      expect(root).toHaveStyle({ '--hard-shadow': testCase.hardShadow })
      expect(group).toHaveAttribute('data-popup-surface-group')
      expect(group).toHaveClass('w-full')
      expect(group).not.toHaveAttribute('role')
      expect(groupLabel).toHaveAttribute('data-popup-surface-group-label')
      expect(groupLabel).not.toHaveAttribute('data-size')
      expect(groupLabel).not.toHaveAttribute('data-icon-position')
      expect(groupLabel).not.toHaveAttribute('data-content-inset')
      expect(groupLabel).not.toHaveAttribute('class')
      expect(groupLabel.querySelector('[data-motion="reveal"]')).toBeNull()
      expect(item).toHaveAttribute('data-popup-surface-item')
      expect(item).toHaveAttribute('data-size', testCase.size)
      expect(item).toHaveAttribute('data-icon-position', 'start')
      expect(item).toHaveAttribute('data-content-inset', 'start')
      expect(item).toHaveClass('[&>[data-motion=reveal]]:grid')
      expect(item.querySelectorAll('[data-motion="reveal"]')).toHaveLength(1)

      for (const visualSurface of visualSurfaces) {
        expect(visualSurface).toHaveClass(
          'font-sans',
          'items-center',
          'bg-background',
          'text-foreground',
          ...testCase.rowClasses,
          ...testCase.textClasses
        )
      }
      expect(iconSurfaces).toHaveLength(2)
      for (const iconSurface of iconSurfaces) {
        expect(iconSurface).toHaveClass('start-0', ...testCase.iconClasses)
      }

      unmount()
    }
  })

  it('UC-013 - preserves semantic-owner roles, associations, events, refs, and render composition on Group and GroupLabel', () => {
    const groupRef = createRef<HTMLElement>()
    const groupLabelRef = createRef<HTMLElement>()
    const onGroupClick = vi.fn()
    const onGroupLabelClick = vi.fn()
    const groupClassName = vi.fn((_state: PopupSurfaceGroupState) => 'consumer-group')
    const groupLabelClassName = vi.fn(
      (_state: PopupSurfaceGroupLabelState) => 'consumer-group-label'
    )
    const groupLabelStyle = vi.fn(
      (_state: PopupSurfaceGroupLabelState): CSSProperties => ({ opacity: 0.75 })
    )

    render(
      <PopupSurface.Group
        aria-labelledby="strength-label"
        className={groupClassName}
        onClick={onGroupClick}
        ref={groupRef}
        render={<section role="group" />}
      >
        <PopupSurface.GroupLabel
          className={groupLabelClassName}
          data-owner-label="strength"
          id="strength-label"
          onClick={onGroupLabelClick}
          ref={groupLabelRef}
          render={<header />}
          style={groupLabelStyle}
        >
          Strength
        </PopupSurface.GroupLabel>
      </PopupSurface.Group>
    )

    const group = screen.getByRole('group', { name: 'Strength' })
    const groupLabel = screen.getByText('Strength')

    expect(group.tagName).toBe('SECTION')
    expect(group).toHaveAttribute('data-popup-surface-group')
    expect(group).toHaveClass('consumer-group')
    expect(groupRef.current).toBe(group)
    expect(groupLabel.tagName).toBe('HEADER')
    expect(groupLabel).toHaveAttribute('data-popup-surface-group-label')
    expect(groupLabel).toHaveAttribute('data-owner-label', 'strength')
    expect(groupLabel).toHaveAttribute('id', 'strength-label')
    expect(groupLabel).toHaveClass('consumer-group-label')
    expect(groupLabel).toHaveStyle({ opacity: '0.75' })
    expect(groupLabel).not.toHaveAttribute('tabindex')
    expect(groupLabelRef.current).toBe(groupLabel)
    expect(groupClassName).toHaveBeenCalledWith({})
    expect(groupLabelClassName).toHaveBeenCalledWith({})
    expect(groupLabelStyle).toHaveBeenCalledWith({})

    fireEvent.click(groupLabel)

    expect(onGroupClick).toHaveBeenCalledOnce()
    expect(onGroupLabelClick).toHaveBeenCalledOnce()
  })

  it('UC-004 / UC-005 / EX-002 - maps logical Icon positions and explicit content insets in RTL', () => {
    render(
      <PopupSurface.Root dir="rtl" size="md">
        <PopupSurface.Item
          data-testid="start-item"
          icon={<svg data-testid="start-icon" />}
          iconPosition="start"
          revealAnimationProps={false}
          size="md"
        >
          Search
        </PopupSurface.Item>
        <PopupSurface.Item
          data-testid="end-item"
          icon={<svg data-testid="end-icon" />}
          iconPosition="end"
          revealAnimationProps={false}
          size="md"
        >
          Athlete
        </PopupSurface.Item>
        <PopupSurface.Item
          contentInset="start"
          data-testid="reserved-item"
          revealAnimationProps={false}
          size="md"
        >
          Reserved start rail
        </PopupSurface.Item>
      </PopupSurface.Root>
    )

    const startItem = screen.getByTestId('start-item')
    const endItem = screen.getByTestId('end-item')
    const reservedItem = screen.getByTestId('reserved-item')
    const startIcon = screen
      .getByTestId('start-icon')
      .closest<HTMLElement>('[aria-hidden="true"][inert]')
    const endIcon = screen
      .getByTestId('end-icon')
      .closest<HTMLElement>('[aria-hidden="true"][inert]')

    expect(startItem).toHaveAttribute('data-icon-position', 'start')
    expect(startItem).toHaveAttribute('data-content-inset', 'start')
    expect(startItem).toHaveClass('ps-10.5', 'pe-2.5')
    expect(startIcon).toHaveClass('start-0')
    expect(endItem).toHaveAttribute('data-icon-position', 'end')
    expect(endItem).toHaveAttribute('data-content-inset', 'end')
    expect(endItem).toHaveClass('ps-2.5', 'pe-10.5')
    expect(endIcon).toHaveClass('end-0')
    expect(reservedItem).not.toHaveAttribute('data-icon-position')
    expect(reservedItem).toHaveAttribute('data-content-inset', 'start')
    expect(reservedItem).toHaveClass('ps-10.5', 'pe-2.5')
  })

  it('UC-006 / EX-003 - derives reveal from hover and keyboard focus unless a boolean controls it', () => {
    render(
      <PopupSurface.Root size="md">
        <PopupSurface.Item reveal render={<a href="home" />} size="md">
          Home
        </PopupSurface.Item>
        <PopupSurface.Item render={<a href="reviews" />} size="md">
          Reviews
        </PopupSurface.Item>
        <PopupSurface.Item reveal={false} render={<a href="settings" />} size="md">
          Settings
        </PopupSurface.Item>
      </PopupSurface.Root>
    )

    const activeLink = screen.getByRole('link', { name: 'Home' })
    const derivedLink = screen.getByRole('link', { name: 'Reviews' })
    const controlledHiddenLink = screen.getByRole('link', { name: 'Settings' })

    expect(activeLink).toHaveAttribute('data-revealed')
    expect(derivedLink).not.toHaveAttribute('data-revealed')
    expect(controlledHiddenLink).not.toHaveAttribute('data-revealed')

    fireEvent.mouseEnter(derivedLink)
    expect(derivedLink).toHaveAttribute('data-revealed')

    fireEvent.focus(derivedLink)
    fireEvent.mouseLeave(derivedLink)
    expect(derivedLink).toHaveAttribute('data-revealed')

    fireEvent.blur(derivedLink)
    expect(derivedLink).not.toHaveAttribute('data-revealed')

    fireEvent.mouseEnter(controlledHiddenLink)
    fireEvent.focus(controlledHiddenLink)
    expect(controlledHiddenLink).not.toHaveAttribute('data-revealed')

    fireEvent.pointerDown(derivedLink)
    fireEvent.focus(derivedLink)
    fireEvent.mouseEnter(derivedLink)
    fireEvent.mouseLeave(derivedLink)
    expect(derivedLink).not.toHaveAttribute('data-revealed')
  })

  it('UC-007 - selects default, true, configured, or immediate reveal presentation', () => {
    const onRevealChange = vi.fn()

    render(
      <PopupSurface.Root size="md">
        <PopupSurface.Item data-testid="default-item" reveal size="md">
          Default
        </PopupSurface.Item>
        <PopupSurface.Item data-testid="true-item" reveal revealAnimationProps size="md">
          True
        </PopupSurface.Item>
        <PopupSurface.Item
          data-testid="configured-item"
          revealAnimationProps={{
            contentMode: 'phrasing',
            direction: 'left-to-right',
            onRevealChange,
            scale: 1.1
          }}
          size="md"
        >
          Configured
        </PopupSurface.Item>
        <PopupSurface.Item
          data-testid="immediate-item"
          reveal
          revealAnimationProps={false}
          size="md"
        >
          Immediate
        </PopupSurface.Item>
      </PopupSurface.Root>
    )

    const defaultItem = screen.getByTestId('default-item')
    const trueItem = screen.getByTestId('true-item')
    const configuredItem = screen.getByTestId('configured-item')
    const immediateItem = screen.getByTestId('immediate-item')
    const defaultScale = defaultItem.querySelector<HTMLElement>('[data-reveal-copy-scale]')
    const configuredScale = configuredItem.querySelector<HTMLElement>('[data-reveal-copy-scale]')

    expect(defaultItem.querySelectorAll('[data-motion="reveal"]')).toHaveLength(1)
    expect(trueItem.querySelectorAll('[data-motion="reveal"]')).toHaveLength(1)
    expect(configuredItem.querySelector('[data-motion="reveal"]')).toHaveAttribute(
      'data-content-mode',
      'phrasing'
    )
    expect(
      defaultScale?.style.transform || getComputedStyle(defaultScale as Element).transform
    ).toContain('scale(1)')
    expect(
      configuredScale?.style.transform || getComputedStyle(configuredScale as Element).transform
    ).toContain('scale(1.1)')
    expect(onRevealChange).not.toHaveBeenCalled()

    fireEvent.mouseEnter(configuredItem)

    expect(configuredItem).toHaveAttribute('data-revealed')
    expect(onRevealChange).toHaveBeenCalledWith(true)
    expect(immediateItem.querySelector('[data-motion="reveal"]')).toBeNull()
    expect(immediateItem).toHaveClass(
      'bg-background',
      'text-foreground',
      'data-revealed:bg-foreground',
      'data-revealed:text-background'
    )
  })

  it('UC-008 / UC-009 / EX-003 - keeps Icon and copied visuals decorative around one semantic Item owner', () => {
    const itemRef = createRef<HTMLAnchorElement>()
    const onClick = vi.fn()

    render(
      <PopupSurface.Item
        aria-current="page"
        icon={<svg data-testid="semantic-icon" />}
        onClick={onClick}
        ref={itemRef}
        render={<a href="home" />}
        size="md"
      >
        Home
      </PopupSurface.Item>
    )

    const link = screen.getByRole('link', { name: 'Home' })
    const iconCopies = screen.getAllByTestId('semantic-icon')
    const overlay = link.querySelector('[data-reveal-overlay]')

    expect(screen.getAllByRole('link', { name: 'Home' })).toHaveLength(1)
    expect(link).toHaveAttribute('href', 'home')
    expect(link).toHaveAttribute('aria-current', 'page')
    expect(itemRef.current).toBe(link)
    expect(iconCopies).toHaveLength(2)
    for (const icon of iconCopies) {
      expect(icon.closest('[aria-hidden="true"][inert]')).toBeInTheDocument()
    }
    expect(overlay).toHaveAttribute('aria-hidden', 'true')
    expect(overlay).toHaveAttribute('inert')

    fireEvent.click(link)

    expect(onClick).toHaveBeenCalledOnce()
  })

  it('UC-010 / EX-004 - duplicates deterministic content by default and renders mount-sensitive content once with false', () => {
    render(
      <PopupSurface.Root size="md">
        <PopupSurface.Item icon={<svg data-testid="copied-icon" />} size="md">
          <span data-testid="copied-child">Copied content</span>
        </PopupSurface.Item>
        <PopupSurface.Item
          icon={<svg data-testid="single-icon" />}
          revealAnimationProps={false}
          size="md"
        >
          <span data-testid="single-child">Single content</span>
        </PopupSurface.Item>
      </PopupSurface.Root>
    )

    expect(screen.getAllByTestId('copied-icon')).toHaveLength(2)
    expect(screen.getAllByTestId('copied-child')).toHaveLength(2)
    expect(screen.getAllByTestId('single-icon')).toHaveLength(1)
    expect(screen.getAllByTestId('single-child')).toHaveLength(1)
  })

  it('UC-011 / EX-004 - resolves Item state once and preserves consumer class, style, ref, and render precedence', () => {
    const itemClassName = vi.fn(
      (_state: PopupSurfaceItemState) =>
        'min-h-12 gap-1 bg-accent py-3 ps-6 pe-6 text-xl/7 text-accent-foreground opacity-75'
    )
    const itemStyle = vi.fn(
      (_state: PopupSurfaceItemState): CSSProperties => ({ borderRadius: '11px', opacity: 0.75 })
    )
    const itemRef = createRef<HTMLAnchorElement>()

    render(
      <PopupSurface.Item
        className={itemClassName}
        icon={<svg />}
        ref={itemRef}
        render={<a className="render-item" href="settings" />}
        reveal
        size="md"
        style={itemStyle}
      >
        Settings
      </PopupSurface.Item>
    )

    const item = screen.getByRole('link', { name: 'Settings' })
    const realVisualSurface = item.querySelector<HTMLElement>('[data-reveal-source]')
    const overlayVisualSurface = item.querySelector<HTMLElement>('[data-reveal-overlay-surface]')
    const consumerClasses = [
      'min-h-12',
      'gap-1',
      'bg-accent',
      'py-3',
      'ps-6',
      'pe-6',
      'text-xl/7',
      'text-accent-foreground',
      'opacity-75'
    ]

    expect(itemClassName).toHaveBeenCalledOnce()
    expect(itemClassName).toHaveBeenCalledWith({
      contentInset: 'start',
      iconPosition: 'start',
      revealed: true,
      size: 'md'
    })
    expect(itemStyle).toHaveBeenCalledOnce()
    expect(itemRef.current).toBe(item)
    expect(item).toHaveClass('render-item', ...consumerClasses)
    expect(item).toHaveStyle({ borderRadius: '11px', opacity: '0.75' })
    for (const visualSurface of [realVisualSurface, overlayVisualSurface]) {
      expect(visualSurface).toHaveClass(...consumerClasses)
      expect(visualSurface).not.toHaveClass('bg-background', 'text-foreground')
      expect(visualSurface).not.toHaveStyle({ borderRadius: '11px', opacity: '0.75' })
    }
  })

  it('UC-012 / EX-005 / QA-002 - exposes interruptible CSS lifecycle endpoints with reduced-motion exit precedence', () => {
    render(
      <PopupSurface.Root
        data-ending-style=""
        data-owner-transition="closing"
        size="md"
        style={{ '--popup-surface-layout-duration': '300ms' } as CSSProperties}
      >
        Closing
      </PopupSurface.Root>
    )

    const root = screen.getByText('Closing')

    expect(root).toHaveAttribute('data-ending-style')
    expect(root).toHaveAttribute('data-owner-transition', 'closing')
    expect(root).toHaveClass(
      'origin-[var(--transform-origin)]',
      'transition-[scale,opacity,width,height]',
      'data-starting-style:scale-90',
      'data-starting-style:opacity-0',
      'data-ending-style:scale-90',
      'data-ending-style:opacity-0',
      'motion-reduce:duration-0',
      'motion-reduce:data-ending-style:duration-0'
    )
    expect(root).toHaveStyle({
      '--popup-surface-enter-duration': '350ms',
      '--popup-surface-enter-easing': 'cubic-bezier(0.22, 1, 0.36, 1)',
      '--popup-surface-exit-duration': '150ms',
      '--popup-surface-exit-easing': 'ease',
      '--popup-surface-layout-duration': '300ms',
      '--popup-surface-layout-easing': 'cubic-bezier(0.22, 1, 0.36, 1)'
    })
  })

  it('UC-002 / UC-012 / EX-005 - composes a Base UI popup lifecycle onto the same shared Root element', async () => {
    render(
      <Popover.Root>
        <Popover.Trigger>Open details</Popover.Trigger>
        <Popover.Portal>
          <Popover.Positioner>
            <Popover.Popup render={<PopupSurface.Root size="md" />}>
              <PopupSurface.Item icon={<svg />} size="md">
                Recovery details
              </PopupSurface.Item>
            </Popover.Popup>
          </Popover.Positioner>
        </Popover.Portal>
      </Popover.Root>
    )

    fireEvent.click(screen.getByRole('button', { name: 'Open details' }))

    const popup = await screen.findByRole('dialog')

    expect(popup).toHaveAttribute('data-open')
    expect(popup).toHaveAttribute('data-popup-surface-root')
    expect(popup).toHaveAttribute('data-size', 'md')
    const recoveryDetailsSource = popup.querySelector<HTMLElement>('[data-reveal-source]')
    const recoveryDetailsCopy = popup.querySelector<HTMLElement>('[data-reveal-copy]')

    expect(recoveryDetailsSource).toHaveTextContent('Recovery details')
    expect(recoveryDetailsCopy).toHaveTextContent('Recovery details')

    fireEvent.keyDown(document, { key: 'Escape' })

    await waitFor(() => {
      expect(popup).toHaveAttribute('data-closed')
    })
  })
})
