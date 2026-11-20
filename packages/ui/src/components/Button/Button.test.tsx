import { act, fireEvent, render, screen, within } from '@testing-library/react'
import {
  ArrowLeft,
  ArrowRight,
  RotateCcw,
  Save,
  SkipForward,
  SlidersHorizontal,
  UserRound
} from 'lucide-react'
import { type ComponentProps, type ReactElement } from 'react'
import { expectTypeOf } from 'vitest'

import {
  type ButtonChromeOptions,
  type ButtonSize,
  type ButtonVariant,
  type HeadingSize,
  type RevealAnimationProps
} from '../..'
import * as PackageExports from '../..'
import { Heading } from '../Heading'
import * as ButtonFamily from './Button'

vi.mock('../Heading', async (importActual) => {
  const actual = await importActual<typeof import('../Heading')>()
  const ActualHeading = actual.Heading
  const CompatibleActualHeading = ActualHeading as (
    props: Omit<ComponentProps<typeof ActualHeading>, 'variant'> & { variant?: 'text' }
  ) => ReactElement
  const HeadingMock = vi.fn(
    ({
      size,
      variant: legacyVariant,
      ...props
    }: ComponentProps<typeof ActualHeading> & { variant?: 'text' }) => (
      <CompatibleActualHeading
        {...props}
        data-heading=""
        data-heading-legacy-variant={legacyVariant}
        data-heading-size={size ?? 'md'}
        size={size}
      />
    )
  )

  return {
    ...actual,
    Heading: HeadingMock
  }
})

interface ButtonPackageContract {
  Button: typeof ButtonFamily.Button
  buttonChromeHeadingSize: ButtonChromeHelpersContract['buttonChromeHeadingSize']
  buttonChromeVariants: ButtonChromeHelpersContract['buttonChromeVariants']
  Components: typeof PackageExports.Components & {
    Button: typeof ButtonFamily.Button
  }
  Ui: typeof PackageExports.Ui & {
    Components: typeof PackageExports.Components & {
      Button: typeof ButtonFamily.Button
    }
  }
}

interface ButtonChromeHelpersContract {
  buttonChromeHeadingSize: (size?: ButtonSize) => HeadingSize
  buttonChromeVariants: (options?: ButtonChromeOptions) => string
}

type ExpectedButtonSize =
  | 'xs'
  | 'sm'
  | 'md'
  | 'lg'
  | 'xl'
  | '2xl'
  | '3xl'
  | 'icon-xs'
  | 'icon-sm'
  | 'icon-md'
  | 'icon-lg'
  | 'icon-xl'
  | 'icon-2xl'
  | 'icon-3xl'

type ExpectedButtonVariant = 'default' | 'ghost' | 'link'

type ButtonRevealAnimationProps = Exclude<
  ComponentProps<typeof ButtonFamily.Button>['revealAnimation'],
  boolean | undefined
>

type ButtonRevealAnimationOwnsRenderAndChildren =
  Extract<'children' | 'render', keyof ButtonRevealAnimationProps> extends never ? true : false

type ButtonWithRevealAnimation = (
  props: Omit<ComponentProps<typeof ButtonFamily.Button>, 'revealAnimation'> & {
    revealAnimation?: boolean | ButtonRevealAnimationProps
  }
) => ReactElement | null

const BUTTON_FAMILY = ButtonFamily as typeof ButtonFamily & ButtonChromeHelpersContract
const PACKAGE_EXPORTS = PackageExports as typeof PackageExports & ButtonPackageContract
const Button = ButtonFamily.Button
const HeadingWithoutVariant = Heading as unknown as (
  props: Omit<ComponentProps<typeof Heading>, 'variant'>
) => ReactElement
const RevealedButton = ButtonFamily.Button as ButtonWithRevealAnimation
const BUTTON_REVEAL_ANIMATION_OMITS_RENDER_AND_CHILDREN =
  true satisfies ButtonRevealAnimationOwnsRenderAndChildren

const BUTTON_SIZE_CASES = [
  {
    boxClassNames: ['h-7', 'px-2', 'py-1'],
    gapClassName: 'gap-1',
    headingSize: 'xs',
    iconClassName: 'size-3.5',
    size: 'xs'
  },
  {
    boxClassNames: ['h-8', 'px-3', 'py-1'],
    gapClassName: 'gap-1.5',
    headingSize: 'xs',
    iconClassName: 'size-4',
    size: 'sm'
  },
  {
    boxClassNames: ['h-9', 'px-4', 'py-1'],
    gapClassName: 'gap-2',
    headingSize: 'xs',
    iconClassName: 'size-4',
    size: 'md'
  },
  {
    boxClassNames: ['h-10', 'px-6', 'py-1'],
    gapClassName: 'gap-2',
    headingSize: 'sm',
    iconClassName: 'size-4.5',
    size: 'lg'
  },
  {
    boxClassNames: ['h-12', 'px-8', 'py-1.5'],
    gapClassName: 'gap-2.5',
    headingSize: 'md',
    iconClassName: 'size-5',
    size: 'xl'
  },
  {
    boxClassNames: ['h-14', 'px-10', 'py-2'],
    gapClassName: 'gap-3',
    headingSize: 'lg',
    iconClassName: 'size-6',
    size: '2xl'
  },
  {
    boxClassNames: ['h-20', 'px-12', 'py-3'],
    gapClassName: 'gap-4',
    headingSize: 'xl',
    iconClassName: 'size-8',
    size: '3xl'
  }
] as const

