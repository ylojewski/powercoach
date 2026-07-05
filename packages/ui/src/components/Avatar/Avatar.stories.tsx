import { type Meta, type StoryObj } from '@storybook/react-vite'
import { type TransitionEvent, useCallback, useRef, useState } from 'react'

import {
  Avatar,
  Button,
  type AvatarSize,
  type ImageLoadingStatus,
  type RevealAnimationAlignment,
  type RevealAnimationDirection
} from '../..'

const ATHLETE_IMAGE_SRC =
  'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 128 128%22%3E%3Crect width=%22128%22 height=%22128%22 fill=%22%23f97316%22/%3E%3Cpath d=%22M24 128c3-27 18-42 40-42s37 15 40 42%22 fill=%22%23171717%22/%3E%3Ccircle cx=%2264%22 cy=%2252%22 r=%2228%22 fill=%22%23ffedd5%22/%3E%3C/svg%3E'
const AVATAR_SIZES = [
  'xs',
  'sm',
  'md',
  'lg',
  'xl',
  '2xl',
  '3xl'
] as const satisfies readonly AvatarSize[]
const REVEAL_ALIGNMENT_NAMES = [
  'start',
  'center',
  'end'
] as const satisfies readonly RevealAnimationAlignment[]
const REVEAL_DIRECTION_NAMES = [
  'left-to-right',
  'right-to-left',
  'top-to-bottom',
  'bottom-to-top',
  'diagonal-45-to-135'
] as const satisfies readonly RevealAnimationDirection[]

const meta = {
  args: {
    revealAnimationProps: true,
    size: 'md'
  },
  argTypes: {
    children: {
      control: false
    },
    className: {
      control: 'text'
    },
    render: {
      control: false
    },
    revealAnimationProps: {
      control: 'boolean'
    },
    size: {
      control: 'select',
      options: AVATAR_SIZES
    }
  },
  component: Avatar.Root,
  title: 'Components/Avatar'
} satisfies Meta<typeof Avatar.Root>

export default meta

type Story = StoryObj<typeof meta>

export const Ex001DefaultImageAvatar = {
  name: 'EX-001 - Default Image Avatar',
  render: (args) => (
    <Avatar.Root {...args}>
      <Avatar.Image alt="Ava King" src={ATHLETE_IMAGE_SRC} />
      <Avatar.Fallback>AK</Avatar.Fallback>
    </Avatar.Root>
  )
} satisfies Story

export const Ex002ImmediateDelayedAndFailedFallbacks = {
  name: 'EX-002 - Immediate, Delayed, And Failed Fallbacks',
  render: (args) => {
    const [status, setStatus] = useState<ImageLoadingStatus>('idle')

    return (
      <div className="grid gap-3 text-foreground">
        <div className="flex items-center gap-4">
          <Avatar.Root {...args}>
            <Avatar.Image alt="" onLoadingStatusChange={setStatus} src="/athletes/missing.jpg" />
            <Avatar.Fallback headingProps={{ tone: 'muted' }}>YA</Avatar.Fallback>
          </Avatar.Root>

          <Avatar.Root {...args}>
            <Avatar.Image alt="Slow-loading athlete" src="/athletes/slow.jpg" />
            <Avatar.Fallback delay={600}>SA</Avatar.Fallback>
          </Avatar.Root>
        </div>

        <output aria-live="polite" className="border border-foreground/30 p-2 font-sans text-xs">
          image status: {status}
        </output>
      </div>
    )
  }
} satisfies Story

export const Ex003CompleteSizeScale = {
  name: 'EX-003 - Complete Size Scale',
  render: () => (
    <div className="flex flex-wrap items-end gap-4 text-foreground">
      {AVATAR_SIZES.map((size) => (
        <div className="grid justify-items-center gap-2" key={size}>
          <Avatar.Root size={size}>
            <Avatar.Fallback>{size}</Avatar.Fallback>
          </Avatar.Root>
          <span className="font-sans text-xs text-muted-foreground">{size}</span>
        </div>
      ))}
    </div>
  )
} satisfies Story

