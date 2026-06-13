import { act, renderHook } from '@testing-library/react'
import { type PropsWithChildren, type ReactElement } from 'react'
import { Provider } from 'react-redux'

import { type Exercise, type GetReferencesApiResponse } from '@/core'
import { useReferences } from '@/modules/references'
import { createTestStore } from '@/test/utils/store'

import { CreationMethod, startCreation } from '../store'
import { useExerciseCreation } from './useExerciseCreation'

vi.mock('@/modules/references', () => ({
  useReferences: vi.fn()
}))

const references = {
  disciplineMovements: [
    {
      code: 'squat',
      description: 'Primary knee-dominant movement.',
      disciplineId: 1,
      id: 1,
      name: 'Squat',
      sortOrder: 1
    },
    {
      code: 'carry',
      description: 'Loaded carry event family.',
      disciplineId: 2,
      id: 2,
      name: 'Carry',
      sortOrder: 1
    }
  ],
  disciplines: [
    {
      code: 'powerlifting',
      createdAt: '2024-01-01T00:00:00.000Z',
      description: 'Powerlifting',
      id: 1,
      name: 'Powerlifting',
      updatedAt: '2024-01-01T00:00:00.000Z'
    },
    {
      code: 'strongman',
      createdAt: '2024-01-01T00:00:00.000Z',
      description: 'Strongman',
      id: 2,
      name: 'Strongman',
      updatedAt: '2024-01-01T00:00:00.000Z'
    }
  ],
  exerciseMuscles: [],
  exerciseRelationships: [],
  exerciseRoles: [
    {
      code: 'competition',
      createdAt: '2024-01-01T00:00:00.000Z',
      description: 'Competition execution.',
      id: 1,
      name: 'Competition',
      updatedAt: '2024-01-01T00:00:00.000Z'
    },
    {
      code: 'variant',
      createdAt: '2024-01-01T00:00:00.000Z',
      description: 'Specific variation.',
      id: 2,
      name: 'Variant',
      updatedAt: '2024-01-01T00:00:00.000Z'
    }
  ],
  exercises: [],
  loadingTypes: [],
  muscleRoles: [],
  muscles: [],
  patterns: [
    {
      code: 'squat',
      createdAt: '2024-01-01T00:00:00.000Z',
      description: 'Squat pattern.',
      id: 1,
      name: 'Squat',
      updatedAt: '2024-01-01T00:00:00.000Z'
    }
  ]
} satisfies GetReferencesApiResponse

const useReferencesMock = vi.mocked(useReferences)

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
    patternId: 1,
    publicationStatus: 'published',
    shortInstructionsMarkdown: null,
    subtitle: null,
    title: 'Competition squat',
    updatedAt: '2024-01-01T00:00:00.000Z',
    videoUrl: null,
    ...overrides
  }
}

function renderUseExerciseCreation() {
  const store = createTestStore()

  const renderedHook = renderHook(() => useExerciseCreation(), {
    wrapper({ children }: PropsWithChildren): ReactElement {
      return <Provider store={store}>{children}</Provider>
    }
  })

  return { store, ...renderedHook }
}

