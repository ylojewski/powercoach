import { cva } from 'class-variance-authority'

import { TONE_OR_INTENT_VARIANTS } from '../../constants/toneOrIntentVariants'

export type TextSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl'

export const TEXT_DEFAULT_SIZE = 'md' as const satisfies TextSize

export const TEXT_SIZE_NAMES = [
  'xs',
  'sm',
  'md',
  'lg',
  'xl',
  '2xl',
  '3xl'
] as const satisfies readonly TextSize[]

export const textVariants = cva(`font-sans`, {
  defaultVariants: {
    size: TEXT_DEFAULT_SIZE,
    tone: 'default'
  },
  variants: {
    intent: TONE_OR_INTENT_VARIANTS.intent,
    size: {
      '2xl': 'text-2xl tracking-tight',
      '3xl': 'text-3xl tracking-tight',
      lg: 'text-lg',
      md: 'text-md tracking-wide',
      sm: 'text-sm tracking-wide',
      xl: 'text-xl tracking-tight',
      xs: 'text-xs tracking-wide'
    },
    tone: TONE_OR_INTENT_VARIANTS.tone
  }
})
