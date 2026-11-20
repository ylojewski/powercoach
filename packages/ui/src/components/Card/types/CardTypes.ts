import { type StripesProps } from '../../Stripes'

export type CardSize = 'xs' | 'md' | 'xl'

export type CardVisualPlacement = 'flow' | 'overlay'

export type CardVisualStripesProps = Omit<StripesProps, 'aria-hidden' | 'children' | 'render'>
