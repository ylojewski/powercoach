import { Badge, Card, CardDescription, CardHeader, CardPanel, CardTitle, Frame, FramePanel } from '@powercoach/ui'
import { AlertCircleIcon, BookOpenIcon, CheckCircle2Icon } from 'lucide-react'
import { type ReactElement } from 'react'

import { useAppSelector } from '@/core'

import { getExerciseCreationCode, getExerciseCreationMuscleTotal } from '../exerciseCreation'
import { exerciseReferences, findReferenceMuscle } from '../references'
import { selectExerciseCreationDraft, selectExerciseCreationValidation } from '../store'
import { NewExercisePanel } from '../types'
import { NewExercisePanelFrame } from './NewExercisePanelFrame'

export function NewExerciseReviewPanel(): ReactElement {
  const draft = useAppSelector(selectExerciseCreationDraft)
  const validation = useAppSelector(selectExerciseCreationValidation)
  const generatedCode = getExerciseCreationCode(draft)
  const loadingType = exerciseReferences.loadingTypes.find(
    (candidate) => candidate.code === draft.loadingTypeCode
  )
  const role = exerciseReferences.exerciseRoles.find((candidate) => candidate.code === draft.roleCode)

  return (
    <NewExercisePanelFrame
      description="Review the local creation payload and see exactly what blocks publication."
      errors={validation.panelErrors[NewExercisePanel.Review]}
      isReady={validation.publishErrors.length === 0}
      title="Review"
    >
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpenIcon className="size-5" />
              {draft.title || 'Untitled exercise'}
            </CardTitle>
            <CardDescription>{draft.subtitle || 'No subtitle yet.'}</CardDescription>
          </CardHeader>
          <CardPanel className="flex flex-col gap-5">
            <div className="flex flex-wrap gap-2">
              <Badge>Draft</Badge>
              <Badge variant="outline">{generatedCode || 'new_exercise'}</Badge>
              <Badge variant="outline">{role?.name ?? draft.roleCode}</Badge>
              <Badge variant="outline">{loadingType?.name ?? draft.loadingTypeCode}</Badge>
            </div>
            <div className="grid gap-3 md:grid-cols-3">
              {draft.relationships.map((relationship) => {
                const targetExercise = exerciseReferences.exercises.find(
                  (exercise) => exercise.code === relationship.targetExerciseCode
                )

                return (
                  <FramePanel className="flex flex-col gap-1" key={relationship.targetExerciseCode}>
                    <span className="text-sm text-muted-foreground">
                      {targetExercise?.title ?? relationship.targetExerciseCode}
                    </span>
                    <span className="font-heading text-2xl font-semibold">
                      {Math.round(relationship.defaultTransferCoefficient * 100)}%
                    </span>
                  </FramePanel>
                )
              })}
            </div>
            <FramePanel className="flex flex-col gap-3">
              <div className="font-medium">Muscles</div>
              <div className="flex flex-wrap gap-2">
                {draft.muscles.length > 0 ? (
                  draft.muscles.map((selectedMuscle) => {
                    const muscle = findReferenceMuscle(selectedMuscle.muscleCode)

                    return (
                      <Badge key={selectedMuscle.muscleCode} variant="outline">
                        {muscle?.commonName ?? selectedMuscle.muscleCode}{' '}
                        {selectedMuscle.weightPercentage}%
                      </Badge>
                    )
                  })
                ) : (
                  <span className="text-sm text-muted-foreground">No muscles yet.</span>
                )}
              </div>
            </FramePanel>
          </CardPanel>
        </Card>
        <Frame>
          <FramePanel className="flex flex-col gap-4">
            <div className="flex items-center justify-between gap-3">
              <div className="font-medium">Validation</div>
              <Badge variant={validation.publishErrors.length === 0 ? 'success' : 'error'}>
                {validation.publishErrors.length === 0
                  ? 'Ready to publish'
                  : `${validation.publishErrors.length} issue(s)`}
              </Badge>
            </div>
            {validation.publishErrors.length > 0 ? (
              <div className="flex flex-col gap-2">
                {validation.publishErrors.map((error) => (
                  <div className="flex items-start gap-2 text-sm" key={error}>
                    <AlertCircleIcon className="mt-0.5 size-4 shrink-0 text-destructive-foreground" />
                    <span>{error}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-start gap-2 text-sm text-muted-foreground">
                <CheckCircle2Icon className="mt-0.5 size-4 shrink-0 text-success-foreground" />
                <span>All mocked manager-side checks pass.</span>
              </div>
            )}
            <div className="rounded-lg border bg-muted/32 p-3 text-sm text-muted-foreground">
              Muscle total: {getExerciseCreationMuscleTotal(draft)}%
            </div>
          </FramePanel>
        </Frame>
      </div>
    </NewExercisePanelFrame>
  )
}