describe('useExerciseCreation', () => {
  beforeEach(() => {
    useReferencesMock.mockReturnValue({
      exerciseGroupItemsByPattern: [],
      load: vi.fn(),
      loading: false,
      references
    })
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('does not resume or reset without an initialized creation', () => {
    const exercise = createExercise()
    const { result } = renderUseExerciseCreation()

    expect(result.current.currentCreation).toBeNull()
    expect(result.current.initialCreation).toBeNull()
    expect(result.current.isCurrentCreationDirty).toBe(false)
    expect(result.current.shouldResetBlankCreation).toBe(false)
    expect(result.current.shouldResetCloneCreation(exercise)).toBe(false)
    expect(result.current.shouldResumeBlankCreation).toBe(false)
    expect(result.current.shouldResumeCloneCreation(exercise)).toBe(false)
  })

  it('detects dirty blank creations', () => {
    const { result, store } = renderUseExerciseCreation()

    act(() => {
      store.dispatch(
        startCreation({
          currentExercise: createExercise({ code: '', title: '' }),
          currentExerciseRelationships: [],
          initialExercise: createExercise({ code: '', title: '' }),
          initialExerciseRelationships: [],
          method: CreationMethod.Blank
        })
      )
    })

    expect(result.current.isCurrentCreationDirty).toBe(false)
    expect(result.current.shouldResetBlankCreation).toBe(false)
    expect(result.current.shouldResumeBlankCreation).toBe(true)

    act(() => {
      result.current.updateExercise({ title: 'Custom squat' })
    })

    expect(result.current.isCurrentCreationDirty).toBe(true)
    expect(result.current.shouldResetBlankCreation).toBe(true)
    expect(result.current.shouldResetCloneCreation(createExercise())).toBe(false)
  })

  it('detects matching clone resume and reset states', () => {
    const exercise = createExercise()
    const otherExercise = createExercise({
      code: 'bench_press',
      id: 2,
      title: 'Bench press'
    })
    const { result, store } = renderUseExerciseCreation()

    act(() => {
      store.dispatch(
        startCreation({
          currentExercise: exercise,
          currentExerciseRelationships: [],
          initialExercise: exercise,
          initialExerciseRelationships: [],
          method: CreationMethod.Clone
        })
      )
    })

    expect(result.current.shouldResumeBlankCreation).toBe(false)
    expect(result.current.shouldResumeCloneCreation(exercise)).toBe(true)
    expect(result.current.shouldResumeCloneCreation(otherExercise)).toBe(false)
    expect(result.current.shouldResetCloneCreation(exercise)).toBe(false)

    act(() => {
      result.current.updateExercise({ title: 'Dirty competition squat' })
    })

    expect(result.current.isCurrentCreationDirty).toBe(true)
    expect(result.current.shouldResetBlankCreation).toBe(false)
    expect(result.current.shouldResetCloneCreation(exercise)).toBe(true)
    expect(result.current.shouldResetCloneCreation(otherExercise)).toBe(false)
    expect(result.current.shouldResetCloneCreation(null)).toBe(false)
    expect(result.current.shouldResumeCloneCreation(null)).toBe(false)
  })

  it('derives relationship state and status by discipline', () => {
    const { result, store } = renderUseExerciseCreation()

    act(() => {
      store.dispatch(
        startCreation({
          currentExercise: createExercise({ code: '', title: '' }),
          currentExerciseRelationships: [],
          initialExercise: createExercise({ code: '', title: '' }),
          initialExerciseRelationships: [],
          method: CreationMethod.Blank
        })
      )
    })

    expect(result.current.activeDisciplineCode).toBeNull()
    expect(result.current.completedRelationships).toStrictEqual([])
    expect(result.current.getRelationshipStatus('powerlifting')).toMatchObject({
      completed: false,
      movement: null,
      relationship: null,
      role: null,
      transferPercentage: 0
    })

    act(() => {
      result.current.upsertRelationship({
        disciplineCode: 'powerlifting',
        roleId: 1,
        targetDisciplineMovementId: 1
      })
    })

    expect(result.current.activeDisciplineCode).toBe('powerlifting')
    expect(result.current.completedRelationships).toStrictEqual([])
    expect(result.current.getRelationshipStatus('powerlifting')).toMatchObject({
      completed: false,
      movement: references.disciplineMovements[0],
      relationship: result.current.createdRelationships[0],
      role: references.exerciseRoles[0],
      transferPercentage: 0
    })

    act(() => {
      result.current.upsertRelationship({
        defaultTransferCoefficient: 0.5,
        disciplineCode: 'strongman',
        roleId: 2,
        targetDisciplineMovementId: 2
      })
    })

    expect(result.current.activeDisciplineCode).toBe('strongman')
    expect(result.current.completedRelationships[0]).toBe(result.current.createdRelationships[1])
    expect(result.current.getRelationshipStatus('strongman')).toMatchObject({
      completed: true,
      movement: references.disciplineMovements[1],
      relationship: result.current.createdRelationships[1],
      role: references.exerciseRoles[1],
      transferPercentage: 50
    })

    act(() => {
      result.current.upsertRelationship({
        defaultTransferCoefficient: 0,
        disciplineCode: 'powerlifting'
      })
    })

    expect(result.current.completedRelationships).toStrictEqual([
      {
        defaultTransferCoefficient: 0.5,
        disciplineCode: 'strongman',
        roleId: 2,
        targetDisciplineMovementId: 2
      }
    ])

    act(() => {
      result.current.upsertRelationship({
        defaultTransferCoefficient: 0.5,
        disciplineCode: 'powerlifting'
      })
    })

    expect(result.current.completedRelationships).toStrictEqual([
      {
        defaultTransferCoefficient: 0.5,
        disciplineCode: 'powerlifting',
        roleId: 1,
        targetDisciplineMovementId: 1
      },
      {
        defaultTransferCoefficient: 0.5,
        disciplineCode: 'strongman',
        roleId: 2,
        targetDisciplineMovementId: 2
      }
    ])
    expect(result.current.activeDisciplineCode).toBe('powerlifting')
    expect(result.current.completedRelationships[0]).toBe(result.current.createdRelationships[0])
  })

  it('derives and updates the selected pattern', () => {
    const { result, store } = renderUseExerciseCreation()

    act(() => {
      store.dispatch(
        startCreation({
          currentExercise: createExercise({ code: '', title: '' }),
          currentExerciseRelationships: [],
          initialExercise: createExercise({ code: '', title: '' }),
          initialExerciseRelationships: [],
          method: CreationMethod.Blank
        })
      )
    })

    expect(result.current.selectedPattern).toBe(references.patterns[0])

    act(() => {
      result.current.updatePattern(null)
    })

    expect(result.current.currentCreation?.exercise.patternId).toBeNull()
    expect(result.current.selectedPattern).toBeNull()
  })

  it('marks creation dirty when exercise relationships change', () => {
    const { result, store } = renderUseExerciseCreation()

    act(() => {
      store.dispatch(
        startCreation({
          currentExercise: createExercise({ code: '', title: '' }),
          currentExerciseRelationships: [],
          initialExercise: createExercise({ code: '', title: '' }),
          initialExerciseRelationships: [],
          method: CreationMethod.Blank
        })
      )
    })

    expect(result.current.isCurrentCreationDirty).toBe(false)

    act(() => {
      result.current.upsertRelationship({
        disciplineCode: 'powerlifting',
        targetDisciplineMovementId: 1
      })
    })

    expect(result.current.isCurrentCreationDirty).toBe(true)
  })
})
