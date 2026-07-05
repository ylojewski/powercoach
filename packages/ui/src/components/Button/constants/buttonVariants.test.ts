import { describe, expect, it } from 'vitest'

import { buttonVariants } from './buttonVariants'

describe('buttonVariants', () => {
  it('uses muted-foreground for disabled text and visible disabled borders', () => {
    const defaultClassNames = buttonVariants({ variant: 'default' }).split(/\s+/)
    const ghostClassNames = buttonVariants({ variant: 'ghost' }).split(/\s+/)
    const iconClassNames = buttonVariants({ size: 'icon-lg' }).split(/\s+/)
    const linkClassNames = buttonVariants({ variant: 'link' }).split(/\s+/)

    expect(defaultClassNames).toContain('duration-300')
    expect(defaultClassNames).toContain('border-foreground')
    expect(defaultClassNames).toContain('data-disabled:text-muted-foreground')
    expect(defaultClassNames).toContain('data-disabled:border-muted-foreground')
    expect(defaultClassNames).toContain('focus-visible:outline-foreground!')
    expect(ghostClassNames).toContain('data-disabled:text-muted-foreground')
    expect(ghostClassNames).not.toContain('data-disabled:border-muted-foreground')
    expect(ghostClassNames).toContain('border-transparent')
    expect(ghostClassNames).toContain('hover:not-data-disabled:bg-muted')
    expect(iconClassNames).toContain('data-disabled:text-muted-foreground')
    expect(iconClassNames).toContain('data-disabled:border-muted-foreground')
    expect(linkClassNames).toContain('data-disabled:text-muted-foreground')
    expect(linkClassNames).toContain('cursor-pointer')
    expect(linkClassNames).toContain('data-disabled:cursor-default')
  })

  it('uses reveal overlay data-attribute treatments without changing metrics', () => {
    const defaultClassNames = buttonVariants({ variant: 'default' }).split(/\s+/)
    const ghostClassNames = buttonVariants({ variant: 'ghost' }).split(/\s+/)
    const iconClassNames = buttonVariants({ size: 'icon-lg' }).split(/\s+/)
    const linkClassNames = buttonVariants({ variant: 'link' }).split(/\s+/)

    expect(defaultClassNames).toContain('border-foreground')
    expect(defaultClassNames).toContain('data-[reveal-overlay-surface]:border-transparent')
    expect(defaultClassNames).toContain('h-10')
    expect(ghostClassNames).toContain('bg-transparent')
    expect(ghostClassNames).toContain('border-transparent')
    expect(ghostClassNames).toContain('data-[reveal-overlay-surface]:bg-background')
    expect(ghostClassNames).toContain('[&[data-reveal-overlay-surface]:hover]:bg-background')
    expect(ghostClassNames).toContain('h-10')
    expect(iconClassNames).toContain('border-foreground')
    expect(iconClassNames).toContain('data-[reveal-overlay-surface]:border-transparent')
    expect(iconClassNames).toContain('[&_svg]:size-4.5')
    expect(iconClassNames).toContain(
      '[&[data-reveal-overlay-surface]_[data-reveal-copy]]:inline-flex'
    )
    expect(iconClassNames).toContain(
      '[&[data-reveal-overlay-surface]_[data-reveal-copy]]:items-center'
    )
    expect(iconClassNames).toContain(
      '[&[data-reveal-overlay-surface]_[data-reveal-copy]]:justify-center'
    )
    expect(iconClassNames).toContain(
      '[&[data-reveal-overlay-surface]_[data-reveal-copy]]:leading-none'
    )
    expect(iconClassNames).not.toContain(
      '[&[data-reveal-overlay-surface]_[data-reveal-copy-scale]]:!transform-none'
    )
    expect(iconClassNames).toContain('size-10')
    expect(linkClassNames).toContain('bg-transparent')
    expect(linkClassNames).toContain('text-inherit')
    expect(linkClassNames).toContain('data-[reveal-overlay-surface]:bg-background')
    expect(linkClassNames).toContain('data-[reveal-overlay-surface]:text-foreground')
    expect(linkClassNames).not.toContain(
      '[&[data-reveal-overlay-surface]_[data-reveal-copy-scale]]:!transform-none'
    )
  })
})
