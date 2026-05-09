import { api } from '../api'
const injectedRtkApi = api.injectEndpoints({
  endpoints: (build) => ({
    getReferences: build.query<GetReferencesApiResponse, GetReferencesApiArg>({
      query: () => ({ url: `/v1/references/` })
    })
  }),
  overrideExisting: false
})
export { injectedRtkApi as referencesApi }
export type GetReferencesApiResponse = /** status 200 Default Response */ {
  disciplines: Discipline[]
  exerciseMuscles: ExerciseMuscle[]
  exercisePatterns: ExercisePattern[]
  exerciseRelationships: ExerciseRelationship[]
  exerciseRoles: ExerciseRole[]
  exercises: Exercise[]
  loadingTypes: LoadingType[]
  muscleRoles: MuscleRole[]
  muscles: Muscle[]
  patterns: Pattern[]
}
export type GetReferencesApiArg = void
export type Discipline = {
  code: string
  createdAt: string
  description: string
  id: number
  name: string
  updatedAt: string
}
export type ExerciseMuscle = {
  exerciseId: number
  muscleId: number
  muscleRoleId: number
  weightPercentage: number
}
export type ExercisePattern = {
  exerciseId: number
  patternId: number
}
export type ExerciseRelationship = {
  createdAt: string
  defaultTransferCoefficient: number
  disciplineId: number
  id: number
  roleId: number
  sourceExerciseId: number
  targetExerciseId: number
  updatedAt: string
}
export type ExerciseRole = {
  code: string
  createdAt: string
  description: string
  id: number
  name: string
  updatedAt: string
}
export type Exercise = {
  archivedAt: string | null
  bodyweightCoefficient: number | null
  code: string
  createdAt: string
  descriptionMarkdown: string | null
  id: number
  imageUrl: string | null
  isSystem: boolean
  isUnilateral: boolean
  loadingTypeId: number | null
  publicationStatus: string
  shortInstructionsMarkdown: string | null
  subtitle: string | null
  title: string
  updatedAt: string
  videoUrl: string | null
}
export type LoadingType = {
  code: string
  createdAt: string
  description: string
  id: number
  name: string
  updatedAt: string
}
export type MuscleRole = {
  code: string
  createdAt: string
  description: string
  id: number
  name: string
  updatedAt: string
}
export type Muscle = {
  chain: string | null
  code: string
  commonName: string | null
  createdAt: string
  description: string
  id: number
  name: string
  parentMuscleId: number | null
  updatedAt: string
}
export type Pattern = {
  code: string
  createdAt: string
  description: string
  id: number
  name: string
  updatedAt: string
}
export const { useGetReferencesQuery, useLazyGetReferencesQuery } = injectedRtkApi
