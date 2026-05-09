export enum NewExercisePanel {
  Source = 'source',
  Overview = 'overview',
  Categorization = 'categorization',
  Specifications = 'specifications',
  Muscles = 'muscles',
  Instructions = 'instructions',
  Review = 'review'
}

export type ExerciseCreationSourceMode = 'blank' | 'clone'

export interface ExerciseCreationMuscle {
  muscleCode: string
  roleCode: string
  weightPercentage: number
}

export interface ExerciseCreationRelationship {
  defaultTransferCoefficient: number
  disciplineCode: string
  roleCode: string
  targetExerciseCode: string
}

export interface ExerciseCreationDraft {
  bodyweightCoefficient: number | null
  descriptionMarkdown: string
  imageUrl: string
  isUnilateral: boolean
  loadingTypeCode: string
  muscles: ExerciseCreationMuscle[]
  patterns: string[]
  publicationStatus: 'draft' | 'published'
  relationships: ExerciseCreationRelationship[]
  roleCode: string
  shortInstructionsMarkdown: string
  sourceMode: ExerciseCreationSourceMode | null
  subtitle: string
  templateExerciseCode: string | null
  title: string
  videoUrl: string
}

export interface ExerciseCreationValidation {
  codeConflictTitle: string | null
  draftErrors: string[]
  panelErrors: Record<NewExercisePanel, string[]>
  publishErrors: string[]
}
