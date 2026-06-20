import { act, renderHook } from '@testing-library/react'
import { type PropsWithChildren, type ReactElement } from 'react'
import { Provider } from 'react-redux'

import { type Exercise, type GetReferencesApiResponse } from '@/core'
import { useReferences } from '@/modules/references'
import { createTestStore } from '@/test/utils/store'

import { CreationMethod, startCreation, Step } from '../store'
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
  loadingTypes: [
    {
      code: 'external_load',
      createdAt: '2024-01-01T00:00:00.000Z',
      description: 'Use when the entered load is the external load moved by the athlete.',
      id: 1,
      name: 'External load',
      updatedAt: '2024-01-01T00:00:00.000Z'
    },
    {
      code: 'bodyweight',
      createdAt: '2024-01-01T00:00:00.000Z',
      description: 'Use when the athlete moves bodyweight without added or assisted external load.',
      id: 2,
      name: 'Bodyweight',
      updatedAt: '2024-01-01T00:00:00.000Z'
    },
    {
      code: 'bodyweight_plus_external',
      createdAt: '2024-01-01T00:00:00.000Z',
      description: 'Use when the athlete moves bodyweight plus an added external load.',
      id: 3,
      name: 'Bodyweight plus external load',
      updatedAt: '2024-01-01T00:00:00.000Z'
    },
    {
      code: 'assisted_bodyweight',
      createdAt: '2024-01-01T00:00:00.000Z',
      description: 'Use when assistance reduces the bodyweight moved by the athlete.',
      id: 4,
      name: 'Assisted bodyweight',
      updatedAt: '2024-01-01T00:00:00.000Z'
    },
    {
      code: 'no_load',
      createdAt: '2024-01-01T00:00:00.000Z',
      description: 'Use when tonnage should not be calculated from load.',
      id: 5,
      name: 'No load',
      updatedAt: '2024-01-01T00:00:00.000Z'
    }
  ],
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

