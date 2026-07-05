import { mergeProps } from '@base-ui/react/merge-props'
import {
  cloneElement,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ComponentProps,
  type CSSProperties,
  type ReactElement,
  type ReactNode,
  type TransitionEvent
} from 'react'

import {
  REVEAL_ANIMATION_HIDDEN_CLIP_PATHS,
  REVEAL_ANIMATION_OPPOSITE_HIDDEN_CLIP_PATHS,
  REVEAL_ANIMATION_ORIGIN_X,
  REVEAL_ANIMATION_ORIGIN_Y,
  REVEAL_ANIMATION_REVEALED_CLIP_PATHS
} from './constants/revealAnimationConstants'

export type RevealAnimationDirection =
  | 'left-to-right'
  | 'right-to-left'
  | 'top-to-bottom'
  | 'bottom-to-top'
  | 'diagonal-45-to-135'

export type RevealAnimationAlignment = 'start' | 'center' | 'end'

export type RevealAnimationContentMode = 'flow' | 'phrasing'

export type RevealAnimationUnrevealBehavior = 'return' | 'continue'

export interface RevealAnimationProps {
  alignX?: RevealAnimationAlignment
  alignY?: RevealAnimationAlignment
  children?: ReactNode
  contentMode?: RevealAnimationContentMode
  direction?: RevealAnimationDirection
  offsetX?: number
  offsetY?: number
  onRevealChange?: (revealed: boolean) => void
  onRevealComplete?: (revealed: boolean) => void
  onRevealStart?: (revealed: boolean) => void
  render: ReactElement
  reveal?: boolean
  scale?: number
  unrevealBehavior?: RevealAnimationUnrevealBehavior
}

