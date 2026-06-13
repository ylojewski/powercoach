import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  Field,
  FieldDescription,
  FieldLabel,
  FrameTitle,
  SelectableGrid,
  Slider,
  SliderValue,
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

export function NewExerciseCategorizationStep(): ReactElement {
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
      <div className="shrink-0 p-6">
        <FrameTitle>pattern</FrameTitle>
        <SelectableGrid
          emptyText="Please select a pattern"
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
          onValueChange={(pattern) => {
            updatePattern(pattern)
          }}
          value={selectedPattern}
        />
      </div>
      <div className="flex min-h-0 flex-1 flex-col bg-accent p-6">
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
                    Choose at least one discipline to assign its movement and role.
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
                  role: selectedRole,
                  transferPercentage
                } = getRelationshipStatus(disciplineCode)
                const disciplineMovementItems = references.disciplineMovements.filter(
                  (movement) => movement.disciplineId === disciplineId
                )

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
                    <StackedPanelContent className="flex flex-col gap-2 border bg-background p-6">
                      <div className="flex gap-px">
                        <div className="flex w-10 items-end bg-muted ps-2 pb-1 font-heading text-2xl">
                          1
                        </div>
                        <div className="flex flex-1 flex-col">
                          <SelectableGrid
                            emptyText={`Please select a ${disciplineLabel} movement`}
                            items={disciplineMovementItems}
                            onValueChange={(movement) => {
                              upsertRelationship({
                                disciplineCode,
                                targetDisciplineMovementId: movement?.id
                              })
                            }}
                            value={selectedMovement}
                          />
                        </div>
                      </div>
                      <SwitchAnimation
                        className="w-full"
                        motionKey={selectedMovement ? 'movement' : 'movement-none'}
                      >
                        {selectedMovement && (
                          <div className="flex gap-px">
                            <div className="flex w-10 items-end bg-muted ps-2 pb-1 font-heading text-2xl">
                              2
                            </div>
                            <div className="flex flex-1 flex-col">
                              <SelectableGrid
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
                            </div>
                          </div>
                        )}
                      </SwitchAnimation>
                      <SwitchAnimation
                        className="w-full"
                        motionKey={selectedMovement && selectedRole ? 'transfer' : 'transfer-none'}
                      >
                        {selectedMovement && selectedRole && (
                          <div className="flex gap-px">
                            <div className="flex w-10 items-end bg-muted ps-2 pb-1 font-heading text-2xl">
                              3
                            </div>
                            <div className="flex flex-1 flex-col">
                              <Field className="w-full border bg-background px-4 py-3">
                                <Slider
                                  defaultValue={transferPercentage}
                                  max={100}
                                  min={0}
                                  onValueCommitted={(value) => {
                                    const percentage =
                                      typeof value === 'number' ? value : (value[0] ?? 0)

                                    upsertRelationship({
                                      defaultTransferCoefficient: Math.min(
                                        1,
                                        Math.max(0, percentage / 100)
                                      ),
                                      disciplineCode
                                    })
                                  }}
                                >
                                  <div className="mb-3 flex min-w-0 items-end justify-between gap-4">
                                    <FieldLabel className="font-heading lowercase">
                                      transfer
                                    </FieldLabel>
                                    <SliderValue className="font-heading text-2xl leading-none text-foreground">
                                      {(_, values) => `${values[0] ?? transferPercentage}%`}
                                    </SliderValue>
                                  </div>
                                </Slider>
                                <FieldDescription>
                                  Default transfer to {disciplineLabel}{' '}
                                  {selectedMovement.name.toLowerCase()} as{' '}
                                  {selectedRole.name.toLowerCase()}.
                                </FieldDescription>
                              </Field>
                            </div>
                          </div>
                        )}
                      </SwitchAnimation>
                    </StackedPanelContent>
                  </StackedPanelItem>
                )
              }
            )}
          </StackedPanel>
        </div>
      </div>
    </div>
  )
}
