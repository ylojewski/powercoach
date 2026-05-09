import { Card, CardDescription, CardHeader, CardPanel, CardTitle, Checkbox, Radio, RadioGroup, Slider } from '@powercoach/ui'
import { type ReactElement } from 'react'

import { useAppDispatch, useAppSelector } from '@/core'

import { isBodyweightLoadingType } from '../exerciseCreation'
import { exerciseReferences } from '../references'
import {
  selectExerciseCreationDraft,
  selectExerciseCreationValidation,
  updateCreationDraft
} from '../store'
import { NewExercisePanel } from '../types'
import { NewExercisePanelFrame } from './NewExercisePanelFrame'

function getSliderNumber(value: number | readonly number[]): number {
  return typeof value === 'number' ? value : (value[0] ?? 0)
}

export function NewExerciseSpecificationsPanel(): ReactElement {
  const dispatch = useAppDispatch()
  const draft = useAppSelector(selectExerciseCreationDraft)
  const validation = useAppSelector(selectExerciseCreationValidation)
  const usesBodyweight = isBodyweightLoadingType(draft.loadingTypeCode)

  return (
    <NewExercisePanelFrame
      description="Define how the exercise behaves in load tracking, side tracking, and bodyweight contribution."
      errors={validation.panelErrors[NewExercisePanel.Specifications]}
      isReady={Boolean(draft.loadingTypeCode)}
      title="Specifications"
    >
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <Card>
          <CardHeader>
            <CardTitle>Loading type</CardTitle>
            <CardDescription>
              Drills and no-load work are handled as loading rules, not as a separate creation flow.
            </CardDescription>
          </CardHeader>
          <CardPanel>
            <RadioGroup
              className="grid gap-3 md:grid-cols-2"
              onValueChange={(value) =>
                dispatch(updateCreationDraft({ loadingTypeCode: String(value) }))
              }
              value={draft.loadingTypeCode}
            >
              {exerciseReferences.loadingTypes.map((loadingType) => (
                <label
                  className="flex cursor-pointer items-start gap-3 rounded-lg border p-4 has-data-[checked]:border-primary has-data-[checked]:bg-primary/4"
                  key={loadingType.code}
                >
                  <Radio value={loadingType.code} />
                  <span className="flex flex-col gap-1">
                    <span className="font-medium">{loadingType.name}</span>
                    <span className="text-sm text-muted-foreground">{loadingType.description}</span>
                  </span>
                </label>
              ))}
            </RadioGroup>
          </CardPanel>
        </Card>
        <div className="flex flex-col gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Set behavior</CardTitle>
              <CardDescription>Whether the exercise is programmed one side at a time.</CardDescription>
            </CardHeader>
            <CardPanel>
              <label className="flex items-start gap-3 rounded-lg border p-4">
                <Checkbox
                  checked={draft.isUnilateral}
                  onCheckedChange={(checked) =>
                    dispatch(updateCreationDraft({ isUnilateral: checked === true }))
                  }
                />
                <span className="flex flex-col gap-1">
                  <span className="font-medium">Unilateral exercise</span>
                  <span className="text-sm text-muted-foreground">
                    Track left and right side work intentionally.
                  </span>
                </span>
              </label>
            </CardPanel>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Bodyweight coefficient</CardTitle>
              <CardDescription>Estimate how much bodyweight contributes to moved load.</CardDescription>
            </CardHeader>
            <CardPanel className="flex flex-col gap-3">
              <Slider
                disabled={!usesBodyweight}
                max={100}
                min={0}
                onValueChange={(value) =>
                  dispatch(updateCreationDraft({ bodyweightCoefficient: getSliderNumber(value) }))
                }
                value={draft.bodyweightCoefficient ?? 0}
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>0%</span>
                <span className="font-medium text-foreground">{draft.bodyweightCoefficient ?? 0}%</span>
                <span>100%</span>
              </div>
              {!usesBodyweight && (
                <p className="text-sm text-muted-foreground">
                  Enabled for bodyweight-based loading types.
                </p>
              )}
            </CardPanel>
          </Card>
        </div>
      </div>
    </NewExercisePanelFrame>
  )
}
