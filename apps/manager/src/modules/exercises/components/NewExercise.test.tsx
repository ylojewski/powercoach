import { fireEvent, render, screen } from '@testing-library/react'
import { type PropsWithChildren, type ReactElement } from 'react'
import { Provider } from 'react-redux'

import { createTestStore } from '@/test/utils/store'

import { selectCreationResumeStep, setCreationResumeStep, Step } from '../store'
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

vi.mock('./NewExerciseActions', () => ({
  NewExerciseActions: () => <div>actions</div>
}))

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
  NewExerciseOverviewStep: () => <div>overview</div>
}))

vi.mock('./NewExerciseReviewStep', () => ({
  NewExerciseReviewStep: () => <div>review</div>
}))

vi.mock('./NewExerciseStartStep', () => ({
  NewExerciseStartStep: ({
    onResume,
    onStart,
    resumeActionLabel
  }: {
    onResume: () => void
    onStart: () => void
    resumeActionLabel: string
  }) => (
    <div>
      start
      <span>{resumeActionLabel}</span>
      <button onClick={onResume}>resume start step</button>
      <button onClick={onStart}>start from start step</button>
    </div>
  )
}))

vi.mock('./NewExerciseTrackingStep', () => ({
  NewExerciseTrackingStep: () => <div>tracking</div>
}))

describe('NewExercise', () => {
  it('starts on the start step even when a resume step exists', () => {
    const store = createTestStore()

    store.dispatch(setCreationResumeStep(Step.Muscles))

    render(
      <Provider store={store}>
        <NewExercise />
      </Provider>
    )

    expect(screen.getByTestId('horizontal-panel')).toHaveAttribute('data-value', Step.Start)
    expect(screen.getByText('Resume at muscles')).toBeInTheDocument()
  })

  it('updates the resume step from the horizontal panel', () => {
    const store = createTestStore()

    render(
      <Provider store={store}>
        <NewExercise />
      </Provider>
    )

    fireEvent.click(screen.getByRole('button', { name: 'change step' }))

    expect(screen.getByTestId('horizontal-panel')).toHaveAttribute('data-value', Step.Overview)
    expect(selectCreationResumeStep(store.getState())).toBe(Step.Overview)
  })

  it('resumes the last active step from the start step', () => {
    const store = createTestStore()

    store.dispatch(setCreationResumeStep(Step.Muscles))

    render(
      <Provider store={store}>
        <NewExercise />
      </Provider>
    )

    fireEvent.click(screen.getByRole('button', { name: 'resume start step' }))

    expect(screen.getByTestId('horizontal-panel')).toHaveAttribute('data-value', Step.Muscles)
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
})
