import { type ReactElement } from 'react'

import { type RevealAnimationProps } from '../../../animations'
import { type FieldSize } from '../../Input'

export type PopupSurfaceSize = FieldSize

export type PopupSurfaceItemIcon = ReactElement

export type PopupSurfaceItemIconPosition = 'start' | 'end'

export type PopupSurfaceItemContentInset = 'base' | 'start' | 'end'

export type PopupSurfaceItemRevealAnimationProps = Omit<
  RevealAnimationProps,
  'children' | 'render' | 'reveal'
>