export function RevealAnimation({
  alignX = 'center',
  alignY = 'center',
  children,
  contentMode = 'flow',
  direction = 'diagonal-45-to-135',
  offsetX = 0,
  offsetY = 0,
  onRevealChange,
  onRevealComplete,
  onRevealStart,
  render,
  reveal,
  scale = 1.2,
  unrevealBehavior = 'return'
}: RevealAnimationProps): ReactElement {
  const [activeUnrevealBehavior, setActiveUnrevealBehavior] =
    useState<RevealAnimationUnrevealBehavior>()
  const [focused, setFocused] = useState(false)
  const [hovered, setHovered] = useState(false)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(
    () =>
      typeof window !== 'undefined' &&
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
  const [overlayThemeClassName, setOverlayThemeClassName] = useState<'dark' | 'light'>(() =>
    document.body.classList.contains('dark') ? 'light' : 'dark'
  )
  const [transitionSuppressed, setTransitionSuppressed] = useState(false)
  const isControlled = reveal !== undefined
  const revealed = isControlled ? reveal : hovered || focused
  const isPhrasingContent = contentMode === 'phrasing'
  const RootElement = isPhrasingContent ? 'span' : 'div'
  const SurfaceElement = isPhrasingContent ? 'span' : 'div'
  const OverlayElement = isPhrasingContent ? 'span' : 'div'
  const overlayThemeClassNameRef = useRef(overlayThemeClassName)
  const completelyRevealed = useRef(revealed)
  const overlayRef = useRef<HTMLDivElement>(null)
  const pointerFocusPending = useRef(false)
  const previousDirection = useRef(direction)
  const previousRevealed = useRef(revealed)
  const resumableUnrevealBehavior = useRef<RevealAnimationUnrevealBehavior | undefined>(undefined)
  const startedTarget = useRef<boolean | undefined>(undefined)
  const directionChanged = previousDirection.current !== direction
  const targetChanged = !directionChanged && previousRevealed.current !== revealed
  const renderedActiveUnrevealBehavior = directionChanged
    ? undefined
    : targetChanged
      ? revealed
        ? resumableUnrevealBehavior.current
        : (resumableUnrevealBehavior.current ??
          (completelyRevealed.current ? unrevealBehavior : 'return'))
      : activeUnrevealBehavior
  const hiddenClipPath = REVEAL_ANIMATION_HIDDEN_CLIP_PATHS[direction]
  const oppositeHiddenClipPath = REVEAL_ANIMATION_OPPOSITE_HIDDEN_CLIP_PATHS[direction]
  const revealedClipPath = REVEAL_ANIMATION_REVEALED_CLIP_PATHS[direction]
  const contentOrigin = `${REVEAL_ANIMATION_ORIGIN_X[alignX]} ${REVEAL_ANIMATION_ORIGIN_Y[alignY]}`
  const renderProps = render.props as ComponentProps<'div'>
  const realSurfaceProps = mergeProps<'div'>(
    renderProps,
    {
      onBlur: () => {
        pointerFocusPending.current = false
        setFocused(false)
      },
      onFocus: (event) => {
        const isPointerFocus = pointerFocusPending.current

        pointerFocusPending.current = false

        if (document.activeElement !== event.currentTarget) {
          event.currentTarget.focus()
        }

        setFocused(!isPointerFocus)
      },
      onMouseEnter: () => {
        setHovered(true)
      },
      onMouseLeave: () => {
        setHovered(false)
      },
      onPointerDown: () => {
        pointerFocusPending.current = true
        setFocused(false)
      }
    },
    {
      'data-reveal-source': ''
    } as ComponentProps<'div'>
  )
  const overlaySurfaceProps = mergeProps<'div'>(renderProps, {
    'data-reveal-overlay-surface': '',
    tabIndex: -1
  } as ComponentProps<'div'>)
  const overlayStyle = {
    clipPath: revealed
      ? revealedClipPath
      : renderedActiveUnrevealBehavior === 'continue'
        ? oppositeHiddenClipPath
        : hiddenClipPath,
    pointerEvents: 'none',
    transitionDuration:
      prefersReducedMotion || directionChanged || (!targetChanged && transitionSuppressed)
        ? '0ms'
        : '300ms',
    transitionProperty: 'clip-path',
    transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)'
  } as const satisfies CSSProperties

  useLayoutEffect(() => {
    if (previousDirection.current !== direction) {
      previousDirection.current = direction
      previousRevealed.current = revealed
      completelyRevealed.current = revealed
      resumableUnrevealBehavior.current = undefined
      startedTarget.current = undefined
      setActiveUnrevealBehavior(undefined)
      setTransitionSuppressed(true)
      return
    }

    if (previousRevealed.current === revealed) {
      if (prefersReducedMotion && startedTarget.current === revealed) {
        completelyRevealed.current = revealed
        resumableUnrevealBehavior.current = undefined
        startedTarget.current = undefined
        setActiveUnrevealBehavior(undefined)
        setTransitionSuppressed(true)
        onRevealComplete?.(revealed)
      }

      return
    }

    previousRevealed.current = revealed
    onRevealChange?.(revealed)
    onRevealStart?.(revealed)

    if (revealed) {
      setActiveUnrevealBehavior(resumableUnrevealBehavior.current)

      if (prefersReducedMotion) {
        completelyRevealed.current = true
        resumableUnrevealBehavior.current = undefined
        startedTarget.current = undefined
        setActiveUnrevealBehavior(undefined)
        setTransitionSuppressed(true)
        onRevealComplete?.(true)
        return
      }

      completelyRevealed.current = false
      startedTarget.current = true
      setTransitionSuppressed(false)
      return
    }

    const nextActiveUnrevealBehavior =
      resumableUnrevealBehavior.current ??
      (completelyRevealed.current ? unrevealBehavior : 'return')

    if (resumableUnrevealBehavior.current === undefined && completelyRevealed.current) {
      resumableUnrevealBehavior.current = nextActiveUnrevealBehavior
    }

    completelyRevealed.current = false

    if (prefersReducedMotion) {
      resumableUnrevealBehavior.current = undefined
      startedTarget.current = undefined
      setActiveUnrevealBehavior(undefined)
      setTransitionSuppressed(true)
      onRevealComplete?.(false)
      return
    }

    startedTarget.current = false
    setActiveUnrevealBehavior(nextActiveUnrevealBehavior)
    setTransitionSuppressed(false)
  }, [
    direction,
    onRevealChange,
    onRevealComplete,
    onRevealStart,
    prefersReducedMotion,
    revealed,
    unrevealBehavior
  ])

  useEffect(() => {
    if (typeof window.matchMedia !== 'function') {
      return
    }

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const syncReducedMotion = () => setPrefersReducedMotion(mediaQuery.matches)

    syncReducedMotion()
    mediaQuery.addEventListener('change', syncReducedMotion)

    return () => mediaQuery.removeEventListener('change', syncReducedMotion)
  }, [])

  useLayoutEffect(() => {
    const overlay = overlayRef.current

    if (direction !== 'diagonal-45-to-135' || overlay === null) {
      return
    }

    const syncOverlayHeight = (entry?: ResizeObserverEntry) => {
      const borderBoxHeight = entry?.borderBoxSize[0]?.blockSize
      const height = borderBoxHeight ?? overlay.offsetHeight

      overlay.style.setProperty('--reveal-height', `${height}px`)
    }

    syncOverlayHeight()

    if (typeof ResizeObserver === 'undefined') {
      return
    }

    const observer = new ResizeObserver((entries) => syncOverlayHeight(entries[0]))

    observer.observe(overlay)

    return () => observer.disconnect()
  }, [direction])

  useLayoutEffect(() => {
    const overlay = overlayRef.current as HTMLElement
    const root = overlay.parentElement as HTMLElement
    const realSurface = root.querySelector<HTMLElement>('[data-reveal-source]') as HTMLElement
    const syncOverlayThemeClassName = () => {
      const activeTheme = realSurface.closest<HTMLElement>('.dark, .light')
      const nextOverlayThemeClassName = activeTheme?.classList.contains('dark') ? 'light' : 'dark'

      if (overlayThemeClassNameRef.current === nextOverlayThemeClassName) {
        return
      }

      overlayThemeClassNameRef.current = nextOverlayThemeClassName
      setOverlayThemeClassName(nextOverlayThemeClassName)
    }
    const observer = new MutationObserver(syncOverlayThemeClassName)
    let themeAncestor: HTMLElement | null = realSurface

    syncOverlayThemeClassName()

    while (themeAncestor !== null) {
      observer.observe(themeAncestor, { attributeFilter: ['class'], attributes: true })
      themeAncestor = themeAncestor.parentElement
    }

    return () => observer.disconnect()
  }, [])

  return (
    <RootElement
      className={
        isPhrasingContent
          ? 'relative isolate inline-grid align-baseline'
          : 'relative isolate inline-grid align-middle'
      }
      data-content-mode={contentMode}
      data-motion="reveal"
      data-active-unreveal-behavior={renderedActiveUnrevealBehavior}
      data-reveal-root=""
      data-unreveal-behavior={unrevealBehavior}
    >
      <SurfaceElement className="col-start-1 row-start-1 inline-flex" data-reveal-surface="">
        {cloneElement(render, realSurfaceProps, children)}
      </SurfaceElement>
      <OverlayElement
        aria-hidden="true"
        className={
          mergeProps<'div'>(
            {
              className: `pointer-events-none absolute inset-0 z-10 overflow-hidden [&_*]:pointer-events-none`
            },
            {
              className: overlayThemeClassName
            }
          ).className
        }
        data-reveal-overlay=""
        inert
        key={direction}
        onTransitionEnd={(event: TransitionEvent<HTMLElement>) => {
          if (event.target !== event.currentTarget || event.propertyName !== 'clip-path') {
            return
          }

          if (startedTarget.current === revealed) {
            startedTarget.current = undefined
            onRevealComplete?.(revealed)

            if (revealed) {
              completelyRevealed.current = true
              resumableUnrevealBehavior.current = undefined
              setActiveUnrevealBehavior(undefined)
              return
            }

            resumableUnrevealBehavior.current = undefined
            setActiveUnrevealBehavior(undefined)

            if (renderedActiveUnrevealBehavior === 'continue') {
              setTransitionSuppressed(true)
            }
          }
        }}
        ref={overlayRef}
        style={overlayStyle}
      >
        {cloneElement(
          render,
          overlaySurfaceProps,
          <span
            data-reveal-copy=""
            style={
              {
                '--reveal-offset-x': `${offsetX}px`,
                '--reveal-offset-y': `${offsetY}px`,
                transform: 'translate(var(--reveal-offset-x), var(--reveal-offset-y))'
              } as CSSProperties
            }
          >
            <span
              data-reveal-copy-scale=""
              style={
                {
                  '--reveal-origin': contentOrigin,
                  display: 'inline-flex',
                  transform: `scale(${scale})`,
                  transformOrigin: 'var(--reveal-origin)'
                } as CSSProperties
              }
            >
              {children}
            </span>
          </span>
        )}
      </OverlayElement>
    </RootElement>
  )
}
