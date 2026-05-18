import { Button } from '@powercoach/ui'
import { SparklesIcon } from 'lucide-react'
import { ComponentProps, type ReactElement } from 'react'

import {
  NewExerciseSourcePanelCard,
  type NewExerciseSourcePanelCardProps
} from './NewExerciseSourcePanelCard'

export interface NewExerciseSourcePanelBlankCardProps
  extends Omit<NewExerciseSourcePanelCardProps, 'description' | 'icon' | 'title'> {
  actionLabel: string
  onNext: () => void
  onReset?: () => void
  resetLabel?: string
}

export function NewExerciseSourcePanelBlankCard({
  actionLabel,
  active,
  onNext,
  onReset,
  resetLabel,
  ...props
}: NewExerciseSourcePanelBlankCardProps): ReactElement<
  ComponentProps<typeof NewExerciseSourcePanelCard>
> {
  return (
    <NewExerciseSourcePanelCard
      active={active}
      icon={SparklesIcon}
      title="from scratch"
      description="Create an exercise from scratch. Precise setup, execution, data, muscles, and cues - ready to use."
      {...props}
    >
      <div className="inline-flex flex-col items-center gap-2">
        <Button disabled={!active} onClick={onNext} variant={active ? 'default' : 'outline'}>
          {actionLabel}
        </Button>
        {onReset && (
          <Button
            className={!active ? 'opacity-30' : ''}
            size="xs"
            variant="link"
            onClick={onReset}
          >
            {resetLabel?.toLowerCase()}
          </Button>
        )}
      </div>
    </NewExerciseSourcePanelCard>
  )
}
