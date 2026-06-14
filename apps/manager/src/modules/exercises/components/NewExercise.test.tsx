import { fireEvent, render, screen } from '@testing-library/react'
import { type PropsWithChildren, type ReactElement } from 'react'
import { Provider } from 'react-redux'

import { createTestStore } from '@/test/utils/store'

import { CreationMethod, startCreation, Step } from '../store'
import { NewExercise } from './NewExercise'

vi.mock('@powercoach/ui', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@powercoach/ui')>()

  return {
    ...actual,
    HorizontalPanel: ({
      children,
      onValueChange,
      value
    }: PropsWithChildren<{
      onValueChange: (value: string[]) => void
      value: string[]
    }>): ReactElement => (
      <div data-testid="horizontal-panel" data-value={value.join(',')}>
        <button onClick={() => onValueChange(['overview'])}>change step</button>
        {children}
      </div>
    ),
    HorizontalPanelContent: ({ children }: PropsWithChildren): ReactElement => <>{children}</>,
    HorizontalPanelItem: ({ children }: PropsWithChildren): ReactElement => <>{children}</>,
    HorizontalPanelTrigger: ({ children }: PropsWithChildren): ReactElement => <>{children}</>
  }
})

vi.mock('./NewExerciseCategorizationStep', () => ({
  NewExerciseCategorizationStep: () => <div>categorization</div>
}))

vi.mock('./NewExerciseInstructionsStep', () => ({
  NewExerciseInstructionsStep: () => <div>instructions</div>
}))

vi.mock('./NewExerciseMusclesStep', () => ({
  NewExerciseMusclesStep: () => <div>muscles</div>
}))

vi.mock('./NewExerciseOverviewStep', () => ({
  NewExerciseOverviewStep: ({ canNext, onNext }: { canNext: boolean; onNext: () => void }) => (
    <div>
      overview
      <button disabled={!canNext} onClick={onNext}>
        overview next
      </button>
    </div>
  )
}))

vi.mock('./NewExerciseReviewStep', () => ({
  NewExerciseReviewStep: () => <div>review</div>
}))

vi.mock('./NewExerciseStartStep', () => ({
  NewExerciseStartStep: ({ onStart }: { onStart: () => void }) => (
    <div>
      start
      <button onClick={onStart}>start from start step</button>
    </div>
  )
}))

vi.mock('./NewExerciseTrackingStep', () => ({
  NewExerciseTrackingStep: () => <div>tracking</div>
}))

function createExercise() {
  return {
    archivedAt: null,
    bodyweightCoefficient: null,
    code: 'competition_squat',
    createdAt: '2024-01-01T00:00:00.000Z',
    descriptionMarkdown: null,
    id: 1,
    imageUrl: null,
    isSystem: true,
    isUnilateral: false,
    loadingTypeId: 1,
    patternId: 1,
    publicationStatus: 'published' as const,
    shortInstructionsMarkdown: null,
    subtitle: null,
    title: 'Competition squat',
    updatedAt: '2024-01-01T00:00:00.000Z',
    videoUrl: null
  }
}

describe('NewExercise', () => {
  it('starts on the start step', () => {
    const store = createTestStore()

    render(
      <Provider store={store}>
        <NewExercise />
      </Provider>
    )

    expect(screen.getByTestId('horizontal-panel')).toHaveAttribute('data-value', Step.Start)
  })

  it('updates the active step from the horizontal panel', () => {
    const store = createTestStore()

    render(
      <Provider store={store}>
        <NewExercise />
      </Provider>
    )

    fireEvent.click(screen.getByRole('button', { name: 'change step' }))

    expect(screen.getByTestId('horizontal-panel')).toHaveAttribute('data-value', Step.Overview)
  })

  it('opens the overview step after starting from the start step', () => {
    const store = createTestStore()

    render(
      <Provider store={store}>
        <NewExercise />
      </Provider>
    )

    fireEvent.click(screen.getByRole('button', { name: 'start from start step' }))

    expect(screen.getByTestId('horizontal-panel')).toHaveAttribute('data-value', Step.Overview)
  })

  it('moves to the next step from the overview footer', () => {
    const store = createTestStore()
    const exercise = createExercise()

    store.dispatch(
      startCreation({
        currentExercise: exercise,
        currentExerciseRelationships: [],
        initialExercise: exercise,
        initialExerciseRelationships: [],
        method: CreationMethod.Blank
      })
    )

    render(
      <Provider store={store}>
        <NewExercise />
      </Provider>
    )

    fireEvent.click(screen.getByRole('button', { name: 'start from start step' }))
    fireEvent.click(screen.getByRole('button', { name: 'overview next' }))

    expect(screen.getByTestId('horizontal-panel')).toHaveAttribute(
      'data-value',
      Step.Categorization
    )
  })
})
