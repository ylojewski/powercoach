import { Button as BaseUiButton } from '@base-ui/react/button'
import { mergeProps } from '@base-ui/react/merge-props'
import { LoaderCircleIcon } from 'lucide-react'
import {
  Children,
  cloneElement,
  isValidElement,
  type ComponentPropsWithoutRef,
  type ReactElement,
  type ReactNode
} from 'react'

import { RevealAnimation, type RevealAnimationProps } from '../../animations'
import { Heading } from '../Heading'
import {
  BUTTON_DEFAULT_SIZE,
  BUTTON_DEFAULT_VARIANT,
  BUTTON_GAP_CLASS_NAMES,
  BUTTON_ICON_CLASS_NAMES,
  buttonChromeHeadingSize,
  buttonChromeVariants,
  buttonVariants,
  type ButtonChromeOptions,
  type ButtonSize,
  type ButtonVariant
} from './constants/buttonVariants'

export type ButtonRevealAnimationProps = Omit<RevealAnimationProps, 'children' | 'render'>

export {
  buttonChromeHeadingSize,
  buttonChromeVariants,
  type ButtonChromeOptions,
  type ButtonSize,
  type ButtonVariant
}

export interface ButtonProps extends BaseUiButton.Props {
  append?: ReactNode
  loading?: boolean
  prepend?: ReactNode
  revealAnimation?: boolean | ButtonRevealAnimationProps
  size?: ButtonSize
  variant?: ButtonVariant
}

export function Button({
  append,
  'aria-busy': ariaBusy,
  children,
  className,
  disabled,
  focusableWhenDisabled,
  loading = false,
  nativeButton,
  prepend,
  revealAnimation = false,
  render,
  size = BUTTON_DEFAULT_SIZE,
  variant = BUTTON_DEFAULT_VARIANT,
  ...props
}: ButtonProps): ReactElement {
  const isIconSize = size.startsWith('icon-')
  const isGhostVariant = variant === 'ghost'
  const isLinkVariant = variant === 'link'
  const isDisabled = disabled || loading
  const headingSize = buttonChromeHeadingSize(size)
  const iconClassName = isLinkVariant && !isIconSize ? undefined : BUTTON_ICON_CLASS_NAMES[size]
  const isRevealOverlaySurface = 'data-reveal-overlay-surface' in props
  const buttonNative = isRevealOverlaySurface && isLinkVariant ? false : nativeButton
  const buttonRender = isRevealOverlaySurface && isLinkVariant ? <span tabIndex={-1} /> : render
  const renderHeadingLabel = (node: ReactNode): ReactNode => (
    <Heading
      className={isDisabled ? 'text-muted-foreground transition-colors' : 'transition-colors'}
      size={headingSize}
    >
      {node}
    </Heading>
  )
  const contentClassName = mergeProps<'span'>(
    {
      className: isLinkVariant
        ? 'data-[loading=true]:opacity-0'
        : `
          inline-flex items-center justify-center
          data-[loading=true]:opacity-0
        `
    },
    {
      className: isLinkVariant ? undefined : BUTTON_GAP_CLASS_NAMES[size]
    }
  ).className
  const spinnerClassName = mergeProps<'svg'>(
    {
      className: 'absolute animate-spin'
    },
    {
      className: iconClassName
    }
  ).className
  const renderSizedIcon = (icon: ReactNode): ReactNode => {
    if (!isValidElement<{ children?: ReactNode }>(icon)) {
      return icon
    }

    if (typeof icon.type === 'string' && icon.type !== 'svg') {
      return cloneElement(
        icon,
        undefined,
        Children.map(icon.props.children, (child) => renderSizedIcon(child))
      )
    }

    return cloneElement(
      icon as ReactElement<ComponentPropsWithoutRef<'svg'>>,
      mergeProps<'svg'>(
        {
          className: iconClassName
        },
        icon.props
      )
    )
  }
  const renderedChildren = isIconSize ? (
    <span className={contentClassName} data-loading={loading ? 'true' : undefined}>
      {Children.map(children, (child) => renderSizedIcon(child))}
    </span>
  ) : (
    <span className={contentClassName} data-loading={loading ? 'true' : undefined}>
      {prepend ? <span>{renderSizedIcon(prepend)}</span> : null}
      {isLinkVariant ? <span>{children}</span> : renderHeadingLabel(children)}
      {append ? <span>{renderSizedIcon(append)}</span> : null}
    </span>
  )

  if (revealAnimation) {
    const revealAnimationProps = typeof revealAnimation === 'object' ? revealAnimation : undefined
    const revealRenderProps = {
      ...props,
      append,
      'aria-busy': ariaBusy,
      className,
      disabled,
      focusableWhenDisabled,
      loading,
      nativeButton,
      prepend,
      render,
      size,
      variant
    } satisfies ButtonProps

    return (
      <RevealAnimation {...revealAnimationProps} render={<Button {...revealRenderProps} />}>
        {children}
      </RevealAnimation>
    )
  }

  return (
    <BaseUiButton
      {...props}
      aria-busy={loading ? true : ariaBusy}
      className={(state) =>
        mergeProps<'button'>(
          {
            className: buttonVariants({ size, variant })
          },
          {
            className: state.disabled
              ? isLinkVariant
                ? 'text-muted-foreground'
                : isGhostVariant
                  ? 'text-muted-foreground'
                  : 'border-muted-foreground text-muted-foreground'
              : undefined
          },
          {
            className: typeof className === 'function' ? className(state) : className
          }
        ).className
      }
      data-loading={loading ? '' : undefined}
      disabled={isDisabled}
      focusableWhenDisabled={loading || focusableWhenDisabled}
      nativeButton={buttonNative}
      render={buttonRender}
    >
      {loading ? <LoaderCircleIcon aria-hidden="true" className={spinnerClassName} /> : null}
      {renderedChildren}
    </BaseUiButton>
  )
}
