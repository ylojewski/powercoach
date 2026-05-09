import { Button, Card, CardDescription, CardHeader, CardPanel, CardTitle, Slider } from '@powercoach/ui'
import { CheckCircle2Icon, DumbbellIcon, ShieldCheckIcon, WeightIcon } from 'lucide-react'
import { type ReactElement } from 'react'

import { useAppDispatch, useAppSelector } from '@/core'

import { exerciseReferences, getCompetitionExercises } from '../references'
import {
  selectExerciseCreationDraft,
  selectExerciseCreationValidation,
  updateCreationDraft,
  updateCreationRelationship
} from '../store'
import { NewExercisePanel } from '../types'
import { NewExercisePanelFrame } from './NewExercisePanelFrame'

function getSliderNumber(value: number | readonly number[]): number {
  return typeof value === 'number' ? value : (value[0] ?? 0)
}

export function NewExerciseCategorizationPanel(): ReactElement {
  const dispatch = useAppDispatch()
  const draft = useAppSelector(selectExerciseCreationDraft)
  const validation = useAppSelector(selectExerciseCreationValidation)
  const competitionExercises = getCompetitionExercises()

  return (
    <NewExercisePanelFrame
      description="Classify the movement, tag movement patterns, and model transfer toward competition lifts."
      errors={validation.panelErrors[NewExercisePanel.Categorization]}
      isReady={draft.patterns.length > 0 && draft.relationships.length > 0}
      title="Categorization"
    >
      <div className="grid gap-6 2xl:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="flex flex-col gap-6">
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {exerciseReferences.exerciseRoles.map((role) => {
              const Icon = role.code === 'drill' ? ShieldCheckIcon : DumbbellIcon

              return (
                <Card
                  className={
                    draft.roleCode === role.code
                      ? 'border-primary bg-primary/4 ring-2 ring-primary/20'
                      : undefined
                  }
                  key={role.code}
                >
                  <button
                    className="flex h-full min-h-40 w-full flex-col items-start gap-4 p-5 text-left outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    onClick={() => dispatch(updateCreationDraft({ roleCode: role.code }))}
                    type="button"
                  >
                    <span className="flex size-10 items-center justify-center rounded-lg border bg-background">
                      <Icon className="size-5" />
                    </span>
                    <span className="flex flex-col gap-2">
                      <span className="font-semibold">{role.name}</span>
                      <span className="text-sm text-muted-foreground">{role.description}</span>
                    </span>
                  </button>
                </Card>
              )
            })}
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Transfer targets</CardTitle>
              <CardDescription>
                Link this exercise to the competition lifts it should inform.
              </CardDescription>
            </CardHeader>
            <CardPanel className="flex flex-col gap-4">
              {competitionExercises.map((exercise) => {
                const relationship = draft.relationships.find(
                  (candidate) => candidate.targetExerciseCode === exercise.code
                )
                const coefficient = Math.round((relationship?.defaultTransferCoefficient ?? 0) * 100)

                return (
                  <div
                    className="grid gap-3 rounded-lg border p-4 md:grid-cols-[13rem_minmax(0,1fr)_4rem] md:items-center"
                    key={exercise.code}
                  >
                    <div className="flex items-center gap-3 font-medium">
                      <span className="flex size-9 items-center justify-center rounded-lg bg-muted">
                        <WeightIcon className="size-4" />
                      </span>
                      {exercise.title.replace('Competition ', '')}
                    </div>
                    <Slider
                      max={100}
                      min={0}
                      onValueChange={(value) =>
                        dispatch(
                          updateCreationRelationship({
                            defaultTransferCoefficient: getSliderNumber(value) / 100,
                            targetExerciseCode: exercise.code
                          })
                        )
                      }
                      value={coefficient}
                    />
                    <span className="text-right text-sm font-medium text-muted-foreground">
                      {coefficient}%
                    </span>
                  </div>
                )
              })}
            </CardPanel>
          </Card>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Movement patterns</CardTitle>
            <CardDescription>Used for filtering, programming balance, and recommendations.</CardDescription>
          </CardHeader>
          <CardPanel className="flex flex-wrap gap-2">
            {exerciseReferences.patterns.map((pattern) => {
              const isSelected = draft.patterns.includes(pattern.code)

              return (
                <Button
                  key={pattern.code}
                  onClick={() =>
                    dispatch(
                      updateCreationDraft({
                        patterns: isSelected
                          ? draft.patterns.filter((patternCode) => patternCode !== pattern.code)
                          : [...draft.patterns, pattern.code]
                      })
                    )
                  }
                  variant={isSelected ? 'default' : 'outline'}
                >
                  {isSelected && <CheckCircle2Icon />}
                  {pattern.name}
                </Button>
              )
            })}
          </CardPanel>
        </Card>
      </div>
    </NewExercisePanelFrame>
  )
}
