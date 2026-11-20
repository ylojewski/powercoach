import { cva } from 'class-variance-authority'

// prettier-ignore
export const inputControlVariants = cva(
  `
    min-w-0 flex-1
    border-0 bg-transparent
    text-foreground caret-foreground placeholder:text-foreground/50
    outline-none
  `,
  {
    defaultVariants: {
      size: 'xl'
    },
    variants: {
      size: {
        md: 'px-2.5 text-sm/4.5',
        xl: 'px-3 text-base/5',
        xs: 'px-2 text-xs/4'
      }
    }
  }
)
