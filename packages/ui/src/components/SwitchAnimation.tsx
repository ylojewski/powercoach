import { AnimatePresence, motion, type TargetAndTransition } from 'motion/react'
import { type ComponentPropsWithoutRef, type Key, type ReactElement, type ReactNode } from 'react'

import { cn } from '@/src/coss/lib/utils'

const SWITCH_ANIMATION_DELAY_SECONDS = 0.1
const SWITCH_ANIMATION_OFFSET = 10
const SWITCH_ANIMATION_TRANSITION_SECONDS = 0.15

export type SwitchAnimationOrientation = 'horizontal' | 'vertical'

export interface SwitchAnimationProps extends Omit<ComponentPropsWithoutRef<'span'>, 'children'> {
  children: ReactNode
  delay?: number
  itemClassName?: string
  motionKey: Key
  orientation?: SwitchAnimationOrientation
}

export function SwitchAnimation({
  children,
  className,
  delay = SWITCH_ANIMATION_DELAY_SECONDS,
  itemClassName,
  motionKey,
  orientation = 'vertical',
  ...props
}: SwitchAnimationProps): ReactElement {
  const enterTransition = {
    delay,
    duration: SWITCH_ANIMATION_TRANSITION_SECONDS,
    ease: 'easeOut' as const
  }
  const exitTransition = {
    duration: SWITCH_ANIMATION_TRANSITION_SECONDS,
    ease: 'easeIn' as const
  }
  const initial: TargetAndTransition =
    orientation === 'horizontal'
      ? { opacity: 0, x: -SWITCH_ANIMATION_OFFSET }
      : { opacity: 0, y: -SWITCH_ANIMATION_OFFSET }
  const animate: TargetAndTransition =
    orientation === 'horizontal'
      ? { opacity: 1, transition: enterTransition, x: 0 }
      : { opacity: 1, transition: enterTransition, y: 0 }
  const exit: TargetAndTransition =
    orientation === 'horizontal'
      ? { opacity: 0, transition: exitTransition, x: SWITCH_ANIMATION_OFFSET }
      : { opacity: 0, transition: exitTransition, y: SWITCH_ANIMATION_OFFSET }

  return (
    <span
      className={cn('inline-grid', className)}
      data-orientation={orientation}
      data-slot="switch-animation"
      {...props}
    >
      <AnimatePresence initial={false}>
        <motion.span
          animate={animate}
          className={cn('col-start-1 row-start-1', itemClassName)}
          data-slot="switch-animation-item"
          exit={exit}
          initial={initial}
          key={motionKey}
        >
          {children}
        </motion.span>
      </AnimatePresence>
    </span>
  )
}
