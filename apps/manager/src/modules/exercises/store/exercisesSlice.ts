import { createSlice, type PayloadAction, type WithSlice } from '@reduxjs/toolkit'

import { type Exercise, reducer, type State } from '@/core'

import { ExercisePanel } from '../types'
import { createBlankExercise } from '../utils'

declare module '@/core' {
  interface ModuleSlices extends WithSlice<typeof exercisesSlice> {}
}

export interface ExercisesState {
  creating: {
    exercise: Exercise
    panel: ExercisePanel
  }
}

const initialState: ExercisesState = {
  creating: {
    exercise: createBlankExercise(),
    panel: ExercisePanel.Source
  }
}

const exercisesSlice = createSlice({
  initialState,
  name: 'exercises',
  reducers: {
    setCreatingPanel(state, action: PayloadAction<ExercisePanel>) {
      state.creating.panel = action.payload
    }
  }
})

export const { setCreatingPanel } = exercisesSlice.actions

reducer.inject(exercisesSlice)

export function selectCreatingPanel(state: State): ExercisePanel {
  return state.exercises?.creating.panel ?? ExercisePanel.Source
}
