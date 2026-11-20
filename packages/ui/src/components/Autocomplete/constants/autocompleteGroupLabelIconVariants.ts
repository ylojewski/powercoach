import { cva } from 'class-variance-authority'

// prettier-ignore
export const autocompleteGroupLabelIconVariants = cva(
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
        md: 'w-8 pt-1 pb-0 [&_svg]:size-3.5',
        xl: 'w-9 pt-2 pb-0 [&_svg]:size-4',
        xs: 'w-6 pt-0 pb-0 [&_svg]:size-3'
      }
    }
  }
)
