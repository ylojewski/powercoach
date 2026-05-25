import { LogoIcon } from '@powercoach/ui'
import { type ReactElement } from 'react'

export function ErrorScreen(): ReactElement {
  return (
    <section
      aria-label="failed to load powercoach"
      className="flex min-h-screen items-center justify-center bg-background text-foreground"
    >
      <div className="flex flex-col items-center gap-4">
        <LogoIcon />
        <p className="font-heading text-sm tracking-widest uppercase">failed to load powercoach</p>
      </div>
    </section>
  )
}
