import { LogoIcon } from '@powercoach/ui'
import { type ReactElement } from 'react'

export function SplashScreen(): ReactElement {
  return (
    <section
      aria-label="Loading Powercoach"
      className="bg-background text-foreground flex min-h-screen items-center justify-center"
    >
      <div className="flex flex-col items-center gap-4">
        <LogoIcon />
        <p className="font-heading text-sm tracking-widest uppercase">Loading Powercoach</p>
      </div>
    </section>
  )
}
