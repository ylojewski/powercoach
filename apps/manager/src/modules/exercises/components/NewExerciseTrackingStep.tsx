import {
  Field,
  FieldDescription,
  FieldLabel,
  FrameTitle,
  ScrollArea,
  SelectableGrid,
  Switch
} from '@powercoach/ui'
import { MilestoneIcon, PlusIcon, UserIcon, UserMinusIcon, UserPlusIcon, XIcon } from 'lucide-react'
import { type ReactElement } from 'react'

import { useReferences } from '@/modules/references'

import { useExerciseCreation } from '../hooks'
import { NewExerciseStepFooter, type NewExerciseStepFooterProps } from './NewExerciseStepFooter'

export function NewExerciseTrackingStep({
  canNext,
  onNext
}: NewExerciseStepFooterProps): ReactElement {
  const { references } = useReferences()
  const { currentCreation, selectedLoadingType, updateIsUnilateral, updateLoadingType } =
    useExerciseCreation()
  const exercise = currentCreation?.exercise

  if (!exercise) {
    return <>Go back</>
  }

  return (
    <div className="flex h-full min-h-0 flex-col">
      <ScrollArea className="min-h-0 flex-1">
        <div className="flex min-h-full flex-col">
          <div className="shrink-0 p-6">
            <FrameTitle>load</FrameTitle>
            <div className="grid grid-cols-[minmax(0,3fr)_minmax(0,1fr)] gap-1">
              <div className="flex flex-col">
                <SelectableGrid
                  className="w-full"
                  emptyText="Please select how load will be tracked"
                  items={references?.loadingTypes ?? []}
                  itemsToIconMap={{
                    assisted_bodyweight: UserMinusIcon,
                    bodyweight: UserIcon,
                    bodyweight_plus_external: UserPlusIcon,
                    external_load: PlusIcon,
                    no_load: XIcon
                  }}
                  layout="vertical"
                  onValueChange={updateLoadingType}
                  orientation="horizontal"
                  ratio={16 / 9}
                  ratioClassName="p-2"
                  value={selectedLoadingType}
                />
                <Field className="mt-1 border bg-background p-6">
                  <div className="flex w-full items-start justify-between gap-4">
                    <span className="flex min-w-0 items-start gap-3">
                      <span className="flex size-9 shrink-0 items-center justify-center border bg-hatched">
                        <MilestoneIcon aria-hidden="true" className="size-4" />
                      </span>
                      <span className="min-w-0">
                        <FieldLabel className="font-heading lowercase">unilateral work</FieldLabel>
                        <FieldDescription className="mt-1 leading-5">
                          Count each side separately.
                        </FieldDescription>
                      </span>
                    </span>
                    <Switch
                      aria-label="Unilateral exercise"
                      checked={exercise.isUnilateral}
                      onCheckedChange={(checked) => updateIsUnilateral(checked)}
                    />
                  </div>
                </Field>
              </div>
              <div className="border p-6"></div>
            </div>
          </div>
        </div>
      </ScrollArea>
      <NewExerciseStepFooter canNext={canNext} onNext={onNext} />
    </div>
  )
}
