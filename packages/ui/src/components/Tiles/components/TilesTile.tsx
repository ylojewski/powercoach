import { useRender } from '@base-ui/react/use-render'
import { type ReactElement } from 'react'

import { TilesSurface } from './TilesSurface'
import { type TilesArea, type TilesTheme, type TilesTileStripesProps } from '../types/TilesTypes'

export type TilesTileProps<Area extends TilesArea = TilesArea> = useRender.ComponentProps<
  'div',
  Record<string, never>
> & {
  area: Area
  stripesProps?: boolean | TilesTileStripesProps
  theme?: TilesTheme
}

export function TilesTile<Area extends TilesArea = TilesArea>(
  props: TilesTileProps<Area>
): ReactElement {
  return <TilesSurface {...props} />
}
