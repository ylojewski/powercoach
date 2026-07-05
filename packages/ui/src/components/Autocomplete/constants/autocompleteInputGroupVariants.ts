import { cva } from 'class-variance-authority'

// prettier-ignore
export const autocompleteInputGroupVariants = cva(
  `
    field-emphasis flex w-full min-w-0
    border border-foreground/30 bg-background
    text-foreground
  `,
  {
    defaultVariants: {
      size: 'xl'
    },
    variants: {
      size: {
        md: `
          h-8
          [--field-emphasis-offset:--spacing(0.375)]
          [--field-emphasis-shadow-offset:--spacing(0.75)]
        `,
        xl: `
          h-9
          [--field-emphasis-offset:--spacing(0.5)]
          [--field-emphasis-shadow-offset:--spacing(1)]
        `,
        xs: `
          h-6
          [--field-emphasis-offset:--spacing(0.25)]
          [--field-emphasis-shadow-offset:--spacing(0.5)]
        `
      }
    }
  }
)
