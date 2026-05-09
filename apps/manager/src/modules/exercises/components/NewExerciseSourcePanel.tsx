import {
  Badge,
  Button,
  Card,
  CardDescription,
  CardHeader,
  CardPanel,
  CardTitle,
  InputGroup,
  InputGroupAddon,
  InputGroupInput
} from '@powercoach/ui'
import { CopyIcon, PlusIcon, SearchIcon } from 'lucide-react'
import { type ReactElement, useMemo, useState } from 'react'

import { useAppDispatch, useAppSelector } from '@/core'

import { exerciseReferences } from '../references'
import {
  cloneCreationExercise,
  selectExerciseCreationValidation,
  selectExercisesCreation,
  startBlankCreation
} from '../store'
import { NewExercisePanel } from '../types'
import { NewExercisePanelFrame } from './NewExercisePanelFrame'

export function NewExerciseSourcePanel(): ReactElement {
  const dispatch = useAppDispatch()
  const creation = useAppSelector(selectExercisesCreation)
  const validation = useAppSelector(selectExerciseCreationValidation)
  const [search, setSearch] = useState('')
  const filteredExercises = useMemo(() => {
    const searchValue = search.trim().toLowerCase()

    if (!searchValue) {
      return exerciseReferences.exercises.slice(0, 8)
    }

    return exerciseReferences.exercises
      .filter(
        (exercise) =>
          exercise.code.includes(searchValue) ||
          exercise.subtitle?.toLowerCase().includes(searchValue) ||
          exercise.title.toLowerCase().includes(searchValue)
      )
      .slice(0, 8)
  }, [search])
  const draft = creation?.draft

  return (
    <NewExercisePanelFrame
      description="Start from a blank exercise or clone a mocked catalog reference. Cloning pre-fills categorization, specifications, muscles, instructions, and relationships."
      errors={validation.panelErrors[NewExercisePanel.Source]}
      isReady={Boolean(draft?.sourceMode && (draft.sourceMode === 'blank' || draft.templateExerciseCode))}
      title="Source"
    >
      <div className="grid gap-4 lg:grid-cols-2">
        <Card
          className={
            draft?.sourceMode === 'blank'
              ? 'border-primary bg-primary/4 ring-2 ring-primary/20'
              : undefined
          }
        >
          <button
            className="flex h-full min-h-56 w-full flex-col items-start gap-4 p-6 text-left outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            onClick={() => dispatch(startBlankCreation())}
            type="button"
          >
            <span className="flex size-11 items-center justify-center rounded-lg border bg-background">
              <PlusIcon className="size-5" />
            </span>
            <span className="flex flex-col gap-2">
              <span className="text-lg font-semibold">Create from scratch</span>
              <span className="text-sm text-muted-foreground">
                Start with a clean draft and fill every section manually.
              </span>
            </span>
          </button>
        </Card>
        <Card
          className={
            draft?.sourceMode === 'clone'
              ? 'border-primary bg-primary/4 ring-2 ring-primary/20'
              : undefined
          }
        >
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CopyIcon className="size-5" />
              Clone existing exercise
            </CardTitle>
            <CardDescription>
              Search the mocked catalog and reuse the selected exercise structure.
            </CardDescription>
          </CardHeader>
          <CardPanel className="flex flex-col gap-4">
            <InputGroup>
              <InputGroupAddon>
                <SearchIcon />
              </InputGroupAddon>
              <InputGroupInput
                onChange={(event) => setSearch(event.currentTarget.value)}
                placeholder="Search the exercise catalog"
                value={search}
              />
            </InputGroup>
            <div className="flex max-h-80 flex-col gap-2 overflow-y-auto">
              {filteredExercises.map((exercise) => (
                <button
                  className={
                    draft?.templateExerciseCode === exercise.code
                      ? 'rounded-lg border border-primary bg-primary/4 p-3 text-left'
                      : 'rounded-lg border p-3 text-left transition-colors hover:bg-accent/50'
                  }
                  key={exercise.code}
                  onClick={() => dispatch(cloneCreationExercise(exercise))}
                  type="button"
                >
                  <span className="flex items-center justify-between gap-3">
                    <span className="font-medium">{exercise.title}</span>
                    <Badge variant="outline">{exercise.loadingType.name}</Badge>
                  </span>
                  <span className="mt-1 block text-sm text-muted-foreground">
                    {exercise.subtitle ?? exercise.code}
                  </span>
                </button>
              ))}
            </div>
            <Button
              disabled={!draft?.templateExerciseCode}
              onClick={() => {
                const selectedExercise = exerciseReferences.exercises.find(
                  (exercise) => exercise.code === draft?.templateExerciseCode
                )

                if (selectedExercise) {
                  dispatch(cloneCreationExercise(selectedExercise))
                }
              }}
              variant="outline"
            >
              Use selected template
            </Button>
          </CardPanel>
        </Card>
      </div>
    </NewExercisePanelFrame>
  )
}
