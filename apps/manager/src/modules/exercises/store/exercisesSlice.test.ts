import { type Exercise } from '@/core'
import { createTestStore } from '@/test/utils/store'

import {
  type CreationExerciseRelationship,
  CreationMethod,
  selectCurrentCreation,
  selectInitialCreation,
  startCreation,
  updateCreationExercise,
  upsertCreationExerciseRelationship
} from './exercisesSlice'

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

function startExerciseCreation(
  store: ReturnType<typeof createTestStore>,
  exercise: Exercise,
  method: CreationMethod,
  exerciseRelationships: CreationExerciseRelationship[] = []
): void {
  store.dispatch(
    startCreation({
      currentExercise: exercise,
      currentExerciseRelationships: exerciseRelationships,
      initialExercise: exercise,
      initialExerciseRelationships: exerciseRelationships,
      method
    })
  )
}

describe('exercisesSlice', () => {
  it('starts without an active creation', () => {
    const state = createTestStore().getState()

    expect(selectCurrentCreation(state)).toBeNull()
    expect(selectInitialCreation(state)).toBeNull()
  })

  it('falls back to the initial state when the slice is missing', () => {
    const state = {} as Parameters<typeof selectCurrentCreation>[0]

    expect(selectCurrentCreation(state)).toBeNull()
    expect(selectInitialCreation(state)).toBeNull()
  })

  it('starts a creation by snapshotting current and initial exercise state', () => {
    const store = createTestStore()
    const exercise = createExercise()

    startExerciseCreation(store, exercise, CreationMethod.Clone)

    const state = store.getState()
    const currentCreation = selectCurrentCreation(state)
    const initialCreation = selectInitialCreation(state)

    expect(currentCreation).toStrictEqual({
      exercise,
      exerciseRelationships: [],
      method: CreationMethod.Clone
    })
    expect(initialCreation).toStrictEqual({
      exercise,
      exerciseRelationships: [],
      method: CreationMethod.Clone
    })
    expect(currentCreation?.exercise).not.toBe(exercise)
    expect(initialCreation?.exercise).not.toBe(exercise)
    expect(initialCreation?.exercise).not.toBe(currentCreation?.exercise)
  })

  it('starts a creation by snapshotting current and initial exercise relationships', () => {
    const store = createTestStore()
    const exercise = createExercise()
    const exerciseRelationship = {
      defaultTransferCoefficient: 0.75,
      disciplineCode: 'powerlifting',
      roleId: 1,
      targetDisciplineMovementId: 1
    } satisfies CreationExerciseRelationship
    const invalidExerciseRelationship = {
      defaultTransferCoefficient: 0.5,
      disciplineCode: 'strongman',
      roleId: 2
    } satisfies CreationExerciseRelationship

    startExerciseCreation(store, exercise, CreationMethod.Clone, [
      exerciseRelationship,
      invalidExerciseRelationship
    ])

    const currentCreation = selectCurrentCreation(store.getState())
    const initialCreation = selectInitialCreation(store.getState())

    expect(currentCreation?.exerciseRelationships).toStrictEqual([exerciseRelationship])
    expect(initialCreation?.exerciseRelationships).toStrictEqual([exerciseRelationship])
    expect(currentCreation?.exerciseRelationships).not.toBe(initialCreation?.exerciseRelationships)
    expect(currentCreation?.exerciseRelationships[0]).not.toBe(exerciseRelationship)
    expect(initialCreation?.exerciseRelationships[0]).not.toBe(exerciseRelationship)
  })

  it('updates only the current exercise title', () => {
    const store = createTestStore()

    startExerciseCreation(store, createExercise(), CreationMethod.Blank)
    store.dispatch(updateCreationExercise({ title: 'Custom squat' }))

    const state = store.getState()

    expect(selectCurrentCreation(state)?.exercise.title).toBe('Custom squat')
    expect(selectInitialCreation(state)?.exercise.title).toBe('Competition squat')
  })

  it('updates only the current exercise code', () => {
    const store = createTestStore()

    startExerciseCreation(store, createExercise(), CreationMethod.Blank)
    store.dispatch(updateCreationExercise({ code: 'custom_squat' }))

    const state = store.getState()

    expect(selectCurrentCreation(state)?.exercise.code).toBe('custom_squat')
    expect(selectInitialCreation(state)?.exercise.code).toBe('competition_squat')
  })

  it('updates only the current exercise subtitle', () => {
    const store = createTestStore()

    startExerciseCreation(store, createExercise(), CreationMethod.Blank)
    store.dispatch(updateCreationExercise({ subtitle: 'Paused variation' }))

    const state = store.getState()

    expect(selectCurrentCreation(state)?.exercise.subtitle).toBe('Paused variation')
    expect(selectInitialCreation(state)?.exercise.subtitle).toBeNull()
  })

  it('upserts current creation exercise relationships by discipline code', () => {
    const store = createTestStore()

    startExerciseCreation(store, createExercise(), CreationMethod.Blank)
    store.dispatch(
      upsertCreationExerciseRelationship({
        disciplineCode: 'powerlifting',
        roleId: 2
      })
    )

    expect(selectCurrentCreation(store.getState())?.exerciseRelationships).toStrictEqual([])

    store.dispatch(
      upsertCreationExerciseRelationship({
        disciplineCode: 'powerlifting',
        targetDisciplineMovementId: 1
      })
    )

    expect(selectCurrentCreation(store.getState())?.exerciseRelationships).toStrictEqual([
      {
        defaultTransferCoefficient: 0,
        disciplineCode: 'powerlifting',
        targetDisciplineMovementId: 1
      }
    ])

    store.dispatch(
      upsertCreationExerciseRelationship({
        defaultTransferCoefficient: 0.5,
        disciplineCode: 'powerlifting',
        roleId: 2
      })
    )

    const state = store.getState()

    expect(selectCurrentCreation(state)?.exerciseRelationships).toStrictEqual([
      {
        defaultTransferCoefficient: 0.5,
        disciplineCode: 'powerlifting',
        roleId: 2,
        targetDisciplineMovementId: 1
      }
    ])
    expect(selectInitialCreation(state)?.exerciseRelationships).toStrictEqual([])
  })

  it('cascades relationship resets from movement and role deselection', () => {
    const store = createTestStore()

    startExerciseCreation(store, createExercise(), CreationMethod.Blank, [
      {
        defaultTransferCoefficient: 0.5,
        disciplineCode: 'powerlifting',
        roleId: 2,
        targetDisciplineMovementId: 1
      }
    ])

    store.dispatch(
      upsertCreationExerciseRelationship({
        disciplineCode: 'powerlifting',
        roleId: undefined
      })
    )

    expect(selectCurrentCreation(store.getState())?.exerciseRelationships).toStrictEqual([
      {
        defaultTransferCoefficient: 0,
        disciplineCode: 'powerlifting',
        targetDisciplineMovementId: 1
      }
    ])

    store.dispatch(
      upsertCreationExerciseRelationship({
        defaultTransferCoefficient: 0.5,
        disciplineCode: 'powerlifting',
        roleId: 2
      })
    )
    store.dispatch(
      upsertCreationExerciseRelationship({
        disciplineCode: 'powerlifting',
        targetDisciplineMovementId: undefined
      })
    )

    expect(selectCurrentCreation(store.getState())?.exerciseRelationships).toStrictEqual([])
    expect(selectInitialCreation(store.getState())?.exerciseRelationships).toStrictEqual([
      {
        defaultTransferCoefficient: 0.5,
        disciplineCode: 'powerlifting',
        roleId: 2,
        targetDisciplineMovementId: 1
      }
    ])
  })

  it('ignores relationship updates when no creation is active', () => {
    const store = createTestStore()

    store.dispatch(
      upsertCreationExerciseRelationship({
        disciplineCode: 'powerlifting',
        targetDisciplineMovementId: 1
      })
    )

    expect(selectCurrentCreation(store.getState())).toBeNull()
  })

  it('ignores title updates when no creation is active', () => {
    const store = createTestStore()

    store.dispatch(updateCreationExercise({ title: 'Custom squat' }))

    expect(selectCurrentCreation(store.getState())).toBeNull()
  })

  it('ignores code and subtitle updates when no creation is active', () => {
    const store = createTestStore()

    store.dispatch(updateCreationExercise({ code: 'custom_squat' }))
    store.dispatch(updateCreationExercise({ subtitle: 'Paused variation' }))

    expect(selectCurrentCreation(store.getState())).toBeNull()
  })
})
