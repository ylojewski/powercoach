import {
  Alert,
  AlertAction,
  AlertDescription,
  AlertTitle,
  Badge,
  Button,
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  Field,
  FieldLabel,
  Fieldset,
  Form,
  Input,
  InputGroup,
  Separator
} from '@powercoach/ui'
import { useForm, useStore } from '@tanstack/react-form'
import { CircleCheck, CopyPlus, ImageIcon, Info, TriangleAlert, Video, BookA, BookText, BookTemplate } from 'lucide-react'
import { type ReactElement, useEffect, useRef } from 'react'

import { useAppDispatch, useAppSelector, useGetExerciseCodeQuery } from '@/core'

import {
  CreationMethod,
  selectCurrentCreation,
  setCreationExerciseCode,
  setCreationExerciseSubtitle,
  setCreationExerciseTitle,
  startCreation
} from '../store'
import { Frame, FrameTitle, FrameFooter, FramePanel, FieldDescription } from '@powercoach/ui'
import { InputGroupAddon, InputGroupInput } from '@powercoach/ui'
import { InputGroupTextarea } from '@powercoach/ui'

interface OverviewFormValues {
  subtitle: string
  title: string
}

function formatStatus(status: string): string {
  return status.replace(/[_-]+/g, ' ').replace(/\b\w/g, (character) => character.toUpperCase())
}

