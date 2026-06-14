import { createSlice, type PayloadAction, type WithSlice } from '@reduxjs/toolkit'

import {
  type Discipline,
  type Exercise,
  type ExerciseRelationship,
  reducer,
  type State as RootState
} from '@/core'

declare module '@/core' {
  interface ModuleSlices extends WithSlice<typeof exercisesSlice> {}
}

export enum Step {
  Categorization = 'categorization',
  Instructions = 'instructions',
  Overview = 'overview',
  Muscles = 'muscles',
  Review = 'review',
  Start = 'start',
  Tracking = 'tracking'
}

export enum CreationMethod {
  Blank = 'blank',
  Clone = 'clone'
}

export interface CreationExerciseRelationship {
  defaultTransferCoefficient?: ExerciseRelationship['defaultTransferCoefficient']
  disciplineCode: Discipline['code']
  roleId?: ExerciseRelationship['roleId']
  targetDisciplineMovementId?: ExerciseRelationship['targetDisciplineMovementId']
}

export interface Creation {
  exercise: Exercise
  exerciseRelationships: CreationExerciseRelationship[]
  method: CreationMethod
}

export interface CreationState {
  current: Creation | null
  initial: Creation | null
}

export interface State {
  creation: CreationState
}

const initialState: State = {
  creation: {
    current: null,
    initial: null
  }
}
const DEFAULT_CREATION_TRANSFER_COEFFICIENT = 0

const exercisesSlice = createSlice({
  initialState,
  name: 'exercises',
  reducers: {
    startCreation(
      state,
      action: PayloadAction<{
        initialExercise: Exercise
        initialExerciseRelationships: CreationExerciseRelationship[]
        currentExercise: Exercise
        currentExerciseRelationships: CreationExerciseRelationship[]
        method: CreationMethod
      }>
    ) {
      state.creation.current = {
        exercise: { ...action.payload.currentExercise },
        exerciseRelationships: getCreationExerciseRelationshipsWithMovement(
          action.payload.currentExerciseRelationships
        ),
        method: action.payload.method
      }
      state.creation.initial = {
        exercise: { ...action.payload.initialExercise },
        exerciseRelationships: getCreationExerciseRelationshipsWithMovement(
          action.payload.initialExerciseRelationships
        ),
        method: action.payload.method
      }
    },
    updateCreationExercise(state, action: PayloadAction<Partial<Exercise>>) {
      if (state.creation.current) {
        Object.assign(state.creation.current.exercise, action.payload)
      }
    },
    upsertCreationExerciseRelationship(state, action: PayloadAction<CreationExerciseRelationship>) {
      const relationships = state.creation.current?.exerciseRelationships

      if (!relationships) {
        return
      }

      const existingRelationshipIndex = relationships.findIndex(
        (relationship) => relationship.disciplineCode === action.payload.disciplineCode
      )
      const existingRelationship = relationships[existingRelationshipIndex]
      const hasMovementUpdate = 'targetDisciplineMovementId' in action.payload
      const hasRoleUpdate = 'roleId' in action.payload

      if (hasMovementUpdate && action.payload.targetDisciplineMovementId === undefined) {
        if (existingRelationship) {
          relationships.splice(existingRelationshipIndex, 1)
        }
        return
      }

      if (!existingRelationship && action.payload.targetDisciplineMovementId === undefined) {
        return
      }

      const nextRelationship = existingRelationship ?? {
        defaultTransferCoefficient: DEFAULT_CREATION_TRANSFER_COEFFICIENT,
        disciplineCode: action.payload.disciplineCode,
        targetDisciplineMovementId: action.payload.targetDisciplineMovementId
      }

      Object.assign(nextRelationship, action.payload)

      if (hasRoleUpdate && action.payload.roleId === undefined) {
        delete nextRelationship.roleId
        nextRelationship.defaultTransferCoefficient = DEFAULT_CREATION_TRANSFER_COEFFICIENT
      }

      if (nextRelationship.targetDisciplineMovementId === undefined) {
        if (existingRelationship) {
          relationships.splice(existingRelationshipIndex, 1)
        }
        return
      }

      if (existingRelationship) {
        return
      }

      relationships.push(nextRelationship)
    }
  }
})

reducer.inject(exercisesSlice)

export const { startCreation, updateCreationExercise, upsertCreationExerciseRelationship } =
  exercisesSlice.actions

export function selectCurrentCreation(state: RootState): Creation | null {
  return state.exercises?.creation.current ?? initialState.creation.current
}

export function selectInitialCreation(state: RootState): Creation | null {
  return state.exercises?.creation.initial ?? initialState.creation.initial
}

function getCreationExerciseRelationshipsWithMovement(
  relationships: CreationExerciseRelationship[]
): CreationExerciseRelationship[] {
  return relationships.flatMap((relationship) => {
    if (relationship.targetDisciplineMovementId === undefined) {
      return []
    }

    return { ...relationship }
  })
}
