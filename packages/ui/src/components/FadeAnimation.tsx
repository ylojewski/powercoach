import { AnimatePresence, motion } from 'motion/react'
import { type ReactNode } from 'react'

export interface FadeAnimationProps {
  children: ReactNode
  show: boolean
  className?: string
  duration?: number
}

export const FADE_ANIMATION_TRANSITION_SECONDS = 0.2

export function FadeAnimation({
  children,
  show,
  className,
  duration = FADE_ANIMATION_TRANSITION_SECONDS
}: FadeAnimationProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration }}
          className={className}
        >
          {children}
        </motion.span>
      )}
    </AnimatePresence>
  )
}
