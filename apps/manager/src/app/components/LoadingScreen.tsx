import { LogoIcon } from '@powercoach/ui'
import { type ReactElement } from 'react'

export function LoadingScreen(): ReactElement {
  return (
    <section
      aria-label="loading powercoach"
      className="bg-background text-foreground flex min-h-screen items-center justify-center"
    >
      <div className="flex flex-col items-center gap-4">
        <LogoIcon />
        <p className="font-heading text-sm tracking-widest uppercase">loading powercoach</p>
      </div>
    </section>
  )
}
