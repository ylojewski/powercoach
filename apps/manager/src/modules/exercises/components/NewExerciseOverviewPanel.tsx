import {
  Card,
  CardDescription,
  CardHeader,
  CardPanel,
  CardTitle,
  Field,
  FieldDescription,
  FieldLabel,
  Frame,
  FramePanel,
  Input
} from '@powercoach/ui'
import { ExternalLinkIcon, ImageIcon, VideoIcon } from 'lucide-react'
import { type ReactElement } from 'react'

import { useAppDispatch, useAppSelector } from '@/core'

import { getExerciseCreationCode } from '../exerciseCreation'
import {
  selectExerciseCreationDraft,
  selectExerciseCreationValidation,
  updateCreationDraft
} from '../store'
import { NewExercisePanel } from '../types'
import { NewExercisePanelFrame } from './NewExercisePanelFrame'

export function NewExerciseOverviewPanel(): ReactElement {
  const dispatch = useAppDispatch()
  const draft = useAppSelector(selectExerciseCreationDraft)
  const validation = useAppSelector(selectExerciseCreationValidation)
  const generatedCode = getExerciseCreationCode(draft)

  return (
    <NewExercisePanelFrame
      description="Set the exercise identity and reference media. The technical code is generated from the title and checked against the mocked catalog."
      errors={validation.panelErrors[NewExercisePanel.Overview]}
      isReady={Boolean(draft.title.trim() && !validation.codeConflictTitle)}
      title="Overview"
    >
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_24rem]">
        <div className="flex flex-col gap-6">
          <Frame>
            <FramePanel className="flex flex-col gap-5">
              <Field className="w-full">
                <FieldLabel>Title</FieldLabel>
                <Input
                  aria-invalid={validation.panelErrors[NewExercisePanel.Overview].length > 0 || undefined}
                  className="text-2xl font-semibold sm:text-2xl"
                  onChange={(event) =>
                    dispatch(updateCreationDraft({ title: event.currentTarget.value }))
                  }
                  placeholder="Paused belt squat"
                  size="lg"
                  value={draft.title}
                />
                <FieldDescription>
                  Code: <span className="font-medium">{generatedCode || 'new_exercise'}</span>.
                  Codes keep programs, logs, and reports stable.
                </FieldDescription>
                {validation.codeConflictTitle && (
                  <a
                    className="inline-flex w-fit items-center gap-1 text-sm font-medium text-destructive-foreground underline-offset-4 hover:underline"
                    href={`/exercise/${generatedCode}`}
                  >
                    <ExternalLinkIcon className="size-3.5" />
                    View existing exercise: {validation.codeConflictTitle}
                  </a>
                )}
              </Field>
              <Field className="w-full">
                <FieldLabel>Subtitle</FieldLabel>
                <Input
                  onChange={(event) =>
                    dispatch(updateCreationDraft({ subtitle: event.currentTarget.value }))
                  }
                  placeholder="Tempo control with a two-second pause"
                  value={draft.subtitle}
                />
              </Field>
            </FramePanel>
          </Frame>
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <ImageIcon className="size-4" />
                  Image
                </CardTitle>
                <CardDescription>Catalog thumbnail and quick visual cue.</CardDescription>
              </CardHeader>
              <CardPanel className="flex flex-col gap-4">
                <Field className="w-full">
                  <FieldLabel>Image URL</FieldLabel>
                  <Input
                    onChange={(event) =>
                      dispatch(updateCreationDraft({ imageUrl: event.currentTarget.value }))
                    }
                    placeholder="https://..."
                    type="url"
                    value={draft.imageUrl}
                  />
                </Field>
                <div className="flex aspect-video items-center justify-center rounded-lg border border-dashed bg-muted/50 text-sm text-muted-foreground">
                  <span className="flex items-center gap-2 px-4 text-center">
                    <ImageIcon className="size-4" />
                    {draft.imageUrl ? 'Image ready' : 'Image preview'}
                  </span>
                </div>
              </CardPanel>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <VideoIcon className="size-4" />
                  Video
                </CardTitle>
                <CardDescription>Execution reference for the coach and athlete.</CardDescription>
              </CardHeader>
              <CardPanel className="flex flex-col gap-4">
                <Field className="w-full">
                  <FieldLabel>Video URL</FieldLabel>
                  <Input
                    onChange={(event) =>
                      dispatch(updateCreationDraft({ videoUrl: event.currentTarget.value }))
                    }
                    placeholder="https://..."
                    type="url"
                    value={draft.videoUrl}
                  />
                </Field>
                <div className="flex aspect-video items-center justify-center rounded-lg border border-dashed bg-muted/50 text-sm text-muted-foreground">
                  <span className="flex items-center gap-2 px-4 text-center">
                    <VideoIcon className="size-4" />
                    {draft.videoUrl ? 'Video ready' : 'Video preview'}
                  </span>
                </div>
              </CardPanel>
            </Card>
          </div>
        </div>
        <ExerciseIdentityPreview generatedCode={generatedCode} />
      </div>
    </NewExercisePanelFrame>
  )
}

function ExerciseIdentityPreview({ generatedCode }: { generatedCode: string }): ReactElement {
  const draft = useAppSelector(selectExerciseCreationDraft)

  return (
    <Frame>
      <FramePanel className="flex flex-col gap-4">
        <div className="rounded-md bg-warning/8 px-3 py-1 text-center text-sm font-medium text-warning-foreground">
          Draft
        </div>
        <div className="flex flex-col gap-2">
          <div className="font-heading text-xl font-semibold">{draft.title || 'Untitled exercise'}</div>
          <p className="text-sm text-muted-foreground">{draft.subtitle || 'No subtitle yet.'}</p>
        </div>
        <div className="flex flex-wrap gap-2 text-xs">
          <span className="rounded border px-2 py-1">{generatedCode || 'new_exercise'}</span>
          <span className="rounded border px-2 py-1">{draft.roleCode}</span>
          <span className="rounded border px-2 py-1">{draft.loadingTypeCode}</span>
        </div>
      </FramePanel>
    </Frame>
  )
}
