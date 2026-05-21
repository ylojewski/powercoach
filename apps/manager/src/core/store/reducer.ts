import { combineSlices, type ThunkDispatch, type UnknownAction } from '@reduxjs/toolkit'

import { apiSlice } from '../api'
import { navigationSlice } from './navigationSlice'

export interface ModuleSlices {}

export const reducer = combineSlices(apiSlice, navigationSlice).withLazyLoadedSlices<ModuleSlices>()

export type State = ReturnType<typeof reducer>
export type Dispatch = ThunkDispatch<State, undefined, UnknownAction>
