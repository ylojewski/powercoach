import { cva } from 'class-variance-authority'

// prettier-ignore
export const inputAddOnVariants = cva(
  `
    pointer-events-none flex shrink-0 items-center justify-center
    border-foreground/30 bg-muted text-muted-foreground
    [&_svg]:pointer-events-none [&_svg]:shrink-0
  `,
  {
    defaultVariants: {
      position: 'start',
      size: 'xl'
    },
    variants: {
      position: {
        end: 'order-last border-s',
        start: 'order-first border-e'
      },
      size: {
        md: 'w-8 [&_svg]:size-3.5',
        xl: 'w-9 [&_svg]:size-4',
        xs: 'w-6 [&_svg]:size-3'
      }
    }
  }
)
