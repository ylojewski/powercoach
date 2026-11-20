import { cva } from 'class-variance-authority'

import { TONE_OR_INTENT_VARIANTS } from '../../constants/toneOrIntentVariants'

export type HeadingSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl'

export const HEADING_DEFAULT_SIZE = 'md' as const satisfies HeadingSize

export const HEADING_SIZE_NAMES = [
  'xs',
  'sm',
  'md',
  'lg',
  'xl',
  '2xl',
  '3xl'
] as const satisfies readonly HeadingSize[]

export const headingVariants = cva(`font-heading lowercase`, {
  defaultVariants: {
    size: HEADING_DEFAULT_SIZE,
    tone: 'default'
  },
  variants: {
    intent: TONE_OR_INTENT_VARIANTS.intent,
    size: {
      '2xl': 'text-6xl tracking-tight',
      '3xl': 'text-9xl tracking-tight',
      lg: 'text-2xl',
      md: 'text-xl tracking-wide',
      sm: 'text-lg tracking-wide',
      xl: 'text-4xl tracking-tight',
      xs: 'tracking-wide'
    },
    tone: TONE_OR_INTENT_VARIANTS.tone
  }
})
