import { cva } from 'class-variance-authority'

export type ButtonSize =
  | 'xs'
  | 'sm'
  | 'md'
  | 'lg'
  | 'xl'
  | '2xl'
  | '3xl'
  | 'icon-xs'
  | 'icon-sm'
  | 'icon-md'
  | 'icon-lg'
  | 'icon-xl'
  | 'icon-2xl'
  | 'icon-3xl'

export type ButtonVariant = 'default' | 'ghost' | 'link'

export interface ButtonChromeOptions {
  size?: ButtonSize
  variant?: ButtonVariant
}

export const BUTTON_DEFAULT_SIZE = 'lg' as const satisfies ButtonSize

export const BUTTON_DEFAULT_VARIANT = 'default' as const satisfies ButtonVariant

export const BUTTON_SIZE_NAMES = [
  'xs',
  'sm',
  'md',
  'lg',
  'xl',
  '2xl',
  '3xl',
  'icon-xs',
  'icon-sm',
  'icon-md',
  'icon-lg',
  'icon-xl',
  'icon-2xl',
  'icon-3xl'
] as const satisfies readonly ButtonSize[]

export const BUTTON_VARIANT_NAMES = [
  'default',
  'ghost',
  'link'
] as const satisfies readonly ButtonVariant[]

export const BUTTON_GAP_CLASS_NAMES = {
  '2xl': 'gap-3',
  '3xl': 'gap-4',
  'icon-2xl': 'gap-3',
  'icon-3xl': 'gap-4',
  'icon-lg': 'gap-2',
  'icon-md': 'gap-2',
  'icon-sm': 'gap-1.5',
  'icon-xl': 'gap-2.5',
  'icon-xs': 'gap-1',
  lg: 'gap-2',
  md: 'gap-2',
  sm: 'gap-1.5',
  xl: 'gap-2.5',
  xs: 'gap-1'
} as const satisfies Record<ButtonSize, string>

export const BUTTON_ICON_CLASS_NAMES = {
  '2xl': 'size-6',
  '3xl': 'size-8',
  'icon-2xl': 'size-6',
  'icon-3xl': 'size-8',
  'icon-lg': 'size-4.5',
  'icon-md': 'size-4',
  'icon-sm': 'size-4',
  'icon-xl': 'size-5',
  'icon-xs': 'size-3.5',
  lg: 'size-4.5',
  md: 'size-4',
  sm: 'size-4',
  xl: 'size-5',
  xs: 'size-3.5'
} as const satisfies Record<ButtonSize, string>

export const BUTTON_HEADING_SIZE_NAMES = {
  '2xl': 'lg',
  '3xl': 'xl',
  'icon-2xl': 'lg',
  'icon-3xl': 'xl',
  'icon-lg': 'sm',
  'icon-md': 'xs',
  'icon-sm': 'xs',
  'icon-xl': 'md',
  'icon-xs': 'xs',
  lg: 'sm',
  md: 'xs',
  sm: 'xs',
  xl: 'md',
  xs: 'xs'
} as const satisfies Record<ButtonSize, 'xs' | 'sm' | 'md' | 'lg' | 'xl'>

export function buttonChromeHeadingSize(
  size: ButtonSize = BUTTON_DEFAULT_SIZE
): (typeof BUTTON_HEADING_SIZE_NAMES)[ButtonSize] {
  return BUTTON_HEADING_SIZE_NAMES[size]
}

export function buttonChromeVariants({
  size = BUTTON_DEFAULT_SIZE,
  variant = BUTTON_DEFAULT_VARIANT
}: ButtonChromeOptions = {}): string {
  return buttonVariants({ size, variant })
}

// prettier-ignore
export const buttonVariants = cva(
  `
    relative appearance-none
    transition-colors duration-300
    data-disabled:text-muted-foreground
    focus-visible:focus-geometry focus-visible:outline-foreground focus-visible:outline-foreground!
  `,
  {
    compoundVariants: [
      {
        className: `
          h-7 gap-1 px-2 py-1
        `,
        size: 'xs',
        variant: ['default', 'ghost']
      },
      {
        className: `
          h-8 gap-1.5 px-3 py-1
        `,
        size: 'sm',
        variant: ['default', 'ghost']
      },
      {
        className: `
          h-9 gap-2 px-4 py-1
        `,
        size: 'md',
        variant: ['default', 'ghost']
      },
      {
        className: `
          h-10 gap-2 px-6 py-1
        `,
        size: 'lg',
        variant: ['default', 'ghost']
      },
      {
        className: `
          h-12 gap-2.5 px-8 py-1.5
        `,
        size: 'xl',
        variant: ['default', 'ghost']
      },
      {
        className: `
          h-14 gap-3 px-10 py-2
        `,
        size: '2xl',
        variant: ['default', 'ghost']
      },
      {
        className: `
          h-20 gap-4 px-12 py-3
        `,
        size: '3xl',
        variant: ['default', 'ghost']
      },
      {
        className: `
          inline
        `,
        size: ['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl'],
        variant: 'link'
      },
      {
        className: `
          inline-flex shrink-0 items-center justify-center whitespace-nowrap
          [&_svg]:shrink-0
          [&[data-reveal-overlay-surface]_[data-reveal-copy]]:inline-flex
          [&[data-reveal-overlay-surface]_[data-reveal-copy]]:items-center
          [&[data-reveal-overlay-surface]_[data-reveal-copy]]:justify-center
          [&[data-reveal-overlay-surface]_[data-reveal-copy]]:leading-none
        `,
        size: [
          'icon-xs',
          'icon-sm',
          'icon-md',
          'icon-lg',
          'icon-xl',
          'icon-2xl',
          'icon-3xl'
        ]
      }
    ],
    defaultVariants: {
      size: BUTTON_DEFAULT_SIZE,
      variant: BUTTON_DEFAULT_VARIANT
    },
    variants: {
      size: {
        '2xl': '',
        '3xl': '',
        'icon-2xl': `
          size-14
          [&_svg]:size-6
        `,
        'icon-3xl': `
          size-20
          [&_svg]:size-8
        `,
        'icon-lg': `
          size-10
          [&_svg]:size-4.5
        `,
        'icon-md': `
          size-9
          [&_svg]:size-4
        `,
        'icon-sm': `
          size-8
          [&_svg]:size-4
        `,
        'icon-xl': `
          size-12
          [&_svg]:size-5
        `,
        'icon-xs': `
          size-7
          [&_svg]:size-3.5
        `,
        lg: '',
        md: '',
        sm: '',
        xl: '',
        xs: ''
      },
      variant: {
        default: `
          inline-flex shrink-0 items-center justify-center whitespace-nowrap
          border border-foreground bg-background
          text-foreground select-none
          data-disabled:border-muted-foreground
          data-[reveal-overlay-surface]:border-transparent
        `,
        ghost: `
          inline-flex shrink-0 items-center justify-center whitespace-nowrap
          border border-transparent bg-transparent
          text-foreground select-none
          hover:not-data-disabled:bg-muted
          data-[reveal-overlay-surface]:bg-background
          [&[data-reveal-overlay-surface]:hover]:bg-background
        `,
        link: `
          cursor-pointer
          border-0 bg-transparent p-0
          text-inherit
          underline underline-offset-2
          data-disabled:cursor-default
          data-[reveal-overlay-surface]:bg-background
          data-[reveal-overlay-surface]:text-foreground
        `
      }
    }
  }
)
