import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { Provider } from 'react-redux'

import { type Exercise, type GetExerciseCodeApiResponse } from '@/core'
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

function createExerciseCodeResponse(response: GetExerciseCodeApiResponse): Response {
  return new Response(JSON.stringify(response), {
    headers: { 'Content-Type': 'application/json' },
    status: 200
  })
}

function stubExerciseCodeFetch(response: GetExerciseCodeApiResponse): void {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue(createExerciseCodeResponse(response)))
}

function startExerciseCreation(
  store: ReturnType<typeof createTestStore>,
  currentExercise: Exercise,
  method: CreationMethod,
  initialExercise = currentExercise
): void {
  store.dispatch(startCreation({ currentExercise, initialExercise, method }))
}

describe('NewExercise steps', () => {
  afterEach(() => {
    vi.useRealTimers()
    vi.unstubAllGlobals()
  })

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

    startExerciseCreation(store, exercise, CreationMethod.Clone)

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

  it('waits for the debounced title before requesting a generated code', async () => {
    vi.useFakeTimers()
    const store = createTestStore()
    const fetchMock = vi
      .fn()
      .mockResolvedValue(createExerciseCodeResponse(uniqueExerciseCodeResponse))

    vi.stubGlobal('fetch', fetchMock)
    startExerciseCreation(store, exercise, CreationMethod.Clone)

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
    expect(screen.getByText('Computing code')).toBeInTheDocument()
    expect(fetchMock).not.toHaveBeenCalled()

    await act(async () => {
      vi.advanceTimersByTime(999)
    })

    expect(fetchMock).not.toHaveBeenCalled()

    await act(async () => {
      vi.advanceTimersByTime(1)
    })

    vi.useRealTimers()

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledTimes(1)
    })
  })

  it('syncs the server generated code from the overview', async () => {
    const store = createTestStore()

    startExerciseCreation(
      store,
      createExercise({
        code: '',
        title: 'Paused competition squat'
      }),
      CreationMethod.Blank
    )
    stubExerciseCodeFetch(uniqueExerciseCodeResponse)

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

    startExerciseCreation(store, exercise, CreationMethod.Clone)

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

    startExerciseCreation(store, createExercise({ code: '', title: '' }), CreationMethod.Blank)

    render(
      <Provider store={store}>
        <NewExerciseOverviewStep />
      </Provider>
    )

    expect(
      screen.getByText('Please specify a title so we can compute the code.')
    ).toBeInTheDocument()
  })

  it('renders a provided code without requesting it on mount', () => {
    const store = createTestStore()

    startExerciseCreation(
      store,
      createExercise({
        code: 'stored_code',
        title: 'Stored code'
      }),
      CreationMethod.Blank
    )

    render(
      <Provider store={store}>
        <NewExerciseOverviewStep />
      </Provider>
    )

    expect(screen.getAllByText('stored_code')).not.toHaveLength(0)
    expect(screen.getByText(/is unique/i)).toBeInTheDocument()
    expect(Object.keys(store.getState().api.queries)).toHaveLength(0)
  })

  it('renders the unique generated code state from the server', async () => {
    const store = createTestStore()

    startExerciseCreation(
      store,
      createExercise({
        code: '',
        title: 'Paused competition squat'
      }),
      CreationMethod.Blank
    )
    stubExerciseCodeFetch(uniqueExerciseCodeResponse)

    render(
      <Provider store={store}>
        <NewExerciseOverviewStep />
      </Provider>
    )

    await waitFor(() => {
      expect(screen.getAllByText('paused_competition_squat')).not.toHaveLength(0)
    })
    expect(screen.getByText(/is unique/i)).toBeInTheDocument()
  })

  it('renders the duplicate code warning', async () => {
    const store = createTestStore()

    startExerciseCreation(store, createExercise({ code: '' }), CreationMethod.Blank)
    stubExerciseCodeFetch(duplicateExerciseCodeResponse)

    render(
      <Provider store={store}>
        <NewExerciseOverviewStep />
      </Provider>
    )

    await waitFor(() => {
      expect(screen.getByText(/already exists/i)).toBeInTheDocument()
    })
    expect(screen.queryByRole('button', { name: 'Clone' })).not.toBeInTheDocument()
  })

  it('renders the media gallery', () => {
    const store = createTestStore()

    startExerciseCreation(store, exercise, CreationMethod.Clone)

    render(
      <Provider store={store}>
        <NewExerciseOverviewStep />
      </Provider>
    )

    expect(screen.getByText('gallery')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Move media 1' })).toHaveTextContent('1')
    expect(screen.getByRole('button', { name: 'Move media 2' })).toHaveTextContent('2')
    expect(screen.getByRole('button', { name: 'Move media 3' })).toHaveTextContent('3')
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
