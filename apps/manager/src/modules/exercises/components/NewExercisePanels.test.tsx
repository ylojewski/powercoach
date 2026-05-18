import { fireEvent, render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'

import { createTestStore } from '@/test/utils/store'

import { CreationMethod, selectCurrentCreation, startCreation } from '../store'
import { NewExercise } from './NewExercise'
import { NewExerciseActions } from './NewExerciseActions'
import { NewExerciseCategorizationPanel } from './NewExerciseCategorizationPanel'
import { NewExerciseInstructionsPanel } from './NewExerciseInstructionsPanel'
import { NewExerciseMusclesPanel } from './NewExerciseMusclesPanel'
import { NewExerciseOverviewPanel } from './NewExerciseOverviewPanel'
import { NewExerciseReviewPanel } from './NewExerciseReviewPanel'
import { NewExerciseTrackingPanel } from './NewExerciseTrackingPanel'

const exercise = {
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
  publicationStatus: 'published',
  shortInstructionsMarkdown: null,
  subtitle: null,
  title: 'Competition squat',
  updatedAt: '2024-01-01T00:00:00.000Z',
  videoUrl: null
} as const

describe('NewExercise panels', () => {
  it.each([
    ['actions', NewExerciseActions, 'Actions'],
    ['categorization', NewExerciseCategorizationPanel, 'Categorization'],
    ['instructions', NewExerciseInstructionsPanel, 'Instructions'],
    ['review', NewExerciseReviewPanel, 'Review'],
    ['tracking', NewExerciseTrackingPanel, 'Tracking']
  ])('renders the %s panel', (_, Panel, text) => {
    render(<Panel />)

    expect(screen.getByText(text)).toBeInTheDocument()
  })

  it('renders the muscle panel and trigger', () => {
    render(<NewExerciseMusclesPanel />)

    expect(screen.getByText('Muscles')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Add muscles' })).toBeInTheDocument()
  })

  it('renders a fallback when the overview has no current creation', () => {
    render(
      <Provider store={createTestStore()}>
        <NewExerciseOverviewPanel />
      </Provider>
    )

    expect(screen.getByText('Go back')).toBeInTheDocument()
  })

  it('updates the current creation title from the overview', () => {
    const store = createTestStore()

    store.dispatch(startCreation({ exercise, method: CreationMethod.Clone }))

    render(
      <Provider store={store}>
        <NewExerciseOverviewPanel />
      </Provider>
    )

    fireEvent.change(screen.getByLabelText('Title'), {
      target: { value: 'Paused competition squat' }
    })

    expect(selectCurrentCreation(store.getState())?.exercise.title).toBe('Paused competition squat')
  })

  it('renders the horizontal panel shell', () => {
    render(
      <Provider store={createTestStore()}>
        <NewExercise />
      </Provider>
    )

    expect(screen.getByTestId('new-exercise')).toBeInTheDocument()
    expect(screen.getAllByText('start')).toHaveLength(2)
    expect(screen.getByText('Actions')).toBeInTheDocument()
  })
})
