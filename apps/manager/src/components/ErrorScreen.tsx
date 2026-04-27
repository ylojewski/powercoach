import { LogoIcon } from '@powercoach/ui'
import { type ReactElement } from 'react'

export function ErrorScreen(): ReactElement {
  return (
    <section
      aria-label="failed to load powercoach"
      className="bg-background text-foreground flex min-h-screen items-center justify-center"
    >
      <div className="flex flex-col items-center gap-4">
        <LogoIcon />
        <p className="font-heading text-sm tracking-widest uppercase">failed to load powercoach</p>
      </div>
    </section>
  )
}
