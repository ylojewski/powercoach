import { Button } from '@powercoach/ui'
import { type ReactElement } from 'react'

export interface NewExerciseStepFooterProps {
  canNext?: boolean
  onNext?: () => void
}

export function NewExerciseStepFooter({
  canNext = false,
  onNext
}: NewExerciseStepFooterProps): ReactElement {
  return (
    <footer className="flex min-h-16 shrink-0 items-center justify-end border-t bg-accent px-5 py-3">
      <Button
        disabled={!canNext}
        onClick={onNext}
        size="lg"
        variant={canNext ? 'default' : 'outline'}
      >
        Next
      </Button>
    </footer>
  )
}
