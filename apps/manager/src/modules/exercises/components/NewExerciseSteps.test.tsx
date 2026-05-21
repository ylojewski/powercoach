import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { Provider } from 'react-redux'

import { api, type Exercise, type GetExerciseCodeApiResponse } from '@/core'
import { createTestStore } from '@/test/utils/store'

import { CreationMethod, selectCurrentCreation, startCreation } from '../store'
import { NewExercise } from './NewExercise'
import { NewExerciseActions } from './NewExerciseActions'
import { NewExerciseCategorizationStep } from './NewExerciseCategorizationStep'
import { NewExerciseInstructionsStep } from './NewExerciseInstructionsStep'
import { NewExerciseMusclesStep } from './NewExerciseMusclesStep'
import { NewExerciseOverviewStep } from './NewExerciseOverviewStep'
import { NewExerciseReviewStep } from './NewExerciseReviewStep'
import { NewExerciseTrackingStep } from './NewExerciseTrackingStep'

function createExercise(overrides: Partial<Exercise> = {}): Exercise {
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
    publicationStatus: 'published',
    shortInstructionsMarkdown: null,
    subtitle: null,
    title: 'Competition squat',
    updatedAt: '2024-01-01T00:00:00.000Z',
    videoUrl: null,
    ...overrides
  }
}

const exercise = createExercise()
const duplicateExerciseCodeResponse = {
  code: 'competition_squat',
  exercise
} satisfies GetExerciseCodeApiResponse
const uniqueExerciseCodeResponse = {
  code: 'paused_competition_squat',
  exercise: null
} satisfies GetExerciseCodeApiResponse

async function seedExerciseCode(
  store: ReturnType<typeof createTestStore>,
  title: string,
  response: GetExerciseCodeApiResponse
): Promise<void> {
  await act(async () => {
    await store.dispatch(api.util.upsertQueryData('getExerciseCode', { title }, response))
  })
}

describe('NewExercise steps', () => {
  it.each([
    ['actions', NewExerciseActions, 'Actions'],
    ['categorization', NewExerciseCategorizationStep, 'Categorization'],
    ['instructions', NewExerciseInstructionsStep, 'Instructions'],
    ['review', NewExerciseReviewStep, 'Review'],
    ['tracking', NewExerciseTrackingStep, 'Tracking']
  ])('renders the %s step', (_, StepComponent, text) => {
    render(<StepComponent />)

    expect(screen.getByText(text)).toBeInTheDocument()
  })

  it('renders the muscle step and trigger', () => {
    render(<NewExerciseMusclesStep />)

    expect(screen.getByText('Muscles')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Add muscles' })).toBeInTheDocument()
  })

  it('renders a fallback when the overview has no current creation', () => {
    render(
      <Provider store={createTestStore()}>
        <NewExerciseOverviewStep />
      </Provider>
    )

    expect(screen.getByText('Go back')).toBeInTheDocument()
  })

  it('updates the current creation title and clears stale code from the overview', () => {
    const store = createTestStore()

    store.dispatch(startCreation({ exercise, method: CreationMethod.Clone }))

    render(
      <Provider store={store}>
        <NewExerciseOverviewStep />
      </Provider>
    )

    fireEvent.change(screen.getByLabelText('Title'), {
      target: { value: 'Paused competition squat' }
    })

    expect(selectCurrentCreation(store.getState())?.exercise.title).toBe('Paused competition squat')
    expect(selectCurrentCreation(store.getState())?.exercise.code).toBe('')
  })

  it('syncs the server generated code from the overview', async () => {
    const store = createTestStore()

    store.dispatch(
      startCreation({
        exercise: createExercise({
          code: '',
          title: 'Paused competition squat'
        }),
        method: CreationMethod.Blank
      })
    )
    await seedExerciseCode(store, 'Paused competition squat', uniqueExerciseCodeResponse)

    render(
      <Provider store={store}>
        <NewExerciseOverviewStep />
      </Provider>
    )

    await waitFor(() => {
      expect(selectCurrentCreation(store.getState())?.exercise.code).toBe(
        'paused_competition_squat'
      )
    })
  })

  it('updates the current creation subtitle from the overview', () => {
    const store = createTestStore()

    store.dispatch(startCreation({ exercise, method: CreationMethod.Clone }))

    render(
      <Provider store={store}>
        <NewExerciseOverviewStep />
      </Provider>
    )

    fireEvent.change(screen.getByLabelText('Subtitle'), {
      target: { value: 'Paused variation' }
    })

    expect(selectCurrentCreation(store.getState())?.exercise.subtitle).toBe('Paused variation')
  })

  it('renders the missing title code prompt', () => {
    const store = createTestStore()

    store.dispatch(
      startCreation({
        exercise: createExercise({ code: '', title: '' }),
        method: CreationMethod.Blank
      })
    )

    render(
      <Provider store={store}>
        <NewExerciseOverviewStep />
      </Provider>
    )

    expect(
      screen.getByText('Please specify a title so we can compute the code.')
    ).toBeInTheDocument()
  })

  it('renders the unique generated code state from the server', async () => {
    const store = createTestStore()

    store.dispatch(
      startCreation({
        exercise: createExercise({
          code: 'paused_competition_squat',
          title: 'Paused competition squat'
        }),
        method: CreationMethod.Blank
      })
    )
    await seedExerciseCode(store, 'Paused competition squat', uniqueExerciseCodeResponse)

    render(
      <Provider store={store}>
        <NewExerciseOverviewStep />
      </Provider>
    )

    expect(screen.getAllByText('paused_competition_squat')).not.toHaveLength(0)
    expect(screen.getByText(/is unique/i)).toBeInTheDocument()
  })

  it('renders the duplicate code warning and clones it as a variant', async () => {
    const store = createTestStore()

    store.dispatch(startCreation({ exercise, method: CreationMethod.Blank }))
    await seedExerciseCode(store, 'Competition squat', duplicateExerciseCodeResponse)

    render(
      <Provider store={store}>
        <NewExerciseOverviewStep />
      </Provider>
    )

    expect(screen.getByText(/already exists/i)).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Clone' }))

    expect(selectCurrentCreation(store.getState())?.exercise.title).toBe(
      'Competition squat variant'
    )
    expect(selectCurrentCreation(store.getState())?.exercise.code).toBe('')
  })

  it('renders the media preview empty state', () => {
    const store = createTestStore()

    store.dispatch(startCreation({ exercise, method: CreationMethod.Clone }))

    render(
      <Provider store={store}>
        <NewExerciseOverviewStep />
      </Provider>
    )

    expect(screen.getByText('No media yet')).toBeInTheDocument()
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
