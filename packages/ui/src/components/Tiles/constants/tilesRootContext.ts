import { createContext } from 'react'

import { type TilesGeometryProperty } from './tilesConstants'
import { type TilesLayoutKey } from '../types/TilesTypes'

export interface TilesGeometry {
  height: number
  left: number
  separatorBlockEnd: boolean
  separatorInlineEnd: boolean
  top: number
  width: number
}

export interface TilesLayoutState {
  geometries: ReadonlyMap<string, TilesGeometry>
  layoutKey: TilesLayoutKey
  movingProperties: ReadonlyMap<string, ReadonlySet<TilesGeometryProperty>>
  targetVersions: ReadonlyMap<string, ReadonlyMap<TilesGeometryProperty, number>>
  transitionsSuppressed: boolean
}

export interface TilesRootContextValue {
  baseGeometries: ReadonlyMap<string, TilesGeometry>
  completeGeometryTransition: (area: string, property: TilesGeometryProperty) => void
  layoutState: TilesLayoutState
  separatorColor: string
  separatorBlockEndClassName: string | undefined
  separatorInlineEndClassName: string | undefined
}

export const tilesRootContext = createContext<TilesRootContextValue | null>(null)
