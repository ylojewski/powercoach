import {
  Badge,
  Button,
  DrawerCreateHandle,
  DrawerTrigger,
  Frame,
  FramePanel,
  Slider,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@powercoach/ui'
import { PlusIcon, XIcon } from 'lucide-react'
import { type ReactElement, useMemo } from 'react'

import { useAppDispatch, useAppSelector } from '@/core'

import { getExerciseCreationMuscleTotal } from '../exerciseCreation'
import { exerciseReferences, findReferenceMuscle } from '../references'
import {
  removeCreationMuscle,
  selectExerciseCreationDraft,
  selectExerciseCreationValidation,
  updateCreationMuscle
} from '../store'
import { NewExercisePanel } from '../types'
import { MuscleSelectorDrawer } from './MuscleSelectorDrawer'
import { NewExercisePanelFrame } from './NewExercisePanelFrame'

const MUSCLE_ROLE_ORDER: Record<string, number> = {
  primary: 0,
  secondary: 1,
  stabilizer: 2
}

function getSliderNumber(value: number | readonly number[]): number {
  return typeof value === 'number' ? value : (value[0] ?? 0)
}

export function NewExerciseMusclesPanel(): ReactElement {
  const dispatch = useAppDispatch()
  const draft = useAppSelector(selectExerciseCreationDraft)
  const validation = useAppSelector(selectExerciseCreationValidation)
  const drawerHandle = DrawerCreateHandle()
  const muscleTotal = getExerciseCreationMuscleTotal(draft)
  const sortedMuscles = useMemo(
    () =>
      [...draft.muscles].sort((firstMuscle, secondMuscle) => {
        const roleDelta =
          (MUSCLE_ROLE_ORDER[firstMuscle.roleCode] ?? 99) -
          (MUSCLE_ROLE_ORDER[secondMuscle.roleCode] ?? 99)

        if (roleDelta !== 0) {
          return roleDelta
        }

        if (secondMuscle.weightPercentage !== firstMuscle.weightPercentage) {
          return secondMuscle.weightPercentage - firstMuscle.weightPercentage
        }

        return firstMuscle.muscleCode.localeCompare(secondMuscle.muscleCode)
      }),
    [draft.muscles]
  )

  return (
    <NewExercisePanelFrame
      description="Select trained muscles, assign their role, and balance stimulus weight without exceeding 100%."
      errors={validation.panelErrors[NewExercisePanel.Muscles]}
      isReady={draft.muscles.length > 0 && muscleTotal <= 100}
      title="Muscles"
    >
      <Frame>
        <FramePanel className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-col gap-1">
              <div className="font-medium">Stimulus allocation</div>
              <p className="text-sm text-muted-foreground">
                Rows auto-sort by role and percentage after each change.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={muscleTotal > 100 ? 'error' : 'success'}>{muscleTotal}% used</Badge>
              <Button render={<DrawerTrigger handle={drawerHandle} />} variant="outline">
                <PlusIcon />
                Add muscles
              </Button>
            </div>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Muscle</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Share</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedMuscles.length === 0 ? (
                <TableRow>
                  <TableCell className="py-10 text-center text-sm text-muted-foreground" colSpan={4}>
                    Add at least one muscle to describe the stimulus.
                  </TableCell>
                </TableRow>
              ) : (
                sortedMuscles.map((selectedMuscle) => {
                  const muscle = findReferenceMuscle(selectedMuscle.muscleCode)

                  return (
                    <TableRow key={selectedMuscle.muscleCode}>
                      <TableCell className="font-medium">
                        {muscle?.commonName ?? selectedMuscle.muscleCode}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {exerciseReferences.muscleRoles.map((role) => (
                            <Button
                              key={role.code}
                              onClick={() =>
                                dispatch(
                                  updateCreationMuscle({
                                    ...selectedMuscle,
                                    roleCode: role.code
                                  })
                                )
                              }
                              size="xs"
                              variant={selectedMuscle.roleCode === role.code ? 'default' : 'outline'}
                            >
                              {role.name}
                            </Button>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="min-w-56">
                        <div className="flex items-center gap-3">
                          <Slider
                            max={100}
                            min={0}
                            onValueChange={(value) =>
                              dispatch(
                                updateCreationMuscle({
                                  ...selectedMuscle,
                                  weightPercentage: getSliderNumber(value)
                                })
                              )
                            }
                            value={selectedMuscle.weightPercentage}
                          />
                          <span className="w-12 text-right text-sm text-muted-foreground">
                            {selectedMuscle.weightPercentage}%
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          aria-label={`Remove ${muscle?.commonName ?? selectedMuscle.muscleCode}`}
                          onClick={() =>
                            dispatch(
                              removeCreationMuscle({ muscleCode: selectedMuscle.muscleCode })
                            )
                          }
                          size="icon-sm"
                          variant="ghost"
                        >
                          <XIcon />
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>
          {muscleTotal === 100 && (
            <div className="rounded-lg border bg-muted/40 p-3 text-sm text-muted-foreground">
              Stimulus allocation is full. Reduce an existing muscle to free space before adding
              another one.
            </div>
          )}
        </FramePanel>
      </Frame>
      <MuscleSelectorDrawer handle={drawerHandle} />
    </NewExercisePanelFrame>
  )
}
