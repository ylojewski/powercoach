import { apiSlice as api } from '../apiSlice'
const injectedRtkApi = api.injectEndpoints({
  endpoints: (build) => ({
    getExerciseCode: build.query<GetExerciseCodeApiResponse, GetExerciseCodeApiArg>({
      query: (queryArg) => ({
        url: `/v1/exercises/code`,
        params: {
          title: queryArg.title
        }
      })
    }),
    getReferences: build.query<GetReferencesApiResponse, GetReferencesApiArg>({
      query: () => ({ url: `/v1/references/` })
    }),
    getCurrentRoster: build.query<GetCurrentRosterApiResponse, GetCurrentRosterApiArg>({
      query: (queryArg) => ({
        url: `/v1/roster/me`,
        params: {
          organizationId: queryArg.organizationId
        }
      })
    }),
    getCurrentSettings: build.query<GetCurrentSettingsApiResponse, GetCurrentSettingsApiArg>({
      query: () => ({ url: `/v1/settings/me` })
    }),
    getHealthStatus: build.query<GetHealthStatusApiResponse, GetHealthStatusApiArg>({
      query: () => ({ url: `/v1/health/` })
    })
  }),
  overrideExisting: false
})
export { injectedRtkApi as api }
export type GetExerciseCodeApiResponse = /** status 200 Default Response */ {
  code: string
  exercise: Exercise | null
}
export type GetExerciseCodeApiArg = {
  title: string
}
export type GetReferencesApiResponse = /** status 200 Default Response */ {
  disciplineMovements: DisciplineMovement[]
  disciplines: Discipline[]
  exerciseMuscles: ExerciseMuscle[]
  exerciseRelationships: ExerciseRelationship[]
  exerciseRoles: ExerciseRole[]
  exercises: Exercise[]
  loadingTypes: LoadingType[]
  muscleRoles: MuscleRole[]
  muscles: Muscle[]
  patterns: Pattern[]
}
export type GetReferencesApiArg = void
export type GetCurrentRosterApiResponse = /** status 200 Default Response */ {
  athletes: Athlete[]
  coach: Coach
  organizations: Organization[]
}
export type GetCurrentRosterApiArg = {
  organizationId?: string
}
export type GetCurrentSettingsApiResponse = /** status 200 Default Response */ {
  defaultOrganizationId: number
}
export type GetCurrentSettingsApiArg = void
export type GetHealthStatusApiResponse = /** status 200 Default Response */ {
  database: boolean
  live: boolean
  ready: boolean
  uptime: number
}
export type GetHealthStatusApiArg = void
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
  patternId: number | null
  publicationStatus: string
  shortInstructionsMarkdown: string | null
  subtitle: string | null
  title: string
  updatedAt: string
  videoUrl: string | null
}
export type DisciplineMovement = {
  code: string
  description: string
  disciplineId: number
  id: number
  name: string
  sortOrder: number
}
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
export type ExerciseRelationship = {
  createdAt: string
  defaultTransferCoefficient: number
  disciplineId: number
  id: number
  roleId: number
  sourceExerciseId: number
  targetDisciplineMovementId: number
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
export type Athlete = {
  email: string
  firstName: string
  id: number
  lastName: string
  organizationId: number
}
export type Coach = {
  email: string
  firstName: string
  id: number
  lastName: string
}
export type Organization = {
  id: number
  name: string
}
export const {
  useGetExerciseCodeQuery,
  useLazyGetExerciseCodeQuery,
  useGetReferencesQuery,
  useLazyGetReferencesQuery,
  useGetCurrentRosterQuery,
  useLazyGetCurrentRosterQuery,
  useGetCurrentSettingsQuery,
  useLazyGetCurrentSettingsQuery,
  useGetHealthStatusQuery,
  useLazyGetHealthStatusQuery
} = injectedRtkApi
