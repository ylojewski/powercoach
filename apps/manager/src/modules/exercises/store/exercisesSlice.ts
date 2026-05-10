import { createSelector, createSlice, type PayloadAction, type WithSlice } from '@reduxjs/toolkit'

import { reducer } from '@/core'
import { type Exercise } from '@/test/fixtures/references.types'

import {
  createEmptyExerciseDraft,
  createExerciseDraftFromTemplate,
  getExerciseCreationMuscleTotal,
  validateExerciseCreationDraft
} from '../exerciseCreation'
import {
  type ExerciseCreationDraft,
  type ExerciseCreationMuscle,
  type ExerciseCreationValidation,
  NewExercisePanel
} from '../types'

export interface ExercisesState {
  creation: {
    draft: ExerciseCreationDraft
    panel: NewExercisePanel
  }
}

declare module '@/core/store' {
  interface ModuleSlices extends WithSlice<typeof ExercisesSlice> {}
}

const initialState: ExercisesState = {
  creation: {
    draft: createEmptyExerciseDraft(),
    panel: NewExercisePanel.Source
  }
}

const ExercisesSlice = createSlice({
  initialState,
  name: 'Exercises',
  reducers: {
    addCreationMuscle(state, action: PayloadAction<{ muscleCode: string }>) {
      const isAlreadySelected = state.creation.draft.muscles.some(
        (muscle) => muscle.muscleCode === action.payload.muscleCode
      )

      if (isAlreadySelected) {
        return
      }

      const remainingPercentage = Math.max(0, 100 - getExerciseCreationMuscleTotal(state.creation.draft))

      if (remainingPercentage === 0) {
        return
      }

      state.creation.draft.muscles.push({
        muscleCode: action.payload.muscleCode,
        roleCode: state.creation.draft.muscles.length === 0 ? 'primary' : 'secondary',
        weightPercentage: Math.min(10, remainingPercentage)
      })
    },
    cloneCreationExercise(state, action: PayloadAction<Exercise>) {
      state.creation.draft = createExerciseDraftFromTemplate(action.payload)
      state.creation.panel = NewExercisePanel.Overview
    },
    removeCreationMuscle(state, action: PayloadAction<{ muscleCode: string }>) {
      state.creation.draft.muscles = state.creation.draft.muscles.filter(
        (muscle) => muscle.muscleCode !== action.payload.muscleCode
      )
    },
    resetCreationDraft(state) {
      state.creation.draft = createEmptyExerciseDraft()
      state.creation.panel = NewExercisePanel.Source
    },
    setCreationPanel(state, action: PayloadAction<NewExercisePanel>) {
      state.creation.panel = action.payload
    },
    startBlankCreation(state) {
      state.creation.draft = {
        ...createEmptyExerciseDraft(),
        sourceMode: 'blank'
      }
      state.creation.panel = NewExercisePanel.Overview
    },
    updateCreationDraft(state, action: PayloadAction<Partial<ExerciseCreationDraft>>) {
      state.creation.draft = {
        ...state.creation.draft,
        ...action.payload
      }
    },
    updateCreationMuscle(state, action: PayloadAction<ExerciseCreationMuscle>) {
      const currentMuscle = state.creation.draft.muscles.find(
        (muscle) => muscle.muscleCode === action.payload.muscleCode
      )

      if (!currentMuscle) {
        return
      }

      const currentTotal = getExerciseCreationMuscleTotal(state.creation.draft)
      const availableForMuscle = 100 - (currentTotal - currentMuscle.weightPercentage)

      state.creation.draft.muscles = state.creation.draft.muscles.map((muscle) =>
        muscle.muscleCode === action.payload.muscleCode
          ? {
              ...action.payload,
              weightPercentage: Math.min(
                Math.max(0, action.payload.weightPercentage),
                availableForMuscle
              )
            }
          : muscle
      )
    },
    updateCreationRelationship(
      state,
      action: PayloadAction<{
        defaultTransferCoefficient: number
        targetExerciseCode: string
      }>
    ) {
      const { defaultTransferCoefficient, targetExerciseCode } = action.payload

      if (defaultTransferCoefficient === 0) {
        state.creation.draft.relationships = state.creation.draft.relationships.filter(
          (relationship) => relationship.targetExerciseCode !== targetExerciseCode
        )
        return
      }

      const existingRelationship = state.creation.draft.relationships.find(
        (relationship) => relationship.targetExerciseCode === targetExerciseCode
      )

      if (existingRelationship) {
        existingRelationship.defaultTransferCoefficient = defaultTransferCoefficient
        existingRelationship.roleCode = state.creation.draft.roleCode
        return
      }

      state.creation.draft.relationships.push({
        defaultTransferCoefficient,
        disciplineCode: 'powerlifting',
        roleCode: state.creation.draft.roleCode,
        targetExerciseCode
      })
    }
  }
})

export const {
  addCreationMuscle,
  cloneCreationExercise,
  removeCreationMuscle,
  resetCreationDraft,
  setCreationPanel,
  startBlankCreation,
  updateCreationDraft,
  updateCreationMuscle,
  updateCreationRelationship
} = ExercisesSlice.actions
export const { reducer: ExercisesReducer } = ExercisesSlice

reducer.inject(ExercisesSlice)

export function selectExercisesCreation(state: {
  Exercises?: ExercisesState
}): ExercisesState['creation'] | null {
  return state.Exercises?.creation ?? null
}

export const selectExerciseCreationDraft = createSelector(
  selectExercisesCreation,
  (creation): ExerciseCreationDraft => creation?.draft ?? initialState.creation.draft
)

export const selectExerciseCreationValidation = createSelector(
  selectExerciseCreationDraft,
  (draft): ExerciseCreationValidation => validateExerciseCreationDraft(draft)
)
