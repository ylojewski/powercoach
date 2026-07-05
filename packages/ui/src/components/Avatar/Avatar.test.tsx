import { Avatar as BaseUiAvatar } from '@base-ui/react/avatar'
import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { createRef, type CSSProperties, type ReactElement } from 'react'
import { afterEach, beforeEach, describe, expect, expectTypeOf, it, vi } from 'vitest'

import {
  type AvatarFallbackProps,
  type AvatarImageProps,
  type AvatarRootProps,
  type AvatarSize,
  type HeadingProps,
  type HeadingSize,
  type ImageLoadingStatus,
  type RevealAnimationProps
} from '../..'
import * as PackageExports from '../..'
import {
  Ex004DefaultDisabledAndControlledReveal,
  Ex005ImageEntryTransition,
  Ex007SupportedRenderComposition
} from './Avatar.stories'

type AvatarFallbackComponent = (props: AvatarFallbackProps) => ReactElement | null
type AvatarImageComponent = (props: AvatarImageProps) => ReactElement | null
type AvatarRootComponent = (props: AvatarRootProps) => ReactElement | null

interface AvatarNamespaceContract {
  Fallback: AvatarFallbackComponent
  Image: AvatarImageComponent
  Root: AvatarRootComponent
}

interface AvatarPackageContract {
  Avatar: AvatarNamespaceContract
  Components: typeof PackageExports.Components & {
    Avatar: AvatarNamespaceContract
  }
  Ui: typeof PackageExports.Ui & {
    Components: typeof PackageExports.Components & {
      Avatar: AvatarNamespaceContract
    }
  }
}

interface AvatarCssProperties extends CSSProperties {
  '--hard-shadow'?: string
}

interface AvatarStatusCssProperties extends CSSProperties {
  '--image-status'?: ImageLoadingStatus
}

type AvatarRevealAnimationProps = Exclude<
  NonNullable<AvatarRootProps['revealAnimationProps']>,
  boolean
>

class MockBrowserImage {
  static instances: MockBrowserImage[] = []

  complete = false
  crossOrigin: string | null = null
  naturalWidth = 0
  onerror: (() => void) | null = null
  onload: (() => void) | null = null
  referrerPolicy = ''
  sizes = ''
  src = ''
  srcset = ''

  constructor() {
    MockBrowserImage.instances.push(this)
  }
}

const PACKAGE_EXPORTS = PackageExports as typeof PackageExports & AvatarPackageContract
const Avatar = PACKAGE_EXPORTS.Avatar
const ORIGINAL_GET_ANIMATIONS = HTMLElement.prototype.getAnimations

const AVATAR_SIZE_CASES = [
  {
    hardShadow: '2px 2px 0 0 var(--color-foreground)',
    headingClassNames: ['tracking-wide'],
    paddingClassName: 'p-px',
    size: 'xs',
    squareClassName: 'size-7'
  },
  {
    hardShadow: '2.5px 2.5px 0 0 var(--color-foreground)',
    headingClassNames: ['text-lg', 'tracking-wide'],
    paddingClassName: 'p-px',
    size: 'sm',
    squareClassName: 'size-8'
  },
  {
    hardShadow: '3px 3px 0 0 var(--color-foreground)',
    headingClassNames: ['text-xl', 'tracking-wide'],
    paddingClassName: 'p-0.5',
    size: 'md',
    squareClassName: 'size-9'
  },
  {
    hardShadow: '3.3333px 3.3333px 0 0 var(--color-foreground)',
    headingClassNames: ['text-2xl'],
    paddingClassName: 'p-0.5',
    size: 'lg',
    squareClassName: 'size-10'
  },
  {
    hardShadow: '4px 4px 0 0 var(--color-foreground)',
    headingClassNames: ['text-4xl', 'tracking-tight'],
    paddingClassName: 'p-0.5',
    size: 'xl',
    squareClassName: 'size-12'
  },
  {
    hardShadow: '6.6667px 6.6667px 0 0 var(--color-foreground)',
    headingClassNames: ['text-6xl', 'tracking-tight'],
    paddingClassName: 'p-[3px]',
    size: '2xl',
    squareClassName: 'size-20'
  },
  {
    hardShadow: '13.3333px 13.3333px 0 0 var(--color-foreground)',
    headingClassNames: ['text-9xl', 'tracking-tight'],
    paddingClassName: 'p-1',
    size: '3xl',
    squareClassName: 'size-40'
  }
] as const satisfies readonly {
  hardShadow: string
  headingClassNames: readonly string[]
  paddingClassName: string
  size: AvatarSize
  squareClassName: string
}[]

function getRequiredElement<TElement extends Element>(
  element: TElement | null | undefined,
  message: string
): TElement {
  if (element == null) {
    throw new Error(message)
  }

  return element
}

function getRevealRoot(root: HTMLElement): HTMLElement {
  return getRequiredElement(
    root.querySelector<HTMLElement>('[data-motion="reveal"]'),
    'Expected Avatar to contain one RevealAnimation root'
  )
}

function getRevealOverlay(root: HTMLElement): HTMLElement {
  return getRequiredElement(
    root.querySelector<HTMLElement>('[data-reveal-overlay]'),
    'Expected Avatar to contain one RevealAnimation overlay'
  )
}

function getRevealOverlaySurface(root: HTMLElement): HTMLElement {
  return getRequiredElement(
    root.querySelector<HTMLElement>('[data-reveal-overlay-surface]'),
    'Expected Avatar to contain one decorative reveal surface'
  )
}

function getRealText(text: string): HTMLElement {
  return getRequiredElement(
    screen.getAllByText(text).find((element) => element.closest('[data-reveal-overlay]') === null),
    `Expected one real presentation for ${text}`
  )
}

function getMockBrowserImage(): MockBrowserImage {
  const image = MockBrowserImage.instances[0]

  if (image === undefined) {
    throw new Error('Expected Avatar.Image to create one Base UI image loader')
  }

  return image
}

beforeEach(() => {
  MockBrowserImage.instances = []
  vi.stubGlobal('Image', MockBrowserImage)
})

afterEach(() => {
  vi.useRealTimers()
  vi.restoreAllMocks()
  vi.unstubAllGlobals()

  if (ORIGINAL_GET_ANIMATIONS === undefined) {
    Reflect.deleteProperty(HTMLElement.prototype, 'getAnimations')
  } else {
    Object.defineProperty(HTMLElement.prototype, 'getAnimations', {
      configurable: true,
      value: ORIGINAL_GET_ANIMATIONS
    })
  }
})

