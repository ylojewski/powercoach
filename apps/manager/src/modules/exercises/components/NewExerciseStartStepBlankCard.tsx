import { Button } from '@powercoach/ui'
import { SparklesIcon } from 'lucide-react'
import { ComponentProps, type ReactElement } from 'react'

import {
  NewExerciseStartStepCard,
  type NewExerciseStartStepCardProps
} from './NewExerciseStartStepCard'

export interface NewExerciseStartStepBlankCardProps
  extends Omit<NewExerciseStartStepCardProps, 'description' | 'icon' | 'mode' | 'title'> {
  canNext: boolean
  onNext: () => void
  onReset?: () => void
}

export function NewExerciseStartStepBlankCard({
  active,
  canNext,
  onNext,
  onReset,
  ...props
}: NewExerciseStartStepBlankCardProps): ReactElement<
  ComponentProps<typeof NewExerciseStartStepCard>
> {
  return (
    <NewExerciseStartStepCard
      active={active}
      icon={SparklesIcon}
      mode="blank"
      title="from scratch"
      description="Create an exercise from scratch. Precise setup, execution, data, muscles, and cues - ready to use."
      {...props}
    >
      <div className="flex w-full min-w-0 items-center justify-between gap-4">
        <span className="font-heading text-xs text-muted-foreground">blank build</span>
        <div className="flex shrink-0 items-center gap-2">
          <Button
            disabled={!active || !canNext}
            onClick={onNext}
            size="lg"
            variant={active && canNext ? 'default' : 'outline'}
          >
            Next
          </Button>
          {onReset && (
            <Button
              className={!active ? 'opacity-30' : ''}
              onClick={onReset}
              size="xs"
              variant="link"
            >
              start over
            </Button>
          )}
        </div>
      </div>
    </NewExerciseStartStepCard>
  )
}