const ICON_BUTTON_SIZE_CASES = [
  {
    headingSize: 'xs',
    iconClassName: 'size-3.5',
    sideClassName: 'size-7',
    size: 'icon-xs'
  },
  {
    headingSize: 'xs',
    iconClassName: 'size-4',
    sideClassName: 'size-8',
    size: 'icon-sm'
  },
  {
    headingSize: 'xs',
    iconClassName: 'size-4',
    sideClassName: 'size-9',
    size: 'icon-md'
  },
  {
    headingSize: 'sm',
    iconClassName: 'size-4.5',
    sideClassName: 'size-10',
    size: 'icon-lg'
  },
  {
    headingSize: 'md',
    iconClassName: 'size-5',
    sideClassName: 'size-12',
    size: 'icon-xl'
  },
  {
    headingSize: 'lg',
    iconClassName: 'size-6',
    sideClassName: 'size-14',
    size: 'icon-2xl'
  },
  {
    headingSize: 'xl',
    iconClassName: 'size-8',
    sideClassName: 'size-20',
    size: 'icon-3xl'
  }
] as const satisfies readonly {
  headingSize: HeadingSize
  iconClassName: string
  sideClassName: string
  size: Extract<ButtonSize, `icon-${string}`>
}[]

const BUTTON_VARIANTS = ['default', 'ghost', 'link'] as const satisfies readonly ButtonVariant[]

const BUTTON_REVEAL_PROPS_OBJECT = {
  alignX: 'center',
  alignY: 'center',
  contentMode: 'phrasing',
  direction: 'top-to-bottom',
  offsetX: 12,
  offsetY: -4,
  reveal: true,
  scale: 1,
  unrevealBehavior: 'continue'
} as const satisfies ButtonRevealAnimationProps

const ICON_REVEAL_PROPS_OBJECT = {
  alignX: 'center',
  alignY: 'center',
  offsetX: 8,
  offsetY: -2,
  reveal: true,
  scale: 1.2
} as const satisfies ButtonRevealAnimationProps

function getRevealRoot(container: HTMLElement): HTMLElement {
  const root = container.querySelector<HTMLElement>('[data-reveal-root]')

  expect(root).toBeInTheDocument()

  return root as HTMLElement
}

function getRevealOverlay(container: HTMLElement): HTMLElement {
  const overlay = container.querySelector<HTMLElement>('[data-reveal-overlay]')

  expect(overlay).toBeInTheDocument()

  return overlay as HTMLElement
}

function getRevealOverlaySurface(container: HTMLElement): HTMLElement {
  const overlaySurface = container.querySelector<HTMLElement>('[data-reveal-overlay-surface]')

  expect(overlaySurface).toBeInTheDocument()

  return overlaySurface as HTMLElement
}

function getRevealCopy(container: HTMLElement): HTMLElement {
  const copy = container.querySelector<HTMLElement>('[data-reveal-copy]')

  expect(copy).toBeInTheDocument()

  return copy as HTMLElement
}

function getRevealCopyScale(container: HTMLElement): HTMLElement {
  const copyScale = container.querySelector<HTMLElement>('[data-reveal-copy-scale]')

  expect(copyScale).toBeInTheDocument()

  return copyScale as HTMLElement
}

function getCssTransform(element: HTMLElement): string {
  return element.style.transform || getComputedStyle(element).transform
}

