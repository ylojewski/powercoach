import { renderHook } from '@testing-library/react'

import { type Exercise } from '@/core'

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

describe('useExercises', () => {
  it('clones an exercise title', () => {
    const exercise = createExercise()
    const { result } = renderHook(() => useExercises())

    expect(result.current.cloneExercise(exercise)).toStrictEqual({
      ...exercise,
      code: '',
      title: 'Competition squat copy'
    })
  })
})
