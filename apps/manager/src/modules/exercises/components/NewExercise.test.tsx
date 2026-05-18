import { fireEvent, render, screen } from '@testing-library/react'
import { type PropsWithChildren, type ReactElement } from 'react'
import { Provider } from 'react-redux'

import { createTestStore } from '@/test/utils/store'

import { selectCreationStep, Step } from '../store'
import { NewExercise } from './NewExercise'

vi.mock('@powercoach/ui', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@powercoach/ui')>()

  return {
    ...actual,
    HorizontalPanel: ({
      children,
      onValueChange
    }: PropsWithChildren<{
      onValueChange: (value: string[]) => void
    }>): ReactElement => (
      <div>
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

vi.mock('./NewExerciseCategorizationPanel', () => ({
  NewExerciseCategorizationPanel: () => <div>categorization</div>
}))

vi.mock('./NewExerciseInstructionsPanel', () => ({
  NewExerciseInstructionsPanel: () => <div>instructions</div>
}))

vi.mock('./NewExerciseMusclesPanel', () => ({
  NewExerciseMusclesPanel: () => <div>muscles</div>
}))

vi.mock('./NewExerciseOverviewPanel', () => ({
  NewExerciseOverviewPanel: () => <div>overview</div>
}))

vi.mock('./NewExerciseReviewPanel', () => ({
  NewExerciseReviewPanel: () => <div>review</div>
}))

vi.mock('./NewExerciseSourcePanel', () => ({
  NewExerciseSourcePanel: () => <div>start</div>
}))

vi.mock('./NewExerciseTrackingPanel', () => ({
  NewExerciseTrackingPanel: () => <div>tracking</div>
}))

describe('NewExercise', () => {
  it('updates the current step from the horizontal panel', () => {
    const store = createTestStore()

    render(
      <Provider store={store}>
        <NewExercise />
      </Provider>
    )

    fireEvent.click(screen.getByRole('button', { name: 'change step' }))

    expect(selectCreationStep(store.getState())).toBe(Step.Overview)
  })
})