describe('Button', () => {
  beforeEach(() => {
    vi.mocked(Heading).mockClear()
  })

  it('UC-001 / UC-002 / UC-003 / EX-001 / SQ-001 - renders the default action button contract', () => {
    const onClick = vi.fn()

    render(
      <Button className="consumer-class" data-source="workout-save" onClick={onClick} type="button">
        save workout
      </Button>
    )

    const button = screen.getByRole('button', { name: 'save workout' })
    const className = button.getAttribute('class') ?? ''
    const label = within(button).getByText('save workout')

    fireEvent.click(button)

    expect(button.tagName).toBe('BUTTON')
    expect(button).toHaveAttribute('type', 'button')
    expect(button).toHaveAttribute('data-source', 'workout-save')
    expect(button).toHaveClass(
      'consumer-class',
      'bg-background',
      'border',
      'border-foreground',
      'h-10',
      'px-6',
      'py-1',
      'text-foreground',
      'transition-colors'
    )
    expect(label).toHaveAttribute('data-heading')
    expect(label).toHaveAttribute('data-heading-size', 'sm')
    expect(label).not.toHaveAttribute('data-heading-legacy-variant')
    expect(className).not.toContain('rounded')
    expect(onClick).toHaveBeenCalledOnce()
  })

  it('UC-001 - forwards Base UI render composition, native props, and state className', () => {
    const onClick = vi.fn()
    const stateClassName = vi.fn((state: { disabled: boolean }) =>
      state.disabled ? 'consumer-disabled' : 'consumer-enabled'
    )

    render(
      <Button
        className={stateClassName}
        data-mode="composed"
        nativeButton={false}
        onClick={onClick}
        render={<div data-testid="composed-action" />}
      >
        composed action
      </Button>
    )

    const button = screen.getByRole('button', { name: 'composed action' })
    const label = within(button).getByText('composed action')

    fireEvent.click(button)

    expect(button).toBe(screen.getByTestId('composed-action'))
    expect(button.tagName).toBe('DIV')
    expect(button).toHaveAttribute('data-mode', 'composed')
    expect(button).toHaveClass('consumer-enabled')
    expect(label).toHaveAttribute('data-heading')
    expect(label).toHaveAttribute('data-heading-size', 'sm')
    expect(label).not.toHaveAttribute('data-heading-legacy-variant')
    expect(stateClassName).toHaveBeenCalledWith(expect.objectContaining({ disabled: false }))
    expect(onClick).toHaveBeenCalledOnce()
  })

  it('UC-002 / UC-004 / EX-002 / CR-010 - maps documented sizes through Heading and icon treatments', () => {
    for (const testCase of BUTTON_SIZE_CASES) {
      const { unmount } = render(
        <Button
          append={<ArrowRight aria-hidden="true" data-testid={`append-${testCase.size}`} />}
          prepend={<ArrowLeft aria-hidden="true" data-testid={`prepend-${testCase.size}`} />}
          size={testCase.size}
          type="button"
        >
          continue plan
        </Button>
      )

      const button = screen.getByRole('button', { name: 'continue plan' })
      const prependIcon = screen.getByTestId(`prepend-${testCase.size}`)
      const appendIcon = screen.getByTestId(`append-${testCase.size}`)
      const label = within(button).getByText('continue plan')

      expect(button).toHaveClass(testCase.gapClassName, ...testCase.boxClassNames)
      expect(label).toHaveAttribute('data-heading')
      expect(label).toHaveAttribute('data-heading-size', testCase.headingSize)
      expect(label).not.toHaveAttribute('data-heading-legacy-variant')
      expect(prependIcon).toHaveClass(testCase.iconClassName)
      expect(appendIcon).toHaveClass(testCase.iconClassName)

      unmount()
    }
  })

  it('UC-004 - preserves non-SVG prepend and append content', () => {
    render(
      <Button append="end" prepend="start" type="button">
        save workout
      </Button>
    )

    expect(screen.getByRole('button', { name: /start.*save workout.*end/ })).toBeInTheDocument()
    expect(screen.getByText('start')).toBeInTheDocument()
    expect(screen.getByText('end')).toBeInTheDocument()
  })

  it('UC-002 / UC-003 / UC-004 - composes every remaining variant with every icon-prefixed size and omits text-button slots', () => {
    for (const testCase of ICON_BUTTON_SIZE_CASES) {
      for (const variant of BUTTON_VARIANTS) {
        const { unmount } = render(
          <Button
            aria-label={`${variant} ${testCase.size}`}
            append={<ArrowRight data-testid={`append-${variant}-${testCase.size}`} />}
            prepend={<ArrowLeft data-testid={`prepend-${variant}-${testCase.size}`} />}
            size={testCase.size}
            type="button"
            variant={variant}
          >
            <SlidersHorizontal data-testid={`content-${variant}-${testCase.size}`} />
          </Button>
        )

        const button = screen.getByRole('button', {
          name: `${variant} ${testCase.size}`
        })
        const content = within(button).getByTestId(`content-${variant}-${testCase.size}`)

        expect(button).toHaveClass(testCase.sideClassName)
        expect(content).toHaveClass(testCase.iconClassName)
        expect(button.querySelector('[data-heading]')).toBeNull()
        expect(screen.queryByTestId(`prepend-${variant}-${testCase.size}`)).toBeNull()
        expect(screen.queryByTestId(`append-${variant}-${testCase.size}`)).toBeNull()

        if (variant === 'default') {
          expect(button).toHaveClass('bg-background', 'border', 'border-foreground')
        } else if (variant === 'ghost') {
          expect(button).toHaveClass(
            'bg-transparent',
            'border',
            'border-transparent',
            'hover:not-data-disabled:bg-muted'
          )
        } else {
          expect(button).toHaveClass(
            'bg-transparent',
            'border-0',
            'cursor-pointer',
            'text-inherit',
            'underline'
          )
        }

        unmount()
      }
    }
  })

  it('UC-003 / UC-006 / EX-003 / SQ-003 / CR-013 - renders ghost and link variants with their public treatments', () => {
    render(
      <p>
        <Button type="button" variant="ghost">
          skip
        </Button>{' '}
        <Button disabled focusableWhenDisabled type="button" variant="ghost">
          locked skip
        </Button>{' '}
        or{' '}
        <Button type="button" variant="link">
          reset filters
        </Button>{' '}
        <Button disabled focusableWhenDisabled type="button" variant="link">
          locked reset
        </Button>
      </p>
    )

    const ghostButton = screen.getByRole('button', { name: 'skip' })
    const disabledGhostButton = screen.getByRole('button', { name: 'locked skip' })
    const linkButton = screen.getByRole('button', { name: 'reset filters' })
    const disabledLinkButton = screen.getByRole('button', { name: 'locked reset' })
    const ghostLabel = within(ghostButton).getByText('skip')
    const disabledGhostClassName = disabledGhostButton.getAttribute('class') ?? ''
    const linkLabel = within(linkButton).getByText('reset filters')
    const linkClassName = linkButton.getAttribute('class') ?? ''

    expect(ghostButton).toHaveClass(
      'bg-transparent',
      'border',
      'border-transparent',
      'h-10',
      'hover:not-data-disabled:bg-muted',
      'px-6',
      'py-1'
    )
    expect(disabledGhostButton).toHaveAttribute('data-disabled')
    expect(disabledGhostButton).toHaveClass(
      'bg-transparent',
      'border-transparent',
      'hover:not-data-disabled:bg-muted'
    )
    expect(disabledGhostButton).not.toHaveClass('bg-muted')
    expect(disabledGhostClassName).not.toContain('hover:bg-muted')
    expect(linkButton).toHaveClass(
      'bg-transparent',
      'border-0',
      'cursor-pointer',
      'inline',
      'p-0',
      'text-inherit',
      'underline'
    )
    expect(disabledLinkButton).toHaveAttribute('data-disabled')
    expect(disabledLinkButton).toHaveClass(
      'cursor-pointer',
      'data-disabled:cursor-default',
      'text-muted-foreground'
    )
    expect(ghostLabel).toHaveAttribute('data-heading')
    expect(ghostLabel).toHaveAttribute('data-heading-size', 'sm')
    expect(ghostLabel).not.toHaveAttribute('data-heading-legacy-variant')
    expect(linkLabel).not.toHaveAttribute('data-heading')
    expect(linkClassName).not.toContain('font-heading')
    expect(linkClassName).not.toContain('h-10')
    expect(linkClassName).not.toContain('px-6')
  })

  it('UC-002 / UC-003 / UC-004 / EX-004 - renders the paired icon-lg size as a square accessible default action', () => {
    render(
      <Button aria-label="Open filters" size="icon-lg" type="button">
        <SlidersHorizontal data-testid="filters-icon" />
      </Button>
    )

    const button = screen.getByRole('button', { name: 'Open filters' })
    const icon = within(button).getByTestId('filters-icon')
    const className = button.getAttribute('class') ?? ''

    expect(button).toHaveClass('bg-background', 'border', 'border-foreground', 'size-10')
    expect(className).not.toContain('px-6')
    expect(icon).toHaveClass('size-4.5')
  })

  it('UC-005 - keeps every icon-prefixed loading presentation stable at its paired size', () => {
    for (const testCase of ICON_BUTTON_SIZE_CASES) {
      const { unmount } = render(
        <Button aria-label={`Loading ${testCase.size}`} loading size={testCase.size} type="button">
          <SlidersHorizontal data-testid={`loading-content-${testCase.size}`} />
        </Button>
      )

      const button = screen.getByRole('button', { name: `Loading ${testCase.size}` })
      const icon = within(button).getByTestId(`loading-content-${testCase.size}`)
      const spinner = button.querySelector('svg.animate-spin')

      if (spinner === null) {
        throw new Error(`Expected ${testCase.size} Button loading spinner`)
      }

      expect(button).toHaveAttribute('aria-busy', 'true')
      expect(button).toHaveAttribute('data-loading')
      expect(button).toHaveAttribute('data-disabled')
      expect(button).toHaveClass(testCase.sideClassName)
      expect(icon.parentElement).toHaveAttribute('data-loading', 'true')
      expect(icon.parentElement).toHaveClass('data-[loading=true]:opacity-0')
      expect(spinner).toHaveClass(testCase.iconClassName)

      unmount()
    }
  })

  it('UC-005 / EX-005 / SQ-002 / CR-011 / QA-001 - exposes loading as a stable focusable disabled state', () => {
    const onClick = vi.fn()

    render(
      <Button
        loading
        onClick={onClick}
        prepend={<Save aria-hidden="true" data-testid="save-icon" />}
        type="button"
      >
        save workout
      </Button>
    )

    const button = screen.getByRole('button', { name: 'save workout' })
    const label = within(button).getByText('save workout')
    const spinner = button.querySelector('svg.animate-spin')

    fireEvent.click(button)
    button.focus()

    expect(button).toHaveAttribute('data-loading')
    expect(button).toHaveAttribute('data-disabled')
    expect(button).toHaveAttribute('aria-busy', 'true')
    expect(button).toHaveFocus()
    expect(button).toHaveClass('h-10', 'px-6', 'py-1')
    expect(label).toHaveAttribute('data-heading')
    expect(label).toHaveClass('text-muted-foreground')
    expect(label).toHaveClass('transition-colors')
    expect(label).not.toHaveClass('text-foreground')
    expect(screen.getByTestId('save-icon')).toHaveClass('size-4.5')

    if (spinner === null) {
      throw new Error('Expected Button loading spinner')
    }

    expect(spinner).toHaveAttribute('aria-hidden', 'true')
    expect(spinner).toHaveClass('size-4.5')
    expect(onClick).not.toHaveBeenCalled()
  })

  it('UC-006 / UC-007 / EX-003 / CR-013 - keeps disabled link buttons inline with muted text and cursor default', () => {
    render(
      <Button disabled focusableWhenDisabled type="button" variant="link">
        reset filters
      </Button>
    )

    const button = screen.getByRole('button', { name: 'reset filters' })

    expect(button).toHaveAttribute('data-disabled')
    expect(button).toHaveClass('data-disabled:cursor-default', 'inline', 'text-muted-foreground')
    expect(button).not.toHaveClass('border-muted-foreground')
  })

  it('UC-006 / UC-007 / EX-003 / EX-006 / SQ-003 / QA-002 - keeps ghost reserved borders transparent while disabled', () => {
    render(
      <>
        <Button disabled type="button" variant="ghost">
          disabled ghost
        </Button>
        <Button disabled focusableWhenDisabled type="button" variant="ghost">
          focusable ghost
        </Button>
      </>
    )

    const disabledGhost = screen.getByRole('button', { name: 'disabled ghost' })
    const focusableGhost = screen.getByRole('button', { name: 'focusable ghost' })

    expect(disabledGhost).toHaveAttribute('data-disabled')
    expect(disabledGhost).toHaveClass('border', 'border-transparent')
    expect(disabledGhost).not.toHaveClass('border-muted-foreground')
    expect(focusableGhost).toHaveAttribute('data-disabled')
    expect(focusableGhost).toHaveClass('border', 'border-transparent')
    expect(focusableGhost).not.toHaveClass('border-muted-foreground')
  })

  it('UC-007 / EX-006 / SQ-002 / CR-006 / CR-011 / QA-001 - preserves disabled label, focus, and focus styling', () => {
    const onClick = vi.fn()

    render(
      <Button disabled focusableWhenDisabled onClick={onClick} type="button">
        save workout
      </Button>
    )

    const button = screen.getByRole('button', { name: 'save workout' })
    const label = within(button).getByText('save workout')

    fireEvent.click(button)
    button.focus()

    expect(button).toHaveAttribute('data-disabled')
    expect(button).toHaveFocus()
    expect(button).toHaveClass(
      'border-muted-foreground',
      'focus-visible:focus-geometry',
      'focus-visible:outline-foreground',
      'text-muted-foreground'
    )
    expect(label).toHaveAttribute('data-heading')
    expect(label).toHaveClass('text-muted-foreground')
    expect(label).toHaveClass('transition-colors')
    expect(label).not.toHaveClass('text-foreground')
    expect(onClick).not.toHaveBeenCalled()
  })

  it('UC-006 / UC-007 - preserves disabled and focus treatments at icon-prefixed sizes', () => {
    render(
      <>
        <Button
          aria-label="Disabled default icon"
          disabled
          focusableWhenDisabled
          size="icon-md"
          type="button"
        >
          <SlidersHorizontal />
        </Button>
        <Button
          aria-label="Disabled ghost icon"
          disabled
          focusableWhenDisabled
          size="icon-md"
          type="button"
          variant="ghost"
        >
          <SlidersHorizontal />
        </Button>
        <Button
          aria-label="Disabled link icon"
          disabled
          focusableWhenDisabled
          size="icon-md"
          type="button"
          variant="link"
        >
          <SlidersHorizontal />
        </Button>
      </>
    )

    const defaultButton = screen.getByRole('button', { name: 'Disabled default icon' })
    const ghostButton = screen.getByRole('button', { name: 'Disabled ghost icon' })
    const linkButton = screen.getByRole('button', { name: 'Disabled link icon' })

    defaultButton.focus()

    expect(defaultButton).toHaveFocus()
    expect(defaultButton).toHaveAttribute('data-disabled')
    expect(defaultButton).toHaveClass(
      'border-muted-foreground',
      'focus-visible:focus-geometry',
      'focus-visible:outline-foreground',
      'size-9',
      'text-muted-foreground'
    )
    expect(ghostButton).toHaveAttribute('data-disabled')
    expect(ghostButton).toHaveClass('border-transparent', 'size-9', 'text-muted-foreground')
    expect(linkButton).toHaveAttribute('data-disabled')
    expect(linkButton).toHaveClass(
      'border-0',
      'data-disabled:cursor-default',
      'size-9',
      'text-muted-foreground'
    )
  })

  it('UC-008 / EX-007 / CR-001 - composes the canonical reveal around the Button action surface', () => {
    const onClick = vi.fn()
    const { container } = render(
      <RevealedButton
        className="consumer-class"
        data-source="workout-save"
        onClick={onClick}
        revealAnimation
        type="button"
      >
        save workout
      </RevealedButton>
    )

    const root = getRevealRoot(container)
    const overlay = getRevealOverlay(container)
    const button = screen.getByRole('button', { name: 'save workout' })
    const heading = button.querySelector<HTMLElement>('[data-heading]')

    fireEvent.click(button)
    act(() => {
      button.focus()
    })

    expect(heading).toBeInTheDocument()
    expect(root).toHaveAttribute('data-motion', 'reveal')
    expect(button).toHaveFocus()
    expect(screen.getAllByRole('button', { name: 'save workout' })).toHaveLength(1)
    expect(button).toHaveAttribute('data-source', 'workout-save')
    expect(button).toHaveClass(
      'consumer-class',
      'bg-background',
      'border',
      'border-foreground',
      'h-10',
      'px-6',
      'py-1'
    )
    expect(heading).toHaveAttribute('data-heading-size', 'sm')
    expect(heading).not.toHaveAttribute('data-heading-legacy-variant')
    expect(root).toHaveAttribute('data-content-mode', 'flow')
    expect(root).toHaveAttribute('data-unreveal-behavior', 'return')
    expect(root).not.toHaveAttribute('data-active-unreveal-behavior')
    expect(overlay).toHaveAttribute('aria-hidden', 'true')
    expect(overlay).toHaveAttribute('inert')
    expect(onClick).toHaveBeenCalledOnce()
  })

  it('UC-009 / EX-008 - forwards RevealAnimation props once without recursive reveal composition', () => {
    const onRevealStart = vi.fn()
    const { container, rerender } = render(
      <RevealedButton
        revealAnimation={{ ...BUTTON_REVEAL_PROPS_OBJECT, onRevealStart }}
        type="button"
      >
        inspect reveal
      </RevealedButton>
    )

    const button = screen.getByRole('button', { name: 'inspect reveal' })
    const root = getRevealRoot(container)
    const copy = getRevealCopy(container)
    const copyScale = getRevealCopyScale(container)

    expect(BUTTON_REVEAL_ANIMATION_OMITS_RENDER_AND_CHILDREN).toBe(true)
    expectTypeOf<ButtonRevealAnimationProps>().toEqualTypeOf<
      Omit<RevealAnimationProps, 'children' | 'render'>
    >()
    expect(container.querySelectorAll('[data-motion="reveal"]')).toHaveLength(1)
    expect(screen.getAllByRole('button', { name: 'inspect reveal' })).toHaveLength(1)
    expect(root.tagName).toBe('SPAN')
    expect(root).toHaveAttribute('data-content-mode', 'phrasing')
    expect(root).toHaveAttribute('data-unreveal-behavior', 'continue')
    expect(root).not.toHaveAttribute('data-active-unreveal-behavior')
    expect(copy).toHaveStyle({
      '--reveal-offset-x': '12px',
      '--reveal-offset-y': '-4px'
    })
    expect(copyScale).toHaveStyle({ '--reveal-origin': 'center center' })
    expect(getCssTransform(copyScale)).toContain('scale(1)')

    rerender(
      <RevealedButton
        revealAnimation={{ ...BUTTON_REVEAL_PROPS_OBJECT, onRevealStart, reveal: false }}
        type="button"
      >
        inspect reveal
      </RevealedButton>
    )

    expect(container.querySelectorAll('[data-motion="reveal"]')).toHaveLength(1)
    expect(root).toHaveAttribute('data-unreveal-behavior', 'continue')
    expect(root).toHaveAttribute('data-active-unreveal-behavior', 'continue')
    expect(onRevealStart).toHaveBeenCalledOnce()
    expect(onRevealStart).toHaveBeenCalledWith(false)

    fireEvent.mouseEnter(button)
    fireEvent.focus(button)

    expect(container.querySelectorAll('[data-motion="reveal"]')).toHaveLength(1)
    expect(root).toHaveAttribute('data-active-unreveal-behavior', 'continue')
    expect(onRevealStart).toHaveBeenCalledOnce()
  })

  it('UC-010 / EX-007 - inherits the diagonal reveal default without a border conflict', () => {
    const { container } = render(
      <RevealedButton revealAnimation={{ reveal: true }} type="button">
        save workout
      </RevealedButton>
    )

    const root = getRevealRoot(container)
    const overlaySurface = getRevealOverlaySurface(container)
    const overlayHeading = overlaySurface.querySelector<HTMLElement>('[data-heading]')

    expect(root).toHaveAttribute('data-motion', 'reveal')
    expect(root).toHaveAttribute('data-content-mode', 'flow')
    expect(root).toHaveAttribute('data-unreveal-behavior', 'return')
    expect(root).not.toHaveAttribute('data-active-unreveal-behavior')
    expect(overlayHeading).toBeInTheDocument()

    expect(overlaySurface).toHaveClass(
      'bg-background',
      'border',
      'border-foreground',
      'data-[reveal-overlay-surface]:border-transparent',
      'h-10',
      'px-6',
      'py-1',
      'text-foreground'
    )
    expect(overlayHeading).toHaveAttribute('data-heading-size', 'sm')
    expect(overlayHeading).not.toHaveAttribute('data-heading-legacy-variant')
  })

  it('UC-011 / EX-008 / QA-005 - renders icon reveal overlay without border or icon-size glitches', () => {
    const { container } = render(
      <RevealedButton
        aria-label="Open profile"
        revealAnimation={ICON_REVEAL_PROPS_OBJECT}
        size="icon-lg"
        type="button"
      >
        <UserRound data-testid="profile-icon" />
      </RevealedButton>
    )

    const realButton = screen.getByRole('button', { name: 'Open profile' })
    const realIcon = within(realButton).getByTestId('profile-icon')
    const overlaySurface = getRevealOverlaySurface(container)
    const overlayIcon = within(overlaySurface).getByTestId('profile-icon')
    const overlayIconCopy = getRevealCopy(container)
    const overlayIconCopyScale = getRevealCopyScale(container)

    expect(overlaySurface).toHaveClass(
      'bg-background',
      'border',
      'border-foreground',
      'data-[reveal-overlay-surface]:border-transparent',
      'size-10',
      'text-foreground',
      '[&_svg]:size-4.5'
    )
    expect(realButton).toHaveClass('size-10', '[&_svg]:size-4.5')
    expect(realIcon).toBeInTheDocument()
    expect(overlayIcon).toBeInTheDocument()
    expect(overlayIconCopy).toHaveStyle({
      '--reveal-offset-x': '8px',
      '--reveal-offset-y': '-2px'
    })
    expect(overlayIconCopy).toContainElement(overlayIcon)
    expect(overlayIconCopyScale).toHaveStyle({ '--reveal-origin': 'center center' })
    expect(getCssTransform(overlayIconCopyScale)).toContain('scale(1.2)')
  })

  it('UC-009 / UC-012 / EX-008 - preserves interaction-derived continue inspection while rendering the ghost overlay treatment', () => {
    const { container } = render(
      <div>
        <RevealedButton
          aria-label="Skip"
          revealAnimation={{ direction: 'left-to-right', unrevealBehavior: 'continue' }}
          size="icon-sm"
          type="button"
          variant="ghost"
        >
          <SkipForward data-testid="skip-icon" />
        </RevealedButton>
        <output>ghost unreveal: continue</output>
      </div>
    )

    const button = screen.getByRole('button', { name: 'Skip' })
    const root = getRevealRoot(container)
    const overlay = getRevealOverlay(container)
    const overlaySurface = getRevealOverlaySurface(container)
    const overlayIcon = within(overlaySurface).getByTestId('skip-icon')

    expect(root).toHaveAttribute('data-unreveal-behavior', 'continue')
    expect(root).not.toHaveAttribute('data-active-unreveal-behavior')
    expect(screen.getByText('ghost unreveal: continue')).toBeInTheDocument()
    expect(overlaySurface).toHaveClass(
      'bg-transparent',
      'border',
      'border-transparent',
      'data-[reveal-overlay-surface]:bg-background',
      'hover:not-data-disabled:bg-muted',
      'size-8',
      'text-foreground'
    )
    expect(overlayIcon).toHaveClass('size-4')
    expect(overlaySurface.querySelector('[data-heading]')).toBeNull()

    fireEvent.mouseEnter(button)
    fireEvent.transitionEnd(overlay, { propertyName: 'clip-path' })
    fireEvent.mouseLeave(button)

    expect(root).toHaveAttribute('data-unreveal-behavior', 'continue')
    expect(root).toHaveAttribute('data-active-unreveal-behavior', 'continue')
  })

  it('UC-013 / EX-008 / CR-001 - uses consumer-provided phrasing content mode and copied icon scale', () => {
    const { container } = render(
      <p>
        <RevealedButton
          aria-label="Reset filters"
          revealAnimation={{ contentMode: 'phrasing', reveal: true, scale: 1 }}
          size="icon-xs"
          type="button"
          variant="link"
        >
          <RotateCcw data-testid="reset-icon" />
        </RevealedButton>
      </p>
    )

    const root = getRevealRoot(container)
    const overlaySurface = getRevealOverlaySurface(container)
    const overlayIcon = within(overlaySurface).getByTestId('reset-icon')
    const overlayCopyScale = overlaySurface.querySelector<HTMLElement>('[data-reveal-copy-scale]')
    const paragraph = container.querySelector('p')

    expect(root.tagName).toBe('SPAN')
    expect(root).toHaveAttribute('data-content-mode', 'phrasing')
    expect(paragraph?.querySelector('div')).toBeNull()
    expect(overlaySurface).toHaveClass(
      'bg-transparent',
      'border-0',
      'data-[reveal-overlay-surface]:bg-background',
      'data-[reveal-overlay-surface]:text-foreground',
      'size-7',
      'text-inherit',
      'underline'
    )
    expect(overlayIcon).toHaveClass('size-3.5')
    expect(overlaySurface.querySelector('[data-heading]')).toBeNull()
    expect(overlayCopyScale).toBeInTheDocument()
    expect(getCssTransform(overlayCopyScale as HTMLElement)).toContain('scale(1)')
  })

  it('UC-011 / UC-013 - leaves copied-content scaling owned by RevealAnimation for icon and link reveals', () => {
    const { container, rerender } = render(
      <RevealedButton aria-label="Open profile" revealAnimation size="icon-lg" type="button">
        <UserRound data-testid="default-scale-icon" />
      </RevealedButton>
    )

    const iconOverlaySurface = getRevealOverlaySurface(container)
    const iconCopyScale = getRevealCopyScale(container)
    const iconOverlayClassName = iconOverlaySurface.getAttribute('class') ?? ''

    expect(getCssTransform(iconCopyScale)).toContain('scale(1.2)')
    expect(iconOverlayClassName).not.toContain('transform-none')

    rerender(
      <RevealedButton
        aria-label="Reset filters"
        revealAnimation={{ reveal: true }}
        size="icon-xs"
        type="button"
        variant="link"
      >
        <RotateCcw />
      </RevealedButton>
    )

    const linkRoot = getRevealRoot(container)
    const linkOverlaySurface = getRevealOverlaySurface(container)
    const linkCopyScale = getRevealCopyScale(container)
    const linkOverlayClassName = linkOverlaySurface.getAttribute('class') ?? ''

    expect(linkRoot.tagName).toBe('DIV')
    expect(linkRoot).toHaveAttribute('data-content-mode', 'flow')
    expect(getCssTransform(linkCopyScale)).toContain('scale(1.2)')
    expect(linkOverlayClassName).not.toContain('transform-none')
  })

  it('UC-014 / EX-009 - shares semantic-free Button chrome without creating Button behavior', () => {
    const onClick = vi.fn()
    const chromeClassName = BUTTON_FAMILY.buttonChromeVariants({
      size: 'lg',
      variant: 'default'
    })
    const headingSize = BUTTON_FAMILY.buttonChromeHeadingSize('lg')

    expectTypeOf<ButtonSize>().toEqualTypeOf<ExpectedButtonSize>()
    expectTypeOf<ButtonVariant>().toEqualTypeOf<ExpectedButtonVariant>()
    expectTypeOf<ButtonChromeOptions>().toEqualTypeOf<{
      size?: ExpectedButtonSize
      variant?: ExpectedButtonVariant
    }>()
    expectTypeOf<ComponentProps<typeof Button>['size']>().toEqualTypeOf<
      ExpectedButtonSize | undefined
    >()
    expectTypeOf<ComponentProps<typeof Button>['variant']>().toEqualTypeOf<
      ExpectedButtonVariant | undefined
    >()

    for (const testCase of ICON_BUTTON_SIZE_CASES) {
      expect(BUTTON_FAMILY.buttonChromeHeadingSize(testCase.size)).toBe(testCase.headingSize)

      for (const variant of BUTTON_VARIANTS) {
        const iconChromeClassName = BUTTON_FAMILY.buttonChromeVariants({
          size: testCase.size,
          variant
        })

        expect(iconChromeClassName).toContain(testCase.sideClassName)
        expect(iconChromeClassName).toContain(`[&_svg]:${testCase.iconClassName}`)
      }
    }

    render(
      <span className={chromeClassName} data-testid="shared-button-chrome" onClick={onClick}>
        <HeadingWithoutVariant size={headingSize}>shared chrome</HeadingWithoutVariant>
      </span>
    )

    const surface = screen.getByTestId('shared-button-chrome')
    const label = within(surface).getByText('shared chrome')

    fireEvent.click(surface)

    expect(BUTTON_FAMILY.buttonChromeVariants).toBeTypeOf('function')
    expect(BUTTON_FAMILY.buttonChromeHeadingSize).toBeTypeOf('function')
    expect(PACKAGE_EXPORTS.buttonChromeVariants).toBe(BUTTON_FAMILY.buttonChromeVariants)
    expect(PACKAGE_EXPORTS.buttonChromeHeadingSize).toBe(BUTTON_FAMILY.buttonChromeHeadingSize)
    expect(BUTTON_FAMILY.buttonChromeVariants()).toBe(
      BUTTON_FAMILY.buttonChromeVariants({ size: 'lg', variant: 'default' })
    )
    expect(BUTTON_FAMILY.buttonChromeHeadingSize()).toBe('sm')
    expect(headingSize).toBe('sm')
    expect(surface.tagName).toBe('SPAN')
    expect(surface).toHaveClass(
      'bg-background',
      'border',
      'border-foreground',
      'h-10',
      'px-6',
      'py-1',
      'text-foreground',
      'transition-colors'
    )
    expect(label).toHaveAttribute('data-heading')
    expect(label).toHaveAttribute('data-heading-size', 'sm')
    expect(label).not.toHaveAttribute('data-heading-legacy-variant')
    expect(screen.queryByRole('button', { name: 'shared chrome' })).toBeNull()
    expect(surface).not.toHaveAttribute('aria-busy')
    expect(surface).not.toHaveAttribute('data-disabled')
    expect(surface).not.toHaveAttribute('data-loading')
    expect(surface.querySelector('[data-motion="reveal"]')).toBeNull()
    expect(onClick).toHaveBeenCalledOnce()
  })

  it('UC-001 / EX-001 / EX-002 / EX-003 / EX-004 / EX-005 / EX-006 / EX-007 / EX-008 - exposes Button through public package assemblies', () => {
    expect(PACKAGE_EXPORTS.Button).toBe(Button)
    expect(PACKAGE_EXPORTS.Components.Button).toBe(Button)
    expect(PACKAGE_EXPORTS.Ui.Components).toBe(PACKAGE_EXPORTS.Components)
    expect(PACKAGE_EXPORTS.Ui.Components.Button).toBe(Button)
    expect(PACKAGE_EXPORTS.Button).not.toHaveProperty('Root')
    expect(PACKAGE_EXPORTS.Components.Button).not.toHaveProperty('Root')
    expect(PACKAGE_EXPORTS.Ui.Components.Button).not.toHaveProperty('Root')
  })
})
