import { type Exercise, type GetReferencesApiResponse, type Pattern } from '@/core'

import { groupExercisesByPattern, groupExercisesByPatternItem } from './groupExercisesByPattern'

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
    patternId: 2,
    publicationStatus: 'published',
    shortInstructionsMarkdown: null,
    subtitle: null,
    title: 'Competition squat',
    updatedAt: '2024-01-01T00:00:00.000Z',
    videoUrl: null,
    ...overrides
  }
}

function createPattern(overrides: Partial<Pattern> = {}): Pattern {
  return {
    code: 'squat',
    createdAt: '2024-01-01T00:00:00.000Z',
    description: '',
    id: 1,
    name: 'Squat',
    updatedAt: '2024-01-01T00:00:00.000Z',
    ...overrides
  }
}

const references = {
  disciplineMovements: [],
  disciplines: [],
  exerciseMuscles: [],
  exerciseRelationships: [],
  exerciseRoles: [],
  exercises: [
    createExercise({
      code: 'competition_squat',
      id: 1,
      title: 'Competition squat'
    }),
    createExercise({
      code: 'bench_press',
      id: 2,
      patternId: 1,
      title: 'Bench press'
    }),
    createExercise({
      code: 'back_squat',
      id: 3,
      title: 'Back squat'
    })
  ],
  loadingTypes: [],
  muscleRoles: [],
  muscles: [],
  patterns: [
    createPattern({
      code: 'squat',
      id: 2,
      name: 'Squat'
    }),
    createPattern({
      code: 'press',
      id: 1,
      name: 'Press'
    })
  ]
} satisfies GetReferencesApiResponse

describe('groupExercisesByPattern', () => {
  it('groups exercises by pattern and sorts by code by default', () => {
    const groups = groupExercisesByPattern(references)

    expect(
      groups.map(({ code, exercises }) => ({
        code,
        exercises: exercises.map(({ code }) => code)
      }))
    ).toStrictEqual([
      {
        code: 'press',
        exercises: ['bench_press']
      },
      {
        code: 'squat',
        exercises: ['back_squat', 'competition_squat']
      }
    ])
  })

  it('maps groups to combobox item groups', () => {
    expect(groupExercisesByPatternItem(references)).toStrictEqual([
      {
        code: 'press',
        items: [references.exercises[1]],
        value: 'Press'
      },
      {
        code: 'squat',
        items: [references.exercises[2], references.exercises[0]],
        value: 'Squat'
      }
    ])
  })

  it('keeps the reference order when sorting is disabled', () => {
    expect(
      groupExercisesByPattern(references, { sortKey: '' as never }).map(({ code }) => code)
    ).toStrictEqual(['squat', 'press'])
  })

  it('keeps already sorted references in order', () => {
    const [competitionSquat, benchPress, backSquat] = references.exercises
    const [squatPattern, pressPattern] = references.patterns

    if (!competitionSquat || !benchPress || !backSquat || !squatPattern || !pressPattern) {
      throw new Error('Expected reference fixtures to be complete')
    }

    expect(
      groupExercisesByPattern({
        ...references,
        exercises: [benchPress, backSquat, competitionSquat],
        patterns: [pressPattern, squatPattern]
      }).map(({ code }) => code)
    ).toStrictEqual(['press', 'squat'])
  })

  it('returns no groups without references', () => {
    expect(groupExercisesByPattern(null as unknown as GetReferencesApiResponse)).toStrictEqual([])
  })
})
