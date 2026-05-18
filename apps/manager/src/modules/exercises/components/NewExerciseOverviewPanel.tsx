import { Field, FieldLabel, Form, Input } from '@powercoach/ui'
import { type ReactElement, useEffect, useState } from 'react'

import { useAppDispatch, useAppSelector } from '@/core'

import { selectCurrentCreation, setCreationExerciseTitle } from '../store'

export function NewExerciseOverviewPanel(): ReactElement {
  const dispatch = useAppDispatch()
  const { exercise } = useAppSelector(selectCurrentCreation) ?? {}
  const [title, setTitle] = useState(exercise?.title ?? '')

  useEffect(() => {
    dispatch(setCreationExerciseTitle(title))
  }, [title])

  if (!exercise) {
    return <>Go back</>
  }

  return (
    <Form className="flex max-w-64 flex-col gap-4 p-8">
      <Field name="title">
        <FieldLabel>Title</FieldLabel>
        <Input defaultValue={title} required type="text" onValueChange={setTitle} />
      </Field>
    </Form>
  )
}
