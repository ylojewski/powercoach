import { type Exercise } from '@/test/fixtures/references.types'

import { exerciseReferences } from './references'
import {
  type ExerciseCreationDraft,
  type ExerciseCreationMuscle,
  type ExerciseCreationRelationship,
  type ExerciseCreationValidation,
  NewExercisePanel
} from './types'

export const NEW_EXERCISE_PANELS: NewExercisePanel[] = [
  NewExercisePanel.Source,
  NewExercisePanel.Overview,
  NewExercisePanel.Categorization,
  NewExercisePanel.Specifications,
  NewExercisePanel.Muscles,
  NewExercisePanel.Instructions,
  NewExercisePanel.Review
]

export function createEmptyExerciseDraft(): ExerciseCreationDraft {
  return {
    bodyweightCoefficient: 60,
    descriptionMarkdown: '',
    imageUrl: '',
    isUnilateral: false,
    loadingTypeCode: 'external_load',
    muscles: [],
    patterns: [],
    publicationStatus: 'draft',
    relationships: [],
    roleCode: 'variant',
    shortInstructionsMarkdown: '',
    sourceMode: null,
    subtitle: '',
    templateExerciseCode: null,
    title: '',
    videoUrl: ''
  }
}

export function createExerciseDraftFromTemplate(exercise: Exercise): ExerciseCreationDraft {
  return {
    bodyweightCoefficient: exercise.bodyweightCoefficient ?? 60,
    descriptionMarkdown:
      exercise.descriptionMarkdown ??
      ['## Setup', `Start from ${exercise.title.toLowerCase()} mechanics.`, '', '## Execution', 'Adjust only what changes for this variation.'].join(
        '\n'
      ),
    imageUrl: exercise.imageUrl ?? '',
    isUnilateral: exercise.isUnilateral,
    loadingTypeCode: exercise.loadingType.code,
    muscles: exercise.muscles.map(
      (muscle): ExerciseCreationMuscle => ({
        muscleCode: muscle.muscle.code,
        roleCode: muscle.role.code,
        weightPercentage: muscle.weightPercentage
      })
    ),
    patterns: exercise.patterns.map((pattern) => pattern.code),
    publicationStatus: 'draft',
    relationships: exercise.relationships.map(
      (relationship): ExerciseCreationRelationship => ({
        defaultTransferCoefficient: relationship.defaultTransferCoefficient,
        disciplineCode: relationship.discipline.code,
        roleCode: relationship.role.code,
        targetExerciseCode: relationship.targetExercise.code
      })
    ),
    roleCode: exercise.relationships[0]?.role.code ?? 'variant',
    shortInstructionsMarkdown: exercise.shortInstructionsMarkdown ?? '',
    sourceMode: 'clone',
    subtitle: exercise.subtitle ?? '',
    templateExerciseCode: exercise.code,
    title: `${exercise.title} variant`,
    videoUrl: exercise.videoUrl ?? ''
  }
}

export function getExerciseCreationCode(draft: ExerciseCreationDraft): string {
  return slugify(draft.title)
}

export function getExerciseCreationMuscleTotal(draft: ExerciseCreationDraft): number {
  return Number(
    draft.muscles
      .reduce((total, muscle) => total + muscle.weightPercentage, 0)
      .toFixed(1)
  )
}

export function getNextExercisePanel(panel: NewExercisePanel): NewExercisePanel {
  const currentIndex = NEW_EXERCISE_PANELS.indexOf(panel)

  return NEW_EXERCISE_PANELS[Math.min(currentIndex + 1, NEW_EXERCISE_PANELS.length - 1)] ?? panel
}

export function getPreviousExercisePanel(panel: NewExercisePanel): NewExercisePanel {
  const currentIndex = NEW_EXERCISE_PANELS.indexOf(panel)

  return NEW_EXERCISE_PANELS[Math.max(currentIndex - 1, 0)] ?? panel
}

export function isBodyweightLoadingType(loadingTypeCode: string): boolean {
  return (
    loadingTypeCode === 'bodyweight' ||
    loadingTypeCode === 'bodyweight_plus_external' ||
    loadingTypeCode === 'assisted_bodyweight'
  )
}

export function slugify(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
}

export function validateExerciseCreationDraft(
  draft: ExerciseCreationDraft
): ExerciseCreationValidation {
  const panelErrors: Record<NewExercisePanel, string[]> = {
    [NewExercisePanel.Categorization]: [],
    [NewExercisePanel.Instructions]: [],
    [NewExercisePanel.Muscles]: [],
    [NewExercisePanel.Overview]: [],
    [NewExercisePanel.Review]: [],
    [NewExercisePanel.Source]: [],
    [NewExercisePanel.Specifications]: []
  }
  const generatedCode = getExerciseCreationCode(draft)
  const codeConflict =
    generatedCode.length > 0
      ? exerciseReferences.exercises.find((exercise) => exercise.code === generatedCode)
      : null

  if (!draft.sourceMode) {
    panelErrors[NewExercisePanel.Source].push(
      'Choose whether this exercise starts from scratch or from an existing exercise.'
    )
  }

  if (draft.sourceMode === 'clone' && !draft.templateExerciseCode) {
    panelErrors[NewExercisePanel.Source].push('Select the exercise to clone.')
  }

  if (!draft.title.trim()) {
    panelErrors[NewExercisePanel.Overview].push('Enter an exercise title.')
  }

  if (codeConflict) {
    panelErrors[NewExercisePanel.Overview].push(
      `The generated code already exists for ${codeConflict.title}.`
    )
  }

  if (draft.patterns.length === 0) {
    panelErrors[NewExercisePanel.Categorization].push('Select at least one movement pattern.')
  }

  if (draft.relationships.length === 0) {
    panelErrors[NewExercisePanel.Categorization].push('Set at least one transfer target.')
  }

  if (!draft.loadingTypeCode) {
    panelErrors[NewExercisePanel.Specifications].push('Choose a loading type.')
  }

  if (isBodyweightLoadingType(draft.loadingTypeCode) && !draft.bodyweightCoefficient) {
    panelErrors[NewExercisePanel.Specifications].push('Set a bodyweight coefficient above 0%.')
  }

  const muscleTotal = getExerciseCreationMuscleTotal(draft)

  if (draft.muscles.length === 0) {
    panelErrors[NewExercisePanel.Muscles].push('Add at least one muscle.')
  }

  if (draft.muscles.length > 0 && muscleTotal === 0) {
    panelErrors[NewExercisePanel.Muscles].push('Allocate muscle stimulus above 0%.')
  }

  if (muscleTotal > 100) {
    panelErrors[NewExercisePanel.Muscles].push('Muscle stimulus cannot exceed 100%.')
  }

  if (!draft.shortInstructionsMarkdown.trim()) {
    panelErrors[NewExercisePanel.Instructions].push('Add short coaching cues before publication.')
  }

  return {
    codeConflictTitle: codeConflict?.title ?? null,
    draftErrors: [
      ...panelErrors[NewExercisePanel.Source],
      ...panelErrors[NewExercisePanel.Overview],
      ...panelErrors[NewExercisePanel.Muscles].filter((error) => error.includes('exceed'))
    ],
    panelErrors,
    publishErrors: NEW_EXERCISE_PANELS.flatMap((panel) => panelErrors[panel])
  }
}
