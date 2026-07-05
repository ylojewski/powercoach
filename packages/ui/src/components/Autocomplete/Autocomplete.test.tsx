import { Autocomplete as BaseUiAutocomplete } from '@base-ui/react/autocomplete'
import { Dialog } from '@base-ui/react/dialog'
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { createRef, useState, type CSSProperties, type ReactElement, type ReactNode } from 'react'
import { expectTypeOf } from 'vitest'

import {
  type AutocompleteAddOnPosition,
  type AutocompleteAddOnProps,
  type AutocompleteClearProps,
  type AutocompleteFilter,
  type AutocompleteFilterOptions,
  type AutocompleteGroupLabelProps,
  type AutocompleteGroupOption,
  type AutocompleteIconProps,
  type AutocompleteItemIcon,
  type AutocompleteItemOption,
  type AutocompleteItemProps,
  type AutocompleteItemRevealAnimationProps,
  type AutocompleteListProps,
  type AutocompleteNamespace,
  type AutocompletePositionerProps,
  type AutocompleteRootChangeEventDetails,
  type AutocompleteRootChangeEventReason,
  type AutocompleteRootHighlightEventDetails,
  type AutocompleteRootHighlightEventReason,
  type AutocompleteRootProps,
  type AutocompleteSize,
  type FieldSize,
  type PopupSurfaceItemIcon,
  type PopupSurfaceItemRevealAnimationProps,
  type PopupSurfaceSize
} from '../..'
import * as PackageExports from '../..'
import autocompleteStoriesMeta, {
  Ex001LabeledDefaultAutocomplete,
  Ex002SharedSizesAndBothAddOnPositions,
  Ex005AsyncExternallyFilteredResults,
  Ex009AutomaticGroupedObjectsWithDecorativeIcons,
  Ex010ExplicitRailAndRevealOverrides
} from './Autocomplete.stories'

interface AutocompletePackageContract {
  Autocomplete: AutocompleteNamespace
  AutocompleteAddOn: AutocompleteNamespace['AddOn']
  AutocompleteArrow: AutocompleteNamespace['Arrow']
  AutocompleteBackdrop: AutocompleteNamespace['Backdrop']
  AutocompleteClear: AutocompleteNamespace['Clear']
  AutocompleteCollection: AutocompleteNamespace['Collection']
  AutocompleteEmpty: AutocompleteNamespace['Empty']
  AutocompleteGroup: AutocompleteNamespace['Group']
  AutocompleteGroupLabel: AutocompleteNamespace['GroupLabel']
  AutocompleteIcon: AutocompleteNamespace['Icon']
  AutocompleteInput: AutocompleteNamespace['Input']
  AutocompleteInputGroup: AutocompleteNamespace['InputGroup']
  AutocompleteItem: AutocompleteNamespace['Item']
  AutocompleteList: AutocompleteNamespace['List']
  AutocompletePopup: AutocompleteNamespace['Popup']
  AutocompletePortal: AutocompleteNamespace['Portal']
  AutocompletePositioner: AutocompleteNamespace['Positioner']
  AutocompleteRoot: AutocompleteNamespace['Root']
  AutocompleteRow: AutocompleteNamespace['Row']
  AutocompleteSeparator: AutocompleteNamespace['Separator']
  AutocompleteStatus: AutocompleteNamespace['Status']
  AutocompleteTrigger: AutocompleteNamespace['Trigger']
  AutocompleteValue: AutocompleteNamespace['Value']
  useAutocompleteFilter: AutocompleteNamespace['useFilter']
  useAutocompleteFilteredItems: AutocompleteNamespace['useFilteredItems']
}

type IsAny<TValue> = 0 extends 1 & TValue ? true : false
type IsCallable<TValue> =
  IsAny<TValue> extends true ? false : TValue extends (...args: never[]) => unknown ? true : false
type HasNoKey<TValue, TKey extends PropertyKey> =
  IsAny<TValue> extends true ? true : TKey extends keyof TValue ? false : true
type RemovedAutocompleteListStripesProps =
  // @ts-expect-error AutocompleteListStripesProps is intentionally absent from the public API.
  import('../..').AutocompleteListStripesProps

type AutocompleteAddOnChildrenAreReactElement =
  AutocompleteAddOnProps['children'] extends ReactElement ? true : false
type AutocompleteAddOnOmitsEvents =
  Extract<keyof AutocompleteAddOnProps, `on${string}`> extends never ? true : false
type AutocompleteAddOnOmitsAria =
  Extract<keyof AutocompleteAddOnProps, `aria-${string}`> extends never ? true : false
type AutocompleteClearOmitsChildren = HasNoKey<AutocompleteClearProps, 'children'>
type AutocompleteIconOmitsChildren = HasNoKey<AutocompleteIconProps, 'children'>
type AutocompleteItemIconMatchesAddOn =
  AutocompleteItemIcon extends AutocompleteAddOnProps['children'] ? true : false
type AutocompleteItemPropIconMatchesExport =
  NonNullable<AutocompleteItemProps['icon']> extends AutocompleteItemIcon ? true : false
type AutocompleteGroupLabelIconMatchesExport =
  NonNullable<AutocompleteGroupLabelProps['icon']> extends AutocompleteItemIcon ? true : false

const PACKAGE_EXPORTS = PackageExports as typeof PackageExports & AutocompletePackageContract
const Autocomplete = PACKAGE_EXPORTS.Autocomplete
const AutocompleteAddOn = PACKAGE_EXPORTS.AutocompleteAddOn
const AutocompleteArrow = PACKAGE_EXPORTS.AutocompleteArrow
const AutocompleteBackdrop = PACKAGE_EXPORTS.AutocompleteBackdrop
const AutocompleteClear = PACKAGE_EXPORTS.AutocompleteClear
const AutocompleteCollection = PACKAGE_EXPORTS.AutocompleteCollection
const AutocompleteEmpty = PACKAGE_EXPORTS.AutocompleteEmpty
const AutocompleteGroup = PACKAGE_EXPORTS.AutocompleteGroup
const AutocompleteGroupLabel = PACKAGE_EXPORTS.AutocompleteGroupLabel
const AutocompleteIcon = PACKAGE_EXPORTS.AutocompleteIcon
const AutocompleteInput = PACKAGE_EXPORTS.AutocompleteInput
const AutocompleteInputGroup = PACKAGE_EXPORTS.AutocompleteInputGroup
const AutocompleteItem = PACKAGE_EXPORTS.AutocompleteItem
const AutocompleteList = PACKAGE_EXPORTS.AutocompleteList
const AutocompletePopup = PACKAGE_EXPORTS.AutocompletePopup
const AutocompletePortal = PACKAGE_EXPORTS.AutocompletePortal
const AutocompletePositioner = PACKAGE_EXPORTS.AutocompletePositioner
const AutocompleteRoot = PACKAGE_EXPORTS.AutocompleteRoot
const AutocompleteRow = PACKAGE_EXPORTS.AutocompleteRow
const AutocompleteSeparator = PACKAGE_EXPORTS.AutocompleteSeparator
const AutocompleteStatus = PACKAGE_EXPORTS.AutocompleteStatus
const AutocompleteTrigger = PACKAGE_EXPORTS.AutocompleteTrigger
const AutocompleteValue = PACKAGE_EXPORTS.AutocompleteValue
const useAutocompleteFilter = PACKAGE_EXPORTS.useAutocompleteFilter
const useAutocompleteFilteredItems = PACKAGE_EXPORTS.useAutocompleteFilteredItems

const AUTOCOMPLETE_SIZES = [
  {
    addOnClasses: ['w-6', '[&_svg]:size-3'],
    buttonSize: 'icon-xs',
    contentClasses: ['ps-8', 'pe-2'],
    controlClasses: ['size-6', '[&_svg]:size-3'],
    exactHeightClass: 'h-6',
    groupLabelClasses: ['tracking-wide', 'min-h-6', 'pt-0', 'pb-0'],
    hardShadow: '0.125rem 0.125rem 0 0 var(--color-foreground)',
    iconContentClasses: ['ps-8', 'pe-2'],
    iconPositionClass: 'start-0',
    inputClasses: ['px-2', 'text-xs/4'],
    inputGroupClasses: [
      'h-6',
      '[--field-emphasis-offset:--spacing(0.25)]',
      '[--field-emphasis-shadow-offset:--spacing(0.5)]'
    ],
    rowClasses: ['min-h-6', 'py-1', 'gap-2'],
    size: 'xs',
    startContentClasses: ['ps-8', 'pe-2'],
    textClasses: ['text-xs', 'tracking-wide']
  },
  {
    addOnClasses: ['w-8', '[&_svg]:size-3.5'],
    buttonSize: 'icon-sm',
    contentClasses: ['ps-2.5', 'pe-2.5'],
    controlClasses: ['size-8', '[&_svg]:size-4'],
    exactHeightClass: 'h-8',
    groupLabelClasses: ['text-lg', 'tracking-wide', 'min-h-8', 'pt-1', 'pb-0'],
    hardShadow: '0.1875rem 0.1875rem 0 0 var(--color-foreground)',
    iconContentClasses: ['ps-2.5', 'pe-10.5'],
    iconPositionClass: 'end-0',
    inputClasses: ['px-2.5', 'text-sm/4.5'],
    inputGroupClasses: [
      'h-8',
      '[--field-emphasis-offset:--spacing(0.375)]',
      '[--field-emphasis-shadow-offset:--spacing(0.75)]'
    ],
    rowClasses: ['min-h-8', 'py-1.5', 'gap-2.5'],
    size: 'md',
    startContentClasses: ['ps-10.5', 'pe-2.5'],
    textClasses: ['text-sm', 'tracking-wide']
  },
  {
    addOnClasses: ['w-9', '[&_svg]:size-4'],
    buttonSize: 'icon-md',
    contentClasses: ['ps-12', 'pe-3'],
    controlClasses: ['size-9', '[&_svg]:size-4'],
    exactHeightClass: 'h-9',
    groupLabelClasses: ['text-xl', 'tracking-wide', 'min-h-9', 'pt-2', 'pb-0'],
    hardShadow: '0.25rem 0.25rem 0 0 var(--color-foreground)',
    iconContentClasses: ['ps-12', 'pe-3'],
    iconPositionClass: 'start-0',
    inputClasses: ['px-3', 'text-base/5'],
    inputGroupClasses: [
      'h-9',
      '[--field-emphasis-offset:--spacing(0.5)]',
      '[--field-emphasis-shadow-offset:--spacing(1)]'
    ],
    rowClasses: ['min-h-9', 'py-2', 'gap-3'],
    size: 'xl',
    startContentClasses: ['ps-12', 'pe-3'],
    textClasses: ['text-md', 'tracking-wide']
  }
] as const satisfies readonly {
  addOnClasses: readonly string[]
  buttonSize: 'icon-xs' | 'icon-sm' | 'icon-md'
  contentClasses: readonly string[]
  controlClasses: readonly string[]
  exactHeightClass: 'h-6' | 'h-8' | 'h-9'
  groupLabelClasses: readonly string[]
  hardShadow:
    | '0.125rem 0.125rem 0 0 var(--color-foreground)'
    | '0.1875rem 0.1875rem 0 0 var(--color-foreground)'
    | '0.25rem 0.25rem 0 0 var(--color-foreground)'
  iconContentClasses: readonly string[]
  iconPositionClass: 'start-0' | 'end-0'
  inputClasses: readonly string[]
  inputGroupClasses: readonly string[]
  rowClasses: readonly string[]
  startContentClasses: readonly string[]
  textClasses: readonly string[]
  size: AutocompleteSize
}[]

