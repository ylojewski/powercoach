import {
  Button,
  Drawer,
  DrawerCreateHandle,
  DrawerFooter,
  DrawerHeader,
  DrawerPanel,
  DrawerPopup,
  DrawerTitle,
  InputGroup,
  InputGroupAddon,
  InputGroupInput
} from '@powercoach/ui'
import { PlusIcon, SearchIcon } from 'lucide-react'
import { type ComponentProps, type ReactElement, useMemo, useState } from 'react'

import { useAppDispatch, useAppSelector } from '@/core'

import { getExerciseCreationMuscleTotal } from '../exerciseCreation'
import { exerciseReferences, getMuscleParentName } from '../references'
import { addCreationMuscle, selectExerciseCreationDraft } from '../store'

export type MuscleSelectorDrawerProps = ComponentProps<typeof Drawer> & {
  handle: ReturnType<typeof DrawerCreateHandle>
}

export function MuscleSelectorDrawer({
  handle,
  ...props
}: MuscleSelectorDrawerProps): ReactElement {
  const dispatch = useAppDispatch()
  const draft = useAppSelector(selectExerciseCreationDraft)
  const [search, setSearch] = useState('')
  const remainingPercentage = Math.max(0, 100 - getExerciseCreationMuscleTotal(draft))
  const selectedMuscleCodes = new Set(draft.muscles.map((muscle) => muscle.muscleCode))
  const groupedMuscles = useMemo(() => {
    const searchValue = search.trim().toLowerCase()
    const availableMuscles = exerciseReferences.muscles.filter(
      (muscle) =>
        !selectedMuscleCodes.has(muscle.code) &&
        (!searchValue ||
          muscle.code.includes(searchValue) ||
          muscle.commonName.toLowerCase().includes(searchValue) ||
          muscle.name.toLowerCase().includes(searchValue) ||
          getMuscleParentName(muscle).toLowerCase().includes(searchValue))
    )

    return availableMuscles.reduce<Record<string, typeof availableMuscles>>((groups, muscle) => {
      const groupName = getMuscleParentName(muscle)

      return {
        ...groups,
        [groupName]: [...(groups[groupName] ?? []), muscle]
      }
    }, {})
  }, [search, selectedMuscleCodes])

  return (
    <Drawer handle={handle} {...props}>
      <DrawerPopup showBar showCloseButton className="min-h-[calc(100dvh-4.75rem)] rounded-none">
        <DrawerHeader>
          <DrawerTitle>Muscle selection</DrawerTitle>
        </DrawerHeader>
        <DrawerPanel className="flex min-h-full flex-col gap-4" scrollable>
          <InputGroup>
            <InputGroupAddon>
              <SearchIcon />
            </InputGroupAddon>
            <InputGroupInput
              onChange={(event) => setSearch(event.currentTarget.value)}
              placeholder="Search muscles or groups"
              value={search}
            />
          </InputGroup>
          <div className="rounded-lg border bg-muted/32 p-3 text-sm text-muted-foreground">
            {remainingPercentage}% stimulus space remaining.
          </div>
          {Object.entries(groupedMuscles).length === 0 ? (
            <div className="rounded-lg border p-4 text-sm text-muted-foreground">
              No available muscle matches this search.
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {Object.entries(groupedMuscles).map(([groupName, muscles]) => (
                <div className="flex flex-col gap-2 rounded-lg border p-3" key={groupName}>
                  <div className="text-sm font-medium text-muted-foreground">{groupName}</div>
                  {muscles.map((muscle) => (
                    <div
                      className="flex items-center justify-between gap-3 rounded-lg bg-muted/40 p-3"
                      key={muscle.code}
                    >
                      <div className="flex flex-col">
                        <span className="font-medium">{muscle.commonName}</span>
                        <span className="text-sm text-muted-foreground">{muscle.name}</span>
                      </div>
                      <Button
                        disabled={remainingPercentage === 0}
                        onClick={() => dispatch(addCreationMuscle({ muscleCode: muscle.code }))}
                        size="sm"
                        variant="outline"
                      >
                        <PlusIcon />
                        Add
                      </Button>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
        </DrawerPanel>
        <DrawerFooter>
          <div className="text-sm text-muted-foreground">
            Added muscles appear in the creation table immediately.
          </div>
        </DrawerFooter>
      </DrawerPopup>
    </Drawer>
  )
}
