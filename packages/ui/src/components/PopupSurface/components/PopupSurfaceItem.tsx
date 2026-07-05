import { mergeProps } from '@base-ui/react/merge-props'
import { useRender } from '@base-ui/react/use-render'
import {
  cloneElement,
  isValidElement,
  useRef,
  useState,
  type ComponentPropsWithRef,
  type CSSProperties,
  type ReactElement,
  type Ref
} from 'react'
import { twMerge } from 'tailwind-merge'

import { PopupSurfaceItemIcon as PopupSurfaceItemIconSlot } from './PopupSurfaceItemIcon'
import { PopupSurfaceItemVisual } from './PopupSurfaceItemVisual'
import { RevealAnimation } from '../../../animations'
import { Text, type TextProps } from '../../Text'
import { popupSurfaceItemVariants } from '../constants/popupSurfaceVariants'
import {
  type PopupSurfaceItemContentInset,
  type PopupSurfaceItemIcon,
  type PopupSurfaceItemIconPosition,
  type PopupSurfaceItemRevealAnimationProps,
  type PopupSurfaceSize
} from '../types/PopupSurfaceTypes'

export interface PopupSurfaceItemState {
  contentInset: PopupSurfaceItemContentInset
  iconPosition: PopupSurfaceItemIconPosition
  revealed: boolean
  size: PopupSurfaceSize
}

type PopupSurfaceItemBaseProps = useRender.ComponentProps<
  'div',
  PopupSurfaceItemState,
  ComponentPropsWithRef<'div'>
>

export type PopupSurfaceItemProps = Omit<
  PopupSurfaceItemBaseProps,
  'className' | 'ref' | 'style'
> & {
  className?: string | ((state: PopupSurfaceItemState) => string | undefined)
  contentInset?: PopupSurfaceItemContentInset
  icon?: PopupSurfaceItemIcon
  iconPosition?: PopupSurfaceItemIconPosition
  reveal?: boolean
  revealAnimationProps?: boolean | PopupSurfaceItemRevealAnimationProps
  ref?: Ref<HTMLElement>
  size: PopupSurfaceSize
  style?: CSSProperties | ((state: PopupSurfaceItemState) => CSSProperties | undefined)
}

export function PopupSurfaceItem({
  children,
  className,
  contentInset,
  icon,
  iconPosition = 'start',
  render,
  reveal,
  revealAnimationProps = true,
  size,
  style,
  ...props
}: PopupSurfaceItemProps): ReactElement | null {
  const [focused, setFocused] = useState(false)
  const [hovered, setHovered] = useState(false)
  const pointerFocusPending = useRef(false)
  const resolvedContentInset = contentInset ?? (icon === undefined ? 'base' : iconPosition)
  const revealed = reveal ?? (focused || hovered)
  const state = {
    contentInset: resolvedContentInset,
    iconPosition,
    revealed,
    size
  }
  const renderElement = isValidElement<{ className?: string; style?: CSSProperties }>(render)
    ? render
    : undefined
  const consumerClassName = typeof className === 'function' ? className(state) : className
  const consumerStyle = typeof style === 'function' ? style(state) : style
  const contentMode =
    typeof revealAnimationProps === 'object' ? revealAnimationProps.contentMode : undefined
  const visual = (
    <PopupSurfaceItemVisual
      consumerClassName={consumerClassName}
      contentInset={resolvedContentInset}
      contentMode={contentMode ?? 'flow'}
      icon={icon}
      iconPosition={iconPosition}
      size={size}
    />
  )
  const ownerClassName = twMerge(
    `relative z-10 outline-none [&>[data-motion=reveal]]:grid [&>[data-motion=reveal]]:w-full`,
    renderElement?.props.className,
    consumerClassName
  )
  const ownerProps = mergeProps<'div'>(
    {
      className: ownerClassName,
      'data-content-inset': resolvedContentInset,
      'data-icon-position': icon === undefined ? undefined : iconPosition,
      'data-popup-surface-item': '',
      'data-revealed': revealed ? '' : undefined,
      'data-size': size,
      onBlur: () => {
        pointerFocusPending.current = false
        setFocused(false)
      },
      onFocus: () => {
        const isPointerFocus = pointerFocusPending.current

        pointerFocusPending.current = false
        setFocused(!isPointerFocus)
      },
      onMouseEnter: () => setHovered(true),
      onMouseLeave: () => setHovered(false),
      onPointerDown: () => {
        pointerFocusPending.current = true
        setFocused(false)
      },
      style: {
        ...renderElement?.props.style,
        ...consumerStyle
      }
    } as ComponentPropsWithRef<'div'>,
    props as unknown as ComponentPropsWithRef<'div'>
  )
  const resolvedRender = renderElement
    ? cloneElement(renderElement, { className: undefined, style: undefined })
    : render
  const animatedElement = useRender({
    defaultTagName: 'div',
    props: mergeProps<'div'>(ownerProps, {
      children: (
        <RevealAnimation
          scale={1}
          {...(typeof revealAnimationProps === 'object' ? revealAnimationProps : undefined)}
          render={visual}
          reveal={revealed}
        >
          {children}
        </RevealAnimation>
      )
    }),
    render: resolvedRender,
    state,
    stateAttributesMapping: {
      contentInset: (value) => ({ 'data-content-inset': value }),
      iconPosition: (value) => (icon === undefined ? null : { 'data-icon-position': value }),
      revealed: (value) => (value ? { 'data-revealed': '' } : null),
      size: (value) => ({ 'data-size': value })
    }
  })

  if (revealAnimationProps === false) {
    const immediateRender =
      typeof resolvedRender === 'function'
        ? (elementProps: ComponentPropsWithRef<'span'>) =>
            resolvedRender(elementProps as unknown as ComponentPropsWithRef<'div'>, state)
        : resolvedRender

    return (
      <Text
        {...(ownerProps as TextProps)}
        className={twMerge(
          popupSurfaceItemVariants({ contentInset: resolvedContentInset, size }),
          'bg-background text-foreground data-revealed:bg-foreground data-revealed:text-background',
          ownerClassName
        )}
        render={immediateRender as TextProps['render']}
        size={size === 'xl' ? 'md' : size === 'md' ? 'sm' : 'xs'}
      >
        {icon === undefined ? null : (
          <PopupSurfaceItemIconSlot icon={icon} position={iconPosition} size={size} />
        )}
        {children}
      </Text>
    )
  }

  return animatedElement
}
