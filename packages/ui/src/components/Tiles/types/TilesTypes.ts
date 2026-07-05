import { type StripesProps } from '../../Stripes'

export type TilesArea = string

export type TilesContainerBreakpoint =
  | '3xs'
  | '2xs'
  | 'xs'
  | 'sm'
  | 'md'
  | 'lg'
  | 'xl'
  | '2xl'
  | '3xl'
  | '4xl'
  | '5xl'
  | '6xl'
  | '7xl'

export type TilesLayoutKey = 'base' | TilesContainerBreakpoint

export type TilesMatrix<Area extends TilesArea = TilesArea> = readonly (readonly Area[])[]

export type TilesLayout<Area extends TilesArea = TilesArea> = Readonly<
  { base: TilesMatrix<Area> } & Partial<Record<TilesContainerBreakpoint, TilesMatrix<Area>>>
>

export type TilesTheme = 'inherit' | 'inverse'

export type TilesTileStripesProps = Pick<StripesProps, 'angle' | 'color' | 'gap' | 'width'>
