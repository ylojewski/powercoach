import { cn } from '@powercoach/ui'
import { type LucideIcon } from 'lucide-react'
import { type PropsWithChildren, type ReactElement } from 'react'

export interface NewExerciseStartStepCardProps {
  active: boolean
  description: string
  icon: LucideIcon
  onActivate: () => void
  title: string
}

export function NewExerciseStartStepCard({
  active,
  children,
  description,
  icon: Icon,
  onActivate,
  title
}: PropsWithChildren<NewExerciseStartStepCardProps>): ReactElement {
  return (
    <div
      className={cn(
        'relative flex min-w-0 cursor-pointer flex-col items-center justify-center text-center transition-[background] hover:bg-background-100 dark:hover:bg-foreground-800',
        'after:pointer-events-none after:absolute after:inset-0 after:border-background after:transition-[border-width] after:duration-200 dark:after:border-background',
        active ? 'cursor-auto bg-gray-100 dark:bg-gray-800 after:border-8' : 'after:border-0'
      )}
      onClick={onActivate}
    >
      <div className="min-h-1/2 w-3/4">
        <Icon aria-hidden="true" className="text-foreground mx-auto mb-5 size-14 stroke-[1.5]" />
        <div className="font-heading mb-2 text-2xl">{title}</div>
        <div className="mb-8 text-xs font-light text-gray-500">{description}</div>
        {children}
      </div>
    </div>
  )
}
