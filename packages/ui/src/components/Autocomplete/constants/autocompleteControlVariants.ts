import { twMerge } from 'tailwind-merge'

import { buttonChromeVariants } from '../../Button'
import { type AutocompleteSize } from '../types/AutocompleteTypes'

export interface AutocompleteControlVariantOptions {
  size?: AutocompleteSize
}

export function autocompleteControlVariants({
  size = 'xl'
}: AutocompleteControlVariantOptions = {}): string {
  return twMerge(
    buttonChromeVariants({
      size: size === 'xl' ? 'icon-md' : size === 'md' ? 'icon-sm' : 'icon-xs',
      variant: 'ghost'
    }),
    'shrink-0',
    size === 'xs' ? 'size-6 [&_svg]:size-3' : undefined
  )
}