describe('Autocomplete', () => {
  it('UC-001 - exposes the complete non-callable namespace, direct exports, hooks, and Base UI-aligned public types', () => {
    expect(typeof Autocomplete).toBe('object')
    expect(Autocomplete).toEqual({
      AddOn: AutocompleteAddOn,
      Arrow: AutocompleteArrow,
      Backdrop: AutocompleteBackdrop,
      Clear: AutocompleteClear,
      Collection: AutocompleteCollection,
      Empty: AutocompleteEmpty,
      Group: AutocompleteGroup,
      GroupLabel: AutocompleteGroupLabel,
      Icon: AutocompleteIcon,
      Input: AutocompleteInput,
      InputGroup: AutocompleteInputGroup,
      Item: AutocompleteItem,
      List: AutocompleteList,
      Popup: AutocompletePopup,
      Portal: AutocompletePortal,
      Positioner: AutocompletePositioner,
      Root: AutocompleteRoot,
      Row: AutocompleteRow,
      Separator: AutocompleteSeparator,
      Status: AutocompleteStatus,
      Trigger: AutocompleteTrigger,
      useFilter: useAutocompleteFilter,
      useFilteredItems: useAutocompleteFilteredItems,
      Value: AutocompleteValue
    })

    expectTypeOf<IsCallable<AutocompleteNamespace>>().toEqualTypeOf<false>()
    expectTypeOf<AutocompleteSize>().toEqualTypeOf<FieldSize>()
    expectTypeOf<AutocompleteSize>().toEqualTypeOf<PopupSurfaceSize>()
    expectTypeOf<AutocompleteAddOnPosition>().toEqualTypeOf<'start' | 'end'>()
    expectTypeOf<AutocompleteAddOnChildrenAreReactElement>().toEqualTypeOf<true>()
    expectTypeOf<AutocompleteAddOnOmitsEvents>().toEqualTypeOf<true>()
    expectTypeOf<AutocompleteAddOnOmitsAria>().toEqualTypeOf<true>()
    expectTypeOf<AutocompleteClearOmitsChildren>().toEqualTypeOf<true>()
    expectTypeOf<AutocompleteIconOmitsChildren>().toEqualTypeOf<true>()
    expectTypeOf<AutocompleteItemIconMatchesAddOn>().toEqualTypeOf<true>()
    expectTypeOf<AutocompleteItemPropIconMatchesExport>().toEqualTypeOf<true>()
    expectTypeOf<AutocompleteGroupLabelIconMatchesExport>().toEqualTypeOf<true>()
    expectTypeOf<AutocompleteItemIcon>().toEqualTypeOf<PopupSurfaceItemIcon>()
    expectTypeOf<AutocompleteItemRevealAnimationProps>().toEqualTypeOf<PopupSurfaceItemRevealAnimationProps>()
    expectTypeOf<AutocompleteItemOption>().toMatchTypeOf<{
      icon?: AutocompleteItemIcon
      text: string
    }>()
    expectTypeOf<AutocompleteGroupOption<AutocompleteItemOption>>().toMatchTypeOf<{
      icon?: AutocompleteItemIcon
      items: readonly AutocompleteItemOption[]
      text: string
    }>()
    expectTypeOf<NonNullable<AutocompleteItemProps['revealAnimationProps']>>().toEqualTypeOf<
      boolean | AutocompleteItemRevealAnimationProps
    >()
    expectTypeOf<HasNoKey<AutocompleteListProps, 'stripesProps'>>().toEqualTypeOf<true>()
    expectTypeOf<RemovedAutocompleteListStripesProps>()
    expectTypeOf<AutocompleteRootChangeEventReason>().toEqualTypeOf<BaseUiAutocomplete.Root.ChangeEventReason>()
    expectTypeOf<AutocompleteRootChangeEventDetails>().toEqualTypeOf<BaseUiAutocomplete.Root.ChangeEventDetails>()
    expectTypeOf<AutocompleteRootHighlightEventReason>().toEqualTypeOf<BaseUiAutocomplete.Root.HighlightEventReason>()
    expectTypeOf<AutocompleteRootHighlightEventDetails>().toEqualTypeOf<BaseUiAutocomplete.Root.HighlightEventDetails>()
    expectTypeOf<AutocompleteFilter>().toEqualTypeOf<ReturnType<typeof useAutocompleteFilter>>()
    expectTypeOf<AutocompleteFilterOptions>().toEqualTypeOf<
      NonNullable<Parameters<typeof useAutocompleteFilter>[0]>
    >()
    expectTypeOf<AutocompleteItemProps>().toMatchTypeOf<BaseUiAutocomplete.Item.Props>()
    expectTypeOf<AutocompletePositionerProps>().toEqualTypeOf<
      Omit<BaseUiAutocomplete.Positioner.Props, 'sideOffset'>
    >()
    expectTypeOf<HasNoKey<AutocompletePositionerProps, 'sideOffset'>>().toEqualTypeOf<true>()
    expectTypeOf<AutocompleteRootProps<string>>().toMatchTypeOf<
      BaseUiAutocomplete.Root.Props<string>
    >()
  })

  it('UC-002 / UC-003 / UC-004 / UC-005 / UC-010 / EX-001 - renders a labeled free-form field and completes text from optional suggestions', async () => {
    const onValueChange = vi.fn()

    render(
      <PackageExports.Field.Root name="athlete">
        <PackageExports.Field.Label>Athlete</PackageExports.Field.Label>
        <Autocomplete.Root items={['Yann', 'Amina', 'Jo', 'Maya']} onValueChange={onValueChange}>
          <Autocomplete.InputGroup data-testid="athlete-input-group">
            <Autocomplete.AddOn data-testid="athlete-addon">
              <svg data-testid="search-icon" />
            </Autocomplete.AddOn>
            <Autocomplete.Input placeholder="Search athletes…" />
            <Autocomplete.Clear aria-label="Clear athlete" />
            <Autocomplete.Trigger aria-label="Show athlete suggestions">
              <Autocomplete.Icon />
            </Autocomplete.Trigger>
          </Autocomplete.InputGroup>
          <Autocomplete.Portal>
            <Autocomplete.Positioner>
              <Autocomplete.Popup>
                <Autocomplete.Empty>No athlete found.</Autocomplete.Empty>
                <Autocomplete.List>
                  {(athlete: string) => (
                    <Autocomplete.Item key={athlete} value={athlete}>
                      {athlete}
                    </Autocomplete.Item>
                  )}
                </Autocomplete.List>
              </Autocomplete.Popup>
            </Autocomplete.Positioner>
          </Autocomplete.Portal>
        </Autocomplete.Root>
        <PackageExports.Field.Description
          waitingContent="Enter a name or choose an optional suggestion."
          waitingKey="athlete-help"
        />
      </PackageExports.Field.Root>
    )

    const input = screen.getByRole('combobox', { name: 'Athlete' })
    const inputGroup = screen.getByTestId('athlete-input-group')
    const addOn = screen.getByTestId('athlete-addon')

    expect(inputGroup).toHaveAttribute('data-size', 'xl')
    expect(inputGroup).toHaveClass('field-emphasis', 'h-9')
    expect(addOn).toHaveAttribute('aria-hidden', 'true')
    expect(addOn).toHaveAttribute('inert')
    expect(addOn).toHaveAttribute('data-field-addon')
    expect(addOn).toHaveAttribute('data-position', 'start')
    expect(addOn).toHaveClass('pointer-events-none', 'order-first', 'border-e')
    expect(addOn).toContainElement(screen.getByTestId('search-icon'))
    expect(input).toHaveAccessibleDescription('Enter a name or choose an optional suggestion.')

    fireEvent.input(input, {
      inputType: 'insertText',
      target: { value: 'Ami' }
    })

    expect(await screen.findByRole('option', { name: 'Amina' })).toBeInTheDocument()
    expect(screen.queryByRole('option', { name: 'Yann' })).not.toBeInTheDocument()
    expect(onValueChange).toHaveBeenLastCalledWith(
      'Ami',
      expect.objectContaining({
        allowPropagation: expect.any(Function),
        cancel: expect.any(Function),
        event: expect.any(Event),
        reason: 'input-change'
      })
    )

    fireEvent.click(screen.getByRole('option', { name: 'Amina' }))

    expect(input).toHaveValue('Amina')

    fireEvent.input(input, {
      inputType: 'insertText',
      target: { value: 'Custom athlete' }
    })

    expect(input).toHaveValue('Custom athlete')
  })

  it('UC-020 / UC-024 / EX-001 - renders owned decorative icons and fades the stable Clear slot through Base UI visibility', () => {
    render(
      <Autocomplete.Root inline items={['Amina']} size="xl">
        <Autocomplete.InputGroup>
          <Autocomplete.AddOn>
            <svg />
          </Autocomplete.AddOn>
          <Autocomplete.Input aria-label="Athlete controls" />
          <Autocomplete.Clear aria-label="Clear athlete controls" />
          <Autocomplete.Trigger aria-label="Show athlete controls">
            <Autocomplete.Icon data-testid="athlete-trigger-icon" />
          </Autocomplete.Trigger>
        </Autocomplete.InputGroup>
        <Autocomplete.List>
          {(name: string) => <Autocomplete.Item value={name}>{name}</Autocomplete.Item>}
        </Autocomplete.List>
      </Autocomplete.Root>
    )

    const input = screen.getByRole('combobox', { name: 'Athlete controls' })
    const clear = screen.getByLabelText('Clear athlete controls')
    const trigger = screen.getByRole('combobox', { name: 'Show athlete controls' })
    const icon = screen.getByTestId('athlete-trigger-icon')
    const clearIcon = clear.querySelector('.lucide-x')
    const triggerIcon = trigger.querySelector('.lucide-chevrons-up-down')
    const stableClearClassName = clear.className
    const buttonChromeClasses = PackageExports.buttonChromeVariants({
      size: 'icon-md',
      variant: 'ghost'
    })
      .split(/\s+/)
      .filter(Boolean)

    expect(clear).toHaveClass(...buttonChromeClasses)
    expect(trigger).toHaveClass(...buttonChromeClasses)
    expect(clear.tagName).toBe('BUTTON')
    expect(trigger.tagName).toBe('BUTTON')
    expect(clear).toHaveClass('size-9', '[&_svg]:size-4')
    expect(trigger).toHaveClass('size-9', '[&_svg]:size-4')
    expect(clear).toHaveClass(
      'opacity-100',
      'transition-opacity',
      'duration-200',
      'ease-linear',
      'not-data-visible:opacity-0',
      'not-data-visible:pointer-events-none',
      'data-starting-style:opacity-0',
      'data-ending-style:opacity-0',
      'motion-reduce:duration-0'
    )
    expect(clear).not.toHaveClass('not-data-visible:invisible')
    expect(clear).not.toHaveAttribute('data-visible')
    expect(clearIcon).toHaveAttribute('aria-hidden', 'true')
    expect(triggerIcon).toHaveAttribute('aria-hidden', 'true')
    expect(clear.querySelector('button')).not.toBeInTheDocument()
    expect(trigger.querySelector('button')).not.toBeInTheDocument()
    expect(icon.tagName).toBe('SPAN')
    expect(icon).not.toHaveAttribute('role')
    expect(icon).not.toHaveAttribute('tabindex')

    fireEvent.input(input, {
      inputType: 'insertText',
      target: { value: 'A' }
    })

    expect(clear).toHaveAttribute('data-visible')
    expect(clear.className).toBe(stableClearClassName)

    fireEvent.click(clear)

    expect(input).toHaveValue('')
    expect(clear).not.toHaveAttribute('data-visible')
    expect(clear.className).toBe(stableClearClassName)
  })

  it('UC-020 / EX-001 / QA-001 - exposes the disabled ghost-control path for Storybook inspection', () => {
    const Story = Ex001LabeledDefaultAutocomplete.render
    const argTypes = {
      ...autocompleteStoriesMeta.argTypes
    } as Record<string, unknown>

    expect(Story).toBeTypeOf('function')
    expect(argTypes.disabled).toEqual(expect.objectContaining({ control: 'boolean' }))

    if (!Story) {
      throw new Error('Expected EX-001 to provide an inspectable render function')
    }

    render(<Story {...autocompleteStoriesMeta.args} disabled size="xl" />)

    const clear = screen.getByLabelText('Clear athlete')
    const trigger = screen.getByRole('button', { name: 'Athlete' })

    expect(clear.tagName).toBe('BUTTON')
    expect(trigger.tagName).toBe('BUTTON')
    expect(trigger).toHaveAttribute('aria-label', 'Show athlete suggestions')
    expect(clear).toHaveAttribute('data-disabled')
    expect(trigger).toHaveAttribute('data-disabled')
    expect(clear).toHaveClass(
      'border-transparent',
      'data-disabled:text-muted-foreground',
      'focus-visible:outline-foreground',
      'size-9',
      '[&_svg]:size-4'
    )
    expect(trigger).toHaveClass(
      'border-transparent',
      'data-disabled:text-muted-foreground',
      'focus-visible:outline-foreground',
      'size-9',
      '[&_svg]:size-4'
    )
    expect(clear).not.toHaveClass('border-muted-foreground')
    expect(trigger).not.toHaveClass('border-muted-foreground')
    expect(clear.querySelector('button')).not.toBeInTheDocument()
    expect(trigger.querySelector('button')).not.toBeInTheDocument()
  })

  it('UC-025 / UC-026 / EX-001 / QA-001 - highlights automatic story Items from keyboard and pointer input to control RevealAnimation', async () => {
    const Story = Ex001LabeledDefaultAutocomplete.render

    if (!Story) {
      throw new Error('Expected EX-001 to provide an inspectable render function')
    }

    render(<Story {...autocompleteStoriesMeta.args} size="md" />)

    const input = screen.getByRole('combobox', { name: 'Athlete' })

    fireEvent.click(screen.getByLabelText('Show athlete suggestions'))

    const yann = await screen.findByRole('option', { name: 'Yann' })
    const amina = screen.getByRole('option', { name: 'Amina' })
    const list = yann.closest<HTMLElement>('[role="listbox"]')
    const yannOverlay = yann.querySelector<HTMLElement>('[data-reveal-overlay]')
    const aminaOverlay = amina.querySelector<HTMLElement>('[data-reveal-overlay]')
    const yannHiddenClipPath = yannOverlay?.style.clipPath
    const aminaHiddenClipPath = aminaOverlay?.style.clipPath

    expect(list).toBeInTheDocument()
    expect(yannOverlay).toBeInTheDocument()
    expect(aminaOverlay).toBeInTheDocument()

    fireEvent.focus(input)
    fireEvent.keyDown(input, { key: 'ArrowDown' })

    await waitFor(() => {
      expect(yann).toHaveAttribute('data-highlighted')
      expect(input).toHaveAttribute('aria-activedescendant', yann.id)
      expect(list?.querySelectorAll('[data-highlighted]')).toHaveLength(1)
      expect(yannOverlay?.style.clipPath).not.toBe(yannHiddenClipPath)
    })

    fireEvent.mouseMove(amina)

    await waitFor(() => {
      expect(amina).toHaveAttribute('data-highlighted')
      expect(input).toHaveAttribute('aria-activedescendant', amina.id)
      expect(list?.querySelectorAll('[data-highlighted]')).toHaveLength(1)
      expect(aminaOverlay?.style.clipPath).not.toBe(aminaHiddenClipPath)
      expect(yannOverlay?.style.clipPath).toBe(yannHiddenClipPath)
    })
  })

  it('UC-010 / EX-005 / QA-001 - forwards the shared Storybook size control to async Status and visible Empty', async () => {
    interface StoryArgs {
      disabled?: boolean
      size?: AutocompleteSize
    }

    const Story = Ex005AsyncExternallyFilteredResults.render as (args: StoryArgs) => ReactElement
    const sizeControl = Reflect.get(autocompleteStoriesMeta, 'argTypes')?.size as
      | { control?: string; options?: readonly string[] }
      | undefined

    expect(sizeControl).toEqual(
      expect.objectContaining({ control: 'select', options: ['xs', 'md', 'xl'] })
    )

    for (const testCase of AUTOCOMPLETE_SIZES) {
      const { unmount } = render(<Story {...autocompleteStoriesMeta.args} size={testCase.size} />)

      fireEvent.input(screen.getByRole('combobox', { name: 'Async exercise search' }), {
        inputType: 'insertText',
        target: { value: 'zzz' }
      })

      const status = await screen.findByText('0 results')
      const empty = screen.getByText(/No exercise found\./)
      const popup = status.closest<HTMLElement>('[data-popup-surface-root]')

      expect(popup).toHaveAttribute('data-size', testCase.size)
      expect(status).toHaveClass(
        'font-sans',
        'text-muted-foreground',
        'items-center',
        ...testCase.startContentClasses,
        ...testCase.rowClasses,
        ...testCase.textClasses
      )
      expect(empty).toHaveClass(
        'font-sans',
        'text-muted-foreground',
        'items-center',
        ...testCase.startContentClasses,
        ...testCase.rowClasses,
        ...testCase.textClasses
      )

      unmount()
    }
  })

  it('UC-023 / EX-009 / EX-010 / QA-002 - pins the icon-only stories to the md row-local slot mapping', () => {
    const ex009Args = Reflect.get(Ex009AutomaticGroupedObjectsWithDecorativeIcons, 'args') as
      | { disabled?: boolean; size?: AutocompleteSize }
      | undefined
    const ex010Args = Reflect.get(Ex010ExplicitRailAndRevealOverrides, 'args') as
      | { disabled?: boolean; size?: AutocompleteSize }
      | undefined
    const Ex009Story = Ex009AutomaticGroupedObjectsWithDecorativeIcons.render
    const Ex010Story = Ex010ExplicitRailAndRevealOverrides.render

    expect(ex009Args).toEqual(expect.objectContaining({ size: 'md' }))
    expect(ex010Args).toEqual(expect.objectContaining({ size: 'md' }))
    expect(Reflect.get(Ex010ExplicitRailAndRevealOverrides, 'name')).toBe(
      'EX-010 - Existing className and reveal overrides'
    )

    const ex009 = render(<Ex009Story {...autocompleteStoriesMeta.args} {...ex009Args} />)
    const groupedInput = screen.getByRole('combobox', { name: 'Search grouped exercises' })

    expect(groupedInput.closest('[data-size]')).toHaveAttribute('data-size', 'md')
    expect(groupedInput).toHaveClass('text-sm/4.5')

    ex009.unmount()

    render(<Ex010Story {...autocompleteStoriesMeta.args} {...ex010Args} />)

    const explicitInput = screen.getByRole('combobox', {
      name: 'Exercises with custom item colors'
    })
    const standaloneInput = screen.getByRole('combobox', { name: 'Standalone exercise search' })
    const standaloneItem = screen.getByRole('option', { name: 'Deadlift' })
    const standaloneList = standaloneItem.closest<HTMLElement>('[role="listbox"]')
    const standaloneIconSurfaces = Array.from(standaloneItem.querySelectorAll('svg')).map((icon) =>
      icon.closest<HTMLElement>('[aria-hidden="true"][inert]')
    )

    expect(explicitInput.closest('[data-size]')).toHaveAttribute('data-size', 'md')
    expect(explicitInput).toHaveClass('text-sm/4.5')
    expect(standaloneInput).not.toHaveClass('text-sm/4.5')
    expect(
      Array.from(standaloneList?.children ?? []).some(
        (child) => child.getAttribute('aria-hidden') === 'true' && child.hasAttribute('inert')
      )
    ).toBe(false)
    expect(standaloneIconSurfaces).toHaveLength(2)

    for (const iconSurface of standaloneIconSurfaces) {
      expect(iconSurface).toHaveClass('start-0', 'w-8', '[&_svg]:size-3.5')
    }
  })

  it('UC-006 / EX-002 / QA-003 - makes every supported Positioner side inspectable through a Storybook control or visible matrix', async () => {
    const supportedSides = ['top', 'bottom', 'left', 'right', 'inline-start', 'inline-end'] as const
    type SupportedSide = (typeof supportedSides)[number]
    interface SideControl {
      control?: string | { type?: string }
      options?: readonly string[]
    }
    interface StoryArgs {
      disabled?: boolean
      side?: SupportedSide
      size?: AutocompleteSize
    }

    const storyArgTypes = Reflect.get(Ex002SharedSizesAndBothAddOnPositions, 'argTypes') as
      | { side?: SideControl }
      | undefined
    const metaArgTypes = Reflect.get(autocompleteStoriesMeta, 'argTypes') as
      | { side?: SideControl }
      | undefined
    const sideControl = storyArgTypes?.side ?? metaArgTypes?.side
    const controlType =
      typeof sideControl?.control === 'string' ? sideControl.control : sideControl?.control?.type
    const hasSideControl =
      controlType === 'select' &&
      supportedSides.every((side) => sideControl?.options?.includes(side) === true)
    const Ex002Story = Ex002SharedSizesAndBothAddOnPositions.render as (
      args: StoryArgs
    ) => ReactElement

    if (hasSideControl) {
      expect(sideControl?.options).toHaveLength(supportedSides.length)
    }

    render(
      <Ex002Story
        {...autocompleteStoriesMeta.args}
        {...(hasSideControl ? { side: 'right' as const } : {})}
      />
    )

    for (const trigger of screen.queryAllByRole('button', {
      name: /Show .* suggestions/
    })) {
      fireEvent.click(trigger)
    }

    await waitFor(() => {
      const renderedSides = new Set(
        Array.from(document.querySelectorAll<HTMLElement>('[data-side]'))
          .map((element) => element.dataset.side)
          .filter((side): side is string => side !== undefined)
      )

      if (hasSideControl) {
        expect(renderedSides).toContain('right')
      } else {
        expect(renderedSides).toEqual(new Set(supportedSides))
      }
    })
  })

  it('UC-003 / UC-004 / UC-008 / UC-009 / UC-010 / UC-011 / UC-015 / UC-020 / UC-023 / UC-025 / UC-028 / UC-029 / EX-002 / CR-001 / QA-001 - coordinates every size, both logical AddOn positions, InputGroup-matched popup rows, controls, and consumer overrides', () => {
    for (const [index, testCase] of AUTOCOMPLETE_SIZES.entries()) {
      const { unmount } = render(
        <div>
          <Autocomplete.Root inline items={['Amina']} open size={testCase.size}>
            <Autocomplete.InputGroup data-testid={`group-${testCase.size}`}>
              <Autocomplete.AddOn
                data-testid={`addon-${testCase.size}`}
                position={index === 1 ? 'end' : 'start'}
              >
                <svg />
              </Autocomplete.AddOn>
              <Autocomplete.Input aria-label={`${testCase.size} athlete`} />
              <Autocomplete.Clear
                aria-label={`Clear ${testCase.size} athlete`}
                data-testid={`clear-${testCase.size}`}
              />
              <Autocomplete.Trigger
                aria-label={`Show ${testCase.size} suggestions`}
                data-testid={`trigger-${testCase.size}`}
              >
                <Autocomplete.Icon data-testid={`icon-${testCase.size}`} />
              </Autocomplete.Trigger>
            </Autocomplete.InputGroup>
            <Autocomplete.Status data-testid={`status-${testCase.size}`}>
              1 result
            </Autocomplete.Status>
            <Autocomplete.Empty data-testid={`empty-${testCase.size}`}>
              No athlete found.
            </Autocomplete.Empty>
            <Autocomplete.List data-testid={`list-${testCase.size}`}>
              <Autocomplete.Group data-testid={`result-group-${testCase.size}`} items={['Amina']}>
                <Autocomplete.GroupLabel
                  data-testid={`label-${testCase.size}`}
                  icon={<svg data-testid={`label-icon-${testCase.size}`} />}
                >
                  Athletes
                </Autocomplete.GroupLabel>
                <Autocomplete.Collection>
                  {(name: string) => (
                    <Autocomplete.Item
                      data-testid={`item-${testCase.size}`}
                      icon={<svg data-testid={`item-icon-${testCase.size}`} />}
                      value={name}
                    >
                      {name}
                    </Autocomplete.Item>
                  )}
                </Autocomplete.Collection>
              </Autocomplete.Group>
            </Autocomplete.List>
          </Autocomplete.Root>

          <Autocomplete.Root inline items={[]} open size={testCase.size}>
            <Autocomplete.InputGroup>
              <Autocomplete.AddOn position={index === 1 ? 'end' : 'start'}>
                <svg />
              </Autocomplete.AddOn>
              <Autocomplete.Input aria-label={`${testCase.size} empty athlete`} />
            </Autocomplete.InputGroup>
            <Autocomplete.Empty data-testid={`visible-empty-${testCase.size}`}>
              No athlete found.
            </Autocomplete.Empty>
            <Autocomplete.List />
          </Autocomplete.Root>
        </div>
      )

      const inputGroup = screen.getByTestId(`group-${testCase.size}`)
      const addOn = screen.getByTestId(`addon-${testCase.size}`)
      const input = screen.getByRole('combobox', { name: `${testCase.size} athlete` })
      const clear = screen.getByTestId(`clear-${testCase.size}`)
      const trigger = screen.getByTestId(`trigger-${testCase.size}`)
      const icon = screen.getByTestId(`icon-${testCase.size}`)
      const resultGroup = screen.getByTestId(`result-group-${testCase.size}`)
      const groupLabel = screen.getByTestId(`label-${testCase.size}`)
      const groupLabelIcon = screen
        .getByTestId(`label-icon-${testCase.size}`)
        .closest<HTMLElement>('[aria-hidden="true"][inert]')
      const item = screen.getByTestId(`item-${testCase.size}`)
      const itemReveal = item.querySelector('[data-motion="reveal"]')
      const itemVisualSurface =
        itemReveal?.querySelector('[data-reveal-surface]')?.firstElementChild
      const itemIconSurfaces = screen
        .getAllByTestId(`item-icon-${testCase.size}`)
        .map((itemIcon) => itemIcon.closest<HTMLElement>('[aria-hidden="true"][inert]'))
      const status = screen.getByTestId(`status-${testCase.size}`)
      const empty = screen.getByTestId(`empty-${testCase.size}`)
      const visibleEmpty = screen.getByTestId(`visible-empty-${testCase.size}`)
      const list = screen.getByTestId(`list-${testCase.size}`)
      const buttonChromeClasses = PackageExports.buttonChromeVariants({
        size: testCase.buttonSize,
        variant: 'ghost'
      })
        .split(/\s+/)
        .filter(
          (className) =>
            testCase.size !== 'xs' || (className !== 'size-7' && className !== '[&_svg]:size-3.5')
        )

      expect(inputGroup).toHaveAttribute('data-size', testCase.size)
      expect(inputGroup).toHaveClass(...testCase.inputGroupClasses)
      expect(addOn).toHaveClass(...testCase.addOnClasses)
      expect(input).toHaveClass(...testCase.inputClasses)
      expect(clear).toHaveClass(...buttonChromeClasses, ...testCase.controlClasses)
      expect(trigger).toHaveClass(...buttonChromeClasses, ...testCase.controlClasses)
      expect(icon).not.toHaveClass(...testCase.controlClasses)
      expect(resultGroup).toHaveAttribute('role', 'group')
      expect(resultGroup).toHaveAttribute('data-popup-surface-group')
      expect(resultGroup).toHaveAttribute('aria-labelledby', groupLabel.id)
      expect(groupLabel).toHaveAttribute('data-popup-surface-group-label')
      expect(groupLabel).toHaveAttribute('data-size', testCase.size)
      expect(groupLabel).toHaveAttribute('data-icon-position', index === 1 ? 'end' : 'start')
      expect(groupLabel).toHaveAttribute('data-content-inset', index === 1 ? 'end' : 'start')
      expect(groupLabel).toHaveClass(
        'font-heading',
        'lowercase',
        'text-muted-foreground',
        ...testCase.iconContentClasses,
        ...testCase.groupLabelClasses
      )
      expect(item).toHaveAttribute('role', 'option')
      expect(item).toHaveAttribute('data-popup-surface-item')
      expect(item).toHaveAttribute('data-size', testCase.size)
      expect(item).toHaveAttribute('data-icon-position', index === 1 ? 'end' : 'start')
      expect(item).toHaveAttribute('data-content-inset', index === 1 ? 'end' : 'start')
      expect(item).not.toHaveAttribute('data-revealed')
      expect(item).toHaveClass('[&>[data-motion=reveal]]:grid')
      expect(item.querySelectorAll('[data-motion="reveal"]')).toHaveLength(1)
      expect(itemVisualSurface).toHaveClass(
        'font-sans',
        'bg-background',
        'text-foreground',
        'items-center',
        ...testCase.iconContentClasses,
        ...testCase.rowClasses,
        ...testCase.textClasses
      )
      expect(status).toHaveClass(
        'font-sans',
        'text-muted-foreground',
        'items-center',
        ...testCase.contentClasses,
        ...testCase.rowClasses,
        ...testCase.textClasses
      )
      expect(empty).toHaveClass('font-sans', 'text-muted-foreground', ...testCase.textClasses)
      expect(empty).toBeEmptyDOMElement()
      expect(empty).not.toHaveAttribute('hidden')
      expect(empty).not.toHaveAttribute('aria-hidden')
      expect(visibleEmpty).toHaveAttribute('role', 'status')
      expect(visibleEmpty).toHaveAttribute('aria-live', 'polite')
      expect(visibleEmpty).toHaveClass(
        'font-sans',
        'text-muted-foreground',
        'items-center',
        ...testCase.contentClasses,
        ...testCase.rowClasses,
        ...testCase.textClasses
      )
      expect(itemVisualSurface?.classList.contains(testCase.exactHeightClass)).toBe(false)
      expect(groupLabel.classList.contains(testCase.exactHeightClass)).toBe(false)
      expect(addOn).toHaveAttribute('data-position', index === 1 ? 'end' : 'start')
      expect(addOn).toHaveClass(index === 1 ? 'order-last' : 'order-first')
      expect(addOn).toHaveClass(index === 1 ? 'border-s' : 'border-e')
      expect(
        Array.from(list.children).some(
          (child) => child.getAttribute('aria-hidden') === 'true' && child.hasAttribute('inert')
        )
      ).toBe(false)
      expect(groupLabelIcon).toHaveClass(testCase.iconPositionClass, ...testCase.addOnClasses)
      expect(itemIconSurfaces).toHaveLength(2)
      for (const itemIconSurface of itemIconSurfaces) {
        expect(itemIconSurface).toHaveClass(testCase.iconPositionClass, ...testCase.addOnClasses)
      }

      unmount()
    }

    render(
      <Autocomplete.Root items={['Maya']} open>
        <Autocomplete.InputGroup>
          <Autocomplete.AddOn>
            <svg />
          </Autocomplete.AddOn>
          <Autocomplete.Input aria-label="Override athlete" />
        </Autocomplete.InputGroup>
        <Autocomplete.Portal keepMounted>
          <Autocomplete.Positioner>
            <Autocomplete.Popup
              className="w-80 shadow-none duration-300"
              data-testid="overridden-popup"
              render={
                <section
                  className="isolate w-96 shadow-lg duration-700"
                  data-render-surface="popup"
                  style={{ opacity: 0.2, zIndex: 7 }}
                />
              }
              style={
                {
                  '--hard-shadow': '0 0 0 0 transparent',
                  opacity: 0.8
                } as CSSProperties
              }
            >
              <Autocomplete.List>
                {(name: string) => <Autocomplete.Item value={name}>{name}</Autocomplete.Item>}
              </Autocomplete.List>
            </Autocomplete.Popup>
          </Autocomplete.Positioner>
        </Autocomplete.Portal>
      </Autocomplete.Root>
    )

    const popup = screen.getByTestId('overridden-popup')

    expect(popup.tagName).toBe('SECTION')
    expect(popup).toHaveAttribute('data-popup-surface-root')
    expect(popup).toHaveAttribute('data-size', 'xl')
    expect(popup).toHaveClass('isolate', 'w-80', 'shadow-none', 'duration-300', 'box-border')
    expect(popup).not.toHaveClass(
      'w-96',
      'shadow-lg',
      'duration-700',
      'w-(--anchor-width)',
      'shadow-(--hard-shadow)',
      'duration-100'
    )
    expect(popup).toHaveAttribute('data-render-surface', 'popup')
    expect(popup).toHaveAttribute('data-open')
    expect(popup).toHaveStyle({
      '--hard-shadow': '0 0 0 0 transparent',
      opacity: '0.8',
      zIndex: '7'
    })
  })

  it('UC-015 / UC-025 / UC-029 / EX-010 - resolves Item className once through PopupSurface on the semantic Item and both Reveal copies', () => {
    const itemRef = createRef<HTMLElement>()
    const onClick = vi.fn()
    const itemClassName = vi.fn(
      (_state: BaseUiAutocomplete.Item.State) =>
        'min-h-12 gap-1 bg-accent py-3 ps-6 pe-6 text-xl/7 tracking-normal text-accent-foreground opacity-75'
    )

    render(
      <Autocomplete.Root inline items={['Deadlift']} open size="md">
        <Autocomplete.Input aria-label="Revealed Item overrides" />
        <Autocomplete.List>
          <Autocomplete.Item
            className={itemClassName}
            onClick={onClick}
            ref={itemRef}
            render={<a data-render-surface="revealed-item" href="#deadlift" />}
            style={{ borderRadius: '11px', opacity: 0.75 }}
            value="Deadlift"
          >
            Deadlift
          </Autocomplete.Item>
        </Autocomplete.List>
      </Autocomplete.Root>
    )

    const input = screen.getByRole('combobox', { name: 'Revealed Item overrides' })
    const item = screen.getByRole('option', { name: 'Deadlift' })
    const realVisualSurface = item.querySelector<HTMLElement>('[data-reveal-source]')
    const highlightedVisualSurface = item.querySelector<HTMLElement>(
      '[data-reveal-overlay-surface]'
    )
    const consumerVisualClasses = [
      'min-h-12',
      'gap-1',
      'py-3',
      'ps-6',
      'pe-6',
      'bg-accent',
      'text-xl/7',
      'text-accent-foreground',
      'tracking-normal',
      'opacity-75'
    ]

    expect(realVisualSurface).toBeInTheDocument()
    expect(highlightedVisualSurface).toBeInTheDocument()
    expect(itemClassName).toHaveBeenCalledOnce()
    expect(itemClassName).toHaveBeenLastCalledWith(
      expect.objectContaining({ disabled: false, highlighted: false })
    )

    for (const element of [
      item,
      realVisualSurface as HTMLElement,
      highlightedVisualSurface as HTMLElement
    ]) {
      expect(element).toHaveClass(...consumerVisualClasses)
      expect(element).not.toHaveClass('bg-background', 'text-foreground')
    }

    expect(item).toHaveStyle({ borderRadius: '11px', opacity: '0.75' })
    expect(realVisualSurface).not.toHaveStyle({ borderRadius: '11px' })
    expect(realVisualSurface).not.toHaveStyle({ opacity: '0.75' })
    expect(highlightedVisualSurface).not.toHaveStyle({ borderRadius: '11px' })
    expect(highlightedVisualSurface).not.toHaveStyle({ opacity: '0.75' })

    fireEvent.focus(input)
    fireEvent.keyDown(input, { key: 'ArrowDown' })

    expect(item).toHaveAttribute('data-highlighted')
    expect(input).toHaveAttribute('aria-activedescendant', item.id)

    expect(itemRef.current).toBe(item)
    expect(item.tagName).toBe('A')
    expect(item).toHaveAttribute('role', 'option')
    expect(item).toHaveAttribute('data-popup-surface-item')
    expect(item).toHaveAttribute('data-size', 'md')
    expect(item).toHaveAttribute('data-content-inset', 'base')
    expect(item).toHaveAttribute('data-revealed')
    expect(item).toHaveAttribute('href', '#deadlift')
    expect(item).toHaveAttribute('data-render-surface', 'revealed-item')
    expect(item.querySelectorAll('[data-motion="reveal"]')).toHaveLength(1)

    fireEvent.click(item)

    expect(onClick).toHaveBeenCalledOnce()
  })

  it('UC-007 / UC-029 / EX-001 / EX-002 - consumes PopupSurface Root with the Input-matched hard shadow at every Root size', () => {
    for (const testCase of AUTOCOMPLETE_SIZES) {
      const { unmount } = render(
        <Autocomplete.Root items={['Amina']} open size={testCase.size}>
          <Autocomplete.InputGroup>
            <Autocomplete.AddOn>
              <svg />
            </Autocomplete.AddOn>
            <Autocomplete.Input aria-label={`${testCase.size} shadow athlete`} />
          </Autocomplete.InputGroup>
          <Autocomplete.Portal>
            <Autocomplete.Positioner>
              <Autocomplete.Popup data-testid={`shadow-popup-${testCase.size}`}>
                <Autocomplete.List>
                  {(name: string) => <Autocomplete.Item value={name}>{name}</Autocomplete.Item>}
                </Autocomplete.List>
              </Autocomplete.Popup>
            </Autocomplete.Positioner>
          </Autocomplete.Portal>
        </Autocomplete.Root>
      )

      const popup = screen.getByTestId(`shadow-popup-${testCase.size}`)

      expect(popup).toHaveAttribute('data-popup-surface-root')
      expect(popup).toHaveAttribute('data-size', testCase.size)
      expect(popup).toHaveClass('shadow-(--hard-shadow)')
      expect(popup).toHaveStyle({
        '--hard-shadow': testCase.hardShadow
      })

      unmount()
    }
  })

  it('UC-006 / EX-001 / EX-002 - keeps every requested Popup side one pixel from its anchor at every Root size', async () => {
    const placements = [
      { side: 'bottom', transform: 'translate(0px, 1px)' },
      { side: 'top', transform: 'translate(0px, -1px)' },
      { side: 'left', transform: 'translate(-1px, 0px)' },
      { side: 'right', transform: 'translate(1px, 0px)' },
      { side: 'inline-start', transform: 'translate(-1px, 0px)' },
      { side: 'inline-end', transform: 'translate(1px, 0px)' }
    ] as const

    for (const testCase of AUTOCOMPLETE_SIZES) {
      for (const placement of placements) {
        const { unmount } = render(
          <Autocomplete.Root items={['Amina']} open size={testCase.size}>
            <Autocomplete.Input aria-label={`${testCase.size} ${placement.side} athlete`} />
            <Autocomplete.Portal>
              <Autocomplete.Positioner
                collisionAvoidance={{ align: 'none', side: 'none' }}
                data-testid={`${testCase.size}-${placement.side}-positioner`}
                side={placement.side}
              >
                <Autocomplete.Popup>
                  <Autocomplete.List>
                    {(item: string) => <Autocomplete.Item value={item}>{item}</Autocomplete.Item>}
                  </Autocomplete.List>
                </Autocomplete.Popup>
              </Autocomplete.Positioner>
            </Autocomplete.Portal>
          </Autocomplete.Root>
        )

        expect(
          await screen.findByTestId(`${testCase.size}-${placement.side}-positioner`)
        ).toHaveStyle({ transform: placement.transform })

        unmount()
      }
    }
  })

  it('UC-002 / UC-006 / UC-007 / UC-014 / UC-016 / UC-017 / UC-018 / UC-029 / EX-003 / QA-002 - preserves controlled reasons, shared PopupSurface hooks, geometry, and reduced-motion exit completion', async () => {
    const changeDetails: AutocompleteRootChangeEventDetails[] = []

    function ControlledAutocomplete() {
      const [value, setValue] = useState('')
      const [open, setOpen] = useState(false)
      const [phase, setPhase] = useState('closed')
      const [highlight, setHighlight] = useState(-1)

      return (
        <Autocomplete.Root
          items={['Deadlift', 'Front squat', 'Pull-up']}
          onItemHighlighted={(
            _: string | undefined,
            details: BaseUiAutocomplete.Root.HighlightEventDetails
          ) => setHighlight(details.index)}
          onOpenChange={(
            nextOpen: boolean,
            details: BaseUiAutocomplete.Root.ChangeEventDetails
          ) => {
            changeDetails.push(details)
            setOpen(nextOpen)
          }}
          onOpenChangeComplete={(nextOpen: boolean) => setPhase(nextOpen ? 'open' : 'closed')}
          onValueChange={(
            nextValue: string,
            details: BaseUiAutocomplete.Root.ChangeEventDetails
          ) => {
            changeDetails.push(details)
            setValue(nextValue)
          }}
          open={open}
          value={value}
        >
          <Autocomplete.InputGroup>
            <Autocomplete.AddOn>
              <svg />
            </Autocomplete.AddOn>
            <Autocomplete.Input aria-label="Exercise" />
            <Autocomplete.Clear aria-label="Clear exercise" />
            <Autocomplete.Trigger aria-label="Show exercises">show</Autocomplete.Trigger>
          </Autocomplete.InputGroup>
          <Autocomplete.Portal keepMounted>
            <Autocomplete.Positioner
              className={(state: BaseUiAutocomplete.Positioner.State) =>
                state.open ? 'positioner-open' : 'positioner-closed'
              }
              data-testid="exercise-positioner"
            >
              <Autocomplete.Popup
                className={(state: BaseUiAutocomplete.Popup.State) =>
                  state.open ? 'popup-open' : 'popup-closed'
                }
                data-testid="exercise-popup"
              >
                <Autocomplete.List>
                  {(exercise: string) => (
                    <Autocomplete.Item key={exercise} value={exercise}>
                      {exercise}
                    </Autocomplete.Item>
                  )}
                </Autocomplete.List>
              </Autocomplete.Popup>
            </Autocomplete.Positioner>
          </Autocomplete.Portal>
          <output>
            value: {value || 'empty'}; highlighted: {highlight}; phase: {phase}
          </output>
        </Autocomplete.Root>
      )
    }

    render(<ControlledAutocomplete />)

    fireEvent.click(screen.getByRole('button', { name: 'Show exercises' }))

    const popup = await screen.findByTestId('exercise-popup')
    const positioner = screen.getByTestId('exercise-positioner')

    expect(positioner).toHaveClass('positioner-open')
    expect(positioner).toHaveAttribute('data-open')
    expect(positioner).toHaveAttribute('data-side')
    expect(popup).toHaveClass(
      'popup-open',
      'box-border',
      'w-(--anchor-width)',
      'shadow-(--hard-shadow)',
      'origin-[var(--transform-origin)]',
      'transition-[scale,opacity,width,height]',
      'data-starting-style:scale-90',
      'data-starting-style:opacity-0',
      'data-ending-style:scale-90',
      'data-ending-style:opacity-0',
      'motion-reduce:duration-0',
      'motion-reduce:data-ending-style:duration-0'
    )
    expect(popup).toHaveAttribute('data-open')
    expect(popup).toHaveAttribute('data-popup-surface-root')
    expect(popup).toHaveAttribute('data-size', 'xl')
    expect(popup).toHaveStyle({
      '--popup-surface-enter-duration': '350ms',
      '--popup-surface-enter-easing': 'cubic-bezier(0.22, 1, 0.36, 1)',
      '--popup-surface-exit-duration': '150ms',
      '--popup-surface-exit-easing': 'ease',
      '--popup-surface-layout-duration': '0ms'
    })
    expect(changeDetails[0]).toEqual(
      expect.objectContaining({
        allowPropagation: expect.any(Function),
        cancel: expect.any(Function),
        event: expect.any(Event),
        reason: 'trigger-press'
      })
    )

    fireEvent.change(screen.getByRole('combobox', { name: 'Exercise' }), {
      target: { value: 'Pull' }
    })
    fireEvent.keyDown(screen.getByRole('combobox', { name: 'Exercise' }), {
      key: 'ArrowDown'
    })

    expect(await screen.findByRole('option', { name: 'Pull-up' })).toHaveAttribute(
      'data-highlighted'
    )
    expect(screen.getByText(/highlighted: 0/)).toBeInTheDocument()

    fireEvent.keyDown(document, { key: 'Escape' })

    await waitFor(() => {
      expect(popup).toHaveAttribute('data-closed')
      expect(popup).toHaveClass('popup-closed')
      expect(screen.getByText(/phase: closed/)).toBeInTheDocument()
    })
  })

  it('UC-008 / UC-009 / UC-011 / UC-015 / UC-022 / UC-025 / UC-028 / EX-004 - preserves grouped associations, revealed complex children, Item render composition, and the empty state', () => {
    const groupRef = createRef<HTMLDivElement>()
    const groupLabelRef = createRef<HTMLDivElement>()
    const itemRef = createRef<HTMLElement>()
    const onClick = vi.fn()
    const teams = [
      {
        items: [
          { discipline: 'Powerlifting', id: 'amina', name: 'Amina' },
          { discipline: 'Weightlifting', id: 'maya', name: 'Maya' }
        ],
        value: 'Power'
      }
    ]

    render(
      <Autocomplete.Root
        inline
        itemToStringValue={(athlete: (typeof teams)[number]['items'][number]) => athlete.name}
        items={teams}
        open
        size="md"
      >
        <Autocomplete.InputGroup>
          <Autocomplete.AddOn>
            <svg />
          </Autocomplete.AddOn>
          <Autocomplete.Input aria-label="Grouped athlete search" />
        </Autocomplete.InputGroup>
        <Autocomplete.Empty data-testid="grouped-empty">No athlete found.</Autocomplete.Empty>
        <Autocomplete.List>
          {(team: (typeof teams)[number]) => (
            <Autocomplete.Group
              items={team.items}
              key={team.value}
              ref={groupRef}
              render={<div data-group-render-surface="" />}
            >
              <Autocomplete.GroupLabel
                ref={groupLabelRef}
                render={<div data-group-label-render-surface="" />}
              >
                {team.value}
              </Autocomplete.GroupLabel>
              <Autocomplete.Collection>
                {(athlete: (typeof team.items)[number]) => (
                  <Autocomplete.Item
                    key={athlete.id}
                    onClick={onClick}
                    ref={athlete.id === 'amina' ? itemRef : undefined}
                    render={<a href={`/athletes/${athlete.id}`} />}
                    value={athlete}
                  >
                    <span>
                      <span>{athlete.name}</span>
                      <PackageExports.Text size="xs" tone="muted">
                        {athlete.discipline}
                      </PackageExports.Text>
                    </span>
                    <span>active</span>
                  </Autocomplete.Item>
                )}
              </Autocomplete.Collection>
            </Autocomplete.Group>
          )}
        </Autocomplete.List>
      </Autocomplete.Root>
    )

    const group = screen.getByRole('group', { name: 'Power' })
    const groupLabel = within(group).getByText('Power')
    const item = screen.getByRole('option', { name: 'AminaPowerliftingactive' })
    const itemReveal = item.querySelector('[data-motion="reveal"]')
    const itemVisualSurface = itemReveal?.querySelector('[data-reveal-surface]')?.firstElementChild
    const emptyBeforeFiltering = screen.getByTestId('grouped-empty')

    expect(group).toHaveAttribute('data-popup-surface-group')
    expect(group).toHaveAttribute('data-group-render-surface')
    expect(group).toHaveAttribute('aria-labelledby', groupLabel.id)
    expect(groupRef.current).toBe(group)
    expect(groupLabel).toHaveAttribute('data-popup-surface-group-label')
    expect(groupLabel).toHaveAttribute('data-group-label-render-surface')
    expect(groupLabel).toHaveAttribute('data-size', 'md')
    expect(groupLabel).toHaveAttribute('data-content-inset', 'start')
    expect(groupLabel).toHaveClass(
      'font-heading',
      'text-lg',
      'tracking-wide',
      'lowercase',
      'text-muted-foreground',
      'min-h-8',
      'pt-1',
      'pb-0'
    )
    expect(groupLabelRef.current).toBe(groupLabel)
    expect(groupLabel.querySelector('[data-motion="reveal"]')).toBeNull()
    expect(item.tagName).toBe('A')
    expect(item).toHaveAttribute('href', '/athletes/amina')
    expect(item.querySelectorAll('[data-motion="reveal"]')).toHaveLength(1)
    expect(itemVisualSurface).toHaveClass(
      'font-sans',
      'text-sm',
      'tracking-wide',
      'text-foreground',
      'min-h-8',
      'py-1.5'
    )
    expect(within(item).getAllByText('Powerlifting')).toHaveLength(2)
    expect(within(item).getAllByText('active')).toHaveLength(2)
    expect(itemRef.current).toBe(item)
    expect(screen.getAllByText('Amina')).toHaveLength(2)
    expect(emptyBeforeFiltering).toBeEmptyDOMElement()
    expect(emptyBeforeFiltering).not.toHaveAttribute('hidden')
    expect(emptyBeforeFiltering).not.toHaveAttribute('aria-hidden')

    fireEvent.click(item)

    expect(onClick).toHaveBeenCalledOnce()

    fireEvent.input(screen.getByRole('combobox', { name: 'Grouped athlete search' }), {
      inputType: 'insertText',
      target: { value: 'Nobody' }
    })

    const empty = screen.getByTestId('grouped-empty')

    expect(empty).toHaveAttribute('role', 'status')
    expect(empty).toHaveAttribute('aria-live', 'polite')
    expect(empty).toHaveTextContent('No athlete found.')
    expect(empty).toHaveClass('min-h-8', 'py-1.5')
    expect(screen.queryByRole('group', { name: 'Power' })).not.toBeInTheDocument()
  })

  it('UC-023 / EX-001 / EX-002 / EX-009 / EX-010 - places only row-local icon slots on the AddOn side or standalone start fallback', () => {
    render(
      <div dir="rtl">
        <Autocomplete.Root inline items={['Start icon', 'Plain']} open size="xs">
          <Autocomplete.InputGroup>
            <Autocomplete.AddOn>
              <svg />
            </Autocomplete.AddOn>
            <Autocomplete.Input aria-label="Start icon column" />
          </Autocomplete.InputGroup>
          <Autocomplete.List data-testid="start-icon-list">
            {(item: string) => (
              <Autocomplete.Item
                icon={item === 'Start icon' ? <svg data-testid="start-item-icon" /> : undefined}
                revealAnimationProps={false}
                value={item}
              >
                {item}
              </Autocomplete.Item>
            )}
          </Autocomplete.List>
        </Autocomplete.Root>

        <Autocomplete.Root inline items={['End icon']} open size="md">
          <Autocomplete.InputGroup>
            <Autocomplete.AddOn position="end">
              <svg />
            </Autocomplete.AddOn>
            <Autocomplete.Input aria-label="End icon column" />
          </Autocomplete.InputGroup>
          <Autocomplete.List data-testid="end-icon-list">
            <Autocomplete.Group items={['End icon']}>
              <Autocomplete.GroupLabel icon={<svg data-testid="end-group-icon" />}>
                End group
              </Autocomplete.GroupLabel>
              <Autocomplete.Collection>
                {(item: string) => (
                  <Autocomplete.Item
                    icon={<svg data-testid="end-item-icon" />}
                    revealAnimationProps={false}
                    value={item}
                  >
                    {item}
                  </Autocomplete.Item>
                )}
              </Autocomplete.Collection>
            </Autocomplete.Group>
          </Autocomplete.List>
        </Autocomplete.Root>

        <Autocomplete.Root inline items={['Standalone icon']} open size="xl">
          <Autocomplete.Input aria-label="Standalone icon column" />
          <Autocomplete.List data-testid="standalone-icon-list">
            {(item: string) => (
              <Autocomplete.Item
                icon={<svg data-testid="standalone-item-icon" />}
                revealAnimationProps={false}
                value={item}
              >
                {item}
              </Autocomplete.Item>
            )}
          </Autocomplete.List>
        </Autocomplete.Root>
      </div>
    )

    const startItem = screen.getByRole('option', { name: 'Start icon' })
    const plainItem = screen.getByRole('option', { name: 'Plain' })
    const endGroupLabel = screen.getByText('End group')
    const endItem = screen.getByRole('option', { name: 'End icon' })
    const standaloneItem = screen.getByRole('option', { name: 'Standalone icon' })
    const startIcon = screen
      .getByTestId('start-item-icon')
      .closest<HTMLElement>('[aria-hidden="true"][inert]')
    const endGroupIcon = screen
      .getByTestId('end-group-icon')
      .closest<HTMLElement>('[aria-hidden="true"][inert]')
    const endItemIcon = screen
      .getByTestId('end-item-icon')
      .closest<HTMLElement>('[aria-hidden="true"][inert]')
    const standaloneIcon = screen
      .getByTestId('standalone-item-icon')
      .closest<HTMLElement>('[aria-hidden="true"][inert]')

    expect(startIcon).toHaveClass('start-0', 'w-6', '[&_svg]:size-3')
    expect(startItem).toHaveClass('ps-8', 'pe-2')
    expect(plainItem.querySelector('[aria-hidden="true"][inert]')).toBeNull()
    expect(plainItem).toHaveClass('ps-8', 'pe-2')
    expect(endGroupIcon).toHaveClass('end-0', 'w-8', '[&_svg]:size-3.5')
    expect(endGroupLabel).toHaveClass('ps-2.5', 'pe-10.5')
    expect(endItemIcon).toHaveClass('end-0', 'w-8', '[&_svg]:size-3.5')
    expect(endItem).toHaveClass('ps-2.5', 'pe-10.5')
    expect(standaloneIcon).toHaveClass('start-0', 'w-9', '[&_svg]:size-4')
    expect(standaloneItem).toHaveClass('ps-12', 'pe-3')

    for (const list of [
      screen.getByTestId('start-icon-list'),
      screen.getByTestId('end-icon-list'),
      screen.getByTestId('standalone-icon-list')
    ]) {
      expect(
        Array.from(list.children).some(
          (child) => child.getAttribute('aria-hidden') === 'true' && child.hasAttribute('inert')
        )
      ).toBe(false)
    }
  })

  it('UC-025 / UC-029 / EX-002 / EX-004 / EX-010 - composes PopupSurface Item with default, true, configured, or immediate reveal presentation', async () => {
    const onRevealChange = vi.fn()
    const onRevealStart = vi.fn()

    render(
      <Autocomplete.Root inline items={['Default', 'True', 'Configured', 'Immediate']} open>
        <Autocomplete.Input aria-label="Reveal presentation" />
        <Autocomplete.List>
          {(item: string) => (
            <Autocomplete.Item
              className={item === 'Immediate' ? 'bg-accent text-accent-foreground' : undefined}
              revealAnimationProps={
                item === 'True'
                  ? true
                  : item === 'Configured'
                    ? {
                        contentMode: 'phrasing',
                        direction: 'left-to-right',
                        onRevealChange,
                        onRevealStart,
                        scale: 1.1
                      }
                    : item === 'Immediate'
                      ? false
                      : undefined
              }
              value={item}
            >
              {item}
            </Autocomplete.Item>
          )}
        </Autocomplete.List>
      </Autocomplete.Root>
    )

    const input = screen.getByRole('combobox', { name: 'Reveal presentation' })
    const defaultItem = screen.getByRole('option', { name: 'Default' })
    const trueItem = screen.getByRole('option', { name: 'True' })
    const configuredItem = screen.getByRole('option', { name: 'Configured' })
    const immediateItem = screen.getByRole('option', { name: 'Immediate' })
    const getCopyScaleTransform = (item: HTMLElement): string => {
      const copyScale = item.querySelector<HTMLElement>('[data-reveal-copy-scale]')

      if (!copyScale) {
        throw new Error('Expected RevealAnimation to expose its copy-scale surface')
      }

      return copyScale.style.transform || getComputedStyle(copyScale).transform
    }
    const defaultVisualSurfaces = [
      defaultItem.querySelector<HTMLElement>('[data-reveal-source]'),
      defaultItem.querySelector<HTMLElement>('[data-reveal-overlay-surface]')
    ]

    for (const item of [defaultItem, trueItem, configuredItem, immediateItem]) {
      expect(item).toHaveAttribute('data-popup-surface-item')
      expect(item).toHaveAttribute('data-size', 'xl')
      expect(item).toHaveAttribute('data-content-inset', 'base')
      expect(item).not.toHaveAttribute('data-icon-position')
    }
    expect(defaultItem.querySelectorAll('[data-motion="reveal"]')).toHaveLength(1)
    expect(defaultItem.querySelector('[data-motion="reveal"]')).toHaveAttribute(
      'data-content-mode',
      'flow'
    )
    expect(trueItem.querySelectorAll('[data-motion="reveal"]')).toHaveLength(1)
    expect(configuredItem.querySelectorAll('[data-motion="reveal"]')).toHaveLength(1)
    expect(getCopyScaleTransform(defaultItem)).toContain('scale(1)')
    expect(getCopyScaleTransform(trueItem)).toContain('scale(1)')
    expect(getCopyScaleTransform(configuredItem)).toContain('scale(1.1)')
    for (const visualSurface of defaultVisualSurfaces) {
      expect(visualSurface).toHaveClass('bg-background', 'text-foreground')
    }
    expect(configuredItem.querySelector('[data-motion="reveal"]')).toHaveAttribute(
      'data-content-mode',
      'phrasing'
    )
    expect(immediateItem.querySelector('[data-motion="reveal"]')).toBeNull()
    expect(immediateItem).toHaveClass(
      'bg-accent',
      'text-accent-foreground',
      'data-highlighted:bg-foreground',
      'data-highlighted:text-background'
    )
    expect(immediateItem).not.toHaveClass('bg-background', 'text-foreground')

    fireEvent.focus(input)
    fireEvent.keyDown(input, { key: 'ArrowDown' })
    fireEvent.keyDown(input, { key: 'ArrowDown' })
    fireEvent.keyDown(input, { key: 'ArrowDown' })

    await waitFor(() => {
      expect(configuredItem).toHaveAttribute('data-highlighted')
      expect(configuredItem).toHaveAttribute('data-revealed')
      expect(onRevealChange).toHaveBeenCalledWith(true)
      expect(onRevealStart).toHaveBeenCalledWith(true)
    })

    fireEvent.keyDown(input, { key: 'ArrowDown' })

    expect(immediateItem).toHaveAttribute('data-highlighted')
    expect(immediateItem).toHaveAttribute('data-revealed')
  })

  it('UC-002 / UC-012 / UC-013 / UC-025 / UC-026 / EX-001 / EX-010 - automatically renders flat object text, identity, string conversion, and decorative icons while callbacks remain authoritative', async () => {
    const onItemHighlighted = vi.fn()
    const athletes = [
      { icon: <svg data-testid="yann-object-icon" />, id: 'yann', text: 'Yann' },
      { icon: <svg data-testid="amina-object-icon" />, id: 'amina', text: 'Amina' }
    ]

    render(
      <div>
        <form data-testid="automatic-flat-form">
          <Autocomplete.Root
            inline
            items={athletes}
            name="athlete"
            onItemHighlighted={onItemHighlighted}
            open
            size="md"
          >
            <Autocomplete.Input aria-label="Automatic flat athletes" />
            <Autocomplete.List data-testid="automatic-flat-list" />
          </Autocomplete.Root>
        </form>

        <Autocomplete.Root inline items={athletes} open>
          <Autocomplete.Input aria-label="Callback flat athletes" />
          <Autocomplete.List data-testid="callback-flat-list">
            {(athlete: (typeof athletes)[number]) => (
              <Autocomplete.Item value={athlete}>{`custom ${athlete.text}`}</Autocomplete.Item>
            )}
          </Autocomplete.List>
        </Autocomplete.Root>

        <Autocomplete.Root inline items={athletes} open>
          <Autocomplete.Input aria-label="Node flat athletes" />
          <Autocomplete.List data-testid="node-flat-list">
            <Autocomplete.Item value={athletes[0]}>explicit Yann</Autocomplete.Item>
          </Autocomplete.List>
        </Autocomplete.Root>

        <Autocomplete.Root filter={null} filteredItems={[athletes[1]]} inline items={athletes} open>
          <Autocomplete.Input aria-label="Externally filtered flat athletes" />
          <Autocomplete.List data-testid="external-flat-list" />
        </Autocomplete.Root>
      </div>
    )

    const input = screen.getByRole('combobox', { name: 'Automatic flat athletes' })
    const automaticList = screen.getByTestId('automatic-flat-list')
    const automaticOptions = within(automaticList).getAllByRole('option')

    expect(automaticOptions).toHaveLength(2)
    expect(within(automaticList).getByRole('option', { name: 'Yann' })).toBeVisible()
    expect(within(automaticList).getByRole('option', { name: 'Amina' })).toBeVisible()
    expect(within(screen.getByTestId('callback-flat-list')).getAllByRole('option')).toHaveLength(2)
    expect(
      within(screen.getByTestId('callback-flat-list')).getAllByText('custom Yann')
    ).toHaveLength(2)
    expect(within(screen.getByTestId('callback-flat-list')).queryByText('Yann')).toBeNull()
    expect(within(screen.getByTestId('node-flat-list')).getAllByRole('option')).toHaveLength(1)
    expect(within(screen.getByTestId('node-flat-list')).getAllByText('explicit Yann')).toHaveLength(
      2
    )
    expect(within(screen.getByTestId('external-flat-list')).getAllByRole('option')).toHaveLength(1)
    expect(
      within(screen.getByTestId('external-flat-list')).getByRole('option', { name: 'Amina' })
    ).toBeVisible()
    expect(within(automaticList).getByRole('option', { name: 'Yann' })).not.toHaveAttribute(
      'id',
      'yann'
    )

    const automaticAmina = within(automaticList).getByRole('option', { name: 'Amina' })
    const externalAmina = within(screen.getByTestId('external-flat-list')).getByRole('option', {
      name: 'Amina'
    })

    for (const icon of within(automaticAmina).getAllByTestId('amina-object-icon')) {
      const decorativeIcon = icon.closest('[aria-hidden="true"][inert]')

      expect(decorativeIcon).toHaveClass(
        'pointer-events-none',
        'start-0',
        'w-8',
        '[&_svg]:size-3.5'
      )
      expect(decorativeIcon).not.toHaveAttribute('role')
      expect(decorativeIcon).not.toHaveAttribute('tabindex')
    }
    expect(automaticAmina.querySelector<HTMLElement>('[data-reveal-source]')).toHaveClass(
      'ps-10.5',
      'pe-2.5'
    )

    for (const icon of within(externalAmina).getAllByTestId('amina-object-icon')) {
      const decorativeIcon = icon.closest('[aria-hidden="true"][inert]')

      expect(decorativeIcon).toHaveClass('pointer-events-none', 'start-0', 'w-9', '[&_svg]:size-4')
      expect(decorativeIcon).not.toHaveAttribute('role')
      expect(decorativeIcon).not.toHaveAttribute('tabindex')
    }
    expect(
      Array.from(automaticList.children).some(
        (child) => child.getAttribute('aria-hidden') === 'true' && child.hasAttribute('inert')
      )
    ).toBe(false)

    fireEvent.input(input, {
      inputType: 'insertText',
      target: { value: 'Ami' }
    })

    const amina = within(automaticList).getByRole('option', { name: 'Amina' })

    expect(within(automaticList).queryByRole('option', { name: 'Yann' })).toBeNull()
    fireEvent.focus(input)
    fireEvent.keyDown(input, { key: 'ArrowDown' })

    await waitFor(() => {
      expect(onItemHighlighted).toHaveBeenLastCalledWith(
        athletes[1],
        expect.objectContaining({ reason: 'keyboard' })
      )
    })

    fireEvent.click(amina)

    expect(input).toHaveValue('Amina')
    expect(
      new FormData(screen.getByTestId('automatic-flat-form') as HTMLFormElement).get('athlete')
    ).toBe('Amina')
  })

  it('UC-013 / UC-023 / UC-025 / UC-027 / EX-009 / CR-005 / QA-003 - automatically renders and navigates grouped objects without taking over explicit or unsupported modes', () => {
    const onGroupedItemHighlighted = vi.fn()
    const groups = [
      {
        categoryId: 'strength',
        icon: <svg data-testid="strength-group-icon" />,
        items: [
          {
            exerciseId: 'deadlift',
            icon: <svg data-testid="deadlift-item-icon" />,
            text: 'Deadlift'
          },
          { exerciseId: 'front-squat', icon: <svg />, text: 'Front squat' }
        ],
        text: 'Strength'
      },
      {
        categoryId: 'athletes',
        icon: <svg data-testid="athletes-group-icon" />,
        items: [{ exerciseId: 'amina', icon: <svg />, text: 'Amina' }],
        text: 'Athletes'
      }
    ]

    render(
      <div>
        <Autocomplete.Root
          inline
          items={groups}
          onItemHighlighted={onGroupedItemHighlighted}
          open
          size="md"
        >
          <Autocomplete.Input aria-label="Automatic grouped exercises" />
          <Autocomplete.List data-testid="automatic-grouped-list" />
        </Autocomplete.Root>

        <Autocomplete.Root inline items={groups} open size="md">
          <Autocomplete.Input aria-label="Automatic Collection leaves" />
          <Autocomplete.List data-testid="automatic-collection-list">
            {(group: (typeof groups)[number]) => (
              <Autocomplete.Group items={group.items}>
                <Autocomplete.GroupLabel icon={group.icon}>
                  {`custom ${group.text}`}
                </Autocomplete.GroupLabel>
                <Autocomplete.Collection />
              </Autocomplete.Group>
            )}
          </Autocomplete.List>
        </Autocomplete.Root>

        <Autocomplete.Root inline items={groups} open size="md">
          <Autocomplete.Input aria-label="Callback Collection leaves" />
          <Autocomplete.List data-testid="callback-collection-list">
            {(group: (typeof groups)[number]) => (
              <Autocomplete.Group items={group.items}>
                <Autocomplete.GroupLabel>{group.text}</Autocomplete.GroupLabel>
                <Autocomplete.Collection>
                  {(item: (typeof group.items)[number]) => (
                    <Autocomplete.Item value={item}>{`custom ${item.text}`}</Autocomplete.Item>
                  )}
                </Autocomplete.Collection>
              </Autocomplete.Group>
            )}
          </Autocomplete.List>
        </Autocomplete.Root>

        <Autocomplete.Root grid inline items={groups} open>
          <Autocomplete.Input aria-label="Unsupported automatic grid" />
          <Autocomplete.List data-testid="automatic-grid-list" />
        </Autocomplete.Root>

        <Autocomplete.Root inline items={groups} open virtualized>
          <Autocomplete.Input aria-label="Unsupported automatic virtualization" />
          <Autocomplete.List data-testid="automatic-virtual-list" />
        </Autocomplete.Root>
      </div>
    )

    const automaticList = screen.getByTestId('automatic-grouped-list')
    const strengthGroup = within(automaticList).getByRole('group', { name: 'Strength' })
    const strengthLabel = within(strengthGroup).getByText('Strength')
    const deadlift = within(strengthGroup).getByRole('option', { name: 'Deadlift' })
    const frontSquat = within(strengthGroup).getByRole('option', { name: 'Front squat' })
    const amina = within(automaticList).getByRole('option', { name: 'Amina' })
    const groupedInput = screen.getByRole('combobox', { name: 'Automatic grouped exercises' })
    const groupIcon = within(strengthGroup).getByTestId('strength-group-icon')
    const groupIconSurface = groupIcon.closest('[aria-hidden="true"][inert]')
    const deadliftIconSurfaces = within(deadlift)
      .getAllByTestId('deadlift-item-icon')
      .map((icon) => icon.closest<HTMLElement>('[aria-hidden="true"][inert]'))

    expect(within(automaticList).getAllByRole('group')).toHaveLength(2)
    expect(within(automaticList).getAllByRole('option')).toHaveLength(3)
    expect(
      Array.from(automaticList.children).some(
        (child) => child.getAttribute('aria-hidden') === 'true' && child.hasAttribute('inert')
      )
    ).toBe(false)
    expect(strengthGroup).toHaveAttribute('data-popup-surface-group')
    expect(strengthGroup).toHaveAttribute('aria-labelledby', strengthLabel.id)
    expect(strengthLabel).toHaveAttribute('data-popup-surface-group-label')
    expect(strengthLabel).toHaveAttribute('data-size', 'md')
    expect(strengthLabel).toHaveClass('min-h-8', 'pt-1', 'pb-0')
    expect(strengthLabel.querySelector('[data-motion="reveal"]')).toBeNull()
    expect(deadlift.querySelectorAll('[data-motion="reveal"]')).toHaveLength(1)
    expect(groupIconSurface).toHaveClass(
      'pointer-events-none',
      'inset-y-0',
      'items-center',
      'pt-1',
      'pb-0',
      '[&_svg]:size-3.5'
    )
    expect(strengthLabel).toHaveClass('ps-10.5', 'pe-2.5')
    expect(groupIconSurface).not.toHaveAttribute('role')
    expect(groupIconSurface).not.toHaveAttribute('tabindex')
    expect(deadliftIconSurfaces).toHaveLength(2)
    for (const iconSurface of deadliftIconSurfaces) {
      const visualSurface = iconSurface?.closest<HTMLElement>(
        '[data-reveal-source], [data-reveal-overlay-surface]'
      )

      expect(iconSurface).toHaveClass(
        'absolute',
        'inset-y-0',
        'start-0',
        'w-8',
        'items-center',
        'justify-center'
      )
      expect(visualSurface).toBeInTheDocument()
      expect(visualSurface).toHaveClass('ps-10.5', 'pe-2.5')

      if (visualSurface?.hasAttribute('data-reveal-overlay-surface')) {
        expect(iconSurface?.closest('[data-reveal-copy-scale]')).toBeNull()
      }
    }
    expect(strengthGroup).not.toHaveAttribute('categoryid')
    expect(
      within(screen.getByTestId('automatic-collection-list')).getAllByRole('option')
    ).toHaveLength(3)
    expect(
      within(screen.getByTestId('automatic-collection-list')).getByRole('group', {
        name: 'custom Strength'
      })
    ).toBeInTheDocument()
    expect(
      within(screen.getByTestId('callback-collection-list')).getByRole('option', {
        name: 'custom Deadlift'
      })
    ).toBeInTheDocument()
    expect(
      within(screen.getByTestId('callback-collection-list')).queryByRole('option', {
        name: 'Deadlift'
      })
    ).toBeNull()
    expect(
      within(screen.getByTestId('automatic-grid-list')).queryAllByRole('gridcell')
    ).toHaveLength(0)
    expect(
      within(screen.getByTestId('automatic-virtual-list')).queryAllByRole('option')
    ).toHaveLength(0)

    fireEvent.focus(groupedInput)
    fireEvent.keyDown(groupedInput, { key: 'ArrowDown' })

    expect(deadlift).toHaveAttribute('data-highlighted')
    expect(automaticList.querySelectorAll('[data-highlighted]')).toHaveLength(1)
    expect(groupedInput).toHaveAttribute('aria-activedescendant', deadlift.id)
    expect(onGroupedItemHighlighted).toHaveBeenLastCalledWith(
      groups[0]?.items[0],
      expect.objectContaining({ index: 0, reason: 'keyboard' })
    )

    fireEvent.keyDown(groupedInput, { key: 'ArrowDown' })

    expect(frontSquat).toHaveAttribute('data-highlighted')
    expect(automaticList.querySelectorAll('[data-highlighted]')).toHaveLength(1)
    expect(groupedInput).toHaveAttribute('aria-activedescendant', frontSquat.id)
    expect(onGroupedItemHighlighted).toHaveBeenLastCalledWith(
      groups[0]?.items[1],
      expect.objectContaining({ index: 1, reason: 'keyboard' })
    )

    fireEvent.keyDown(groupedInput, { key: 'ArrowDown' })

    expect(amina).toHaveAttribute('data-highlighted')
    expect(automaticList.querySelectorAll('[data-highlighted]')).toHaveLength(1)
    expect(groupedInput).toHaveAttribute('aria-activedescendant', amina.id)
    expect(onGroupedItemHighlighted).toHaveBeenLastCalledWith(
      groups[1]?.items[0],
      expect.objectContaining({ index: 2, reason: 'keyboard' })
    )

    fireEvent.keyDown(groupedInput, { key: 'Enter' })

    expect(groupedInput).toHaveValue('Amina')

    fireEvent.input(groupedInput, {
      inputType: 'insertText',
      target: { value: 'Front' }
    })

    expect(within(automaticList).getByRole('option', { name: 'Front squat' })).toBeInTheDocument()
    expect(within(automaticList).queryByRole('option', { name: 'Deadlift' })).toBeNull()
    expect(within(automaticList).queryByRole('group', { name: 'Athletes' })).toBeNull()
  })

  it('UC-021 / EX-003 - freezes an empty filtered collection and announcement children until reopening', async () => {
    let resolveClosingAnimation: (() => void) | undefined
    const closingAnimationFinished = new Promise<void>((resolve) => {
      resolveClosingAnimation = resolve
    })

    function ClosingEmptyAutocomplete() {
      const [open, setOpen] = useState(true)
      const [value, setValue] = useState('z')

      return (
        <div>
          <button onClick={() => setOpen(true)} type="button">
            Reopen empty results
          </button>
          <Autocomplete.Root
            items={['Deadlift', 'Front squat', 'Pull-up']}
            modal={false}
            onOpenChange={setOpen}
            onValueChange={setValue}
            open={open}
            value={value}
          >
            <Autocomplete.InputGroup>
              <Autocomplete.AddOn>
                <svg />
              </Autocomplete.AddOn>
              <Autocomplete.Input aria-label="Closing empty exercise" />
            </Autocomplete.InputGroup>
            <Autocomplete.Portal keepMounted>
              <Autocomplete.Positioner>
                <Autocomplete.Popup data-testid="closing-empty-popup">
                  <Autocomplete.Status data-testid="closing-empty-status">
                    {value ? `Query: ${value}` : 'All exercises'}
                  </Autocomplete.Status>
                  <Autocomplete.Empty data-testid="closing-empty-state">
                    No exercise found.
                  </Autocomplete.Empty>
                  <Autocomplete.List>
                    {(exercise: string) => (
                      <Autocomplete.Item key={exercise} value={exercise}>
                        {exercise}
                      </Autocomplete.Item>
                    )}
                  </Autocomplete.List>
                </Autocomplete.Popup>
              </Autocomplete.Positioner>
            </Autocomplete.Portal>
          </Autocomplete.Root>
        </div>
      )
    }

    render(<ClosingEmptyAutocomplete />)

    const input = screen.getByRole('combobox', { name: 'Closing empty exercise' })
    const popup = await screen.findByTestId('closing-empty-popup')

    expect(screen.getByTestId('closing-empty-state')).toHaveTextContent('No exercise found.')
    expect(screen.getByTestId('closing-empty-status')).toHaveTextContent('Query: z')

    Object.defineProperty(popup, 'getAnimations', {
      configurable: true,
      value: vi.fn(() => [{ finished: closingAnimationFinished }])
    })

    fireEvent.input(input, {
      inputType: 'deleteContentBackward',
      target: { value: '' }
    })

    expect(input).toHaveValue('')
    expect(popup).toHaveAttribute('data-closed')
    expect(screen.getByTestId('closing-empty-state')).toHaveTextContent('No exercise found.')
    expect(screen.getByTestId('closing-empty-status')).toHaveTextContent('Query: z')
    expect(screen.queryByRole('option', { name: 'Deadlift' })).not.toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Reopen empty results' }))

    await waitFor(() => {
      expect(popup).toHaveAttribute('data-open')
      expect(screen.getByRole('option', { name: 'Deadlift' })).toBeInTheDocument()
      expect(screen.getByTestId('closing-empty-status')).toHaveTextContent('All exercises')
    })

    resolveClosingAnimation?.()
  })

  it('UC-021 / EX-003 - freezes grouped results through CSS exit and releases them at close completion', async () => {
    let resolveClosingAnimation: (() => void) | undefined
    const closingAnimationFinished = new Promise<void>((resolve) => {
      resolveClosingAnimation = resolve
    })
    const teams = [
      {
        items: [
          { id: 'amina', name: 'Amina' },
          { id: 'maya', name: 'Maya' }
        ],
        value: 'Power'
      }
    ]

    function ClosingGroupedAutocomplete() {
      const [open, setOpen] = useState(true)
      const [phase, setPhase] = useState('opening')
      const [value, setValue] = useState('May')

      return (
        <Autocomplete.Root
          itemToStringValue={(athlete: (typeof teams)[number]['items'][number]) => athlete.name}
          items={teams}
          onOpenChange={setOpen}
          onOpenChangeComplete={(nextOpen) => setPhase(nextOpen ? 'open' : 'closed')}
          onValueChange={setValue}
          open={open}
          value={value}
        >
          <Autocomplete.InputGroup>
            <Autocomplete.AddOn>
              <svg />
            </Autocomplete.AddOn>
            <Autocomplete.Input aria-label="Closing grouped athlete" />
          </Autocomplete.InputGroup>
          <Autocomplete.Portal keepMounted>
            <Autocomplete.Positioner>
              <Autocomplete.Popup data-testid="closing-grouped-popup">
                <Autocomplete.Status data-testid="closing-grouped-status">
                  {value ? `Query: ${value}` : 'All athletes'}
                </Autocomplete.Status>
                <Autocomplete.Empty>No athlete found.</Autocomplete.Empty>
                <Autocomplete.List>
                  {(team: (typeof teams)[number]) => (
                    <Autocomplete.Group key={team.value} items={team.items}>
                      <Autocomplete.GroupLabel>{team.value}</Autocomplete.GroupLabel>
                      <Autocomplete.Collection>
                        {(athlete: (typeof team.items)[number]) => (
                          <Autocomplete.Item key={athlete.id} value={athlete}>
                            {athlete.name}
                          </Autocomplete.Item>
                        )}
                      </Autocomplete.Collection>
                    </Autocomplete.Group>
                  )}
                </Autocomplete.List>
              </Autocomplete.Popup>
            </Autocomplete.Positioner>
          </Autocomplete.Portal>
          <output>phase: {phase}</output>
        </Autocomplete.Root>
      )
    }

    render(<ClosingGroupedAutocomplete />)

    const input = screen.getByRole('combobox', { name: 'Closing grouped athlete' })
    const popup = await screen.findByTestId('closing-grouped-popup')

    await waitFor(() => {
      expect(screen.getByText('phase: open')).toBeInTheDocument()
      expect(screen.getByRole('option', { name: 'Maya' })).toBeInTheDocument()
    })

    expect(screen.queryByRole('option', { name: 'Amina' })).not.toBeInTheDocument()

    Object.defineProperty(popup, 'getAnimations', {
      configurable: true,
      value: vi.fn(() => [{ finished: closingAnimationFinished }])
    })

    fireEvent.input(input, {
      inputType: 'deleteContentBackward',
      target: { value: '' }
    })

    expect(input).toHaveValue('')
    expect(popup).toHaveAttribute('data-closed')
    expect(screen.getByRole('group', { name: 'Power' })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'Maya' })).toBeInTheDocument()
    expect(screen.queryByRole('option', { name: 'Amina' })).not.toBeInTheDocument()
    expect(screen.getByTestId('closing-grouped-status')).toHaveTextContent('Query: May')

    resolveClosingAnimation?.()

    await waitFor(() => {
      expect(screen.getByText('phase: closed')).toBeInTheDocument()
      expect(screen.getAllByText('Amina')).toHaveLength(2)
      expect(screen.getByTestId('closing-grouped-status')).toHaveTextContent('All athletes')
    })
  })

  it('UC-021 / UC-026 / EX-003 - freezes automatic object text, icons, and identity through the final-character CSS exit', async () => {
    let resolveClosingAnimation: (() => void) | undefined
    const closingAnimationFinished = new Promise<void>((resolve) => {
      resolveClosingAnimation = resolve
    })
    const exercises = [
      { icon: <svg data-testid="closing-deadlift-icon" />, text: 'Deadlift' },
      { icon: <svg data-testid="closing-front-squat-icon" />, text: 'Front squat' }
    ] satisfies AutocompleteItemOption[]

    function ClosingAutomaticAutocomplete() {
      const [open, setOpen] = useState(true)
      const [phase, setPhase] = useState('opening')
      const [value, setValue] = useState('Front')

      return (
        <Autocomplete.Root
          items={exercises}
          onOpenChange={setOpen}
          onOpenChangeComplete={(nextOpen) => setPhase(nextOpen ? 'open' : 'closed')}
          onValueChange={setValue}
          open={open}
          value={value}
        >
          <Autocomplete.Input aria-label="Closing automatic exercise" />
          <Autocomplete.Portal keepMounted>
            <Autocomplete.Positioner>
              <Autocomplete.Popup data-testid="closing-automatic-popup">
                <Autocomplete.List />
              </Autocomplete.Popup>
            </Autocomplete.Positioner>
          </Autocomplete.Portal>
          <output>automatic phase: {phase}</output>
        </Autocomplete.Root>
      )
    }

    render(<ClosingAutomaticAutocomplete />)

    const input = screen.getByRole('combobox', { name: 'Closing automatic exercise' })
    const popup = await screen.findByTestId('closing-automatic-popup')

    await waitFor(() => {
      expect(screen.getByText('automatic phase: open')).toBeInTheDocument()
      expect(screen.getByRole('option', { name: 'Front squat' })).toBeInTheDocument()
    })

    expect(screen.queryByRole('option', { name: 'Deadlift' })).toBeNull()

    Object.defineProperty(popup, 'getAnimations', {
      configurable: true,
      value: vi.fn(() => [{ finished: closingAnimationFinished }])
    })

    fireEvent.input(input, {
      inputType: 'deleteContentBackward',
      target: { value: '' }
    })

    expect(input).toHaveValue('')
    expect(popup).toHaveAttribute('data-closed')
    expect(screen.getByRole('option', { name: 'Front squat' })).toBeInTheDocument()
    expect(screen.queryByRole('option', { name: 'Deadlift' })).toBeNull()
    expect(screen.getAllByTestId('closing-front-squat-icon')).toHaveLength(2)
    expect(screen.queryByTestId('closing-deadlift-icon')).toBeNull()

    resolveClosingAnimation?.()

    await waitFor(() => {
      expect(screen.getByText('automatic phase: closed')).toBeInTheDocument()
      expect(screen.getByRole('option', { hidden: true, name: 'Deadlift' })).toBeInTheDocument()
      expect(screen.getByRole('option', { hidden: true, name: 'Front squat' })).toBeInTheDocument()
    })
  })

  it('UC-002 / UC-010 / UC-012 / UC-013 / UC-028 / EX-005 - supports external async filtering, public filter helpers, and mounted live regions', () => {
    function AsyncAutocomplete() {
      const [value, setValue] = useState('')
      const [results, setResults] = useState<string[]>([])
      const { contains } = Autocomplete.useFilter({ locale: 'en' })

      return (
        <Autocomplete.Root
          filter={null}
          inline
          items={results}
          onValueChange={(nextValue: string) => {
            setValue(nextValue)
            setResults(
              ['Deadlift', 'Front squat', 'Pull-up', 'Push press'].filter((item) =>
                contains(item, nextValue)
              )
            )
          }}
          open
          value={value}
        >
          <Autocomplete.Input aria-label="Async exercise search" />
          <Autocomplete.Status data-testid="async-status">
            {`${results.length} results`}
          </Autocomplete.Status>
          <Autocomplete.Empty data-testid="async-empty">No exercise found.</Autocomplete.Empty>
          <Autocomplete.List>
            {(exercise: string) => (
              <Autocomplete.Item key={exercise} value={exercise}>
                {exercise}
              </Autocomplete.Item>
            )}
          </Autocomplete.List>
        </Autocomplete.Root>
      )
    }

    render(<AsyncAutocomplete />)

    const status = screen.getByTestId('async-status')
    const empty = screen.getByTestId('async-empty')

    expect(status).toHaveAttribute('role', 'status')
    expect(status).toHaveAttribute('aria-live', 'polite')
    expect(status).toHaveClass('font-sans', 'text-md', 'tracking-wide', 'text-muted-foreground')
    expect(status).toHaveTextContent('0 results')
    expect(empty).toHaveAttribute('role', 'status')
    expect(empty).toHaveAttribute('aria-live', 'polite')
    expect(empty).toHaveClass('font-sans', 'text-md', 'tracking-wide', 'text-muted-foreground')
    expect(empty).toHaveTextContent('No exercise found.')

    fireEvent.input(screen.getByRole('combobox', { name: 'Async exercise search' }), {
      inputType: 'insertText',
      target: { value: 'press' }
    })

    expect(status).toHaveTextContent('1 results')
    expect(empty).toBeInTheDocument()
    expect(empty).not.toHaveTextContent('No exercise found.')
    expect(empty).not.toHaveAttribute('hidden')
    expect(empty).not.toHaveAttribute('aria-hidden')
    expect(screen.getByRole('option', { name: 'Push press' })).toBeInTheDocument()
  })

  it('UC-012 / EX-006 - preserves list, both, inline, and none completion modes', () => {
    const modes = ['list', 'both', 'inline', 'none'] as const

    render(
      <div>
        {modes.map((mode) => (
          <Autocomplete.Root
            inline
            items={['feature', 'fix', 'mobile']}
            key={mode}
            mode={mode}
            open
          >
            <Autocomplete.Input aria-label={`${mode} tag completion`} />
            <Autocomplete.List>
              {(tag: string) => (
                <Autocomplete.Item key={tag} value={tag}>
                  {tag}
                </Autocomplete.Item>
              )}
            </Autocomplete.List>
          </Autocomplete.Root>
        ))}
      </div>
    )

    for (const mode of modes) {
      expect(screen.getByRole('combobox', { name: `${mode} tag completion` })).toHaveAttribute(
        'aria-autocomplete',
        mode
      )
    }

    fireEvent.change(screen.getByRole('combobox', { name: 'list tag completion' }), {
      target: { value: 'fix' }
    })

    expect(screen.getByRole('combobox', { name: 'list tag completion' })).toHaveValue('fix')
  })

  it('UC-013 / UC-018 - exposes filtered items and virtualized indexes through the public Base UI contracts', () => {
    function FilteredItemsProbe() {
      const filteredItems = Autocomplete.useFilteredItems()

      return <output>{filteredItems.join(',')}</output>
    }

    render(
      <Autocomplete.Root
        defaultValue="front"
        inline
        items={['Deadlift', 'Front squat', 'Pull-up']}
        open
        virtualized
      >
        <Autocomplete.Input aria-label="Virtualized exercise search" />
        <Autocomplete.List>
          <Autocomplete.Item index={0} value="Front squat">
            Front squat
          </Autocomplete.Item>
        </Autocomplete.List>
        <FilteredItemsProbe />
      </Autocomplete.Root>
    )

    expect(screen.getByText('Front squat', { selector: 'output' })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'Front squat' })).toBeInTheDocument()
  })

  it('UC-001 / UC-005 / UC-013 / UC-014 / EX-007 - supports trigger-only grid anatomy with Input inside Popup', async () => {
    const emojiRows = [
      ['😀', '🙂', '🏋️'],
      ['🚴', '🏃', '🧘']
    ]

    render(
      <Autocomplete.Root grid items={emojiRows} open>
        <Autocomplete.Trigger aria-label="Choose emoji" data-testid="emoji-trigger">
          😀
        </Autocomplete.Trigger>
        <Autocomplete.Portal>
          <Autocomplete.Positioner align="end">
            <Autocomplete.Popup aria-label="Emoji picker">
              <Autocomplete.Input aria-label="Search emojis" />
              <Autocomplete.List>
                {(row: string[]) => (
                  <Autocomplete.Row key={row.join('-')}>
                    {row.map((emoji) => (
                      <Autocomplete.Item key={emoji} value={emoji}>
                        {emoji}
                      </Autocomplete.Item>
                    ))}
                  </Autocomplete.Row>
                )}
              </Autocomplete.List>
            </Autocomplete.Popup>
          </Autocomplete.Positioner>
        </Autocomplete.Portal>
      </Autocomplete.Root>
    )

    const trigger = screen.getByTestId('emoji-trigger')

    expect(trigger).toHaveAttribute('role', 'combobox')
    expect(trigger).toHaveAttribute('aria-expanded', 'true')
    expect(trigger).toHaveAccessibleName('Choose emoji')
    expect(await screen.findByRole('combobox', { name: 'Search emojis' })).toBeInTheDocument()

    const grid = screen.getByRole('grid')

    expect(within(grid).getAllByRole('row')).toHaveLength(2)
    expect(within(grid).getAllByRole('gridcell')).toHaveLength(6)
  })

  it('UC-001 / UC-005 / UC-011 / UC-014 / UC-019 / EX-008 - composes an inline command palette without adding an Autocomplete Backdrop', async () => {
    const commands = [
      { items: ['Open workouts', 'Open athletes'], value: 'Navigation' },
      { items: ['Create workout', 'Invite athlete'], value: 'Actions' }
    ]

    render(
      <Dialog.Root>
        <Dialog.Trigger>Open command palette</Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Backdrop data-testid="dialog-backdrop" />
          <Dialog.Viewport>
            <Dialog.Popup aria-label="Command palette">
              <Autocomplete.Root inline items={commands} open>
                <Autocomplete.Input aria-label="Search commands" />
                <Autocomplete.Empty>No command found.</Autocomplete.Empty>
                <Autocomplete.List>
                  {(group: (typeof commands)[number]) => (
                    <Autocomplete.Group key={group.value} items={group.items}>
                      <Autocomplete.GroupLabel>{group.value}</Autocomplete.GroupLabel>
                      <Autocomplete.Collection>
                        {(command: string) => (
                          <Autocomplete.Item key={command} value={command}>
                            {command}
                          </Autocomplete.Item>
                        )}
                      </Autocomplete.Collection>
                    </Autocomplete.Group>
                  )}
                </Autocomplete.List>
              </Autocomplete.Root>
            </Dialog.Popup>
          </Dialog.Viewport>
        </Dialog.Portal>
      </Dialog.Root>
    )

    fireEvent.click(screen.getByRole('button', { name: 'Open command palette' }))

    const dialog = await screen.findByRole('dialog', { name: 'Command palette' })

    expect(within(dialog).getByRole('combobox', { name: 'Search commands' })).toBeInTheDocument()
    expect(within(dialog).getByRole('option', { name: 'Open workouts' })).toBeInTheDocument()
    expect(screen.getByTestId('dialog-backdrop')).toBeInTheDocument()
  })

  it('UC-018 / UC-019 - preserves native props, state callbacks, refs, Backdrop lifecycle, and direct leaves', async () => {
    const backdropRef = createRef<HTMLDivElement>()
    const inputGroupRef = createRef<HTMLDivElement>()
    const onBackdropMouseEnter = vi.fn()

    function LifecycleProbe({ children }: { children?: ReactNode }) {
      const [open, setOpen] = useState(true)

      return (
        <Autocomplete.Root items={['Maya']} onOpenChange={setOpen} open={open}>
          <Autocomplete.InputGroup
            className={(state: BaseUiAutocomplete.InputGroup.State) =>
              state.open ? 'group-open' : 'group-closed'
            }
            data-consumer="group"
            ref={inputGroupRef}
          >
            <Autocomplete.AddOn>
              <svg />
            </Autocomplete.AddOn>
            <Autocomplete.Input aria-label="Lifecycle athlete" />
            <Autocomplete.Trigger aria-label="Toggle lifecycle" data-testid="lifecycle-trigger">
              toggle
            </Autocomplete.Trigger>
          </Autocomplete.InputGroup>
          <Autocomplete.Portal keepMounted>
            <Autocomplete.Backdrop
              className={(state: BaseUiAutocomplete.Backdrop.State) =>
                state.open ? 'backdrop-open' : 'backdrop-closed'
              }
              data-consumer="backdrop"
              onMouseEnter={onBackdropMouseEnter}
              ref={backdropRef}
            >
              {children}
            </Autocomplete.Backdrop>
            <Autocomplete.Positioner>
              <Autocomplete.Popup>
                <Autocomplete.Arrow data-testid="autocomplete-arrow" />
                <Autocomplete.List>
                  <Autocomplete.Item value="Maya">Maya</Autocomplete.Item>
                  <Autocomplete.Separator data-testid="autocomplete-separator" />
                </Autocomplete.List>
                <Autocomplete.Value>{(value: string) => `value:${value}`}</Autocomplete.Value>
              </Autocomplete.Popup>
            </Autocomplete.Positioner>
          </Autocomplete.Portal>
        </Autocomplete.Root>
      )
    }

    render(<LifecycleProbe>consumer backdrop</LifecycleProbe>)

    const backdrop = screen.getByText('consumer backdrop')
    const lifecycleTrigger = screen.getByTestId('lifecycle-trigger')
    const inputGroup = lifecycleTrigger.parentElement

    expect(backdropRef.current).toBe(backdrop)
    expect(inputGroupRef.current).toBe(inputGroup)
    expect(backdrop).toHaveClass('backdrop-open')
    expect(backdrop).toHaveAttribute('data-open')
    expect(backdrop).toHaveAttribute('data-consumer', 'backdrop')
    expect(backdrop.className).not.toMatch(/bg-|opacity-|shadow-|transition-/)
    expect(lifecycleTrigger).toHaveAttribute('aria-hidden', 'true')
    expect(lifecycleTrigger).toHaveAttribute('tabindex', '-1')
    expect(screen.getByTestId('autocomplete-arrow')).toHaveAttribute('data-open')
    expect(screen.getByTestId('autocomplete-separator')).toHaveAttribute(
      'data-orientation',
      'horizontal'
    )

    fireEvent.mouseEnter(backdrop)

    expect(onBackdropMouseEnter).toHaveBeenCalledOnce()

    fireEvent.keyDown(screen.getByRole('combobox', { name: 'Lifecycle athlete' }), {
      key: 'Escape'
    })

    await waitFor(() => {
      expect(backdrop).toHaveClass('backdrop-closed')
      expect(backdrop).toHaveAttribute('data-closed')
    })

    expect(screen.getByRole('button', { name: 'Toggle lifecycle' })).toBe(lifecycleTrigger)
  })
})
