import { type TilesContainerBreakpoint } from '../types/TilesTypes'

export const TILES_CONTAINER_BREAKPOINTS = [
  ['3xs', 16],
  ['2xs', 18],
  ['xs', 20],
  ['sm', 24],
  ['md', 28],
  ['lg', 32],
  ['xl', 36],
  ['2xl', 42],
  ['3xl', 48],
  ['4xl', 56],
  ['5xl', 64],
  ['6xl', 72],
  ['7xl', 80]
] as const satisfies readonly (readonly [TilesContainerBreakpoint, number])[]

export const TILES_GEOMETRY_PROPERTIES = ['left', 'top', 'width', 'height'] as const

export type TilesGeometryProperty = (typeof TILES_GEOMETRY_PROPERTIES)[number]

export const TILES_ROOT_BORDER_CLASS_NAMES = {
  0: 'border-0',
  1: 'border border-1',
  2: 'border-2',
  4: 'border-4',
  8: 'border-8'
} as const satisfies Record<0 | 1 | 2 | 4 | 8, string>

export const TILES_SEPARATOR_BLOCK_END_CLASS_NAMES = {
  0: 'border-b-0',
  1: 'border-b border-b-1',
  2: 'border-b-2',
  4: 'border-b-4',
  8: 'border-b-8'
} as const satisfies Record<0 | 1 | 2 | 4 | 8, string>

export const TILES_SEPARATOR_INLINE_END_CLASS_NAMES = {
  0: 'border-e-0',
  1: 'border-e border-e-1',
  2: 'border-e-2',
  4: 'border-e-4',
  8: 'border-e-8'
} as const satisfies Record<0 | 1 | 2 | 4 | 8, string>