export const Ex004DefaultDisabledAndControlledReveal = {
  name: 'EX-004 - Default, Disabled, And Controlled Reveal',
  render: () => {
    const [alignX, setAlignX] = useState<RevealAnimationAlignment>('center')
    const [alignY, setAlignY] = useState<RevealAnimationAlignment>('center')
    const [direction, setDirection] = useState<RevealAnimationDirection>('diagonal-45-to-135')
    const [offsetX, setOffsetX] = useState(0)
    const [offsetY, setOffsetY] = useState(0)
    const [phase, setPhase] = useState('idle')
    const [revealed, setRevealed] = useState(false)
    const [uncontrolledRevealed, setUncontrolledRevealed] = useState(false)

    return (
      <div className="grid gap-3 text-foreground">
        <div className="flex items-center gap-4">
          <Avatar.Root>
            <Avatar.Fallback
              aria-label="Uncontrolled Avatar focus target"
              onBlur={() => setUncontrolledRevealed(false)}
              onFocus={() => setUncontrolledRevealed(true)}
              tabIndex={0}
            >
              AR
            </Avatar.Fallback>
          </Avatar.Root>

          <Avatar.Root revealAnimationProps={false}>
            <Avatar.Fallback>ST</Avatar.Fallback>
          </Avatar.Root>

          <Avatar.Root
            revealAnimationProps={{
              alignX,
              alignY,
              direction,
              offsetX,
              offsetY,
              onRevealChange: setRevealed,
              onRevealComplete: () => setPhase('complete'),
              onRevealStart: () => setPhase('transitioning'),
              reveal: revealed
            }}
          >
            <Avatar.Image alt="Controlled athlete" src={ATHLETE_IMAGE_SRC} />
            <Avatar.Fallback>CA</Avatar.Fallback>
          </Avatar.Root>

          <Button type="button" onClick={() => setRevealed((value) => !value)}>
            toggle reveal
          </Button>
        </div>

        <div className="grid gap-2 border border-foreground/30 p-2 font-sans text-xs sm:grid-cols-5">
          <label className="grid gap-1">
            reveal direction
            <select
              aria-label="Reveal direction"
              value={direction}
              onChange={(event) =>
                setDirection(event.currentTarget.value as RevealAnimationDirection)
              }
            >
              {REVEAL_DIRECTION_NAMES.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </label>
          <label className="grid gap-1">
            horizontal alignment
            <select
              aria-label="Horizontal alignment"
              value={alignX}
              onChange={(event) => setAlignX(event.currentTarget.value as RevealAnimationAlignment)}
            >
              {REVEAL_ALIGNMENT_NAMES.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </label>
          <label className="grid gap-1">
            vertical alignment
            <select
              aria-label="Vertical alignment"
              value={alignY}
              onChange={(event) => setAlignY(event.currentTarget.value as RevealAnimationAlignment)}
            >
              {REVEAL_ALIGNMENT_NAMES.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </label>
          <label className="grid gap-1">
            horizontal offset
            <input
              aria-label="Horizontal offset"
              type="number"
              value={offsetX}
              onChange={(event) => setOffsetX(Number(event.currentTarget.value))}
            />
          </label>
          <label className="grid gap-1">
            vertical offset
            <input
              aria-label="Vertical offset"
              type="number"
              value={offsetY}
              onChange={(event) => setOffsetY(Number(event.currentTarget.value))}
            />
          </label>
        </div>

        <output
          aria-live="polite"
          className="grid gap-1 border border-foreground/30 p-2 font-sans text-xs"
        >
          <span>uncontrolled reveal: {String(uncontrolledRevealed)}</span>
          <span>
            reveal: {String(revealed)}, phase: {phase}
          </span>
          <span>direction: {direction}</span>
          <span>
            alignment: {alignX} / {alignY}
          </span>
          <span>
            offset: {offsetX}px / {offsetY}px
          </span>
        </output>
      </div>
    )
  }
} satisfies Story

export const Ex005ImageEntryTransition = {
  name: 'EX-005 - Image Entry And Exit Transitions',
  render: () => {
    const [fallbackDelay, setFallbackDelay] = useState('waiting for image exit')
    const [imageOpacity, setImageOpacity] = useState('not mounted')
    const [imageSource, setImageSource] = useState<string | undefined>(ATHLETE_IMAGE_SRC)
    const [imageTransition, setImageTransition] = useState('not mounted')
    const [status, setStatus] = useState<ImageLoadingStatus>('idle')
    const imageSamplingFrame = useRef<number | null>(null)
    const syncImageEvidence = useCallback((element: HTMLImageElement) => {
      setImageTransition(
        element.hasAttribute('data-ending-style')
          ? 'ending'
          : element.hasAttribute('data-starting-style')
            ? 'starting'
            : 'none'
      )
      setImageOpacity(
        window.getComputedStyle(element).opacity ||
          (element.classList.contains('opacity-100') ? '1' : 'unknown')
      )
    }, [])
    const stopImageSampling = useCallback(() => {
      if (imageSamplingFrame.current !== null) {
        window.cancelAnimationFrame(imageSamplingFrame.current)
        imageSamplingFrame.current = null
      }
    }, [])
    const startImageSampling = useCallback(
      (element: HTMLImageElement) => {
        stopImageSampling()

        const sample = () => {
          syncImageEvidence(element)

          const transitionIsActive =
            element.hasAttribute('data-ending-style') ||
            element.hasAttribute('data-starting-style') ||
            element
              .getAnimations()
              .some((animation) => animation.pending || animation.playState === 'running')

          imageSamplingFrame.current = transitionIsActive
            ? window.requestAnimationFrame(sample)
            : null
        }

        imageSamplingFrame.current = window.requestAnimationFrame(sample)
      },
      [stopImageSampling, syncImageEvidence]
    )
    const setImageRef = useCallback(
      (element: HTMLImageElement | null) => {
        if (element === null) {
          return
        }

        syncImageEvidence(element)

        const observer = new MutationObserver(() => {
          syncImageEvidence(element)

          if (
            element.hasAttribute('data-ending-style') ||
            element.hasAttribute('data-starting-style')
          ) {
            startImageSampling(element)
          }
        })

        observer.observe(element, {
          attributeFilter: ['class', 'data-ending-style', 'data-starting-style', 'style'],
          attributes: true
        })

        return () => {
          observer.disconnect()
          stopImageSampling()
        }
      },
      [startImageSampling, stopImageSampling, syncImageEvidence]
    )
    const syncImageTransitionEvidence = useCallback(
      (event: TransitionEvent<HTMLImageElement>) => {
        syncImageEvidence(event.currentTarget)

        if (event.type === 'transitionrun') {
          startImageSampling(event.currentTarget)
        } else {
          stopImageSampling()
        }
      },
      [startImageSampling, stopImageSampling, syncImageEvidence]
    )
    const setFallbackRef = useCallback((element: HTMLSpanElement | null) => {
      if (element !== null) {
        setFallbackDelay('visible')
      }
    }, [])

    return (
      <div className="grid justify-items-start gap-3 text-foreground">
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            onClick={() => {
              setFallbackDelay('pending')
              setImageSource(undefined)
            }}
          >
            remove image
          </Button>
          <Button
            type="button"
            onClick={() => {
              setFallbackDelay('waiting for image exit')
              setImageSource(ATHLETE_IMAGE_SRC)
            }}
          >
            restore image
          </Button>
        </div>

        <Avatar.Root>
          <Avatar.Image
            ref={setImageRef}
            alt="Athlete entering or leaving"
            onLoadingStatusChange={setStatus}
            onTransitionCancel={syncImageTransitionEvidence}
            onTransitionEnd={syncImageTransitionEvidence}
            onTransitionRun={syncImageTransitionEvidence}
            src={imageSource}
          />
          {imageSource === undefined ? (
            <Avatar.Fallback ref={setFallbackRef} delay={600}>
              IE
            </Avatar.Fallback>
          ) : null}
        </Avatar.Root>

        <output
          aria-live="polite"
          className="grid gap-1 border border-foreground/30 p-2 font-sans text-xs"
        >
          <span>image status: {status}</span>
          <span>image transition: {imageTransition}</span>
          <span>image opacity: {imageOpacity}</span>
          <span>fallback delay: {fallbackDelay}</span>
        </output>
      </div>
    )
  }
} satisfies Story

export const Ex006ConsumerVisualOverrides = {
  name: 'EX-006 - Consumer Visual Overrides',
  render: (args) => (
    <Avatar.Root {...args} className="border-accent bg-accent text-accent-foreground shadow-none">
      <Avatar.Image alt="Athlete with custom treatment" src={ATHLETE_IMAGE_SRC} />
      <Avatar.Fallback headingProps={{ tone: 'accent' }}>CT</Avatar.Fallback>
    </Avatar.Root>
  )
} satisfies Story

export const Ex007SupportedRenderComposition = {
  name: 'EX-007 - Supported Render Composition',
  render: () => {
    const [consumerFocuses, setConsumerFocuses] = useState(0)
    const [consumerPointerEnters, setConsumerPointerEnters] = useState(0)
    const [fallbackTarget, setFallbackTarget] = useState('waiting for fallback ref')
    const [imageTarget, setImageTarget] = useState('waiting for image ref')
    const [loadingCallback, setLoadingCallback] = useState<ImageLoadingStatus>('idle')
    const [nativeClicks, setNativeClicks] = useState(0)
    const [renderState, setRenderState] = useState('waiting for Image render state')
    const [rootTarget, setRootTarget] = useState('waiting for root ref')
    const setFallbackRef = useCallback((element: HTMLSpanElement | null) => {
      if (element !== null) {
        setFallbackTarget(
          `${element.tagName.toLowerCase()}[data-avatar-fallback=${element.dataset.avatarFallback}] ref attached`
        )
      }
    }, [])
    const syncImageRenderEvidence = useCallback((element: HTMLImageElement) => {
      setRenderState(
        `${element.dataset.imageLoadingStatus} / ${element.dataset.imageTransitionStatus}`
      )
    }, [])
    const setImageRef = useCallback(
      (element: HTMLImageElement | null) => {
        if (element === null) {
          return
        }

        setImageTarget(
          `${element.tagName.toLowerCase()}[data-avatar-image=${element.dataset.avatarImage}] ref attached`
        )
        syncImageRenderEvidence(element)

        const observer = new MutationObserver(() => syncImageRenderEvidence(element))

        observer.observe(element, {
          attributeFilter: ['data-image-loading-status', 'data-image-transition-status'],
          attributes: true
        })

        return () => observer.disconnect()
      },
      [syncImageRenderEvidence]
    )
    const setRootRef = useCallback((element: HTMLSpanElement | null) => {
      if (element !== null) {
        setRootTarget(
          `${element.tagName.toLowerCase()}[data-avatar-frame=${element.dataset.avatarFrame}] ref attached`
        )
      }
    }, [])

    return (
      <div className="grid justify-items-start gap-3 text-foreground">
        <Avatar.Root
          ref={setRootRef}
          onFocus={() => setConsumerFocuses((value) => value + 1)}
          onPointerEnter={() => setConsumerPointerEnters((value) => value + 1)}
          render={
            <div
              aria-label="Composed athlete avatar"
              data-avatar-frame="profile"
              role="group"
              tabIndex={0}
            />
          }
        >
          <Avatar.Image
            ref={setImageRef}
            alt="Composed athlete"
            data-image-prop="portrait"
            onClick={() => setNativeClicks((value) => value + 1)}
            onLoadingStatusChange={setLoadingCallback}
            render={(props, state) => (
              <img
                {...props}
                data-avatar-image="portrait"
                data-image-loading-status={state.imageLoadingStatus}
                data-image-transition-status={state.transitionStatus ?? 'none'}
              />
            )}
            src={ATHLETE_IMAGE_SRC}
          />
          <Avatar.Fallback ref={setFallbackRef} render={<span data-avatar-fallback="initials" />}>
            CO
          </Avatar.Fallback>
        </Avatar.Root>

        <dl className="grid gap-1 border border-foreground/30 p-2 font-sans text-xs">
          <div className="grid grid-cols-[5rem_1fr] gap-2">
            <dt className="text-muted-foreground">Root</dt>
            <dd>{rootTarget}</dd>
          </div>
          <div className="grid grid-cols-[5rem_1fr] gap-2">
            <dt className="text-muted-foreground">Image</dt>
            <dd>{imageTarget}</dd>
          </div>
          <div className="grid grid-cols-[5rem_1fr] gap-2">
            <dt className="text-muted-foreground">Fallback</dt>
            <dd>{fallbackTarget}</dd>
          </div>
          <div className="grid grid-cols-[7rem_1fr] gap-2">
            <dt className="text-muted-foreground">render state</dt>
            <dd>render state: {renderState}</dd>
          </div>
          <div className="grid grid-cols-[7rem_1fr] gap-2">
            <dt className="text-muted-foreground">loading callback</dt>
            <dd>loading callback: {loadingCallback}</dd>
          </div>
          <div className="grid grid-cols-[7rem_1fr] gap-2">
            <dt className="text-muted-foreground">native clicks</dt>
            <dd>native clicks: {nativeClicks}</dd>
          </div>
          <div className="grid grid-cols-[9rem_1fr] gap-2">
            <dt className="text-muted-foreground">consumer pointer</dt>
            <dd>consumer pointer enters: {consumerPointerEnters}</dd>
          </div>
          <div className="grid grid-cols-[9rem_1fr] gap-2">
            <dt className="text-muted-foreground">consumer focus</dt>
            <dd>consumer focuses: {consumerFocuses}</dd>
          </div>
        </dl>
      </div>
    )
  }
} satisfies Story
