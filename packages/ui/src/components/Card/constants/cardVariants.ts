import { cva } from 'class-variance-authority'

export const cardVariants = {
  content: cva(`relative z-10`, {
    variants: {
      size: {
        md: 'px-3 pb-3',
        xl: 'px-5 pb-5',
        xs: 'px-2 pb-2'
      }
    }
  }),
  footer: cva(
    `pointer-events-auto relative mt-auto flex shrink-0 items-center justify-between border-t border-border bg-muted`,
    {
      variants: {
        size: {
          md: 'gap-3 px-3 py-3',
          xl: 'gap-5 px-5 py-5',
          xs: 'gap-2 px-2 py-2'
        }
      }
    }
  ),
  header: cva(`relative z-10 flex flex-col`, {
    variants: {
      size: {
        md: 'gap-1 p-3',
        xl: 'gap-2 p-5',
        xs: 'gap-0 p-2'
      }
    }
  }),
  // prettier-ignore
  icon: cva(
    `
      relative z-10 inline-flex shrink-0 items-center justify-center
      border border-border bg-background text-foreground
      [&_svg]:pointer-events-none [&_svg]:shrink-0
    `,
    {
      variants: {
        size: {
          md: 'size-10 [&_svg]:size-5',
          xl: 'size-14 [&_svg]:size-7',
          xs: 'size-8 [&_svg]:size-4'
        }
      }
    }
  ),
  // prettier-ignore
  root: cva(
    `
      relative isolate grid
      transition-[translate,box-shadow] duration-300 ease-out motion-reduce:transition-none
      [&:has([role=radio]:focus-visible):not(:has([data-size]_[role=radio]:focus-visible))]:focus-geometry
      [&:has([role=radio]:focus-visible):not(:has([data-size]_[role=radio]:focus-visible))]:outline-foreground
    `,
    {
      variants: {
        selectable: {
          false: null,
          true: `
            [&>[data-motion=reveal]]:pointer-events-none
            [&>[data-motion=reveal]]:z-30
            [&:not([data-selected]):not([data-disabled]):not([data-readonly]):has(>:not([data-motion=reveal]):is([role=radio]:hover,:has([role=radio]:hover)))]:[translate:-0.0625rem_-0.0625rem]
            [&:not([data-selected]):not([data-disabled]):not([data-readonly]):has(>:not([data-motion=reveal]):is([role=radio]:hover,:has([role=radio]:hover)))]:[box-shadow:0.125rem_0.125rem_0_0_var(--color-border)]
          `
        },
        selected: {
          false: '[translate:none] [box-shadow:none]',
          true: `
            [translate:-0.125rem_-0.125rem]
            [box-shadow:0.25rem_0.25rem_0_0_var(--color-foreground)]
          `
        }
      }
    }
  ),
  // prettier-ignore
  surface: cva(
    `
      relative flex h-full min-h-0 w-full flex-col overflow-hidden
      border data-[reveal-overlay-surface]:border-transparent bg-card text-card-foreground
      transition-[border-color] duration-300 ease-out motion-reduce:transition-none
      [&[data-reveal-overlay-surface]_[data-reveal-copy]]:flex
      [&[data-reveal-overlay-surface]_[data-reveal-copy]]:h-full
      [&[data-reveal-overlay-surface]_[data-reveal-copy]]:min-h-0
      [&[data-reveal-overlay-surface]_[data-reveal-copy]]:w-full
      [&[data-reveal-overlay-surface]_[data-reveal-copy-scale]]:!flex
      [&[data-reveal-overlay-surface]_[data-reveal-copy-scale]]:h-full
      [&[data-reveal-overlay-surface]_[data-reveal-copy-scale]]:min-h-0
      [&[data-reveal-overlay-surface]_[data-reveal-copy-scale]]:w-full
      [&[data-reveal-overlay-surface]_[data-reveal-copy-scale]]:flex-col
    `,
    {
      variants: {
        selected: {
          false: 'border-border',
          true: 'border-foreground'
        }
      }
    }
  ),
  visual: cva(`flex items-start bg-card`, {
    compoundVariants: [
      {
        className: 'h-12',
        placement: 'flow',
        size: 'xs'
      },
      {
        className: 'h-16.5',
        placement: 'flow',
        size: 'md'
      },
      {
        className: 'h-24.5',
        placement: 'flow',
        size: 'xl'
      }
    ],
    variants: {
      placement: {
        flow: 'relative z-10 shrink-0 border-b border-border',
        overlay: 'pointer-events-none absolute inset-0 z-0'
      },
      size: {
        md: 'p-3',
        xl: 'p-5',
        xs: 'p-2'
      }
    }
  })
} as const
