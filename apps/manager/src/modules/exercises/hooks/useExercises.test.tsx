import { act, renderHook } from '@testing-library/react'
import { type PropsWithChildren, type ReactElement } from 'react'
import { Provider } from 'react-redux'

import { type Exercise } from '@/core'
import { createTestStore } from '@/test/utils/store'

import { CreationMethod, startCreation, updateCreationExercise } from '../store'
import { useExercises } from './useExercises'

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

function renderUseExercises() {
  const store = createTestStore()

  const renderedHook = renderHook(() => useExercises(), {
    wrapper({ children }: PropsWithChildren): ReactElement {
      return <Provider store={store}>{children}</Provider>
    }
  })

  return { store, ...renderedHook }
}

describe('useExercises', () => {
  it('does not resume or reset without an initialized creation', () => {
    const exercise = createExercise()
    const { result } = renderUseExercises()

    expect(result.current.isCurrentCreationDirty).toBe(false)
    expect(result.current.shouldResetBlankCreation).toBe(false)
    expect(result.current.shouldResetCloneCreation(exercise)).toBe(false)
    expect(result.current.shouldResumeBlankCreation).toBe(false)
    expect(result.current.shouldResumeCloneCreation(exercise)).toBe(false)
  })

  it('detects dirty blank creations', () => {
    const { result, store } = renderUseExercises()

    act(() => {
      store.dispatch(
        startCreation({
          currentExercise: createExercise({ code: '', title: '' }),
          initialExercise: createExercise({ code: '', title: '' }),
          method: CreationMethod.Blank
        })
      )
    })

    expect(result.current.isCurrentCreationDirty).toBe(false)
    expect(result.current.shouldResetBlankCreation).toBe(false)
    expect(result.current.shouldResumeBlankCreation).toBe(true)

    act(() => {
      store.dispatch(updateCreationExercise({ title: 'Custom squat' }))
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
    const { result, store } = renderUseExercises()

    act(() => {
      store.dispatch(
        startCreation({
          currentExercise: exercise,
          initialExercise: exercise,
          method: CreationMethod.Clone
        })
      )
    })

    expect(result.current.shouldResumeBlankCreation).toBe(false)
    expect(result.current.shouldResumeCloneCreation(exercise)).toBe(true)
    expect(result.current.shouldResumeCloneCreation(otherExercise)).toBe(false)
    expect(result.current.shouldResetCloneCreation(exercise)).toBe(false)

    act(() => {
      store.dispatch(updateCreationExercise({ title: 'Dirty competition squat' }))
    })

    expect(result.current.isCurrentCreationDirty).toBe(true)
    expect(result.current.shouldResetBlankCreation).toBe(false)
    expect(result.current.shouldResetCloneCreation(exercise)).toBe(true)
    expect(result.current.shouldResetCloneCreation(otherExercise)).toBe(false)
    expect(result.current.shouldResetCloneCreation(null)).toBe(false)
    expect(result.current.shouldResumeCloneCreation(null)).toBe(false)
  })
})
