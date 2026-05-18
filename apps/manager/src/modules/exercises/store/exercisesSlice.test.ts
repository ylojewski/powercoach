import { type Exercise } from '@/core'
import { createTestStore } from '@/test/utils/store'

import {
  CreationMethod,
  selectCreationStep,
  selectCurrentCreation,
  selectInitialCreation,
  setCreationExerciseTitle,
  setCreationStep,
  startCreation,
  Step
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
    publicationStatus: 'published',
    shortInstructionsMarkdown: null,
    subtitle: null,
    title: 'Competition squat',
    updatedAt: '2024-01-01T00:00:00.000Z',
    videoUrl: null,
    ...overrides
  }
}

describe('exercisesSlice', () => {
  it('starts without an active creation', () => {
    const state = createTestStore().getState()

    expect(selectCurrentCreation(state)).toBeNull()
    expect(selectInitialCreation(state)).toBeNull()
    expect(selectCreationStep(state)).toBe(Step.Start)
  })

  it('falls back to the initial state when the slice is missing', () => {
    const state = {} as Parameters<typeof selectCreationStep>[0]

    expect(selectCurrentCreation(state)).toBeNull()
    expect(selectInitialCreation(state)).toBeNull()
    expect(selectCreationStep(state)).toBe(Step.Start)
  })

  it('starts a creation by snapshotting current and initial exercise state', () => {
    const store = createTestStore()
    const exercise = createExercise()

    store.dispatch(startCreation({ exercise, method: CreationMethod.Clone }))

    const state = store.getState()
    const currentCreation = selectCurrentCreation(state)
    const initialCreation = selectInitialCreation(state)

    expect(currentCreation).toStrictEqual({
      exercise,
      method: CreationMethod.Clone
    })
    expect(initialCreation).toStrictEqual({
      exercise,
      method: CreationMethod.Clone
    })
    expect(currentCreation?.exercise).not.toBe(exercise)
    expect(initialCreation?.exercise).not.toBe(exercise)
    expect(initialCreation?.exercise).not.toBe(currentCreation?.exercise)
    expect(selectCreationStep(state)).toBe(Step.Overview)
  })

  it('updates only the current exercise title', () => {
    const store = createTestStore()

    store.dispatch(startCreation({ exercise: createExercise(), method: CreationMethod.Blank }))
    store.dispatch(setCreationExerciseTitle('Custom squat'))

    const state = store.getState()

    expect(selectCurrentCreation(state)?.exercise.title).toBe('Custom squat')
    expect(selectInitialCreation(state)?.exercise.title).toBe('Competition squat')
  })

  it('updates the creation step independently from the creation snapshot', () => {
    const store = createTestStore()

    store.dispatch(startCreation({ exercise: createExercise(), method: CreationMethod.Clone }))
    store.dispatch(setCreationStep(Step.Muscles))

    const state = store.getState()

    expect(selectCreationStep(state)).toBe(Step.Muscles)
    expect(selectCurrentCreation(state)?.method).toBe(CreationMethod.Clone)
  })

  it('ignores title updates when no creation is active', () => {
    const store = createTestStore()

    store.dispatch(setCreationExerciseTitle('Custom squat'))

    expect(selectCurrentCreation(store.getState())).toBeNull()
  })
})
