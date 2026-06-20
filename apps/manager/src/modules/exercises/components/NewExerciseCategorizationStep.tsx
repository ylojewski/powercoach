import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  FrameTitle,
  ScrollArea,
  SelectableGrid,
  StackedPanel,
  StackedPanelContent,
  StackedPanelItem,
  StackedPanelTrigger,
  SwitchAnimation
} from '@powercoach/ui'
import { SquareCheckIcon } from 'lucide-react'
import { type CSSProperties, type ReactElement, useState } from 'react'

import { type Discipline } from '@/core'
import { useReferences } from '@/modules/references'
import athletePatternCarryUrl from '@/src/assets/athlete_pattern_carry.png'
import athletePatternCoreUrl from '@/src/assets/athlete_pattern_core.png'
import athletePatternCyclicalUrl from '@/src/assets/athlete_pattern_cyclical.png'
import athletePatternHingeUrl from '@/src/assets/athlete_pattern_hinge.png'
import athletePatternPullUrl from '@/src/assets/athlete_pattern_pull.png'
import athletePatternPushUrl from '@/src/assets/athlete_pattern_push.png'
import athletePatternSquatUrl from '@/src/assets/athlete_pattern_squat.png'

import { useExerciseCreation } from '../hooks'
import { NewExerciseStepFooter, type NewExerciseStepFooterProps } from './NewExerciseStepFooter'

export function NewExerciseCategorizationStep({
  canNext,
  onNext
}: NewExerciseStepFooterProps): ReactElement {
  const { references } = useReferences()
  const {
    activeDisciplineCode,
    currentCreation,
    getRelationshipStatus,
    selectedPattern,
    updatePattern,
    upsertRelationship
  } = useExerciseCreation()
  const [categorizationDisciplineCode, setCategorizationDisciplineCode] = useState<
    Discipline['code'] | null
  >(activeDisciplineCode)

  if (!currentCreation) {
    return <>Go back</>
  }

  return (
    <div className="flex h-full min-h-0 flex-col">
      <ScrollArea className="min-h-0 flex-1">
        <div className="flex min-h-full flex-col">
          <div className="shrink-0 p-6">
            <FrameTitle>pattern</FrameTitle>
            <SelectableGrid
              className="w-full"
              descriptionClassName="w-[calc((100%_-_1px)/3)] shrink-0"
              emptyText="Please select a pattern"
              gridClassName="min-w-0 basis-0 flex-1"
              items={references?.patterns ?? []}
              itemsToUrlMap={{
                carry: athletePatternCarryUrl,
                core: athletePatternCoreUrl,
                cyclical: athletePatternCyclicalUrl,
                hinge: athletePatternHingeUrl,
                pull: athletePatternPullUrl,
                push: athletePatternPushUrl,
                squat: athletePatternSquatUrl
              }}
              layout="horizontal"
              onValueChange={updatePattern}
              orientation="horizontal"
              value={selectedPattern}
            />
          </div>
          <div className="flex min-h-0 flex-1 flex-col p-6 pt-0">
            <FrameTitle>roles</FrameTitle>
            <div
              className="relative min-h-[calc(var(--height)*3rem)] flex-1"
              style={{ '--height': references?.disciplines.length } as CSSProperties}
            >
              <StackedPanel
                className="absolute inset-0 border-s"
                collapsible={false}
                empty={
                  <Empty className="h-full min-h-full border bg-background">
                    <EmptyHeader>
                      <EmptyMedia variant="icon">
                        <SquareCheckIcon size={16} />
                      </EmptyMedia>
                      <EmptyTitle>select a discipline</EmptyTitle>
                      <EmptyDescription>
                        Choose a discipline on your left to assign its movement and role.
                      </EmptyDescription>
                    </EmptyHeader>
                  </Empty>
                }
                onValueChange={setCategorizationDisciplineCode}
                value={categorizationDisciplineCode}
              >
                {references?.disciplines.map(
                  ({ code: disciplineCode, id: disciplineId, name: disciplineName }) => {
                    const disciplineLabel = disciplineName.toLowerCase()
                    const {
                      completed,
                      movement: selectedMovement,
                      role: selectedRole
                    } = getRelationshipStatus(disciplineCode)
                    const disciplineMovementItems = references.disciplineMovements
                      .filter((movement) => movement.disciplineId === disciplineId)
                      .slice(0, 3)

                    return (
                      <StackedPanelItem key={disciplineCode} value={disciplineCode}>
                        <StackedPanelTrigger className="text-nowrap">
                          <span className="flex min-w-0 items-center gap-1">
                            <span
                              aria-hidden="true"
                              className={`transition-margin w-4 duration-300 ${completed ? 'ml-0' : '-ml-5'}`}
                            >
                              <SquareCheckIcon
                                className={`transition-opacity duration-300 ${completed ? 'opacity-100' : 'opacity-0'}`}
                                size={16}
                              />
                            </span>
                            <span className="min-w-0 truncate">{disciplineLabel}</span>
                          </span>
                        </StackedPanelTrigger>
                        <StackedPanelContent className="grid min-h-0 grid-cols-[minmax(0,1fr)_minmax(0,1fr)] border bg-background">
                          <div className="flex min-h-0 min-w-0 flex-col border-r p-6">
                            <div className="font-heading text-xl lowercase">movement</div>
                            <SelectableGrid
                              className="mt-4 min-h-0 flex-1"
                              descriptionClassName="flex-1"
                              emptyText={`Please select a ${disciplineLabel} movement`}
                              items={disciplineMovementItems}
                              onValueChange={(movement) => {
                                const nextMovementId = movement?.id

                                upsertRelationship({
                                  disciplineCode,
                                  targetDisciplineMovementId: nextMovementId,
                                  ...(nextMovementId !== selectedMovement?.id
                                    ? { roleId: undefined }
                                    : {})
                                })
                              }}
                              value={selectedMovement}
                            />
                          </div>
                          <div className="flex min-h-0 min-w-0 flex-col p-6">
                            <SwitchAnimation
                              className="min-h-0 flex-1"
                              itemClassName="flex min-h-0 flex-col"
                              motionKey={selectedMovement ? 'movement' : 'movement-none'}
                            >
                              {selectedMovement && (
                                <>
                                  <div className="font-heading text-xl lowercase">role</div>
                                  <SelectableGrid
                                    allowDeselect
                                    className="mt-4 min-h-0 flex-1"
                                    descriptionClassName="flex-1"
                                    emptyText={`Please select a ${disciplineLabel} role`}
                                    items={references.exerciseRoles}
                                    onValueChange={(role) => {
                                      upsertRelationship({
                                        disciplineCode,
                                        roleId: role?.id
                                      })
                                    }}
                                    value={selectedRole}
                                  />
                                </>
                              )}
                            </SwitchAnimation>
                          </div>
                        </StackedPanelContent>
                      </StackedPanelItem>
                    )
                  }
                )}
              </StackedPanel>
            </div>
          </div>
        </div>
      </ScrollArea>
      <NewExerciseStepFooter canNext={canNext} onNext={onNext} />
    </div>
  )
}
