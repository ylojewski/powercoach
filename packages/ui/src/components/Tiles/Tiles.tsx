import { TilesRoot } from './components/TilesRoot'
import { TilesScrollableTile } from './components/TilesScrollableTile'
import { TilesTile } from './components/TilesTile'

export * from './components/TilesRoot'
export * from './components/TilesScrollableTile'
export * from './components/TilesTile'
export * from './types/TilesTypes'

export interface TilesNamespace {
  Root: typeof TilesRoot
  ScrollableTile: typeof TilesScrollableTile
  Tile: typeof TilesTile
}

export const Tiles: TilesNamespace = {
  Root: TilesRoot,
  ScrollableTile: TilesScrollableTile,
  Tile: TilesTile
}