export function NewExerciseOverviewStep(): ReactElement {
  const dispatch = useAppDispatch()
  const creation = useAppSelector(selectCurrentCreation)
  const exercise = creation?.exercise
  const exerciseKey = creation
    ? `${creation.method}:${creation.exercise.id}:${creation.exercise.createdAt}:${creation.exercise.updatedAt}`
    : null
  const previousExerciseKey = useRef<string | null>(null)

  const form = useForm({
    defaultValues: {
      subtitle: exercise?.subtitle ?? '',
      title: exercise?.title ?? ''
    } satisfies OverviewFormValues
  })
  const title = useStore(form.store, (state) => state.values.title)
  const hasTitle = title.trim().length > 0
  const exerciseCodeQuery = useGetExerciseCodeQuery(
    { title },
    {
      skip: !hasTitle
    }
  )

  useEffect(() => {
    if (!exercise || !exerciseKey || previousExerciseKey.current === exerciseKey) {
      return
    }

    previousExerciseKey.current = exerciseKey
    form.reset({
      subtitle: exercise.subtitle ?? '',
      title: exercise.title
    })
  }, [exercise, exerciseKey, form])

  useEffect(() => {
    if (!hasTitle) {
      dispatch(setCreationExerciseCode(''))
      return
    }

    if (exerciseCodeQuery.currentData) {
      dispatch(setCreationExerciseCode(exerciseCodeQuery.currentData.code))
    }
  }, [dispatch, exerciseCodeQuery.currentData, hasTitle])

  const code = hasTitle ? (exerciseCodeQuery.currentData?.code ?? exercise?.code ?? '') : ''
  const duplicateExercise = exerciseCodeQuery.currentData?.exercise ?? null

  function syncTitle(title: string): void {
    dispatch(setCreationExerciseTitle(title))
    dispatch(setCreationExerciseCode(''))
  }

  function syncSubtitle(subtitle: string): void {
    dispatch(setCreationExerciseSubtitle(subtitle.trim() ? subtitle : null))
  }

  function cloneDuplicateExercise(): void {
    if (!duplicateExercise) {
      return
    }

    const title = `${duplicateExercise.title} variant`
    const nextExercise = {
      ...duplicateExercise,
      code: '',
      title
    }

    dispatch(
      startCreation({
        exercise: nextExercise,
        method: CreationMethod.Clone
      })
    )
    form.reset({
      subtitle: nextExercise.subtitle ?? '',
      title: nextExercise.title
    })
  }

  if (!exercise) {
    return <>Go back</>
  }

  return (
    <Form
      className="grid h-full min-w-0 grid-cols-[minmax(0,2fr)_minmax(0,1fr)] items-stretch overflow-hidden"
      onSubmit={(event) => {
        event.preventDefault()
        event.stopPropagation()
        void form.handleSubmit()
      }}
    >
      <Frame className="rounded-none px-6">
        <FrameTitle>exercise identity</FrameTitle>
        <FramePanel>
          <Fieldset>
            <form.Field name="title">
              {(field) => (
                <Field name={field.name}>
                  <FieldLabel className="font-heading">title</FieldLabel>
                  <InputGroup>
                    <InputGroupInput
                      onBlur={field.handleBlur}
                      onChange={(event) => {
                        field.handleChange(event.currentTarget.value)
                        syncTitle(event.currentTarget.value)
                      }}
                      required
                      size="lg"
                      type="text"
                      value={field.state.value}
                    />
                    <InputGroupAddon align="inline-start">
                      <BookA aria-hidden="true" />
                    </InputGroupAddon>
                  </InputGroup>
                  <FieldDescription>
                    The title of the exercise as it will appear to your athletes. Examples:
                    "Competition Deadlift", "Cable triceps extension"
                  </FieldDescription>
                </Field>
              )}
            </form.Field>
            <form.Field name="subtitle">
              {(field) => (
                <Field name={field.name}>
                  <FieldLabel className="font-heading">subtitle</FieldLabel>
                  <InputGroup>
                    <InputGroupTextarea
                      onBlur={field.handleBlur}
                      onChange={(event) => {
                        field.handleChange(event.currentTarget.value)
                        syncSubtitle(event.currentTarget.value)
                      }}
                      size="lg"
                      value={field.state.value}
                    />
                    <InputGroupAddon align="inline-start">
                      <BookText aria-hidden="true" />
                    </InputGroupAddon>
                  </InputGroup>
                  <FieldDescription>
                    A short description associated with the title. Example: "Standard deadlift
                    performed according to powerlifting competition rules"
                  </FieldDescription>
                </Field>
              )}
            </form.Field>
          </Fieldset>
        </FramePanel>
        <FrameFooter>
          <p className="text-xs">
            Each exercise has a unique code based on its title that serves as its identifier,
            meaning no two exercises can share the same code.
          </p>
          <div className="flex flex-col gap-3 px-4">
            {!hasTitle && (
              <Alert variant="info">
                <Info />
                <AlertTitle>Please specify a title so we can compute the code.</AlertTitle>
              </Alert>
            )}
            {hasTitle && !exerciseCodeQuery.currentData && (
              <Alert variant="info">
                <Info />
                <AlertTitle>
                  {exerciseCodeQuery.isFetching
                    ? 'Checking existing catalog...'
                    : 'Code check is waiting for the server.'}
                </AlertTitle>
                {code && (
                  <AlertDescription className="text-xs">
                    The last known code is <span className="font-mono">{code}</span>.
                  </AlertDescription>
                )}
              </Alert>
            )}
            {code && exerciseCodeQuery.currentData && !duplicateExercise && (
              <Alert variant="success">
                <CircleCheck />
                <AlertTitle>
                  <span className="font-mono">{code}</span> is unique.
                </AlertTitle>
              </Alert>
            )}
            {code && duplicateExercise && (
              <Alert variant="warning">
                <TriangleAlert />
                <AlertTitle>
                  <span className="font-mono">{code}</span> already exists.
                </AlertTitle>
                <AlertDescription className="flow-root text-xs">
                  This code identifies <strong>{duplicateExercise.title}</strong>. Choose a
                  different title, or clone this exercise to create a new variation.
                </AlertDescription>
                <AlertAction>
                  <Button onClick={cloneDuplicateExercise} size="xs" type="button" variant="ghost">
                    <CopyPlus />
                    Clone
                  </Button>
                </AlertAction>
              </Alert>
            )}
          </div>
        </FrameFooter>
      </Frame>

      <aside className="flex h-full min-w-0 flex-col gap-4 bg-gray-100 p-6">
        <div className="flex flex-wrap gap-2">
          <Badge variant={exercise.publicationStatus === 'published' ? 'success' : 'warning'}>
            {formatStatus(exercise.publicationStatus)}
          </Badge>
          <Badge variant="outline">{exercise.isSystem ? 'System' : 'Custom'}</Badge>
          <Badge variant="outline">{exercise.isUnilateral ? 'Unilateral' : 'Bilateral'}</Badge>
        </div>
        <div className="min-w-0">
          <div className="font-heading text-xl font-semibold">{exercise.title || 'Untitled'}</div>
          {exercise.subtitle && <p className="mt-1 text-sm text-gray-500">{exercise.subtitle}</p>}
          <div className="mt-3 font-mono text-xs text-gray-500">{code || 'No code yet'}</div>
        </div>
        <div className="bg-background relative flex min-h-72 flex-1 overflow-hidden rounded-lg border">
          {exercise.videoUrl ? (
            <video
              className="h-full w-full object-cover"
              controls
              muted
              src={exercise.videoUrl}
              title={`${exercise.title} video preview`}
            />
          ) : exercise.imageUrl ? (
            <img
              alt={`${exercise.title} preview`}
              className="h-full w-full object-cover"
              src={exercise.imageUrl}
            />
          ) : (
            <Empty className="min-h-full py-10">
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <ImageIcon />
                </EmptyMedia>
                <EmptyTitle>No media yet</EmptyTitle>
                <EmptyDescription>
                  Image and video upload will be connected in a later pass.
                </EmptyDescription>
              </EmptyHeader>
              <Badge variant="outline">
                <Video />
                Preview only
              </Badge>
            </Empty>
          )}
        </div>
      </aside>
    </Form>
  )
}
