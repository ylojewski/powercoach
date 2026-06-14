import {
  Field,
  FieldDescription,
  FieldLabel,
  Form,
  FrameTitle,
  InputGroupInput,
  InputGroupTextarea,
  ScrollArea
} from '@powercoach/ui'
import { useForm } from '@tanstack/react-form'
import { BookA, BookText } from 'lucide-react'
import { type ReactElement, useState } from 'react'

import { useAppDispatch, useAppSelector } from '@/core'

import { CreationMethod, selectCurrentCreation, updateCreationExercise } from '../store'
import { ExerciseCodeAlert } from './ExerciseCodeAlert'
import { MediaUploader, MediaUploaderActions, MediaUploaderProvider } from './MediaUploader'
import { NewExerciseStepFooter, type NewExerciseStepFooterProps } from './NewExerciseStepFooter'

const CODE_TITLE_DEBOUNCE_MS = 1000
const IDENTITY_CONTROL_CLASS =
  'group flex w-full min-w-0 border border-foreground/30 bg-background transition-[border-color,box-shadow,translate] duration-150 focus-within:-translate-x-0.5 focus-within:-translate-y-0.5 focus-within:border-foreground focus-within:shadow-[4px_4px_0_0_--theme(--color-foreground)]'
const IDENTITY_INPUT_ICON_CLASS =
  'flex w-9 shrink-0 items-start justify-center border-e border-foreground/30 bg-muted pt-2.5 text-muted-foreground transition-colors duration-150 group-focus-within:border-foreground group-focus-within:bg-foreground group-focus-within:text-background [&_svg]:size-4 [&_svg]:opacity-100'
const IDENTITY_INPUT_CONTROL_CLASS = 'min-w-0 flex-1'
const IDENTITY_TEXTAREA_CONTROL_CLASS = `${IDENTITY_INPUT_CONTROL_CLASS} [&_textarea]:resize-none`

export function NewExerciseOverviewStep({
  canNext,
  onNext
}: NewExerciseStepFooterProps): ReactElement {
  const dispatch = useAppDispatch()
  const currentCreation = useAppSelector(selectCurrentCreation)
  const exercise = currentCreation?.exercise
  const displayedCode = currentCreation?.method === CreationMethod.Blank ? exercise?.code : null
  const [title, setTitle] = useState(exercise?.title ?? '')
  const [isTitlePending, setIsTitlePending] = useState(false)
  const form = useForm({
    defaultValues: {
      subtitle: exercise?.subtitle ?? '',
      title: exercise?.title ?? ''
    },
    listeners: {
      onChange: ({ fieldApi, formApi }) => {
        const { subtitle, title } = formApi.state.values
        const titleChanged = fieldApi.name === 'title'

        if (titleChanged) {
          setTitle('')
          setIsTitlePending(Boolean(title))
        }

        dispatch(
          updateCreationExercise({
            ...(titleChanged && { code: '' }),
            subtitle: subtitle.trim() ? subtitle : null,
            title
          })
        )
      }
    }
  })

  if (!exercise) {
    return <>Go back</>
  }

  return (
    <Form
      className="flex h-full min-h-0 min-w-0 flex-col gap-0 overflow-hidden"
      onSubmit={(event) => {
        event.preventDefault()
        event.stopPropagation()
        void form.handleSubmit()
      }}
    >
      <div className="grid min-h-0 flex-1 grid-cols-[minmax(0,2.5fr)_minmax(0,1fr)] items-stretch gap-0 overflow-hidden">
        <div className="flex h-full min-h-0 flex-col">
          <ScrollArea className="min-h-0 flex-1">
            <div className="min-h-full pt-6">
              <FrameTitle>identity</FrameTitle>
              <div>
                <form.Field
                  listeners={{
                    onChange: ({ value }) => {
                      setTitle(value)
                      setIsTitlePending(false)
                    },
                    onChangeDebounceMs: CODE_TITLE_DEBOUNCE_MS
                  }}
                  name="title"
                >
                  {(field) => (
                    <Field className="gap-3 p-5" name={field.name}>
                      <FieldLabel className="font-heading lowercase after:content-['*']">
                        Title
                      </FieldLabel>
                      <div className={IDENTITY_CONTROL_CLASS}>
                        <span className={IDENTITY_INPUT_ICON_CLASS}>
                          <BookA aria-hidden="true" />
                        </span>
                        <InputGroupInput
                          className={IDENTITY_INPUT_CONTROL_CLASS}
                          onBlur={field.handleBlur}
                          onChange={(event) => {
                            field.handleChange(event.currentTarget.value)
                          }}
                          required
                          size="lg"
                          type="text"
                          value={field.state.value ?? ''}
                        />
                      </div>
                      <FieldDescription className="text-xs">
                        The title as athletes will see it. Examples: "Competition deadlift", "Cable
                        triceps extension"
                      </FieldDescription>
                    </Field>
                  )}
                </form.Field>
                <form.Field name="subtitle">
                  {(field) => (
                    <Field className="gap-3 p-5 pt-0" name={field.name}>
                      <FieldLabel className="font-heading lowercase">Subtitle</FieldLabel>
                      <div className={IDENTITY_CONTROL_CLASS}>
                        <span className={IDENTITY_INPUT_ICON_CLASS}>
                          <BookText aria-hidden="true" />
                        </span>
                        <InputGroupTextarea
                          className={IDENTITY_TEXTAREA_CONTROL_CLASS}
                          onBlur={field.handleBlur}
                          onChange={(event) => {
                            field.handleChange(event.currentTarget.value)
                          }}
                          size="lg"
                          value={field.state.value ?? ''}
                        />
                      </div>
                      <FieldDescription className="text-xs">
                        A short description associated with the title. Example: "Standard deadlift
                        performed according to powerlifting competition rules"
                      </FieldDescription>
                    </Field>
                  )}
                </form.Field>
                <div className="p-5 pt-0">
                  <ExerciseCodeAlert
                    code={displayedCode}
                    isTitlePending={isTitlePending}
                    onCodeChange={(code: string) => dispatch(updateCreationExercise({ code }))}
                    title={title}
                  />
                </div>
              </div>
            </div>
          </ScrollArea>
        </div>
        <MediaUploaderProvider>
          <div className="flex h-full min-h-0 flex-col bg-hatched pt-6">
            <div className="flex items-center justify-between">
              <FrameTitle>gallery</FrameTitle>
              <MediaUploaderActions className="mr-5" />
            </div>
            <MediaUploader className="min-h-0 p-2" />
          </div>
        </MediaUploaderProvider>
      </div>
      <NewExerciseStepFooter canNext={canNext} onNext={onNext} />
    </Form>
  )
}
