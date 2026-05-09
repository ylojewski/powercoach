import { Badge, Frame, FramePanel } from '@powercoach/ui'
import { AlertCircleIcon } from 'lucide-react'
import { type ReactElement, type ReactNode } from 'react'

export interface NewExercisePanelFrameProps {
  children: ReactNode
  description: string
  errors?: string[]
  isReady?: boolean
  title: string
}

export function NewExercisePanelFrame({
  children,
  description,
  errors = [],
  isReady = false,
  title
}: NewExercisePanelFrameProps): ReactElement {
  const badgeVariant = errors.length > 0 ? 'error' : isReady ? 'success' : 'secondary'
  const badgeText = errors.length > 0 ? 'Needs attention' : isReady ? 'Ready' : 'Not started'

  return (
    <div className="flex h-full flex-col overflow-y-auto">
      <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 p-6 pb-16">
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-heading text-2xl leading-none font-semibold">{title}</h3>
            <Badge variant={badgeVariant}>{badgeText}</Badge>
          </div>
          <p className="max-w-3xl text-sm text-muted-foreground">{description}</p>
          {errors.length > 0 && (
            <Frame className="bg-destructive/8">
              <FramePanel className="flex flex-col gap-2 border-destructive/24 bg-destructive/4 text-sm text-destructive-foreground">
                {errors.map((error) => (
                  <div className="flex items-start gap-2" key={error}>
                    <AlertCircleIcon className="mt-0.5 size-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                ))}
              </FramePanel>
            </Frame>
          )}
        </div>
        {children}
      </div>
    </div>
  )
}
