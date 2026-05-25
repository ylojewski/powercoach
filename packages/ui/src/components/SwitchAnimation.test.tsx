import { render, screen } from '@testing-library/react'
import { type ComponentProps, type ReactNode } from 'react'
import { describe, expect, it, vi } from 'vitest'

import { SwitchAnimation } from './SwitchAnimation'

interface AnimatePresenceProps {
  children: ReactNode
  initial?: boolean
  mode?: string
}

type MotionSpanProps = ComponentProps<'span'> & {
  animate: unknown
  exit: unknown
  initial: unknown
}

vi.mock('motion/react', () => ({
  AnimatePresence: ({ children, initial, mode }: AnimatePresenceProps) => (
    <span data-initial={String(initial)} data-mode={mode ?? ''} data-testid="animate-presence">
      {children}
    </span>
  ),
  motion: {
    span: ({ animate, children, exit, initial, ...props }: MotionSpanProps) => (
      <span
        data-animate={JSON.stringify(animate)}
        data-exit={JSON.stringify(exit)}
        data-initial={JSON.stringify(initial)}
        data-testid="motion-item"
        {...props}
      >
        {children}
      </span>
    )
  }
}))

function readMotionValue(attribute: 'animate' | 'exit' | 'initial'): unknown {
  return JSON.parse(screen.getByTestId('motion-item').getAttribute(`data-${attribute}`) ?? '{}')
}

describe('SwitchAnimation', () => {
  it('renders a vertical switch animation by default with a delayed enter animation', () => {
    render(
      <SwitchAnimation className="shell" itemClassName="icon inline-flex" motionKey="missing">
        Missing
      </SwitchAnimation>
    )

    const switchAnimation = screen.getByText('Missing').closest('[data-slot="switch-animation"]')
    const presence = screen.getByTestId('animate-presence')
    const item = screen.getByTestId('motion-item')

    expect(switchAnimation?.getAttribute('data-orientation')).toBe('vertical')
    expect(switchAnimation?.getAttribute('class')).toContain('inline-grid')
    expect(switchAnimation?.getAttribute('class')).toContain('shell')
    expect(presence.getAttribute('data-initial')).toBe('false')
    expect(presence.getAttribute('data-mode')).toBe('')
    expect(item.getAttribute('class')).toContain('col-start-1')
    expect(item.getAttribute('class')).toContain('row-start-1')
    expect(item.getAttribute('class')).toContain('icon')
    expect(readMotionValue('initial')).toEqual({ opacity: 0, y: -10 })
    expect(readMotionValue('animate')).toEqual({
      opacity: 1,
      transition: { delay: 0.1, duration: 0.15, ease: 'easeOut' },
      y: 0
    })
    expect(readMotionValue('exit')).toEqual({
      opacity: 0,
      transition: { duration: 0.15, ease: 'easeIn' },
      y: 10
    })
  })

  it('switches on the horizontal axis when requested', () => {
    render(
      <SwitchAnimation motionKey="next" orientation="horizontal">
        Next
      </SwitchAnimation>
    )

    expect(
      screen
        .getByText('Next')
        .closest('[data-slot="switch-animation"]')
        ?.getAttribute('data-orientation')
    ).toBe('horizontal')
    expect(readMotionValue('initial')).toEqual({ opacity: 0, x: -10 })
    expect(readMotionValue('animate')).toEqual({
      opacity: 1,
      transition: { delay: 0.1, duration: 0.15, ease: 'easeOut' },
      x: 0
    })
    expect(readMotionValue('exit')).toEqual({
      opacity: 0,
      transition: { duration: 0.15, ease: 'easeIn' },
      x: 10
    })
  })

  it('allows overriding the enter delay', () => {
    render(
      <SwitchAnimation delay={0.25} motionKey="delayed">
        Delayed
      </SwitchAnimation>
    )

    expect(readMotionValue('animate')).toEqual({
      opacity: 1,
      transition: { delay: 0.25, duration: 0.15, ease: 'easeOut' },
      y: 0
    })
  })
})