describe('Avatar', () => {
  it('UC-001 - exposes the three-part package namespace and Base UI-aligned public types', () => {
    expect(typeof Avatar).toBe('object')
    expect(Object.keys(Avatar).sort()).toEqual(['Fallback', 'Image', 'Root'])
    expect(Avatar.Root).toBeTypeOf('function')
    expect(Avatar.Image).toBeTypeOf('function')
    expect(Avatar.Fallback).toBeTypeOf('function')
    expect(PACKAGE_EXPORTS.Components.Avatar).toBe(Avatar)
    expect(PACKAGE_EXPORTS.Ui.Components).toBe(PACKAGE_EXPORTS.Components)
    expect(PACKAGE_EXPORTS.Ui.Components.Avatar).toBe(Avatar)

    expectTypeOf<AvatarSize>().toEqualTypeOf<HeadingSize>()
    expectTypeOf<ImageLoadingStatus>().toEqualTypeOf<'idle' | 'loading' | 'loaded' | 'error'>()
    expectTypeOf<AvatarRootProps>().toMatchTypeOf<BaseUiAvatar.Root.Props>()
    expectTypeOf<BaseUiAvatar.Root.Props>().toMatchTypeOf<AvatarRootProps>()
    expectTypeOf<AvatarImageProps>().toEqualTypeOf<BaseUiAvatar.Image.Props>()
    expectTypeOf<AvatarFallbackProps>().toMatchTypeOf<BaseUiAvatar.Fallback.Props>()
    expectTypeOf<BaseUiAvatar.Fallback.Props>().toMatchTypeOf<AvatarFallbackProps>()
    expectTypeOf<NonNullable<AvatarFallbackProps['headingProps']>>().toEqualTypeOf<
      Omit<HeadingProps, 'children' | 'size'>
    >()
    expectTypeOf<AvatarRevealAnimationProps>().toEqualTypeOf<
      Omit<RevealAnimationProps, 'children' | 'contentMode' | 'render' | 'scale'>
    >()
  })

  it('UC-002 / EX-001 / SQ-003 - uses md square Button chrome, proportional hard shadow, and an immediate Heading fallback by default', () => {
    const chromeClassNames = PACKAGE_EXPORTS.buttonChromeVariants({
      size: 'icon-md',
      variant: 'default'
    })
      .split(/\s+/)
      .filter(Boolean)

    render(
      <Avatar.Root data-testid="default-avatar">
        <Avatar.Fallback>AK</Avatar.Fallback>
      </Avatar.Root>
    )

    const root = screen.getByTestId('default-avatar')
    const realHeading = getRealText('AK')
    const revealRoot = getRevealRoot(root)
    const revealCopyScale = getRequiredElement(
      root.querySelector<HTMLElement>('[data-reveal-copy-scale]'),
      'Expected the default fallback reveal copy scale'
    )

    expect(root.tagName).toBe('SPAN')
    expect(root).toHaveClass(...chromeClassNames)
    expect(root).toHaveClass(
      'isolate',
      'overflow-hidden',
      'p-0.5',
      'shadow-(--hard-shadow)',
      'size-9'
    )
    expect(root).toHaveStyle({
      '--hard-shadow': '3px 3px 0 0 var(--color-foreground)'
    })
    expect(root).not.toHaveClass('field-emphasis')
    expect(root).not.toHaveAttribute('role')
    expect(root).not.toHaveAttribute('tabindex')
    expect(screen.queryByRole('button', { name: 'AK' })).not.toBeInTheDocument()
    expect(realHeading.tagName).toBe('SPAN')
    expect(realHeading).toHaveClass('font-heading', 'text-xl', 'tracking-wide')
    expect(revealRoot).toHaveAttribute('data-content-mode', 'phrasing')
    expect(root.querySelectorAll('[data-motion="reveal"]')).toHaveLength(1)
    expect(revealCopyScale.style.transform).toBe('scale(1)')
  })

  it('UC-003 / EX-003 / CR-006 / SQ-002 / SQ-003 - maps every Avatar size to its corrected square, padding, Heading, and proportional hard shadow', () => {
    for (const testCase of AVATAR_SIZE_CASES) {
      const chromeClassNames = PACKAGE_EXPORTS.buttonChromeVariants({
        size: `icon-${testCase.size}`,
        variant: 'default'
      })
        .split(/\s+/)
        .filter((className) => className !== '' && !className.startsWith('size-'))
      const supersededSquareClassName =
        testCase.size === '2xl' ? 'size-14' : testCase.size === '3xl' ? 'size-20' : undefined
      const { unmount } = render(
        <Avatar.Root data-testid={`avatar-${testCase.size}`} size={testCase.size}>
          <Avatar.Fallback>{testCase.size}</Avatar.Fallback>
        </Avatar.Root>
      )

      const root = screen.getByTestId(`avatar-${testCase.size}`)
      const heading = getRealText(testCase.size)

      expect(root).toHaveClass(...chromeClassNames)
      expect(root).toHaveClass(testCase.squareClassName, testCase.paddingClassName)
      expect(root).toHaveStyle({ '--hard-shadow': testCase.hardShadow })
      expect(heading).toHaveClass('font-heading', ...testCase.headingClassNames)
      expect(heading).toHaveTextContent(testCase.size)

      if (supersededSquareClassName !== undefined) {
        expect(root).not.toHaveClass(supersededSquareClassName)
      }

      unmount()
    }
  })

  it('UC-004 / EX-002 - composes headingProps on the real and inert decorative fallback presentations', () => {
    render(
      <Avatar.Root>
        <Avatar.Fallback
          className="consumer-fallback"
          data-testid="real-fallback"
          headingProps={{
            className: 'consumer-heading',
            render: <h3 />,
            tone: 'muted'
          }}
        >
          Athlete initials
        </Avatar.Fallback>
      </Avatar.Root>
    )

    const fallback = screen.getByTestId('real-fallback')
    const accessibleHeading = screen.getByRole('heading', {
      level: 3,
      name: 'Athlete initials'
    })
    const allHeadings = screen.getAllByRole('heading', { hidden: true, level: 3 })
    const overlay = getRequiredElement(
      accessibleHeading.closest('[data-reveal-root]')?.querySelector('[data-reveal-overlay]'),
      'Expected the fallback reveal overlay'
    )
    const decorativeHeading = getRequiredElement(
      allHeadings.find((heading) => heading.closest('[data-reveal-overlay]') !== null),
      'Expected the decorative fallback Heading'
    )

    expect(fallback).toHaveClass('consumer-fallback')
    expect(fallback).toContainElement(accessibleHeading)
    expect(accessibleHeading).toHaveClass(
      'consumer-heading',
      'font-heading',
      'text-muted-foreground',
      'text-xl'
    )
    expect(allHeadings).toHaveLength(2)
    expect(decorativeHeading).toHaveClass(
      'consumer-heading',
      'font-heading',
      'text-muted-foreground',
      'text-xl'
    )
    expect(overlay).toHaveAttribute('aria-hidden', 'true')
    expect(overlay).toHaveAttribute('inert')
    expect(overlay).toHaveClass('pointer-events-none')
    expect(screen.getAllByTestId('real-fallback')).toHaveLength(1)
  })

  it('UC-005 / EX-002 - renders Fallback immediately unless a Base UI delay is supplied', () => {
    vi.useFakeTimers()

    render(
      <div>
        <Avatar.Root>
          <Avatar.Fallback data-testid="immediate-fallback">IM</Avatar.Fallback>
        </Avatar.Root>
        <Avatar.Root>
          <Avatar.Fallback data-testid="delayed-fallback" delay={600}>
            DL
          </Avatar.Fallback>
        </Avatar.Root>
      </div>
    )

    expect(screen.getByTestId('immediate-fallback')).toBeVisible()
    expect(screen.queryByTestId('delayed-fallback')).not.toBeInTheDocument()

    act(() => vi.advanceTimersByTime(599))

    expect(screen.queryByTestId('delayed-fallback')).not.toBeInTheDocument()

    act(() => vi.advanceTimersByTime(1))

    expect(screen.getByTestId('delayed-fallback')).toBeVisible()
  })

  it('UC-006 / UC-016 / EX-002 - preserves the single Base UI image lifecycle and shows the failed-image fallback', async () => {
    const rootStatuses: ImageLoadingStatus[] = []
    const fallbackStatuses: ImageLoadingStatus[] = []
    const imageTransitionStatuses: BaseUiAvatar.Image.State['transitionStatus'][] = []
    const onLoadingStatusChange = vi.fn<(status: ImageLoadingStatus) => void>()

    render(
      <Avatar.Root
        className={(state: BaseUiAvatar.Root.State) => {
          rootStatuses.push(state.imageLoadingStatus)

          return `root-${state.imageLoadingStatus}`
        }}
        data-testid="lifecycle-avatar"
        style={(state: BaseUiAvatar.Root.State) =>
          ({
            '--image-status': state.imageLoadingStatus
          }) as AvatarStatusCssProperties
        }
      >
        <Avatar.Image
          alt="Lifecycle athlete"
          className={(state: BaseUiAvatar.Image.State) => {
            imageTransitionStatuses.push(state.transitionStatus)

            return `consumer-image image-${state.imageLoadingStatus} transition-${state.transitionStatus ?? 'none'}`
          }}
          onLoadingStatusChange={onLoadingStatusChange}
          src="/athletes/lifecycle.jpg"
          style={(state: BaseUiAvatar.Image.State) => ({
            opacity: state.imageLoadingStatus === 'loaded' ? 1 : 0.5
          })}
        />
        <Avatar.Fallback
          className={(state: BaseUiAvatar.Fallback.State) => {
            fallbackStatuses.push(state.imageLoadingStatus)

            return `fallback-${state.imageLoadingStatus}`
          }}
          data-testid="lifecycle-fallback"
        >
          LF
        </Avatar.Fallback>
      </Avatar.Root>
    )

    const root = screen.getByTestId('lifecycle-avatar')
    const persistentReveal = getRevealRoot(root)

    expect(screen.getByTestId('lifecycle-fallback')).toBeVisible()
    expect(MockBrowserImage.instances).toHaveLength(1)
    await waitFor(() => expect(onLoadingStatusChange).toHaveBeenCalledWith('loading'))

    act(() => {
      const browserImage = getMockBrowserImage()

      browserImage.naturalWidth = 128
      browserImage.onload?.()
    })

    const image = screen.getByRole('img', { name: 'Lifecycle athlete' })

    expect(onLoadingStatusChange).toHaveBeenCalledWith('loaded')
    expect(rootStatuses).toEqual(expect.arrayContaining(['idle', 'loading', 'loaded']))
    expect(fallbackStatuses).toEqual(expect.arrayContaining(['idle', 'loading']))
    expect(imageTransitionStatuses).toContain('starting')
    expect(image).toHaveClass('consumer-image', 'image-loaded', 'transition-starting')

    await waitFor(() => {
      expect(imageTransitionStatuses).toContain(undefined)
      expect(image).toHaveClass('consumer-image', 'image-loaded', 'transition-none')
    })
    expect(image).toHaveStyle({ opacity: '1' })
    expect(screen.queryByTestId('lifecycle-fallback')).not.toBeInTheDocument()
    expect(getRevealRoot(root)).toBe(persistentReveal)

    act(() => getMockBrowserImage().onerror?.())

    await waitFor(() => expect(onLoadingStatusChange).toHaveBeenCalledWith('error'))
    expect(screen.getByTestId('lifecycle-fallback')).toHaveClass('fallback-error')
    expect(root).toHaveClass('root-error')
    expect(root).toHaveStyle({ '--image-status': 'error' })
    expect(getRevealRoot(root)).toBe(persistentReveal)
    expect(MockBrowserImage.instances).toHaveLength(1)
  })

  it('UC-007 / EX-004 / SQ-001 - reveals from the complete Root border box while composing consumer pointer and focus handlers', () => {
    const onBlur = vi.fn()
    const onFocus = vi.fn()
    const onPointerEnter = vi.fn()
    const onPointerLeave = vi.fn()

    render(
      <Avatar.Root
        data-testid="interactive-avatar"
        onBlur={onBlur}
        onFocus={onFocus}
        onPointerEnter={onPointerEnter}
        onPointerLeave={onPointerLeave}
        tabIndex={0}
      >
        <Avatar.Fallback>RV</Avatar.Fallback>
      </Avatar.Root>
    )

    const root = screen.getByTestId('interactive-avatar')
    const overlay = getRevealOverlay(root)
    const hiddenClipPath = overlay.style.clipPath

    fireEvent.pointerEnter(root)

    expect(overlay.style.clipPath).not.toBe(hiddenClipPath)

    fireEvent.pointerLeave(root)

    expect(overlay.style.clipPath).toBe(hiddenClipPath)

    fireEvent.focus(root)

    expect(overlay.style.clipPath).not.toBe(hiddenClipPath)

    fireEvent.blur(root)

    expect(overlay.style.clipPath).toBe(hiddenClipPath)

    fireEvent.pointerEnter(root)
    fireEvent.pointerDown(root)
    fireEvent.focus(root)
    fireEvent.pointerLeave(root)

    expect(overlay.style.clipPath).toBe(hiddenClipPath)

    fireEvent.blur(root)

    expect(onPointerEnter).toHaveBeenCalledTimes(2)
    expect(onPointerLeave).toHaveBeenCalledTimes(2)
    expect(onFocus).toHaveBeenCalledTimes(2)
    expect(onBlur).toHaveBeenCalledTimes(2)
    expect(root.querySelectorAll('[data-motion="reveal"]')).toHaveLength(1)
  })

  it('UC-008 / EX-004 - disables the reveal overlay and fallback copy', () => {
    render(
      <Avatar.Root data-testid="static-avatar" revealAnimationProps={false}>
        <Avatar.Fallback>ST</Avatar.Fallback>
      </Avatar.Root>
    )

    const root = screen.getByTestId('static-avatar')

    fireEvent.mouseEnter(root)
    fireEvent.focus(root)

    expect(root.querySelector('[data-motion="reveal"]')).not.toBeInTheDocument()
    expect(root.querySelector('[data-reveal-overlay]')).not.toBeInTheDocument()
    expect(root.querySelector('[data-reveal-copy]')).not.toBeInTheDocument()
    expect(screen.getAllByText('ST')).toHaveLength(1)
  })

  it('UC-009 / EX-004 / SQ-001 - keeps controlled reveal authoritative over Root pointer and focus targets', async () => {
    const onRevealChange = vi.fn()
    const onRevealComplete = vi.fn()
    const onRevealStart = vi.fn()
    const revealAnimationProps: AvatarRevealAnimationProps = {
      alignX: 'start',
      alignY: 'end',
      direction: 'top-to-bottom',
      offsetX: -6,
      offsetY: 4,
      onRevealChange,
      onRevealComplete,
      onRevealStart,
      reveal: false
    }
    const { rerender } = render(
      <Avatar.Root
        data-testid="controlled-avatar"
        revealAnimationProps={revealAnimationProps}
        tabIndex={0}
      >
        <Avatar.Fallback>CR</Avatar.Fallback>
      </Avatar.Root>
    )

    const root = screen.getByTestId('controlled-avatar')
    const revealRoot = getRevealRoot(root)
    const overlay = getRevealOverlay(root)
    const copy = getRequiredElement(
      root.querySelector<HTMLElement>('[data-reveal-copy]'),
      'Expected the controlled reveal copy'
    )
    const copyScale = getRequiredElement(
      root.querySelector<HTMLElement>('[data-reveal-copy-scale]'),
      'Expected the controlled reveal copy scale'
    )
    const hiddenClipPath = overlay.style.clipPath

    fireEvent.pointerEnter(root)
    fireEvent.focus(root)

    expect(overlay.style.clipPath).toBe(hiddenClipPath)
    expect(onRevealChange).not.toHaveBeenCalled()
    expect(onRevealStart).not.toHaveBeenCalled()
    expect(revealRoot).toHaveAttribute('data-content-mode', 'phrasing')
    expect(copy.style.getPropertyValue('--reveal-offset-x')).toBe('-6px')
    expect(copy.style.getPropertyValue('--reveal-offset-y')).toBe('4px')
    expect(copyScale.style.getPropertyValue('--reveal-origin')).toBe('left bottom')
    expect(copyScale.style.transform).toBe('scale(1)')

    rerender(
      <Avatar.Root
        data-testid="controlled-avatar"
        revealAnimationProps={{ ...revealAnimationProps, reveal: true }}
        tabIndex={0}
      >
        <Avatar.Fallback>CR</Avatar.Fallback>
      </Avatar.Root>
    )

    await waitFor(() => {
      expect(onRevealChange).toHaveBeenCalledOnce()
      expect(onRevealChange).toHaveBeenCalledWith(true)
      expect(onRevealStart).toHaveBeenCalledOnce()
      expect(onRevealStart).toHaveBeenCalledWith(true)
    })
    expect(getRevealOverlay(root).style.clipPath).toBe('inset(0 0 0 0)')

    fireEvent.transitionEnd(getRevealOverlay(root), { propertyName: 'clip-path' })

    expect(onRevealComplete).toHaveBeenCalledOnce()
    expect(onRevealComplete).toHaveBeenCalledWith(true)
  })

  it('UC-010 / EX-001 / EX-004 - keeps one real square-cropped Image outside the reveal layer and preserves pointer bubbling', async () => {
    const onClick = vi.fn()

    render(
      <Avatar.Root data-testid="image-avatar" onClick={onClick}>
        <Avatar.Image alt="Ava King" src="/athletes/ava-king.jpg" />
        <Avatar.Fallback>AK</Avatar.Fallback>
      </Avatar.Root>
    )

    act(() => {
      const browserImage = getMockBrowserImage()

      browserImage.naturalWidth = 128
      browserImage.onload?.()
    })

    const root = screen.getByTestId('image-avatar')
    const image = await screen.findByRole('img', { name: 'Ava King' })
    const overlay = getRevealOverlay(root)
    const hiddenClipPath = overlay.style.clipPath

    expect(root.querySelectorAll('img')).toHaveLength(1)
    expect(image).toHaveClass('size-full', 'object-cover')
    expect(image).not.toHaveClass('invert', 'pointer-events-none', 'scale-110')
    expect(image.closest('[data-reveal-overlay]')).toBeNull()
    expect(getRevealOverlaySurface(root).querySelector('img')).not.toBeInTheDocument()

    fireEvent.pointerEnter(image)
    fireEvent.click(image)

    expect(overlay.style.clipPath).not.toBe(hiddenClipPath)
    expect(onClick).toHaveBeenCalledOnce()
  })

  it('UC-011 / EX-001 - keeps real-theme border and hard shadow on Root while revealing a border-transparent opposite-theme surface', () => {
    render(
      <Avatar.Root data-testid="chrome-avatar" revealAnimationProps={{ reveal: true }}>
        <Avatar.Fallback>CH</Avatar.Fallback>
      </Avatar.Root>
    )

    const root = screen.getByTestId('chrome-avatar')
    const overlay = getRevealOverlay(root)
    const overlaySurface = getRevealOverlaySurface(root)
    const shadowOwners = [root, ...Array.from(root.querySelectorAll<HTMLElement>('*'))].filter(
      (element) => element.classList.contains('shadow-(--hard-shadow)')
    )

    expect(root).toHaveClass(
      'border',
      'border-foreground',
      'bg-background',
      'text-foreground',
      'shadow-(--hard-shadow)'
    )
    expect(overlay).toHaveClass('dark')
    expect(overlay).toHaveAttribute('aria-hidden', 'true')
    expect(overlaySurface).toHaveClass(
      'border',
      'border-transparent',
      'bg-background',
      'text-foreground'
    )
    expect(overlaySurface).not.toHaveClass('border-foreground', 'shadow-(--hard-shadow)')
    expect(shadowOwners).toEqual([root])
  })

  it('UC-012 / UC-013 / UC-014 / EX-005 / SQ-004 - exposes inverse 150ms linear entry and exit opacity targets with zero reduced-motion duration', () => {
    let nextAnimationFrameId = 1
    const animationFrameCallbacks = new Map<number, FrameRequestCallback>()

    vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback): number => {
      const id = nextAnimationFrameId

      nextAnimationFrameId += 1
      animationFrameCallbacks.set(id, callback)

      return id
    })
    vi.stubGlobal('cancelAnimationFrame', (id: number) => {
      animationFrameCallbacks.delete(id)
    })

    render(
      <Avatar.Root>
        <Avatar.Image alt="Athlete entering" src="/athletes/image-entry.jpg" />
        <Avatar.Fallback>IE</Avatar.Fallback>
      </Avatar.Root>
    )

    act(() => {
      const browserImage = getMockBrowserImage()

      browserImage.naturalWidth = 128
      browserImage.onload?.()
    })

    const image = screen.getByRole('img', { name: 'Athlete entering' })

    expect(image).toHaveAttribute('data-starting-style')
    expect(animationFrameCallbacks.size).toBeGreaterThan(0)
    expect(image).toHaveClass(
      'opacity-100',
      'transition-opacity',
      'duration-150',
      'ease-linear',
      'data-starting-style:opacity-0',
      'data-ending-style:opacity-0',
      'motion-reduce:duration-0'
    )
  })

  it('UC-013 / EX-005 / QA-007 / SQ-004 - retains the same loaded Image and source while it fades above the newly eligible fallback', async () => {
    const { rerender } = render(
      <Avatar.Root data-testid="ending-avatar">
        <Avatar.Image alt="Athlete exiting" src="/athletes/image-exit.jpg" />
        <Avatar.Fallback data-testid="returning-fallback">EE</Avatar.Fallback>
      </Avatar.Root>
    )

    act(() => {
      const browserImage = getMockBrowserImage()

      browserImage.naturalWidth = 128
      browserImage.onload?.()
    })

    const image = await screen.findByRole('img', { name: 'Athlete exiting' })

    Object.defineProperty(HTMLElement.prototype, 'getAnimations', {
      configurable: true,
      value: () => [
        {
          finished: new Promise<void>(() => undefined),
          pending: false,
          playState: 'running'
        } as unknown as Animation
      ]
    })

    rerender(
      <Avatar.Root data-testid="ending-avatar">
        <Avatar.Image alt="Athlete exiting" src={undefined} />
        <Avatar.Fallback data-testid="returning-fallback">EE</Avatar.Fallback>
      </Avatar.Root>
    )

    await waitFor(() => expect(image).toHaveAttribute('data-ending-style'))
    expect(screen.getByRole('img', { name: 'Athlete exiting' })).toBe(image)
    expect(image).toHaveAttribute('src', '/athletes/image-exit.jpg')
    expect(screen.getByTestId('returning-fallback')).toBeVisible()
    expect(screen.getByTestId('ending-avatar').querySelectorAll('img')).toHaveLength(1)
    expect(image.closest('[data-reveal-overlay]')).toBeNull()
    expect(image).toHaveClass(
      'opacity-100',
      'transition-opacity',
      'duration-150',
      'ease-linear',
      'data-ending-style:opacity-0',
      'motion-reduce:duration-0'
    )
  })

  it('UC-013 / EX-005 / CR-008 / QA-008 / SQ-004 - preserves the one Base UI Fallback delay when Image exits before it elapses', () => {
    vi.useFakeTimers()

    const { rerender } = render(
      <Avatar.Root>
        <Avatar.Image
          alt="Athlete exiting before delayed fallback"
          src="/athletes/delayed-exit.jpg"
        />
        <Avatar.Fallback data-testid="delayed-returning-fallback" delay={600}>
          DF
        </Avatar.Fallback>
      </Avatar.Root>
    )

    act(() => {
      const browserImage = getMockBrowserImage()

      browserImage.naturalWidth = 128
      browserImage.onload?.()
    })

    const image = screen.getByRole('img', {
      name: 'Athlete exiting before delayed fallback'
    })

    Object.defineProperty(HTMLElement.prototype, 'getAnimations', {
      configurable: true,
      value: () => [
        {
          finished: new Promise<void>(() => undefined),
          pending: false,
          playState: 'running'
        } as unknown as Animation
      ]
    })

    rerender(
      <Avatar.Root>
        <Avatar.Image alt="Athlete exiting before delayed fallback" src={undefined} />
        <Avatar.Fallback data-testid="delayed-returning-fallback" delay={600}>
          DF
        </Avatar.Fallback>
      </Avatar.Root>
    )

    expect(image).toHaveAttribute('data-ending-style')
    expect(image).toHaveClass('data-ending-style:opacity-0')
    expect(screen.queryByTestId('delayed-returning-fallback')).not.toBeInTheDocument()

    act(() => vi.advanceTimersByTime(599))

    expect(screen.queryByTestId('delayed-returning-fallback')).not.toBeInTheDocument()

    act(() => vi.advanceTimersByTime(1))

    expect(screen.getByTestId('delayed-returning-fallback')).toBeVisible()
  })

  it('UC-018 / EX-005 / SQ-004 - reverses an interrupted exit on the same Image without restarting entry or reveal lifecycles', async () => {
    const onLoadingStatusChange = vi.fn<(status: ImageLoadingStatus) => void>()
    const onRevealChange = vi.fn()
    const onRevealComplete = vi.fn()
    const onRevealStart = vi.fn()

    render(
      <Avatar.Root
        data-testid="interrupted-exit-avatar"
        revealAnimationProps={{ onRevealChange, onRevealComplete, onRevealStart }}
      >
        <Avatar.Image
          alt="Athlete reversing exit"
          onLoadingStatusChange={onLoadingStatusChange}
          src="/athletes/interrupted-exit.jpg"
        />
        <Avatar.Fallback>IR</Avatar.Fallback>
      </Avatar.Root>
    )

    const browserImage = getMockBrowserImage()

    act(() => {
      browserImage.naturalWidth = 128
      browserImage.onload?.()
    })

    const image = await screen.findByRole('img', { name: 'Athlete reversing exit' })
    const reveal = getRevealRoot(screen.getByTestId('interrupted-exit-avatar'))

    await waitFor(() => expect(image).not.toHaveAttribute('data-starting-style'))

    Object.defineProperty(HTMLElement.prototype, 'getAnimations', {
      configurable: true,
      value: () => [
        {
          finished: new Promise<void>(() => undefined),
          pending: false,
          playState: 'running'
        } as unknown as Animation
      ]
    })

    act(() => browserImage.onerror?.())

    await waitFor(() => expect(image).toHaveAttribute('data-ending-style'))

    act(() => browserImage.onload?.())

    await waitFor(() => expect(image).not.toHaveAttribute('data-ending-style'))
    expect(screen.getByRole('img', { name: 'Athlete reversing exit' })).toBe(image)
    expect(image).not.toHaveAttribute('data-starting-style')
    expect(image).toHaveClass('opacity-100', 'transition-opacity', 'duration-150', 'ease-linear')
    expect(MockBrowserImage.instances).toHaveLength(1)
    expect(
      onLoadingStatusChange.mock.calls.filter(([status]) => status === 'loading')
    ).toHaveLength(1)
    expect(onRevealChange).not.toHaveBeenCalled()
    expect(onRevealStart).not.toHaveBeenCalled()
    expect(onRevealComplete).not.toHaveBeenCalled()
    expect(getRevealRoot(screen.getByTestId('interrupted-exit-avatar'))).toBe(reveal)
  })

  it('UC-015 / EX-006 / CR-006 - lets consumer classes and styles override conflicting real-part visual defaults, including corrected large geometry', async () => {
    render(
      <Avatar.Root
        className="size-24 border-accent bg-accent text-accent-foreground shadow-none"
        data-testid="custom-avatar"
        size="3xl"
        style={
          {
            '--hard-shadow': '0 0 0 transparent',
            backgroundColor: 'rebeccapurple'
          } as AvatarCssProperties
        }
      >
        <Avatar.Image
          alt="Athlete with custom treatment"
          className="object-contain"
          src="/athletes/custom.jpg"
          style={{ objectPosition: 'top' }}
        />
        <Avatar.Fallback
          className="p-4"
          data-testid="custom-fallback"
          headingProps={{ className: 'uppercase', tone: 'accent' }}
        >
          CT
        </Avatar.Fallback>
      </Avatar.Root>
    )

    const root = screen.getByTestId('custom-avatar')
    const overlaySurface = getRevealOverlaySurface(root)
    const fallback = screen.getByTestId('custom-fallback')

    expect(root).toHaveClass('border-accent', 'bg-accent', 'text-accent-foreground', 'shadow-none')
    expect(root).toHaveClass('size-24')
    expect(root).not.toHaveClass(
      'size-20',
      'size-40',
      'border-foreground',
      'bg-background',
      'text-foreground',
      'shadow-(--hard-shadow)'
    )
    expect(root).toHaveStyle({
      '--hard-shadow': '0 0 0 transparent',
      backgroundColor: 'rgb(102, 51, 153)'
    })
    expect(fallback).toHaveClass('p-4')
    expect(getRealText('CT')).toHaveClass('uppercase', 'text-accent-foreground')
    expect(overlaySurface).not.toHaveClass(
      'border-accent',
      'bg-accent',
      'text-accent-foreground',
      'shadow-none'
    )

    act(() => {
      const browserImage = getMockBrowserImage()

      browserImage.naturalWidth = 128
      browserImage.onload?.()
    })

    const image = await screen.findByRole('img', { name: 'Athlete with custom treatment' })

    expect(image).toHaveClass('object-contain')
    expect(image).not.toHaveClass('object-cover')
    expect(image).toHaveStyle({ objectPosition: 'top' })
  })

  it('UC-001 / UC-017 / CR-004 - forwards documented state through Root, Image, and Fallback render callbacks while preserving composed props and children', async () => {
    const rootRef = createRef<HTMLSpanElement>()
    const fallbackRef = createRef<HTMLSpanElement>()
    const imageRef = createRef<HTMLImageElement>()
    const rootRenderStates: BaseUiAvatar.Root.State[] = []
    const fallbackRenderStates: BaseUiAvatar.Fallback.State[] = []
    const imageRenderStates: BaseUiAvatar.Image.State[] = []

    render(
      <Avatar.Root
        className="function-root-class"
        data-root-prop="function-profile"
        data-testid="function-avatar"
        ref={rootRef}
        render={(props, state) => {
          rootRenderStates.push({ ...state })

          return <section {...props} data-avatar-function-root="profile" />
        }}
      >
        <Avatar.Image
          alt="Function-composed athlete"
          className="function-image-class"
          data-image-prop="portrait"
          ref={imageRef}
          render={(props, state) => {
            imageRenderStates.push({ ...state })

            return <img {...props} data-avatar-function-image="portrait" />
          }}
          src="/athletes/function-composed.jpg"
        />
        <Avatar.Fallback
          className="function-fallback-class"
          data-fallback-prop="initials"
          ref={fallbackRef}
          render={(props, state) => {
            fallbackRenderStates.push({ ...state })

            return <span {...props} data-avatar-function-fallback="initials" />
          }}
        >
          FC
        </Avatar.Fallback>
      </Avatar.Root>
    )

    const root = screen.getByTestId('function-avatar')
    const fallback = getRequiredElement(
      root.querySelector<HTMLElement>('[data-avatar-function-fallback="initials"]'),
      'Expected the function-composed Fallback to preserve its rendered element'
    )

    expect(root.tagName).toBe('SECTION')
    expect(root).toHaveAttribute('data-avatar-function-root', 'profile')
    expect(root).toHaveAttribute('data-root-prop', 'function-profile')
    expect(root).toHaveClass('function-root-class')
    expect(rootRef.current).toBe(root)
    expect(fallback).toHaveAttribute('data-fallback-prop', 'initials')
    expect(fallback).toHaveClass('function-fallback-class')
    expect(fallbackRef.current).toBe(fallback)
    expect(within(fallback).getByText('FC')).toBeVisible()
    expect(rootRenderStates).toEqual(
      expect.arrayContaining([{ imageLoadingStatus: 'idle' }, { imageLoadingStatus: 'loading' }])
    )
    expect(fallbackRenderStates).toEqual(
      expect.arrayContaining([{ imageLoadingStatus: 'idle' }, { imageLoadingStatus: 'loading' }])
    )

    act(() => {
      const browserImage = getMockBrowserImage()

      browserImage.naturalWidth = 128
      browserImage.onload?.()
    })

    const image = await screen.findByRole('img', { name: 'Function-composed athlete' })

    expect(image).toHaveAttribute('data-avatar-function-image', 'portrait')
    expect(image).toHaveAttribute('data-image-prop', 'portrait')
    expect(image).toHaveClass('function-image-class')
    expect(imageRef.current).toBe(image)
    expect(rootRenderStates).toContainEqual({ imageLoadingStatus: 'loaded' })
    expect(imageRenderStates).toContainEqual({
      imageLoadingStatus: 'loaded',
      transitionStatus: 'starting'
    })
  })

  it('UC-001 / UC-017 / EX-007 / SQ-001 - preserves supported render composition, including Root interaction handlers', async () => {
    const rootRef = createRef<HTMLSpanElement>()
    const renderRootRef = createRef<HTMLDivElement>()
    const fallbackRef = createRef<HTMLSpanElement>()
    const renderFallbackRef = createRef<HTMLSpanElement>()
    const imageRef = createRef<HTMLImageElement>()
    const renderImageRef = createRef<HTMLImageElement>()
    const onRootClick = vi.fn()
    const onRenderRootClick = vi.fn()
    const onRenderRootFocus = vi.fn()
    const onRenderRootPointerEnter = vi.fn()
    const onImageClick = vi.fn()

    render(
      <div>
        <Avatar.Root
          className="root-consumer-class"
          data-root-prop="fallback-profile"
          data-testid="composed-fallback-avatar"
          ref={rootRef}
          render={
            <div
              aria-label="Composed athlete avatar"
              className="root-render-class"
              data-avatar-frame="fallback-profile"
              onClick={onRenderRootClick}
              onFocus={onRenderRootFocus}
              onPointerEnter={onRenderRootPointerEnter}
              ref={renderRootRef}
              role="group"
              tabIndex={0}
            />
          }
        >
          <Avatar.Fallback
            className="fallback-consumer-class"
            data-fallback-prop="initials"
            ref={fallbackRef}
            render={
              <span
                className="fallback-render-class"
                data-avatar-fallback="initials"
                ref={renderFallbackRef}
              />
            }
          >
            CO
          </Avatar.Fallback>
        </Avatar.Root>

        <Avatar.Root
          data-root-prop="image-profile"
          data-testid="composed-image-avatar"
          onClick={onRootClick}
          render={<div data-avatar-frame="image-profile" />}
        >
          <Avatar.Image
            alt="Composed athlete"
            className="image-consumer-class"
            data-image-prop="portrait"
            onClick={onImageClick}
            ref={imageRef}
            render={
              <img
                className="image-render-class"
                data-avatar-image="portrait"
                ref={renderImageRef}
              />
            }
            src="/athletes/composed.jpg"
          />
          <Avatar.Fallback>CI</Avatar.Fallback>
        </Avatar.Root>
      </div>
    )

    const fallbackRoot = screen.getByTestId('composed-fallback-avatar')
    const fallback = screen
      .getByTestId('composed-fallback-avatar')
      .querySelector<HTMLElement>('[data-avatar-fallback="initials"]')

    expect(fallbackRoot.tagName).toBe('DIV')
    expect(fallbackRoot).toHaveAttribute('data-avatar-frame', 'fallback-profile')
    expect(fallbackRoot).toHaveAttribute('data-root-prop', 'fallback-profile')
    expect(fallbackRoot).toHaveAttribute('tabindex', '0')
    expect(fallbackRoot).toHaveClass('root-consumer-class', 'root-render-class')
    expect(rootRef.current).toBe(fallbackRoot)
    expect(renderRootRef.current).toBe(fallbackRoot)
    expect(fallback).toHaveAttribute('data-fallback-prop', 'initials')
    expect(fallback).toHaveClass('fallback-consumer-class', 'fallback-render-class')
    expect(fallbackRef.current).toBe(fallback)
    expect(renderFallbackRef.current).toBe(fallback)
    expect(fallbackRoot.querySelectorAll('[data-avatar-fallback="initials"]')).toHaveLength(1)
    expect(screen.getAllByText('CO')).toHaveLength(2)

    const fallbackOverlay = getRevealOverlay(fallbackRoot)
    const hiddenClipPath = fallbackOverlay.style.clipPath

    fireEvent.pointerEnter(fallbackRoot)

    expect(fallbackOverlay.style.clipPath).not.toBe(hiddenClipPath)
    expect(onRenderRootPointerEnter).toHaveBeenCalledOnce()

    fireEvent.pointerLeave(fallbackRoot)

    expect(fallbackOverlay.style.clipPath).toBe(hiddenClipPath)

    fireEvent.focus(fallbackRoot)

    expect(fallbackOverlay.style.clipPath).not.toBe(hiddenClipPath)
    expect(onRenderRootFocus).toHaveBeenCalledOnce()

    fireEvent.blur(fallbackRoot)

    expect(fallbackOverlay.style.clipPath).toBe(hiddenClipPath)

    fireEvent.click(fallbackRoot)

    expect(onRenderRootClick).toHaveBeenCalledOnce()

    act(() => {
      const browserImage = getMockBrowserImage()

      browserImage.naturalWidth = 128
      browserImage.onload?.()
    })

    const imageRoot = screen.getByTestId('composed-image-avatar')
    const image = await screen.findByRole('img', { name: 'Composed athlete' })

    fireEvent.click(image)

    expect(imageRoot.tagName).toBe('DIV')
    expect(imageRoot).toHaveAttribute('data-avatar-frame', 'image-profile')
    expect(imageRoot).toHaveAttribute('data-root-prop', 'image-profile')
    expect(image).toHaveAttribute('data-avatar-image', 'portrait')
    expect(image).toHaveAttribute('data-image-prop', 'portrait')
    expect(image).toHaveClass('image-consumer-class', 'image-render-class')
    expect(imageRef.current).toBe(image)
    expect(renderImageRef.current).toBe(image)
    expect(within(imageRoot).getAllByRole('img')).toHaveLength(1)
    expect(getRevealOverlaySurface(imageRoot).querySelector('img')).not.toBeInTheDocument()
    expect(onImageClick).toHaveBeenCalledOnce()
    expect(onRootClick).toHaveBeenCalledOnce()
  })

  it('UC-007 / EX-004 / QA-003 / SQ-001 - makes uncontrolled Root focus reveal inspectable in Storybook', () => {
    const Story = Ex004DefaultDisabledAndControlledReveal.render

    expect(Story).toBeTypeOf('function')

    if (!Story) {
      throw new Error('Expected EX-004 to provide an inspectable render function')
    }

    render(<Story />)

    const focusTarget = screen.getByLabelText('Uncontrolled Avatar focus target')
    const revealRoot = getRequiredElement(
      focusTarget.closest<HTMLElement>('[data-reveal-root]'),
      'Expected the Storybook focus target inside the uncontrolled reveal'
    )
    const overlay = getRequiredElement(
      revealRoot.querySelector<HTMLElement>('[data-reveal-overlay]'),
      'Expected the Storybook uncontrolled reveal overlay'
    )
    const hiddenClipPath = overlay.style.clipPath

    expect(focusTarget).toHaveAttribute('tabindex', '0')
    expect(screen.getByText('uncontrolled reveal: false')).toBeVisible()

    fireEvent.focus(focusTarget)

    expect(screen.getByText('uncontrolled reveal: true')).toBeVisible()
    expect(overlay.style.clipPath).not.toBe(hiddenClipPath)

    fireEvent.blur(focusTarget)

    expect(screen.getByText('uncontrolled reveal: false')).toBeVisible()
    expect(overlay.style.clipPath).toBe(hiddenClipPath)
  })

  it('UC-009 / EX-004 / QA-004 - exposes rendered controls and visible probes for controlled reveal positioning in Storybook', async () => {
    const Story = Ex004DefaultDisabledAndControlledReveal.render

    expect(Story).toBeTypeOf('function')

    if (!Story) {
      throw new Error('Expected EX-004 to provide an inspectable render function')
    }

    render(<Story />)

    const direction = screen.getByRole('combobox', { name: 'Reveal direction' })
    const alignX = screen.getByRole('combobox', { name: 'Horizontal alignment' })
    const alignY = screen.getByRole('combobox', { name: 'Vertical alignment' })
    const offsetX = screen.getByRole('spinbutton', { name: 'Horizontal offset' })
    const offsetY = screen.getByRole('spinbutton', { name: 'Vertical offset' })

    fireEvent.change(direction, { target: { value: 'top-to-bottom' } })
    fireEvent.change(alignX, { target: { value: 'start' } })
    fireEvent.change(alignY, { target: { value: 'end' } })
    fireEvent.change(offsetX, { target: { value: '-6' } })
    fireEvent.change(offsetY, { target: { value: '4' } })

    expect(direction).toHaveValue('top-to-bottom')
    expect(alignX).toHaveValue('start')
    expect(alignY).toHaveValue('end')
    expect(offsetX).toHaveValue(-6)
    expect(offsetY).toHaveValue(4)
    expect(screen.getByText('direction: top-to-bottom')).toBeVisible()
    expect(screen.getByText('alignment: start / end')).toBeVisible()
    expect(screen.getByText('offset: -6px / 4px')).toBeVisible()

    fireEvent.click(screen.getByRole('button', { name: 'toggle reveal' }))

    await waitFor(() => {
      expect(screen.getByText('reveal: true, phase: transitioning')).toBeVisible()
    })
  })

  it('UC-013 / UC-018 / EX-005 / CR-008 / CR-010 / QA-005 / QA-007 / QA-008 / SQ-004 - keeps the departing source and continuously samples delayed exit evidence in Storybook', async () => {
    vi.useFakeTimers()

    const Story = Ex005ImageEntryTransition.render
    const getComputedStyle = window.getComputedStyle.bind(window)
    let measuredImageOpacity = '1'

    vi.spyOn(window, 'getComputedStyle').mockImplementation((element, pseudoElement) => {
      const computedStyle = getComputedStyle(element, pseudoElement)

      if (!(element instanceof HTMLImageElement)) {
        return computedStyle
      }

      return new Proxy(computedStyle, {
        get(target, property, receiver) {
          return property === 'opacity'
            ? measuredImageOpacity
            : Reflect.get(target, property, receiver)
        }
      })
    })

    expect(Story).toBeTypeOf('function')

    if (!Story) {
      throw new Error('Expected EX-005 to provide an inspectable render function')
    }

    render(<Story />)

    act(() => {
      const browserImage = getMockBrowserImage()

      browserImage.naturalWidth = 128
      browserImage.onload?.()
    })

    const image = screen.getByRole('img', { name: 'Athlete entering or leaving' })
    const loadedSource = image.getAttribute('src')
    const revealRoot = getRequiredElement(
      image.closest<HTMLElement>('[data-reveal-root]'),
      'Expected the EX-005 Image inside one persistent reveal'
    )

    Object.defineProperty(HTMLElement.prototype, 'getAnimations', {
      configurable: true,
      value: () => [
        {
          finished: new Promise<void>(() => undefined),
          pending: false,
          playState: 'running'
        } as unknown as Animation
      ]
    })

    expect(screen.getByRole('button', { name: 'restore image' })).toBeVisible()

    act(() => vi.advanceTimersByTime(625))

    fireEvent.click(screen.getByRole('button', { name: 'remove image' }))

    await act(async () => Promise.resolve())

    expect(image).toHaveAttribute('data-ending-style')
    expect(image).toBeInTheDocument()
    expect(loadedSource).not.toBeNull()
    expect(image).toHaveAttribute('src', loadedSource)
    expect(image.closest('[data-reveal-root]')).toBe(revealRoot)
    expect(screen.queryByText('IE')).not.toBeInTheDocument()
    expect(screen.getByText(/image transition: ending/)).toBeVisible()
    expect(screen.getByText(/fallback delay: pending/)).toBeVisible()

    measuredImageOpacity = '0.5'
    act(() => vi.advanceTimersByTime(16))

    await act(async () => Promise.resolve())

    expect(screen.getByText('image opacity: 0.5')).toBeVisible()
  })

  it('UC-007 / UC-017 / EX-007 / QA-006 / QA-009 / SQ-001 - exposes custom Root reveal, consumer event callbacks, and Image render evidence in Storybook', async () => {
    const Story = Ex007SupportedRenderComposition.render

    expect(Story).toBeTypeOf('function')

    if (!Story) {
      throw new Error('Expected EX-007 to provide an inspectable render function')
    }

    render(<Story />)

    const root = screen.getByRole('group', { name: 'Composed athlete avatar' })
    const overlay = getRevealOverlay(root)
    const hiddenClipPath = overlay.style.clipPath

    expect(root).toHaveAttribute('tabindex', '0')
    expect(screen.getByText('consumer pointer enters: 0')).toBeVisible()
    expect(screen.getByText('consumer focuses: 0')).toBeVisible()

    fireEvent.pointerEnter(root)

    expect(overlay.style.clipPath).not.toBe(hiddenClipPath)
    expect(screen.getByText('consumer pointer enters: 1')).toBeVisible()

    fireEvent.pointerLeave(root)

    expect(overlay.style.clipPath).toBe(hiddenClipPath)

    fireEvent.focus(root)

    expect(overlay.style.clipPath).not.toBe(hiddenClipPath)
    expect(screen.getByText('consumer focuses: 1')).toBeVisible()

    fireEvent.blur(root)

    expect(overlay.style.clipPath).toBe(hiddenClipPath)

    act(() => {
      const browserImage = getMockBrowserImage()

      browserImage.naturalWidth = 128
      browserImage.onload?.()
    })

    const image = await screen.findByRole('img', { name: 'Composed athlete' })

    fireEvent.click(image)

    expect(image).toHaveAttribute('data-avatar-image', 'portrait')
    expect(image).toHaveAttribute('data-image-prop', 'portrait')
    expect(image).toHaveAttribute('data-image-loading-status', 'loaded')
    expect(['starting', 'none']).toContain(image.getAttribute('data-image-transition-status'))
    expect(screen.getByText('img[data-avatar-image=portrait] ref attached')).toBeVisible()
    expect(screen.getByText(/render state: loaded \/ (starting|none)/)).toBeVisible()
    expect(screen.getByText('loading callback: loaded')).toBeVisible()
    expect(screen.getByText('native clicks: 1')).toBeVisible()
  })
})
