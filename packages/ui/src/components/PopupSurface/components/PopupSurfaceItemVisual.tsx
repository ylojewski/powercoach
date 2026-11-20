import { type ComponentPropsWithRef, type ReactElement, type ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'

import { PopupSurfaceItemIcon } from './PopupSurfaceItemIcon'
import { type RevealAnimationContentMode } from '../../../animations'
import { Text } from '../../Text'
import { popupSurfaceItemVariants } from '../constants/popupSurfaceVariants'
import {
  type PopupSurfaceItemContentInset,
  type PopupSurfaceItemIcon as PopupSurfaceItemIconType,
  type PopupSurfaceItemIconPosition,
  type PopupSurfaceSize
} from '../types/PopupSurfaceTypes'

export interface PopupSurfaceItemVisualProps extends ComponentPropsWithRef<'div'> {
  children?: ReactNode
  consumerClassName?: string
  contentInset: PopupSurfaceItemContentInset
  contentMode: RevealAnimationContentMode
  icon?: PopupSurfaceItemIconType
  iconPosition: PopupSurfaceItemIconPosition
  size: PopupSurfaceSize
}

export function PopupSurfaceItemVisual({
  children,
  className,
  consumerClassName,
  contentInset,
  contentMode,
  icon,
  iconPosition,
  size,
  ...props
}: PopupSurfaceItemVisualProps): ReactElement {
  return (
    <Text
      {...props}
      className={twMerge(
        popupSurfaceItemVariants({ contentInset, size }),
        className,
        consumerClassName
      )}
      render={contentMode === 'phrasing' ? <span /> : <div />}
      size={size === 'xl' ? 'md' : size === 'md' ? 'sm' : 'xs'}
    >
      {icon === undefined ? null : (
        <PopupSurfaceItemIcon icon={icon} position={iconPosition} size={size} />
      )}
      {children}
    </Text>
  )
}
