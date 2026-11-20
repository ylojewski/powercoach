import { type Meta, type StoryObj } from '@storybook/react-vite'
import { useState } from 'react'

import { Button, RevealAnimation } from '../..'
import {
  type RevealAnimationAlignment,
  type RevealAnimationContentMode,
  type RevealAnimationDirection,
  type RevealAnimationUnrevealBehavior
} from './RevealAnimation'

const REVEAL_DIRECTION_NAMES = [
  'left-to-right',
  'right-to-left',
  'top-to-bottom',
  'bottom-to-top',
  'diagonal-45-to-135'
] as const satisfies readonly RevealAnimationDirection[]

const REVEAL_ALIGNMENT_NAMES = [
  'start',
  'center',
  'end'
] as const satisfies readonly RevealAnimationAlignment[]

const REVEAL_CONTENT_MODE_NAMES = [
  'flow',
  'phrasing'
] as const satisfies readonly RevealAnimationContentMode[]

const REVEAL_UNREVEAL_BEHAVIOR_NAMES = [
  'return',
  'continue'
] as const satisfies readonly RevealAnimationUnrevealBehavior[]

const meta = {
  args: {
    alignX: 'center',
    alignY: 'center',
    children: 'start workout',
    contentMode: 'flow',
    direction: 'diagonal-45-to-135',
    offsetX: 0,
    offsetY: 0,
    render: <Button />,
    reveal: false,
    scale: 1.2,
    unrevealBehavior: 'return'
  },
  argTypes: {
    alignX: {
      control: 'select',
      options: REVEAL_ALIGNMENT_NAMES
    },
    alignY: {
      control: 'select',
      options: REVEAL_ALIGNMENT_NAMES
    },
    children: {
      control: 'text'
    },
    contentMode: {
      control: 'select',
      options: REVEAL_CONTENT_MODE_NAMES
    },
    direction: {
      control: 'select',
      options: REVEAL_DIRECTION_NAMES
    },
    offsetX: {
      control: 'number'
    },
    offsetY: {
      control: 'number'
    },
    render: {
      control: false
    },
    reveal: {
      control: 'boolean'
    },
    scale: {
      control: 'number'
    },
    unrevealBehavior: {
      control: 'select',
      options: REVEAL_UNREVEAL_BEHAVIOR_NAMES
    }
  },
  component: RevealAnimation,
  title: 'Animations/RevealAnimation'
} satisfies Meta<typeof RevealAnimation>

export default meta

type Story = StoryObj<typeof meta>

export const Ex001DefaultButtonReveal = {
  args: {
    children: 'start workout',
    reveal: undefined
  },
  name: 'EX-001 - Default Button Reveal',
  render: ({ children }) => <RevealAnimation render={<Button />}>{children}</RevealAnimation>
} satisfies Story

export const Ex002DirectionButtonReveals = {
  name: 'EX-002 - Direction Button Reveals',
  render: () => (
    <div className="grid gap-3 sm:grid-cols-2">
      {REVEAL_DIRECTION_NAMES.map((direction) => (
        <RevealAnimation direction={direction} key={direction} render={<Button />}>
          {direction.replaceAll('-', ' ')}
        </RevealAnimation>
      ))}
    </div>
  )
} satisfies Story

export const Ex003PositionedButtonReveal = {
  args: {
    alignX: 'start',
    alignY: 'start',
    children: 'tune plan',
    offsetX: -20,
    offsetY: 4,
    reveal: true
  },
  name: 'EX-003 - Positioned Button Reveal',
  render: (args) => (
    <RevealAnimation {...args} render={<Button />}>
      {args.children}
    </RevealAnimation>
  )
} satisfies Story

