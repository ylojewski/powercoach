import { act, fireEvent, render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'

import { type GetReferencesApiResponse } from '@/core'
import { useReferences } from '@/modules/references'
import { createTestStore } from '@/test/utils/store'

import { CreationMethod, startCreation, updateCreationExercise } from '../store'
import { NewExerciseStartStep } from './NewExerciseStartStep'

vi.mock('@/modules/references', () => ({
  useReferences: vi.fn()
}))

const references = {
  disciplineMovements: [],
  disciplines: [
    {
      code: 'powerlifting',
      createdAt: '2024-01-01T00:00:00.000Z',
      description: 'Powerlifting',
      id: 1,
      name: 'Powerlifting',
      updatedAt: '2024-01-01T00:00:00.000Z'
    }
  ],
  exerciseMuscles: [],
  exerciseRelationships: [
    {
      createdAt: '2024-01-01T00:00:00.000Z',
      defaultTransferCoefficient: 0.75,
      disciplineId: 1,
      id: 1,
      roleId: 1,
      sourceExerciseId: 1,
      targetDisciplineMovementId: 1,
      updatedAt: '2024-01-01T00:00:00.000Z'
    }
  ],
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
      patternId: 1,
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
      patternId: 1,
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
let onStart: () => void

function getCompetitionSquat() {
  const exercise = references.exercises.find(({ code }) => code === 'competition_squat')

  if (!exercise) {
    throw new Error('Expected the competition squat fixture to exist')
  }

  return exercise
}

function startExerciseCreation(
  store: ReturnType<typeof createTestStore>,
  exercise: ReturnType<typeof getCompetitionSquat>,
  method: CreationMethod
): void {
  store.dispatch(
    startCreation({
      currentExercise: exercise,
      currentExerciseRelationships: [],
      initialExercise: exercise,
      initialExerciseRelationships: [],
      method
    })
  )
}

function renderStartStep(
  setupStore?: (store: ReturnType<typeof createTestStore>) => void
): ReturnType<typeof createTestStore> {
  const store = createTestStore()

  setupStore?.(store)

  render(
    <Provider store={store}>
      <NewExerciseStartStep onStart={onStart} />
    </Provider>
  )

  return store
}

describe('NewExerciseStartStep', () => {
  beforeEach(() => {
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
    const store = renderStartStep()

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
    expect(store.getState().exercises?.creation.current?.exercise.code).toBe('')
    expect(store.getState().exercises?.creation.initial?.method).toBe(CreationMethod.Clone)
    expect(store.getState().exercises?.creation.initial?.exercise.code).toBe('competition_squat')
    expect(store.getState().exercises?.creation.current?.exerciseRelationships).toStrictEqual([
      {
        defaultTransferCoefficient: 0.75,
        disciplineCode: 'powerlifting',
        roleId: 1,
        targetDisciplineMovementId: 1
      }
    ])
    expect(store.getState().exercises?.creation.initial?.exerciseRelationships).toStrictEqual([
      {
        defaultTransferCoefficient: 0.75,
        disciplineCode: 'powerlifting',
        roleId: 1,
        targetDisciplineMovementId: 1
      }
    ])
    expect(onStart).toHaveBeenCalledTimes(1)
  })

  it('continues from an existing clone source without resetting it', () => {
    const store = renderStartStep((createdStore) => {
      startExerciseCreation(createdStore, getCompetitionSquat(), CreationMethod.Clone)
    })
    const cloneNextButton = screen.getAllByRole('button', { name: 'Next' }).at(1)

    if (!cloneNextButton) {
      throw new Error('Expected the clone source next button to render')
    }

    expect(screen.getByPlaceholderText('Exercise to clone')).toHaveValue('Competition squat')
    expect(cloneNextButton).toBeEnabled()

    fireEvent.click(cloneNextButton)

    expect(screen.queryByText('creation already in progress')).not.toBeInTheDocument()
    expect(store.getState().exercises?.creation.current?.method).toBe(CreationMethod.Clone)
    expect(store.getState().exercises?.creation.current?.exercise.code).toBe('competition_squat')
    expect(onStart).toHaveBeenCalledTimes(1)
  })

  it('continues from a dirty blank source without resetting it', () => {
    const store = renderStartStep((createdStore) => {
      startExerciseCreation(
        createdStore,
        {
          ...getCompetitionSquat(),
          code: '',
          title: ''
        },
        CreationMethod.Blank
      )
      createdStore.dispatch(updateCreationExercise({ title: 'Dirty title' }))
    })
    const blankNextButton = screen.getAllByRole('button', { name: 'Next' }).at(0)

    if (!blankNextButton) {
      throw new Error('Expected the blank source next button to render')
    }

    expect(screen.queryByRole('button', { name: 'Resume' })).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'start over' })).toBeInTheDocument()

    fireEvent.click(blankNextButton)

    expect(screen.queryByText('creation already in progress')).not.toBeInTheDocument()
    expect(store.getState().exercises?.creation.current?.exercise.title).toBe('Dirty title')
    expect(onStart).toHaveBeenCalledTimes(1)
  })

  it('offers to reset a dirty blank creation from start over', () => {
    const store = renderStartStep((createdStore) => {
      startExerciseCreation(
        createdStore,
        {
          ...getCompetitionSquat(),
          code: '',
          title: ''
        },
        CreationMethod.Blank
      )
      createdStore.dispatch(updateCreationExercise({ title: 'Dirty title' }))
    })

    expect(screen.queryByRole('button', { name: 'Resume' })).not.toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'start over' }))

    expect(screen.getByText('creation already in progress')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Create from scratch anyway' }))

    expect(store.getState().exercises?.creation.current?.method).toBe(CreationMethod.Blank)
    expect(store.getState().exercises?.creation.current?.exercise.title).toBe('')
    expect(onStart).toHaveBeenCalledTimes(1)
  })

  it('keeps the clone start over action available after activating another source', () => {
    renderStartStep((createdStore) => {
      startExerciseCreation(createdStore, getCompetitionSquat(), CreationMethod.Clone)
      createdStore.dispatch(updateCreationExercise({ title: 'Dirty title' }))
    })

    fireEvent.click(screen.getByText('from scratch'))

    expect(screen.queryByRole('button', { name: 'Resume' })).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'start over' })).toHaveClass('opacity-30')
  })

  it('confirms before resetting an in-progress creation from a next action', async () => {
    const store = renderStartStep()
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
      store.dispatch(updateCreationExercise({ title: 'Dirty title' }))
    })

    const input = screen.getByPlaceholderText('Exercise to clone')

    fireEvent.mouseDown(input)
    fireEvent.click(input)
    fireEvent.change(input, { target: { value: 'squat' } })
    fireEvent.click(await screen.findByText('Competition squat'))
    fireEvent.click(cloneNextButton)

    expect(screen.getByText('creation already in progress')).toBeInTheDocument()
    expect(store.getState().exercises?.creation.current?.method).toBe(CreationMethod.Blank)

    fireEvent.click(screen.getByRole('button', { name: 'Clone competition squat anyway' }))

    expect(store.getState().exercises?.creation.current?.method).toBe(CreationMethod.Clone)
    expect(store.getState().exercises?.creation.current?.exercise.code).toBe('')
    expect(store.getState().exercises?.creation.initial?.method).toBe(CreationMethod.Clone)
    expect(store.getState().exercises?.creation.initial?.exercise.code).toBe('competition_squat')
    expect(store.getState().exercises?.creation.current?.exerciseRelationships).toStrictEqual([
      {
        defaultTransferCoefficient: 0.75,
        disciplineCode: 'powerlifting',
        roleId: 1,
        targetDisciplineMovementId: 1
      }
    ])
    expect(onStart).toHaveBeenCalledTimes(2)
  })
})
