export type MuscleChain = 'anterior' | 'posterior'
export type ExerciseRoleCode = 'accessory' | 'competition' | 'drill' | 'variant'
export type LoadingTypeCode =
  | 'assisted_bodyweight'
  | 'bodyweight'
  | 'bodyweight_plus_external'
  | 'external_load'
  | 'no_load'
export type MuscleRoleCode = 'primary' | 'secondary' | 'stabilizer'
export type PatternCode = 'carry' | 'core' | 'cyclical' | 'hinge' | 'pull' | 'push' | 'squat'
export type PublicationStatus = 'draft' | 'published'

interface Timestamps {
  createdAt: string
  updatedAt: string
}

export interface Discipline extends Timestamps {
  code: string
  description: string
  id: number
  name: string
}

export interface ExerciseRole extends Timestamps {
  code: ExerciseRoleCode
  description: string
  id: number
  name: string
}

export interface LoadingType extends Timestamps {
  code: LoadingTypeCode
  description: string
  id: number
  name: string
}

export interface MuscleRole extends Timestamps {
  code: MuscleRoleCode
  description: string
  id: number
  name: string
}

export interface Pattern extends Timestamps {
  code: PatternCode
  description: string
  id: number
  name: string
}

export interface Muscle extends Timestamps {
  chain: MuscleChain | null
  code: string
  commonName: string
  description: string
  id: number
  name: string
  parentMuscleId: number | null
}

export interface ExerciseMuscle {
  muscle: Muscle
  role: MuscleRole
  weightPercentage: number
}

export interface ExerciseRelationship extends Timestamps {
  defaultTransferCoefficient: number
  discipline: Pick<Discipline, 'code' | 'id' | 'name'>
  id: number
  role: ExerciseRole
  targetExercise: Pick<Exercise, 'code' | 'id' | 'title'>
}

export interface Exercise extends Timestamps {
  archivedAt: string | null
  bodyweightCoefficient: number | null
  code: string
  descriptionMarkdown: string | null
  id: number
  imageUrl: string | null
  isSystem: boolean
  isUnilateral: boolean
  loadingType: LoadingType
  muscles: ExerciseMuscle[]
  patterns: Pattern[]
  publicationStatus: PublicationStatus
  relationships: ExerciseRelationship[]
  shortInstructionsMarkdown: string | null
  subtitle: string | null
  title: string
  videoUrl: string | null
}

export interface ReferencesResponse {
  disciplines: Discipline[]
  exerciseRoles: ExerciseRole[]
  exercises: Exercise[]
  loadingTypes: LoadingType[]
  muscleRoles: MuscleRole[]
  muscles: Muscle[]
  patterns: Pattern[]
}
