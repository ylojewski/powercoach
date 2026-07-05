import { cva } from 'class-variance-authority'

import { type PopupSurfaceSize } from '../types/PopupSurfaceTypes'

export const POPUP_SURFACE_HARD_SHADOWS = {
  md: '0.1875rem 0.1875rem 0 0 var(--color-foreground)',
  xl: '0.25rem 0.25rem 0 0 var(--color-foreground)',
  xs: '0.125rem 0.125rem 0 0 var(--color-foreground)'
} as const satisfies Record<PopupSurfaceSize, string>

// prettier-ignore
export const popupSurfaceItemVariants = cva(
  `
    relative flex w-full items-center
    bg-background text-foreground
  `,
  {
    compoundVariants: [
      { className: 'ps-8', contentInset: 'start', size: 'xs' },
      { className: 'ps-10.5', contentInset: 'start', size: 'md' },
      { className: 'ps-12', contentInset: 'start', size: 'xl' },
      { className: 'pe-8', contentInset: 'end', size: 'xs' },
      { className: 'pe-10.5', contentInset: 'end', size: 'md' },
      { className: 'pe-12', contentInset: 'end', size: 'xl' }
    ],
    variants: {
      contentInset: {
        base: '',
        end: '',
        start: ''
      },
      size: {
        md: 'min-h-8 gap-2.5 py-1.5 ps-2.5 pe-2.5',
        xl: 'min-h-9 gap-3 py-2 ps-3 pe-3',
        xs: 'min-h-6 gap-2 py-1 ps-2 pe-2'
      }
    }
  }
)

// prettier-ignore
export const popupSurfaceItemIconVariants = cva(
  `
    pointer-events-none absolute inset-y-0
    flex shrink-0 items-center justify-center
    [&_svg]:shrink-0
  `,
  {
    variants: {
      position: {
        end: 'end-0',
        start: 'start-0'
      },
      size: {
        md: 'w-8 [&_svg]:size-3.5',
        xl: 'w-9 [&_svg]:size-4',
        xs: 'w-6 [&_svg]:size-3'
      }
    }
  }
)