function getLoadingType(code: string) {
  const loadingType = references.loadingTypes.find((loadingType) => loadingType.code === code)

  if (!loadingType) {
    throw new Error(`Missing loading type ${code}`)
  }

  return loadingType
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

  it('starts without an initialized creation', () => {
    const exercise = createExercise()
    const { result } = renderUseExerciseCreation()

    expect(result.current.currentCreation).toBeNull()
    expect(result.current.initialCreation).toBeNull()
    expect(result.current.isCurrentCreationDirty).toBe(false)
    expect(result.current.shouldResetBlankCreation).toBe(false)
    expect(result.current.shouldResetCloneCreation(exercise)).toBe(false)
    expect(result.current.canStartCreation(CreationMethod.Blank, null)).toBe(true)
    expect(result.current.canStartCreation(CreationMethod.Clone, null)).toBe(false)
    expect(result.current.canStartCreation(CreationMethod.Clone, exercise)).toBe(true)
    expect(result.current.canGoToNextStep(Step.Overview)).toBe(false)
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
    expect(result.current.canGoToNextStep(Step.Overview)).toBe(false)

    act(() => {
      result.current.updateExercise({ title: 'Custom squat' })
    })

    expect(result.current.isCurrentCreationDirty).toBe(true)
    expect(result.current.canGoToNextStep(Step.Overview)).toBe(false)

    act(() => {
      result.current.updateExercise({ code: 'custom_squat' })
    })

    expect(result.current.canGoToNextStep(Step.Overview)).toBe(true)
    expect(result.current.shouldResetBlankCreation).toBe(true)
    expect(result.current.shouldResetCloneCreation(createExercise())).toBe(false)
  })

  it('detects dirty clone creations', () => {
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

    expect(result.current.isCurrentCreationDirty).toBe(false)
    expect(result.current.shouldResetCloneCreation(exercise)).toBe(false)

    act(() => {
      result.current.updateExercise({ title: 'Dirty competition squat' })
    })

    expect(result.current.isCurrentCreationDirty).toBe(true)
    expect(result.current.shouldResetBlankCreation).toBe(false)
    expect(result.current.shouldResetCloneCreation(exercise)).toBe(true)
    expect(result.current.shouldResetCloneCreation(otherExercise)).toBe(false)
    expect(result.current.shouldResetCloneCreation(null)).toBe(false)
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
    expect(result.current.completedRelationships[0]).toBe(result.current.createdRelationships[0])
    expect(result.current.getRelationshipStatus('powerlifting')).toMatchObject({
      completed: true,
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

    expect(result.current.activeDisciplineCode).toBe('powerlifting')
    expect(result.current.completedRelationships[0]).toBe(result.current.createdRelationships[0])
    expect(result.current.completedRelationships[1]).toBe(result.current.createdRelationships[1])
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
        defaultTransferCoefficient: 0,
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
    expect(result.current.canGoToNextStep(Step.Categorization)).toBe(true)

    act(() => {
      result.current.upsertRelationship({
        defaultTransferCoefficient: 0.75,
        disciplineCode: 'powerlifting'
      })
    })

    expect(result.current.getRelationshipStatus('powerlifting').transferPercentage).toBe(75)
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
    expect(result.current.canGoToNextStep(Step.Categorization)).toBe(false)

    act(() => {
      result.current.updatePattern(null)
    })

    expect(result.current.currentCreation?.exercise.patternId).toBeNull()
    expect(result.current.selectedPattern).toBeNull()
  })

  it('derives and updates loading type state', () => {
    const externalLoad = getLoadingType('external_load')
    const bodyweight = getLoadingType('bodyweight')
    const noLoad = getLoadingType('no_load')
    const { result, store } = renderUseExerciseCreation()

    act(() => {
      store.dispatch(
        startCreation({
          currentExercise: createExercise({ bodyweightCoefficient: null, loadingTypeId: 1 }),
          currentExerciseRelationships: [],
          initialExercise: createExercise({ bodyweightCoefficient: null, loadingTypeId: 1 }),
          initialExerciseRelationships: [],
          method: CreationMethod.Blank
        })
      )
    })

    expect(result.current.selectedLoadingType).toBe(externalLoad)
    expect(result.current.shouldShowBodyweightCoefficient).toBe(false)
    expect(result.current.currentCreation?.exercise.bodyweightCoefficient).toBeNull()

    act(() => {
      result.current.updateLoadingType(bodyweight)
    })

    expect(result.current.selectedLoadingType).toBe(bodyweight)
    expect(result.current.shouldShowBodyweightCoefficient).toBe(true)
    expect(result.current.currentCreation?.exercise.loadingTypeId).toBe(2)
    expect(result.current.currentCreation?.exercise.bodyweightCoefficient).toBe(1)
    expect(result.current.bodyweightPercentage).toBe(100)

    act(() => {
      result.current.updateBodyweightCoefficient(0.35)
    })

    expect(result.current.currentCreation?.exercise.bodyweightCoefficient).toBe(0.35)
    expect(result.current.bodyweightPercentage).toBe(35)

    act(() => {
      result.current.updateLoadingType(noLoad)
    })

    expect(result.current.selectedLoadingType).toBe(noLoad)
    expect(result.current.shouldShowBodyweightCoefficient).toBe(false)
    expect(result.current.currentCreation?.exercise.loadingTypeId).toBe(5)
    expect(result.current.currentCreation?.exercise.bodyweightCoefficient).toBeNull()
  })

  it('preserves existing bodyweight coefficient when switching between bodyweight loading types', () => {
    const bodyweightPlusExternal = getLoadingType('bodyweight_plus_external')
    const assistedBodyweight = getLoadingType('assisted_bodyweight')
    const { result, store } = renderUseExerciseCreation()

    act(() => {
      store.dispatch(
        startCreation({
          currentExercise: createExercise({ bodyweightCoefficient: 0.6, loadingTypeId: 2 }),
          currentExerciseRelationships: [],
          initialExercise: createExercise({ bodyweightCoefficient: 0.6, loadingTypeId: 2 }),
          initialExerciseRelationships: [],
          method: CreationMethod.Blank
        })
      )
    })

    expect(result.current.shouldShowBodyweightCoefficient).toBe(true)
    expect(result.current.bodyweightPercentage).toBe(60)

    act(() => {
      result.current.updateLoadingType(bodyweightPlusExternal)
    })

    expect(result.current.selectedLoadingType).toBe(bodyweightPlusExternal)
    expect(result.current.currentCreation?.exercise.bodyweightCoefficient).toBe(0.6)

    act(() => {
      result.current.updateLoadingType(assistedBodyweight)
    })

    expect(result.current.selectedLoadingType).toBe(assistedBodyweight)
    expect(result.current.currentCreation?.exercise.bodyweightCoefficient).toBe(0.6)
  })

  it('updates unilateral tracking state', () => {
    const { result, store } = renderUseExerciseCreation()

    act(() => {
      store.dispatch(
        startCreation({
          currentExercise: createExercise({ isUnilateral: false }),
          currentExerciseRelationships: [],
          initialExercise: createExercise({ isUnilateral: false }),
          initialExerciseRelationships: [],
          method: CreationMethod.Blank
        })
      )
    })

    act(() => {
      result.current.updateIsUnilateral(true)
    })

    expect(result.current.currentCreation?.exercise.isUnilateral).toBe(true)
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
