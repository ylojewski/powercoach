import {
  Card,
  CardDescription,
  CardHeader,
  CardPanel,
  CardTitle,
  FramePanel,
  Tabs,
  TabsList,
  TabsPanel,
  TabsTab,
  Textarea
} from '@powercoach/ui'
import { type ReactElement } from 'react'

import { useAppDispatch, useAppSelector } from '@/core'

import {
  selectExerciseCreationDraft,
  selectExerciseCreationValidation,
  updateCreationDraft
} from '../store'
import { NewExercisePanel } from '../types'
import { NewExercisePanelFrame } from './NewExercisePanelFrame'

function renderMarkdownPreview(markdown: string): ReactElement {
  const lines = markdown
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)

  if (lines.length === 0) {
    return <span className="text-sm text-muted-foreground">No description yet.</span>
  }

  return (
    <div className="flex flex-col gap-2 text-sm">
      {lines.map((line, index) =>
        line.startsWith('## ') ? (
          <div className="font-semibold" key={`${line}-${index}`}>
            {line.replace(/^##\s+/, '')}
          </div>
        ) : (
          <p className="text-muted-foreground" key={`${line}-${index}`}>
            {line}
          </p>
        )
      )}
    </div>
  )
}

export function NewExerciseInstructionsPanel(): ReactElement {
  const dispatch = useAppDispatch()
  const draft = useAppSelector(selectExerciseCreationDraft)
  const validation = useAppSelector(selectExerciseCreationValidation)

  return (
    <NewExercisePanelFrame
      description="Write athlete-facing cues and the deeper markdown explanation for setup, execution, and intent."
      errors={validation.panelErrors[NewExercisePanel.Instructions]}
      isReady={Boolean(draft.shortInstructionsMarkdown.trim())}
      title="Instructions"
    >
      <div className="grid gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Short cues</CardTitle>
            <CardDescription>Compact guidance for the training view.</CardDescription>
          </CardHeader>
          <CardPanel>
            <Tabs defaultValue="write">
              <TabsList>
                <TabsTab value="write">Write</TabsTab>
                <TabsTab value="preview">Preview</TabsTab>
              </TabsList>
              <TabsPanel value="write">
                <Textarea
                  className="min-h-32 resize-y"
                  onChange={(event) =>
                    dispatch(
                      updateCreationDraft({
                        shortInstructionsMarkdown: event.currentTarget.value
                      })
                    )
                  }
                  placeholder="Brace, sit between the hips, pause, then drive evenly."
                  value={draft.shortInstructionsMarkdown}
                />
              </TabsPanel>
              <TabsPanel value="preview">
                <FramePanel className="min-h-32 text-sm">
                  {draft.shortInstructionsMarkdown || (
                    <span className="text-muted-foreground">No cues yet.</span>
                  )}
                </FramePanel>
              </TabsPanel>
            </Tabs>
          </CardPanel>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Full description</CardTitle>
            <CardDescription>Markdown notes for setup and execution.</CardDescription>
          </CardHeader>
          <CardPanel>
            <Tabs defaultValue="write">
              <TabsList>
                <TabsTab value="write">Write</TabsTab>
                <TabsTab value="preview">Preview</TabsTab>
              </TabsList>
              <TabsPanel value="write">
                <Textarea
                  className="min-h-56 resize-y"
                  onChange={(event) =>
                    dispatch(updateCreationDraft({ descriptionMarkdown: event.currentTarget.value }))
                  }
                  placeholder="## Setup&#10;Place the belt low and center the feet.&#10;&#10;## Execution&#10;Control the descent and pause without losing tension."
                  value={draft.descriptionMarkdown}
                />
              </TabsPanel>
              <TabsPanel value="preview">
                <FramePanel className="min-h-56">
                  {renderMarkdownPreview(draft.descriptionMarkdown)}
                </FramePanel>
              </TabsPanel>
            </Tabs>
          </CardPanel>
        </Card>
      </div>
    </NewExercisePanelFrame>
  )
}
