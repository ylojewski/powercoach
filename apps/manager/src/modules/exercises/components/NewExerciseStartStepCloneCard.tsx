import {
  Button,
  Combobox,
  ComboboxCollection,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxGroupLabel,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxPopup
} from '@powercoach/ui'
import { CopyPlusIcon } from 'lucide-react'
import { ComponentProps, type ReactElement, useState } from 'react'

import { type Exercise } from '@/core'
import { type ExerciseGroupItemByPattern, useReferences } from '@/modules/references'

import {
  NewExerciseStartStepCard,
  type NewExerciseStartStepCardProps
} from './NewExerciseStartStepCard'

export interface NewExerciseStartStepCloneCardProps
  extends Omit<NewExerciseStartStepCardProps, 'description' | 'icon' | 'mode' | 'title'> {
  canNext: boolean
  exercise: Exercise | null
  onExerciseChange: (exercise: Exercise | null) => void
  onNext: () => void
  onReset?: () => void
}

export function NewExerciseStartStepCloneCard({
  active,
  canNext,
  exercise,
  onExerciseChange,
  onNext,
  onReset,
  ...props
}: NewExerciseStartStepCloneCardProps): ReactElement<
  ComponentProps<typeof NewExerciseStartStepCard>
> {
  const { exerciseGroupItemsByPattern } = useReferences()
  const [localExercise, setLocalExercise] = useState(exercise)

  function filterExercise(exercise: Exercise, query: string): boolean {
    return `${exercise.title} ${exercise.code}`.toLowerCase().includes(query.toLowerCase())
  }

  return (
    <NewExerciseStartStepCard
      active={active}
      icon={CopyPlusIcon}
      mode="clone"
      title="clone an exercise"
      description="Clone an existing exercise and adapt it fast. Keep the structure, tweak the details, and ship a clean variation."
      {...props}
    >
      <div className="grid w-full min-w-0 grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
        <Combobox
          filter={filterExercise}
          isItemEqualToValue={(exercise, value) => exercise.code === value.code}
          itemToStringLabel={(exercise) => exercise.title}
          itemToStringValue={(exercise) => exercise.title}
          items={exerciseGroupItemsByPattern}
          openOnInputClick
          onValueChange={(exercise) => {
            setLocalExercise(exercise)
            onExerciseChange(exercise)
          }}
          value={localExercise}
        >
          <ComboboxInput
            className="flex-1 rounded-none"
            placeholder="Exercise to clone"
            size="lg"
          />
          <ComboboxPopup data-base-ui-swipe-ignore="">
            <ComboboxEmpty>No exercises found.</ComboboxEmpty>
            <ComboboxList>
              {(group: ExerciseGroupItemByPattern) => (
                <ComboboxGroup key={group.code} items={group.items}>
                  <ComboboxGroupLabel>{group.value}</ComboboxGroupLabel>
                  <ComboboxCollection>
                    {(exercise: Exercise) => (
                      <ComboboxItem key={exercise.code} value={exercise}>
                        {exercise.title}
                      </ComboboxItem>
                    )}
                  </ComboboxCollection>
                </ComboboxGroup>
              )}
            </ComboboxList>
          </ComboboxPopup>
        </Combobox>
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
