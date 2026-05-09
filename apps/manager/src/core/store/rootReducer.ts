import { combineSlices, type ThunkDispatch, type UnknownAction } from '@reduxjs/toolkit'

import { api } from '@/src/api'

import { routerSlice } from './routerSlice'

export interface ModuleSlices {}

export const rootReducer = combineSlices(api, routerSlice).withLazyLoadedSlices<ModuleSlices>()

export type State = ReturnType<typeof rootReducer>
export type Dispatch = ThunkDispatch<State, undefined, UnknownAction>
