import {
  Field,
  FieldDescription,
  FieldLabel,
  Fieldset,
  Form,
  Frame,
  FrameFooter,
  FramePanel,
  FrameTitle,
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupTextarea,
  ScrollArea
} from '@powercoach/ui'
import { useForm } from '@tanstack/react-form'
import { BookA, BookText } from 'lucide-react'
import { useState } from 'react'

import { useAppDispatch, useAppSelector } from '@/core'

import { selectCurrentCreation, updateCreationExercise } from '../store'
import { ExerciseCodeAlert } from './ExerciseCodeAlert'
import { MediaUploader, MediaUploaderActions } from './MediaUploader'

const CODE_TITLE_DEBOUNCE_MS = 500

export function NewExerciseOverviewStep() {
  const dispatch = useAppDispatch()
  const currentCreation = useAppSelector(selectCurrentCreation)
  const exercise = currentCreation?.exercise
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

        if (fieldApi.name === 'title') {
          setTitle('')
          setIsTitlePending(Boolean(title))
        }

        dispatch(
          updateCreationExercise({
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
      className="grid h-full min-h-0 min-w-0 grid-cols-[minmax(0,2.5fr)_minmax(0,1fr)] items-stretch gap-0 overflow-hidden"
      onSubmit={(event) => {
        event.preventDefault()
        event.stopPropagation()
        void form.handleSubmit()
      }}
    >
      <ScrollArea className="h-full">
        <Frame className="min-h-full rounded-none p-6">
          <FrameTitle>identity</FrameTitle>
          <FramePanel>
            <Fieldset>
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
                  <Field name={field.name}>
                    <FieldLabel className="font-heading lowercase">Title</FieldLabel>
                    <InputGroup>
                      <InputGroupInput
                        onBlur={field.handleBlur}
                        onChange={(event) => {
                          field.handleChange(event.currentTarget.value)
                        }}
                        required
                        size="lg"
                        type="text"
                        value={field.state.value ?? ''}
                      />
                      <InputGroupAddon align="inline-start">
                        <BookA aria-hidden="true" />
                      </InputGroupAddon>
                    </InputGroup>
                    <FieldDescription>
                      <span className="block">
                        The title of the exercise as it will appear to your athletes
                      </span>
                      <span className="block">
                        Examples: "Competition deadlift", "Cable triceps extension"
                      </span>
                    </FieldDescription>
                  </Field>
                )}
              </form.Field>
              <form.Field name="subtitle">
                {(field) => (
                  <Field name={field.name}>
                    <FieldLabel className="font-heading lowercase">Subtitle</FieldLabel>
                    <InputGroup>
                      <InputGroupTextarea
                        onBlur={field.handleBlur}
                        onChange={(event) => {
                          field.handleChange(event.currentTarget.value)
                        }}
                        size="lg"
                        value={field.state.value ?? ''}
                      />
                      <InputGroupAddon align="inline-start">
                        <BookText aria-hidden="true" />
                      </InputGroupAddon>
                    </InputGroup>
                    <FieldDescription>
                      <span className="block">A short description associated with the title</span>
                      <span className="block">
                        Example: "Standard deadlift performed according to powerlifting competition
                        rules"
                      </span>
                    </FieldDescription>
                  </Field>
                )}
              </form.Field>
            </Fieldset>
          </FramePanel>
          <FrameFooter className="px-0 py-6">
            <ExerciseCodeAlert
              isTitlePending={isTitlePending}
              onCodeChange={(code: string) => dispatch(updateCreationExercise({ code }))}
              title={title}
            />
          </FrameFooter>
        </Frame>
      </ScrollArea>
      <div className="bg-hatched flex h-full min-h-0 flex-col pt-6">
        <div className="flex items-center justify-between">
          <FrameTitle>gallery</FrameTitle>
          <MediaUploaderActions className="mr-5" />
        </div>
        <MediaUploader className="min-h-0 bg-background" />
      </div>
    </Form>
  )
}
