import { cn } from '@powercoach/ui'
import { type LucideIcon } from 'lucide-react'
import { type PropsWithChildren, type ReactElement } from 'react'

export interface NewExerciseSourcePanelCardProps {
  active: boolean
  description: string
  icon: LucideIcon
  onActivate: () => void
  title: string
}

export function NewExerciseSourcePanelCard({
  active,
  children,
  description,
  icon: Icon,
  onActivate,
  title
}: PropsWithChildren<NewExerciseSourcePanelCardProps>): ReactElement {
  return (
    <div
      className={cn(
        'relative flex min-w-0 cursor-pointer flex-col items-center justify-center text-center transition-[background] hover:bg-gray-100',
        'after:pointer-events-none after:absolute after:inset-0 after:border-black after:transition-[border-width] after:duration-200',
        active ? 'cursor-auto bg-gray-100 after:border-8' : 'after:border-0'
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
