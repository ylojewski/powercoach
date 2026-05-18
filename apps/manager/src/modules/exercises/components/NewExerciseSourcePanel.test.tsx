import { act, fireEvent, render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'

import { type GetReferencesApiResponse } from '@/core'
import { useReferences } from '@/modules/references'
import { createTestStore } from '@/test/utils/store'

import { CreationMethod, setCreationExerciseTitle, startCreation, Step } from '../store'
import { NewExerciseSourcePanel } from './NewExerciseSourcePanel'

vi.mock('@/modules/references', () => ({
  useReferences: vi.fn()
}))

const references = {
  disciplines: [],
  exerciseMuscles: [],
  exercisePatterns: [],
  exerciseRelationships: [],
  exerciseRoles: [],
  exercises: [
    {
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
    },
    {
      archivedAt: null,
      bodyweightCoefficient: null,
      code: 'bench_press',
      createdAt: '2024-01-01T00:00:00.000Z',
      descriptionMarkdown: null,
      id: 2,
      imageUrl: null,
      isSystem: true,
      isUnilateral: false,
      loadingTypeId: 1,
      publicationStatus: 'published',
      shortInstructionsMarkdown: null,
      subtitle: null,
      title: 'Bench press',
      updatedAt: '2024-01-01T00:00:00.000Z',
      videoUrl: null
    }
  ],
  loadingTypes: [],
  muscleRoles: [],
  muscles: [],
  patterns: []
} satisfies GetReferencesApiResponse

const exerciseGroupsByPattern = [
  {
    code: 'strength',
    items: [...references.exercises].sort(
      (left, right) => left.title.localeCompare(right.title) || left.code.localeCompare(right.code)
    ),
    value: 'Strength'
  }
]

const useReferencesMock = vi.mocked(useReferences)
let onResume: () => void
let onStart: () => void

function getCompetitionSquat() {
  const exercise = references.exercises.find(({ code }) => code === 'competition_squat')

  if (!exercise) {
    throw new Error('Expected the competition squat fixture to exist')
  }

  return exercise
}

function renderSourcePanel(
  setupStore?: (store: ReturnType<typeof createTestStore>) => void
): ReturnType<typeof createTestStore> {
  const store = createTestStore()

  setupStore?.(store)

  render(
    <Provider store={store}>
      <NewExerciseSourcePanel
        onResume={onResume}
        onStart={onStart}
        resumeActionLabel="Resume at muscles"
      />
    </Provider>
  )

  return store
}

describe('NewExerciseSourcePanel', () => {
  beforeEach(() => {
    onResume = vi.fn()
    onStart = vi.fn()
    useReferencesMock.mockReturnValue({
      exerciseGroupItemsByPattern: exerciseGroupsByPattern,
      load: vi.fn(),
      loading: false,
      references
    })
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('only enables the clone action after selecting a valid exercise', async () => {
    const store = renderSourcePanel()

    expect(screen.getByText('clone an exercise')).toBeInTheDocument()

    const cloneNextButton = screen.getAllByRole('button', { name: 'Next' }).at(1)

    if (!cloneNextButton) {
      throw new Error('Expected the clone source next button to render')
    }

    const input = screen.getByPlaceholderText('Exercise to clone')

    fireEvent.mouseDown(input)
    fireEvent.click(input)

    expect(await screen.findByText('Competition squat')).toBeInTheDocument()
    expect(store.getState().exercises?.creation.current).toBeNull()
    expect(cloneNextButton).toBeDisabled()

    fireEvent.change(input, { target: { value: 'Competition squat' } })
    expect(cloneNextButton).toBeDisabled()

    fireEvent.change(input, { target: { value: 'not_an_exercise' } })
    expect(cloneNextButton).toBeDisabled()

    fireEvent.change(input, { target: { value: 'competition_squat' } })
    expect(cloneNextButton).toBeDisabled()

    fireEvent.mouseDown(input)
    fireEvent.click(input)
    fireEvent.change(input, { target: { value: 'squat' } })

    const exerciseOption = await screen.findByText('Competition squat')

    fireEvent.click(exerciseOption)

    expect(input).toHaveValue('Competition squat')
    expect(input).toHaveAttribute('aria-expanded', 'false')
    expect(cloneNextButton).toBeEnabled()

    expect(store.getState().exercises?.creation.current).toBeNull()

    fireEvent.click(cloneNextButton)

    expect(store.getState().exercises?.creation.current?.method).toBe(CreationMethod.Clone)
    expect(store.getState().exercises?.creation.current?.exercise.code).toBe('competition_squat')
    expect(store.getState().exercises?.creation.initial?.method).toBe(CreationMethod.Clone)
    expect(store.getState().exercises?.creation.initial?.exercise.code).toBe('competition_squat')
    expect(store.getState().exercises?.creation.resumeStep).toBe(Step.Overview)
    expect(onStart).toHaveBeenCalledTimes(1)
  })

  it('initializes the local source state from the current creation without prompting on resume', () => {
    const store = renderSourcePanel((createdStore) => {
      createdStore.dispatch(
        startCreation({
          exercise: getCompetitionSquat(),
          method: CreationMethod.Clone
        })
      )
    })
    const cloneResumeButton = screen.getByRole('button', { name: 'Resume at muscles' })

    expect(screen.getByPlaceholderText('Exercise to clone')).toHaveValue('Competition squat')
    expect(cloneResumeButton).toBeEnabled()

    fireEvent.click(cloneResumeButton)

    expect(screen.queryByText('creation already in progress')).not.toBeInTheDocument()
    expect(store.getState().exercises?.creation.current?.method).toBe(CreationMethod.Clone)
    expect(store.getState().exercises?.creation.current?.exercise.code).toBe('competition_squat')
    expect(onResume).toHaveBeenCalledTimes(1)
  })

  it('offers to reset a dirty blank creation', () => {
    const store = renderSourcePanel((createdStore) => {
      createdStore.dispatch(
        startCreation({
          exercise: {
            ...getCompetitionSquat(),
            code: '',
            title: ''
          },
          method: CreationMethod.Blank
        })
      )
      createdStore.dispatch(setCreationExerciseTitle('Dirty title'))
    })

    expect(screen.getByRole('button', { name: 'Resume at muscles' })).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'start over' }))

    expect(screen.getByText('creation already in progress')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Discard and create from scratch' }))

    expect(store.getState().exercises?.creation.current?.method).toBe(CreationMethod.Blank)
    expect(store.getState().exercises?.creation.current?.exercise.title).toBe('')
    expect(store.getState().exercises?.creation.resumeStep).toBe(Step.Overview)
    expect(onStart).toHaveBeenCalledTimes(1)
  })

  it('resumes a blank creation without resetting it', () => {
    const store = renderSourcePanel((createdStore) => {
      createdStore.dispatch(
        startCreation({
          exercise: {
            ...getCompetitionSquat(),
            code: '',
            title: ''
          },
          method: CreationMethod.Blank
        })
      )
      createdStore.dispatch(setCreationExerciseTitle('Dirty title'))
    })

    fireEvent.click(screen.getByRole('button', { name: 'Resume at muscles' }))

    expect(screen.queryByText('creation already in progress')).not.toBeInTheDocument()
    expect(store.getState().exercises?.creation.current?.exercise.title).toBe('Dirty title')
    expect(onResume).toHaveBeenCalledTimes(1)
  })

  it('keeps the clone reset action available after activating another source', () => {
    renderSourcePanel((createdStore) => {
      createdStore.dispatch(
        startCreation({
          exercise: getCompetitionSquat(),
          method: CreationMethod.Clone
        })
      )
      createdStore.dispatch(setCreationExerciseTitle('Dirty title'))
    })

    fireEvent.click(screen.getByText('from scratch'))

    expect(screen.getByRole('button', { name: 'start over' })).toHaveClass('opacity-30')
  })

  it('confirms before resetting an in-progress creation from a next action', async () => {
    const store = renderSourcePanel()
    const blankNextButton = screen.getAllByRole('button', { name: 'Next' }).at(0)
    const cloneNextButton = screen.getAllByRole('button', { name: 'Next' }).at(1)

    if (!blankNextButton || !cloneNextButton) {
      throw new Error('Expected both source next buttons to render')
    }

    fireEvent.click(screen.getByText('from scratch'))
    fireEvent.click(blankNextButton)

    expect(store.getState().exercises?.creation.current?.method).toBe(CreationMethod.Blank)
    expect(store.getState().exercises?.creation.current?.exercise.code).toBe('')

    act(() => {
      store.dispatch(setCreationExerciseTitle('Dirty title'))
    })

    const input = screen.getByPlaceholderText('Exercise to clone')

    fireEvent.mouseDown(input)
    fireEvent.click(input)
    fireEvent.change(input, { target: { value: 'squat' } })
    fireEvent.click(await screen.findByText('Competition squat'))
    fireEvent.click(cloneNextButton)

    expect(screen.getByText('creation already in progress')).toBeInTheDocument()
    expect(store.getState().exercises?.creation.current?.method).toBe(CreationMethod.Blank)

    fireEvent.click(screen.getByRole('button', { name: 'Discard & clone competition squat' }))

    expect(store.getState().exercises?.creation.current?.method).toBe(CreationMethod.Clone)
    expect(store.getState().exercises?.creation.current?.exercise.code).toBe('competition_squat')
    expect(store.getState().exercises?.creation.initial?.method).toBe(CreationMethod.Clone)
    expect(store.getState().exercises?.creation.initial?.exercise.code).toBe('competition_squat')
    expect(store.getState().exercises?.creation.resumeStep).toBe(Step.Overview)
    expect(onStart).toHaveBeenCalledTimes(2)
  })
})
