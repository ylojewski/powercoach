import { type ButtonProps } from '../../Button'
import { type HeadingProps } from '../../Heading'
import { type TextProps } from '../../Text'
import { type CardSize } from '../types/CardTypes'

export const CARD_SIZE_MAPPINGS = {
  button: {
    md: 'md',
    xl: 'lg',
    xs: 'xs'
  },
  description: {
    md: 'sm',
    xl: 'md',
    xs: 'xs'
  },
  title: {
    md: 'lg',
    xl: 'xl',
    xs: 'sm'
  }
} as const satisfies {
  button: Record<CardSize, NonNullable<ButtonProps['size']>>
  description: Record<CardSize, NonNullable<TextProps['size']>>
  title: Record<CardSize, NonNullable<HeadingProps['size']>>
}
