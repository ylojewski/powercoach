import { type ReactElement } from 'react'

import { TilesSurface } from './TilesSurface'
import { type TilesTileProps } from './TilesTile'
import { ScrollArea } from '../../ScrollArea'
import { type TilesArea } from '../types/TilesTypes'

export type TilesScrollableTileProps<Area extends TilesArea = TilesArea> = TilesTileProps<Area>

export function TilesScrollableTile<Area extends TilesArea = TilesArea>({
  area,
  children,
  render,
  role,
  stripesProps,
  theme = 'inherit',
  ...props
}: TilesScrollableTileProps<Area>): ReactElement {
  return (
    <ScrollArea
      {...props}
      role={role}
      render={(scrollAreaProps, scrollAreaState) => (
        <TilesSurface
          {...scrollAreaProps}
          area={area}
          data-has-overflow-x={scrollAreaState.hasOverflowX ? '' : undefined}
          data-has-overflow-y={scrollAreaState.hasOverflowY ? '' : undefined}
          data-overflow-x-end={scrollAreaState.overflowXEnd ? '' : undefined}
          data-overflow-x-start={scrollAreaState.overflowXStart ? '' : undefined}
          data-overflow-y-end={scrollAreaState.overflowYEnd ? '' : undefined}
          data-overflow-y-start={scrollAreaState.overflowYStart ? '' : undefined}
          data-scrolling={scrollAreaState.scrolling ? '' : undefined}
          render={render}
          role={role}
          scrollable
          stripesProps={stripesProps}
          theme={theme}
        />
      )}
    >
      {children}
    </ScrollArea>
  )
}
