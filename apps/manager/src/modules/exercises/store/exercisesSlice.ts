import { createSlice, type PayloadAction, type WithSlice } from '@reduxjs/toolkit'

import { type Exercise, reducer, type State as RootState } from '@/core'

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

export interface Creation {
  exercise: Exercise
  method: CreationMethod
}

export interface CreationState {
  current: Creation | null
  initial: Creation | null
  resumeStep: Step | null
}

export interface State {
  creation: CreationState
}

const initialState: State = {
  creation: {
    current: null,
    initial: null,
    resumeStep: null
  }
}

const exercisesSlice = createSlice({
  initialState,
  name: 'exercises',
  reducers: {
    setCreationExerciseTitle(state, action: PayloadAction<string>) {
      if (state.creation.current) {
        state.creation.current.exercise.title = action.payload
      }
    },
    setCreationResumeStep(state, action: PayloadAction<Step>) {
      state.creation.resumeStep = action.payload
    },
    startCreation(state, action: PayloadAction<Creation>) {
      state.creation.current = {
        exercise: { ...action.payload.exercise },
        method: action.payload.method
      }
      state.creation.initial = {
        exercise: { ...action.payload.exercise },
        method: action.payload.method
      }
      state.creation.resumeStep = Step.Overview
    }
  }
})

reducer.inject(exercisesSlice)

export const { setCreationExerciseTitle, setCreationResumeStep, startCreation } =
  exercisesSlice.actions

export function selectCurrentCreation(state: RootState): Creation | null {
  return state.exercises?.creation.current ?? initialState.creation.current
}

export function selectInitialCreation(state: RootState): Creation | null {
  return state.exercises?.creation.initial ?? initialState.creation.initial
}

export function selectCreationResumeStep(state: RootState): Step | null {
  return state.exercises?.creation.resumeStep ?? initialState.creation.resumeStep
}
