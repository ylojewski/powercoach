import { cn } from '@powercoach/ui'
import { type LucideIcon } from 'lucide-react'
import { type PropsWithChildren, type ReactElement } from 'react'

export interface NewExerciseStartStepCardProps {
  active: boolean
  description: string
  icon: LucideIcon
  mode: string
  onActivate: () => void
  title: string
}

export function NewExerciseStartStepCard({
  active,
  children,
  description,
  icon: Icon,
  mode,
  onActivate,
  title
}: PropsWithChildren<NewExerciseStartStepCardProps>): ReactElement {
  return (
    <div
      className={cn(
        'm-3 border group relative isolate flex min-w-0 cursor-pointer flex-col overflow-hidden bg-background transition-colors hover:bg-accent/60',
        'before:pointer-events-none before:absolute before:inset-0 before:z-20 before:border-0 before:transition-[border-width,border-color] before:duration-200',

        active && 'before:border-8 before:border-foreground',
        active ? 'cursor-auto' : 'bg-muted/20'
      )}
      onClick={onActivate}
    >
      <header className="border-b bg-hatched p-5">
        <div className="flex min-w-0 items-start justify-between gap-4">
          <div
            className={cn(
              'flex size-14 shrink-0 items-center justify-center border bg-background transition-colors',
              active && 'bg-foreground text-background'
            )}
          >
            <Icon aria-hidden="true" className="size-7 stroke-[1.75]" />
          </div>
          <div className="flex min-w-0 flex-col items-end text-right">
            <span className="font-heading text-5xl leading-none text-foreground/10">{mode}</span>
            <span className="font-heading text-xs text-muted-foreground">method</span>
          </div>
        </div>
      </header>
      <div className="flex min-h-0 flex-1 flex-col p-6">
        <div>
          <div className="font-heading text-3xl leading-none">{title}</div>
          <div className="mt-3 max-w-md text-xs leading-5 text-muted-foreground">{description}</div>
        </div>
      </div>
      <div
        className={cn(
          'flex min-h-16 items-center border-t bg-accent px-5 py-3 transition-transform duration-200 ease-out will-change-transform',
          active && '-translate-y-2'
        )}
      >
        {children}
      </div>
    </div>
  )
}
