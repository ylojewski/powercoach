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
  extends Omit<NewExerciseStartStepCardProps, 'description' | 'icon' | 'title'> {
  actionLabel: string
  exercise: Exercise | null
  onExerciseChange: (exercise: Exercise | null) => void
  onNext: () => void
  onReset?: () => void
  resetLabel?: string
}

export function NewExerciseStartStepCloneCard({
  actionLabel,
  active,
  exercise,
  onExerciseChange,
  onNext,
  onReset,
  resetLabel,
  ...props
}: NewExerciseStartStepCloneCardProps): ReactElement<
  ComponentProps<typeof NewExerciseStartStepCard>
> {
  const { exerciseGroupItemsByPattern } = useReferences()
  const [localExercise, setLocalExercise] = useState(exercise)
  const canNext = active && Boolean(localExercise)

  function filterExercise(exercise: Exercise, query: string): boolean {
    return `${exercise.title} ${exercise.code}`.toLowerCase().includes(query.toLowerCase())
  }

  return (
    <NewExerciseStartStepCard
      active={active}
      icon={CopyPlusIcon}
      title="clone an exercise"
      description="Clone an existing exercise and adapt it fast. Keep the structure, tweak the details, and ship a clean variation."
      {...props}
    >
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
        <ComboboxInput className="flex-1" placeholder="Exercise to clone" size="lg" />
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
      <div className="mt-8 flex flex-col items-center gap-2">
        <Button
          disabled={!canNext}
          onClick={onNext}
          size="lg"
          variant={canNext ? 'default' : 'outline'}
        >
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
    </NewExerciseStartStepCard>
  )
}
