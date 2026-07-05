import { cva } from 'class-variance-authority'

// prettier-ignore
export const scrollAreaScrollbarVariants = cva(
  `
    flex bg-transparent opacity-0
    pointer-events-none data-hovering:pointer-events-auto data-hovering:opacity-100
    data-scrolling:pointer-events-auto data-scrolling:opacity-100
    transition-opacity duration-150 ease-linear motion-reduce:transition-none
  `,
  {
    variants: {
      orientation: {
        horizontal: 'h-3',
        vertical: 'w-3'
      }
    }
  }
)

export const scrollAreaThumbVariants = cva(`m-px bg-foreground`, {
  variants: {
    orientation: {
      horizontal: 'mt-auto h-1/2',
      vertical: 'ml-auto w-1/2'
    }
  }
})
