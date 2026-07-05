import { cva } from 'class-variance-authority'

import { type HeadingSize } from '../../Heading'

export type AvatarSize = HeadingSize

export const AVATAR_DEFAULT_SIZE = 'md' as const satisfies AvatarSize

export const AVATAR_SIZE_NAMES = [
  'xs',
  'sm',
  'md',
  'lg',
  'xl',
  '2xl',
  '3xl'
] as const satisfies readonly AvatarSize[]

export const AVATAR_HARD_SHADOWS = {
  '2xl': '6.6667px 6.6667px 0 0 var(--color-foreground)',
  '3xl': '13.3333px 13.3333px 0 0 var(--color-foreground)',
  lg: '3.3333px 3.3333px 0 0 var(--color-foreground)',
  md: '3px 3px 0 0 var(--color-foreground)',
  sm: '2.5px 2.5px 0 0 var(--color-foreground)',
  xl: '4px 4px 0 0 var(--color-foreground)',
  xs: '2px 2px 0 0 var(--color-foreground)'
} as const satisfies Record<AvatarSize, string>

// prettier-ignore
export const avatarRootVariants = cva(
  `
    isolate overflow-hidden
    [--color-foreground:var(--foreground)]
    shadow-(--hard-shadow)
    [&>[data-motion=reveal]]:size-full
    [&>[data-motion=reveal]>[data-reveal-surface]]:size-full
  `,
  {
    defaultVariants: {
      size: AVATAR_DEFAULT_SIZE
    },
    variants: {
      size: {
        '2xl': `
          size-20 p-[3px]
          [&_[data-reveal-overlay]]:inset-[-3px]
        `,
        '3xl': `
          size-40 p-1
          [&_[data-reveal-overlay]]:-inset-1
        `,
        lg: `
          p-0.5
          [&_[data-reveal-overlay]]:-inset-0.5
        `,
        md: `
          p-0.5
          [&_[data-reveal-overlay]]:-inset-0.5
        `,
        sm: `
          p-px
          [&_[data-reveal-overlay]]:-inset-px
        `,
        xl: `
          p-0.5
          [&_[data-reveal-overlay]]:-inset-0.5
        `,
        xs: `
          p-px
          [&_[data-reveal-overlay]]:-inset-px
        `
      }
    }
  }
)