export const Ex004ControlledButtonReveal = {
  name: 'EX-004 - Controlled Button Reveal',
  render: () => {
    const [completeMessage, setCompleteMessage] = useState('idle')
    const [revealed, setRevealed] = useState(false)
    const [startMessage, setStartMessage] = useState('idle')
    const [stateMessage, setStateMessage] = useState('idle')
    const [unrevealBehavior, setUnrevealBehavior] =
      useState<RevealAnimationUnrevealBehavior>('return')

    return (
      <div className="grid gap-3 text-foreground">
        <label className="inline-flex items-center gap-2 font-sans text-sm">
          <input
            checked={revealed}
            onChange={(event) => setRevealed(event.currentTarget.checked)}
            type="checkbox"
          />
          reveal
        </label>
        <label className="grid gap-1 font-sans text-sm">
          unreveal behavior
          <select
            className="border border-foreground bg-background px-2 py-1 text-foreground"
            onChange={(event) =>
              setUnrevealBehavior(event.currentTarget.value as RevealAnimationUnrevealBehavior)
            }
            value={unrevealBehavior}
          >
            {REVEAL_UNREVEAL_BEHAVIOR_NAMES.map((behavior) => (
              <option key={behavior} value={behavior}>
                {behavior}
              </option>
            ))}
          </select>
        </label>
        <RevealAnimation
          onRevealChange={(nextRevealed) => setStateMessage(nextRevealed ? 'revealed' : 'hidden')}
          onRevealComplete={(nextRevealed) =>
            setCompleteMessage(nextRevealed ? 'complete revealed' : 'complete hidden')
          }
          onRevealStart={(nextRevealed) => setStartMessage(nextRevealed ? 'revealing' : 'hiding')}
          render={<Button />}
          reveal={revealed}
          unrevealBehavior={unrevealBehavior}
        >
          controlled reveal
        </RevealAnimation>
        <dl className="grid gap-1 border border-foreground/30 p-2 font-sans text-xs">
          <div className="grid grid-cols-[8rem_1fr] gap-2">
            <dt className="text-muted-foreground">configuration</dt>
            <dd>{unrevealBehavior}</dd>
          </div>
          <div className="grid grid-cols-[8rem_1fr] gap-2">
            <dt className="text-muted-foreground">state</dt>
            <dd>{stateMessage}</dd>
          </div>
          <div className="grid grid-cols-[8rem_1fr] gap-2">
            <dt className="text-muted-foreground">start</dt>
            <dd>{startMessage}</dd>
          </div>
          <div className="grid grid-cols-[8rem_1fr] gap-2">
            <dt className="text-muted-foreground">complete</dt>
            <dd>{completeMessage}</dd>
          </div>
          <div className="grid grid-cols-[8rem_1fr] gap-2">
            <dt className="text-muted-foreground">motion preference</dt>
            <dd>
              <span className="motion-reduce:hidden">no preference</span>
              <span className="hidden motion-reduce:inline">reduced</span>
            </dd>
          </div>
          <div className="grid grid-cols-[8rem_1fr] gap-2">
            <dt className="text-muted-foreground">interruption</dt>
            <dd>after reveal completes: hide, reveal during hiding, then hide during recovery</dd>
          </div>
        </dl>
      </div>
    )
  }
} satisfies Story

export const Ex005ThemeInversionButtonReveal = {
  args: {
    children: 'inspect reveal',
    reveal: true
  },
  name: 'EX-005 - Theme Inversion Button Reveal',
  render: (args) => (
    <RevealAnimation {...args} render={<Button />}>
      {args.children}
    </RevealAnimation>
  )
} satisfies Story

export const Ex006PhrasingContentCatalogReveal = {
  args: {
    children: 'exercice catalog',
    contentMode: 'phrasing',
    reveal: undefined,
    scale: 1
  },
  name: 'EX-006 - Phrasing-Content Catalog Reveal',
  render: (args) => (
    <p className="font-sans text-sm leading-6 text-foreground">
      Open{' '}
      <RevealAnimation
        alignX={args.alignX}
        alignY={args.alignY}
        contentMode={args.contentMode}
        direction={args.direction}
        offsetX={args.offsetX}
        offsetY={args.offsetY}
        render={<Button variant="link" />}
        reveal={args.reveal}
        scale={args.scale}
      >
        {args.children}
      </RevealAnimation>{' '}
      popup
    </p>
  )
} satisfies Story

export const Ex007UnrevealBehaviorButtonReveals = {
  name: 'EX-007 - Return And Continue On Default Button',
  render: () => (
    <div className="grid gap-3">
      <p className="font-sans text-xs text-muted-foreground">
        Leave after reveal completes, re-enter during hiding, then leave again during recovery to
        resume the same endpoint.
      </p>
      <div className="flex flex-col gap-2">
        <div className="flex flex-col items-start gap-2">
          <span className="font-sans text-xs text-muted-foreground">default return</span>
          <RevealAnimation direction="left-to-right" render={<Button />}>
            return
          </RevealAnimation>
        </div>
        <div className="flex flex-col items-start gap-2">
          <span className="font-sans text-xs text-muted-foreground">continue</span>
          <RevealAnimation
            direction="left-to-right"
            render={<Button />}
            unrevealBehavior="continue"
          >
            continue
          </RevealAnimation>
        </div>
      </div>
    </div>
  )
} satisfies Story
